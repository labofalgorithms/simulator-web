import {
  NONE, ascending, clone, fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf,
} from '../shared/sort-steps.js';
import { locale, tr } from '../../core/i18n.js';

// Pseudocódigo da aula (slide 37): n passadas, e em cada uma o laço de j varre o vetor inteiro.
const SORT_CODE = [
  tr('FUNÇÃO bubbleSort(vetor)', 'FUNCTION bubbleSort(array)'),
  tr('  n ← vetor.length', '  n ← array.length'),
  tr('  PARA i de 0 até n - 1 FAÇA', '  FOR i from 0 to n - 1 DO'),
  tr('    PARA j de 1 até n - 1 FAÇA', '    FOR j from 1 to n - 1 DO'),
  tr('      SE vetor[j - 1] > vetor[j] ENTÃO', '      IF array[j - 1] > array[j] THEN'),
  tr('        inverter(vetor[j - 1], vetor[j])', '        swap(array[j - 1], array[j])'),
  tr('      FIM SE', '      END IF'),
  tr('    FIM PARA', '    END FOR'),
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
];

// Versão otimizada (slides 105 a 107): a cada passada o maior valor já está no fim, então o laço de
// j para antes. Em base 0 são n - 1 - i comparações na passada i (o slide escreve n - i, que sairia
// do vetor), e a última passada útil é i = n - 2.
const OPTIMIZED_CODE = [
  tr('FUNÇÃO bubbleSortOtimizado(vetor)', 'FUNCTION optimizedBubbleSort(array)'),
  tr('  n ← vetor.length', '  n ← array.length'),
  tr('  PARA i de 0 até n - 2 FAÇA', '  FOR i from 0 to n - 2 DO'),
  tr('    PARA j de 1 até n - 1 - i FAÇA', '    FOR j from 1 to n - 1 - i DO'),
  tr('      SE vetor[j - 1] > vetor[j] ENTÃO', '      IF array[j - 1] > array[j] THEN'),
  tr('        inverter(vetor[j - 1], vetor[j])', '        swap(array[j - 1], array[j])'),
  tr('      FIM SE', '      END IF'),
  tr('    FIM PARA', '    END FOR'),
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
];

const SWEEP_CODE = [
  tr('FUNÇÃO varredura(vetor, fim)', 'FUNCTION sweep(array, end)'),
  tr('  PARA j de 1 até fim FAÇA', '  FOR j from 1 to end DO'),
  tr('    SE vetor[j - 1] > vetor[j] ENTÃO', '    IF array[j - 1] > array[j] THEN'),
  tr('      inverter(vetor[j - 1], vetor[j])', '      swap(array[j - 1], array[j])'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
];

// Linhas de SORT_CODE e de OPTIMIZED_CODE (base 0), que têm a mesma forma.
const LINE = { n: 1, loopI: 2, loopJ: 3, test: 4, swap: 5, end: 9 };
// Linhas de SWEEP_CODE.
const SWEEP = { loopJ: 1, test: 2, swap: 3, end: 6 };

export const algorithms = [
  {
    id: 'sweep', title: tr('Uma varredura', 'One sweep'), menuLabel: tr('Uma varredura', 'One sweep'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Percorra o vetor da esquerda para a direita comparando pares vizinhos e trocando os que estão fora de ordem. O maior valor é "empurrado" para o fim.', 'Walk through the array from left to right comparing neighboring pairs and swapping the ones that are out of order. The largest value is "pushed" to the end.'),
    interaction: tr('Mude a última posição do trecho ou clique em uma célula do vetor para escolhê-la. Veja o maior valor do trecho viajar até ela.', 'Change the last position of the range or click an array cell to choose it. Watch the largest value of the range travel to it.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Cada par de vizinhos do trecho é comparado uma única vez.', 'Each pair of neighbors in the range is compared only once.') },
    pseudocode: SWEEP_CODE,
  },
  {
    id: 'bubble-sort', title: tr('Bubble Sort', 'Bubble Sort'), menuLabel: tr('Bubble Sort', 'Bubble Sort'), group: tr('Como funciona', 'How it works'), number: '02',
    description: tr('Repita a varredura n vezes. A cada passada, o maior valor ainda fora do lugar sobe como uma bolha até o fim do vetor.', 'Repeat the sweep n times. On each pass, the largest value still out of place rises like a bubble to the end of the array.'),
    interaction: tr('Pause nas comparações e acompanhe os marcadores i, j−1 e j. Tudo à direita do trecho verde já está na posição final.', 'Pause at the comparisons and follow the markers i, j−1 and j. Everything to the right of the green range is already in its final position.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('S(n) = 4: além do vetor, que é ordenado no próprio lugar, só existem n, i, j e a variável temporária da troca.', 'S(n) = 4: besides the array, which is sorted in place, there are only n, i, j and the temporary swap variable.') },
    pseudocode: SORT_CODE,
  },
  {
    id: 'optimized', title: tr('Bubble Sort otimizado', 'Optimized Bubble Sort'), menuLabel: tr('Versão otimizada', 'Optimized version'), group: tr('Como funciona', 'How it works'), number: '03',
    description: tr('Como o maior valor já está no fim depois de cada passada, o laço de j não precisa mais chegar até lá: a varredura encolhe a cada vez.', 'Since the largest value is already at the end after each pass, the j loop no longer needs to reach there: the sweep shrinks every time.'),
    interaction: tr('Compare com o Bubble Sort da aula: o resultado é o mesmo, mas as comparações caem de n(n−1) para n(n−1)/2.', 'Compare with the lesson\'s Bubble Sort: the result is the same, but the comparisons drop from n(n−1) to n(n−1)/2.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('As comparações caem para (n−1) + (n−2) + … + 1 = n(n−1)/2, metade da versão da aula, mas o custo continua quadrático.', 'The comparisons drop to (n−1) + (n−2) + … + 1 = n(n−1)/2, half of the lesson\'s version, but the cost is still quadratic.') },
    pseudocode: OPTIMIZED_CODE,
  },
  {
    id: 'counting', title: tr('Contando as operações', 'Counting the operations'), menuLabel: tr('Complexidade de tempo', 'Time complexity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '04',
    description: tr('Conte as comparações e as trocas de cada passada e veja por que o custo total cresce com n².', 'Count the comparisons and the swaps of each pass and see why the total cost grows with n².'),
    interaction: tr('Gere vetores de tamanhos diferentes e compare o total de comparações com n(n−1).', 'Generate arrays of different sizes and compare the total number of comparisons with n(n−1).'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('São n passadas de n − 1 comparações cada: n(n−1). As trocas são uma por par fora de ordem, no máximo n(n−1)/2.', 'There are n passes of n − 1 comparisons each: n(n−1). The swaps are one per pair out of order, at most n(n−1)/2.') },
    pseudocode: SORT_CODE,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '05',
    description: tr('Execute o algoritmo em três vetores com os mesmos valores em ordens diferentes e compare os contadores.', 'Run the algorithm on three arrays with the same values in different orders and compare the counters.'),
    interaction: tr('Avance passo a passo e observe que as comparações são idênticas nos três vetores. Só as trocas mudam.', 'Step through and notice that the comparisons are identical in the three arrays. Only the swaps change.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('Melhor, médio e pior caso fazem as mesmas n(n−1) comparações: o Bubble Sort não se adapta à ordem inicial.', 'Best, average and worst case make the same n(n−1) comparisons: Bubble Sort does not adapt to the initial order.') },
    pseudocode: SORT_CODE,
  },
  {
    id: 'stability', title: tr('Estabilidade', 'Stability'), menuLabel: tr('Estabilidade', 'Stability'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '06',
    description: tr('Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.', 'Repeated values get a letter that marks the original order. See whether the algorithm preserves that order.'),
    interaction: tr('Use "Gerar exemplo" para criar um vetor com valores repetidos e acompanhe o encontro de dois iguais: a troca não acontece.', 'Use "Generate example" to create an array with repeated values and follow the meeting of two equals: the swap does not happen.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('A troca exige vetor[j−1] > vetor[j] (estrito) e só ocorre entre vizinhos: dois iguais nunca passam um por cima do outro, então o Bubble Sort é estável.', 'The swap requires array[j−1] > array[j] (strict) and only happens between neighbors: two equals never pass over each other, so Bubble Sort is stable.') },
    pseudocode: SORT_CODE,
  },
];

const compareOf = (values, j, result) => ({
  left: { label: tr('vetor[j - 1]', 'array[j - 1]'), value: fmt(values[j - 1]) },
  op: '>',
  right: { label: tr('vetor[j]', 'array[j]'), value: fmt(values[j]) },
  result,
});

const verdictOf = (left, right) => {
  if (left > right) return tr('O par está fora de ordem.', 'The pair is out of order.');
  return left === right ? tr('Valores iguais: o teste é estrito (>), então não há troca.', 'Equal values: the test is strict (>), so there is no swap.') : tr('O par já está em ordem.', 'The pair is already in order.');
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
  const phase = { label: tr('Varredura', 'Sweep'), text: tr('Compara pares vizinhos', 'Compares neighboring pairs') };
  const scope = { fim, j: NONE };
  const base = (extra) => ({ outsideIndices, phase, variables: { ...scope }, ...extra });
  let swaps = 0;

  const steps = [
    step(a, 0, tr('Iniciando a varredura', 'Starting the sweep'), fim === 0
      ? tr(`O trecho vai da posição 0 até a ${fim}: só há um elemento, então não há pares para comparar.`, `The range goes from position 0 to ${fim}: there is only one element, so there are no pairs to compare.`)
      : tr(`Compararemos pares vizinhos do trecho que vai da posição 0 até a ${fim}, da esquerda para a direita. O parâmetro fim já tem valor (${fim}); j ainda não foi atribuído.`, `We will compare neighboring pairs of the range that goes from position 0 to ${fim}, from left to right. The parameter end already has a value (${fim}); j has not been assigned yet.`), 'neutral', base({})),
  ];

  for (let j = 1; j <= fim; j += 1) {
    scope.j = j;
    steps.push(step(a, SWEEP.loopJ, tr(`PARA j (j = ${j})`, `FOR j (j = ${j})`), tr(`j recebe ${j} e a condição j ≤ ${fim} é verdadeira: o laço entra. O par examinado é (${j - 1}, ${j}).`, `j receives ${j} and the condition j ≤ ${fim} is true: the loop is entered. The pair examined is (${j - 1}, ${j}).`), 'reading', base({ pointers: { prev: j - 1, j } })));
    const greater = a[j - 1] > a[j];
    steps.push(step(a, SWEEP.test, tr('SE vetor[j - 1] > vetor[j]', 'IF array[j - 1] > array[j]'), tr(`${fmt(a[j - 1])} > ${fmt(a[j])} é ${greater ? 'verdadeiro' : 'falso'}. ${verdictOf(a[j - 1], a[j])}`, `${fmt(a[j - 1])} > ${fmt(a[j])} is ${greater ? 'true' : 'false'}. ${verdictOf(a[j - 1], a[j])}`), 'comparison', base({
      pointers: { prev: j - 1, j }, compare: compareOf(a, j, greater),
    })));
    if (greater) {
      const [big, small] = [a[j - 1], a[j]];
      [a[j - 1], a[j]] = [small, big];
      swaps += 1;
      steps.push(step(a, SWEEP.swap, tr('inverter(vetor[j - 1], vetor[j])', 'swap(array[j - 1], array[j])'), tr(`${fmt(big)} e ${fmt(small)} trocam de lugar: o maior segue para a direita.`, `${fmt(big)} and ${fmt(small)} swap places: the larger one moves to the right.`), 'update', base({
        pointers: { prev: j - 1, j }, comparedIndices: [j - 1, j], changedIndices: [j - 1, j],
      })));
    }
  }

  scope.j = fim + 1;
  steps.push(step(a, SWEEP.loopJ, tr(`PARA j (j = ${fim + 1}): fim`, `FOR j (j = ${fim + 1}): end`), fim === 0
    ? tr(`j recebe 1 e a condição j ≤ 0 é falsa: o laço nem chega a entrar.`, `j receives 1 and the condition j ≤ 0 is false: the loop is not even entered.`)
    : tr(`j recebe ${fim + 1} e a condição j ≤ ${fim} é falsa: o laço termina. Todos os pares do trecho foram comparados.`, `j receives ${fim + 1} and the condition j ≤ ${fim} is false: the loop ends. All the pairs of the range were compared.`), 'success', base({})));
  steps.push(step(a, SWEEP.end, tr('Varredura concluída', 'Sweep finished'), tr(`${fim === 0 ? 'Nada mudou.' : `O maior valor do trecho, ${fmt(a[fim])}, está na posição ${fim}.`} A varredura fez ${fim} comparações e ${swaps} trocas.`, `${fim === 0 ? 'Nothing changed.' : `The largest value of the range, ${fmt(a[fim])}, is at position ${fim}.`} The sweep made ${fim} comparisons and ${swaps} swaps.`), 'done', base({
    foundIndices: fim === 0 ? [] : [fim], output: [tr(`Comparações: ${fim}`, `Comparisons: ${fim}`), tr(`Trocas: ${swaps}`, `Swaps: ${swaps}`), tr(`Maior do trecho: ${fmt(a[fim])} → posição ${fim}`, `Largest of the range: ${fmt(a[fim])} → position ${fim}`)],
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
  const name = optimized ? tr('Bubble Sort otimizado', 'Optimized Bubble Sort') : tr('Bubble Sort', 'Bubble Sort');
  const log = [];
  let comparisons = 0;
  let swaps = 0;
  let idle = 0;
  const stats = () => ({ 'comparações': comparisons, trocas: swaps });
  const scope = { n: NONE, i: NONE, j: NONE };
  const steps = [
    step(a, 0, tr(`Iniciando o ${name}`, `Starting ${name}`), tr(`O vetor tem ${n} posições. As variáveis n, i e j ainda não foram atribuídas. A cada passada, o maior valor ainda fora do lugar sobe até o fim do trecho que está sendo varrido.`, `The array has ${n} positions. The variables n, i and j have not been assigned yet. On each pass, the largest value still out of place rises to the end of the range being swept.`), 'neutral', { stats: stats(), variables: { ...scope } }),
  ];

  scope.n = n;
  steps.push(step(a, LINE.n, tr('n ← vetor.length', 'n ← array.length'), tr(`n recebe ${n}, o tamanho do vetor.`, `n receives ${n}, the size of the array.`), 'update', { stats: stats(), variables: { ...scope } }));

  for (let i = 0; i < passesCount; i += 1) {
    const end = optimized ? n - 1 - i : n - 1;
    const at = (extra) => ({ sortedFrom: n - i, stats: stats(), output: clone(log), variables: { ...scope }, ...extra });
    const phase = { label: tr(`i = ${i}`, `i = ${i}`), text: tr('Varredura: compara pares vizinhos', 'Sweep: compares neighboring pairs'), code: true };
    let passSwaps = 0;

    scope.i = i;
    steps.push(step(a, LINE.loopI, tr(`PARA i (i = ${i})`, `FOR i (i = ${i})`), tr(`i recebe ${i} e a condição i ≤ ${passesCount - 1} é verdadeira: o laço entra. ${i === 0
      ? 'Nenhuma posição está definitiva ainda.'
      : `${i === 1 ? 'A última posição já tem' : `As ${i} últimas posições já têm`} o valor definitivo.`}`, `i receives ${i} and the condition i ≤ ${passesCount - 1} is true: the loop is entered. ${i === 0 ? 'No position is final yet.' : `${i === 1 ? 'The last position already has' : `The last ${i} positions already have`} the final value.`}`), 'reading', at({ pointers: { i }, phase })));

    for (let j = 1; j <= end; j += 1) {
      scope.j = j;
      steps.push(step(a, LINE.loopJ, tr(`PARA j (j = ${j})`, `FOR j (j = ${j})`), tr(`j recebe ${j} e a condição j ≤ ${end} é verdadeira: o laço entra. O par examinado é (${j - 1}, ${j}).`, `j receives ${j} and the condition j ≤ ${end} is true: the loop is entered. The pair examined is (${j - 1}, ${j}).`), 'reading', at({ pointers: { i, prev: j - 1, j }, phase })));
      comparisons += 1;
      const greater = a[j - 1] > a[j];
      steps.push(step(a, LINE.test, tr('SE vetor[j - 1] > vetor[j]', 'IF array[j - 1] > array[j]'), tr(`${fmt(a[j - 1])} > ${fmt(a[j])} é ${greater ? 'verdadeiro' : 'falso'}. ${verdictOf(a[j - 1], a[j])}`, `${fmt(a[j - 1])} > ${fmt(a[j])} is ${greater ? 'true' : 'false'}. ${verdictOf(a[j - 1], a[j])}`), 'comparison', at({
        pointers: { i, prev: j - 1, j }, compare: compareOf(a, j, greater), phase,
      })));
      if (greater) {
        const [big, small] = [a[j - 1], a[j]];
        [a[j - 1], a[j]] = [small, big];
        swaps += 1;
        passSwaps += 1;
        steps.push(step(a, LINE.swap, tr('inverter(vetor[j - 1], vetor[j])', 'swap(array[j - 1], array[j])'), tr(`${fmt(big)} e ${fmt(small)} trocam de lugar: o maior segue para a direita.`, `${fmt(big)} and ${fmt(small)} swap places: the larger one moves to the right.`), 'update', at({
          pointers: { i, prev: j - 1, j }, comparedIndices: [j - 1, j], changedIndices: [j - 1, j], phase,
        })));
      }
    }

    scope.j = end + 1;
    const position = n - 1 - i;
    if (!passSwaps) idle += 1;
    log.push(tr(`i = ${i}: ${passSwaps ? `${fmt(a[position])} → posição ${position}` : 'nenhuma troca'}`, `i = ${i}: ${passSwaps ? `${fmt(a[position])} → position ${position}` : 'no swaps'}`));
    let ending;
    if (end < 1) ending = tr(`j recebe ${end + 1} e a condição j ≤ ${end} é falsa: o laço nem chega a entrar, porque não há pares para comparar.`, `j receives ${end + 1} and the condition j ≤ ${end} is false: the loop is not even entered, because there are no pairs to compare.`);
    else if (passSwaps) ending = tr(`j recebe ${end + 1} e a condição j ≤ ${end} é falsa: o laço termina. A varredura fez ${plural(end, 'comparação', 'comparações')} e ${plural(passSwaps, 'troca', 'trocas')}; ${fmt(a[position])} chegou à posição ${position}, a definitiva.`, `j receives ${end + 1} and the condition j ≤ ${end} is false: the loop ends. The sweep made ${plural(end, 'comparison', 'comparisons')} and ${plural(passSwaps, 'swap', 'swaps')}; ${fmt(a[position])} reached position ${position}, its final one.`);
    else ending = tr(`j recebe ${end + 1} e a condição j ≤ ${end} é falsa: o laço termina. O j andou até o final e não houve nenhuma troca nesta passada.${optimized ? '' : ' Mesmo assim, o laço de i continua.'}`, `j receives ${end + 1} and the condition j ≤ ${end} is false: the loop ends. j went all the way to the end and there were no swaps in this pass.${optimized ? '' : ' Even so, the i loop goes on.'}`);
    steps.push(step(a, LINE.loopJ, tr(`PARA j (j = ${end + 1}): fim`, `FOR j (j = ${end + 1}): end`), ending, 'success', at({
      sortedFrom: n - (i + 1), pointers: { i }, phase, output: clone(log),
    })));
  }

  scope.i = passesCount;
  steps.push(step(a, LINE.loopI, tr(`PARA i (i = ${passesCount}): fim`, `FOR i (i = ${passesCount}): end`), tr(`i recebe ${passesCount} e a condição i ≤ ${passesCount - 1} é falsa: o laço termina. Todas as posições estão em sua posição final.`, `i receives ${passesCount} and the condition i ≤ ${passesCount - 1} is false: the loop ends. All the positions are in their final position.`), 'success', {
    sortedFrom: 0, stats: stats(), output: clone(log), variables: { ...scope },
  }));

  const original = n * (n - 1);
  let closing = tr(`Todas as posições estão em ordem crescente, após ${comparisons} comparações e ${swaps} trocas.`, `All the positions are in ascending order, after ${comparisons} comparisons and ${swaps} swaps.`);
  if (optimized) closing += tr(` A versão da aula faria n(n−1) = ${original} comparações; esta fez ${comparisons}.`, ` The lesson's version would make n(n−1) = ${original} comparisons; this one made ${comparisons}.`);
  else if (idle) closing += tr(` ${plural(idle, 'passada não trocou', 'passadas não trocaram')} nada: o algoritmo continua varrendo mesmo com o vetor já ordenado. É isso que a otimização evita.`, ` ${plural(idle, 'pass did not swap', 'passes did not swap')} anything: the algorithm keeps sweeping even with the array already sorted. That is what the optimization avoids.`);
  steps.push(step(a, LINE.end, tr('Ordenação concluída', 'Sort finished'), closing, 'done', {
    sortedFrom: 0,
    stats: stats(),
    variables: { ...scope },
    output: [...log, tr(`Vetor ordenado: [${a.map(fmt).join(', ')}]`, `Sorted array: [${a.map(fmt).join(', ')}]`), tr(`Comparações: ${comparisons} · Trocas: ${swaps}`, `Comparisons: ${comparisons} · Swaps: ${swaps}`)],
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
      { label: tr('Comparações', 'Comparisons'), value: comparisons, note: final ? tr(`n(n−1) = ${n}·${n - 1} = ${expected}`, `n(n−1) = ${n}·${n - 1} = ${expected}`) : tr(`esperado ao final: ${expected}`, `expected at the end: ${expected}`) },
      { label: tr('Trocas', 'Swaps'), value: swaps, note: final ? tr(`no máximo n(n−1)/2 = ${worstSwaps}`, `at most n(n−1)/2 = ${worstSwaps}`) : tr(`no máximo ${worstSwaps}`, `at most ${worstSwaps}`) },
    ],
    final,
  });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, 0, tr('Contando as operações', 'Counting the operations'), tr(`Com n = ${n}, o laço PARA i executa ${n} vezes e, em cada uma, o laço PARA j compara ${n - 1} pares. Vamos contar as comparações e as trocas de cada passada.`, `With n = ${n}, the FOR i loop runs ${n} times and, in each one, the FOR j loop compares ${n - 1} pairs. We will count the comparisons and the swaps of each pass.`), 'neutral', common({})),
  ];

  passes.forEach((pass, index) => {
    const { i } = pass;
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += pass.comparisons;
    bars[index].value = pass.comparisons;
    const phase = { label: tr(`i = ${i}`, `i = ${i}`), text: tr('Varredura: compara pares vizinhos', 'Sweep: compares neighboring pairs'), code: true };

    steps.push(step(valuesOf(pass.before), LINE.test, tr(`i = ${i}: varredura`, `i = ${i}: sweep`), tr(`A linha SE vetor[j - 1] > vetor[j] executa ${pass.comparisons} vezes, uma para cada j de 1 a ${n - 1}, até nas posições que já estão no lugar. ${pass.swaps
      ? `${plural(pass.swaps, 'comparação resulta', 'comparações resultam')} em troca.`
      : 'Nenhuma delas resulta em troca.'}`, `The line IF array[j - 1] > array[j] runs ${pass.comparisons} times, once for each j from 1 to ${n - 1}, even on positions that are already in place. ${pass.swaps ? `${plural(pass.swaps, 'comparison results', 'comparisons result')} in a swap.` : 'None of them results in a swap.'}`), 'comparison', common({
      sortedFrom: n - i, pointers: { i }, phase, variables: { i, 'comparações da passada': pass.comparisons, 'comparações acumuladas': comparisons },
    })));

    if (pass.swaps) {
      swaps += pass.swaps;
      bars[index].mark = `⇄ ${pass.swaps}`;
      steps.push(step(valuesOf(pass.after), LINE.swap, tr(`i = ${i}: trocas`, `i = ${i}: swaps`), tr(`A linha inverter executa ${pass.swaps} ${pass.swaps === 1 ? 'vez' : 'vezes'} nesta passada: uma para cada par fora de ordem encontrado. ${fmt(pass.after[n - 1 - i].v)} termina na posição ${n - 1 - i}.`, `The line swap runs ${pass.swaps} ${pass.swaps === 1 ? 'time' : 'times'} in this pass: once for each pair out of order found. ${fmt(pass.after[n - 1 - i].v)} ends up at position ${n - 1 - i}.`), 'update', common({
        sortedFrom: n - (i + 1), changedIndices: movedBy(pass), pointers: { i }, phase, variables: { i, trocas: swaps, 'comparações acumuladas': comparisons },
      })));
    }
  });

  bars.forEach((bar) => { bar.current = false; });
  const doubled = n * 2;
  const doubledExpected = doubled * (doubled - 1);
  steps.push(step(valuesOf(passes.at(-1).after), LINE.end, tr('Somando as passadas', 'Adding up the passes'), tr(`${n} passadas × ${n - 1} comparações = ${comparisons} = n(n−1), com n = ${n}. As trocas somam ${swaps}: uma por par fora de ordem (no máximo n(n−1)/2 = ${worstSwaps}). Como n(n−1) cresce com n², o custo é O(n²).`, `${n} passes × ${n - 1} comparisons = ${comparisons} = n(n−1), with n = ${n}. The swaps add up to ${swaps}: one per pair out of order (at most n(n−1)/2 = ${worstSwaps}). Since n(n−1) grows with n², the cost is O(n²).`), 'done', common({
    final: true,
    sortedFrom: 0,
    variables: { n, 'comparações': comparisons, 'n(n−1)': expected, trocas: swaps },
    output: [
      tr(`Comparações: ${comparisons}`, `Comparisons: ${comparisons}`),
      tr(`Trocas: ${swaps}`, `Swaps: ${swaps}`),
      tr(`n(n−1) = ${n}·${n - 1} = ${expected}`, `n(n−1) = ${n}·${n - 1} = ${expected}`),
      tr(`Com n = ${doubled}: ${doubledExpected} comparações (≈ ${(doubledExpected / Math.max(1, expected)).toLocaleString(locale, { maximumFractionDigits: 1 })}×)`, `With n = ${doubled}: ${doubledExpected} comparisons (≈ ${(doubledExpected / Math.max(1, expected)).toLocaleString(locale, { maximumFractionDigits: 1 })}×)`),
      tr(`Versão otimizada: n(n−1)/2 = ${expected / 2} comparações`, `Optimized version: n(n−1)/2 = ${expected / 2} comparisons`),
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
    { label: tr('Já ordenado', 'Already sorted'), values: inOrder },
    { label: tr('Ordem inversa', 'Reverse order'), values: [...inOrder].reverse() },
    { label: tr('Seu vetor', 'Your array'), values: clone(values) },
  ].map((scenario) => ({ ...scenario, passes: runPasses(toItems(scenario.values)), comparisons: 0, swaps: 0 }));
  const expected = n * (n - 1);

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, tr('Três vetores, os mesmos valores', 'Three arrays, the same values'), tr('O primeiro já está ordenado, o segundo está em ordem inversa e o terceiro é o seu vetor. O algoritmo vai tratar os três do mesmo jeito?', 'The first is already sorted, the second is in reverse order and the third is your array. Will the algorithm treat the three the same way?'), 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedFrom: n })),
    }),
  ];

  for (let index = 0; index < n; index += 1) {
    scenarios.forEach((scenario) => {
      scenario.comparisons += scenario.passes[index].comparisons;
      scenario.swaps += scenario.passes[index].swaps;
    });
    const passSwaps = scenarios.map((scenario) => scenario.passes[index].swaps).join(' · ');
    steps.push(step(values, LINE.test, tr(`i = ${index}: varredura`, `i = ${index}: sweep`), tr(`A linha SE executa ${n - 1} vezes em cada vetor, mesmo no que já está ordenado. Trocas nesta passada: ${passSwaps}. Total acumulado: ${joined('comparisons')} comparações.`, `The IF line runs ${n - 1} times on each array, even on the one that is already sorted. Swaps in this pass: ${passSwaps}. Accumulated total: ${joined('comparisons')} comparisons.`), 'comparison', {
      rows: rows((scenario) => ({
        values: valuesOf(scenario.passes[index].after), sortedFrom: n - (index + 1), changedIndices: movedBy(scenario.passes[index]),
      })),
      variables: { i: index, 'comparações': joined('comparisons'), trocas: joined('swaps') },
    }));
  }

  steps.push(step(values, LINE.end, tr('Mesmas comparações, trocas diferentes', 'Same comparisons, different swaps'), tr(`Os três vetores fizeram ${expected} comparações. Só as trocas mudaram (${joined('swaps')}). Mesmo no vetor ordenado o algoritmo varre tudo n vezes: o Bubble Sort não é adaptável, e o melhor caso também é O(n²).`, `The three arrays made ${expected} comparisons. Only the swaps changed (${joined('swaps')}). Even on the sorted array the algorithm sweeps everything n times: Bubble Sort is not adaptive, and the best case is also O(n²).`), 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.passes.at(-1).after), sortedFrom: 0 })),
    output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.comparisons} comparações, ${scenario.swaps} trocas`, `${scenario.label}: ${scenario.comparisons} comparisons, ${scenario.swaps} swaps`)),
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
      ? step(values, 0, tr('Valores repetidos em destaque', 'Repeated values highlighted'), tr('Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética.', 'Repeated values get a letter (a, b, …) that marks the order in which they appear. A stable algorithm ends with those letters in alphabetical order.'), 'neutral', { tags: tagsOf(items), sortedFrom: n })
      : step(values, 0, tr('Não há valores repetidos', 'There are no repeated values'), tr('Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com repetidos.', 'Without repeated values there is no relative order to preserve. Use "Generate example" to create an array with repeats.'), 'warning', { tags: tagsOf(items), sortedFrom: n }),
  ];

  passes.forEach((pass) => {
    const { i } = pass;
    const phase = { label: tr(`i = ${i}`, `i = ${i}`), text: tr('Varredura: compara pares vizinhos', 'Sweep: compares neighboring pairs'), code: true };

    pass.ties.forEach(({ j, at }) => {
      const left = at[j - 1];
      const right = at[j];
      log.push(tr(`i = ${i}: ${label(left)} e ${label(right)} se encontraram; sem troca`, `i = ${i}: ${label(left)} and ${label(right)} met; no swap`));
      steps.push(step(valuesOf(at), LINE.test, tr(`i = ${i}: iguais se encontram`, `i = ${i}: equals meet`), tr(`${label(left)} e ${label(right)} ficam lado a lado (j − 1 = ${j - 1}, j = ${j}). ${fmt(left.v)} > ${fmt(right.v)} é falso, então a troca NÃO acontece e ${label(left)} continua antes de ${label(right)}.`, `${label(left)} and ${label(right)} sit side by side (j − 1 = ${j - 1}, j = ${j}). ${fmt(left.v)} > ${fmt(right.v)} is false, so the swap does NOT happen and ${label(left)} stays before ${label(right)}.`), 'comparison', {
        tags: tagsOf(at), pointers: { i, prev: j - 1, j }, compare: compareOf(valuesOf(at), j, false), sortedFrom: n - i, phase, output: clone(log), variables: { i, j },
      }));
    });

    const sorted = pass.after;
    steps.push(step(valuesOf(sorted), LINE.loopJ, tr(`i = ${i}: fim da varredura`, `i = ${i}: end of the sweep`), pass.swaps
      ? tr(`${plural(pass.swaps, 'troca foi feita', 'trocas foram feitas')} nesta passada, sempre entre vizinhos com o da esquerda maior. ${label(sorted[n - 1 - i])} chegou à posição ${n - 1 - i}.`, `${plural(pass.swaps, 'swap was made', 'swaps were made')} in this pass, always between neighbors with the left one larger. ${label(sorted[n - 1 - i])} reached position ${n - 1 - i}.`)
      : tr('Nenhuma troca nesta passada.', 'No swaps in this pass.'), 'success', {
      tags: tagsOf(sorted), pointers: { i }, sortedFrom: n - (i + 1), changedIndices: movedBy(pass), phase, output: clone(log), variables: { i },
    }));
  });

  const final = passes.at(-1).after;
  const order = final.map(label).join(' ');
  steps.push(step(valuesOf(final), LINE.end, hasRepeated ? tr('Resultado: estável', 'Result: stable') : tr('Resultado', 'Result'), hasRepeated && isStable(final)
    ? tr('A ordem relativa dos iguais foi preservada: as letras de cada valor continuam em ordem alfabética. O Bubble Sort é estável porque só troca vizinhos quando o da esquerda é estritamente maior.', 'The relative order of the equals was preserved: the letters of each value stay in alphabetical order. Bubble Sort is stable because it only swaps neighbors when the left one is strictly larger.')
    : tr('O vetor não tinha valores repetidos, então não há o que comparar.', 'The array had no repeated values, so there is nothing to compare.'), 'done', {
    tags: tagsOf(final),
    sortedFrom: 0,
    output: [...log, tr(`Ordem final: ${order}`, `Final order: ${order}`), hasRepeated ? tr('Ordem dos iguais preservada.', 'Order of the equals preserved.') : tr('Sem valores repetidos.', 'No repeated values.')],
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
