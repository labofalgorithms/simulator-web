import {
  NONE, fmt, isStable, range, step, tagDuplicates, tagsOf, toItems, valuesOf, withRepeats,
} from '../shared/sort-steps.js';
import {
  INNER_SORTS, adaptabilityScenarios, bucketIndexOf, bucketsLane, copyItems, createTrace, flippedPairs, itemLabel, maxOf, plural,
} from '../shared/linear-sort.js';
import { tr } from '../../core/i18n.js';

// Pseudocódigo da aula (slide 8, linhas 01 a 27 com a mesma numeração): acha o maior valor, cria os
// buckets, distribui cada elemento pelo bucket (A[i] × numBuckets) / (max + 1), ordena cada bucket e
// recombina os buckets no vetor. A aula escreve as linhas com recuo e fecha só com `end`.
const CODE = [
  tr('FUNÇÃO bucketSort(A, numBuckets)', 'FUNCTION bucketSort(A, numBuckets)'),
  tr('  SE tamanho de A <= 0 ENTÃO', '  IF size of A <= 0 THEN'),
  tr('    RETORNA', '    RETURN'),
  tr('  // Encontra o maior número no vetor A', '  // Finds the largest number in array A'),
  tr('  max ← A[0]', '  max ← A[0]'),
  tr('  PARA i DE 1 ATÉ tamanho de A - 1 FAÇA', '  FOR i FROM 1 TO size of A - 1 DO'),
  tr('    SE A[i] > max ENTÃO', '    IF A[i] > max THEN'),
  tr('      max ← A[i]', '      max ← A[i]'),
  tr('  // Cria numBuckets buckets vazios (listas)', '  // Creates numBuckets empty buckets (lists)'),
  tr('  buckets ← vetor de listas de tamanho numBuckets', '  buckets ← array of lists of size numBuckets'),
  tr('  PARA i DE 0 ATÉ numBuckets - 1 FAÇA', '  FOR i FROM 0 TO numBuckets - 1 DO'),
  tr('    buckets[i] ← lista vazia', '    buckets[i] ← empty list'),
  tr('  // Distribui os elementos de A nos buckets', '  // Distributes the elements of A into the buckets'),
  tr('  PARA i DE 0 ATÉ tamanho de A - 1 FAÇA', '  FOR i FROM 0 TO size of A - 1 DO'),
  tr('    bucketIndex ← piso((A[i] * numBuckets) / (max + 1))', '    bucketIndex ← floor((A[i] * numBuckets) / (max + 1))'),
  tr('    buckets[bucketIndex].adiciona(A[i])', '    buckets[bucketIndex].add(A[i])'),
  tr('  // Ordena cada bucket individualmente', '  // Sorts each bucket individually'),
  tr('  PARA i DE 0 ATÉ numBuckets - 1 FAÇA', '  FOR i FROM 0 TO numBuckets - 1 DO'),
  tr('    // Usa algum algoritmo de ordenação, como Insertion Sort ou outro', '    // Uses some sorting algorithm, such as Insertion Sort or another'),
  tr('    ordena(buckets[i])', '    sort(buckets[i])'),
  tr('  // Recombina os elementos dos buckets de volta no vetor A', '  // Merges the elements of the buckets back into array A'),
  tr('  pos ← 0', '  pos ← 0'),
  tr('  PARA i DE 0 ATÉ numBuckets - 1 FAÇA', '  FOR i FROM 0 TO numBuckets - 1 DO'),
  tr('    PARA CADA elemento EM buckets[i] FAÇA', '    FOR EACH element IN buckets[i] DO'),
  tr('      A[pos] ← elemento', '      A[pos] ← element'),
  tr('      pos ← pos + 1', '      pos ← pos + 1'),
  tr('FIM', 'END'),
];

// Linhas do pseudocódigo (base 0).
const L = {
  head: 0, empty: 1, ret: 2, max: 4, loopMax: 5, ifMax: 6, setMax: 7, make: 9, loopMake: 10, setEmpty: 11, loopDist: 13, index: 14, add: 15, loopSort: 17, sort: 19, pos: 21, loopOut: 22, each: 23, put: 24, inc: 25, end: 26,
};

export const algorithms = [
  {
    id: 'bucket', title: tr('Bucket Sort', 'Bucket Sort'), menuLabel: tr('Bucket Sort', 'Bucket Sort'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Espalhe os valores em listas (os buckets) pela fórmula (A[i] × numBuckets) / (max + 1), ordene cada lista e junte todas de volta no vetor, na ordem dos buckets.', 'Spread the values into lists (the buckets) with the formula (A[i] × numBuckets) / (max + 1), sort each list and merge them all back into the array, in the order of the buckets.'),
    interaction: tr('Mude o número de buckets e veja a fórmula levar cada valor para um bucket diferente. Clique em uma célula do vetor para inspecioná-la.', 'Change the number of buckets and watch the formula take each value to a different bucket. Click an array cell to inspect it.'),
    complexity: { time: 'O(n + k)', space: 'O(n + k)', note: tr('Cada laço passa uma vez pelos n elementos ou pelos k buckets, e o custo de ordenar os buckets depende de como os valores se distribuem. Os buckets e as listas guardam os n elementos de novo: espaço extra O(n + k).', 'Each loop goes once over the n elements or the k buckets, and the cost of sorting the buckets depends on how the values are distributed. The buckets and lists hold the n elements again: extra space O(n + k).') },
    pseudocode: CODE,
  },
  {
    id: 'complexity', title: tr('Melhor e pior caso', 'Best and worst case'), menuLabel: tr('Complexidade de tempo', 'Time complexity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '02',
    description: tr('Compare três vetores do mesmo tamanho: valores bem espalhados (um por bucket), o seu vetor e valores todos apertados em um único bucket. O custo vai de O(n + k) a O(n²).', 'Compare three arrays of the same size: well spread values (one per bucket), your array and values all squeezed into a single bucket. The cost goes from O(n + k) to O(n²).'),
    interaction: tr('Mude o número de buckets: com poucos buckets a lista de cada um cresce, com muitos sobram buckets vazios. O que decide o custo é o tamanho do maior bucket, não o tamanho do vetor.', 'Change the number of buckets: with few buckets the list of each one grows, with many there are empty buckets left. What decides the cost is the size of the largest bucket, not the size of the array.'),
    complexity: { time: 'O(n + k) … O(n²)', space: 'O(n + k)', note: tr('Melhor e médio caso: os valores se espalham e cada bucket fica com poucos elementos, então ordenar todos custa O(n) e o total é O(n + k). Pior caso: todos caem no mesmo bucket e o Insertion Sort faz cerca de n² / 2 comparações: O(n²).', 'Best and average case: the values spread out and each bucket ends up with few elements, so sorting them all costs O(n) and the total is O(n + k). Worst case: all fall in the same bucket and Insertion Sort makes about n² / 2 comparisons: O(n²).') },
    pseudocode: CODE,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '03',
    description: tr('Rode o algoritmo em quatro vetores com os mesmos valores em ordens diferentes. O Bucket Sort se adapta à distribuição dos valores, mas não aproveita uma ordem que já existe.', 'Run the algorithm on four arrays with the same values in different orders. Bucket Sort adapts to the distribution of the values, but does not take advantage of an order that already exists.'),
    interaction: tr('Compare as barras: distribuir e juntar custam o mesmo nos quatro vetores. Só o Insertion Sort dentro dos buckets muda um pouco o total.', 'Compare the bars: distributing and merging cost the same on the four arrays. Only the Insertion Sort inside the buckets changes the total a little.'),
    complexity: { time: 'O(n + k)', space: 'O(n + k)', note: tr('Os mesmos valores caem nos mesmos buckets em qualquer ordem inicial. Distribuir e recombinar sempre passam por todos os elementos, mesmo que o vetor já esteja ordenado: o Bucket Sort não é adaptável à ordem.', 'The same values fall in the same buckets in any initial order. Distributing and merging always go through every element, even if the array is already sorted: Bucket Sort is not adaptive to order.') },
    pseudocode: CODE,
  },
  {
    id: 'stability', title: tr('Estabilidade', 'Stability'), menuLabel: tr('Estabilidade', 'Stability'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '04',
    description: tr('Valores repetidos recebem uma letra que marca a ordem original. A estabilidade do Bucket Sort é a do algoritmo que ordena os buckets: com Insertion Sort ele é estável, com Selection Sort não.', 'Repeated values get a letter that marks the original order. The stability of Bucket Sort is that of the algorithm that sorts the buckets: with Insertion Sort it is stable, with Selection Sort it is not.'),
    interaction: tr('Troque o algoritmo dos buckets e use "Gerar exemplo": o Selection Sort troca posições distantes e pode passar um valor para o outro lado de um igual.', 'Switch the algorithm of the buckets and use "Generate example": Selection Sort swaps distant positions and can carry a value to the other side of an equal.'),
    complexity: { time: 'O(n + k)', space: 'O(n + k)', note: tr('Distribuir e recombinar mantêm a ordem em que os elementos chegam a cada bucket (cada um entra no fim da lista). Então tudo depende de ordenar o bucket: um algoritmo estável (Insertion Sort, Merge Sort) preserva os iguais; um instável (Quick Sort, Selection Sort) pode invertê-los.', 'Distributing and merging keep the order in which the elements arrive at each bucket (each one enters at the end of the list). So everything depends on sorting the bucket: a stable algorithm (Insertion Sort, Merge Sort) preserves the equals; an unstable one (Quick Sort, Selection Sort) can reverse them.') },
    pseudocode: CODE,
  },
];

const INDEX_NOTE = tr('buckets[i] guarda os elementos de A que caem na faixa i', 'buckets[i] holds the elements of A that fall in range i');

/** A conta do slide (600 / 201 = 2,98): o quociente cortado (não arredondado) em duas casas, para 200 / 201 não virar 1. */
const ratioText = (value, numBuckets, max) => `(${value} × ${numBuckets}) / (${max} + 1) = ${value * numBuckets} / ${max + 1} = ${fmt(Math.floor(((value * numBuckets) / (max + 1)) * 100) / 100)}`;

/**
 * O Bucket Sort da aula sobre `source` (itens `{ v, tag }`). Com `record` monta os passos, uma linha
 * do pseudocódigo por passo; sem ele só executa, para as análises. `inner` escolhe o algoritmo que
 * ordena cada bucket. Devolve também o custo de cada fase e o tamanho e o custo de cada bucket.
 */
export function runBucket(source, numBuckets, { record = false, inner = 'insertion' } = {}) {
  const a = copyItems(source);
  const n = a.length;
  const { steps, at } = createTrace(record);
  const buckets = Array.from({ length: numBuckets }, () => null);
  const sortedBuckets = [];
  const cost = {
    find: 0, create: 0, distribute: 0, comparisons: 0, moves: 0, collect: 0,
  };
  const bucketCosts = Array.from({ length: numBuckets }, () => 0);
  const v = {
    numBuckets, max: NONE, i: NONE, bucketIndex: NONE, pos: NONE,
  };
  const emit = (line, title, description, tone, { lane = {}, ...extra } = {}) => at(valuesOf(a), line, title, description, tone, {
    tags: tagsOf(a),
    lanes: [bucketsLane(tr('buckets (vetor de listas)', 'buckets (array of lists)'), buckets, { sorted: sortedBuckets, hint: INDEX_NOTE, ...lane })],
    variables: { ...v },
    ...extra,
  });
  const phase = (label, text, code = false) => ({ label, text, code });
  const bucketWord = (count) => plural(count, 'bucket', 'buckets');

  emit(L.head, tr('Vetor e buckets', 'Array and buckets'), tr(`Vamos ordenar o vetor com ${bucketWord(numBuckets)}. O Bucket Sort espalha os valores em listas (os buckets), ordena cada lista e junta tudo de volta, na ordem dos buckets.`, `We will sort the array with ${bucketWord(numBuckets)}. Bucket Sort spreads the values into lists (the buckets), sorts each list and merges everything back, in the order of the buckets.`), 'neutral');
  emit(L.empty, tr('Vetor vazio?', 'Empty array?'), tr(`O vetor tem ${plural(n, 'elemento', 'elementos')}: tamanho de A <= 0 é falso e o algoritmo continua.`, `The array has ${plural(n, 'element', 'elements')}: size of A <= 0 is false and the algorithm goes on.`), 'comparison');

  // Passo 1: o maior valor.
  let max = a[0].v;
  v.max = max;
  cost.find = 0;
  emit(L.max, tr('max ← A[0]', 'max ← A[0]'), tr(`O primeiro valor, ${max}, é o maior visto até agora. A fórmula do bucket precisa de max para saber onde acaba a faixa de valores.`, `The first value, ${max}, is the largest seen so far. The bucket formula needs max to know where the range of values ends.`), 'neutral', { foundIndices: [0], pointers: { i: 0 }, phase: phase(tr('Maior valor', 'Largest value'), `max = ${max}`, true) });
  for (let i = 1; i < n; i += 1) {
    v.i = i;
    emit(L.loopMax, tr(`i = ${i}`, `i = ${i}`), tr(`O laço olha a posição ${i}: A[${i}] = ${a[i].v}.`, `The loop looks at position ${i}: A[${i}] = ${a[i].v}.`), 'comparison', { pointers: { i }, foundIndices: [range(n).find((k) => a[k].v === max)] });
    const bigger = a[i].v > max;
    cost.find += 1;
    emit(L.ifMax, tr('A[i] > max?', 'A[i] > max?'), tr(`${a[i].v} > ${max}? ${bigger ? 'Sim, é o novo maior valor.' : 'Não, max continua o mesmo.'}`, `${a[i].v} > ${max}? ${bigger ? 'Yes, it is the new largest value.' : 'No, max stays the same.'}`), 'comparison', {
      pointers: { i }, comparedIndices: [i], compare: { left: { label: 'A[i]', value: a[i].v }, op: '>', right: { label: 'max', value: max }, result: bigger },
    });
    if (bigger) {
      max = a[i].v;
      v.max = max;
      emit(L.setMax, tr('max ← A[i]', 'max ← A[i]'), tr(`max passa a valer ${max}.`, `max now holds ${max}.`), 'neutral', { pointers: { i }, foundIndices: [i] });
    }
  }
  v.i = NONE;

  // Passo 2: os buckets.
  emit(L.make, tr('Cria o vetor de listas', 'Creates the array of lists'), tr(`buckets é um vetor de ${bucketWord(numBuckets)}. Cada posição ainda não tem lista: é nula.`, `buckets is an array of ${bucketWord(numBuckets)}. Each position has no list yet: it is null.`), 'neutral', { phase: phase(tr('Buckets', 'Buckets'), `numBuckets = ${numBuckets}`, true) });
  for (let i = 0; i < numBuckets; i += 1) {
    v.i = i;
    emit(L.loopMake, `i = ${i}`, tr(`O laço vai criar a lista do bucket ${i}.`, `The loop will create the list of bucket ${i}.`), 'comparison', { lane: { active: i } });
    buckets[i] = [];
    cost.create += 1;
    emit(L.setEmpty, tr(`buckets[${i}] ← lista vazia`, `buckets[${i}] ← empty list`), tr(`O bucket ${i} agora existe e está vazio.`, `Bucket ${i} now exists and is empty.`), 'neutral', { lane: { active: i } });
  }

  // Passo 3: a distribuição.
  for (let i = 0; i < n; i += 1) {
    v.i = i;
    emit(L.loopDist, `i = ${i}`, tr(`O laço pega A[${i}] = ${a[i].v}.`, `The loop takes A[${i}] = ${a[i].v}.`), 'comparison', { pointers: { i }, activeIndices: [i] });
    const index = bucketIndexOf(a[i].v, numBuckets, max);
    v.bucketIndex = index;
    emit(L.index, tr(`bucketIndex = ${index}`, `bucketIndex = ${index}`), tr(`${ratioText(a[i].v, numBuckets, max)}, e o piso é ${index}. O valor ${a[i].v} vai para o bucket ${index}.`, `${ratioText(a[i].v, numBuckets, max)}, and the floor is ${index}. The value ${a[i].v} goes to bucket ${index}.`), 'comparison', {
      pointers: { i }, activeIndices: [i], lane: { active: index }, phase: phase('bucketIndex', `${ratioText(a[i].v, numBuckets, max)} → ${tr('piso', 'floor')} ${index}`, true),
    });
    buckets[index].push({ ...a[i], state: 'fresh' });
    cost.distribute += 1;
    emit(L.add, tr(`buckets[${index}].adiciona(${a[i].v})`, `buckets[${index}].add(${a[i].v})`), tr(`${a[i].v} entra no fim da lista do bucket ${index}, que agora tem ${plural(buckets[index].length, 'elemento', 'elementos')}.`, `${a[i].v} enters the end of the list of bucket ${index}, which now has ${plural(buckets[index].length, 'element', 'elements')}.`), 'neutral', { pointers: { i }, activeIndices: [i], lane: { active: index } });
    buckets[index][buckets[index].length - 1].state = '';
  }
  v.i = NONE;
  v.bucketIndex = NONE;

  // Passo 4: ordena cada bucket.
  const sortList = INNER_SORTS[inner].run;
  for (let i = 0; i < numBuckets; i += 1) {
    v.i = i;
    emit(L.loopSort, `i = ${i}`, tr(`O laço chega ao bucket ${i}, com ${plural(buckets[i].length, 'elemento', 'elementos')}.`, `The loop reaches bucket ${i}, with ${plural(buckets[i].length, 'element', 'elements')}.`), 'comparison', { lane: { active: i } });
    const before = buckets[i];
    const result = sortList(before);
    buckets[i] = result.list;
    cost.comparisons += result.comparisons;
    cost.moves += result.moves;
    bucketCosts[i] = result.comparisons;
    sortedBuckets.push(i);
    const name = INNER_SORTS[inner].name;
    emit(L.sort, tr(`ordena(buckets[${i}])`, `sort(buckets[${i}])`), before.length < 2
      ? tr(`O bucket ${i} tem ${before.length === 0 ? 'nenhum elemento' : 'um só elemento'}: não há o que ordenar.`, `Bucket ${i} has ${before.length === 0 ? 'no elements' : 'a single element'}: there is nothing to sort.`)
      : tr(`O ${name} ordena o bucket ${i}: [${before.map(itemLabel).join(', ')}] vira [${result.list.map(itemLabel).join(', ')}], com ${plural(result.comparisons, 'comparação', 'comparações')}. Os buckets são pequenos, então esse custo é baixo.`, `${name} sorts bucket ${i}: [${before.map(itemLabel).join(', ')}] becomes [${result.list.map(itemLabel).join(', ')}], with ${plural(result.comparisons, 'comparison', 'comparisons')}. The buckets are small, so this cost is low.`), 'neutral', { lane: { active: i }, phase: phase(tr('Ordenar o bucket', 'Sort the bucket'), `${name}: ${result.comparisons} ${tr('comparações', 'comparisons')}`) });
  }
  v.i = NONE;

  // Passo 5: recombina.
  let pos = 0;
  v.pos = 0;
  emit(L.pos, 'pos ← 0', tr('pos aponta para a próxima posição livre de A. Vamos copiar os buckets, do 0 ao último, de volta para o vetor.', 'pos points to the next free position of A. We will copy the buckets, from 0 to the last, back into the array.'), 'neutral', { pointers: { pos: 0 } });
  for (let i = 0; i < numBuckets; i += 1) {
    v.i = i;
    emit(L.loopOut, `i = ${i}`, tr(`O laço chega ao bucket ${i}.`, `The loop reaches bucket ${i}.`), 'comparison', { pointers: { pos }, lane: { active: i }, sortedIndices: range(pos) });
    if (buckets[i].length === 0) {
      emit(L.each, tr('Bucket vazio', 'Empty bucket'), tr(`O bucket ${i} está vazio: o PARA CADA não executa nenhuma volta.`, `Bucket ${i} is empty: the FOR EACH makes no turns.`), 'comparison', { pointers: { pos }, lane: { active: i }, sortedIndices: range(pos) });
    }
    buckets[i].forEach((item, k) => {
      item.state = 'active';
      emit(L.each, tr(`elemento = ${item.v}`, `element = ${item.v}`), tr(`O PARA CADA lê o ${k + 1}º elemento do bucket ${i}: ${item.v}.`, `The FOR EACH reads element ${k + 1} of bucket ${i}: ${item.v}.`), 'comparison', { pointers: { pos }, lane: { active: i }, sortedIndices: range(pos) });
      a[pos] = { ...item, state: undefined };
      cost.collect += 1;
      emit(L.put, tr(`A[${pos}] ← ${item.v}`, `A[${pos}] ← ${item.v}`), tr(`${item.v} é copiado para A[${pos}].`, `${item.v} is copied to A[${pos}].`), 'neutral', { pointers: { pos }, lane: { active: i }, changedIndices: [pos], sortedIndices: range(pos + 1) });
      pos += 1;
      v.pos = pos;
      item.state = 'done';
      emit(L.inc, tr(`pos ← ${pos}`, `pos ← ${pos}`), tr(`pos avança para ${pos}.`, `pos moves on to ${pos}.`), 'neutral', { pointers: { pos: Math.min(pos, n - 1) }, lane: { active: i }, sortedIndices: range(pos) });
    });
  }
  v.i = NONE;
  const total = cost.find + cost.create + cost.distribute + cost.comparisons + cost.collect;
  emit(L.end, tr('Vetor ordenado', 'Array sorted'), tr(`O vetor está ordenado: ${valuesOf(a).join(', ')}. Custo: ${n - 1} comparações para o maior valor, ${numBuckets} buckets criados, ${n} elementos distribuídos, ${cost.comparisons} comparações dentro dos buckets e ${n} cópias de volta.`, `The array is sorted: ${valuesOf(a).join(', ')}. Cost: ${n - 1} comparisons for the largest value, ${numBuckets} buckets created, ${n} elements distributed, ${cost.comparisons} comparisons inside the buckets and ${n} copies back.`), 'done', {
    sortedIndices: range(n), output: [tr(`Vetor ordenado: ${valuesOf(a).join(' ')}`, `Sorted array: ${valuesOf(a).join(' ')}`), tr(`Tamanho dos buckets: ${buckets.map((b) => b.length).join(' ')}`, `Bucket sizes: ${buckets.map((b) => b.length).join(' ')}`)],
  });

  return {
    steps, final: a, cost, total, max, buckets, sizes: buckets.map((bucket) => bucket.length), bucketCosts,
  };
}

/** O esqueleto de um passo das análises: `step()` sem texto, com o resto vindo por cima. */
const base = (values) => step(values, 0, '', '', 'neutral', { lanes: [] });

// ---------------------------------------------------------------------------
// 02 · Melhor e pior caso
// ---------------------------------------------------------------------------

/** Os três vetores do mesmo tamanho: um por bucket, o do aluno e todos (menos um) apertados no bucket 0. */
export function caseVectors(values) {
  const n = values.length;
  return [
    { key: 'best', label: tr('Bem espalhado', 'Well spread'), values: range(n).map((i) => Math.round((i * 99) / Math.max(1, n - 1))) },
    { key: 'yours', label: tr('Seu vetor', 'Your array'), values: [...values] },
    { key: 'worst', label: tr('Concentrado', 'Squeezed'), values: [...range(n - 1).map((i) => n - 1 - i), 999] },
  ];
}

function complexitySteps(values, numBuckets) {
  const n = values.length;
  const scenarios = caseVectors(values).map((scenario) => ({ ...scenario, run: runBucket(toItems(scenario.values), numBuckets) }));
  const bound = (n * (n - 1)) / 2;
  const chart = (run, final = false, current = false) => ({
    title: tr('Elementos em cada bucket', 'Elements in each bucket'),
    hint: tr('à direita: comparações do Insertion Sort', 'on the right: comparisons of Insertion Sort'),
    max: Math.max(1, n),
    bars: (run ? run.sizes : Array.from({ length: numBuckets }, () => null)).map((size, index) => ({
      label: `bucket ${index}`, value: size, current, mark: run ? String(run.bucketCosts[index]) : '',
    })),
    totals: [
      { label: tr('Comparações nos buckets', 'Comparisons in the buckets'), value: run ? run.cost.comparisons : 0, note: tr(`pior caso: n(n−1)/2 = ${bound}`, `worst case: n(n−1)/2 = ${bound}`) },
      { label: tr('Operações no total', 'Operations in total'), value: run ? run.total : 0, note: tr(`n + k = ${n + numBuckets} de base`, `n + k = ${n + numBuckets} as a base`) },
    ],
    final,
  });
  const steps = [
    step(values, L.head, tr('Três vetores, o mesmo tamanho', 'Three arrays, the same size'), tr(`Com ${plural(numBuckets, 'bucket', 'buckets')} e ${n} valores, o custo do Bucket Sort muda conforme a distribuição. Vamos executar o algoritmo em um vetor bem espalhado, no seu vetor e em um vetor em que quase todos os valores caem no mesmo bucket.`, `With ${plural(numBuckets, 'bucket', 'buckets')} and ${n} values, the cost of Bucket Sort changes with the distribution. We will run the algorithm on a well spread array, on your array and on an array where almost all the values fall in the same bucket.`), 'neutral', { lanes: [], chart: chart(null) }),
  ];
  scenarios.forEach((scenario) => {
    const { run } = scenario;
    const biggest = Math.max(...run.sizes);
    steps.push({
      ...base(scenario.values),
      line: L.sort,
      title: scenario.label,
      description: scenario.key === 'worst'
        ? tr(`Todos os valores, menos o maior (999), são pequenos e caem no bucket 0: ele fica com ${biggest} elementos, em ordem inversa. O Insertion Sort faz ${run.cost.comparisons} comparações, quase n² / 2 (${bound}). O total é ${run.total} operações: O(n²).`, `All the values, except the largest (999), are small and fall in bucket 0: it ends up with ${biggest} elements, in reverse order. Insertion Sort makes ${run.cost.comparisons} comparisons, almost n² / 2 (${bound}). The total is ${run.total} operations: O(n²).`)
        : scenario.key === 'best'
          ? tr(`Os valores estão espalhados pela faixa de 0 a 99 e o maior bucket tem ${biggest} ${biggest === 1 ? 'elemento' : 'elementos'}. Ordenar os buckets custa só ${run.cost.comparisons} comparações. O total é ${run.total} operações: O(n + k).`, `The values are spread over the range 0 to 99 and the largest bucket has ${biggest} ${biggest === 1 ? 'element' : 'elements'}. Sorting the buckets costs only ${run.cost.comparisons} comparisons. The total is ${run.total} operations: O(n + k).`)
          : tr(`No seu vetor o maior bucket tem ${biggest} ${biggest === 1 ? 'elemento' : 'elementos'} e os buckets custam ${run.cost.comparisons} comparações. O total é ${run.total} operações.`, `In your array the largest bucket has ${biggest} ${biggest === 1 ? 'element' : 'elements'} and the buckets cost ${run.cost.comparisons} comparisons. The total is ${run.total} operations.`),
      tone: scenario.key === 'worst' ? 'warning' : 'comparison',
      lanes: [bucketsLane(tr('buckets depois de ordenar', 'buckets after sorting'), run.buckets.map((items) => items.map((item) => ({ ...item, state: '' }))), { sorted: range(numBuckets), hint: tr('o maior bucket decide o custo', 'the largest bucket decides the cost') })],
      variables: { numBuckets, max: run.max, 'comparações': run.cost.comparisons },
      chart: chart(run, false, true),
      output: [],
    });
  });
  const totals = scenarios.map((scenario) => scenario.run.total);
  steps.push({
    ...base(values), line: L.end, title: tr('O maior bucket decide', 'The largest bucket decides'), tone: 'done', lanes: [],
    description: tr(`Operações no total: ${totals.join(' · ')} (bem espalhado · seu vetor · concentrado). O mesmo algoritmo, com o mesmo n, vai de O(n + k) a O(n²) só por causa da distribuição. Por isso a fórmula do bucket e a escolha de k importam.`, `Operations in total: ${totals.join(' · ')} (well spread · your array · squeezed). The same algorithm, with the same n, goes from O(n + k) to O(n²) just because of the distribution. That is why the bucket formula and the choice of k matter.`),
    chart: chart(scenarios[2].run, true),
    output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.run.total} operações (${scenario.run.cost.comparisons} nos buckets)`, `${scenario.label}: ${scenario.run.total} operations (${scenario.run.cost.comparisons} in the buckets)`)),
  });
  return steps;
}

// ---------------------------------------------------------------------------
// 03 · Adaptabilidade
// ---------------------------------------------------------------------------

function adaptabilitySteps(values, numBuckets) {
  const n = values.length;
  const scenarios = adaptabilityScenarios(values).map((scenario) => ({ ...scenario, run: runBucket(toItems(scenario.values), numBuckets) }));
  const short = [tr('Ordenado', 'Sorted'), tr('Quase', 'Almost'), tr('Inverso', 'Reverse'), tr('Seu vetor', 'Yours')];
  const biggest = Math.max(...scenarios.flatMap((scenario) => scenario.run.sizes));
  const frame = (done, final = false) => ({
    title: tr('Operações em cada vetor', 'Operations on each array'),
    hint: tr('à direita: comparações nos buckets', 'on the right: comparisons in the buckets'),
    max: Math.max(...scenarios.map((scenario) => scenario.run.total)),
    bars: scenarios.map((scenario, index) => ({
      label: short[index], value: index < done ? scenario.run.total : null, current: index === done - 1 && !final, mark: index < done ? String(scenario.run.cost.comparisons) : '',
    })),
    totals: [
      { label: tr('Distribuir + juntar', 'Distribute + merge'), value: 2 * n, note: tr('igual nos quatro vetores', 'the same on the four arrays') },
      { label: tr('Dentro dos buckets', 'Inside the buckets'), value: done ? scenarios.slice(0, done).map((scenario) => scenario.run.cost.comparisons).join(' · ') : '—', note: tr('comparações do Insertion Sort', 'Insertion Sort comparisons') },
    ],
    final,
  });
  const common = (extra) => ({ lanes: [], variables: { numBuckets }, output: [], ...extra });
  const steps = [
    common({
      values: [...values], line: L.head, title: tr('Quatro vetores, os mesmos valores', 'Four arrays, the same values'), tone: 'neutral', chart: frame(0),
      description: tr(`O primeiro vetor já está ordenado, o segundo está quase ordenado, o terceiro está em ordem inversa e o quarto é o seu. Com ${plural(numBuckets, 'bucket', 'buckets')}, o Bucket Sort vai tratar os quatro do mesmo jeito? Cada passo executa o algoritmo inteiro em um deles.`, `The first array is already sorted, the second is almost sorted, the third is in reverse order and the fourth is yours. With ${plural(numBuckets, 'bucket', 'buckets')}, will Bucket Sort treat the four the same way? Each step runs the whole algorithm on one of them.`),
    }),
  ];
  scenarios.forEach((scenario, index) => {
    const { run } = scenario;
    steps.push(common({
      values: [...scenario.values], line: L.sort, title: scenario.label, tone: 'comparison', chart: frame(index + 1),
      sortedIndices: range(n),
      lanes: [bucketsLane(tr('buckets depois de ordenar', 'buckets after sorting'), run.buckets.map((items) => items.map((item) => ({ ...item, state: '' }))), { sorted: range(numBuckets), hint: tr('os mesmos valores nos mesmos buckets', 'the same values in the same buckets') })],
      description: tr(`${scenario.label}: ${run.cost.find} comparações para o maior valor, ${run.cost.distribute} elementos distribuídos, ${run.cost.comparisons} comparações dentro dos buckets e ${run.cost.collect} cópias de volta. Total: ${run.total} operações. Os tamanhos dos buckets são ${run.sizes.join(' ')}.`, `${scenario.label}: ${run.cost.find} comparisons for the largest value, ${run.cost.distribute} elements distributed, ${run.cost.comparisons} comparisons inside the buckets and ${run.cost.collect} copies back. Total: ${run.total} operations. The bucket sizes are ${run.sizes.join(' ')}.`),
      variables: { numBuckets, max: run.max, 'comparações': run.cost.comparisons },
    }));
  });
  const totals = scenarios.map((scenario) => scenario.run.total);
  const spread = Math.max(...totals) - Math.min(...totals);
  steps.push(common({
    values: [...values], line: L.end, title: tr('Só a distribuição importa', 'Only the distribution matters'), tone: 'done', chart: frame(4, true),
    description: tr(`Operações: ${totals.join(' · ')}. A diferença entre o mais barato e o mais caro é de apenas ${plural(spread, 'operação', 'operações')}, e vem só do Insertion Sort dentro dos buckets (o maior bucket tem ${biggest} elementos). Distribuir e juntar custam o mesmo em qualquer ordem: o Bucket Sort se adapta à distribuição dos valores, não à ordem que já existe.`, `Operations: ${totals.join(' · ')}. The difference between the cheapest and the most expensive is only ${plural(spread, 'operation', 'operations')}, and it comes only from Insertion Sort inside the buckets (the largest bucket has ${biggest} elements). Distributing and merging cost the same in any order: Bucket Sort adapts to the distribution of the values, not to the order that already exists.`),
    output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.run.total} operações, ${scenario.run.cost.comparisons} nos buckets`, `${scenario.label}: ${scenario.run.total} operations, ${scenario.run.cost.comparisons} in the buckets`)),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Estabilidade
// ---------------------------------------------------------------------------

/** Um vetor com valores repetidos em que o Selection Sort dentro do bucket inverte dois iguais. */
export function stabilityExample(count, numBuckets) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const values = withRepeats(count);
    const { final } = runBucket(tagDuplicates(values), numBuckets, { inner: 'selection' });
    if (!isStable(final)) return values;
  }
  return [52, 56, 52, 51, 20, 20, 77, 31].slice(0, Math.max(4, Math.min(count, 8)));
}

function stabilitySteps(values, numBuckets, inner) {
  const n = values.length;
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const { name, stable: innerStable, run } = INNER_SORTS[inner];
  const max = maxOf(items);
  const buckets = Array.from({ length: numBuckets }, () => []);
  const sortedBuckets = [];
  const log = [];
  let flipped = 0;
  const lanes = (active = null) => [bucketsLane(tr('buckets (vetor de listas)', 'buckets (array of lists)'), buckets, { active, sorted: sortedBuckets, hint: INDEX_NOTE })];
  const steps = [];
  const push = (line, title, description, tone, { active, ...extra } = {}) => steps.push({
    ...base(valuesOf(items)), tags: tagsOf(items), line, title, description, tone, lanes: lanes(active), variables: { numBuckets, max }, output: [...log], ...extra,
  });

  push(L.head, hasRepeated ? tr('Valores repetidos em destaque', 'Repeated values highlighted') : tr('Não há valores repetidos', 'There are no repeated values'), hasRepeated
    ? tr(`Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Os buckets serão ordenados pelo ${name}, que é ${innerStable ? 'estável' : 'instável'}. Vamos ver se a ordem dos iguais sobrevive.`, `Repeated values get a letter (a, b, …) that marks the order in which they appear. The buckets will be sorted by ${name}, which is ${innerStable ? 'stable' : 'unstable'}. Let us see whether the order of the equals survives.`)
    : tr('Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com valores repetidos.', 'Without repeated values there is no relative order to preserve. Use "Generate example" to create an array with repeated values.'), hasRepeated ? 'neutral' : 'warning');

  items.forEach((item, i) => {
    const index = bucketIndexOf(item.v, numBuckets, max);
    buckets[index].push({ ...item });
    push(L.add, tr(`${itemLabel(item)} → bucket ${index}`, `${itemLabel(item)} → bucket ${index}`), tr(`${itemLabel(item)} cai no bucket ${index} e entra no fim da lista. Quem chega primeiro fica na frente: a ordem de chegada é a ordem original.`, `${itemLabel(item)} falls in bucket ${index} and enters the end of the list. Whoever arrives first stays in front: the order of arrival is the original order.`), 'comparison', { pointers: { i }, activeIndices: [i], active: index });
  });

  buckets.forEach((bucket, i) => {
    const before = bucket;
    const result = run(before);
    buckets[i] = result.list;
    sortedBuckets.push(i);
    const pairs = flippedPairs(before, result.list);
    flipped += pairs.length;
    pairs.forEach(([x, y]) => log.push(tr(`Bucket ${i}: ${itemLabel(y)} passou à frente de ${itemLabel(x)}`, `Bucket ${i}: ${itemLabel(y)} went ahead of ${itemLabel(x)}`)));
    if (before.length < 2 && !before.length) return;
    push(L.sort, tr(`ordena(buckets[${i}])`, `sort(buckets[${i}])`), pairs.length
      ? tr(`O ${name} ordenou o bucket ${i}: ${pairs.map(([x, y]) => `${itemLabel(y)} passou à frente de ${itemLabel(x)}`).join('; ')}. Esses iguais não estão mais na ordem original: o ${name} trocou posições distantes.`, `${name} sorted bucket ${i}: ${pairs.map(([x, y]) => `${itemLabel(y)} went ahead of ${itemLabel(x)}`).join('; ')}. These equals are no longer in the original order: ${name} swapped distant positions.`)
      : tr(`O ${name} ordenou o bucket ${i}: [${before.map(itemLabel).join(', ')}] virou [${result.list.map(itemLabel).join(', ')}]. ${before.some((item) => item.tag) ? 'Os iguais continuam na ordem original.' : ''}`.trim(), `${name} sorted bucket ${i}: [${before.map(itemLabel).join(', ')}] became [${result.list.map(itemLabel).join(', ')}]. ${before.some((item) => item.tag) ? 'The equals stay in the original order.' : ''}`.trim()), pairs.length ? 'warning' : 'comparison', {
      active: i, warnIndices: pairs.length ? items.map((item, k) => (pairs.some(([x, y]) => [x, y].some((p) => p.v === item.v && p.tag === item.tag)) ? k : -1)).filter((k) => k >= 0) : [],
    });
  });

  const final = buckets.flat().map((item) => ({ v: item.v, tag: item.tag }));
  const stable = isStable(final);
  steps.push({
    ...base(valuesOf(final)), tags: tagsOf(final), line: L.end, sortedIndices: range(n), lanes: lanes(null), output: [...log, tr(`Ordem final: ${final.map(itemLabel).join(' ')}`, `Final order: ${final.map(itemLabel).join(' ')}`)],
    title: !hasRepeated ? tr('Resultado', 'Result') : stable ? tr('Resultado: ordem preservada', 'Result: order preserved') : tr('Resultado: instável', 'Result: unstable'),
    tone: !hasRepeated || stable ? 'done' : 'warning',
    description: !hasRepeated
      ? tr('O vetor não tinha valores repetidos, então não há o que comparar.', 'The array had no repeated values, so there is nothing to compare.')
      : stable
        ? tr(`Ordem final: ${final.map(itemLabel).join(' ')}. Os iguais saíram na ordem original: distribuir e recombinar não mudam a ordem de chegada, e o ${name} ${innerStable ? 'é estável' : 'não trocou nenhum par de iguais neste vetor, mas não garante isso'}. ${innerStable ? 'Com um algoritmo estável nos buckets, o Bucket Sort é estável.' : 'Use "Gerar exemplo" para ver um vetor em que a ordem se inverte.'}`, `Final order: ${final.map(itemLabel).join(' ')}. The equals came out in the original order: distributing and merging do not change the order of arrival, and ${name} ${innerStable ? 'is stable' : 'did not swap any pair of equals in this array, but does not guarantee that'}. ${innerStable ? 'With a stable algorithm in the buckets, Bucket Sort is stable.' : 'Use "Generate example" to see an array where the order is reversed.'}`)
        : tr(`Ordem final: ${final.map(itemLabel).join(' ')}. ${plural(flipped, 'par de iguais trocou', 'pares de iguais trocaram')} de ordem: o ${name} é instável, e com ele o Bucket Sort também. Com Insertion Sort ou Merge Sort nos buckets a ordem se preserva.`, `Final order: ${final.map(itemLabel).join(' ')}. ${plural(flipped, 'pair of equals swapped', 'pairs of equals swapped')} order: ${name} is unstable, and with it so is Bucket Sort. With Insertion Sort or Merge Sort in the buckets the order is preserved.`),
  });
  return steps;
}

export function buildSteps(id, values, config = {}) {
  const numBuckets = config.numBuckets ?? 10;
  switch (id) {
    case 'complexity': return complexitySteps(values, numBuckets);
    case 'adaptability': return adaptabilitySteps(values, numBuckets);
    case 'stability': return stabilitySteps(values, numBuckets, config.inner ?? 'insertion');
    default: return runBucket(toItems(values), numBuckets, { record: true }).steps;
  }
}
