import {
  NONE, ascending, clone, fmt, isStable, label, step, tagDuplicates, tagsOf, toItems, valuesOf,
} from '../shared/sort-steps.js';

// Pseudocódigo da aula (slide 26): o laço de i avança no vetor e o de j leva o elemento para a
// esquerda, trocando-o com o vizinho enquanto o vizinho for maior.
const SORT_CODE = [
  'FUNÇÃO insertionSort(vetor)',
  '  n ← vetor.length',
  '  PARA i de 1 até n - 1 FAÇA',
  '    j ← i',
  '    ENQUANTO j > 0 E vetor[j - 1] > vetor[j] FAÇA',
  '      inverter(vetor[j - 1], vetor[j])',
  '      j ← j - 1',
  '    FIM ENQUANTO',
  '  FIM PARA',
  'FIM',
];

// O laço interno sozinho: inserir o elemento da posição i no sub-vetor ordenado à esquerda dele.
const INSERT_CODE = [
  'FUNÇÃO inserir(vetor, i)',
  '  j ← i',
  '  ENQUANTO j > 0 E vetor[j - 1] > vetor[j] FAÇA',
  '    inverter(vetor[j - 1], vetor[j])',
  '    j ← j - 1',
  '  FIM ENQUANTO',
  'FIM',
];

// Linhas de SORT_CODE e de INSERT_CODE (base 0).
const LINE = { n: 1, loopI: 2, init: 3, test: 4, swap: 5, dec: 6, end: 9 };
const ONE = { init: 1, test: 2, swap: 3, dec: 4, end: 6 };

export const algorithms = [
  {
    id: 'insert-one', title: 'Inserir um elemento', menuLabel: 'Inserir um elemento', group: 'Como funciona', number: '01',
    description: 'Pegue o elemento da posição i e leve-o para a esquerda, trocando com o vizinho enquanto o vizinho for maior. O sub-vetor à esquerda já está ordenado.',
    interaction: 'Escolha a posição i ou clique em uma célula do vetor. As posições à esquerda aparecem ordenadas, como depois das passadas anteriores.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso o elemento anda por todas as posições à esquerda; no melhor caso, uma única comparação.' },
    pseudocode: INSERT_CODE,
  },
  {
    id: 'insertion-sort', title: 'Insertion Sort', menuLabel: 'Insertion Sort', group: 'Como funciona', number: '02',
    description: 'Da esquerda para a direita, insira cada elemento no sub-vetor ordenado que o precede, até o vetor inteiro ficar ordenado.',
    interaction: 'Pause nas comparações e acompanhe i e j. A parte verde, à esquerda de i, já está ordenada (ainda não é a posição final).',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'S(n) = 4: além do vetor, que é ordenado no próprio lugar, só existem n, i, j e a variável temporária da troca. No melhor caso (vetor ordenado) o custo é O(n).' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'counting', title: 'Contando as operações', menuLabel: 'Complexidade de tempo', group: 'Análise do algoritmo', number: '03',
    description: 'Conte as comparações e as trocas de cada passada e veja como o custo depende da ordem do vetor.',
    interaction: 'Gere vetores de tamanhos diferentes e compare o total com n(n−1)/2, o pior caso.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'Pior caso (vetor invertido): 1 + 2 + … + (n−1) = n(n−1)/2 comparações e trocas. Melhor caso (ordenado): n − 1 comparações e nenhuma troca.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'adaptability', title: 'Adaptabilidade', menuLabel: 'Adaptabilidade', group: 'Análise do algoritmo', number: '04',
    description: 'Execute o algoritmo em três vetores com os mesmos valores em ordens diferentes e compare os contadores.',
    interaction: 'Avance passo a passo e observe que o vetor já ordenado custa uma comparação por passada, enquanto o invertido custa i.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'É adaptável: num vetor já ordenado (ou quase) faz só n − 1 comparações, em tempo linear; no invertido faz n(n−1)/2.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'stability', title: 'Estabilidade', menuLabel: 'Estabilidade', group: 'Análise do algoritmo', number: '05',
    description: 'Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.',
    interaction: 'Use "Gerar exemplo" para criar um vetor com valores repetidos e veja o elemento parar logo depois do igual que já estava lá.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'O laço para quando vetor[j−1] > vetor[j] é falso, inclusive quando são iguais: o elemento sempre fica depois dos iguais a ele, então o Insertion Sort é estável.' },
    pseudocode: SORT_CODE,
  },
];

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

const compareOf = (values, j, result) => ({
  left: { label: 'vetor[j - 1]', value: fmt(values[j - 1]) },
  op: '>',
  right: { label: 'vetor[j]', value: fmt(values[j]) },
  result,
});

// ---------------------------------------------------------------------------
// Execução por passadas: base das simulações de análise (contagem, adaptabilidade e
// estabilidade). Cada item é { v: valor, tag: letra }.
// ---------------------------------------------------------------------------

/**
 * Cada passada insere o elemento da posição i. Devolve o vetor antes e depois, a posição em que ele
 * parou (`to`), as comparações, as trocas e o item igual que o fez parar, se houve (`stoppedBy`).
 */
function runPasses(items) {
  const current = items.map((item) => ({ ...item }));
  const passes = [];
  for (let i = 1; i < current.length; i += 1) {
    const before = current.map((item) => ({ ...item }));
    const moved = { ...current[i] };
    let j = i;
    let comparisons = 0;
    let swaps = 0;
    let stoppedBy = null;
    while (j > 0) {
      comparisons += 1;
      if (current[j - 1].v > current[j].v) {
        [current[j - 1], current[j]] = [current[j], current[j - 1]];
        swaps += 1;
        j -= 1;
      } else {
        if (current[j - 1].v === current[j].v) stoppedBy = { ...current[j - 1] };
        break;
      }
    }
    passes.push({
      i, to: j, comparisons, swaps, moved, stoppedBy, before, after: current.map((item) => ({ ...item })),
    });
  }
  return passes;
}

/**
 * Insere o elemento da posição i, um passo por linha executada (o laço interno). Altera `a`,
 * atualiza `count` e `scope.j` e acrescenta os passos a `steps`. `at(extra)` completa cada passo com
 * o que é comum à passada (variáveis, contadores, parte ordenada e fase).
 */
function insertPass(steps, a, i, L, { at, scope, count }) {
  let j = i;
  scope.j = j;
  steps.push(step(a, L.init, 'j ← i', `j recebe ${i}: vamos levar ${fmt(a[i])}, o elemento da posição ${i}, para o lugar dele no sub-vetor ordenado à esquerda.`, 'update', at({ pointers: { i, j } })));

  for (;;) {
    if (j === 0) {
      steps.push(step(a, L.test, 'ENQUANTO j > 0 E …', `j > 0 é falso: o laço termina. Como o E só avalia o lado direito quando o esquerdo é verdadeiro, vetor[j - 1] nem chega a ser examinado. ${fmt(a[0])} chegou ao início do vetor.`, 'success', at({ pointers: { i, j }, sortedCount: i + 1 })));
      break;
    }
    count.comparisons += 1;
    const greater = a[j - 1] > a[j];
    let verdict;
    if (greater) verdict = 'O vizinho da esquerda é maior: o elemento ainda não está no lugar e o laço continua.';
    else if (a[j - 1] === a[j]) verdict = 'Valores iguais: o teste é estrito (>), então o laço termina e o elemento fica depois do igual.';
    else verdict = 'O vizinho da esquerda não é maior: o elemento já está no lugar e o laço termina.';
    steps.push(step(a, L.test, 'ENQUANTO j > 0 E vetor[j - 1] > vetor[j]', `j > 0 é verdadeiro e ${fmt(a[j - 1])} > ${fmt(a[j])} é ${greater ? 'verdadeiro' : 'falso'}. ${verdict}`, greater ? 'comparison' : 'success', at({
      pointers: { i, prev: j - 1, j }, compare: compareOf(a, j, greater), sortedCount: greater ? i : i + 1,
    })));
    if (!greater) break;

    const [big, small] = [a[j - 1], a[j]];
    [a[j - 1], a[j]] = [small, big];
    count.swaps += 1;
    steps.push(step(a, L.swap, 'inverter(vetor[j - 1], vetor[j])', `${fmt(big)} e ${fmt(small)} trocam de lugar: ${fmt(small)} anda uma posição para a esquerda.`, 'update', at({
      pointers: { i, prev: j - 1, j }, comparedIndices: [j - 1, j], changedIndices: [j - 1, j],
    })));
    j -= 1;
    scope.j = j;
    steps.push(step(a, L.dec, 'j ← j - 1', `j recebe ${j}: o elemento ${fmt(a[j])} continua sendo acompanhado, agora na posição ${j}.`, 'update', at({ pointers: { i, j } })));
  }
  return j;
}

// ---------------------------------------------------------------------------
// 01 · Inserir um elemento
// ---------------------------------------------------------------------------

function insertOneSteps(values, config) {
  const n = values.length;
  const i = Math.max(1, Math.min(n - 1, Number.isInteger(Number(config.i)) ? Number(config.i) : n - 1));
  // As passadas anteriores deixam as i primeiras posições ordenadas.
  const a = [...ascending(values.slice(0, i)), ...values.slice(i)];
  const element = a[i];
  const count = { comparisons: 0, swaps: 0 };
  const scope = { i, j: NONE };
  const phase = { label: `i = ${i}`, text: `Insere ${fmt(element)} no sub-vetor ordenado`, code: true };
  const at = (extra) => ({ sortedCount: i, phase, variables: { ...scope }, stats: { 'comparações': count.comparisons, trocas: count.swaps }, ...extra });

  const steps = [
    step(a, 0, 'Iniciando a inserção', `As passadas anteriores deixaram as ${i} primeiras posições ordenadas entre si (em verde). Vamos inserir ${fmt(element)}, o elemento da posição ${i}. O parâmetro i já tem valor (${i}); j ainda não foi atribuído.`, 'neutral', at({ pointers: { i } })),
  ];
  const j = insertPass(steps, a, i, ONE, { at, scope, count });

  steps.push(step(a, ONE.end, 'Inserção concluída', j === i
    ? `${fmt(element)} já estava no lugar: ficou na posição ${i}, depois de ${count.comparisons} comparação e nenhuma troca.`
    : `${fmt(element)} foi inserido na posição ${j}, depois de ${plural(count.comparisons, 'comparação', 'comparações')} e ${plural(count.swaps, 'troca', 'trocas')}. As ${i + 1} primeiras posições estão ordenadas.`, 'done', {
    ...at({ sortedCount: i + 1 }),
    foundIndices: [j],
    output: [`Posição final de ${fmt(element)}: ${j}`, `Comparações: ${count.comparisons} · Trocas: ${count.swaps}`],
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 02 · Insertion Sort completo, passo a passo como num depurador
// ---------------------------------------------------------------------------

function sortSteps(values) {
  const a = clone(values);
  const n = a.length;
  const log = [];
  const count = { comparisons: 0, swaps: 0 };
  const stats = () => ({ 'comparações': count.comparisons, trocas: count.swaps });
  const scope = { n: NONE, i: NONE, j: NONE };
  const steps = [
    step(a, 0, 'Iniciando o Insertion Sort', `O vetor tem ${n} posições. As variáveis n, i e j ainda não foram atribuídas. A primeira posição, sozinha, já é um sub-vetor ordenado; a cada passada, o próximo elemento é inserido nele.`, 'neutral', { sortedCount: 1, stats: stats(), variables: { ...scope } }),
  ];

  scope.n = n;
  steps.push(step(a, LINE.n, 'n ← vetor.length', `n recebe ${n}, o tamanho do vetor.`, 'update', { sortedCount: 1, stats: stats(), variables: { ...scope } }));

  for (let i = 1; i < n; i += 1) {
    const element = a[i];
    const phase = { label: `i = ${i}`, text: `Insere ${fmt(element)} no sub-vetor ordenado`, code: true };
    const at = (extra) => ({ sortedCount: i, phase, stats: stats(), output: clone(log), variables: { ...scope }, ...extra });

    scope.i = i;
    const ordered = i === 1 ? 'A posição 0, sozinha, já é um sub-vetor ordenado' : `As ${i} primeiras posições estão ordenadas entre si`;
    steps.push(step(a, LINE.loopI, `PARA i (i = ${i})`, `i recebe ${i} e a condição i ≤ ${n - 1} é verdadeira: o laço entra. ${ordered}; falta inserir ${fmt(element)}.`, 'reading', at({ pointers: { i } })));
    const j = insertPass(steps, a, i, LINE, { at, scope, count });
    log.push(j === i ? `i = ${i}: ${fmt(element)} ficou onde estava` : `i = ${i}: ${fmt(element)} → posição ${j}`);
  }

  scope.i = n;
  steps.push(step(a, LINE.loopI, `PARA i (i = ${n}): fim`, `i recebe ${n} e a condição i ≤ ${n - 1} é falsa: o laço termina. O sub-vetor ordenado ocupa o vetor inteiro.`, 'success', {
    sortedCount: n, stats: stats(), output: clone(log), variables: { ...scope },
  }));
  steps.push(step(a, LINE.end, 'Ordenação concluída', `Todas as posições estão em ordem crescente, após ${count.comparisons} comparações e ${count.swaps} trocas.`, 'done', {
    sortedCount: n,
    stats: stats(),
    variables: { ...scope },
    output: [...log, `Vetor ordenado: [${a.map(fmt).join(', ')}]`, `Comparações: ${count.comparisons} · Trocas: ${count.swaps}`],
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// Passadas resumidas (03, 04 e 05): o laço interno vira um passo na linha do ENQUANTO e as
// trocas, outro na linha de inverter.
// ---------------------------------------------------------------------------

const movedRange = (pass) => Array.from({ length: pass.i - pass.to + 1 }, (_, k) => pass.to + k);

// ---------------------------------------------------------------------------
// 03 · Contando as operações
// ---------------------------------------------------------------------------

function countingSteps(values) {
  const n = values.length;
  const passes = runPasses(toItems(values));
  const worst = (n * (n - 1)) / 2;
  const bars = passes.map((pass) => ({
    label: `i = ${pass.i}`, value: null, mark: '', current: false,
  }));
  let comparisons = 0;
  let swaps = 0;
  const chart = (final = false) => ({
    title: 'Comparações em cada passada (valor de i)',
    hint: '⇄ + número = trocas na passada',
    max: n - 1,
    bars: bars.map((bar) => ({ ...bar })),
    totals: [
      { label: 'Comparações', value: comparisons, note: final ? `entre n − 1 = ${n - 1} e n(n−1)/2 = ${worst}` : `de ${n - 1} (ordenado) a ${worst} (invertido)` },
      { label: 'Trocas', value: swaps, note: final ? `entre 0 e n(n−1)/2 = ${worst}` : `de 0 (ordenado) a ${worst} (invertido)` },
    ],
    final,
  });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, 0, 'Contando as operações', `Com n = ${n}, o laço PARA i executa ${n - 1} vezes. Em cada passada, o laço interno compara e troca até o elemento encontrar o lugar dele: quantas vezes depende da ordem do vetor.`, 'neutral', common({ sortedCount: 1 })),
  ];

  passes.forEach((pass, index) => {
    const { i } = pass;
    const phase = { label: `i = ${i}`, text: `Insere ${fmt(pass.moved.v)} no sub-vetor ordenado`, code: true };
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += pass.comparisons;
    bars[index].value = pass.comparisons;

    const reachedStart = pass.to === 0;
    let how;
    if (reachedStart && pass.swaps) how = `todas resultam em troca: o elemento chega ao início do vetor, e a condição j > 0 é que interrompe o laço`;
    else if (pass.swaps) how = `${plural(pass.swaps, 'resulta', 'resultam')} em troca e a última, falsa, interrompe o laço`;
    else how = 'a primeira já é falsa: o elemento já estava no lugar e o laço termina de imediato';
    steps.push(step(valuesOf(pass.before), LINE.test, `i = ${i}: comparações`, `O teste do ENQUANTO compara vetor[j - 1] > vetor[j] ${plural(pass.comparisons, 'vez', 'vezes')}: ${how}.`, 'comparison', common({
      sortedCount: i, pointers: { i }, phase, variables: { i, 'comparações da passada': pass.comparisons, 'comparações acumuladas': comparisons },
    })));

    if (pass.swaps) {
      swaps += pass.swaps;
      bars[index].mark = `⇄ ${pass.swaps}`;
      steps.push(step(valuesOf(pass.after), LINE.swap, `i = ${i}: trocas`, `A linha inverter executa ${plural(pass.swaps, 'vez', 'vezes')} (e j ← j − 1 também): ${fmt(pass.moved.v)} anda da posição ${i} até a ${pass.to}.`, 'update', common({
        sortedCount: i + 1, changedIndices: movedRange(pass), pointers: { i }, phase, variables: { i, trocas: swaps, 'comparações acumuladas': comparisons },
      })));
    }
  });

  bars.forEach((bar) => { bar.current = false; });
  const series = passes.map((pass) => pass.comparisons);
  steps.push(step(valuesOf(passes.at(-1).after), LINE.end, 'Somando as passadas', `${series.join(' + ')} = ${comparisons} comparações e ${swaps} trocas, com n = ${n}. No pior caso (invertido) seriam n(n−1)/2 = ${worst} de cada; no melhor (ordenado), ${n - 1} comparações e nenhuma troca. Depende da ordem do vetor.`, 'done', common({
    final: true,
    sortedCount: n,
    variables: { n, 'comparações': comparisons, trocas: swaps, 'n(n−1)/2': worst },
    output: [
      `Comparações: ${comparisons}`,
      `Trocas: ${swaps}`,
      `Melhor caso: ${n - 1} comparações, 0 trocas`,
      `Pior caso: ${worst} comparações, ${worst} trocas`,
    ],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Adaptabilidade
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const inOrder = ascending(values);
  const scenarios = [
    { label: 'Já ordenado', values: inOrder },
    { label: 'Ordem inversa', values: [...inOrder].reverse() },
    { label: 'Seu vetor', values: clone(values) },
  ].map((scenario) => ({ ...scenario, passes: runPasses(toItems(scenario.values)), comparisons: 0, swaps: 0 }));
  const worst = (n * (n - 1)) / 2;

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, 'Três vetores, os mesmos valores', 'O primeiro já está ordenado, o segundo está em ordem inversa e o terceiro é o seu vetor. O algoritmo vai tratar os três do mesmo jeito?', 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedCount: 1 })),
    }),
  ];

  for (let index = 0; index < n - 1; index += 1) {
    scenarios.forEach((scenario) => {
      scenario.comparisons += scenario.passes[index].comparisons;
      scenario.swaps += scenario.passes[index].swaps;
    });
    const i = index + 1;
    const perPass = scenarios.map((scenario) => scenario.passes[index].comparisons).join(' · ');
    steps.push(step(values, LINE.test, `i = ${i}: inserção`, `Comparações nesta passada: ${perPass} (ordenado · inverso · seu). O vetor ordenado faz uma só por passada; o invertido leva o elemento até o início. Total acumulado: ${joined('comparisons')}.`, 'comparison', {
      rows: rows((scenario) => ({
        values: valuesOf(scenario.passes[index].after), sortedCount: i + 1, markIndex: scenario.passes[index].to,
      })),
      variables: { i, 'comparações': joined('comparisons'), trocas: joined('swaps') },
    }));
  }

  steps.push(step(values, LINE.end, 'O custo depende da ordem', `Os três vetores terminaram com ${joined('comparisons')} comparações e ${joined('swaps')} trocas (ordenado · inverso · seu). O ordenado custou n − 1 = ${n - 1} comparações, tempo linear; o invertido, n(n−1)/2 = ${worst}. O Insertion Sort é adaptável.`, 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.passes.at(-1).after), sortedCount: n })),
    output: scenarios.map((scenario) => `${scenario.label}: ${scenario.comparisons} comparações, ${scenario.swaps} trocas`),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 05 · Estabilidade
// ---------------------------------------------------------------------------

function stabilitySteps(values) {
  const n = values.length;
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const passes = runPasses(items);
  const log = [];
  const steps = [
    hasRepeated
      ? step(values, 0, 'Valores repetidos em destaque', 'Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética.', 'neutral', { tags: tagsOf(items), sortedCount: 1 })
      : step(values, 0, 'Não há valores repetidos', 'Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com repetidos.', 'warning', { tags: tagsOf(items), sortedCount: 1 }),
  ];

  passes.forEach((pass) => {
    const { i, to, moved } = pass;
    const phase = { label: `i = ${i}`, text: `Insere ${label(moved)} no sub-vetor ordenado`, code: true };
    const after = pass.after;
    const common = { tags: tagsOf(after), phase, variables: { i, j: to } };

    if (pass.stoppedBy) {
      const wall = pass.stoppedBy;
      log.push(`i = ${i}: ${label(moved)} parou depois de ${label(wall)}`);
      steps.push(step(valuesOf(after), LINE.test, `i = ${i}: ${label(moved)} para ao encontrar ${label(wall)}`, `${label(moved)} andou da posição ${i} até a ${to}. Lá encontrou ${label(wall)}: ${fmt(wall.v)} > ${fmt(moved.v)} é falso, então o laço termina e ${label(moved)} fica DEPOIS de ${label(wall)}, na mesma ordem em que os dois apareciam no vetor.`, 'comparison', {
        ...common, pointers: { i, prev: to - 1, j: to }, compare: compareOf(valuesOf(after), to, false), sortedCount: i + 1, output: clone(log),
      }));
    } else {
      steps.push(step(valuesOf(after), LINE.test, `i = ${i}: ${label(moved)} é inserido`, to === i
        ? `${label(moved)} já estava no lugar: o vizinho da esquerda não é maior.`
        : `${label(moved)} andou da posição ${i} até a ${to}, trocando só com vizinhos estritamente maiores${to === 0 ? ' e chegou ao início do vetor' : ''}.`, 'success', {
        ...common, pointers: { i, j: to }, sortedCount: i + 1, changedIndices: movedRange(pass), output: clone(log),
      }));
    }
  });

  const final = passes.length ? passes.at(-1).after : items;
  const order = final.map(label).join(' ');
  steps.push(step(valuesOf(final), LINE.end, hasRepeated ? 'Resultado: estável' : 'Resultado', hasRepeated && isStable(final)
    ? 'A ordem relativa dos iguais foi preservada: as letras de cada valor continuam em ordem alfabética. O Insertion Sort é estável porque o laço para diante de um valor igual, em vez de passar por cima dele.'
    : 'O vetor não tinha valores repetidos, então não há o que comparar.', 'done', {
    tags: tagsOf(final),
    sortedCount: n,
    output: [...log, `Ordem final: ${order}`, hasRepeated ? 'Ordem dos iguais preservada.' : 'Sem valores repetidos.'],
  }));
  return steps;
}

export function buildSteps(id, values, config) {
  switch (id) {
    case 'insert-one': return insertOneSteps(values, config);
    case 'insertion-sort': return sortSteps(values);
    case 'counting': return countingSteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    case 'stability': return stabilitySteps(values);
    default: return insertOneSteps(values, config);
  }
}
