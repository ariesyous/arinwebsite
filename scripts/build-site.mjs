// Blog generation also synchronizes homepage metadata and compact previews.
await import("./build-blog.mjs");
if (process.exitCode) process.exit(process.exitCode);
await import("./build-services.mjs");
await import("./check-site.mjs");
