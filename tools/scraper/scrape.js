#!/usr/bin/env node
/**
 * Reusable site-research scraper for the vei toolkit.
 *
 * Usage:
 *   node tools/scraper/scrape.js <url> <outDir> [--max-pages=8] [--same-origin-only]
 *
 * For each crawled page, saves:
 *   raw-html/<slug>.html        - full rendered HTML
 *   screenshots/<slug>.png      - full-page screenshot
 *   styles/<slug>.json          - computed color palette + font stack + heading sizes
 * Plus, at the outDir root:
 *   sitemap.json                - list of crawled pages + discovered nav links
 *   assets/                     - downloaded candidate logo/brand images
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

function slugify(u) {
  const { pathname } = new URL(u);
  const s = pathname.replace(/\/+$/, '').replace(/^\/+/, '') || 'index';
  return s.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'index';
}

async function extractStyleSummary(page) {
  return page.evaluate(() => {
    const colorCount = {};
    const fontCount = {};
    const els = document.querySelectorAll('body, body *');
    let sampled = 0;
    for (const el of els) {
      if (sampled > 4000) break;
      sampled++;
      const cs = getComputedStyle(el);
      for (const prop of ['color', 'background-color', 'border-color']) {
        const v = cs.getPropertyValue(prop);
        if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') {
          colorCount[v] = (colorCount[v] || 0) + 1;
        }
      }
      const ff = cs.getPropertyValue('font-family');
      if (ff) fontCount[ff] = (fontCount[ff] || 0) + 1;
    }
    const topColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k]) => k);
    const topFonts = Object.entries(fontCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k]) => k);
    const headingSizes = {};
    ['h1', 'h2', 'h3'].forEach((tag) => {
      const el = document.querySelector(tag);
      if (el) headingSizes[tag] = getComputedStyle(el).fontSize;
    });
    return { topColors, topFonts, headingSizes };
  });
}

async function findLogoCandidates(page) {
  return page.evaluate(() => {
    const candidates = [];
    document.querySelectorAll('img').forEach((img) => {
      const hay = (img.src + ' ' + img.alt + ' ' + img.className).toLowerCase();
      if (hay.includes('logo') || hay.includes('brand')) candidates.push(img.src);
    });
    document.querySelectorAll('[style*="background-image"]').forEach((el) => {
      const hay = (el.className + '').toLowerCase();
      if (hay.includes('logo') || hay.includes('brand')) {
        const m = getComputedStyle(el).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (m) candidates.push(m[1]);
      }
    });
    return [...new Set(candidates)];
  });
}

async function main() {
  const [, , startUrl, outDirArg, ...flags] = process.argv;
  if (!startUrl || !outDirArg) {
    console.error('Usage: node scrape.js <url> <outDir> [--max-pages=8]');
    process.exit(1);
  }
  const maxPages = Number((flags.find((f) => f.startsWith('--max-pages=')) || '').split('=')[1] || 8);
  const outDir = path.resolve(outDirArg);
  const dirs = ['raw-html', 'screenshots', 'styles', 'assets'];
  dirs.forEach((d) => fs.mkdirSync(path.join(outDir, d), { recursive: true }));

  const origin = new URL(startUrl).origin;
  const seen = new Set();
  const queue = [startUrl];
  const sitemap = [];

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  while (queue.length && seen.size < maxPages) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);

    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      console.error(`[skip] ${url}: ${e.message}`);
      await page.close();
      continue;
    }

    const slug = slugify(url);
    const html = await page.content();
    fs.writeFileSync(path.join(outDir, 'raw-html', `${slug}.html`), html);
    await page.screenshot({ path: path.join(outDir, 'screenshots', `${slug}.png`), fullPage: true });

    const styleSummary = await extractStyleSummary(page);
    fs.writeFileSync(path.join(outDir, 'styles', `${slug}.json`), JSON.stringify(styleSummary, null, 2));

    const logoCandidates = await findLogoCandidates(page);
    for (const src of logoCandidates) {
      try {
        const abs = new URL(src, url).toString();
        const resp = await context.request.get(abs);
        if (resp.ok()) {
          const ext = path.extname(new URL(abs).pathname) || '.img';
          fs.writeFileSync(path.join(outDir, 'assets', `logo-candidate-${seen.size}${ext}`), await resp.body());
        }
      } catch (e) {
        // best-effort only
      }
    }

    const navLinks = await page.evaluate((origin) =>
      [...document.querySelectorAll('a[href]')]
        .map((a) => a.href)
        .filter((h) => h.startsWith(origin)),
      origin
    );
    sitemap.push({ url, slug, title: await page.title(), links: [...new Set(navLinks)] });
    navLinks.forEach((l) => {
      const clean = l.split('#')[0];
      if (!seen.has(clean) && !queue.includes(clean)) queue.push(clean);
    });

    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, 'sitemap.json'), JSON.stringify(sitemap, null, 2));
  console.log(`Crawled ${seen.size} page(s). Output in ${outDir}`);
}

main();
