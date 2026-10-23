// Keep development previews out of search results. Change deliberately at launch.
export const siteConfig = {
  indexing: "development",
  baseUrl: "https://ariesyous.github.io/arinwebsite/",
  brand: "Arin Handyman and Contracting",
  homeTitle: "Handyman services in Halton | Arin Handyman and Contracting",
  homeDescription:
    "Handyman repairs, drywall repair, interior painting, and room updates across Halton and the Greater Toronto Area. Website concept.",
};

export function robotsFor(mode) {
  if (mode === "development") return "noindex, follow";
  if (mode === "production") return "index, follow";
  throw new Error(
    `Unknown indexing mode: ${mode}. Use development or production.`,
  );
}

export const robots = robotsFor(siteConfig.indexing);
