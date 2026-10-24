// Gera as páginas em inglês (en/index.html e en/simuladores/*/index.html) a partir das páginas em português.
// Uso: node scripts/build-en-pages.mjs           escreve os arquivos
//      node scripts/build-en-pages.mjs --check   só confere se os arquivos de en/ estão em dia (usado no CI)
// O português é a fonte. Os textos em inglês ficam em scripts/en-strings.mjs; texto sem tradução faz o script falhar.

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { common, home, keywords, published, rules, same, simulators } from './en-strings.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://labofalgorithms.com';
const LETTERS = /[A-Za-zÀ-ÿ]/;
const checkOnly = process.argv.includes('--check');
const missing = [];

const translateText = (text, page) => {
  const key = text.replace(/\s+/g, ' ').trim();
  if (!LETTERS.test(key)) return text;
  if (same.has(key)) return text;
  const table = page.home ? { ...common, ...home } : common;
  let en = table[key];
  if (en === undefined) for (const [re, out] of rules) if (re.test(key)) { en = key.replace(re, out); break; }
  if (en === undefined) { missing.push(`${page.file}: "${key.slice(0, 90)}"`); return text; }
  return text.replace(key.length ? text.trim() : text, en).replace(/&(?![a-z#0-9]+;)/g, '&amp;');
};

const enUrl = (url) => url.replace(`${BASE}/`, `${BASE}/en/`);

const rewritePath = (value) => {
  const m = value.match(/^((?:\.\.?\/)+)(src\/|assets\/)/);
  if (!m) return value;
  return value.startsWith('./') ? `.${value}` : `../${value}`;
};

function translateTag(tag, page) {
  if (/^<html\b/i.test(tag)) return tag.replace('lang="pt-BR"', 'lang="en"');
  const attrs = [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].reduce((o, m) => ({ ...o, [m[1]]: m[2] }), {});
  const set = (name, value) => { tag = tag.replace(new RegExp(`(\\b${name}=")[^"]*(")`), (_, a, b) => `${a}${value}${b}`); };
  for (const name of ['aria-label', 'title', 'placeholder', 'alt']) if (name in attrs) set(name, translateText(attrs[name], page));
  if ('data-keywords' in attrs) {
    const en = keywords[attrs['data-keywords']];
    if (en === undefined) missing.push(`${page.file}: palavras-chave "${attrs['data-keywords']}"`);
    else set('data-keywords', `${attrs['data-keywords']} ${en}`);
  }
  for (const name of ['href', 'src']) if (name in attrs) set(name, rewritePath(attrs[name]));
  if (/^<link\b/i.test(tag) && attrs.rel === 'canonical') set('href', enUrl(attrs.href));
  if (/^<meta\b/i.test(tag) && 'content' in attrs) {
    const key = attrs.property ?? attrs.name;
    const sim = page.sim;
    const tr = () => translateText(attrs.content, page);
    const value = {
      description: () => (sim ? sim.description : tr()),
      'og:title': () => (sim ? `LabOfAlgorithms · ${sim.name}` : tr()),
      'og:description': () => (sim ? sim.description : tr()),
      'og:url': () => enUrl(attrs.content),
      'og:locale': () => 'en_US',
      'og:image': () => (sim ? `${BASE}/assets/og/en/${page.slug}.jpg` : attrs.content),
      'og:image:alt': () => (sim ? `Card for the ${sim.name} simulator, by LabOfAlgorithms.` : tr()),
    }[key]?.();
    if (value !== undefined) set('content', value);
  }
  return tag;
}

function translateJsonLd(json, page) {
  const data = JSON.parse(json);
  data.inLanguage = 'en';
  data.url = enUrl(data.url);
  if (page.sim) {
    data.name = page.sim.name;
    data.about = page.sim.name;
    data.description = page.sim.description;
    data.image = `${BASE}/assets/og/en/${page.slug}.jpg`;
    data.learningResourceType = 'Interactive simulator';
  } else {
    data.description = translateText(data.description, page);
  }
  const body = JSON.stringify(data, null, 2).split('\n').map((l) => `  ${l}`).join('\n');
  return `\n${body}\n  `;
}

function translatePage(html, page) {
  const out = [];
  const tokens = html.match(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? [];
  let inTitle = false;
  for (const token of tokens) {
    if (token.startsWith('<script')) {
      if (/application\/ld\+json/.test(token)) {
        out.push(token.replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/, (_, a, body, c) => `${a}${translateJsonLd(body, page)}${c}`));
      } else out.push(translateTag(token.match(/^<script[^>]*>/)[0], page) + token.slice(token.match(/^<script[^>]*>/)[0].length));
    } else if (token.startsWith('<style') || token.startsWith('<!--')) out.push(token);
    else if (token.startsWith('<')) {
      if (/^<title\b/i.test(token)) inTitle = true;
      if (/^<\/title/i.test(token)) inTitle = false;
      out.push(translateTag(token, page));
    } else if (inTitle) {
      out.push(page.sim ? `LabOfAlgorithms · ${page.sim.name}` : translateText(token, page));
    } else out.push(translateText(token, page));
  }
  let result = out.join('');
  if (!published) result = result.replace(/(<meta name="viewport"[^>]*>\n)/, '$1  <meta name="robots" content="noindex" />\n');
  return result;
}

const pages = [{ src: 'index.html', dest: 'en/index.html', file: 'index.html', home: true }];
const slugs = readdirSync(join(ROOT, 'simuladores')).filter((n) => statSync(join(ROOT, 'simuladores', n)).isDirectory()).sort();
for (const slug of slugs) {
  const info = simulators[slug];
  if (!info) { missing.push(`scripts/en-strings.mjs: falta o simulador ${slug}`); continue; }
  pages.push({
    src: `simuladores/${slug}/index.html`, dest: `en/simuladores/${slug}/index.html`, file: `simuladores/${slug}/index.html`, slug,
    sim: { name: info.name, description: `Interactive simulators for ${info.about} by LabOfAlgorithms.` },
  });
}

let stale = 0;
const generated = new Map();
for (const page of pages) generated.set(page.dest, translatePage(readFileSync(join(ROOT, page.src), 'utf8'), page));

if (missing.length) {
  console.error(`${missing.length} texto(s) sem tradução:`);
  for (const m of [...new Set(missing)]) console.error(`  - ${m}`);
  process.exit(1);
}
for (const [dest, html] of generated) {
  const path = join(ROOT, dest);
  if (checkOnly) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== html) { stale += 1; console.error(`desatualizado: ${dest}`); }
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, html);
  }
}
if (checkOnly) {
  if (stale) { console.error(`\n${stale} página(s) em inglês desatualizada(s). Rode: node scripts/build-en-pages.mjs`); process.exit(1); }
  console.log(`OK: ${generated.size} páginas em inglês em dia.`);
} else console.log(`${generated.size} páginas em inglês geradas.`);
