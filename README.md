# Arin Handyman and Contracting

A responsive static website for home repairs and renovations across Halton and the Greater Toronto Area, with a sourced homeowner blog. The publishing root is `site/`.

## Contact and public content

The approved business email is **arinhandyman@gmail.com**. The contact section displays the address and provides a `mailto:` link with a short project brief. Visitors send the message through their own email app or webmail. The website has no contact form, backend, enquiry storage, booking, payment integration, trackers, remote fonts, or third-party scripts. No public phone number is configured.

The site uses cream, charcoal, and orange branding with readable text sizes. It has no AI-generated photography, dummy contact details, fabricated reviews, credentials, guarantees, or project claims. The social preview is a plain branded graphic. Add only approved business photos with permission; the site works without them.

## Local preview and checks

Requires Node.js 18 or newer. No packages to install.

```sh
node scripts/build-blog.mjs
node scripts/build-discovery.mjs
node scripts/build-business-plan.mjs
node scripts/build-blog.mjs --check
node scripts/build-discovery.mjs --check
node scripts/build-business-plan.mjs --check
node scripts/check-site.mjs
node --check site/script.js
git diff --check
node scripts/serve.mjs
```

Open <http://localhost:4173/arinwebsite/>. Stop with Ctrl+C. The project path matches GitHub Pages. Generated HTML is committed; no build runs in the visitor's browser.

The production check verifies local links and anchors, sharing images, JSON-LD, the approved email links, and the absence of demo content, forms, and retired generated photos. Review desktop and phone layouts and browser errors too. Mail links open the visitor's email application; they do not submit or confirm delivery on the website.

## Deployment

`.github/workflows/deploy-pages.yml` checks the source and generated outputs, then deploys only `site/` on pushes to `main` or manual dispatch. Set repository **Settings → Pages → Source** to **GitHub Actions**.

Live URL: <https://ariesyous.github.io/arinwebsite/>.

The workflow uses the `github-pages` environment and built-in `GITHUB_TOKEN`. No email credentials, Cloudflare configuration, or external form provider is required. Deployments are serialized without interrupting an active publication.

Before launch, confirm the published services and service area with Arin and confirm that he can receive and reply from the approved inbox. Check the displayed address and mail link on a phone and desktop with an email app, and copy the address into webmail if no app is configured. Send any mailbox delivery test manually; the repository checks do not send email.

After publishing, monitor the Actions run and verify the homepage, contact section, all blog URLs, sharing image, sitemap, and llms.txt at the live URL. The former `/business-plan/` URL redirects to the homepage and stays out of the sitemap. The planning report is excluded from the Pages artifact.

## Home notes

Article source: `content/blog/posts.mjs`. Generated output: `site/blog/index.html`, each stable article URL, and the homepage between `BLOG:START` and `BLOG:END`. Never hand-edit generated content. Read [the authoring and research workflow](docs/blog-workflow.md) and [AGENTS.md](AGENTS.md) before changing articles.

Regenerate the blog after editing the homepage header, footer, icons, or asset versions. Increment CSS and JavaScript cache versions when changing those files. Cards and articles are text-only; the shared social graphic supplies the sharing image. Layout-only changes do not redate editorial or source-check records. Reopen relevant sources before changing `checked`.

## Discovery and sharing

`scripts/build-discovery.mjs` generates `site/sitemap.xml`, `site/llms.txt`, and `site/robots.txt`. Run it after the blog generator or any canonical/discovery-copy change. CI rejects stale generated files. The homepage and blog pages include canonical URLs, Open Graph, Twitter Cards, JSON-LD, and links to the discovery files. Canonical and sharing URLs are absolute HTTPS; navigation and assets use relative paths beneath `/arinwebsite/`.

The project-path `robots.txt` does not set an origin-wide crawling policy: crawlers use `https://ariesyous.github.io/robots.txt`, which this deployment does not manage. If managing that origin root, merge the directives without overwriting other projects' rules. Submit the sitemap through verified Search Console or Bing Webmaster Tools if desired; this repository does not submit it or guarantee indexing.

The sharing image is `site/assets/social-preview-v3.jpg`, a 1200 × 630 cream, charcoal, and orange graphic with the business name and service area. It contains no photography. Rebuild it on Windows using `scripts/build-social-preview.ps1` (System.Drawing). For future changes, use a new versioned filename and update all sharing tags and both HTML generators' social-image constants. Retired AI-generated photographs and social images were removed from the publishing root; their earlier history remains in Git.

## Business planning report

The planning source remains at `docs/business-plan.md`. `scripts/build-business-plan.mjs` renders it to `docs/business-plan/index.html` for local review, outside the publishing root. Keep source, renderer, and output together. Open that HTML file directly to view it. Its relative icon, diagram, and website links work locally.

The report records proposals and assumptions as of its stated research date; it is not a public service or price list. Keep advice addressed to Arin as “you,” and keep source-check dates deliberate. It is still available in this public repository; do not add private customer information, credentials, or personal financial records. The report does not implement an operations system.
