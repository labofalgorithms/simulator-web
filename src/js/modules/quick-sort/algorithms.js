import {
  NONE, ascending, clone, fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf, withRepeats,
} from '../shared/sort-steps.js';
import { extendVariableNames, tr } from '../../core/i18n.js';

extendVariableNames({ inicio: 'start', fim: 'end' });

// Pseudocódigo da aula (slides 52 e 53): quickSort particiona o trecho em torno de vetor[inicio]
// (o pivô) e ordena os dois lados; particionar varre o trecho com i e j e devolve a posição do pivô.
const QUICK_CODE = [
  tr('FUNÇÃO quickSort(vetor, inicio, fim)', 'FUNCTION quickSort(array, start, end)'),
  tr('  SE inicio < fim ENTÃO', '  IF start < end THEN'),
  tr('    meio ← particionar(vetor, inicio, fim)', '    mid ← partition(array, start, end)'),
  tr('    quickSort(vetor, inicio, meio - 1)', '    quickSort(array, start, mid - 1)'),
  tr('    quickSort(vetor, meio + 1, fim)', '    quickSort(array, mid + 1, end)'),
  tr('  FIM SE', '  END IF'),
  tr('FIM', 'END'),
];

const PARTITION_CODE = [
  tr('FUNÇÃO particionar(vetor, inicio, fim)', 'FUNCTION partition(array, start, end)'),
  tr('  i ← inicio + 1; j ← fim', '  i ← start + 1; j ← end'),
  tr('  ENQUANTO i ≤ j FAÇA', '  WHILE i ≤ j DO'),
  tr('    SE vetor[i] < vetor[inicio] ENTÃO', '    IF array[i] < array[start] THEN'),
  tr('      i ← i + 1', '      i ← i + 1'),
  tr('    SENÃO', '    ELSE'),
  tr('      SE vetor[j] > vetor[inicio] ENTÃO', '      IF array[j] > array[start] THEN'),
  tr('        j ← j - 1', '        j ← j - 1'),
  tr('      SENÃO', '      ELSE'),
  tr('        aux ← vetor[i]', '        aux ← array[i]'),
  tr('        vetor[i] ← vetor[j]', '        array[i] ← array[j]'),
  tr('        vetor[j] ← aux', '        array[j] ← aux'),
  tr('        i ← i + 1', '        i ← i + 1'),
  tr('        j ← j - 1', '        j ← j - 1'),
  tr('      FIM SE', '      END IF'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM ENQUANTO', '  END WHILE'),
  tr('  aux ← vetor[inicio]', '  aux ← array[start]'),
  tr('  vetor[inicio] ← vetor[j]', '  array[start] ← array[j]'),
  tr('  vetor[j] ← aux', '  array[j] ← aux'),
  tr('  RETORNE j', '  RETURN j'),
  tr('FIM', 'END'),
];

// As duas funções juntas, com uma linha em branco entre elas.
const FULL_CODE = [...QUICK_CODE, '', ...PARTITION_CODE];
const OFFSET = QUICK_CODE.length + 1;

// Linhas de QUICK_CODE e de PARTITION_CODE (base 0).
const Q = { call: 0, test: 1, part: 2, left: 3, right: 4, end: 6 };
const P = {
  head: 0, init: 1, loop: 2, testI: 3, incI: 4, testJ: 6, decJ: 7, saveAux: 9, copyJ: 10, putAux: 11, incI2: 12, decJ2: 13, pivotSave: 17, pivotMove: 18, pivotPut: 19, ret: 20, end: 21,
};

export const algorithms = [
  {
    id: 'partition', title: tr('Particionar', 'Partition'), menuLabel: tr('Particionar', 'Partition'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Escolha o primeiro valor do trecho como pivô e deixe i e j se aproximarem, trocando os pares fora do lugar. No fim, o pivô vai para a posição em que ficará para sempre.', 'Choose the first value of the range as the pivot and let i and j approach each other, swapping the pairs that are out of place. At the end, the pivot goes to the position where it will stay forever.'),
    interaction: tr('Mude o início e o fim do trecho ou clique em uma célula para escolher o pivô. i procura, da esquerda, um valor maior ou igual ao pivô; j procura, da direita, um menor ou igual.', 'Change the start and the end of the range or click a cell to choose the pivot. i looks, from the left, for a value greater than or equal to the pivot; j looks, from the right, for one smaller than or equal to it.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('i e j andam um em direção ao outro e cada um percorre o trecho no máximo uma vez, então o custo é proporcional ao tamanho do trecho. Só existem as variáveis i, j e aux além do vetor.', 'i and j walk toward each other and each one goes through the range at most once, so the cost is proportional to the size of the range. There are only the variables i, j and aux besides the array.') },
    pseudocode: PARTITION_CODE,
  },
  {
    id: 'quick-sort', title: tr('Quicksort', 'Quicksort'), menuLabel: tr('Quicksort', 'Quicksort'), group: tr('Como funciona', 'How it works'), number: '02',
    description: tr('Particione o vetor em torno de um pivô e repita o processo para a parte à esquerda e para a parte à direita dele, até restarem trechos de um elemento ou vazios.', 'Partition the array around a pivot and repeat the process for the part on its left and the part on its right, until only one-element or empty ranges are left.'),
    interaction: tr('Acompanhe a pilha de chamadas e os marcadores início, fim, i, j e meio. Cada pivô que vira verde já está na posição final.', 'Follow the call stack and the markers start, end, i, j and mid. Each pivot that turns green is already in its final position.'),
    complexity: { time: 'O(n log n)', space: 'O(log n)', note: tr('No caso médio e no melhor, o particionamento divide o trecho em partes parecidas e há cerca de log₂ n níveis; no pior caso (pivô sempre o menor ou o maior), o custo sobe para O(n²). A pilha de chamadas soma O(log n) no melhor caso e O(n) no pior.', 'In the average and best case, partitioning splits the range into similar parts and there are about log₂ n levels; in the worst case (pivot always the smallest or the largest), the cost rises to O(n²). The call stack adds O(log n) in the best case and O(n) in the worst.') },
    pseudocode: FULL_CODE,
  },
  {
    id: 'counting', title: tr('Contando as operações', 'Counting the operations'), menuLabel: tr('Complexidade de tempo', 'Time complexity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '03',
    description: tr('Conte as comparações e as trocas de cada particionamento e veja como a escolha do pivô decide o custo total.', 'Count the comparisons and the swaps of each partitioning and see how the choice of pivot decides the total cost.'),
    interaction: tr('Compare o total com o pior caso (vetor ordenado) e com o melhor (pivôs sempre na mediana), que aparecem no console ao final.', 'Compare the total with the worst case (sorted array) and with the best (pivots always at the median), shown in the console at the end.'),
    complexity: { time: 'O(n log n)', space: 'O(log n)', note: tr('Cada particionamento custa na ordem do tamanho do trecho. Com pivôs que dividem ao meio, os trechos de cada nível somam n e há log₂ n níveis; com pivôs nos extremos, são n − 1 níveis e o custo é quadrático.', 'Each partitioning costs on the order of the size of the range. With pivots that split in half, the ranges of each level add up to n and there are log₂ n levels; with pivots at the extremes, there are n − 1 levels and the cost is quadratic.') },
    pseudocode: FULL_CODE,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '04',
    description: tr('Execute o algoritmo em quatro vetores com os mesmos valores em ordens diferentes e compare os contadores: aqui a ordem inicial muda o custo.', 'Run the algorithm on four arrays with the same values in different orders and compare the counters: here the initial order changes the cost.'),
    interaction: tr('Avance particionamento por particionamento e veja que o vetor já ordenado, que parece o caso fácil, é o pior para este Quicksort.', 'Step through partitioning by partitioning and see that the already sorted array, which looks like the easy case, is the worst for this Quicksort.'),
    complexity: { time: 'O(n²)', space: 'O(n)', note: tr('Como o pivô é o primeiro valor, um vetor já ordenado (ou invertido) faz o pivô cair sempre em um extremo: as partes têm n − 1 e 0 elementos, e o custo é O(n²). No melhor caso (pivô na mediana) é O(n log n), e o caso médio também.', 'Since the pivot is the first value, an already sorted (or reversed) array makes the pivot always land at an extreme: the parts have n − 1 and 0 elements, and the cost is O(n²). In the best case (pivot at the median) it is O(n log n), and so is the average case.') },
    pseudocode: FULL_CODE,
  },
  {
    id: 'stability', title: tr('Estabilidade', 'Stability'), menuLabel: tr('Estabilidade', 'Stability'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '05',
    description: tr('Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.', 'Repeated values get a letter that marks the original order. See whether the algorithm preserves that order.'),
    interaction: tr('Use "Gerar exemplo" para criar um vetor com valores repetidos em que a ordem realmente se inverte, e veja qual particionamento causa isso.', 'Use "Generate example" to create an array with repeated values where the order really is reversed, and see which partitioning causes it.'),
    complexity: { time: 'O(n log n)', space: 'O(log n)', note: tr('A troca de vetor[i] com vetor[j] leva um valor da ponta direita para a esquerda por cima de iguais que estavam no meio, e o pivô também é trocado com vetor[j]. Por isso dois iguais podem inverter a ordem: o Quicksort é instável.', 'Swapping array[i] with array[j] carries a value from the right end to the left over equals that were in the middle, and the pivot is also swapped with array[j]. That is why two equals can reverse their order: Quicksort is unstable.') },
    pseudocode: FULL_CODE,
  },
];

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const vec = (items) => `[${items.map(label).join(', ')}]`;
const copyItems = (items) => items.map((item) => ({ ...item }));

// ---------------------------------------------------------------------------
// Execução sem passos: o mesmo algoritmo, para as simulações de análise, para conferir o depurador
// e para montar os exemplos. Cada particionamento devolve o trecho, a posição do pivô, as
// comparações com o pivô, as trocas e o vetor antes e depois.
// ---------------------------------------------------------------------------

/** particionar da aula sobre `a` (itens `{ v, tag }`): devolve j, as comparações e as trocas. */
function partitionItems(a, ini, fim) {
  const pivot = a[ini].v;
  let i = ini + 1;
  let j = fim;
  let comparisons = 0;
  let swaps = 0;
  while (i <= j) {
    comparisons += 1;
    if (a[i].v < pivot) {
      i += 1;
    } else {
      comparisons += 1;
      if (a[j].v > pivot) {
        j -= 1;
      } else {
        [a[i], a[j]] = [a[j], a[i]];
        swaps += 1;
        i += 1;
        j -= 1;
      }
    }
  }
  [a[ini], a[j]] = [a[j], a[ini]];
  swaps += 1;
  return { j, comparisons, swaps };
}

/** Todos os particionamentos do Quicksort, na ordem em que as chamadas acontecem. */
function runPartitions(items) {
  const a = copyItems(items);
  const calls = [];
  const walk = (ini, fim, depth) => {
    if (ini >= fim) return;
    const before = copyItems(a);
    const { j, comparisons, swaps } = partitionItems(a, ini, fim);
    calls.push({
      ini, fim, depth, meio: j, comparisons, swaps, before, after: copyItems(a),
    });
    walk(ini, j - 1, depth + 1);
    walk(j + 1, fim, depth + 1);
  };
  walk(0, a.length - 1, 0);
  return { calls, final: a };
}

/**
 * O vetor em que todo pivô cai na mediana do seu trecho (melhor caso). O particionar leva o último
 * valor da parte esquerda para o início dela, então a esquerda é guardada "girada" para voltar certa.
 */
export function bestCase(sortedValues) {
  if (sortedValues.length <= 2) return [...sortedValues];
  const mid = Math.floor((sortedValues.length - 1) / 2);
  const left = bestCase(sortedValues.slice(0, mid));
  const right = bestCase(sortedValues.slice(mid + 1));
  const rotated = [...left.slice(1), left[0]];
  return [sortedValues[mid], ...rotated, ...right];
}

const totalOf = (calls, key) => calls.reduce((sum, call) => sum + call[key], 0);

/** Pares de iguais cuja ordem relativa mudou entre `before` e `after`. */
function flippedPairs(before, after) {
  const positionIn = (items) => new Map(items.map((item, index) => [`${item.v}${item.tag}`, index]));
  const was = positionIn(before);
  const now = positionIn(after);
  const pairs = [];
  before.forEach((x) => {
    before.forEach((y) => {
      if (x === y || x.v !== y.v || !x.tag || !y.tag || x.tag >= y.tag) return;
      const kx = `${x.v}${x.tag}`;
      const ky = `${y.v}${y.tag}`;
      if ((was.get(kx) < was.get(ky)) !== (now.get(kx) < now.get(ky))) pairs.push([x, y]);
    });
  });
  return pairs;
}

/** Vetor com valores repetidos em que o Quicksort realmente inverte a ordem de dois iguais. */
export function stabilityExample(count) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const values = withRepeats(count);
    if (!isStable(runPartitions(tagDuplicates(values)).final)) return values;
  }
  return [18, 47, 47, 10, 33, 25, 61, 70, 12, 90].slice(0, Math.max(4, count));
}

// ---------------------------------------------------------------------------
// Execução como num depurador: cada passo é a linha que acabou de executar, com a pilha de
// chamadas e as variáveis da chamada atual (cada chamada tem as suas).
// ---------------------------------------------------------------------------

/** `base` é a linha onde particionar começa no pseudocódigo exibido (0 sozinho, OFFSET junto do quickSort). */
function createTracer(items, base) {
  const a = copyItems(items);
  const n = a.length;
  const steps = [];
  const sorted = new Set();
  const frames = [];
  const counters = { comparisons: 0, swaps: 0 };
  const log = [];

  const compareOf = (left, op, right, result) => ({ left, op, right, result });

  function add(line, title, description, tone, extra = {}) {
    const { pointers: own = {}, pivotIndex, ...rest } = extra;
    const frame = frames.at(-1);
    const vars = frame?.vars ?? {};
    const pointers = {};
    const stats = { 'comparações': counters.comparisons, trocas: counters.swaps };
    if (frame) {
      pointers.inicio = vars.inicio;
      pointers.fim = vars.fim;
      if (Number.isInteger(vars.meio)) pointers.meio = vars.meio;
      if (frame.kind === 'particionar') {
        if (Number.isInteger(vars.i)) pointers.i = vars.i;
        if (Number.isInteger(vars.j)) pointers.j = vars.j;
        if (vars.aux !== NONE) stats.aux = fmt(vars.aux);
      }
    }
    steps.push(step(valuesOf(a), line, title, description, tone, {
      tags: tagsOf(a),
      stats,
      stack: frames.map((entry) => entry.label),
      variables: { ...vars, ...(frame?.kind === 'particionar' && vars.aux !== NONE ? { aux: fmt(vars.aux) } : {}) },
      pointers: { ...pointers, ...own },
      outsideIndices: frame ? range(n).filter((index) => index < vars.inicio || index > vars.fim) : [],
      sortedIndices: [...sorted],
      pivotIndex,
      output: clone(log),
      ...rest,
    }));
  }

  function partition(ini, fim) {
    const text = tr(`particionar(${ini}, ${fim})`, `partition(${ini}, ${fim})`);
    const frame = {
      kind: 'particionar', label: text, vars: { inicio: ini, fim, i: NONE, j: NONE, aux: NONE },
    };
    frames.push(frame);
    const { vars } = frame;
    const pivot = a[ini];
    const phase = (what) => ({ label: text, text: what, code: true });
    const start = counters.comparisons;
    const startSwaps = counters.swaps;
    const ctx = (what, extra = {}) => ({ phase: phase(what), pivotIndex: ini, ...extra });
    const cmp = (left, op, right, result) => ({ compare: compareOf(left, op, right, result) });

    add(base + P.head, text, tr(`Chamada: o pivô é vetor[inicio] = ${label(pivot)}, o primeiro valor do trecho (posições ${ini} a ${fim}). Os outros valores serão separados em menores que o pivô, à esquerda, e maiores ou iguais, à direita.`, `Call: the pivot is array[start] = ${label(pivot)}, the first value of the range (positions ${ini} to ${fim}). The other values will be separated into smaller than the pivot, on the left, and greater than or equal, on the right.`), 'neutral', ctx(tr('Varre o trecho', 'Sweeps the range')));

    let i = ini + 1;
    let j = fim;
    vars.i = i;
    vars.j = j;
    add(base + P.init, tr('i ← inicio + 1; j ← fim', 'i ← start + 1; j ← end'), tr(`i recebe ${i}, logo depois do pivô, e j recebe ${j}, o fim do trecho. i procura da esquerda um valor maior ou igual ao pivô; j procura da direita um valor menor ou igual a ele.`, `i receives ${i}, right after the pivot, and j receives ${j}, the end of the range. i looks from the left for a value greater than or equal to the pivot; j looks from the right for one smaller than or equal to it.`), 'update', ctx(tr('Varre o trecho', 'Sweeps the range')));

    for (;;) {
      const crossing = i <= j;
      add(base + P.loop, tr('ENQUANTO i ≤ j', 'WHILE i ≤ j'), crossing
        ? tr(`${i} ≤ ${j} é verdadeiro: i e j ainda não se cruzaram, então há valores para examinar.`, `${i} ≤ ${j} is true: i and j have not crossed yet, so there are values to examine.`)
        : tr(`${i} ≤ ${j} é falso: i e j se cruzaram, e a varredura termina. A posição j = ${j} é onde o pivô vai ficar: à esquerda dela só há valores menores ou iguais ao pivô e, à direita, maiores ou iguais.`, `${i} ≤ ${j} is false: i and j crossed, and the sweep ends. Position j = ${j} is where the pivot will stay: to its left there are only values smaller than or equal to the pivot and, to its right, greater than or equal.`), crossing ? 'comparison' : 'success', ctx(tr('Varre o trecho', 'Sweeps the range'), cmp({ label: 'i', value: String(i) }, '≤', { label: 'j', value: String(j) }, crossing)));
      if (!crossing) break;

      counters.comparisons += 1;
      const small = a[i].v < pivot.v;
      add(base + P.testI, tr('SE vetor[i] < vetor[inicio]', 'IF array[i] < array[start]'), tr(`${fmt(a[i].v)} < ${fmt(pivot.v)} é ${small ? 'verdadeiro' : 'falso'}. ${small
        ? 'Este valor já está do lado certo (menor que o pivô): i avança.'
        : 'Este valor é maior ou igual ao pivô: está do lado errado, então i para aqui e vamos olhar para j.'}`, `${fmt(a[i].v)} < ${fmt(pivot.v)} is ${small ? 'true' : 'false'}. ${small ? 'This value is already on the right side (smaller than the pivot): i advances.' : 'This value is greater than or equal to the pivot: it is on the wrong side, so i stops here and we look at j.'}`), 'comparison', ctx(tr('Varre o trecho', 'Sweeps the range'), cmp({ label: tr('vetor[i]', 'array[i]'), value: fmt(a[i].v) }, '<', { label: tr('vetor[inicio]', 'array[start]'), value: fmt(pivot.v) }, small)));
      if (small) {
        i += 1;
        vars.i = i;
        add(base + P.incI, tr('i ← i + 1', 'i ← i + 1'), tr(`i avança para ${i}.`, `i advances to ${i}.`), 'update', ctx(tr('Varre o trecho', 'Sweeps the range')));
        continue;
      }

      counters.comparisons += 1;
      const big = a[j].v > pivot.v;
      add(base + P.testJ, tr('SE vetor[j] > vetor[inicio]', 'IF array[j] > array[start]'), tr(`${fmt(a[j].v)} > ${fmt(pivot.v)} é ${big ? 'verdadeiro' : 'falso'}. ${big
        ? 'Este valor já está do lado certo (maior que o pivô): j recua.'
        : `Este valor é menor ou igual ao pivô: está do lado errado. i e j pararam, então vetor[${i}] e vetor[${j}] trocam de lugar.`}`, `${fmt(a[j].v)} > ${fmt(pivot.v)} is ${big ? 'true' : 'false'}. ${big ? 'This value is already on the right side (greater than the pivot): j steps back.' : `This value is smaller than or equal to the pivot: it is on the wrong side. i and j stopped, so array[${i}] and array[${j}] swap places.`}`), 'comparison', ctx(tr('Varre o trecho', 'Sweeps the range'), cmp({ label: tr('vetor[j]', 'array[j]'), value: fmt(a[j].v) }, '>', { label: tr('vetor[inicio]', 'array[start]'), value: fmt(pivot.v) }, big)));
      if (big) {
        j -= 1;
        vars.j = j;
        add(base + P.decJ, tr('j ← j - 1', 'j ← j - 1'), tr(`j recua para ${j}.`, `j steps back to ${j}.`), 'update', ctx(tr('Varre o trecho', 'Sweeps the range')));
        continue;
      }

      const aux = a[i];
      vars.aux = aux.v;
      add(base + P.saveAux, tr('aux ← vetor[i]', 'aux ← array[i]'), tr(`aux recebe vetor[${i}] = ${label(aux)}: o valor de i é guardado antes de ser sobrescrito.`, `aux receives array[${i}] = ${label(aux)}: the value of i is saved before being overwritten.`), 'update', ctx(tr('Troca vetor[i] com vetor[j]', 'Swaps array[i] with array[j]'), { comparedIndices: [i] }));
      a[i] = a[j];
      add(base + P.copyJ, tr('vetor[i] ← vetor[j]', 'array[i] ← array[j]'), tr(`vetor[${i}] recebe vetor[${j}] = ${label(a[i])}.`, `array[${i}] receives array[${j}] = ${label(a[i])}.`), 'update', ctx(tr('Troca vetor[i] com vetor[j]', 'Swaps array[i] with array[j]'), { changedIndices: [i], comparedIndices: [j] }));
      a[j] = aux;
      counters.swaps += 1;
      add(base + P.putAux, tr('vetor[j] ← aux', 'array[j] ← aux'), tr(`vetor[${j}] recebe aux = ${label(aux)}: os dois valores trocaram de lugar, e agora cada um está do lado certo.`, `array[${j}] receives aux = ${label(aux)}: the two values swapped places, and now each one is on the right side.`), 'update', ctx(tr('Troca vetor[i] com vetor[j]', 'Swaps array[i] with array[j]'), { changedIndices: [i, j] }));
      i += 1;
      vars.i = i;
      add(base + P.incI2, tr('i ← i + 1', 'i ← i + 1'), tr(`i avança para ${i}.`, `i advances to ${i}.`), 'update', ctx(tr('Troca vetor[i] com vetor[j]', 'Swaps array[i] with array[j]')));
      j -= 1;
      vars.j = j;
      add(base + P.decJ2, tr('j ← j - 1', 'j ← j - 1'), tr(`j recua para ${j}.`, `j steps back to ${j}.`), 'update', ctx(tr('Troca vetor[i] com vetor[j]', 'Swaps array[i] with array[j]')));
    }

    const fixed = { label: text, text: tr('Põe o pivô no lugar', 'Puts the pivot in place'), code: true };
    vars.aux = pivot.v;
    add(base + P.pivotSave, tr('aux ← vetor[inicio]', 'aux ← array[start]'), tr(`aux recebe vetor[${ini}] = ${label(pivot)}: o pivô é guardado antes de a posição dele ser sobrescrita.`, `aux receives array[${ini}] = ${label(pivot)}: the pivot is saved before its position is overwritten.`), 'update', { phase: fixed, pivotIndex: ini });
    a[ini] = a[j];
    add(base + P.pivotMove, tr('vetor[inicio] ← vetor[j]', 'array[start] ← array[j]'), tr(`vetor[${ini}] recebe vetor[${j}] = ${label(a[ini])}${j === ini ? ' (é o próprio pivô: nenhum valor ficou à esquerda dele)' : ': o valor da posição j, que é menor ou igual ao pivô, vai para o início do trecho'}.`, `array[${ini}] receives array[${j}] = ${label(a[ini])}${j === ini ? ' (it is the pivot itself: no value was left to its left)' : ': the value at position j, which is smaller than or equal to the pivot, goes to the start of the range'}.`), 'update', { phase: fixed, changedIndices: [ini], comparedIndices: [j] });
    a[j] = pivot;
    counters.swaps += 1;
    sorted.add(j);
    add(base + P.pivotPut, tr('vetor[j] ← aux', 'array[j] ← aux'), tr(`vetor[${j}] recebe aux = ${label(pivot)}: o pivô chega à posição ${j}, a definitiva. ${j === ini ? 'Ele já estava no lugar (a troca foi com ele mesmo).' : ''}Tudo à esquerda dele é menor ou igual, e tudo à direita, maior ou igual.`, `array[${j}] receives aux = ${label(pivot)}: the pivot reaches position ${j}, its final one. ${j === ini ? 'It was already in place (the swap was with itself).' : ''}Everything to its left is smaller or equal, and everything to its right, greater or equal.`).trim(), 'success', { phase: fixed, pivotIndex: j, changedIndices: [ini, j] });
    vars.j = j;
    log.push(tr(`${text}: pivô ${label(pivot)} → posição ${j} (${plural(counters.comparisons - start, 'comparação', 'comparações')}, ${plural(counters.swaps - startSwaps, 'troca', 'trocas')})`, `${text}: pivot ${label(pivot)} → position ${j} (${plural(counters.comparisons - start, 'comparison', 'comparisons')}, ${plural(counters.swaps - startSwaps, 'swap', 'swaps')})`));
    add(base + P.ret, tr('RETORNE j', 'RETURN j'), tr(`A função devolve j = ${j}: a posição final do pivô ${label(pivot)}.`, `The function returns j = ${j}: the final position of the pivot ${label(pivot)}.`), 'success', { phase: fixed, pivotIndex: j });
    frames.pop();
    return j;
  }

  function quickSort(ini, fim, depth) {
    const text = tr(`quickSort(${ini}, ${fim})`, `quickSort(${ini}, ${fim})`);
    const frame = { kind: 'quickSort', label: text, vars: { inicio: ini, fim, meio: NONE } };
    frames.push(frame);
    const size = Math.max(0, fim - ini + 1);
    const splitting = { label: text, text: tr('Particiona e repete', 'Partitions and repeats'), code: true };

    add(Q.call, text, depth === 0
      ? tr(`Chamada inicial: quickSort(vetor, 0, ${n - 1}). O trecho é o vetor inteiro, com ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}.`, `Initial call: quickSort(array, 0, ${n - 1}). The range is the whole array, with ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}.`)
      : tr(`Nova chamada, agora com inicio = ${ini} e fim = ${fim}: ${size === 0 ? 'o trecho é vazio' : `o trecho tem ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}`}. Cada chamada tem as suas próprias variáveis.`, `New call, now with start = ${ini} and end = ${fim}: ${size === 0 ? 'the range is empty' : `the range has ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}`}. Each call has its own variables.`), 'neutral', { phase: splitting });

    const divides = ini < fim;
    if (ini === fim) sorted.add(ini);
    add(Q.test, tr('SE inicio < fim', 'IF start < end'), divides
      ? tr(`${ini} < ${fim} é verdadeiro: o trecho tem mais de um elemento e precisa ser particionado.`, `${ini} < ${fim} is true: the range has more than one element and needs to be partitioned.`)
      : tr(`${ini} < ${fim} é falso: ${ini === fim ? 'o trecho tem um só elemento, que já está no lugar' : 'o trecho é vazio'} (caso base). A chamada termina sem fazer mais nada.`, `${ini} < ${fim} is false: ${ini === fim ? 'the range has a single element, which is already in place' : 'the range is empty'} (base case). The call ends without doing anything else.`), divides ? 'comparison' : 'success', {
      phase: splitting,
      compare: compareOf({ label: tr('inicio', 'start'), value: String(ini) }, '<', { label: tr('fim', 'end'), value: String(fim) }, divides),
    });
    if (!divides) {
      frames.pop();
      return;
    }

    add(Q.part, tr('meio ← particionar(vetor, inicio, fim)', 'mid ← partition(array, start, end)'), tr(`Chama particionar para o trecho de ${ini} a ${fim}: ele usa vetor[inicio] = ${label(a[ini])} como pivô e o coloca na posição final.`, `Calls partition for the range from ${ini} to ${fim}: it uses array[start] = ${label(a[ini])} as the pivot and puts it in its final position.`), 'neutral', { phase: splitting });
    const meio = partition(ini, fim);
    frame.vars.meio = meio;
    add(Q.part, tr('meio ← particionar(vetor, inicio, fim)', 'mid ← partition(array, start, end)'), tr(`particionar devolveu ${meio}: meio recebe ${meio}. O pivô ${label(a[meio])} está na posição definitiva; à esquerda dele ficaram os valores menores ou iguais e, à direita, os maiores ou iguais.`, `partition returned ${meio}: mid receives ${meio}. The pivot ${label(a[meio])} is in its final position; to its left are the smaller or equal values and, to its right, the greater or equal ones.`), 'update', { phase: splitting });

    add(Q.left, tr(`quickSort(${ini}, ${meio - 1})`, `quickSort(${ini}, ${meio - 1})`), meio - 1 >= ini
      ? tr(`Chama quickSort para os valores à esquerda do pivô, das posições ${ini} a ${meio - 1}. A parte da direita só será examinada depois que esta voltar.`, `Calls quickSort for the values to the left of the pivot, positions ${ini} to ${meio - 1}. The right part will only be examined after this one returns.`)
      : tr(`À esquerda do pivô não sobrou nenhum valor, mas a chamada quickSort(vetor, ${ini}, ${meio - 1}) acontece mesmo assim (trecho vazio).`, `No value was left to the left of the pivot, but the call quickSort(array, ${ini}, ${meio - 1}) happens anyway (empty range).`), 'neutral', { phase: splitting });
    quickSort(ini, meio - 1, depth + 1);

    add(Q.right, tr(`quickSort(${meio + 1}, ${fim})`, `quickSort(${meio + 1}, ${fim})`), tr(`${meio - 1 >= ini ? 'A parte da esquerda voltou ordenada. ' : ''}Agora quickSort cuida dos valores à direita do pivô, das posições ${meio + 1} a ${fim}${meio + 1 > fim ? ' (nenhum: trecho vazio)' : ''}.`, `${meio - 1 >= ini ? 'The left part came back sorted. ' : ''}Now quickSort takes care of the values to the right of the pivot, positions ${meio + 1} to ${fim}${meio + 1 > fim ? ' (none: empty range)' : ''}.`), 'neutral', { phase: splitting });
    quickSort(meio + 1, fim, depth + 1);
    frames.pop();
  }

  return {
    steps, a, counters, log, add, quickSort, partition, sorted,
  };
}

function quickSortSteps(items) {
  const tracer = createTracer(items, OFFSET);
  const n = items.length;
  tracer.quickSort(0, n - 1, 0);
  const { a, counters, log } = tracer;
  tracer.add(Q.end, tr('Ordenação concluída', 'Sort finished'), tr(`O vetor está em ordem crescente, depois de ${counters.comparisons} comparações com o pivô e ${counters.swaps} trocas. Cada particionamento fixou um pivô, e os trechos de um elemento já estavam no lugar.`, `The array is in ascending order, after ${counters.comparisons} comparisons with the pivot and ${counters.swaps} swaps. Each partitioning fixed one pivot, and the one-element ranges were already in place.`), 'done', {
    output: [...log, tr(`Vetor ordenado: ${vec(a)}`, `Sorted array: ${vec(a)}`), tr(`Comparações: ${counters.comparisons} · Trocas: ${counters.swaps}`, `Comparisons: ${counters.comparisons} · Swaps: ${counters.swaps}`)],
  });
  return tracer.steps;
}

/** particionar sozinho, sobre o trecho de `config.inicio` a `config.fim`. */
function partitionSteps(values, config) {
  const n = values.length;
  const ini = Math.max(0, Math.min(n - 2, Number.isInteger(Number(config.inicio)) ? Number(config.inicio) : 0));
  const fim = Math.max(ini + 1, Math.min(n - 1, Number.isInteger(Number(config.fim)) ? Number(config.fim) : n - 1));
  const tracer = createTracer(toItems(values), 0);
  const meio = tracer.partition(ini, fim);
  const { a, counters, log } = tracer;
  tracer.steps.push({
    ...tracer.steps.at(-1),
    line: P.end,
    title: tr('Particionamento concluído', 'Partitioning finished'),
    description: tr(`O pivô ${fmt(a[meio].v)} está na posição ${meio}. À esquerda dele ficaram ${plural(meio - ini, tr('valor', 'value'), tr('valores', 'values'))} e, à direita, ${plural(fim - meio, tr('valor', 'value'), tr('valores', 'values'))}; cada lado será ordenado por uma nova chamada de quickSort. Foram ${counters.comparisons} comparações com o pivô e ${counters.swaps} trocas.`, `The pivot ${fmt(a[meio].v)} is at position ${meio}. To its left there are ${plural(meio - ini, tr('valor', 'value'), tr('valores', 'values'))} and, to its right, ${plural(fim - meio, tr('valor', 'value'), tr('valores', 'values'))}; each side will be sorted by a new call of quickSort. There were ${counters.comparisons} comparisons with the pivot and ${counters.swaps} swaps.`),
    tone: 'done',
    stack: [],
    output: [...log, tr(`Posição do pivô: ${meio}`, `Pivot position: ${meio}`), tr(`À esquerda: ${meio - ini} · À direita: ${fim - meio}`, `Left: ${meio - ini} · Right: ${fim - meio}`)],
  });
  return tracer.steps;
}

// ---------------------------------------------------------------------------
// 03 · Contando as operações: um particionamento por passo
// ---------------------------------------------------------------------------

function countingSteps(values) {
  const n = values.length;
  const { calls } = runPartitions(toItems(values));
  const worst = totalOf(runPartitions(toItems(ascending(values))).calls, 'comparisons');
  const best = totalOf(runPartitions(toItems(bestCase(ascending(values)))).calls, 'comparisons');
  const longest = Math.max(1, ...calls.map((call) => call.comparisons));
  const bars = calls.map((call) => ({
    label: `[${call.ini}..${call.fim}]`, value: null, mark: '', current: false,
  }));
  const done = new Set();
  let comparisons = 0;
  let swaps = 0;
  const chart = (final = false) => ({
    title: tr('Comparações em cada particionamento (início..fim)', 'Comparisons in each partitioning (start..end)'),
    hint: tr('⇄ + número = trocas', '⇄ + number = swaps'),
    max: longest,
    bars: bars.map((bar) => ({ ...bar })),
    totals: [
      { label: tr('Comparações', 'Comparisons'), value: comparisons, note: final ? tr(`pior caso (ordenado): ${worst} · melhor: ${best}`, `worst case (sorted): ${worst} · best: ${best}`) : tr(`pior caso: ${worst} · melhor: ${best}`, `worst case: ${worst} · best: ${best}`) },
      { label: tr('Particionamentos', 'Partitionings'), value: bars.filter((bar) => bar.value !== null).length, note: final ? tr(`no máximo n − 1 = ${n - 1}`, `at most n − 1 = ${n - 1}`) : tr(`esperados ao final: ${calls.length}`, `expected at the end: ${calls.length}`) },
    ],
    final,
  });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, 0, tr('Contando as operações', 'Counting the operations'), tr(`Cada chamada de quickSort com mais de um elemento faz um particionamento, e cada particionamento compara os valores do trecho com o pivô. Com ${n} elementos há ${plural(calls.length, tr('particionamento', 'partitioning'), tr('particionamentos', 'partitionings'))} neste vetor. Vamos somar o custo de cada um.`, `Each call of quickSort with more than one element does one partitioning, and each partitioning compares the values of the range with the pivot. With ${n} elements there are ${plural(calls.length, tr('particionamento', 'partitioning'), tr('particionamentos', 'partitionings'))} in this array. We will add up the cost of each one.`), 'neutral', common({ sortedIndices: [] })),
  ];

  calls.forEach((call, index) => {
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += call.comparisons;
    swaps += call.swaps;
    bars[index].value = call.comparisons;
    bars[index].mark = `⇄ ${call.swaps}`;
    done.add(call.meio);
    if (call.meio - 1 === call.ini) done.add(call.ini);
    if (call.meio + 1 === call.fim) done.add(call.fim);
    const size = call.fim - call.ini + 1;
    const left = call.meio - call.ini;
    const right = call.fim - call.meio;
    steps.push(step(valuesOf(call.after), OFFSET + P.testI, tr(`particionar(${call.ini}, ${call.fim})`, `partition(${call.ini}, ${call.fim})`), tr(`Trecho de ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}: o pivô ${fmt(call.before[call.ini].v)} foi para a posição ${call.meio}, e sobraram ${plural(left, tr('valor', 'value'), tr('valores', 'values'))} à esquerda e ${plural(right, tr('valor', 'value'), tr('valores', 'values'))} à direita. Custo: ${plural(call.comparisons, 'comparação', 'comparações')} com o pivô e ${plural(call.swaps, 'troca', 'trocas')}. ${Math.min(left, right) === 0 && size > 2 ? 'O pivô ficou em um extremo: o trecho quase não encolheu.' : ''}`, `Range of ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}: the pivot ${fmt(call.before[call.ini].v)} went to position ${call.meio}, leaving ${plural(left, tr('valor', 'value'), tr('valores', 'values'))} on the left and ${plural(right, tr('valor', 'value'), tr('valores', 'values'))} on the right. Cost: ${plural(call.comparisons, 'comparison', 'comparisons')} with the pivot and ${plural(call.swaps, 'swap', 'swaps')}. ${Math.min(left, right) === 0 && size > 2 ? 'The pivot ended up at an extreme: the range barely shrank.' : ''}`).trim(), 'comparison', common({
      sortedIndices: [...done],
      outsideIndices: range(n).filter((position) => position < call.ini || position > call.fim),
      pointers: { inicio: call.ini, fim: call.fim, meio: call.meio },
      pivotIndex: call.meio,
      changedIndices: range(call.fim + 1, call.ini),
      variables: { trecho: `${call.ini}..${call.fim}`, 'comparações do trecho': call.comparisons, 'comparações acumuladas': comparisons },
    })));
  });

  bars.forEach((bar) => { bar.current = false; });
  const quadratic = n * (n - 1);
  steps.push(step(valuesOf(calls.length ? calls.at(-1).after : values), Q.end, tr('Somando os particionamentos', 'Adding up the partitionings'), tr(`${plural(calls.length, tr('particionamento', 'partitioning'), tr('particionamentos', 'partitionings'))} e ${comparisons} comparações no total (${swaps} trocas). Para os mesmos valores, o pior caso (já ordenados, o pivô sempre no extremo) faria ${worst} comparações e o melhor caso (pivô sempre na mediana), ${best}. Quanto mais equilibrados os particionamentos, menos níveis e menos trabalho.`, `${plural(calls.length, tr('particionamento', 'partitioning'), tr('particionamentos', 'partitionings'))} and ${comparisons} comparisons in total (${swaps} swaps). For the same values, the worst case (already sorted, the pivot always at the extreme) would make ${worst} comparisons and the best case (pivot always at the median), ${best}. The more balanced the partitionings, the fewer levels and the less work.`), 'done', common({
    final: true,
    sortedIndices: range(n),
    variables: { n, 'comparações': comparisons, trocas: swaps },
    output: [
      tr(`Comparações: ${comparisons}`, `Comparisons: ${comparisons}`),
      tr(`Trocas: ${swaps}`, `Swaps: ${swaps}`),
      tr(`Pior caso (vetor ordenado): ${worst} = n(n−1) = ${quadratic}`, `Worst case (sorted array): ${worst} = n(n−1) = ${quadratic}`),
      tr(`Melhor caso (pivô na mediana): ${best}`, `Best case (pivot at the median): ${best}`),
    ],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Adaptabilidade: melhor caso, vetor ordenado, vetor invertido e o seu vetor
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const inOrder = ascending(values);
  const scenarios = [
    { label: tr('Pivôs na mediana (melhor caso)', 'Pivots at the median (best case)'), values: bestCase(inOrder) },
    { label: tr('Já ordenado', 'Already sorted'), values: inOrder },
    { label: tr('Ordem inversa', 'Reverse order'), values: [...inOrder].reverse() },
    { label: tr('Seu vetor', 'Your array'), values: clone(values) },
  ].map((scenario) => ({
    ...scenario, ...runPartitions(toItems(scenario.values)), comparisons: 0, swaps: 0, done: new Set(), current: toItems(scenario.values),
  }));
  const rounds = Math.max(...scenarios.map((scenario) => scenario.calls.length));

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, tr('Quatro vetores, os mesmos valores', 'Four arrays, the same values'), tr('O primeiro tem os valores dispostos para que todo pivô caia na mediana (o melhor caso), o segundo já está ordenado, o terceiro está em ordem inversa e o quarto é o seu vetor. O algoritmo vai tratar os quatro do mesmo jeito?', 'The first has its values arranged so that every pivot lands at the median (the best case), the second is already sorted, the third is in reverse order and the fourth is your array. Will the algorithm treat the four the same way?'), 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedIndices: [] })),
    }),
  ];

  for (let index = 0; index < rounds; index += 1) {
    scenarios.forEach((scenario) => {
      const call = scenario.calls[index];
      if (!call) return;
      scenario.comparisons += call.comparisons;
      scenario.swaps += call.swaps;
      scenario.done.add(call.meio);
      if (call.meio - 1 === call.ini) scenario.done.add(call.ini);
      if (call.meio + 1 === call.fim) scenario.done.add(call.fim);
      scenario.current = call.after;
      scenario.last = call;
    });
    steps.push(step(values, OFFSET + P.testI, tr(`${index + 1}º particionamento`, `partitioning ${index + 1}`), tr(`Cada vetor faz o seu ${index + 1}º particionamento (os que já terminaram esperam). Comparações acumuladas: ${joined('comparisons')}. Quando o pivô cai no meio, o trecho se divide em duas partes parecidas; quando cai em um extremo, uma das partes fica vazia e a outra quase não encolhe.`, `Each array does its partitioning number ${index + 1} (the ones that already finished wait). Accumulated comparisons: ${joined('comparisons')}. When the pivot lands in the middle, the range splits into two similar parts; when it lands at an extreme, one of the parts is empty and the other barely shrinks.`), 'comparison', {
      rows: rows((scenario) => ({
        values: valuesOf(scenario.current),
        sortedIndices: [...scenario.done],
        changedIndices: scenario.calls[index] ? range(scenario.calls[index].fim + 1, scenario.calls[index].ini) : [],
        markIndex: scenario.calls[index]?.meio,
      })),
      variables: { particionamento: `${index + 1} / ${rounds}`, 'comparações': joined('comparisons'), trocas: joined('swaps') },
    }));
  }

  const ordered = scenarios[1];
  steps.push(step(values, Q.end, tr('O custo depende da ordem', 'The cost depends on the order'), tr(`Comparações: ${joined('comparisons')}. Os vetores ordenado e invertido, que pareceriam fáceis, são o pior caso: o pivô (o primeiro valor) é sempre o menor ou o maior do trecho, são ${plural(ordered.calls.length, tr('particionamento', 'partitioning'), tr('particionamentos', 'partitionings'))} que quase não encolhem o trecho, e o custo é quadrático. Com o pivô na mediana, o mesmo conjunto de valores custa muito menos. O custo do Quicksort depende da ordem inicial, e aqui o caso que parece fácil (já ordenado) é o pior.`, `Comparisons: ${joined('comparisons')}. The sorted and reversed arrays, which would seem easy, are the worst case: the pivot (the first value) is always the smallest or the largest of the range, there are ${plural(ordered.calls.length, tr('particionamento', 'partitioning'), tr('particionamentos', 'partitionings'))} that barely shrink the range, and the cost is quadratic. With the pivot at the median, the same set of values costs much less. The cost of Quicksort depends on the initial order, and here the case that looks easy (already sorted) is the worst.`), 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.final), sortedIndices: range(n) })),
    output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.comparisons} comparações, ${scenario.swaps} trocas`, `${scenario.label}: ${scenario.comparisons} comparisons, ${scenario.swaps} swaps`)),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 05 · Estabilidade: o que cada particionamento faz com os iguais
// ---------------------------------------------------------------------------

function stabilitySteps(values) {
  const n = values.length;
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const { calls, final } = runPartitions(items);
  const done = new Set();
  const log = [];
  let swapped = 0;

  const steps = [
    hasRepeated
      ? step(values, 0, tr('Valores repetidos em destaque', 'Repeated values highlighted'), tr('Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética. Vamos ver, particionamento por particionamento, se algum par de iguais troca de ordem.', 'Repeated values get a letter (a, b, …) that marks the order in which they appear. A stable algorithm ends with those letters in alphabetical order. We will see, partitioning by partitioning, whether any pair of equals swaps order.'), 'neutral', { tags: tagsOf(items), sortedIndices: [] })
      : step(values, 0, tr('Não há valores repetidos', 'There are no repeated values'), tr('Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com valores repetidos.', 'Without repeated values there is no relative order to preserve. Use "Generate example" to create an array with repeated values.'), 'warning', { tags: tagsOf(items), sortedIndices: [] }),
  ];

  calls.forEach((call) => {
    done.add(call.meio);
    if (call.meio - 1 === call.ini) done.add(call.ini);
    if (call.meio + 1 === call.fim) done.add(call.fim);
    const pairs = flippedPairs(call.before, call.after);
    const moved = pairs.flatMap(([x, y]) => [x, y]);
    const warnIndices = call.after.map((item, index) => (moved.some((m) => m.v === item.v && m.tag === item.tag) ? index : -1)).filter((index) => index >= 0);
    swapped += pairs.length;
    pairs.forEach(([x, y]) => log.push(tr(`particionar(${call.ini}, ${call.fim}): ${label(y)} passou à frente de ${label(x)}`, `partition(${call.ini}, ${call.fim}): ${label(y)} went ahead of ${label(x)}`)));
    const noRepeat = !call.before.slice(call.ini, call.fim + 1).some((item) => item.tag);
    steps.push(step(valuesOf(call.after), OFFSET + P.pivotPut, tr(`particionar(${call.ini}, ${call.fim})`, `partition(${call.ini}, ${call.fim})`), pairs.length
      ? `${pairs.map(([x, y]) => tr(`${label(y)} passou à frente de ${label(x)}`, `${label(y)} went ahead of ${label(x)}`)).join('; ')}. O trecho ficou ${vec(call.after.slice(call.ini, call.fim + 1))}. ${pairs.length === 1 ? tr('Esses dois iguais', 'These two equals') : tr('Esses pares de iguais', 'These pairs of equals')} não estão mais na ordem original: a troca de vetor[i] com vetor[j] (ou do pivô com vetor[j]) leva um valor da ponta direita para a esquerda por cima de um igual.`
      : tr(`${noRepeat ? 'Não há valores repetidos neste trecho.' : 'Os iguais deste trecho continuam na ordem original.'} O pivô ${label(call.before[call.ini])} foi para a posição ${call.meio}.`, `${noRepeat ? 'There are no repeated values in this range.' : 'The equals in this range stay in the original order.'} The pivot ${label(call.before[call.ini])} went to position ${call.meio}.`), pairs.length ? 'warning' : 'comparison', {
      tags: tagsOf(call.after),
      sortedIndices: [...done],
      outsideIndices: range(n).filter((position) => position < call.ini || position > call.fim),
      pointers: { inicio: call.ini, fim: call.fim, meio: call.meio },
      warnIndices,
      changedIndices: range(call.fim + 1, call.ini),
      output: clone(log),
      variables: { trecho: `${call.ini}..${call.fim}`, 'pares invertidos': swapped },
    }));
  });

  const stable = isStable(final);
  steps.push(step(valuesOf(final), Q.end, !hasRepeated ? tr('Resultado', 'Result') : stable ? tr('Resultado: ordem preservada neste vetor', 'Result: order preserved on this array') : tr('Resultado: instável', 'Result: unstable'), !hasRepeated
    ? tr('O vetor não tinha valores repetidos, então não há o que comparar.', 'The array had no repeated values, so there is nothing to compare.')
    : stable
      ? tr('Neste vetor a ordem dos iguais foi preservada, mas por acaso: o Quicksort não garante isso. Use "Gerar exemplo" para ver um vetor em que a ordem se inverte.', 'On this array the order of the equals was preserved, but by chance: Quicksort does not guarantee it. Use "Generate example" to see an array where the order is reversed.')
      : tr(`Ordem final: ${final.map(label).join(' ')}. Pelo menos um par de iguais trocou de ordem: o Quicksort é instável, porque as trocas feitas por i e j e a troca final do pivô movem valores por cima de iguais.`, `Final order: ${final.map(label).join(' ')}. At least one pair of equals swapped order: Quicksort is unstable, because the swaps made by i and j and the final swap of the pivot move values over equals.`), !hasRepeated || stable ? 'done' : 'warning', {
    tags: tagsOf(final),
    sortedIndices: range(n),
    output: [...log, tr(`Ordem final: ${final.map(label).join(' ')}`, `Final order: ${final.map(label).join(' ')}`), !hasRepeated ? tr('Sem valores repetidos.', 'No repeated values.') : stable ? tr('Ordem dos iguais preservada.', 'Order of the equals preserved.') : tr('Ordem dos iguais alterada.', 'Order of the equals changed.')],
  }));
  return steps;
}

export function buildSteps(id, values, config = {}) {
  switch (id) {
    case 'partition': return partitionSteps(values, config);
    case 'quick-sort': return quickSortSteps(toItems(values));
    case 'counting': return countingSteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    case 'stability': return stabilitySteps(values);
    default: return partitionSteps(values, config);
  }
}
