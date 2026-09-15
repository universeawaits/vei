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
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>vei — site rebuilds</title>
<style>
  :root{color-scheme:dark;}
  body{font-family:-apple-system,"Segoe UI",sans-serif;background:#0b0e26;color:#f3efe4;max-width:640px;margin:0 auto;padding:64px 24px;}
  h1{font-size:26px;margin:0 0 8px;}
  p{color:#b9b6cf;margin:0 0 32px;}
  ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;}
  a{color:#ef4361;font-size:17px;text-decoration:none;font-weight:600;}
  a:hover{text-decoration:underline;}
</style>
</head>
<body>
  <h1>vei</h1>
  <p>Site rebuilds — research, components, and redesigns kept for future work.</p>
  <ul>
${rows || '      <li>No sites built yet.</li>'}
  </ul>
</body>
</html>
`
);

console.log(`Built ${slugs.length} site(s): ${slugs.join(', ') || '(none)'}`);
