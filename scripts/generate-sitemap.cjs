/**
 * Sitemap generator — merges existing static URLs with fault-code deep links.
 * Run: node scripts/generate-sitemap.cjs
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://www.hvacsalesmaster.com';
const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'fault-codes');
const OUTPUT = path.join(__dirname, '..', 'public', 'sitemap.xml');
const TODAY = new Date().toISOString().slice(0, 10);

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Read existing sitemap and extract static URLs
const existingXml = fs.readFileSync(OUTPUT, 'utf8');
const staticUrls = [];
const locRegex = /<loc>(.*?)<\/loc>/g;
let match;
while ((match = locRegex.exec(existingXml)) !== null) {
  const url = match[1];
  // Skip any old fault-code URLs that might already exist
  if (!url.includes('/troubleshoot/codes')) {
    staticUrls.push(url);
  }
}

// Build fault-code URLs from the dataset
const faultCodeUrls = [];
const index = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'brand-families-index.json'), 'utf8'));

// Tool landing page
faultCodeUrls.push(`${SITE}/troubleshoot/codes`);

for (const family of index.brand_families) {
  if (family.status !== 'normalized') continue;

  const filePath = path.join(DATA_DIR, path.basename(family.file_path));
  if (!fs.existsSync(filePath)) continue;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Brand page
  faultCodeUrls.push(`${SITE}/troubleshoot/codes/${data.brand_family_id}`);

  for (const platform of data.platforms) {
    // Platform page
    faultCodeUrls.push(`${SITE}/troubleshoot/codes/${data.brand_family_id}/${platform.platform_id}`);

    for (const code of platform.codes) {
      // Individual code result page
      const codeSlug = slugify(code.code_id);
      faultCodeUrls.push(`${SITE}/troubleshoot/codes/${data.brand_family_id}/${platform.platform_id}/${codeSlug}`);
    }
  }
}

// Merge and emit
const allUrls = [...staticUrls, ...faultCodeUrls];
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
];

for (const url of allUrls) {
  lines.push(`  <url><loc>${url}</loc><lastmod>${TODAY}</lastmod></url>`);
}

lines.push('</urlset>');
lines.push('');

fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
console.log(`Sitemap generated: ${allUrls.length} URLs (${staticUrls.length} static + ${faultCodeUrls.length} fault-code)`);
