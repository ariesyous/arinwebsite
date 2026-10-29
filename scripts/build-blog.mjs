import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { posts } from "../content/blog/posts.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const site = resolve(root, "site");
const base = "https://arinhandyman.com/";
const brand = "Arin Handyman and Contracting";
const socialImage = `${base}assets/social-preview-v4.jpg`;
const socialImageAlt =
  "Arin Handyman and Contracting — Home repairs and renovations across Halton and the Greater Toronto Area.";
const check = process.argv.includes("--check");
const homePath = resolve(site, "index.html");
const home = readFileSync(homePath, "utf8");
const start = "<!-- BLOG:START -->";
const end = "<!-- BLOG:END -->";
assert(
  home.includes(start) && home.includes(end),
  "Homepage blog markers are missing",
);
const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const plain = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
const minutes = (post) =>
  Math.max(1, Math.ceil(plain(post.body).split(/\s+/).length / 200));
const dateLabel = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
const validDate = (date) =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) &&
  !Number.isNaN(Date.parse(date)) &&
  new Date(date).toISOString().slice(0, 10) === date;
const seen = new Set();
for (const post of posts) {
  assert(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug),
    `Invalid slug: ${post.slug}`,
  );
  assert(!seen.has(post.slug), `Duplicate slug: ${post.slug}`);
  seen.add(post.slug);
  for (const field of ["title", "category", "excerpt", "imageAlt", "body"])
    assert(
      typeof post[field] === "string" && post[field].trim(),
      `${post.slug}: missing ${field}`,
    );
  for (const field of ["published", "updated", "checked"])
    assert(validDate(post[field]), `${post.slug}: invalid ${field} date`);
  assert(
    post.updated >= post.published && post.checked <= post.updated,
    `${post.slug}: inconsistent review dates`,
  );
  assert(
    /^[a-z0-9-]+\.(webp|jpg|png)$/.test(post.image),
    `${post.slug}: use a local image filename`,
  );
  assert(
    existsSync(resolve(site, "assets", post.image)),
    `${post.slug}: missing image ${post.image}`,
  );
  assert(
    post.sources.length >= 2,
    `${post.slug}: provide at least two researched sources`,
  );
  assert(
    !/<(?:script|iframe|form|h1)\b/i.test(post.body),
    `${post.slug}: body must contain article content only`,
  );
  assert(
    /<h2>/.test(post.body),
    `${post.slug}: use descriptive h2 section headings`,
  );
  const citations = [...post.body.matchAll(/href="#source-(\d+)"/g)].map(
    (match) => Number(match[1]),
  );
  assert(
    citations.every((number) => number >= 1 && number <= post.sources.length),
    `${post.slug}: invalid citation`,
  );
  post.sources.forEach((source, index) => {
    assert(
      source.title &&
        source.publisher &&
        new URL(source.url).protocol === "https:",
      `${post.slug}: invalid source ${index + 1}`,
    );
    assert(
      citations.includes(index + 1),
      `${post.slug}: source ${index + 1} is listed but never cited`,
    );
  });
}
const ordered = [...posts].sort((a, b) =>
  b.published.localeCompare(a.published),
);
const header = home.match(/<div class="utility-bar">[\s\S]*?<\/header>/)?.[0];
const footer = home.match(
  /<footer class="site-footer">[\s\S]*?<\/footer>/,
)?.[0];
const icons = home.match(
  /<svg\b[^>]*class="icon-definitions"[^>]*>[\s\S]*?<\/svg>/,
)?.[0];
const stylesheet = home.match(/href="(styles\.css[^\"]*)"/)?.[1];
const script = home.match(/src="(script\.js[^\"]*)"/)?.[1];
const analytics = home.match(/src="(analytics\.js[^\"]*)"/)?.[1];
assert(
  header && footer && icons && stylesheet && script && analytics,
  "Could not find shared homepage layout",
);
const arrow =
  '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-diagonal"/></svg>';
function sharedLinks(markup, prefix, current = false) {
  return markup.replace(
    /(<a\b[^>]*\bhref=")([^"]+)(")/g,
    (match, before, href, after) => {
      const rewritten = /^(?:https?:|mailto:|tel:)/.test(href) || href === "#privacy-details"
        ? href
        : /class="back-top"/.test(before)
        ? "#main"
        : href.startsWith("#")
          ? `${prefix}index.html${href}`
          : `${prefix}${href}`;
      return `${before}${rewritten}${after}${current && href === "blog/" ? ' aria-current="page"' : ""}`;
    },
  );
}
function card(post, prefix) {
  return `<a class="blog-card" href="${prefix}blog/${post.slug}/">
  <div class="blog-card-image"><img src="${prefix}assets/${esc(post.image)}" alt="${esc(post.imageAlt)}" width="1536" height="1024" loading="lazy"></div>
  <div class="blog-card-copy"><p class="blog-category">${esc(post.category)} <span>· ${minutes(post)} min read</span></p><h3>${esc(post.title)}</h3><p>${esc(post.excerpt)}</p><span class="blog-read">Read the guide ${arrow}</span></div>
</a>`;
}
function layout({ title, description, canonical, prefix, main, post, schema }) {
  return `<!doctype html>
<!-- Generated by scripts/build-blog.mjs. Edit content/blog/posts.mjs, not this file. -->
<html lang="en-CA" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f4ed">
  <title>${esc(title)} | ${brand}</title>
  <meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}">
  <link rel="sitemap" type="application/xml" href="${prefix}sitemap.xml"><link rel="describedby" type="text/plain" href="${prefix}llms.txt">
  <meta property="og:type" content="${post ? "article" : "website"}"><meta property="og:locale" content="en_CA"><meta property="og:site_name" content="${brand}">
  <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}"><meta property="og:image:secure_url" content="${socialImage}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(socialImageAlt)}">
${post ? `  <meta property="article:published_time" content="${post.published}"><meta property="article:modified_time" content="${post.updated}">` : ""}
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${socialImage}"><meta name="twitter:image:alt" content="${esc(socialImageAlt)}">
  <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${prefix}${stylesheet}"><link rel="stylesheet" href="${prefix}blog/blog.css?v=3"><script src="${prefix}${script}" defer></script>
  <script src="${prefix}${analytics}" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body class="blog-page"><a class="skip-link" href="#main">Skip to content</a>
${icons}
${sharedLinks(header, prefix, true)}
<main id="main">${main}</main>
${sharedLinks(footer, prefix)}
</body></html>
`;
}
function article(post) {
  const prefix = "../../";
  const canonical = `${base}blog/${post.slug}/`;
  const sources = post.sources
    .map(
      (source, index) =>
        `<li id="source-${index + 1}"><span>${esc(source.publisher)}</span><a href="${esc(source.url)}">${esc(source.title)}</a></li>`,
    )
    .join("\n");
  return layout({
    title: post.title,
    description: post.excerpt,
    canonical,
    prefix,
    post,
    schema: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.published,
      dateModified: post.updated,
      mainEntityOfPage: canonical,
      image: `${base}assets/${post.image}`,
      author: { "@type": "Organization", name: brand },
      publisher: { "@type": "Organization", name: brand, url: base },
      citation: post.sources.map((source) => source.url),
    },
    main: `<article class="article-shell container">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${prefix}index.html">Home</a><span aria-hidden="true">/</span><a href="../">Home notes</a></nav>
  <header class="article-heading"><p class="eyebrow">${esc(post.category)} <span>· ${minutes(post)} MIN READ</span></p><h1>${esc(post.title)}</h1><p class="article-lede">${esc(post.excerpt)}</p><p class="article-dates">Arin home notes <span>·</span> Published <time datetime="${post.published}">${dateLabel(post.published)}</time>${post.updated !== post.published ? ` <span>·</span> Updated <time datetime="${post.updated}">${dateLabel(post.updated)}</time>` : ""}</p></header>
  <figure class="article-image"><img src="${prefix}assets/${esc(post.image)}" alt="${esc(post.imageAlt)}" width="1536" height="1024"></figure>
  <div class="article-reading"><div class="article-body">${post.body}</div>
  <section class="article-sources" aria-labelledby="sources-title"><h2 id="sources-title">Sources &amp; further reading</h2><p>Sources checked <time datetime="${post.checked}">${dateLabel(post.checked)}</time>. Manufacturer references explain their own products and systems; inclusion is not an endorsement.</p><ol>${sources}</ol></section>
  <div class="article-next-step"><h2>Have a similar job?</h2><p>Email a description of the job and your city, including what you’ve noticed so far.</p><a class="button button-dark" href="${prefix}index.html#contact">Request an estimate ${arrow}</a></div>
  <nav class="article-back" aria-label="More articles"><a class="text-link" href="../">← Browse all home notes</a></nav>
  </div></article>`,
  });
}

const homepageSection = `<section class="section container home-blog" id="blog" aria-labelledby="blog-title">
  <div class="section-heading"><h2 id="blog-title">Home notes</h2><div class="blog-heading-copy"><p>Practical guides for planning repairs and improvements, with sources you can check.</p><a class="text-link" href="blog/">Browse all home notes ${arrow}</a></div></div>
  <div class="blog-grid home-blog-grid">${ordered
    .slice(0, 3)
    .map((post) => card(post, ""))
    .join("\n")}</div>
</section>`;
const markerStart = home.indexOf(start) + start.length;
const markerEnd = home.indexOf(end, markerStart);
const updatedHome =
  home.slice(0, markerStart) +
  `\n${homepageSection}\n      ` +
  home.slice(markerEnd);
const outputs = new Map([[homePath, updatedHome]]);
outputs.set(
  resolve(site, "blog/index.html"),
  layout({
    title: "Home notes",
    description:
      "Practical, researched home repair and renovation guides for homeowners in Halton and the Greater Toronto Area.",
    canonical: `${base}blog/`,
    prefix: "../",
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Arin home notes",
      url: `${base}blog/`,
      description:
        "Practical, researched guides to home repairs and renovations.",
      blogPost: ordered.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: `${base}blog/${post.slug}/`,
        datePublished: post.published,
        dateModified: post.updated,
      })),
    },
    main: `<section class="container blog-index"><div class="blog-index-heading"><h1>Home notes</h1><p>Practical guides for Halton and GTA homeowners, based on public guidance and sources you can read for yourself.</p></div><div class="blog-grid">${ordered.map((post) => card(post, "../")).join("\n")}</div><div class="blog-editorial-note"><h2>How these guides are written</h2><p>These guides use Canadian public guidance, local municipal information, and manufacturer or trade-body references. Each article identifies its sources and when they were checked. Local requirements and the condition of your home still need to be confirmed for your project.</p></div></section>`,
  }),
);
for (const post of ordered)
  outputs.set(resolve(site, "blog", post.slug, "index.html"), article(post));

const stale = [];
for (const [path, expected] of outputs) {
  if (check) {
    if (
      !existsSync(path) ||
      readFileSync(path, "utf8").replaceAll("\r\n", "\n") !==
        expected.replaceAll("\r\n", "\n")
    )
      stale.push(path.slice(root.length + 1));
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, expected);
  }
}
if (stale.length) {
  console.error(
    `Generated blog output is out of date:\n${stale.join("\n")}\nRun: node scripts/build-blog.mjs`,
  );
  process.exitCode = 1;
} else
  console.log(
    `${check ? "Verified" : "Generated"} ${ordered.length} articles, blog index, and homepage previews.`,
  );
