# Working on Arin Handyman and Contracting

This is a static website for **Arin Handyman and Contracting**, serving Halton and the Greater Toronto Area. Keep the exact business name. Preserve the cream, charcoal, and orange branding and the readable text sizes.

## Before making changes

- Read `README.md`. For blog work, also read `docs/blog-workflow.md`.
- The publishing root is `site/`. GitHub Actions deploys it to `https://ariesyous.github.io/arinwebsite/` on pushes to `main`.
- Keep the site front-end only. The approved enquiry address is `arinhandyman@gmail.com`, displayed with a `mailto:` link. No public phone number, contact form, backend, or stored enquiries are configured.
- Retain the existing hero, project-idea, and blog images and layout. The owner approved removing the visible AI/concept badges and captions; do not remove or replace the photos as part of that cleanup. Image provenance remains in `image-prompts.md`.
- Do not invent completed projects, customer reviews, credentials, years of experience, service guarantees, prices, or an individual expert author. Keep the gallery titled “Project ideas”; do not describe these images as completed customer work or portraits of Arin.

## Blog source and generated output

- Edit `content/blog/posts.mjs` to add or revise articles.
- `scripts/build-blog.mjs` generates `site/blog/index.html`, each article's `index.html`, and the homepage section between `BLOG:START` and `BLOG:END`. Do not hand-edit generated content.
- Header, footer, icons, and shared asset versions come from `site/index.html`; regenerate the blog after changing these. Keep both homepage blog markers.
- Run `node scripts/build-blog.mjs` after source changes, then `node scripts/build-blog.mjs --check`. Commit the source and generated files together. CI refuses stale output.
- The generator has no package dependencies. It produces plain HTML; readers and sharing crawlers do not need JavaScript to read articles or metadata.

## Research and editorial standards

- Every article must answer a specific homeowner question and cite at least two sources actually opened and read for that article. Prefer Canadian government guidance, the relevant municipality or regulator, and manufacturer or trade-body technical documentation.
- Put numbered citations beside supported claims and record publisher, title, and the direct HTTPS URL in `sources`. Cite every listed source. Distinguish general guidance from a particular municipality's requirements or a manufacturer's system.
- Write original explanations, useful scope questions, and practical decision points. Do not pad articles to reach a word count, copy source text, fabricate research, or claim a professional review that did not happen.
- Verify permit, electrical, health, and other consequential claims against current primary guidance. Do not provide DIY instructions for hazardous materials, structural alterations, electrical work, or concealed-waterproofing repairs. Do not imply Arin holds an unverified trade licence.
- Set `published`, `updated`, and `checked` deliberately using the actual editorial dates. Recheck the relevant sources before updating `checked`; the generator intentionally does not auto-date content.
- Keep published slugs stable. Do not remove or rename a published article without an explicit URL/redirect plan.

## Verification and deployment

- Follow `docs/blog-workflow.md` for the complete authoring process and content example.
- Use relative links for page navigation and assets beneath `/arinwebsite/`; canonical, Open Graph, Twitter Card, and structured-data URLs must be absolute HTTPS URLs.
- When changing CSS or JavaScript, increment its cache version in the homepage and regenerate the blog. When changing a social image, use a new versioned image filename and update all sharing tags, including the generator's shared-image constant.
- Format source files before generation; formatting generated HTML afterward makes it stale. Run the generator again if needed.
- Check relevant desktop and phone layouts, links, citations, images, browser errors, and sharing metadata. After publishing, monitor the Actions run and verify the live URLs.
- Run `node scripts/check-site.mjs` before publishing to check public links, retained images, sharing metadata, and email contact details.
