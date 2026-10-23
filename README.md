# Rene Handyman and Contracting

A responsive, front-end-only concept for home repairs and renovations across Halton and the Greater Toronto Area.

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

## Concept details

- `(416) 555-0148` is a clearly marked placeholder, not a call link.
- The form validates locally and displays a demo confirmation. It sends no requests and stores no personal information. Inputs have no `name` attributes, preventing native form serialization if JavaScript is unavailable.
- Photographs are AI-generated inspiration, not photographs of Rene or completed customer projects; the page labels them accordingly.
- No fabricated testimonials, credentials, experience figures, or guarantees.
- Relative asset paths support project-path hosting. No runtime dependencies, trackers, remote fonts, third-party scripts, or external APIs.

## Image provenance

Four photographs were generated specifically for this concept using the built-in OpenAI image generation tool and optimized locally to WebP. Full prompts are in `image-prompts.md`.

| Asset in `site/assets/` | Subject                                                  |
| ----------------------- | -------------------------------------------------------- |
| `carpentry.webp`        | Carpenter adjusting oak kitchen cabinetry; hero image.   |
| `painting.webp`         | Painter refreshing a wall with floor protection.         |
| `tiling.webp`           | Gloved tiler positioning ivory bathroom tiles.           |
| `deck.webp`             | Carpenter fastening cedar boards in a suburban backyard. |

Replace concept imagery and contact details with approved business material when turning this prototype into an operational enquiry website.
