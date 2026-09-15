#!/usr/bin/env node
// Generates real, on-site detail pages for every teacher, the live-music act,
// and every DJ, instead of linking out to the source festival's site.
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const ROOT = path.resolve('sites/lyon-tango-festival/redesign');

const TEACHERS = [
  { first: 'Lucila', last: 'Cionci', partnerFirst: 'Joe', partnerLast: 'Corbata', slug: 'lucila-cionci-joe-corbata', day: 'Saturday', hue: 350 },
  { first: 'Ariadna', last: 'Naveira', partnerFirst: 'Fernando', partnerLast: 'Sanchez', slug: 'ariadna-naveira-fernando-sanchez', day: 'Thursday', hue: 15 },
  { first: 'Monica', last: 'Romero', partnerFirst: 'Omar', partnerLast: 'Ocampo', slug: 'monica-romero-omar-ocampo', day: 'Thursday', hue: 265 },
  { first: 'Juana', last: 'Sepulveda', partnerFirst: 'Chicho', partnerLast: 'Frumboli', slug: 'juana-sepulveda-chicho-frumboli', day: 'Sunday', hue: 210 },
  { first: 'Indira', last: 'Hiayes', partnerFirst: 'Rodrigo', partnerLast: 'Palacios', slug: 'indira-hiayes-rodrigo-palacios', day: 'Friday', hue: 320 },
  { first: 'Virginia', last: 'Gomez', partnerFirst: 'Christian', partnerLast: 'Marquez', slug: 'virginia-gomez-christian-marquez', day: 'Sunday', hue: 40 },
  { first: 'Roxana', last: 'Suarez', partnerFirst: 'Dante', partnerLast: 'Sanchez', slug: 'roxana-suarez-dante-sanchez', day: 'Friday', hue: 250 },
  { first: 'Vanesa', last: 'Villalba', partnerFirst: 'Facundo', partnerLast: 'Piñero', slug: 'vanesa-villalba-facundo-pinero', day: 'Saturday', hue: 5 },
  { first: 'Agustina', last: 'Piaggio', partnerFirst: 'Carlos', partnerLast: 'Espinoza', slug: 'agustina-piaggio-carlos-espinoza', day: null, hue: 230 },
];

const DJS = [
  { name: 'Rosita Lagos-Diaz', slug: 'rosita-lagos-diaz', slot: 'Thursday night', hue: 340 },
  { name: 'Guillermo Monti', slug: 'guillermo-monti', slot: 'Friday night', hue: 25 },
  { name: 'Utku Küley', slug: 'utku-kuley', slot: 'Saturday afternoon', hue: 200 },
  { name: 'Diego Doigneau', slug: 'diego-doigneau', slot: 'Saturday night', hue: 270 },
  { name: 'Gabbo Fresedo', slug: 'gabbo-fresedo', slot: 'Sunday afternoon', hue: 330 },
  { name: 'Braulio Martos', slug: 'braulio-martos', slot: 'Sunday night', hue: 230 },
];

const LIVE_MUSIC = [
  { name: 'Ensemble Sin Vuelta Orquesta', slug: 'ensemble-sin-vuelta-orquesta', note: 'Closing-night live set', hue: 150 },
];

function scriptName(first, last) {
  return `<span class="cap">${first[0]}</span>${first.slice(1)} ${last}`;
}

function header(base) {
  return `<header class="site past-hero">
  <div class="wrap nav-row">
    <a class="wordmark" href="${base}index.html#hero">Lyon Tango Festival</a>
    <nav class="links">
      <div class="nav-drop">
        <button type="button" class="nav-drop-trigger">Teachers <span class="chev" aria-hidden="true">⌄</span></button>
        <div class="drop-panel">
          ${TEACHERS.map(t => `<a href="${base}teachers/${t.slug}/">${t.first} ${t.last} &amp; ${t.partnerFirst} ${t.partnerLast}</a>`).join('\n          ')}
        </div>
      </div>
      <div class="nav-drop">
        <button type="button" class="nav-drop-trigger">Live Music <span class="chev" aria-hidden="true">⌄</span></button>
        <div class="drop-panel">
          ${LIVE_MUSIC.map(a => `<a href="${base}live-music/${a.slug}/">${a.name}</a>`).join('\n          ')}
        </div>
      </div>
      <a href="${base}index.html#dj">DJ</a>
      <a href="${base}index.html#schedule">Schedule &amp; Location</a>
      <div class="nav-drop">
        <button type="button" class="nav-drop-trigger">More <span class="chev" aria-hidden="true">⌄</span></button>
        <div class="drop-panel">
          <a href="${base}index.html#stay">Stay</a>
          <a href="${base}index.html#passes">Passes</a>
          <a href="${base}index.html#partners">Partners</a>
        </div>
      </div>
    </nav>
    <a class="btn btn-jade" href="${base}index.html#tickets">Tickets</a>
    <select class="lang-select" id="site-lang" aria-label="Language">
      <option value="en" selected>EN</option>
      <option value="fr">FR</option>
      <option value="es">ES</option>
    </select>
  </div>
</header>`;
}

function footer(base) {
  return `<footer id="contact">
  <div class="wrap">
    <div class="footer-grid">
      <div class="col">
        <div class="wordmark">Lyon Tango Festival</div>
        <p>In collaboration with TNT Lyon Tango and Lyon Tango Festival.</p>
      </div>
      <div class="col">
        <h4>Explore</h4>
        <a href="${base}index.html#teachers">Teachers</a>
        <a href="${base}index.html#live-music">Live Music</a>
        <a href="${base}index.html#dj">DJ</a>
        <a href="${base}index.html#schedule">Schedule &amp; Location</a>
        <a href="${base}index.html#stay">Stay</a>
        <a href="${base}index.html#passes">Passes</a>
        <a href="${base}index.html#partners">Partners</a>
      </div>
      <div class="col selectable">
        <h4>Contact</h4>
        <p>«Salle des fêtes de La Garenne»<br/>60 avenue Général Eisenhower<br/>69005, Lyon</p>
        <a href="mailto:tangopasion19@gmail.com">tangopasion19@gmail.com</a>
        <a href="https://wa.me/33616184115">WhatsApp +33 6 16 18 41 15</a>
      </div>
    </div>
    <div class="foot-bottom">
      <span>Unofficial concept redesign — layout &amp; palette study, built as a design reference.</span>
      <span>Body text is locked from selection; contact details above stay copyable.</span>
    </div>
  </div>
</footer>`;
}

function page({ title, base, backHref, backLabel, hue, nameHtml, meta, blurb }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${title} — Lyon Tango Festival</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/theme.css">
<style>
  .detail-wrap{padding-top:calc(72px + clamp(48px, 8vw, 84px)); padding-bottom:clamp(48px, 8vw, 84px);}
  .back-link{display:inline-flex; align-items:center; gap:6px; color:var(--ink-on-paper-soft); font-size:13px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; margin-bottom:28px;}
  .back-link:hover{color:var(--ember);}
  .detail-card{max-width:640px; aspect-ratio:16/9;}
  .detail-card .people-name{font-size:clamp(24px, 3.4vw, 34px);}
  .detail-blurb{margin-top:28px; max-width:60ch; font-size:16px; line-height:1.7; color:var(--ink-on-paper-soft);}
</style>
</head>
<body>

${header(base)}

<main>
  <section class="wrap detail-wrap">
    <a class="back-link" href="${backHref}">&larr; Back to ${backLabel}</a>
    <div class="people-card detail-card" style="--hue:${hue}">
      <div class="people-photo"></div>
      <div class="people-info">
        <p class="people-name">${nameHtml}</p>
        ${meta ? `<span class="people-meta">${meta}</span>` : ''}
      </div>
    </div>
    <p class="detail-blurb">${blurb}</p>
  </section>
</main>

${footer(base)}

<script src="${base}assets/site.js"></script>
</body>
</html>
`;
}

const base = '../../';

for (const t of TEACHERS) {
  const dir = path.join(ROOT, 'teachers', t.slug);
  mkdirSync(dir, { recursive: true });
  const nameHtml = `${scriptName(t.first, t.last)} <span class="amp">&amp;</span> ${scriptName(t.partnerFirst, t.partnerLast)}`;
  const blurb = 'One of the visiting teacher pairs joining this edition of the Lyon Tango Festival programme.';
  writeFileSync(path.join(dir, 'index.html'), page({
    title: `${t.first} ${t.last} & ${t.partnerFirst} ${t.partnerLast}`,
    base,
    backHref: `${base}index.html#teachers`,
    backLabel: 'Teachers',
    hue: t.hue,
    nameHtml,
    meta: t.day ? `Performing ${t.day}` : '',
    blurb,
  }));
}

for (const a of LIVE_MUSIC) {
  const dir = path.join(ROOT, 'live-music', a.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), page({
    title: a.name,
    base,
    backHref: `${base}index.html#live-music`,
    backLabel: 'Live Music',
    hue: a.hue,
    nameHtml: a.name,
    meta: a.note,
    blurb: 'The festival\'s live orchestra, closing out the weekend with a full live set.',
  }));
}

for (const d of DJS) {
  const dir = path.join(ROOT, 'dj', d.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), page({
    title: d.name,
    base,
    backHref: `${base}index.html#dj`,
    backLabel: 'DJ',
    hue: d.hue,
    nameHtml: d.name,
    meta: d.slot,
    blurb: 'Part of the resident DJ line-up spinning tandas across the festival\'s milongas.',
  }));
}

console.log(`Built ${TEACHERS.length} teacher pages, ${LIVE_MUSIC.length} live-music page(s), ${DJS.length} DJ pages.`);
