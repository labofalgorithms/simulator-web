import {
  NONE, ascending, fmt, range, step,
} from '../shared/sort-steps.js';
import { actionPush, actionReturn, createTracer } from '../shared/call-stack-trace.js';
import { extendVariableNames, tr } from '../../core/i18n.js';

extendVariableNames({ inicio: 'start', fim: 'end' });

// Aula de Busca Sequencial e Busca Binária (ALG1 aula 06): a busca sequencial e a otimizada para vetor
// ordenado vêm dos slides 6 a 31, a busca binária (iterativa e recursiva) dos slides 32 a 39 e a análise
// de custo dos slides 17 a 19, 34, 36 e 40 a 45. A aula não traz uma execução passo a passo: cada passo
// aqui é uma linha do pseudocódigo, como num depurador.

export const LIMITS = {
  vetor: { min: 2, max: 16 },
  tamanho: { min: 1, max: 1000000000 },
};

/** Vetor dos slides 6 a 14 (desordenado) e vetor ordenado dos slides 23 a 36. */
export const SLIDE_UNSORTED = [85, 56, 72, 93, 0, 24, 62, 48, 12, 37];
export const SLIDE_SORTED = [0, 12, 24, 37, 48, 56, 62, 79, 85, 93];

export const DEFAULT_DATA = { vetor: SLIDE_UNSORTED, alvo: 62, tamanho: 100 };

const NAME = {
  seq: tr('buscaSequencial', 'sequentialSearch'),
  ord: tr('buscaSequencialOrdenada', 'sortedSequentialSearch'),
  it: tr('buscaBinariaIterativa', 'iterativeBinarySearch'),
  rec: tr('buscaBinariaRecursiva', 'recursiveBinarySearch'),
};

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const where = (index) => tr(`posição ${index}`, `position ${index}`);
const show = (value) => (value === undefined ? NONE : typeof value === 'number' ? fmt(value) : value);

/** Cartão de comparação, no mesmo sentido do teste do pseudocódigo: `V` é vetor[índice] e `T`, o valor procurado. */
const V = (index, value) => ({ label: tr(`vetor[${index}]`, `array[${index}]`), value: fmt(value) });
const T = (target) => ({ label: tr('valorProcurado', 'target'), value: fmt(target) });
const cmp = (left, op, right, result) => ({
  left, op, right, result,
});

// ---------------------------------------------------------------------------
// Pseudocódigo da aula (slides 16, 22, 37 e 39), com `vetor` no lugar de `array`.
// ---------------------------------------------------------------------------

const SEQ_CODE = [
  tr('FUNÇÃO buscaSequencial(vetor, valorProcurado)', 'FUNCTION sequentialSearch(array, target)'),
  tr('  PARA i DE 0 ATÉ tamanho(vetor) - 1 FAÇA', '  FOR i FROM 0 TO length(array) - 1 DO'),
  tr('    SE vetor[i] = valorProcurado ENTÃO', '    IF array[i] = target THEN'),
  tr('      RETORNE i    // índice onde o valor foi encontrado', '      RETURN i    // index where the value was found'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM PARA', '  END FOR'),
  tr('  RETORNE -1    // valor não encontrado', '  RETURN -1    // value not found'),
  tr('FIM', 'END'),
];
const SEQ = { head: 0, loop: 1, test: 2, found: 3, none: 6 };

const ORD_CODE = [
  tr('FUNÇÃO buscaSequencialOrdenada(vetor, valorProcurado)', 'FUNCTION sortedSequentialSearch(array, target)'),
  tr('  PARA i DE 0 ATÉ tamanho(vetor) - 1 FAÇA', '  FOR i FROM 0 TO length(array) - 1 DO'),
  tr('    SE vetor[i] = valorProcurado ENTÃO', '    IF array[i] = target THEN'),
  tr('      RETORNE i    // índice onde o valor foi encontrado', '      RETURN i    // index where the value was found'),
  tr('    FIM SE', '    END IF'),
  tr('    SE vetor[i] > valorProcurado ENTÃO', '    IF array[i] > target THEN'),
  tr('      RETORNE -1    // o valor não pode estar no vetor, que é ordenado', '      RETURN -1    // the value cannot be in the array, which is sorted'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM PARA', '  END FOR'),
  tr('  RETORNE -1    // valor não encontrado', '  RETURN -1    // value not found'),
  tr('FIM', 'END'),
];
const ORD = { head: 0, loop: 1, test: 2, found: 3, greater: 5, stop: 6, none: 9 };

const BIN_CODE = [
  tr('FUNÇÃO buscaBinariaIterativa(vetor, valorProcurado)', 'FUNCTION iterativeBinarySearch(array, target)'),
  tr('  inicio ← 0', '  start ← 0'),
  tr('  fim ← tamanho(vetor) - 1', '  end ← length(array) - 1'),
  tr('  ENQUANTO inicio <= fim FAÇA', '  WHILE start <= end DO'),
  tr('    centro ← (inicio + fim) / 2', '    mid ← (start + end) / 2'),
  tr('    SE valorProcurado == vetor[centro] ENTÃO', '    IF target == array[mid] THEN'),
  tr('      RETORNE centro', '      RETURN mid'),
  tr('    FIM SE', '    END IF'),
  tr('    SE valorProcurado < vetor[centro] ENTÃO', '    IF target < array[mid] THEN'),
  tr('      fim ← centro - 1', '      end ← mid - 1'),
  tr('    FIM SE', '    END IF'),
  tr('    SE valorProcurado > vetor[centro] ENTÃO', '    IF target > array[mid] THEN'),
  tr('      inicio ← centro + 1', '      start ← mid + 1'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM ENQUANTO', '  END WHILE'),
  tr('  RETORNE -1', '  RETURN -1'),
  tr('FIM', 'END'),
];
const BIN = {
  head: 0, start: 1, end: 2, loop: 3, mid: 4, equal: 5, found: 6, less: 8, lower: 9, greater: 11, upper: 12, none: 15,
};

const REC_CODE = [
  tr('FUNÇÃO buscaBinariaRecursiva(vetor, inicio, fim, valorProcurado)', 'FUNCTION recursiveBinarySearch(array, start, end, target)'),
  tr('  SE inicio > fim ENTÃO', '  IF start > end THEN'),
  tr('    RETORNE -1    // caso base: valor não encontrado', '    RETURN -1    // base case: value not found'),
  tr('  FIM SE', '  END IF'),
  tr('  meio ← (inicio + fim) / 2    // índice do meio', '  mid ← (start + end) / 2    // middle index'),
  tr('  SE vetor[meio] = valorProcurado ENTÃO', '  IF array[mid] = target THEN'),
  tr('    RETORNE meio    // índice onde o valor foi encontrado', '    RETURN mid    // index where the value was found'),
  tr('  SENÃO SE vetor[meio] < valorProcurado ENTÃO', '  ELSE IF array[mid] < target THEN'),
  tr('    RETORNE buscaBinariaRecursiva(vetor, meio + 1, fim, valorProcurado)    // metade superior', '    RETURN recursiveBinarySearch(array, mid + 1, end, target)    // upper half'),
  tr('  SENÃO', '  ELSE'),
  tr('    RETORNE buscaBinariaRecursiva(vetor, inicio, meio - 1, valorProcurado)    // metade inferior', '    RETURN recursiveBinarySearch(array, start, mid - 1, target)    // lower half'),
  tr('  FIM SE', '  END IF'),
  tr('FIM', 'END'),
];
const REC = {
  head: 0, base: 1, baseRet: 2, mid: 4, equal: 5, found: 6, less: 7, upper: 8, lower: 10,
};

// As análises mostram a busca sequencial e a binária no mesmo painel, uma função depois da outra.
const BOTH_CODE = [...ORD_CODE, '', ...BIN_CODE];
const OFFSET = ORD_CODE.length + 1;

// ---------------------------------------------------------------------------
// Custo das duas buscas, para os simuladores de análise e para a conferência.
// ---------------------------------------------------------------------------

/**
 * Posições examinadas pela busca binária, na ordem. `order(index)` diz de que lado está o valor
 * procurado em relação a `vetor[index]`: -1 (ele é menor), 0 (é igual) ou 1 (é maior).
 */
export function binaryPath(size, order) {
  const path = [];
  let start = 0;
  let end = size - 1;
  while (start <= end) {
    const center = Math.floor((start + end) / 2);
    path.push(center);
    const side = order(center);
    if (side === 0) return { path, found: center };
    if (side < 0) end = center - 1;
    else start = center + 1;
  }
  return { path, found: -1 };
}

const pathOf = (sorted, target) => binaryPath(sorted.length, (index) => Math.sign(target - sorted[index]));

/** Posições examinadas pelas buscas sequenciais (comum e otimizada), na ordem. */
function sequentialPath(sorted, target, ordered) {
  const path = [];
  for (let index = 0; index < sorted.length; index += 1) {
    path.push(index);
    if (sorted[index] === target) return { path, found: index };
    if (ordered && sorted[index] > target) return { path, found: -1 };
  }
  return { path, found: -1 };
}

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

const SORTED_NOTE = tr(' O simulador ordena os números que você digitar, porque esta busca exige um vetor ordenado.', ' The simulator sorts the numbers you type, because this search requires a sorted array.');

export const algorithms = [
  {
    id: 'sequencial', title: tr('Busca sequencial', 'Sequential search'), menuLabel: tr('Busca sequencial', 'Sequential search'), group: tr('Busca sequencial', 'Sequential search'), number: '01',
    description: tr('Percorra o vetor da primeira à última posição e compare cada valor com o procurado, até achá-lo ou chegar ao fim (slides 6 a 16). Funciona em qualquer vetor, ordenado ou não. Cada posição examinada conta uma comparação, como nos slides.', 'Go through the array from the first to the last position and compare each value with the target, until you find it or reach the end (slides 6 to 16). It works on any array, sorted or not. Each position examined counts as one comparison, as in the slides.'),
    interaction: tr('Digite um vetor e o valor procurado (ou use os exemplos). Procure o 62 do slide, o primeiro elemento (melhor caso) e um valor ausente (pior caso) e compare o número de comparações.', 'Type an array and a target value (or use the examples). Search for the 62 from the slide, the first element (best case) and a missing value (worst case) and compare the number of comparisons.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Melhor caso: o valor está na primeira posição, 1 comparação, O(1). Pior caso: está na última ou não está, n comparações, O(n). Caso médio: (n + 1) / 2 comparações. Só existem o índice i e o valor procurado, por isso o espaço é O(1).', 'Best case: the value is in the first position, 1 comparison, O(1). Worst case: it is in the last position or not there at all, n comparisons, O(n). Average case: (n + 1) / 2 comparisons. There are only the index i and the target, so the space is O(1).') },
    pseudocode: SEQ_CODE,
  },
  {
    id: 'ordenada', title: tr('Sequencial em vetor ordenado', 'Sequential search on a sorted array'), menuLabel: tr('Sequencial em vetor ordenado', 'Sequential on a sorted array'), group: tr('Busca sequencial', 'Sequential search'), number: '02',
    description: tr('Com o vetor ordenado, o primeiro valor maior que o procurado encerra a busca: depois dele só há valores ainda maiores (slides 21 a 30). É a otimização da busca sequencial.', 'With a sorted array, the first value larger than the target ends the search: after it there are only even larger values (slides 21 to 30). It is the optimization of the sequential search.') + SORTED_NOTE,
    interaction: tr('Procure o 65 do slide (que não está no vetor): a busca para no 79, na posição 7, e as posições 8 e 9 nem são examinadas. Depois procure um valor que existe.', 'Search for the 65 from the slide (which is not in the array): the search stops at 79, at position 7, and positions 8 and 9 are not even examined. Then search for a value that exists.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Achar o valor custa o mesmo que na busca comum. A diferença está no valor ausente: ela pode parar antes do fim, mas no pior caso (valor maior que todos) ainda examina as n posições. Continua O(n), com um teste a mais por posição.', 'Finding the value costs the same as in the plain search. The difference is a missing value: it can stop before the end, but in the worst case (a value larger than all of them) it still examines all n positions. It is still O(n), with one extra test per position.') },
    pseudocode: ORD_CODE,
  },
  {
    id: 'iterativa', title: tr('Busca binária iterativa', 'Iterative binary search'), menuLabel: tr('Binária iterativa', 'Iterative binary'), group: tr('Busca binária', 'Binary search'), number: '03',
    description: tr('Compare o valor procurado com o elemento do centro e descarte a metade que não pode conter o valor, repetindo com a outra metade (slides 32 a 37). É dividir para conquistar: o vetor precisa estar ordenado.', 'Compare the target with the middle element and discard the half that cannot contain it, repeating with the other half (slides 32 to 37). It is divide and conquer: the array must be sorted.') + SORTED_NOTE,
    interaction: tr('Procure o 56 (slide 33, 3 comparações) e o 73 (slide 35, que não existe, 4 comparações). Acompanhe início, centro e fim e veja o trecho candidato encolher pela metade.', 'Search for 56 (slide 33, 3 comparisons) and 73 (slide 35, which does not exist, 4 comparisons). Follow start, mid and end and watch the candidate range shrink by half.'),
    complexity: { time: 'O(log n)', space: 'O(1)', note: tr('Cada comparação descarta metade dos candidatos: n, n/2, n/4... Quando n/2^k chega a 1 o laço termina, depois de cerca de log₂ n + 1 comparações. Melhor caso: o valor está no centro, 1 comparação. Só existem inicio, fim e centro, por isso o espaço é O(1).', 'Each comparison discards half of the candidates: n, n/2, n/4... When n/2^k reaches 1 the loop ends, after about log₂ n + 1 comparisons. Best case: the value is in the middle, 1 comparison. There are only start, end and mid, so the space is O(1).') },
    pseudocode: BIN_CODE,
  },
  {
    id: 'recursiva', title: tr('Busca binária recursiva', 'Recursive binary search'), menuLabel: tr('Binária recursiva', 'Recursive binary'), group: tr('Busca binária', 'Binary search'), number: '04',
    description: tr('A mesma busca escrita com recursão (slides 38 e 39): em vez de um laço, a função chama a si mesma com a metade superior ou a inferior do trecho. O caso base é o trecho vazio (inicio > fim).', 'The same search written with recursion (slides 38 and 39): instead of a loop, the function calls itself with the upper or the lower half of the range. The base case is the empty range (start > end).') + SORTED_NOTE,
    interaction: tr('Acompanhe a pilha de chamadas crescer, uma chamada por metade examinada, e depois o valor voltar de chamada em chamada até o programa. Compare com a versão iterativa.', 'Follow the call stack grow, one call for each half examined, and then the value come back from call to call to the program. Compare with the iterative version.'),
    complexity: { time: 'O(log n)', space: 'O(log n)', note: tr('São as mesmas comparações da versão iterativa, uma por chamada. A diferença é a pilha: cada metade examinada deixa uma chamada pendente, então a pilha chega a cerca de log₂ n + 1 frames (a versão iterativa usa espaço constante).', 'These are the same comparisons as the iterative version, one per call. The difference is the stack: each half examined leaves a call pending, so the stack reaches about log₂ n + 1 frames (the iterative version uses constant space).') },
    pseudocode: REC_CODE,
  },
  {
    id: 'comparacao', title: tr('Sequencial × binária', 'Sequential × binary'), menuLabel: tr('Sequencial × binária', 'Sequential × binary'), group: tr('Comparando as buscas', 'Comparing the searches'), number: '05',
    description: tr('A mesma busca nas duas versões em paralelo: a sequencial, a otimizada e a binária (slides 34 e 36). Quantas comparações cada uma faz até achar o valor, ou até concluir que ele não existe?', 'The same search in the two versions in parallel: the sequential, the optimized one and the binary (slides 34 and 36). How many comparisons does each one make until it finds the value, or concludes that it does not exist?') + SORTED_NOTE,
    interaction: tr('Procure o 56 (6 contra 3 comparações) e o 73 (8 contra 4, como nos slides; a sequencial comum faria 10). Depois aumente o vetor e veja a diferença crescer.', 'Search for 56 (6 against 3 comparisons) and 73 (8 against 4, as in the slides; the plain sequential search would make 10). Then make the array bigger and watch the difference grow.'),
    complexity: { time: 'O(n) × O(log n)', space: 'O(1)', note: tr('Todas as buscas examinam uma posição por rodada. A sequencial anda de um em um e a binária pula metade dos candidatos por vez, mas só vale a pena quando o vetor já está ordenado (slide 44: manter o vetor ordenado tem custo alto).', 'Every search examines one position per round. The sequential one walks one by one and the binary one skips half of the candidates at a time, but it only pays off when the array is already sorted (slide 44: keeping the array sorted is expensive).') },
    pseudocode: BOTH_CODE,
  },
  {
    id: 'casos', title: tr('Melhor, médio e pior caso', 'Best, average and worst case'), menuLabel: tr('Melhor, médio e pior caso', 'Best, average and worst case'), group: tr('Comparando as buscas', 'Comparing the searches'), number: '06',
    description: tr('Procure, um a um, todos os valores do vetor e conte as comparações da busca sequencial e da binária (slides 17 a 19 e 40 a 43). O melhor, o pior e o caso médio aparecem no fim.', 'Search for every value of the array, one by one, and count the comparisons of the sequential and the binary search (slides 17 to 19 and 40 to 43). The best, the worst and the average case appear at the end.') + SORTED_NOTE,
    interaction: tr('Acompanhe as barras: a sequencial cresce de 1 até n; a binária quase não passa de log₂ n + 1. Compare a média com (n + 1) / 2 e escolha um vetor com 10, 12 ou 16 números.', 'Follow the bars: the sequential one grows from 1 to n; the binary one barely goes past log₂ n + 1. Compare the average with (n + 1) / 2 and try an array with 10, 12 or 16 numbers.'),
    complexity: { time: 'O(n) × O(log n)', space: 'O(1)', note: tr('Sequencial: melhor caso 1, pior caso n, média (n + 1) / 2. Binária: melhor caso 1 (o centro), pior caso ⌊log₂ n⌋ + 1 e média próxima do pior caso, porque a maior parte dos elementos fica nos últimos níveis da divisão.', 'Sequential: best case 1, worst case n, average (n + 1) / 2. Binary: best case 1 (the middle), worst case ⌊log₂ n⌋ + 1 and an average close to the worst case, because most of the elements are in the last levels of the division.') },
    pseudocode: BOTH_CODE,
  },
  {
    id: 'crescimento', title: tr('Crescimento do custo', 'Growth of the cost'), menuLabel: tr('Crescimento do custo (log n)', 'Growth of the cost (log n)'), group: tr('Comparando as buscas', 'Comparing the searches'), number: '07',
    description: tr('No pior caso da busca binária o vetor é dividido ao meio a cada comparação: n, n/2, n/4... até sobrar um só candidato (slide 42). Veja quantas comparações cada busca faz para um vetor de n posições (slide 45).', 'In the worst case of the binary search the array is halved at each comparison: n, n/2, n/4... until a single candidate is left (slide 42). See how many comparisons each search makes for an array of n positions (slide 45).'),
    interaction: tr('Escolha n (de 1 a 1.000.000.000) e avance: a busca binária zera os candidatos em ⌊log₂ n⌋ + 1 passos, enquanto a sequencial ainda tem quase todos. Dobre n e veja que o custo da binária só ganha 1 comparação.', 'Choose n (from 1 to 1,000,000,000) and step forward: the binary search runs out of candidates in ⌊log₂ n⌋ + 1 steps, while the sequential one still has almost all of them. Double n and see that the cost of the binary search only gains 1 comparison.'),
    complexity: { time: 'O(log n)', space: 'O(1)', note: tr('Dobrar o tamanho do vetor custa uma comparação a mais na busca binária e o dobro na sequencial. Com 1 bilhão de posições, a binária faz no máximo 30 comparações.', 'Doubling the size of the array costs one more comparison in the binary search and twice as many in the sequential one. With 1 billion positions, the binary search makes at most 30 comparisons.') },
    pseudocode: BIN_CODE,
  },
];

// ---------------------------------------------------------------------------
// 01 e 02 · Busca sequencial (comum e em vetor ordenado)
// ---------------------------------------------------------------------------

function sequentialSteps(values, target, ordered) {
  const a = ordered ? ascending(values) : [...values];
  const n = a.length;
  const L = ordered ? ORD : SEQ;
  const name = ordered ? NAME.ord : NAME.seq;
  const call = `${name}(${tr('vetor', 'array')}, ${fmt(target)})`;
  const scope = { valorProcurado: target, i: NONE };
  let count = 0;
  const at = (extra = {}) => ({ stats: { 'comparações': count }, variables: { ...scope }, ...extra });
  const finish = (index, title, description, line, extra) => step(a, line, title, description, 'done', at({
    ...extra,
    variables: { ...scope, retorno: index },
    output: [`${call} = ${index}`],
  }));

  const steps = [
    step(a, L.head, tr(`Chamada ${call}`, `Call ${call}`), ordered
      ? tr(`O vetor foi ordenado e tem ${n} posições. A busca procura o valor ${fmt(target)} da primeira posição em diante e vai parar se achar o valor ou um valor maior que ele. i ainda não foi atribuído.`, `The array was sorted and has ${n} positions. The search looks for the value ${fmt(target)} from the first position on and will stop if it finds the value or a value larger than it. i has not been assigned yet.`)
      : tr(`O vetor tem ${n} posições e não precisa estar ordenado. A busca procura o valor ${fmt(target)} da primeira posição em diante, uma a uma. i ainda não foi atribuído.`, `The array has ${n} positions and does not need to be sorted. The search looks for the value ${fmt(target)} from the first position on, one by one. i has not been assigned yet.`), 'neutral', at()),
  ];

  for (let i = 0; i < n; i += 1) {
    scope.i = i;
    const outsideIndices = range(i);
    steps.push(step(a, L.loop, tr(`PARA i (i = ${i})`, `FOR i (i = ${i})`), tr(`i recebe ${i} e a condição i ≤ ${n - 1} é verdadeira: o laço entra e vai examinar a ${where(i)}.`, `i receives ${i} and the condition i ≤ ${n - 1} is true: the loop is entered and will examine ${where(i)}.`), 'reading', at({
      pointers: { i }, activeIndices: [i], outsideIndices,
    })));

    count += 1;
    const hit = a[i] === target;
    steps.push(step(a, L.test, tr('SE vetor[i] = valorProcurado', 'IF array[i] = target'), hit
      ? tr(`vetor[${i}] = valorProcurado → ${fmt(a[i])} = ${fmt(target)} é verdadeiro: achamos o valor na ${where(i)}, na comparação número ${count}.`, `array[${i}] = target → ${fmt(a[i])} = ${fmt(target)} is true: we found the value at ${where(i)}, on comparison number ${count}.`)
      : tr(`vetor[${i}] = valorProcurado → ${fmt(a[i])} = ${fmt(target)} é falso: ${fmt(a[i])} não é o valor procurado${ordered ? '. Falta ver se ele já passou do valor' : ' e o laço segue para a próxima posição'}.`, `array[${i}] = target → ${fmt(a[i])} = ${fmt(target)} is false: ${fmt(a[i])} is not the target${ordered ? '. We still have to see whether it has gone past the target' : ' and the loop moves on to the next position'}.`), hit ? 'success' : 'comparison', at({
      pointers: { i },
      compare: cmp(V(i, a[i]), '=', T(target), hit),
      activeIndices: hit ? [] : [i],
      foundIndices: hit ? [i] : [],
      outsideIndices,
    })));

    if (hit) {
      steps.push(finish(i, tr(`Retorna ${i}`, `Returns ${i}`), tr(`${name} devolve ${i}, o índice de ${fmt(target)}, depois de ${plural(count, 'comparação', 'comparações')}. Se o valor fosse o primeiro elemento seriam só 1 (melhor caso); se fosse o último ou não existisse, ${n} (pior caso).`, `${name} returns ${i}, the index of ${fmt(target)}, after ${plural(count, 'comparison', 'comparisons')}. If the value were the first element it would take just 1 (best case); if it were the last or did not exist, ${n} (worst case).`), L.found, {
        pointers: { i }, foundIndices: [i], outsideIndices,
      }));
      return steps;
    }

    if (ordered) {
      const greater = a[i] > target;
      steps.push(step(a, L.greater, tr('SE vetor[i] > valorProcurado', 'IF array[i] > target'), greater
        ? tr(`vetor[${i}] > valorProcurado → ${fmt(a[i])} > ${fmt(target)} é verdadeiro: o vetor é ordenado, então depois da ${where(i)} só há valores ainda maiores. ${fmt(target)} não pode estar no vetor.`, `array[${i}] > target → ${fmt(a[i])} > ${fmt(target)} is true: the array is sorted, so after ${where(i)} there are only even larger values. ${fmt(target)} cannot be in the array.`)
        : tr(`vetor[${i}] > valorProcurado → ${fmt(a[i])} > ${fmt(target)} é falso: ${fmt(a[i])} ainda é menor que ${fmt(target)}, que pode estar mais à frente. O laço continua.`, `array[${i}] > target → ${fmt(a[i])} > ${fmt(target)} is false: ${fmt(a[i])} is still smaller than ${fmt(target)}, which may be further ahead. The loop continues.`), greater ? 'success' : 'comparison', at({
        pointers: { i }, compare: cmp(V(i, a[i]), '>', T(target), greater), activeIndices: [i], outsideIndices,
      })));
      if (greater) {
        const skipped = n - 1 - i;
        steps.push(finish(-1, tr('Retorna -1', 'Returns -1'), tr(`${name} devolve -1 depois de ${plural(count, 'comparação', 'comparações')}: ${fmt(target)} não está no vetor. A busca parou na ${where(i)} e ${skipped === 0 ? 'não havia posições a mais' : `economizou ${plural(skipped, 'posição', 'posições')}`} (a busca comum examinaria as ${n}).`, `${name} returns -1 after ${plural(count, 'comparison', 'comparisons')}: ${fmt(target)} is not in the array. The search stopped at ${where(i)} and ${skipped === 0 ? 'there were no more positions' : `saved ${plural(skipped, 'position', 'positions')}`} (the plain search would examine all ${n}).`), L.stop, {
          pointers: { i }, outsideIndices: range(i + 1),
        }));
        return steps;
      }
    }
  }

  scope.i = n;
  steps.push(step(a, L.loop, tr(`PARA i (i = ${n}): fim`, `FOR i (i = ${n}): end`), tr(`i recebe ${n} e a condição i ≤ ${n - 1} é falsa: o laço termina, porque o vetor acabou sem que o valor aparecesse.`, `i receives ${n} and the condition i ≤ ${n - 1} is false: the loop ends, because the array ran out without the value showing up.`), 'success', at({ outsideIndices: range(n) })));
  steps.push(finish(-1, tr('Retorna -1', 'Returns -1'), tr(`${name} devolve -1 depois de ${plural(count, 'comparação', 'comparações')}: ${fmt(target)} não está no vetor. Esse é o pior caso: todas as ${n} posições foram examinadas.`, `${name} returns -1 after ${plural(count, 'comparison', 'comparisons')}: ${fmt(target)} is not in the array. This is the worst case: all ${n} positions were examined.`), L.none, { outsideIndices: range(n) }));
  return steps;
}

// ---------------------------------------------------------------------------
// 03 · Busca binária iterativa
// ---------------------------------------------------------------------------

function iterativeSteps(values, target) {
  const a = ascending(values);
  const n = a.length;
  const call = `${NAME.it}(${tr('vetor', 'array')}, ${fmt(target)})`;
  const scope = {
    valorProcurado: target, inicio: NONE, fim: NONE, centro: NONE,
  };
  let count = 0;
  const outside = () => (scope.inicio === NONE ? [] : range(n).filter((index) => index < scope.inicio || index > scope.fim));
  const pointers = () => {
    const found = {};
    if (scope.inicio !== NONE) found.inicio = scope.inicio;
    if (scope.centro !== NONE) found.centro = scope.centro;
    if (scope.fim !== NONE) found.fim = scope.fim;
    return found;
  };
  const phase = () => {
    if (scope.fim === NONE) return undefined;
    const size = Math.max(0, scope.fim - scope.inicio + 1);
    return { label: `[${scope.inicio}..${scope.fim}]`, text: size === 0 ? tr('nenhum candidato', 'no candidates left') : tr(`${plural(size, 'candidato', 'candidatos')}: posições ${scope.inicio} a ${scope.fim}`, `${plural(size, 'candidate', 'candidates')}: positions ${scope.inicio} to ${scope.fim}`), code: true };
  };
  const at = (extra = {}) => ({
    stats: { 'comparações': count }, variables: { ...scope }, pointers: pointers(), outsideIndices: outside(), phase: phase(), ...extra,
  });
  const put = (line, title, description, tone, extra) => steps.push(step(a, line, title, description, tone, at(extra)));
  const steps = [];

  put(BIN.head, tr(`Chamada ${call}`, `Call ${call}`), tr(`O vetor foi ordenado e tem ${n} posições. A busca procura ${fmt(target)} examinando sempre o elemento do centro do trecho que ainda pode conter o valor. inicio, fim e centro ainda não foram atribuídos.`, `The array was sorted and has ${n} positions. The search looks for ${fmt(target)} by always examining the middle element of the range that can still contain the value. start, end and mid have not been assigned yet.`), 'neutral');
  scope.inicio = 0;
  put(BIN.start, tr('inicio ← 0', 'start ← 0'), tr('inicio recebe 0, a primeira posição: no começo, todo o vetor é candidato.', 'start receives 0, the first position: at the beginning, the whole array is a candidate.'), 'update');
  scope.fim = n - 1;
  put(BIN.end, tr('fim ← tamanho(vetor) - 1', 'end ← length(array) - 1'), tr(`fim recebe ${n - 1}, a última posição. O trecho candidato vai de ${scope.inicio} a ${scope.fim}.`, `end receives ${n - 1}, the last position. The candidate range goes from ${scope.inicio} to ${scope.fim}.`), 'update');

  for (;;) {
    const open = scope.inicio <= scope.fim;
    put(BIN.loop, tr('ENQUANTO inicio <= fim', 'WHILE start <= end'), open
      ? tr(`inicio <= fim → ${scope.inicio} <= ${scope.fim} é verdadeiro: ainda há posições candidatas (${plural(scope.fim - scope.inicio + 1, 'candidata', 'candidatas')}) e o laço entra.`, `start <= end → ${scope.inicio} <= ${scope.fim} is true: there are still candidate positions (${plural(scope.fim - scope.inicio + 1, 'candidate', 'candidates')}) and the loop is entered.`)
      : tr(`inicio <= fim → ${scope.inicio} <= ${scope.fim} é falso: o trecho candidato ficou vazio, então o valor ${fmt(target)} não está no vetor. O laço termina.`, `start <= end → ${scope.inicio} <= ${scope.fim} is false: the candidate range became empty, so the value ${fmt(target)} is not in the array. The loop ends.`), open ? 'reading' : 'success', {
      compare: cmp({ label: tr('inicio', 'start'), value: String(scope.inicio) }, '<=', { label: tr('fim', 'end'), value: String(scope.fim) }, open),
    });
    if (!open) break;

    scope.centro = Math.floor((scope.inicio + scope.fim) / 2);
    count += 1;
    const center = scope.centro;
    put(BIN.mid, tr('centro ← (inicio + fim) / 2', 'mid ← (start + end) / 2'), tr(`centro recebe (${scope.inicio} + ${scope.fim}) / 2 = ${center}, em divisão inteira (sem a parte fracionária). Comparação número ${count}: vamos examinar vetor[${center}] = ${fmt(a[center])}.`, `mid receives (${scope.inicio} + ${scope.fim}) / 2 = ${center}, in integer division (without the fractional part). Comparison number ${count}: we will examine array[${center}] = ${fmt(a[center])}.`), 'update', { activeIndices: [center] });

    const equal = a[center] === target;
    put(BIN.equal, tr('SE valorProcurado == vetor[centro]', 'IF target == array[mid]'), equal
      ? tr(`valorProcurado == vetor[centro] → ${fmt(target)} == ${fmt(a[center])} é verdadeiro: achamos o valor na ${where(center)}.`, `target == array[mid] → ${fmt(target)} == ${fmt(a[center])} is true: we found the value at ${where(center)}.`)
      : tr(`valorProcurado == vetor[centro] → ${fmt(target)} == ${fmt(a[center])} é falso: o centro não é o valor. Os dois próximos testes dizem em qual metade ele pode estar.`, `target == array[mid] → ${fmt(target)} == ${fmt(a[center])} is false: the middle is not the value. The next two tests say which half it may be in.`), equal ? 'success' : 'comparison', {
      compare: cmp(T(target), '==', V(center, a[center]), equal), activeIndices: equal ? [] : [center], foundIndices: equal ? [center] : [],
    });
    if (equal) {
      scope.retorno = center;
      steps.push(step(a, BIN.found, tr(`Retorna ${center}`, `Returns ${center}`), tr(`${NAME.it} devolve ${center}, o índice de ${fmt(target)}, depois de ${plural(count, 'comparação', 'comparações')} (a busca sequencial precisaria de ${center + 1} nesse vetor).`, `${NAME.it} returns ${center}, the index of ${fmt(target)}, after ${plural(count, 'comparison', 'comparisons')} (the sequential search would need ${center + 1} on this array).`), 'done', at({
        foundIndices: [center], variables: { ...scope }, output: [`${call} = ${center}`],
      })));
      return steps;
    }

    const lower = target < a[center];
    put(BIN.less, tr('SE valorProcurado < vetor[centro]', 'IF target < array[mid]'), lower
      ? tr(`valorProcurado < vetor[centro] → ${fmt(target)} < ${fmt(a[center])} é verdadeiro: como o vetor é ordenado, o valor só pode estar à esquerda do centro.`, `target < array[mid] → ${fmt(target)} < ${fmt(a[center])} is true: since the array is sorted, the value can only be to the left of the middle.`)
      : tr(`valorProcurado < vetor[centro] → ${fmt(target)} < ${fmt(a[center])} é falso: o valor não está à esquerda do centro.`, `target < array[mid] → ${fmt(target)} < ${fmt(a[center])} is false: the value is not to the left of the middle.`), lower ? 'success' : 'comparison', {
      compare: cmp(T(target), '<', V(center, a[center]), lower), activeIndices: [center],
    });
    if (lower) {
      scope.fim = center - 1;
      put(BIN.lower, tr('fim ← centro - 1', 'end ← mid - 1'), tr(`fim recebe ${center} - 1 = ${scope.fim}: a metade da direita, com o próprio centro, foi descartada. O trecho candidato agora vai de ${scope.inicio} a ${scope.fim}.`, `end receives ${center} - 1 = ${scope.fim}: the right half, including the middle itself, was discarded. The candidate range now goes from ${scope.inicio} to ${scope.fim}.`), 'update', { activeIndices: [center] });
    }

    const upper = target > a[center];
    put(BIN.greater, tr('SE valorProcurado > vetor[centro]', 'IF target > array[mid]'), upper
      ? tr(`valorProcurado > vetor[centro] → ${fmt(target)} > ${fmt(a[center])} é verdadeiro: o valor só pode estar à direita do centro.`, `target > array[mid] → ${fmt(target)} > ${fmt(a[center])} is true: the value can only be to the right of the middle.`)
      : tr(`valorProcurado > vetor[centro] → ${fmt(target)} > ${fmt(a[center])} é falso. O código não usa SENÃO: o terceiro teste também roda quando o segundo foi verdadeiro, e nesse caso ele só confirma que não há nada a fazer.`, `target > array[mid] → ${fmt(target)} > ${fmt(a[center])} is false. The code does not use ELSE: the third test also runs when the second one was true, and in that case it just confirms there is nothing left to do.`), upper ? 'success' : 'comparison', {
      compare: cmp(T(target), '>', V(center, a[center]), upper), activeIndices: [center],
    });
    if (upper) {
      scope.inicio = center + 1;
      put(BIN.upper, tr('inicio ← centro + 1', 'start ← mid + 1'), tr(`inicio recebe ${center} + 1 = ${scope.inicio}: a metade da esquerda, com o próprio centro, foi descartada. O trecho candidato agora vai de ${scope.inicio} a ${scope.fim}.`, `start receives ${center} + 1 = ${scope.inicio}: the left half, including the middle itself, was discarded. The candidate range now goes from ${scope.inicio} to ${scope.fim}.`), 'update', { activeIndices: [center] });
    }
  }

  scope.retorno = -1;
  steps.push(step(a, BIN.none, tr('Retorna -1', 'Returns -1'), tr(`${NAME.it} devolve -1 depois de ${plural(count, 'comparação', 'comparações')}: ${fmt(target)} não está no vetor. Mesmo no pior caso, com ${n} posições, a busca binária faz no máximo ${Math.floor(Math.log2(n)) + 1} comparações.`, `${NAME.it} returns -1 after ${plural(count, 'comparison', 'comparisons')}: ${fmt(target)} is not in the array. Even in the worst case, with ${n} positions, the binary search makes at most ${Math.floor(Math.log2(n)) + 1} comparisons.`), 'done', at({
    variables: { ...scope }, output: [`${call} = -1`],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Busca binária recursiva, com a pilha de chamadas
// ---------------------------------------------------------------------------

function recursiveSteps(values, target) {
  const a = ascending(values);
  const n = a.length;
  const t = createTracer();
  const call = (start, end) => `${NAME.rec}(${start}, ${end})`;
  const root = call(0, n - 1);
  let count = 0;

  const put = (line, title, description, tone, frame, extra = {}) => {
    const { inicio, fim, meio } = frame ? frame.vars : {};
    const live = frame ? range(n).filter((index) => index < inicio || index > fim) : [];
    const variables = frame
      ? {
        valorProcurado: fmt(target), inicio: show(inicio), fim: show(fim), meio: show(meio), ...(frame.result === undefined ? {} : { retorno: show(frame.result) }),
      }
      : { valorProcurado: fmt(target) };
    t.add(line, title, description, tone, {
      values: [...a],
      pointers: frame ? { inicio, fim, ...(meio === undefined ? {} : { meio }) } : {},
      outsideIndices: live,
      variables,
      stats: { 'comparações': count, profundidade: t.depth() },
      ...extra,
    });
  };

  const run = (frame) => {
    const { inicio, fim } = frame.vars;
    const empty = inicio > fim;
    put(REC.base, tr('SE inicio > fim', 'IF start > end'), empty
      ? tr(`inicio > fim → ${inicio} > ${fim} é verdadeiro: o trecho está vazio, não sobrou nenhuma posição candidata. É o caso base: ${fmt(target)} não está no vetor.`, `start > end → ${inicio} > ${fim} is true: the range is empty, no candidate position is left. It is the base case: ${fmt(target)} is not in the array.`)
      : tr(`inicio > fim → ${inicio} > ${fim} é falso: o trecho ${inicio} a ${fim} ainda tem ${plural(fim - inicio + 1, 'candidata', 'candidatas')}, então a busca continua.`, `start > end → ${inicio} > ${fim} is false: the range ${inicio} to ${fim} still has ${plural(fim - inicio + 1, 'candidate', 'candidates')}, so the search goes on.`), empty ? 'success' : 'comparison', frame, {
      compare: cmp({ label: tr('inicio', 'start'), value: String(inicio) }, '>', { label: tr('fim', 'end'), value: String(fim) }, empty),
    });
    if (empty) {
      frame.result = -1;
      put(REC.baseRet, tr('Retorna -1', 'Returns -1'), tr(`${frame.name} devolve -1, sem nenhuma nova chamada. Ela sai da pilha e o -1 volta de chamada em chamada.`, `${frame.name} returns -1, with no new call. It leaves the stack and the -1 goes back from call to call.`), 'success', frame, { action: actionReturn(-1) });
      return -1;
    }

    frame.vars.meio = Math.floor((inicio + fim) / 2);
    count += 1;
    const { meio } = frame.vars;
    put(REC.mid, tr('meio ← (inicio + fim) / 2', 'mid ← (start + end) / 2'), tr(`meio recebe (${inicio} + ${fim}) / 2 = ${meio}, em divisão inteira. Comparação número ${count}: vamos examinar vetor[${meio}] = ${fmt(a[meio])}.`, `mid receives (${inicio} + ${fim}) / 2 = ${meio}, in integer division. Comparison number ${count}: we will examine array[${meio}] = ${fmt(a[meio])}.`), 'update', frame, { activeIndices: [meio] });

    const equal = a[meio] === target;
    put(REC.equal, tr('SE vetor[meio] = valorProcurado', 'IF array[mid] = target'), equal
      ? tr(`vetor[meio] = valorProcurado → ${fmt(a[meio])} = ${fmt(target)} é verdadeiro: achamos o valor na ${where(meio)}.`, `array[mid] = target → ${fmt(a[meio])} = ${fmt(target)} is true: we found the value at ${where(meio)}.`)
      : tr(`vetor[meio] = valorProcurado → ${fmt(a[meio])} = ${fmt(target)} é falso: o meio não é o valor.`, `array[mid] = target → ${fmt(a[meio])} = ${fmt(target)} is false: the middle is not the value.`), equal ? 'success' : 'comparison', frame, {
      compare: cmp(V(meio, a[meio]), '=', T(target), equal), activeIndices: equal ? [] : [meio], foundIndices: equal ? [meio] : [],
    });
    if (equal) {
      frame.result = meio;
      put(REC.found, tr(`Retorna ${meio}`, `Returns ${meio}`), tr(`${frame.name} devolve ${meio}, o índice de ${fmt(target)}, e sai da pilha. A chamada de baixo só repassa esse valor.`, `${frame.name} returns ${meio}, the index of ${fmt(target)}, and leaves the stack. The call below just passes this value along.`), 'success', frame, { foundIndices: [meio], action: actionReturn(meio) });
      return meio;
    }

    const below = a[meio] < target;
    put(REC.less, tr('SENÃO SE vetor[meio] < valorProcurado', 'ELSE IF array[mid] < target'), below
      ? tr(`vetor[meio] < valorProcurado → ${fmt(a[meio])} < ${fmt(target)} é verdadeiro: o valor só pode estar à direita do meio, na metade superior.`, `array[mid] < target → ${fmt(a[meio])} < ${fmt(target)} is true: the value can only be to the right of the middle, in the upper half.`)
      : tr(`vetor[meio] < valorProcurado → ${fmt(a[meio])} < ${fmt(target)} é falso: o SENÃO executa, e o valor só pode estar à esquerda do meio, na metade inferior.`, `array[mid] < target → ${fmt(a[meio])} < ${fmt(target)} is false: the ELSE runs, and the value can only be to the left of the middle, in the lower half.`), below ? 'success' : 'comparison', frame, {
      compare: cmp(V(meio, a[meio]), '<', T(target), below), activeIndices: [meio],
    });

    const [nextStart, nextEnd] = below ? [meio + 1, fim] : [inicio, meio - 1];
    const childName = call(nextStart, nextEnd);
    const child = { name: childName, vars: { inicio: nextStart, fim: nextEnd, meio: undefined }, note: '' };
    frame.note = tr('espera a volta', 'waits for the return');
    t.push(child);
    put(below ? REC.upper : REC.lower, tr(`Chama ${childName}`, `Calls ${childName}`), below
      ? tr(`${frame.name} chama ${childName} com a metade superior (${nextStart} a ${nextEnd}). A chamada entra na pilha e a de baixo fica esperando o valor que ela devolver.`, `${frame.name} calls ${childName} with the upper half (${nextStart} to ${nextEnd}). The call goes onto the stack and the one below waits for the value it returns.`)
      : tr(`${frame.name} chama ${childName} com a metade inferior (${nextStart} a ${nextEnd}). A chamada entra na pilha e a de baixo fica esperando o valor que ela devolver.`, `${frame.name} calls ${childName} with the lower half (${nextStart} to ${nextEnd}). The call goes onto the stack and the one below waits for the value it returns.`), 'neutral', child, { action: actionPush(childName) });
    const result = run(child);
    t.pop();
    frame.note = '';
    frame.result = result;
    put(below ? REC.upper : REC.lower, tr(`Retorna ${result}`, `Returns ${result}`), tr(`${childName} voltou com ${result}. ${frame.name} devolve o mesmo valor e sai da pilha: a recursão não faz nenhuma conta na volta.`, `${childName} came back with ${result}. ${frame.name} returns the same value and leaves the stack: the recursion does no calculation on the way back.`), 'success', frame, { action: actionReturn(result) });
    return result;
  };

  const first = { name: root, vars: { inicio: 0, fim: n - 1, meio: undefined }, note: '' };
  t.push(first);
  put(REC.head, tr(`Chamada ${root}`, `Call ${root}`), tr(`O vetor foi ordenado e tem ${n} posições. O programa chama ${root}: a primeira chamada olha o vetor inteiro, de 0 a ${n - 1}, em busca de ${fmt(target)}.`, `The array was sorted and has ${n} positions. The program calls ${root}: the first call looks at the whole array, from 0 to ${n - 1}, searching for ${fmt(target)}.`), 'neutral', first, { action: actionPush(root) });
  const result = run(first);
  t.pop();
  t.log.push(`${NAME.rec}(${tr('vetor', 'array')}, 0, ${n - 1}, ${fmt(target)}) = ${result}`);
  put(-1, tr('Pilha vazia', 'Empty stack'), result === -1
    ? tr(`Todas as chamadas voltaram e a pilha ficou vazia: ${root} devolveu -1 ao programa, porque ${fmt(target)} não está no vetor. Foram ${plural(count, 'comparação', 'comparações')} e a pilha chegou a ${plural(count + 1, 'frame', 'frames')}.`, `All the calls came back and the stack is empty: ${root} returned -1 to the program, because ${fmt(target)} is not in the array. There were ${plural(count, 'comparison', 'comparisons')} and the stack reached ${plural(count + 1, 'frame', 'frames')}.`)
    : tr(`Todas as chamadas voltaram e a pilha ficou vazia: ${root} devolveu ${result} ao programa, o índice de ${fmt(target)}. Foram ${plural(count, 'comparação', 'comparações')} e a pilha chegou a ${plural(count, 'frame', 'frames')}.`, `All the calls came back and the stack is empty: ${root} returned ${result} to the program, the index of ${fmt(target)}. There were ${plural(count, 'comparison', 'comparisons')} and the stack reached ${plural(count, 'frame', 'frames')}.`), 'done', null, {
    variables: { valorProcurado: fmt(target), retorno: result },
    foundIndices: result === -1 ? [] : [result],
    outsideIndices: result === -1 ? range(n) : [],
    action: actionReturn(result, tr('Devolve ao programa', 'Returns to the program')),
  });
  return t.finish();
}

// ---------------------------------------------------------------------------
// 05 · Sequencial × binária, em paralelo
// ---------------------------------------------------------------------------

function raceSteps(values, target) {
  const a = ascending(values);
  const n = a.length;
  const rows = [
    {
      key: 'plain', label: tr('Sequencial', 'Sequential'), ...sequentialPath(a, target, false), narrows: false,
    },
    {
      key: 'ordered', label: tr('Sequencial otimizada (vetor ordenado)', 'Optimized sequential (sorted array)'), ...sequentialPath(a, target, true), narrows: false,
    },
    {
      key: 'binary', label: tr('Binária', 'Binary'), ...pathOf(a, target), narrows: true,
    },
  ];
  const rounds = Math.max(...rows.map((row) => row.path.length));
  const best = Math.min(...rows.map((row) => row.path.length));

  /** Estado de cada linha depois de `round` rodadas. */
  const view = (round) => rows.map((row) => {
    const done = row.path.length <= round;
    const taken = row.path.slice(0, round);
    const current = round > 0 && round <= row.path.length ? row.path[round - 1] : null;
    let seen = taken.filter((index) => index !== current);
    if (row.narrows) {
      // A binária descarta tudo o que ficou fora do trecho que sobrou depois da última comparação.
      let start = 0;
      let end = n - 1;
      taken.forEach((center) => {
        if (a[center] === target) return;
        if (target < a[center]) end = center - 1;
        else start = center + 1;
      });
      seen = range(n).filter((index) => (index < start || index > end) && index !== current);
    }
    const found = done && row.found >= 0 ? row.found : null;
    return {
      label: row.label, values: a, comparisons: taken.length, current, seen, found, done, result: done ? row.found : null,
    };
  });

  const result = (row) => (row.found >= 0 ? tr(`achou na ${where(row.found)}`, `found at ${where(row.found)}`) : tr('não encontrado', 'not found'));
  const summary = rows.map((row) => `${row.label}: ${row.path.length}`).join(' · ');
  const plainCost = rows[0].path.length;
  const at = (round, extra) => ({ race: view(round), variables: { valorProcurado: target, 'rodada': round }, ...extra });

  const steps = [
    step(a, [2, OFFSET + 5], tr('As três buscas, o mesmo valor', 'The three searches, the same value'), tr(`Vetor ordenado com ${n} posições e valor procurado ${fmt(target)}. Em cada rodada, cada busca examina uma posição (uma comparação, como nos slides). Qual delas chega primeiro à resposta?`, `Sorted array with ${n} positions and target ${fmt(target)}. In each round, each search examines one position (one comparison, as in the slides). Which one reaches the answer first?`), 'neutral', at(0, { stats: undefined })),
  ];

  for (let round = 1; round <= rounds; round += 1) {
    const state = view(round);
    const text = rows.map((row, index) => {
      if (round > row.path.length) return tr(`${row.label}: já terminou (${result(row)})`, `${row.label}: already finished (${result(row)})`);
      const index2 = row.path[round - 1];
      const hit = row.found === index2;
      return tr(`${row.label}: ${where(index2)} (${fmt(a[index2])})${hit ? ', achou!' : ''}`, `${row.label}: ${where(index2)} (${fmt(a[index2])})${hit ? ', found!' : ''}`) + (state[index].done && !hit ? tr(' — e conclui que o valor não existe', ' — and concludes the value does not exist') : '');
    }).join(' · ');
    const first = rows.filter((row) => row.path.length === round);
    steps.push(step(a, [2, OFFSET + 5], tr(`Rodada ${round}`, `Round ${round}`), tr(`Rodada ${round}. ${text}.${first.length && round === best ? ' Já há uma resposta: a mais rápida terminou.' : ''}`, `Round ${round}. ${text}.${first.length && round === best ? ' There is already an answer: the fastest one has finished.' : ''}`), 'comparison', at(round, {})));
  }

  steps.push(step(a, rows[2].found >= 0 ? OFFSET + 6 : OFFSET + 15, tr('Resultado', 'Result'), tr(`Comparações (${summary.replace(/ · /g, ', ')}), para ${fmt(target)} em ${n} posições: ${rows[2].found >= 0 ? `o valor está na ${where(rows[2].found)}` : 'o valor não existe'}. A binária fez ${rows[2].path.length}; a sequencial comum, ${plainCost}. Em vetores maiores a distância cresce: a sequencial é proporcional a n e a binária a log₂ n.`, `Comparisons (${summary.replace(/ · /g, ', ')}), for ${fmt(target)} in ${n} positions: ${rows[2].found >= 0 ? `the value is at ${where(rows[2].found)}` : 'the value does not exist'}. The binary search made ${rows[2].path.length}; the plain sequential search, ${plainCost}. On larger arrays the distance grows: the sequential one is proportional to n and the binary one to log₂ n.`), 'done', at(rounds, {
    output: rows.map((row) => `${row.label}: ${plural(row.path.length, tr('comparação', 'comparison'), tr('comparações', 'comparisons'))}, ${result(row)}`),
    race: view(rounds),
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 06 · Melhor, médio e pior caso
// ---------------------------------------------------------------------------

function casesSteps(values) {
  const a = ascending(values);
  const n = a.length;
  const targets = a.map((value, index) => ({
    value,
    index,
    seq: a.indexOf(value) + 1,
    bin: pathOf(a, value).path.length,
  }));
  // Valores ausentes: um em cada intervalo entre dois elementos (e antes e depois de todos).
  const absent = Array.from({ length: n + 1 }, (_, gap) => binaryPath(n, (index) => (index < gap ? 1 : -1)).path.length);
  const worstBinary = Math.max(...targets.map((row) => row.bin), ...absent);
  const sum = (key, upTo) => targets.slice(0, upTo).reduce((total, row) => total + row[key], 0);
  const average = (key, upTo) => (upTo === 0 ? 0 : sum(key, upTo) / upTo);
  const log = Math.floor(Math.log2(n)) + 1;
  const chart = (shown, extra = {}) => ({
    n,
    rows: targets.map((row, index) => ({ label: fmt(row.value), position: row.index, seq: index < shown ? row.seq : null, bin: index < shown ? row.bin : null, current: index === shown - 1 })),
    averages: { seq: shown ? average('seq', shown) : null, bin: shown ? average('bin', shown) : null },
    ...extra,
  });
  const seqAverage = (n + 1) / 2;

  const steps = [
    step(a, [2, OFFSET + 5], tr('Todos os valores, um por vez', 'Every value, one at a time'), tr(`Vetor ordenado com ${n} posições. Vamos procurar cada um dos ${n} valores e contar as comparações da busca sequencial e da binária. A sequencial vai de 1 a ${n}; quanto a binária, vamos ver.`, `Sorted array with ${n} positions. We will search for each of the ${n} values and count the comparisons of the sequential and the binary search. The sequential one goes from 1 to ${n}; as for the binary one, let's see.`), 'neutral', { cases: chart(0), variables: { n } }),
  ];

  targets.forEach((row, index) => {
    steps.push(step(a, [2, OFFSET + 5], tr(`Procurando ${fmt(row.value)}`, `Searching for ${fmt(row.value)}`), tr(`${fmt(row.value)} está na ${where(row.index)}. A busca sequencial precisa de ${plural(row.seq, 'comparação', 'comparações')} (uma por posição, até chegar nele) e a binária, de ${plural(row.bin, 'comparação', 'comparações')}. Médias até aqui: ${fmt(average('seq', index + 1))} (sequencial) e ${fmt(average('bin', index + 1))} (binária).`, `${fmt(row.value)} is at ${where(row.index)}. The sequential search needs ${plural(row.seq, 'comparison', 'comparisons')} (one per position, until it gets there) and the binary one, ${plural(row.bin, 'comparison', 'comparisons')}. Averages so far: ${fmt(average('seq', index + 1))} (sequential) and ${fmt(average('bin', index + 1))} (binary).`), 'comparison', {
      cases: chart(index + 1),
      foundIndices: [row.index],
      variables: { valorProcurado: row.value, 'sequencial': row.seq, 'binária': row.bin },
    }));
  });

  steps.push(step(a, [2, OFFSET + 5], tr('Valor ausente', 'Missing value'), tr(`Se o valor não existe, a sequencial examina as ${n} posições. A binária examina no máximo ${Math.max(...absent)}: o vetor se divide pela metade até não sobrar nada, ou seja, cerca de log₂ ${n} + 1 = ${log} vezes. Esse é o pior caso das duas.`, `If the value does not exist, the sequential search examines all ${n} positions. The binary search examines at most ${Math.max(...absent)}: the array is halved until nothing is left, that is, about log₂ ${n} + 1 = ${log} times. This is the worst case of both.`), 'warning', {
    cases: chart(n, { missing: { seq: n, bin: Math.max(...absent) } }),
    variables: { n, 'pior caso binária': worstBinary },
  }));

  const boxes = [
    {
      label: tr('Melhor caso', 'Best case'), seq: '1', bin: '1', note: tr('o primeiro elemento / o elemento do centro', 'the first element / the middle element'),
    },
    {
      label: tr('Caso médio (valor existente)', 'Average case (existing value)'), seq: fmt(average('seq', n)), bin: fmt(average('bin', n)), note: tr(`sequencial: (n + 1) / 2 = ${fmt(seqAverage)}`, `sequential: (n + 1) / 2 = ${fmt(seqAverage)}`),
    },
    {
      label: tr('Pior caso', 'Worst case'), seq: String(n), bin: String(worstBinary), note: tr(`n = ${n} / ⌊log₂ ${n}⌋ + 1 = ${log}`, `n = ${n} / ⌊log₂ ${n}⌋ + 1 = ${log}`),
    },
  ];
  steps.push(step(a, [2, OFFSET + 5], tr('Os três casos', 'The three cases'), tr(`Sequencial: melhor 1, média ${fmt(average('seq', n))} (a conta (n + 1) / 2 dá ${fmt(seqAverage)}) e pior ${n}. Binária: melhor 1, média ${fmt(average('bin', n))} e pior ${worstBinary}. A sequencial cresce junto com n; a binária, com log₂ n.`, `Sequential: best 1, average ${fmt(average('seq', n))} (the formula (n + 1) / 2 gives ${fmt(seqAverage)}) and worst ${n}. Binary: best 1, average ${fmt(average('bin', n))} and worst ${worstBinary}. The sequential one grows along with n; the binary one, with log₂ n.`), 'done', {
    cases: chart(n, { missing: { seq: n, bin: Math.max(...absent) }, boxes }),
    variables: { n, 'pior caso binária': worstBinary },
    output: [
      tr(`Sequencial: melhor 1, média ${fmt(average('seq', n))}, pior ${n}`, `Sequential: best 1, average ${fmt(average('seq', n))}, worst ${n}`),
      tr(`Binária: melhor 1, média ${fmt(average('bin', n))}, pior ${worstBinary}`, `Binary: best 1, average ${fmt(average('bin', n))}, worst ${worstBinary}`),
    ],
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 07 · Crescimento do custo: n, n/2, n/4...
// ---------------------------------------------------------------------------

const big = (value) => value.toLocaleString(tr('pt-BR', 'en-US'));

function growthSteps(n) {
  const total = Math.floor(Math.log2(n)) + 1;
  const bars = (remaining, used) => ({
    n,
    rows: [
      { label: tr('Binária', 'Binary'), value: remaining, note: tr('candidatos', 'candidates') },
      { label: tr('Sequencial', 'Sequential'), value: Math.max(0, n - used), note: tr('candidatos', 'candidates') },
    ],
  });
  const steps = [
    step([], BIN.head, tr(`Um vetor com ${big(n)} posições`, `An array with ${big(n)} positions`), tr(`No pior caso o valor não existe, e cada busca precisa descartar todos os ${big(n)} candidatos. A sequencial descarta um por comparação. A binária descarta metade: depois de uma comparação, sobram no máximo ⌊n/2⌋ = ${big(Math.floor(n / 2))}.`, `In the worst case the value does not exist, and each search has to discard all ${big(n)} candidates. The sequential one discards one per comparison. The binary one discards half: after one comparison, at most ⌊n/2⌋ = ${big(Math.floor(n / 2))} are left.`), 'neutral', {
      growth: bars(n, 0), variables: { n, comparações: 0, candidatos: n }, stats: { 'comparações': 0 },
    }),
  ];

  let remaining = n;
  for (let k = 1; k <= total; k += 1) {
    const before = remaining;
    remaining = Math.floor(remaining / 2);
    const last = k === total;
    steps.push(step([], k === total ? BIN.none : BIN.mid, tr(`Comparação ${k}`, `Comparison ${k}`), last
      ? tr(`Comparação ${k}: dos ${big(before)} candidato${before === 1 ? '' : 's'}, a binária examina o centro e descarta os outros ${big(remaining)}. Não sobra nenhum: o trecho ficou vazio e a busca termina, depois de ${plural(k, 'comparação', 'comparações')}. A sequencial ainda teria ${big(n - k)} candidatos.`, `Comparison ${k}: of the ${big(before)} candidate${before === 1 ? '' : 's'}, the binary search examines the middle and discards the other ${big(remaining)}. None is left: the range became empty and the search ends, after ${plural(k, 'comparison', 'comparisons')}. The sequential one would still have ${big(n - k)} candidates.`)
      : tr(`Comparação ${k}: dos ${big(before)} candidatos, a binária examina o centro e fica com no máximo ⌊${big(before)} / 2⌋ = ${big(remaining)}, cerca de n/2^${k}. A sequencial já examinou ${k} e ainda tem ${big(n - k)}.`, `Comparison ${k}: of the ${big(before)} candidates, the binary search examines the middle and is left with at most ⌊${big(before)} / 2⌋ = ${big(remaining)}, about n/2^${k}. The sequential one has examined ${k} and still has ${big(n - k)}.`), last ? 'success' : 'comparison', {
      growth: bars(remaining, k),
      variables: { n, comparações: k, candidatos: remaining },
      stats: { 'comparações': k },
    }));
  }

  const double = n * 2;
  steps.push(step([], BIN.none, tr('Quanto custa dobrar o vetor?', 'What does doubling the array cost?'), tr(`Para n = ${big(n)}, a binária fez ${total} comparações (⌊log₂ ${big(n)}⌋ + 1) e a sequencial faria ${big(n)}. Se o vetor dobrasse para ${big(double)}, a sequencial faria o dobro, ${big(double)}, mas a binária faria só mais uma: ${total + 1}.`, `For n = ${big(n)}, the binary search made ${total} comparisons (⌊log₂ ${big(n)}⌋ + 1) and the sequential one would make ${big(n)}. If the array doubled to ${big(double)}, the sequential one would make twice as many, ${big(double)}, but the binary one would make just one more: ${total + 1}.`), 'done', {
    growth: bars(0, total),
    totals: [
      { label: tr('Sequencial', 'Sequential'), value: big(n), note: tr(`com ${big(double)} posições: ${big(double)}`, `with ${big(double)} positions: ${big(double)}`) },
      { label: tr('Binária', 'Binary'), value: String(total), note: tr(`com ${big(double)} posições: ${total + 1}`, `with ${big(double)} positions: ${total + 1}`) },
    ],
    variables: { n, comparações: total, candidatos: 0 },
    stats: { 'comparações': total },
    output: [
      tr(`n = ${big(n)}`, `n = ${big(n)}`),
      tr(`Sequencial: ${big(n)} comparações no pior caso`, `Sequential: ${big(n)} comparisons in the worst case`),
      tr(`Binária: ${total} comparações no pior caso`, `Binary: ${total} comparisons in the worst case`),
    ],
  }));
  return steps;
}

// ---------------------------------------------------------------------------

export function buildSteps(algorithmId, data) {
  switch (algorithmId) {
    case 'sequencial': return sequentialSteps(data.vetor, data.alvo, false);
    case 'ordenada': return sequentialSteps(data.vetor, data.alvo, true);
    case 'iterativa': return iterativeSteps(data.vetor, data.alvo);
    case 'recursiva': return recursiveSteps(data.vetor, data.alvo);
    case 'comparacao': return raceSteps(data.vetor, data.alvo);
    case 'casos': return casesSteps(data.vetor);
    case 'crescimento': return growthSteps(data.tamanho);
    default: return sequentialSteps(data.vetor, data.alvo, false);
  }
}
