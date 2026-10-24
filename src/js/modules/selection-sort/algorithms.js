import {
  NONE, ascending, clone, fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf,
} from '../shared/sort-steps.js';
import { locale, tr } from '../../core/i18n.js';

const SORT_CODE = [
  tr('FUNÇÃO selectionSort(vetor)', 'FUNCTION selectionSort(array)'),
  tr('  PARA i de 0 até vetor.length - 1 FAÇA', '  FOR i from 0 to array.length - 1 DO'),
  tr('    minimo ← i', '    min ← i'),
  tr('    PARA j de i + 1 até vetor.length - 1 FAÇA', '    FOR j from i + 1 to array.length - 1 DO'),
  tr('      SE vetor[j] < vetor[minimo] ENTÃO', '      IF array[j] < array[min] THEN'),
  tr('        minimo ← j', '        min ← j'),
  tr('      FIM SE', '      END IF'),
  tr('    FIM PARA', '    END FOR'),
  tr('    temp ← vetor[i]', '    temp ← array[i]'),
  tr('    vetor[i] ← vetor[minimo]', '    array[i] ← array[min]'),
  tr('    vetor[minimo] ← temp', '    array[min] ← temp'),
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
];

// Linhas do SORT_CODE (base 0). Cada passo da simulação destaca uma única linha.
const LINE = { loopI: 1, minInit: 2, loopJ: 3, test: 4, minUpdate: 5, temp: 8, copy: 9, put: 10, end: 12 };

export const algorithms = [
  {
    id: 'find-min', title: tr('Encontrar o menor (varredura)', 'Find the smallest (sweep)'), menuLabel: tr('Encontrar o menor', 'Find the smallest'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Percorra o sub-vetor guardando a posição do menor valor visto até agora. É a varredura que o Selection Sort repete a cada passada.', 'Walk through the sub-array keeping the position of the smallest value seen so far. It is the sweep that Selection Sort repeats on each pass.'),
    interaction: tr('Mude a posição inicial ou clique em uma célula do vetor para começar a varredura nela.', 'Change the starting position or click an array cell to start the sweep there.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Cada posição do sub-vetor é comparada uma única vez com o menor candidato.', 'Each position of the sub-array is compared only once with the smallest candidate.') },
    pseudocode: [
      tr('FUNÇÃO encontrarMenor(vetor, inicio)', 'FUNCTION findSmallest(array, start)'),
      tr('  minimo ← inicio', '  min ← start'),
      tr('  PARA j de inicio + 1 até vetor.length - 1 FAÇA', '  FOR j from start + 1 to array.length - 1 DO'),
      tr('    SE vetor[j] < vetor[minimo] ENTÃO', '    IF array[j] < array[min] THEN'),
      tr('      minimo ← j', '      min ← j'),
      tr('    FIM SE', '    END IF'),
      tr('  FIM PARA', '  END FOR'),
      tr('  RETORNE minimo', '  RETURN min'),
      tr('FIM', 'END'),
    ],
  },
  {
    id: 'selection-sort', title: tr('Selection Sort', 'Selection Sort'), menuLabel: tr('Selection Sort', 'Selection Sort'), group: tr('Como funciona', 'How it works'), number: '02',
    description: tr('A cada passada, encontre o menor valor do sub-vetor não ordenado e troque-o com a primeira posição desse sub-vetor.', 'On each pass, find the smallest value of the unsorted sub-array and swap it with the first position of that sub-array.'),
    interaction: tr('Pause nas comparações e acompanhe os marcadores i, j e min. Tudo à esquerda de i já está ordenado.', 'Pause at the comparisons and follow the markers i, j and min. Everything to the left of i is already sorted.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('S(n) = 4: além do vetor, que é ordenado no próprio lugar, só existem i, j, minimo e temp.', 'S(n) = 4: besides the array, which is sorted in place, there are only i, j, min and temp.') },
    pseudocode: SORT_CODE,
  },
  {
    id: 'counting', title: tr('Contando as operações', 'Counting the operations'), menuLabel: tr('Complexidade de tempo', 'Time complexity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '03',
    description: tr('Conte as comparações e as trocas de cada passada e veja por que o custo total cresce com n².', 'Count the comparisons and the swaps of each pass and see why the total cost grows with n².'),
    interaction: tr('Gere vetores de tamanhos diferentes e compare o total de comparações com n(n−1)/2.', 'Generate arrays of different sizes and compare the total number of comparisons with n(n−1)/2.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('As varreduras fazem (n−1) + (n−2) + … + 1 + 0 = n(n−1)/2 comparações; as trocas são apenas n.', 'The sweeps make (n−1) + (n−2) + … + 1 + 0 = n(n−1)/2 comparisons; the swaps are only n.') },
    pseudocode: SORT_CODE,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '04',
    description: tr('Execute o algoritmo em três vetores com os mesmos valores em ordens diferentes e compare os contadores.', 'Run the algorithm on three arrays with the same values in different orders and compare the counters.'),
    interaction: tr('Avance passo a passo e observe que os contadores dos três vetores são idênticos em todas as passadas.', 'Step through and notice that the counters of the three arrays are identical in all the passes.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('Melhor, médio e pior caso fazem as mesmas n(n−1)/2 comparações: o Selection Sort não se adapta à ordem inicial.', 'Best, average and worst case make the same n(n−1)/2 comparisons: Selection Sort does not adapt to the initial order.') },
    pseudocode: SORT_CODE,
  },
  {
    id: 'stability', title: tr('Estabilidade', 'Stability'), menuLabel: tr('Estabilidade', 'Stability'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '05',
    description: tr('Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.', 'Repeated values get a letter that marks the original order. See whether the algorithm preserves that order.'),
    interaction: tr('Use "Gerar exemplo" para criar um vetor com valores repetidos e acompanhe a troca que inverte a ordem deles.', 'Use "Generate example" to create an array with repeated values and follow the swap that reverses their order.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('A troca entre posições distantes pode passar um elemento por cima de outro igual a ele; por isso o Selection Sort não é estável.', 'A swap between distant positions can move an element past another one equal to it; that is why Selection Sort is not stable.') },
    pseudocode: SORT_CODE,
  },
];

const compareOf = (values, j, min, result) => ({
  left: { label: tr('vetor[j]', 'array[j]'), value: fmt(values[j]) },
  op: '<',
  right: { label: tr('vetor[minimo]', 'array[min]'), value: fmt(values[min]) },
  result,
});

// ---------------------------------------------------------------------------
// Execução por passadas: base das simulações de análise (contagem,
// adaptabilidade e estabilidade). Cada item é { v: valor, tag: letra }.
// ---------------------------------------------------------------------------

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
// Execução como num depurador: cada passo é a linha que acabou de executar e as
// variáveis valem o que valeriam naquele ponto. Linhas: 1 minimo ← inicio ·
// 2 PARA j · 3 SE · 4 minimo ← j · 7 RETORNE
// ---------------------------------------------------------------------------

function findMinSteps(values, config) {
  const n = values.length;
  const start = Math.max(0, Math.min(n - 1, Number(config.inicio) || 0));
  const outsideIndices = range(start);
  const phase = { label: tr('Varredura', 'Sweep'), text: tr('Busca o menor', 'Finds the smallest') };
  const scope = { inicio: start, j: NONE, minimo: NONE };
  const base = (extra) => ({ outsideIndices, phase, variables: { ...scope }, ...extra });

  let min = start;
  const steps = [
    step(values, 0, tr('Iniciando a varredura', 'Starting the sweep'), tr(`Procuraremos o menor valor do sub-vetor que vai da posição ${start} até a ${n - 1}. Os parâmetros já têm valor (inicio = ${start}); as demais variáveis ainda não foram atribuídas.`, `We will look for the smallest value of the sub-array that goes from position ${start} to ${n - 1}. The parameters already have a value (start = ${start}); the other variables have not been assigned yet.`), 'neutral', base({})),
  ];

  scope.minimo = min;
  steps.push(step(values, 1, tr('minimo ← inicio', 'min ← start'), tr(`minimo recebe ${start}: por enquanto, ${fmt(values[start])} é o menor valor conhecido.`, `min receives ${start}: for now, ${fmt(values[start])} is the smallest known value.`), 'update', base({ pointers: { min } })));

  for (let j = start + 1; j < n; j += 1) {
    scope.j = j;
    steps.push(step(values, 2, tr(`PARA j (j = ${j})`, `FOR j (j = ${j})`), tr(`j recebe ${j} e a condição j ≤ ${n - 1} é verdadeira: o laço entra.`, `j receives ${j} and the condition j ≤ ${n - 1} is true: the loop is entered.`), 'reading', base({ pointers: { j, min } })));
    const less = values[j] < values[min];
    const verdict = less
      ? tr('Encontramos um valor menor.', 'We found a smaller value.')
      : values[j] === values[min] ? tr('Os valores são iguais; o teste estrito (<) mantém o candidato atual.', 'The values are equal; the strict test (<) keeps the current candidate.') : tr(`O candidato continua sendo ${fmt(values[min])}.`, `The candidate is still ${fmt(values[min])}.`);
    steps.push(step(values, 3, tr('SE vetor[j] < vetor[minimo]', 'IF array[j] < array[min]'), tr(`${fmt(values[j])} < ${fmt(values[min])} é ${less ? 'verdadeiro' : 'falso'}. ${verdict}`, `${fmt(values[j])} < ${fmt(values[min])} is ${less ? 'true' : 'false'}. ${verdict}`), 'comparison', base({ pointers: { j, min }, compare: compareOf(values, j, min, less) })));
    if (less) {
      min = j;
      scope.minimo = min;
      steps.push(step(values, 4, tr('minimo ← j', 'min ← j'), tr(`minimo recebe ${j}: agora o menor candidato é ${fmt(values[min])}.`, `min receives ${j}: now the smallest candidate is ${fmt(values[min])}.`), 'update', base({ pointers: { j, min }, changedIndices: [j] })));
    }
  }

  scope.j = n;
  steps.push(step(values, 2, tr(`PARA j (j = ${n}): fim`, `FOR j (j = ${n}): end`), start === n - 1
    ? tr(`j recebe ${n} e a condição j ≤ ${n - 1} é falsa: o laço nem chega a entrar, e o único elemento já é o menor.`, `j receives ${n} and the condition j ≤ ${n - 1} is false: the loop is not even entered, and the only element is already the smallest.`)
    : tr(`j recebe ${n} e a condição j ≤ ${n - 1} é falsa: o laço termina. Todas as posições do sub-vetor foram examinadas e o menor valor é ${fmt(values[min])}.`, `j receives ${n} and the condition j ≤ ${n - 1} is false: the loop ends. All the positions of the sub-array were examined and the smallest value is ${fmt(values[min])}.`), 'success', base({ pointers: { min } })));
  steps.push(step(values, 7, tr('RETORNE minimo', 'RETURN min'), tr(`A função retorna ${min}: o menor valor do sub-vetor, ${fmt(values[min])}, está na posição ${min}.`, `The function returns ${min}: the smallest value of the sub-array, ${fmt(values[min])}, is at position ${min}.`), 'done', base({
    pointers: { min },
    output: [tr(`Menor valor: ${fmt(values[min])}`, `Smallest value: ${fmt(values[min])}`), tr(`Posição: ${min}`, `Position: ${min}`)],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 02 · Selection Sort completo, passo a passo como num depurador
// ---------------------------------------------------------------------------

function sortSteps(values) {
  const a = clone(values);
  const n = a.length;
  const log = [];
  let comparisons = 0;
  let swaps = 0;
  const stats = () => ({ 'comparações': comparisons, trocas: swaps });
  const scope = { i: NONE, j: NONE, minimo: NONE, temp: NONE };
  const steps = [
    step(a, 0, tr('Iniciando o Selection Sort', 'Starting Selection Sort'), tr(`O vetor tem ${n} posições. As variáveis i, j, minimo e temp ainda não foram atribuídas. A cada passada, o menor valor do sub-vetor não ordenado vai para a primeira posição dele.`, `The array has ${n} positions. The variables i, j, min and temp have not been assigned yet. On each pass, the smallest value of the unsorted sub-array goes to its first position.`), 'neutral', { stats: stats(), variables: { ...scope } }),
  ];

  for (let i = 0; i < n; i += 1) {
    const scan = { label: tr(`i = ${i}`, `i = ${i}`), text: tr('Busca o menor', 'Finds the smallest'), code: true };
    const swap = { label: tr(`i = ${i}`, `i = ${i}`), text: tr('Troca o menor com a primeira posição do sub-vetor', 'Swaps the smallest with the first position of the sub-array'), code: true };
    let min = i;
    const at = (extra) => ({ sortedCount: i, stats: stats(), output: clone(log), variables: { ...scope }, ...extra });

    scope.i = i;
    steps.push(step(a, LINE.loopI, tr(`PARA i (i = ${i})`, `FOR i (i = ${i})`), tr(`i recebe ${i} e a condição i ≤ ${n - 1} é verdadeira: o laço entra. O sub-vetor não ordenado vai da posição ${i} até a ${n - 1}; tudo à esquerda de i já está em sua posição final.`, `i receives ${i} and the condition i ≤ ${n - 1} is true: the loop is entered. The unsorted sub-array goes from position ${i} to ${n - 1}; everything to the left of i is already in its final position.`), 'reading', at({ pointers: { i }, phase: scan })));
    scope.minimo = i;
    steps.push(step(a, LINE.minInit, tr('minimo ← i', 'min ← i'), tr(`minimo recebe ${i}: por enquanto, ${fmt(a[i])} é o menor candidato.`, `min receives ${i}: for now, ${fmt(a[i])} is the smallest candidate.`), 'update', at({ pointers: { i, min }, phase: scan })));

    for (let j = i + 1; j < n; j += 1) {
      scope.j = j;
      steps.push(step(a, LINE.loopJ, tr(`PARA j (j = ${j})`, `FOR j (j = ${j})`), tr(`j recebe ${j} e a condição j ≤ ${n - 1} é verdadeira: o laço entra.`, `j receives ${j} and the condition j ≤ ${n - 1} is true: the loop is entered.`), 'reading', at({ pointers: { i, j, min }, phase: scan })));
      comparisons += 1;
      const less = a[j] < a[min];
      const verdict = less ? tr('Há um novo menor.', 'There is a new smallest.') : a[j] === a[min] ? tr('Valores iguais: o candidato não muda.', 'Equal values: the candidate does not change.') : tr(`O candidato continua sendo ${fmt(a[min])}.`, `The candidate is still ${fmt(a[min])}.`);
      steps.push(step(a, LINE.test, tr('SE vetor[j] < vetor[minimo]', 'IF array[j] < array[min]'), tr(`${fmt(a[j])} < ${fmt(a[min])} é ${less ? 'verdadeiro' : 'falso'}. ${verdict}`, `${fmt(a[j])} < ${fmt(a[min])} is ${less ? 'true' : 'false'}. ${verdict}`), 'comparison', at({ pointers: { i, j, min }, compare: compareOf(a, j, min, less), phase: scan })));
      if (less) {
        min = j;
        scope.minimo = min;
        steps.push(step(a, LINE.minUpdate, tr('minimo ← j', 'min ← j'), tr(`minimo recebe ${j}: o novo candidato é ${fmt(a[min])}.`, `min receives ${j}: the new candidate is ${fmt(a[min])}.`), 'update', at({ pointers: { i, j, min }, changedIndices: [j], phase: scan })));
      }
    }

    scope.j = n;
    steps.push(step(a, LINE.loopJ, tr(`PARA j (j = ${n}): fim`, `FOR j (j = ${n}): end`), i === n - 1
      ? tr(`j recebe ${n} e a condição j ≤ ${n - 1} é falsa: o laço nem chega a entrar, porque não há posições depois de i. O único elemento já é o menor.`, `j receives ${n} and the condition j ≤ ${n - 1} is false: the loop is not even entered, because there are no positions after i. The only element is already the smallest.`)
      : tr(`j recebe ${n} e a condição j ≤ ${n - 1} é falsa: o laço termina. O menor valor do sub-vetor é ${fmt(a[min])}, na posição ${min}.`, `j receives ${n} and the condition j ≤ ${n - 1} is false: the loop ends. The smallest value of the sub-array is ${fmt(a[min])}, at position ${min}.`), 'success', at({ pointers: { i, min }, phase: scan })));

    const pair = i === min ? [i] : [i, min];
    const temp = a[i];
    scope.temp = temp;
    steps.push(step(a, LINE.temp, tr('temp ← vetor[i]', 'temp ← array[i]'), tr(`temp recebe ${fmt(temp)}, o valor que está na primeira posição do sub-vetor.`, `temp receives ${fmt(temp)}, the value at the first position of the sub-array.`), 'update', at({ pointers: { i, min }, comparedIndices: pair, phase: swap })));
    a[i] = a[min];
    steps.push(step(a, LINE.copy, tr('vetor[i] ← vetor[minimo]', 'array[i] ← array[min]'), i === min
      ? tr(`vetor[${i}] recebe ${fmt(a[i])}: o mesmo valor que já estava lá.`, `array[${i}] receives ${fmt(a[i])}: the same value that was already there.`)
      : tr(`vetor[${i}] recebe ${fmt(a[i])}. Por um instante, ${fmt(a[i])} aparece duas vezes; o valor original está salvo em temp.`, `array[${i}] receives ${fmt(a[i])}. For a moment, ${fmt(a[i])} appears twice; the original value is saved in temp.`), 'update', at({ pointers: { i, min }, comparedIndices: pair, changedIndices: [i], phase: swap })));
    a[min] = temp;
    swaps += 1;
    log.push(tr(`i = ${i}: menor = ${fmt(a[i])} → posição ${i}`, `i = ${i}: smallest = ${fmt(a[i])} → position ${i}`));
    steps.push(step(a, LINE.put, tr('vetor[minimo] ← temp', 'array[min] ← temp'), i === min
      ? tr(`vetor[${min}] recebe ${fmt(temp)}. O menor já estava na posição certa, então a troca não altera o vetor.`, `array[${min}] receives ${fmt(temp)}. The smallest was already in the right position, so the swap does not change the array.`)
      : tr(`vetor[${min}] recebe ${fmt(temp)}. A posição ${i} agora guarda ${fmt(a[i])}, seu valor definitivo.`, `array[${min}] receives ${fmt(temp)}. Position ${i} now holds ${fmt(a[i])}, its final value.`), 'success', at({ sortedCount: i + 1, pointers: { i, min }, comparedIndices: pair, changedIndices: pair, phase: swap })));
  }

  scope.i = n;
  steps.push(step(a, LINE.loopI, tr(`PARA i (i = ${n}): fim`, `FOR i (i = ${n}): end`), tr(`i recebe ${n} e a condição i ≤ ${n - 1} é falsa: o laço termina. Todas as posições já estão em sua posição final.`, `i receives ${n} and the condition i ≤ ${n - 1} is false: the loop ends. All the positions are already in their final position.`), 'success', {
    sortedCount: n, stats: stats(), output: clone(log), variables: { ...scope },
  }));
  steps.push(step(a, LINE.end, tr('Ordenação concluída', 'Sort finished'), tr(`Todas as posições estão em ordem crescente, após ${comparisons} comparações e ${swaps} trocas.`, `All the positions are in ascending order, after ${comparisons} comparisons and ${swaps} swaps.`), 'done', {
    sortedCount: n,
    stats: stats(),
    variables: { ...scope },
    output: [...log, tr(`Vetor ordenado: [${a.map(fmt).join(', ')}]`, `Sorted array: [${a.map(fmt).join(', ')}]`), tr(`Comparações: ${comparisons} · Trocas: ${swaps}`, `Comparisons: ${comparisons} · Swaps: ${swaps}`)],
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// Passadas resumidas (03, 04 e 05): a varredura vira um único passo, destacando
// a linha da comparação (ou a do laço, quando ele não executa), e a troca vira
// três passos, um por atribuição.
// ---------------------------------------------------------------------------

const scanLine = (pass) => (pass.comparisons ? LINE.test : LINE.loopJ);

/** Estado do vetor entre `vetor[i] ← vetor[minimo]` e `vetor[minimo] ← temp`. */
function midSwap(items, i, min) {
  const mid = items.map((item) => ({ ...item }));
  mid[i] = { ...items[min] };
  return mid;
}

// ---------------------------------------------------------------------------
// 03 · Contando as operações
// ---------------------------------------------------------------------------

function countingSteps(values) {
  const n = values.length;
  const passes = runPasses(toItems(values));
  const expected = (n * (n - 1)) / 2;
  const series = passes.map((pass) => pass.comparisons);
  const bars = passes.map((_, index) => ({ label: tr(`i = ${index}`, `i = ${index}`), value: null, mark: '', current: false }));
  let comparisons = 0;
  let swaps = 0;
  const chart = (final = false) => ({
    title: tr('Comparações em cada passada (valor de i)', 'Comparisons in each pass (value of i)'),
    hint: tr('⇄ = uma troca', '⇄ = one swap'),
    max: n - 1,
    bars: bars.map((bar) => ({ ...bar })),
    totals: [
      { label: tr('Comparações', 'Comparisons'), value: comparisons, note: final ? tr(`n(n−1)/2 = ${n}·${n - 1}/2 = ${expected}`, `n(n−1)/2 = ${n}·${n - 1}/2 = ${expected}`) : tr(`esperado ao final: ${expected}`, `expected at the end: ${expected}`) },
      { label: tr('Trocas', 'Swaps'), value: swaps, note: final ? tr(`n = ${n}`, `n = ${n}`) : tr(`esperado ao final: ${n}`, `expected at the end: ${n}`) },
    ],
    final,
  });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, 0, tr('Contando as operações', 'Counting the operations'), tr(`Com n = ${n}, vamos contar quantas comparações e quantas trocas o algoritmo faz em cada passada.`, `With n = ${n}, we will count how many comparisons and how many swaps the algorithm makes in each pass.`), 'neutral', common({})),
  ];

  passes.forEach((pass, index) => {
    const { i, min } = pass;
    const phaseName = tr(`i = ${i}`, `i = ${i}`);
    const pair = i === min ? [i] : [i, min];
    const swapPhase = { label: phaseName, text: tr('Troca o menor com a primeira posição', 'Swaps the smallest with the first position'), code: true };
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += pass.comparisons;
    bars[index].value = pass.comparisons;

    steps.push(step(valuesOf(pass.before), scanLine(pass), tr(`i = ${i}: varredura`, `i = ${i}: sweep`), pass.comparisons
      ? tr(`A linha SE vetor[j] < vetor[minimo] executa ${n - 1 - i} vezes, uma para cada j de ${i + 1} a ${n - 1}. O menor está na posição ${min}.`, `The line IF array[j] < array[min] runs ${n - 1 - i} times, once for each j from ${i + 1} to ${n - 1}. The smallest is at position ${min}.`)
      : tr('Não há posições depois de i: o laço PARA j não executa e nenhuma comparação é feita nesta passada.', 'There are no positions after i: the FOR j loop does not run and no comparison is made in this pass.'), 'comparison', common({
      sortedCount: i, pointers: { i, min }, phase: { label: phaseName, text: tr('Busca o menor', 'Finds the smallest'), code: true }, variables: { i, minimo: min, 'comparações da passada': pass.comparisons, 'comparações acumuladas': comparisons },
    })));
    steps.push(step(valuesOf(pass.before), LINE.temp, tr(`i = ${i}: guardando em temp`, `i = ${i}: saving into temp`), tr('A troca são três atribuições (temp, vetor[i], vetor[minimo]). Esse custo é constante, não depende do tamanho do vetor.', 'The swap is three assignments (temp, array[i], array[min]). This cost is constant, it does not depend on the size of the array.'), 'update', common({
      sortedCount: i, comparedIndices: pair, pointers: { i, min }, phase: swapPhase, variables: { i, minimo: min, temp: pass.before[i].v },
    })));
    steps.push(step(valuesOf(midSwap(pass.before, i, min)), LINE.copy, tr(`i = ${i}: copiando o menor`, `i = ${i}: copying the smallest`), tr(`vetor[${i}] recebe ${fmt(pass.before[min].v)}.`, `array[${i}] receives ${fmt(pass.before[min].v)}.`), 'update', common({
      sortedCount: i, comparedIndices: pair, changedIndices: [i], pointers: { i, min }, phase: swapPhase, variables: { i, minimo: min, temp: pass.before[i].v },
    })));
    swaps += 1;
    bars[index].mark = '⇄';
    steps.push(step(valuesOf(pass.after), LINE.put, tr(`i = ${i}: completando a troca`, `i = ${i}: completing the swap`), tr(`vetor[${min}] recebe ${fmt(pass.before[i].v)}. Mais uma troca contada.`, `array[${min}] receives ${fmt(pass.before[i].v)}. One more swap counted.`), 'success', common({
      sortedCount: i + 1, comparedIndices: pair, changedIndices: pair, pointers: { i, min }, phase: swapPhase, variables: { i, minimo: min, trocas: swaps, 'comparações acumuladas': comparisons },
    })));
  });

  bars.forEach((bar) => { bar.current = false; });
  const doubled = n * 2;
  steps.push(step(valuesOf(passes.at(-1).after), LINE.end, tr('Somando as passadas', 'Adding up the passes'), tr(`${series.join(' + ')} = ${comparisons} = n(n−1)/2, com n = ${n}. As trocas somam ${swaps} (uma por passada). Como n(n−1)/2 cresce com n², o custo é O(n²).`, `${series.join(' + ')} = ${comparisons} = n(n−1)/2, with n = ${n}. The swaps add up to ${swaps} (one per pass). Since n(n−1)/2 grows with n², the cost is O(n²).`), 'done', common({
    final: true,
    sortedCount: n,
    variables: { n, 'comparações': comparisons, 'n(n−1)/2': expected, trocas: swaps },
    output: [tr(`Comparações: ${comparisons}`, `Comparisons: ${comparisons}`), tr(`Trocas: ${swaps}`, `Swaps: ${swaps}`), tr(`n(n−1)/2 = ${n}·${n - 1}/2 = ${expected}`, `n(n−1)/2 = ${n}·${n - 1}/2 = ${expected}`), tr(`Com n = ${doubled}: ${(doubled * (doubled - 1)) / 2} comparações (≈ ${((doubled * (doubled - 1)) / 2 / Math.max(1, expected)).toLocaleString(locale, { maximumFractionDigits: 1 })}×)`, `With n = ${doubled}: ${(doubled * (doubled - 1)) / 2} comparisons (≈ ${((doubled * (doubled - 1)) / 2 / Math.max(1, expected)).toLocaleString(locale, { maximumFractionDigits: 1 })}×)`)],
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
    { label: tr('Já ordenado', 'Already sorted'), values: inOrder },
    { label: tr('Ordem inversa', 'Reverse order'), values: [...inOrder].reverse() },
    { label: tr('Seu vetor', 'Your array'), values: clone(values) },
  ].map((scenario) => ({ ...scenario, passes: runPasses(toItems(scenario.values)), comparisons: 0, swaps: 0 }));
  const expected = (n * (n - 1)) / 2;

  const rows = (pick) => scenarios.map((scenario) => ({ label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario) }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, tr('Três vetores, os mesmos valores', 'Three arrays, the same values'), tr('O primeiro já está ordenado, o segundo está em ordem inversa e o terceiro é o seu vetor. O algoritmo vai tratar os três do mesmo jeito?', 'The first is already sorted, the second is in reverse order and the third is your array. Will the algorithm treat the three the same way?'), 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedCount: 0 })),
    }),
  ];

  for (let index = 0; index < n; index += 1) {
    const phase = tr(`i = ${index}`, `i = ${index}`);
    const remaining = n - 1 - index;
    scenarios.forEach((scenario) => { scenario.comparisons += scenario.passes[index].comparisons; });
    steps.push(step(values, scanLine(scenarios[0].passes[index]), tr(`${phase}: varredura`, `${phase}: sweep`), remaining
      ? tr(`A linha SE vetor[j] < vetor[minimo] executa ${remaining} vezes em cada vetor, mesmo no que já está ordenado. Total acumulado: ${joined('comparisons')}.`, `The line IF array[j] < array[min] runs ${remaining} times on each array, even on the one that is already sorted. Accumulated total: ${joined('comparisons')}.`)
      : tr('Não há posições depois de i: o laço PARA j não executa em nenhum dos vetores.', 'There are no positions after i: the FOR j loop does not run in any of the arrays.'), 'comparison', {
      rows: rows((scenario) => ({ values: valuesOf(scenario.passes[index].before), sortedCount: index, markIndex: scenario.passes[index].min })),
      variables: { i: index, 'comparações': joined('comparisons') },
    }));
    steps.push(step(values, LINE.temp, tr(`${phase}: guardando em temp`, `${phase}: saving into temp`), tr('Cada vetor guarda vetor[i] em temp.', 'Each array saves array[i] into temp.'), 'update', {
      rows: rows((scenario) => ({ values: valuesOf(scenario.passes[index].before), sortedCount: index, markIndex: scenario.passes[index].min })),
      variables: { i: index },
    }));
    steps.push(step(values, LINE.copy, tr(`${phase}: copiando o menor`, `${phase}: copying the smallest`), tr('Cada vetor copia o menor valor do sub-vetor para vetor[i].', 'Each array copies the smallest value of the sub-array into array[i].'), 'update', {
      rows: rows((scenario) => {
        const { i, min } = scenario.passes[index];
        return { values: valuesOf(midSwap(scenario.passes[index].before, i, min)), sortedCount: index, changedIndices: [i] };
      }),
      variables: { i: index },
    }));
    scenarios.forEach((scenario) => { scenario.swaps += 1; });
    steps.push(step(values, LINE.put, tr(`${phase}: completando a troca`, `${phase}: completing the swap`), tr('Todos completam a troca, mesmo quando o menor já está na posição certa. Os contadores continuam iguais nos três vetores.', 'All of them complete the swap, even when the smallest is already in the right position. The counters stay equal in the three arrays.'), 'success', {
      rows: rows((scenario) => {
        const { i, min } = scenario.passes[index];
        return { values: valuesOf(scenario.passes[index].after), sortedCount: index + 1, changedIndices: i === min ? [i] : [i, min] };
      }),
      variables: { i: index, 'comparações': joined('comparisons'), trocas: joined('swaps') },
    }));
  }

  steps.push(step(values, LINE.end, tr('Mesmo custo para qualquer ordem', 'Same cost for any order'), tr(`Os três vetores terminaram com ${expected} comparações e ${n} trocas. A ordem inicial não mudou o custo: por isso o Selection Sort é usado quando o tempo de execução precisa ser previsível.`, `The three arrays ended with ${expected} comparisons and ${n} swaps. The initial order did not change the cost: that is why Selection Sort is used when the running time needs to be predictable.`), 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.passes.at(-1).after), sortedCount: n })),
    output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.comparisons} comparações, ${scenario.swaps} trocas`, `${scenario.label}: ${scenario.comparisons} comparisons, ${scenario.swaps} swaps`)),
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
      ? step(values, 0, tr('Valores repetidos em destaque', 'Repeated values highlighted'), tr('Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética.', 'Repeated values get a letter (a, b, …) that marks the order in which they appear. A stable algorithm ends with those letters in alphabetical order.'), 'neutral', { tags: tagsOf(items) })
      : step(values, 0, tr('Não há valores repetidos', 'There are no repeated values'), tr('Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com repetidos.', 'Without repeated values there is no relative order to preserve. Use "Generate example" to create an array with repeats.'), 'warning', { tags: tagsOf(items) }),
  ];

  passes.forEach((pass) => {
    const { i, min } = pass;
    const phase = tr(`i = ${i}`, `i = ${i}`);
    const swapPhase = { label: phase, text: tr('Troca o menor com a primeira posição', 'Swaps the smallest with the first position'), code: true };
    const minItem = pass.before[min];
    const tied = pass.before.slice(min + 1).some((item) => item.v === minItem.v);
    const pair = i === min ? [i] : [i, min];
    const at = (extra) => ({ pointers: { i, min }, variables: { i, minimo: min }, output: clone(log), ...extra });

    steps.push(step(valuesOf(pass.before), scanLine(pass), tr(`${phase}: o menor é ${label(minItem)}`, `${phase}: the smallest is ${label(minItem)}`), tr(`${pass.comparisons ? '' : 'O laço PARA j não executa: '}O menor valor do sub-vetor está na posição ${min}.${tied ? ` Há outro ${fmt(minItem.v)} mais adiante; o teste estrito (<) fica com o primeiro que encontrou.` : ''}`, `${pass.comparisons ? '' : 'The FOR j loop does not run: '}The smallest value of the sub-array is at position ${min}.${tied ? ` There is another ${fmt(minItem.v)} further on; the strict test (<) keeps the first one it found.` : ''}`), 'comparison', at({
      tags: tagsOf(pass.before), sortedCount: i, phase: { label: phase, text: tr('Busca o menor', 'Finds the smallest'), code: true },
    })));
    steps.push(step(valuesOf(pass.before), LINE.temp, tr(`${phase}: guardando em temp`, `${phase}: saving into temp`), tr(`temp recebe ${label(pass.moved)}, o elemento que está na posição ${i}.`, `temp receives ${label(pass.moved)}, the element at position ${i}.`), 'update', at({
      tags: tagsOf(pass.before), sortedCount: i, comparedIndices: pair, phase: swapPhase,
    })));
    const mid = midSwap(pass.before, i, min);
    steps.push(step(valuesOf(mid), LINE.copy, tr(`${phase}: copiando o menor`, `${phase}: copying the smallest`), i === min
      ? tr(`vetor[${i}] recebe ${label(minItem)}: o mesmo elemento que já estava lá.`, `array[${i}] receives ${label(minItem)}: the same element that was already there.`)
      : tr(`vetor[${i}] recebe ${label(minItem)}; o elemento original, ${label(pass.moved)}, continua salvo em temp.`, `array[${i}] receives ${label(minItem)}; the original element, ${label(pass.moved)}, stays saved in temp.`), 'update', at({
      tags: tagsOf(mid), sortedCount: i, comparedIndices: pair, changedIndices: [i], phase: swapPhase,
    })));

    const broke = pass.jumped.length > 0;
    let title = tr('completando a troca', 'completing the swap');
    let description = i === min ? tr('O menor já está na posição certa; a troca não altera o vetor.', 'The smallest is already in the right position; the swap does not change the array.') : tr(`vetor[${min}] recebe ${label(pass.moved)}. Os dois elementos trocaram de lugar.`, `array[${min}] receives ${label(pass.moved)}. The two elements swapped places.`);
    if (broke) {
      const over = pass.jumped.map((k) => label(pass.before[k])).join(', ');
      title = tr('troca que inverte a ordem dos iguais', 'swap that reverses the order of the equals');
      description = tr(`${label(pass.moved)} saltou da posição ${i} para a ${min}, passando por cima de ${over}. Antes ele vinha primeiro; agora vem depois: a ordem relativa dos iguais foi invertida.`, `${label(pass.moved)} jumped from position ${i} to ${min}, passing over ${over}. Before, it came first; now it comes after: the relative order of the equals was reversed.`);
      log.push(tr(`${phase}: ${label(pass.moved)} passou depois de ${over}`, `${phase}: ${label(pass.moved)} ended up after ${over}`));
    }
    steps.push(step(valuesOf(pass.after), LINE.put, `${phase}: ${title}`, description, broke ? 'warning' : 'success', at({
      tags: tagsOf(pass.after), sortedCount: i + 1, changedIndices: pair, warnIndices: broke ? [min, ...pass.jumped] : [], phase: swapPhase,
    })));
  });

  const final = passes.at(-1).after;
  const order = final.map(label).join(' ');
  let verdict;
  if (!hasRepeated) verdict = tr('O vetor não tinha valores repetidos, então não há o que comparar.', 'The array had no repeated values, so there is nothing to compare.');
  else if (isStable(final)) verdict = tr('Neste vetor a ordem dos iguais sobreviveu, mas foi sorte: o Selection Sort não garante isso. Gere outro exemplo para ver a inversão.', 'In this array the order of the equals survived, but it was luck: Selection Sort does not guarantee it. Generate another example to see the reversal.');
  else verdict = tr('A ordem relativa dos iguais mudou (as letras ficaram fora de ordem alfabética). O Selection Sort não é estável.', 'The relative order of the equals changed (the letters ended up out of alphabetical order). Selection Sort is not stable.');
  steps.push(step(valuesOf(final), LINE.end, hasRepeated && !isStable(final) ? tr('Resultado: não estável', 'Result: not stable') : tr('Resultado', 'Result'), verdict, hasRepeated && !isStable(final) ? 'warning' : 'done', {
    tags: tagsOf(final),
    sortedCount: n,
    output: [...log, tr(`Ordem final: ${order}`, `Final order: ${order}`), !hasRepeated ? tr('Sem valores repetidos.', 'No repeated values.') : isStable(final) ? tr('Ordem preservada neste exemplo.', 'Order preserved in this example.') : tr('Ordem dos iguais invertida.', 'Order of the equals reversed.')],
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
