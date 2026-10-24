// Confere os textos dos simuladores nos dois idiomas, sem dependências: node scripts/check-i18n.mjs
// Para cada simulador gera os passos em português e em inglês (cada um num processo, porque o idioma vale
// para o processo inteiro) e confere: mesmo número de algoritmos, de passos e de linhas de pseudocódigo,
// mesma linha destacada em cada passo, nenhum acento do português sobrando no inglês e nenhuma variável
// sem nome em inglês em src/js/core/variable-names.js.

import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = join(ROOT, 'src/js/pages');

/** Simuladores ainda sem tradução: só a estrutura é conferida. Cada um sai daqui quando fica pronto. */
const PENDING = new Set([
  'bubble-sort-simulator.js',
  'heap-sort-simulator.js', 'insertion-sort-simulator.js',
  'merge-sort-simulator.js', 'quick-sort-simulator.js', 'selection-sort-simulator.js', 'shotgun-sort-simulator.js',
]);

const pageFiles = () => readdirSync(PAGES).filter((f) => f.endsWith('-simulator.js')).sort();

async function dump(lang) {
  globalThis.__LANG__ = lang;
  let seed = 12345; // o mesmo sorteio nos dois idiomas
  Math.random = () => { seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  const result = {};
  for (const file of pageFiles()) {
    const source = readFileSync(join(PAGES, file), 'utf8');
    const [, name, path] = source.match(/import \{ (\w+) \} from '\.\.\/modules\/([^']+)'/g).filter((l) => !l.includes('SimulatorApp')).map((l) => l.match(/import \{ (\w+) \} from '\.\.\/modules\/([^']+)'/))[0];
    const mod = (await import(pathToFileURL(resolve(PAGES, '../modules', path)).href))[name];
    const data = mod.sanitizeData ? mod.sanitizeData(mod.defaultData) : mod.defaultData;
    const entry = { name: mod.name, visualizationTitle: mod.visualizationTitle, algorithms: mod.algorithms, steps: {} };
    for (const algorithm of mod.algorithms) {
      try { entry.steps[algorithm.id] = mod.buildSteps(algorithm.id, data, mod.normalizeConfig(data, mod.createInitialConfig(data))); }
      catch (error) { entry.steps[algorithm.id] = `ERRO ${error.message}`; }
    }
    result[file] = entry;
  }
  process.stdout.write(JSON.stringify(result));
}

if (process.argv[2] === '--dump') {
  await dump(process.argv[3]);
} else {
  const run = (lang) => {
    const child = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--dump', lang], { encoding: 'utf8', maxBuffer: 1 << 28 });
    if (child.status !== 0) { console.error(child.stderr || `falha ao gerar os passos em ${lang}`); process.exit(1); }
    return JSON.parse(child.stdout);
  };
  const pt = run('pt');
  const en = run('en');
  const { variableNames } = await import(pathToFileURL(join(ROOT, 'src/js/core/variable-names.js')).href);
  const ACCENT = /[áàâãäéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÓÔÕÚÇ]/;
  const problems = [];
  const accents = (value, path, out) => {
    if (typeof value === 'string') { if (ACCENT.test(value)) out.push(`${path}: ${value.slice(0, 80)}`); }
    else if (Array.isArray(value)) value.forEach((v, i) => accents(v, `${path}[${i}]`, out));
    else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) accents(v, `${path}.${k}`, out);
  };
  for (const file of Object.keys(pt)) {
    const a = pt[file];
    const b = en[file];
    const at = (message) => problems.push(`${file}: ${message}`);
    if (a.algorithms.length !== b.algorithms.length) at('número de algoritmos difere entre os idiomas');
    a.algorithms.forEach((algorithm, i) => {
      if (algorithm.pseudocode.length !== b.algorithms[i]?.pseudocode.length) at(`${algorithm.id}: o pseudocódigo tem ${algorithm.pseudocode.length} linhas em português e ${b.algorithms[i]?.pseudocode.length} em inglês`);
    });
    for (const id of Object.keys(a.steps)) {
      const sa = a.steps[id];
      const sb = b.steps[id];
      if (typeof sa === 'string' || typeof sb === 'string') { at(`${id}: erro ao gerar os passos (${typeof sb === 'string' ? sb : sa})`); continue; }
      if (sa.length !== sb.length) { at(`${id}: ${sa.length} passos em português e ${sb.length} em inglês`); continue; }
      sa.forEach((step, i) => { if (JSON.stringify(step.line) !== JSON.stringify(sb[i].line)) at(`${id}[${i}]: linha ${JSON.stringify(step.line)} em português e ${JSON.stringify(sb[i].line)} em inglês`); });
    }
    if (PENDING.has(file)) continue;
    const leaks = [];
    accents({ name: b.name, visualizationTitle: b.visualizationTitle, algorithms: b.algorithms }, 'meta', leaks);
    for (const [id, steps] of Object.entries(b.steps)) accents(steps, `steps.${id}`, leaks);
    if (leaks.length) at(`${leaks.length} texto(s) com acento do português no inglês, por exemplo ${leaks.slice(0, 3).join(' | ')}`);
    // Uma variável traduzida no próprio texto (chave diferente nos dois idiomas) está certa; se a chave é igual,
    // ela precisa estar em variable-names.js (nomes iguais nos dois idiomas ficam lá também).
    const unknown = new Set();
    for (const id of Object.keys(a.steps)) {
      const stepsPt = a.steps[id];
      const stepsEn = b.steps[id];
      if (typeof stepsPt === 'string' || typeof stepsEn === 'string') continue;
      stepsEn.forEach((step, i) => {
        const keysPt = Object.keys(stepsPt[i]?.variables || {});
        Object.keys(step.variables || {}).forEach((key, j) => {
          const base = key.split(/[\[.]/)[0];
          if (key === keysPt[j] && !(key in variableNames) && !(base in variableNames) && !['rowSum', 'colSum', 'jagged'].includes(base)) unknown.add(key);
        });
      });
    }
    if (unknown.size) at(`variáveis sem nome em inglês em variable-names.js: ${[...unknown].join(', ')}`);
  }
  if (problems.length) {
    console.error(`${problems.length} problema(s) nos textos:\n`);
    for (const message of problems) console.error(`  - ${message}`);
    process.exit(1);
  }
  const done = pageFiles().filter((f) => !PENDING.has(f)).length;
  console.log(`OK: ${done} de ${pageFiles().length} simuladores traduzidos e conferidos${PENDING.size ? ` (${PENDING.size} pendentes: só a estrutura foi conferida)` : ''}.`);
}
