# Arin Handyman and Contracting

A responsive, front-end-only website for home repairs and renovations across Halton and the Greater Toronto Area, with a researched homeowner blog.

## Local preview

Requires Node.js 18 or newer. No packages to install and no build step.

```sh
node scripts/serve.mjs
```

Open <http://localhost:4173/>. This matches the custom-domain root. The previous `/arinwebsite/` preview path also works. Stop with Ctrl+C. The entire static website is in `site/`.

## Deployment

`.github/workflows/deploy-pages.yml` deploys only `site/` on pushes to `main` or manual dispatch. Set repository **Settings → Pages → Source** to **GitHub Actions**.

Live URL: <https://arinhandyman.com/>

Official GitHub Pages actions use the `github-pages` environment and built-in `GITHUB_TOKEN`; no secrets or external hosting are required. Deployments are serialized without interrupting an active publication.

The workflow also checks that generated blog pages, the business plan, and discovery files match their sources before publishing.

When changing styles, increment the stylesheet's `v` query parameter in the HTML so returning visitors receive the updated CSS immediately.

## Blog: Home notes

Read the blog at <https://arinhandyman.com/blog/>. Four initial guides cover draughty doors, painting preparation, bathroom planning in Halton, and recurring grout or shower problems. Each has inline citations, original-source links, publication information, and a source-check date.

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
- [`site/llms.txt`](site/llms.txt) provides a concise business summary, service-area links, article descriptions, and the site's email enquiry details for agents. It follows the [llms.txt proposal](https://llmstxt.org/); it is supplementary guidance, not a promise of indexing or recommendations.
- [`site/robots.txt`](site/robots.txt) is served at the custom-domain root and allows crawling, with the canonical sitemap URL. Noindex pages remain crawlable so crawlers can read that metadata.

The homepage and generated blog pages link to the sitemap and llms.txt in their HTML heads. The homepage also has `WebSite` structured data; the blog retains its `Blog` and `BlogPosting` metadata. These describe the existing content and approved phone and email contact details. The business plan stays out of discovery files and retains `noindex,nofollow`; do not block its crawling, since crawlers need to read that metadata.

Run `node scripts/build-discovery.mjs` after generating the blog whenever articles, canonical URLs, or discovery copy change, then run `node scripts/build-discovery.mjs --check`. Edit summary wording in the generator when the business information changes; never hand-edit its three generated files. Commit the generator and outputs together. CI rejects missing or stale outputs.

After deployment, verify `/llms.txt`, `/sitemap.xml`, and their linked public pages. The sitemap was submitted in Google Search Console on October 28, 2026, with status **Success** and six discovered pages. The domain property `arinhandyman.com` is verified under `aries@magnascale.com` using a Cloudflare TXT record; retain that record. Search Console's URL Inspection confirmed the homepage is indexed. Submission does not guarantee every article is indexed, and future additions are discovered when Google rereads the sitemap. Bing Webmaster Tools has not been configured by this integration. [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) explains submission and canonical URLs. Standard crawlable content remains the foundation: [Google's AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) does not require special AI files and does not guarantee inclusion.

## Website analytics

Google Analytics and Microsoft Clarity are managed under **aries@magnascale.com** for **Arin Handyman and Contracting**:

- GA4 account: `MagnascaleWebsite` (`336652256`); dedicated Arin property: `561304448`; web stream: `16225476949`; measurement ID: `G-2XSD91R1NJ`. Reporting uses Toronto time and Canadian dollars.
- Clarity project: `z528akcxqr`, website `https://arinhandyman.com`, connected to Arin's GA4 property. Clarity's default Cookies switch is off (Consent Mode); the website passes analytics consent after acceptance while keeping advertising consent denied. Bot detection remains enabled.
- Search Console: domain property `arinhandyman.com`, linked to Arin's GA4 web stream.

`site/analytics.js` loads both providers only after a visitor accepts analytics. The shared footer explains analytics and provides preferences to decline or withdraw consent. A browser-local choice expires after 180 days. Advertising consent remains denied. No vendor scripts load on local previews, and the separate business plan does not include the loader. Google page-location data omits query strings and fragments; referral information is reduced to its origin. No user IDs or enquiry content are explicitly sent. Provider scripts may collect their own usage data as described in the footer disclosures.

The blog generator copies the loader's versioned reference and shared footer from the homepage. Change public IDs in `site/analytics.js` only when intentionally migrating properties, increment its cache version in the homepage, and regenerate the blog. Never add account credentials, API secrets, or access tokens to the repository. Run `node scripts/check-analytics.mjs` to verify acceptance, refusal, persistence, expiry, withdrawal, storage failure, and local-preview exclusion. Confirm actual receipt in GA4 Realtime and Clarity after deployment; local checks alone do not prove data ingestion.

Implementation references: [Google consent mode](https://developers.google.com/tag-platform/security/guides/consent), [Clarity setup](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup), [Clarity consent API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2), and [Clarity disclosures](https://learn.microsoft.com/en-us/clarity/setup-and-installation/privacy-disclosure).

## Business plan

The business plan is written directly for Arin, the business owner, and lives at <https://arinhandyman.com/business-plan/>. Keep its advice addressed to him as “you” and treat outside setup/support help as optional and agreed, without assigning an ongoing role to a family member. It is intentionally absent from customer navigation and blog listings and carries `noindex,nofollow` metadata. It is still public, as is this repository; never add customer information, private credentials, or personal financial records.

Edit `docs/business-plan.md`, then regenerate the matching static HTML:

```sh
node scripts/build-business-plan.mjs
node scripts/build-business-plan.mjs --check
node scripts/build-blog.mjs --check
```

Commit the Markdown, renderer (if changed), and generated `site/business-plan/index.html` together. Do not format or hand-edit the generated HTML. The dependency-free renderer supports one `#` title, `##` sections, `###` subsections, paragraphs, flat `-` and numbered lists, pipe tables, bold text, inline code, and Markdown links. It escapes raw HTML and rejects unsafe link schemes, malformed tables, and broken heading anchors. Citations use `[1](#source-1)` with a corresponding `### Source 1` heading. Keep research dates deliberate; re-open relevant sources before updating them.

The page uses its own embedded responsive/print styles, without the homepage JavaScript or shared CSS. Its Markdown, renderer and referenced SVG diagrams are its inputs; regeneration does not modify the homepage or blog. Standalone diagram syntax is `![Descriptive summary](../site/assets/plan-name-v1.svg)`: the path works in GitHub's Markdown view and is rewritten for the published page. Keep diagrams black and white with readable labels and a numeric viewBox; use a new versioned filename for revisions. The three original vector drawings summarize the job flow, responsibilities and launch stages, without representing completed customer work. Check phone/desktop layout, sources, arithmetic, diagrams and print output when revising it. Proposed prices and scenarios must stay labelled as unapproved planning assumptions. The report does not implement the proposed private operations system.

## Social link preview

The homepage includes static Open Graph and large-image Twitter Card metadata with the business name, description, canonical URL, image dimensions, and descriptive alternative text. Sharing crawlers can read these directly from the HTML without running JavaScript.

The branded image is `site/assets/social-preview-v4.jpg`, a 1200 × 630 JPEG at <https://arinhandyman.com/assets/social-preview-v4.jpg>. It retains the photographic design and cream, orange, and charcoal branding, with the small concept label removed. Earlier versioned previews remain available for cached links. Its editing prompt and provenance are recorded in `image-prompts.md`.

Sharing metadata uses absolute HTTPS URLs. When replacing the preview image, use a new versioned filename and update both the Open Graph and Twitter image tags together to avoid reusing an old image URL.

## Contact and launch details

- The approved enquiry address is **arin@youssefian.com**. The website displays it and provides a mail link with a short project brief; the visitor sends the message in their own email app or webmail.
- The approved public phone is **(416) 455-0606**, linked as `tel:+14164550606`. There is no contact form, enquiry storage, booking, payment integration, or backend. No email service credentials are needed. Mailbox delivery is not tested by the repository checks.
- The hero, project ideas, blog photographs, and existing layout are retained. The owner requested removing the visible AI/concept badges and captions. The gallery remains project ideas rather than a portfolio of completed customer work. Image provenance is retained below and in `image-prompts.md`.
- No fabricated testimonials, credentials, experience figures, or guarantees.
- Relative asset paths support project-path hosting. No package dependencies or remote fonts. Optional Google Analytics and Microsoft Clarity scripts load after visitor consent as documented above.
- Run `node scripts/check-site.mjs` before publishing. CI verifies local links, anchors, shared image dimensions, approved phone and email links, retained photographs, and the absence of demo forms and customer-facing concept labels.
- Confirm the services, service area, and inbox access with Arin before the business launch. Test the mail link in a configured email app, or copy the address into webmail.

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

The custom domain `arinhandyman.com` is managed in Cloudflare and configured in the repository’s GitHub Pages settings. Cloudflare DNS points the apex to GitHub Pages at `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`; `www` is a CNAME to `ariesyous.github.io`. These web records use DNS-only mode so GitHub Pages handles HTTPS and the www-to-apex redirect. The site uses a custom Actions workflow, so the domain must be managed in Pages settings; a CNAME file in the artifact does not configure it. See [GitHub’s custom-domain guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Email remains the approved `arin@youssefian.com` address; this domain setup does not configure new mailboxes or forwarding.

The domain is also verified for the `ariesyous` GitHub account. Keep the `_github-pages-challenge-ariesyous` TXT record in Cloudflare to retain that ownership verification. GitHub provisions the HTTPS certificate after DNS validation; once the certificate is approved, enable **Enforce HTTPS** in repository **Settings → Pages**. Issuance and DNS propagation can take up to 24 hours according to the GitHub guidance linked above.
