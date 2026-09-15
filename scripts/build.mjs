import { readdirSync, existsSync, cpSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import path from 'path';

const sitesDir = 'sites';
const outDir = '_site';

if (existsSync(outDir)) rmSync(outDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

const slugs = existsSync(sitesDir)
  ? readdirSync(sitesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .filter((slug) => existsSync(path.join(sitesDir, slug, 'redesign', 'index.html')))
  : [];

for (const slug of slugs) {
  cpSync(path.join(sitesDir, slug, 'redesign'), path.join(outDir, slug), { recursive: true });
}

const rows = slugs
  .map((slug) => {
    const title = slug
      .split('-')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ');
    return `      <li><a href="./${slug}/">${title}</a></li>`;
  })
  .join('\n');

writeFileSync(
  path.join(outDir, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>vei</title>
<style>
  :root{
    --bg:#f6f2e9; --fg:#241f3a; --muted:#5a5270; --accent:#c81f3a; --card:#ffffff; --border:#e2d9c4;
    padding-top:env(safe-area-inset-top, 0px); padding-bottom:env(safe-area-inset-bottom, 0px);
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]){ --bg:#0b0e26; --fg:#f3efe4; --muted:#b9b6cf; --accent:#ef4361; --card:#141935; --border:#2a2f57; }
  }
  :root[data-theme="dark"]{ --bg:#0b0e26; --fg:#f3efe4; --muted:#b9b6cf; --accent:#ef4361; --card:#141935; --border:#2a2f57; }
  *{box-sizing:border-box;}
  body{margin:0;background:var(--bg);color:var(--fg);font-family:-apple-system,"Segoe UI",sans-serif;padding:4rem 1.25rem 5rem;}
  main{max-width:640px;margin:0 auto;}
  h1{font-size:1.6rem;margin:0 0 0.4rem;letter-spacing:-0.01em;}
  p.lede{color:var(--muted);margin:0 0 2.5rem;line-height:1.5;}
  ul{list-style:none;padding:0;margin:0;display:grid;gap:0.85rem;}
  li{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem 1.25rem;}
  a{color:var(--fg);text-decoration:none;font-weight:600;font-size:1.05rem;}
  a:hover{color:var(--accent);}
  footer{margin-top:3rem;color:var(--muted);font-size:0.8rem;}
  footer a{color:inherit;}
</style>
</head>
<body>
<main>
  <h1>vei</h1>
  <p class="lede">A toolkit for rebuilding existing websites into cleaner, prettier static versions — research, tooling, and redesigns kept for future work, one sub-page per site.</p>
  <ul>
${rows || '    <li>No sites built yet.</li>'}
  </ul>
  <footer>Source: <a href="https://github.com/universeawaits/vei">github.com/universeawaits/vei</a></footer>
</main>
</body>
</html>
`
);

console.log(`Built ${slugs.length} site(s): ${slugs.join(', ') || '(none)'}`);
