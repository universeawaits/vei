# vei — site rebuild toolkit

A working repo for turning existing websites into "prettier" rebuilds: research findings, reusable components, and the redesigns themselves, one subfolder per source site.

## Layout

```
sites/
  <site-slug>/
    research/       # Playwright scrape: raw HTML, full-page screenshots, extracted assets, notes.md (palette/type/structure findings)
    redesign/        # the rebuilt site (currently a single static index.html per site)
```

## Workflow per site

1. Scrape the source with Playwright (HTML, screenshots, computed styles, logo/asset files) into `sites/<slug>/research/`.
2. Write up findings in `research/notes.md` — palette, type, layout structure, facts to preserve (address, contact info, dates).
3. Build the rebuild in `redesign/` — original copy and artwork, informed by the research but not a verbatim copy of copyrighted text/logo assets unless we have the site owner's sign-off to reuse them directly.
4. Preview as a Claude Artifact before wiring into the deployment pipeline.

## Sites

- `sites/lyon-tango-festival/` — concept redesign of lyontangofestival.com.

## Still open

- GitHub repo + visibility, and the static hosting/deployment pipeline (one subpath per site) are not wired up yet — pending a few decisions (see conversation).
