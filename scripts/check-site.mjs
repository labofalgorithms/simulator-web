// Verificação estática do site, sem dependências: node scripts/check-site.mjs
// Sai com código 1 se alguma checagem falhar. Roda a cada push e pull request (.github/workflows/check.yml).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { published } from './en-strings.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://labofalgorithms.com';
const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);
const read = (path) => readFileSync(join(ROOT, path), 'utf8');
const exists = (path) => existsSync(join(ROOT, path));

const simulators = readdirSync(join(ROOT, 'simuladores'))
  .filter((name) => statSync(join(ROOT, 'simuladores', name)).isDirectory())
  .sort();

const ptPages = [
  { file: 'index.html', url: `${BASE}/`, kind: 'home' },
  { file: '404.html', url: null, kind: 'erro' },
  ...simulators.map((slug) => ({ file: `simuladores/${slug}/index.html`, url: `${BASE}/simuladores/${slug}/`, kind: 'simulador', slug })),
].map((page) => ({ ...page, lang: 'pt' }));
// As páginas em inglês ficam em en/ e são geradas das em português por scripts/build-en-pages.mjs.
const enPages = ptPages.filter((page) => page.kind !== 'erro').map((page) => ({
  ...page, lang: 'en', file: `en/${page.file}`, url: page.url.replace(`${BASE}/`, `${BASE}/en/`),
}));
const pages = [...ptPages, ...enPages];

const attr = (html, tag, key, value, wanted) => {
  const re = new RegExp(`<${tag}\\b[^>]*\\b${key}="${value}"[^>]*>`, 'i');
  const match = html.match(re);
  return match ? match[0].match(new RegExp(`\\b${wanted}="([^"]*)"`))?.[1] : undefined;
};
const meta = (html, name) => attr(html, 'meta', 'name', name, 'content');
const prop = (html, name) => attr(html, 'meta', 'property', name, 'content');

for (const page of pages) {
  const html = read(page.file);
  const at = page.file;
  const tag = (re) => (html.match(re) || [])[0];

  const htmlLang = page.lang === 'en' ? 'en' : 'pt-BR';
  if (!html.includes(`<html lang="${htmlLang}">`)) fail(at, `falta <html lang="${htmlLang}">`);
  if (page.lang === 'en' && !published && !tag(/<meta name="robots" content="noindex"/)) fail(at, 'enquanto o inglês não é publicado, a página precisa de noindex');
  if (page.lang === 'en' && published && tag(/<meta name="robots" content="noindex"/)) fail(at, 'o inglês já está publicado, mas a página tem noindex');
  if (!tag(/<meta name="viewport"/)) fail(at, 'falta a meta viewport');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) fail(at, 'falta o <title>');

  if (!tag(/<a class="skip-link" href="#conteudo">/)) fail(at, 'falta o link "Pular para o conteúdo"');
  if (!tag(/<main\b[^>]*\bid="conteudo"[^>]*tabindex="-1"/)) fail(at, 'falta <main id="conteudo" tabindex="-1">');

  if (page.url) {
    const description = meta(html, 'description');
    if (!description) fail(at, 'falta a meta description');
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    if (canonical !== page.url) fail(at, `canonical é ${canonical}, o esperado é ${page.url}`);
    if (prop(html, 'og:url') !== page.url) fail(at, `og:url é ${prop(html, 'og:url')}, o esperado é ${page.url}`);
    for (const name of ['og:type', 'og:site_name', 'og:locale', 'og:title', 'og:description', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt']) {
      const count = (html.match(new RegExp(`property="${name}"`, 'g')) || []).length;
      if (count !== 1) fail(at, `${name} aparece ${count} vezes (deveria ser 1)`);
    }
    if (meta(html, 'twitter:card') !== 'summary_large_image') fail(at, 'falta twitter:card summary_large_image');
    if (page.kind === 'simulador') {
      if (prop(html, 'og:title') !== title) fail(at, 'og:title difere do <title>');
      if (prop(html, 'og:description') !== description) fail(at, 'og:description difere da meta description');
    }
    const image = prop(html, 'og:image') ?? '';
    const expectedImage = page.kind === 'simulador' ? `${BASE}/assets/og/${page.lang === 'en' ? 'en/' : ''}${page.slug}.jpg` : `${BASE}/assets/logo/og-image.png`;
    if (image !== expectedImage) fail(at, `og:image é ${image}, o esperado é ${expectedImage}`);
    else if (!exists(image.slice(BASE.length + 1))) fail(at, `a imagem ${image} não existe no repositório`);
    if (!/<link rel="manifest" href="[^"]+"/.test(html)) fail(at, 'falta <link rel="manifest">');

    // Cada página aponta para a versão no outro idioma (e para si mesma) com hreflang, e tem o link EN/PT.
    const ptUrl = page.lang === 'pt' ? page.url : page.url.replace(`${BASE}/en/`, `${BASE}/`);
    const enUrl = page.lang === 'en' ? page.url : page.url.replace(`${BASE}/`, `${BASE}/en/`);
    for (const [hreflang, href] of [['pt-BR', ptUrl], ['en', enUrl], ['x-default', ptUrl]]) {
      if (!html.includes(`<link rel="alternate" hreflang="${hreflang}" href="${href}" />`)) fail(at, `falta o hreflang ${hreflang} apontando para ${href}`);
    }
    if (prop(html, 'og:locale:alternate') !== (page.lang === 'pt' ? 'en_US' : 'pt_BR')) fail(at, 'og:locale:alternate errado');
    const other = page.lang === 'pt' ? 'en' : 'pt-BR';
    if (!new RegExp(`<a class="lang-link" href="[^"]+" hreflang="${other}"`).test(html)) fail(at, 'falta o link de troca de idioma');

    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    if (!ld) fail(at, 'falta o bloco JSON-LD');
    else {
      try {
        const data = JSON.parse(ld);
        if (data.url !== page.url) fail(at, `JSON-LD url é ${data.url}, o esperado é ${page.url}`);
      } catch (error) {
        fail(at, `JSON-LD inválido (${error.message})`);
      }
    }
  }

  // Links, scripts, estilos e imagens locais precisam apontar para arquivos que existem.
  const refs = [...html.matchAll(/\b(?:href|src)="([^"]*)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (!ref || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(ref)) continue;
    const clean = ref.split('#')[0].split('?')[0];
    if (!clean) continue;
    let target = clean.startsWith('/') ? clean.slice(1) : relative(ROOT, resolve(ROOT, dirname(page.file), clean));
    if (target === '' || target.endsWith('/')) target += 'index.html';
    if (!exists(target)) fail(at, `o link "${ref}" aponta para um arquivo que não existe`);
  }
}

// A home precisa listar todos os simuladores.
for (const file of ['index.html', 'en/index.html']) {
  const home = read(file);
  for (const slug of simulators) {
    if (!home.includes(`./simuladores/${slug}/`)) fail(file, `a home não tem o cartão de ${slug}`);
  }
}

// Sitemap e robots.
const expected = new Set(pages.filter((p) => p.url && (p.lang === 'pt' || published)).map((p) => p.url));
const sitemap = new Set([...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
for (const url of expected) if (!sitemap.has(url)) fail('sitemap.xml', `falta ${url}`);
for (const url of sitemap) if (!expected.has(url)) fail('sitemap.xml', `lista uma página que não existe: ${url}`);
if (!read('robots.txt').includes(`Sitemap: ${BASE}/sitemap.xml`)) fail('robots.txt', 'falta a linha Sitemap');

// Manifestos (português na raiz, inglês em en/).
for (const file of ['manifest.webmanifest', 'en/manifest.webmanifest']) {
  try {
    const manifest = JSON.parse(read(file));
    for (const icon of manifest.icons ?? []) {
      if (!exists(join(dirname(file), icon.src))) fail(file, `o ícone ${icon.src} não existe`);
    }
    if (!(manifest.icons ?? []).some((i) => i.sizes === '192x192') || !(manifest.icons ?? []).some((i) => i.sizes === '512x512')) {
      fail(file, 'faltam os ícones de 192 e 512 px');
    }
  } catch (error) {
    fail(file, `JSON inválido (${error.message})`);
  }
}

// As páginas em inglês precisam estar em dia com as em português, e os textos do JavaScript traduzidos.
for (const [script, label] of [['build-en-pages.mjs', 'páginas em inglês'], ['check-i18n.mjs', 'textos em inglês']]) {
  const run = spawnSync(process.execPath, [join(ROOT, 'scripts', script), ...(script === 'build-en-pages.mjs' ? ['--check'] : [])], { encoding: 'utf8' });
  if (run.status !== 0) for (const line of (run.stderr || run.stdout).trim().split('\n')) fail(label, line.trim());
}

// JavaScript: sintaxe e imports relativos.
const walk = (dir) => readdirSync(join(ROOT, dir)).flatMap((name) => {
  const path = `${dir}/${name}`;
  return statSync(join(ROOT, path)).isDirectory() ? walk(path) : [path];
});
const scripts = walk('src/js').filter((path) => path.endsWith('.js'));
for (const path of scripts) {
  const source = read(path);
  const syntax = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: source, encoding: 'utf8' });
  if (syntax.status !== 0) fail(path, `erro de sintaxe: ${(syntax.stderr || '').split('\n').find((l) => /Error/.test(l)) ?? 'veja node --check'}`);
  const specs = [
    ...source.matchAll(/\b(?:import|export)\b[^'"`;]*?\bfrom\s*['"](\.[^'"]+)['"]/g),
    ...source.matchAll(/\bimport\s*['"](\.[^'"]+)['"]/g),
    ...source.matchAll(/\bimport\(\s*['"](\.[^'"]+)['"]\s*\)/g),
  ].map((m) => m[1]);
  for (const spec of specs) {
    const target = relative(ROOT, resolve(ROOT, dirname(path), spec.split('?')[0]));
    if (!exists(target)) fail(path, `o import "${spec}" aponta para um arquivo que não existe`);
  }
}

if (errors.length) {
  console.error(`${errors.length} problema(s) encontrado(s):\n`);
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`OK: ${pages.length} páginas, ${simulators.length} simuladores, ${scripts.length} arquivos JavaScript, sitemap, robots e manifesto.`);
