const SORT_CODE = [
  'FUNÇÃO selectionSort(vetor)',
  '  PARA i de 0 até vetor.length - 1 FAÇA',
  '    minimo ← i',
  '    PARA j de i + 1 até vetor.length - 1 FAÇA',
  '      SE vetor[j] < vetor[minimo] ENTÃO',
  '        minimo ← j',
  '      FIM SE',
  '    FIM PARA',
  '    temp ← vetor[i]',
  '    vetor[i] ← vetor[minimo]',
  '    vetor[minimo] ← temp',
  '  FIM PARA',
  'FIM',
];

// Linhas do SORT_CODE usadas pelas simulações que avançam uma passada por vez.
const SCAN_LINES = [3, 4, 5];
const SWAP_LINES = [8, 9, 10];
const END_LINE = 12;

export const algorithms = [
  {
    id: 'find-min', title: 'Encontrar o menor (varredura)', menuLabel: 'Encontrar o menor', group: 'Como funciona', number: '01',
    description: 'Percorra o sub-vetor guardando a posição do menor valor visto até agora. É a varredura que o Selection Sort repete a cada passada.',
    interaction: 'Mude a posição inicial ou clique em uma célula do vetor para começar a varredura nela.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada posição do sub-vetor é comparada uma única vez com o menor candidato.' },
    pseudocode: [
      'FUNÇÃO encontrarMenor(vetor, inicio)',
      '  minimo ← inicio',
      '  PARA j de inicio + 1 até vetor.length - 1 FAÇA',
      '    SE vetor[j] < vetor[minimo] ENTÃO',
      '      minimo ← j',
      '    FIM SE',
      '  FIM PARA',
      '  RETORNE minimo',
      'FIM',
    ],
  },
  {
    id: 'selection-sort', title: 'Selection Sort', menuLabel: 'Selection Sort', group: 'Como funciona', number: '02',
    description: 'A cada passada, encontre o menor valor do sub-vetor não ordenado e troque-o com a primeira posição desse sub-vetor.',
    interaction: 'Pause nas comparações e acompanhe os marcadores i, j e min. Tudo à esquerda de i já está ordenado.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'S(n) = 4: além do vetor, que é ordenado no próprio lugar, só existem i, j, minimo e temp.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'counting', title: 'Contando as operações', menuLabel: 'Complexidade de tempo', group: 'Análise do algoritmo', number: '03',
    description: 'Conte as comparações e as trocas de cada passada e veja por que o custo total cresce com n².',
    interaction: 'Gere vetores de tamanhos diferentes e compare o total de comparações com n(n−1)/2.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'As varreduras fazem (n−1) + (n−2) + … + 1 + 0 = n(n−1)/2 comparações; as trocas são apenas n.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'adaptability', title: 'Adaptabilidade', menuLabel: 'Adaptabilidade', group: 'Análise do algoritmo', number: '04',
    description: 'Execute o algoritmo em três vetores com os mesmos valores em ordens diferentes e compare os contadores.',
    interaction: 'Avance passo a passo e observe que os contadores dos três vetores são idênticos em todas as passadas.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'Melhor, médio e pior caso fazem as mesmas n(n−1)/2 comparações: o Selection Sort não se adapta à ordem inicial.' },
    pseudocode: SORT_CODE,
  },
  {
    id: 'stability', title: 'Estabilidade', menuLabel: 'Estabilidade', group: 'Análise do algoritmo', number: '05',
    description: 'Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.',
    interaction: 'Use "Gerar exemplo" para criar um vetor com valores repetidos e acompanhe a troca que inverte a ordem deles.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'A troca entre posições distantes pode passar um elemento por cima de outro igual a ele; por isso o Selection Sort não é estável.' },
    pseudocode: SORT_CODE,
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);
const pad = (number) => String(number).padStart(2, '0');
const step = (values, line, title, description, tone = 'neutral', extra = {}) => ({ values: clone(values), line, title, description, tone, variables: {}, output: [], ...extra });
const compareOf = (values, j, min, result) => ({
  left: { label: 'vetor[j]', value: fmt(values[j]) },
  op: '<',
  right: { label: 'vetor[minimo]', value: fmt(values[min]) },
  result,
});

// ---------------------------------------------------------------------------
// Execução por passadas: base das simulações de análise (contagem,
// adaptabilidade e estabilidade). Cada item é { v: valor, tag: letra }.
// ---------------------------------------------------------------------------

const TAGS = 'abcdefghij';
const toItems = (values) => values.map((v) => ({ v, tag: '' }));

function tagDuplicates(values) {
  const totals = new Map();
  values.forEach((value) => totals.set(value, (totals.get(value) ?? 0) + 1));
  const seen = new Map();
  return values.map((v) => {
    if (totals.get(v) < 2) return { v, tag: '' };
    const occurrence = seen.get(v) ?? 0;
    seen.set(v, occurrence + 1);
    return { v, tag: TAGS[occurrence] };
  });
}

function runPasses(items) {
  const current = items.map((item) => ({ ...item }));
  const n = current.length;
  const passes = [];
  for (let i = 0; i < n; i += 1) {
    let min = i;
    for (let j = i + 1; j < n; j += 1) if (current[j].v < current[min].v) min = j;
    const before = current.map((item) => ({ ...item }));
    const moved = { ...current[i] };
    const jumped = range(min, i + 1).filter((k) => current[k].v === moved.v);
    [current[i], current[min]] = [current[min], current[i]];
    passes.push({ i, min, comparisons: n - 1 - i, before, after: current.map((item) => ({ ...item })), moved, jumped });
  }
  return passes;
}

const isStable = (items) => {
  const last = new Map();
  return items.every((item) => {
    if (!item.tag) return true;
    const previous = last.get(item.v);
    last.set(item.v, item.tag);
    return previous === undefined || previous < item.tag;
  });
};

const label = (item) => (item.tag ? `${fmt(item.v)}(${item.tag})` : fmt(item.v));
const valuesOf = (items) => items.map((item) => item.v);
const tagsOf = (items) => items.map((item) => item.tag);

/** Vetor com repetidos em que o Selection Sort inverte a ordem de dois iguais. */
export function stabilityExample(count) {
  const span = Math.max(3, Math.ceil(count * 0.6));
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const pool = Array.from({ length: span }, () => 10 + Math.floor(Math.random() * 90));
    const values = Array.from({ length: count }, () => pool[Math.floor(Math.random() * span)]);
    const items = tagDuplicates(values);
    if (items.some((item) => item.tag) && !isStable(runPasses(items).at(-1).after)) return values;
  }
  return [40, 40, 20, 60, 10];
}

// ---------------------------------------------------------------------------
// 01 · Encontrar o menor
// ---------------------------------------------------------------------------

function findMinSteps(values, config) {
  const n = values.length;
  const start = Math.max(0, Math.min(n - 1, Number(config.inicio) || 0));
  const outsideIndices = range(start);
  const phase = { label: 'Varredura', text: 'Busca o menor' };
  const base = (extra) => ({ outsideIndices, phase, ...extra });
  const vars = (j, min) => ({ inicio: start, ...(j === null ? {} : { j }), minimo: min, 'vetor[minimo]': values[min] });
  let min = start;

  const steps = [
    step(values, 0, 'Iniciando a varredura', `Procuraremos o menor valor do sub-vetor que vai da posição ${start} até a ${n - 1}.`, 'neutral', base({ variables: { inicio: start } })),
    step(values, 1, 'Primeiro candidato', `minimo recebe ${start}: por enquanto, ${fmt(values[start])} é o menor valor conhecido.`, 'update', base({ pointers: { min }, variables: vars(null, min) })),
  ];

  for (let j = start + 1; j < n; j += 1) {
    const less = values[j] < values[min];
    const verdict = less
      ? 'Encontramos um valor menor.'
      : values[j] === values[min] ? 'Os valores são iguais; o teste estrito (<) mantém o candidato atual.' : `O candidato continua sendo ${fmt(values[min])}.`;
    steps.push(step(values, [2, 3], `Comparando as posições ${j} e ${min}`, `${fmt(values[j])} < ${fmt(values[min])} é ${less ? 'verdadeiro' : 'falso'}. ${verdict}`, 'comparison', base({ pointers: { j, min }, compare: compareOf(values, j, min, less), variables: vars(j, min) })));
    if (less) {
      min = j;
      steps.push(step(values, 4, 'Atualizando o menor', `minimo recebe ${j}: agora o menor candidato é ${fmt(values[min])}.`, 'update', base({ pointers: { j, min }, changedIndices: [j], variables: vars(j, min) })));
    }
  }

  steps.push(step(values, 6, 'Varredura concluída', start === n - 1
    ? 'Não há posições depois de inicio, então o laço nem chega a executar: o único elemento já é o menor.'
    : `Todas as posições até ${n - 1} foram examinadas. O menor valor é ${fmt(values[min])}.`, 'success', base({ pointers: { min }, variables: vars(null, min) })));
  steps.push(step(values, 7, 'Retornando a posição do menor', `A função retorna ${min}: o menor valor do sub-vetor, ${fmt(values[min])}, está na posição ${min}.`, 'done', base({
    pointers: { min },
    variables: vars(null, min),
    output: [`Menor valor: ${fmt(values[min])}`, `Posição: ${min}`],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 02 · Selection Sort completo
// ---------------------------------------------------------------------------

function sortSteps(values) {
  const a = clone(values);
  const n = a.length;
  const log = [];
  let comparisons = 0;
  let swaps = 0;
  const stats = () => ({ 'comparações': comparisons, trocas: swaps });
  const steps = [
    step(a, 0, 'Iniciando o Selection Sort', `O vetor tem ${n} posições. A cada passada, o menor valor do sub-vetor não ordenado vai para a primeira posição dele.`, 'neutral', { stats: stats() }),
  ];

  for (let i = 0; i < n; i += 1) {
    const scan = { label: `Varredura ${pad(i + 1)}`, text: 'Busca o menor' };
    const swap = { label: `Varredura ${pad(i + 1)}`, text: 'Troca o menor com a primeira posição do sub-vetor' };
    let min = i;

    steps.push(step(a, 1, `Iniciando a varredura ${i + 1}`, i < n - 1
      ? `O sub-vetor não ordenado vai da posição ${i} até a ${n - 1}. Tudo à esquerda de i já está em sua posição final.`
      : `Resta apenas a posição ${i}: o último elemento.`, 'reading', { sortedCount: i, pointers: { i }, phase: scan, stats: stats(), variables: { i }, output: clone(log) }));
    steps.push(step(a, 2, 'Assumindo o primeiro como menor', `minimo recebe ${i}: por enquanto, ${fmt(a[i])} é o menor candidato.`, 'update', { sortedCount: i, pointers: { i, min }, phase: scan, stats: stats(), variables: { i, minimo: min }, output: clone(log) }));

    for (let j = i + 1; j < n; j += 1) {
      comparisons += 1;
      const less = a[j] < a[min];
      const verdict = less ? 'Há um novo menor.' : a[j] === a[min] ? 'Valores iguais: o candidato não muda.' : `O candidato continua sendo ${fmt(a[min])}.`;
      steps.push(step(a, [3, 4], `Comparando as posições ${j} e ${min}`, `${fmt(a[j])} < ${fmt(a[min])} é ${less ? 'verdadeiro' : 'falso'}. ${verdict}`, 'comparison', { sortedCount: i, pointers: { i, j, min }, compare: compareOf(a, j, min, less), phase: scan, stats: stats(), variables: { i, j, minimo: min }, output: clone(log) }));
      if (less) {
        min = j;
        steps.push(step(a, 5, 'Atualizando o menor', `minimo recebe ${j}: o novo candidato é ${fmt(a[min])}.`, 'update', { sortedCount: i, pointers: { i, j, min }, changedIndices: [j], phase: scan, stats: stats(), variables: { i, j, minimo: min }, output: clone(log) }));
      }
    }

    steps.push(step(a, 7, `Varredura ${i + 1} concluída`, i < n - 1
      ? `O menor valor do sub-vetor é ${fmt(a[min])}, na posição ${min}.`
      : 'Não há posições depois de i, então o laço interno nem executa: o único elemento já é o menor.', 'success', { sortedCount: i, pointers: { i, min }, phase: scan, stats: stats(), variables: { i, minimo: min }, output: clone(log) }));

    const pair = i === min ? [i] : [i, min];
    const temp = a[i];
    steps.push(step(a, 8, 'Guardando vetor[i] em temp', `temp recebe ${fmt(temp)}, o valor que está na primeira posição do sub-vetor.`, 'update', { sortedCount: i, pointers: { i, min }, comparedIndices: pair, phase: swap, stats: stats(), variables: { i, minimo: min, temp }, output: clone(log) }));
    a[i] = a[min];
    steps.push(step(a, 9, 'Copiando o menor para vetor[i]', i === min
      ? `vetor[${i}] recebe ${fmt(a[i])}: o mesmo valor que já estava lá.`
      : `vetor[${i}] recebe ${fmt(a[i])}. Por um instante, ${fmt(a[i])} aparece duas vezes; o valor original está salvo em temp.`, 'update', { sortedCount: i, pointers: { i, min }, comparedIndices: pair, changedIndices: [i], phase: swap, stats: stats(), variables: { i, minimo: min, temp }, output: clone(log) }));
    a[min] = temp;
    swaps += 1;
    log.push(`Varredura ${pad(i + 1)}: menor = ${fmt(a[i])} → posição ${i}`);
    steps.push(step(a, 10, 'Completando a troca', i === min
      ? `vetor[${min}] recebe ${fmt(temp)}. O menor já estava na posição certa, então a troca não altera o vetor.`
      : `vetor[${min}] recebe ${fmt(temp)}. A posição ${i} agora guarda ${fmt(a[i])}, seu valor definitivo.`, 'success', { sortedCount: i + 1, pointers: { i, min }, comparedIndices: pair, changedIndices: pair, phase: swap, stats: stats(), variables: { i, minimo: min, temp }, output: clone(log) }));
  }

  steps.push(step(a, END_LINE, 'Ordenação concluída', `Todas as posições estão em ordem crescente, após ${comparisons} comparações e ${swaps} trocas.`, 'done', {
    sortedCount: n,
    stats: stats(),
    output: [...log, `Vetor ordenado: [${a.map(fmt).join(', ')}]`, `Comparações: ${comparisons} · Trocas: ${swaps}`],
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 03 · Contando as operações
// ---------------------------------------------------------------------------

function countingSteps(values) {
  const n = values.length;
  const passes = runPasses(toItems(values));
  const expected = (n * (n - 1)) / 2;
  const series = passes.map((pass) => pass.comparisons);
  const bars = passes.map(() => ({ value: null, swapped: false, current: false }));
  let comparisons = 0;
  let swaps = 0;
  const chart = (final = false) => ({ bars: bars.map((bar) => ({ ...bar })), comparisons, swaps, expected, n, final });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, 0, 'Contando as operações', `Com n = ${n}, vamos contar quantas comparações e quantas trocas o algoritmo faz em cada passada.`, 'neutral', common({})),
  ];

  passes.forEach((pass, index) => {
    const { i, min } = pass;
    const phaseTitle = `Varredura ${pad(i + 1)}`;
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += pass.comparisons;
    bars[index].value = pass.comparisons;
    steps.push(step(valuesOf(pass.before), SCAN_LINES, `Passada ${i + 1}: varredura`, pass.comparisons
      ? `O laço interno compara vetor[j] com vetor[minimo] para j de ${i + 1} a ${n - 1}: ${n - 1 - i} comparações. O menor está na posição ${min}.`
      : 'Não há posições depois de i: nenhuma comparação nesta passada.', 'comparison', common({ sortedCount: i, pointers: { i, min }, phase: { label: phaseTitle, text: 'Busca o menor' }, variables: { i, minimo: min, 'comparações da passada': pass.comparisons, 'comparações acumuladas': comparisons } })));

    swaps += 1;
    bars[index].swapped = true;
    steps.push(step(valuesOf(pass.after), SWAP_LINES, `Passada ${i + 1}: troca`, 'A troca são três atribuições (temp, vetor[i], vetor[minimo]). Esse custo é constante, não depende do tamanho do vetor.', 'update', common({ sortedCount: i + 1, comparedIndices: i === min ? [i] : [i, min], changedIndices: i === min ? [i] : [i, min], pointers: { i, min }, phase: { label: phaseTitle, text: 'Troca o menor com a primeira posição' }, variables: { i, minimo: min, trocas: swaps, 'comparações acumuladas': comparisons } })));
  });

  bars.forEach((bar) => { bar.current = false; });
  const doubled = n * 2;
  steps.push(step(valuesOf(passes.at(-1).after), END_LINE, 'Somando as passadas', `${series.join(' + ')} = ${comparisons} = n(n−1)/2, com n = ${n}. As trocas somam ${swaps} (uma por passada). Como n(n−1)/2 cresce com n², o custo é O(n²).`, 'done', common({
    final: true,
    sortedCount: n,
    variables: { n, 'comparações': comparisons, 'n(n−1)/2': expected, trocas: swaps },
    output: [`Comparações: ${comparisons}`, `Trocas: ${swaps}`, `n(n−1)/2 = ${n}·${n - 1}/2 = ${expected}`, `Com n = ${doubled}: ${(doubled * (doubled - 1)) / 2} comparações (≈ ${((doubled * (doubled - 1)) / 2 / Math.max(1, expected)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}×)`],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Adaptabilidade
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const ascending = [...values].sort((x, y) => x - y);
  const scenarios = [
    { label: 'Já ordenado', values: ascending },
    { label: 'Ordem inversa', values: [...ascending].reverse() },
    { label: 'Seu vetor', values: clone(values) },
  ].map((scenario) => ({ ...scenario, passes: runPasses(toItems(scenario.values)), comparisons: 0, swaps: 0 }));
  const expected = (n * (n - 1)) / 2;

  const rows = (pick) => scenarios.map((scenario) => ({ label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario) }));
  const steps = [
    step(values, 0, 'Três vetores, os mesmos valores', 'O primeiro já está ordenado, o segundo está em ordem inversa e o terceiro é o seu vetor. O algoritmo vai tratar os três do mesmo jeito?', 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedCount: 0 })),
    }),
  ];

  for (let index = 0; index < n; index += 1) {
    const phase = `Varredura ${pad(index + 1)}`;
    scenarios.forEach((scenario) => { scenario.comparisons += scenario.passes[index].comparisons; });
    const counts = scenarios.map((scenario) => scenario.comparisons);
    steps.push(step(values, SCAN_LINES, `${phase}: varredura`, `Cada vetor faz ${n - 1 - index} comparações para achar o menor do sub-vetor, mesmo o que já está ordenado. Total acumulado: ${counts.join(' · ')}.`, 'comparison', {
      rows: rows((scenario) => ({ values: valuesOf(scenario.passes[index].before), sortedCount: index, minIndex: scenario.passes[index].min })),
      variables: { i: index, 'comparações': counts.join(' · ') },
    }));

    scenarios.forEach((scenario) => { scenario.swaps += 1; });
    steps.push(step(values, SWAP_LINES, `${phase}: troca`, 'Todos executam a troca, mesmo quando o menor já está na posição certa. Os contadores continuam iguais nos três vetores.', 'update', {
      rows: rows((scenario) => {
        const { i, min } = scenario.passes[index];
        return { values: valuesOf(scenario.passes[index].after), sortedCount: index + 1, changedIndices: i === min ? [i] : [i, min] };
      }),
      variables: { i: index, 'comparações': counts.join(' · '), trocas: scenarios.map((scenario) => scenario.swaps).join(' · ') },
    }));
  }

  steps.push(step(values, END_LINE, 'Mesmo custo para qualquer ordem', `Os três vetores terminaram com ${expected} comparações e ${n} trocas. A ordem inicial não mudou o custo: por isso o Selection Sort é usado quando o tempo de execução precisa ser previsível.`, 'done', {
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
      ? step(values, 0, 'Valores repetidos em destaque', 'Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética.', 'neutral', { tags: tagsOf(items) })
      : step(values, 0, 'Não há valores repetidos', 'Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com repetidos.', 'warning', { tags: tagsOf(items) }),
  ];

  passes.forEach((pass) => {
    const { i, min } = pass;
    const phase = `Varredura ${pad(i + 1)}`;
    const minItem = pass.before[min];
    const tied = pass.before.slice(min + 1).some((item) => item.v === minItem.v);
    steps.push(step(valuesOf(pass.before), SCAN_LINES, `${phase}: o menor é ${label(minItem)}`, `O menor valor do sub-vetor está na posição ${min}.${tied ? ` Há outro ${fmt(minItem.v)} mais adiante; o teste estrito (<) fica com o primeiro que encontrou.` : ''}`, 'comparison', {
      tags: tagsOf(pass.before), sortedCount: i, pointers: { i, min }, phase: { label: phase, text: 'Busca o menor' }, variables: { i, minimo: min }, output: clone(log),
    }));

    const pair = i === min ? [i] : [i, min];
    const broke = pass.jumped.length > 0;
    let title = 'Troca';
    let description = i === min ? 'O menor já está na posição certa; a troca não altera o vetor.' : `${label(pass.moved)} vai para a posição ${min} e ${label(pass.before[min])} vai para a posição ${i}.`;
    if (broke) {
      const over = pass.jumped.map((k) => label(pass.before[k])).join(', ');
      title = 'Troca que inverte a ordem dos iguais';
      description = `${label(pass.moved)} saltou da posição ${i} para a ${min}, passando por cima de ${over}. Antes ele vinha primeiro; agora vem depois: a ordem relativa dos iguais foi invertida.`;
      log.push(`Varredura ${pad(i + 1)}: ${label(pass.moved)} passou depois de ${over}`);
    }
    steps.push(step(valuesOf(pass.after), SWAP_LINES, `${phase}: ${title.toLowerCase()}`, description, broke ? 'warning' : 'update', {
      tags: tagsOf(pass.after), sortedCount: i + 1, pointers: { i, min }, changedIndices: pair, warnIndices: broke ? [min, ...pass.jumped] : [], phase: { label: phase, text: 'Troca o menor com a primeira posição' }, variables: { i, minimo: min }, output: clone(log),
    }));
  });

  const final = passes.at(-1).after;
  const order = final.map(label).join(' ');
  let verdict;
  if (!hasRepeated) verdict = 'O vetor não tinha valores repetidos, então não há o que comparar.';
  else if (isStable(final)) verdict = 'Neste vetor a ordem dos iguais sobreviveu, mas foi sorte: o Selection Sort não garante isso. Gere outro exemplo para ver a inversão.';
  else verdict = 'A ordem relativa dos iguais mudou (as letras ficaram fora de ordem alfabética). O Selection Sort não é estável.';
  steps.push(step(valuesOf(final), END_LINE, hasRepeated && !isStable(final) ? 'Resultado: não estável' : 'Resultado', verdict, hasRepeated && !isStable(final) ? 'warning' : 'done', {
    tags: tagsOf(final),
    sortedCount: n,
    output: [...log, `Ordem final: ${order}`, !hasRepeated ? 'Sem valores repetidos.' : isStable(final) ? 'Ordem preservada neste exemplo.' : 'Ordem dos iguais invertida.'],
  }));
  return steps;
}

export function buildSteps(id, values, config) {
  switch (id) {
    case 'find-min': return findMinSteps(values, config);
    case 'selection-sort': return sortSteps(values);
    case 'counting': return countingSteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    case 'stability': return stabilitySteps(values);
    default: return findMinSteps(values, config);
  }
}
