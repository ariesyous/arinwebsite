import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { services } from "../content/services.mjs";
import { base, brand, esc, arrow, createLayout } from "./page-layout.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const site = resolve(root, "site");
const layout = createLayout(readFileSync(resolve(site, "index.html"), "utf8"));
const check = process.argv.includes("--check");
const prefix = "../../";
const list = (items) =>
  `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
const seen = new Set();
const stale = [];
for (const service of services) {
  assert(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug) && !seen.has(service.slug),
    "Invalid or duplicate service slug",
  );
  seen.add(service.slug);
  assert(
    existsSync(resolve(site, "assets", service.image)),
    `Missing image: ${service.image}`,
  );
  assert(
    existsSync(resolve(site, "blog", service.guideSlug, "index.html")),
    `Missing guide: ${service.guideSlug}`,
  );
  const canonical = `${base}services/${service.slug}/`;
  const contact = `${prefix}index.html?service=${service.slug}#contact`;
  const html = layout({
    kind: "service",
    title: service.title,
    description: service.description,
    canonical,
    prefix,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": canonical,
          url: canonical,
          name: service.title,
          description: service.description,
          publisher: { "@type": "Organization", name: brand, url: base },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: base },
            {
              "@type": "ListItem",
              position: 2,
              name: service.name,
              item: canonical,
            },
          ],
        },
      ],
    },
    main: `<article class="service-shell container">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${prefix}index.html">Home</a><span aria-hidden="true">/</span><span aria-current="page">${esc(service.name)}</span></nav>
  <header class="service-hero"><div><p class="eyebrow">HALTON &amp; THE GREATER TORONTO AREA</p><h1>${esc(service.title)}</h1><p class="service-lede">${esc(service.intro)}</p><a class="button button-orange" href="${contact}">Describe your project ${arrow}</a></div><figure><img src="${prefix}assets/${service.image}" alt="${esc(service.imageAlt)}" width="1536" height="1024" fetchpriority="high"><figcaption>AI-generated concept, not a completed customer project.</figcaption></figure></header>
  <section class="service-examples" aria-labelledby="examples-title"><h2 id="examples-title">Jobs to discuss</h2><div class="scope-grid">${service.examples.map(([title, copy]) => `<div><h3>${esc(title)}</h3><p>${esc(copy)}</p></div>`).join("")}</div></section>
  <div class="service-details"><section aria-labelledby="scope-title"><h2 id="scope-title">${esc(service.scopeTitle)}</h2><p>${esc(service.scope)}</p>${list(service.questions)}<aside class="scope-note"><h3>Before settling the scope</h3><p>${esc(service.limit)}${service.source ? ` <a href="${esc(service.source.url)}">${esc(service.source.title)}</a>.` : ""}</p></aside></section>
  <aside class="project-brief" aria-labelledby="brief-title"><p class="eyebrow">YOUR PROJECT BRIEF</p><h2 id="brief-title">What to include</h2>${list(service.brief)}<h3>For example</h3><blockquote>${esc(service.sample)}</blockquote><p class="brief-note">The current estimate form is a demo. It does not send or save entries and has no photo upload.</p><a class="text-link" href="${contact}">Open the demo form ${arrow}</a></aside></div>
  <section class="service-questions" aria-labelledby="questions-title"><h2 id="questions-title">Planning questions</h2>${service.faqs.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("")}</section>
  <aside class="service-guide"><div><p class="eyebrow">RELATED HOME NOTE</p><h2><a href="${prefix}blog/${service.guideSlug}/">${esc(service.guideTitle)} ${arrow}</a></h2><p>${esc(service.guideDescription)}</p></div></aside>
  <section class="service-next" aria-labelledby="next-title"><div><h2 id="next-title">Start with the job you have</h2><p>Arin Handyman and Contracting serves homeowners in Halton and the Greater Toronto Area, including Milton, Oakville, Burlington, Mississauga, Brampton, and Toronto. Include your city and the work you have in mind.</p></div><a class="button button-dark" href="${contact}">Describe your project ${arrow}</a></section>
  <nav class="related-services" aria-label="Other services"><span>Also explore</span>${services
    .filter((other) => other.slug !== service.slug)
    .map(
      (other) => `<a href="../${other.slug}/">${esc(other.name)} ${arrow}</a>`,
    )
    .join(
      "",
    )}<a href="${prefix}index.html#services">All services ${arrow}</a></nav>
</article>`,
  });
  const path = resolve(site, "services", service.slug, "index.html");
  if (check) {
    if (
      !existsSync(path) ||
      readFileSync(path, "utf8").replaceAll("\r\n", "\n") !==
        html.replaceAll("\r\n", "\n")
    )
      stale.push(service.slug);
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, html);
  }
}
assert(
  !stale.length,
  `Stale service pages: ${stale.join(", ")}. Run node scripts/build-site.mjs`,
);
console.log(
  `${check ? "Verified" : "Generated"} ${services.length} service pages.`,
);
