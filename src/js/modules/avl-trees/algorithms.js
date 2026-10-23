// `?v=2`: a AVL depende de funções novas de tree-scene.js (`setHeight`, `setFb`, `setAlias`). O `?v=` é
// outra URL, então o navegador busca uma cópia nova em vez de usar a antiga que guardou das outras
// páginas de árvore (o `python -m http.server` não manda cabeçalhos de cache). Os dois arquivos da AVL
// usam o mesmo texto de propósito, para a página carregar uma cópia só.
import {
  buildTree, fmt, heightOf, inorder, preorder, treeTrace,
} from '../shared/tree-scene.js?v=2';

/*
 * Árvore AVL (ED2, aulas 13 e 14). O pseudocódigo é o da aula de implementação, com três correções
 * em relação aos slides (ver README): `raiz ← ...` nos dois invólucros (os slides usam `=`), o
 * `Fim se` que sobrava antes do `Senão` de `inserir` e o `Fim Se` e o `)` que faltavam em `remover`.
 *
 * Convenção do fator de balanceamento: FB = altura(esquerda) − altura(direita), a do código da aula 14.
 * FB positivo significa esquerda mais alta, e a rotação que conserta é à direita. (O slide da aula 13
 * define o contrário, hD − hE, e por isso os exemplos dela aparecem com o sinal trocado aqui.)
 */

const isId = (id) => typeof id === 'number';
const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const list = (items) => items.join(', ');
const sideName = (key) => (key === 'left' ? 'esquerdo' : 'direito');
const signed = (n) => (n > 0 ? `+${n}` : String(n));
const turnsOf = (rotations) => rotations.reduce((sum, item) => sum + item.turns, 0);
/** "2 rotações (LR em 50)" ou "sem rotações": os casos de balanceamento que a operação resolveu. */
const summarize = (rotations) => (rotations.length
  ? `${plural(turnsOf(rotations), 'rotação', 'rotações')} (${list(rotations.map((item) => `${item.case} em ${item.at}`))})`
  : 'sem rotações');

// ---------------------------------------------------------------------------------------------
// Pseudocódigo
// ---------------------------------------------------------------------------------------------

/** Junta os blocos de código num painel só e guarda a linha de cada marca (`bloco.marca`), base 0. */
function program(blocks) {
  const code = [];
  const at = {};
  blocks.forEach(({ name, lines }, index) => {
    if (index) code.push('');
    lines.forEach((entry) => {
      const [text, key] = Array.isArray(entry) ? entry : [entry, null];
      if (key) at[`${name}.${key}`] = code.length;
      code.push(text);
    });
  });
  return { code, at };
}

const ALT = {
  name: 'alt',
  lines: [
    ['Função altura(nó)', 'head'],
    '  Se nó é NULL então',
    '    // Para nós inexistentes, a altura é -1',
    ['    Retornar -1', 'nullRet'],
    '  Fim se',
    ['  Retornar nó.altura', 'ret'],
    'Fim Função',
  ],
};

const FB = {
  name: 'fb',
  lines: [
    ['Função fatorDeBalanceamento(nó)', 'head'],
    '  Se nó é NULL então',
    ['    Retornar 0', 'nullRet'],
    '  Fim se',
    ['  Retornar altura(nó.esquerdo) - altura(nó.direito)', 'ret'],
    'Fim Função',
  ],
};

const ROT_DIR = {
  name: 'rotR',
  lines: [
    ['Função rotacaoDireita(y)', 'head'],
    ['  x ← y.esquerdo', 'child'],
    ['  T2 ← x.direito', 't2'],
    '  // Realiza a rotação',
    ['  x.direito ← y', 'l1'],
    ['  y.esquerdo ← T2', 'l2'],
    '  // Atualiza alturas',
    ['  y.altura ← máximo(altura(y.esquerdo), altura(y.direito)) + 1', 'h1'],
    ['  x.altura ← máximo(altura(x.esquerdo), altura(x.direito)) + 1', 'h2'],
    ['  Retornar x // Nova raiz após rotação', 'ret'],
    'Fim Função',
  ],
};

const ROT_ESQ = {
  name: 'rotL',
  lines: [
    ['Função rotacaoEsquerda(x)', 'head'],
    ['  y ← x.direito', 'child'],
    ['  T2 ← y.esquerdo', 't2'],
    '  // Realiza a rotação',
    ['  y.esquerdo ← x', 'l1'],
    ['  x.direito ← T2', 'l2'],
    '  // Atualiza alturas',
    ['  x.altura ← máximo(altura(x.esquerdo), altura(x.direito)) + 1', 'h1'],
    ['  y.altura ← máximo(altura(y.esquerdo), altura(y.direito)) + 1', 'h2'],
    ['  Retornar y // Nova raiz após rotação', 'ret'],
    'Fim Função',
  ],
};

// O trecho de `inserir` que balanceia o nó: é também o código do simulador dos quatro casos.
const INSERT_BALANCE = [
  '  // Calcula o fator de balanceamento',
  ['  FatorDeBalanceamento ← fatorDeBalanceamento(nó)', 'fb'],
  '  // Caso LL',
  ['  Se FatorDeBalanceamento > 1 e valor < nó.esquerdo.valor então', 'llTest'],
  ['    Retornar rotacaoDireita(nó)', 'llRet'],
  '  Fim se',
  '  // Caso RR',
  ['  Se FatorDeBalanceamento < -1 e valor > nó.direito.valor então', 'rrTest'],
  ['    Retornar rotacaoEsquerda(nó)', 'rrRet'],
  '  Fim se',
  '  // Caso LR',
  ['  Se FatorDeBalanceamento > 1 e valor > nó.esquerdo.valor então', 'lrTest'],
  ['    nó.esquerdo ← rotacaoEsquerda(nó.esquerdo)', 'lrRot1'],
  ['    Retornar rotacaoDireita(nó)', 'lrRet'],
  '  Fim se',
  '  // Caso RL',
  ['  Se FatorDeBalanceamento < -1 e valor < nó.direito.valor então', 'rlTest'],
  ['    nó.direito ← rotacaoDireita(nó.direito)', 'rlRot1'],
  ['    Retornar rotacaoEsquerda(nó)', 'rlRet'],
  '  Fim se',
  ['  Retornar nó', 'retNode'],
];

const INS_WRAP = {
  name: 'insw',
  lines: [['Função inserir(valor)', 'head'], ['  raiz ← inserir(raiz, valor)', 'body'], ['Fim função', 'end']],
};

const INS = {
  name: 'ins',
  lines: [
    ['Função inserir(nó, valor)', 'head'],
    ['  Se nó é NULL então', 'nullTest'],
    ['    Retornar novo Nó(valor) com altura = 0', 'retNew'],
    '  Fim se',
    ['  Se valor < nó.valor então', 'ltTest'],
    ['    nó.esquerdo ← inserir(nó.esquerdo, valor)', 'callL'],
    '  Senão',
    ['    Se valor > nó.valor então', 'gtTest'],
    ['      nó.direito ← inserir(nó.direito, valor)', 'callR'],
    '    Senão',
    ['      Retornar nó // Não permite valores duplicados', 'dup'],
    '    Fim se',
    '  Fim se',
    '  // Atualiza a altura do nó pai',
    ['  nó.altura ← máximo(altura(nó.esquerdo), altura(nó.direito)) + 1', 'height'],
    ...INSERT_BALANCE,
    'Fim Função',
  ],
};

const CASES = {
  name: 'cases',
  lines: [
    '// Trecho de inserir(nó, valor): balanceia o nó',
    ...INSERT_BALANCE,
  ],
};

const REM_WRAP = {
  name: 'remw',
  lines: [['Função remover(valor)', 'head'], ['  raiz ← remover(raiz, valor)', 'body'], ['Fim função', 'end']],
};

const REM = {
  name: 'rem',
  lines: [
    ['Função remover(nó, valor)', 'head'],
    ['  Se nó é NULL então', 'nullTest1'],
    ['    Retornar nó // Nada a remover, retorno NULL', 'retNull1'],
    '  Fim Se',
    ['  Se valor < nó.valor então', 'ltTest'],
    ['    nó.esquerdo ← remover(nó.esquerdo, valor) // Busca na subárvore esquerda', 'callL'],
    '  Senão',
    ['    Se valor > nó.valor então', 'gtTest'],
    ['      nó.direito ← remover(nó.direito, valor) // Busca na subárvore direita', 'callR'],
    '    Senão',
    '      // Nó com um ou nenhum filho',
    ['      Se nó.esquerdo é NULL ou nó.direito é NULL então', 'oneTest'],
    ['        Se nó.esquerdo ≠ NULL então', 'leftTest'],
    ['          temp ← nó.esquerdo', 'tempL'],
    '        Senão',
    ['          temp ← nó.direito', 'tempR'],
    '        Fim Se',
    ['        Se temp é NULL então // Caso de nó sem filhos', 'tempNull'],
    ['          temp ← nó', 'tempSelf'],
    ['          nó ← NULL', 'nodeNull'],
    '        Senão',
    ['          nó ← temp // Nó com um filho', 'nodeTemp'],
    '        Fim Se',
    '      Senão // Nó com dois filhos',
    ['        temp ← menorValorNo(nó.direito) // Encontra o menor valor', 'minCall'],
    ['        nó.valor ← temp.valor', 'copy'],
    ['        nó.direito ← remover(nó.direito, temp.valor) // Remove o nó substituto', 'callSuc'],
    '      Fim Se',
    '    Fim Se',
    '  Fim Se',
    '  // Se o nó foi removido e agora é NULL, retornar',
    ['  Se nó é NULL então', 'nullTest2'],
    ['    Retornar nó', 'retNull2'],
    '  Fim Se',
    '  // Atualiza a altura do nó atual',
    ['  nó.altura ← máximo(altura(nó.esquerdo), altura(nó.direito)) + 1', 'height'],
    '  // Calcula o fator de balanceamento',
    ['  balance ← fatorDeBalanceamento(nó)', 'fb'],
    '  // Caso LL',
    ['  Se balance > 1 e fatorDeBalanceamento(nó.esquerdo) ≥ 0 então', 'llTest'],
    ['    Retornar rotacaoDireita(nó)', 'llRet'],
    '  Fim Se',
    '  // Caso LR',
    ['  Se balance > 1 e fatorDeBalanceamento(nó.esquerdo) < 0 então', 'lrTest'],
    ['    nó.esquerdo ← rotacaoEsquerda(nó.esquerdo)', 'lrRot1'],
    ['    Retornar rotacaoDireita(nó)', 'lrRet'],
    '  Fim Se',
    '  // Caso RR',
    ['  Se balance < -1 e fatorDeBalanceamento(nó.direito) ≤ 0 então', 'rrTest'],
    ['    Retornar rotacaoEsquerda(nó)', 'rrRet'],
    '  Fim Se',
    '  // Caso RL',
    ['  Se balance < -1 e fatorDeBalanceamento(nó.direito) > 0 então', 'rlTest'],
    ['    nó.direito ← rotacaoDireita(nó.direito)', 'rlRot1'],
    ['    Retornar rotacaoEsquerda(nó)', 'rlRet'],
    '  Fim Se',
    ['  Retornar nó', 'retNode'],
    'Fim Função',
  ],
};

// Os slides chamam `menorValorNo` sem mostrar o código; este é o do projeto Java da aula.
const MENOR = {
  name: 'min',
  lines: [
    'Função menorValorNo(nó)',
    '  atual ← nó',
    '  Enquanto atual.esquerdo ≠ NULL faça',
    '    atual ← atual.esquerdo',
    '  Fim Enquanto',
    '  Retornar atual',
    'Fim Função',
  ],
};

const BUILD = {
  name: 'build',
  lines: ['Para cada valor na sequência de entrada faça', '  inserir(valor)', 'Fim para'],
};

const PROGRAMS = {
  balance: program([ALT, FB]),
  rotRight: program([ROT_DIR, ALT]),
  rotLeft: program([ROT_ESQ, ALT]),
  cases: program([CASES, ROT_DIR, ROT_ESQ]),
  insert: program([INS_WRAP, INS, ROT_DIR, ROT_ESQ, ALT, FB]),
  build: program([BUILD]),
  remove: program([REM_WRAP, REM, MENOR, ROT_DIR, ROT_ESQ, ALT, FB]),
};
// Em "Construir a árvore" todos os passos ficam na linha `inserir(valor)`.
const BUILD_AT = new Proxy({}, { get: () => 1 });

export const algorithms = [
  {
    id: 'balance', title: 'Altura e fator de balanceamento', menuLabel: 'altura() · FB', group: 'Fundamentos', number: '01',
    description: 'A altura de um nó conta as arestas até a folha mais distante: o nó nulo vale −1 e uma folha vale 0. O fator de balanceamento (FB) é a altura da esquerda menos a da direita. Uma árvore é AVL quando |FB| ≤ 1 em todos os nós.',
    interaction: 'Monte a mesma sequência pelos dois caminhos: com inserção AVL todo FB fica entre −1 e 1; com inserção de ABB comum (por exemplo, valores em ordem crescente) aparecem nós com |FB| > 1. FB positivo quer dizer esquerda mais alta.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Com a altura guardada em cada nó, calcular o FB de um nó custa O(1) (duas leituras). Conferir a árvore inteira custa O(n).' },
    pseudocode: PROGRAMS.balance.code,
  },
  {
    id: 'rotRight', title: 'Rotação simples à direita (rotacaoDireita)', menuLabel: 'rotacaoDireita(y)', group: 'Rotações', number: '02',
    description: 'O filho esquerdo x de y sobe para o lugar dele e y desce para a direita de x. A subárvore T2, que era a direita de x, passa a ser a esquerda de y. A ordem em ordem da árvore não muda.',
    interaction: 'Clique em um nó para escolher o y (ele precisa ter filho esquerdo). Repare que a posição horizontal dos nós nunca muda: a rotação só troca os níveis, e o percurso em ordem sai igual antes e depois.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Uma rotação só religa três ponteiros e recalcula duas alturas, qualquer que seja o tamanho das subárvores.' },
    pseudocode: PROGRAMS.rotRight.code,
  },
  {
    id: 'rotLeft', title: 'Rotação simples à esquerda (rotacaoEsquerda)', menuLabel: 'rotacaoEsquerda(x)', group: 'Rotações', number: '03',
    description: 'É a rotação espelhada: o filho direito y de x sobe para o lugar dele e x desce para a esquerda de y. A subárvore T2, que era a esquerda de y, passa a ser a direita de x.',
    interaction: 'Clique em um nó para escolher o x (ele precisa ter filho direito). Compare com a rotação à direita: os papéis de esquerda e direita se trocam e o resto é igual.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Uma rotação só religa três ponteiros e recalcula duas alturas, qualquer que seja o tamanho das subárvores.' },
    pseudocode: PROGRAMS.rotLeft.code,
  },
  {
    id: 'cases', title: 'Os quatro casos de desbalanceamento', menuLabel: 'LL · RR · LR · RL', group: 'Rotações', number: '04',
    description: 'Um nó com |FB| = 2 é consertado por uma rotação simples quando o filho pesado pende para o mesmo lado (LL e RR) e por uma rotação dupla quando pende para o lado oposto (LR e RL): primeiro a rotação no filho, depois a do nó.',
    interaction: 'Escolha um dos quatro casos. A árvore é a que sobra depois de uma inserção, antes de balancear: veja o sinal do FB do nó e do filho e quais rotações o código escolhe.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Decidir o caso custa quatro comparações e consertar custa uma ou duas rotações, cada uma de tempo constante.' },
    pseudocode: PROGRAMS.cases.code,
  },
  {
    id: 'insert', title: 'Inserir um valor (inserir)', menuLabel: 'inserir(valor)', group: 'Inserção', number: '05',
    description: 'Insere como numa ABB, de forma recursiva. No caminho de volta, cada nó atualiza a altura, calcula o FB e, se |FB| > 1, aplica uma rotação (simples ou dupla). Valores repetidos são ignorados.',
    interaction: 'Use os exemplos da aula para ver cada caso: LL, RR, LR e RL. Clique em um nó da árvore para repetir o valor dele e ver a inserção ser recusada. A pilha de chamadas mostra a recursão.',
    complexity: { time: 'O(log n)', space: 'O(log n)', note: 'A altura de uma AVL é O(log n): a inserção desce uma vez e volta atualizando alturas, com no máximo uma rotação (simples ou dupla). A pilha tem um frame por nível.' },
    pseudocode: PROGRAMS.insert.code,
  },
  {
    id: 'build', title: 'Construir a árvore (inserções em sequência)', menuLabel: 'Construir a AVL', group: 'Inserção', number: '06',
    description: 'Insira os valores na ordem da lista e veja quando a árvore precisa rotacionar. Compare a altura final com a de uma ABB comum feita com os mesmos valores.',
    interaction: 'Use os exercícios da aula (por exemplo, 50, 30, 70, 20, 40, 10) e depois valores em ordem crescente: a ABB vira uma cadeia, a AVL continua baixa.',
    complexity: { time: 'O(n log n)', space: 'O(n)', note: 'Cada uma das n inserções custa O(log n) numa AVL; numa ABB comum, com valores em ordem, custaria O(n) cada e o total seria O(n²).' },
    pseudocode: PROGRAMS.build.code,
  },
  {
    id: 'remove', title: 'Remover um valor (remover)', menuLabel: 'remover(valor)', group: 'Remoção', number: '07',
    description: 'Remove como numa ABB (folha, um filho, ou dois filhos com o menor valor da direita) e, no caminho de volta, cada nó atualiza a altura e se rebalanceia. Aqui o critério dos casos usa o FB do filho, não o valor removido.',
    interaction: 'Escolha uma folha, um nó com um filho e um com dois filhos. Use o exemplo remover(80) dos slides e o exemplo corrigido, remover(90). Clique em um nó da árvore para removê-lo.',
    complexity: { time: 'O(log n)', space: 'O(log n)', note: 'A busca desce uma vez e a volta pode rotacionar em vários níveis, no máximo um por nível: até O(log n) rotações, bem mais que a inserção.' },
    pseudocode: PROGRAMS.remove.code,
  },
];

// ---------------------------------------------------------------------------------------------
// Árvores de partida
// ---------------------------------------------------------------------------------------------

const emptyTree = () => ({ nodes: [], root: null });

/** Guarda em cada nó a altura calculada da estrutura (folha = 0). */
function withHeights(tree) {
  const nodes = tree.nodes.map((node) => ({ ...node }));
  const walk = (id) => {
    if (!isId(id)) return -1;
    const node = nodes[id];
    node.h = 1 + Math.max(walk(node.left), walk(node.right));
    return node.h;
  };
  walk(tree.root);
  return { nodes, root: tree.root };
}

/** ABB comum: cada valor inserido sem balancear (a árvore pode degenerar). */
export const abbTree = (values) => withHeights(buildTree(values));

const heightN = (nodes, id) => (isId(id) ? nodes[id].h : -1);
const refresh = (nodes, id) => {
  nodes[id].h = 1 + Math.max(heightN(nodes, nodes[id].left), heightN(nodes, nodes[id].right));
};
const factorN = (nodes, id) => (isId(id) ? heightN(nodes, nodes[id].left) - heightN(nodes, nodes[id].right) : 0);

function turnRight(nodes, y) {
  const x = nodes[y].left;
  nodes[y].left = nodes[x].right;
  nodes[x].right = y;
  refresh(nodes, y);
  refresh(nodes, x);
  return x;
}

function turnLeft(nodes, x) {
  const y = nodes[x].right;
  nodes[x].right = nodes[y].left;
  nodes[y].left = x;
  refresh(nodes, x);
  refresh(nodes, y);
  return y;
}

/** O `inserir` da aula, sem passos (monta a árvore de partida). Devolve quantas rotações fez. */
function insertPlain(tree, valor) {
  const { nodes } = tree;
  let turns = 0;
  const ins = (id) => {
    if (!isId(id)) {
      nodes.push({ id: nodes.length, value: valor, left: null, right: null, h: 0 });
      return nodes.length - 1;
    }
    const node = nodes[id];
    if (valor < node.value) node.left = ins(node.left);
    else if (valor > node.value) node.right = ins(node.right);
    else return id;
    refresh(nodes, id);
    const balance = factorN(nodes, id);
    if (balance > 1 && valor < nodes[node.left].value) { turns += 1; return turnRight(nodes, id); }
    if (balance < -1 && valor > nodes[node.right].value) { turns += 1; return turnLeft(nodes, id); }
    if (balance > 1 && valor > nodes[node.left].value) {
      node.left = turnLeft(nodes, node.left);
      turns += 2;
      return turnRight(nodes, id);
    }
    if (balance < -1 && valor < nodes[node.right].value) {
      node.right = turnRight(nodes, node.right);
      turns += 2;
      return turnLeft(nodes, id);
    }
    return id;
  };
  tree.root = ins(tree.root);
  return turns;
}

/** Árvore AVL: os valores inseridos na ordem, com rotações. */
export function avlTree(values) {
  const tree = emptyTree();
  values.forEach((value) => insertPlain(tree, value));
  return tree;
}

/** A árvore de partida dos simuladores: AVL (balanceada) ou ABB comum (sem rotações). */
export const initialTree = (values, balanced) => (balanced ? avlTree(values) : abbTree(values));

/** Maior |FB| entre os nós (0 numa árvore vazia): a árvore é AVL quando é no máximo 1. */
export function worstFactor(tree) {
  return tree.nodes.reduce((worst, node) => Math.max(worst, Math.abs(factorN(tree.nodes, node.id))), 0);
}

export const heightOfTree = (tree) => (tree.root === null ? -1 : heightOf(tree));

/** Rotações que inserir `valor` na árvore causaria (0, 1 ou 2): serve para escolher exemplos. */
export function rotationsOnInsert(tree, valor) {
  const copy = { nodes: tree.nodes.map((node) => ({ ...node })), root: tree.root };
  try {
    return insertPlain(copy, valor);
  } catch {
    // Numa árvore que já estava desbalanceada, a rotação pode faltar um filho (erro no Java).
    return 0;
  }
}

/** Ordem horizontal pela ordem dos valores: rotações não mudam a ordem em ordem, só os níveis. */
function valueLayout(entries) {
  const order = [...entries].sort((a, b) => a.value - b.value);
  return { ranks: new Map(order.map((entry, rank) => [entry.id, rank])), slots: order.length };
}

const entriesOf = (tree) => tree.nodes.map(({ id, value }) => ({ id, value }));

// ---------------------------------------------------------------------------------------------
// Execução como num depurador
// ---------------------------------------------------------------------------------------------

/**
 * Contexto de uma execução: o rastreador de árvore, a pilha de chamadas (`frames`, de `{ text, id }`) e
 * `snap`, que registra um passo com a pilha e os nós ativos. `at` traz a linha de cada marca do
 * pseudocódigo e `main` o bloco da função principal (`ins`, `rem` ou `cases`).
 */
function makeContext({
  tree, layout, params, locals, prog, main, verbose = true,
}) {
  const t = treeTrace({
    tree, layout, params, locals,
  });
  const frames = [];
  const val = (id) => (isId(id) ? fmt(t.node(id).value) : 'nulo');
  const at = (key) => prog.at[key];
  const snap = (line, title, description, tone = 'neutral', extra = {}) => {
    const current = t.st.refs['nó'];
    t.step(line, title, description, tone, {
      stack: frames.map((frame) => frame.text),
      activeIndices: isId(current) ? [current] : [],
      leftIndices: frames.slice(0, -1).map((frame) => frame.id).filter(isId),
      hotEdges: frames.map((frame) => frame.id).filter(isId).slice(1),
      ...extra,
    });
  };
  return {
    t, frames, val, at, snap, K: (key) => at(`${main}.${key}`), verbose, rotations: [],
  };
}

const alt = (t, id) => (isId(id) ? t.node(id).h : -1);
const factor = (t, id) => (isId(id) ? alt(t, t.node(id).left) - alt(t, t.node(id).right) : 0);
const heightFrom = (t, id) => 1 + Math.max(alt(t, t.node(id).left), alt(t, t.node(id).right));

const ROTATION = {
  right: {
    fn: 'rotacaoDireita', block: 'rotR', pivot: 'y', child: 'x', childSide: 'left', t2Side: 'right',
  },
  left: {
    fn: 'rotacaoEsquerda', block: 'rotL', pivot: 'x', child: 'y', childSide: 'right', t2Side: 'left',
  },
};

/**
 * `rotacaoDireita(y)` ou `rotacaoEsquerda(x)`, linha por linha. Devolve o nó que sobe (a nova raiz da
 * subárvore); quem chamou é que religa esse nó ao pai. Sem `verbose`, um único passo resume a rotação.
 */
function rotate(ctx, dir, pivotId, why = '') {
  const {
    t, frames, val, snap, verbose,
  } = ctx;
  const r = ROTATION[dir];
  const L = (key) => ctx.at(`${r.block}.${key}`);
  const P = r.pivot;
  const C = r.child;
  const opposite = r.t2Side;
  const field = (key) => `${key === 'left' ? 'esquerdo' : 'direito'}`;
  const pivotValue = val(pivotId);

  frames.push({ text: `${r.fn}(${pivotValue})`, id: pivotId });
  t.set(P, pivotId);

  const childId = t.node(pivotId)[r.childSide];
  if (!isId(childId)) {
    snap(L('head'), `Chamando ${r.fn}(${P})`, `${r.fn}(${P}) precisa do filho ${field(r.childSide)} de ${pivotValue}, mas ele é NULO: a rotação não pode ser feita (no Java, seria um erro de ponteiro nulo). Isso só acontece numa árvore que já estava desbalanceada antes da operação.`, 'warning', { activeIndices: [pivotId] });
    frames.pop();
    t.clear([P]);
    return pivotId;
  }

  if (verbose) {
    snap(L('head'), `Chamando ${r.fn}(${P})`, `${r.fn}(${P}) recebe o nó ${pivotValue}, que dentro da função se chama ${P}. ${why}`.trim(), 'neutral', { activeIndices: [pivotId] });
  }

  t.follow(C, pivotId, r.childSide);
  if (verbose) {
    snap(L('child'), `${C} ← ${P}.${field(r.childSide)}`, `${C} passa a apontar para o filho ${field(r.childSide)} de ${pivotValue}, o nó ${val(childId)}. É ele quem vai ocupar o lugar de ${pivotValue}.`, 'update', { activeIndices: [pivotId], foundIndices: [childId] });
  }

  const t2Id = t.follow('T2', childId, r.t2Side);
  if (verbose) {
    const between = dir === 'right' ? `maiores que ${val(childId)} e menores que ${pivotValue}` : `menores que ${val(childId)} e maiores que ${pivotValue}`;
    snap(L('t2'), `T2 ← ${C}.${field(r.t2Side)}`, isId(t2Id)
      ? `T2 guarda a subárvore ${field(r.t2Side)} de ${val(childId)} (raiz ${val(t2Id)}). Seus valores são ${between}, então ela vai ficar entre os dois depois da rotação.`
      : `T2 guarda a subárvore ${field(r.t2Side)} de ${val(childId)}, que é nula: não há nada entre ${val(childId)} e ${pivotValue}.`, 'update', { activeIndices: [pivotId], foundIndices: [childId] });
  }

  // x.direito ← y (ou y.esquerdo ← x): o filho passa a apontar para o pivô e a cena já mostra a subárvore girada.
  t.setChild(childId, opposite, pivotId);
  t.setAlias(pivotId, childId);
  // O selo `nulo` de T2 ficava no lugar onde agora está o pivô: some até T2 ser religada.
  if (!isId(t2Id)) t.set('T2', null);
  if (verbose) {
    snap(L('l1'), `${C}.${field(opposite)} ← ${P}`, `${P} (${pivotValue}) passa a ser o filho ${field(opposite)} de ${C} (${val(childId)}). A subárvore girada já tem ${val(childId)} na raiz, mas o pai ainda aponta para ${pivotValue}: quem chamou a função é que vai ligá-lo.${isId(t2Id) ? ` T2 ficou solta: só a variável T2 aponta para ela.` : ''}`, 'update', { changedIndices: [childId], activeIndices: [pivotId] });
  }

  t.setChild(pivotId, r.childSide, t2Id);
  if (!isId(t2Id)) t.set('T2', null, { parent: pivotId, side: r.childSide });
  if (verbose) {
    snap(L('l2'), `${P}.${field(r.childSide)} ← T2`, isId(t2Id)
      ? `A subárvore T2 (raiz ${val(t2Id)}) é religada como filho ${field(r.childSide)} de ${pivotValue}: ela volta para a árvore.`
      : `${pivotValue} passa a ter filho ${field(r.childSide)} nulo, como era T2.`, 'update', { changedIndices: [pivotId], activeIndices: [pivotId], foundIndices: [childId] });
  }

  const pivotBefore = t.node(pivotId).h;
  const pivotNew = heightFrom(t, pivotId);
  t.setHeight(pivotId, pivotNew);
  if (verbose) {
    snap(L('h1'), `Atualizando a altura de ${P}`, `altura(${P}.esquerdo) = ${alt(t, t.node(pivotId).left)} e altura(${P}.direito) = ${alt(t, t.node(pivotId).right)}: nova altura de ${pivotValue} = ${pivotNew} (era ${pivotBefore}). Primeiro o nó que desceu, porque a altura do que sobe depende dela.`, 'update', { changedIndices: [pivotId], variables: { 'nova altura': pivotNew } });
  }

  const childBefore = t.node(childId).h;
  const childNew = heightFrom(t, childId);
  t.setHeight(childId, childNew);
  if (verbose) {
    snap(L('h2'), `Atualizando a altura de ${C}`, `altura(${C}.esquerdo) = ${alt(t, t.node(childId).left)} e altura(${C}.direito) = ${alt(t, t.node(childId).right)}: nova altura de ${val(childId)} = ${childNew} (era ${childBefore}).`, 'update', { changedIndices: [childId], variables: { 'nova altura': childNew } });
  }

  const summary = `${r.fn} em ${pivotValue}: ${val(childId)} sobe e ${pivotValue} desce para o ${field(opposite)}. As alturas agora são ${val(childId)} = ${childNew} e ${pivotValue} = ${pivotNew}.`;
  snap(L('ret'), verbose ? `Retornando ${C}` : `Rotação em ${pivotValue}`, verbose
    ? `Retornar ${C}: a função devolve ${val(childId)}, a nova raiz desta subárvore. Quem chamou vai ligar esse nó no lugar de ${pivotValue}.`
    : `${summary}${why ? ` ${why}` : ''}`, 'update', {
    foundIndices: [childId], changedIndices: [pivotId], rotation: true, variables: { retorno: val(childId) },
  });
  frames.pop();
  t.clear([P, C, 'T2']);
  return childId;
}

// Os quatro casos: de que lado o nó pesa, que rotação conserta e como cada algoritmo decide.
const CASE_INFO = {
  LL: {
    side: 'left', heavy: (b) => b > 1, heavyText: 'FB > 1', child: 'esquerdo', fix: 'uma rotação simples à direita',
    insert: { text: (v, c) => `${v} < ${c}`, pass: (v, c) => v < c, what: 'o valor foi inserido à esquerda do filho esquerdo' },
    remove: { text: 'FB(nó.esquerdo) ≥ 0', pass: (f) => f >= 0, what: 'o filho esquerdo pende para a esquerda (ou está equilibrado)' },
  },
  RR: {
    side: 'right', heavy: (b) => b < -1, heavyText: 'FB < -1', child: 'direito', fix: 'uma rotação simples à esquerda',
    insert: { text: (v, c) => `${v} > ${c}`, pass: (v, c) => v > c, what: 'o valor foi inserido à direita do filho direito' },
    remove: { text: 'FB(nó.direito) ≤ 0', pass: (f) => f <= 0, what: 'o filho direito pende para a direita (ou está equilibrado)' },
  },
  LR: {
    side: 'left', heavy: (b) => b > 1, heavyText: 'FB > 1', child: 'esquerdo', fix: 'uma rotação dupla: esquerda no filho esquerdo e depois direita no nó',
    insert: { text: (v, c) => `${v} > ${c}`, pass: (v, c) => v > c, what: 'o valor foi inserido à direita do filho esquerdo' },
    remove: { text: 'FB(nó.esquerdo) < 0', pass: (f) => f < 0, what: 'o filho esquerdo pende para a direita' },
  },
  RL: {
    side: 'right', heavy: (b) => b < -1, heavyText: 'FB < -1', child: 'direito', fix: 'uma rotação dupla: direita no filho direito e depois esquerda no nó',
    insert: { text: (v, c) => `${v} < ${c}`, pass: (v, c) => v < c, what: 'o valor foi inserido à esquerda do filho direito' },
    remove: { text: 'FB(nó.direito) > 0', pass: (f) => f > 0, what: 'o filho direito pende para a esquerda' },
  },
};

/**
 * O trecho de `inserir`/`remover` que calcula o FB e balanceia o nó `id`. `kind` é `insert` (decide pelo
 * valor inserido) ou `remove` (decide pelo FB do filho). Devolve `{ id, line }`: o nó que fica no lugar e
 * a linha do `Retornar` que executou.
 */
function rebalance(ctx, id, kind, valor) {
  const {
    t, snap, val, K, verbose,
  } = ctx;
  const insert = kind === 'insert';
  const order = insert ? ['LL', 'RR', 'LR', 'RL'] : ['LL', 'LR', 'RR', 'RL'];
  const name = insert ? 'FatorDeBalanceamento' : 'balance';
  const { left, right } = t.node(id);
  const a = alt(t, left);
  const b = alt(t, right);
  const bal = a - b;
  const bad = Math.abs(bal) > 1;
  const v = fmt(valor ?? 0);
  const testLine = (c) => K(`${c.toLowerCase()}Test`);

  t.clearFb();
  t.setFb(id, bal);
  const mark = { activeIndices: [id], errorIndices: bad ? [id] : [], variables: { [name]: bal } };
  if (verbose || bad) {
    snap(K('fb'), 'Calculando o fator de balanceamento', `${name} ← altura(nó.esquerdo) − altura(nó.direito) = ${a} − ${b} = ${bal}. ${bad
      ? `|FB| > 1: o nó ${val(id)} ficou desbalanceado e precisa de rotação.`
      : `|FB| ≤ 1: o nó ${val(id)} continua balanceado.`}`, 'comparison', mark);
  }

  if (!bad) {
    if (verbose) {
      snap(order.map(testLine), 'Testando os quatro casos', `Os quatro casos exigem FB > 1 ou FB < −1 e aqui FB = ${bal}: as quatro condições são falsas, nenhuma rotação é feita.`, 'comparison', mark);
      snap(K('retNode'), 'Retornando o nó', `Retornar nó: ${val(id)} continua sendo a raiz desta subárvore, sem rotação.`, 'update', { ...mark, errorIndices: [] });
    }
    return { id, line: K('retNode') };
  }

  const finish = (c, newRoot, line) => {
    ctx.rotations.push({ case: c, at: val(id), turns: c === 'LL' || c === 'RR' ? 1 : 2 });
    return { id: newRoot, line };
  };

  for (const c of order) {
    const info = CASE_INFO[c];
    const childId = info.side === 'left' ? left : right;
    let ok = false;
    let why;
    if (!info.heavy(bal)) {
      why = `${info.heavyText} é falso para FB = ${bal}: o caso ${c} não vale.`;
    } else if (insert) {
      const childValue = t.node(childId).value;
      ok = info.insert.pass(valor, childValue);
      why = ok
        ? `${info.heavyText} (FB = ${bal}) e ${info.insert.text(v, fmt(childValue))}: ${info.insert.what}. É o caso ${c}: conserta com ${info.fix}.`
        : `${info.heavyText} (FB = ${bal}) é verdadeiro, mas ${info.insert.text(v, fmt(childValue))} é falso: não é o caso ${c}.`;
    } else {
      const childFactor = factor(t, childId);
      t.setFb(childId, childFactor);
      ok = info.remove.pass(childFactor);
      why = ok
        ? `${info.heavyText} (balance = ${bal}) e ${info.remove.text} (FB do filho = ${childFactor}): ${info.remove.what}. É o caso ${c}: conserta com ${info.fix}.`
        : `${info.heavyText} (balance = ${bal}) é verdadeiro, mas ${info.remove.text} é falso (FB do filho = ${childFactor}): não é o caso ${c}.`;
    }
    if (verbose) snap(testLine(c), `Testando o caso ${c}`, why, 'comparison', { ...mark, ...(ok ? { changedIndices: [childId] } : {}) });
    if (!ok) continue;

    const key = c.toLowerCase();
    const note = verbose ? '' : `Caso ${c} (${name} = ${bal}): ${info.fix}.`;
    if (c === 'LL' || c === 'RR') {
      const dir = c === 'LL' ? 'right' : 'left';
      if (verbose) snap(K(`${key}Ret`), `Chamando ${ROTATION[dir].fn}(nó)`, `Retornar ${ROTATION[dir].fn}(nó): o resultado da rotação é o que a função devolve.`, 'neutral', { activeIndices: [id] });
      const up = rotate(ctx, dir, id, note);
      if (verbose) snap(K(`${key}Ret`), 'Retornando a nova raiz', `${ROTATION[dir].fn} devolveu ${val(up)}: é a nova raiz desta subárvore, e a função também a devolve. O chamador a ligará no lugar de ${val(id)}.`, 'update', { foundIndices: [up], activeIndices: [up] });
      return finish(c, up, K(`${key}Ret`));
    }

    // Rotação dupla: primeiro no filho (no sentido contrário), depois no nó.
    const first = c === 'LR' ? 'left' : 'right';
    const second = c === 'LR' ? 'right' : 'left';
    if (verbose) snap(K(`${key}Rot1`), `Chamando ${ROTATION[first].fn}(nó.${info.child})`, `${ROTATION[first].fn}(nó.${info.child}) endireita primeiro o filho ${info.child} (${val(childId)}), que pende para o lado oposto ao do nó.`, 'neutral', { activeIndices: [id], foundIndices: [childId] });
    const mid = rotate(ctx, first, childId, note);
    t.setChild(id, info.side, mid);
    t.setAlias();
    if (verbose) snap(K(`${key}Rot1`), `nó.${info.child} ← ${val(mid)}`, `O retorno é ligado: o filho ${info.child} de ${val(id)} agora é ${val(mid)}. Já está no caso simples (LL ou RR).`, 'update', { activeIndices: [id], changedIndices: [id], foundIndices: [mid] });
    if (verbose) snap(K(`${key}Ret`), `Chamando ${ROTATION[second].fn}(nó)`, `Retornar ${ROTATION[second].fn}(nó): agora a rotação simples no nó ${val(id)}.`, 'neutral', { activeIndices: [id] });
    const up = rotate(ctx, second, id, verbose ? '' : 'Segunda rotação.');
    if (verbose) snap(K(`${key}Ret`), 'Retornando a nova raiz', `${ROTATION[second].fn} devolveu ${val(up)}: é a nova raiz desta subárvore. O chamador a ligará no lugar de ${val(id)}.`, 'update', { foundIndices: [up], activeIndices: [up] });
    return finish(c, up, K(`${key}Ret`));
  }

  snap(K('retNode'), 'Nenhum caso se aplica', `Nenhuma das quatro condições foi verdadeira, embora |FB| > 1: isso só acontece quando a árvore já estava desbalanceada antes da operação. O nó é devolvido como está.`, 'warning', mark);
  return { id, line: K('retNode') };
}

// ---------------------------------------------------------------------------------------------
// Fundamentos: altura e fator de balanceamento
// ---------------------------------------------------------------------------------------------

function balanceSteps(tree) {
  const ctx = makeContext({
    tree, layout: valueLayout(entriesOf(tree)), params: {}, locals: ['raiz'], prog: PROGRAMS.balance, main: 'fb',
  });
  const { t, snap, val } = ctx;
  const at = (key) => ctx.at(key);

  if (!tree.nodes.length) {
    snap(0, 'Árvore vazia', 'Uma árvore vazia não tem nós para conferir: raiz = NULO e a altura da árvore é −1.', 'warning');
    return t.finish();
  }

  const order = [];
  const walk = (id) => {
    if (!isId(id)) return;
    walk(tree.nodes[id].left);
    walk(tree.nodes[id].right);
    order.push(id);
  };
  walk(tree.root);

  snap(at('alt.head'), 'A altura guardada em cada nó', `Cada nó guarda a própria altura (selo "alt"): altura(nó) devolve nó.altura, ou −1 se o nó for NULO. A árvore tem ${plural(tree.nodes.length, 'nó', 'nós')} e altura ${tree.nodes[tree.root].h}. Vamos calcular o FB de cada nó, dos de baixo para os de cima.`, 'neutral');

  const good = [];
  const bad = [];
  order.forEach((id) => {
    const { left, right } = t.node(id);
    const a = alt(t, left);
    const b = alt(t, right);
    const bal = a - b;
    t.setFb(id, bal);
    const wrong = Math.abs(bal) > 1;
    const text = `altura(nó.esquerdo) = ${a}${isId(left) ? '' : ' (sem filho: −1)'} e altura(nó.direito) = ${b}${isId(right) ? '' : ' (sem filho: −1)'}, então FB(${val(id)}) = ${a} − ${b} = ${bal}.`;
    const verdict = wrong
      ? ` |FB| > 1: ${val(id)} está desbalanceado (${bal > 0 ? 'esquerda' : 'direita'} mais alta).`
      : bal === 0 ? ' As duas subárvores têm a mesma altura.' : ` Balanceado: ${bal > 0 ? 'a esquerda' : 'a direita'} é uma mais alta.`;
    snap([at('fb.ret'), at(isId(left) && isId(right) ? 'alt.ret' : 'alt.nullRet')], `Calculando o FB de ${val(id)}`, `${text}${verdict}`, wrong ? 'warning' : 'comparison', {
      activeIndices: [id], foundIndices: [...good], errorIndices: [...bad], variables: { 'nó': val(id), 'FB': bal, 'altura(esq)': a, 'altura(dir)': b },
    });
    if (wrong) bad.push(id); else good.push(id);
  });

  const worst = Math.max(...order.map((id) => Math.abs(factor(t, id))));
  const isAvl = bad.length === 0;
  snap(at('fb.ret'), isAvl ? 'É uma árvore AVL' : 'Não é uma árvore AVL', isAvl
    ? `Todos os nós têm |FB| ≤ 1 (o pior é ${worst}): a árvore é AVL. Altura ${tree.nodes[tree.root].h} para ${plural(tree.nodes.length, 'nó', 'nós')}.`
    : `${plural(bad.length, 'nó tem', 'nós têm')} |FB| > 1: ${list(bad.map((id) => `${val(id)} (FB ${signed(factor(t, id))})`))}. A árvore não é AVL: uma ABB comum pode ficar assim, e é por isso que a AVL rotaciona.`, isAvl ? 'done' : 'warning', {
    foundIndices: [...good], errorIndices: [...bad], output: [isAvl ? 'A árvore é AVL.' : `Não é AVL: ${list(bad.map((id) => `FB(${val(id)}) = ${factor(t, id)}`))}.`],
  });
  return t.finish();
}

// ---------------------------------------------------------------------------------------------
// Rotações
// ---------------------------------------------------------------------------------------------

const canTurn = (tree, id, dir) => isId(id) && isId(tree.nodes[id][dir === 'right' ? 'left' : 'right']);

/** O nó a girar: o escolhido, se puder; senão o primeiro (a partir da raiz) que tenha o filho necessário. */
export function pivotFor(tree, dir, wanted) {
  if (canTurn(tree, wanted, dir)) return wanted;
  return preorder(tree).find((id) => canTurn(tree, id, dir)) ?? null;
}

function rotationSteps(tree, dir, wanted) {
  const r = ROTATION[dir];
  const ctx = makeContext({
    tree, layout: valueLayout(entriesOf(tree)), params: {}, locals: ['raiz', r.pivot, r.child, 'T2'], prog: PROGRAMS[dir === 'right' ? 'rotRight' : 'rotLeft'], main: r.block,
  });
  const { t, snap, val } = ctx;
  const side = dir === 'right' ? 'esquerdo' : 'direito';
  const pivotId = pivotFor(tree, dir, wanted);

  if (pivotId === null) {
    snap(ctx.at(`${r.block}.head`), 'Nenhum nó pode girar', `${tree.nodes.length ? `Nenhum nó desta árvore tem filho ${side}` : 'A árvore está vazia'}: a rotação ${dir === 'right' ? 'à direita' : 'à esquerda'} precisa de um nó com filho ${side}. Mude os valores de entrada.`, 'warning');
    return t.finish();
  }

  const parents = new Map();
  tree.nodes.forEach((node) => ['left', 'right'].forEach((key) => { if (isId(node[key])) parents.set(node[key], { parent: node.id, side: key }); }));
  const before = inorder(tree).map((id) => fmt(tree.nodes[id].value)).join(' ');

  const up = rotate(ctx, dir, pivotId, `Aqui ${r.pivot} é o nó ${val(pivotId)}.`);
  // Quem chamou a função guarda o retorno: no lugar de `raiz` ou do ponteiro do pai.
  const link = parents.get(pivotId);
  if (link) t.setChild(link.parent, link.side, up);
  else t.set('raiz', up);
  t.setAlias();
  const after = inorder({ nodes: t.st.nodes, root: t.st.refs.raiz }).map((id) => fmt(t.node(id).value)).join(' ');
  snap(ctx.at(`${r.block}.ret`), 'O chamador liga o retorno', `${link
    ? `O código que chamou ${r.fn} (por exemplo, nó.${sideName(link.side)} ← ${r.fn}(...)) guarda o retorno: ${val(link.parent)}.${sideName(link.side)} passa a ser ${val(up)}.`
    : `O código que chamou ${r.fn} (raiz ← ${r.fn}(raiz)) guarda o retorno: raiz passa a apontar para ${val(up)}.`} A subárvore girada está no lugar. Percurso em ordem: ${before} antes, ${after} depois — ${before === after ? 'a mesma sequência' : 'diferente (algo deu errado)'}.`, 'done', {
    foundIndices: [up], changedIndices: link ? [link.parent] : [], output: [`em ordem antes: ${before}`, `em ordem depois: ${after}`],
  });
  return t.finish();
}

/** Árvores fixas do simulador dos quatro casos: a ABB depois de inserir `insert`, antes de balancear. */
export const CASE_TREES = {
  LL: { values: [8, 4, 10, 2, 6, 3], insert: 3 },
  RR: { values: [8, 12, 6, 14, 10, 13], insert: 13 },
  LR: { values: [8, 4, 10, 2, 6, 5], insert: 5 },
  RL: { values: [8, 12, 6, 14, 10, 11], insert: 11 },
};

function casesSteps(caseId) {
  const { values, insert } = CASE_TREES[caseId] ?? CASE_TREES.LL;
  const tree = abbTree(values);
  const ctx = makeContext({
    tree, layout: valueLayout(entriesOf(tree)), params: { valor: fmt(insert) }, locals: ['raiz', 'nó', 'y', 'x', 'T2'], prog: PROGRAMS.cases, main: 'cases',
  });
  const { t, snap, val } = ctx;
  const info = CASE_INFO[caseId];
  const root = tree.root;
  const added = values.length - 1;
  const before = inorder(tree).map((id) => fmt(tree.nodes[id].value)).join(' ');

  ctx.frames.push({ text: `inserir(${val(root)}, ${fmt(insert)})`, id: root });
  t.set('nó', root);
  snap(0, `Depois de inserir ${fmt(insert)}`, `A árvore ao lado é o que sobra depois de inserir ${fmt(insert)} e atualizar as alturas pelo caminho de volta: o nó ${val(root)} está com a ${info.side === 'left' ? 'esquerda' : 'direita'} pesada. Falta balancear: é o que o trecho de inserir faz.`, 'neutral', { foundIndices: [added] });

  const { id: up, line } = rebalance(ctx, root, 'insert', insert);
  t.set('raiz', up);
  t.setAlias();
  t.clear(['nó']);
  ctx.frames.pop();
  const after = inorder({ nodes: t.st.nodes, root: up }).map((id) => fmt(t.node(id).value)).join(' ');
  const heightAfter = t.node(up).h;
  snap(line, `Caso ${caseId} resolvido`, `${info.fix.charAt(0).toUpperCase()}${info.fix.slice(1)} deixou ${val(up)} na raiz, com altura ${heightAfter}. O percurso em ordem não mudou (${before}), e agora todos os FB estão entre −1 e 1. ${caseId === 'LL' || caseId === 'RR'
    ? 'Rotação simples: o filho pesado pendia para o mesmo lado do nó.'
    : 'Rotação dupla: o filho pesado pendia para o lado oposto, então uma rotação só deixaria o desequilíbrio do outro lado.'}`, 'done', {
    foundIndices: [up], output: [`caso ${caseId}: ${info.fix}`, `em ordem: ${after}`],
  });
  return t.finish();
}

// ---------------------------------------------------------------------------------------------
// INSERIR (usado por "Inserir um valor" e por "Construir a árvore")
// ---------------------------------------------------------------------------------------------

/**
 * Executa `inserir(valor)`. Com `verbose`, um passo por linha executada; sem ele, só a criação do nó,
 * a ligação ao pai, o desbalanceamento (se houver), cada rotação e o fim.
 */
function insertCore(ctx, valor) {
  const {
    t, frames, val, snap, K, verbose,
  } = ctx;
  const v = fmt(valor);
  const at = (key) => ctx.at(key);
  let created = null;

  const ins = (id) => {
    const empty = !isId(id);
    if (verbose) {
      snap(K('nullTest'), 'Testando se nó é NULL', empty
        ? 'nó é NULL: chegamos a uma referência nula, o ponto de inserção.'
        : `nó aponta para o nó ${val(id)}, que não é NULL: a chamada continua.`, 'comparison', { variables: { 'nó é NULL': empty ? 'VERDADEIRO' : 'FALSO' } });
    }
    if (empty) {
      created = t.create(valor, null, { h: 0 });
      snap(K('retNew'), 'Criando o novo nó', `Retornar novo Nó(valor): o nó ${v} é criado com altura 0 e as duas referências nulas. Ele ainda está solto: só entra na árvore quando quem chamou receber este retorno e ligar o nó ao pai.`, 'reading', { changedIndices: [created] });
      return created;
    }

    const node = t.node(id);
    const less = valor < node.value;
    if (verbose) {
      snap(K('ltTest'), `Comparando ${v} com ${val(id)}`, less
        ? `${v} < ${val(id)} é verdadeiro: o valor vai para a subárvore esquerda.`
        : `${v} < ${val(id)} é falso: o fluxo cai no Senão.`, 'comparison', { variables: { 'valor < nó.valor': less ? 'VERDADEIRO' : 'FALSO' } });
    }
    let key = 'left';
    if (!less) {
      const greater = valor > node.value;
      if (verbose) {
        snap(K('gtTest'), `Comparando ${v} com ${val(id)}`, greater
          ? `${v} > ${val(id)} é verdadeiro: o valor vai para a subárvore direita.`
          : `${v} > ${val(id)} é falso: ${v} = ${val(id)}, o valor já existe.`, 'comparison', { variables: { 'valor > nó.valor': greater ? 'VERDADEIRO' : 'FALSO' } });
      }
      if (!greater) {
        snap(K('dup'), 'Valor repetido', `Retornar nó: ${v} já está na árvore e a AVL não permite valores duplicados. Nada é alterado, e nenhum nó do caminho precisa mudar de altura.`, 'warning', { foundIndices: [id] });
        return id;
      }
      key = 'right';
    }

    const child = node[key];
    const callLine = K(key === 'left' ? 'callL' : 'callR');
    if (verbose) {
      snap(callLine, `Chamando inserir(nó.${sideName(key)}, valor)`, isId(child)
        ? `inserir é chamada de novo, agora para o filho ${sideName(key)} de ${val(id)}, o nó ${val(child)}. A chamada de ${val(id)} fica esperando na pilha.`
        : `inserir é chamada de novo para o filho ${sideName(key)} de ${val(id)}, que é nulo. A chamada de ${val(id)} fica esperando na pilha.`, 'neutral', { changedIndices: isId(child) ? [child] : [] });
    }
    frames.push({ text: `inserir(${val(child)}, ${v})`, id: child });
    t.follow('nó', id, key);
    const returned = ins(child);
    frames.pop();
    t.set('nó', id);

    // nó.esquerdo ← retorno: é aqui que o nó novo (ou a subárvore girada) entra na árvore.
    const changed = returned !== child;
    t.setChild(id, key, returned);
    t.setAlias();
    t.clearFb();
    if (verbose || returned === created) {
      snap(callLine, `Recebendo o retorno de ${val(returned)}`, changed
        ? `A chamada devolveu ${val(returned)}, e nó.${sideName(key)} ← ${val(returned)} liga esse nó como filho ${sideName(key)} de ${val(id)}.${returned === created ? ' O nó novo agora faz parte da árvore.' : ''}`
        : `A chamada devolveu o mesmo nó (${val(returned)}): a ligação de ${val(id)} não muda.`, 'update', { changedIndices: changed ? [id] : [], foundIndices: [returned] });
    }

    const before = node.h;
    const next = heightFrom(t, id);
    t.setHeight(id, next);
    if (verbose) {
      snap(K('height'), 'Atualizando a altura do nó', `altura(nó.esquerdo) = ${alt(t, node.left)} e altura(nó.direito) = ${alt(t, node.right)}: nó.altura ← máximo(${alt(t, node.left)}, ${alt(t, node.right)}) + 1 = ${next}${next === before ? ' (não mudou)' : ` (era ${before})`}.`, 'update', { changedIndices: next === before ? [] : [id], variables: { 'nova altura': next } });
    }

    return rebalance(ctx, id, 'insert', valor).id;
  };

  const L = (key) => at(`insw.${key}`);
  if (verbose) {
    snap(L('head'), 'Chamando inserir(valor)', `inserir(${v}) é executada pelo programa principal. Ela só chama a versão recursiva, a partir da raiz.`, 'neutral');
  }
  frames.push({ text: `inserir(${v})`, id: undefined });
  const root = t.st.refs.raiz;
  if (verbose) {
    snap(L('body'), 'Chamando inserir(raiz, valor)', isId(root)
      ? `raiz ← inserir(raiz, valor) chama a função recursiva para o nó ${val(root)}, a raiz. O parâmetro nó recebe a raiz.`
      : 'raiz ← inserir(raiz, valor) chama a função recursiva com a árvore vazia: o parâmetro nó recebe NULO.', 'neutral');
  }
  frames.push({ text: `inserir(${val(root)}, ${v})`, id: root });
  t.set('nó', root);
  const returned = ins(root);
  frames.pop();
  t.set('raiz', returned);
  t.setAlias();
  t.clear(['nó']);
  t.clearFb();
  snap(L('body'), 'Atribuindo à raiz', `raiz ← ${val(returned)}: a raiz recebe o retorno da chamada${returned === root ? ' (o mesmo nó que já era a raiz)' : `, que agora é o nó ${val(returned)}`}.`, 'update', { changedIndices: [returned], foundIndices: [returned] });
  frames.pop();

  const root2 = t.st.refs.raiz;
  const done = summarize(ctx.rotations);
  if (verbose) {
    snap(L('end'), 'inserir() concluído', created === null
      ? `${v} já existia: a árvore não mudou.`
      : `${v} foi inserido (${done}). A raiz é ${val(root2)} e a altura da árvore é ${t.node(root2).h}.`, created === null ? 'warning' : 'done', {
      foundIndices: created === null ? [] : [created],
      output: [created === null ? `inserir(${v}): valor repetido, nada mudou.` : `inserir(${v}): ${done}; altura da árvore ${t.node(root2).h}.`],
    });
  }
}

function insertSteps(tree, valor) {
  const duplicate = tree.nodes.some((node) => node.value === valor);
  const entries = entriesOf(tree);
  if (!duplicate) entries.push({ id: tree.nodes.length, value: valor });
  const ctx = makeContext({
    tree, layout: valueLayout(entries), params: { valor: fmt(valor) }, locals: ['raiz', 'nó', 'y', 'x', 'T2'], prog: PROGRAMS.insert, main: 'ins',
  });
  insertCore(ctx, valor);
  return ctx.t.finish();
}

function buildAllSteps(values) {
  const ctx = makeContext({
    tree: emptyTree(),
    layout: valueLayout(values.map((value, id) => ({ id, value }))),
    params: { valor: '—' },
    locals: ['raiz', 'nó', 'y', 'x', 'T2'],
    prog: { code: PROGRAMS.build.code, at: BUILD_AT },
    main: 'ins',
    verbose: false,
  });
  const { t, snap } = ctx;

  if (!values.length) {
    snap(0, 'Sequência vazia', 'Sem valores, não há nada a inserir: a árvore continua vazia (raiz = NULO).', 'warning');
    return t.finish();
  }
  snap(0, 'Iniciando a construção', `A árvore começa vazia (raiz = NULO). Serão inseridos ${plural(values.length, 'valor', 'valores')}, na ordem da lista, cada um com o inserir da AVL.`, 'neutral');
  let total = 0;
  values.forEach((valor, index) => {
    t.setParams({ valor: fmt(valor) });
    ctx.frames.length = 0;
    ctx.rotations = [];
    t.clear(['nó', 'y', 'x', 'T2']);
    insertCore(ctx, valor);
    total += turnsOf(ctx.rotations);
    const root = t.st.refs.raiz;
    const rotated = turnsOf(ctx.rotations);
    snap(1, `Inserção de ${fmt(valor)} concluída`, `${fmt(valor)} está na árvore${rotated ? `, com ${summarize(ctx.rotations)} para manter o balanceamento` : ' sem precisar rotacionar'}. Altura da árvore: ${t.node(root).h}.`, index === values.length - 1 ? 'done' : 'update', {
      foundIndices: [index], variables: { altura: t.node(root).h },
    });
  });

  const tree = { nodes: t.st.nodes, root: t.st.refs.raiz };
  const plain = abbTree(values);
  const heightAvl = tree.nodes[tree.root].h;
  const heightAbb = heightOfTree(plain);
  const last = t.finish();
  const final = last.at(-1);
  final.description += ` Altura final: ${heightAvl}; uma ABB comum com os mesmos valores, na mesma ordem, teria altura ${heightAbb}${heightAbb === values.length - 1 && values.length > 2 ? ' (uma cadeia)' : ''}.`;
  final.variables = { ...final.variables, 'altura AVL': heightAvl, 'altura ABB': heightAbb, rotações: total };
  final.output = [`altura da AVL: ${heightAvl}`, `altura da ABB comum: ${heightAbb}`, `rotações feitas: ${total}`];
  return last;
}

// ---------------------------------------------------------------------------------------------
// REMOVER
// ---------------------------------------------------------------------------------------------

function removeSteps(tree, valor) {
  const ctx = makeContext({
    tree, layout: valueLayout(entriesOf(tree)), params: { valor: fmt(valor) }, locals: ['raiz', 'nó', 'temp', 'y', 'x', 'T2'], prog: PROGRAMS.remove, main: 'rem',
  });
  const {
    t, frames, val, snap, K,
  } = ctx;
  const v = fmt(valor);
  let kind = null; // o que foi removido: uma folha, um nó com um filho ou com dois

  /** Restaura `nó` e `temp` de quem chamou, depois que a chamada de baixo saiu da pilha. */
  const resume = (frame) => {
    t.set('nó', frame.id);
    if (frame.temp === undefined) t.clear(['temp']);
    else t.set('temp', frame.temp);
  };

  /**
   * Chama `remover` para o filho `key` de `cur` e liga o retorno (`nó.esquerdo ← remover(...)`). Devolve o
   * que a chamada devolveu; o nó que saiu da árvore é solto no passo seguinte ao da ligação.
   */
  const descend = (frame, cur, key, callLine, valueText, valorAlvo) => {
    const child = t.node(cur)[key];
    frames.push({ text: `remover(${val(child)}, ${valueText})`, id: child });
    t.follow('nó', cur, key);
    const inner = rem(frames.at(-1), valorAlvo);
    frames.pop();
    resume(frame);
    t.setChild(cur, key, inner.id);
    t.setAlias();
    t.clearFb();
    const sameNode = inner.id === child;
    snap(callLine, 'Recebendo o retorno', sameNode
      ? `A chamada devolveu o mesmo nó (${val(inner.id)}): a ligação de ${val(cur)} não muda.`
      : `A chamada devolveu ${val(inner.id)}: nó.${sideName(key)} ← ${val(inner.id)}${isId(inner.removed) ? `. O nó ${val(inner.removed)} deixou de ser alcançado a partir da raiz.` : '.'}`, 'update', {
      changedIndices: sameNode ? [] : [cur], foundIndices: isId(inner.id) ? [inner.id] : [],
    });
    if (isId(inner.removed)) t.drop(inner.removed);
  };

  /** Uma chamada de `remover(nó, valor)`. Devolve `{ id, removed }`: o nó que fica no lugar e o que saiu. */
  const rem = (frame, target) => {
    let cur = frame.id; // o nó que a variável `nó` aponta agora
    const tv = fmt(target);
    const empty = !isId(cur);
    snap(K('nullTest1'), 'Testando se nó é NULL', empty
      ? 'nó é NULL: chegamos ao fim do caminho sem achar o valor.'
      : `nó aponta para o nó ${val(cur)}, que não é NULL: a chamada continua.`, 'comparison', { variables: { 'nó é NULL': empty ? 'VERDADEIRO' : 'FALSO' } });
    if (empty) {
      snap(K('retNull1'), 'Valor não encontrado', `Retornar nó: nada a remover, ${tv} não está nesta subárvore. A chamada devolve NULL e o chamador mantém a ligação que já tinha.`, 'warning');
      return { id: null, removed: null };
    }

    const less = target < t.node(cur).value;
    snap(K('ltTest'), `Comparando ${tv} com ${val(cur)}`, less
      ? `${tv} < ${val(cur)} é verdadeiro: o valor, se existir, está na subárvore esquerda.`
      : `${tv} < ${val(cur)} é falso: o fluxo cai no Senão.`, 'comparison', { variables: { 'valor < nó.valor': less ? 'VERDADEIRO' : 'FALSO' } });

    let key = less ? 'left' : null;
    if (!less) {
      const greater = target > t.node(cur).value;
      snap(K('gtTest'), `Comparando ${tv} com ${val(cur)}`, greater
        ? `${tv} > ${val(cur)} é verdadeiro: o valor, se existir, está na subárvore direita.`
        : `${tv} > ${val(cur)} é falso: ${tv} = ${val(cur)}, este é o nó a remover.`, 'comparison', { variables: { 'valor > nó.valor': greater ? 'VERDADEIRO' : 'FALSO' } });
      if (greater) key = 'right';
    }

    if (key) {
      const child = t.node(cur)[key];
      const callLine = K(key === 'left' ? 'callL' : 'callR');
      snap(callLine, `Chamando remover(nó.${sideName(key)}, valor)`, `remover é chamada de novo para o filho ${sideName(key)} de ${val(cur)}${isId(child) ? `, o nó ${val(child)}` : ', que é nulo'}. A chamada de ${val(cur)} fica esperando na pilha.`, 'neutral', { changedIndices: isId(child) ? [child] : [] });
      descend(frame, cur, key, callLine, tv, target);
    } else {
      // Achou o nó a remover.
      const { left, right } = t.node(cur);
      const one = !isId(left) || !isId(right);
      snap(K('oneTest'), 'Contando os filhos do nó', one
        ? `${val(cur)} tem no máximo um filho: o caso de uma folha ou de um filho só.`
        : `${val(cur)} tem os dois filhos: o caso do nó com dois filhos.`, 'comparison', { variables: { 'um filho ou nenhum': one ? 'VERDADEIRO' : 'FALSO' } });

      if (one) {
        const hasLeft = isId(left);
        snap(K('leftTest'), 'Escolhendo o filho que fica', hasLeft ? 'nó.esquerdo ≠ NULL: o filho esquerdo é quem ocupará o lugar.' : 'nó.esquerdo é NULL: o filho que sobra (se houver) é o direito.', 'comparison', { variables: { 'nó.esquerdo ≠ NULL': hasLeft ? 'VERDADEIRO' : 'FALSO' } });
        const temp = t.follow('temp', cur, hasLeft ? 'left' : 'right');
        frame.temp = temp;
        snap(K(hasLeft ? 'tempL' : 'tempR'), `temp ← nó.${hasLeft ? 'esquerdo' : 'direito'}`, `temp recebe o filho ${hasLeft ? 'esquerdo' : 'direito'} de ${val(cur)}${isId(temp) ? `: o nó ${val(temp)}` : ', que é nulo'}.`, 'update');
        snap(K('tempNull'), 'Testando se temp é NULL', isId(temp)
          ? `temp é ${val(temp)}, não é NULL: ${val(cur)} tem um filho.`
          : 'temp é NULL: o nó não tem filhos, é uma folha.', 'comparison', { variables: { 'temp é NULL': isId(temp) ? 'FALSO' : 'VERDADEIRO' } });
        if (!isId(temp)) {
          t.set('temp', cur);
          frame.temp = cur;
          snap(K('tempSelf'), 'temp ← nó', `temp guarda o nó ${val(cur)}, o que vai sair da árvore.`, 'update');
          t.set('nó', null);
          kind = kind ?? 'uma folha';
          frame.removed = cur;
          snap(K('nodeNull'), 'nó ← NULL', `nó passa a ser NULL. A folha ${val(cur)} ainda está ligada ao pai: ela só sai da árvore quando o pai receber o NULL de volta.`, 'update', { dimIndices: [cur], activeIndices: [] });
          cur = null;
        } else {
          t.set('nó', temp);
          frame.removed = cur;
          kind = kind ?? 'um nó com um filho';
          snap(K('nodeTemp'), 'nó ← temp', `nó passa a apontar para o filho ${val(temp)}. O nó ${val(cur)} será substituído por ele quando o pai receber o retorno.`, 'update', { dimIndices: [cur], activeIndices: [temp] });
          cur = temp;
        }
      } else {
        let suc = right;
        const path = [suc];
        while (isId(t.node(suc).left)) {
          suc = t.node(suc).left;
          path.push(suc);
        }
        t.set('temp', suc);
        frame.temp = suc;
        kind = 'um nó com dois filhos';
        snap(K('minCall'), 'temp ← menorValorNo(nó.direito)', `menorValorNo desce sempre pela esquerda a partir de ${val(right)}${path.length > 1 ? ` (${list(path.map(val))})` : ''} e devolve o menor valor da subárvore direita: ${val(suc)}. temp aponta para esse nó, o sucessor em ordem de ${val(cur)}.`, 'update', { foundIndices: [suc], hotEdges: path });
        const old = val(cur);
        t.setValue(cur, t.node(suc).value);
        snap(K('copy'), 'nó.valor ← temp.valor', `O valor de ${val(suc)} é copiado para o nó que guardava ${old}. Por enquanto o valor ${val(cur)} existe em dois nós; a estrutura ainda não mudou.`, 'update', { changedIndices: [cur], foundIndices: [suc] });
        snap(K('callSuc'), 'Chamando remover(nó.direito, temp.valor)', `remover é chamada para a subárvore direita de ${val(cur)}, agora para remover o valor ${val(cur)} do nó sucessor (que tem no máximo um filho, o direito).`, 'neutral', { changedIndices: [right] });
        descend(frame, cur, 'right', K('callSuc'), val(cur), t.node(cur).value);
      }
    }

    // Depois da busca/remoção: se o nó sumiu, retorna NULL; senão atualiza a altura e rebalanceia.
    const gone = !isId(cur);
    const dim = isId(frame.removed) ? [frame.removed] : [];
    snap(K('nullTest2'), 'Testando se nó foi removido', gone
      ? 'nó é NULL: a folha foi removida, não há mais nada a atualizar neste nível.'
      : `nó (${val(cur)}) não é NULL: ainda há altura e balanceamento a conferir.`, 'comparison', { variables: { 'nó é NULL': gone ? 'VERDADEIRO' : 'FALSO' }, dimIndices: dim });
    if (gone) {
      snap(K('retNull2'), 'Retornando NULL', `Retornar nó: devolve NULL. Quem chamou vai guardar NULL no lugar do ponteiro para ${val(frame.removed)}.`, 'update', { dimIndices: dim, activeIndices: [] });
      return { id: null, removed: frame.removed };
    }

    const node = t.node(cur);
    const before = node.h;
    const next = heightFrom(t, cur);
    t.setHeight(cur, next);
    snap(K('height'), 'Atualizando a altura do nó', `altura(nó.esquerdo) = ${alt(t, node.left)} e altura(nó.direito) = ${alt(t, node.right)}: nó.altura ← máximo(${alt(t, node.left)}, ${alt(t, node.right)}) + 1 = ${next}${next === before ? ' (não mudou)' : ` (era ${before})`}.`, 'update', { changedIndices: next === before ? [] : [cur], dimIndices: dim, variables: { 'nova altura': next } });

    return { id: rebalance(ctx, cur, 'remove').id, removed: frame.removed };
  };

  const L = (key) => ctx.at(`remw.${key}`);
  snap(L('head'), 'Chamando remover(valor)', `remover(${v}) é executada pelo programa principal. Ela só chama a versão recursiva, a partir da raiz.`, 'neutral');
  frames.push({ text: `remover(${v})`, id: undefined });
  const root = t.st.refs.raiz;
  snap(L('body'), 'Chamando remover(raiz, valor)', isId(root)
    ? `raiz ← remover(raiz, valor) chama a função recursiva para a raiz, o nó ${val(root)}.`
    : 'raiz ← remover(raiz, valor) chama a função recursiva com a árvore vazia: o parâmetro nó recebe NULO.', 'neutral');
  const top = { text: `remover(${val(root)}, ${v})`, id: root };
  frames.push(top);
  t.set('nó', root);
  const result = rem(top, valor);
  frames.pop();
  t.set('raiz', result.id);
  t.setAlias();
  t.clear(['nó', 'temp', 'y', 'x', 'T2']);
  t.clearFb();
  snap(L('body'), 'Atribuindo à raiz', `raiz ← ${val(result.id)}: a raiz recebe o retorno da chamada${!isId(result.id) ? ': a árvore ficou vazia' : result.id === root ? ' (o mesmo nó que já era a raiz)' : `, que agora é o nó ${val(result.id)}`}.`, 'update', { foundIndices: isId(result.id) ? [result.id] : [] });
  if (isId(result.removed)) t.drop(result.removed);
  frames.pop();

  const rootNow = t.st.refs.raiz;
  const done = summarize(ctx.rotations);
  snap(L('end'), 'remover() concluído', kind
    ? `${v} foi removido (${kind}; ${done}). ${isId(rootNow) ? `A raiz é ${val(rootNow)} e a altura da árvore é ${t.node(rootNow).h}.` : 'A árvore ficou vazia.'}`
    : `${v} não está na árvore: nada foi removido, e nenhum nó mudou de altura.`, kind ? 'done' : 'warning', {
    foundIndices: isId(rootNow) && kind ? [rootNow] : [],
    output: [kind ? `remover(${v}) removeu ${kind}; ${done}.` : `remover(${v}): valor não encontrado; a árvore não mudou.`],
  });
  return t.finish();
}
// ---------------------------------------------------------------------------------------------

export function buildSteps(id, data, config) {
  const { values, balanced } = data;
  const tree = () => initialTree(values, balanced);
  switch (id) {
    case 'balance': return balanceSteps(tree());
    case 'rotRight': return rotationSteps(tree(), 'right', config.pivot);
    case 'rotLeft': return rotationSteps(tree(), 'left', config.pivot);
    case 'cases': return casesSteps(config.caseId);
    case 'insert': return insertSteps(tree(), config.insertValue);
    case 'build': return buildAllSteps(values);
    case 'remove': return removeSteps(tree(), config.removeValue);
    default: return balanceSteps(tree());
  }
}
