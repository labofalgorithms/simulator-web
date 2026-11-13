import {
  fmt, range, step, toItems, valuesOf,
} from '../shared/sort-steps.js';
import { plural } from '../shared/linear-sort.js';
import {
  NONE, cmp, createDebugger, outside,
} from '../shared/debug-trace.js';
import { tr } from '../../core/i18n.js';

// ---------------------------------------------------------------------------
// Pseudocódigos da aula (slides 27, 40-41, 72-73 e 104-105). Os nomes (A, k, minIndex, smallest...) são
// os dos slides, iguais nos dois idiomas; só as palavras-chave mudam. O Selection Sort do slide 27
// numera 10 e depois 12 (pula o 11): aqui a numeração é corrida.
// ---------------------------------------------------------------------------

const SELECTION_CODE = [
  tr('PROCEDIMENTO partialSelectionSort(A, k)', 'PROCEDURE partialSelectionSort(A, k)'),
  tr('  n ← tamanho de A', '  n ← length of A'),
  '',
  tr('  // Ordena apenas os primeiros k elementos', '  // Sorts only the first k elements'),
  tr('  PARA i de 0 até k - 1 FAÇA', '  FOR i from 0 to k - 1 DO'),
  '    minIndex ← i',
  tr('    // Encontra o menor elemento no restante do array', '    // Finds the smallest element in the rest of the array'),
  tr('    PARA j de i + 1 até n - 1 FAÇA', '    FOR j from i + 1 to n - 1 DO'),
  tr('      SE A[j] < A[minIndex] ENTÃO', '      IF A[j] < A[minIndex] THEN'),
  '        minIndex ← j',
  tr('      FIM SE', '      END IF'),
  tr('    FIM PARA', '    END FOR'),
  tr('    // Troca o menor elem. encontrado com o 1º elem. da parte não ordenada', '    // Swaps the smallest element found with the 1st element of the unsorted part'),
  '    temp ← A[i]',
  '    A[i] ← A[minIndex]',
  '    A[minIndex] ← temp',
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
];
const S = {
  head: 0, n: 1, loop: 4, min: 5, inner: 7, test: 8, set: 9, tmp: 13, copy: 14, put: 15, end: 17,
};

const INSERTION_CODE = [
  tr('PROCEDIMENTO partialInsertionSort(A, n, k)', 'PROCEDURE partialInsertionSort(A, n, k)'),
  tr('  SE k ≤ 0 OU k > n ENTÃO', '  IF k ≤ 0 OR k > n THEN'),
  tr('    RETORNE', '    RETURN'),
  tr('  FIM SE', '  END IF'),
  tr('  // 1) Ordena os primeiros k elementos (insertion clássico)', '  // 1) Sorts the first k elements (classic insertion)'),
  tr('  PARA i de 1 até k - 1 FAÇA', '  FOR i from 1 to k - 1 DO'),
  '    key ← A[i]',
  '    j ← i - 1',
  tr('    ENQUANTO j ≥ 0 E A[j] > key FAÇA', '    WHILE j ≥ 0 AND A[j] > key DO'),
  '      A[j + 1] ← A[j]',
  '      j ← j - 1',
  tr('    FIM ENQUANTO', '    END WHILE'),
  '    A[j + 1] ← key',
  tr('  FIM PARA', '  END FOR'),
  tr('  // Invariante: A[0..k-1] está em ordem crescente', '  // Invariant: A[0..k-1] is in ascending order'),
  tr('  // 2) Varre o restante do vetor e atualiza o bloco dos k menores', '  // 2) Scans the rest of the array and updates the block of the k smallest'),
  tr('  PARA i de k até n - 1 FAÇA', '  FOR i from k to n - 1 DO'),
  '    x ← A[i]',
  tr('    SE x < A[k - 1] ENTÃO', '    IF x < A[k - 1] THEN'),
  tr('      // guarda o maior atual do bloco (será "expulso")', '      // keeps the current largest of the block (it will be "expelled")'),
  '      expelled ← A[k - 1]',
  tr('      // insere x no bloco ordenado A[0..k-1]', '      // inserts x into the sorted block A[0..k-1]'),
  '      j ← k - 2',
  tr('      ENQUANTO j ≥ 0 E A[j] > x FAÇA', '      WHILE j ≥ 0 AND A[j] > x DO'),
  '        A[j + 1] ← A[j]',
  '        j ← j - 1',
  tr('      FIM ENQUANTO', '      END WHILE'),
  '      A[j + 1] ← x',
  tr('      // recoloca o expulso na posição i (de onde tiramos x)', '      // puts the expelled one back at position i (where x came from)'),
  '      A[i] ← expelled',
  tr('    FIM SE', '    END IF'),
  tr('    // senão: x ≥ A[k-1] → ignora', '    // otherwise: x ≥ A[k-1] → ignores it'),
  tr('  FIM PARA', '  END FOR'),
  tr('  // Pós-condição: A[0..k-1] contém os k menores elementos de A em ordem crescente;', '  // Postcondition: A[0..k-1] holds the k smallest elements of A in ascending order;'),
  tr('  // A[k..n-1] contém os demais (em qualquer ordem).', '  // A[k..n-1] holds the others (in any order).'),
  tr('FIM', 'END'),
];
const I = {
  head: 0, guard: 1, loop1: 5, key: 6, j1: 7, while1: 8, shift1: 9, dec1: 10, put1: 12, loop2: 16, x: 17, test: 18, expel: 20, j2: 22, while2: 23, shift2: 24, dec2: 25, putX: 27, putExpelled: 29, end: 35,
};

const MAIN_HEAP_CODE = [
  tr('PROCEDIMENTO partialMinHeapSort(A, k)', 'PROCEDURE partialMinHeapSort(A, k)'),
  tr('  n ← tamanho de A', '  n ← length of A'),
  tr('  // Constrói o min-heap', '  // Builds the min-heap'),
  '  buildMinHeap(A, n)',
  tr('  // Extrai os k menores elem. do heap e os coloca nas últimas k pos. do array', '  // Extracts the k smallest elem. of the heap and puts them in the last k pos. of the array'),
  tr('  PARA i de n - 1 até n - k, de trás para a frente FAÇA', '  FOR i from n - 1 down to n - k DO'),
  tr('    // Troca o menor elemento (A[0]) com o último elemento não ordenado', '    // Swaps the smallest element (A[0]) with the last unsorted element'),
  '    trocar(A, 0, i)',
  tr('    // Reconstrói o min-heap após a troca', '    // Rebuilds the min-heap after the swap'),
  '    minHeapify(A, 0, i)',
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
];
const BUILD_CODE = [
  tr('PROCEDIMENTO buildMinHeap(A, n)', 'PROCEDURE buildMinHeap(A, n)'),
  tr('  // Constrói o min-heap a partir do array A', '  // Builds the min-heap from the array A'),
  tr('  PARA i de (n / 2) - 1 até 0, de trás para a frente FAÇA', '  FOR i from (n / 2) - 1 down to 0 DO'),
  tr('    minHeapify(A, i, n)  // Mantém a propriedade do min-heap', '    minHeapify(A, i, n)  // Keeps the min-heap property'),
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
];
const HEAPIFY_CODE = [
  tr('PROCEDIMENTO minHeapify(A, i, heapSize)', 'PROCEDURE minHeapify(A, i, heapSize)'),
  tr('  smallest ← i              // Inicializa o menor como a raiz', '  smallest ← i              // Starts with the root as the smallest'),
  tr('  left ← 2 * i + 1          // Filho à esquerda', '  left ← 2 * i + 1          // Left child'),
  tr('  right ← 2 * i + 2         // Filho à direita', '  right ← 2 * i + 2         // Right child'),
  tr('  // Verifica se o filho à esquerda é menor que a raiz', '  // Checks whether the left child is smaller than the root'),
  tr('  SE left < heapSize E A[left] < A[smallest] ENTÃO', '  IF left < heapSize AND A[left] < A[smallest] THEN'),
  '    smallest ← left',
  tr('  FIM SE', '  END IF'),
  tr('  // Verifica se o filho à direita é menor que o menor atual', '  // Checks whether the right child is smaller than the current smallest'),
  tr('  SE right < heapSize E A[right] < A[smallest] ENTÃO', '  IF right < heapSize AND A[right] < A[smallest] THEN'),
  '    smallest ← right',
  tr('  FIM SE', '  END IF'),
  tr('  // Se o menor não for a raiz', '  // If the smallest is not the root'),
  tr('  SE smallest ≠ i ENTÃO', '  IF smallest ≠ i THEN'),
  tr('    trocar(A, i, smallest)  // Troca o menor com a raiz', '    trocar(A, i, smallest)  // Swaps the smallest with the root'),
  tr('    // Recursivamente ajusta o heap afetado', '    // Recursively fixes the affected heap'),
  '    minHeapify(A, smallest, heapSize)',
  tr('  FIM SE', '  END IF'),
  tr('FIM', 'END'),
];
const SWAP_CODE = [
  tr('PROCEDIMENTO trocar(A, i, j)', 'PROCEDURE trocar(A, i, j)'),
  '  temp ← A[i]',
  '  A[i] ← A[j]',
  '  A[j] ← temp',
  tr('FIM', 'END'),
];
const HEAP_CODE = [...MAIN_HEAP_CODE, '', ...BUILD_CODE, '', ...HEAPIFY_CODE, '', ...SWAP_CODE];
const HEAP_OFFSETS = {
  build: MAIN_HEAP_CODE.length + 1,
  heapify: MAIN_HEAP_CODE.length + BUILD_CODE.length + 2,
  swap: MAIN_HEAP_CODE.length + BUILD_CODE.length + HEAPIFY_CODE.length + 3,
};
const HM = {
  head: 0, n: 1, build: 3, loop: 5, swap: 7, heapify: 9, end: 11,
};
const HB = { loop: 2, call: 3 };
const HF = {
  smallest: 1, left: 2, right: 3, testLeft: 5, setLeft: 6, testRight: 9, setRight: 10, testSwap: 13, swap: 14, recurse: 16,
};
const W = { save: 1, copy: 2, put: 3 };

const MAIN_QUICK_CODE = [
  tr('PROCEDIMENTO partialQuickSort(A, low, high, k)', 'PROCEDURE partialQuickSort(A, low, high, k)'),
  tr('  SE low < high ENTÃO', '  IF low < high THEN'),
  tr('    // Particiona o array e obtém o índice de partição', '    // Partitions the array and gets the partition index'),
  '    pi ← partition(A, low, high)',
  tr('    // Verifica se já ordenamos até os primeiros k elementos', '    // Checks whether we already sorted up to the first k elements'),
  tr('    SE pi ≥ k ENTÃO', '    IF pi ≥ k THEN'),
  tr('      // Ordena o lado esquerdo até o índice k', '      // Sorts the left side up to index k'),
  '      partialQuickSort(A, low, pi - 1, k)',
  tr('    SENÃO', '    ELSE'),
  tr('      // Ordena o lado esquerdo', '      // Sorts the left side'),
  '      partialQuickSort(A, low, pi - 1, k)',
  tr('      // Se ainda não atingimos k elementos, continua do lado direito', '      // If we have not reached k elements yet, goes on with the right side'),
  tr('      SE pi + 1 < k ENTÃO', '      IF pi + 1 < k THEN'),
  tr('        // Ordena parte do lado direito se necessário', '        // Sorts part of the right side if needed'),
  '        partialQuickSort(A, pi + 1, high, k)',
  tr('      FIM SE', '      END IF'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM SE', '  END IF'),
  tr('FIM', 'END'),
];
const PARTITION_CODE = [
  tr('FUNÇÃO partition(A, low, high)', 'FUNCTION partition(A, low, high)'),
  tr('  pivot ← A[high]  // Escolhe o último elemento como pivot', '  pivot ← A[high]  // Chooses the last element as the pivot'),
  tr('  i ← low - 1      // Índice do menor elemento', '  i ← low - 1      // Index of the smaller element'),
  tr('  PARA j de low até high - 1 FAÇA', '  FOR j from low to high - 1 DO'),
  tr('    SE A[j] ≤ pivot ENTÃO', '    IF A[j] ≤ pivot THEN'),
  '      i ← i + 1',
  '      trocar(A, i, j)',
  tr('    FIM SE', '    END IF'),
  tr('  FIM PARA', '  END FOR'),
  tr('  trocar(A, i + 1, high)  // Coloca o pivot na posição correta', '  trocar(A, i + 1, high)  // Puts the pivot in the right position'),
  tr('  RETORNE i + 1           // Retorna o índice de partição', '  RETURN i + 1            // Returns the partition index'),
  tr('FIM', 'END'),
];
const QUICK_CODE = [...MAIN_QUICK_CODE, '', ...PARTITION_CODE, '', ...SWAP_CODE];
const QUICK_OFFSETS = {
  partition: MAIN_QUICK_CODE.length + 1,
  swap: MAIN_QUICK_CODE.length + PARTITION_CODE.length + 2,
};
const Q = {
  head: 0, test: 1, part: 3, testK: 5, leftTop: 7, leftElse: 10, testRight: 12, right: 14, end: 18,
};
const P = {
  pivot: 1, i: 2, loop: 3, test: 4, inc: 5, swapIn: 6, swapPivot: 9, ret: 10,
};

// ---------------------------------------------------------------------------
// Metadados dos simuladores
// ---------------------------------------------------------------------------

// Não está nos slides: o experimento da comparação, escrito em palavras do pseudocódigo.
const COMPARE_CODE = [
  tr('PARA cada k em {1, 2, 5, 10, ..., n} FAÇA', 'FOR each k in {1, 2, 5, 10, ..., n} DO'),
  tr('  PARA cada método em {seleção, inserção, heap, quick} FAÇA', '  FOR each method in {selection, insertion, heap, quick} DO'),
  tr('    B ← cópia de A', '    B ← copy of A'),
  tr('    executa o método parcial com k sobre B e conta as operações', '    runs the partial method with k on B and counts the operations'),
  tr('  FIM PARA', '  END FOR'),
  tr('  anota o método de menor custo (comparações + movimentações)', '  notes the method with the lowest cost (comparisons + moves)'),
  tr('FIM PARA', 'END FOR'),
];

const GROUP_ALGORITHMS = tr('Os algoritmos', 'The algorithms');
const GROUP_ANALYSIS = tr('Análise', 'Analysis');

export const algorithms = [
  {
    id: 'selection', title: tr('Seleção parcial', 'Partial selection sort'), menuLabel: tr('Seleção parcial', 'Partial selection'), group: GROUP_ALGORITHMS, number: '01',
    description: tr('O Selection Sort que para depois de k passadas: cada uma leva o menor valor do restante para a próxima posição, e as k primeiras posições terminam com os k menores, em ordem.', 'The Selection Sort that stops after k passes: each one takes the smallest value of the rest to the next position, and the first k positions end up with the k smallest, in order.'),
    interaction: tr('Mude o k (ou use o exemplo dos slides 14 a 26) e veja que o laço de fora roda só k vezes: o resto do vetor é lido, mas nunca reorganizado.', 'Change k (or use the example of slides 14 to 26) and see that the outer loop runs only k times: the rest of the array is read, but never rearranged.'),
    complexity: { time: 'O(n · k)', space: 'O(1)', note: tr('Cada uma das k passadas varre o que sobrou do vetor (cerca de n comparações), então são cerca de n · k comparações. Só há k trocas: o número de movimentações é linear em k. Com k = n vira o Selection Sort completo, O(n²).', 'Each of the k passes scans what is left of the array (about n comparisons), so there are about n · k comparisons. There are only k swaps: the number of moves is linear in k. With k = n it becomes the full Selection Sort, O(n²).') },
    pseudocode: SELECTION_CODE,
  },
  {
    id: 'insertion', title: tr('Inserção parcial', 'Partial insertion sort'), menuLabel: tr('Inserção parcial', 'Partial insertion'), group: GROUP_ALGORITHMS, number: '02',
    description: tr('Ordena os k primeiros com o Insertion Sort e depois varre o resto: o valor que for menor que o maior do bloco entra no lugar certo dele, e o maior do bloco é "expulso" para a posição vaga.', 'Sorts the first k with Insertion Sort and then scans the rest: a value smaller than the largest of the block goes into its right place there, and the largest of the block is "expelled" to the vacant position.'),
    interaction: tr('Acompanhe o x contra A[k - 1], o último do bloco: com k pequeno quase todo valor perde essa comparação e é ignorado, por isso este método é o melhor para k pequeno.', 'Follow x against A[k - 1], the last of the block: with a small k almost every value loses that comparison and is ignored, which is why this method is the best for a small k.'),
    complexity: { time: 'O(n · k)', space: 'O(1)', note: tr('Ordenar o bloco custa até k² deslocamentos. Depois, cada um dos n − k valores faz uma comparação com A[k - 1] e, só se entrar no bloco, até k deslocamentos. No melhor caso (nenhum valor entra) são cerca de n comparações; no pior, n · k.', 'Sorting the block costs up to k² shifts. After that, each of the n − k values makes one comparison with A[k - 1] and, only if it enters the block, up to k shifts. In the best case (no value enters) there are about n comparisons; in the worst, n · k.') },
    pseudocode: INSERTION_CODE,
  },
  {
    id: 'heap', title: tr('Heapsort parcial', 'Partial heapsort'), menuLabel: tr('Heapsort parcial', 'Partial heapsort'), group: GROUP_ALGORITHMS, number: '03',
    description: tr('Transforma o vetor em um min-heap e extrai o menor valor k vezes: a cada extração a raiz vai para o fim do heap, e os k menores terminam nas k últimas posições.', 'Turns the array into a min-heap and extracts the smallest value k times: at each extraction the root goes to the end of the heap, and the k smallest end up in the last k positions.'),
    interaction: tr('Observe o heap como árvore: os nós que saem do heap ficam em verde e formam, da direita para a esquerda, os menores em ordem crescente (o menor na última posição).', 'Watch the heap as a tree: the nodes that leave the heap turn green and form, from right to left, the smallest ones in ascending order (the smallest in the last position).'),
    complexity: { time: 'O(n + k log n)', space: 'O(log n)', note: tr('Construir o min-heap custa O(n). Cada uma das k extrações troca a raiz com o último e conserta o heap em até log₂ n níveis. A pilha de chamadas do minHeapify recursivo soma O(log n). Com k = n vira o Heap Sort completo.', 'Building the min-heap costs O(n). Each of the k extractions swaps the root with the last one and fixes the heap in up to log₂ n levels. The call stack of the recursive minHeapify adds O(log n). With k = n it becomes the full Heap Sort.') },
    pseudocode: HEAP_CODE,
  },
  {
    id: 'quick', title: tr('Quicksort parcial', 'Partial quicksort'), menuLabel: tr('Quicksort parcial', 'Partial quicksort'), group: GROUP_ALGORITHMS, number: '04',
    description: tr('O Quicksort que abandona a partição da direita sempre que a da esquerda já cobre as k primeiras posições: só os trechos que contêm os k menores são ordenados.', 'The Quicksort that drops the right partition whenever the left one already covers the first k positions: only the ranges that contain the k smallest are sorted.'),
    interaction: tr('Acompanhe a pilha de chamadas e a barra do k: depois de cada partition, a chamada à direita só acontece se pi + 1 < k.', 'Follow the call stack and the k bar: after each partition, the call on the right only happens if pi + 1 < k.'),
    complexity: { time: 'O(n + k log k)', space: 'O(log n)', note: tr('No caso médio, as partições que contêm a posição k custam n + n/2 + n/4 ... ≈ 2n comparações, e só o trecho dos k menores é ordenado de fato (k log k). No pior caso (pivô sempre no extremo) o custo sobe para O(n²). A recursão soma O(log n) de pilha.', 'In the average case, the partitions that contain position k cost n + n/2 + n/4 ... ≈ 2n comparisons, and only the range of the k smallest is actually sorted (k log k). In the worst case (pivot always at an extreme) the cost rises to O(n²). The recursion adds O(log n) of stack.') },
    pseudocode: QUICK_CODE,
  },
  {
    id: 'compare', title: tr('Comparando por k', 'Comparing by k'), menuLabel: tr('Comparando por k', 'Comparing by k'), group: GROUP_ANALYSIS, number: '05',
    description: tr('Os quatro métodos sobre o mesmo vetor aleatório, para vários valores de k: a conclusão dos slides 106 e 107 vista em números (comparações + movimentações).', 'The four methods on the same random array, for several values of k: the conclusion of slides 106 and 107 seen in numbers (comparisons + moves).'),
    interaction: tr('Avance de k em k e veja quem fica com a barra menor: a inserção parcial para k pequeno, o Quicksort parcial quando k cresce. Mude o tamanho n para ver o efeito.', 'Move from k to k and see who has the shortest bar: partial insertion for a small k, partial quicksort as k grows. Change the size n to see the effect.'),
    complexity: { time: tr('depende de k', 'depends on k'), space: 'O(1) – O(log n)', note: tr('Para k pequeno a inserção parcial faz cerca de n comparações; a seleção parcial faz n · k; o Heapsort parcial paga a construção do heap (O(n)) e o Quicksort parcial paga cerca de 2n. Quanto maior o k, mais a inserção parcial sofre (até k deslocamentos por valor).', 'For a small k, partial insertion makes about n comparisons; partial selection makes n · k; partial heapsort pays for building the heap (O(n)) and partial quicksort pays about 2n. The larger the k, the more partial insertion suffers (up to k shifts per value).') },
    pseudocode: COMPARE_CODE,
  },
];

const vec = (items) => `[${items.map((item) => fmt(item.v)).join(', ')}]`;
const slice = (items, from, to) => vec(items.slice(from, to));

/** Marcadores comuns: os índices inteiros das variáveis do quadro, dentro do vetor. */
const pick = (vars, names, count) => Object.fromEntries(names.filter((name) => Number.isInteger(vars[name]) && vars[name] >= 0 && vars[name] < count).map((name) => [name, vars[name]]));

// ---------------------------------------------------------------------------
// 01 · Seleção parcial
// ---------------------------------------------------------------------------

export function runSelection(items, k, record = true) {
  const n = items.length;
  const state = { done: 0, phase: '' };
  const vars = {
    k, n: NONE, i: NONE, minIndex: NONE, j: NONE, temp: NONE,
  };
  const dbg = createDebugger(items, {
    record,
    decorate: () => ({ splitAfter: k - 1, sortedCount: state.done, pointers: pick(vars, ['i', 'j', 'minIndex'], n) }),
  });
  const { a, add, counters, log } = dbg;
  const v = (index) => a[index].v;
  dbg.push({ label: 'partialSelectionSort(A, k)', vars, phase: () => state.phase });
  state.phase = tr('Começa', 'Starts');

  add(S.head, 'partialSelectionSort(A, k)', tr(`Chamada com k = ${k}: só as ${k} primeiras posições serão ordenadas e vão receber os ${k} menores valores. O restante do vetor (a partir da barra) só é lido, nunca reorganizado de propósito.`, `Call with k = ${k}: only the first ${k} positions will be sorted and will receive the ${k} smallest values. The rest of the array (after the bar) is only read, never deliberately rearranged.`), 'neutral');
  vars.n = n;
  add(S.n, tr('n ← tamanho de A', 'n ← length of A'), tr(`n recebe ${n}, o tamanho do vetor.`, `n receives ${n}, the size of the array.`), 'update');

  for (let i = 0; i < k; i += 1) {
    vars.i = i;
    vars.minIndex = NONE;
    vars.j = NONE;
    state.phase = tr(`i = ${i} · procura o menor`, `i = ${i} · looks for the smallest`);
    add(S.loop, `${tr('PARA', 'FOR')} i (i = ${i})`, tr(`i recebe ${i} e ${i} ≤ ${k - 1}: começa a passada ${i + 1} de ${k}. Ela vai achar o ${i + 1}º menor valor e colocá-lo na posição ${i}.`, `i receives ${i} and ${i} ≤ ${k - 1}: pass ${i + 1} of ${k} starts. It will find the ${i + 1}th smallest value and put it at position ${i}.`), 'update');
    vars.minIndex = i;
    add(S.min, 'minIndex ← i', tr(`minIndex recebe ${i}: por enquanto o menor é o próprio A[${i}] = ${fmt(v(i))}.`, `minIndex receives ${i}: for now the smallest is A[${i}] itself = ${fmt(v(i))}.`), 'update');
    for (let j = i + 1; j < n; j += 1) {
      vars.j = j;
      add(S.inner, `${tr('PARA', 'FOR')} j (j = ${j})`, tr(`j recebe ${j}: vamos comparar A[${j}] = ${fmt(v(j))} com o menor até agora, A[${vars.minIndex}] = ${fmt(v(vars.minIndex))}.`, `j receives ${j}: let us compare A[${j}] = ${fmt(v(j))} with the smallest so far, A[${vars.minIndex}] = ${fmt(v(vars.minIndex))}.`), 'comparison', { comparedIndices: [j] });
      counters.comparisons += 1;
      const less = v(j) < v(vars.minIndex);
      add(S.test, `${tr('SE', 'IF')} A[j] < A[minIndex]`, tr(`${fmt(v(j))} < ${fmt(v(vars.minIndex))} é ${less ? 'verdadeiro: achamos um valor menor' : 'falso: o menor continua o mesmo'}.`, `${fmt(v(j))} < ${fmt(v(vars.minIndex))} is ${less ? 'true: we found a smaller value' : 'false: the smallest stays the same'}.`), 'comparison', {
        comparedIndices: [j, vars.minIndex], compare: cmp('A[j]', fmt(v(j)), '<', 'A[minIndex]', fmt(v(vars.minIndex)), less),
      });
      if (less) {
        vars.minIndex = j;
        add(S.set, 'minIndex ← j', tr(`minIndex passa a ser ${j}.`, `minIndex is now ${j}.`), 'update', { foundIndices: [j] });
      }
    }
    vars.j = n;
    add(S.inner, `${tr('PARA', 'FOR')} j (j = ${n}): ${tr('fim', 'end')}`, tr(`j = ${n} passou do fim do vetor: a busca terminou e o menor é A[${vars.minIndex}] = ${fmt(v(vars.minIndex))}.`, `j = ${n} went past the end of the array: the search is over and the smallest is A[${vars.minIndex}] = ${fmt(v(vars.minIndex))}.`), 'success', { foundIndices: [vars.minIndex] });

    const m = vars.minIndex;
    const held = a[i];
    vars.temp = held.v;
    add(S.tmp, 'temp ← A[i]', tr(`temp guarda A[${i}] = ${fmt(held.v)}.`, `temp keeps A[${i}] = ${fmt(held.v)}.`), 'update', { comparedIndices: [i], foundIndices: [m] });
    a[i] = a[m];
    add(S.copy, 'A[i] ← A[minIndex]', tr(`A[${i}] recebe A[${m}] = ${fmt(v(i))}${m === i ? ' (é a mesma posição: nada muda)' : ''}.`, `A[${i}] receives A[${m}] = ${fmt(v(i))}${m === i ? ' (it is the same position: nothing changes)' : ''}.`), 'update', { changedIndices: [i], foundIndices: [m] });
    a[m] = held;
    counters.moves += 1;
    state.done = i + 1;
    add(S.put, 'A[minIndex] ← temp', tr(`A[${m}] recebe temp = ${fmt(held.v)}. ${m === i ? `O menor já estava na posição ${i} (a troca foi com ele mesmo).` : 'Os dois valores trocaram de lugar.'} A posição ${i} agora tem o ${i + 1}º menor valor e não muda mais.`, `A[${m}] receives temp = ${fmt(held.v)}. ${m === i ? `The smallest was already at position ${i} (the swap was with itself).` : 'The two values swapped places.'} Position ${i} now holds the ${i + 1}th smallest value and will not change again.`), 'success', { changedIndices: m === i ? [i] : [i, m] });
    log.push(tr(`i = ${i}: o menor é ${fmt(v(i))} (veio da posição ${m})`, `i = ${i}: the smallest is ${fmt(v(i))} (it came from position ${m})`));
  }
  vars.i = k;
  vars.j = NONE;
  vars.minIndex = NONE;
  state.phase = tr('Fim', 'Done');
  add(S.loop, `${tr('PARA', 'FOR')} i (i = ${k}): ${tr('fim', 'end')}`, tr(`i = ${k} passou do limite k - 1 = ${k - 1}: as ${k} passadas terminaram.`, `i = ${k} went past the limit k - 1 = ${k - 1}: the ${k} passes are over.`), 'success');
  const firstK = slice(a, 0, k);
  log.push(tr(`Os ${k} menores: ${firstK}`, `The ${k} smallest: ${firstK}`));
  add(S.end, tr('Ordenação parcial concluída', 'Partial sort finished'), tr(`A[0..${k - 1}] = ${firstK}: os ${k} menores valores, em ordem crescente. Foram ${plural(counters.comparisons, 'comparação', 'comparações')} e ${plural(counters.moves, 'troca', 'trocas')}. O restante, ${slice(a, k, n)}, ficou como estava (com a troca, o valor que saiu de uma posição foi para onde o menor estava).`, `A[0..${k - 1}] = ${firstK}: the ${k} smallest values, in ascending order. There were ${plural(counters.comparisons, 'comparison', 'comparisons')} and ${plural(counters.moves, 'swap', 'swaps')}. The rest, ${slice(a, k, n)}, was left as it was (with the swap, the value that left a position went to where the smallest was).`), 'done', { output: [...log, tr(`Comparações: ${counters.comparisons} · Trocas: ${counters.moves}`, `Comparisons: ${counters.comparisons} · Swaps: ${counters.moves}`)] });
  return { steps: dbg.steps, a, counters };
}

// ---------------------------------------------------------------------------
// 02 · Inserção parcial
// ---------------------------------------------------------------------------

export function runInsertion(items, k, record = true) {
  const n = items.length;
  const state = { sorted: 0, phase: '', held: null };
  const vars = {
    k, n, i: NONE, key: NONE, j: NONE, x: NONE, expelled: NONE,
  };
  const dbg = createDebugger(items, {
    record,
    moveLabel: 'deslocamentos',
    decorate: () => ({
      splitAfter: k - 1,
      sortedCount: state.sorted,
      pointers: pick(vars, ['i', 'j'], n),
      stats: state.held === null ? {} : { [state.held.name]: fmt(state.held.value) },
    }),
  });
  const { a, add, counters, log } = dbg;
  const v = (index) => a[index].v;
  dbg.push({ label: 'partialInsertionSort(A, n, k)', vars, phase: () => state.phase });
  state.phase = tr('Começa', 'Starts');
  add(I.head, 'partialInsertionSort(A, n, k)', tr(`Chamada com n = ${n} e k = ${k}: ao final, A[0..${k - 1}] terá os ${k} menores valores em ordem crescente.`, `Call with n = ${n} and k = ${k}: at the end, A[0..${k - 1}] will hold the ${k} smallest values in ascending order.`), 'neutral');
  const invalid = k <= 0 || k > n;
  add(I.guard, `${tr('SE', 'IF')} k ≤ 0 ${tr('OU', 'OR')} k > n`, invalid
    ? tr(`k = ${k} é inválido para n = ${n}: o procedimento retorna sem fazer nada.`, `k = ${k} is invalid for n = ${n}: the procedure returns without doing anything.`)
    : tr(`k = ${k} não é ≤ 0 nem maior que n = ${n}: o valor de k é válido e a execução segue.`, `k = ${k} is neither ≤ 0 nor greater than n = ${n}: k is valid and the execution goes on.`), invalid ? 'warning' : 'comparison', { compare: cmp('k', String(k), '>', 'n', String(n), k > n) });
  if (invalid) return { steps: dbg.steps, a, counters };

  // Move `a[from]` para o bloco ordenado [0..top]: o laço ENQUANTO da aula, com a variável `name` (key ou x).
  const insertInto = (name, value, top, lines) => {
    vars.j = top;
    state.held = { name, value };
    for (;;) {
      const inside = vars.j >= 0;
      let greater = false;
      if (inside) {
        counters.comparisons += 1;
        greater = v(vars.j) > value;
      }
      add(lines.test, `${tr('ENQUANTO', 'WHILE')} j ≥ 0 ${tr('E', 'AND')} A[j] > ${name}`, !inside
        ? tr(`j = ${vars.j}: a condição j ≥ 0 é falsa e o E não avalia A[j] (não existe posição ${vars.j}). O laço termina: ${name} vai para a posição 0.`, `j = ${vars.j}: the condition j ≥ 0 is false and the AND does not evaluate A[j] (there is no position ${vars.j}). The loop ends: ${name} goes to position 0.`)
        : greater
          ? tr(`A[${vars.j}] = ${fmt(v(vars.j))} > ${name} = ${fmt(value)} é verdadeiro: ${fmt(v(vars.j))} é maior e precisa abrir espaço, deslocando-se uma posição para a direita.`, `A[${vars.j}] = ${fmt(v(vars.j))} > ${name} = ${fmt(value)} is true: ${fmt(v(vars.j))} is larger and must make room, shifting one position to the right.`)
          : tr(`A[${vars.j}] = ${fmt(v(vars.j))} > ${name} = ${fmt(value)} é falso: ${fmt(v(vars.j))} é menor ou igual, então ${name} fica logo depois dele e o laço termina.`, `A[${vars.j}] = ${fmt(v(vars.j))} > ${name} = ${fmt(value)} is false: ${fmt(v(vars.j))} is smaller or equal, so ${name} stays right after it and the loop ends.`), 'comparison', {
        comparedIndices: inside ? [vars.j] : [],
        compare: inside ? cmp(`A[${vars.j}]`, fmt(v(vars.j)), '>', name, fmt(value), greater) : cmp('j', String(vars.j), '≥', '0', '0', false),
      });
      if (!greater) break;
      a[vars.j + 1] = a[vars.j];
      counters.moves += 1;
      add(lines.shift, 'A[j + 1] ← A[j]', tr(`A[${vars.j + 1}] recebe A[${vars.j}] = ${fmt(v(vars.j))}: o valor desloca uma posição para a direita.`, `A[${vars.j + 1}] receives A[${vars.j}] = ${fmt(v(vars.j))}: the value shifts one position to the right.`), 'update', { changedIndices: [vars.j + 1] });
      vars.j -= 1;
      add(lines.dec, 'j ← j - 1', tr(`j recua para ${vars.j}.`, `j steps back to ${vars.j}.`), 'update');
    }
  };

  state.phase = tr('1) ordena os k primeiros', '1) sorts the first k');
  state.sorted = Math.min(1, k);
  for (let i = 1; i < k; i += 1) {
    vars.i = i;
    vars.j = NONE;
    add(I.loop1, `${tr('PARA', 'FOR')} i (i = ${i})`, tr(`i recebe ${i}: o bloco A[0..${i - 1}] já está ordenado e vamos inserir A[${i}] nele.`, `i receives ${i}: the block A[0..${i - 1}] is already sorted and we are going to insert A[${i}] into it.`), 'update');
    vars.key = v(i);
    const keyItem = a[i];
    add(I.key, 'key ← A[i]', tr(`key guarda A[${i}] = ${fmt(vars.key)}, o valor que será inserido.`, `key keeps A[${i}] = ${fmt(vars.key)}, the value that will be inserted.`), 'update', { comparedIndices: [i] });
    vars.j = i - 1;
    state.held = { name: 'key', value: vars.key };
    add(I.j1, 'j ← i - 1', tr(`j recebe ${vars.j}, a posição logo antes de i.`, `j receives ${vars.j}, the position right before i.`), 'update');
    insertInto('key', vars.key, i - 1, { test: I.while1, shift: I.shift1, dec: I.dec1 });
    a[vars.j + 1] = keyItem;
    add(I.put1, 'A[j + 1] ← key', tr(`A[${vars.j + 1}] recebe key = ${fmt(vars.key)}: ${fmt(vars.key)} chegou ao lugar dele. Agora A[0..${i}] está ordenado.`, `A[${vars.j + 1}] receives key = ${fmt(vars.key)}: ${fmt(vars.key)} reached its place. Now A[0..${i}] is sorted.`), 'success', { changedIndices: [vars.j + 1] });
    state.sorted = i + 1;
  }
  vars.i = k;
  vars.j = NONE;
  vars.key = NONE;
  state.held = null;
  add(I.loop1, `${tr('PARA', 'FOR')} i (i = ${k}): ${tr('fim', 'end')}`, tr(`i = ${k} passou do limite k - 1 = ${k - 1}: os ${k} primeiros estão ordenados (invariante: A[0..${k - 1}] está em ordem crescente). Falta olhar o restante do vetor.`, `i = ${k} went past the limit k - 1 = ${k - 1}: the first ${k} are sorted (invariant: A[0..${k - 1}] is in ascending order). The rest of the array is still to be examined.`), 'success');

  state.phase = tr('2) varre o restante', '2) scans the rest');
  state.sorted = k;
  for (let i = k; i < n; i += 1) {
    vars.i = i;
    vars.x = NONE;
    vars.expelled = NONE;
    vars.j = NONE;
    state.held = null;
    add(I.loop2, `${tr('PARA', 'FOR')} i (i = ${i})`, tr(`i recebe ${i}: vamos ver se A[${i}] merece entrar entre os ${k} menores.`, `i receives ${i}: let us see whether A[${i}] deserves to enter among the ${k} smallest.`), 'update');
    vars.x = v(i);
    state.held = { name: 'x', value: vars.x };
    add(I.x, 'x ← A[i]', tr(`x guarda A[${i}] = ${fmt(vars.x)}.`, `x keeps A[${i}] = ${fmt(vars.x)}.`), 'update', { comparedIndices: [i] });
    counters.comparisons += 1;
    const enters = vars.x < v(k - 1);
    add(I.test, `${tr('SE', 'IF')} x < A[k - 1]`, enters
      ? tr(`${fmt(vars.x)} < ${fmt(v(k - 1))} é verdadeiro: x é menor que o maior do bloco (A[${k - 1}]), então x pertence aos ${k} menores e vai entrar no bloco.`, `${fmt(vars.x)} < ${fmt(v(k - 1))} is true: x is smaller than the largest of the block (A[${k - 1}]), so x belongs to the ${k} smallest and will enter the block.`)
      : tr(`${fmt(vars.x)} < ${fmt(v(k - 1))} é falso: x não é menor que o maior do bloco, então não está entre os ${k} menores (por enquanto) e é ignorado.`, `${fmt(vars.x)} < ${fmt(v(k - 1))} is false: x is not smaller than the largest of the block, so it is not among the ${k} smallest (for now) and is ignored.`), 'comparison', {
      comparedIndices: [i, k - 1], compare: cmp('x', fmt(vars.x), '<', `A[${k - 1}]`, fmt(v(k - 1)), enters),
    });
    if (!enters) continue;
    const xItem = a[i];
    vars.expelled = v(k - 1);
    const expelledItem = a[k - 1];
    state.held = { name: 'expelled', value: vars.expelled };
    add(I.expel, 'expelled ← A[k - 1]', tr(`expelled guarda A[${k - 1}] = ${fmt(vars.expelled)}, o maior do bloco: ele será expulso para dar lugar a x.`, `expelled keeps A[${k - 1}] = ${fmt(vars.expelled)}, the largest of the block: it will be expelled to make room for x.`), 'update', { foundIndices: [k - 1] });
    vars.j = k - 2;
    add(I.j2, 'j ← k - 2', tr(`j recebe ${vars.j}: a inserção começa antes do último do bloco, que já está guardado em expelled.`, `j receives ${vars.j}: the insertion starts before the last of the block, which is already kept in expelled.`), 'update');
    state.held = { name: 'x', value: vars.x };
    insertInto('x', vars.x, k - 2, { test: I.while2, shift: I.shift2, dec: I.dec2 });
    a[vars.j + 1] = xItem;
    add(I.putX, 'A[j + 1] ← x', tr(`A[${vars.j + 1}] recebe x = ${fmt(vars.x)}: x entrou no bloco no lugar certo.`, `A[${vars.j + 1}] receives x = ${fmt(vars.x)}: x entered the block at the right place.`), 'success', { changedIndices: [vars.j + 1] });
    a[i] = expelledItem;
    add(I.putExpelled, 'A[i] ← expelled', tr(`A[${i}] recebe expelled = ${fmt(vars.expelled)}: o valor expulso ocupa a posição de onde x saiu. O bloco A[0..${k - 1}] continua ordenado, agora com x.`, `A[${i}] receives expelled = ${fmt(vars.expelled)}: the expelled value takes the position x came from. The block A[0..${k - 1}] is still sorted, now with x.`), 'success', { changedIndices: [i] });
    log.push(tr(`${fmt(vars.x)} entrou no bloco e expulsou ${fmt(vars.expelled)}`, `${fmt(vars.x)} entered the block and expelled ${fmt(vars.expelled)}`));
  }
  vars.i = n;
  vars.j = NONE;
  vars.x = NONE;
  vars.expelled = NONE;
  state.held = null;
  state.phase = tr('Fim', 'Done');
  add(I.loop2, `${tr('PARA', 'FOR')} i (i = ${n}): ${tr('fim', 'end')}`, tr(`i = ${n} passou do fim do vetor: todos os valores já foram comparados com o bloco.`, `i = ${n} went past the end of the array: every value has been compared with the block.`), 'success');
  const firstK = slice(a, 0, k);
  log.push(tr(`Os ${k} menores: ${firstK}`, `The ${k} smallest: ${firstK}`));
  add(I.end, tr('Ordenação parcial concluída', 'Partial sort finished'), tr(`A[0..${k - 1}] = ${firstK}: os ${k} menores valores, em ordem crescente. O restante, ${slice(a, k, n)}, fica em qualquer ordem. Foram ${plural(counters.comparisons, 'comparação', 'comparações')} e ${plural(counters.moves, 'deslocamento', 'deslocamentos')}.`, `A[0..${k - 1}] = ${firstK}: the ${k} smallest values, in ascending order. The rest, ${slice(a, k, n)}, is in any order. There were ${plural(counters.comparisons, 'comparison', 'comparisons')} and ${plural(counters.moves, 'shift', 'shifts')}.`), 'done', { output: [...log, tr(`Comparações: ${counters.comparisons} · Deslocamentos: ${counters.moves}`, `Comparisons: ${counters.comparisons} · Shifts: ${counters.moves}`)] });
  return { steps: dbg.steps, a, counters };
}

// ---------------------------------------------------------------------------
// trocar(A, i, j): o procedimento de três linhas, com a variável temp (Heapsort e Quicksort parciais)
// ---------------------------------------------------------------------------

function makeSwap(dbg, base) {
  const { a, add, counters } = dbg;
  return (i, j) => {
    const vars = { i, j, temp: NONE };
    dbg.push({ kind: 'trocar', label: `trocar(${i}, ${j})`, vars, phase: tr('Troca dois valores', 'Swaps two values') });
    const held = a[i];
    vars.temp = held.v;
    add(base + W.save, 'temp ← A[i]', tr(`temp guarda A[${i}] = ${fmt(held.v)}.`, `temp keeps A[${i}] = ${fmt(held.v)}.`), 'update', { comparedIndices: [i] });
    a[i] = a[j];
    add(base + W.copy, 'A[i] ← A[j]', tr(`A[${i}] recebe A[${j}] = ${fmt(a[i].v)}${i === j ? ' (mesma posição: nada muda)' : ''}.`, `A[${i}] receives A[${j}] = ${fmt(a[i].v)}${i === j ? ' (same position: nothing changes)' : ''}.`), 'update', { changedIndices: [i], comparedIndices: [j] });
    a[j] = held;
    counters.moves += 1;
    add(base + W.put, 'A[j] ← temp', tr(`A[${j}] recebe temp = ${fmt(held.v)}: ${i === j ? 'a troca foi de uma posição com ela mesma.' : 'os dois valores trocaram de lugar.'}`, `A[${j}] receives temp = ${fmt(held.v)}: ${i === j ? 'the swap was of a position with itself.' : 'the two values swapped places.'}`), 'success', { changedIndices: i === j ? [i] : [i, j] });
    dbg.pop();
  };
}

// ---------------------------------------------------------------------------
// 03 · Heapsort parcial (min-heap)
// ---------------------------------------------------------------------------

export function runHeap(items, k, record = true) {
  const n = items.length;
  const state = { sortedFrom: n };
  const dbg = createDebugger(items, {
    record,
    decorate: ({ frame }) => {
      const vars = frame?.vars ?? {};
      const out = { sortedFrom: state.sortedFrom, pointers: {} };
      if (frame?.kind === 'heapify') {
        const size = vars.heapSize;
        out.pointers = pick({ ...vars, left: vars.left < size ? vars.left : NONE, right: vars.right < size ? vars.right : NONE }, ['i', 'smallest', 'left', 'right'], n);
        out.pivotIndex = vars.i;
        out.anchor = vars.i;
      } else if (frame?.kind === 'trocar') {
        out.pointers = pick(vars, ['i', 'j'], n);
      } else if (frame?.kind === 'build' || frame?.kind === 'main') {
        out.pointers = pick(vars, ['i'], n);
      }
      return out;
    },
  });
  const { a, add, counters, log } = dbg;
  const v = (index) => a[index].v;
  const swap = makeSwap(dbg, HEAP_OFFSETS.swap);

  function heapify(i, heapSize) {
    const vars = {
      i, heapSize, smallest: NONE, left: NONE, right: NONE,
    };
    dbg.push({
      kind: 'heapify', label: `minHeapify(${i}, ${heapSize})`, vars, phase: tr(`Ajusta o heap a partir de ${i}`, `Fixes the heap from ${i}`),
    });
    const o = HEAP_OFFSETS.heapify;
    vars.smallest = i;
    add(o + HF.smallest, 'smallest ← i', tr(`smallest recebe ${i}: por enquanto a raiz A[${i}] = ${fmt(v(i))} é o menor.`, `smallest receives ${i}: for now the root A[${i}] = ${fmt(v(i))} is the smallest.`), 'update');
    vars.left = 2 * i + 1;
    add(o + HF.left, 'left ← 2 * i + 1', tr(`left recebe ${vars.left}, o filho à esquerda${vars.left < heapSize ? '' : ` (fora do heap, que tem ${heapSize} posições)`}.`, `left receives ${vars.left}, the left child${vars.left < heapSize ? '' : ` (outside the heap, which has ${heapSize} positions)`}.`), 'update');
    vars.right = 2 * i + 2;
    add(o + HF.right, 'right ← 2 * i + 2', tr(`right recebe ${vars.right}, o filho à direita${vars.right < heapSize ? '' : ` (fora do heap, que tem ${heapSize} posições)`}.`, `right receives ${vars.right}, the right child${vars.right < heapSize ? '' : ` (outside the heap, which has ${heapSize} positions)`}.`), 'update');

    const side = (name, index, testLine, setLine) => {
      const inside = index < heapSize;
      let smaller = false;
      if (inside) {
        counters.comparisons += 1;
        smaller = v(index) < v(vars.smallest);
      }
      add(o + testLine, `${tr('SE', 'IF')} ${name} < heapSize ${tr('E', 'AND')} A[${name}] < A[smallest]`, !inside
        ? tr(`${name} = ${index} não é menor que heapSize = ${heapSize}: esse filho não existe no heap e o E não avalia A[${name}].`, `${name} = ${index} is not less than heapSize = ${heapSize}: that child does not exist in the heap and the AND does not evaluate A[${name}].`)
        : tr(`${name} = ${index} < ${heapSize} e A[${name}] = ${fmt(v(index))} < A[smallest] = ${fmt(v(vars.smallest))} é ${smaller ? 'verdadeiro: o filho é menor' : 'falso: o filho não é menor'}.`, `${name} = ${index} < ${heapSize} and A[${name}] = ${fmt(v(index))} < A[smallest] = ${fmt(v(vars.smallest))} is ${smaller ? 'true: the child is smaller' : 'false: the child is not smaller'}.`), 'comparison', {
        comparedIndices: inside ? [index, vars.smallest] : [],
        compare: inside ? cmp(`A[${name}]`, fmt(v(index)), '<', 'A[smallest]', fmt(v(vars.smallest)), smaller) : cmp(name, String(index), '<', 'heapSize', String(heapSize), false),
      });
      if (smaller) {
        vars.smallest = index;
        add(o + setLine, `smallest ← ${name}`, tr(`smallest passa a ser ${index}.`, `smallest is now ${index}.`), 'update', { foundIndices: [index] });
      }
    };
    side('left', vars.left, HF.testLeft, HF.setLeft);
    side('right', vars.right, HF.testRight, HF.setRight);

    const moves = vars.smallest !== i;
    add(o + HF.testSwap, `${tr('SE', 'IF')} smallest ≠ i`, moves
      ? tr(`smallest = ${vars.smallest} ≠ i = ${i}: um filho é menor que a raiz. A[${vars.smallest}] = ${fmt(v(vars.smallest))} sobe e o valor ${fmt(v(i))} desce.`, `smallest = ${vars.smallest} ≠ i = ${i}: a child is smaller than the root. A[${vars.smallest}] = ${fmt(v(vars.smallest))} goes up and the value ${fmt(v(i))} goes down.`)
      : tr(`smallest = i = ${i}: a raiz já é menor que os filhos. A propriedade do min-heap vale aqui e o ajuste termina.`, `smallest = i = ${i}: the root is already smaller than its children. The min-heap property holds here and the fix ends.`), moves ? 'comparison' : 'success', { compare: cmp('smallest', String(vars.smallest), '≠', 'i', String(i), moves) });
    if (moves) {
      add(o + HF.swap, `trocar(A, i, smallest)`, tr(`Chama trocar(A, ${i}, ${vars.smallest}).`, `Calls trocar(A, ${i}, ${vars.smallest}).`), 'neutral', { foundIndices: [vars.smallest] });
      swap(i, vars.smallest);
      add(o + HF.recurse, `minHeapify(A, smallest, heapSize)`, tr(`Chama minHeapify(A, ${vars.smallest}, ${heapSize}): o valor que desceu pode ter quebrado a regra na subárvore dele.`, `Calls minHeapify(A, ${vars.smallest}, ${heapSize}): the value that went down may have broken the rule in its subtree.`), 'neutral', { foundIndices: [vars.smallest] });
      heapify(vars.smallest, heapSize);
    }
    dbg.pop();
  }

  function build() {
    const vars = { n, i: NONE };
    dbg.push({ kind: 'build', label: `buildMinHeap(${n})`, vars, phase: tr('Constrói o min-heap', 'Builds the min-heap') });
    const o = HEAP_OFFSETS.build;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
      vars.i = i;
      add(o + HB.loop, `${tr('PARA', 'FOR')} i (i = ${i})`, tr(`i recebe ${i}${i === Math.floor(n / 2) - 1 ? `, o último pai: (n / 2) - 1 = ${i}. Os nós de ${i + 1} em diante são folhas e já são heaps` : ''}.`, `i receives ${i}${i === Math.floor(n / 2) - 1 ? `, the last parent: (n / 2) - 1 = ${i}. The nodes from ${i + 1} on are leaves and already heaps` : ''}.`), 'update');
      add(o + HB.call, `minHeapify(A, i, n)`, tr(`Chama minHeapify(A, ${i}, ${n}) para fazer do nó ${i} a raiz de um min-heap.`, `Calls minHeapify(A, ${i}, ${n}) to make node ${i} the root of a min-heap.`), 'neutral');
      heapify(i, n);
    }
    vars.i = -1;
    add(o + HB.loop, `${tr('PARA', 'FOR')} i (i = -1): ${tr('fim', 'end')}`, tr('i chegou a -1: todos os pais foram ajustados e o vetor inteiro é um min-heap: a raiz A[0] é o menor valor.', 'i reached -1: all the parents were fixed and the whole array is a min-heap: the root A[0] is the smallest value.'), 'success');
    dbg.pop();
  }

  const vars = { k, n: NONE, i: NONE };
  dbg.push({ kind: 'main', label: 'partialMinHeapSort(A, k)', vars, phase: tr('Começa', 'Starts') });
  add(HM.head, 'partialMinHeapSort(A, k)', tr(`Chamada com k = ${k}: o vetor vira um min-heap e o menor valor é extraído ${k} ${k === 1 ? 'vez' : 'vezes'}, indo para o fim do vetor.`, `Call with k = ${k}: the array becomes a min-heap and the smallest value is extracted ${k} ${k === 1 ? 'time' : 'times'}, going to the end of the array.`), 'neutral');
  vars.n = n;
  add(HM.n, tr('n ← tamanho de A', 'n ← length of A'), tr(`n recebe ${n}.`, `n receives ${n}.`), 'update');
  add(HM.build, 'buildMinHeap(A, n)', tr(`Chama buildMinHeap(A, ${n}): primeiro o vetor precisa virar um min-heap (todo pai menor ou igual aos filhos).`, `Calls buildMinHeap(A, ${n}): first the array must become a min-heap (every parent smaller than or equal to its children).`), 'neutral');
  build();
  log.push(tr(`Min-heap pronto: raiz ${fmt(v(0))}`, `Min-heap ready: root ${fmt(v(0))}`));
  dbg.frames[0].phase = tr('Extrai os menores', 'Extracts the smallest');
  for (let i = n - 1; i >= n - k; i -= 1) {
    vars.i = i;
    add(HM.loop, `${tr('PARA', 'FOR')} i (i = ${i})`, tr(`i recebe ${i}: é a extração ${n - i} de ${k}. A posição ${i} vai receber o ${n - i}º menor valor, que está na raiz A[0] = ${fmt(v(0))}.`, `i receives ${i}: it is extraction ${n - i} of ${k}. Position ${i} will receive the ${n - i}th smallest value, which is at the root A[0] = ${fmt(v(0))}.`), 'update');
    add(HM.swap, `trocar(A, 0, i)`, tr(`Chama trocar(A, 0, ${i}): a raiz (o menor do heap) vai para a última posição do heap.`, `Calls trocar(A, 0, ${i}): the root (the smallest of the heap) goes to the last position of the heap.`), 'neutral', { foundIndices: [0] });
    swap(0, i);
    state.sortedFrom = i;
    log.push(tr(`Extração ${n - i}: ${fmt(v(i))} → posição ${i}`, `Extraction ${n - i}: ${fmt(v(i))} → position ${i}`));
    add(HM.heapify, `minHeapify(A, 0, i)`, tr(`${fmt(v(i))} saiu do heap (posição ${i}, em verde). Chama minHeapify(A, 0, ${i}): o heap agora tem ${i} ${i === 1 ? 'posição' : 'posições'} e o valor que veio do fim para a raiz precisa descer.`, `${fmt(v(i))} left the heap (position ${i}, in green). Calls minHeapify(A, 0, ${i}): the heap now has ${i} ${i === 1 ? 'position' : 'positions'} and the value that came from the end to the root must sink.`), 'neutral');
    heapify(0, i);
  }
  vars.i = n - k - 1;
  add(HM.loop, `${tr('PARA', 'FOR')} i (i = ${n - k - 1}): ${tr('fim', 'end')}`, tr(`i = ${n - k - 1} passou de n - k = ${n - k}: as ${k} extrações terminaram.`, `i = ${n - k - 1} went past n - k = ${n - k}: the ${k} extractions are over.`), 'success');
  dbg.frames[0].phase = tr('Fim', 'Done');
  const last = slice(a, n - k, n);
  log.push(tr(`Os ${k} menores (últimas posições): ${last}`, `The ${k} smallest (last positions): ${last}`));
  add(HM.end, tr('Ordenação parcial concluída', 'Partial sort finished'), tr(`Os ${k} menores valores estão nas ${k} últimas posições, A[${n - k}..${n - 1}] = ${last}, do maior para o menor (o menor na última). O início do vetor, ${slice(a, 0, n - k)}, continua sendo um min-heap. Foram ${plural(counters.comparisons, 'comparação', 'comparações')} e ${plural(counters.moves, 'troca', 'trocas')}.`, `The ${k} smallest values are in the last ${k} positions, A[${n - k}..${n - 1}] = ${last}, from the largest to the smallest (the smallest in the last one). The beginning of the array, ${slice(a, 0, n - k)}, is still a min-heap. There were ${plural(counters.comparisons, 'comparison', 'comparisons')} and ${plural(counters.moves, 'swap', 'swaps')}.`), 'done', { output: [...log, tr(`Comparações: ${counters.comparisons} · Trocas: ${counters.moves}`, `Comparisons: ${counters.comparisons} · Swaps: ${counters.moves}`)] });
  return { steps: dbg.steps, a, counters };
}

// ---------------------------------------------------------------------------
// 04 · Quicksort parcial
// ---------------------------------------------------------------------------

export function runQuick(items, k, record = true) {
  const n = items.length;
  const sorted = new Set();
  const state = { pivot: null };
  const dbg = createDebugger(items, {
    record,
    decorate: ({ frame }) => {
      const vars = frame?.vars ?? {};
      const out = { splitAfter: k - 1, sortedIndices: [...sorted], pointers: {} };
      const holder = [...dbg.frames].reverse().find((entry) => Number.isInteger(entry.vars?.low));
      if (holder) out.outsideIndices = outside(n, holder.vars.low, holder.vars.high);
      if (frame?.kind === 'pqs') {
        out.pointers = pick(vars, ['low', 'high', 'pi'], n);
        if (Number.isInteger(vars.pi)) out.pivotIndex = vars.pi;
      } else if (frame?.kind === 'partition') {
        out.pointers = pick(vars, ['low', 'high', 'i', 'j'], n);
        if (state.pivot !== null) out.pivotIndex = state.pivot;
      } else if (frame?.kind === 'trocar') {
        out.pointers = pick(vars, ['i', 'j'], n);
        if (state.pivot !== null) out.pivotIndex = state.pivot;
      }
      return out;
    },
  });
  const { a, add, counters, log } = dbg;
  const v = (index) => a[index].v;
  const swap = makeSwap(dbg, QUICK_OFFSETS.swap);
  const po = QUICK_OFFSETS.partition;

  function partition(low, high) {
    const vars = {
      low, high, pivot: NONE, i: NONE, j: NONE,
    };
    const text = `partition(${low}, ${high})`;
    dbg.push({
      kind: 'partition', label: text, vars, phase: tr('Particiona em torno do último', 'Partitions around the last one'),
    });
    const startComparisons = counters.comparisons;
    const startMoves = counters.moves;
    vars.pivot = v(high);
    state.pivot = high;
    add(po + P.pivot, 'pivot ← A[high]', tr(`pivot recebe A[${high}] = ${fmt(vars.pivot)}, o último valor do trecho (posições ${low} a ${high}). Os demais serão separados em menores ou iguais ao pivô, à esquerda, e maiores, à direita.`, `pivot receives A[${high}] = ${fmt(vars.pivot)}, the last value of the range (positions ${low} to ${high}). The others will be separated into smaller than or equal to the pivot, on the left, and larger, on the right.`), 'update');
    vars.i = low - 1;
    add(po + P.i, 'i ← low - 1', tr(`i recebe ${vars.i}: é o fim da região dos valores menores ou iguais ao pivô, que ainda está vazia.`, `i receives ${vars.i}: it is the end of the region of values smaller than or equal to the pivot, which is still empty.`), 'update');
    for (let j = low; j < high; j += 1) {
      vars.j = j;
      add(po + P.loop, `${tr('PARA', 'FOR')} j (j = ${j})`, tr(`j recebe ${j}: vamos comparar A[${j}] = ${fmt(v(j))} com o pivô ${fmt(vars.pivot)}.`, `j receives ${j}: let us compare A[${j}] = ${fmt(v(j))} with the pivot ${fmt(vars.pivot)}.`), 'comparison', { comparedIndices: [j] });
      counters.comparisons += 1;
      const small = v(j) <= vars.pivot;
      add(po + P.test, `${tr('SE', 'IF')} A[j] ≤ pivot`, tr(`${fmt(v(j))} ≤ ${fmt(vars.pivot)} é ${small ? 'verdadeiro: o valor pertence à região dos menores ou iguais' : 'falso: o valor é maior que o pivô e fica onde está, na região dos maiores'}.`, `${fmt(v(j))} ≤ ${fmt(vars.pivot)} is ${small ? 'true: the value belongs to the region of the smaller or equal ones' : 'false: the value is larger than the pivot and stays where it is, in the region of the larger ones'}.`), 'comparison', {
        comparedIndices: [j], compare: cmp('A[j]', fmt(v(j)), '≤', 'pivot', fmt(vars.pivot), small),
      });
      if (small) {
        vars.i += 1;
        add(po + P.inc, 'i ← i + 1', tr(`i avança para ${vars.i}: a região dos menores ou iguais ganha uma posição.`, `i advances to ${vars.i}: the region of the smaller or equal ones gains a position.`), 'update');
        add(po + P.swapIn, 'trocar(A, i, j)', tr(`Chama trocar(A, ${vars.i}, ${j}): leva A[${j}] para dentro da região dos menores${vars.i === j ? ' (é a mesma posição)' : ''}.`, `Calls trocar(A, ${vars.i}, ${j}): takes A[${j}] into the region of the smaller ones${vars.i === j ? ' (it is the same position)' : ''}.`), 'neutral');
        swap(vars.i, j);
      }
    }
    vars.j = high;
    add(po + P.loop, `${tr('PARA', 'FOR')} j (j = ${high}): ${tr('fim', 'end')}`, tr(`j = ${high} chegou ao pivô: a varredura terminou. As posições ${low}..${vars.i} guardam os valores menores ou iguais ao pivô.`, `j = ${high} reached the pivot: the sweep is over. Positions ${low}..${vars.i} hold the values smaller than or equal to the pivot.`), 'success');
    add(po + P.swapPivot, 'trocar(A, i + 1, high)', tr(`Chama trocar(A, ${vars.i + 1}, ${high}): o pivô vai para a posição ${vars.i + 1}, logo depois dos menores ou iguais.`, `Calls trocar(A, ${vars.i + 1}, ${high}): the pivot goes to position ${vars.i + 1}, right after the smaller or equal ones.`), 'neutral');
    swap(vars.i + 1, high);
    state.pivot = vars.i + 1;
    sorted.add(vars.i + 1);
    log.push(tr(`${text}: pivô ${fmt(vars.pivot)} → posição ${vars.i + 1} (${plural(counters.comparisons - startComparisons, 'comparação', 'comparações')}, ${plural(counters.moves - startMoves, 'troca', 'trocas')})`, `${text}: pivot ${fmt(vars.pivot)} → position ${vars.i + 1} (${plural(counters.comparisons - startComparisons, 'comparison', 'comparisons')}, ${plural(counters.moves - startMoves, 'swap', 'swaps')})`));
    add(po + P.ret, 'RETORNE i + 1', tr(`A função devolve ${vars.i + 1}: a posição definitiva do pivô ${fmt(vars.pivot)}. Tudo à esquerda dele é menor ou igual, e tudo à direita, maior.`, `The function returns ${vars.i + 1}: the final position of the pivot ${fmt(vars.pivot)}. Everything to its left is smaller or equal, and everything to its right, larger.`), 'success', { pivotIndex: vars.i + 1 });
    const result = vars.i + 1;
    dbg.pop();
    state.pivot = null;
    return result;
  }

  function pqs(low, high, depth) {
    const vars = {
      low, high, k, pi: NONE,
    };
    const text = `partialQuickSort(${low}, ${high})`;
    dbg.push({
      kind: 'pqs', label: text, vars, phase: tr('Particiona e decide o lado', 'Partitions and decides the side'),
    });
    const size = Math.max(0, high - low + 1);
    add(Q.head, text, depth === 0
      ? tr(`Chamada inicial: partialQuickSort(A, 0, ${n - 1}, ${k}). O trecho é o vetor inteiro, com ${plural(size, 'elemento', 'elementos')}, e k = ${k}: queremos ordenar as posições 0 a ${k - 1}.`, `Initial call: partialQuickSort(A, 0, ${n - 1}, ${k}). The range is the whole array, with ${plural(size, 'element', 'elements')}, and k = ${k}: we want to sort positions 0 to ${k - 1}.`)
      : tr(`Nova chamada, com low = ${low} e high = ${high}: ${size === 0 ? 'o trecho é vazio' : `o trecho tem ${plural(size, 'elemento', 'elementos')}`}. Cada chamada tem as suas próprias variáveis.`, `New call, with low = ${low} and high = ${high}: ${size === 0 ? 'the range is empty' : `the range has ${plural(size, 'element', 'elements')}`}. Each call has its own variables.`), 'neutral');
    const divides = low < high;
    if (low === high) sorted.add(low);
    add(Q.test, `${tr('SE', 'IF')} low < high`, divides
      ? tr(`${low} < ${high} é verdadeiro: o trecho tem mais de um elemento e precisa ser particionado.`, `${low} < ${high} is true: the range has more than one element and needs to be partitioned.`)
      : tr(`${low} < ${high} é falso: ${low === high ? 'o trecho tem um só elemento, que já está na posição certa' : 'o trecho é vazio'} (caso base). A chamada termina.`, `${low} < ${high} is false: ${low === high ? 'the range has a single element, which is already in the right position' : 'the range is empty'} (base case). The call ends.`), divides ? 'comparison' : 'success', { compare: cmp('low', String(low), '<', 'high', String(high), divides) });
    if (!divides) {
      dbg.pop();
      return;
    }
    add(Q.part, 'pi ← partition(A, low, high)', tr(`Chama partition para o trecho de ${low} a ${high}: o último valor, A[${high}] = ${fmt(v(high))}, será o pivô e ficará na posição definitiva.`, `Calls partition for the range from ${low} to ${high}: the last value, A[${high}] = ${fmt(v(high))}, will be the pivot and will end up in its final position.`), 'neutral');
    vars.pi = partition(low, high);
    const { pi } = vars;
    add(Q.part, 'pi ← partition(A, low, high)', tr(`partition devolveu ${pi}: pi recebe ${pi}. O pivô ${fmt(v(pi))} está na posição definitiva ${pi}.`, `partition returned ${pi}: pi receives ${pi}. The pivot ${fmt(v(pi))} is at its final position ${pi}.`), 'update', { pivotIndex: pi });

    const covers = pi >= k;
    add(Q.testK, `${tr('SE', 'IF')} pi ≥ k`, covers
      ? tr(`${pi} ≥ ${k} é verdadeiro: a posição do pivô já está além das ${k} primeiras. Os ${k} menores estão todos à esquerda dele, então o lado direito pode ser abandonado.`, `${pi} ≥ ${k} is true: the pivot position is already beyond the first ${k}. The ${k} smallest are all to its left, so the right side can be abandoned.`)
      : tr(`${pi} ≥ ${k} é falso: o pivô cai dentro das ${k} primeiras posições. O lado esquerdo precisa ser ordenado e, se ainda faltar, o direito também.`, `${pi} ≥ ${k} is false: the pivot falls inside the first ${k} positions. The left side must be sorted and, if something is still missing, so must the right.`), 'comparison', { compare: cmp('pi', String(pi), '≥', 'k', String(k), covers), pivotIndex: pi });
    const leftText = tr(`Chama partialQuickSort para os valores à esquerda do pivô, das posições ${low} a ${pi - 1}${pi - 1 < low ? ' (nenhum: trecho vazio)' : ''}.`, `Calls partialQuickSort for the values to the left of the pivot, positions ${low} to ${pi - 1}${pi - 1 < low ? ' (none: empty range)' : ''}.`);
    if (covers) {
      add(Q.leftTop, `partialQuickSort(A, low, pi - 1, k)`, leftText, 'neutral', { pivotIndex: pi });
      pqs(low, pi - 1, depth + 1);
      log.push(tr(`${text}: o lado direito (${pi + 1}..${high}) foi abandonado`, `${text}: the right side (${pi + 1}..${high}) was abandoned`));
    } else {
      add(Q.leftElse, `partialQuickSort(A, low, pi - 1, k)`, leftText, 'neutral', { pivotIndex: pi });
      pqs(low, pi - 1, depth + 1);
      const goRight = pi + 1 < k;
      add(Q.testRight, `${tr('SE', 'IF')} pi + 1 < k`, goRight
        ? tr(`${pi + 1} < ${k} é verdadeiro: ainda faltam posições entre ${pi + 1} e ${k - 1} para completar os ${k} menores, então o lado direito precisa ser ordenado.`, `${pi + 1} < ${k} is true: positions ${pi + 1} to ${k - 1} are still missing to complete the ${k} smallest, so the right side must be sorted.`)
        : tr(`${pi + 1} < ${k} é falso: com o pivô na posição ${pi}, as ${k} primeiras posições já estão prontas. O lado direito (${pi + 1}..${high}) é abandonado.`, `${pi + 1} < ${k} is false: with the pivot at position ${pi}, the first ${k} positions are ready. The right side (${pi + 1}..${high}) is abandoned.`), 'comparison', { compare: cmp('pi + 1', String(pi + 1), '<', 'k', String(k), goRight), pivotIndex: pi });
      if (goRight) {
        add(Q.right, `partialQuickSort(A, pi + 1, high, k)`, tr(`Chama partialQuickSort para os valores à direita do pivô, das posições ${pi + 1} a ${high}: só até a posição ${k - 1} importa.`, `Calls partialQuickSort for the values to the right of the pivot, positions ${pi + 1} to ${high}: only up to position ${k - 1} matters.`), 'neutral', { pivotIndex: pi });
        pqs(pi + 1, high, depth + 1);
      } else {
        log.push(tr(`${text}: o lado direito (${pi + 1}..${high}) foi abandonado`, `${text}: the right side (${pi + 1}..${high}) was abandoned`));
      }
    }
    dbg.pop();
  }

  pqs(0, n - 1, 0);
  const firstK = slice(a, 0, k);
  log.push(tr(`Os ${k} menores: ${firstK}`, `The ${k} smallest: ${firstK}`));
  add(Q.end, tr('Ordenação parcial concluída', 'Partial sort finished'), tr(`A[0..${k - 1}] = ${firstK}: os ${k} menores valores, em ordem crescente. O restante, ${slice(a, k, n)}, ficou particionado mas não ordenado. Foram ${plural(counters.comparisons, 'comparação', 'comparações')} e ${plural(counters.moves, 'troca', 'trocas')}.`, `A[0..${k - 1}] = ${firstK}: the ${k} smallest values, in ascending order. The rest, ${slice(a, k, n)}, was partitioned but not sorted. There were ${plural(counters.comparisons, 'comparison', 'comparisons')} and ${plural(counters.moves, 'swap', 'swaps')}.`), 'done', {
    sortedCount: k, sortedIndices: range(k), output: [...log, tr(`Comparações: ${counters.comparisons} · Trocas: ${counters.moves}`, `Comparisons: ${counters.comparisons} · Swaps: ${counters.moves}`)],
  });
  return { steps: dbg.steps, a, counters };
}

// ---------------------------------------------------------------------------
// 05 · Comparando por k
// ---------------------------------------------------------------------------

export const METHODS = [
  { id: 'selection', name: tr('Seleção parcial', 'Partial selection'), run: runSelection },
  { id: 'insertion', name: tr('Inserção parcial', 'Partial insertion'), run: runInsertion },
  { id: 'heap', name: tr('Heapsort parcial', 'Partial heapsort'), run: runHeap },
  { id: 'quick', name: tr('Quicksort parcial', 'Partial quicksort'), run: runQuick },
];

/**
 * Os vetores da comparação: `size` valores distintos, embaralhados com uma semente que vem do vetor do aluno
 * (os mesmos números dão os mesmos vetores). `salt` escolhe qual dos vetores de amostra.
 */
export function comparisonVector(values, size, salt = 0) {
  let seed = ((values.reduce((sum, value, index) => sum + (Math.abs(Math.trunc(value)) + 1) * (index + 7), 0) + salt * 7919) * 2654435761) >>> 0 || 1;
  const random = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pool = Array.from({ length: size }, (_, index) => index + 1);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }
  return pool;
}

/** Quantos vetores aleatórios entram na média (menos quando o vetor é grande, para o cálculo ficar rápido). */
export const comparisonSamples = (size) => (size <= 100 ? 12 : 6);

export const comparisonKs = (size) => [...new Set([1, 2, 5, 10, 15, 25, 50, 75, size].filter((value) => value >= 1 && value <= size))].sort((x, y) => x - y);

function compareSteps(values, config) {
  const size = config.size;
  const samples = comparisonSamples(size);
  const vectors = Array.from({ length: samples }, (_, salt) => toItems(comparisonVector(values, size, salt)));
  const vector = valuesOf(vectors[0]);
  const ks = comparisonKs(size);
  const table = ks.map((k) => ({
    k,
    rows: METHODS.map((method) => {
      let comparisons = 0;
      let moves = 0;
      vectors.forEach((items) => {
        const { counters } = method.run(items, k, false);
        comparisons += counters.comparisons;
        moves += counters.moves;
      });
      const mean = (total) => Math.round(total / samples);
      return {
        id: method.id, name: method.name, comparisons: mean(comparisons), moves: mean(moves), cost: mean(comparisons) + mean(moves),
      };
    }),
  }));
  const longest = Math.max(1, ...table.flatMap((entry) => entry.rows.map((row) => row.cost)));
  const winner = (entry) => entry.rows.reduce((best, row) => (row.cost < best.cost ? row : best));
  const chart = (entry, final = false) => ({
    title: tr(`Operações médias para obter os ${entry.k} menores de ${size} valores (${samples} vetores)`, `Average operations to get the ${entry.k} smallest of ${size} values (${samples} arrays)`),
    hint: tr('operações = comparações + movimentações · ⇄ = movimentações', 'operations = comparisons + moves · ⇄ = moves'),
    max: longest,
    bars: entry.rows.map((row) => ({ label: row.name, value: row.cost, mark: `⇄ ${row.moves}`, current: row.id === winner(entry).id })),
    totals: [
      { label: 'k', value: entry.k, note: tr(`de n = ${size} valores`, `of n = ${size} values`) },
      { label: tr('Menor custo', 'Lowest cost'), value: winner(entry).cost, note: winner(entry).name },
    ],
    final,
  });
  const base = { sortedIndices: [] };
  const steps = [
    step(vector.slice(0, 12), 0, tr('Os quatro métodos, o mesmo vetor', 'The four methods, the same array'), tr(`${samples} vetores aleatórios de n = ${size} valores distintos (o custo de cada método é a média deles, porque o Quicksort varia com a sorte do pivô). Para cada k, os quatro métodos obtêm os k menores e contamos as operações: comparações + movimentações (trocas, ou deslocamentos na inserção). Vamos ver quem vence conforme o k cresce.`, `${samples} random arrays of n = ${size} distinct values (the cost of each method is their average, because Quicksort varies with the luck of the pivot). For each k, the four methods get the k smallest and we count the operations: comparisons + moves (swaps, or shifts in insertion). Let us see who wins as k grows.`), 'neutral', { ...base, chart: chart(table[0]) }),
  ];
  table.forEach((entry, index) => {
    const best = winner(entry);
    const second = [...entry.rows].sort((x, y) => x.cost - y.cost)[1];
    steps.push(step(vector.slice(0, 12), 5, `k = ${entry.k}`, tr(`Para k = ${entry.k}: ${entry.rows.map((row) => `${row.name} ${row.cost}`).join(' · ')}. O mais barato é ${best.name}, com ${best.cost} operações${second ? ` (o segundo, ${second.name}, faz ${second.cost})` : ''}.`, `For k = ${entry.k}: ${entry.rows.map((row) => `${row.name} ${row.cost}`).join(' · ')}. The cheapest is ${best.name}, with ${best.cost} operations${second ? ` (the second, ${second.name}, makes ${second.cost})` : ''}.`), index === table.length - 1 ? 'done' : 'comparison', {
      ...base, chart: chart(entry, index === table.length - 1), variables: { k: entry.k, n: size },
    }));
  });
  const winners = table.map((entry) => `k = ${entry.k}: ${winner(entry).name}`);
  const last = steps.at(-1);
  steps.push({
    ...last,
    line: 6,
    title: tr('Quem vence, e quando', 'Who wins, and when'),
    description: tr('Para k pequeno a inserção parcial é imbatível (cerca de n comparações); conforme o k cresce, ela passa a deslocar muitos valores e o Quicksort parcial assume a liderança, com o Heapsort parcial por perto, mas mais lento. A seleção parcial faz n · k comparações, e só ganha em trocas. É o que dizem os slides 106 e 107.', 'For a small k, partial insertion is unbeatable (about n comparisons); as k grows, it starts shifting many values and partial quicksort takes the lead, with partial heapsort close by, but slower. Partial selection makes n · k comparisons and only wins on swaps. That is what slides 106 and 107 say.'),
    tone: 'done',
    output: winners,
  });
  return steps;
}

// ---------------------------------------------------------------------------

/** O k padrão: metade dos valores (o exercício da aula pede os 5 menores de 10). */
export const defaultK = (count) => Math.max(1, Math.min(count - 1, Math.ceil(count / 2)));

export function buildSteps(id, values, config = {}) {
  const asked = config.k === null || config.k === undefined || config.k === '' ? NaN : Number(config.k);
  const k = Math.max(1, Math.min(values.length, Number.isInteger(asked) ? asked : defaultK(values.length)));
  const items = toItems(values);
  switch (id) {
    case 'selection': return runSelection(items, k).steps;
    case 'insertion': return runInsertion(items, k).steps;
    case 'heap': return runHeap(items, k).steps;
    case 'quick': return runQuick(items, k).steps;
    case 'compare': return compareSteps(values, { size: Math.max(10, Math.min(300, Number.isInteger(Number(config.size)) ? Number(config.size) : 100)) });
    default: return runSelection(items, k).steps;
  }
}
