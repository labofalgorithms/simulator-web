import {
  NONE, isStable, range, step, tagDuplicates, tagsOf, toItems, valuesOf,
} from '../shared/sort-steps.js';
import {
  adaptabilityScenarios, bucketsLane, copyItems, createTrace, digitCount, digitOf, itemLabel, maxOf, plural, traceFindMax, vectorLane,
} from '../shared/linear-sort.js';
import { tr } from '../../core/i18n.js';

const GETMAX_CODE = [
  tr('FUNÇÃO getMax(A)', 'FUNCTION getMax(A)'),
  tr('  maior ← A[0]', '  largest ← A[0]'),
  tr('  PARA i DE 1 ATÉ tamanho de A - 1 FAÇA', '  FOR i FROM 1 TO size of A - 1 DO'),
  tr('    SE A[i] > maior ENTÃO', '    IF A[i] > largest THEN'),
  tr('      maior ← A[i]', '      largest ← A[i]'),
  tr('  RETORNE maior', '  RETURN largest'),
  tr('FIM', 'END'),
];

// Pseudocódigo da aula (slide 9, linhas 01 a 24 com a mesma numeração). O `PARA digitoPos de 1 até
// maior / digitoPos > 0` do slide mistura o laço PARA com uma condição: vira `digitoPos ← 1` (a
// linha do comentário) e `ENQUANTO maior / digitoPos > 0`, que é o laço do código de exemplo, e
// `digitoPos ← digitoPos * 10` continua na linha 06. getMax não está nos slides: é a do código.
const RADIX_CODE = [
  tr('FUNÇÃO radixSort(A)', 'FUNCTION radixSort(A)'),
  tr('  maior ← getMax(A)  // Encontra o maior número no vetor', '  largest ← getMax(A)  // Finds the largest number in the array'),
  tr('  digitoPos ← 1  // 1 = unidades, 10 = dezenas, 100 = centenas...', '  digitPos ← 1  // 1 = units, 10 = tens, 100 = hundreds...'),
  tr('  ENQUANTO maior / digitoPos > 0 FAÇA', '  WHILE largest / digitPos > 0 DO'),
  tr('    bucketSort(A, digitoPos)  // Ordena o vetor pelo dígito atual', '    bucketSort(A, digitPos)  // Sorts the array by the current digit'),
  tr('    digitoPos ← digitoPos * 10  // Vai para o próximo dígito', '    digitPos ← digitPos * 10  // Moves to the next digit'),
  tr('FIM', 'END'),
  '',
];
const BUCKET_CODE = [
  tr('FUNÇÃO bucketSort(A, digitoPos)', 'FUNCTION bucketSort(A, digitPos)'),
  tr('  // Cria 10 buckets (listas) para os dígitos de 0 a 9', '  // Creates 10 buckets (lists) for the digits 0 to 9'),
  tr('  buckets ← vetor de listas de tamanho 10', '  buckets ← array of lists of size 10'),
  tr('  PARA i DE 0 ATÉ 9 FAÇA', '  FOR i FROM 0 TO 9 DO'),
  tr('    buckets[i] ← lista vazia', '    buckets[i] ← empty list'),
  tr('  // Distribui os elementos do vetor nos buckets pelo dígito atual', '  // Distributes the elements of the array into the buckets by the current digit'),
  tr('  PARA CADA num EM A FAÇA', '  FOR EACH num IN A DO'),
  tr('    digitoAtual ← (num / digitoPos) % 10', '    currentDigit ← (num / digitPos) % 10'),
  tr('    buckets[digitoAtual].adicionar(num)', '    buckets[currentDigit].add(num)'),
  tr('  // Junta os elementos de todos os buckets de volta no vetor original', '  // Merges the elements of all buckets back into the original array'),
  tr('  index ← 0', '  index ← 0'),
  tr('  PARA CADA bucket EM buckets FAÇA', '  FOR EACH bucket IN buckets DO'),
  tr('    PARA CADA num EM bucket FAÇA', '    FOR EACH num IN bucket DO'),
  tr('      A[index] ← num', '      A[index] ← num'),
  tr('      index ← index + 1', '      index ← index + 1'),
  tr('FIM', 'END'),
  '',
];
const BUCKET_FULL = [...RADIX_CODE, ...BUCKET_CODE, ...GETMAX_CODE];
const COUNT_CODE = [
  tr('FUNÇÃO countingSort(A, digitoPos)', 'FUNCTION countingSort(A, digitPos)'),
  tr('  n ← tamanho de A', '  n ← size of A'),
  tr('  Criar vetor saida[] com n posições', '  Create array output[] with n positions'),
  tr('  Criar vetor count[] com 10 posições, todas em 0', '  Create array count[] with 10 positions, all 0'),
  tr('  // conta as ocorrências de cada dígito', '  // counts the occurrences of each digit'),
  tr('  PARA i DE 0 ATÉ n - 1 FAÇA', '  FOR i FROM 0 TO n - 1 DO'),
  tr('    digito ← (A[i] / digitoPos) % 10', '    digit ← (A[i] / digitPos) % 10'),
  tr('    count[digito] ← count[digito] + 1', '    count[digit] ← count[digit] + 1'),
  tr('  // soma acumulada: count[d] = posição final do último dígito d, mais 1', '  // running sum: count[d] = final position of the last digit d, plus 1'),
  tr('  PARA i DE 1 ATÉ 9 FAÇA', '  FOR i FROM 1 TO 9 DO'),
  tr('    count[i] ← count[i] + count[i - 1]', '    count[i] ← count[i] + count[i - 1]'),
  tr('  // de trás para a frente, para manter a ordem dos iguais', '  // from back to front, to keep the order of the equals'),
  tr('  PARA i DE n - 1 DECRESCENDO ATÉ 0 FAÇA', '  FOR i FROM n - 1 DOWN TO 0 DO'),
  tr('    digito ← (A[i] / digitoPos) % 10', '    digit ← (A[i] / digitPos) % 10'),
  tr('    saida[count[digito] - 1] ← A[i]', '    output[count[digit] - 1] ← A[i]'),
  tr('    count[digito] ← count[digito] - 1', '    count[digit] ← count[digit] - 1'),
  tr('  PARA i DE 0 ATÉ n - 1 FAÇA', '  FOR i FROM 0 TO n - 1 DO'),
  tr('    A[i] ← saida[i]', '    A[i] ← output[i]'),
  tr('FIM', 'END'),
  '',
];
const COUNT_FULL = [
  ...RADIX_CODE.map((line, index) => (index === 4 ? tr('    countingSort(A, digitoPos)  // Ordena o vetor pelo dígito atual', '    countingSort(A, digitPos)  // Sorts the array by the current digit') : line)),
  ...COUNT_CODE, ...GETMAX_CODE,
];

// Linhas (base 0). Em RADIX_CODE: o laço, a chamada e o incremento de digitoPos.
const R = {
  head: 0, call: 1, init: 2, loop: 3, run: 4, inc: 5, end: 6,
};
const B = {
  head: 8, make: 10, lists: [11, 12], each: 14, digit: 15, add: 16, index: 18, eachBucket: 19, eachNum: 20, put: 21, next: 22, end: 23,
};
const BUCKET_MAX = {
  head: 25, init: 26, loop: 27, test: 28, set: 29, ret: 30,
};
const C = {
  head: 8, make: [9, 10, 11], count: [13, 14], inc: 15, sum: [17, 18], back: [20, 21], place: 22, dec: 23, copy: [24, 25], end: 26,
};
const COUNT_MAX = {
  head: 29, init: 30, loop: 31, test: 32, set: 33, ret: 34,
};

export const algorithms = [
  {
    id: 'radix', title: tr('Radix Sort com buckets', 'Radix Sort with buckets'), menuLabel: tr('Radix Sort com buckets', 'Radix Sort with buckets'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Ordene pelos dígitos, do menos significativo (unidades) ao mais significativo: em cada passada, distribua os números em 10 buckets pelo dígito atual e junte os buckets de volta, em ordem.', 'Sort by the digits, from the least significant (units) to the most significant: in each pass, distribute the numbers into 10 buckets by the current digit and merge the buckets back, in order.'),
    interaction: tr('Acompanhe o dígito em destaque em cada número. Repare que, depois de cada passada, o vetor está ordenado só pelos dígitos já processados, e que dentro de cada bucket os números mantêm a ordem em que chegaram.', 'Follow the highlighted digit in each number. Notice that after each pass the array is sorted only by the digits already processed, and that inside each bucket the numbers keep the order in which they arrived.'),
    complexity: { time: 'O(k · n)', space: 'O(n)', note: tr('São k passadas, uma por dígito do maior número, e cada passada distribui e junta os n elementos (mais 10 buckets). Os buckets guardam os n elementos de novo, por isso o espaço extra é O(n).', 'There are k passes, one per digit of the largest number, and each pass distributes and merges the n elements (plus 10 buckets). The buckets hold the n elements again, so the extra space is O(n).') },
    pseudocode: BUCKET_FULL,
  },
  {
    id: 'radix-count', title: tr('Radix Sort com Counting Sort', 'Radix Sort with Counting Sort'), menuLabel: tr('Radix Sort com Counting Sort', 'Radix Sort with Counting Sort'), group: tr('Como funciona', 'How it works'), number: '02',
    description: tr('A mesma ideia, mas cada passada é um Counting Sort estável sobre o dígito atual: um vetor count de 10 posições, a soma acumulada e a saída montada de trás para a frente. É o que evita um vetor auxiliar enorme.', 'The same idea, but each pass is a stable Counting Sort on the current digit: a count array of 10 positions, the running sum and the output built from back to front. It is what avoids a huge auxiliary array.'),
    interaction: tr('Compare com o Radix de buckets: o resultado de cada passada é o mesmo. Aqui o count tem sempre 10 posições, qualquer que seja o tamanho dos números.', 'Compare with the bucket Radix: the result of each pass is the same. Here count always has 10 positions, whatever the size of the numbers.'),
    complexity: { time: 'O(k · n)', space: 'O(n)', note: tr('Cada passada faz um Counting Sort com maior = 9: 10 + 9 posições de count e 3n operações no vetor. O count nunca passa de 10 posições; o espaço extra é o vetor de saída, O(n).', 'Each pass runs a Counting Sort with largest = 9: 10 + 9 positions of count and 3n operations on the array. count never exceeds 10 positions; the extra space is the output array, O(n).') },
    pseudocode: COUNT_FULL,
  },
  {
    id: 'lsd-msd', title: tr('LSD × MSD', 'LSD × MSD'), menuLabel: tr('LSD × MSD', 'LSD × MSD'), group: tr('Como funciona', 'How it works'), number: '03',
    description: tr('LSD (Least Significant Digit) começa pelo dígito da direita; MSD (Most Significant Digit) começa pelo da esquerda. Com números de tamanhos diferentes, o MSD trata os números como texto: 10 vem antes de 2.', 'LSD (Least Significant Digit) starts with the rightmost digit; MSD (Most Significant Digit) starts with the leftmost one. With numbers of different lengths, MSD treats the numbers as text: 10 comes before 2.'),
    interaction: tr('Use o exemplo "1 a 10" (slide 8) e compare as duas linhas passada por passada. O LSD termina em ordem numérica; o MSD termina em ordem de texto.', 'Use the "1 to 10" example (slide 8) and compare the two rows pass by pass. LSD ends in numeric order; MSD ends in text order.'),
    complexity: { time: 'O(k · n)', space: 'O(n)', note: tr('Os dois fazem k passadas sobre os n elementos. A diferença está no resultado: o LSD, com passadas estáveis, ordena números pelo valor; o MSD ordena pela ordem dos dígitos lidos da esquerda para a direita (lexicográfica), como as palavras de um dicionário.', 'Both make k passes over the n elements. The difference is in the result: LSD, with stable passes, sorts numbers by value; MSD sorts by the order of the digits read from left to right (lexicographic), like the words of a dictionary.') },
    pseudocode: BUCKET_FULL,
  },
  {
    id: 'complexity', title: tr('Passadas e dígitos', 'Passes and digits'), menuLabel: tr('Complexidade de tempo', 'Time complexity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '04',
    description: tr('O custo é O(k · n): k passadas (os dígitos do maior número) de n elementos cada. Aumente os dígitos do maior valor sem mudar n e compare com o Counting Sort simples, que paga o valor inteiro.', 'The cost is O(k · n): k passes (the digits of the largest number) of n elements each. Increase the digits of the largest value without changing n and compare it with plain Counting Sort, which pays for the whole value.'),
    interaction: tr('Veja a barra de cada passada: todas custam o mesmo (10 buckets + n + n). Um maior valor de 9 dígitos custa só 9 passadas, enquanto o Counting Sort precisaria de um count com um bilhão de posições.', 'See the bar of each pass: they all cost the same (10 buckets + n + n). A largest value with 9 digits costs only 9 passes, while Counting Sort would need a count with a billion positions.'),
    complexity: { time: 'O(k · n)', space: 'O(n)', note: tr('O algoritmo tem a mesma complexidade em todos os casos: O(k · n), com n elementos e k dígitos no maior número. Quando k é constante (inteiros de 32 bits têm no máximo 10 dígitos), é linear: O(n).', 'The algorithm has the same complexity in every case: O(k · n), with n elements and k digits in the largest number. When k is constant (32-bit integers have at most 10 digits), it is linear: O(n).') },
    pseudocode: BUCKET_FULL,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '05',
    description: tr('Execute o algoritmo em quatro vetores com os mesmos valores em ordens diferentes. O Radix Sort não é adaptável: sempre faz as k passadas, mesmo que o vetor já esteja ordenado.', 'Run the algorithm on four arrays with the same values in different orders. Radix Sort is not adaptive: it always makes the k passes, even if the array is already sorted.'),
    interaction: tr('As quatro barras são iguais. Em cada passada o vetor ordenado é desfeito e refeito como qualquer outro: a ordem que já existe não é aproveitada.', 'The four bars are equal. In each pass the sorted array is undone and rebuilt like any other: the order that already exists is not used.'),
    complexity: { time: 'O(k · n)', space: 'O(n)', note: tr('O número de passadas depende só do maior valor, e cada passada percorre todos os elementos, sem nunca olhar se o vetor já está ordenado. O custo é o mesmo em qualquer ordem inicial.', 'The number of passes depends only on the largest value, and each pass goes through all the elements, never checking whether the array is already sorted. The cost is the same in any initial order.') },
    pseudocode: BUCKET_FULL,
  },
  {
    id: 'stability', title: tr('Estabilidade', 'Stability'), menuLabel: tr('Estabilidade', 'Stability'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '06',
    description: tr('O Radix Sort só funciona porque cada passada é estável. Compare a versão da aula (cada bucket é uma fila) com uma versão em que a passada inverte os iguais (cada bucket é uma pilha).', 'Radix Sort only works because each pass is stable. Compare the version from the lesson (each bucket is a queue) with a version in which the pass reverses the equals (each bucket is a stack).'),
    interaction: tr('Use "Gerar exemplo" e compare as duas linhas. Com a pilha, números que têm o mesmo dígito atual saem na ordem contrária à da passada anterior, e o vetor termina fora de ordem.', 'Use "Generate example" and compare the two rows. With the stack, numbers that have the same current digit come out in the opposite order to the previous pass, and the array ends up out of order.'),
    complexity: { time: 'O(k · n)', space: 'O(n)', note: tr('Na passada do dígito d, dois números com o mesmo dígito d só ficam na ordem certa se a passada anterior (que olhou os dígitos menores) for preservada. Por isso o Radix Sort exige uma passada estável, e com ela o Radix Sort é estável: iguais saem na ordem original.', 'In the pass of digit d, two numbers with the same digit d only stay in the right order if the previous pass (which looked at the lower digits) is preserved. That is why Radix Sort demands a stable pass, and with it Radix Sort is stable: equals come out in the original order.') },
    pseudocode: BUCKET_FULL,
  },
];

const ten = () => Array.from({ length: 10 }, () => null);

/** O vetor depois de uma passada sobre o dígito `pos`: estável (fila) ou, na estabilidade, com cada bucket invertido (pilha). */
export function radixPass(items, pos, unstable = false) {
  const buckets = Array.from({ length: 10 }, () => []);
  items.forEach((item) => buckets[digitOf(item.v, pos)].push(item));
  return buckets.flatMap((bucket) => (unstable ? [...bucket].reverse() : bucket));
}

/** Os vetores depois de cada passada do LSD (de `pos = 1` até o maior dígito). */
export function lsdPasses(items, unstable = false) {
  const passes = [];
  let current = items;
  for (let pos = 1, max = maxOf(items); Math.floor(max / pos) > 0; pos *= 10) {
    current = radixPass(current, pos, unstable);
    passes.push(current);
  }
  return passes;
}

/** Os vetores depois de cada nível do MSD: ordenados pelos `d + 1` primeiros caracteres (o mais curto vem antes). */
export function msdLevels(items) {
  const longest = String(maxOf(items)).length;
  return range(longest).map((level) => [...items].sort((x, y) => {
    const kx = String(x.v).slice(0, level + 1);
    const ky = String(y.v).slice(0, level + 1);
    return kx < ky ? -1 : kx > ky ? 1 : 0;
  }));
}

/**
 * O Radix Sort da aula sobre `source` (itens `{ v, tag }`), com buckets (`variant: 'bucket'`, slide 9) ou com
 * um Counting Sort estável a cada passada (`'count'`, código de exemplo). Com `record` monta os passos, uma
 * linha do pseudocódigo por passo; sem ele só executa, para as análises. Devolve o custo e o vetor depois de cada passada.
 */
export function runRadix(source, { record = false, variant = 'bucket' } = {}) {
  const a = copyItems(source);
  const n = a.length;
  const { steps, at } = createTrace(record);
  const useCount = variant === 'count';
  const v = useCount
    ? { maior: NONE, digitoPos: NONE, i: NONE, digito: NONE }
    : { maior: NONE, digitoPos: NONE, num: NONE, digitoAtual: NONE, index: NONE };
  let buckets = null;
  let count = null;
  let saida = null;
  let digitPos = null;
  let active = null;
  const lanes = (lane, outLane) => {
    if (useCount) {
      return [
        count && vectorLane('count', count, { caption: tr('um índice para cada dígito, 0 a 9', 'one index for each digit, 0 to 9'), dimZeros: true, ...lane }),
        saida && vectorLane(tr('saida', 'output'), saida.map((item) => (item ? item.v : null)), { caption: tr('vetor de saída', 'output array'), tags: saida.map((item) => item?.tag ?? ''), ...outLane }),
      ].filter(Boolean);
    }
    return [bucketsLane(tr('buckets (um para cada dígito)', 'buckets (one for each digit)'), buckets ?? ten(), { active: lane?.active ?? active, hint: tr('buckets[d] guarda os números cujo dígito atual é d', 'buckets[d] holds the numbers whose current digit is d') })];
  };
  const emit = (line, title, description, tone, { lane, outLane, ...extra } = {}) => at(valuesOf(a), line, title, description, tone, {
    tags: tagsOf(a),
    lanes: lanes(lane, outLane),
    variables: { ...v },
    ...(digitPos ? { digit: { pos: digitPos } } : {}),
    ...extra,
  });

  const passes = [];
  const cost = { find: n - 1, passes: 0, perPass: useCount ? 10 + 9 + 3 * n : 10 + 2 * n };
  emit(R.head, tr('Vetor e dígitos', 'Array and digits'), tr(`Vamos ordenar o vetor de ${plural(n, 'elemento', 'elementos')} pelos dígitos, começando pelas unidades. Em cada passada o vetor fica ordenado por mais um dígito${useCount ? ', usando um Counting Sort estável' : ', usando 10 buckets'}.`, `We will sort the array of ${plural(n, 'element', 'elements')} by the digits, starting with the units. In each pass the array becomes sorted by one more digit${useCount ? ', using a stable Counting Sort' : ', using 10 buckets'}.`), 'neutral');
  emit(R.call, tr('Chama getMax(A)', 'Calls getMax(A)'), tr('Para saber quantas passadas fazer, é preciso conhecer o maior número: ele diz quantos dígitos existem.', 'To know how many passes to make, the largest number must be known: it says how many digits there are.'), 'neutral');
  const maior = traceFindMax(a, (...args) => emit(...args), useCount ? COUNT_MAX : BUCKET_MAX, { fn: 'getMax', setVar: (max, i) => { v.maior = max; if (useCount) v.i = i === null ? NONE : i; } });
  v.maior = maior;
  if (useCount) v.i = NONE;
  const digits = digitCount(maior);
  emit(R.call, tr(`maior = ${maior}`, `largest = ${maior}`), tr(`getMax devolveu ${maior}, que tem ${plural(digits, 'dígito', 'dígitos')}: serão ${plural(digits, 'passada', 'passadas')}.`, `getMax returned ${maior}, which has ${plural(digits, 'digit', 'digits')}: there will be ${plural(digits, 'pass', 'passes')}.`), 'neutral', { foundIndices: [a.findIndex((item) => item.v === maior)], phase: { label: tr('Maior número', 'Largest number'), text: `${tr('maior', 'largest')} = ${maior} → ${plural(digits, tr('dígito', 'digit'), tr('dígitos', 'digits'))}`, code: true } });

  let pos = 1;
  v.digitoPos = 1;
  emit(R.init, 'digitoPos ← 1', tr('digitoPos = 1 olha o dígito das unidades. Depois valerá 10 (dezenas), 100 (centenas)...', 'digitPos = 1 looks at the units digit. Then it will be 10 (tens), 100 (hundreds)...'), 'neutral');

  while (Math.floor(maior / pos) > 0) {
    cost.passes += 1;
    const pass = cost.passes;
    emit(R.loop, tr(`${maior} / ${pos} > 0?`, `${maior} / ${pos} > 0?`), tr(`${maior} / ${pos} = ${Math.floor(maior / pos)} > 0? Sim: ainda há um dígito nesta posição, passada ${pass}.`, `${maior} / ${pos} = ${Math.floor(maior / pos)} > 0? Yes: there is still a digit at this position, pass ${pass}.`), 'comparison', {
      compare: { left: { label: `${maior} / ${pos}`, value: Math.floor(maior / pos) }, op: '>', right: { label: '0', value: 0 }, result: true },
    });
    digitPos = pos;
    emit(R.run, useCount ? `countingSort(A, ${pos})` : `bucketSort(A, ${pos})`, tr(`Passada ${pass}: ordena o vetor pelo dígito de peso ${pos} (${pos === 1 ? 'unidades' : pos === 10 ? 'dezenas' : pos === 100 ? 'centenas' : `10^${digitCount(pos) - 1}`}). Os outros dígitos não importam agora.`, `Pass ${pass}: sorts the array by the digit of weight ${pos} (${pos === 1 ? 'units' : pos === 10 ? 'tens' : pos === 100 ? 'hundreds' : `10^${digitCount(pos) - 1}`}). The other digits do not matter now.`), 'neutral', { phase: { label: tr(`Passada ${pass}`, `Pass ${pass}`), text: tr(`dígito de peso ${pos}`, `digit of weight ${pos}`), code: false } });

    if (!useCount) {
      buckets = ten();
      emit(B.make, tr('Cria o vetor de listas', 'Creates the array of lists'), tr('buckets tem 10 posições, uma para cada dígito de 0 a 9, ainda sem lista.', 'buckets has 10 positions, one for each digit from 0 to 9, still without a list.'), 'neutral');
      buckets = Array.from({ length: 10 }, () => []);
      emit(B.lists, tr('buckets[0..9] ← lista vazia', 'buckets[0..9] ← empty list'), tr('O laço cria as 10 listas vazias, do bucket 0 ao 9.', 'The loop creates the 10 empty lists, from bucket 0 to 9.'), 'neutral');
      a.forEach((item, idx) => {
        v.num = item.v;
        emit(B.each, `num = ${item.v}`, tr(`O laço lê A[${idx}] = ${item.v}.`, `The loop reads A[${idx}] = ${item.v}.`), 'comparison', { pointers: { num: idx }, activeIndices: [idx] });
        const d = digitOf(item.v, pos);
        v.digitoAtual = d;
        emit(B.digit, tr(`digitoAtual = ${d}`, `currentDigit = ${d}`), tr(`(${item.v} / ${pos}) % 10 = ${Math.floor(item.v / pos)} % 10 = ${d} (divisão inteira): o dígito é ${d}.`, `(${item.v} / ${pos}) % 10 = ${Math.floor(item.v / pos)} % 10 = ${d} (integer division): the digit is ${d}.`), 'comparison', { pointers: { num: idx }, activeIndices: [idx], lane: { active: d } });
        buckets[d].push({ ...item, state: 'fresh' });
        emit(B.add, tr(`buckets[${d}].adicionar(${item.v})`, `buckets[${d}].add(${item.v})`), tr(`${item.v} entra no fim da lista do bucket ${d}: quem chegou antes fica na frente.`, `${item.v} enters the end of the list of bucket ${d}: whoever arrived first stays in front.`), 'neutral', { pointers: { num: idx }, activeIndices: [idx], lane: { active: d } });
        buckets[d][buckets[d].length - 1].state = '';
      });
      v.num = NONE;
      v.digitoAtual = NONE;
      let index = 0;
      v.index = 0;
      emit(B.index, 'index ← 0', tr('index marca a próxima posição livre de A. Os buckets serão copiados de volta, do 0 ao 9.', 'index marks the next free position of A. The buckets will be copied back, from 0 to 9.'), 'neutral', { pointers: { index: 0 } });
      buckets.forEach((bucket, d) => {
        emit(B.eachBucket, tr(`bucket ${d}`, `bucket ${d}`), bucket.length
          ? tr(`O laço chega ao bucket ${d}, com ${plural(bucket.length, 'número', 'números')}.`, `The loop reaches bucket ${d}, with ${plural(bucket.length, 'number', 'numbers')}.`)
          : tr(`O bucket ${d} está vazio: o laço interno não executa nenhuma volta.`, `Bucket ${d} is empty: the inner loop makes no turns.`), 'comparison', { pointers: { index: Math.min(index, n - 1) }, lane: { active: d }, sortedIndices: range(index) });
        bucket.forEach((item) => {
          item.state = 'active';
          v.num = item.v;
          emit(B.eachNum, `num = ${item.v}`, tr(`Lê ${item.v}, o próximo número do bucket ${d}.`, `Reads ${item.v}, the next number of bucket ${d}.`), 'comparison', { pointers: { index: Math.min(index, n - 1) }, lane: { active: d }, sortedIndices: range(index) });
          a[index] = { ...item, state: undefined };
          emit(B.put, tr(`A[${index}] ← ${item.v}`, `A[${index}] ← ${item.v}`), tr(`${item.v} volta para A[${index}].`, `${item.v} goes back to A[${index}].`), 'neutral', { pointers: { index }, lane: { active: d }, changedIndices: [index], sortedIndices: range(index + 1) });
          index += 1;
          v.index = index;
          item.state = 'done';
          emit(B.next, tr(`index ← ${index}`, `index ← ${index}`), tr(`index avança para ${index}.`, `index moves on to ${index}.`), 'neutral', { pointers: { index: Math.min(index, n - 1) }, lane: { active: d }, sortedIndices: range(index) });
        });
      });
      v.num = NONE;
      v.index = NONE;
      buckets = null;
    } else {
      count = Array.from({ length: 10 }, () => 0);
      saida = Array.from({ length: n }, () => null);
      emit(C.make, tr('Cria saida e count', 'Creates output and count'), tr(`saida tem ${n} posições, vazia, e count tem 10 posições (os dígitos de 0 a 9), todas em 0.`, `output has ${n} positions, empty, and count has 10 positions (the digits 0 to 9), all 0.`), 'neutral');
      for (let i = 0; i < n; i += 1) {
        const d = digitOf(a[i].v, pos);
        v.i = i;
        v.digito = d;
        emit(C.count, tr(`digito = ${d}`, `digit = ${d}`), tr(`A[${i}] = ${a[i].v}: (${a[i].v} / ${pos}) % 10 = ${d} (divisão inteira).`, `A[${i}] = ${a[i].v}: (${a[i].v} / ${pos}) % 10 = ${d} (integer division).`), 'comparison', { pointers: { i }, activeIndices: [i], lane: { activeIndices: [d] } });
        count[d] += 1;
        emit(C.inc, tr(`count[${d}] ← ${count[d]}`, `count[${d}] ← ${count[d]}`), tr(`count[${d}] passa a ${count[d]}.`, `count[${d}] becomes ${count[d]}.`), 'neutral', { pointers: { i }, activeIndices: [i], lane: { changedIndices: [d], activeIndices: [d] } });
      }
      v.i = NONE;
      v.digito = NONE;
      for (let i = 1; i <= 9; i += 1) {
        count[i] += count[i - 1];
        emit(C.sum, tr(`count[${i}] ← ${count[i]}`, `count[${i}] ← ${count[i]}`), tr(`count[${i}] soma count[${i - 1}]: ${count[i]} números têm dígito atual menor ou igual a ${i}.`, `count[${i}] adds count[${i - 1}]: ${count[i]} numbers have a current digit less than or equal to ${i}.`), 'neutral', { lane: { pointers: { i }, changedIndices: [i], activeIndices: [i - 1] } });
      }
      for (let i = n - 1; i >= 0; i -= 1) {
        const d = digitOf(a[i].v, pos);
        v.i = i;
        v.digito = d;
        emit(C.back, tr(`i = ${i}, digito = ${d}`, `i = ${i}, digit = ${d}`), tr(`De trás para a frente: A[${i}] = ${a[i].v} tem dígito ${d}.`, `From back to front: A[${i}] = ${a[i].v} has digit ${d}.`), 'comparison', { pointers: { i }, activeIndices: [i], lane: { activeIndices: [d] } });
        const where = count[d] - 1;
        saida[where] = { ...a[i] };
        emit(C.place, tr(`saida[${where}] ← ${a[i].v}`, `output[${where}] ← ${a[i].v}`), tr(`count[${d}] = ${where + 1}, então ${a[i].v} vai para saida[${where}].`, `count[${d}] = ${where + 1}, so ${a[i].v} goes to output[${where}].`), 'neutral', { pointers: { i }, activeIndices: [i], lane: { activeIndices: [d] }, outLane: { changedIndices: [where], foundIndices: [where] } });
        count[d] -= 1;
        emit(C.dec, tr(`count[${d}] ← ${count[d]}`, `count[${d}] ← ${count[d]}`), tr(`count[${d}] cai para ${count[d]}.`, `count[${d}] drops to ${count[d]}.`), 'neutral', { pointers: { i }, activeIndices: [i], lane: { changedIndices: [d], activeIndices: [d] }, outLane: { foundIndices: [where] } });
      }
      v.i = NONE;
      v.digito = NONE;
      for (let i = 0; i < n; i += 1) {
        v.i = i;
        a[i] = { ...saida[i] };
        emit(C.copy, tr(`A[${i}] ← ${a[i].v}`, `A[${i}] ← ${a[i].v}`), tr(`A[${i}] recebe saida[${i}] = ${a[i].v}.`, `A[${i}] receives output[${i}] = ${a[i].v}.`), 'neutral', { pointers: { i }, changedIndices: [i], sortedIndices: range(i + 1), outLane: { activeIndices: [i] } });
      }
      v.i = NONE;
      count = null;
      saida = null;
    }

    passes.push(a.map((item) => ({ ...item })));
    emit(R.inc, tr(`digitoPos ← ${pos * 10}`, `digitPos ← ${pos * 10}`), tr(`Fim da passada ${pass}: o vetor está ordenado pelos ${pass === 1 ? 'dígitos das unidades' : `${pass} últimos dígitos`}: ${valuesOf(a).join(', ')}. digitoPos passa para ${pos * 10}.`, `End of pass ${pass}: the array is sorted by the ${pass === 1 ? 'units digits' : `last ${pass} digits`}: ${valuesOf(a).join(', ')}. digitPos moves to ${pos * 10}.`), 'comparison', { sortedIndices: [] });
    pos *= 10;
    v.digitoPos = pos;
    digitPos = null;
  }
  emit(R.loop, tr(`${maior} / ${pos} > 0?`, `${maior} / ${pos} > 0?`), tr(`${maior} / ${pos} = ${Math.floor(maior / pos)} > 0? Não: não sobrou nenhum dígito do maior número. O laço termina.`, `${maior} / ${pos} = ${Math.floor(maior / pos)} > 0? No: no digit of the largest number is left. The loop ends.`), 'comparison', {
    compare: { left: { label: `${maior} / ${pos}`, value: Math.floor(maior / pos) }, op: '>', right: { label: '0', value: 0 }, result: false },
  });
  emit(R.end, tr('Vetor ordenado', 'Array sorted'), tr(`Depois de ${plural(cost.passes, 'passada', 'passadas')} o vetor está ordenado: ${valuesOf(a).join(', ')}. Como cada passada é estável, os números com o mesmo dígito mantêm a ordem que os dígitos menores já tinham criado.`, `After ${plural(cost.passes, 'pass', 'passes')} the array is sorted: ${valuesOf(a).join(', ')}. Since each pass is stable, the numbers with the same digit keep the order that the lower digits had already created.`), 'done', {
    sortedIndices: range(n), output: [tr(`Vetor ordenado: ${valuesOf(a).join(' ')}`, `Sorted array: ${valuesOf(a).join(' ')}`), tr(`Passadas: ${cost.passes}`, `Passes: ${cost.passes}`)],
  });

  const total = cost.find + cost.passes * cost.perPass;
  return {
    steps, final: a, maior, cost, total, passes, digits,
  };
}

// ---------------------------------------------------------------------------
// Passos das simulações com linhas de vetores (LSD × MSD e estabilidade)
// ---------------------------------------------------------------------------

/** Um passo com várias linhas de vetores: `orders` tem `label`, `caption`, `items`, `cuts`, `changedIndices` e `warn`. */
const ordersStep = (values, line, title, description, tone, orders, extra = {}) => step(values, line, title, description, tone, { lanes: [], orders, ...extra });
const order = (label, caption, items, extra = {}) => ({
  label, caption, values: valuesOf(items), tags: tagsOf(items), ...extra,
});

/** Os índices em que o vetor muda de grupo, vistos pelos `level + 1` primeiros caracteres (para a barra entre os grupos do MSD). */
const cutsOf = (items, level) => range(items.length - 1).filter((index) => String(items[index].v).slice(0, level + 1) !== String(items[index + 1].v).slice(0, level + 1));

const changedBetween = (before, after) => range(after.length).filter((index) => before[index].v !== after[index].v || before[index].tag !== after[index].tag);

function lsdMsdSteps(values) {
  const items = toItems(values);
  const lsd = lsdPasses(items);
  const msd = msdLevels(items);
  const longest = msd.length;
  const sortedNumbers = [...values].sort((x, y) => x - y);
  const lsdResult = valuesOf(lsd.at(-1));
  const msdResult = valuesOf(msd.at(-1));
  const same = lsdResult.join() === msdResult.join();
  const rowsAt = (pass) => [
    order(tr('LSD · da direita para a esquerda', 'LSD · right to left'), pass === 0 ? tr('ainda não começou', 'not started yet') : tr(`${pass}ª passada: ordena pelo dígito de peso ${10 ** (pass - 1)}`, `pass ${pass}: sorts by the digit of weight ${10 ** (pass - 1)}`), pass === 0 ? items : lsd[pass - 1], { changedIndices: pass === 0 ? [] : changedBetween(pass === 1 ? items : lsd[pass - 2], lsd[pass - 1]) }),
    order(tr('MSD · da esquerda para a direita', 'MSD · left to right'), pass === 0 ? tr('ainda não começou', 'not started yet') : tr(`${pass}º nível: grupos pelos ${pass} primeiros dígitos`, `level ${pass}: groups by the first ${pass} digits`), pass === 0 ? items : msd[pass - 1], { cuts: pass === 0 ? [] : cutsOf(msd[pass - 1], pass - 1), changedIndices: pass === 0 ? [] : changedBetween(pass === 1 ? items : msd[pass - 2], msd[pass - 1]) }),
  ];
  const steps = [
    ordersStep(values, R.head, tr('Duas formas de ler os dígitos', 'Two ways of reading the digits'), tr(`O LSD (Least Significant Digit) começa pelo dígito da direita e usa uma passada estável por dígito. O MSD (Most Significant Digit) começa pelo da esquerda e forma grupos que ficam cada vez mais finos. As duas linhas partem do mesmo vetor: ${longest === 1 ? 'todos têm um só dígito' : `o maior número tem ${longest} dígitos`}.`, `LSD (Least Significant Digit) starts with the rightmost digit and uses one stable pass per digit. MSD (Most Significant Digit) starts with the leftmost one and forms groups that get finer and finer. Both rows start from the same array: ${longest === 1 ? 'all have a single digit' : `the largest number has ${longest} digits`}.`), 'neutral', rowsAt(0), { variables: { k: longest } }),
  ];
  for (let pass = 1; pass <= longest; pass += 1) {
    steps.push(ordersStep(values, R.run, tr(`Passada ${pass}`, `Pass ${pass}`), tr(`LSD: ordena pelo dígito de peso ${10 ** (pass - 1)} (${pass === 1 ? 'unidades' : pass === 2 ? 'dezenas' : `10^${pass - 1}`}), mantendo a ordem dos iguais: ${lsd[pass - 1].map((item) => item.v).join(' ')}. MSD: agrupa pelos ${pass} primeiro(s) caractere(s) do número escrito: ${msd[pass - 1].map((item) => item.v).join(' ')}; um número mais curto, que acabou, vem antes dos que continuam.`, `LSD: sorts by the digit of weight ${10 ** (pass - 1)} (${pass === 1 ? 'units' : pass === 2 ? 'tens' : `10^${pass - 1}`}), keeping the order of the equals: ${lsd[pass - 1].map((item) => item.v).join(' ')}. MSD: groups by the first ${pass} character(s) of the written number: ${msd[pass - 1].map((item) => item.v).join(' ')}; a shorter number, which has ended, comes before those that go on.`), 'comparison', rowsAt(pass), { variables: { k: longest, digitoPos: 10 ** (pass - 1) } }));
  }
  steps.push(ordersStep(values, R.end, same ? tr('Os dois terminam iguais', 'Both end the same') : tr('LSD: valores · MSD: texto', 'LSD: values · MSD: text'), same
    ? tr(`Todos os números têm o mesmo número de dígitos, então a ordem de texto coincide com a ordem numérica e os dois resultados são iguais: ${lsdResult.join(' ')}. Experimente o exemplo "1 a 10" para ver a diferença.`, `All the numbers have the same number of digits, so text order coincides with numeric order and both results are equal: ${lsdResult.join(' ')}. Try the "1 to 10" example to see the difference.`)
    : tr(`LSD: ${lsdResult.join(' ')} (ordem numérica, igual a ${sortedNumbers.join(' ')}). MSD: ${msdResult.join(' ')} (ordem de texto, como num dicionário): 10 vem antes de 2 porque "1" < "2". Para ordenar números, o MSD precisa completar os números mais curtos com zeros à esquerda; o LSD já faz isso sozinho.`, `LSD: ${lsdResult.join(' ')} (numeric order, equal to ${sortedNumbers.join(' ')}). MSD: ${msdResult.join(' ')} (text order, as in a dictionary): 10 comes before 2 because "1" < "2". To sort numbers, MSD needs to pad the shorter numbers with zeros on the left; LSD already does that on its own.`), same ? 'done' : 'warning', [
    order(tr('LSD · da direita para a esquerda', 'LSD · right to left'), tr('ordem numérica', 'numeric order'), lsd.at(-1)),
    order(tr('MSD · da esquerda para a direita', 'MSD · left to right'), same ? tr('mesma ordem', 'same order') : tr('ordem de texto', 'text order'), msd.at(-1), { cuts: cutsOf(msd.at(-1), longest - 1), warn: !same }),
  ], { output: [tr(`LSD: ${lsdResult.join(' ')}`, `LSD: ${lsdResult.join(' ')}`), tr(`MSD: ${msdResult.join(' ')}`, `MSD: ${msdResult.join(' ')}`)], variables: { k: longest } }));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Passadas e dígitos
// ---------------------------------------------------------------------------

function complexitySteps(values) {
  const n = values.length;
  const maior = Math.max(...values);
  const k = digitCount(maior);
  const withMax = (target) => {
    const copy = [...values];
    copy[copy.indexOf(maior)] = target;
    return copy;
  };
  const targets = [...new Set([123456, 987654321].filter((target) => digitCount(target) > k))];
  const scenarios = [{ label: tr('Seu vetor', 'Your array'), values: [...values] }, ...targets.map((target) => ({ label: tr(`maior = ${target}`, `largest = ${target}`), values: withMax(target) }))]
    .map((scenario) => ({ ...scenario, run: runRadix(toItems(scenario.values)), counting: 3 * n + 2 * Math.max(...scenario.values) + 1 }));
  const widest = Math.max(...scenarios.map((scenario) => scenario.run.digits));
  const perPass = 10 + 2 * n;
  const frame = (scenario, final = false) => ({
    title: tr('Operações de cada passada', 'Operations of each pass'),
    hint: tr(`cada passada: 10 buckets + ${n} + ${n} = ${perPass}`, `each pass: 10 buckets + ${n} + ${n} = ${perPass}`),
    max: perPass,
    bars: range(widest).map((pass) => ({
      label: tr(`passada ${pass + 1}`, `pass ${pass + 1}`), value: scenario && pass < scenario.run.digits ? perPass : scenario ? 0 : null, current: false, mark: '',
    })),
    totals: [
      { label: tr('Radix Sort', 'Radix Sort'), value: scenario ? scenario.run.total : 0, note: tr(`(n − 1) + k · (10 + 2n), k = ${scenario ? scenario.run.digits : '?'}`, `(n − 1) + k · (10 + 2n), k = ${scenario ? scenario.run.digits : '?'}`) },
      { label: tr('Counting Sort simples', 'Plain Counting Sort'), value: scenario ? scenario.counting : 0, note: tr('3n + 2 · maior + 1', '3n + 2 · largest + 1') },
    ],
    final,
  });
  const steps = [
    step(values, R.head, tr('Os dígitos do maior número', 'The digits of the largest number'), tr(`Seu vetor tem n = ${n} e o maior número, ${maior}, tem ${plural(k, 'dígito', 'dígitos')}. O Radix Sort faz ${plural(k, 'passada', 'passadas')}, e cada uma custa 10 buckets + ${n} para distribuir + ${n} para juntar = ${perPass}. Vamos aumentar os dígitos do maior valor sem mudar n.`, `Your array has n = ${n} and the largest number, ${maior}, has ${plural(k, 'digit', 'digits')}. Radix Sort makes ${plural(k, 'pass', 'passes')}, and each one costs 10 buckets + ${n} to distribute + ${n} to merge = ${perPass}. We will increase the digits of the largest value without changing n.`), 'neutral', { chart: frame(null), lanes: [], variables: { n, k } }),
  ];
  scenarios.forEach((scenario, index) => {
    const { run } = scenario;
    steps.push(step(scenario.values, R.loop, scenario.label, index === 0
      ? tr(`${plural(run.digits, 'passada', 'passadas')} de ${perPass} operações, mais ${n - 1} para achar o maior: ${run.total} operações. O Counting Sort simples faria ${scenario.counting}.`, `${plural(run.digits, 'pass', 'passes')} of ${perPass} operations, plus ${n - 1} to find the largest: ${run.total} operations. Plain Counting Sort would make ${scenario.counting}.`)
      : tr(`Com ${plural(run.digits, 'dígito', 'dígitos')} no maior número são ${plural(run.digits, 'passada', 'passadas')}: ${run.total} operações, porque cada passada custa o mesmo. O Counting Sort simples precisaria de um count com ${(Math.max(...scenario.values) + 1).toLocaleString(tr('pt-BR', 'en-US'))} posições e faria ${scenario.counting.toLocaleString(tr('pt-BR', 'en-US'))} operações.`, `With ${plural(run.digits, 'digit', 'digits')} in the largest number there are ${plural(run.digits, 'pass', 'passes')}: ${run.total} operations, because each pass costs the same. Plain Counting Sort would need a count with ${(Math.max(...scenario.values) + 1).toLocaleString(tr('pt-BR', 'en-US'))} positions and would make ${scenario.counting.toLocaleString(tr('pt-BR', 'en-US'))} operations.`), index === 0 ? 'comparison' : 'warning', { chart: frame(scenario), lanes: [], variables: { n, k: run.digits, maior: Math.max(...scenario.values) } }));
  });
  const last = scenarios.at(-1);
  steps.push(step(values, R.end, tr('O custo cresce com os dígitos, não com o valor', 'The cost grows with the digits, not with the value'), tr(`Operações do Radix Sort: ${scenarios.map((scenario) => scenario.run.total).join(' · ')}. Cada dígito a mais acrescenta só uma passada de ${perPass}, enquanto o valor fica 10 vezes maior. É assim que o Radix Sort evita o vetor auxiliar enorme do Counting Sort. O custo é O(k · n) em todos os casos.`, `Radix Sort operations: ${scenarios.map((scenario) => scenario.run.total).join(' · ')}. Each extra digit adds only one pass of ${perPass}, while the value gets ten times bigger. That is how Radix Sort avoids the huge auxiliary array of Counting Sort. The cost is O(k · n) in every case.`), 'done', {
    chart: frame(last, true), lanes: [], variables: { n, k: last.run.digits }, output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.run.digits} passadas, ${scenario.run.total} operações`, `${scenario.label}: ${scenario.run.digits} passes, ${scenario.run.total} operations`)),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 05 · Adaptabilidade
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const scenarios = adaptabilityScenarios(values).map((scenario) => ({ ...scenario, run: runRadix(toItems(scenario.values)) }));
  const short = [tr('Ordenado', 'Sorted'), tr('Quase', 'Almost'), tr('Inverso', 'Reverse'), tr('Seu vetor', 'Yours')];
  const { digits } = scenarios[0].run;
  const total = scenarios[0].run.total;
  const frame = (done, final = false) => ({
    title: tr('Operações em cada vetor', 'Operations on each array'),
    hint: tr('o mesmo custo nos quatro', 'the same cost on the four'),
    max: total,
    bars: scenarios.map((scenario, index) => ({
      label: short[index], value: index < done ? scenario.run.total : null, current: index === done - 1 && !final, mark: index < done ? String(digits) : '',
    })),
    totals: [
      { label: tr('Operações por vetor', 'Operations per array'), value: total, note: `(n − 1) + k · (10 + 2n) = ${total}` },
      { label: tr('Passadas', 'Passes'), value: digits, note: tr('uma por dígito do maior número', 'one per digit of the largest number') },
    ],
    final,
  });
  const steps = [
    step(values, R.head, tr('Quatro vetores, os mesmos valores', 'Four arrays, the same values'), tr('O primeiro vetor já está ordenado, o segundo está quase ordenado, o terceiro está em ordem inversa e o quarto é o seu. O Radix Sort vai tratar os quatro do mesmo jeito? Cada passo executa o algoritmo inteiro em um deles.', 'The first array is already sorted, the second is almost sorted, the third is in reverse order and the fourth is yours. Will Radix Sort treat the four the same way? Each step runs the whole algorithm on one of them.'), 'neutral', { chart: frame(0), lanes: [], variables: { n, k: digits } }),
  ];
  scenarios.forEach((scenario, index) => {
    steps.push(step(scenario.values, R.loop, scenario.label, tr(`${scenario.label}: ${plural(digits, 'passada', 'passadas')}, cada uma com ${scenario.run.cost.perPass} operações, mais ${scenario.run.cost.find} para achar o maior: ${scenario.run.total} operações. O número de passadas só depende do maior valor.`, `${scenario.label}: ${plural(digits, 'pass', 'passes')}, each with ${scenario.run.cost.perPass} operations, plus ${scenario.run.cost.find} to find the largest: ${scenario.run.total} operations. The number of passes depends only on the largest value.`), 'comparison', { chart: frame(index + 1), lanes: [], variables: { n, k: digits } }));
  });
  steps.push(step(values, R.end, tr('A ordem não importa', 'The order does not matter'), tr(`As quatro execuções custam ${total} operações. O vetor já ordenado não tem nenhuma vantagem: o Radix Sort sempre faz as ${digits} passadas, desmonta e remonta o vetor em cada uma, e nunca confere se ele já estava ordenado. O Radix Sort não é adaptável.`, `The four runs cost ${total} operations. The already sorted array has no advantage: Radix Sort always makes the ${digits} passes, takes the array apart and puts it back together in each one, and never checks whether it was already sorted. Radix Sort is not adaptive.`), 'done', {
    chart: frame(4, true), lanes: [], variables: { n, k: digits }, output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.run.total} operações`, `${scenario.label}: ${scenario.run.total} operations`)),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 06 · Estabilidade
// ---------------------------------------------------------------------------

/** Um vetor de números de 2 e 3 dígitos com repetidos e dígitos em comum, em que a passada invertida estraga o resultado. */
export function stabilityExample(count) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const pool = Array.from({ length: Math.max(3, Math.ceil(count * 0.6)) }, () => 10 + Math.floor(Math.random() * 190));
    const values = Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)]);
    const final = lsdPasses(tagDuplicates(values), true).at(-1);
    if (new Set(values).size < values.length && final.map((item) => item.v).join() !== [...values].sort((x, y) => x - y).join()) return values;
  }
  return [35, 12, 35, 15, 12, 18, 35, 14].slice(0, Math.max(4, Math.min(count, 8)));
}

function stabilitySteps(values) {
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const stable = lsdPasses(items);
  const unstable = lsdPasses(items, true);
  const sortedNumbers = [...values].sort((x, y) => x - y);
  const wrong = valuesOf(unstable.at(-1)).join() !== sortedNumbers.join();
  const k = stable.length;
  const rowsAt = (pass) => [
    order(tr('Estável · cada bucket é uma fila', 'Stable · each bucket is a queue'), pass === 0 ? tr('o primeiro a entrar é o primeiro a sair', 'first in, first out') : tr(`depois da passada ${pass}`, `after pass ${pass}`), pass === 0 ? items : stable[pass - 1], { changedIndices: pass === 0 ? [] : changedBetween(pass === 1 ? items : stable[pass - 2], stable[pass - 1]) }),
    order(tr('Instável · cada bucket é uma pilha', 'Unstable · each bucket is a stack'), pass === 0 ? tr('o último a entrar é o primeiro a sair', 'last in, first out') : tr(`depois da passada ${pass}`, `after pass ${pass}`), pass === 0 ? items : unstable[pass - 1], { changedIndices: pass === 0 ? [] : changedBetween(pass === 1 ? items : unstable[pass - 2], unstable[pass - 1]) }),
  ];
  const steps = [
    ordersStep(values, R.head, tr('Duas passadas por dígito', 'Two passes per digit'), hasRepeated
      ? tr('Os valores repetidos ganham uma letra (a, b, …) que marca a ordem original. As duas linhas fazem o mesmo Radix Sort, mas na de baixo cada bucket devolve os números de trás para a frente. Vamos ver o que isso faz com o resultado.', 'Repeated values get a letter (a, b, …) that marks the original order. Both rows run the same Radix Sort, but in the bottom one each bucket returns the numbers from back to front. Let us see what that does to the result.')
      : tr('As duas linhas fazem o mesmo Radix Sort, mas na de baixo cada bucket devolve os números de trás para a frente. Não há valores repetidos neste vetor; use "Gerar exemplo" para ver também a ordem dos iguais.', 'Both rows run the same Radix Sort, but in the bottom one each bucket returns the numbers from back to front. There are no repeated values in this array; use "Generate example" to also see the order of the equals.'), hasRepeated ? 'neutral' : 'warning', rowsAt(0), { variables: { k } }),
  ];
  for (let pass = 1; pass <= k; pass += 1) {
    const goodNow = stable[pass - 1];
    const badNow = unstable[pass - 1];
    steps.push(ordersStep(values, B.put, tr(`Passada ${pass}`, `Pass ${pass}`), tr(`Dígito de peso ${10 ** (pass - 1)}. Fila: ${goodNow.map(itemLabel).join(' ')}. Pilha: ${badNow.map(itemLabel).join(' ')}. ${pass === 1 ? 'Na primeira passada as duas são válidas: só importa o dígito das unidades.' : 'Números com o mesmo dígito de agora ficam, na fila, na ordem que a passada anterior criou; na pilha essa ordem foi virada do avesso.'}`, `Digit of weight ${10 ** (pass - 1)}. Queue: ${goodNow.map(itemLabel).join(' ')}. Stack: ${badNow.map(itemLabel).join(' ')}. ${pass === 1 ? 'In the first pass both are valid: only the units digit matters.' : 'Numbers with the same current digit stay, in the queue, in the order the previous pass created; in the stack that order was turned inside out.'}`), 'comparison', rowsAt(pass), { variables: { k, digitoPos: 10 ** (pass - 1) } }));
  }
  const finalStable = stable.at(-1);
  const finalBad = unstable.at(-1);
  steps.push(ordersStep(values, R.end, wrong ? tr('A passada instável quebra o Radix Sort', 'The unstable pass breaks Radix Sort') : tr('Neste vetor os dois funcionaram', 'Both worked on this array'), wrong
    ? tr(`Fila: ${finalStable.map(itemLabel).join(' ')}, em ordem. Pilha: ${finalBad.map(itemLabel).join(' ')}, fora de ordem. O LSD confia em que cada passada preserve o trabalho das anteriores; sem isso, os dígitos menores são embaralhados de novo a cada passada. ${isStable(finalStable) ? 'E com a fila os iguais saem na ordem original: o Radix Sort é estável.' : ''}`.trim(), `Queue: ${finalStable.map(itemLabel).join(' ')}, in order. Stack: ${finalBad.map(itemLabel).join(' ')}, out of order. LSD relies on each pass preserving the work of the previous ones; without that, the lower digits are scrambled again in every pass. ${isStable(finalStable) ? 'And with the queue the equals come out in the original order: Radix Sort is stable.' : ''}`.trim())
    : tr(`Os dois terminaram em ordem (${finalStable.map(itemLabel).join(' ')}), mas por acaso: nenhum bucket recebeu dois números com o mesmo dígito em uma passada que importasse. Use "Gerar exemplo" para ver um vetor em que a pilha estraga o resultado.`, `Both ended in order (${finalStable.map(itemLabel).join(' ')}), but by chance: no bucket received two numbers with the same digit in a pass that mattered. Use "Generate example" to see an array where the stack ruins the result.`), wrong ? 'warning' : 'done', [
    order(tr('Estável · cada bucket é uma fila', 'Stable · each bucket is a queue'), isStable(finalStable) && hasRepeated ? tr('ordem dos iguais preservada', 'order of the equals preserved') : '', finalStable),
    order(tr('Instável · cada bucket é uma pilha', 'Unstable · each bucket is a stack'), wrong ? tr('fora de ordem', 'out of order') : tr('em ordem, por acaso', 'in order, by chance'), finalBad, { warn: wrong }),
  ], { output: [tr(`Fila: ${finalStable.map(itemLabel).join(' ')}`, `Queue: ${finalStable.map(itemLabel).join(' ')}`), tr(`Pilha: ${finalBad.map(itemLabel).join(' ')}`, `Stack: ${finalBad.map(itemLabel).join(' ')}`)], variables: { k } }));
  return steps;
}

export function buildSteps(id, values) {
  switch (id) {
    case 'radix-count': return runRadix(toItems(values), { record: true, variant: 'count' }).steps;
    case 'lsd-msd': return lsdMsdSteps(values);
    case 'complexity': return complexitySteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    case 'stability': return stabilitySteps(values);
    default: return runRadix(toItems(values), { record: true }).steps;
  }
}
