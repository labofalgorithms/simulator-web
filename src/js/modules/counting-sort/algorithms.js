import {
  NONE, isStable, range, step, tagDuplicates, tagsOf, toItems, valuesOf,
} from '../shared/sort-steps.js';
import {
  adaptabilityScenarios, copyItems, createTrace, itemLabel, plural, traceFindMax, vectorLane,
} from '../shared/linear-sort.js';
import { tr } from '../../core/i18n.js';

// Pseudocódigo da aula (slide 9, linhas 01 a 16 com a mesma numeração). O `return 0` da linha 16 vira
// `FIM`: a função ordena o próprio vetor e não devolve nada. encontrarMaior não está nos slides (a
// aula só mostra "Maior = 10"): é a do código de exemplo, escrita em pseudocódigo.
const FIND_CODE = [
  tr('FUNÇÃO encontrarMaior(A)', 'FUNCTION findLargest(A)'),
  tr('  maior ← A[0]', '  largest ← A[0]'),
  tr('  PARA i DE 1 ATÉ tamanho de A - 1 FAÇA', '  FOR i FROM 1 TO size of A - 1 DO'),
  tr('    SE A[i] > maior ENTÃO', '    IF A[i] > largest THEN'),
  tr('      maior ← A[i]', '      largest ← A[i]'),
  tr('  RETORNE maior', '  RETURN largest'),
  tr('FIM', 'END'),
];

const SIMPLE_CODE = [
  tr('FUNÇÃO CountingSort(A)', 'FUNCTION CountingSort(A)'),
  tr('  maior ← encontrarMaior(A)', '  largest ← findLargest(A)'),
  tr('  // vetor de tamanho (maior + 1)', '  // array of size (largest + 1)'),
  tr('  Criar vetor count[], com maior + 1 posições, todas em 0', '  Create array count[], with largest + 1 positions, all 0'),
  tr('  PARA i DE 0 ATÉ tamanho de A - 1 FAÇA', '  FOR i FROM 0 TO size of A - 1 DO'),
  tr('    count[A[i]] ← count[A[i]] + 1', '    count[A[i]] ← count[A[i]] + 1'),
  tr('  FIM PARA', '  END FOR'),
  tr('  indice ← 0', '  index ← 0'),
  tr('  PARA i DE 0 ATÉ tamanho de count - 1 FAÇA', '  FOR i FROM 0 TO size of count - 1 DO'),
  tr('    ENQUANTO count[i] > 0 FAÇA', '    WHILE count[i] > 0 DO'),
  tr('      A[indice] ← i', '      A[index] ← i'),
  tr('      indice ← indice + 1', '      index ← index + 1'),
  tr('      count[i] ← count[i] - 1', '      count[i] ← count[i] - 1'),
  tr('    FIM ENQUANTO', '    END WHILE'),
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
  '',
  ...FIND_CODE,
];
const SIMPLE_FIND = {
  head: 17, init: 18, loop: 19, test: 20, set: 21, ret: 22,
};
const S = {
  head: 0, call: 1, create: [2, 3], loopCount: 4, inc: 5, index: 7, loopScan: 8, test: 9, write: 10, next: 11, dec: 12, end: 15,
};

// A versão estável (soma acumulada) é a do código de exemplo do Radix Sort, sem o dígito: os slides
// 8 e 106 só a descrevem em palavras ("adicione os valores da frequência dos anteriores").
const STABLE_CODE = [
  tr('FUNÇÃO CountingSortEstavel(A)', 'FUNCTION StableCountingSort(A)'),
  tr('  maior ← encontrarMaior(A)', '  largest ← findLargest(A)'),
  tr('  // count[v] = quantas vezes o valor v aparece', '  // count[v] = how many times the value v appears'),
  tr('  Criar vetor count[], com maior + 1 posições, todas em 0', '  Create array count[], with largest + 1 positions, all 0'),
  tr('  PARA i DE 0 ATÉ tamanho de A - 1 FAÇA', '  FOR i FROM 0 TO size of A - 1 DO'),
  tr('    count[A[i]] ← count[A[i]] + 1', '    count[A[i]] ← count[A[i]] + 1'),
  tr('  // soma acumulada: count[v] = quantos valores são <= v', '  // running sum: count[v] = how many values are <= v'),
  tr('  PARA i DE 1 ATÉ maior FAÇA', '  FOR i FROM 1 TO largest DO'),
  tr('    count[i] ← count[i] + count[i - 1]', '    count[i] ← count[i] + count[i - 1]'),
  tr('  Criar vetor saida[], com o tamanho de A', '  Create array output[], with the size of A'),
  tr('  // de trás para a frente, para manter a ordem dos iguais', '  // from back to front, to keep the order of the equals'),
  tr('  PARA i DE tamanho de A - 1 DECRESCENDO ATÉ 0 FAÇA', '  FOR i FROM size of A - 1 DOWN TO 0 DO'),
  tr('    saida[count[A[i]] - 1] ← A[i]', '    output[count[A[i]] - 1] ← A[i]'),
  tr('    count[A[i]] ← count[A[i]] - 1', '    count[A[i]] ← count[A[i]] - 1'),
  tr('  PARA i DE 0 ATÉ tamanho de A - 1 FAÇA', '  FOR i FROM 0 TO size of A - 1 DO'),
  tr('    A[i] ← saida[i]', '    A[i] ← output[i]'),
  tr('FIM', 'END'),
  '',
  ...FIND_CODE,
];
const STABLE_FIND = {
  head: 18, init: 19, loop: 20, test: 21, set: 22, ret: 23,
};
const T = {
  head: 0, call: 1, create: 3, loopCount: 4, inc: 5, loopSum: 7, sum: 8, makeOut: 9, loopBack: 11, place: 12, dec: 13, loopCopy: 14, copy: 15, end: 16,
};

export const algorithms = [
  {
    id: 'counting', title: tr('Counting Sort', 'Counting Sort'), menuLabel: tr('Counting Sort', 'Counting Sort'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Use os valores do vetor como índices de um vetor auxiliar: conte quantas vezes cada valor aparece e reescreva o vetor percorrendo as contagens, do menor índice ao maior.', 'Use the values of the array as indices of an auxiliary array: count how many times each value appears and rewrite the array by going through the counts, from the lowest index to the highest.'),
    interaction: tr('Acompanhe o vetor count de 0 até o maior valor. Repare nos índices que ficam com 0: eles existem no vetor auxiliar, mas não escrevem nada em A. Coloque valores repetidos para ver uma contagem maior que 1.', 'Follow the count array from 0 to the largest value. Notice the indices that stay at 0: they exist in the auxiliary array, but write nothing in A. Enter repeated values to see a count greater than 1.'),
    complexity: { time: tr('O(n + maior)', 'O(n + largest)'), space: tr('O(maior)', 'O(largest)'), note: tr('Achar o maior, contar e reescrever passam uma vez pelos n elementos; criar e varrer count passam por maior + 1 posições. Não há nenhuma comparação entre elementos (além de achar o maior). O vetor auxiliar tem maior + 1 posições, por isso o espaço extra é O(maior).', 'Finding the largest, counting and rewriting go once over the n elements; creating and scanning count go over largest + 1 positions. There is no comparison between elements (besides finding the largest). The auxiliary array has largest + 1 positions, so the extra space is O(largest).') },
    pseudocode: SIMPLE_CODE,
  },
  {
    id: 'stable', title: tr('Versão estável', 'Stable version'), menuLabel: tr('Versão estável (soma acumulada)', 'Stable version (running sum)'), group: tr('Como funciona', 'How it works'), number: '02',
    description: tr('A versão simples reescreve os valores a partir dos índices e perde a identidade de cada elemento. Somando as contagens (frequência dos anteriores), count[v] vira a posição final de v e cada elemento vai para um vetor de saída, de trás para a frente.', 'The simple version rewrites the values from the indices and loses the identity of each element. By adding up the counts (frequency of the previous ones), count[v] becomes the final position of v and each element goes to an output array, from back to front.'),
    interaction: tr('Use valores repetidos: as letras marcam a ordem original. Repare que o laço da saída anda de trás para a frente, e que por isso o último igual ocupa a última posição do seu grupo.', 'Use repeated values: the letters mark the original order. Notice that the output loop goes from back to front, and that is why the last equal takes the last position of its group.'),
    complexity: { time: tr('O(n + maior)', 'O(n + largest)'), space: tr('O(n + maior)', 'O(n + largest)'), note: tr('Os mesmos laços da versão simples, mais a soma acumulada (maior passos) e a cópia da saída (n passos). Agora há dois vetores auxiliares, count e saida: espaço extra O(n + maior).', 'The same loops as the simple version, plus the running sum (largest steps) and the copy of the output (n steps). There are now two auxiliary arrays, count and output: extra space O(n + largest).') },
    pseudocode: STABLE_CODE,
  },
  {
    id: 'complexity', title: tr('Custo de n e do maior valor', 'Cost of n and of the largest value'), menuLabel: tr('Complexidade de tempo', 'Time complexity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '03',
    description: tr('Compare o seu vetor com o mesmo vetor em que o maior valor foi trocado por um número muito maior. O tempo é O(n + maior): com poucos elementos e um valor enorme, o vetor auxiliar domina o custo.', 'Compare your array with the same array in which the largest value was replaced by a much larger number. The time is O(n + largest): with few elements and a huge value, the auxiliary array dominates the cost.'),
    interaction: tr('Veja cada fase em barras: as fases que passam pelo vetor A custam n; as que passam por count custam maior + 1. É a desvantagem do slide 104.', 'See each phase in bars: the phases that go through array A cost n; those that go through count cost largest + 1. It is the disadvantage of slide 104.'),
    complexity: { time: tr('O(n + maior)', 'O(n + largest)'), space: tr('O(maior)', 'O(largest)'), note: tr('O algoritmo tem o mesmo custo em todos os casos: n + maior. Quando maior é da ordem de n, o Counting Sort é linear, O(n). Quando maior é muito maior que n, o tempo e a memória do vetor count passam a dominar.', 'The algorithm has the same cost in every case: n + largest. When largest is of the order of n, Counting Sort is linear, O(n). When largest is much greater than n, the time and memory of the count array start to dominate.') },
    pseudocode: SIMPLE_CODE,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '04',
    description: tr('Execute o algoritmo em quatro vetores com os mesmos valores em ordens diferentes. O Counting Sort não é adaptável: a ordem que já existe não muda nada.', 'Run the algorithm on four arrays with the same values in different orders. Counting Sort is not adaptive: the order that already exists changes nothing.'),
    interaction: tr('Compare as quatro barras: são idênticas, porque count só depende de quais valores existem e de quantas vezes, nunca de onde eles estão.', 'Compare the four bars: they are identical, because count only depends on which values exist and how many times, never on where they are.'),
    complexity: { time: tr('O(n + maior)', 'O(n + largest)'), space: tr('O(maior)', 'O(largest)'), note: tr('O vetor count recebe as mesmas contagens em qualquer ordem inicial, e o algoritmo sempre percorre A e count inteiros. O Counting Sort processa os dados de forma linear, independentemente da ordenação pré-existente.', 'The count array receives the same counts in any initial order, and the algorithm always goes through all of A and count. Counting Sort processes the data linearly, regardless of the pre-existing order.') },
    pseudocode: SIMPLE_CODE,
  },
];

const costOf = (n, maior) => ({
  find: n - 1, create: maior + 1, count: n, scan: maior + 1, write: n,
});
const totalOf = (cost) => Object.values(cost).reduce((x, y) => x + y, 0);

/**
 * O Counting Sort da aula sobre `source` (itens `{ v, tag }`). Com `record` monta os passos, uma linha
 * do pseudocódigo por passo; sem ele só executa, para as análises. Devolve o custo de cada fase.
 */
export function runCounting(source, { record = false } = {}) {
  const a = copyItems(source);
  const n = a.length;
  const { steps, at } = createTrace(record);
  const v = { maior: NONE, i: NONE, indice: NONE };
  let count = null;
  const emit = (line, title, description, tone, { lane = {}, ...extra } = {}) => at(valuesOf(a), line, title, description, tone, {
    tags: tagsOf(a),
    lanes: count ? [vectorLane('count', count, { caption: tr('vetor auxiliar de contagem', 'auxiliary counting array'), dimZeros: true, ...lane })] : [],
    variables: { ...v },
    ...extra,
  });

  emit(S.head, tr('Vetor e vetor auxiliar', 'Array and auxiliary array'), tr(`Vamos ordenar o vetor de ${plural(n, 'elemento', 'elementos')} contando quantas vezes cada valor aparece. Os valores do vetor vão servir de índices de um segundo vetor, o count.`, `We will sort the array of ${plural(n, 'element', 'elements')} by counting how many times each value appears. The values of the array will serve as indices of a second array, count.`), 'neutral');
  emit(S.call, tr('Chama encontrarMaior(A)', 'Calls findLargest(A)'), tr('Para saber o tamanho de count, é preciso conhecer o maior valor de A.', 'To know the size of count, the largest value of A must be known.'), 'neutral');
  const maior = traceFindMax(a, (...args) => emit(...args), SIMPLE_FIND, { fn: tr('encontrarMaior', 'findLargest'), setVar: (max, i) => { v.maior = max; v.i = i === null ? NONE : i; } });
  v.maior = maior;
  v.i = NONE;
  emit(S.call, tr(`maior = ${maior}`, `largest = ${maior}`), tr(`encontrarMaior devolveu ${maior}: o vetor count terá ${maior + 1} posições, de 0 a ${maior}.`, `findLargest returned ${maior}: the count array will have ${maior + 1} positions, from 0 to ${maior}.`), 'neutral', { foundIndices: [a.findIndex((item) => item.v === maior)], phase: { label: tr('Maior valor', 'Largest value'), text: tr(`maior = ${maior}`, `largest = ${maior}`), code: true } });

  count = Array.from({ length: maior + 1 }, () => 0);
  emit(S.create, tr('Cria o vetor count', 'Creates the count array'), tr(`count tem maior + 1 = ${maior + 1} posições, todas em 0: a posição v vai contar quantas vezes o valor v aparece em A.`, `count has largest + 1 = ${maior + 1} positions, all 0: position v will count how many times the value v appears in A.`), 'neutral');

  for (let i = 0; i < n; i += 1) {
    v.i = i;
    emit(S.loopCount, `i = ${i}`, tr(`O laço lê A[${i}] = ${a[i].v}.`, `The loop reads A[${i}] = ${a[i].v}.`), 'comparison', { pointers: { i }, activeIndices: [i], lane: { activeIndices: [a[i].v] } });
    count[a[i].v] += 1;
    emit(S.inc, tr(`count[${a[i].v}] ← ${count[a[i].v]}`, `count[${a[i].v}] ← ${count[a[i].v]}`), tr(`O valor ${a[i].v} é o índice no vetor count: count[${a[i].v}] passa de ${count[a[i].v] - 1} para ${count[a[i].v]}.`, `The value ${a[i].v} is the index in the count array: count[${a[i].v}] goes from ${count[a[i].v] - 1} to ${count[a[i].v]}.`), 'neutral', { pointers: { i }, activeIndices: [i], lane: { changedIndices: [a[i].v], activeIndices: [a[i].v] } });
  }

  let indice = 0;
  v.i = NONE;
  v.indice = 0;
  emit(S.index, 'indice ← 0', tr('indice marca a próxima posição de A a ser reescrita. A contagem terminou: agora o count diz quantas cópias de cada valor devem voltar para A.', 'index marks the next position of A to be rewritten. The counting is over: now count says how many copies of each value must go back into A.'), 'neutral', { pointers: { indice: 0 } });
  for (let i = 0; i <= maior; i += 1) {
    v.i = i;
    emit(S.loopScan, `i = ${i}`, count[i] === 0
      ? tr(`O laço chega ao índice ${i}: count[${i}] = 0, o valor ${i} não aparece em A.`, `The loop reaches index ${i}: count[${i}] = 0, the value ${i} does not appear in A.`)
      : tr(`O laço chega ao índice ${i}: count[${i}] = ${count[i]}, o valor ${i} aparece ${plural(count[i], 'vez', 'vezes')}.`, `The loop reaches index ${i}: count[${i}] = ${count[i]}, the value ${i} appears ${plural(count[i], 'time', 'times')}.`), 'comparison', { pointers: { indice: Math.min(indice, n - 1) }, sortedIndices: range(indice), lane: { pointers: { i }, activeIndices: [i] } });
    for (;;) {
      const more = count[i] > 0;
      emit(S.test, tr('count[i] > 0?', 'count[i] > 0?'), tr(`count[${i}] = ${count[i]} > 0? ${more ? 'Sim, ainda falta escrever uma cópia.' : 'Não, passa para o próximo índice.'}`, `count[${i}] = ${count[i]} > 0? ${more ? 'Yes, one more copy is still to be written.' : 'No, move on to the next index.'}`), 'comparison', {
        pointers: { indice: Math.min(indice, n - 1) }, sortedIndices: range(indice), lane: { pointers: { i }, activeIndices: [i] }, compare: { left: { label: `count[${i}]`, value: count[i] }, op: '>', right: { label: '0', value: 0 }, result: more },
      });
      if (!more) break;
      a[indice] = { v: i, tag: '' };
      emit(S.write, tr(`A[${indice}] ← ${i}`, `A[${indice}] ← ${i}`), tr(`O índice ${i} vira o valor: A[${indice}] recebe ${i}.`, `The index ${i} becomes the value: A[${indice}] receives ${i}.`), 'neutral', { pointers: { indice }, changedIndices: [indice], sortedIndices: range(indice + 1), lane: { pointers: { i }, activeIndices: [i] } });
      indice += 1;
      v.indice = indice;
      emit(S.next, tr(`indice ← ${indice}`, `index ← ${indice}`), tr(`indice avança para ${indice}.`, `index moves on to ${indice}.`), 'neutral', { pointers: { indice: Math.min(indice, n - 1) }, sortedIndices: range(indice), lane: { pointers: { i }, activeIndices: [i] } });
      count[i] -= 1;
      emit(S.dec, tr(`count[${i}] ← ${count[i]}`, `count[${i}] ← ${count[i]}`), tr(`Uma cópia de ${i} foi escrita: count[${i}] cai para ${count[i]}.`, `One copy of ${i} was written: count[${i}] drops to ${count[i]}.`), 'neutral', { pointers: { indice: Math.min(indice, n - 1) }, sortedIndices: range(indice), lane: { pointers: { i }, changedIndices: [i], activeIndices: [i] } });
    }
  }
  v.i = NONE;
  emit(S.end, tr('Vetor ordenado', 'Array sorted'), tr(`Todos os índices de count chegaram a 0 e o vetor está ordenado: ${valuesOf(a).join(', ')}. Foram ${n - 1} comparações para o maior valor e nenhuma entre elementos; o resto é contar (${n}), varrer count (${maior + 1}) e reescrever (${n}).`, `All the indices of count reached 0 and the array is sorted: ${valuesOf(a).join(', ')}. There were ${n - 1} comparisons for the largest value and none between elements; the rest is counting (${n}), scanning count (${maior + 1}) and rewriting (${n}).`), 'done', {
    sortedIndices: range(n), output: [tr(`Vetor ordenado: ${valuesOf(a).join(' ')}`, `Sorted array: ${valuesOf(a).join(' ')}`)],
  });

  const cost = costOf(n, maior);
  return {
    steps, final: a, maior, cost, total: totalOf(cost),
  };
}

/**
 * A versão estável (soma acumulada) sobre `source` (itens `{ v, tag }`): a contagem, a soma dos
 * anteriores, a saída montada de trás para a frente e a cópia de volta.
 */
export function runStable(source, { record = false } = {}) {
  const a = copyItems(source);
  const n = a.length;
  const { steps, at } = createTrace(record);
  const v = { maior: NONE, i: NONE };
  let count = null;
  let saida = null;
  const emit = (line, title, description, tone, { lane = {}, outLane = {}, ...extra } = {}) => at(valuesOf(a), line, title, description, tone, {
    tags: tagsOf(a),
    lanes: [
      count && vectorLane('count', count, { caption: tr('vetor auxiliar de contagem', 'auxiliary counting array'), dimZeros: true, ...lane }),
      saida && vectorLane(tr('saida', 'output'), saida.map((item) => (item ? item.v : null)), { caption: tr('vetor de saída', 'output array'), tags: saida.map((item) => item?.tag ?? ''), ...outLane }),
    ].filter(Boolean),
    variables: { ...v },
    ...extra,
  });

  emit(T.head, tr('Versão estável', 'Stable version'), tr(`Além do count, esta versão usa um vetor de saída. Os valores repetidos ganham uma letra (a, b, …) que marca a ordem original em A: ao final, as letras de cada valor devem continuar em ordem.`, `Besides count, this version uses an output array. Repeated values get a letter (a, b, …) that marks the original order in A: at the end, the letters of each value must still be in order.`), 'neutral');
  emit(T.call, tr('Chama encontrarMaior(A)', 'Calls findLargest(A)'), tr('Para saber o tamanho de count, é preciso conhecer o maior valor de A.', 'To know the size of count, the largest value of A must be known.'), 'neutral');
  const maior = traceFindMax(a, (...args) => emit(...args), STABLE_FIND, { fn: tr('encontrarMaior', 'findLargest'), setVar: (max, i) => { v.maior = max; v.i = i === null ? NONE : i; } });
  v.maior = maior;
  v.i = NONE;
  emit(T.call, tr(`maior = ${maior}`, `largest = ${maior}`), tr(`encontrarMaior devolveu ${maior}: count terá ${maior + 1} posições.`, `findLargest returned ${maior}: count will have ${maior + 1} positions.`), 'neutral', { foundIndices: [a.findIndex((item) => item.v === maior)] });

  count = Array.from({ length: maior + 1 }, () => 0);
  emit(T.create, tr('Cria o vetor count', 'Creates the count array'), tr(`count tem ${maior + 1} posições, todas em 0.`, `count has ${maior + 1} positions, all 0.`), 'neutral');
  for (let i = 0; i < n; i += 1) {
    v.i = i;
    emit(T.loopCount, `i = ${i}`, tr(`O laço lê A[${i}] = ${itemLabel(a[i])}.`, `The loop reads A[${i}] = ${itemLabel(a[i])}.`), 'comparison', { pointers: { i }, activeIndices: [i], lane: { activeIndices: [a[i].v] } });
    count[a[i].v] += 1;
    emit(T.inc, tr(`count[${a[i].v}] ← ${count[a[i].v]}`, `count[${a[i].v}] ← ${count[a[i].v]}`), tr(`count[${a[i].v}] passa a ${count[a[i].v]}.`, `count[${a[i].v}] becomes ${count[a[i].v]}.`), 'neutral', { pointers: { i }, activeIndices: [i], lane: { changedIndices: [a[i].v], activeIndices: [a[i].v] } });
  }
  for (let i = 1; i <= maior; i += 1) {
    v.i = i;
    emit(T.loopSum, `i = ${i}`, tr(`O laço chega ao índice ${i}.`, `The loop reaches index ${i}.`), 'comparison', { lane: { pointers: { i }, activeIndices: [i, i - 1] } });
    count[i] += count[i - 1];
    emit(T.sum, tr(`count[${i}] ← ${count[i]}`, `count[${i}] ← ${count[i]}`), tr(`count[${i}] soma count[${i - 1}]: agora ${count[i]} valores do vetor são menores ou iguais a ${i}, e essa é a posição (mais um) do último ${i} na saída.`, `count[${i}] adds count[${i - 1}]: now ${count[i]} values of the array are less than or equal to ${i}, and that is the position (plus one) of the last ${i} in the output.`), 'neutral', { lane: { pointers: { i }, changedIndices: [i], activeIndices: [i - 1] } });
  }
  v.i = NONE;
  saida = Array.from({ length: n }, () => null);
  emit(T.makeOut, tr('Cria o vetor saida', 'Creates the output array'), tr(`saida tem o tamanho de A (${n}) e ainda está vazio. Cada valor v vai ocupar as posições de count[v - 1] até count[v] - 1.`, `output has the size of A (${n}) and is still empty. Each value v will take the positions from count[v - 1] to count[v] - 1.`), 'neutral');
  for (let i = n - 1; i >= 0; i -= 1) {
    v.i = i;
    emit(T.loopBack, `i = ${i}`, tr(`O laço anda de trás para a frente: lê A[${i}] = ${itemLabel(a[i])}.`, `The loop goes from back to front: it reads A[${i}] = ${itemLabel(a[i])}.`), 'comparison', { pointers: { i }, activeIndices: [i], lane: { activeIndices: [a[i].v] } });
    const where = count[a[i].v] - 1;
    saida[where] = { ...a[i] };
    emit(T.place, tr(`saida[${where}] ← ${itemLabel(a[i])}`, `output[${where}] ← ${itemLabel(a[i])}`), tr(`count[${a[i].v}] = ${where + 1}, então ${itemLabel(a[i])} vai para saida[${where}]: o último de cada valor ocupa a última posição do seu grupo.`, `count[${a[i].v}] = ${where + 1}, so ${itemLabel(a[i])} goes to output[${where}]: the last of each value takes the last position of its group.`), 'neutral', { pointers: { i }, activeIndices: [i], lane: { activeIndices: [a[i].v] }, outLane: { changedIndices: [where], foundIndices: [where] } });
    count[a[i].v] -= 1;
    emit(T.dec, tr(`count[${a[i].v}] ← ${count[a[i].v]}`, `count[${a[i].v}] ← ${count[a[i].v]}`), tr(`count[${a[i].v}] cai para ${count[a[i].v]}: o próximo ${a[i].v} (o anterior em A) vai uma posição antes.`, `count[${a[i].v}] drops to ${count[a[i].v]}: the next ${a[i].v} (the previous one in A) goes one position earlier.`), 'neutral', { pointers: { i }, activeIndices: [i], lane: { changedIndices: [a[i].v], activeIndices: [a[i].v] }, outLane: { foundIndices: [where] } });
  }
  for (let i = 0; i < n; i += 1) {
    v.i = i;
    emit(T.loopCopy, `i = ${i}`, tr(`O laço vai copiar saida[${i}] de volta.`, `The loop will copy output[${i}] back.`), 'comparison', { pointers: { i }, sortedIndices: range(i), outLane: { activeIndices: [i] } });
    a[i] = { ...saida[i] };
    emit(T.copy, tr(`A[${i}] ← ${itemLabel(a[i])}`, `A[${i}] ← ${itemLabel(a[i])}`), tr(`A[${i}] recebe ${itemLabel(a[i])}.`, `A[${i}] receives ${itemLabel(a[i])}.`), 'neutral', { pointers: { i }, changedIndices: [i], sortedIndices: range(i + 1), outLane: { activeIndices: [i] } });
  }
  v.i = NONE;
  const stable = isStable(a);
  const hasRepeated = a.some((item) => item.tag);
  emit(T.end, hasRepeated ? tr('Resultado: ordem preservada', 'Result: order preserved') : tr('Vetor ordenado', 'Array sorted'), hasRepeated
    ? tr(`Ordem final: ${a.map(itemLabel).join(' ')}. Os iguais saíram na ordem original (as letras estão em ordem): ler A de trás para a frente e preencher a saída de trás para a frente mantém a ordem relativa. O Counting Sort estável é estável.`, `Final order: ${a.map(itemLabel).join(' ')}. The equals came out in the original order (the letters are in order): reading A from back to front and filling the output from back to front keeps the relative order. Stable Counting Sort is stable.`)
    : tr(`Vetor ordenado: ${valuesOf(a).join(', ')}. Não há valores repetidos neste vetor; use "Gerar exemplo" para ver a ordem dos iguais.`, `Sorted array: ${valuesOf(a).join(', ')}. There are no repeated values in this array; use "Generate example" to see the order of the equals.`), 'done', {
    sortedIndices: range(n), output: [tr(`Ordem final: ${a.map(itemLabel).join(' ')}`, `Final order: ${a.map(itemLabel).join(' ')}`), stable ? tr('Ordem dos iguais preservada.', 'Order of the equals preserved.') : tr('Ordem dos iguais alterada.', 'Order of the equals changed.')],
  });
  const cost = {
    find: n - 1, create: maior + 1, count: n, scan: maior, write: 2 * n,
  };
  return {
    steps, final: a, maior, cost, total: totalOf(cost), stable,
  };
}

/** Vetor para o Counting Sort: valores pequenos, com repetidos (é o que o algoritmo ordena bem). */
export function randomValues(count) {
  const values = Array.from({ length: count }, () => Math.floor(Math.random() * (count + 6)));
  if (new Set(values).size === values.length) values[values.length - 1] = values[0];
  return values;
}

/** O mesmo que `randomValues`, garantindo ao menos três iguais para a estabilidade ficar visível. */
export function stableExample(count) {
  const base = randomValues(count);
  base[1] = base[0];
  base[count - 1] = base[0];
  return base;
}

// ---------------------------------------------------------------------------
// 03 · Custo de n e do maior valor
// ---------------------------------------------------------------------------

const PHASES = () => [
  ['find', tr('maior', 'largest')], ['create', tr('criar', 'create')], ['count', tr('contar', 'count')], ['scan', tr('varrer', 'scan')], ['write', tr('escrever', 'write')],
];

function complexitySteps(values) {
  const n = values.length;
  const maior = Math.max(...values);
  const bigger = [maior * 10 + 10, maior * 100 + 100];
  const withMax = (target) => {
    const copy = [...values];
    copy[copy.indexOf(maior)] = target;
    return copy;
  };
  const scenarios = [
    { label: tr('Seu vetor', 'Your array'), values: [...values], maior },
    ...bigger.map((target) => ({ label: tr(`maior = ${target}`, `largest = ${target}`), values: withMax(target), maior: target })),
  ].map((scenario) => ({ ...scenario, cost: costOf(n, scenario.maior) }));
  const scale = Math.max(...scenarios.map((scenario) => Math.max(...Object.values(scenario.cost))));
  const frame = (scenario, final = false) => ({
    title: tr('Operações de cada fase', 'Operations of each phase'),
    hint: tr(`escala: 0 a ${scale}`, `scale: 0 to ${scale}`),
    max: scale,
    bars: PHASES().map(([key, name]) => ({ label: name, value: scenario ? scenario.cost[key] : null, current: false, mark: '' })),
    totals: [
      { label: tr('Operações no total', 'Operations in total'), value: scenario ? totalOf(scenario.cost) : 0, note: tr('n + maior em cada fase', 'n + largest in each phase') },
      { label: tr('Posições de count', 'Positions of count'), value: scenario ? scenario.maior + 1 : 0, note: tr('maior + 1', 'largest + 1') },
    ],
    final,
  });
  const steps = [
    step(values, 0, tr('n e o maior valor', 'n and the largest value'), tr(`Seu vetor tem n = ${n} e maior = ${maior}. O Counting Sort faz cinco fases: achar o maior (n − 1), criar count (maior + 1), contar (n), varrer count (maior + 1) e reescrever A (n). Vamos aumentar só o maior valor e deixar n como está.`, `Your array has n = ${n} and largest = ${maior}. Counting Sort has five phases: finding the largest (n − 1), creating count (largest + 1), counting (n), scanning count (largest + 1) and rewriting A (n). We will increase only the largest value and leave n as it is.`), 'neutral', { chart: frame(null), variables: { n, maior }, lanes: [] }),
  ];
  scenarios.forEach((scenario, index) => {
    const total = totalOf(scenario.cost);
    steps.push(step(scenario.values, 1, scenario.label, index === 0
      ? tr(`Com maior = ${scenario.maior}, as fases que passam por count custam ${scenario.maior + 1} e as que passam por A custam cerca de n = ${n}. Total: ${total} operações. Quando maior é da ordem de n, o custo é linear.`, `With largest = ${scenario.maior}, the phases that go through count cost ${scenario.maior + 1} and those that go through A cost about n = ${n}. Total: ${total} operations. When largest is of the order of n, the cost is linear.`)
      : tr(`O mesmo n = ${n}, mas com maior = ${scenario.maior}: count agora tem ${scenario.maior + 1} posições. Criar e varrer count custam ${scenario.maior + 1} cada, o total sobe para ${total} e quase tudo é trabalho no vetor auxiliar. É a desvantagem do Counting Sort: o vetor auxiliar pode ficar enorme.`, `The same n = ${n}, but with largest = ${scenario.maior}: count now has ${scenario.maior + 1} positions. Creating and scanning count cost ${scenario.maior + 1} each, the total rises to ${total} and almost everything is work on the auxiliary array. It is the disadvantage of Counting Sort: the auxiliary array can become huge.`), index === 0 ? 'comparison' : 'warning', { chart: frame(scenario), variables: { n, maior: scenario.maior }, lanes: [] }));
  });
  const last = scenarios.at(-1);
  steps.push(step(values, SIMPLE_CODE.length - 1 - FIND_CODE.length - 1, tr('Linear em n + maior', 'Linear in n + largest'), tr(`Operações: ${scenarios.map((scenario) => totalOf(scenario.cost)).join(' · ')}. O custo é o mesmo em todos os casos (O(n + maior)): não existe melhor nem pior caso, só um maior valor que pode ser pequeno ou enorme. Dobrar n dobra o tempo; multiplicar o maior valor por 10 multiplica por 10 o tempo e a memória de count.`, `Operations: ${scenarios.map((scenario) => totalOf(scenario.cost)).join(' · ')}. The cost is the same in all cases (O(n + largest)): there is no best or worst case, only a largest value that can be small or huge. Doubling n doubles the time; multiplying the largest value by 10 multiplies the time and memory of count by 10.`), 'done', {
    chart: frame(last, true), variables: { n, maior: last.maior }, lanes: [], output: scenarios.map((scenario) => tr(`${scenario.label}: ${totalOf(scenario.cost)} operações, count com ${scenario.maior + 1} posições`, `${scenario.label}: ${totalOf(scenario.cost)} operations, count with ${scenario.maior + 1} positions`)),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Adaptabilidade
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const scenarios = adaptabilityScenarios(values).map((scenario) => ({ ...scenario, run: runCounting(toItems(scenario.values)) }));
  const short = [tr('Ordenado', 'Sorted'), tr('Quase', 'Almost'), tr('Inverso', 'Reverse'), tr('Seu vetor', 'Yours')];
  const maior = Math.max(...values);
  const frame = (done, final = false) => ({
    title: tr('Operações em cada vetor', 'Operations on each array'),
    hint: tr('o mesmo custo nos quatro', 'the same cost on the four'),
    max: scenarios[0].run.total,
    bars: scenarios.map((scenario, index) => ({
      label: short[index], value: index < done ? scenario.run.total : null, current: index === done - 1 && !final, mark: '',
    })),
    totals: [
      { label: tr('Operações por vetor', 'Operations per array'), value: scenarios[0].run.total, note: tr(`(n − 1) + 2 (maior + 1) + 2n = ${scenarios[0].run.total}`, `(n − 1) + 2 (largest + 1) + 2n = ${scenarios[0].run.total}`) },
      { label: tr('Vetor count', 'Count array'), value: tr('igual', 'identical'), note: tr(`${maior + 1} posições, as mesmas contagens`, `${maior + 1} positions, the same counts`) },
    ],
    final,
  });
  const steps = [
    step(values, 0, tr('Quatro vetores, os mesmos valores', 'Four arrays, the same values'), tr('O primeiro vetor já está ordenado, o segundo está quase ordenado, o terceiro está em ordem inversa e o quarto é o seu. O Counting Sort vai tratar os quatro do mesmo jeito? Cada passo executa o algoritmo inteiro em um deles.', 'The first array is already sorted, the second is almost sorted, the third is in reverse order and the fourth is yours. Will Counting Sort treat the four the same way? Each step runs the whole algorithm on one of them.'), 'neutral', { chart: frame(0), lanes: [], variables: { n, maior } }),
  ];
  scenarios.forEach((scenario, index) => {
    steps.push(step(scenario.values, 1, scenario.label, tr(`${scenario.label}: count recebe ${scenario.run.cost.count} contagens e fica com os mesmos valores dos outros vetores. Foram ${scenario.run.cost.find} comparações para o maior, ${scenario.run.cost.create} posições criadas, ${scenario.run.cost.count} contagens, ${scenario.run.cost.scan} índices varridos e ${scenario.run.cost.write} escritas: ${scenario.run.total} operações.`, `${scenario.label}: count receives ${scenario.run.cost.count} counts and ends up with the same values as the other arrays. There were ${scenario.run.cost.find} comparisons for the largest, ${scenario.run.cost.create} positions created, ${scenario.run.cost.count} counts, ${scenario.run.cost.scan} indices scanned and ${scenario.run.cost.write} writes: ${scenario.run.total} operations.`), 'comparison', { chart: frame(index + 1), sortedIndices: [], lanes: [], variables: { n, maior } }));
  });
  steps.push(step(values, 15, tr('A ordem não importa', 'The order does not matter'), tr(`As quatro execuções custam ${scenarios[0].run.total} operações. O vetor já ordenado não tem nenhuma vantagem: count só depende de quais valores existem e de quantas vezes, e o algoritmo sempre percorre A e count inteiros. O Counting Sort não é adaptável.`, `The four runs cost ${scenarios[0].run.total} operations. The already sorted array has no advantage: count only depends on which values exist and how many times, and the algorithm always goes through all of A and count. Counting Sort is not adaptive.`), 'done', {
    chart: frame(4, true), lanes: [], variables: { n, maior }, output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.run.total} operações`, `${scenario.label}: ${scenario.run.total} operations`)),
  }));
  return steps;
}

export function buildSteps(id, values) {
  switch (id) {
    case 'stable': return runStable(tagDuplicates(values), { record: true }).steps;
    case 'complexity': return complexitySteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    default: return runCounting(toItems(values), { record: true }).steps;
  }
}
