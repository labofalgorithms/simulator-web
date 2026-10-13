import {
  NONE, ascending, clone, fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf,
} from '../shared/sort-steps.js';

// Pseudocódigo da aula (slide 37): n passadas, e em cada uma o laço de j varre o vetor inteiro.
const SORT_CODE = [
  'FUNÇÃO bubbleSort(vetor)',
  '  n ← vetor.length',
  '  PARA i de 0 até n - 1 FAÇA',
  '    PARA j de 1 até n - 1 FAÇA',
  '      SE vetor[j - 1] > vetor[j] ENTÃO',
  '        inverter(vetor[j - 1], vetor[j])',
  '      FIM SE',
  '    FIM PARA',
  '  FIM PARA',
  'FIM',
];

// Versão otimizada (slides 105 a 107): a cada passada o maior valor já está no fim, então o laço de
// j para antes. Em base 0 são n - 1 - i comparações na passada i (o slide escreve n - i, que sairia
// do vetor), e a última passada útil é i = n - 2.
const OPTIMIZED_CODE = [
  'FUNÇÃO bubbleSortOtimizado(vetor)',
  '  n ← vetor.length',
  '  PARA i de 0 até n - 2 FAÇA',
  '    PARA j de 1 até n - 1 - i FAÇA',
  '      SE vetor[j - 1] > vetor[j] ENTÃO',
  '        inverter(vetor[j - 1], vetor[j])',
  '      FIM SE',
  '    FIM PARA',
  '  FIM PARA',
  'FIM',
];

const SWEEP_CODE = [
  'FUNÇÃO varredura(vetor, fim)',
  '  PARA j de 1 até fim FAÇA',
  '    SE vetor[j - 1] > vetor[j] ENTÃO',
  '      inverter(vetor[j - 1], vetor[j])',
  '    FIM SE',
  '  FIM PARA',
  'FIM',
];

// Linhas de SORT_CODE e de OPTIMIZED_CODE (base 0), que têm a mesma forma.
const LINE = { n: 1, loopI: 2, loopJ: 3, test: 4, swap: 5, end: 9 };
// Linhas de SWEEP_CODE.
const SWEEP = { loopJ: 1, test: 2, swap: 3, end: 6 };

export const algorithms = [
  {
    id: 'sweep', title: 'Uma varredura', menuLabel: 'Uma varredura', group: 'Como funciona', number: '01',
    description: 'Percorra o vetor da esquerda para a direita comparando pares vizinhos e trocando os que estão fora de ordem. O maior valor é "empurrado" para o fim.',
    interaction: 'Mude a última posição do trecho ou clique em uma célula do vetor para escolhê-la. Veja o maior valor do trecho viajar até ela.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada par de vizinhos do trecho é comparado uma única vez.' },
    pseudocode: SWEEP_CODE,
  },
  {
    id: 'bubble-sort', title: 'Bubble Sort', menuLabel: 'Bubble Sort', group: 'Como funciona', number: '02',
    description: 'Repita a varredura n vezes. A cada passada, o maior valor ainda fora do lugar sobe como uma bolha até o fim do vetor.',
    interaction: 'Pause nas comparações e acompanhe os marcadores i, j−1 e j. Tudo à direita do trecho verde já está na posição final.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'S(n) = 4: além do vetor, que é ordenado no próprio lugar, só existem n, i, j e a variável temporária da troca.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'optimized', title: 'Bubble Sort otimizado', menuLabel: 'Versão otimizada', group: 'Como funciona', number: '03',
    description: 'Como o maior valor já está no fim depois de cada passada, o laço de j não precisa mais chegar até lá: a varredura encolhe a cada vez.',
    interaction: 'Compare com o Bubble Sort da aula: o resultado é o mesmo, mas as comparações caem de n(n−1) para n(n−1)/2.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'As comparações caem para (n−1) + (n−2) + … + 1 = n(n−1)/2, metade da versão da aula, mas o custo continua quadrático.' },
    pseudocode: OPTIMIZED_CODE,
  },
  {
    id: 'counting', title: 'Contando as operações', menuLabel: 'Complexidade de tempo', group: 'Análise do algoritmo', number: '04',
    description: 'Conte as comparações e as trocas de cada passada e veja por que o custo total cresce com n².',
    interaction: 'Gere vetores de tamanhos diferentes e compare o total de comparações com n(n−1).',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'São n passadas de n − 1 comparações cada: n(n−1). As trocas são uma por par fora de ordem, no máximo n(n−1)/2.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'adaptability', title: 'Adaptabilidade', menuLabel: 'Adaptabilidade', group: 'Análise do algoritmo', number: '05',
    description: 'Execute o algoritmo em três vetores com os mesmos valores em ordens diferentes e compare os contadores.',
    interaction: 'Avance passo a passo e observe que as comparações são idênticas nos três vetores. Só as trocas mudam.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'Melhor, médio e pior caso fazem as mesmas n(n−1) comparações: o Bubble Sort não se adapta à ordem inicial.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'stability', title: 'Estabilidade', menuLabel: 'Estabilidade', group: 'Análise do algoritmo', number: '06',
    description: 'Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.',
    interaction: 'Use "Gerar exemplo" para criar um vetor com valores repetidos e acompanhe o encontro de dois iguais: a troca não acontece.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'A troca exige vetor[j−1] > vetor[j] (estrito) e só ocorre entre vizinhos: dois iguais nunca passam um por cima do outro, então o Bubble Sort é estável.' },
    pseudocode: SORT_CODE,
  },
];

const compareOf = (values, j, result) => ({
  left: { label: 'vetor[j - 1]', value: fmt(values[j - 1]) },
  op: '>',
  right: { label: 'vetor[j]', value: fmt(values[j]) },
  result,
});

const verdictOf = (left, right) => {
  if (left > right) return 'O par está fora de ordem.';
  return left === right ? 'Valores iguais: o teste é estrito (>), então não há troca.' : 'O par já está em ordem.';
};

// ---------------------------------------------------------------------------
// Execução por passadas: base das simulações de análise (contagem, adaptabilidade e
// estabilidade). Cada item é { v: valor, tag: letra }.
// ---------------------------------------------------------------------------

/**
 * Executa as passadas do Bubble Sort da aula (n passadas, cada uma varrendo o vetor inteiro). Cada
 * passada devolve o vetor antes e depois, as comparações, as trocas, as posições j em que houve
 * troca e os encontros de valores iguais (com o vetor naquele momento, para mostrá-los).
 */
function runPasses(items) {
  const current = items.map((item) => ({ ...item }));
  const n = current.length;
  const passes = [];
  for (let i = 0; i < n; i += 1) {
    const before = current.map((item) => ({ ...item }));
    const swappedAt = [];
    const ties = [];
    for (let j = 1; j < n; j += 1) {
      if (current[j - 1].v > current[j].v) {
        [current[j - 1], current[j]] = [current[j], current[j - 1]];
        swappedAt.push(j);
      } else if (current[j - 1].v === current[j].v) {
        ties.push({ j, at: current.map((item) => ({ ...item })) });
      }
    }
    passes.push({
      i, comparisons: n - 1, swaps: swappedAt.length, swappedAt, ties, before, after: current.map((item) => ({ ...item })),
    });
  }
  return passes;
}

const movedBy = (pass) => [...new Set(pass.swappedAt.flatMap((j) => [j - 1, j]))];

// ---------------------------------------------------------------------------
// 01 · Uma varredura
// Execução como num depurador: cada passo é a linha que acabou de executar e as
// variáveis valem o que valeriam naquele ponto.
// ---------------------------------------------------------------------------

function sweepSteps(values, config) {
  const a = clone(values);
  const n = a.length;
  const fim = Math.max(0, Math.min(n - 1, Number.isInteger(Number(config.fim)) ? Number(config.fim) : n - 1));
  const outsideIndices = range(n, fim + 1);
  const phase = { label: 'Varredura', text: 'Compara pares vizinhos' };
  const scope = { fim, j: NONE };
  const base = (extra) => ({ outsideIndices, phase, variables: { ...scope }, ...extra });
  let swaps = 0;

  const steps = [
    step(a, 0, 'Iniciando a varredura', fim === 0
      ? `O trecho vai da posição 0 até a ${fim}: só há um elemento, então não há pares para comparar.`
      : `Compararemos pares vizinhos do trecho que vai da posição 0 até a ${fim}, da esquerda para a direita. O parâmetro fim já tem valor (${fim}); j ainda não foi atribuído.`, 'neutral', base({})),
  ];

  for (let j = 1; j <= fim; j += 1) {
    scope.j = j;
    steps.push(step(a, SWEEP.loopJ, `PARA j (j = ${j})`, `j recebe ${j} e a condição j ≤ ${fim} é verdadeira: o laço entra. O par examinado é (${j - 1}, ${j}).`, 'reading', base({ pointers: { prev: j - 1, j } })));
    const greater = a[j - 1] > a[j];
    steps.push(step(a, SWEEP.test, 'SE vetor[j - 1] > vetor[j]', `${fmt(a[j - 1])} > ${fmt(a[j])} é ${greater ? 'verdadeiro' : 'falso'}. ${verdictOf(a[j - 1], a[j])}`, 'comparison', base({
      pointers: { prev: j - 1, j }, compare: compareOf(a, j, greater),
    })));
    if (greater) {
      const [big, small] = [a[j - 1], a[j]];
      [a[j - 1], a[j]] = [small, big];
      swaps += 1;
      steps.push(step(a, SWEEP.swap, 'inverter(vetor[j - 1], vetor[j])', `${fmt(big)} e ${fmt(small)} trocam de lugar: o maior segue para a direita.`, 'update', base({
        pointers: { prev: j - 1, j }, comparedIndices: [j - 1, j], changedIndices: [j - 1, j],
      })));
    }
  }

  scope.j = fim + 1;
  steps.push(step(a, SWEEP.loopJ, `PARA j (j = ${fim + 1}): fim`, fim === 0
    ? `j recebe 1 e a condição j ≤ 0 é falsa: o laço nem chega a entrar.`
    : `j recebe ${fim + 1} e a condição j ≤ ${fim} é falsa: o laço termina. Todos os pares do trecho foram comparados.`, 'success', base({})));
  steps.push(step(a, SWEEP.end, 'Varredura concluída', `${fim === 0 ? 'Nada mudou.' : `O maior valor do trecho, ${fmt(a[fim])}, está na posição ${fim}.`} A varredura fez ${fim} comparações e ${swaps} trocas.`, 'done', base({
    foundIndices: fim === 0 ? [] : [fim], output: [`Comparações: ${fim}`, `Trocas: ${swaps}`, `Maior do trecho: ${fmt(a[fim])} → posição ${fim}`],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 02 · Bubble Sort e 03 · versão otimizada, passo a passo como num depurador
// ---------------------------------------------------------------------------

function sortSteps(values, optimized = false) {
  const a = clone(values);
  const n = a.length;
  const passesCount = optimized ? n - 1 : n;
  const name = optimized ? 'Bubble Sort otimizado' : 'Bubble Sort';
  const log = [];
  let comparisons = 0;
  let swaps = 0;
  let idle = 0;
  const stats = () => ({ 'comparações': comparisons, trocas: swaps });
  const scope = { n: NONE, i: NONE, j: NONE };
  const steps = [
    step(a, 0, `Iniciando o ${name}`, `O vetor tem ${n} posições. As variáveis n, i e j ainda não foram atribuídas. A cada passada, o maior valor ainda fora do lugar sobe até o fim do trecho que está sendo varrido.`, 'neutral', { stats: stats(), variables: { ...scope } }),
  ];

  scope.n = n;
  steps.push(step(a, LINE.n, 'n ← vetor.length', `n recebe ${n}, o tamanho do vetor.`, 'update', { stats: stats(), variables: { ...scope } }));

  for (let i = 0; i < passesCount; i += 1) {
    const end = optimized ? n - 1 - i : n - 1;
    const at = (extra) => ({ sortedFrom: n - i, stats: stats(), output: clone(log), variables: { ...scope }, ...extra });
    const phase = { label: `i = ${i}`, text: 'Varredura: compara pares vizinhos', code: true };
    let passSwaps = 0;

    scope.i = i;
    steps.push(step(a, LINE.loopI, `PARA i (i = ${i})`, `i recebe ${i} e a condição i ≤ ${passesCount - 1} é verdadeira: o laço entra. ${i === 0
      ? 'Nenhuma posição está definitiva ainda.'
      : `${i === 1 ? 'A última posição já tem' : `As ${i} últimas posições já têm`} o valor definitivo.`}`, 'reading', at({ pointers: { i }, phase })));

    for (let j = 1; j <= end; j += 1) {
      scope.j = j;
      steps.push(step(a, LINE.loopJ, `PARA j (j = ${j})`, `j recebe ${j} e a condição j ≤ ${end} é verdadeira: o laço entra. O par examinado é (${j - 1}, ${j}).`, 'reading', at({ pointers: { i, prev: j - 1, j }, phase })));
      comparisons += 1;
      const greater = a[j - 1] > a[j];
      steps.push(step(a, LINE.test, 'SE vetor[j - 1] > vetor[j]', `${fmt(a[j - 1])} > ${fmt(a[j])} é ${greater ? 'verdadeiro' : 'falso'}. ${verdictOf(a[j - 1], a[j])}`, 'comparison', at({
        pointers: { i, prev: j - 1, j }, compare: compareOf(a, j, greater), phase,
      })));
      if (greater) {
        const [big, small] = [a[j - 1], a[j]];
        [a[j - 1], a[j]] = [small, big];
        swaps += 1;
        passSwaps += 1;
        steps.push(step(a, LINE.swap, 'inverter(vetor[j - 1], vetor[j])', `${fmt(big)} e ${fmt(small)} trocam de lugar: o maior segue para a direita.`, 'update', at({
          pointers: { i, prev: j - 1, j }, comparedIndices: [j - 1, j], changedIndices: [j - 1, j], phase,
        })));
      }
    }

    scope.j = end + 1;
    const position = n - 1 - i;
    if (!passSwaps) idle += 1;
    log.push(`i = ${i}: ${passSwaps ? `${fmt(a[position])} → posição ${position}` : 'nenhuma troca'}`);
    let ending;
    if (end < 1) ending = `j recebe ${end + 1} e a condição j ≤ ${end} é falsa: o laço nem chega a entrar, porque não há pares para comparar.`;
    else if (passSwaps) ending = `j recebe ${end + 1} e a condição j ≤ ${end} é falsa: o laço termina. A varredura fez ${plural(end, 'comparação', 'comparações')} e ${plural(passSwaps, 'troca', 'trocas')}; ${fmt(a[position])} chegou à posição ${position}, a definitiva.`;
    else ending = `j recebe ${end + 1} e a condição j ≤ ${end} é falsa: o laço termina. O j andou até o final e não houve nenhuma troca nesta passada.${optimized ? '' : ' Mesmo assim, o laço de i continua.'}`;
    steps.push(step(a, LINE.loopJ, `PARA j (j = ${end + 1}): fim`, ending, 'success', at({
      sortedFrom: n - (i + 1), pointers: { i }, phase, output: clone(log),
    })));
  }

  scope.i = passesCount;
  steps.push(step(a, LINE.loopI, `PARA i (i = ${passesCount}): fim`, `i recebe ${passesCount} e a condição i ≤ ${passesCount - 1} é falsa: o laço termina. Todas as posições estão em sua posição final.`, 'success', {
    sortedFrom: 0, stats: stats(), output: clone(log), variables: { ...scope },
  }));

  const original = n * (n - 1);
  let closing = `Todas as posições estão em ordem crescente, após ${comparisons} comparações e ${swaps} trocas.`;
  if (optimized) closing += ` A versão da aula faria n(n−1) = ${original} comparações; esta fez ${comparisons}.`;
  else if (idle) closing += ` ${plural(idle, 'passada não trocou', 'passadas não trocaram')} nada: o algoritmo continua varrendo mesmo com o vetor já ordenado. É isso que a otimização evita.`;
  steps.push(step(a, LINE.end, 'Ordenação concluída', closing, 'done', {
    sortedFrom: 0,
    stats: stats(),
    variables: { ...scope },
    output: [...log, `Vetor ordenado: [${a.map(fmt).join(', ')}]`, `Comparações: ${comparisons} · Trocas: ${swaps}`],
  }));
  return steps;
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

// ---------------------------------------------------------------------------
// 04 · Contando as operações
// Passadas resumidas (04, 05 e 06): a varredura vira um passo na linha do SE e as trocas, outro
// na linha de inverter.
// ---------------------------------------------------------------------------

function countingSteps(values) {
  const n = values.length;
  const passes = runPasses(toItems(values));
  const expected = n * (n - 1);
  const worstSwaps = (n * (n - 1)) / 2;
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
      { label: 'Comparações', value: comparisons, note: final ? `n(n−1) = ${n}·${n - 1} = ${expected}` : `esperado ao final: ${expected}` },
      { label: 'Trocas', value: swaps, note: final ? `no máximo n(n−1)/2 = ${worstSwaps}` : `no máximo ${worstSwaps}` },
    ],
    final,
  });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, 0, 'Contando as operações', `Com n = ${n}, o laço PARA i executa ${n} vezes e, em cada uma, o laço PARA j compara ${n - 1} pares. Vamos contar as comparações e as trocas de cada passada.`, 'neutral', common({})),
  ];

  passes.forEach((pass, index) => {
    const { i } = pass;
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += pass.comparisons;
    bars[index].value = pass.comparisons;
    const phase = { label: `i = ${i}`, text: 'Varredura: compara pares vizinhos', code: true };

    steps.push(step(valuesOf(pass.before), LINE.test, `i = ${i}: varredura`, `A linha SE vetor[j - 1] > vetor[j] executa ${pass.comparisons} vezes, uma para cada j de 1 a ${n - 1}, até nas posições que já estão no lugar. ${pass.swaps
      ? `${plural(pass.swaps, 'comparação resulta', 'comparações resultam')} em troca.`
      : 'Nenhuma delas resulta em troca.'}`, 'comparison', common({
      sortedFrom: n - i, pointers: { i }, phase, variables: { i, 'comparações da passada': pass.comparisons, 'comparações acumuladas': comparisons },
    })));

    if (pass.swaps) {
      swaps += pass.swaps;
      bars[index].mark = `⇄ ${pass.swaps}`;
      steps.push(step(valuesOf(pass.after), LINE.swap, `i = ${i}: trocas`, `A linha inverter executa ${pass.swaps} ${pass.swaps === 1 ? 'vez' : 'vezes'} nesta passada: uma para cada par fora de ordem encontrado. ${fmt(pass.after[n - 1 - i].v)} termina na posição ${n - 1 - i}.`, 'update', common({
        sortedFrom: n - (i + 1), changedIndices: movedBy(pass), pointers: { i }, phase, variables: { i, trocas: swaps, 'comparações acumuladas': comparisons },
      })));
    }
  });

  bars.forEach((bar) => { bar.current = false; });
  const doubled = n * 2;
  const doubledExpected = doubled * (doubled - 1);
  steps.push(step(valuesOf(passes.at(-1).after), LINE.end, 'Somando as passadas', `${n} passadas × ${n - 1} comparações = ${comparisons} = n(n−1), com n = ${n}. As trocas somam ${swaps}: uma por par fora de ordem (no máximo n(n−1)/2 = ${worstSwaps}). Como n(n−1) cresce com n², o custo é O(n²).`, 'done', common({
    final: true,
    sortedFrom: 0,
    variables: { n, 'comparações': comparisons, 'n(n−1)': expected, trocas: swaps },
    output: [
      `Comparações: ${comparisons}`,
      `Trocas: ${swaps}`,
      `n(n−1) = ${n}·${n - 1} = ${expected}`,
      `Com n = ${doubled}: ${doubledExpected} comparações (≈ ${(doubledExpected / Math.max(1, expected)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}×)`,
      `Versão otimizada: n(n−1)/2 = ${expected / 2} comparações`,
    ],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 05 · Adaptabilidade
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const inOrder = ascending(values);
  const scenarios = [
    { label: 'Já ordenado', values: inOrder },
    { label: 'Ordem inversa', values: [...inOrder].reverse() },
    { label: 'Seu vetor', values: clone(values) },
  ].map((scenario) => ({ ...scenario, passes: runPasses(toItems(scenario.values)), comparisons: 0, swaps: 0 }));
  const expected = n * (n - 1);

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, 'Três vetores, os mesmos valores', 'O primeiro já está ordenado, o segundo está em ordem inversa e o terceiro é o seu vetor. O algoritmo vai tratar os três do mesmo jeito?', 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedFrom: n })),
    }),
  ];

  for (let index = 0; index < n; index += 1) {
    scenarios.forEach((scenario) => {
      scenario.comparisons += scenario.passes[index].comparisons;
      scenario.swaps += scenario.passes[index].swaps;
    });
    const passSwaps = scenarios.map((scenario) => scenario.passes[index].swaps).join(' · ');
    steps.push(step(values, LINE.test, `i = ${index}: varredura`, `A linha SE executa ${n - 1} vezes em cada vetor, mesmo no que já está ordenado. Trocas nesta passada: ${passSwaps}. Total acumulado: ${joined('comparisons')} comparações.`, 'comparison', {
      rows: rows((scenario) => ({
        values: valuesOf(scenario.passes[index].after), sortedFrom: n - (index + 1), changedIndices: movedBy(scenario.passes[index]),
      })),
      variables: { i: index, 'comparações': joined('comparisons'), trocas: joined('swaps') },
    }));
  }

  steps.push(step(values, LINE.end, 'Mesmas comparações, trocas diferentes', `Os três vetores fizeram ${expected} comparações. Só as trocas mudaram (${joined('swaps')}). Mesmo no vetor ordenado o algoritmo varre tudo n vezes: o Bubble Sort não é adaptável, e o melhor caso também é O(n²).`, 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.passes.at(-1).after), sortedFrom: 0 })),
    output: scenarios.map((scenario) => `${scenario.label}: ${scenario.comparisons} comparações, ${scenario.swaps} trocas`),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 06 · Estabilidade
// ---------------------------------------------------------------------------

function stabilitySteps(values) {
  const n = values.length;
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const passes = runPasses(items);
  const log = [];
  const steps = [
    hasRepeated
      ? step(values, 0, 'Valores repetidos em destaque', 'Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética.', 'neutral', { tags: tagsOf(items), sortedFrom: n })
      : step(values, 0, 'Não há valores repetidos', 'Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com repetidos.', 'warning', { tags: tagsOf(items), sortedFrom: n }),
  ];

  passes.forEach((pass) => {
    const { i } = pass;
    const phase = { label: `i = ${i}`, text: 'Varredura: compara pares vizinhos', code: true };

    pass.ties.forEach(({ j, at }) => {
      const left = at[j - 1];
      const right = at[j];
      log.push(`i = ${i}: ${label(left)} e ${label(right)} se encontraram; sem troca`);
      steps.push(step(valuesOf(at), LINE.test, `i = ${i}: iguais se encontram`, `${label(left)} e ${label(right)} ficam lado a lado (j − 1 = ${j - 1}, j = ${j}). ${fmt(left.v)} > ${fmt(right.v)} é falso, então a troca NÃO acontece e ${label(left)} continua antes de ${label(right)}.`, 'comparison', {
        tags: tagsOf(at), pointers: { i, prev: j - 1, j }, compare: compareOf(valuesOf(at), j, false), sortedFrom: n - i, phase, output: clone(log), variables: { i, j },
      }));
    });

    const sorted = pass.after;
    steps.push(step(valuesOf(sorted), LINE.loopJ, `i = ${i}: fim da varredura`, pass.swaps
      ? `${plural(pass.swaps, 'troca foi feita', 'trocas foram feitas')} nesta passada, sempre entre vizinhos com o da esquerda maior. ${label(sorted[n - 1 - i])} chegou à posição ${n - 1 - i}.`
      : 'Nenhuma troca nesta passada.', 'success', {
      tags: tagsOf(sorted), pointers: { i }, sortedFrom: n - (i + 1), changedIndices: movedBy(pass), phase, output: clone(log), variables: { i },
    }));
  });

  const final = passes.at(-1).after;
  const order = final.map(label).join(' ');
  steps.push(step(valuesOf(final), LINE.end, hasRepeated ? 'Resultado: estável' : 'Resultado', hasRepeated && isStable(final)
    ? 'A ordem relativa dos iguais foi preservada: as letras de cada valor continuam em ordem alfabética. O Bubble Sort é estável porque só troca vizinhos quando o da esquerda é estritamente maior.'
    : 'O vetor não tinha valores repetidos, então não há o que comparar.', 'done', {
    tags: tagsOf(final),
    sortedFrom: 0,
    output: [...log, `Ordem final: ${order}`, hasRepeated ? 'Ordem dos iguais preservada.' : 'Sem valores repetidos.'],
  }));
  return steps;
}

export function buildSteps(id, values, config) {
  switch (id) {
    case 'sweep': return sweepSteps(values, config);
    case 'bubble-sort': return sortSteps(values);
    case 'optimized': return sortSteps(values, true);
    case 'counting': return countingSteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    case 'stability': return stabilitySteps(values);
    default: return sweepSteps(values, config);
  }
}
