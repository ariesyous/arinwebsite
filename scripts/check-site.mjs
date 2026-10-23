import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig, robots } from "../content/site-config.mjs";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "../site");
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const pages = walk(site).filter((path) => path.endsWith(".html"));
const decode = (value) => value.replaceAll("&amp;", "&");
const errors = [];
for (const page of pages) {
  const path = relative(site, page).replaceAll("\\", "/");
  const html = readFileSync(page, "utf8");
  const report = (condition, message) => {
    if (!condition) errors.push(`${path}: ${message}`);
  };
  report((html.match(/<h1\b/g) || []).length === 1, "Expected one H1");
  const robotTags = [
    ...html.matchAll(/<meta name="robots" content="([^"]*)"/g),
  ];
  report(
    robotTags.length === 1 && robotTags[0][1] === robots,
    `Expected one robots tag: ${robots}`,
  );
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  report(
    canonical === siteConfig.baseUrl + path.replace(/index\.html$/, ""),
    "Canonical does not match the configured base and page path",
  );
  report(
    html.match(/<meta property="og:url" content="([^"]*)"/)?.[1] === canonical,
    "Open Graph URL differs from canonical",
  );
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(match[1]);
    } catch {
      report(false, "Invalid structured-data JSON");
    }
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  report(new Set(ids).size === ids.length, "Duplicate element IDs");
  for (const match of html.matchAll(
    /<(?:a|link|script|img|use)\b[^>]*?\b(?:href|src)="([^"]+)"/g,
  )) {
    const ref = decode(match[1]);
    if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    const url = new URL(ref, `https://preview.invalid/arinwebsite/${path}`);
    report(
      url.pathname.startsWith("/arinwebsite/"),
      `Link escapes project path: ${ref}`,
    );
    if (!url.pathname.startsWith("/arinwebsite/")) continue;
    let target = resolve(
      site,
      decodeURIComponent(url.pathname.slice("/arinwebsite/".length)),
    );
    if (existsSync(target) && statSync(target).isDirectory())
      target = join(target, "index.html");
    report(existsSync(target), `Missing local target: ${ref}`);
    if (url.hash && existsSync(target) && /\.(?:html|svg)$/.test(target)) {
      const targetIds = [
        ...readFileSync(target, "utf8").matchAll(/\bid="([^"]+)"/g),
      ].map((item) => item[1]);
      report(
        targetIds.includes(decodeURIComponent(url.hash.slice(1))),
        `Missing fragment: ${ref}`,
      );
    }
  }
  if (path === "index.html") {
    const form = html.match(/<form\b[\s\S]*?<\/form>/)?.[0];
    report(
      Boolean(form) && !/<(?:input|select|textarea)\b[^>]*\bname=/.test(form),
      "Demo inputs must not serialize personal entries",
    );
    report(
      html.includes("<!-- BLOG:START -->") &&
        html.includes("<!-- BLOG:END -->"),
      "Missing blog markers",
    );
  }
}
assert(!errors.length, errors.join("\n"));
console.log(
  `Checked ${pages.length} pages: indexing, metadata, local links, fragments, and demo form.`,
);
