# vei

A toolkit for rebuilding existing websites into cleaner, prettier, static versions — and a growing archive of the tooling, components, and design findings gathered along the way.

Each source site gets its own folder under `sites/<slug>/`, deployed to its own sub-path via GitHub Pages. Nothing here is a live clone of the original site's copyrighted text or artwork — each rebuild is an original reinterpretation of the source's layout, structure, and brand direction, produced from design research rather than a byte-for-byte copy.

## Layout

```
vei/
├── sites/                  one folder per rebuilt site
│   └── <slug>/
│       ├── research/       Playwright scrape output: HTML, screenshots, color/font extraction, sitemap
│       └── src/             the rebuilt static site (deployed as-is)
├── tools/
│   └── scraper/            reusable Playwright research scraper (tools/scraper/scrape.js)
├── components/             shared UI snippets/patterns reused across rebuilds
└── .github/workflows/       GitHub Pages deployment pipeline
```

## Workflow for a new site

1. Research: `cd tools/scraper && npm install && npx playwright install chromium`, then
   `node scrape.js https://example.com ../../sites/<slug>/research --max-pages=8`
2. Review the scrape output in `sites/<slug>/research/` (screenshots, extracted color palette/fonts, sitemap, candidate logo assets).
3. Build the rebuild in `sites/<slug>/src/` — plain HTML/CSS (or a lightweight framework if the site warrants it).
4. Add the site to the root `index.html` list.
5. Push to `main` — the Pages workflow deploys automatically.

## Sites rebuilt so far

- **Lyon Tango Festival** (`sites/lyon-tango-festival/`) — rebuild of lyontangofestival.com
