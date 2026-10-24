import {
  NONE, ascending, clone, fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf, withRepeats,
} from '../shared/sort-steps.js';
import { extendVariableNames, tr } from '../../core/i18n.js';

extendVariableNames({ inicio: 'start', fim: 'end', trocar: 'largest' });

// Pseudocódigo da aula (slides 87 a 90): heapsort cria o heap e, a cada volta, troca a raiz (o maior
// valor) com o último elemento do heap, encolhe o heap e o conserta; CriaHeap conserta cada pai, do
// último até a raiz; ArrumaHeap desce o valor de um nó até o lugar certo; swap troca dois valores.
const HEAP_CODE = [
  tr('FUNÇÃO heapsort(vetor, tamanho)', 'FUNCTION heapsort(array, size)'),
  tr('  CriaHeap(vetor, tamanho)', '  buildHeap(array, size)'),
  tr('  fim ← tamanho - 1', '  end ← size - 1'),
  tr('  ENQUANTO fim > 0 FAÇA', '  WHILE end > 0 DO'),
  tr('    swap(vetor, 0, fim)', '    swap(array, 0, end)'),
  tr('    fim ← fim - 1', '    end ← end - 1'),
  tr('    ArrumaHeap(vetor, 0, fim)', '    heapify(array, 0, end)'),
  tr('  FIM ENQUANTO', '  END WHILE'),
  tr('FIM', 'END'),
];

const BUILD_CODE = [
  tr('FUNÇÃO CriaHeap(vetor, tamanho)', 'FUNCTION buildHeap(array, size)'),
  tr('  inicio ← (tamanho - 1) / 2', '  start ← (size - 1) / 2'),
  tr('  ENQUANTO inicio ≥ 0 FAÇA', '  WHILE start ≥ 0 DO'),
  tr('    ArrumaHeap(vetor, inicio, tamanho - 1)', '    heapify(array, start, size - 1)'),
  tr('    inicio ← inicio - 1', '    start ← start - 1'),
  tr('  FIM ENQUANTO', '  END WHILE'),
  tr('FIM', 'END'),
];

const SIFT_CODE = [
  tr('FUNÇÃO ArrumaHeap(vetor, inicio, fim)', 'FUNCTION heapify(array, start, end)'),
  tr('  raiz ← inicio', '  root ← start'),
  tr('  ENQUANTO raiz * 2 + 1 ≤ fim FAÇA', '  WHILE root * 2 + 1 ≤ end DO'),
  tr('    filho ← raiz * 2 + 1', '    child ← root * 2 + 1'),
  tr('    trocar ← raiz', '    largest ← root'),
  tr('    SE vetor[trocar] < vetor[filho] ENTÃO', '    IF array[largest] < array[child] THEN'),
  tr('      trocar ← filho', '      largest ← child'),
  tr('    FIM SE', '    END IF'),
  tr('    SE filho + 1 ≤ fim E vetor[trocar] < vetor[filho + 1] ENTÃO', '    IF child + 1 ≤ end AND array[largest] < array[child + 1] THEN'),
  tr('      trocar ← filho + 1', '      largest ← child + 1'),
  tr('    FIM SE', '    END IF'),
  tr('    SE trocar = raiz ENTÃO', '    IF largest = root THEN'),
  tr('      TERMINA', '      BREAK'),
  tr('    SENÃO', '    ELSE'),
  tr('      swap(vetor, raiz, trocar)', '      swap(array, root, largest)'),
  tr('      raiz ← trocar', '      root ← largest'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM ENQUANTO', '  END WHILE'),
  tr('FIM', 'END'),
];

const SWAP_CODE = [
  tr('FUNÇÃO swap(vetor, i, j)', 'FUNCTION swap(array, i, j)'),
  tr('  temp ← vetor[j]', '  temp ← array[j]'),
  tr('  vetor[j] ← vetor[i]', '  array[j] ← array[i]'),
  tr('  vetor[i] ← temp', '  array[i] ← temp'),
  tr('FIM', 'END'),
];

// Não está nos slides: a verificação que a aula descreve em palavras ("todo pai é maior ou igual
// aos filhos"), escrita com o pai de um nó na posição i, (i - 1) / 2.
const CHECK_CODE = [
  tr('FUNÇÃO ehMaxHeap(vetor, tamanho)', 'FUNCTION isMaxHeap(array, size)'),
  tr('  PARA filho de 1 até tamanho - 1 FAÇA', '  FOR child from 1 to size - 1 DO'),
  tr('    pai ← (filho - 1) / 2', '    parent ← (child - 1) / 2'),
  tr('    SE vetor[pai] < vetor[filho] ENTÃO', '    IF array[parent] < array[child] THEN'),
  tr('      RETORNE falso', '      RETURN false'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM PARA', '  END FOR'),
  tr('  RETORNE verdadeiro', '  RETURN true'),
  tr('FIM', 'END'),
];

// As funções juntas, com uma linha em branco entre elas. Cada simulador mostra só as que usa, e
// `offsets` diz onde cada uma começa no pseudocódigo exibido.
const FULL_CODE = [...HEAP_CODE, '', ...BUILD_CODE, '', ...SIFT_CODE, '', ...SWAP_CODE];
const FULL_OFFSETS = {
  heap: 0,
  build: HEAP_CODE.length + 1,
  sift: HEAP_CODE.length + BUILD_CODE.length + 2,
  swap: HEAP_CODE.length + BUILD_CODE.length + SIFT_CODE.length + 3,
};

const BUILD_ONLY_CODE = [...BUILD_CODE, '', ...SIFT_CODE, '', ...SWAP_CODE];
const BUILD_ONLY_OFFSETS = { build: 0, sift: BUILD_CODE.length + 1, swap: BUILD_CODE.length + SIFT_CODE.length + 2 };

const SIFT_ONLY_CODE = [...SIFT_CODE, '', ...SWAP_CODE];
const SIFT_ONLY_OFFSETS = { sift: 0, swap: SIFT_CODE.length + 1 };

// Linhas de cada função (base 0).
const H = { call: 1, fim: 2, loop: 3, swap: 4, dec: 5, sift: 6, end: 8 };
const B = { init: 1, loop: 2, call: 3, dec: 4, end: 6 };
const S = {
  raiz: 1, loop: 2, filho: 3, trocar: 4, testLeft: 5, setLeft: 6, testRight: 8, setRight: 9, testSame: 11, stop: 12, swap: 14, move: 15, end: 18,
};
const W = { save: 1, copy: 2, put: 3 };
const C = { head: 0, loop: 1, pai: 2, test: 3, no: 4, yes: 7 };

export const algorithms = [
  {
    id: 'heap', title: tr('O heap binário', 'The binary heap'), menuLabel: tr('O heap binário', 'The binary heap'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Um heap é uma árvore binária completa guardada em um vetor: a raiz fica na posição 0 e os filhos da posição i ficam em 2i + 1 e 2i + 2. No max-heap, todo pai é maior ou igual aos seus filhos.', 'A heap is a complete binary tree stored in an array: the root is at position 0 and the children of position i are at 2i + 1 and 2i + 2. In a max-heap, every parent is greater than or equal to its children.'),
    interaction: tr('Clique em uma célula para ver o pai e os filhos dela. Depois confira, nó por nó, se o vetor já é um max-heap: um único pai menor que um filho já quebra a regra.', 'Click a cell to see its parent and children. Then check, node by node, whether the array is already a max-heap: a single parent smaller than a child already breaks the rule.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('A conferência compara cada nó, a partir da posição 1, com o pai dele: n − 1 comparações no pior caso. Só existem as variáveis filho e pai além do vetor.', 'The check compares each node, from position 1, with its parent: n − 1 comparisons in the worst case. There are only the variables child and parent besides the array.') },
    pseudocode: CHECK_CODE,
  },
  {
    id: 'sift', title: tr('ArrumaHeap', 'heapify'), menuLabel: tr('ArrumaHeap', 'heapify'), group: tr('Como funciona', 'How it works'), number: '02',
    description: tr('Desça o valor de um nó pela árvore: compare-o com os dois filhos, troque com o maior se algum for maior que ele e repita um nível abaixo, até o valor encontrar o lugar certo.', 'Sink the value of a node down the tree: compare it with the two children, swap with the larger one if either is larger than it and repeat one level below, until the value finds its right place.'),
    interaction: tr('Escolha o nó inicial e o fim do heap, ou clique em uma célula para fazer dela o início. ArrumaHeap só dá certo quando as duas subárvores do nó já são heaps, como acontece com o último pai.', 'Choose the starting node and the end of the heap, or click a cell to make it the start. heapify only works when the two subtrees of the node are already heaps, as happens with the last parent.'),
    complexity: { time: 'O(log n)', space: 'O(1)', note: tr('Cada volta do laço desce um nível da árvore, e um heap de n elementos tem ⌊log₂ n⌋ + 1 níveis: no máximo ⌊log₂ n⌋ voltas, com 2 comparações cada. Só existem raiz, filho, trocar e temp além do vetor.', 'Each turn of the loop goes down one level of the tree, and a heap of n elements has ⌊log₂ n⌋ + 1 levels: at most ⌊log₂ n⌋ turns, with 2 comparisons each. There are only root, child, largest and temp besides the array.') },
    pseudocode: SIFT_ONLY_CODE,
  },
  {
    id: 'build', title: tr('CriaHeap', 'buildHeap'), menuLabel: tr('CriaHeap', 'buildHeap'), group: tr('Como funciona', 'How it works'), number: '03',
    description: tr('Transforme o vetor em um max-heap ajustando cada pai com ArrumaHeap, do último pai até a raiz. Os nós depois do último pai são folhas, e uma folha sozinha já é um heap.', 'Turn the array into a max-heap by adjusting each parent with heapify, from the last parent to the root. The nodes after the last parent are leaves, and a lone leaf is already a heap.'),
    interaction: tr('Acompanhe inicio recuando da última posição de pai até a raiz. Cada pai só é ajustado depois de os pais abaixo dele estarem prontos, e no fim o maior valor está na posição 0.', 'Follow start moving back from the last parent position to the root. Each parent is only adjusted after the parents below it are ready, and at the end the largest value is at position 0.'),
    complexity: { time: 'O(n log n)', space: 'O(1)', note: tr('São cerca de n / 2 chamadas de ArrumaHeap e cada uma custa no máximo log n (a altura do heap), então n log n é um limite seguro. Uma análise mais cuidadosa mostra que a maioria dos pais está perto das folhas e desce pouco, e que CriaHeap sozinho é O(n).', 'There are about n / 2 calls of heapify and each one costs at most log n (the height of the heap), so n log n is a safe bound. A more careful analysis shows that most parents are near the leaves and sink only a little, and that buildHeap alone is O(n).') },
    pseudocode: BUILD_ONLY_CODE,
  },
  {
    id: 'heap-sort', title: tr('Heapsort', 'Heapsort'), menuLabel: tr('Heapsort', 'Heapsort'), group: tr('Como funciona', 'How it works'), number: '04',
    description: tr('Crie um max-heap, troque a raiz (o maior valor) com o último elemento do heap, tire esse elemento do heap e conserte o resto. Repita até sobrar um só elemento.', 'Build a max-heap, swap the root (the largest value) with the last element of the heap, take that element out of the heap and fix the rest. Repeat until only one element is left.'),
    interaction: tr('Acompanhe a pilha de chamadas e o heap na árvore. O que está em verde saiu do heap e já está na posição final, da direita para a esquerda.', 'Follow the call stack and the heap in the tree. What is in green left the heap and is already in its final position, from right to left.'),
    complexity: { time: 'O(n log n)', space: 'O(1)', note: tr('CriaHeap custa n log n no máximo e o laço faz n − 1 extrações, cada uma com um ArrumaHeap de no máximo log n voltas: n log n no total. Tudo acontece no próprio vetor, sem cópias, por isso o espaço extra é constante.', 'buildHeap costs at most n log n and the loop makes n − 1 extractions, each with a heapify of at most log n turns: n log n in total. Everything happens in the array itself, with no copies, so the extra space is constant.') },
    pseudocode: FULL_CODE,
  },
  {
    id: 'counting', title: tr('Contando as operações', 'Counting the operations'), menuLabel: tr('Complexidade de tempo', 'Time complexity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '05',
    description: tr('Conte as voltas do laço de cada ArrumaHeap e veja por que o total é da ordem de n · log₂ n: são cerca de 1,5 n chamadas e cada uma desce, no máximo, a altura do heap.', 'Count the loop turns of each heapify and see why the total is of the order of n · log₂ n: there are about 1.5 n calls and each one goes down, at most, the height of the heap.'),
    interaction: tr('Gere vetores de tamanhos diferentes: a altura do heap só cresce de um em um quando n dobra. O custo de cada chamada nunca passa de ⌊log₂ n⌋ voltas.', 'Generate arrays of different sizes: the height of the heap only grows one at a time when n doubles. The cost of each call never exceeds ⌊log₂ n⌋ turns.'),
    complexity: { time: 'O(n log n)', space: 'O(1)', note: tr('ArrumaHeap tem no máximo ⌊log₂ n⌋ voltas. CriaHeap o chama cerca de n / 2 vezes e o laço do heapsort, n − 1 vezes: n log n de cada lado, e o total continua sendo O(n log n). Não existe melhor nem pior caso: o tempo é sempre da mesma ordem.', 'heapify has at most ⌊log₂ n⌋ turns. buildHeap calls it about n / 2 times and the heapsort loop, n − 1 times: n log n on each side, and the total is still O(n log n). There is no best or worst case: the time is always of the same order.') },
    pseudocode: FULL_CODE,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '06',
    description: tr('Execute o algoritmo em quatro vetores com os mesmos valores em ordens diferentes e compare os contadores: aqui a ordem inicial quase não muda o custo.', 'Run the algorithm on four arrays with the same values in different orders and compare the counters: here the initial order barely changes the cost.'),
    interaction: tr('Avance ArrumaHeap por ArrumaHeap e compare as comparações dos quatro vetores. O vetor já ordenado não tem nenhuma vantagem.', 'Step through heapify by heapify and compare the comparisons of the four arrays. The already sorted array has no advantage.'),
    complexity: { time: 'O(n log n)', space: 'O(1)', note: tr('O heapsort sempre cria o heap e extrai todos os elementos, qualquer que seja a ordem inicial, e cada extração desce um valor pequeno da raiz até perto das folhas. Ele não aproveita a ordem que já existe: não é adaptável.', 'Heapsort always builds the heap and extracts all the elements, whatever the initial order, and each extraction sinks a small value from the root to near the leaves. It does not take advantage of the order that already exists: it is not adaptive.') },
    pseudocode: FULL_CODE,
  },
  {
    id: 'stability', title: tr('Estabilidade', 'Stability'), menuLabel: tr('Estabilidade', 'Stability'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '07',
    description: tr('Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.', 'Repeated values get a letter that marks the original order. See whether the algorithm preserves that order.'),
    interaction: tr('Use "Gerar exemplo" para criar um vetor com valores repetidos e veja quais trocas invertem a ordem de dois iguais. A troca da raiz com o último elemento é a principal suspeita.', 'Use "Generate example" to create an array with repeated values and see which swaps reverse the order of two equals. The swap of the root with the last element is the main suspect.'),
    complexity: { time: 'O(n log n)', space: 'O(1)', note: tr('As trocas ligam posições distantes do vetor: swap(vetor, 0, fim) leva um valor do fim para a raiz e outro da raiz para o fim, por cima de tudo o que há no meio, e ArrumaHeap desce valores pela árvore. Dois iguais podem inverter a ordem, então o Heapsort é instável.', 'The swaps link distant positions of the array: swap(array, 0, end) takes a value from the end to the root and another from the root to the end, over everything in between, and heapify sinks values down the tree. Two equals can reverse their order, so Heapsort is unstable.') },
    pseudocode: FULL_CODE,
  },
];

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const vec = (items) => `[${items.map(label).join(', ')}]`;
const copyItems = (items) => items.map((item) => ({ ...item }));
const heightOf = (n) => Math.floor(Math.log2(Math.max(1, n))) + 1;
const lastParent = (n) => Math.max(0, Math.floor((n - 2) / 2));

/** O vetor com o heap à esquerda e a parte já ordenada à direita, separadas por uma barra. */
const heapVec = (items, sortedFrom) => `[${items.slice(0, sortedFrom).map(label).join(', ')}${sortedFrom < items.length ? `${sortedFrom > 0 ? ' ' : ''}| ${items.slice(sortedFrom).map(label).join(', ')}` : ''}]`;

// ---------------------------------------------------------------------------
// Execução sem passos: o mesmo algoritmo, para as simulações de análise, para conferir o depurador
// e para montar os exemplos. Cada chamada de ArrumaHeap devolve o intervalo, as voltas do laço, as
// comparações, as trocas, onde o valor da raiz parou e o vetor antes e depois.
// ---------------------------------------------------------------------------

/** ArrumaHeap da aula sobre `a` (itens `{ v, tag }`): devolve as voltas, as comparações, as trocas e onde a raiz parou. */
function siftItems(a, inicio, fim) {
  let raiz = inicio;
  let loops = 0;
  let comparisons = 0;
  let swaps = 0;
  while (raiz * 2 + 1 <= fim) {
    loops += 1;
    const filho = raiz * 2 + 1;
    let trocar = raiz;
    comparisons += 1;
    if (a[trocar].v < a[filho].v) trocar = filho;
    if (filho + 1 <= fim) {
      comparisons += 1;
      if (a[trocar].v < a[filho + 1].v) trocar = filho + 1;
    }
    if (trocar === raiz) break;
    [a[raiz], a[trocar]] = [a[trocar], a[raiz]];
    swaps += 1;
    raiz = trocar;
  }
  return {
    loops, comparisons, swaps, landing: raiz,
  };
}

/**
 * Todas as chamadas de ArrumaHeap do Heapsort, na ordem em que acontecem: as de CriaHeap (`build`) e
 * as de cada extração (`extract`), que também têm a troca da raiz com o último elemento (`rootSwap`).
 * `swapped` é o vetor logo depois dessa troca e `sorted` é a primeira posição já ordenada.
 */
function runCalls(items) {
  const a = copyItems(items);
  const n = a.length;
  const calls = [];

  for (let inicio = Math.floor((n - 1) / 2); inicio >= 0; inicio -= 1) {
    const before = copyItems(a);
    const result = siftItems(a, inicio, n - 1);
    calls.push({
      phase: 'build', inicio, fim: n - 1, rootSwap: false, sorted: n, ...result, before, swapped: before, after: copyItems(a),
    });
  }

  let fim = n - 1;
  while (fim > 0) {
    const before = copyItems(a);
    [a[0], a[fim]] = [a[fim], a[0]];
    const swapped = copyItems(a);
    fim -= 1;
    const result = siftItems(a, 0, fim);
    calls.push({
      phase: 'extract', inicio: 0, fim, rootSwap: true, sorted: fim + 1, ...result, before, swapped, after: copyItems(a),
    });
  }
  return { calls, final: a };
}

const totalOf = (calls, key) => calls.reduce((sum, call) => sum + call[key], 0);
const swapsOf = (call) => call.swaps + (call.rootSwap ? 1 : 0);

/** Posições cujo valor mudou entre `before` e `after`. */
const changedBetween = (before, after) => range(after.length).filter((index) => before[index] !== after[index]);

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

/** Vetor com valores repetidos em que o Heapsort realmente inverte a ordem de dois iguais. */
export function stabilityExample(count) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const values = withRepeats(count);
    if (!isStable(runCalls(tagDuplicates(values)).final)) return values;
  }
  return [18, 47, 47, 10, 33, 25, 61, 70, 12, 90].slice(0, Math.max(4, count));
}

/** A subárvore de `root`, dentro do trecho 0..`fim`, respeita a regra do max-heap? */
function isHeapAt(a, root, fim) {
  return [2 * root + 1, 2 * root + 2].every((child) => child > fim || (a[root].v >= a[child].v && isHeapAt(a, child, fim)));
}

/** O que dizer, ao fim de ArrumaHeap, sobre a subárvore do nó `inicio`. */
const subtreeNote = (a, inicio, fim) => (isHeapAt(a, inicio, fim)
  ? tr(`A subárvore do nó ${inicio} (dentro do trecho de 0 a ${fim}) voltou a ser um max-heap.`, `The subtree of node ${inicio} (within the range from 0 to ${fim}) is a max-heap again.`)
  : tr(`A subárvore do nó ${inicio} ainda não é um max-heap: ArrumaHeap só conserta o valor do nó, e as subárvores abaixo dele já precisavam ser heaps.`, `The subtree of node ${inicio} is not a max-heap yet: heapify only fixes the value of the node, and the subtrees below it already had to be heaps.`));

// ---------------------------------------------------------------------------
// Execução como num depurador: cada passo é a linha que acabou de executar, com a pilha de
// chamadas e as variáveis da chamada atual (cada chamada tem as suas).
// ---------------------------------------------------------------------------

/**
 * `offsets` diz onde cada função começa no pseudocódigo exibido (`heap`, `build`, `sift` e `swap`;
 * só as que aparecem no simulador). `step.sortedFrom` é a primeira posição já fora do heap.
 */
function createTracer(items, offsets) {
  const a = copyItems(items);
  const n = a.length;
  const steps = [];
  const frames = [];
  const counters = { comparisons: 0, swaps: 0, calls: 0 };
  const log = [];
  const state = { sortedFrom: n, limit: n - 1 };

  const compareOf = (left, op, right, result) => ({ left, op, right, result });
  const vtext = (index) => fmt(a[index].v);

  /** Os marcadores sobre o vetor: os da chamada que está executando. */
  function pointersOf(frame) {
    const vars = frame?.vars ?? {};
    const pointers = {};
    const set = (name, value) => { if (Number.isInteger(value)) pointers[name] = value; };
    switch (frame?.kind) {
      case 'heapsort':
        set('fim', vars.fim);
        break;
      case 'CriaHeap':
        set('inicio', vars.inicio);
        set('fim', vars.tamanho - 1);
        break;
      case 'ArrumaHeap':
        ['inicio', 'fim', 'raiz', 'filho', 'trocar'].forEach((name) => set(name, vars[name]));
        break;
      case 'swap':
        set('i', vars.i);
        set('j', vars.j);
        break;
      default:
        break;
    }
    return pointers;
  }

  function add(line, title, description, tone, extra = {}) {
    const { pointers: own = {}, ...rest } = extra;
    const frame = frames.at(-1);
    const vars = frame?.vars ?? {};
    const stats = { 'comparações': counters.comparisons, trocas: counters.swaps };
    if (frame?.kind === 'swap' && vars.temp !== NONE) stats.temp = fmt(vars.temp);
    const pointers = { ...pointersOf(frame), ...own };
    steps.push(step(valuesOf(a), line, title, description, tone, {
      stats,
      stack: frames.map((entry) => entry.label),
      variables: { ...vars },
      pointers,
      phase: frame ? { label: frame.label, text: typeof frame.phaseText === 'function' ? frame.phaseText() : frame.phaseText, code: true } : undefined,
      sortedFrom: state.sortedFrom,
      outsideIndices: range(n).filter((index) => index > state.limit && index < state.sortedFrom),
      output: clone(log),
      ...rest,
    }));
  }

  /** swap da aula: troca vetor[i] e vetor[j] com a variável temp. `settle` marca a posição que vira ordenada. */
  function swap(i, j, settle) {
    const frame = {
      kind: 'swap', label: tr(`swap(${i}, ${j})`, `swap(${i}, ${j})`), phaseText: tr('Troca dois valores', 'Swaps two values'), vars: { i, j, temp: NONE },
    };
    frames.push(frame);
    const both = i === j ? [i] : [i, j];
    frame.vars.temp = a[j].v;
    const saved = a[j];
    add(offsets.swap + W.save, tr('temp ← vetor[j]', 'temp ← array[j]'), tr(`temp recebe vetor[${j}] = ${label(saved)}: o valor de j é guardado antes de ser sobrescrito.`, `temp receives array[${j}] = ${label(saved)}: the value of j is saved before being overwritten.`), 'update', { comparedIndices: [j] });
    a[j] = a[i];
    add(offsets.swap + W.copy, tr('vetor[j] ← vetor[i]', 'array[j] ← array[i]'), tr(`vetor[${j}] recebe vetor[${i}] = ${label(a[j])}.`, `array[${j}] receives array[${i}] = ${label(a[j])}.`), 'update', { changedIndices: [j], comparedIndices: [i] });
    a[i] = saved;
    counters.swaps += 1;
    if (settle !== undefined) state.sortedFrom = settle;
    add(offsets.swap + W.put, tr('vetor[i] ← temp', 'array[i] ← temp'), tr(`vetor[${i}] recebe temp = ${label(saved)}: os dois valores trocaram de lugar.${settle === undefined ? '' : ` O maior valor (${label(a[settle])}) chegou à posição ${settle}, a definitiva, e sai do heap.`}`, `array[${i}] receives temp = ${label(saved)}: the two values swapped places.${settle === undefined ? '' : ` The largest value (${label(a[settle])}) reached position ${settle}, its final one, and leaves the heap.`}`), 'update', { changedIndices: both });
    frames.pop();
  }

  /** ArrumaHeap da aula sobre o trecho de `inicio` a `fim`: o valor de `inicio` desce até o lugar certo. */
  function siftDown(inicio, fim) {
    counters.calls += 1;
    const text = tr(`ArrumaHeap(${inicio}, ${fim})`, `heapify(${inicio}, ${fim})`);
    const frame = {
      kind: tr('ArrumaHeap', 'heapify'), label: text, phaseText: tr('Desce o valor da raiz até o lugar certo', 'Sinks the root value to the right place'), vars: {
        inicio, fim, raiz: NONE, filho: NONE, trocar: NONE,
      },
    };
    frames.push(frame);
    const { vars } = frame;
    const base = offsets.sift;
    const outerLimit = state.limit;
    state.limit = fim;
    const ring = () => ({ pivotIndex: vars.raiz });
    const winner = () => (vars.trocar !== NONE && vars.trocar !== vars.raiz ? { foundIndices: [vars.trocar] } : {});
    const marks = (extra = {}) => ({ ...ring(), ...winner(), ...extra });
    const cmp = (left, op, right, result) => ({ compare: compareOf(left, op, right, result) });

    let raiz = inicio;
    vars.raiz = raiz;
    add(base + S.raiz, tr('raiz ← inicio', 'root ← start'), tr(`raiz recebe inicio = ${inicio}: o nó cujo valor (${vtext(raiz)}) vai descer, se for preciso, até o lugar certo. ${2 * raiz + 1 <= fim ? 'As subárvores abaixo dele já devem ser heaps.' : `O nó ${raiz} não tem filhos dentro do trecho (de 0 a ${fim}), então não há o que ajustar.`}`, `root receives start = ${inicio}: the node whose value (${vtext(raiz)}) will sink, if needed, to the right place. ${2 * raiz + 1 <= fim ? 'The subtrees below it should already be heaps.' : `Node ${raiz} has no children within the range (from 0 to ${fim}), so there is nothing to adjust.`}`), 'update', marks());

    for (;;) {
      const child = raiz * 2 + 1;
      const hasChild = child <= fim;
      add(base + S.loop, tr('ENQUANTO raiz * 2 + 1 ≤ fim', 'WHILE root * 2 + 1 ≤ end'), hasChild
        ? tr(`${raiz} * 2 + 1 = ${child} ≤ ${fim} é verdadeiro: o nó ${raiz} tem pelo menos um filho dentro do heap (o da esquerda, na posição ${child}), então ainda há o que comparar.`, `${raiz} * 2 + 1 = ${child} ≤ ${fim} is true: node ${raiz} has at least one child within the heap (the left one, at position ${child}), so there is still something to compare.`)
        : tr(`${raiz} * 2 + 1 = ${child} ≤ ${fim} é falso: o nó ${raiz} não tem filhos dentro do heap (é uma folha ou os filhos estão além de fim), então o valor ${vtext(raiz)} já está no lugar.`, `${raiz} * 2 + 1 = ${child} ≤ ${fim} is false: node ${raiz} has no children within the heap (it is a leaf or its children are beyond end), so the value ${vtext(raiz)} is already in place.`), hasChild ? 'comparison' : 'success', marks(cmp({ label: tr('raiz * 2 + 1', 'root * 2 + 1'), value: String(child) }, '≤', { label: tr('fim', 'end'), value: String(fim) }, hasChild)));
      if (!hasChild) break;

      const filho = child;
      vars.filho = filho;
      add(base + S.filho, tr('filho ← raiz * 2 + 1', 'child ← root * 2 + 1'), tr(`filho recebe ${raiz} * 2 + 1 = ${filho}: a posição do filho da esquerda de ${raiz} (valor ${vtext(filho)}).`, `child receives ${raiz} * 2 + 1 = ${filho}: the position of the left child of ${raiz} (value ${vtext(filho)}).`), 'update', marks());

      let trocar = raiz;
      vars.trocar = trocar;
      add(base + S.trocar, tr('trocar ← raiz', 'largest ← root'), tr(`trocar começa com raiz = ${raiz}: o candidato a maior valor entre o nó e os filhos é, por enquanto, o próprio nó (${vtext(raiz)}).`, `largest starts with root = ${raiz}: the candidate for the largest value among the node and its children is, for now, the node itself (${vtext(raiz)}).`), 'update', marks());

      counters.comparisons += 1;
      const leftBigger = a[trocar].v < a[filho].v;
      add(base + S.testLeft, tr('SE vetor[trocar] < vetor[filho]', 'IF array[largest] < array[child]'), tr(`${vtext(trocar)} < ${vtext(filho)} é ${leftBigger ? 'verdadeiro' : 'falso'}. ${leftBigger
        ? 'O filho da esquerda é maior que o nó: ele passa a ser o candidato a subir.'
        : 'O nó continua sendo maior ou igual ao filho da esquerda.'}`, `${vtext(trocar)} < ${vtext(filho)} is ${leftBigger ? 'true' : 'false'}. ${leftBigger ? 'The left child is larger than the node: it becomes the candidate to go up.' : 'The node is still greater than or equal to the left child.'}`), 'comparison', marks({
        comparedIndices: [filho],
        ...cmp({ label: tr('vetor[trocar]', 'array[largest]'), value: vtext(trocar) }, '<', { label: tr('vetor[filho]', 'array[child]'), value: vtext(filho) }, leftBigger),
      }));
      if (leftBigger) {
        trocar = filho;
        vars.trocar = trocar;
        add(base + S.setLeft, tr('trocar ← filho', 'largest ← child'), tr(`trocar recebe filho = ${filho}: o maior valor até agora é ${vtext(trocar)}.`, `largest receives child = ${filho}: the largest value so far is ${vtext(trocar)}.`), 'update', marks());
      }

      const hasRight = filho + 1 <= fim;
      let rightBigger = false;
      let rightStat = cmp({ label: tr('filho + 1', 'child + 1'), value: String(filho + 1) }, '≤', { label: tr('fim', 'end'), value: String(fim) }, false);
      if (hasRight) {
        counters.comparisons += 1;
        rightBigger = a[trocar].v < a[filho + 1].v;
        rightStat = cmp({ label: tr('vetor[trocar]', 'array[largest]'), value: vtext(trocar) }, '<', { label: tr('vetor[filho + 1]', 'array[child + 1]'), value: vtext(filho + 1) }, rightBigger);
      }
      add(base + S.testRight, tr('SE filho + 1 ≤ fim E vetor[trocar] < vetor[filho + 1]', 'IF child + 1 ≤ end AND array[largest] < array[child + 1]'), !hasRight
        ? tr(`${filho} + 1 = ${filho + 1} ≤ ${fim} é falso: não existe filho da direita dentro do heap, e a segunda condição nem chega a ser testada.`, `${filho} + 1 = ${filho + 1} ≤ ${fim} is false: there is no right child within the heap, and the second condition is not even tested.`)
        : tr(`${filho} + 1 = ${filho + 1} ≤ ${fim} é verdadeiro, então o filho da direita existe, e ${vtext(trocar)} < ${vtext(filho + 1)} é ${rightBigger ? 'verdadeiro' : 'falso'}. ${rightBigger
          ? 'O filho da direita é maior que o candidato atual: ele passa a ser o candidato a subir.'
          : 'O candidato atual continua sendo o maior.'}`, `${filho} + 1 = ${filho + 1} ≤ ${fim} is true, so the right child exists, and ${vtext(trocar)} < ${vtext(filho + 1)} is ${rightBigger ? 'true' : 'false'}. ${rightBigger ? 'The right child is larger than the current candidate: it becomes the candidate to go up.' : 'The current candidate is still the largest.'}`), 'comparison', marks({ comparedIndices: hasRight ? [filho + 1] : [], ...rightStat }));
      if (rightBigger) {
        trocar = filho + 1;
        vars.trocar = trocar;
        add(base + S.setRight, tr('trocar ← filho + 1', 'largest ← child + 1'), tr(`trocar recebe filho + 1 = ${filho + 1}: o filho da direita (${vtext(trocar)}) é o maior dos três valores.`, `largest receives child + 1 = ${filho + 1}: the right child (${vtext(trocar)}) is the largest of the three values.`), 'update', marks());
      }

      const same = trocar === raiz;
      add(base + S.testSame, tr('SE trocar = raiz', 'IF largest = root'), same
        ? tr(`trocar = raiz (${trocar} = ${raiz}) é verdadeiro: nenhum filho é maior que o nó, então ${vtext(raiz)} já está no lugar certo.`, `largest = root (${trocar} = ${raiz}) is true: no child is larger than the node, so ${vtext(raiz)} is already in the right place.`)
        : tr(`trocar = raiz (${trocar} = ${raiz}) é falso: um dos filhos (${vtext(trocar)}) é maior que o nó (${vtext(raiz)}), então os dois precisam trocar de lugar.`, `largest = root (${trocar} = ${raiz}) is false: one of the children (${vtext(trocar)}) is larger than the node (${vtext(raiz)}), so the two have to swap places.`), 'comparison', marks(cmp({ label: 'trocar', value: String(trocar) }, '=', { label: 'raiz', value: String(raiz) }, same)));
      if (same) {
        add(base + S.stop, tr('TERMINA', 'BREAK'), tr(`TERMINA encerra o ArrumaHeap: o valor ${vtext(raiz)} é maior ou igual aos filhos e as subárvores abaixo já eram heaps, então nada mais muda.`, `BREAK ends heapify: the value ${vtext(raiz)} is greater than or equal to the children and the subtrees below were already heaps, so nothing else changes.`), 'success', marks());
        break;
      }

      add(base + S.swap, tr('swap(vetor, raiz, trocar)', 'swap(array, root, largest)'), tr(`Chama swap para trocar vetor[${raiz}] = ${vtext(raiz)} com o filho vetor[${trocar}] = ${vtext(trocar)}: o maior valor sobe um nível e o menor desce.`, `Calls swap to swap array[${raiz}] = ${vtext(raiz)} with the child array[${trocar}] = ${vtext(trocar)}: the larger value goes up a level and the smaller goes down.`), 'neutral', marks());
      swap(raiz, trocar);
      raiz = trocar;
      vars.raiz = raiz;
      add(base + S.move, tr('raiz ← trocar', 'root ← largest'), tr(`raiz recebe trocar = ${raiz}: o valor ${vtext(raiz)} desceu para essa posição, e o laço verifica se ele ainda tem filhos maiores.`, `root receives largest = ${raiz}: the value ${vtext(raiz)} sank to that position, and the loop checks whether it still has larger children.`), 'update', marks({ changedIndices: [raiz] }));
    }

    add(base + S.end, tr(`ArrumaHeap(${inicio}, ${fim}) termina`, `heapify(${inicio}, ${fim}) ends`), tr(`ArrumaHeap voltou para quem o chamou. ${subtreeNote(a, inicio, fim)}`, `heapify returned to its caller. ${subtreeNote(a, inicio, fim)}`), 'success');
    state.limit = outerLimit;
    frames.pop();
  }

  /** CriaHeap da aula: conserta cada pai, do último até a raiz. */
  function buildHeap(tamanho) {
    const text = tr(`CriaHeap(${tamanho})`, `buildHeap(${tamanho})`);
    const frame = {
      kind: tr('CriaHeap', 'buildHeap'), label: text, phaseText: tr('Conserta cada pai, do último até a raiz', 'Fixes each parent, from the last one to the root'), vars: { tamanho, inicio: NONE },
    };
    frames.push(frame);
    const { vars } = frame;
    const base = offsets.build;
    const start = counters.comparisons;
    const startSwaps = counters.swaps;
    const startCalls = counters.calls;

    let inicio = Math.floor((tamanho - 1) / 2);
    const first = inicio;
    vars.inicio = inicio;
    const leaf = 2 * inicio + 1 > tamanho - 1;
    add(base + B.init, tr('inicio ← (tamanho - 1) / 2', 'start ← (size - 1) / 2'), tr(`inicio recebe (${tamanho} - 1) / 2 = ${inicio} (divisão inteira): a posição do último pai. ${leaf
      ? `Como tamanho é ímpar, o nó ${inicio} não tem filhos: o primeiro ArrumaHeap termina sem trocar nada. `
      : ''}Os nós depois dele são folhas, e uma folha sozinha já é um heap; por isso o conserto começa aqui e anda para trás, até a raiz.`, `start receives (${tamanho} - 1) / 2 = ${inicio} (integer division): the position of the last parent. ${leaf ? `Since size is odd, node ${inicio} has no children: the first heapify ends without swapping anything. ` : ''}The nodes after it are leaves, and a lone leaf is already a heap; that is why the fixing starts here and moves backward, to the root.`), 'update');

    for (;;) {
      const goes = inicio >= 0;
      add(base + B.loop, tr('ENQUANTO inicio ≥ 0', 'WHILE start ≥ 0'), goes
        ? tr(`${inicio} ≥ 0 é verdadeiro: o nó ${inicio} (valor ${vtext(inicio)}) ainda não foi ajustado.`, `${inicio} ≥ 0 is true: node ${inicio} (value ${vtext(inicio)}) has not been adjusted yet.`)
        : tr(`${inicio} ≥ 0 é falso: já passamos da raiz (posição 0), então todos os pais foram ajustados e o vetor é um max-heap.`, `${inicio} ≥ 0 is false: we went past the root (position 0), so all the parents have been adjusted and the array is a max-heap.`), goes ? 'comparison' : 'success', {
        compare: compareOf({ label: tr('inicio', 'start'), value: String(inicio) }, '≥', { label: 'zero', value: '0' }, goes),
      });
      if (!goes) break;

      add(base + B.call, tr(`ArrumaHeap(vetor, ${inicio}, ${tamanho - 1})`, `heapify(array, ${inicio}, ${tamanho - 1})`), tr(`Chama ArrumaHeap para o nó ${inicio} (valor ${vtext(inicio)}), com fim = ${tamanho - 1}. ${inicio === first
        ? (leaf ? 'Esse nó é uma folha, então não há o que ajustar.' : 'Os filhos desse nó são folhas, e uma folha sozinha já é um heap: só o valor dele pode estar fora do lugar.')
        : 'Os pais abaixo dele já foram ajustados, então as subárvores desse nó já são heaps e só o valor dele pode estar fora do lugar.'}`, `Calls heapify for node ${inicio} (value ${vtext(inicio)}), with end = ${tamanho - 1}. ${inicio === first ? (leaf ? 'That node is a leaf, so there is nothing to adjust.' : 'The children of that node are leaves, and a lone leaf is already a heap: only its value may be out of place.') : 'The parents below it have already been adjusted, so the subtrees of that node are already heaps and only its value may be out of place.'}`), 'neutral');
      siftDown(inicio, tamanho - 1);
      log.push(tr(`Depois de ArrumaHeap(${inicio}, ${tamanho - 1}): ${vec(a)}`, `After heapify(${inicio}, ${tamanho - 1}): ${vec(a)}`));
      inicio -= 1;
      vars.inicio = inicio;
      add(base + B.dec, tr('inicio ← inicio - 1', 'start ← start - 1'), inicio >= 0
        ? tr(`inicio recua para ${inicio}: o pai anterior, agora com as duas subárvores já ajustadas.`, `start steps back to ${inicio}: the previous parent, now with both subtrees already adjusted.`)
        : tr(`inicio recua para ${inicio}: passou da raiz.`, `start steps back to ${inicio}: it went past the root.`), 'update');
    }

    add(base + B.end, tr(`CriaHeap(${tamanho}) termina`, `buildHeap(${tamanho}) ends`), tr(`O vetor é um max-heap: todo pai é maior ou igual aos filhos e o maior valor (${vtext(0)}) está na raiz, posição 0. Foram ${plural(counters.calls - startCalls, tr('chamada', 'call'), tr('chamadas', 'calls'))} de ArrumaHeap, ${plural(counters.comparisons - start, 'comparação', 'comparações')} e ${plural(counters.swaps - startSwaps, 'troca', 'trocas')}.`, `The array is a max-heap: every parent is greater than or equal to its children and the largest value (${vtext(0)}) is at the root, position 0. There were ${plural(counters.calls - startCalls, 'call', 'calls')} of heapify, ${plural(counters.comparisons - start, 'comparison', 'comparisons')} and ${plural(counters.swaps - startSwaps, 'swap', 'swaps')}.`), 'success');
    frames.pop();
  }

  /** heapsort da aula: cria o heap e extrai o maior valor, uma vez por posição. */
  function heapSort(tamanho) {
    const text = tr(`heapsort(${tamanho})`, `heapsort(${tamanho})`);
    const frame = {
      kind: 'heapsort', label: text, vars: { tamanho, fim: NONE },
    };
    frame.phaseText = () => (state.sortedFrom === n && frame.vars.fim === NONE ? tr('Fase 1 · cria o heap', 'Phase 1 · builds the heap') : tr('Fase 2 · extrai o maior valor de cada vez', 'Phase 2 · extracts the largest value one at a time'));
    frames.push(frame);
    const { vars } = frame;
    const base = offsets.heap;

    add(base + H.call, tr('CriaHeap(vetor, tamanho)', 'buildHeap(array, size)'), tr(`heapsort começa transformando o vetor inteiro (${plural(tamanho, tr('elemento', 'element'), tr('elementos', 'elements'))}) em um max-heap, com CriaHeap: depois dela o maior valor estará na posição 0.`, `heapsort starts by turning the whole array (${plural(tamanho, tr('elemento', 'element'), tr('elementos', 'elements'))}) into a max-heap, with buildHeap: after it the largest value will be at position 0.`), 'neutral');
    buildHeap(tamanho);
    log.push(tr(`Depois de CriaHeap: ${vec(a)}`, `After buildHeap: ${vec(a)}`));

    let fim = tamanho - 1;
    vars.fim = fim;
    add(base + H.fim, tr('fim ← tamanho - 1', 'end ← size - 1'), tr(`fim recebe tamanho - 1 = ${fim}: a última posição do heap, onde o maior valor vai ficar. Tudo o que estiver depois de fim já estará ordenado.`, `end receives size - 1 = ${fim}: the last position of the heap, where the largest value will stay. Everything after end will already be sorted.`), 'update');

    for (;;) {
      const goes = fim > 0;
      add(base + H.loop, tr('ENQUANTO fim > 0', 'WHILE end > 0'), goes
        ? tr(`${fim} > 0 é verdadeiro: o heap ainda tem mais de um elemento (as posições de 0 a ${fim}).`, `${fim} > 0 is true: the heap still has more than one element (positions 0 to ${fim}).`)
        : tr(`${fim} > 0 é falso: sobrou um só elemento no heap, o menor de todos, e ele já está na posição certa.`, `${fim} > 0 is false: a single element is left in the heap, the smallest of all, and it is already in the right position.`), goes ? 'comparison' : 'success', {
        compare: compareOf({ label: tr('fim', 'end'), value: String(fim) }, '>', { label: 'zero', value: '0' }, goes),
        ...(goes ? {} : { sortedFrom: 1 }),
      });
      if (!goes) break;

      add(base + H.swap, tr('swap(vetor, 0, fim)', 'swap(array, 0, end)'), tr(`Chama swap para trocar a raiz vetor[0] = ${vtext(0)} (o maior valor do heap) com vetor[${fim}] = ${vtext(fim)}, o último elemento do heap: o maior valor vai para a posição final.`, `Calls swap to swap the root array[0] = ${vtext(0)} (the largest value of the heap) with array[${fim}] = ${vtext(fim)}, the last element of the heap: the largest value goes to its final position.`), 'neutral');
      swap(0, fim, fim);

      fim -= 1;
      vars.fim = fim;
      add(base + H.dec, tr('fim ← fim - 1', 'end ← end - 1'), fim > 0
        ? tr(`fim recua para ${fim}: a posição ${fim + 1} já está ordenada e sai do heap, que agora vai de 0 a ${fim}. A raiz, porém, é o valor que veio do fim e provavelmente não é o maior do heap.`, `end steps back to ${fim}: position ${fim + 1} is already sorted and leaves the heap, which now goes from 0 to ${fim}. The root, however, is the value that came from the end and is probably not the largest of the heap.`)
        : tr(`fim recua para ${fim}: a posição ${fim + 1} já está ordenada e sai do heap, que fica só com a posição 0.`, `end steps back to ${fim}: position ${fim + 1} is already sorted and leaves the heap, which keeps only position 0.`), 'update');

      add(base + H.sift, tr('ArrumaHeap(vetor, 0, fim)', 'heapify(array, 0, end)'), fim > 0
        ? tr(`Chama ArrumaHeap para a raiz: o valor ${vtext(0)} desce até o lugar certo e o heap de 0 a ${fim} volta a ser um max-heap.`, `Calls heapify for the root: the value ${vtext(0)} sinks to the right place and the heap from 0 to ${fim} becomes a max-heap again.`)
        : tr(`Chama ArrumaHeap para a raiz, mas o heap só tem a posição 0: não há filhos, então nada vai mudar.`, `Calls heapify for the root, but the heap only has position 0: there are no children, so nothing will change.`), 'neutral');
      siftDown(0, fim);
      log.push(tr(`fim = ${fim}: ${heapVec(a, state.sortedFrom)}`, `end = ${fim}: ${heapVec(a, state.sortedFrom)}`));
    }

    state.sortedFrom = 0;
    const comparisonsTotal = counters.comparisons;
    log.push(tr(`Vetor ordenado: ${vec(a)}`, `Sorted array: ${vec(a)}`), tr(`Comparações: ${comparisonsTotal} · Trocas: ${counters.swaps}`, `Comparisons: ${comparisonsTotal} · Swaps: ${counters.swaps}`));
    add(base + H.end, tr('Ordenação concluída', 'Sort finished'), tr(`O vetor está em ordem crescente, depois de ${comparisonsTotal} comparações e ${counters.swaps} trocas. A cada volta o maior valor do heap foi parar na posição final, e o heap encolheu até sobrar um só elemento.`, `The array is in ascending order, after ${comparisonsTotal} comparisons and ${counters.swaps} swaps. On each turn the largest value of the heap ended up in its final position, and the heap shrank until a single element was left.`), 'done', { sortedFrom: 0 });
    frames.pop();
  }

  return {
    steps, a, counters, log, add, heapSort, buildHeap, siftDown, state,
  };
}

function heapSortSteps(items) {
  const tracer = createTracer(items, FULL_OFFSETS);
  tracer.heapSort(items.length);
  return tracer.steps;
}

/** CriaHeap sozinho, sobre o vetor inteiro. */
function buildHeapSteps(items) {
  const tracer = createTracer(items, BUILD_ONLY_OFFSETS);
  tracer.buildHeap(items.length);
  const { a, counters } = tracer;
  tracer.steps.push({
    ...tracer.steps.at(-1),
    title: tr('Heap pronto', 'Heap ready'),
    description: tr(`O vetor virou um max-heap: ${vec(a)}. O maior valor, ${label(a[0])}, está na raiz. O heapsort agora trocaria a raiz com o último elemento e ajustaria o resto. Foram ${counters.calls} chamadas de ArrumaHeap, ${counters.comparisons} comparações e ${counters.swaps} trocas.`, `The array became a max-heap: ${vec(a)}. The largest value, ${label(a[0])}, is at the root. Heapsort would now swap the root with the last element and adjust the rest. There were ${counters.calls} calls of heapify, ${counters.comparisons} comparisons and ${counters.swaps} swaps.`),
    tone: 'done',
    stack: [],
    output: [...tracer.log, tr(`Max-heap: ${vec(a)}`, `Max-heap: ${vec(a)}`)],
  });
  return tracer.steps;
}

/** ArrumaHeap sozinho, a partir de `config.inicio` até `config.fim`. */
function siftSteps(values, config) {
  const n = values.length;
  const inicio = Math.max(0, Math.min(n - 1, Number.isInteger(Number(config.inicio)) ? Number(config.inicio) : lastParent(n)));
  const fim = Math.max(inicio, Math.min(n - 1, Number.isInteger(Number(config.fim)) ? Number(config.fim) : n - 1));
  const tracer = createTracer(toItems(values), SIFT_ONLY_OFFSETS);
  tracer.siftDown(inicio, fim);
  const { a, counters, log } = tracer;
  log.push(tr(`Depois de ArrumaHeap(${inicio}, ${fim}): ${vec(a)}`, `After heapify(${inicio}, ${fim}): ${vec(a)}`));
  tracer.steps.push({
    ...tracer.steps.at(-1),
    title: tr('Ajuste concluído', 'Adjustment finished'),
    description: tr(`${counters.swaps ? `O valor do nó ${inicio} desceu ${plural(counters.swaps, tr('nível', 'level'), tr('níveis', 'levels'))}` : `O valor do nó ${inicio} já estava no lugar`}, com ${plural(counters.comparisons, 'comparação', 'comparações')} e ${plural(counters.swaps, 'troca', 'trocas')}: cada volta do laço desce um nível, e o heap de 0 a ${fim} tem ${plural(heightOf(fim + 1), tr('nível', 'level'), tr('níveis', 'levels'))}. ${subtreeNote(a, inicio, fim)} Por isso CriaHeap ajusta os pais do último até a raiz.`, `${counters.swaps ? `The value of node ${inicio} sank ${plural(counters.swaps, 'level', 'levels')}` : `The value of node ${inicio} was already in place`}, with ${plural(counters.comparisons, 'comparison', 'comparisons')} and ${plural(counters.swaps, 'swap', 'swaps')}: each turn of the loop goes down one level, and the heap from 0 to ${fim} has ${plural(heightOf(fim + 1), 'level', 'levels')}. ${subtreeNote(a, inicio, fim)} That is why buildHeap adjusts the parents from the last one to the root.`),
    tone: 'done',
    stack: [],
    output: [...log],
  });
  return tracer.steps;
}

// ---------------------------------------------------------------------------
// 01 · O heap binário: o vetor como árvore e a conferência da regra do max-heap
// ---------------------------------------------------------------------------

function checkSteps(values) {
  const n = values.length;
  const phase = { label: tr(`ehMaxHeap(${n})`, `isMaxHeap(${n})`), text: tr('Confere se todo pai é maior ou igual aos filhos', 'Checks whether every parent is greater than or equal to its children'), code: true };
  const steps = [];
  let comparisons = 0;
  const add = (line, title, description, tone, { variables = {}, ...extra } = {}) => steps.push(step(values, line, title, description, tone, {
    phase, stats: { 'comparações': comparisons }, variables: { tamanho: n, ...variables }, ...extra,
  }));
  const cmp = (pai, filho, result) => ({
    compare: {
      left: { label: tr('vetor[pai]', 'array[parent]'), value: fmt(values[pai]) }, op: '<', right: { label: tr('vetor[filho]', 'array[child]'), value: fmt(values[filho]) }, result, alarm: true,
    },
  });

  add(C.head, tr('O vetor como árvore', 'The array as a tree'), tr(`Este vetor de ${plural(n, tr('posição', 'position'), tr('posições', 'positions'))} é lido como uma árvore binária completa: a raiz é a posição 0, os filhos da posição i são 2i + 1 e 2i + 2, e o pai é (i − 1) / 2. Em um max-heap, cada pai é maior ou igual aos seus filhos. Clique em uma célula para ver o pai e os filhos dela, ou avance para conferir a regra nó por nó.`, `This array of ${plural(n, 'position', 'positions')} is read as a complete binary tree: the root is position 0, the children of position i are 2i + 1 and 2i + 2, and the parent is (i − 1) / 2. In a max-heap, each parent is greater than or equal to its children. Click a cell to see its parent and children, or step forward to check the rule node by node.`), 'neutral');

  for (let filho = 1; filho < n; filho += 1) {
    const pai = Math.floor((filho - 1) / 2);
    const vars = { filho };
    add(C.loop, tr('PARA filho de 1 até tamanho - 1', 'FOR child from 1 to size - 1'), tr(`filho = ${filho}: vamos conferir o nó ${filho} (valor ${fmt(values[filho])}).${filho === 1 ? ' A raiz, posição 0, não tem pai, por isso a conferência começa na posição 1.' : ''}`, `child = ${filho}: we will check node ${filho} (value ${fmt(values[filho])}).${filho === 1 ? ' The root, position 0, has no parent, so the check starts at position 1.' : ''}`), 'update', { pointers: { filho }, comparedIndices: [filho], variables: { filho, pai: NONE } });
    vars.pai = pai;
    add(C.pai, tr('pai ← (filho - 1) / 2', 'parent ← (child - 1) / 2'), tr(`pai recebe (${filho} - 1) / 2 = ${pai} (divisão inteira): o pai do nó ${filho} está na posição ${pai} e guarda o valor ${fmt(values[pai])}. Os filhos do nó ${pai} são ${2 * pai + 1}${2 * pai + 2 < n ? ` e ${2 * pai + 2}` : ''}.`, `parent receives (${filho} - 1) / 2 = ${pai} (integer division): the parent of node ${filho} is at position ${pai} and holds the value ${fmt(values[pai])}. The children of node ${pai} are ${2 * pai + 1}${2 * pai + 2 < n ? ` and ${2 * pai + 2}` : ''}.`), 'update', { pointers: { pai, filho }, pivotIndex: pai, comparedIndices: [filho], variables: vars });
    comparisons += 1;
    const broken = values[pai] < values[filho];
    add(C.test, tr('SE vetor[pai] < vetor[filho]', 'IF array[parent] < array[child]'), tr(`${fmt(values[pai])} < ${fmt(values[filho])} é ${broken ? 'verdadeiro' : 'falso'}. ${broken
      ? `O filho é maior que o pai: a regra do max-heap está quebrada na posição ${filho}.`
      : 'O pai é maior ou igual ao filho: a regra vale para este par.'}`, `${fmt(values[pai])} < ${fmt(values[filho])} is ${broken ? 'true' : 'false'}. ${broken ? `The child is larger than the parent: the max-heap rule is broken at position ${filho}.` : 'The parent is greater than or equal to the child: the rule holds for this pair.'}`), broken ? 'warning' : 'comparison', {
      pointers: { pai, filho }, pivotIndex: pai, comparedIndices: [filho], variables: vars, ...cmp(pai, filho, broken), ...(broken ? { warnIndices: [pai, filho] } : {}),
    });
    if (broken) {
      add(C.no, tr('RETORNE falso', 'RETURN false'), tr(`O vetor não é um max-heap: vetor[${pai}] = ${fmt(values[pai])} é menor que seu filho vetor[${filho}] = ${fmt(values[filho])}. Basta um par fora de ordem para a regra falhar. CriaHeap (simulador 03) conserta isso, ajustando cada pai do último até a raiz.`, `The array is not a max-heap: array[${pai}] = ${fmt(values[pai])} is smaller than its child array[${filho}] = ${fmt(values[filho])}. A single pair out of order is enough for the rule to fail. buildHeap (simulator 03) fixes that, adjusting each parent from the last one to the root.`), 'warning', {
        pointers: { pai, filho }, pivotIndex: pai, warnIndices: [pai, filho], variables: vars, output: [tr(`vetor[${pai}] = ${fmt(values[pai])} < vetor[${filho}] = ${fmt(values[filho])}`, `array[${pai}] = ${fmt(values[pai])} < array[${filho}] = ${fmt(values[filho])}`), tr('ehMaxHeap: falso', 'isMaxHeap: false')],
      });
      return steps;
    }
  }

  add(C.yes, tr('RETORNE verdadeiro', 'RETURN true'), tr(`Todos os ${n - 1} nós a partir da posição 1 são menores ou iguais aos pais: o vetor é um max-heap. O maior valor, ${fmt(Math.max(...values))}, está na raiz, posição 0, e é isso que o heapsort aproveita para ordenar.`, `All the ${n - 1} nodes from position 1 are smaller than or equal to their parents: the array is a max-heap. The largest value, ${fmt(Math.max(...values))}, is at the root, position 0, and that is what heapsort uses to sort.`), 'done', {
    variables: { tamanho: n }, output: [tr(`${comparisons} comparações`, `${comparisons} comparisons`), tr('ehMaxHeap: verdadeiro', 'isMaxHeap: true')],
  });
  return steps;
}

// ---------------------------------------------------------------------------
// 05 · Contando as operações: uma chamada de ArrumaHeap por passo
// ---------------------------------------------------------------------------

function countingSteps(values) {
  const n = values.length;
  const { calls } = runCalls(toItems(values));
  const levels = heightOf(n);
  const deepest = levels - 1;
  const total = calls.length;
  const asBuilt = calls.filter((call) => call.phase === 'build').length;
  const ofSorted = runCalls(toItems(ascending(values))).calls;
  const ofReversed = runCalls(toItems([...ascending(values)].reverse())).calls;
  const bars = calls.map((call) => ({
    label: tr(`Arruma(${call.inicio}, ${call.fim})`, `Heapify(${call.inicio}, ${call.fim})`), value: null, mark: '', current: false,
  }));
  let comparisons = 0;
  let swaps = 0;
  let done = 0;
  const bound = 2 * total * deepest;
  const chart = (final = false) => ({
    title: tr('Voltas do laço em cada ArrumaHeap', 'Loop turns in each heapify'),
    hint: tr(`máximo ${deepest} · ⇄ = trocas`, `maximum ${deepest} · ⇄ = swaps`),
    max: Math.max(1, deepest),
    bars: bars.map((bar) => ({ ...bar })),
    totals: [
      { label: tr('Comparações', 'Comparisons'), value: comparisons, note: tr(`limite: 2 · ${total} · ${deepest} = ${bound}`, `limit: 2 · ${total} · ${deepest} = ${bound}`) },
      { label: tr('Chamadas de ArrumaHeap', 'Calls of heapify'), value: done, note: final ? tr(`${asBuilt} em CriaHeap + ${total - asBuilt} extrações`, `${asBuilt} in buildHeap + ${total - asBuilt} extractions`) : tr(`esperadas: ${asBuilt} + ${total - asBuilt}`, `expected: ${asBuilt} + ${total - asBuilt}`) },
    ],
    final,
  });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, FULL_OFFSETS.heap, tr('Contando as operações', 'Counting the operations'), tr(`Um heap de ${plural(n, tr('elemento', 'element'), tr('elementos', 'elements'))} tem ${plural(levels, tr('nível', 'level'), tr('níveis', 'levels'))} (⌊log₂ ${n}⌋ + 1), então ArrumaHeap dá no máximo ${plural(deepest, tr('volta', 'turn'), tr('voltas', 'turns'))}: cada volta desce um nível. CriaHeap o chama ${asBuilt} vezes e o laço do heapsort, ${total - asBuilt}. Vamos somar as voltas de cada chamada.`, `A heap of ${plural(n, 'element', 'elements')} has ${plural(levels, 'level', 'levels')} (⌊log₂ ${n}⌋ + 1), so heapify makes at most ${plural(deepest, 'turn', 'turns')}: each turn goes down one level. buildHeap calls it ${asBuilt} times and the heapsort loop, ${total - asBuilt}. We will add up the turns of each call.`), 'neutral', common({ sortedFrom: n })),
  ];

  calls.forEach((call, index) => {
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += call.comparisons;
    swaps += swapsOf(call);
    done += 1;
    bars[index].value = call.loops;
    bars[index].mark = `⇄ ${swapsOf(call)}`;
    const where = call.phase === 'build' ? tr('CriaHeap', 'buildHeap') : 'heapsort';
    steps.push(step(valuesOf(call.after), FULL_OFFSETS.sift + S.loop, tr(`ArrumaHeap(${call.inicio}, ${call.fim})`, `heapify(${call.inicio}, ${call.fim})`), tr(`${where}${call.rootSwap ? ` trocou a raiz com a posição ${call.fim + 1} e` : ''} chamou ArrumaHeap para o nó ${call.inicio} do heap de 0 a ${call.fim}. O valor ${call.swaps === 0 ? 'já estava no lugar (o nó é uma folha ou é maior que os filhos)' : `desceu ${plural(call.swaps, tr('nível', 'level'), tr('níveis', 'levels'))}, parando na posição ${call.landing}`}: ${plural(call.loops, tr('volta', 'turn'), tr('voltas', 'turns'))} do laço, ${plural(call.comparisons, 'comparação', 'comparações')} e ${plural(call.swaps, 'troca', 'trocas')}${call.rootSwap ? ' (mais a da raiz)' : ''}. ${call.swaps === deepest && deepest > 0 ? 'É o máximo possível: o valor foi até o último nível.' : ''}`, `${where}${call.rootSwap ? ` swapped the root with position ${call.fim + 1} and` : ''} called heapify for node ${call.inicio} of the heap from 0 to ${call.fim}. The value ${call.swaps === 0 ? 'was already in place (the node is a leaf or is larger than its children)' : `sank ${plural(call.swaps, 'level', 'levels')}, stopping at position ${call.landing}`}: ${plural(call.loops, 'turn', 'turns')} of the loop, ${plural(call.comparisons, 'comparison', 'comparisons')} and ${plural(call.swaps, 'swap', 'swaps')}${call.rootSwap ? ' (plus the root one)' : ''}. ${call.swaps === deepest && deepest > 0 ? 'It is the maximum possible: the value went all the way to the last level.' : ''}`).trim(), 'comparison', common({
      sortedFrom: call.sorted,
      pointers: { inicio: call.inicio, fim: call.fim, raiz: call.landing },
      changedIndices: changedBetween(call.before, call.after),
      variables: { chamada: `${index + 1} / ${total}`, 'voltas desta': call.loops, 'comparações acumuladas': comparisons },
    })));
  });

  bars.forEach((bar) => { bar.current = false; });
  const costOf = (list) => totalOf(list, 'comparisons');
  steps.push(step(valuesOf(calls.length ? calls.at(-1).after : values), FULL_OFFSETS.heap + H.end, tr('Somando as chamadas', 'Adding up the calls'), tr(`${plural(total, tr('chamada', 'call'), tr('chamadas', 'calls'))} de ArrumaHeap e ${comparisons} comparações no total (${swaps} trocas). Nenhuma chamada passou de ${plural(deepest, tr('volta', 'turn'), tr('voltas', 'turns'))}, então o custo é no máximo ${total} · ${deepest} voltas: da ordem de n · log₂ n. Para os mesmos valores já ordenados são ${costOf(ofSorted)} comparações e em ordem inversa, ${costOf(ofReversed)}: o custo não depende da ordem.`, `${plural(total, 'call', 'calls')} of heapify and ${comparisons} comparisons in total (${swaps} swaps). No call went beyond ${plural(deepest, 'turn', 'turns')}, so the cost is at most ${total} · ${deepest} turns: of the order of n · log₂ n. For the same values already sorted there are ${costOf(ofSorted)} comparisons and in reverse order, ${costOf(ofReversed)}: the cost does not depend on the order.`), 'done', common({
    final: true,
    sortedFrom: 0,
    variables: {
      n, altura: levels, chamadas: total, 'comparações': comparisons, trocas: swaps,
    },
    output: [
      tr(`Chamadas de ArrumaHeap: ${total} (${asBuilt} + ${total - asBuilt})`, `Calls of heapify: ${total} (${asBuilt} + ${total - asBuilt})`),
      tr(`Comparações: ${comparisons} · Trocas: ${swaps}`, `Comparisons: ${comparisons} · Swaps: ${swaps}`),
      tr(`Mesmos valores já ordenados: ${costOf(ofSorted)} comparações`, `Same values already sorted: ${costOf(ofSorted)} comparisons`),
      tr(`Mesmos valores em ordem inversa: ${costOf(ofReversed)} comparações`, `Same values in reverse order: ${costOf(ofReversed)} comparisons`),
    ],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 06 · Adaptabilidade: o vetor ordenado, quase ordenado, invertido e o seu
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const inOrder = ascending(values);
  const almost = [...inOrder];
  [almost[n - 2], almost[n - 1]] = [almost[n - 1], almost[n - 2]];
  const scenarios = [
    { label: tr('Já ordenado', 'Already sorted'), values: inOrder },
    { label: tr('Quase ordenado', 'Almost sorted'), values: almost },
    { label: tr('Ordem inversa', 'Reverse order'), values: [...inOrder].reverse() },
    { label: tr('Seu vetor', 'Your array'), values: clone(values) },
  ].map((scenario) => ({
    ...scenario, ...runCalls(toItems(scenario.values)), comparisons: 0, swaps: 0, current: toItems(scenario.values), sorted: n,
  }));
  const rounds = scenarios[0].calls.length;

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, FULL_OFFSETS.heap, tr('Quatro vetores, os mesmos valores', 'Four arrays, the same values'), tr('O primeiro vetor já está ordenado, o segundo está quase ordenado (só os dois últimos trocados), o terceiro está em ordem inversa e o quarto é o seu vetor. O heapsort vai tratar os quatro do mesmo jeito? Cada passo executa uma chamada de ArrumaHeap em cada vetor.', 'The first array is already sorted, the second is almost sorted (only the last two swapped), the third is in reverse order and the fourth is your array. Will heapsort treat the four the same way? Each step runs one heapify call on each array.'), 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedFrom: n })),
    }),
  ];

  for (let index = 0; index < rounds; index += 1) {
    scenarios.forEach((scenario) => {
      const call = scenario.calls[index];
      scenario.comparisons += call.comparisons;
      scenario.swaps += swapsOf(call);
      scenario.current = call.after;
      scenario.sorted = call.sorted;
    });
    const first = scenarios[0].calls[index];
    const where = first.phase === 'build' ? tr(`CriaHeap: ArrumaHeap(${first.inicio}, ${first.fim})`, `buildHeap: heapify(${first.inicio}, ${first.fim})`) : tr(`extração ${index - scenarios[0].calls.filter((call) => call.phase === 'build').length + 1}: ArrumaHeap(0, ${first.fim})`, `extraction ${index - scenarios[0].calls.filter((call) => call.phase === 'build').length + 1}: heapify(0, ${first.fim})`);
    steps.push(step(values, FULL_OFFSETS.sift + S.loop, tr(`${index + 1}ª chamada de ArrumaHeap`, `heapify call ${index + 1}`), tr(`Cada vetor faz a sua ${index + 1}ª chamada (${where}). Comparações acumuladas: ${joined('comparisons')}. Os quatro seguem o mesmo roteiro e o custo de cada chamada depende só da altura do heap, não de a ordem inicial ser boa ou ruim.`, `Each array makes its call number ${index + 1} (${where}). Accumulated comparisons: ${joined('comparisons')}. The four follow the same script and the cost of each call depends only on the height of the heap, not on whether the initial order is good or bad.`), 'comparison', {
      rows: rows((scenario) => ({
        values: valuesOf(scenario.current),
        sortedFrom: scenario.sorted,
        changedIndices: changedBetween(scenario.calls[index].before, scenario.calls[index].after),
        markIndex: scenario.calls[index].landing,
      })),
      variables: { chamada: `${index + 1} / ${rounds}`, 'comparações': joined('comparisons'), trocas: joined('swaps') },
    }));
  }

  const costs = scenarios.map((scenario) => scenario.comparisons);
  const spread = Math.max(...costs) - Math.min(...costs);
  steps.push(step(values, FULL_OFFSETS.heap + H.end, tr('O custo quase não depende da ordem', 'The cost barely depends on the order'), tr(`Comparações: ${joined('comparisons')}; trocas: ${joined('swaps')}. A diferença entre o mais barato e o mais caro é de apenas ${plural(spread, 'comparação', 'comparações')}. O vetor já ordenado não tem vantagem: ele é desfeito pela criação do heap e depois reconstruído pelas extrações, como qualquer outro. O heapsort não é adaptável.`, `Comparisons: ${joined('comparisons')}; swaps: ${joined('swaps')}. The difference between the cheapest and the most expensive is only ${plural(spread, 'comparison', 'comparisons')}. The already sorted array has no advantage: it is undone by building the heap and then rebuilt by the extractions, like any other. Heapsort is not adaptive.`), 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.final), sortedFrom: 0 })),
    output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.comparisons} comparações, ${scenario.swaps} trocas`, `${scenario.label}: ${scenario.comparisons} comparisons, ${scenario.swaps} swaps`)),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 07 · Estabilidade: o que cada troca faz com os iguais
// ---------------------------------------------------------------------------

function stabilitySteps(values) {
  const n = values.length;
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const { calls, final } = runCalls(items);
  const log = [];
  let flipped = 0;

  const steps = [
    hasRepeated
      ? step(values, FULL_OFFSETS.heap, tr('Valores repetidos em destaque', 'Repeated values highlighted'), tr('Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética. Vamos ver, troca por troca, se algum par de iguais inverte a ordem.', 'Repeated values get a letter (a, b, …) that marks the order in which they appear. A stable algorithm ends with those letters in alphabetical order. We will see, swap by swap, whether any pair of equals reverses its order.'), 'neutral', { tags: tagsOf(items), sortedFrom: n })
      : step(values, FULL_OFFSETS.heap, tr('Não há valores repetidos', 'There are no repeated values'), tr('Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com valores repetidos.', 'Without repeated values there is no relative order to preserve. Use "Generate example" to create an array with repeated values.'), 'warning', { tags: tagsOf(items), sortedFrom: n }),
  ];

  /** Um passo para o vetor `after`, comparado com `before`: registra os pares de iguais que inverteram. */
  const report = (before, after, line, title, what, sortedFrom, pointers) => {
    const pairs = flippedPairs(before, after);
    const moved = pairs.flatMap(([x, y]) => [x, y]);
    const warnIndices = after.map((item, index) => (moved.some((m) => m.v === item.v && m.tag === item.tag) ? index : -1)).filter((index) => index >= 0);
    flipped += pairs.length;
    pairs.forEach(([x, y]) => log.push(tr(`${title}: ${label(y)} passou à frente de ${label(x)}`, `${title}: ${label(y)} went ahead of ${label(x)}`)));
    const noRepeat = !after.some((item) => item.tag);
    steps.push(step(valuesOf(after), line, title, pairs.length
      ? tr(`${what} ${pairs.map(([x, y]) => `${label(y)} passou à frente de ${label(x)}`).join('; ')}. Vetor: ${vec(after)}. ${pairs.length === 1 ? 'Esses dois iguais' : 'Esses pares de iguais'} não estão mais na ordem original: o valor foi levado para o outro lado de um igual.`, `${what} ${pairs.map(([x, y]) => `${label(y)} went ahead of ${label(x)}`).join('; ')}. Array: ${vec(after)}. ${pairs.length === 1 ? 'These two equals' : 'These pairs of equals'} are no longer in the original order: the value was carried to the other side of an equal.`)
      : `${what} ${noRepeat ? tr('Não há valores repetidos neste vetor.', 'There are no repeated values in this array.') : tr('Os iguais continuam na ordem original.', 'The equals stay in the original order.')}`, pairs.length ? 'warning' : 'comparison', {
      tags: tagsOf(after),
      sortedFrom,
      pointers,
      warnIndices,
      changedIndices: changedBetween(before, after),
      output: clone(log),
      variables: { 'pares invertidos': flipped },
    }));
  };

  calls.forEach((call) => {
    if (call.rootSwap) {
      report(call.before, call.swapped, FULL_OFFSETS.heap + H.swap, tr(`swap(0, ${call.fim + 1})`, `swap(0, ${call.fim + 1})`), tr(`swap troca a raiz com a posição ${call.fim + 1}, por cima de tudo o que há no meio.`, `swap swaps the root with position ${call.fim + 1}, over everything in between.`), call.fim + 1, { fim: call.fim + 1 });
    }
    const line = call.phase === 'build' ? FULL_OFFSETS.build + B.call : FULL_OFFSETS.heap + H.sift;
    report(call.swapped, call.after, line, tr(`ArrumaHeap(${call.inicio}, ${call.fim})`, `heapify(${call.inicio}, ${call.fim})`), call.swaps ? tr(`ArrumaHeap desceu o valor do nó ${call.inicio} por ${plural(call.swaps, tr('nível', 'level'), tr('níveis', 'levels'))}.`, `heapify sank the value of node ${call.inicio} by ${plural(call.swaps, 'level', 'levels')}.`) : tr(`ArrumaHeap não mexeu em nada: o valor do nó ${call.inicio} já estava no lugar.`, `heapify changed nothing: the value of node ${call.inicio} was already in place.`), call.sorted, { inicio: call.inicio, fim: call.fim });
  });

  const stable = isStable(final);
  steps.push(step(valuesOf(final), FULL_OFFSETS.heap + H.end, !hasRepeated ? tr('Resultado', 'Result') : stable ? tr('Resultado: ordem preservada neste vetor', 'Result: order preserved on this array') : tr('Resultado: instável', 'Result: unstable'), !hasRepeated
    ? tr('O vetor não tinha valores repetidos, então não há o que comparar.', 'The array had no repeated values, so there is nothing to compare.')
    : stable
      ? tr('Neste vetor a ordem dos iguais foi preservada, mas por acaso: o Heapsort não garante isso. Use "Gerar exemplo" para ver um vetor em que a ordem se inverte.', 'On this array the order of the equals was preserved, but by chance: Heapsort does not guarantee it. Use "Generate example" to see an array where the order is reversed.')
      : tr(`Ordem final: ${final.map(label).join(' ')}. Pelo menos um par de iguais trocou de ordem: o Heapsort é instável, porque as trocas ligam posições distantes e levam um valor para o outro lado de um igual.`, `Final order: ${final.map(label).join(' ')}. At least one pair of equals swapped order: Heapsort is unstable, because the swaps link distant positions and carry a value to the other side of an equal.`), !hasRepeated || stable ? 'done' : 'warning', {
    tags: tagsOf(final),
    sortedFrom: 0,
    output: [...log, tr(`Ordem final: ${final.map(label).join(' ')}`, `Final order: ${final.map(label).join(' ')}`), !hasRepeated ? tr('Sem valores repetidos.', 'No repeated values.') : stable ? tr('Ordem dos iguais preservada.', 'Order of the equals preserved.') : tr('Ordem dos iguais alterada.', 'Order of the equals changed.')],
  }));
  return steps;
}

export function buildSteps(id, values, config = {}) {
  switch (id) {
    case 'heap': return checkSteps(values);
    case 'sift': return siftSteps(values, config);
    case 'build': return buildHeapSteps(toItems(values));
    case 'heap-sort': return heapSortSteps(toItems(values));
    case 'counting': return countingSteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    case 'stability': return stabilitySteps(values);
    default: return heapSortSteps(toItems(values));
  }
}
