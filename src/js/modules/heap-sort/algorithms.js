import {
  NONE, ascending, clone, fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf, withRepeats,
} from '../shared/sort-steps.js';

// Pseudocódigo da aula (slides 87 a 90): heapsort cria o heap e, a cada volta, troca a raiz (o maior
// valor) com o último elemento do heap, encolhe o heap e o conserta; CriaHeap conserta cada pai, do
// último até a raiz; ArrumaHeap desce o valor de um nó até o lugar certo; swap troca dois valores.
const HEAP_CODE = [
  'FUNÇÃO heapsort(vetor, tamanho)',
  '  CriaHeap(vetor, tamanho)',
  '  fim ← tamanho - 1',
  '  ENQUANTO fim > 0 FAÇA',
  '    swap(vetor, 0, fim)',
  '    fim ← fim - 1',
  '    ArrumaHeap(vetor, 0, fim)',
  '  FIM ENQUANTO',
  'FIM',
];

const BUILD_CODE = [
  'FUNÇÃO CriaHeap(vetor, tamanho)',
  '  inicio ← (tamanho - 1) / 2',
  '  ENQUANTO inicio ≥ 0 FAÇA',
  '    ArrumaHeap(vetor, inicio, tamanho - 1)',
  '    inicio ← inicio - 1',
  '  FIM ENQUANTO',
  'FIM',
];

const SIFT_CODE = [
  'FUNÇÃO ArrumaHeap(vetor, inicio, fim)',
  '  raiz ← inicio',
  '  ENQUANTO raiz * 2 + 1 ≤ fim FAÇA',
  '    filho ← raiz * 2 + 1',
  '    trocar ← raiz',
  '    SE vetor[trocar] < vetor[filho] ENTÃO',
  '      trocar ← filho',
  '    FIM SE',
  '    SE filho + 1 ≤ fim E vetor[trocar] < vetor[filho + 1] ENTÃO',
  '      trocar ← filho + 1',
  '    FIM SE',
  '    SE trocar = raiz ENTÃO',
  '      TERMINA',
  '    SENÃO',
  '      swap(vetor, raiz, trocar)',
  '      raiz ← trocar',
  '    FIM SE',
  '  FIM ENQUANTO',
  'FIM',
];

const SWAP_CODE = [
  'FUNÇÃO swap(vetor, i, j)',
  '  temp ← vetor[j]',
  '  vetor[j] ← vetor[i]',
  '  vetor[i] ← temp',
  'FIM',
];

// Não está nos slides: a verificação que a aula descreve em palavras ("todo pai é maior ou igual
// aos filhos"), escrita com o pai de um nó na posição i, (i - 1) / 2.
const CHECK_CODE = [
  'FUNÇÃO ehMaxHeap(vetor, tamanho)',
  '  PARA filho de 1 até tamanho - 1 FAÇA',
  '    pai ← (filho - 1) / 2',
  '    SE vetor[pai] < vetor[filho] ENTÃO',
  '      RETORNE falso',
  '    FIM SE',
  '  FIM PARA',
  '  RETORNE verdadeiro',
  'FIM',
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
    id: 'heap', title: 'O heap binário', menuLabel: 'O heap binário', group: 'Como funciona', number: '01',
    description: 'Um heap é uma árvore binária completa guardada em um vetor: a raiz fica na posição 0 e os filhos da posição i ficam em 2i + 1 e 2i + 2. No max-heap, todo pai é maior ou igual aos seus filhos.',
    interaction: 'Clique em uma célula para ver o pai e os filhos dela. Depois confira, nó por nó, se o vetor já é um max-heap: um único pai menor que um filho já quebra a regra.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'A conferência compara cada nó, a partir da posição 1, com o pai dele: n − 1 comparações no pior caso. Só existem as variáveis filho e pai além do vetor.' },
    pseudocode: CHECK_CODE,
  },
  {
    id: 'sift', title: 'ArrumaHeap', menuLabel: 'ArrumaHeap', group: 'Como funciona', number: '02',
    description: 'Desça o valor de um nó pela árvore: compare-o com os dois filhos, troque com o maior se algum for maior que ele e repita um nível abaixo, até o valor encontrar o lugar certo.',
    interaction: 'Escolha o nó inicial e o fim do heap, ou clique em uma célula para fazer dela o início. ArrumaHeap só dá certo quando as duas subárvores do nó já são heaps, como acontece com o último pai.',
    complexity: { time: 'O(log n)', space: 'O(1)', note: 'Cada volta do laço desce um nível da árvore, e um heap de n elementos tem ⌊log₂ n⌋ + 1 níveis: no máximo ⌊log₂ n⌋ voltas, com 2 comparações cada. Só existem raiz, filho, trocar e temp além do vetor.' },
    pseudocode: SIFT_ONLY_CODE,
  },
  {
    id: 'build', title: 'CriaHeap', menuLabel: 'CriaHeap', group: 'Como funciona', number: '03',
    description: 'Transforme o vetor em um max-heap ajustando cada pai com ArrumaHeap, do último pai até a raiz. Os nós depois do último pai são folhas, e uma folha sozinha já é um heap.',
    interaction: 'Acompanhe inicio recuando da última posição de pai até a raiz. Cada pai só é ajustado depois de os pais abaixo dele estarem prontos, e no fim o maior valor está na posição 0.',
    complexity: { time: 'O(n log n)', space: 'O(1)', note: 'São cerca de n / 2 chamadas de ArrumaHeap e cada uma custa no máximo log n (a altura do heap), então n log n é um limite seguro. Uma análise mais cuidadosa mostra que a maioria dos pais está perto das folhas e desce pouco, e que CriaHeap sozinho é O(n).' },
    pseudocode: BUILD_ONLY_CODE,
  },
  {
    id: 'heap-sort', title: 'Heapsort', menuLabel: 'Heapsort', group: 'Como funciona', number: '04',
    description: 'Crie um max-heap, troque a raiz (o maior valor) com o último elemento do heap, tire esse elemento do heap e conserte o resto. Repita até sobrar um só elemento.',
    interaction: 'Acompanhe a pilha de chamadas e o heap na árvore. O que está em verde saiu do heap e já está na posição final, da direita para a esquerda.',
    complexity: { time: 'O(n log n)', space: 'O(1)', note: 'CriaHeap custa n log n no máximo e o laço faz n − 1 extrações, cada uma com um ArrumaHeap de no máximo log n voltas: n log n no total. Tudo acontece no próprio vetor, sem cópias, por isso o espaço extra é constante.' },
    pseudocode: FULL_CODE,
  },
  {
    id: 'counting', title: 'Contando as operações', menuLabel: 'Complexidade de tempo', group: 'Análise do algoritmo', number: '05',
    description: 'Conte as voltas do laço de cada ArrumaHeap e veja por que o total é da ordem de n · log₂ n: são cerca de 1,5 n chamadas e cada uma desce, no máximo, a altura do heap.',
    interaction: 'Gere vetores de tamanhos diferentes: a altura do heap só cresce de um em um quando n dobra. O custo de cada chamada nunca passa de ⌊log₂ n⌋ voltas.',
    complexity: { time: 'O(n log n)', space: 'O(1)', note: 'ArrumaHeap tem no máximo ⌊log₂ n⌋ voltas. CriaHeap o chama cerca de n / 2 vezes e o laço do heapsort, n − 1 vezes: n log n de cada lado, e o total continua sendo O(n log n). Não existe melhor nem pior caso: o tempo é sempre da mesma ordem.' },
    pseudocode: FULL_CODE,
  },
  {
    id: 'adaptability', title: 'Adaptabilidade', menuLabel: 'Adaptabilidade', group: 'Análise do algoritmo', number: '06',
    description: 'Execute o algoritmo em quatro vetores com os mesmos valores em ordens diferentes e compare os contadores: aqui a ordem inicial quase não muda o custo.',
    interaction: 'Avance ArrumaHeap por ArrumaHeap e compare as comparações dos quatro vetores. O vetor já ordenado não tem nenhuma vantagem.',
    complexity: { time: 'O(n log n)', space: 'O(1)', note: 'O heapsort sempre cria o heap e extrai todos os elementos, qualquer que seja a ordem inicial, e cada extração desce um valor pequeno da raiz até perto das folhas. Ele não aproveita a ordem que já existe: não é adaptável.' },
    pseudocode: FULL_CODE,
  },
  {
    id: 'stability', title: 'Estabilidade', menuLabel: 'Estabilidade', group: 'Análise do algoritmo', number: '07',
    description: 'Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.',
    interaction: 'Use "Gerar exemplo" para criar um vetor com valores repetidos e veja quais trocas invertem a ordem de dois iguais. A troca da raiz com o último elemento é a principal suspeita.',
    complexity: { time: 'O(n log n)', space: 'O(1)', note: 'As trocas ligam posições distantes do vetor: swap(vetor, 0, fim) leva um valor do fim para a raiz e outro da raiz para o fim, por cima de tudo o que há no meio, e ArrumaHeap desce valores pela árvore. Dois iguais podem inverter a ordem, então o Heapsort é instável.' },
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
  ? `A subárvore do nó ${inicio} (dentro do trecho de 0 a ${fim}) voltou a ser um max-heap.`
  : `A subárvore do nó ${inicio} ainda não é um max-heap: ArrumaHeap só conserta o valor do nó, e as subárvores abaixo dele já precisavam ser heaps.`);

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
      kind: 'swap', label: `swap(${i}, ${j})`, phaseText: 'Troca dois valores', vars: { i, j, temp: NONE },
    };
    frames.push(frame);
    const both = i === j ? [i] : [i, j];
    frame.vars.temp = a[j].v;
    const saved = a[j];
    add(offsets.swap + W.save, 'temp ← vetor[j]', `temp recebe vetor[${j}] = ${label(saved)}: o valor de j é guardado antes de ser sobrescrito.`, 'update', { comparedIndices: [j] });
    a[j] = a[i];
    add(offsets.swap + W.copy, 'vetor[j] ← vetor[i]', `vetor[${j}] recebe vetor[${i}] = ${label(a[j])}.`, 'update', { changedIndices: [j], comparedIndices: [i] });
    a[i] = saved;
    counters.swaps += 1;
    if (settle !== undefined) state.sortedFrom = settle;
    add(offsets.swap + W.put, 'vetor[i] ← temp', `vetor[${i}] recebe temp = ${label(saved)}: os dois valores trocaram de lugar.${settle === undefined ? '' : ` O maior valor (${label(a[settle])}) chegou à posição ${settle}, a definitiva, e sai do heap.`}`, 'update', { changedIndices: both });
    frames.pop();
  }

  /** ArrumaHeap da aula sobre o trecho de `inicio` a `fim`: o valor de `inicio` desce até o lugar certo. */
  function siftDown(inicio, fim) {
    counters.calls += 1;
    const text = `ArrumaHeap(${inicio}, ${fim})`;
    const frame = {
      kind: 'ArrumaHeap', label: text, phaseText: 'Desce o valor da raiz até o lugar certo', vars: {
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
    add(base + S.raiz, 'raiz ← inicio', `raiz recebe inicio = ${inicio}: o nó cujo valor (${vtext(raiz)}) vai descer, se for preciso, até o lugar certo. ${2 * raiz + 1 <= fim ? 'As subárvores abaixo dele já devem ser heaps.' : `O nó ${raiz} não tem filhos dentro do trecho (de 0 a ${fim}), então não há o que ajustar.`}`, 'update', marks());

    for (;;) {
      const child = raiz * 2 + 1;
      const hasChild = child <= fim;
      add(base + S.loop, 'ENQUANTO raiz * 2 + 1 ≤ fim', hasChild
        ? `${raiz} * 2 + 1 = ${child} ≤ ${fim} é verdadeiro: o nó ${raiz} tem pelo menos um filho dentro do heap (o da esquerda, na posição ${child}), então ainda há o que comparar.`
        : `${raiz} * 2 + 1 = ${child} ≤ ${fim} é falso: o nó ${raiz} não tem filhos dentro do heap (é uma folha ou os filhos estão além de fim), então o valor ${vtext(raiz)} já está no lugar.`, hasChild ? 'comparison' : 'success', marks(cmp({ label: 'raiz * 2 + 1', value: String(child) }, '≤', { label: 'fim', value: String(fim) }, hasChild)));
      if (!hasChild) break;

      const filho = child;
      vars.filho = filho;
      add(base + S.filho, 'filho ← raiz * 2 + 1', `filho recebe ${raiz} * 2 + 1 = ${filho}: a posição do filho da esquerda de ${raiz} (valor ${vtext(filho)}).`, 'update', marks());

      let trocar = raiz;
      vars.trocar = trocar;
      add(base + S.trocar, 'trocar ← raiz', `trocar começa com raiz = ${raiz}: o candidato a maior valor entre o nó e os filhos é, por enquanto, o próprio nó (${vtext(raiz)}).`, 'update', marks());

      counters.comparisons += 1;
      const leftBigger = a[trocar].v < a[filho].v;
      add(base + S.testLeft, 'SE vetor[trocar] < vetor[filho]', `${vtext(trocar)} < ${vtext(filho)} é ${leftBigger ? 'verdadeiro' : 'falso'}. ${leftBigger
        ? 'O filho da esquerda é maior que o nó: ele passa a ser o candidato a subir.'
        : 'O nó continua sendo maior ou igual ao filho da esquerda.'}`, 'comparison', marks({
        comparedIndices: [filho],
        ...cmp({ label: 'vetor[trocar]', value: vtext(trocar) }, '<', { label: 'vetor[filho]', value: vtext(filho) }, leftBigger),
      }));
      if (leftBigger) {
        trocar = filho;
        vars.trocar = trocar;
        add(base + S.setLeft, 'trocar ← filho', `trocar recebe filho = ${filho}: o maior valor até agora é ${vtext(trocar)}.`, 'update', marks());
      }

      const hasRight = filho + 1 <= fim;
      let rightBigger = false;
      let rightStat = cmp({ label: 'filho + 1', value: String(filho + 1) }, '≤', { label: 'fim', value: String(fim) }, false);
      if (hasRight) {
        counters.comparisons += 1;
        rightBigger = a[trocar].v < a[filho + 1].v;
        rightStat = cmp({ label: 'vetor[trocar]', value: vtext(trocar) }, '<', { label: 'vetor[filho + 1]', value: vtext(filho + 1) }, rightBigger);
      }
      add(base + S.testRight, 'SE filho + 1 ≤ fim E vetor[trocar] < vetor[filho + 1]', !hasRight
        ? `${filho} + 1 = ${filho + 1} ≤ ${fim} é falso: não existe filho da direita dentro do heap, e a segunda condição nem chega a ser testada.`
        : `${filho} + 1 = ${filho + 1} ≤ ${fim} é verdadeiro, então o filho da direita existe, e ${vtext(trocar)} < ${vtext(filho + 1)} é ${rightBigger ? 'verdadeiro' : 'falso'}. ${rightBigger
          ? 'O filho da direita é maior que o candidato atual: ele passa a ser o candidato a subir.'
          : 'O candidato atual continua sendo o maior.'}`, 'comparison', marks({ comparedIndices: hasRight ? [filho + 1] : [], ...rightStat }));
      if (rightBigger) {
        trocar = filho + 1;
        vars.trocar = trocar;
        add(base + S.setRight, 'trocar ← filho + 1', `trocar recebe filho + 1 = ${filho + 1}: o filho da direita (${vtext(trocar)}) é o maior dos três valores.`, 'update', marks());
      }

      const same = trocar === raiz;
      add(base + S.testSame, 'SE trocar = raiz', same
        ? `trocar = raiz (${trocar} = ${raiz}) é verdadeiro: nenhum filho é maior que o nó, então ${vtext(raiz)} já está no lugar certo.`
        : `trocar = raiz (${trocar} = ${raiz}) é falso: um dos filhos (${vtext(trocar)}) é maior que o nó (${vtext(raiz)}), então os dois precisam trocar de lugar.`, 'comparison', marks(cmp({ label: 'trocar', value: String(trocar) }, '=', { label: 'raiz', value: String(raiz) }, same)));
      if (same) {
        add(base + S.stop, 'TERMINA', `TERMINA encerra o ArrumaHeap: o valor ${vtext(raiz)} é maior ou igual aos filhos e as subárvores abaixo já eram heaps, então nada mais muda.`, 'success', marks());
        break;
      }

      add(base + S.swap, 'swap(vetor, raiz, trocar)', `Chama swap para trocar vetor[${raiz}] = ${vtext(raiz)} com o filho vetor[${trocar}] = ${vtext(trocar)}: o maior valor sobe um nível e o menor desce.`, 'neutral', marks());
      swap(raiz, trocar);
      raiz = trocar;
      vars.raiz = raiz;
      add(base + S.move, 'raiz ← trocar', `raiz recebe trocar = ${raiz}: o valor ${vtext(raiz)} desceu para essa posição, e o laço verifica se ele ainda tem filhos maiores.`, 'update', marks({ changedIndices: [raiz] }));
    }

    add(base + S.end, `ArrumaHeap(${inicio}, ${fim}) termina`, `ArrumaHeap voltou para quem o chamou. ${subtreeNote(a, inicio, fim)}`, 'success');
    state.limit = outerLimit;
    frames.pop();
  }

  /** CriaHeap da aula: conserta cada pai, do último até a raiz. */
  function buildHeap(tamanho) {
    const text = `CriaHeap(${tamanho})`;
    const frame = {
      kind: 'CriaHeap', label: text, phaseText: 'Conserta cada pai, do último até a raiz', vars: { tamanho, inicio: NONE },
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
    add(base + B.init, 'inicio ← (tamanho - 1) / 2', `inicio recebe (${tamanho} - 1) / 2 = ${inicio} (divisão inteira): a posição do último pai. ${leaf
      ? `Como tamanho é ímpar, o nó ${inicio} não tem filhos: o primeiro ArrumaHeap termina sem trocar nada. `
      : ''}Os nós depois dele são folhas, e uma folha sozinha já é um heap; por isso o conserto começa aqui e anda para trás, até a raiz.`, 'update');

    for (;;) {
      const goes = inicio >= 0;
      add(base + B.loop, 'ENQUANTO inicio ≥ 0', goes
        ? `${inicio} ≥ 0 é verdadeiro: o nó ${inicio} (valor ${vtext(inicio)}) ainda não foi ajustado.`
        : `${inicio} ≥ 0 é falso: já passamos da raiz (posição 0), então todos os pais foram ajustados e o vetor é um max-heap.`, goes ? 'comparison' : 'success', {
        compare: compareOf({ label: 'inicio', value: String(inicio) }, '≥', { label: 'zero', value: '0' }, goes),
      });
      if (!goes) break;

      add(base + B.call, `ArrumaHeap(vetor, ${inicio}, ${tamanho - 1})`, `Chama ArrumaHeap para o nó ${inicio} (valor ${vtext(inicio)}), com fim = ${tamanho - 1}. ${inicio === first
        ? (leaf ? 'Esse nó é uma folha, então não há o que ajustar.' : 'Os filhos desse nó são folhas, e uma folha sozinha já é um heap: só o valor dele pode estar fora do lugar.')
        : 'Os pais abaixo dele já foram ajustados, então as subárvores desse nó já são heaps e só o valor dele pode estar fora do lugar.'}`, 'neutral');
      siftDown(inicio, tamanho - 1);
      log.push(`Depois de ArrumaHeap(${inicio}, ${tamanho - 1}): ${vec(a)}`);
      inicio -= 1;
      vars.inicio = inicio;
      add(base + B.dec, 'inicio ← inicio - 1', inicio >= 0
        ? `inicio recua para ${inicio}: o pai anterior, agora com as duas subárvores já ajustadas.`
        : `inicio recua para ${inicio}: passou da raiz.`, 'update');
    }

    add(base + B.end, `CriaHeap(${tamanho}) termina`, `O vetor é um max-heap: todo pai é maior ou igual aos filhos e o maior valor (${vtext(0)}) está na raiz, posição 0. Foram ${plural(counters.calls - startCalls, 'chamada', 'chamadas')} de ArrumaHeap, ${plural(counters.comparisons - start, 'comparação', 'comparações')} e ${plural(counters.swaps - startSwaps, 'troca', 'trocas')}.`, 'success');
    frames.pop();
  }

  /** heapsort da aula: cria o heap e extrai o maior valor, uma vez por posição. */
  function heapSort(tamanho) {
    const text = `heapsort(${tamanho})`;
    const frame = {
      kind: 'heapsort', label: text, vars: { tamanho, fim: NONE },
    };
    frame.phaseText = () => (state.sortedFrom === n && frame.vars.fim === NONE ? 'Fase 1 · cria o heap' : 'Fase 2 · extrai o maior valor de cada vez');
    frames.push(frame);
    const { vars } = frame;
    const base = offsets.heap;

    add(base + H.call, 'CriaHeap(vetor, tamanho)', `heapsort começa transformando o vetor inteiro (${plural(tamanho, 'elemento', 'elementos')}) em um max-heap, com CriaHeap: depois dela o maior valor estará na posição 0.`, 'neutral');
    buildHeap(tamanho);
    log.push(`Depois de CriaHeap: ${vec(a)}`);

    let fim = tamanho - 1;
    vars.fim = fim;
    add(base + H.fim, 'fim ← tamanho - 1', `fim recebe tamanho - 1 = ${fim}: a última posição do heap, onde o maior valor vai ficar. Tudo o que estiver depois de fim já estará ordenado.`, 'update');

    for (;;) {
      const goes = fim > 0;
      add(base + H.loop, 'ENQUANTO fim > 0', goes
        ? `${fim} > 0 é verdadeiro: o heap ainda tem mais de um elemento (as posições de 0 a ${fim}).`
        : `${fim} > 0 é falso: sobrou um só elemento no heap, o menor de todos, e ele já está na posição certa.`, goes ? 'comparison' : 'success', {
        compare: compareOf({ label: 'fim', value: String(fim) }, '>', { label: 'zero', value: '0' }, goes),
        ...(goes ? {} : { sortedFrom: 1 }),
      });
      if (!goes) break;

      add(base + H.swap, 'swap(vetor, 0, fim)', `Chama swap para trocar a raiz vetor[0] = ${vtext(0)} (o maior valor do heap) com vetor[${fim}] = ${vtext(fim)}, o último elemento do heap: o maior valor vai para a posição final.`, 'neutral');
      swap(0, fim, fim);

      fim -= 1;
      vars.fim = fim;
      add(base + H.dec, 'fim ← fim - 1', fim > 0
        ? `fim recua para ${fim}: a posição ${fim + 1} já está ordenada e sai do heap, que agora vai de 0 a ${fim}. A raiz, porém, é o valor que veio do fim e provavelmente não é o maior do heap.`
        : `fim recua para ${fim}: a posição ${fim + 1} já está ordenada e sai do heap, que fica só com a posição 0.`, 'update');

      add(base + H.sift, 'ArrumaHeap(vetor, 0, fim)', fim > 0
        ? `Chama ArrumaHeap para a raiz: o valor ${vtext(0)} desce até o lugar certo e o heap de 0 a ${fim} volta a ser um max-heap.`
        : `Chama ArrumaHeap para a raiz, mas o heap só tem a posição 0: não há filhos, então nada vai mudar.`, 'neutral');
      siftDown(0, fim);
      log.push(`fim = ${fim}: ${heapVec(a, state.sortedFrom)}`);
    }

    state.sortedFrom = 0;
    const comparisonsTotal = counters.comparisons;
    log.push(`Vetor ordenado: ${vec(a)}`, `Comparações: ${comparisonsTotal} · Trocas: ${counters.swaps}`);
    add(base + H.end, 'Ordenação concluída', `O vetor está em ordem crescente, depois de ${comparisonsTotal} comparações e ${counters.swaps} trocas. A cada volta o maior valor do heap foi parar na posição final, e o heap encolheu até sobrar um só elemento.`, 'done', { sortedFrom: 0 });
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
    title: 'Heap pronto',
    description: `O vetor virou um max-heap: ${vec(a)}. O maior valor, ${label(a[0])}, está na raiz. O heapsort agora trocaria a raiz com o último elemento e ajustaria o resto. Foram ${counters.calls} chamadas de ArrumaHeap, ${counters.comparisons} comparações e ${counters.swaps} trocas.`,
    tone: 'done',
    stack: [],
    output: [...tracer.log, `Max-heap: ${vec(a)}`],
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
  log.push(`Depois de ArrumaHeap(${inicio}, ${fim}): ${vec(a)}`);
  tracer.steps.push({
    ...tracer.steps.at(-1),
    title: 'Ajuste concluído',
    description: `${counters.swaps ? `O valor do nó ${inicio} desceu ${plural(counters.swaps, 'nível', 'níveis')}` : `O valor do nó ${inicio} já estava no lugar`}, com ${plural(counters.comparisons, 'comparação', 'comparações')} e ${plural(counters.swaps, 'troca', 'trocas')}: cada volta do laço desce um nível, e o heap de 0 a ${fim} tem ${plural(heightOf(fim + 1), 'nível', 'níveis')}. ${subtreeNote(a, inicio, fim)} Por isso CriaHeap ajusta os pais do último até a raiz.`,
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
  const phase = { label: `ehMaxHeap(${n})`, text: 'Confere se todo pai é maior ou igual aos filhos', code: true };
  const steps = [];
  let comparisons = 0;
  const add = (line, title, description, tone, { variables = {}, ...extra } = {}) => steps.push(step(values, line, title, description, tone, {
    phase, stats: { 'comparações': comparisons }, variables: { tamanho: n, ...variables }, ...extra,
  }));
  const cmp = (pai, filho, result) => ({
    compare: {
      left: { label: 'vetor[pai]', value: fmt(values[pai]) }, op: '<', right: { label: 'vetor[filho]', value: fmt(values[filho]) }, result, alarm: true,
    },
  });

  add(C.head, 'O vetor como árvore', `Este vetor de ${plural(n, 'posição', 'posições')} é lido como uma árvore binária completa: a raiz é a posição 0, os filhos da posição i são 2i + 1 e 2i + 2, e o pai é (i − 1) / 2. Em um max-heap, cada pai é maior ou igual aos seus filhos. Clique em uma célula para ver o pai e os filhos dela, ou avance para conferir a regra nó por nó.`, 'neutral');

  for (let filho = 1; filho < n; filho += 1) {
    const pai = Math.floor((filho - 1) / 2);
    const vars = { filho };
    add(C.loop, 'PARA filho de 1 até tamanho - 1', `filho = ${filho}: vamos conferir o nó ${filho} (valor ${fmt(values[filho])}).${filho === 1 ? ' A raiz, posição 0, não tem pai, por isso a conferência começa na posição 1.' : ''}`, 'update', { pointers: { filho }, comparedIndices: [filho], variables: { filho, pai: NONE } });
    vars.pai = pai;
    add(C.pai, 'pai ← (filho - 1) / 2', `pai recebe (${filho} - 1) / 2 = ${pai} (divisão inteira): o pai do nó ${filho} está na posição ${pai} e guarda o valor ${fmt(values[pai])}. Os filhos do nó ${pai} são ${2 * pai + 1}${2 * pai + 2 < n ? ` e ${2 * pai + 2}` : ''}.`, 'update', { pointers: { pai, filho }, pivotIndex: pai, comparedIndices: [filho], variables: vars });
    comparisons += 1;
    const broken = values[pai] < values[filho];
    add(C.test, 'SE vetor[pai] < vetor[filho]', `${fmt(values[pai])} < ${fmt(values[filho])} é ${broken ? 'verdadeiro' : 'falso'}. ${broken
      ? `O filho é maior que o pai: a regra do max-heap está quebrada na posição ${filho}.`
      : 'O pai é maior ou igual ao filho: a regra vale para este par.'}`, broken ? 'warning' : 'comparison', {
      pointers: { pai, filho }, pivotIndex: pai, comparedIndices: [filho], variables: vars, ...cmp(pai, filho, broken), ...(broken ? { warnIndices: [pai, filho] } : {}),
    });
    if (broken) {
      add(C.no, 'RETORNE falso', `O vetor não é um max-heap: vetor[${pai}] = ${fmt(values[pai])} é menor que seu filho vetor[${filho}] = ${fmt(values[filho])}. Basta um par fora de ordem para a regra falhar. CriaHeap (simulador 03) conserta isso, ajustando cada pai do último até a raiz.`, 'warning', {
        pointers: { pai, filho }, pivotIndex: pai, warnIndices: [pai, filho], variables: vars, output: [`vetor[${pai}] = ${fmt(values[pai])} < vetor[${filho}] = ${fmt(values[filho])}`, 'ehMaxHeap: falso'],
      });
      return steps;
    }
  }

  add(C.yes, 'RETORNE verdadeiro', `Todos os ${n - 1} nós a partir da posição 1 são menores ou iguais aos pais: o vetor é um max-heap. O maior valor, ${fmt(Math.max(...values))}, está na raiz, posição 0, e é isso que o heapsort aproveita para ordenar.`, 'done', {
    variables: { tamanho: n }, output: [`${comparisons} comparações`, 'ehMaxHeap: verdadeiro'],
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
    label: `Arruma(${call.inicio}, ${call.fim})`, value: null, mark: '', current: false,
  }));
  let comparisons = 0;
  let swaps = 0;
  let done = 0;
  const bound = 2 * total * deepest;
  const chart = (final = false) => ({
    title: 'Voltas do laço em cada ArrumaHeap',
    hint: `máximo ${deepest} · ⇄ = trocas`,
    max: Math.max(1, deepest),
    bars: bars.map((bar) => ({ ...bar })),
    totals: [
      { label: 'Comparações', value: comparisons, note: `limite: 2 · ${total} · ${deepest} = ${bound}` },
      { label: 'Chamadas de ArrumaHeap', value: done, note: final ? `${asBuilt} em CriaHeap + ${total - asBuilt} extrações` : `esperadas: ${asBuilt} + ${total - asBuilt}` },
    ],
    final,
  });
  const common = (extra) => ({ chart: chart(extra.final), ...extra });

  const steps = [
    step(values, FULL_OFFSETS.heap, 'Contando as operações', `Um heap de ${plural(n, 'elemento', 'elementos')} tem ${plural(levels, 'nível', 'níveis')} (⌊log₂ ${n}⌋ + 1), então ArrumaHeap dá no máximo ${plural(deepest, 'volta', 'voltas')}: cada volta desce um nível. CriaHeap o chama ${asBuilt} vezes e o laço do heapsort, ${total - asBuilt}. Vamos somar as voltas de cada chamada.`, 'neutral', common({ sortedFrom: n })),
  ];

  calls.forEach((call, index) => {
    bars.forEach((bar, position) => { bar.current = position === index; });
    comparisons += call.comparisons;
    swaps += swapsOf(call);
    done += 1;
    bars[index].value = call.loops;
    bars[index].mark = `⇄ ${swapsOf(call)}`;
    const where = call.phase === 'build' ? 'CriaHeap' : 'heapsort';
    steps.push(step(valuesOf(call.after), FULL_OFFSETS.sift + S.loop, `ArrumaHeap(${call.inicio}, ${call.fim})`, `${where}${call.rootSwap ? ` trocou a raiz com a posição ${call.fim + 1} e` : ''} chamou ArrumaHeap para o nó ${call.inicio} do heap de 0 a ${call.fim}. O valor ${call.swaps === 0 ? 'já estava no lugar (o nó é uma folha ou é maior que os filhos)' : `desceu ${plural(call.swaps, 'nível', 'níveis')}, parando na posição ${call.landing}`}: ${plural(call.loops, 'volta', 'voltas')} do laço, ${plural(call.comparisons, 'comparação', 'comparações')} e ${plural(call.swaps, 'troca', 'trocas')}${call.rootSwap ? ' (mais a da raiz)' : ''}. ${call.swaps === deepest && deepest > 0 ? 'É o máximo possível: o valor foi até o último nível.' : ''}`.trim(), 'comparison', common({
      sortedFrom: call.sorted,
      pointers: { inicio: call.inicio, fim: call.fim, raiz: call.landing },
      changedIndices: changedBetween(call.before, call.after),
      variables: { chamada: `${index + 1} / ${total}`, 'voltas desta': call.loops, 'comparações acumuladas': comparisons },
    })));
  });

  bars.forEach((bar) => { bar.current = false; });
  const costOf = (list) => totalOf(list, 'comparisons');
  steps.push(step(valuesOf(calls.length ? calls.at(-1).after : values), FULL_OFFSETS.heap + H.end, 'Somando as chamadas', `${plural(total, 'chamada', 'chamadas')} de ArrumaHeap e ${comparisons} comparações no total (${swaps} trocas). Nenhuma chamada passou de ${plural(deepest, 'volta', 'voltas')}, então o custo é no máximo ${total} · ${deepest} voltas: da ordem de n · log₂ n. Para os mesmos valores já ordenados são ${costOf(ofSorted)} comparações e em ordem inversa, ${costOf(ofReversed)}: o custo não depende da ordem.`, 'done', common({
    final: true,
    sortedFrom: 0,
    variables: {
      n, altura: levels, chamadas: total, 'comparações': comparisons, trocas: swaps,
    },
    output: [
      `Chamadas de ArrumaHeap: ${total} (${asBuilt} + ${total - asBuilt})`,
      `Comparações: ${comparisons} · Trocas: ${swaps}`,
      `Mesmos valores já ordenados: ${costOf(ofSorted)} comparações`,
      `Mesmos valores em ordem inversa: ${costOf(ofReversed)} comparações`,
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
    { label: 'Já ordenado', values: inOrder },
    { label: 'Quase ordenado', values: almost },
    { label: 'Ordem inversa', values: [...inOrder].reverse() },
    { label: 'Seu vetor', values: clone(values) },
  ].map((scenario) => ({
    ...scenario, ...runCalls(toItems(scenario.values)), comparisons: 0, swaps: 0, current: toItems(scenario.values), sorted: n,
  }));
  const rounds = scenarios[0].calls.length;

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.swaps, ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, FULL_OFFSETS.heap, 'Quatro vetores, os mesmos valores', 'O primeiro vetor já está ordenado, o segundo está quase ordenado (só os dois últimos trocados), o terceiro está em ordem inversa e o quarto é o seu vetor. O heapsort vai tratar os quatro do mesmo jeito? Cada passo executa uma chamada de ArrumaHeap em cada vetor.', 'neutral', {
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
    const where = first.phase === 'build' ? `CriaHeap: ArrumaHeap(${first.inicio}, ${first.fim})` : `extração ${index - scenarios[0].calls.filter((call) => call.phase === 'build').length + 1}: ArrumaHeap(0, ${first.fim})`;
    steps.push(step(values, FULL_OFFSETS.sift + S.loop, `${index + 1}ª chamada de ArrumaHeap`, `Cada vetor faz a sua ${index + 1}ª chamada (${where}). Comparações acumuladas: ${joined('comparisons')}. Os quatro seguem o mesmo roteiro e o custo de cada chamada depende só da altura do heap, não de a ordem inicial ser boa ou ruim.`, 'comparison', {
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
  steps.push(step(values, FULL_OFFSETS.heap + H.end, 'O custo quase não depende da ordem', `Comparações: ${joined('comparisons')}; trocas: ${joined('swaps')}. A diferença entre o mais barato e o mais caro é de apenas ${plural(spread, 'comparação', 'comparações')}. O vetor já ordenado não tem vantagem: ele é desfeito pela criação do heap e depois reconstruído pelas extrações, como qualquer outro. O heapsort não é adaptável.`, 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.final), sortedFrom: 0 })),
    output: scenarios.map((scenario) => `${scenario.label}: ${scenario.comparisons} comparações, ${scenario.swaps} trocas`),
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
      ? step(values, FULL_OFFSETS.heap, 'Valores repetidos em destaque', 'Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética. Vamos ver, troca por troca, se algum par de iguais inverte a ordem.', 'neutral', { tags: tagsOf(items), sortedFrom: n })
      : step(values, FULL_OFFSETS.heap, 'Não há valores repetidos', 'Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com valores repetidos.', 'warning', { tags: tagsOf(items), sortedFrom: n }),
  ];

  /** Um passo para o vetor `after`, comparado com `before`: registra os pares de iguais que inverteram. */
  const report = (before, after, line, title, what, sortedFrom, pointers) => {
    const pairs = flippedPairs(before, after);
    const moved = pairs.flatMap(([x, y]) => [x, y]);
    const warnIndices = after.map((item, index) => (moved.some((m) => m.v === item.v && m.tag === item.tag) ? index : -1)).filter((index) => index >= 0);
    flipped += pairs.length;
    pairs.forEach(([x, y]) => log.push(`${title}: ${label(y)} passou à frente de ${label(x)}`));
    const noRepeat = !after.some((item) => item.tag);
    steps.push(step(valuesOf(after), line, title, pairs.length
      ? `${what} ${pairs.map(([x, y]) => `${label(y)} passou à frente de ${label(x)}`).join('; ')}. Vetor: ${vec(after)}. ${pairs.length === 1 ? 'Esses dois iguais' : 'Esses pares de iguais'} não estão mais na ordem original: o valor foi levado para o outro lado de um igual.`
      : `${what} ${noRepeat ? 'Não há valores repetidos neste vetor.' : 'Os iguais continuam na ordem original.'}`, pairs.length ? 'warning' : 'comparison', {
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
      report(call.before, call.swapped, FULL_OFFSETS.heap + H.swap, `swap(0, ${call.fim + 1})`, `swap troca a raiz com a posição ${call.fim + 1}, por cima de tudo o que há no meio.`, call.fim + 1, { fim: call.fim + 1 });
    }
    const line = call.phase === 'build' ? FULL_OFFSETS.build + B.call : FULL_OFFSETS.heap + H.sift;
    report(call.swapped, call.after, line, `ArrumaHeap(${call.inicio}, ${call.fim})`, call.swaps ? `ArrumaHeap desceu o valor do nó ${call.inicio} por ${plural(call.swaps, 'nível', 'níveis')}.` : `ArrumaHeap não mexeu em nada: o valor do nó ${call.inicio} já estava no lugar.`, call.sorted, { inicio: call.inicio, fim: call.fim });
  });

  const stable = isStable(final);
  steps.push(step(valuesOf(final), FULL_OFFSETS.heap + H.end, !hasRepeated ? 'Resultado' : stable ? 'Resultado: ordem preservada neste vetor' : 'Resultado: instável', !hasRepeated
    ? 'O vetor não tinha valores repetidos, então não há o que comparar.'
    : stable
      ? 'Neste vetor a ordem dos iguais foi preservada, mas por acaso: o Heapsort não garante isso. Use "Gerar exemplo" para ver um vetor em que a ordem se inverte.'
      : `Ordem final: ${final.map(label).join(' ')}. Pelo menos um par de iguais trocou de ordem: o Heapsort é instável, porque as trocas ligam posições distantes e levam um valor para o outro lado de um igual.`, !hasRepeated || stable ? 'done' : 'warning', {
    tags: tagsOf(final),
    sortedFrom: 0,
    output: [...log, `Ordem final: ${final.map(label).join(' ')}`, !hasRepeated ? 'Sem valores repetidos.' : stable ? 'Ordem dos iguais preservada.' : 'Ordem dos iguais alterada.'],
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
