/**
 * Sync locale files: merge en.json structure with per-language overrides.
 * Run: node scripts/build-i18n.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '../src/i18n/locales');

function deepMerge(base, override) {
  if (!override || typeof override !== 'object' || Array.isArray(override)) return override ?? base;
  const out = { ...base };
  for (const key of Object.keys(override)) {
    if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key]) && base[key]) {
      out[key] = deepMerge(base[key], override[key]);
    } else if (override[key] !== undefined) {
      out[key] = override[key];
    }
  }
  return out;
}

const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));

const overrides = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'locale-overrides.json'), 'utf8')
);

for (const lang of Object.keys(overrides)) {
  const existing = fs.existsSync(path.join(localesDir, `${lang}.json`))
    ? JSON.parse(fs.readFileSync(path.join(localesDir, `${lang}.json`), 'utf8'))
    : {};
  const merged = deepMerge(deepMerge(en, existing), overrides[lang]);
  fs.writeFileSync(path.join(localesDir, `${lang}.json`), `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Updated ${lang}.json`);
}

console.log('Done.');
