import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "../site");
const base = new URL("https://ariesyous.github.io/arinwebsite/");
const email = "arinhandyman@gmail.com";
const walk = (directory) => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? walk(resolve(directory, entry.name))
    : [resolve(directory, entry.name)]);
// The separately generated noindex planning report retains its own content checks.
const htmlFiles = walk(site).filter((path) => path.endsWith(".html") && path !== resolve(site, "business-plan/index.html"));
const decode = (value) => value.replaceAll("&amp;", "&");
const label = (path) => path.slice(site.length + 1);
function jpegSize(bytes) {
  assert.equal(bytes.readUInt16BE(0), 0xffd8, "Invalid sharing JPEG");
  for (let offset = 2; offset < bytes.length;) {
    assert.equal(bytes[offset], 0xff, "Invalid JPEG marker");
    const marker = bytes[offset + 1];
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  throw new Error("Missing JPEG dimensions");
}

function localTarget(url) {
  assert(url.pathname.startsWith(base.pathname), `URL leaves project path: ${url.href}`);
  let path = resolve(site, decodeURIComponent(url.pathname.slice(base.pathname.length)) || "index.html");
  assert(path.startsWith(`${site}${sep}`), `URL leaves publishing root: ${url.href}`);
  assert(existsSync(path), `Missing local target: ${url.href}`);
  if (statSync(path).isDirectory()) path = resolve(path, "index.html");
  assert(existsSync(path), `Missing directory index: ${url.href}`);
  if (url.hash && path.endsWith(".html")) {
    const fragment = decodeURIComponent(url.hash.slice(1));
    const ids = [...readFileSync(path, "utf8").matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert(ids.includes(fragment), `Missing anchor ${url.hash} in ${label(path)}`);
  }
  return path;
}

for (const path of htmlFiles) {
  const html = readFileSync(path, "utf8");
  const relative = label(path).replaceAll(sep, "/");
  const url = new URL(relative.replace(/index\.html$/, ""), base);
  assert(!/AI-generated|CONCEPT IMAGERY|website concept|demo form|placeholder (?:phone|contact)|555-\d{4}/i.test(html),
    `Unfinished public content in ${relative}`);
  assert(!/<(?:form|input|textarea|select)\b/i.test(html), `Unexpected enquiry form in ${relative}`);
  assert(/<html\b[^>]*lang="en-CA"/.test(html), `Missing page language: ${relative}`);
  assert(html.includes("Arin Handyman and Contracting"), `Missing business name: ${relative}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate HTML ids: ${relative}`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target = new URL(decode(match[1]), url);
    if (target.protocol === "mailto:") {
      assert.equal(target.pathname, email, `Unapproved email: ${relative}`);
      continue;
    }
    assert(["http:", "https:"].includes(target.protocol), `Unexpected URL scheme: ${relative}`);
    if (target.origin === base.origin) localTarget(target);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, url.href,
    `Incorrect canonical: ${relative}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Expected one h1: ${relative}`);
  for (const key of ["og:image", "twitter:image"]) {
    const image = html.match(new RegExp(`<meta\\s+(?:property|name)="${key}"\\s+content="([^"]+)"`))?.[1];
    assert(image?.startsWith(`${base.href}assets/`), `Missing HTTPS sharing image: ${relative}`);
    const bytes = readFileSync(localTarget(new URL(image)));
    assert.deepEqual(jpegSize(bytes), [1200, 630], `Incorrect sharing dimensions: ${relative}`);
  }
}
const home = readFileSync(resolve(site, "index.html"), "utf8");
assert(home.includes(`href="mailto:${email}"`), "Missing visible business email link");
assert(home.includes(`href="mailto:${email}?subject=Project%20enquiry&amp;body=`), "Missing project enquiry mail link");
for (const asset of ["carpentry", "painting", "tiling", "deck", "bathroom-refresh", "kitchen-refresh", "basement-drywall", "door-weatherstripping"]) assert(existsSync(resolve(site, "assets", `${asset}.webp`)), `Missing retained photo: ${asset}`);

console.log(`Verified ${htmlFiles.length} public HTML pages: links, anchors, contact, sharing metadata, and production content.`);
