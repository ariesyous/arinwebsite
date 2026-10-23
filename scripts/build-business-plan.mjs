import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "docs/business-plan.md");
const outputPath = resolve(root, "site/business-plan/index.html");
const canonical = "https://ariesyous.github.io/arinwebsite/business-plan/";
const brand = "Arin Handyman and Contracting";
const socialImage =
  "https://ariesyous.github.io/arinwebsite/assets/social-preview-v2.jpg";
const socialAlt =
  "Arin Handyman and Contracting — Home repairs and renovations across Halton and the Greater Toronto Area, with AI-generated concept carpentry imagery.";

const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

function safeLink(href) {
  assert(
    href && !/[\s\\<>\u0000-\u001f\u007f]/u.test(href),
    `Invalid link: ${href}`,
  );
  if (href.startsWith("#")) {
    assert(/^#[a-z0-9][a-z0-9-]*$/.test(href), `Invalid anchor: ${href}`);
    return href;
  }
  if (/^https?:\/\//i.test(href)) {
    const url = new URL(href);
    assert(
      !url.username && !url.password,
      `Credentials are not allowed in links: ${href}`,
    );
    return href;
  }
  assert(
    !/^[a-z][a-z0-9+.-]*:/i.test(href) &&
      !href.startsWith("/") &&
      !href.includes(":"),
    `Unsupported link scheme or absolute path: ${href}`,
  );
  return href;
}

// This deliberately small renderer supports the document's authoring format.
// Source HTML is always escaped; no Markdown is interpreted as executable HTML.
export function renderMarkdown(markdown) {
  const lines = markdown
    .replace(/^\uFEFF/, "")
    .replaceAll("\r\n", "\n")
    .split("\n");
  const ids = new Set(["main"]);
  const anchors = new Set();
  const contents = [];
  const blocks = [];
  const sections = [];
  let title = "";
  let description = "";
  let section = false;
  let intro = "";
  let titleCount = 0;

  function inline(value) {
    let html = "";
    let plain = "";
    for (let i = 0; i < value.length; ) {
      const char = value[i];
      if (
        char === "\\" &&
        i + 1 < value.length &&
        /[\\`*\[\]()|]/.test(value[i + 1])
      ) {
        html += escape(value[i + 1]);
        plain += value[i + 1];
        i += 2;
      } else if (char === "`") {
        const end = value.indexOf("`", i + 1);
        assert(end !== -1, `Unclosed inline code: ${value}`);
        const text = value.slice(i + 1, end);
        html += `<code>${escape(text)}</code>`;
        plain += text;
        i = end + 1;
      } else if (value.startsWith("**", i)) {
        const end = value.indexOf("**", i + 2);
        assert(end !== -1, `Unclosed bold text: ${value}`);
        const text = inline(value.slice(i + 2, end));
        html += `<strong>${text.html}</strong>`;
        plain += text.plain;
        i = end + 2;
      } else if (char === "[") {
        const labelEnd = value.indexOf("]", i + 1);
        if (labelEnd === -1 || value[labelEnd + 1] !== "(") {
          html += "[";
          plain += "[";
          i += 1;
          continue;
        }
        let end = labelEnd + 2;
        let depth = 1;
        while (end < value.length && depth) {
          if (value[end] === "(") depth += 1;
          if (value[end] === ")") depth -= 1;
          if (depth) end += 1;
        }
        assert(depth === 0, `Unclosed link: ${value}`);
        const href = safeLink(value.slice(labelEnd + 2, end));
        const label = inline(value.slice(i + 1, labelEnd));
        assert(!label.html.includes("<a "), "Nested links are not supported");
        assert(label.plain.trim(), "Link labels must not be empty");
        if (href.startsWith("#")) anchors.add(href.slice(1));
        html += `<a href="${escape(href)}">${label.html}</a>`;
        plain += label.plain;
        i = end + 1;
      } else {
        html += escape(char);
        plain += char;
        i += 1;
      }
    }
    return { html, plain };
  }

  function headingId(text) {
    const base = text
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    assert(base, `Heading needs a readable identifier: ${text}`);
    let id = base;
    let count = 2;
    while (ids.has(id)) id = `${base}-${count++}`;
    ids.add(id);
    return id;
  }

  function cells(line) {
    let value = line.trim();
    if (value.startsWith("|")) value = value.slice(1);
    if (value.endsWith("|") && !value.endsWith("\\|")) {
      value = value.slice(0, -1);
    }
    const result = [];
    let cell = "";
    let inCode = false;
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] === "\\" && value[i + 1] === "|") {
        cell += "\\|";
        i += 1;
      } else if (value[i] === "`") {
        inCode = !inCode;
        cell += value[i];
      } else if (value[i] === "|" && !inCode) {
        result.push(cell.trim());
        cell = "";
      } else cell += value[i];
    }
    result.push(cell.trim());
    return result;
  }

  const listItem = (line) => line.match(/^(?:(-) |(\d+)\. )(.+)$/);
  const isTable = (index) =>
    lines[index]?.includes("|") &&
    lines[index + 1]?.includes("|") &&
    cells(lines[index + 1]).every((cell) => /^:?-{3,}:?$/.test(cell));
  const startsBlock = (index) =>
    lines[index]?.startsWith("![") ||
    /^(?:#{1,6}\s|```|~~~|>\s|\s{2,}[-*]\s)/.test(lines[index]) ||
    listItem(lines[index]) ||
    isTable(index);

  blocks.push('<div class="report-intro">');
  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    assert(
      !/^(?:```|~~~|>\s|\s+[-*]\s|\s+\d+\.\s)/.test(line),
      `Unsupported block at line ${i + 1}; use paragraphs, flat lists, headings, or tables`,
    );
    const diagram = line.match(/^!\[([^\]]+)\]\(\.\.\/site\/assets\/([a-z0-9-]+\.svg)\)$/);
    if (line.startsWith("![")) {
      assert(diagram, `Use a local SVG diagram with descriptive alt text (line ${i + 1})`);
      const asset = resolve(root, "site/assets", diagram[2]);
      assert(existsSync(asset), `Missing diagram: ${diagram[2]}`);
      const svg = readFileSync(asset, "utf8");
      const size = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
      assert(size, `Diagram needs a numeric viewBox: ${diagram[2]}`);
      blocks.push(`<figure class="plan-diagram"><img src="../assets/${diagram[2]}" alt="${escape(diagram[1])}" width="${size[1]}" height="${size[2]}" loading="lazy" decoding="async"></figure>`);
      i += 1;
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      assert(level <= 3, `Use only #, ##, or ### headings (line ${i + 1})`);
      const text = inline(heading[2]);
      const id = headingId(text.plain);
      if (level === 1) {
        titleCount += 1;
        assert(
          titleCount === 1 && blocks.length === 1,
          "Start the document with exactly one # title",
        );
        title = text.plain;
      }
      if (level === 2) {
        if (section) {
          blocks.push("</section>");
          sections.push(blocks.splice(0).join("\n"));
        } else intro = `${blocks.splice(0).join("\n")}\n</div>`;
        blocks.push(
          `<section class="report-section" aria-labelledby="${id}">`,
        );
        section = true;
        contents.push({ id, title: text.plain });
      }
      blocks.push(`<h${level} id="${id}">${text.html}</h${level}>`);
      i += 1;
      continue;
    }
    if (isTable(i)) {
      const header = cells(line);
      const separators = cells(lines[i + 1]);
      assert(
        header.length === separators.length,
        `Table column mismatch at line ${i + 1}`,
      );
      const alignment = separators.map((cell) =>
        cell.startsWith(":") && cell.endsWith(":")
          ? "center"
          : cell.endsWith(":")
            ? "right"
            : "left",
      );
      const labels = header.map((cell) => inline(cell).plain);
      const label = labels.join(", ");
      const tableId = headingId("table");
      const comparison = alignment.includes("right");
      const hintId = comparison ? headingId("table-scroll-hint") : "";
      if (comparison) {
        blocks.push(
          `<p class="table-hint" id="${hintId}">Swipe left or right to read the full table <span aria-hidden="true">↔</span></p>`,
        );
      }
      blocks.push(
        `<div class="table-scroll ${comparison ? "table-comparison" : "table-cards"}" role="region" tabindex="0" aria-label="${escape(label)}"${hintId ? ` aria-describedby="${hintId}"` : ""}><table id="${tableId}" role="table" aria-label="${escape(label)}">`,
      );
      blocks.push(
        `<thead role="rowgroup"><tr role="row">${header.map((cell, index) => `<th id="${tableId}-column-${index + 1}" scope="col" role="columnheader" class="align-${alignment[index]}">${inline(cell).html}</th>`).join("")}</tr></thead><tbody role="rowgroup">`,
      );
      i += 2;
      while (i < lines.length && lines[i].trim() && lines[i].includes("|")) {
        const row = cells(lines[i]);
        assert(
          row.length === header.length,
          `Table column mismatch at line ${i + 1}`,
        );
        blocks.push(
          `<tr role="row">${row.map((cell, index) => `<td role="cell" headers="${tableId}-column-${index + 1}" data-label="${escape(labels[index])}" class="align-${alignment[index]}">${inline(cell).html}</td>`).join("")}</tr>`,
        );
        i += 1;
      }
      blocks.push("</tbody></table></div>");
      continue;
    }
    const item = listItem(line);
    if (item) {
      const ordered = Boolean(item[2]);
      const tag = ordered ? "ol" : "ul";
      const start =
        ordered && item[2] !== "1" ? ` start="${Number(item[2])}"` : "";
      blocks.push(`<${tag}${start}>`);
      while (i < lines.length) {
        const next = listItem(lines[i]);
        if (!next || Boolean(next[2]) !== ordered) break;
        blocks.push(`<li>${inline(next[3]).html}</li>`);
        i += 1;
        if (
          !lines[i]?.trim() &&
          listItem(lines[i + 1] || "") &&
          Boolean(listItem(lines[i + 1])[2]) === ordered
        ) {
          i += 1;
        }
      }
      blocks.push(`</${tag}>`);
      continue;
    }
    const paragraph = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !startsBlock(i)) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    const text = inline(paragraph.join(" "));
    if (!description) description = text.plain;
    blocks.push(`<p>${text.html}</p>`);
  }
  blocks.push(section ? "</section>" : "</div>");
  if (section) sections.push(blocks.join("\n"));
  assert(titleCount === 1, "The Markdown source must start with one # title");
  assert(contents.length, "The Markdown source needs at least one ## section");
  for (const anchor of anchors) {
    assert(ids.has(anchor), `Link points to missing heading: #${anchor}`);
  }
  const body = sections.join("\n");
  return {
    title,
    description,
    contents,
    intro,
    body,
    sections,
    html: `${intro}\n${body}`,
  };
}

const styles = `
:root { color-scheme: light; --cream: #f7f4ed; --paper: #fffdf8; --ink: #282e28; --muted: #5f655d; --orange: #b5441b; --line: #dcded4; }
* { box-sizing: border-box; }
html { scroll-padding-top: 24px; }
body { margin: 0; background: var(--cream); color: var(--ink); font: 18px/1.75 "Segoe UI", Arial, Helvetica, sans-serif; }
a { color: var(--orange); text-decoration-thickness: 1px; text-underline-offset: 3px; overflow-wrap: anywhere; }
a:hover { text-decoration-thickness: 2px; }
a:focus-visible, [tabindex]:focus-visible { outline: 3px solid var(--orange); outline-offset: 5px; }
.skip-link { position: absolute; top: -100px; left: 20px; padding: 10px 18px; background: var(--paper); z-index: 2; }
.skip-link:focus { top: 12px; }
.masthead { background: var(--ink); border-bottom: 5px solid #d45a2d; }
.masthead-inner { max-width: 1360px; margin: auto; padding: 23px 48px; display: flex; gap: 20px; align-items: center; justify-content: space-between; }
.brand { color: var(--cream); text-decoration: none; font-size: 18px; font-weight: 700; letter-spacing: -.025em; }
.site-link { color: var(--cream); font-size: 16px; white-space: nowrap; }
.report-layout { max-width: 1360px; margin: auto; padding: 0 48px 88px; display: grid; grid-template-columns: 238px minmax(0, 1fr); column-gap: 56px; align-items: start; }
.report-layout > .report-section { grid-column: 2; grid-row: 1; }
.contents { grid-column: 1; grid-row: 1 / span 2; position: sticky; top: 28px; font-size: 15px; line-height: 1.5; }
.contents-label { margin: 0 0 18px; color: var(--muted); font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.contents ol { margin: 0; padding: 0; list-style: none; counter-reset: contents; }
.contents li { counter-increment: contents; margin: 0; border-top: 1px solid var(--line); }
.contents a { display: grid; grid-template-columns: 25px 1fr; gap: 9px; padding: 11px 0; color: var(--ink); text-decoration: none; }
.contents a:before { content: counter(contents, decimal-leading-zero); color: var(--orange); font-size: 12px; line-height: 1.9; font-weight: 700; }
.contents a:hover { color: var(--orange); }
main { min-width: 0; counter-reset: sections; }
.report-body { grid-column: 2; grid-row: 2; min-width: 0; }
.report-intro { max-width: 1360px; margin: auto; padding: 60px 48px 40px 342px; }
h1, h2, h3 { line-height: 1.15; letter-spacing: -.045em; text-wrap: balance; }
h1 { margin: 0 0 28px; font-size: clamp(38px, 4.6vw, 64px); max-width: 19ch; }
.report-intro > p:first-of-type { font-size: 21px; line-height: 1.65; color: var(--muted); }
p { margin: 18px 0; }
strong { font-weight: 700; }
.report-section { counter-increment: sections; padding: 36px 0 24px; border-top: 1px solid var(--line); }
h2 { margin: 0 0 25px; font-size: clamp(29px, 3vw, 38px); }
h2:before { content: counter(sections, decimal-leading-zero); display: block; font-size: 13px; line-height: 1.5; letter-spacing: .08em; color: var(--orange); margin-bottom: 12px; }
h3 { margin: 30px 0 12px; font-size: 23px; line-height: 1.3; letter-spacing: -.025em; }
ul, ol { padding-left: 25px; margin: 18px 0; }
li { padding-left: 4px; margin: 10px 0; }
li::marker { color: var(--orange); font-weight: 700; }
code { font: .88em/1.6 Consolas, "Courier New", monospace; background: #eaece3; padding: .15em .3em; border-radius: 3px; overflow-wrap: anywhere; }
.table-scroll { width: 100%; overflow-x: auto; margin: 25px 0; border: 1px solid var(--line); border-radius: 5px; background: var(--paper); }
.table-hint { display: none; }
.plan-diagram { margin: 32px auto; max-width: 420px; break-inside: avoid; }
.plan-diagram img { display: block; width: 100%; height: auto; background: #fff; border: 1px solid #000; border-radius: 6px; }
@media print { .plan-diagram { max-width: 85mm; } }
table { width: 100%; border-collapse: collapse; font-size: 18px; line-height: 1.55; }
th, td { padding: 15px 17px; vertical-align: top; text-align: left; overflow-wrap: anywhere; min-width: 145px; }
th { background: #e9ece2; font-weight: 700; font-size: 16px; }
td { border-top: 1px solid var(--line); }
tbody tr:nth-child(even) { background: #f5f5ed; }
.align-center { text-align: center; }
.align-right { text-align: right; }
.page-footer { border-top: 1px solid var(--line); margin-top: 32px; padding-top: 20px; font-size: 16px; }
@media (min-width: 1051px) { .report-section p, .report-section > ul, .report-section > ol { max-width: 77ch; } }
@media (max-width: 1050px) { .report-layout { grid-template-columns: 185px minmax(0, 1fr); column-gap: 30px; padding: 0 30px 64px; } .report-intro { padding: 45px 30px 35px 245px; } .masthead-inner { padding-inline: 30px; } .contents { font-size: 14px; } }
@media (max-width: 760px) { .masthead-inner { padding: 18px 22px; align-items: flex-start; } .brand { max-width: 220px; font-size: 16px; line-height: 1.4; } .site-link { font-size: 14px; padding-block: 2px; } .report-layout { display: flex; flex-direction: column; padding: 0 22px 48px; gap: 30px; } main, .report-body, .report-layout > .report-section { width: 100%; min-width: 0; } .contents { position: static; width: 100%; } .contents ol { display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; } .contents a { padding-block: 10px; font-size: 14px; } .report-intro { padding: 32px 22px 24px; } h1 { font-size: clamp(36px, 8vw, 52px); } .report-intro > p:first-of-type { font-size: 20px; } .report-section { padding-block: 28px 20px; } h2 { font-size: 31px; } h3 { font-size: 23px; } th, td { padding: 12px 14px; min-width: 155px; } .table-hint { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 25px 0 8px; color: var(--orange); font-size: 18px; line-height: 1.45; font-weight: 600; } .table-hint span { font-size: 25px; flex-shrink: 0; } .table-scroll { margin-top: 0; border-color: #b88a73; border-bottom: 3px solid var(--orange); scrollbar-color: var(--orange) #e9ece2; } }
@media (max-width: 400px) { .contents ol { grid-template-columns: 1fr; } .masthead-inner { gap: 14px; } .brand { max-width: 180px; } .report-layout, .report-intro { padding-inline: 18px; } }
@media screen and (max-width: 760px) {
  .table-cards { overflow: visible; margin: 25px 0; border: 0; border-radius: 0; background: none; }
  .table-cards table { display: block; width: 100%; }
  .table-cards thead { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); clip-path: inset(50%); white-space: nowrap; border: 0; }
  .table-cards tbody { display: grid; gap: 18px; }
  .table-cards tbody tr { display: block; width: 100%; border: 1px solid var(--line); border-radius: 6px; background: var(--paper); overflow: hidden; }
  .table-cards td { display: block; width: 100%; min-width: 0; padding: 15px 18px; border: 0; text-align: left; font-size: 18px; line-height: 1.6; }
  .table-cards td + td { border-top: 1px solid var(--line); }
  .table-cards td:first-child { background: #e9ece2; font-weight: 700; }
  .table-cards td::before { content: attr(data-label); display: block; margin-bottom: 5px; color: var(--muted); font-size: 18px; font-weight: 600; line-height: 1.45; }
}
@media print { @page { size: auto; margin: 16mm; } body { background: #fff; color: #000; font-size: 11pt; line-height: 1.5; } .skip-link, .contents, .site-link, .page-footer, .table-hint { display: none; } .masthead { background: none; border-bottom: 2px solid #b5441b; } .masthead-inner { padding: 0 0 10px; } .brand { color: #000; font-size: 12pt; } .report-layout { display: block; padding: 0; } .report-intro { padding: 24px 0; } h1 { font-size: 29pt; max-width: none; } h2 { font-size: 21pt; } h3 { font-size: 15pt; } h1, h2, h3 { break-after: avoid; } .report-intro > p:first-of-type { font-size: 12pt; } .report-section { padding: 22px 0 16px; } p, li { orphans: 3; widows: 3; } .table-scroll { overflow: visible; border: 1px solid var(--line); border-radius: 0; } table { font-size: 10pt; table-layout: fixed; } th, td { min-width: 0; padding: 8px; } th { font-size: 10pt; } thead { display: table-header-group; } tr { break-inside: avoid; } a { color: #000; } code { background: none; } }
`;

export function renderDocument(markdown) {
  const doc = renderMarkdown(markdown);
  const title = `${doc.title} | ${brand}`;
  const description =
    doc.description.length > 200
      ? `${doc.description.slice(0, 197).trimEnd()}…`
      : doc.description;
  return `<!doctype html>
<!-- Generated by scripts/build-business-plan.mjs. Edit docs/business-plan.md, not this file. -->
<html lang="en-CA" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="#f7f4ed">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_CA">
  <meta property="og:site_name" content="${brand}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:secure_url" content="${socialImage}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escape(socialAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="${socialImage}">
  <meta name="twitter:image:alt" content="${escape(socialAlt)}">
  <style>${styles}</style>
</head>
<body>
  <a class="skip-link" href="#main">Skip to document</a>
  <header class="masthead"><div class="masthead-inner"><a class="brand" href="../">${brand}</a><a class="site-link" href="../">View website ↗</a></div></header>
  <main id="main">
${doc.intro}
    <div class="report-layout">
${doc.sections[0]}
      <nav class="contents" aria-label="Document contents"><p class="contents-label">On this page</p><ol>${doc.contents.map((item) => `<li><a href="#${item.id}">${escape(item.title)}</a></li>`).join("")}</ol></nav>
      <div class="report-body">
${doc.sections.slice(1).join("\n")}
      <footer class="page-footer"><a href="#main">Back to top ↑</a></footer>
      </div>
    </div>
  </main>
</body>
</html>
`;
}

function build() {
  const args = process.argv.slice(2);
  assert(
    args.every((arg) => arg === "--check"),
    "Usage: node scripts/build-business-plan.mjs [--check]",
  );
  assert(
    existsSync(sourcePath),
    "Missing business-plan source: docs/business-plan.md",
  );
  const expected = renderDocument(readFileSync(sourcePath, "utf8"));
  if (args.includes("--check")) {
    assert(
      existsSync(outputPath),
      "Missing generated page: site/business-plan/index.html. Run: node scripts/build-business-plan.mjs",
    );
    assert(
      readFileSync(outputPath, "utf8").replaceAll("\r\n", "\n") === expected,
      "Generated business plan is stale: site/business-plan/index.html. Run: node scripts/build-business-plan.mjs",
    );
    console.log("Verified business-plan HTML matches docs/business-plan.md.");
  } else {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, expected);
    console.log("Generated site/business-plan/index.html from docs/business-plan.md.");
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    build();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
