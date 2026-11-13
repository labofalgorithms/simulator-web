import {
  fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf, withRepeats,
} from '../shared/sort-steps.js';
import {
  adaptabilityScenarios, copyItems, flippedPairs, plural,
} from '../shared/linear-sort.js';
import {
  NONE, cmp, createDebugger, outside,
} from '../shared/debug-trace.js';
import { tr } from '../../core/i18n.js';

// ---------------------------------------------------------------------------
// Pseudocódigos. O Introsort é o do slide 127; Quick + Insertion e Merge + Insertion não têm código nos
// slides (só a ideia, nos slides 113 a 119) e seguem o mesmo molde: a mesma estrutura do Introsort sem o
// limite de profundidade, e o Merge Sort que entrega os trechos curtos ao Insertion Sort. As funções
// auxiliares (partition, heapSortRange, insertionSortRange, merge) são as do slide 128, executadas
// em um passo só: o interior delas está nos módulos de Quick Sort, Heap Sort, Insertion Sort e Merge Sort.
// ---------------------------------------------------------------------------

const HELPERS = [
  '',
  tr('// Funções auxiliares (cada chamada é um passo só):', '// Helper functions (each call is a single step):'),
];
const PARTITION_NOTE = [
  tr('//   partition(A, lo, hi): rearranja o trecho e devolve o índice do pivô', '//   partition(A, lo, hi): rearranges the range and returns the pivot index'),
  tr('//     (pivô: mediana-de-três, se ligada, senão o último valor; depois, Lomuto)', '//     (pivot: median-of-three, if on, otherwise the last value; then, Lomuto)'),
];
const INSERTION_NOTE = [tr('//   insertionSortRange(A, lo, hi): insertion sort apenas no intervalo', '//   insertionSortRange(A, lo, hi): insertion sort only on the interval')];
const HEAP_NOTE = [tr('//   heapSortRange(A, lo, hi): heapsort apenas no intervalo', '//   heapSortRange(A, lo, hi): heapsort only on the interval')];
const CUTOFF_NOTE = [tr('//   CUTOFF: tamanho máximo do trecho entregue ao Insertion Sort', '//   CUTOFF: largest range size handed to Insertion Sort')];

const QI_CODE = [
  tr('PROCEDIMENTO quickInsertion(A)', 'PROCEDURE quickInsertion(A)'),
  tr('  n ← length(A)', '  n ← length(A)'),
  '  quickInsertionUtil(A, 0, n - 1)',
  tr('FIM', 'END'),
  '',
  tr('PROCEDIMENTO quickInsertionUtil(A, lo, hi)', 'PROCEDURE quickInsertionUtil(A, lo, hi)'),
  tr('  ENQUANTO (hi - lo + 1) > CUTOFF FAÇA', '  WHILE (hi - lo + 1) > CUTOFF DO'),
  tr('    // pivô: mediana-de-três (opcional)', '    // pivot: median-of-three (optional)'),
  '    pivotIndex ← partition(A, lo, hi)',
  tr('    // Ordena primeiro o lado menor (reduz a pilha); itera no maior', '    // Sorts the smaller side first (shrinks the stack); loops on the larger'),
  tr('    SE (pivotIndex - lo) < (hi - pivotIndex) ENTÃO', '    IF (pivotIndex - lo) < (hi - pivotIndex) THEN'),
  '      quickInsertionUtil(A, lo, pivotIndex - 1)',
  '      lo ← pivotIndex + 1',
  tr('    SENÃO', '    ELSE'),
  '      quickInsertionUtil(A, pivotIndex + 1, hi)',
  '      hi ← pivotIndex - 1',
  tr('    FIM SE', '    END IF'),
  tr('  FIM ENQUANTO', '  END WHILE'),
  '  insertionSortRange(A, lo, hi)',
  tr('FIM', 'END'),
  ...HELPERS, ...PARTITION_NOTE, ...INSERTION_NOTE, ...CUTOFF_NOTE,
];
const QI = {
  head: 0, n: 1, call: 2, util: 5, loop: 6, part: 8, test: 10, recL: 11, setLo: 12, recR: 14, setHi: 15, ins: 18, end: 19,
};

const IS_CODE = [
  tr('PROCEDIMENTO introSort(A)', 'PROCEDURE introSort(A)'),
  '  n ← length(A)',
  '  depthLimit ← 2 * floor(log2(n))',
  '  introSortUtil(A, 0, n - 1, depthLimit)',
  tr('FIM', 'END'),
  '',
  tr('PROCEDIMENTO introSortUtil(A, lo, hi, depthLimit)', 'PROCEDURE introSortUtil(A, lo, hi, depthLimit)'),
  tr('  ENQUANTO (hi - lo + 1) > CUTOFF FAÇA', '  WHILE (hi - lo + 1) > CUTOFF DO'),
  tr('    SE depthLimit = 0 ENTÃO', '    IF depthLimit = 0 THEN'),
  '      heapSortRange(A, lo, hi)',
  tr('      RETORNE', '      RETURN'),
  tr('    FIM SE', '    END IF'),
  '    depthLimit ← depthLimit - 1',
  tr('    // pivô: mediana-de-três (opcional)', '    // pivot: median-of-three (optional)'),
  '    pivotIndex ← partition(A, lo, hi)',
  tr('    // Ordena primeiro o lado menor (reduz pilha); itera no maior', '    // Sorts the smaller side first (shrinks stack); loops on the larger'),
  tr('    SE (pivotIndex - lo) < (hi - pivotIndex) ENTÃO', '    IF (pivotIndex - lo) < (hi - pivotIndex) THEN'),
  '      introSortUtil(A, lo, pivotIndex - 1, depthLimit)',
  '      lo ← pivotIndex + 1',
  tr('    SENÃO', '    ELSE'),
  '      introSortUtil(A, pivotIndex + 1, hi, depthLimit)',
  '      hi ← pivotIndex - 1',
  tr('    FIM SE', '    END IF'),
  tr('  FIM ENQUANTO', '  END WHILE'),
  '  insertionSortRange(A, lo, hi)',
  tr('FIM', 'END'),
  ...HELPERS, ...PARTITION_NOTE, ...HEAP_NOTE, ...INSERTION_NOTE, ...CUTOFF_NOTE,
];
const IS = {
  head: 0, n: 1, depth: 2, call: 3, util: 6, loop: 7, depthTest: 8, heap: 9, ret: 10, dec: 12, part: 14, test: 16, recL: 17, setLo: 18, recR: 20, setHi: 21, ins: 24, end: 25,
};

const MI_CODE = [
  tr('PROCEDIMENTO mergeInsertion(A)', 'PROCEDURE mergeInsertion(A)'),
  '  n ← length(A)',
  '  mergeInsertionUtil(A, 0, n - 1)',
  tr('FIM', 'END'),
  '',
  tr('PROCEDIMENTO mergeInsertionUtil(A, lo, hi)', 'PROCEDURE mergeInsertionUtil(A, lo, hi)'),
  tr('  SE (hi - lo + 1) ≤ CUTOFF ENTÃO', '  IF (hi - lo + 1) ≤ CUTOFF THEN'),
  '    insertionSortRange(A, lo, hi)',
  tr('    RETORNE', '    RETURN'),
  tr('  FIM SE', '  END IF'),
  '  mid ← (lo + hi) / 2',
  '  mergeInsertionUtil(A, lo, mid)',
  '  mergeInsertionUtil(A, mid + 1, hi)',
  '  merge(A, lo, mid, hi)',
  tr('FIM', 'END'),
  ...HELPERS,
  tr('//   merge(A, lo, mid, hi): intercala A[lo..mid] e A[mid+1..hi] (estável: no empate sai o da esquerda)', '//   merge(A, lo, mid, hi): merges A[lo..mid] and A[mid+1..hi] (stable: on a tie the left one goes first)'),
  ...INSERTION_NOTE, ...CUTOFF_NOTE,
];
const MI = {
  head: 0, n: 1, call: 2, util: 5, test: 6, ins: 7, ret: 8, mid: 10, recL: 11, recR: 12, merge: 13, end: 14,
};

// Não estão nos slides: o experimento de cada análise, escrito em palavras do pseudocódigo.
const ADAPT_CODE = [
  tr('PARA cada vetor em {ordenado, quase ordenado, invertido, o seu} FAÇA', 'FOR each array in {sorted, almost sorted, reversed, yours} DO'),
  tr('  PARA cada híbrido em {Quick + Insertion, Merge + Insertion, Introsort} FAÇA', '  FOR each hybrid in {Quick + Insertion, Merge + Insertion, Introsort} DO'),
  tr('    B ← cópia do vetor', '    B ← copy of the array'),
  tr('    ordena B com o híbrido e conta comparações e movimentações', '    sorts B with the hybrid and counts comparisons and moves'),
  tr('  FIM PARA', '  END FOR'),
  tr('  compara o custo dos três híbridos neste vetor', '  compares the cost of the three hybrids on this array'),
  tr('FIM PARA', 'END FOR'),
];
const STABILITY_CODE = [
  tr('itens ← A, com uma letra em cada valor repetido (a, b, c...)', 'items ← A, with a letter on each repeated value (a, b, c...)'),
  tr('PARA cada híbrido em {Quick + Insertion, Merge + Insertion, Introsort} FAÇA', 'FOR each hybrid in {Quick + Insertion, Merge + Insertion, Introsort} DO'),
  tr('  B ← cópia dos itens', '  B ← copy of the items'),
  tr('  ordena B com o híbrido', '  sorts B with the hybrid'),
  tr('  SE os iguais saíram em ordem alfabética ENTÃO', '  IF the equals came out in alphabetical order THEN'),
  tr('    o híbrido preservou a ordem (estável neste vetor)', '    the hybrid preserved the order (stable on this array)'),
  tr('  SENÃO', '  ELSE'),
  tr('    o híbrido inverteu a ordem de algum par (instável)', '    the hybrid reversed the order of some pair (unstable)'),
  tr('  FIM SE', '  END IF'),
  tr('FIM PARA', 'END FOR'),
];

const GROUP_HYBRIDS = tr('Os híbridos', 'The hybrids');
const GROUP_ANALYSIS = tr('Análise', 'Analysis');

export const algorithms = [
  {
    id: 'quick-insertion', title: tr('Quick Sort + Insertion Sort', 'Quick Sort + Insertion Sort'), menuLabel: 'Quick + Insertion', group: GROUP_HYBRIDS, number: '01',
    description: tr('O Quick Sort particiona os trechos grandes e, quando um trecho tem CUTOFF elementos ou menos, o Insertion Sort termina o serviço: poucas comparações e movimentações onde o Quick Sort teria só overhead.', 'Quick Sort partitions the large ranges and, when a range has CUTOFF elements or fewer, Insertion Sort finishes the job: few comparisons and moves where Quick Sort would only have overhead.'),
    interaction: tr('Mude o CUTOFF e a mediana-de-três e veja quantos trechos vão para o Insertion Sort. O lado menor é ordenado por chamada recursiva e o maior continua no laço (eliminação da recursão de cauda), por isso a pilha fica curta.', 'Change CUTOFF and the median-of-three and see how many ranges go to Insertion Sort. The smaller side is sorted by a recursive call and the larger one goes on in the loop (tail recursion elimination), so the stack stays short.'),
    complexity: { time: 'O(n log n)', space: 'O(log n)', note: tr('No caso médio, são cerca de n log n comparações, com um custo menor por elemento nos trechos pequenos. O pior caso continua O(n²) (pivôs ruins; a mediana-de-três só o torna raro). Como o lado menor é recursivo, a pilha nunca passa de log₂ n chamadas.', 'In the average case there are about n log n comparisons, with a lower cost per element in the small ranges. The worst case is still O(n²) (bad pivots; the median-of-three only makes it rare). Since the smaller side is recursive, the stack never goes beyond log₂ n calls.') },
    pseudocode: QI_CODE,
  },
  {
    id: 'merge-insertion', title: tr('Merge Sort + Insertion Sort', 'Merge Sort + Insertion Sort'), menuLabel: 'Merge + Insertion', group: GROUP_HYBRIDS, number: '02',
    description: tr('O Merge Sort divide até restarem sublistas curtas (CUTOFF elementos ou menos), o Insertion Sort ordena cada uma e só então vêm as intercalações. Continua estável.', 'Merge Sort splits until short sublists are left (CUTOFF elements or fewer), Insertion Sort sorts each one and only then come the merges. It remains stable.'),
    interaction: tr('Compare com o Merge Sort puro: as folhas da recursão não chegam a um elemento só. Aumente o CUTOFF e veja a pilha encurtar e as intercalações diminuírem.', 'Compare with plain Merge Sort: the leaves of the recursion do not go down to a single element. Increase CUTOFF and see the stack get shorter and the merges decrease.'),
    complexity: { time: 'O(n log n)', space: 'O(n)', note: tr('Divisão e intercalação custam O(n log n) em qualquer ordem inicial; as folhas pequenas trocam as intercalações do nível de baixo por um Insertion Sort barato. O vetor auxiliar da intercalação soma O(n) de espaço.', 'Splitting and merging cost O(n log n) in any initial order; the small leaves replace the merges of the bottom level with a cheap Insertion Sort. The auxiliary array of the merge adds O(n) of space.') },
    pseudocode: MI_CODE,
  },
  {
    id: 'introsort', title: tr('Introsort', 'Introsort'), menuLabel: 'Introsort', group: GROUP_HYBRIDS, number: '03',
    description: tr('Começa como Quick Sort, passa para o Heap Sort se a recursão ficar profunda demais (depthLimit = 2 · ⌊log₂ n⌋) e entrega os trechos pequenos ao Insertion Sort: o pior caso fica garantido em O(n log n).', 'Starts as Quick Sort, switches to Heap Sort if the recursion gets too deep (depthLimit = 2 · ⌊log₂ n⌋) and hands the small ranges to Insertion Sort: the worst case is guaranteed at O(n log n).'),
    interaction: tr('Use o botão "Já ordenado" com a mediana desligada: o pivô é sempre o menor ou o maior, o depthLimit chega a 0 e o Heap Sort assume. Você também pode escolher um depthLimit menor para forçar o resgate.', 'Use the "Already sorted" button with the median turned off: the pivot is always the smallest or the largest, depthLimit reaches 0 and Heap Sort takes over. You can also choose a smaller depthLimit to force the rescue.'),
    complexity: { time: 'O(n log n)', space: 'O(log n)', note: tr('No caso médio, é o Quick Sort. Se a profundidade chegar ao limite, o trecho restante é ordenado pelo Heap Sort, que garante O(n log n). Como cada chamada só desce 2 · log₂ n níveis, a pilha também é O(log n).', 'In the average case, it is Quick Sort. If the depth reaches the limit, the remaining range is sorted by Heap Sort, which guarantees O(n log n). Since each call only goes down 2 · log₂ n levels, the stack is also O(log n).') },
    pseudocode: IS_CODE,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: GROUP_ANALYSIS, number: '04',
    description: tr('Os três híbridos em quatro vetores com os mesmos valores em ordens diferentes (ordenado, quase ordenado, invertido e o seu): veja quanto cada ordem inicial muda o custo.', 'The three hybrids on four arrays with the same values in different orders (sorted, almost sorted, reversed and yours): see how much each initial order changes the cost.'),
    interaction: tr('Desligue a mediana-de-três e compare o Quick + Insertion no vetor ordenado: é o pior caso do pivô final, e o Introsort o contorna com o Heap Sort.', 'Turn the median-of-three off and compare Quick + Insertion on the sorted array: it is the worst case of the last-value pivot, and Introsort works around it with Heap Sort.'),
    complexity: { time: 'O(n log n)', space: 'O(n)', note: tr('O Merge + Insertion é o mais regular (a ordem pouco muda o número de comparações; o Insertion Sort ganha nos blocos já ordenados). O Quick + Insertion depende dos pivôs, e o Introsort limita o estrago com o Heap Sort. A adaptabilidade dos híbridos é parcial.', 'Merge + Insertion is the most regular (the order barely changes the number of comparisons; Insertion Sort gains on blocks that are already sorted). Quick + Insertion depends on the pivots, and Introsort limits the damage with Heap Sort. The adaptivity of the hybrids is partial.') },
    pseudocode: ADAPT_CODE,
  },
  {
    id: 'stability', title: tr('Estabilidade', 'Stability'), menuLabel: tr('Estabilidade', 'Stability'), group: GROUP_ANALYSIS, number: '05',
    description: tr('Valores repetidos recebem uma letra que marca a ordem original. Rode os três híbridos no mesmo vetor e veja quais preservam essa ordem.', 'Repeated values get a letter that marks the original order. Run the three hybrids on the same array and see which ones preserve that order.'),
    interaction: tr('Use "Gerar exemplo" para criar um vetor com repetidos em que o Quick + Insertion e o Introsort invertem a ordem e o Merge + Insertion não.', 'Use "Generate example" to create an array with repeated values where Quick + Insertion and Introsort reverse the order and Merge + Insertion does not.'),
    complexity: { time: 'O(n log n)', space: 'O(n)', note: tr('O Merge Sort e o Insertion Sort são estáveis, então o Merge + Insertion também é. O Quick Sort e o Heap Sort movem valores por cima de iguais, então o Quick + Insertion e o Introsort são instáveis.', 'Merge Sort and Insertion Sort are stable, so Merge + Insertion is too. Quick Sort and Heap Sort move values over equals, so Quick + Insertion and Introsort are unstable.') },
    pseudocode: STABILITY_CODE,
  },
];

// ---------------------------------------------------------------------------
// As funções auxiliares, sem passos: cada uma devolve o que aconteceu, para o passo descrever.
// ---------------------------------------------------------------------------

const floorLog2 = (value) => 31 - Math.clz32(Math.max(1, value));

/** partition do slide 105 (Lomuto, pivô no fim); com `median` leva antes a mediana de A[lo], A[mid] e A[hi] para o fim. */
function partitionRange(a, lo, hi, median) {
  let comparisons = 0;
  let moves = 0;
  let pick = null;
  const swap = (x, y) => { [a[x], a[y]] = [a[y], a[x]]; moves += 1; };
  if (median && hi - lo >= 2) {
    const centre = lo + Math.floor((hi - lo) / 2);
    let [x, y, z] = [lo, centre, hi];
    const seen = [a[lo].v, a[centre].v, a[hi].v];
    comparisons += 1;
    if (a[x].v > a[y].v) [x, y] = [y, x];
    comparisons += 1;
    if (a[y].v > a[z].v) [y, z] = [z, y];
    comparisons += 1;
    if (a[x].v > a[y].v) [x, y] = [y, x];
    pick = { centre, seen, index: y, value: a[y].v };
    if (y !== hi) swap(y, hi);
  }
  const pivot = a[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j += 1) {
    comparisons += 1;
    if (a[j].v <= pivot.v) {
      i += 1;
      swap(i, j);
    }
  }
  swap(i + 1, hi);
  return { p: i + 1, comparisons, moves, pick, pivot };
}

/** Insertion Sort do trecho (estável: só desloca o que é estritamente maior). */
function insertionRange(a, lo, hi) {
  let comparisons = 0;
  let moves = 0;
  for (let i = lo + 1; i <= hi; i += 1) {
    const key = a[i];
    let j = i - 1;
    while (j >= lo) {
      comparisons += 1;
      if (a[j].v <= key.v) break;
      a[j + 1] = a[j];
      moves += 1;
      j -= 1;
    }
    a[j + 1] = key;
  }
  return { comparisons, moves };
}

/** Heap Sort (max-heap) só do trecho lo..hi. */
function heapRange(a, lo, hi) {
  let comparisons = 0;
  let moves = 0;
  const size = hi - lo + 1;
  const swap = (x, y) => { [a[lo + x], a[lo + y]] = [a[lo + y], a[lo + x]]; moves += 1; };
  const sift = (start, end) => {
    let root = start;
    for (;;) {
      const left = 2 * root + 1;
      let big = root;
      if (left < end) {
        comparisons += 1;
        if (a[lo + left].v > a[lo + big].v) big = left;
      }
      if (left + 1 < end) {
        comparisons += 1;
        if (a[lo + left + 1].v > a[lo + big].v) big = left + 1;
      }
      if (big === root) return;
      swap(root, big);
      root = big;
    }
  };
  for (let i = Math.floor(size / 2) - 1; i >= 0; i -= 1) sift(i, size);
  for (let end = size - 1; end > 0; end -= 1) {
    swap(0, end);
    sift(0, end);
  }
  return { comparisons, moves };
}

/** Intercalação estável de a[lo..mid] com a[mid+1..hi] (copia para um vetor auxiliar e volta: 2 cópias por elemento). */
function mergeRange(a, lo, mid, hi) {
  const left = a.slice(lo, mid + 1);
  const right = a.slice(mid + 1, hi + 1);
  let comparisons = 0;
  let i = 0;
  let j = 0;
  for (let k = lo; k <= hi; k += 1) {
    if (i < left.length && j < right.length) {
      comparisons += 1;
      a[k] = left[i].v <= right[j].v ? left[i++] : right[j++];
    } else {
      a[k] = i < left.length ? left[i++] : right[j++];
    }
  }
  return { comparisons, moves: 2 * (hi - lo + 1) };
}

// ---------------------------------------------------------------------------
// Execução como num depurador. `opts`: cutoff, median (mediana-de-três), depthLimit (opcional).
// ---------------------------------------------------------------------------

const textOf = (items, from, to) => `[${items.slice(from, to + 1).map(label).join(', ')}]`;
const ENGINE = {
  quick: tr('Quick Sort · particiona', 'Quick Sort · partitions'),
  insertion: tr('Insertion Sort · trecho pequeno', 'Insertion Sort · small range'),
  heap: tr('Heap Sort · resgate', 'Heap Sort · rescue'),
  merge: tr('Merge Sort · intercala', 'Merge Sort · merges'),
  split: tr('Divide o trecho', 'Splits the range'),
};

function utilPointers(frame, count) {
  const vars = frame?.vars ?? {};
  const out = {};
  ['lo', 'hi', 'mid'].forEach((name) => { if (Number.isInteger(vars[name]) && vars[name] >= 0 && vars[name] < count) out[name] = vars[name]; });
  if (Number.isInteger(vars.pivotIndex) && vars.pivotIndex >= 0 && vars.pivotIndex < count) out.pi = vars.pivotIndex;
  return out;
}

/** Quick + Insertion (`opts.heap` falso) e Introsort (`opts.heap` verdadeiro): a mesma estrutura, com ou sem o limite de profundidade. */
export function runQuickHybrid(items, opts, record = true) {
  const { cutoff, median, heap } = opts;
  const n = items.length;
  const L = heap ? IS : QI;
  const name = heap ? 'introSort' : 'quickInsertion';
  const util = `${name}Util`;
  const sorted = new Set();
  const state = {
    phase: '', partitions: 0, insertions: 0, rescues: 0, deepest: 0,
  };
  const dbg = createDebugger(items, {
    record,
    moveLabel: 'movimentações',
    decorate: ({ frame }) => {
      const holder = [...dbg.frames].reverse().find((entry) => entry.kind === 'util');
      return {
        sortedIndices: [...sorted],
        pointers: frame?.kind === 'util' ? utilPointers(frame, n) : {},
        outsideIndices: holder ? outside(n, holder.vars.lo, holder.vars.hi) : [],
        pivotIndex: frame?.kind === 'util' && Number.isInteger(frame.vars.pivotIndex) ? frame.vars.pivotIndex : undefined,
      };
    },
  });
  const { a, add, counters, log } = dbg;
  const phase = () => state.phase;

  function utilCall(lo0, hi0, limit0, depth) {
    const vars = heap ? { lo: lo0, hi: hi0, depthLimit: limit0, pivotIndex: NONE, CUTOFF: cutoff } : { lo: lo0, hi: hi0, pivotIndex: NONE, CUTOFF: cutoff };
    const text = heap ? `introSortUtil(${lo0}, ${hi0}, ${limit0})` : `quickInsertionUtil(${lo0}, ${hi0})`;
    dbg.push({ kind: 'util', label: text, vars, phase });
    state.deepest = Math.max(state.deepest, dbg.frames.length - 1);
    state.phase = ENGINE.split;
    const size0 = hi0 - lo0 + 1;
    add(L.util, text, depth === 0
      ? tr(`Chamada inicial sobre o vetor inteiro (posições ${lo0} a ${hi0}, ${plural(size0, 'elemento', 'elementos')}).${heap ? ` O depthLimit é ${limit0}.` : ''}`, `Initial call on the whole array (positions ${lo0} to ${hi0}, ${plural(size0, 'element', 'elements')}).${heap ? ` The depthLimit is ${limit0}.` : ''}`)
      : tr(`Nova chamada para o trecho ${lo0}..${hi0} (${plural(size0, 'elemento', 'elementos')})${heap ? `, com depthLimit = ${limit0}` : ''}. Cada chamada tem as suas próprias variáveis.`, `New call for the range ${lo0}..${hi0} (${plural(size0, 'element', 'elements')})${heap ? `, with depthLimit = ${limit0}` : ''}. Each call has its own variables.`), 'neutral');

    for (;;) {
      const size = vars.hi - vars.lo + 1;
      const big = size > cutoff;
      add(L.loop, `${tr('ENQUANTO', 'WHILE')} (hi - lo + 1) > CUTOFF`, big
        ? tr(`${size} > ${cutoff} é verdadeiro: o trecho ${vars.lo}..${vars.hi} ainda é grande demais para o Insertion Sort e vai ser particionado.`, `${size} > ${cutoff} is true: the range ${vars.lo}..${vars.hi} is still too large for Insertion Sort and will be partitioned.`)
        : tr(`${Math.max(0, size)} > ${cutoff} é falso: o trecho ${vars.lo}..${vars.hi} tem ${plural(Math.max(0, size), 'elemento', 'elementos')}, no máximo CUTOFF = ${cutoff}. O laço termina e o Insertion Sort fica com o que sobrou.`, `${Math.max(0, size)} > ${cutoff} is false: the range ${vars.lo}..${vars.hi} has ${plural(Math.max(0, size), 'element', 'elements')}, at most CUTOFF = ${cutoff}. The loop ends and Insertion Sort takes what is left.`), big ? 'comparison' : 'success', { compare: cmp('hi − lo + 1', String(Math.max(0, size)), '>', 'CUTOFF', String(cutoff), big) });
      if (!big) break;

      if (heap) {
        const rescue = vars.depthLimit === 0;
        add(L.depthTest, `${tr('SE', 'IF')} depthLimit = 0`, rescue
          ? tr('depthLimit = 0 é verdadeiro: a recursão ficou profunda demais, sinal de partições ruins. O Quick Sort é abandonado e o Heap Sort assume este trecho.', 'depthLimit = 0 is true: the recursion got too deep, a sign of bad partitions. Quick Sort is abandoned and Heap Sort takes over this range.')
          : tr(`depthLimit = ${vars.depthLimit} não é 0: ainda há profundidade de sobra, o Quick Sort segue.`, `depthLimit = ${vars.depthLimit} is not 0: there is still depth to spare, Quick Sort goes on.`), rescue ? 'warning' : 'comparison', { compare: cmp('depthLimit', String(vars.depthLimit), '=', '0', '0', rescue) });
        if (rescue) {
          const before = textOf(a, vars.lo, vars.hi);
          const r = heapRange(a, vars.lo, vars.hi);
          counters.comparisons += r.comparisons;
          counters.moves += r.moves;
          state.rescues += 1;
          state.phase = ENGINE.heap;
          for (let p = vars.lo; p <= vars.hi; p += 1) sorted.add(p);
          log.push(tr(`heapSortRange(${vars.lo}, ${vars.hi}): resgate do Heap Sort (${plural(r.comparisons, 'comparação', 'comparações')}, ${plural(r.moves, 'troca', 'trocas')})`, `heapSortRange(${vars.lo}, ${vars.hi}): Heap Sort rescue (${plural(r.comparisons, 'comparison', 'comparisons')}, ${plural(r.moves, 'swap', 'swaps')})`));
          add(L.heap, 'heapSortRange(A, lo, hi)', tr(`heapSortRange ordenou o trecho ${vars.lo}..${vars.hi} (${plural(size, 'elemento', 'elementos')}) com o Heap Sort, que garante O(n log n): ${before} → ${textOf(a, vars.lo, vars.hi)} (${plural(r.comparisons, 'comparação', 'comparações')}, ${plural(r.moves, 'troca', 'trocas')}).`, `heapSortRange sorted the range ${vars.lo}..${vars.hi} (${plural(size, 'element', 'elements')}) with Heap Sort, which guarantees O(n log n): ${before} → ${textOf(a, vars.lo, vars.hi)} (${plural(r.comparisons, 'comparison', 'comparisons')}, ${plural(r.moves, 'swap', 'swaps')}).`), 'success', { changedIndices: range(vars.hi + 1, vars.lo) });
          add(L.ret, tr('RETORNE', 'RETURN'), tr('O trecho já está ordenado pelo Heap Sort: a chamada retorna sem chegar ao Insertion Sort do fim.', 'The range is already sorted by Heap Sort: the call returns without reaching the Insertion Sort at the end.'), 'success');
          dbg.pop();
          return;
        }
        vars.depthLimit -= 1;
        add(L.dec, 'depthLimit ← depthLimit - 1', tr(`depthLimit passa a ser ${vars.depthLimit}: mais um nível de partição foi gasto.`, `depthLimit is now ${vars.depthLimit}: one more partition level was spent.`), 'update');
      }

      const before = textOf(a, vars.lo, vars.hi);
      const r = partitionRange(a, vars.lo, vars.hi, median);
      counters.comparisons += r.comparisons;
      counters.moves += r.moves;
      state.partitions += 1;
      state.phase = ENGINE.quick;
      sorted.add(r.p);
      vars.pivotIndex = r.p;
      log.push(tr(`partition(${vars.lo}, ${vars.hi}): pivô ${fmt(r.pivot.v)} → posição ${r.p}`, `partition(${vars.lo}, ${vars.hi}): pivot ${fmt(r.pivot.v)} → position ${r.p}`));
      const pickText = r.pick
        ? tr(`Mediana-de-três: A[${vars.lo}] = ${fmt(r.pick.seen[0])}, A[${r.pick.centre}] = ${fmt(r.pick.seen[1])} e A[${vars.hi}] = ${fmt(r.pick.seen[2])}; a mediana, ${fmt(r.pick.value)}, foi levada ao fim para ser o pivô. `, `Median-of-three: A[${vars.lo}] = ${fmt(r.pick.seen[0])}, A[${r.pick.centre}] = ${fmt(r.pick.seen[1])} and A[${vars.hi}] = ${fmt(r.pick.seen[2])}; the median, ${fmt(r.pick.value)}, was taken to the end to be the pivot. `)
        : tr(`O pivô é o último valor, ${fmt(r.pivot.v)}. `, `The pivot is the last value, ${fmt(r.pivot.v)}. `);
      add(L.part, 'pivotIndex ← partition(A, lo, hi)', tr(`${pickText}partition rearranjou o trecho ${vars.lo}..${vars.hi}: ${before} → ${textOf(a, vars.lo, vars.hi)}. O pivô ${fmt(r.pivot.v)} está na posição definitiva ${r.p}, com ${plural(r.p - vars.lo, 'valor', 'valores')} à esquerda e ${plural(vars.hi - r.p, 'valor', 'valores')} à direita (${plural(r.comparisons, 'comparação', 'comparações')}, ${plural(r.moves, 'troca', 'trocas')}).`, `${pickText}partition rearranged the range ${vars.lo}..${vars.hi}: ${before} → ${textOf(a, vars.lo, vars.hi)}. The pivot ${fmt(r.pivot.v)} is at its final position ${r.p}, with ${plural(r.p - vars.lo, 'value', 'values')} on the left and ${plural(vars.hi - r.p, 'value', 'values')} on the right (${plural(r.comparisons, 'comparison', 'comparisons')}, ${plural(r.moves, 'swap', 'swaps')}).`), 'update', { changedIndices: range(vars.hi + 1, vars.lo), pivotIndex: r.p });

      const leftSize = r.p - vars.lo;
      const rightSize = vars.hi - r.p;
      const leftFirst = leftSize < rightSize;
      add(L.test, `${tr('SE', 'IF')} (pivotIndex - lo) < (hi - pivotIndex)`, leftFirst
        ? tr(`${leftSize} < ${rightSize} é verdadeiro: o lado esquerdo é o menor, então ele vai por recursão e o direito continua neste laço.`, `${leftSize} < ${rightSize} is true: the left side is the smaller one, so it goes by recursion and the right one goes on in this loop.`)
        : tr(`${leftSize} < ${rightSize} é falso: o lado direito é o menor (ou igual), então ele vai por recursão e o esquerdo continua neste laço.`, `${leftSize} < ${rightSize} is false: the right side is the smaller (or equal) one, so it goes by recursion and the left one goes on in this loop.`), 'comparison', { compare: cmp('pivotIndex − lo', String(leftSize), '<', 'hi − pivotIndex', String(rightSize), leftFirst), pivotIndex: r.p });
      const next = (from, to) => (heap ? utilCall(from, to, vars.depthLimit, depth + 1) : utilCall(from, to, undefined, depth + 1));
      if (leftFirst) {
        add(L.recL, heap ? 'introSortUtil(A, lo, pivotIndex - 1, depthLimit)' : 'quickInsertionUtil(A, lo, pivotIndex - 1)', tr(`Chama ${util} para o lado esquerdo, ${vars.lo}..${r.p - 1} (${plural(leftSize, 'elemento', 'elementos')}).`, `Calls ${util} for the left side, ${vars.lo}..${r.p - 1} (${plural(leftSize, 'element', 'elements')}).`), 'neutral', { pivotIndex: r.p });
        next(vars.lo, r.p - 1);
        vars.lo = r.p + 1;
        vars.pivotIndex = NONE;
        add(L.setLo, 'lo ← pivotIndex + 1', tr(`A chamada voltou. lo passa a ser ${vars.lo}: o laço continua no lado direito, ${vars.lo}..${vars.hi}.`, `The call returned. lo is now ${vars.lo}: the loop goes on with the right side, ${vars.lo}..${vars.hi}.`), 'update');
      } else {
        add(L.recR, heap ? 'introSortUtil(A, pivotIndex + 1, hi, depthLimit)' : 'quickInsertionUtil(A, pivotIndex + 1, hi)', tr(`Chama ${util} para o lado direito, ${r.p + 1}..${vars.hi} (${plural(rightSize, 'elemento', 'elementos')}).`, `Calls ${util} for the right side, ${r.p + 1}..${vars.hi} (${plural(rightSize, 'element', 'elements')}).`), 'neutral', { pivotIndex: r.p });
        next(r.p + 1, vars.hi);
        vars.hi = r.p - 1;
        vars.pivotIndex = NONE;
        add(L.setHi, 'hi ← pivotIndex - 1', tr(`A chamada voltou. hi passa a ser ${vars.hi}: o laço continua no lado esquerdo, ${vars.lo}..${vars.hi}.`, `The call returned. hi is now ${vars.hi}: the loop goes on with the left side, ${vars.lo}..${vars.hi}.`), 'update');
      }
    }

    const size = Math.max(0, vars.hi - vars.lo + 1);
    const before = textOf(a, vars.lo, vars.hi);
    const r = insertionRange(a, vars.lo, vars.hi);
    counters.comparisons += r.comparisons;
    counters.moves += r.moves;
    if (size >= 2) state.insertions += 1;
    state.phase = ENGINE.insertion;
    for (let p = vars.lo; p <= vars.hi; p += 1) sorted.add(p);
    vars.pivotIndex = NONE;
    if (size >= 2) {
      log.push(tr(`insertionSortRange(${vars.lo}, ${vars.hi}): ${plural(size, 'elemento', 'elementos')} (${plural(r.comparisons, 'comparação', 'comparações')}, ${plural(r.moves, 'deslocamento', 'deslocamentos')})`, `insertionSortRange(${vars.lo}, ${vars.hi}): ${plural(size, 'element', 'elements')} (${plural(r.comparisons, 'comparison', 'comparisons')}, ${plural(r.moves, 'shift', 'shifts')})`));
    }
    add(L.ins, 'insertionSortRange(A, lo, hi)', size <= 1
      ? tr(`O trecho ${vars.lo}..${vars.hi} tem ${size === 1 ? 'um só elemento' : 'nenhum elemento'}: não há o que ordenar, e ${size === 1 ? 'ele já está no lugar' : 'nada muda'}.`, `The range ${vars.lo}..${vars.hi} has ${size === 1 ? 'a single element' : 'no element'}: there is nothing to sort, and ${size === 1 ? 'it is already in place' : 'nothing changes'}.`)
      : tr(`insertionSortRange ordenou o trecho ${vars.lo}..${vars.hi} (${plural(size, 'elemento', 'elementos')}): ${before} → ${textOf(a, vars.lo, vars.hi)} (${plural(r.comparisons, 'comparação', 'comparações')}, ${plural(r.moves, 'deslocamento', 'deslocamentos')}).`, `insertionSortRange sorted the range ${vars.lo}..${vars.hi} (${plural(size, 'element', 'elements')}): ${before} → ${textOf(a, vars.lo, vars.hi)} (${plural(r.comparisons, 'comparison', 'comparisons')}, ${plural(r.moves, 'shift', 'shifts')}).`), 'success', { changedIndices: size > 1 ? range(vars.hi + 1, vars.lo) : [] });
    dbg.pop();
  }

  const driver = heap ? { n: NONE, depthLimit: NONE } : { n: NONE };
  dbg.push({ kind: 'driver', label: `${name}(A)`, vars: driver, phase });
  state.phase = tr('Começa', 'Starts');
  add(L.head, `${name}(A)`, heap
    ? tr(`Introsort sobre ${n} valores, com CUTOFF = ${cutoff} e a mediana-de-três ${median ? 'ligada' : 'desligada'}. Ele começa como Quick Sort, tem o Heap Sort de reserva e usa o Insertion Sort nos trechos pequenos.`, `Introsort on ${n} values, with CUTOFF = ${cutoff} and the median-of-three ${median ? 'on' : 'off'}. It starts as Quick Sort, has Heap Sort as a backup and uses Insertion Sort on small ranges.`)
    : tr(`Quick + Insertion sobre ${n} valores, com CUTOFF = ${cutoff} e a mediana-de-três ${median ? 'ligada' : 'desligada'}. Trechos com mais de ${cutoff} elementos são particionados; os outros vão para o Insertion Sort.`, `Quick + Insertion on ${n} values, with CUTOFF = ${cutoff} and the median-of-three ${median ? 'on' : 'off'}. Ranges with more than ${cutoff} elements are partitioned; the others go to Insertion Sort.`), 'neutral');
  driver.n = n;
  add(L.n, 'n ← length(A)', tr(`n recebe ${n}.`, `n receives ${n}.`), 'update');
  let limit;
  if (heap) {
    const formula = 2 * floorLog2(n);
    limit = Number.isInteger(opts.depthLimit) && opts.depthLimit >= 0 ? opts.depthLimit : formula;
    driver.depthLimit = limit;
    add(L.depth, 'depthLimit ← 2 * floor(log2(n))', limit === formula
      ? tr(`depthLimit recebe 2 · ⌊log₂ ${n}⌋ = 2 · ${floorLog2(n)} = ${limit}: é o número de níveis de partição que o Quick Sort pode gastar antes de o Heap Sort assumir.`, `depthLimit receives 2 · ⌊log₂ ${n}⌋ = 2 · ${floorLog2(n)} = ${limit}: it is the number of partition levels that Quick Sort may spend before Heap Sort takes over.`)
      : tr(`depthLimit recebe ${limit}, o valor que você escolheu (a fórmula 2 · ⌊log₂ ${n}⌋ daria ${formula}).`, `depthLimit receives ${limit}, the value you chose (the formula 2 · ⌊log₂ ${n}⌋ would give ${formula}).`), 'update');
  }
  add(L.call, heap ? 'introSortUtil(A, 0, n - 1, depthLimit)' : 'quickInsertionUtil(A, 0, n - 1)', tr(`Chama ${util} sobre o vetor inteiro, das posições 0 a ${n - 1}.`, `Calls ${util} on the whole array, positions 0 to ${n - 1}.`), 'neutral');
  utilCall(0, n - 1, limit, 0);
  state.phase = tr('Fim', 'Done');
  log.push(tr(`Comparações: ${counters.comparisons} · Movimentações: ${counters.moves}`, `Comparisons: ${counters.comparisons} · Moves: ${counters.moves}`));
  add(L.end, tr('Ordenação concluída', 'Sort finished'), tr(`O vetor está em ordem crescente: ${plural(state.partitions, 'particionamento', 'particionamentos')}, ${plural(state.insertions, 'trecho entregue ao Insertion Sort', 'trechos entregues ao Insertion Sort')}${heap ? ` e ${state.rescues ? `${plural(state.rescues, 'resgate do Heap Sort', 'resgates do Heap Sort')}` : 'nenhum resgate do Heap Sort'}` : ''}. Total: ${plural(counters.comparisons, 'comparação', 'comparações')} e ${plural(counters.moves, 'movimentação', 'movimentações')}.`, `The array is in ascending order: ${plural(state.partitions, 'partitioning', 'partitionings')}, ${plural(state.insertions, 'range handed to Insertion Sort', 'ranges handed to Insertion Sort')}${heap ? ` and ${state.rescues ? plural(state.rescues, 'Heap Sort rescue', 'Heap Sort rescues') : 'no Heap Sort rescue'}` : ''}. Total: ${plural(counters.comparisons, 'comparison', 'comparisons')} and ${plural(counters.moves, 'move', 'moves')}.`), 'done', { sortedIndices: range(n), output: [...log] });
  return {
    steps: dbg.steps, a, counters, partitions: state.partitions, insertions: state.insertions, rescues: state.rescues,
  };
}

/** Merge + Insertion. */
export function runMergeInsertion(items, opts, record = true) {
  const { cutoff } = opts;
  const n = items.length;
  const sorted = new Set();
  const state = { phase: '', merges: 0, insertions: 0 };
  const dbg = createDebugger(items, {
    record,
    moveLabel: 'movimentações',
    decorate: ({ frame }) => {
      const holder = [...dbg.frames].reverse().find((entry) => entry.kind === 'util');
      const out = {
        sortedIndices: [...sorted],
        pointers: frame?.kind === 'util' ? utilPointers(frame, n) : {},
        outsideIndices: holder ? outside(n, holder.vars.lo, holder.vars.hi) : [],
      };
      if (frame?.kind === 'util' && Number.isInteger(frame.vars.mid)) out.splitAfter = frame.vars.mid;
      return out;
    },
  });
  const { a, add, counters, log } = dbg;
  const phase = () => state.phase;

  function utilCall(lo, hi, depth) {
    const vars = {
      lo, hi, mid: NONE, CUTOFF: cutoff,
    };
    const text = `mergeInsertionUtil(${lo}, ${hi})`;
    dbg.push({ kind: 'util', label: text, vars, phase });
    state.phase = ENGINE.split;
    const size = hi - lo + 1;
    add(MI.util, text, depth === 0
      ? tr(`Chamada inicial sobre o vetor inteiro (posições ${lo} a ${hi}, ${plural(size, 'elemento', 'elementos')}).`, `Initial call on the whole array (positions ${lo} to ${hi}, ${plural(size, 'element', 'elements')}).`)
      : tr(`Nova chamada para o trecho ${lo}..${hi} (${plural(size, 'elemento', 'elementos')}). Cada chamada tem as suas próprias variáveis.`, `New call for the range ${lo}..${hi} (${plural(size, 'element', 'elements')}). Each call has its own variables.`), 'neutral');
    const leaf = size <= cutoff;
    add(MI.test, `${tr('SE', 'IF')} (hi - lo + 1) ≤ CUTOFF`, leaf
      ? tr(`${size} ≤ ${cutoff} é verdadeiro: o trecho é curto, não vale a pena dividir mais. Ele vai para o Insertion Sort.`, `${size} ≤ ${cutoff} is true: the range is short, it is not worth splitting any further. It goes to Insertion Sort.`)
      : tr(`${size} ≤ ${cutoff} é falso: o trecho ainda é longo e será dividido ao meio.`, `${size} ≤ ${cutoff} is false: the range is still long and will be split in half.`), leaf ? 'success' : 'comparison', { compare: cmp('hi − lo + 1', String(size), '≤', 'CUTOFF', String(cutoff), leaf) });
    if (leaf) {
      const before = textOf(a, lo, hi);
      const r = insertionRange(a, lo, hi);
      counters.comparisons += r.comparisons;
      counters.moves += r.moves;
      if (size >= 2) state.insertions += 1;
      state.phase = ENGINE.insertion;
      for (let p = lo; p <= hi; p += 1) sorted.add(p);
      if (size >= 2) {
        log.push(tr(`insertionSortRange(${lo}, ${hi}): ${plural(size, 'elemento', 'elementos')} (${plural(r.comparisons, 'comparação', 'comparações')}, ${plural(r.moves, 'deslocamento', 'deslocamentos')})`, `insertionSortRange(${lo}, ${hi}): ${plural(size, 'element', 'elements')} (${plural(r.comparisons, 'comparison', 'comparisons')}, ${plural(r.moves, 'shift', 'shifts')})`));
      }
      add(MI.ins, 'insertionSortRange(A, lo, hi)', size <= 1
        ? tr(`O trecho ${lo}..${hi} tem ${size === 1 ? 'um só elemento' : 'nenhum elemento'}: já está ordenado.`, `The range ${lo}..${hi} has ${size === 1 ? 'a single element' : 'no element'}: it is already sorted.`)
        : tr(`insertionSortRange ordenou o trecho ${lo}..${hi} (${plural(size, 'elemento', 'elementos')}): ${before} → ${textOf(a, lo, hi)} (${plural(r.comparisons, 'comparação', 'comparações')}, ${plural(r.moves, 'deslocamento', 'deslocamentos')}).`, `insertionSortRange sorted the range ${lo}..${hi} (${plural(size, 'element', 'elements')}): ${before} → ${textOf(a, lo, hi)} (${plural(r.comparisons, 'comparison', 'comparisons')}, ${plural(r.moves, 'shift', 'shifts')}).`), 'success', { changedIndices: size > 1 ? range(hi + 1, lo) : [] });
      add(MI.ret, tr('RETORNE', 'RETURN'), tr('O trecho está ordenado: a chamada retorna para quem a fez.', 'The range is sorted: the call returns to its caller.'), 'success');
      dbg.pop();
      return;
    }
    vars.mid = Math.floor((lo + hi) / 2);
    add(MI.mid, 'mid ← (lo + hi) / 2', tr(`mid recebe (${lo} + ${hi}) / 2 = ${vars.mid} (divisão inteira): as metades são ${lo}..${vars.mid} e ${vars.mid + 1}..${hi}.`, `mid receives (${lo} + ${hi}) / 2 = ${vars.mid} (integer division): the halves are ${lo}..${vars.mid} and ${vars.mid + 1}..${hi}.`), 'update');
    add(MI.recL, 'mergeInsertionUtil(A, lo, mid)', tr(`Chama ${'mergeInsertionUtil'} para a metade esquerda, ${lo}..${vars.mid}.`, `Calls mergeInsertionUtil for the left half, ${lo}..${vars.mid}.`), 'neutral');
    utilCall(lo, vars.mid, depth + 1);
    add(MI.recR, 'mergeInsertionUtil(A, mid + 1, hi)', tr(`A metade esquerda voltou ordenada. Chama mergeInsertionUtil para a metade direita, ${vars.mid + 1}..${hi}.`, `The left half came back sorted. Calls mergeInsertionUtil for the right half, ${vars.mid + 1}..${hi}.`), 'neutral');
    utilCall(vars.mid + 1, hi, depth + 1);
    const before = textOf(a, lo, hi);
    const r = mergeRange(a, lo, vars.mid, hi);
    counters.comparisons += r.comparisons;
    counters.moves += r.moves;
    state.merges += 1;
    state.phase = ENGINE.merge;
    for (let p = lo; p <= hi; p += 1) sorted.add(p);
    log.push(tr(`merge(${lo}, ${vars.mid}, ${hi}): ${plural(size, 'elemento', 'elementos')} (${plural(r.comparisons, 'comparação', 'comparações')}, ${plural(r.moves, 'cópia', 'cópias')})`, `merge(${lo}, ${vars.mid}, ${hi}): ${plural(size, 'element', 'elements')} (${plural(r.comparisons, 'comparison', 'comparisons')}, ${plural(r.moves, 'copy', 'copies')})`));
    add(MI.merge, 'merge(A, lo, mid, hi)', tr(`merge intercalou ${lo}..${vars.mid} com ${vars.mid + 1}..${hi}: ${before} → ${textOf(a, lo, hi)} (${plural(r.comparisons, 'comparação', 'comparações')}, ${plural(r.moves, 'cópia', 'cópias')}). No empate sai o valor da metade esquerda, por isso o algoritmo é estável.`, `merge merged ${lo}..${vars.mid} with ${vars.mid + 1}..${hi}: ${before} → ${textOf(a, lo, hi)} (${plural(r.comparisons, 'comparison', 'comparisons')}, ${plural(r.moves, 'copy', 'copies')}). On a tie the value from the left half goes first, which is why the algorithm is stable.`), 'success', { changedIndices: range(hi + 1, lo) });
    dbg.pop();
  }

  const driver = { n: NONE };
  dbg.push({ kind: 'driver', label: 'mergeInsertion(A)', vars: driver, phase });
  state.phase = tr('Começa', 'Starts');
  add(MI.head, 'mergeInsertion(A)', tr(`Merge + Insertion sobre ${n} valores, com CUTOFF = ${cutoff}: o vetor é dividido ao meio até os trechos terem no máximo ${cutoff} elementos; cada trecho é ordenado pelo Insertion Sort e depois vêm as intercalações.`, `Merge + Insertion on ${n} values, with CUTOFF = ${cutoff}: the array is split in half until the ranges have at most ${cutoff} elements; each range is sorted by Insertion Sort and then come the merges.`), 'neutral');
  driver.n = n;
  add(MI.n, 'n ← length(A)', tr(`n recebe ${n}.`, `n receives ${n}.`), 'update');
  add(MI.call, 'mergeInsertionUtil(A, 0, n - 1)', tr(`Chama mergeInsertionUtil sobre o vetor inteiro, das posições 0 a ${n - 1}.`, `Calls mergeInsertionUtil on the whole array, positions 0 to ${n - 1}.`), 'neutral');
  utilCall(0, n - 1, 0);
  state.phase = tr('Fim', 'Done');
  log.push(tr(`Comparações: ${counters.comparisons} · Movimentações: ${counters.moves}`, `Comparisons: ${counters.comparisons} · Moves: ${counters.moves}`));
  add(MI.end, tr('Ordenação concluída', 'Sort finished'), tr(`O vetor está em ordem crescente: ${plural(state.insertions, 'trecho ordenado pelo Insertion Sort', 'trechos ordenados pelo Insertion Sort')} e ${plural(state.merges, 'intercalação', 'intercalações')}. Total: ${plural(counters.comparisons, 'comparação', 'comparações')} e ${plural(counters.moves, 'movimentação', 'movimentações')} (cópias e deslocamentos).`, `The array is in ascending order: ${plural(state.insertions, 'range sorted by Insertion Sort', 'ranges sorted by Insertion Sort')} and ${plural(state.merges, 'merge', 'merges')}. Total: ${plural(counters.comparisons, 'comparison', 'comparisons')} and ${plural(counters.moves, 'move', 'moves')} (copies and shifts).`), 'done', { sortedIndices: range(n), output: [...log] });
  return {
    steps: dbg.steps, a, counters, merges: state.merges, insertions: state.insertions,
  };
}

// ---------------------------------------------------------------------------
// Os três juntos, para a adaptabilidade e a estabilidade
// ---------------------------------------------------------------------------

export const HYBRIDS = [
  { id: 'quick-insertion', name: 'Quick + Insertion', run: (items, opts, record) => runQuickHybrid(items, { ...opts, heap: false }, record), stable: false },
  { id: 'merge-insertion', name: 'Merge + Insertion', run: (items, opts, record) => runMergeInsertion(items, opts, record), stable: true },
  { id: 'introsort', name: 'Introsort', run: (items, opts, record) => runQuickHybrid(items, { ...opts, heap: true }, record), stable: false },
];

/** Vetor com valores repetidos em que o Quick + Insertion e o Introsort invertem a ordem de dois iguais. */
export function stabilityExample(count, opts) {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const values = withRepeats(count);
    const results = HYBRIDS.map((method) => method.run(tagDuplicates(values), opts, false).a);
    if (results.every((result, index) => isStable(result) === HYBRIDS[index].stable)) return values;
  }
  return [31, 12, 31, 45, 12, 9, 31, 27, 45, 18, 12, 36].slice(0, Math.max(6, count));
}

function adaptabilitySteps(values, opts) {
  const scenarios = adaptabilityScenarios(values).map((scenario) => ({
    ...scenario,
    rows: HYBRIDS.map((method) => {
      const r = method.run(toItems(scenario.values), opts, false);
      return {
        id: method.id, name: method.name, comparisons: r.counters.comparisons, moves: r.counters.moves, cost: r.counters.comparisons + r.counters.moves, rescues: r.rescues ?? 0, partitions: r.partitions ?? 0, merges: r.merges ?? 0,
      };
    }),
  }));
  const longest = Math.max(1, ...scenarios.flatMap((scenario) => scenario.rows.map((row) => row.cost)));
  const chart = (scenario, final = false) => ({
    title: tr(`Custo no vetor: ${scenario.label.toLowerCase()}`, `Cost on the array: ${scenario.label.toLowerCase()}`),
    hint: tr('operações = comparações + movimentações · ⇄ = movimentações', 'operations = comparisons + moves · ⇄ = moves'),
    max: longest,
    bars: scenario.rows.map((row) => ({
      label: row.name, value: row.cost, mark: `⇄ ${row.moves}`, current: false,
    })),
    totals: scenario.rows.map((row) => ({ label: row.name, value: row.cost, note: tr(`${row.comparisons} comparações · ${row.moves} movimentações`, `${row.comparisons} comparisons · ${row.moves} moves`) })),
    final,
  });
  const steps = [
    step(values, 0, tr('Três híbridos, quatro vetores', 'Three hybrids, four arrays'), tr(`Cada híbrido vai ordenar quatro vetores com os mesmos ${values.length} valores em ordens diferentes (CUTOFF = ${opts.cutoff}, mediana-de-três ${opts.median ? 'ligada' : 'desligada'}). O custo é o de comparações mais movimentações. O custo depende da ordem?`, `Each hybrid will sort four arrays with the same ${values.length} values in different orders (CUTOFF = ${opts.cutoff}, median-of-three ${opts.median ? 'on' : 'off'}). The cost is comparisons plus moves. Does the cost depend on the order?`), 'neutral', { sortedIndices: [], chart: chart(scenarios[0]) }),
  ];
  scenarios.forEach((scenario, index) => {
    const cheapest = scenario.rows.reduce((best, row) => (row.cost < best.cost ? row : best));
    const introsort = scenario.rows.find((row) => row.id === 'introsort');
    steps.push(step(scenario.values, 5, scenario.label, tr(`${scenario.rows.map((row) => `${row.name}: ${row.cost} (${row.comparisons} comparações + ${row.moves} movimentações)`).join('; ')}. O mais barato é ${cheapest.name}.${introsort.rescues ? ' O Introsort precisou do resgate do Heap Sort neste vetor: o Quick Sort estava particionando mal.' : ''}`, `${scenario.rows.map((row) => `${row.name}: ${row.cost} (${row.comparisons} comparisons + ${row.moves} moves)`).join('; ')}. The cheapest is ${cheapest.name}.${introsort.rescues ? ' Introsort needed the Heap Sort rescue on this array: Quick Sort was partitioning badly.' : ''}`), index === scenarios.length - 1 ? 'done' : 'comparison', {
      sortedIndices: [], chart: chart(scenario, index === scenarios.length - 1), variables: { n: values.length, CUTOFF: opts.cutoff },
    }));
  });
  const merges = scenarios.map((scenario) => scenario.rows.find((row) => row.id === 'merge-insertion').cost);
  const quicks = scenarios.map((scenario) => scenario.rows.find((row) => row.id === 'quick-insertion').cost);
  const spread = (list) => Math.max(...list) - Math.min(...list);
  steps.push({
    ...steps.at(-1),
    line: 6,
    title: tr('O custo e a ordem inicial', 'Cost and initial order'),
    description: tr(`Entre o melhor e o pior vetor, o Merge + Insertion varia ${spread(merges)} operações e o Quick + Insertion, ${spread(quicks)}. O Merge Sort divide e intercala do mesmo jeito em qualquer ordem, e o Insertion Sort ainda ganha nos blocos já ordenados; já no Quick Sort, a ordem decide onde os pivôs caem (com a mediana-de-três o vetor ordenado deixa de ser o pior caso). O Introsort limita o pior caso com o Heap Sort. A adaptabilidade dos híbridos é parcial.`, `Between the best and the worst array, Merge + Insertion varies by ${spread(merges)} operations and Quick + Insertion by ${spread(quicks)}. Merge Sort splits and merges the same way in any order, and Insertion Sort still gains on blocks that are already sorted; in Quick Sort, the order decides where the pivots land (with the median-of-three the sorted array stops being the worst case). Introsort limits the worst case with Heap Sort. The adaptivity of the hybrids is partial.`),
    tone: 'done',
    output: scenarios.map((scenario) => `${scenario.label}: ${scenario.rows.map((row) => `${row.name} ${row.cost}`).join(' · ')}`),
  });
  return steps;
}

function stabilitySteps(values, opts) {
  const n = values.length;
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const results = HYBRIDS.map((method) => {
    const r = method.run(copyItems(items), opts, false);
    return { ...method, final: r.a, pairs: flippedPairs(items, r.a), stableNow: isStable(r.a) };
  });
  const base = { tags: tagsOf(items), sortedIndices: [] };
  const steps = [
    hasRepeated
      ? step(values, 0, tr('Valores repetidos em destaque', 'Repeated values highlighted'), tr('Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética. Vamos rodar os três híbridos neste vetor.', 'Repeated values get a letter (a, b, …) that marks the order in which they appear. A stable algorithm ends with those letters in alphabetical order. Let us run the three hybrids on this array.'), 'neutral', base)
      : step(values, 0, tr('Não há valores repetidos', 'There are no repeated values'), tr('Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com repetidos.', 'Without repeated values there is no relative order to preserve. Use "Generate example" to create an array with repeated values.'), 'warning', base),
  ];
  results.forEach((result) => {
    const moved = result.pairs.flatMap(([x, y]) => [x, y]);
    const warnIndices = result.final.map((item, index) => (moved.some((m) => m.v === item.v && m.tag === item.tag) ? index : -1)).filter((index) => index >= 0);
    steps.push(step(valuesOf(result.final), result.stableNow ? 5 : 7, result.name, !hasRepeated
      ? tr(`${result.name}: sem repetidos, não há o que comparar.`, `${result.name}: with no repeated values there is nothing to compare.`)
      : result.pairs.length
        ? tr(`${result.name}: ${result.pairs.map(([x, y]) => `${label(y)} passou à frente de ${label(x)}`).join('; ')}. Ordem final: ${result.final.map(label).join(' ')}. ${result.id === 'merge-insertion' ? '' : 'As trocas do particionamento (e as do Heap Sort, no resgate) levam um valor por cima de iguais.'}`, `${result.name}: ${result.pairs.map(([x, y]) => `${label(y)} went ahead of ${label(x)}`).join('; ')}. Final order: ${result.final.map(label).join(' ')}. ${result.id === 'merge-insertion' ? '' : 'The swaps of the partitioning (and those of Heap Sort, in the rescue) carry a value over equals.'}`)
        : tr(`${result.name}: a ordem dos iguais foi preservada (${result.final.map(label).join(' ')}).${result.id === 'merge-insertion' ? ' O Insertion Sort só desloca valores estritamente maiores e a intercalação desempata pela esquerda: nenhum igual passa por cima do outro.' : ' Neste vetor foi por acaso: o algoritmo não garante isso.'}`, `${result.name}: the order of the equals was preserved (${result.final.map(label).join(' ')}).${result.id === 'merge-insertion' ? ' Insertion Sort only shifts strictly larger values and the merge breaks ties to the left: no equal passes over another.' : ' On this array it was by chance: the algorithm does not guarantee it.'}`), result.pairs.length ? 'warning' : 'success', {
      tags: tagsOf(result.final), sortedIndices: range(n), warnIndices, output: results.slice(0, results.indexOf(result) + 1).map((entry) => `${entry.name}: ${entry.stableNow ? tr('ordem preservada', 'order preserved') : tr('ordem alterada', 'order changed')}`),
    }));
  });
  steps.push({
    ...steps.at(-1),
    line: 9,
    title: tr('Resultado', 'Result'),
    description: !hasRepeated
      ? tr('O vetor não tinha valores repetidos, então não há o que comparar.', 'The array had no repeated values, so there is nothing to compare.')
      : tr(`${results.map((entry) => `${entry.name}: ${entry.stableNow ? 'preservou' : 'inverteu'}`).join(' · ')}. Só o Merge + Insertion é estável por construção (Merge Sort e Insertion Sort são estáveis); o Quick + Insertion e o Introsort herdam a instabilidade do Quick Sort e do Heap Sort.`, `${results.map((entry) => `${entry.name}: ${entry.stableNow ? 'preserved' : 'reversed'}`).join(' · ')}. Only Merge + Insertion is stable by construction (Merge Sort and Insertion Sort are stable); Quick + Insertion and Introsort inherit the instability of Quick Sort and Heap Sort.`),
    tone: 'done',
  });
  return steps;
}

export function normalizeOptions(values, config = {}) {
  const toInt = (value, fallback) => (value === null || value === undefined || value === '' || !Number.isInteger(Number(value)) ? fallback : Number(value));
  return {
    cutoff: Math.max(1, Math.min(12, toInt(config.cutoff, 4))),
    median: config.median !== false,
    depthLimit: toInt(config.depthLimit, null),
  };
}

export function buildSteps(id, values, config = {}) {
  const opts = normalizeOptions(values, config);
  const items = toItems(values);
  switch (id) {
    case 'quick-insertion': return runQuickHybrid(items, { ...opts, heap: false }).steps;
    case 'merge-insertion': return runMergeInsertion(items, opts).steps;
    case 'introsort': return runQuickHybrid(items, { ...opts, heap: true }).steps;
    case 'adaptability': return adaptabilitySteps(values, opts);
    case 'stability': return stabilitySteps(values, opts);
    default: return runQuickHybrid(items, { ...opts, heap: false }).steps;
  }
}

