# Adding and maintaining Home notes

Home notes is the blog for Arin Handyman and Contracting. Its purpose is to help Halton and GTA homeowners understand a repair or plan a conversation about a project. It should help a reader make a specific decision, rather than repeat broad marketing claims.

## How the blog works

| Location                      | Purpose                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `content/blog/posts.mjs`      | Source of truth: article metadata, original HTML body, and references.                    |
| `scripts/build-blog.mjs`      | Dependency-free Node authoring tool and stale-output check.                               |
| `site/blog/blog.css`          | Blog-specific layouts and typography; safe to edit directly.                              |
| `site/blog/index.html`        | Generated index of all articles, newest publication first.                                |
| `site/blog/<slug>/index.html` | Generated, directly linkable article page.                                                |
| `site/index.html`             | Shared header/footer source; the generator owns only its `BLOG:START`/`BLOG:END` section. |

All delivered pages are static HTML. Generation happens during authoring; the generated pages are committed. Deployment checks their freshness and uploads `site/`. No CMS, package installation, runtime API, or browser rendering is required to publish content.

## 1. Start with a useful question

Choose a question connected to the actual service offering: identifying a repair, comparing scopes, preparing for work, maintenance, or understanding when a specialist is needed. Use the reader's situation as the opening, then explain observations, decision points, and what to ask next.

Examples: “Does this door need a new seal or a closer inspection?” and “What should a painting quote include before the finish coats?” Avoid generic lists of benefits, repeated city names, or claims that every problem has a simple DIY fix.

## 2. Research before drafting

Open and read at least two relevant primary sources. Useful starting points include Natural Resources Canada's building-science guidance, Health Canada, the municipality where the project is located, Ontario's Electrical Safety Authority, and technical information from manufacturers or trade bodies.

- Record the actual publisher, page title, and direct HTTPS URL. Search snippets alone are not a review.
- Match each factual claim to a source that actually supports it. Place a citation immediately after that passage.
- Check the jurisdiction and the system being described. Oakville guidance is an Oakville example, not a rule for every GTA municipality. A product maker's instructions are not a universal installation specification.
- Use original wording. Summarize selectively, avoid substantial quotation, and respect source-specific copyright limits. Do not reproduce tables or diagrams without an appropriate basis.
- Treat permit, electrical, structural, moisture, and hazardous-material topics carefully. Explain what should be assessed and which authority or qualified specialist to consult; do not turn a short blog into hazardous-work instructions.
- Do not invent prices, savings percentages, customer stories, job photographs, licences, inspection results, author credentials, or professional review.

The first four articles include direct numbered citations and source-check dates. Their references are a useful starting point, but future updates must revisit the original guidance rather than assume it is unchanged.

## 3. Add an entry to the source array

Add an object to `posts` in `content/blog/posts.mjs`. The `citation()` helper already exists at the top of that module. This is a structural example, not an article ready for publication:

```js
{
  slug: "specific-homeowner-question",
  title: "A clear title that matches the question",
  category: "Home maintenance",
  excerpt: "One or two sentences explaining what the reader will learn.",
  published: "YYYY-MM-DD",
  updated: "YYYY-MM-DD",
  checked: "YYYY-MM-DD",
  image: "existing-or-new-asset.webp",
  imageAlt: "Accurate description, identifying a generated concept if applicable.",
  sources: [
    { publisher: "Actual publisher", title: "Actual page title", url: "https://..." },
    { publisher: "Another publisher", title: "Actual page title", url: "https://..." },
  ],
  body: `
    <p>An original opening grounded in a recognizable homeowner situation.</p>
    <h2>A useful decision or observation</h2>
    <p>A sourced explanation. ${citation(1)}</p>
    <h2>What to ask before deciding</h2>
    <p>Another supported explanation. ${citation(2)}</p>
    <ul><li>A specific question or practical observation.</li></ul>
  `,
}
```

Use a stable lowercase slug with words separated by hyphens. Keep image files in `site/assets/` and reference only the filename. Use semantic paragraphs, `h2` headings, and lists in `body`; the template supplies the page's single `h1`, navigation, dates, source list, and contact link. Do not place scripts, forms, or iframes inside articles.

Dates are deliberate editorial records. `published` is the original publication date. Change `updated` when making an editorial revision and change `checked` only after reviewing the sources. Do not rewrite old publication dates or automatically stamp today's date. Reading time is calculated from the body.

Aim for the depth the question needs; roughly 400–700 words is often sufficient for this format. Prefer a concrete example, scope checklist, or decision distinction over extra paragraphs. There is no word-count target to pad toward.

## 4. Generate and check

From the repository root:

```sh
node scripts/build-blog.mjs
node scripts/build-blog.mjs --check
node scripts/build-site.mjs --check
node --check site/script.js
git diff --check
```

The generator validates slugs, dates, local images, source records, and citation references. It creates the article pages and blog index and updates the three most recent homepage previews. It copies the homepage's shared navigation, footer, icon definitions, and asset cache versions so those remain consistent across pages.

The check command does not edit anything. It reports missing or stale generated files and exits unsuccessfully when they differ from the source. It does **not** verify that a factual claim is true or that an external page still supports it; that remains an editorial responsibility.

If you use a formatter, format source files before running the generator. Do not format generated pages afterward; rerun generation if you do. Commit the article source and generated output together.

## 5. Review the result

Run `node scripts/serve.mjs` and visit `http://localhost:4173/arinwebsite/blog/`. Review the new article and its homepage card at desktop and phone widths. Check:

- Title, excerpt, headings, paragraph flow, and readable text without horizontal overflow.
- Image appearance and alt text; generated illustrations must not be presented as completed work.
- Every inline citation jumps to its corresponding source, and every source link points to the original page.
- Navigation, breadcrumbs, the return-to-blog link, and the project-enquiry link work under `/arinwebsite/`.
- The console has no errors on article pages, which share navigation code but do not have a contact form.
- The canonical URL, Open Graph/Twitter fields, publication dates, and JSON-LD describe this article. The default sharing graphic is the branded company preview.

Review the claims as carefully as the layout. Distinguish your planning suggestions from source-derived requirements, and qualify uncertainty where an on-site assessment is needed.

## 6. Publish and maintain

Push the tested changes to `main`. The existing GitHub Actions workflow runs the generated-output check before deploying GitHub Pages. Monitor the run and verify the blog index, article, image, and metadata at their public URLs.

For later revisions, edit the source object and regenerate. Keep its slug stable. Adding a newer article automatically updates the homepage previews; older articles stay on the full index. Do not remove or rename published slugs without planning how existing links will continue to work.

For a shared layout change, edit the homepage header/footer or the appropriate stylesheet, update affected CSS/JavaScript cache versions, then run `node scripts/build-site.mjs` and `node scripts/build-site.mjs --check` to regenerate and validate **all** blog and service pages. For a new social preview image, use a versioned filename and update the `socialImage` constant in `scripts/page-layout.mjs`; the homepage and all generated pages use that shared metadata.

The homepage has a compact text-only preview of the three most recent articles. The blog index retains its illustrated cards. Homepage SEO metadata is generated between `SEO:START` and `SEO:END` from `content/site-config.mjs`. Development mode emits `noindex, follow` on every page; preserve that setting until an explicitly approved launch. Blog content dates remain deliberate editorial records and are not changed by layout or metadata generation.
