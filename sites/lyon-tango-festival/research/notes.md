# Lyon Tango Festival — research notes

Source: https://lyontangofestival.com/ — scraped with Playwright (chromium) on 2026-09-15.
8 pages crawled: home + 7 teacher bio subpages. `page-data.json` has computed styles per page. Raw HTML in `raw-html/`, full-page screenshots in `screenshots/`, logo in `assets/logo.png`.

## Palette (as rendered)
- Background (deep navy): `rgb(0,2,43)` / `rgb(6,10,45)`
- Accent red (headings, script wordmark): `rgb(208,2,27)`
- CTA green (Tickets button): `rgb(12,150,69)`
- Body text on white sections: `rgb(51,51,51)`
- White text on navy: `rgb(255,255,255)`

## Type
- Script/display (wordmark, section titles): `"Great Vibes", cursive`
- Body/nav/buttons: system font stack (`system-ui, -apple-system, "Segoe UI", Roboto, ...`)

## Structure
- Sticky header: script wordmark, nav (Teachers, Live Music, DJ, Schedule & Location, Languages dropdown), green "Tickets" pill button (floats top-right, sometimes with a "Limited places" subline).
- Hero: full-bleed dark background with red/blue smoke-style photo treatment, edition tag ("Nth [name] Edition"), large script title, date range.
- Below hero: a framed photo with a small circular logo badge overlaid bottom-left.
- Teacher subpages: script name as H1, "Performing on [day]" line, a short bio paragraph, then a "Classes" block listing sessions per day with time ranges in a highlighted color and a "☞ venue" line.
- Footer (same on every page): script wordmark repeated, nav link row, address block, email, WhatsApp, two secondary logo marks (TNT Lyon Tango, LTF roundel).

## Facts worth keeping across any rebuild
- Venue: «Salle des fêtes de La Garenne» — 60 avenue Général Eisenhower, 69005 Lyon
- Email: tangopasion19@gmail.com
- WhatsApp: +33 6 16 18 41 15
- Organised in collaboration with TNT Lyon Tango

## What we deliberately did NOT copy into the redesign
- Their actual logo artwork/photo assets — redrew an original circular emblem instead.
- Their marketing/bio copy — rewrote everything in original wording; kept real teacher **names** (facts) but not their bios.
- Exact hex values — shifted to an adjacent but original palette (see `redesign/index.html` `:root` tokens) so the "prettier version" isn't a pixel clone, while keeping the same navy/red/jade mood and layout rhythm.

Reason: the live site's text and logo file are the operator's copyrighted material; a "rebuild" for design-reference purposes should preserve structure/mood/facts, not reproduce their protected content verbatim. Flag this if the actual site owner wants a literal asset-for-asset clone — that needs their sign-off either way.
