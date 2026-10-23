# Arin Handyman and Contracting

A responsive, front-end-only concept for home repairs and renovations across Halton and the Greater Toronto Area, with a researched homeowner blog.

## Local preview

Requires Node.js 18 or newer. No packages to install and no build step.

```sh
node scripts/serve.mjs
```

Open <http://localhost:4173/arinwebsite/>. This uses the same project path as GitHub Pages. Stop with Ctrl+C. The entire static website is in `site/`.

## Deployment

`.github/workflows/deploy-pages.yml` deploys only `site/` on pushes to `main` or manual dispatch. Set repository **Settings → Pages → Source** to **GitHub Actions**.

Live URL: <https://ariesyous.github.io/arinwebsite/>

Official GitHub Pages actions use the `github-pages` environment and built-in `GITHUB_TOKEN`; no secrets or external hosting are required. Deployments are serialized without interrupting an active publication.

The workflow also checks that generated blog pages, the business plan, and discovery files match their sources before publishing.

When changing styles, increment the stylesheet's `v` query parameter in the HTML so returning visitors receive the updated CSS immediately.

## Blog: Home notes

Read the blog at <https://ariesyous.github.io/arinwebsite/blog/>. Four initial guides cover draughty doors, painting preparation, bathroom planning in Halton, and recurring grout or shower problems. Each has inline citations, original-source links, publication information, and a source-check date.

Article source lives in `content/blog/posts.mjs`. To regenerate the static blog pages and homepage previews:

```sh
node scripts/build-blog.mjs
node scripts/build-discovery.mjs
node scripts/build-blog.mjs --check
node scripts/build-discovery.mjs --check
```

See [the complete publishing and research workflow](docs/blog-workflow.md) for the article format, editorial standards, validation, and deployment steps. Future agents should start with [AGENTS.md](AGENTS.md). Generated article HTML is committed; the deployed website still has no runtime dependencies.

## Search and agent discovery

- [`site/sitemap.xml`](site/sitemap.xml) lists the canonical homepage, blog index, and every published article using absolute HTTPS URLs. Article `lastmod` values use their editorial `updated` dates; undated pages omit `lastmod` rather than inventing a date on every build.
- [`site/llms.txt`](site/llms.txt) provides a concise business summary, service-area links, article descriptions, and the site's concept/demo limitations for agents. It follows the [llms.txt proposal](https://llmstxt.org/); it is supplementary guidance, not a promise of indexing or recommendations.
- [`site/robots.txt`](site/robots.txt) contains permissive project-path rules and the sitemap URL. **GitHub Pages limitation:** the deployed `/arinwebsite/robots.txt` is not an effective robots policy. Crawlers only apply the file at `https://ariesyous.github.io/robots.txt`, which this repository's deployment does not manage. If you manage that origin-root site, merge the generated directives into its robots file without overwriting rules for other projects. See [Google's robots.txt placement guidance](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt).

The homepage and generated blog pages link to the sitemap and llms.txt in their HTML heads. The homepage also has `WebSite` structured data; the blog retains its `Blog` and `BlogPosting` metadata. These describe the existing content without publishing placeholder phone numbers as real contact details. The business plan stays out of discovery files and retains `noindex,nofollow`; do not block its crawling, since crawlers need to read that metadata.

Run `node scripts/build-discovery.mjs` after generating the blog whenever articles, canonical URLs, or discovery copy change, then run `node scripts/build-discovery.mjs --check`. Edit summary wording in the generator when the business information changes; never hand-edit its three generated files. Commit the generator and outputs together. CI rejects missing or stale outputs.

After deployment, verify `/arinwebsite/llms.txt`, `/arinwebsite/sitemap.xml`, and their linked public pages. Submit `https://ariesyous.github.io/arinwebsite/sitemap.xml` in the verified property's Google Search Console and Bing Webmaster Tools; this repository does not submit it automatically. [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) explains submission and canonical URLs. Standard crawlable content remains the foundation: [Google's AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) does not require special AI files and does not guarantee inclusion.

## Business plan

The business plan is written directly for Arin, the business owner, and lives at <https://ariesyous.github.io/arinwebsite/business-plan/>. Keep its advice addressed to him as “you” and treat outside setup/support help as optional and agreed, without assigning an ongoing role to a family member. It is intentionally absent from customer navigation and blog listings and carries `noindex,nofollow` metadata. It is still public, as is this repository; never add customer information, private credentials, or personal financial records.

Edit `docs/business-plan.md`, then regenerate the matching static HTML:

```sh
node scripts/build-business-plan.mjs
node scripts/build-business-plan.mjs --check
node scripts/build-blog.mjs --check
```

Commit the Markdown, renderer (if changed), and generated `site/business-plan/index.html` together. Do not format or hand-edit the generated HTML. The dependency-free renderer supports one `#` title, `##` sections, `###` subsections, paragraphs, flat `-` and numbered lists, pipe tables, bold text, inline code, and Markdown links. It escapes raw HTML and rejects unsafe link schemes, malformed tables, and broken heading anchors. Citations use `[1](#source-1)` with a corresponding `### Source 1` heading. Keep research dates deliberate; re-open relevant sources before updating them.

The page uses its own embedded responsive/print styles, without the homepage JavaScript or shared CSS. Its source and renderer are the only inputs, so regeneration does not modify the homepage or blog. Check phone/desktop layout, sources, arithmetic, and print output when revising it. Proposed prices and scenarios must stay labelled as unapproved planning assumptions. The report does not activate the demo form or implement the proposed private operations system.

## Social link preview

The homepage includes static Open Graph and large-image Twitter Card metadata with the business name, description, canonical URL, image dimensions, and descriptive alternative text. Sharing crawlers can read these directly from the HTML without running JavaScript.

The branded image is `site/assets/social-preview-v2.jpg`, a 1200 × 630 JPEG, available at <https://ariesyous.github.io/arinwebsite/assets/social-preview-v2.jpg>. It matches the simplified website with cream, orange, and charcoal branding, plain “Home repairs & renovations” wording, the service area, and a clean photographic crop labelled as AI-generated concept imagery. Its generation prompt is recorded in `image-prompts.md`. The earlier `social-preview-v1.jpg` remains available for older cached links.

Sharing metadata uses absolute HTTPS URLs. When replacing the preview image, use a new versioned filename and update both the Open Graph and Twitter image tags together to avoid reusing an old image URL.

## Concept details

- `(416) 555-0148` is a clearly marked placeholder, not a call link.
- The form validates locally and displays a demo confirmation. It sends no requests and stores no personal information. Inputs have no `name` attributes, preventing native form serialization if JavaScript is unavailable.
- Photographs are AI-generated inspiration, not photographs of Arin or completed customer projects; the page labels them accordingly.
- No fabricated testimonials, credentials, experience figures, or guarantees.
- Relative asset paths support project-path hosting. No runtime dependencies, trackers, remote fonts, third-party scripts, or external APIs.

## Image provenance

The work photographs, including bathroom and kitchen refreshes, basement framing and drywall, and a door-maintenance article illustration, were generated specifically for this concept using the built-in OpenAI image generation tool and optimized locally to WebP. Full prompts are in `image-prompts.md`.

The social preview graphic was created with the same built-in tool using the carpentry photograph and website branding as references, then resized and encoded as a JPEG.

| Asset in `site/assets/`      | Subject                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| `carpentry.webp`             | Carpenter adjusting oak kitchen cabinetry; hero image.           |
| `painting.webp`              | Painter refreshing a wall with floor protection.                 |
| `tiling.webp`                | Gloved tiler positioning ivory bathroom tiles.                   |
| `deck.webp`                  | Carpenter fastening cedar boards in a suburban backyard.         |
| `bathroom-refresh.webp`      | Worker adjusting an oak vanity during a bathroom refresh.        |
| `kitchen-refresh.webp`       | Worker fitting cabinet trim during a kitchen refresh.            |
| `basement-drywall.webp`      | Worker taping drywall beside exposed basement partition framing. |
| `door-weatherstripping.webp` | A gloved hand checking an exterior door seal; blog illustration. |

Replace concept imagery and contact details with approved business material when turning this prototype into an operational enquiry website.
