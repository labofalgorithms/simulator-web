import {
  NONE, ascending, clone, fmt, isStable, label, step, tagDuplicates, tagsOf, toItems, valuesOf,
} from '../shared/sort-steps.js';
import { tr } from '../../core/i18n.js';

// Pseudocódigo da aula (slide 26): o laço de i avança no vetor e o de j leva o elemento para a
// esquerda, trocando-o com o vizinho enquanto o vizinho for maior.
const SORT_CODE = [
  tr('FUNÇÃO insertionSort(vetor)', 'FUNCTION insertionSort(array)'),
  tr('  n ← vetor.length', '  n ← array.length'),
  tr('  PARA i de 1 até n - 1 FAÇA', '  FOR i from 1 to n - 1 DO'),
  tr('    j ← i', '    j ← i'),
  tr('    ENQUANTO j > 0 E vetor[j - 1] > vetor[j] FAÇA', '    WHILE j > 0 AND array[j - 1] > array[j] DO'),
  tr('      inverter(vetor[j - 1], vetor[j])', '      swap(array[j - 1], array[j])'),
  tr('      j ← j - 1', '      j ← j - 1'),
  tr('    FIM ENQUANTO', '    END WHILE'),
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
];

// O laço interno sozinho: inserir o elemento da posição i no sub-vetor ordenado à esquerda dele.
const INSERT_CODE = [
  tr('FUNÇÃO inserir(vetor, i)', 'FUNCTION insert(array, i)'),
  tr('  j ← i', '  j ← i'),
  tr('  ENQUANTO j > 0 E vetor[j - 1] > vetor[j] FAÇA', '  WHILE j > 0 AND array[j - 1] > array[j] DO'),
  tr('    inverter(vetor[j - 1], vetor[j])', '    swap(array[j - 1], array[j])'),
  tr('    j ← j - 1', '    j ← j - 1'),
  tr('  FIM ENQUANTO', '  END WHILE'),
  tr('FIM', 'END'),
];

// Linhas de SORT_CODE e de INSERT_CODE (base 0).
const LINE = { n: 1, loopI: 2, init: 3, test: 4, swap: 5, dec: 6, end: 9 };
const ONE = { init: 1, test: 2, swap: 3, dec: 4, end: 6 };

export const algorithms = [
  {
    id: 'insert-one', title: tr('Inserir um elemento', 'Insert an element'), menuLabel: tr('Inserir um elemento', 'Insert an element'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Pegue o elemento da posição i e leve-o para a esquerda, trocando com o vizinho enquanto o vizinho for maior. O sub-vetor à esquerda já está ordenado.', 'Take the element at position i and carry it to the left, swapping with the neighbor while the neighbor is larger. The sub-array on the left is already sorted.'),
    interaction: tr('Escolha a posição i ou clique em uma célula do vetor. As posições à esquerda aparecem ordenadas, como depois das passadas anteriores.', 'Choose position i or click an array cell. The positions on the left appear sorted, as after the previous passes.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso o elemento anda por todas as posições à esquerda; no melhor caso, uma única comparação.', 'In the worst case the element goes through all the positions on the left; in the best case, a single comparison.') },
    pseudocode: INSERT_CODE,
  },
  {
    id: 'insertion-sort', title: tr('Insertion Sort', 'Insertion Sort'), menuLabel: tr('Insertion Sort', 'Insertion Sort'), group: tr('Como funciona', 'How it works'), number: '02',
    description: tr('Da esquerda para a direita, insira cada elemento no sub-vetor ordenado que o precede, até o vetor inteiro ficar ordenado.', 'From left to right, insert each element into the sorted sub-array that precedes it, until the whole array is sorted.'),
    interaction: tr('Pause nas comparações e acompanhe i e j. A parte verde, à esquerda de i, já está ordenada (ainda não é a posição final).', 'Pause at the comparisons and follow i and j. The green part, to the left of i, is already sorted (it is not the final position yet).'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('S(n) = 4: além do vetor, que é ordenado no próprio lugar, só existem n, i, j e a variável temporária da troca. No melhor caso (vetor ordenado) o custo é O(n).', 'S(n) = 4: besides the array, which is sorted in place, there are only n, i, j and the temporary swap variable. In the best case (sorted array) the cost is O(n).') },
    pseudocode: SORT_CODE,
  },
  {
    id: 'counting', title: tr('Contando as operações', 'Counting the operations'), menuLabel: tr('Complexidade de tempo', 'Time complexity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '03',
    description: tr('Conte as comparações e as trocas de cada passada e veja como o custo depende da ordem do vetor.', 'Count the comparisons and the swaps of each pass and see how the cost depends on the order of the array.'),
    interaction: tr('Gere vetores de tamanhos diferentes e compare o total com n(n−1)/2, o pior caso.', 'Generate arrays of different sizes and compare the total with n(n−1)/2, the worst case.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('Pior caso (vetor invertido): 1 + 2 + … + (n−1) = n(n−1)/2 comparações e trocas. Melhor caso (ordenado): n − 1 comparações e nenhuma troca.', 'Worst case (reversed array): 1 + 2 + … + (n−1) = n(n−1)/2 comparisons and swaps. Best case (sorted): n − 1 comparisons and no swaps.') },
    pseudocode: SORT_CODE,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '04',
    description: tr('Execute o algoritmo em três vetores com os mesmos valores em ordens diferentes e compare os contadores.', 'Run the algorithm on three arrays with the same values in different orders and compare the counters.'),
    interaction: tr('Avance passo a passo e observe que o vetor já ordenado custa uma comparação por passada, enquanto o invertido custa i.', 'Step through and notice that the sorted array costs one comparison per pass, while the reversed one costs i.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('É adaptável: num vetor já ordenado (ou quase) faz só n − 1 comparações, em tempo linear; no invertido faz n(n−1)/2.', 'It is adaptive: on an array that is already sorted (or almost) it makes only n − 1 comparisons, in linear time; on a reversed one it makes n(n−1)/2.') },
    pseudocode: SORT_CODE,
  },
  {
    id: 'stability', title: tr('Estabilidade', 'Stability'), menuLabel: tr('Estabilidade', 'Stability'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '05',
    description: tr('Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.', 'Repeated values get a letter that marks the original order. See whether the algorithm preserves that order.'),
    interaction: tr('Use "Gerar exemplo" para criar um vetor com valores repetidos e veja o elemento parar logo depois do igual que já estava lá.', 'Use "Generate example" to create an array with repeated values and see the element stop right after the equal one that was already there.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('O laço para quando vetor[j−1] > vetor[j] é falso, inclusive quando são iguais: o elemento sempre fica depois dos iguais a ele, então o Insertion Sort é estável.', 'The loop stops when array[j−1] > array[j] is false, including when they are equal: the element always ends up after the ones equal to it, so Insertion Sort is stable.') },
    pseudocode: SORT_CODE,
  },
];

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

const compareOf = (values, j, result) => ({
  left: { label: tr('vetor[j - 1]', 'array[j - 1]'), value: fmt(values[j - 1]) },
  op: '>',
  right: { label: tr('vetor[j]', 'array[j]'), value: fmt(values[j]) },
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
  steps.push(step(a, L.init, tr('j ← i', 'j ← i'), tr(`j recebe ${i}: vamos levar ${fmt(a[i])}, o elemento da posição ${i}, para o lugar dele no sub-vetor ordenado à esquerda.`, `j receives ${i}: we will carry ${fmt(a[i])}, the element at position ${i}, to its place in the sorted sub-array on the left.`), 'update', at({ pointers: { i, j } })));

  for (;;) {
    if (j === 0) {
      steps.push(step(a, L.test, tr('ENQUANTO j > 0 E …', 'WHILE j > 0 AND …'), tr(`j > 0 é falso: o laço termina. Como o E só avalia o lado direito quando o esquerdo é verdadeiro, vetor[j - 1] nem chega a ser examinado. ${fmt(a[0])} chegou ao início do vetor.`, `j > 0 is false: the loop ends. Since AND only evaluates the right side when the left one is true, array[j - 1] is not even examined. ${fmt(a[0])} reached the start of the array.`), 'success', at({ pointers: { i, j }, sortedCount: i + 1 })));
      break;
    }
    count.comparisons += 1;
    const greater = a[j - 1] > a[j];
    let verdict;
    if (greater) verdict = tr('O vizinho da esquerda é maior: o elemento ainda não está no lugar e o laço continua.', 'The left neighbor is larger: the element is not in place yet and the loop continues.');
    else if (a[j - 1] === a[j]) verdict = tr('Valores iguais: o teste é estrito (>), então o laço termina e o elemento fica depois do igual.', 'Equal values: the test is strict (>), so the loop ends and the element stays after the equal one.');
    else verdict = tr('O vizinho da esquerda não é maior: o elemento já está no lugar e o laço termina.', 'The left neighbor is not larger: the element is already in place and the loop ends.');
    steps.push(step(a, L.test, tr('ENQUANTO j > 0 E vetor[j - 1] > vetor[j]', 'WHILE j > 0 AND array[j - 1] > array[j]'), tr(`j > 0 é verdadeiro e ${fmt(a[j - 1])} > ${fmt(a[j])} é ${greater ? 'verdadeiro' : 'falso'}. ${verdict}`, `j > 0 is true and ${fmt(a[j - 1])} > ${fmt(a[j])} is ${greater ? 'true' : 'false'}. ${verdict}`), greater ? 'comparison' : 'success', at({
      pointers: { i, prev: j - 1, j }, compare: compareOf(a, j, greater), sortedCount: greater ? i : i + 1,
    })));
    if (!greater) break;

    const [big, small] = [a[j - 1], a[j]];
    [a[j - 1], a[j]] = [small, big];
    count.swaps += 1;
    steps.push(step(a, L.swap, tr('inverter(vetor[j - 1], vetor[j])', 'swap(array[j - 1], array[j])'), tr(`${fmt(big)} e ${fmt(small)} trocam de lugar: ${fmt(small)} anda uma posição para a esquerda.`, `${fmt(big)} and ${fmt(small)} swap places: ${fmt(small)} moves one position to the left.`), 'update', at({
      pointers: { i, prev: j - 1, j }, comparedIndices: [j - 1, j], changedIndices: [j - 1, j],
    })));
    j -= 1;
    scope.j = j;
    steps.push(step(a, L.dec, tr('j ← j - 1', 'j ← j - 1'), tr(`j recebe ${j}: o elemento ${fmt(a[j])} continua sendo acompanhado, agora na posição ${j}.`, `j receives ${j}: the element ${fmt(a[j])} is still being followed, now at position ${j}.`), 'update', at({ pointers: { i, j } })));
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
  const phase = { label: tr(`i = ${i}`, `i = ${i}`), text: tr(`Insere ${fmt(element)} no sub-vetor ordenado`, `Inserts ${fmt(element)} into the sorted sub-array`), code: true };
  const at = (extra) => ({ sortedCount: i, phase, variables: { ...scope }, stats: { 'comparações': count.comparisons, trocas: count.swaps }, ...extra });

  const steps = [
    step(a, 0, tr('Iniciando a inserção', 'Starting the insertion'), tr(`As passadas anteriores deixaram as ${i} primeiras posições ordenadas entre si (em verde). Vamos inserir ${fmt(element)}, o elemento da posição ${i}. O parâmetro i já tem valor (${i}); j ainda não foi atribuído.`, `The previous passes left the first ${i} positions sorted among themselves (in green). We will insert ${fmt(element)}, the element at position ${i}. The parameter i already has a value (${i}); j has not been assigned yet.`), 'neutral', at({ pointers: { i } })),
  ];
  const j = insertPass(steps, a, i, ONE, { at, scope, count });

  steps.push(step(a, ONE.end, tr('Inserção concluída', 'Insertion finished'), j === i
    ? tr(`${fmt(element)} já estava no lugar: ficou na posição ${i}, depois de ${count.comparisons} comparação e nenhuma troca.`, `${fmt(element)} was already in place: it stayed at position ${i}, after ${count.comparisons} comparison and no swaps.`)
    : tr(`${fmt(element)} foi inserido na posição ${j}, depois de ${plural(count.comparisons, 'comparação', 'comparações')} e ${plural(count.swaps, 'troca', 'trocas')}. As ${i + 1} primeiras posições estão ordenadas.`, `${fmt(element)} was inserted at position ${j}, after ${plural(count.comparisons, 'comparison', 'comparisons')} and ${plural(count.swaps, 'swap', 'swaps')}. The first ${i + 1} positions are sorted.`), 'done', {
    ...at({ sortedCount: i + 1 }),
    foundIndices: [j],
    output: [tr(`Posição final de ${fmt(element)}: ${j}`, `Final position of ${fmt(element)}: ${j}`), tr(`Comparações: ${count.comparisons} · Trocas: ${count.swaps}`, `Comparisons: ${count.comparisons} · Swaps: ${count.swaps}`)],
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
    step(a, 0, tr('Iniciando o Insertion Sort', 'Starting Insertion Sort'), tr(`O vetor tem ${n} posições. As variáveis n, i e j ainda não foram atribuídas. A primeira posição, sozinha, já é um sub-vetor ordenado; a cada passada, o próximo elemento é inserido nele.`, `The array has ${n} positions. The variables n, i and j have not been assigned yet. The first position, alone, is already a sorted sub-array; on each pass, the next element is inserted into it.`), 'neutral', { sortedCount: 1, stats: stats(), variables: { ...scope } }),
  ];

  scope.n = n;
  steps.push(step(a, LINE.n, tr('n ← vetor.length', 'n ← array.length'), tr(`n recebe ${n}, o tamanho do vetor.`, `n receives ${n}, the size of the array.`), 'update', { sortedCount: 1, stats: stats(), variables: { ...scope } }));

  for (let i = 1; i < n; i += 1) {
    const element = a[i];
    const phase = { label: tr(`i = ${i}`, `i = ${i}`), text: tr(`Insere ${fmt(element)} no sub-vetor ordenado`, `Inserts ${fmt(element)} into the sorted sub-array`), code: true };
    const at = (extra) => ({ sortedCount: i, phase, stats: stats(), output: clone(log), variables: { ...scope }, ...extra });

    scope.i = i;
    const ordered = i === 1 ? tr('A posição 0, sozinha, já é um sub-vetor ordenado', 'Position 0, alone, is already a sorted sub-array') : tr(`As ${i} primeiras posições estão ordenadas entre si`, `The first ${i} positions are sorted among themselves`);
    steps.push(step(a, LINE.loopI, tr(`PARA i (i = ${i})`, `FOR i (i = ${i})`), tr(`i recebe ${i} e a condição i ≤ ${n - 1} é verdadeira: o laço entra. ${ordered}; falta inserir ${fmt(element)}.`, `i receives ${i} and the condition i ≤ ${n - 1} is true: the loop is entered. ${ordered}; ${fmt(element)} still has to be inserted.`), 'reading', at({ pointers: { i } })));
    const j = insertPass(steps, a, i, LINE, { at, scope, count });
    log.push(j === i ? tr(`i = ${i}: ${fmt(element)} ficou onde estava`, `i = ${i}: ${fmt(element)} stayed where it was`) : tr(`i = ${i}: ${fmt(element)} → posição ${j}`, `i = ${i}: ${fmt(element)} → position ${j}`));
  }

  scope.i = n;
  steps.push(step(a, LINE.loopI, tr(`PARA i (i = ${n}): fim`, `FOR i (i = ${n}): end`), tr(`i recebe ${n} e a condição i ≤ ${n - 1} é falsa: o laço termina. O sub-vetor ordenado ocupa o vetor inteiro.`, `i receives ${n} and the condition i ≤ ${n - 1} is false: the loop ends. The sorted sub-array fills the whole array.`), 'success', {
    sortedCount: n, stats: stats(), output: clone(log), variables: { ...scope },
  }));
  steps.push(step(a, LINE.end, tr('Ordenação concluída', 'Sort finished'), tr(`Todas as posições estão em ordem crescente, após ${count.comparisons} comparações e ${count.swaps} trocas.`, `All the positions are in ascending order, after ${count.comparisons} comparisons and ${count.swaps} swaps.`), 'done', {
    sortedCount: n,
    stats: stats(),
    variables: { ...scope },
    output: [...log, tr(`Vetor ordenado: [${a.map(fmt).join(', ')}]`, `Sorted array: [${a.map(fmt).join(', ')}]`), tr(`Comparações: ${count.comparisons} · Trocas: ${count.swaps}`, `Comparisons: ${count.comparisons} · Swaps: ${count.swaps}`)],
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
    label: tr(`i = ${pass.i}`, `i = ${pass.i}`), value: null, mark: '', current: false,
  }));
  let comparisons = 0;
  let swaps = 0;
  const chart = (final = false) => ({
    title: tr('Comparações em cada passada (valor de i)', 'Comparisons in each pass (value of i)'),
    hint: tr('⇄ + número = trocas na passada', '⇄ + number = swaps in the pass'),
    max: n - 1,
    bars: bars.map((bar) => ({ ...bar })),
    totals: [
      { label: tr('Comparações', 'Comparisons'), value: comparisons, note: final ? tr(`entre n − 1 = ${n - 1} e n(n−1)/2 = ${worst}`, `between n − 1 = ${n - 1} and n(n−1)/2 = ${worst}`) : tr(`de ${n - 1} (ordenado) a ${worst} (invertido)`, `from ${n - 1} (sorted) to ${worst} (reversed)`) },
      { label: tr('Trocas', 'Swaps'), value: swaps, note: final ? tr(`entre 0 e n(n−1)/2 = ${worst}`, `between 0 and n(n−1)/2 = ${worst}`) : tr(`de 0 (ordenado) a ${worst} (invertido)`, `from 0 (sorted) to ${worst} (reversed)`) },
    ],
    final,
  });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, 0, tr('Contando as operações', 'Counting the operations'), tr(`Com n = ${n}, o laço PARA i executa ${n - 1} vezes. Em cada passada, o laço interno compara e troca até o elemento encontrar o lugar dele: quantas vezes depende da ordem do vetor.`, `With n = ${n}, the FOR i loop runs ${n - 1} times. In each pass, the inner loop compares and swaps until the element finds its place: how many times depends on the order of the array.`), 'neutral', common({ sortedCount: 1 })),
  ];

  passes.forEach((pass, index) => {
    const { i } = pass;
    const phase = { label: tr(`i = ${i}`, `i = ${i}`), text: tr(`Insere ${fmt(pass.moved.v)} no sub-vetor ordenado`, `Inserts ${fmt(pass.moved.v)} into the sorted sub-array`), code: true };
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += pass.comparisons;
    bars[index].value = pass.comparisons;

    const reachedStart = pass.to === 0;
    let how;
    if (reachedStart && pass.swaps) how = tr(`todas resultam em troca: o elemento chega ao início do vetor, e a condição j > 0 é que interrompe o laço`, `all of them result in a swap: the element reaches the start of the array, and it is the condition j > 0 that stops the loop`);
    else if (pass.swaps) how = tr(`${plural(pass.swaps, 'resulta', 'resultam')} em troca e a última, falsa, interrompe o laço`, `${plural(pass.swaps, 'comparison results', 'comparisons result')} in a swap and the last one, false, stops the loop`);
    else how = tr('a primeira já é falsa: o elemento já estava no lugar e o laço termina de imediato', 'the first one is already false: the element was already in place and the loop ends right away');
    steps.push(step(valuesOf(pass.before), LINE.test, tr(`i = ${i}: comparações`, `i = ${i}: comparisons`), tr(`O teste do ENQUANTO compara vetor[j - 1] > vetor[j] ${plural(pass.comparisons, 'vez', 'vezes')}: ${how}.`, `The WHILE test compares array[j - 1] > array[j] ${plural(pass.comparisons, 'time', 'times')}: ${how}.`), 'comparison', common({
      sortedCount: i, pointers: { i }, phase, variables: { i, 'comparações da passada': pass.comparisons, 'comparações acumuladas': comparisons },
    })));

    if (pass.swaps) {
      swaps += pass.swaps;
      bars[index].mark = `⇄ ${pass.swaps}`;
      steps.push(step(valuesOf(pass.after), LINE.swap, tr(`i = ${i}: trocas`, `i = ${i}: swaps`), tr(`A linha inverter executa ${plural(pass.swaps, 'vez', 'vezes')} (e j ← j − 1 também): ${fmt(pass.moved.v)} anda da posição ${i} até a ${pass.to}.`, `The swap line runs ${plural(pass.swaps, 'time', 'times')} (and j ← j − 1 too): ${fmt(pass.moved.v)} moves from position ${i} to ${pass.to}.`), 'update', common({
        sortedCount: i + 1, changedIndices: movedRange(pass), pointers: { i }, phase, variables: { i, trocas: swaps, 'comparações acumuladas': comparisons },
      })));
    }
  });

  bars.forEach((bar) => { bar.current = false; });
  const series = passes.map((pass) => pass.comparisons);
  steps.push(step(valuesOf(passes.at(-1).after), LINE.end, tr('Somando as passadas', 'Adding up the passes'), tr(`${series.join(' + ')} = ${comparisons} comparações e ${swaps} trocas, com n = ${n}. No pior caso (invertido) seriam n(n−1)/2 = ${worst} de cada; no melhor (ordenado), ${n - 1} comparações e nenhuma troca. Depende da ordem do vetor.`, `${series.join(' + ')} = ${comparisons} comparisons and ${swaps} swaps, with n = ${n}. In the worst case (reversed) there would be n(n−1)/2 = ${worst} of each; in the best case (sorted), ${n - 1} comparisons and no swaps. It depends on the order of the array.`), 'done', common({
    final: true,
    sortedCount: n,
    variables: { n, 'comparações': comparisons, trocas: swaps, 'n(n−1)/2': worst },
    output: [
      tr(`Comparações: ${comparisons}`, `Comparisons: ${comparisons}`),
      tr(`Trocas: ${swaps}`, `Swaps: ${swaps}`),
      tr(`Melhor caso: ${n - 1} comparações, 0 trocas`, `Best case: ${n - 1} comparisons, 0 swaps`),
      tr(`Pior caso: ${worst} comparações, ${worst} trocas`, `Worst case: ${worst} comparisons, ${worst} swaps`),
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
    { label: tr('Já ordenado', 'Already sorted'), values: inOrder },
    { label: tr('Ordem inversa', 'Reverse order'), values: [...inOrder].reverse() },
    { label: tr('Seu vetor', 'Your array'), values: clone(values) },
  ].map((scenario) => ({ ...scenario, passes: runPasses(toItems(scenario.values)), comparisons: 0, swaps: 0 }));
  const worst = (n * (n - 1)) / 2;

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, tr('Três vetores, os mesmos valores', 'Three arrays, the same values'), tr('O primeiro já está ordenado, o segundo está em ordem inversa e o terceiro é o seu vetor. O algoritmo vai tratar os três do mesmo jeito?', 'The first is already sorted, the second is in reverse order and the third is your array. Will the algorithm treat the three the same way?'), 'neutral', {
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
    steps.push(step(values, LINE.test, tr(`i = ${i}: inserção`, `i = ${i}: insertion`), tr(`Comparações nesta passada: ${perPass} (ordenado · inverso · seu). O vetor ordenado faz uma só por passada; o invertido leva o elemento até o início. Total acumulado: ${joined('comparisons')}.`, `Comparisons in this pass: ${perPass} (sorted · reverse · yours). The sorted array makes only one per pass; the reversed one takes the element to the start. Accumulated total: ${joined('comparisons')}.`), 'comparison', {
      rows: rows((scenario) => ({
        values: valuesOf(scenario.passes[index].after), sortedCount: i + 1, markIndex: scenario.passes[index].to,
      })),
      variables: { i, 'comparações': joined('comparisons'), trocas: joined('swaps') },
    }));
  }

  steps.push(step(values, LINE.end, tr('O custo depende da ordem', 'The cost depends on the order'), tr(`Os três vetores terminaram com ${joined('comparisons')} comparações e ${joined('swaps')} trocas (ordenado · inverso · seu). O ordenado custou n − 1 = ${n - 1} comparações, tempo linear; o invertido, n(n−1)/2 = ${worst}. O Insertion Sort é adaptável.`, `The three arrays ended with ${joined('comparisons')} comparisons and ${joined('swaps')} swaps (sorted · reverse · yours). The sorted one cost n − 1 = ${n - 1} comparisons, linear time; the reversed one, n(n−1)/2 = ${worst}. Insertion Sort is adaptive.`), 'done', {
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
      ? step(values, 0, tr('Valores repetidos em destaque', 'Repeated values highlighted'), tr('Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética.', 'Repeated values get a letter (a, b, …) that marks the order in which they appear. A stable algorithm ends with those letters in alphabetical order.'), 'neutral', { tags: tagsOf(items), sortedCount: 1 })
      : step(values, 0, tr('Não há valores repetidos', 'There are no repeated values'), tr('Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com repetidos.', 'Without repeated values there is no relative order to preserve. Use "Generate example" to create an array with repeats.'), 'warning', { tags: tagsOf(items), sortedCount: 1 }),
  ];

  passes.forEach((pass) => {
    const { i, to, moved } = pass;
    const phase = { label: tr(`i = ${i}`, `i = ${i}`), text: tr(`Insere ${label(moved)} no sub-vetor ordenado`, `Inserts ${label(moved)} into the sorted sub-array`), code: true };
    const after = pass.after;
    const common = { tags: tagsOf(after), phase, variables: { i, j: to } };

    if (pass.stoppedBy) {
      const wall = pass.stoppedBy;
      log.push(tr(`i = ${i}: ${label(moved)} parou depois de ${label(wall)}`, `i = ${i}: ${label(moved)} stopped after ${label(wall)}`));
      steps.push(step(valuesOf(after), LINE.test, tr(`i = ${i}: ${label(moved)} para ao encontrar ${label(wall)}`, `i = ${i}: ${label(moved)} stops on meeting ${label(wall)}`), tr(`${label(moved)} andou da posição ${i} até a ${to}. Lá encontrou ${label(wall)}: ${fmt(wall.v)} > ${fmt(moved.v)} é falso, então o laço termina e ${label(moved)} fica DEPOIS de ${label(wall)}, na mesma ordem em que os dois apareciam no vetor.`, `${label(moved)} moved from position ${i} to ${to}. There it met ${label(wall)}: ${fmt(wall.v)} > ${fmt(moved.v)} is false, so the loop ends and ${label(moved)} stays AFTER ${label(wall)}, in the same order in which the two appeared in the array.`), 'comparison', {
        ...common, pointers: { i, prev: to - 1, j: to }, compare: compareOf(valuesOf(after), to, false), sortedCount: i + 1, output: clone(log),
      }));
    } else {
      steps.push(step(valuesOf(after), LINE.test, tr(`i = ${i}: ${label(moved)} é inserido`, `i = ${i}: ${label(moved)} is inserted`), to === i
        ? tr(`${label(moved)} já estava no lugar: o vizinho da esquerda não é maior.`, `${label(moved)} was already in place: the left neighbor is not larger.`)
        : tr(`${label(moved)} andou da posição ${i} até a ${to}, trocando só com vizinhos estritamente maiores${to === 0 ? ' e chegou ao início do vetor' : ''}.`, `${label(moved)} moved from position ${i} to ${to}, swapping only with strictly larger neighbors${to === 0 ? ' and reached the start of the array' : ''}.`), 'success', {
        ...common, pointers: { i, j: to }, sortedCount: i + 1, changedIndices: movedRange(pass), output: clone(log),
      }));
    }
  });

  const final = passes.length ? passes.at(-1).after : items;
  const order = final.map(label).join(' ');
  steps.push(step(valuesOf(final), LINE.end, hasRepeated ? tr('Resultado: estável', 'Result: stable') : tr('Resultado', 'Result'), hasRepeated && isStable(final)
    ? tr('A ordem relativa dos iguais foi preservada: as letras de cada valor continuam em ordem alfabética. O Insertion Sort é estável porque o laço para diante de um valor igual, em vez de passar por cima dele.', 'The relative order of the equals was preserved: the letters of each value stay in alphabetical order. Insertion Sort is stable because the loop stops in front of an equal value, instead of passing over it.')
    : tr('O vetor não tinha valores repetidos, então não há o que comparar.', 'The array had no repeated values, so there is nothing to compare.'), 'done', {
    tags: tagsOf(final),
    sortedCount: n,
    output: [...log, tr(`Ordem final: ${order}`, `Final order: ${order}`), hasRepeated ? tr('Ordem dos iguais preservada.', 'Order of the equals preserved.') : tr('Sem valores repetidos.', 'No repeated values.')],
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
