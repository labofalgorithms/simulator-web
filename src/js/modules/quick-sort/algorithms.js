import {
  NONE, ascending, clone, fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf, withRepeats,
} from '../shared/sort-steps.js';

// Pseudocódigo da aula (slides 52 e 53): quickSort particiona o trecho em torno de vetor[inicio]
// (o pivô) e ordena os dois lados; particionar varre o trecho com i e j e devolve a posição do pivô.
const QUICK_CODE = [
  'FUNÇÃO quickSort(vetor, inicio, fim)',
  '  SE inicio < fim ENTÃO',
  '    meio ← particionar(vetor, inicio, fim)',
  '    quickSort(vetor, inicio, meio - 1)',
  '    quickSort(vetor, meio + 1, fim)',
  '  FIM SE',
  'FIM',
];

const PARTITION_CODE = [
  'FUNÇÃO particionar(vetor, inicio, fim)',
  '  i ← inicio + 1; j ← fim',
  '  ENQUANTO i ≤ j FAÇA',
  '    SE vetor[i] < vetor[inicio] ENTÃO',
  '      i ← i + 1',
  '    SENÃO',
  '      SE vetor[j] > vetor[inicio] ENTÃO',
  '        j ← j - 1',
  '      SENÃO',
  '        aux ← vetor[i]',
  '        vetor[i] ← vetor[j]',
  '        vetor[j] ← aux',
  '        i ← i + 1',
  '        j ← j - 1',
  '      FIM SE',
  '    FIM SE',
  '  FIM ENQUANTO',
  '  aux ← vetor[inicio]',
  '  vetor[inicio] ← vetor[j]',
  '  vetor[j] ← aux',
  '  RETORNE j',
  'FIM',
];

// As duas funções juntas, com uma linha em branco entre elas.
const FULL_CODE = [...QUICK_CODE, '', ...PARTITION_CODE];
const OFFSET = QUICK_CODE.length + 1;

// Linhas de QUICK_CODE e de PARTITION_CODE (base 0).
const Q = { call: 0, test: 1, part: 2, left: 3, right: 4, end: 6 };
const P = {
  head: 0, init: 1, loop: 2, testI: 3, incI: 4, testJ: 6, decJ: 7, saveAux: 9, copyJ: 10, putAux: 11, incI2: 12, decJ2: 13, pivotSave: 17, pivotMove: 18, pivotPut: 19, ret: 20, end: 21,
};

export const algorithms = [
  {
    id: 'partition', title: 'Particionar', menuLabel: 'Particionar', group: 'Como funciona', number: '01',
    description: 'Escolha o primeiro valor do trecho como pivô e deixe i e j se aproximarem, trocando os pares fora do lugar. No fim, o pivô vai para a posição em que ficará para sempre.',
    interaction: 'Mude o início e o fim do trecho ou clique em uma célula para escolher o pivô. i procura, da esquerda, um valor maior ou igual ao pivô; j procura, da direita, um menor ou igual.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'i e j andam um em direção ao outro e cada um percorre o trecho no máximo uma vez, então o custo é proporcional ao tamanho do trecho. Só existem as variáveis i, j e aux além do vetor.' },
    pseudocode: PARTITION_CODE,
  },
  {
    id: 'quick-sort', title: 'Quicksort', menuLabel: 'Quicksort', group: 'Como funciona', number: '02',
    description: 'Particione o vetor em torno de um pivô e repita o processo para a parte à esquerda e para a parte à direita dele, até restarem trechos de um elemento ou vazios.',
    interaction: 'Acompanhe a pilha de chamadas e os marcadores início, fim, i, j e meio. Cada pivô que vira verde já está na posição final.',
    complexity: { time: 'O(n log n)', space: 'O(log n)', note: 'No caso médio e no melhor, o particionamento divide o trecho em partes parecidas e há cerca de log₂ n níveis; no pior caso (pivô sempre o menor ou o maior), o custo sobe para O(n²). A pilha de chamadas soma O(log n) no melhor caso e O(n) no pior.' },
    pseudocode: FULL_CODE,
  },
  {
    id: 'counting', title: 'Contando as operações', menuLabel: 'Complexidade de tempo', group: 'Análise do algoritmo', number: '03',
    description: 'Conte as comparações e as trocas de cada particionamento e veja como a escolha do pivô decide o custo total.',
    interaction: 'Compare o total com o pior caso (vetor ordenado) e com o melhor (pivôs sempre na mediana), que aparecem no console ao final.',
    complexity: { time: 'O(n log n)', space: 'O(log n)', note: 'Cada particionamento custa na ordem do tamanho do trecho. Com pivôs que dividem ao meio, os trechos de cada nível somam n e há log₂ n níveis; com pivôs nos extremos, são n − 1 níveis e o custo é quadrático.' },
    pseudocode: FULL_CODE,
  },
  {
    id: 'adaptability', title: 'Adaptabilidade', menuLabel: 'Adaptabilidade', group: 'Análise do algoritmo', number: '04',
    description: 'Execute o algoritmo em quatro vetores com os mesmos valores em ordens diferentes e compare os contadores: aqui a ordem inicial muda o custo.',
    interaction: 'Avance particionamento por particionamento e veja que o vetor já ordenado, que parece o caso fácil, é o pior para este Quicksort.',
    complexity: { time: 'O(n²)', space: 'O(n)', note: 'Como o pivô é o primeiro valor, um vetor já ordenado (ou invertido) faz o pivô cair sempre em um extremo: as partes têm n − 1 e 0 elementos, e o custo é O(n²). No melhor caso (pivô na mediana) é O(n log n), e o caso médio também.' },
    pseudocode: FULL_CODE,
  },
  {
    id: 'stability', title: 'Estabilidade', menuLabel: 'Estabilidade', group: 'Análise do algoritmo', number: '05',
    description: 'Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.',
    interaction: 'Use "Gerar exemplo" para criar um vetor com valores repetidos em que a ordem realmente se inverte, e veja qual particionamento causa isso.',
    complexity: { time: 'O(n log n)', space: 'O(log n)', note: 'A troca de vetor[i] com vetor[j] leva um valor da ponta direita para a esquerda por cima de iguais que estavam no meio, e o pivô também é trocado com vetor[j]. Por isso dois iguais podem inverter a ordem: o Quicksort é instável.' },
    pseudocode: FULL_CODE,
  },
];

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const vec = (items) => `[${items.map(label).join(', ')}]`;
const copyItems = (items) => items.map((item) => ({ ...item }));

// ---------------------------------------------------------------------------
// Execução sem passos: o mesmo algoritmo, para as simulações de análise, para conferir o depurador
// e para montar os exemplos. Cada particionamento devolve o trecho, a posição do pivô, as
// comparações com o pivô, as trocas e o vetor antes e depois.
// ---------------------------------------------------------------------------

/** particionar da aula sobre `a` (itens `{ v, tag }`): devolve j, as comparações e as trocas. */
function partitionItems(a, ini, fim) {
  const pivot = a[ini].v;
  let i = ini + 1;
  let j = fim;
  let comparisons = 0;
  let swaps = 0;
  while (i <= j) {
    comparisons += 1;
    if (a[i].v < pivot) {
      i += 1;
    } else {
      comparisons += 1;
      if (a[j].v > pivot) {
        j -= 1;
      } else {
        [a[i], a[j]] = [a[j], a[i]];
        swaps += 1;
        i += 1;
        j -= 1;
      }
    }
  }
  [a[ini], a[j]] = [a[j], a[ini]];
  swaps += 1;
  return { j, comparisons, swaps };
}

/** Todos os particionamentos do Quicksort, na ordem em que as chamadas acontecem. */
function runPartitions(items) {
  const a = copyItems(items);
  const calls = [];
  const walk = (ini, fim, depth) => {
    if (ini >= fim) return;
    const before = copyItems(a);
    const { j, comparisons, swaps } = partitionItems(a, ini, fim);
    calls.push({
      ini, fim, depth, meio: j, comparisons, swaps, before, after: copyItems(a),
    });
    walk(ini, j - 1, depth + 1);
    walk(j + 1, fim, depth + 1);
  };
  walk(0, a.length - 1, 0);
  return { calls, final: a };
}

/**
 * O vetor em que todo pivô cai na mediana do seu trecho (melhor caso). O particionar leva o último
 * valor da parte esquerda para o início dela, então a esquerda é guardada "girada" para voltar certa.
 */
export function bestCase(sortedValues) {
  if (sortedValues.length <= 2) return [...sortedValues];
  const mid = Math.floor((sortedValues.length - 1) / 2);
  const left = bestCase(sortedValues.slice(0, mid));
  const right = bestCase(sortedValues.slice(mid + 1));
  const rotated = [...left.slice(1), left[0]];
  return [sortedValues[mid], ...rotated, ...right];
}

const totalOf = (calls, key) => calls.reduce((sum, call) => sum + call[key], 0);

/** Pares de iguais cuja ordem relativa mudou entre `before` e `after`. */
function flippedPairs(before, after) {
  const positionIn = (items) => new Map(items.map((item, index) => [`${item.v}${item.tag}`, index]));
  const was = positionIn(before);
  const now = positionIn(after);
  const pairs = [];
  before.forEach((x) => {
    before.forEach((y) => {
      if (x === y || x.v !== y.v || !x.tag || !y.tag || x.tag >= y.tag) return;
      const kx = `${x.v}${x.tag}`;
      const ky = `${y.v}${y.tag}`;
      if ((was.get(kx) < was.get(ky)) !== (now.get(kx) < now.get(ky))) pairs.push([x, y]);
    });
  });
  return pairs;
}

/** Vetor com valores repetidos em que o Quicksort realmente inverte a ordem de dois iguais. */
export function stabilityExample(count) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const values = withRepeats(count);
    if (!isStable(runPartitions(tagDuplicates(values)).final)) return values;
  }
  return [18, 47, 47, 10, 33, 25, 61, 70, 12, 90].slice(0, Math.max(4, count));
}

// ---------------------------------------------------------------------------
// Execução como num depurador: cada passo é a linha que acabou de executar, com a pilha de
// chamadas e as variáveis da chamada atual (cada chamada tem as suas).
// ---------------------------------------------------------------------------

/** `base` é a linha onde particionar começa no pseudocódigo exibido (0 sozinho, OFFSET junto do quickSort). */
function createTracer(items, base) {
  const a = copyItems(items);
  const n = a.length;
  const steps = [];
  const sorted = new Set();
  const frames = [];
  const counters = { comparisons: 0, swaps: 0 };
  const log = [];

  const compareOf = (left, op, right, result) => ({ left, op, right, result });

  function add(line, title, description, tone, extra = {}) {
    const { pointers: own = {}, pivotIndex, ...rest } = extra;
    const frame = frames.at(-1);
    const vars = frame?.vars ?? {};
    const pointers = {};
    const stats = { 'comparações': counters.comparisons, trocas: counters.swaps };
    if (frame) {
      pointers.inicio = vars.inicio;
      pointers.fim = vars.fim;
      if (Number.isInteger(vars.meio)) pointers.meio = vars.meio;
      if (frame.kind === 'particionar') {
        if (Number.isInteger(vars.i)) pointers.i = vars.i;
        if (Number.isInteger(vars.j)) pointers.j = vars.j;
        if (vars.aux !== NONE) stats.aux = fmt(vars.aux);
      }
    }
    steps.push(step(valuesOf(a), line, title, description, tone, {
      tags: tagsOf(a),
      stats,
      stack: frames.map((entry) => entry.label),
      variables: { ...vars, ...(frame?.kind === 'particionar' && vars.aux !== NONE ? { aux: fmt(vars.aux) } : {}) },
      pointers: { ...pointers, ...own },
      outsideIndices: frame ? range(n).filter((index) => index < vars.inicio || index > vars.fim) : [],
      sortedIndices: [...sorted],
      pivotIndex,
      output: clone(log),
      ...rest,
    }));
  }

  function partition(ini, fim) {
    const text = `particionar(${ini}, ${fim})`;
    const frame = {
      kind: 'particionar', label: text, vars: { inicio: ini, fim, i: NONE, j: NONE, aux: NONE },
    };
    frames.push(frame);
    const { vars } = frame;
    const pivot = a[ini];
    const phase = (what) => ({ label: text, text: what, code: true });
    const start = counters.comparisons;
    const startSwaps = counters.swaps;
    const ctx = (what, extra = {}) => ({ phase: phase(what), pivotIndex: ini, ...extra });
    const cmp = (left, op, right, result) => ({ compare: compareOf(left, op, right, result) });

    add(base + P.head, text, `Chamada: o pivô é vetor[inicio] = ${label(pivot)}, o primeiro valor do trecho (posições ${ini} a ${fim}). Os outros valores serão separados em menores que o pivô, à esquerda, e maiores ou iguais, à direita.`, 'neutral', ctx('Varre o trecho'));

    let i = ini + 1;
    let j = fim;
    vars.i = i;
    vars.j = j;
    add(base + P.init, 'i ← inicio + 1; j ← fim', `i recebe ${i}, logo depois do pivô, e j recebe ${j}, o fim do trecho. i procura da esquerda um valor maior ou igual ao pivô; j procura da direita um valor menor ou igual a ele.`, 'update', ctx('Varre o trecho'));

    for (;;) {
      const crossing = i <= j;
      add(base + P.loop, 'ENQUANTO i ≤ j', crossing
        ? `${i} ≤ ${j} é verdadeiro: i e j ainda não se cruzaram, então há valores para examinar.`
        : `${i} ≤ ${j} é falso: i e j se cruzaram, e a varredura termina. A posição j = ${j} é onde o pivô vai ficar: à esquerda dela só há valores menores ou iguais ao pivô e, à direita, maiores ou iguais.`, crossing ? 'comparison' : 'success', ctx('Varre o trecho', cmp({ label: 'i', value: String(i) }, '≤', { label: 'j', value: String(j) }, crossing)));
      if (!crossing) break;

      counters.comparisons += 1;
      const small = a[i].v < pivot.v;
      add(base + P.testI, 'SE vetor[i] < vetor[inicio]', `${fmt(a[i].v)} < ${fmt(pivot.v)} é ${small ? 'verdadeiro' : 'falso'}. ${small
        ? 'Este valor já está do lado certo (menor que o pivô): i avança.'
        : 'Este valor é maior ou igual ao pivô: está do lado errado, então i para aqui e vamos olhar para j.'}`, 'comparison', ctx('Varre o trecho', cmp({ label: 'vetor[i]', value: fmt(a[i].v) }, '<', { label: 'vetor[inicio]', value: fmt(pivot.v) }, small)));
      if (small) {
        i += 1;
        vars.i = i;
        add(base + P.incI, 'i ← i + 1', `i avança para ${i}.`, 'update', ctx('Varre o trecho'));
        continue;
      }

      counters.comparisons += 1;
      const big = a[j].v > pivot.v;
      add(base + P.testJ, 'SE vetor[j] > vetor[inicio]', `${fmt(a[j].v)} > ${fmt(pivot.v)} é ${big ? 'verdadeiro' : 'falso'}. ${big
        ? 'Este valor já está do lado certo (maior que o pivô): j recua.'
        : `Este valor é menor ou igual ao pivô: está do lado errado. i e j pararam, então vetor[${i}] e vetor[${j}] trocam de lugar.`}`, 'comparison', ctx('Varre o trecho', cmp({ label: 'vetor[j]', value: fmt(a[j].v) }, '>', { label: 'vetor[inicio]', value: fmt(pivot.v) }, big)));
      if (big) {
        j -= 1;
        vars.j = j;
        add(base + P.decJ, 'j ← j - 1', `j recua para ${j}.`, 'update', ctx('Varre o trecho'));
        continue;
      }

      const aux = a[i];
      vars.aux = aux.v;
      add(base + P.saveAux, 'aux ← vetor[i]', `aux recebe vetor[${i}] = ${label(aux)}: o valor de i é guardado antes de ser sobrescrito.`, 'update', ctx('Troca vetor[i] com vetor[j]', { comparedIndices: [i] }));
      a[i] = a[j];
      add(base + P.copyJ, 'vetor[i] ← vetor[j]', `vetor[${i}] recebe vetor[${j}] = ${label(a[i])}.`, 'update', ctx('Troca vetor[i] com vetor[j]', { changedIndices: [i], comparedIndices: [j] }));
      a[j] = aux;
      counters.swaps += 1;
      add(base + P.putAux, 'vetor[j] ← aux', `vetor[${j}] recebe aux = ${label(aux)}: os dois valores trocaram de lugar, e agora cada um está do lado certo.`, 'update', ctx('Troca vetor[i] com vetor[j]', { changedIndices: [i, j] }));
      i += 1;
      vars.i = i;
      add(base + P.incI2, 'i ← i + 1', `i avança para ${i}.`, 'update', ctx('Troca vetor[i] com vetor[j]'));
      j -= 1;
      vars.j = j;
      add(base + P.decJ2, 'j ← j - 1', `j recua para ${j}.`, 'update', ctx('Troca vetor[i] com vetor[j]'));
    }

    const fixed = { label: text, text: 'Põe o pivô no lugar', code: true };
    vars.aux = pivot.v;
    add(base + P.pivotSave, 'aux ← vetor[inicio]', `aux recebe vetor[${ini}] = ${label(pivot)}: o pivô é guardado antes de a posição dele ser sobrescrita.`, 'update', { phase: fixed, pivotIndex: ini });
    a[ini] = a[j];
    add(base + P.pivotMove, 'vetor[inicio] ← vetor[j]', `vetor[${ini}] recebe vetor[${j}] = ${label(a[ini])}${j === ini ? ' (é o próprio pivô: nenhum valor ficou à esquerda dele)' : ': o valor da posição j, que é menor ou igual ao pivô, vai para o início do trecho'}.`, 'update', { phase: fixed, changedIndices: [ini], comparedIndices: [j] });
    a[j] = pivot;
    counters.swaps += 1;
    sorted.add(j);
    add(base + P.pivotPut, 'vetor[j] ← aux', `vetor[${j}] recebe aux = ${label(pivot)}: o pivô chega à posição ${j}, a definitiva. ${j === ini ? 'Ele já estava no lugar (a troca foi com ele mesmo).' : ''}Tudo à esquerda dele é menor ou igual, e tudo à direita, maior ou igual.`.trim(), 'success', { phase: fixed, pivotIndex: j, changedIndices: [ini, j] });
    vars.j = j;
    log.push(`${text}: pivô ${label(pivot)} → posição ${j} (${plural(counters.comparisons - start, 'comparação', 'comparações')}, ${plural(counters.swaps - startSwaps, 'troca', 'trocas')})`);
    add(base + P.ret, 'RETORNE j', `A função devolve j = ${j}: a posição final do pivô ${label(pivot)}.`, 'success', { phase: fixed, pivotIndex: j });
    frames.pop();
    return j;
  }

  function quickSort(ini, fim, depth) {
    const text = `quickSort(${ini}, ${fim})`;
    const frame = { kind: 'quickSort', label: text, vars: { inicio: ini, fim, meio: NONE } };
    frames.push(frame);
    const size = Math.max(0, fim - ini + 1);
    const splitting = { label: text, text: 'Particiona e repete', code: true };

    add(Q.call, text, depth === 0
      ? `Chamada inicial: quickSort(vetor, 0, ${n - 1}). O trecho é o vetor inteiro, com ${plural(size, 'elemento', 'elementos')}.`
      : `Nova chamada, agora com inicio = ${ini} e fim = ${fim}: ${size === 0 ? 'o trecho é vazio' : `o trecho tem ${plural(size, 'elemento', 'elementos')}`}. Cada chamada tem as suas próprias variáveis.`, 'neutral', { phase: splitting });

    const divides = ini < fim;
    if (ini === fim) sorted.add(ini);
    add(Q.test, 'SE inicio < fim', divides
      ? `${ini} < ${fim} é verdadeiro: o trecho tem mais de um elemento e precisa ser particionado.`
      : `${ini} < ${fim} é falso: ${ini === fim ? 'o trecho tem um só elemento, que já está no lugar' : 'o trecho é vazio'} (caso base). A chamada termina sem fazer mais nada.`, divides ? 'comparison' : 'success', {
      phase: splitting,
      compare: compareOf({ label: 'inicio', value: String(ini) }, '<', { label: 'fim', value: String(fim) }, divides),
    });
    if (!divides) {
      frames.pop();
      return;
    }

    add(Q.part, 'meio ← particionar(vetor, inicio, fim)', `Chama particionar para o trecho de ${ini} a ${fim}: ele usa vetor[inicio] = ${label(a[ini])} como pivô e o coloca na posição final.`, 'neutral', { phase: splitting });
    const meio = partition(ini, fim);
    frame.vars.meio = meio;
    add(Q.part, 'meio ← particionar(vetor, inicio, fim)', `particionar devolveu ${meio}: meio recebe ${meio}. O pivô ${label(a[meio])} está na posição definitiva; à esquerda dele ficaram os valores menores ou iguais e, à direita, os maiores ou iguais.`, 'update', { phase: splitting });

    add(Q.left, `quickSort(${ini}, ${meio - 1})`, meio - 1 >= ini
      ? `Chama quickSort para os valores à esquerda do pivô, das posições ${ini} a ${meio - 1}. A parte da direita só será examinada depois que esta voltar.`
      : `À esquerda do pivô não sobrou nenhum valor, mas a chamada quickSort(vetor, ${ini}, ${meio - 1}) acontece mesmo assim (trecho vazio).`, 'neutral', { phase: splitting });
    quickSort(ini, meio - 1, depth + 1);

    add(Q.right, `quickSort(${meio + 1}, ${fim})`, `${meio - 1 >= ini ? 'A parte da esquerda voltou ordenada. ' : ''}Agora quickSort cuida dos valores à direita do pivô, das posições ${meio + 1} a ${fim}${meio + 1 > fim ? ' (nenhum: trecho vazio)' : ''}.`, 'neutral', { phase: splitting });
    quickSort(meio + 1, fim, depth + 1);
    frames.pop();
  }

  return {
    steps, a, counters, log, add, quickSort, partition, sorted,
  };
}

function quickSortSteps(items) {
  const tracer = createTracer(items, OFFSET);
  const n = items.length;
  tracer.quickSort(0, n - 1, 0);
  const { a, counters, log } = tracer;
  tracer.add(Q.end, 'Ordenação concluída', `O vetor está em ordem crescente, depois de ${counters.comparisons} comparações com o pivô e ${counters.swaps} trocas. Cada particionamento fixou um pivô, e os trechos de um elemento já estavam no lugar.`, 'done', {
    output: [...log, `Vetor ordenado: ${vec(a)}`, `Comparações: ${counters.comparisons} · Trocas: ${counters.swaps}`],
  });
  return tracer.steps;
}

/** particionar sozinho, sobre o trecho de `config.inicio` a `config.fim`. */
function partitionSteps(values, config) {
  const n = values.length;
  const ini = Math.max(0, Math.min(n - 2, Number.isInteger(Number(config.inicio)) ? Number(config.inicio) : 0));
  const fim = Math.max(ini + 1, Math.min(n - 1, Number.isInteger(Number(config.fim)) ? Number(config.fim) : n - 1));
  const tracer = createTracer(toItems(values), 0);
  const meio = tracer.partition(ini, fim);
  const { a, counters, log } = tracer;
  tracer.steps.push({
    ...tracer.steps.at(-1),
    line: P.end,
    title: 'Particionamento concluído',
    description: `O pivô ${fmt(a[meio].v)} está na posição ${meio}. À esquerda dele ficaram ${plural(meio - ini, 'valor', 'valores')} e, à direita, ${plural(fim - meio, 'valor', 'valores')}; cada lado será ordenado por uma nova chamada de quickSort. Foram ${counters.comparisons} comparações com o pivô e ${counters.swaps} trocas.`,
    tone: 'done',
    stack: [],
    output: [...log, `Posição do pivô: ${meio}`, `À esquerda: ${meio - ini} · À direita: ${fim - meio}`],
  });
  return tracer.steps;
}

// ---------------------------------------------------------------------------
// 03 · Contando as operações: um particionamento por passo
// ---------------------------------------------------------------------------

function countingSteps(values) {
  const n = values.length;
  const { calls } = runPartitions(toItems(values));
  const worst = totalOf(runPartitions(toItems(ascending(values))).calls, 'comparisons');
  const best = totalOf(runPartitions(toItems(bestCase(ascending(values)))).calls, 'comparisons');
  const longest = Math.max(1, ...calls.map((call) => call.comparisons));
  const bars = calls.map((call) => ({
    label: `[${call.ini}..${call.fim}]`, value: null, mark: '', current: false,
  }));
  const done = new Set();
  let comparisons = 0;
  let swaps = 0;
  const chart = (final = false) => ({
    title: 'Comparações em cada particionamento (início..fim)',
    hint: '⇄ + número = trocas',
    max: longest,
    bars: bars.map((bar) => ({ ...bar })),
    totals: [
      { label: 'Comparações', value: comparisons, note: final ? `pior caso (ordenado): ${worst} · melhor: ${best}` : `pior caso: ${worst} · melhor: ${best}` },
      { label: 'Particionamentos', value: bars.filter((bar) => bar.value !== null).length, note: final ? `no máximo n − 1 = ${n - 1}` : `esperados ao final: ${calls.length}` },
    ],
    final,
  });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, 0, 'Contando as operações', `Cada chamada de quickSort com mais de um elemento faz um particionamento, e cada particionamento compara os valores do trecho com o pivô. Com ${n} elementos há ${plural(calls.length, 'particionamento', 'particionamentos')} neste vetor. Vamos somar o custo de cada um.`, 'neutral', common({ sortedIndices: [] })),
  ];

  calls.forEach((call, index) => {
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += call.comparisons;
    swaps += call.swaps;
    bars[index].value = call.comparisons;
    bars[index].mark = `⇄ ${call.swaps}`;
    done.add(call.meio);
    if (call.meio - 1 === call.ini) done.add(call.ini);
    if (call.meio + 1 === call.fim) done.add(call.fim);
    const size = call.fim - call.ini + 1;
    const left = call.meio - call.ini;
    const right = call.fim - call.meio;
    steps.push(step(valuesOf(call.after), OFFSET + P.testI, `particionar(${call.ini}, ${call.fim})`, `Trecho de ${plural(size, 'elemento', 'elementos')}: o pivô ${fmt(call.before[call.ini].v)} foi para a posição ${call.meio}, e sobraram ${plural(left, 'valor', 'valores')} à esquerda e ${plural(right, 'valor', 'valores')} à direita. Custo: ${plural(call.comparisons, 'comparação', 'comparações')} com o pivô e ${plural(call.swaps, 'troca', 'trocas')}. ${Math.min(left, right) === 0 && size > 2 ? 'O pivô ficou em um extremo: o trecho quase não encolheu.' : ''}`.trim(), 'comparison', common({
      sortedIndices: [...done],
      outsideIndices: range(n).filter((position) => position < call.ini || position > call.fim),
      pointers: { inicio: call.ini, fim: call.fim, meio: call.meio },
      pivotIndex: call.meio,
      changedIndices: range(call.fim + 1, call.ini),
      variables: { trecho: `${call.ini}..${call.fim}`, 'comparações do trecho': call.comparisons, 'comparações acumuladas': comparisons },
    })));
  });

  bars.forEach((bar) => { bar.current = false; });
  const quadratic = n * (n - 1);
  steps.push(step(valuesOf(calls.length ? calls.at(-1).after : values), Q.end, 'Somando os particionamentos', `${plural(calls.length, 'particionamento', 'particionamentos')} e ${comparisons} comparações no total (${swaps} trocas). Para os mesmos valores, o pior caso (já ordenados, o pivô sempre no extremo) faria ${worst} comparações e o melhor caso (pivô sempre na mediana), ${best}. Quanto mais equilibrados os particionamentos, menos níveis e menos trabalho.`, 'done', common({
    final: true,
    sortedIndices: range(n),
    variables: { n, 'comparações': comparisons, trocas: swaps },
    output: [
      `Comparações: ${comparisons}`,
      `Trocas: ${swaps}`,
      `Pior caso (vetor ordenado): ${worst} = n(n−1) = ${quadratic}`,
      `Melhor caso (pivô na mediana): ${best}`,
    ],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Adaptabilidade: melhor caso, vetor ordenado, vetor invertido e o seu vetor
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const inOrder = ascending(values);
  const scenarios = [
    { label: 'Pivôs na mediana (melhor caso)', values: bestCase(inOrder) },
    { label: 'Já ordenado', values: inOrder },
    { label: 'Ordem inversa', values: [...inOrder].reverse() },
    { label: 'Seu vetor', values: clone(values) },
  ].map((scenario) => ({
    ...scenario, ...runPartitions(toItems(scenario.values)), comparisons: 0, swaps: 0, done: new Set(), current: toItems(scenario.values),
  }));
  const rounds = Math.max(...scenarios.map((scenario) => scenario.calls.length));

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, 'Quatro vetores, os mesmos valores', 'O primeiro tem os valores dispostos para que todo pivô caia na mediana (o melhor caso), o segundo já está ordenado, o terceiro está em ordem inversa e o quarto é o seu vetor. O algoritmo vai tratar os quatro do mesmo jeito?', 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedIndices: [] })),
    }),
  ];

  for (let index = 0; index < rounds; index += 1) {
    scenarios.forEach((scenario) => {
      const call = scenario.calls[index];
      if (!call) return;
      scenario.comparisons += call.comparisons;
      scenario.swaps += call.swaps;
      scenario.done.add(call.meio);
      if (call.meio - 1 === call.ini) scenario.done.add(call.ini);
      if (call.meio + 1 === call.fim) scenario.done.add(call.fim);
      scenario.current = call.after;
      scenario.last = call;
    });
    steps.push(step(values, OFFSET + P.testI, `${index + 1}º particionamento`, `Cada vetor faz o seu ${index + 1}º particionamento (os que já terminaram esperam). Comparações acumuladas: ${joined('comparisons')}. Quando o pivô cai no meio, o trecho se divide em duas partes parecidas; quando cai em um extremo, uma das partes fica vazia e a outra quase não encolhe.`, 'comparison', {
      rows: rows((scenario) => ({
        values: valuesOf(scenario.current),
        sortedIndices: [...scenario.done],
        changedIndices: scenario.calls[index] ? range(scenario.calls[index].fim + 1, scenario.calls[index].ini) : [],
        markIndex: scenario.calls[index]?.meio,
      })),
      variables: { particionamento: `${index + 1} / ${rounds}`, 'comparações': joined('comparisons'), trocas: joined('swaps') },
    }));
  }

  const ordered = scenarios[1];
  steps.push(step(values, Q.end, 'O custo depende da ordem', `Comparações: ${joined('comparisons')}. Os vetores ordenado e invertido, que pareceriam fáceis, são o pior caso: o pivô (o primeiro valor) é sempre o menor ou o maior do trecho, são ${plural(ordered.calls.length, 'particionamento', 'particionamentos')} que quase não encolhem o trecho, e o custo é quadrático. Com o pivô na mediana, o mesmo conjunto de valores custa muito menos. O custo do Quicksort depende da ordem inicial, e aqui o caso que parece fácil (já ordenado) é o pior.`, 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.final), sortedIndices: range(n) })),
    output: scenarios.map((scenario) => `${scenario.label}: ${scenario.comparisons} comparações, ${scenario.swaps} trocas`),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 05 · Estabilidade: o que cada particionamento faz com os iguais
// ---------------------------------------------------------------------------

function stabilitySteps(values) {
  const n = values.length;
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const { calls, final } = runPartitions(items);
  const done = new Set();
  const log = [];
  let swapped = 0;

  const steps = [
    hasRepeated
      ? step(values, 0, 'Valores repetidos em destaque', 'Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética. Vamos ver, particionamento por particionamento, se algum par de iguais troca de ordem.', 'neutral', { tags: tagsOf(items), sortedIndices: [] })
      : step(values, 0, 'Não há valores repetidos', 'Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com valores repetidos.', 'warning', { tags: tagsOf(items), sortedIndices: [] }),
  ];

  calls.forEach((call) => {
    done.add(call.meio);
    if (call.meio - 1 === call.ini) done.add(call.ini);
    if (call.meio + 1 === call.fim) done.add(call.fim);
    const pairs = flippedPairs(call.before, call.after);
    const moved = pairs.flatMap(([x, y]) => [x, y]);
    const warnIndices = call.after.map((item, index) => (moved.some((m) => m.v === item.v && m.tag === item.tag) ? index : -1)).filter((index) => index >= 0);
    swapped += pairs.length;
    pairs.forEach(([x, y]) => log.push(`particionar(${call.ini}, ${call.fim}): ${label(y)} passou à frente de ${label(x)}`));
    const noRepeat = !call.before.slice(call.ini, call.fim + 1).some((item) => item.tag);
    steps.push(step(valuesOf(call.after), OFFSET + P.pivotPut, `particionar(${call.ini}, ${call.fim})`, pairs.length
      ? `${pairs.map(([x, y]) => `${label(y)} passou à frente de ${label(x)}`).join('; ')}. O trecho ficou ${vec(call.after.slice(call.ini, call.fim + 1))}. ${pairs.length === 1 ? 'Esses dois iguais' : 'Esses pares de iguais'} não estão mais na ordem original: a troca de vetor[i] com vetor[j] (ou do pivô com vetor[j]) leva um valor da ponta direita para a esquerda por cima de um igual.`
      : `${noRepeat ? 'Não há valores repetidos neste trecho.' : 'Os iguais deste trecho continuam na ordem original.'} O pivô ${label(call.before[call.ini])} foi para a posição ${call.meio}.`, pairs.length ? 'warning' : 'comparison', {
      tags: tagsOf(call.after),
      sortedIndices: [...done],
      outsideIndices: range(n).filter((position) => position < call.ini || position > call.fim),
      pointers: { inicio: call.ini, fim: call.fim, meio: call.meio },
      warnIndices,
      changedIndices: range(call.fim + 1, call.ini),
      output: clone(log),
      variables: { trecho: `${call.ini}..${call.fim}`, 'pares invertidos': swapped },
    }));
  });

  const stable = isStable(final);
  steps.push(step(valuesOf(final), Q.end, !hasRepeated ? 'Resultado' : stable ? 'Resultado: ordem preservada neste vetor' : 'Resultado: instável', !hasRepeated
    ? 'O vetor não tinha valores repetidos, então não há o que comparar.'
    : stable
      ? 'Neste vetor a ordem dos iguais foi preservada, mas por acaso: o Quicksort não garante isso. Use "Gerar exemplo" para ver um vetor em que a ordem se inverte.'
      : `Ordem final: ${final.map(label).join(' ')}. Pelo menos um par de iguais trocou de ordem: o Quicksort é instável, porque as trocas feitas por i e j e a troca final do pivô movem valores por cima de iguais.`, !hasRepeated || stable ? 'done' : 'warning', {
    tags: tagsOf(final),
    sortedIndices: range(n),
    output: [...log, `Ordem final: ${final.map(label).join(' ')}`, !hasRepeated ? 'Sem valores repetidos.' : stable ? 'Ordem dos iguais preservada.' : 'Ordem dos iguais alterada.'],
  }));
  return steps;
}

export function buildSteps(id, values, config = {}) {
  switch (id) {
    case 'partition': return partitionSteps(values, config);
    case 'quick-sort': return quickSortSteps(toItems(values));
    case 'counting': return countingSteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    case 'stability': return stabilitySteps(values);
    default: return partitionSteps(values, config);
  }
}
