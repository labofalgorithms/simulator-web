// `?v=2`: a AVL depende de funções novas de tree-scene.js (`setHeight`, `setFb`, `setAlias`). O `?v=` é
// outra URL, então o navegador busca uma cópia nova em vez de usar a antiga que guardou das outras
// páginas de árvore (o `python -m http.server` não manda cabeçalhos de cache). Os dois arquivos da AVL
// usam o mesmo texto de propósito, para a página carregar uma cópia só.
import {
  buildTree, fmt, heightOf, inorder, preorder, treeTrace,
} from '../shared/tree-scene.js?v=2';
import { tr } from '../../core/i18n.js';

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
const sideName = (key) => (key === 'left' ? tr('esquerdo', 'left') : tr('direito', 'right'));
const signed = (n) => (n > 0 ? `+${n}` : String(n));
const turnsOf = (rotations) => rotations.reduce((sum, item) => sum + item.turns, 0);
/** "2 rotações (LR em 50)" ou "sem rotações": os casos de balanceamento que a operação resolveu. */
const summarize = (rotations) => (rotations.length
  ? `${plural(turnsOf(rotations), tr('rotação', 'rotation'), tr('rotações', 'rotations'))} (${list(rotations.map((item) => tr(`${item.case} em ${item.at}`, `${item.case} at ${item.at}`)))})`
  : tr('sem rotações', 'no rotations'));

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
    [tr('Função altura(nó)', 'Function height(node)'), 'head'],
    tr('  Se nó é NULL então', '  If node is NULL then'),
    tr('    // Para nós inexistentes, a altura é -1', '    // For nonexistent nodes, the height is -1'),
    [tr('    Retornar -1', '    Return -1'), 'nullRet'],
    tr('  Fim se', '  End if'),
    [tr('  Retornar nó.altura', '  Return node.height'), 'ret'],
    tr('Fim Função', 'End Function'),
  ],
};

const FB = {
  name: 'fb',
  lines: [
    [tr('Função fatorDeBalanceamento(nó)', 'Function balanceFactor(node)'), 'head'],
    tr('  Se nó é NULL então', '  If node is NULL then'),
    [tr('    Retornar 0', '    Return 0'), 'nullRet'],
    tr('  Fim se', '  End if'),
    [tr('  Retornar altura(nó.esquerdo) - altura(nó.direito)', '  Return height(node.left) - height(node.right)'), 'ret'],
    tr('Fim Função', 'End Function'),
  ],
};

const ROT_DIR = {
  name: 'rotR',
  lines: [
    [tr('Função rotacaoDireita(y)', 'Function rotateRight(y)'), 'head'],
    [tr('  x ← y.esquerdo', '  x ← y.left'), 'child'],
    [tr('  T2 ← x.direito', '  T2 ← x.right'), 't2'],
    tr('  // Realiza a rotação', '  // Performs the rotation'),
    [tr('  x.direito ← y', '  x.right ← y'), 'l1'],
    [tr('  y.esquerdo ← T2', '  y.left ← T2'), 'l2'],
    tr('  // Atualiza alturas', '  // Updates the heights'),
    [tr('  y.altura ← máximo(altura(y.esquerdo), altura(y.direito)) + 1', '  y.height ← max(height(y.left), height(y.right)) + 1'), 'h1'],
    [tr('  x.altura ← máximo(altura(x.esquerdo), altura(x.direito)) + 1', '  x.height ← max(height(x.left), height(x.right)) + 1'), 'h2'],
    [tr('  Retornar x // Nova raiz após rotação', '  Return x // New root after the rotation'), 'ret'],
    tr('Fim Função', 'End Function'),
  ],
};

const ROT_ESQ = {
  name: 'rotL',
  lines: [
    [tr('Função rotacaoEsquerda(x)', 'Function rotateLeft(x)'), 'head'],
    [tr('  y ← x.direito', '  y ← x.right'), 'child'],
    [tr('  T2 ← y.esquerdo', '  T2 ← y.left'), 't2'],
    tr('  // Realiza a rotação', '  // Performs the rotation'),
    [tr('  y.esquerdo ← x', '  y.left ← x'), 'l1'],
    [tr('  x.direito ← T2', '  x.right ← T2'), 'l2'],
    tr('  // Atualiza alturas', '  // Updates the heights'),
    [tr('  x.altura ← máximo(altura(x.esquerdo), altura(x.direito)) + 1', '  x.height ← max(height(x.left), height(x.right)) + 1'), 'h1'],
    [tr('  y.altura ← máximo(altura(y.esquerdo), altura(y.direito)) + 1', '  y.height ← max(height(y.left), height(y.right)) + 1'), 'h2'],
    [tr('  Retornar y // Nova raiz após rotação', '  Return y // New root after the rotation'), 'ret'],
    tr('Fim Função', 'End Function'),
  ],
};

// O trecho de `inserir` que balanceia o nó: é também o código do simulador dos quatro casos.
const INSERT_BALANCE = [
  tr('  // Calcula o fator de balanceamento', '  // Computes the balance factor'),
  [tr('  FatorDeBalanceamento ← fatorDeBalanceamento(nó)', '  BalanceFactor ← balanceFactor(node)'), 'fb'],
  tr('  // Caso LL', '  // Case LL'),
  [tr('  Se FatorDeBalanceamento > 1 e valor < nó.esquerdo.valor então', '  If BalanceFactor > 1 and value < node.left.value then'), 'llTest'],
  [tr('    Retornar rotacaoDireita(nó)', '    Return rotateRight(node)'), 'llRet'],
  tr('  Fim se', '  End if'),
  tr('  // Caso RR', '  // Case RR'),
  [tr('  Se FatorDeBalanceamento < -1 e valor > nó.direito.valor então', '  If BalanceFactor < -1 and value > node.right.value then'), 'rrTest'],
  [tr('    Retornar rotacaoEsquerda(nó)', '    Return rotateLeft(node)'), 'rrRet'],
  tr('  Fim se', '  End if'),
  tr('  // Caso LR', '  // Case LR'),
  [tr('  Se FatorDeBalanceamento > 1 e valor > nó.esquerdo.valor então', '  If BalanceFactor > 1 and value > node.left.value then'), 'lrTest'],
  [tr('    nó.esquerdo ← rotacaoEsquerda(nó.esquerdo)', '    node.left ← rotateLeft(node.left)'), 'lrRot1'],
  [tr('    Retornar rotacaoDireita(nó)', '    Return rotateRight(node)'), 'lrRet'],
  tr('  Fim se', '  End if'),
  tr('  // Caso RL', '  // Case RL'),
  [tr('  Se FatorDeBalanceamento < -1 e valor < nó.direito.valor então', '  If BalanceFactor < -1 and value < node.right.value then'), 'rlTest'],
  [tr('    nó.direito ← rotacaoDireita(nó.direito)', '    node.right ← rotateRight(node.right)'), 'rlRot1'],
  [tr('    Retornar rotacaoEsquerda(nó)', '    Return rotateLeft(node)'), 'rlRet'],
  tr('  Fim se', '  End if'),
  [tr('  Retornar nó', '  Return node'), 'retNode'],
];

const INS_WRAP = {
  name: 'insw',
  lines: [[tr('Função inserir(valor)', 'Function insert(value)'), 'head'], [tr('  raiz ← inserir(raiz, valor)', '  root ← insert(root, value)'), 'body'], [tr('Fim função', 'End function'), 'end']],
};

const INS = {
  name: 'ins',
  lines: [
    [tr('Função inserir(nó, valor)', 'Function insert(node, value)'), 'head'],
    [tr('  Se nó é NULL então', '  If node is NULL then'), 'nullTest'],
    [tr('    Retornar novo Nó(valor) com altura = 0', '    Return new Node(value) with height = 0'), 'retNew'],
    tr('  Fim se', '  End if'),
    [tr('  Se valor < nó.valor então', '  If value < node.value then'), 'ltTest'],
    [tr('    nó.esquerdo ← inserir(nó.esquerdo, valor)', '    node.left ← insert(node.left, value)'), 'callL'],
    tr('  Senão', '  Else'),
    [tr('    Se valor > nó.valor então', '    If value > node.value then'), 'gtTest'],
    [tr('      nó.direito ← inserir(nó.direito, valor)', '      node.right ← insert(node.right, value)'), 'callR'],
    tr('    Senão', '    Else'),
    [tr('      Retornar nó // Não permite valores duplicados', '      Return node // Does not allow duplicate values'), 'dup'],
    tr('    Fim se', '    End if'),
    tr('  Fim se', '  End if'),
    tr('  // Atualiza a altura do nó pai', '  // Updates the height of the parent node'),
    [tr('  nó.altura ← máximo(altura(nó.esquerdo), altura(nó.direito)) + 1', '  node.height ← max(height(node.left), height(node.right)) + 1'), 'height'],
    ...INSERT_BALANCE,
    tr('Fim Função', 'End Function'),
  ],
};

const CASES = {
  name: 'cases',
  lines: [
    tr('// Trecho de inserir(nó, valor): balanceia o nó', '// Excerpt of insert(node, value): balances the node'),
    ...INSERT_BALANCE,
  ],
};

const REM_WRAP = {
  name: 'remw',
  lines: [[tr('Função remover(valor)', 'Function remove(value)'), 'head'], [tr('  raiz ← remover(raiz, valor)', '  root ← remove(root, value)'), 'body'], [tr('Fim função', 'End function'), 'end']],
};

const REM = {
  name: 'rem',
  lines: [
    [tr('Função remover(nó, valor)', 'Function remove(node, value)'), 'head'],
    [tr('  Se nó é NULL então', '  If node is NULL then'), 'nullTest1'],
    [tr('    Retornar nó // Nada a remover, retorno NULL', '    Return node // Nothing to remove, returns NULL'), 'retNull1'],
    tr('  Fim Se', '  End If'),
    [tr('  Se valor < nó.valor então', '  If value < node.value then'), 'ltTest'],
    [tr('    nó.esquerdo ← remover(nó.esquerdo, valor) // Busca na subárvore esquerda', '    node.left ← remove(node.left, value) // Searches the left subtree'), 'callL'],
    tr('  Senão', '  Else'),
    [tr('    Se valor > nó.valor então', '    If value > node.value then'), 'gtTest'],
    [tr('      nó.direito ← remover(nó.direito, valor) // Busca na subárvore direita', '      node.right ← remove(node.right, value) // Searches the right subtree'), 'callR'],
    tr('    Senão', '    Else'),
    tr('      // Nó com um ou nenhum filho', '      // Node with one or no children'),
    [tr('      Se nó.esquerdo é NULL ou nó.direito é NULL então', '      If node.left is NULL or node.right is NULL then'), 'oneTest'],
    [tr('        Se nó.esquerdo ≠ NULL então', '        If node.left ≠ NULL then'), 'leftTest'],
    [tr('          temp ← nó.esquerdo', '          temp ← node.left'), 'tempL'],
    tr('        Senão', '        Else'),
    [tr('          temp ← nó.direito', '          temp ← node.right'), 'tempR'],
    tr('        Fim Se', '        End If'),
    [tr('        Se temp é NULL então // Caso de nó sem filhos', '        If temp is NULL then // Case of a node with no children'), 'tempNull'],
    [tr('          temp ← nó', '          temp ← node'), 'tempSelf'],
    [tr('          nó ← NULL', '          node ← NULL'), 'nodeNull'],
    tr('        Senão', '        Else'),
    [tr('          nó ← temp // Nó com um filho', '          node ← temp // Node with one child'), 'nodeTemp'],
    tr('        Fim Se', '        End If'),
    tr('      Senão // Nó com dois filhos', '      Else // Node with two children'),
    [tr('        temp ← menorValorNo(nó.direito) // Encontra o menor valor', '        temp ← minValueNode(node.right) // Finds the smallest value'), 'minCall'],
    [tr('        nó.valor ← temp.valor', '        node.value ← temp.value'), 'copy'],
    [tr('        nó.direito ← remover(nó.direito, temp.valor) // Remove o nó substituto', '        node.right ← remove(node.right, temp.value) // Removes the replacement node'), 'callSuc'],
    tr('      Fim Se', '      End If'),
    tr('    Fim Se', '    End If'),
    tr('  Fim Se', '  End If'),
    tr('  // Se o nó foi removido e agora é NULL, retornar', '  // If the node was removed and is now NULL, return'),
    [tr('  Se nó é NULL então', '  If node is NULL then'), 'nullTest2'],
    [tr('    Retornar nó', '    Return node'), 'retNull2'],
    tr('  Fim Se', '  End If'),
    tr('  // Atualiza a altura do nó atual', '  // Updates the height of the current node'),
    [tr('  nó.altura ← máximo(altura(nó.esquerdo), altura(nó.direito)) + 1', '  node.height ← max(height(node.left), height(node.right)) + 1'), 'height'],
    tr('  // Calcula o fator de balanceamento', '  // Computes the balance factor'),
    [tr('  balance ← fatorDeBalanceamento(nó)', '  balance ← balanceFactor(node)'), 'fb'],
    tr('  // Caso LL', '  // Case LL'),
    [tr('  Se balance > 1 e fatorDeBalanceamento(nó.esquerdo) ≥ 0 então', '  If balance > 1 and balanceFactor(node.left) ≥ 0 then'), 'llTest'],
    [tr('    Retornar rotacaoDireita(nó)', '    Return rotateRight(node)'), 'llRet'],
    tr('  Fim Se', '  End If'),
    tr('  // Caso LR', '  // Case LR'),
    [tr('  Se balance > 1 e fatorDeBalanceamento(nó.esquerdo) < 0 então', '  If balance > 1 and balanceFactor(node.left) < 0 then'), 'lrTest'],
    [tr('    nó.esquerdo ← rotacaoEsquerda(nó.esquerdo)', '    node.left ← rotateLeft(node.left)'), 'lrRot1'],
    [tr('    Retornar rotacaoDireita(nó)', '    Return rotateRight(node)'), 'lrRet'],
    tr('  Fim Se', '  End If'),
    tr('  // Caso RR', '  // Case RR'),
    [tr('  Se balance < -1 e fatorDeBalanceamento(nó.direito) ≤ 0 então', '  If balance < -1 and balanceFactor(node.right) ≤ 0 then'), 'rrTest'],
    [tr('    Retornar rotacaoEsquerda(nó)', '    Return rotateLeft(node)'), 'rrRet'],
    tr('  Fim Se', '  End If'),
    tr('  // Caso RL', '  // Case RL'),
    [tr('  Se balance < -1 e fatorDeBalanceamento(nó.direito) > 0 então', '  If balance < -1 and balanceFactor(node.right) > 0 then'), 'rlTest'],
    [tr('    nó.direito ← rotacaoDireita(nó.direito)', '    node.right ← rotateRight(node.right)'), 'rlRot1'],
    [tr('    Retornar rotacaoEsquerda(nó)', '    Return rotateLeft(node)'), 'rlRet'],
    tr('  Fim Se', '  End If'),
    [tr('  Retornar nó', '  Return node'), 'retNode'],
    tr('Fim Função', 'End Function'),
  ],
};

// Os slides chamam `menorValorNo` sem mostrar o código; este é o do projeto Java da aula.
const MENOR = {
  name: 'min',
  lines: [
    tr('Função menorValorNo(nó)', 'Function minValueNode(node)'),
    tr('  atual ← nó', '  current ← node'),
    tr('  Enquanto atual.esquerdo ≠ NULL faça', '  While current.left ≠ NULL do'),
    tr('    atual ← atual.esquerdo', '    current ← current.left'),
    tr('  Fim Enquanto', '  End While'),
    tr('  Retornar atual', '  Return current'),
    tr('Fim Função', 'End Function'),
  ],
};

const BUILD = {
  name: 'build',
  lines: [tr('Para cada valor na sequência de entrada faça', 'For each value in the input sequence do'), tr('  inserir(valor)', '  insert(value)'), tr('Fim para', 'End for')],
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
    id: 'balance', title: tr('Altura e fator de balanceamento', 'Height and balance factor'), menuLabel: tr('altura() · FB', 'height() · BF'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('A altura de um nó conta as arestas até a folha mais distante: o nó nulo vale −1 e uma folha vale 0. O fator de balanceamento (FB) é a altura da esquerda menos a da direita. Uma árvore é AVL quando |FB| ≤ 1 em todos os nós.', 'The height of a node counts the edges down to the farthest leaf: the null node is −1 and a leaf is 0. The balance factor (BF) is the height of the left minus that of the right. A tree is AVL when |BF| ≤ 1 at every node.'),
    interaction: tr('Monte a mesma sequência pelos dois caminhos: com inserção AVL todo FB fica entre −1 e 1; com inserção de ABB comum (por exemplo, valores em ordem crescente) aparecem nós com |FB| > 1. FB positivo quer dizer esquerda mais alta.', 'Build the same sequence both ways: with AVL insertion every BF stays between −1 and 1; with plain BST insertion (for example, values in ascending order) nodes with |BF| > 1 appear. A positive BF means the left side is taller.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Com a altura guardada em cada nó, calcular o FB de um nó custa O(1) (duas leituras). Conferir a árvore inteira custa O(n).', 'With the height stored in each node, computing the BF of a node costs O(1) (two reads). Checking the whole tree costs O(n).') },
    pseudocode: PROGRAMS.balance.code,
  },
  {
    id: 'rotRight', title: tr('Rotação simples à direita (rotacaoDireita)', 'Single right rotation (rotateRight)'), menuLabel: tr('rotacaoDireita(y)', 'rotateRight(y)'), group: tr('Rotações', 'Rotations'), number: '02',
    description: tr('O filho esquerdo x de y sobe para o lugar dele e y desce para a direita de x. A subárvore T2, que era a direita de x, passa a ser a esquerda de y. A ordem em ordem da árvore não muda.', 'The left child x of y goes up to take its place and y goes down to the right of x. The subtree T2, which was the right of x, becomes the left of y. The in-order sequence of the tree does not change.'),
    interaction: tr('Clique em um nó para escolher o y (ele precisa ter filho esquerdo). Repare que a posição horizontal dos nós nunca muda: a rotação só troca os níveis, e o percurso em ordem sai igual antes e depois.', 'Click a node to choose y (it must have a left child). Notice that the horizontal position of the nodes never changes: the rotation only swaps the levels, and the in-order traversal comes out the same before and after.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Uma rotação só religa três ponteiros e recalcula duas alturas, qualquer que seja o tamanho das subárvores.', 'A rotation only relinks three pointers and recalculates two heights, whatever the size of the subtrees.') },
    pseudocode: PROGRAMS.rotRight.code,
  },
  {
    id: 'rotLeft', title: tr('Rotação simples à esquerda (rotacaoEsquerda)', 'Single left rotation (rotateLeft)'), menuLabel: tr('rotacaoEsquerda(x)', 'rotateLeft(x)'), group: tr('Rotações', 'Rotations'), number: '03',
    description: tr('É a rotação espelhada: o filho direito y de x sobe para o lugar dele e x desce para a esquerda de y. A subárvore T2, que era a esquerda de y, passa a ser a direita de x.', 'It is the mirrored rotation: the right child y of x goes up to take its place and x goes down to the left of y. The subtree T2, which was the left of y, becomes the right of x.'),
    interaction: tr('Clique em um nó para escolher o x (ele precisa ter filho direito). Compare com a rotação à direita: os papéis de esquerda e direita se trocam e o resto é igual.', 'Click a node to choose x (it must have a right child). Compare with the right rotation: the roles of left and right swap and the rest is the same.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Uma rotação só religa três ponteiros e recalcula duas alturas, qualquer que seja o tamanho das subárvores.', 'A rotation only relinks three pointers and recalculates two heights, whatever the size of the subtrees.') },
    pseudocode: PROGRAMS.rotLeft.code,
  },
  {
    id: 'cases', title: tr('Os quatro casos de desbalanceamento', 'The four imbalance cases'), menuLabel: tr('LL · RR · LR · RL', 'LL · RR · LR · RL'), group: tr('Rotações', 'Rotations'), number: '04',
    description: tr('Um nó com |FB| = 2 é consertado por uma rotação simples quando o filho pesado pende para o mesmo lado (LL e RR) e por uma rotação dupla quando pende para o lado oposto (LR e RL): primeiro a rotação no filho, depois a do nó.', 'A node with |BF| = 2 is fixed by a single rotation when the heavy child leans to the same side (LL and RR) and by a double rotation when it leans to the opposite side (LR and RL): first the rotation on the child, then the one on the node.'),
    interaction: tr('Escolha um dos quatro casos. A árvore é a que sobra depois de uma inserção, antes de balancear: veja o sinal do FB do nó e do filho e quais rotações o código escolhe.', 'Choose one of the four cases. The tree is what is left after an insertion, before balancing: see the sign of the BF of the node and of the child and which rotations the code picks.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Decidir o caso custa quatro comparações e consertar custa uma ou duas rotações, cada uma de tempo constante.', 'Deciding the case costs four comparisons and fixing it costs one or two rotations, each of constant time.') },
    pseudocode: PROGRAMS.cases.code,
  },
  {
    id: 'insert', title: tr('Inserir um valor (inserir)', 'Insert a value (insert)'), menuLabel: tr('inserir(valor)', 'insert(value)'), group: tr('Inserção', 'Insertion'), number: '05',
    description: tr('Insere como numa ABB, de forma recursiva. No caminho de volta, cada nó atualiza a altura, calcula o FB e, se |FB| > 1, aplica uma rotação (simples ou dupla). Valores repetidos são ignorados.', 'Insert as in a BST, recursively. On the way back, each node updates its height, computes the BF and, if |BF| > 1, applies a rotation (single or double). Repeated values are ignored.'),
    interaction: tr('Use os exemplos da aula para ver cada caso: LL, RR, LR e RL. Clique em um nó da árvore para repetir o valor dele e ver a inserção ser recusada. A pilha de chamadas mostra a recursão.', 'Use the lesson examples to see each case: LL, RR, LR and RL. Click a tree node to repeat its value and see the insertion being refused. The call stack shows the recursion.'),
    complexity: { time: 'O(log n)', space: 'O(log n)', note: tr('A altura de uma AVL é O(log n): a inserção desce uma vez e volta atualizando alturas, com no máximo uma rotação (simples ou dupla). A pilha tem um frame por nível.', 'The height of an AVL is O(log n): the insertion goes down once and comes back updating heights, with at most one rotation (single or double). The stack has one frame per level.') },
    pseudocode: PROGRAMS.insert.code,
  },
  {
    id: 'build', title: tr('Construir a árvore (inserções em sequência)', 'Build the tree (insertions in sequence)'), menuLabel: tr('Construir a AVL', 'Build the AVL'), group: tr('Inserção', 'Insertion'), number: '06',
    description: tr('Insira os valores na ordem da lista e veja quando a árvore precisa rotacionar. Compare a altura final com a de uma ABB comum feita com os mesmos valores.', 'Insert the values in the order of the list and see when the tree needs to rotate. Compare the final height with that of a plain BST built from the same values.'),
    interaction: tr('Use os exercícios da aula (por exemplo, 50, 30, 70, 20, 40, 10) e depois valores em ordem crescente: a ABB vira uma cadeia, a AVL continua baixa.', 'Use the lesson exercises (for example, 50, 30, 70, 20, 40, 10) and then values in ascending order: the BST becomes a chain, the AVL stays short.'),
    complexity: { time: 'O(n log n)', space: 'O(n)', note: tr('Cada uma das n inserções custa O(log n) numa AVL; numa ABB comum, com valores em ordem, custaria O(n) cada e o total seria O(n²).', 'Each of the n insertions costs O(log n) in an AVL; in a plain BST, with values in order, each would cost O(n) and the total would be O(n²).') },
    pseudocode: PROGRAMS.build.code,
  },
  {
    id: 'remove', title: tr('Remover um valor (remover)', 'Remove a value (remove)'), menuLabel: tr('remover(valor)', 'remove(value)'), group: tr('Remoção', 'Removal'), number: '07',
    description: tr('Remove como numa ABB (folha, um filho, ou dois filhos com o menor valor da direita) e, no caminho de volta, cada nó atualiza a altura e se rebalanceia. Aqui o critério dos casos usa o FB do filho, não o valor removido.', 'Remove as in a BST (leaf, one child, or two children with the smallest value on the right) and, on the way back, each node updates its height and rebalances. Here the case criterion uses the BF of the child, not the removed value.'),
    interaction: tr('Escolha uma folha, um nó com um filho e um com dois filhos. Use o exemplo remover(80) dos slides e o exemplo corrigido, remover(90). Clique em um nó da árvore para removê-lo.', 'Choose a leaf, a node with one child and one with two children. Use the slides\' example remove(80) and the corrected example, remove(90). Click a tree node to remove it.'),
    complexity: { time: 'O(log n)', space: 'O(log n)', note: tr('A busca desce uma vez e a volta pode rotacionar em vários níveis, no máximo um por nível: até O(log n) rotações, bem mais que a inserção.', 'The search goes down once and the way back may rotate at several levels, at most one per level: up to O(log n) rotations, much more than insertion.') },
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
  const val = (id) => (isId(id) ? fmt(t.node(id).value) : tr('nulo', 'null'));
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
    fn: tr('rotacaoDireita', 'rotateRight'), block: 'rotR', pivot: 'y', child: 'x', childSide: 'left', t2Side: 'right',
  },
  left: {
    fn: tr('rotacaoEsquerda', 'rotateLeft'), block: 'rotL', pivot: 'x', child: 'y', childSide: 'right', t2Side: 'left',
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
  const field = (key) => `${key === 'left' ? tr('esquerdo', 'left') : tr('direito', 'right')}`;
  const pivotValue = val(pivotId);

  frames.push({ text: `${r.fn}(${pivotValue})`, id: pivotId });
  t.set(P, pivotId);

  const childId = t.node(pivotId)[r.childSide];
  if (!isId(childId)) {
    snap(L('head'), tr(`Chamando ${r.fn}(${P})`, `Calling ${r.fn}(${P})`), tr(`${r.fn}(${P}) precisa do filho ${field(r.childSide)} de ${pivotValue}, mas ele é NULO: a rotação não pode ser feita (no Java, seria um erro de ponteiro nulo). Isso só acontece numa árvore que já estava desbalanceada antes da operação.`, `${r.fn}(${P}) needs the ${field(r.childSide)} child of ${pivotValue}, but it is NULL: the rotation cannot be done (in Java, it would be a null pointer error). This only happens in a tree that was already unbalanced before the operation.`), 'warning', { activeIndices: [pivotId] });
    frames.pop();
    t.clear([P]);
    return pivotId;
  }

  if (verbose) {
    snap(L('head'), tr(`Chamando ${r.fn}(${P})`, `Calling ${r.fn}(${P})`), tr(`${r.fn}(${P}) recebe o nó ${pivotValue}, que dentro da função se chama ${P}. ${why}`, `${r.fn}(${P}) receives node ${pivotValue}, which inside the function is called ${P}. ${why}`).trim(), 'neutral', { activeIndices: [pivotId] });
  }

  t.follow(C, pivotId, r.childSide);
  if (verbose) {
    snap(L('child'), `${C} ← ${P}.${field(r.childSide)}`, tr(`${C} passa a apontar para o filho ${field(r.childSide)} de ${pivotValue}, o nó ${val(childId)}. É ele quem vai ocupar o lugar de ${pivotValue}.`, `${C} now points to the ${field(r.childSide)} child of ${pivotValue}, node ${val(childId)}. It is the one that will take the place of ${pivotValue}.`), 'update', { activeIndices: [pivotId], foundIndices: [childId] });
  }

  const t2Id = t.follow('T2', childId, r.t2Side);
  if (verbose) {
    const between = dir === 'right' ? tr(`maiores que ${val(childId)} e menores que ${pivotValue}`, `greater than ${val(childId)} and smaller than ${pivotValue}`) : tr(`menores que ${val(childId)} e maiores que ${pivotValue}`, `smaller than ${val(childId)} and greater than ${pivotValue}`);
    snap(L('t2'), tr(`T2 ← ${C}.${field(r.t2Side)}`, `T2 ← ${C}.${field(r.t2Side)}`), isId(t2Id)
      ? tr(`T2 guarda a subárvore ${field(r.t2Side)} de ${val(childId)} (raiz ${val(t2Id)}). Seus valores são ${between}, então ela vai ficar entre os dois depois da rotação.`, `T2 holds the ${field(r.t2Side)} subtree of ${val(childId)} (root ${val(t2Id)}). Its values are ${between}, so it will sit between the two after the rotation.`)
      : tr(`T2 guarda a subárvore ${field(r.t2Side)} de ${val(childId)}, que é nula: não há nada entre ${val(childId)} e ${pivotValue}.`, `T2 holds the ${field(r.t2Side)} subtree of ${val(childId)}, which is null: there is nothing between ${val(childId)} and ${pivotValue}.`), 'update', { activeIndices: [pivotId], foundIndices: [childId] });
  }

  // x.direito ← y (ou y.esquerdo ← x): o filho passa a apontar para o pivô e a cena já mostra a subárvore girada.
  t.setChild(childId, opposite, pivotId);
  t.setAlias(pivotId, childId);
  // O selo `nulo` de T2 ficava no lugar onde agora está o pivô: some até T2 ser religada.
  if (!isId(t2Id)) t.set('T2', null);
  if (verbose) {
    snap(L('l1'), `${C}.${field(opposite)} ← ${P}`, tr(`${P} (${pivotValue}) passa a ser o filho ${field(opposite)} de ${C} (${val(childId)}). A subárvore girada já tem ${val(childId)} na raiz, mas o pai ainda aponta para ${pivotValue}: quem chamou a função é que vai ligá-lo.${isId(t2Id) ? ` T2 ficou solta: só a variável T2 aponta para ela.` : ''}`, `${P} (${pivotValue}) becomes the ${field(opposite)} child of ${C} (${val(childId)}). The rotated subtree already has ${val(childId)} at the root, but the parent still points to ${pivotValue}: the caller is the one that will link it.${isId(t2Id) ? ` T2 was left loose: only the variable T2 points to it.` : ''}`), 'update', { changedIndices: [childId], activeIndices: [pivotId] });
  }

  t.setChild(pivotId, r.childSide, t2Id);
  if (!isId(t2Id)) t.set('T2', null, { parent: pivotId, side: r.childSide });
  if (verbose) {
    snap(L('l2'), `${P}.${field(r.childSide)} ← T2`, isId(t2Id)
      ? tr(`A subárvore T2 (raiz ${val(t2Id)}) é religada como filho ${field(r.childSide)} de ${pivotValue}: ela volta para a árvore.`, `The subtree T2 (root ${val(t2Id)}) is relinked as the ${field(r.childSide)} child of ${pivotValue}: it goes back into the tree.`)
      : tr(`${pivotValue} passa a ter filho ${field(r.childSide)} nulo, como era T2.`, `${pivotValue} now has a null ${field(r.childSide)} child, just as T2 was.`), 'update', { changedIndices: [pivotId], activeIndices: [pivotId], foundIndices: [childId] });
  }

  const pivotBefore = t.node(pivotId).h;
  const pivotNew = heightFrom(t, pivotId);
  t.setHeight(pivotId, pivotNew);
  if (verbose) {
    snap(L('h1'), tr(`Atualizando a altura de ${P}`, `Updating the height of ${P}`), tr(`altura(${P}.esquerdo) = ${alt(t, t.node(pivotId).left)} e altura(${P}.direito) = ${alt(t, t.node(pivotId).right)}: nova altura de ${pivotValue} = ${pivotNew} (era ${pivotBefore}). Primeiro o nó que desceu, porque a altura do que sobe depende dela.`, `height(${P}.left) = ${alt(t, t.node(pivotId).left)} and height(${P}.right) = ${alt(t, t.node(pivotId).right)}: new height of ${pivotValue} = ${pivotNew} (it was ${pivotBefore}). First the node that went down, because the height of the one that goes up depends on it.`), 'update', { changedIndices: [pivotId], variables: { 'nova altura': pivotNew } });
  }

  const childBefore = t.node(childId).h;
  const childNew = heightFrom(t, childId);
  t.setHeight(childId, childNew);
  if (verbose) {
    snap(L('h2'), tr(`Atualizando a altura de ${C}`, `Updating the height of ${C}`), tr(`altura(${C}.esquerdo) = ${alt(t, t.node(childId).left)} e altura(${C}.direito) = ${alt(t, t.node(childId).right)}: nova altura de ${val(childId)} = ${childNew} (era ${childBefore}).`, `height(${C}.left) = ${alt(t, t.node(childId).left)} and height(${C}.right) = ${alt(t, t.node(childId).right)}: new height of ${val(childId)} = ${childNew} (it was ${childBefore}).`), 'update', { changedIndices: [childId], variables: { 'nova altura': childNew } });
  }

  const summary = tr(`${r.fn} em ${pivotValue}: ${val(childId)} sobe e ${pivotValue} desce para o ${field(opposite)}. As alturas agora são ${val(childId)} = ${childNew} e ${pivotValue} = ${pivotNew}.`, `${r.fn} at ${pivotValue}: ${val(childId)} goes up and ${pivotValue} goes down to the ${field(opposite)}. The heights are now ${val(childId)} = ${childNew} and ${pivotValue} = ${pivotNew}.`);
  snap(L('ret'), verbose ? tr(`Retornando ${C}`, `Returning ${C}`) : tr(`Rotação em ${pivotValue}`, `Rotation at ${pivotValue}`), verbose
    ? tr(`Retornar ${C}: a função devolve ${val(childId)}, a nova raiz desta subárvore. Quem chamou vai ligar esse nó no lugar de ${pivotValue}.`, `Return ${C}: the function returns ${val(childId)}, the new root of this subtree. The caller will link that node in place of ${pivotValue}.`)
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
    side: 'left', heavy: (b) => b > 1, heavyText: tr('FB > 1', 'BF > 1'), child: tr('esquerdo', 'left'), fix: tr('uma rotação simples à direita', 'a single right rotation'),
    insert: { text: (v, c) => `${v} < ${c}`, pass: (v, c) => v < c, what: tr('o valor foi inserido à esquerda do filho esquerdo', 'the value was inserted to the left of the left child') },
    remove: { text: tr('FB(nó.esquerdo) ≥ 0', 'BF(node.left) ≥ 0'), pass: (f) => f >= 0, what: tr('o filho esquerdo pende para a esquerda (ou está equilibrado)', 'the left child leans left (or is balanced)') },
  },
  RR: {
    side: 'right', heavy: (b) => b < -1, heavyText: tr('FB < -1', 'BF < -1'), child: tr('direito', 'right'), fix: tr('uma rotação simples à esquerda', 'a single left rotation'),
    insert: { text: (v, c) => `${v} > ${c}`, pass: (v, c) => v > c, what: tr('o valor foi inserido à direita do filho direito', 'the value was inserted to the right of the right child') },
    remove: { text: tr('FB(nó.direito) ≤ 0', 'BF(node.right) ≤ 0'), pass: (f) => f <= 0, what: tr('o filho direito pende para a direita (ou está equilibrado)', 'the right child leans right (or is balanced)') },
  },
  LR: {
    side: 'left', heavy: (b) => b > 1, heavyText: tr('FB > 1', 'BF > 1'), child: tr('esquerdo', 'left'), fix: tr('uma rotação dupla: esquerda no filho esquerdo e depois direita no nó', 'a double rotation: left on the left child and then right on the node'),
    insert: { text: (v, c) => `${v} > ${c}`, pass: (v, c) => v > c, what: tr('o valor foi inserido à direita do filho esquerdo', 'the value was inserted to the right of the left child') },
    remove: { text: tr('FB(nó.esquerdo) < 0', 'BF(node.left) < 0'), pass: (f) => f < 0, what: tr('o filho esquerdo pende para a direita', 'the left child leans right') },
  },
  RL: {
    side: 'right', heavy: (b) => b < -1, heavyText: tr('FB < -1', 'BF < -1'), child: tr('direito', 'right'), fix: tr('uma rotação dupla: direita no filho direito e depois esquerda no nó', 'a double rotation: right on the right child and then left on the node'),
    insert: { text: (v, c) => `${v} < ${c}`, pass: (v, c) => v < c, what: tr('o valor foi inserido à esquerda do filho direito', 'the value was inserted to the left of the right child') },
    remove: { text: tr('FB(nó.direito) > 0', 'BF(node.right) > 0'), pass: (f) => f > 0, what: tr('o filho direito pende para a esquerda', 'the right child leans left') },
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
  const name = insert ? tr('FatorDeBalanceamento', 'BalanceFactor') : 'balance';
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
    snap(K('fb'), tr('Calculando o fator de balanceamento', 'Calculating the balance factor'), tr(`${name} ← altura(nó.esquerdo) − altura(nó.direito) = ${a} − ${b} = ${bal}. ${bad
      ? `|FB| > 1: o nó ${val(id)} ficou desbalanceado e precisa de rotação.`
      : `|FB| ≤ 1: o nó ${val(id)} continua balanceado.`}`, `${name} ← height(node.left) − height(node.right) = ${a} − ${b} = ${bal}. ${bad ? `|BF| > 1: node ${val(id)} became unbalanced and needs a rotation.` : `|BF| ≤ 1: node ${val(id)} is still balanced.`}`), 'comparison', mark);
  }

  if (!bad) {
    if (verbose) {
      snap(order.map(testLine), tr('Testando os quatro casos', 'Testing the four cases'), tr(`Os quatro casos exigem FB > 1 ou FB < −1 e aqui FB = ${bal}: as quatro condições são falsas, nenhuma rotação é feita.`, `The four cases require BF > 1 or BF < −1 and here BF = ${bal}: the four conditions are false, no rotation is done.`), 'comparison', mark);
      snap(K('retNode'), tr('Retornando o nó', 'Returning the node'), tr(`Retornar nó: ${val(id)} continua sendo a raiz desta subárvore, sem rotação.`, `Return node: ${val(id)} remains the root of this subtree, with no rotation.`), 'update', { ...mark, errorIndices: [] });
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
      why = tr(`${info.heavyText} é falso para FB = ${bal}: o caso ${c} não vale.`, `${info.heavyText} is false for BF = ${bal}: case ${c} does not hold.`);
    } else if (insert) {
      const childValue = t.node(childId).value;
      ok = info.insert.pass(valor, childValue);
      why = ok
        ? tr(`${info.heavyText} (FB = ${bal}) e ${info.insert.text(v, fmt(childValue))}: ${info.insert.what}. É o caso ${c}: conserta com ${info.fix}.`, `${info.heavyText} (BF = ${bal}) and ${info.insert.text(v, fmt(childValue))}: ${info.insert.what}. It is case ${c}: fix it with ${info.fix}.`)
        : tr(`${info.heavyText} (FB = ${bal}) é verdadeiro, mas ${info.insert.text(v, fmt(childValue))} é falso: não é o caso ${c}.`, `${info.heavyText} (BF = ${bal}) is true, but ${info.insert.text(v, fmt(childValue))} is false: it is not case ${c}.`);
    } else {
      const childFactor = factor(t, childId);
      t.setFb(childId, childFactor);
      ok = info.remove.pass(childFactor);
      why = ok
        ? tr(`${info.heavyText} (balance = ${bal}) e ${info.remove.text} (FB do filho = ${childFactor}): ${info.remove.what}. É o caso ${c}: conserta com ${info.fix}.`, `${info.heavyText} (balance = ${bal}) and ${info.remove.text} (child BF = ${childFactor}): ${info.remove.what}. It is case ${c}: fix it with ${info.fix}.`)
        : tr(`${info.heavyText} (balance = ${bal}) é verdadeiro, mas ${info.remove.text} é falso (FB do filho = ${childFactor}): não é o caso ${c}.`, `${info.heavyText} (balance = ${bal}) is true, but ${info.remove.text} is false (child BF = ${childFactor}): it is not case ${c}.`);
    }
    if (verbose) snap(testLine(c), tr(`Testando o caso ${c}`, `Testing case ${c}`), why, 'comparison', { ...mark, ...(ok ? { changedIndices: [childId] } : {}) });
    if (!ok) continue;

    const key = c.toLowerCase();
    const note = verbose ? '' : tr(`Caso ${c} (${name} = ${bal}): ${info.fix}.`, `Case ${c} (${name} = ${bal}): ${info.fix}.`);
    if (c === 'LL' || c === 'RR') {
      const dir = c === 'LL' ? 'right' : 'left';
      if (verbose) snap(K(`${key}Ret`), tr(`Chamando ${ROTATION[dir].fn}(nó)`, `Calling ${ROTATION[dir].fn}(node)`), tr(`Retornar ${ROTATION[dir].fn}(nó): o resultado da rotação é o que a função devolve.`, `Return ${ROTATION[dir].fn}(node): the result of the rotation is what the function returns.`), 'neutral', { activeIndices: [id] });
      const up = rotate(ctx, dir, id, note);
      if (verbose) snap(K(`${key}Ret`), tr('Retornando a nova raiz', 'Returning the new root'), tr(`${ROTATION[dir].fn} devolveu ${val(up)}: é a nova raiz desta subárvore, e a função também a devolve. O chamador a ligará no lugar de ${val(id)}.`, `${ROTATION[dir].fn} returned ${val(up)}: it is the new root of this subtree, and the function returns it as well. The caller will link it in place of ${val(id)}.`), 'update', { foundIndices: [up], activeIndices: [up] });
      return finish(c, up, K(`${key}Ret`));
    }

    // Rotação dupla: primeiro no filho (no sentido contrário), depois no nó.
    const first = c === 'LR' ? 'left' : 'right';
    const second = c === 'LR' ? 'right' : 'left';
    if (verbose) snap(K(`${key}Rot1`), tr(`Chamando ${ROTATION[first].fn}(nó.${info.child})`, `Calling ${ROTATION[first].fn}(node.${info.child})`), tr(`${ROTATION[first].fn}(nó.${info.child}) endireita primeiro o filho ${info.child} (${val(childId)}), que pende para o lado oposto ao do nó.`, `${ROTATION[first].fn}(node.${info.child}) straightens the ${info.child} child (${val(childId)}) first, which leans to the opposite side of the node.`), 'neutral', { activeIndices: [id], foundIndices: [childId] });
    const mid = rotate(ctx, first, childId, note);
    t.setChild(id, info.side, mid);
    t.setAlias();
    if (verbose) snap(K(`${key}Rot1`), tr(`nó.${info.child} ← ${val(mid)}`, `node.${info.child} ← ${val(mid)}`), tr(`O retorno é ligado: o filho ${info.child} de ${val(id)} agora é ${val(mid)}. Já está no caso simples (LL ou RR).`, `The return value is linked: the ${info.child} child of ${val(id)} is now ${val(mid)}. It is already in the simple case (LL or RR).`), 'update', { activeIndices: [id], changedIndices: [id], foundIndices: [mid] });
    if (verbose) snap(K(`${key}Ret`), tr(`Chamando ${ROTATION[second].fn}(nó)`, `Calling ${ROTATION[second].fn}(node)`), tr(`Retornar ${ROTATION[second].fn}(nó): agora a rotação simples no nó ${val(id)}.`, `Return ${ROTATION[second].fn}(node): now the single rotation on node ${val(id)}.`), 'neutral', { activeIndices: [id] });
    const up = rotate(ctx, second, id, verbose ? '' : tr('Segunda rotação.', 'Second rotation.'));
    if (verbose) snap(K(`${key}Ret`), tr('Retornando a nova raiz', 'Returning the new root'), tr(`${ROTATION[second].fn} devolveu ${val(up)}: é a nova raiz desta subárvore. O chamador a ligará no lugar de ${val(id)}.`, `${ROTATION[second].fn} returned ${val(up)}: it is the new root of this subtree. The caller will link it in place of ${val(id)}.`), 'update', { foundIndices: [up], activeIndices: [up] });
    return finish(c, up, K(`${key}Ret`));
  }

  snap(K('retNode'), tr('Nenhum caso se aplica', 'No case applies'), tr(`Nenhuma das quatro condições foi verdadeira, embora |FB| > 1: isso só acontece quando a árvore já estava desbalanceada antes da operação. O nó é devolvido como está.`, `None of the four conditions was true, although |BF| > 1: this only happens when the tree was already unbalanced before the operation. The node is returned as it is.`), 'warning', mark);
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
    snap(0, tr('Árvore vazia', 'Empty tree'), tr('Uma árvore vazia não tem nós para conferir: raiz = NULO e a altura da árvore é −1.', 'An empty tree has no nodes to check: root = NULL and the height of the tree is −1.'), 'warning');
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

  snap(at('alt.head'), tr('A altura guardada em cada nó', 'The height stored in each node'), tr(`Cada nó guarda a própria altura (selo "alt"): altura(nó) devolve nó.altura, ou −1 se o nó for NULO. A árvore tem ${plural(tree.nodes.length, tr('nó', 'node'), tr('nós', 'nodes'))} e altura ${tree.nodes[tree.root].h}. Vamos calcular o FB de cada nó, dos de baixo para os de cima.`, `Each node stores its own height ("h" badge): height(node) returns node.height, or −1 if the node is NULL. The tree has ${plural(tree.nodes.length, tr('nó', 'node'), tr('nós', 'nodes'))} and height ${tree.nodes[tree.root].h}. We will calculate the BF of each node, from the bottom up.`), 'neutral');

  const good = [];
  const bad = [];
  order.forEach((id) => {
    const { left, right } = t.node(id);
    const a = alt(t, left);
    const b = alt(t, right);
    const bal = a - b;
    t.setFb(id, bal);
    const wrong = Math.abs(bal) > 1;
    const text = tr(`altura(nó.esquerdo) = ${a}${isId(left) ? '' : ' (sem filho: −1)'} e altura(nó.direito) = ${b}${isId(right) ? '' : ' (sem filho: −1)'}, então FB(${val(id)}) = ${a} − ${b} = ${bal}.`, `height(node.left) = ${a}${isId(left) ? '' : ' (no child: −1)'} and height(node.right) = ${b}${isId(right) ? '' : ' (no child: −1)'}, so BF(${val(id)}) = ${a} − ${b} = ${bal}.`);
    const verdict = wrong
      ? tr(` |FB| > 1: ${val(id)} está desbalanceado (${bal > 0 ? 'esquerda' : 'direita'} mais alta).`, ` |BF| > 1: ${val(id)} is unbalanced (${bal > 0 ? 'left' : 'right'} taller).`)
      : bal === 0 ? tr(' As duas subárvores têm a mesma altura.', ' Both subtrees have the same height.') : tr(` Balanceado: ${bal > 0 ? 'a esquerda' : 'a direita'} é uma mais alta.`, ` Balanced: ${bal > 0 ? 'the left' : 'the right'} is one taller.`);
    snap([at('fb.ret'), at(isId(left) && isId(right) ? 'alt.ret' : 'alt.nullRet')], tr(`Calculando o FB de ${val(id)}`, `Calculating the BF of ${val(id)}`), `${text}${verdict}`, wrong ? 'warning' : 'comparison', {
      activeIndices: [id], foundIndices: [...good], errorIndices: [...bad], variables: { 'nó': val(id), 'FB': bal, 'altura(esq)': a, 'altura(dir)': b },
    });
    if (wrong) bad.push(id); else good.push(id);
  });

  const worst = Math.max(...order.map((id) => Math.abs(factor(t, id))));
  const isAvl = bad.length === 0;
  snap(at('fb.ret'), isAvl ? tr('É uma árvore AVL', 'It is an AVL tree') : tr('Não é uma árvore AVL', 'It is not an AVL tree'), isAvl
    ? tr(`Todos os nós têm |FB| ≤ 1 (o pior é ${worst}): a árvore é AVL. Altura ${tree.nodes[tree.root].h} para ${plural(tree.nodes.length, tr('nó', 'node'), tr('nós', 'nodes'))}.`, `All nodes have |BF| ≤ 1 (the worst is ${worst}): the tree is AVL. Height ${tree.nodes[tree.root].h} for ${plural(tree.nodes.length, tr('nó', 'node'), tr('nós', 'nodes'))}.`)
    : tr(`${plural(bad.length, 'nó tem', 'nós têm')} |FB| > 1: ${list(bad.map((id) => `${val(id)} (FB ${signed(factor(t, id))})`))}. A árvore não é AVL: uma ABB comum pode ficar assim, e é por isso que a AVL rotaciona.`, `${plural(bad.length, 'node has', 'nodes have')} |BF| > 1: ${list(bad.map((id) => `${val(id)} (BF ${signed(factor(t, id))})`))}. The tree is not AVL: a plain BST can end up like this, and that is why the AVL rotates.`), isAvl ? 'done' : 'warning', {
    foundIndices: [...good], errorIndices: [...bad], output: [isAvl ? tr('A árvore é AVL.', 'The tree is AVL.') : tr(`Não é AVL: ${list(bad.map((id) => `FB(${val(id)}) = ${factor(t, id)}`))}.`, `Not AVL: ${list(bad.map((id) => `BF(${val(id)}) = ${factor(t, id)}`))}.`)],
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
  const side = dir === 'right' ? tr('esquerdo', 'left') : tr('direito', 'right');
  const pivotId = pivotFor(tree, dir, wanted);

  if (pivotId === null) {
    snap(ctx.at(`${r.block}.head`), tr('Nenhum nó pode girar', 'No node can rotate'), tr(`${tree.nodes.length ? `Nenhum nó desta árvore tem filho ${side}` : 'A árvore está vazia'}: a rotação ${dir === 'right' ? 'à direita' : 'à esquerda'} precisa de um nó com filho ${side}. Mude os valores de entrada.`, `${tree.nodes.length ? `No node of this tree has a ${side} child` : 'The tree is empty'}: the ${dir === 'right' ? 'right' : 'left'} rotation needs a node with a ${side} child. Change the input values.`), 'warning');
    return t.finish();
  }

  const parents = new Map();
  tree.nodes.forEach((node) => ['left', 'right'].forEach((key) => { if (isId(node[key])) parents.set(node[key], { parent: node.id, side: key }); }));
  const before = inorder(tree).map((id) => fmt(tree.nodes[id].value)).join(' ');

  const up = rotate(ctx, dir, pivotId, tr(`Aqui ${r.pivot} é o nó ${val(pivotId)}.`, `Here ${r.pivot} is node ${val(pivotId)}.`));
  // Quem chamou a função guarda o retorno: no lugar de `raiz` ou do ponteiro do pai.
  const link = parents.get(pivotId);
  if (link) t.setChild(link.parent, link.side, up);
  else t.set('raiz', up);
  t.setAlias();
  const after = inorder({ nodes: t.st.nodes, root: t.st.refs.raiz }).map((id) => fmt(t.node(id).value)).join(' ');
  snap(ctx.at(`${r.block}.ret`), tr('O chamador liga o retorno', 'The caller links the return value'), tr(`${link
    ? `O código que chamou ${r.fn} (por exemplo, nó.${sideName(link.side)} ← ${r.fn}(...)) guarda o retorno: ${val(link.parent)}.${sideName(link.side)} passa a ser ${val(up)}.`
    : `O código que chamou ${r.fn} (raiz ← ${r.fn}(raiz)) guarda o retorno: raiz passa a apontar para ${val(up)}.`} A subárvore girada está no lugar. Percurso em ordem: ${before} antes, ${after} depois — ${before === after ? 'a mesma sequência' : 'diferente (algo deu errado)'}.`, `${link ? `The code that called ${r.fn} (for example, node.${sideName(link.side)} ← ${r.fn}(...)) stores the return value: ${val(link.parent)}.${sideName(link.side)} becomes ${val(up)}.` : `The code that called ${r.fn} (root ← ${r.fn}(root)) stores the return value: root now points to ${val(up)}.`} The rotated subtree is in place. In-order traversal: ${before} before, ${after} after — ${before === after ? 'the same sequence' : 'different (something went wrong)'}.`), 'done', {
    foundIndices: [up], changedIndices: link ? [link.parent] : [], output: [tr(`em ordem antes: ${before}`, `in-order before: ${before}`), tr(`em ordem depois: ${after}`, `in-order after: ${after}`)],
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
    tree, layout: valueLayout(entriesOf(tree)), params: { valor: fmt(insert) }, locals: ['raiz', tr('nó', 'node'), 'y', 'x', 'T2'], prog: PROGRAMS.cases, main: 'cases',
  });
  const { t, snap, val } = ctx;
  const info = CASE_INFO[caseId];
  const root = tree.root;
  const added = values.length - 1;
  const before = inorder(tree).map((id) => fmt(tree.nodes[id].value)).join(' ');

  ctx.frames.push({ text: tr(`inserir(${val(root)}, ${fmt(insert)})`, `insert(${val(root)}, ${fmt(insert)})`), id: root });
  t.set('nó', root);
  snap(0, tr(`Depois de inserir ${fmt(insert)}`, `After inserting ${fmt(insert)}`), tr(`A árvore ao lado é o que sobra depois de inserir ${fmt(insert)} e atualizar as alturas pelo caminho de volta: o nó ${val(root)} está com a ${info.side === 'left' ? 'esquerda' : 'direita'} pesada. Falta balancear: é o que o trecho de inserir faz.`, `The tree beside is what is left after inserting ${fmt(insert)} and updating the heights on the way back: node ${val(root)} has a heavy ${info.side === 'left' ? 'left' : 'right'} side. It still has to be balanced: that is what the insert excerpt does.`), 'neutral', { foundIndices: [added] });

  const { id: up, line } = rebalance(ctx, root, 'insert', insert);
  t.set('raiz', up);
  t.setAlias();
  t.clear([tr('nó', 'node')]);
  ctx.frames.pop();
  const after = inorder({ nodes: t.st.nodes, root: up }).map((id) => fmt(t.node(id).value)).join(' ');
  const heightAfter = t.node(up).h;
  snap(line, tr(`Caso ${caseId} resolvido`, `Case ${caseId} solved`), tr(`${info.fix.charAt(0).toUpperCase()}${info.fix.slice(1)} deixou ${val(up)} na raiz, com altura ${heightAfter}. O percurso em ordem não mudou (${before}), e agora todos os FB estão entre −1 e 1. ${caseId === 'LL' || caseId === 'RR'
    ? 'Rotação simples: o filho pesado pendia para o mesmo lado do nó.'
    : 'Rotação dupla: o filho pesado pendia para o lado oposto, então uma rotação só deixaria o desequilíbrio do outro lado.'}`, `${info.fix.charAt(0).toUpperCase()}${info.fix.slice(1)} left ${val(up)} at the root, with height ${heightAfter}. The in-order traversal did not change (${before}), and now every BF is between −1 and 1. ${caseId === 'LL' || caseId === 'RR' ? 'Single rotation: the heavy child leaned to the same side as the node.' : 'Double rotation: the heavy child leaned to the opposite side, so a single rotation would only move the imbalance to the other side.'}`), 'done', {
    foundIndices: [up], output: [tr(`caso ${caseId}: ${info.fix}`, `case ${caseId}: ${info.fix}`), tr(`em ordem: ${after}`, `in-order: ${after}`)],
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
      snap(K('nullTest'), tr('Testando se nó é NULL', 'Testing whether node is NULL'), empty
        ? tr('nó é NULL: chegamos a uma referência nula, o ponto de inserção.', 'node is NULL: we reached a null reference, the insertion point.')
        : tr(`nó aponta para o nó ${val(id)}, que não é NULL: a chamada continua.`, `node points to node ${val(id)}, which is not NULL: the call continues.`), 'comparison', { variables: { 'nó é NULL': empty ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') } });
    }
    if (empty) {
      created = t.create(valor, null, { h: 0 });
      snap(K('retNew'), tr('Criando o novo nó', 'Creating the new node'), tr(`Retornar novo Nó(valor): o nó ${v} é criado com altura 0 e as duas referências nulas. Ele ainda está solto: só entra na árvore quando quem chamou receber este retorno e ligar o nó ao pai.`, `Return new Node(value): node ${v} is created with height 0 and both references null. It is still loose: it only enters the tree when the caller receives this return value and links the node to the parent.`), 'reading', { changedIndices: [created] });
      return created;
    }

    const node = t.node(id);
    const less = valor < node.value;
    if (verbose) {
      snap(K('ltTest'), tr(`Comparando ${v} com ${val(id)}`, `Comparing ${v} with ${val(id)}`), less
        ? tr(`${v} < ${val(id)} é verdadeiro: o valor vai para a subárvore esquerda.`, `${v} < ${val(id)} is true: the value goes to the left subtree.`)
        : tr(`${v} < ${val(id)} é falso: o fluxo cai no Senão.`, `${v} < ${val(id)} is false: the flow falls into the Else.`), 'comparison', { variables: { 'valor < nó.valor': less ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') } });
    }
    let key = 'left';
    if (!less) {
      const greater = valor > node.value;
      if (verbose) {
        snap(K('gtTest'), tr(`Comparando ${v} com ${val(id)}`, `Comparing ${v} with ${val(id)}`), greater
          ? tr(`${v} > ${val(id)} é verdadeiro: o valor vai para a subárvore direita.`, `${v} > ${val(id)} is true: the value goes to the right subtree.`)
          : tr(`${v} > ${val(id)} é falso: ${v} = ${val(id)}, o valor já existe.`, `${v} > ${val(id)} is false: ${v} = ${val(id)}, the value already exists.`), 'comparison', { variables: { 'valor > nó.valor': greater ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') } });
      }
      if (!greater) {
        snap(K('dup'), tr('Valor repetido', 'Repeated value'), tr(`Retornar nó: ${v} já está na árvore e a AVL não permite valores duplicados. Nada é alterado, e nenhum nó do caminho precisa mudar de altura.`, `Return node: ${v} is already in the tree and the AVL does not allow duplicate values. Nothing changes, and no node on the path needs to change height.`), 'warning', { foundIndices: [id] });
        return id;
      }
      key = 'right';
    }

    const child = node[key];
    const callLine = K(key === 'left' ? 'callL' : 'callR');
    if (verbose) {
      snap(callLine, tr(`Chamando inserir(nó.${sideName(key)}, valor)`, `Calling insert(node.${sideName(key)}, value)`), isId(child)
        ? tr(`inserir é chamada de novo, agora para o filho ${sideName(key)} de ${val(id)}, o nó ${val(child)}. A chamada de ${val(id)} fica esperando na pilha.`, `insert is called again, now for the ${sideName(key)} child of ${val(id)}, node ${val(child)}. The call of ${val(id)} waits on the stack.`)
        : tr(`inserir é chamada de novo para o filho ${sideName(key)} de ${val(id)}, que é nulo. A chamada de ${val(id)} fica esperando na pilha.`, `insert is called again for the ${sideName(key)} child of ${val(id)}, which is null. The call of ${val(id)} waits on the stack.`), 'neutral', { changedIndices: isId(child) ? [child] : [] });
    }
    frames.push({ text: tr(`inserir(${val(child)}, ${v})`, `insert(${val(child)}, ${v})`), id: child });
    t.follow(tr('nó', 'node'), id, key);
    const returned = ins(child);
    frames.pop();
    t.set('nó', id);

    // nó.esquerdo ← retorno: é aqui que o nó novo (ou a subárvore girada) entra na árvore.
    const changed = returned !== child;
    t.setChild(id, key, returned);
    t.setAlias();
    t.clearFb();
    if (verbose || returned === created) {
      snap(callLine, tr(`Recebendo o retorno de ${val(returned)}`, `Receiving the return of ${val(returned)}`), changed
        ? tr(`A chamada devolveu ${val(returned)}, e nó.${sideName(key)} ← ${val(returned)} liga esse nó como filho ${sideName(key)} de ${val(id)}.${returned === created ? ' O nó novo agora faz parte da árvore.' : ''}`, `The call returned ${val(returned)}, and node.${sideName(key)} ← ${val(returned)} links that node as the ${sideName(key)} child of ${val(id)}.${returned === created ? ' The new node is now part of the tree.' : ''}`)
        : tr(`A chamada devolveu o mesmo nó (${val(returned)}): a ligação de ${val(id)} não muda.`, `The call returned the same node (${val(returned)}): the link of ${val(id)} does not change.`), 'update', { changedIndices: changed ? [id] : [], foundIndices: [returned] });
    }

    const before = node.h;
    const next = heightFrom(t, id);
    t.setHeight(id, next);
    if (verbose) {
      snap(K('height'), tr('Atualizando a altura do nó', 'Updating the height of the node'), tr(`altura(nó.esquerdo) = ${alt(t, node.left)} e altura(nó.direito) = ${alt(t, node.right)}: nó.altura ← máximo(${alt(t, node.left)}, ${alt(t, node.right)}) + 1 = ${next}${next === before ? ' (não mudou)' : ` (era ${before})`}.`, `height(node.left) = ${alt(t, node.left)} and height(node.right) = ${alt(t, node.right)}: node.height ← max(${alt(t, node.left)}, ${alt(t, node.right)}) + 1 = ${next}${next === before ? ' (did not change)' : ` (was ${before})`}.`), 'update', { changedIndices: next === before ? [] : [id], variables: { 'nova altura': next } });
    }

    return rebalance(ctx, id, 'insert', valor).id;
  };

  const L = (key) => at(`insw.${key}`);
  if (verbose) {
    snap(L('head'), tr('Chamando inserir(valor)', 'Calling insert(value)'), tr(`inserir(${v}) é executada pelo programa principal. Ela só chama a versão recursiva, a partir da raiz.`, `insert(${v}) is executed by the main program. It only calls the recursive version, starting at the root.`), 'neutral');
  }
  frames.push({ text: tr(`inserir(${v})`, `insert(${v})`), id: undefined });
  const root = t.st.refs.raiz;
  if (verbose) {
    snap(L('body'), tr('Chamando inserir(raiz, valor)', 'Calling insert(root, value)'), isId(root)
      ? tr(`raiz ← inserir(raiz, valor) chama a função recursiva para o nó ${val(root)}, a raiz. O parâmetro nó recebe a raiz.`, `root ← insert(root, value) calls the recursive function for node ${val(root)}, the root. The parameter node receives the root.`)
      : tr('raiz ← inserir(raiz, valor) chama a função recursiva com a árvore vazia: o parâmetro nó recebe NULO.', 'root ← insert(root, value) calls the recursive function with the empty tree: the parameter node receives NULL.'), 'neutral');
  }
  frames.push({ text: tr(`inserir(${val(root)}, ${v})`, `insert(${val(root)}, ${v})`), id: root });
  t.set('nó', root);
  const returned = ins(root);
  frames.pop();
  t.set('raiz', returned);
  t.setAlias();
  t.clear([tr('nó', 'node')]);
  t.clearFb();
  snap(L('body'), tr('Atribuindo à raiz', 'Assigning to the root'), tr(`raiz ← ${val(returned)}: a raiz recebe o retorno da chamada${returned === root ? ' (o mesmo nó que já era a raiz)' : `, que agora é o nó ${val(returned)}`}.`, `root ← ${val(returned)}: the root receives the return value of the call${returned === root ? ' (the same node that was already the root)' : `, which is now node ${val(returned)}`}.`), 'update', { changedIndices: [returned], foundIndices: [returned] });
  frames.pop();

  const root2 = t.st.refs.raiz;
  const done = summarize(ctx.rotations);
  if (verbose) {
    snap(L('end'), tr('inserir() concluído', 'insert() finished'), created === null
      ? tr(`${v} já existia: a árvore não mudou.`, `${v} already existed: the tree did not change.`)
      : tr(`${v} foi inserido (${done}). A raiz é ${val(root2)} e a altura da árvore é ${t.node(root2).h}.`, `${v} was inserted (${done}). The root is ${val(root2)} and the height of the tree is ${t.node(root2).h}.`), created === null ? 'warning' : 'done', {
      foundIndices: created === null ? [] : [created],
      output: [created === null ? tr(`inserir(${v}): valor repetido, nada mudou.`, `insert(${v}): repeated value, nothing changed.`) : tr(`inserir(${v}): ${done}; altura da árvore ${t.node(root2).h}.`, `insert(${v}): ${done}; tree height ${t.node(root2).h}.`)],
    });
  }
}

function insertSteps(tree, valor) {
  const duplicate = tree.nodes.some((node) => node.value === valor);
  const entries = entriesOf(tree);
  if (!duplicate) entries.push({ id: tree.nodes.length, value: valor });
  const ctx = makeContext({
    tree, layout: valueLayout(entries), params: { valor: fmt(valor) }, locals: ['raiz', tr('nó', 'node'), 'y', 'x', 'T2'], prog: PROGRAMS.insert, main: 'ins',
  });
  insertCore(ctx, valor);
  return ctx.t.finish();
}

function buildAllSteps(values) {
  const ctx = makeContext({
    tree: emptyTree(),
    layout: valueLayout(values.map((value, id) => ({ id, value }))),
    params: { valor: '—' },
    locals: ['raiz', tr('nó', 'node'), 'y', 'x', 'T2'],
    prog: { code: PROGRAMS.build.code, at: BUILD_AT },
    main: 'ins',
    verbose: false,
  });
  const { t, snap } = ctx;

  if (!values.length) {
    snap(0, tr('Sequência vazia', 'Empty sequence'), tr('Sem valores, não há nada a inserir: a árvore continua vazia (raiz = NULO).', 'With no values, there is nothing to insert: the tree stays empty (root = NULL).'), 'warning');
    return t.finish();
  }
  snap(0, tr('Iniciando a construção', 'Starting the build'), tr(`A árvore começa vazia (raiz = NULO). Serão inseridos ${plural(values.length, tr('valor', 'value'), tr('valores', 'values'))}, na ordem da lista, cada um com o inserir da AVL.`, `The tree starts empty (root = NULL). ${plural(values.length, tr('valor', 'value'), tr('valores', 'values'))} will be inserted, in the order of the list, each one with the AVL insert.`), 'neutral');
  let total = 0;
  values.forEach((valor, index) => {
    t.setParams({ valor: fmt(valor) });
    ctx.frames.length = 0;
    ctx.rotations = [];
    t.clear([tr('nó', 'node'), 'y', 'x', 'T2']);
    insertCore(ctx, valor);
    total += turnsOf(ctx.rotations);
    const root = t.st.refs.raiz;
    const rotated = turnsOf(ctx.rotations);
    snap(1, tr(`Inserção de ${fmt(valor)} concluída`, `Insertion of ${fmt(valor)} finished`), tr(`${fmt(valor)} está na árvore${rotated ? `, com ${summarize(ctx.rotations)} para manter o balanceamento` : ' sem precisar rotacionar'}. Altura da árvore: ${t.node(root).h}.`, `${fmt(valor)} is in the tree${rotated ? `, with ${summarize(ctx.rotations)} to keep it balanced` : ' without needing to rotate'}. Tree height: ${t.node(root).h}.`), index === values.length - 1 ? 'done' : 'update', {
      foundIndices: [index], variables: { altura: t.node(root).h },
    });
  });

  const tree = { nodes: t.st.nodes, root: t.st.refs.raiz };
  const plain = abbTree(values);
  const heightAvl = tree.nodes[tree.root].h;
  const heightAbb = heightOfTree(plain);
  const last = t.finish();
  const final = last.at(-1);
  final.description += tr(` Altura final: ${heightAvl}; uma ABB comum com os mesmos valores, na mesma ordem, teria altura ${heightAbb}${heightAbb === values.length - 1 && values.length > 2 ? ' (uma cadeia)' : ''}.`, ` Final height: ${heightAvl}; a plain BST with the same values, in the same order, would have height ${heightAbb}${heightAbb === values.length - 1 && values.length > 2 ? ' (a chain)' : ''}.`);
  final.variables = { ...final.variables, 'altura AVL': heightAvl, 'altura ABB': heightAbb, rotações: total };
  final.output = [tr(`altura da AVL: ${heightAvl}`, `AVL height: ${heightAvl}`), tr(`altura da ABB comum: ${heightAbb}`, `plain BST height: ${heightAbb}`), tr(`rotações feitas: ${total}`, `rotations made: ${total}`)];
  return last;
}

// ---------------------------------------------------------------------------------------------
// REMOVER
// ---------------------------------------------------------------------------------------------

function removeSteps(tree, valor) {
  const ctx = makeContext({
    tree, layout: valueLayout(entriesOf(tree)), params: { valor: fmt(valor) }, locals: ['raiz', tr('nó', 'node'), 'temp', 'y', 'x', 'T2'], prog: PROGRAMS.remove, main: 'rem',
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
    frames.push({ text: tr(`remover(${val(child)}, ${valueText})`, `remove(${val(child)}, ${valueText})`), id: child });
    t.follow(tr('nó', 'node'), cur, key);
    const inner = rem(frames.at(-1), valorAlvo);
    frames.pop();
    resume(frame);
    t.setChild(cur, key, inner.id);
    t.setAlias();
    t.clearFb();
    const sameNode = inner.id === child;
    snap(callLine, tr('Recebendo o retorno', 'Receiving the return'), sameNode
      ? tr(`A chamada devolveu o mesmo nó (${val(inner.id)}): a ligação de ${val(cur)} não muda.`, `The call returned the same node (${val(inner.id)}): the link of ${val(cur)} does not change.`)
      : tr(`A chamada devolveu ${val(inner.id)}: nó.${sideName(key)} ← ${val(inner.id)}${isId(inner.removed) ? `. O nó ${val(inner.removed)} deixou de ser alcançado a partir da raiz.` : '.'}`, `The call returned ${val(inner.id)}: node.${sideName(key)} ← ${val(inner.id)}${isId(inner.removed) ? `. Node ${val(inner.removed)} is no longer reachable from the root.` : '.'}`), 'update', {
      changedIndices: sameNode ? [] : [cur], foundIndices: isId(inner.id) ? [inner.id] : [],
    });
    if (isId(inner.removed)) t.drop(inner.removed);
  };

  /** Uma chamada de `remover(nó, valor)`. Devolve `{ id, removed }`: o nó que fica no lugar e o que saiu. */
  const rem = (frame, target) => {
    let cur = frame.id; // o nó que a variável `nó` aponta agora
    const tv = fmt(target);
    const empty = !isId(cur);
    snap(K('nullTest1'), tr('Testando se nó é NULL', 'Testing whether node is NULL'), empty
      ? tr('nó é NULL: chegamos ao fim do caminho sem achar o valor.', 'node is NULL: we reached the end of the path without finding the value.')
      : tr(`nó aponta para o nó ${val(cur)}, que não é NULL: a chamada continua.`, `node points to node ${val(cur)}, which is not NULL: the call continues.`), 'comparison', { variables: { 'nó é NULL': empty ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') } });
    if (empty) {
      snap(K('retNull1'), tr('Valor não encontrado', 'Value not found'), tr(`Retornar nó: nada a remover, ${tv} não está nesta subárvore. A chamada devolve NULL e o chamador mantém a ligação que já tinha.`, `Return node: nothing to remove, ${tv} is not in this subtree. The call returns NULL and the caller keeps the link it already had.`), 'warning');
      return { id: null, removed: null };
    }

    const less = target < t.node(cur).value;
    snap(K('ltTest'), tr(`Comparando ${tv} com ${val(cur)}`, `Comparing ${tv} with ${val(cur)}`), less
      ? tr(`${tv} < ${val(cur)} é verdadeiro: o valor, se existir, está na subárvore esquerda.`, `${tv} < ${val(cur)} is true: the value, if it exists, is in the left subtree.`)
      : tr(`${tv} < ${val(cur)} é falso: o fluxo cai no Senão.`, `${tv} < ${val(cur)} is false: the flow falls into the Else.`), 'comparison', { variables: { 'valor < nó.valor': less ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') } });

    let key = less ? 'left' : null;
    if (!less) {
      const greater = target > t.node(cur).value;
      snap(K('gtTest'), tr(`Comparando ${tv} com ${val(cur)}`, `Comparing ${tv} with ${val(cur)}`), greater
        ? tr(`${tv} > ${val(cur)} é verdadeiro: o valor, se existir, está na subárvore direita.`, `${tv} > ${val(cur)} is true: the value, if it exists, is in the right subtree.`)
        : tr(`${tv} > ${val(cur)} é falso: ${tv} = ${val(cur)}, este é o nó a remover.`, `${tv} > ${val(cur)} is false: ${tv} = ${val(cur)}, this is the node to remove.`), 'comparison', { variables: { 'valor > nó.valor': greater ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') } });
      if (greater) key = 'right';
    }

    if (key) {
      const child = t.node(cur)[key];
      const callLine = K(key === 'left' ? 'callL' : 'callR');
      snap(callLine, tr(`Chamando remover(nó.${sideName(key)}, valor)`, `Calling remove(node.${sideName(key)}, value)`), tr(`remover é chamada de novo para o filho ${sideName(key)} de ${val(cur)}${isId(child) ? `, o nó ${val(child)}` : ', que é nulo'}. A chamada de ${val(cur)} fica esperando na pilha.`, `remove is called again for the ${sideName(key)} child of ${val(cur)}${isId(child) ? `, node ${val(child)}` : ', which is null'}. The call of ${val(cur)} waits on the stack.`), 'neutral', { changedIndices: isId(child) ? [child] : [] });
      descend(frame, cur, key, callLine, tv, target);
    } else {
      // Achou o nó a remover.
      const { left, right } = t.node(cur);
      const one = !isId(left) || !isId(right);
      snap(K('oneTest'), tr('Contando os filhos do nó', 'Counting the children of the node'), one
        ? tr(`${val(cur)} tem no máximo um filho: o caso de uma folha ou de um filho só.`, `${val(cur)} has at most one child: the case of a leaf or of a single child.`)
        : tr(`${val(cur)} tem os dois filhos: o caso do nó com dois filhos.`, `${val(cur)} has both children: the case of the node with two children.`), 'comparison', { variables: { 'um filho ou nenhum': one ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') } });

      if (one) {
        const hasLeft = isId(left);
        snap(K('leftTest'), tr('Escolhendo o filho que fica', 'Choosing the child that stays'), hasLeft ? tr('nó.esquerdo ≠ NULL: o filho esquerdo é quem ocupará o lugar.', 'node.left ≠ NULL: the left child is the one that will take its place.') : tr('nó.esquerdo é NULL: o filho que sobra (se houver) é o direito.', 'node.left is NULL: the remaining child (if any) is the right one.'), 'comparison', { variables: { 'nó.esquerdo ≠ NULL': hasLeft ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') } });
        const temp = t.follow('temp', cur, hasLeft ? 'left' : 'right');
        frame.temp = temp;
        snap(K(hasLeft ? 'tempL' : 'tempR'), tr(`temp ← nó.${hasLeft ? tr('esquerdo', 'left') : tr('direito', 'right')}`, `temp ← node.${hasLeft ? 'left' : 'right'}`), tr(`temp recebe o filho ${hasLeft ? tr('esquerdo', 'left') : tr('direito', 'right')} de ${val(cur)}${isId(temp) ? `: o nó ${val(temp)}` : ', que é nulo'}.`, `temp receives the ${hasLeft ? 'left' : 'right'} child of ${val(cur)}${isId(temp) ? `: node ${val(temp)}` : ', which is null'}.`), 'update');
        snap(K('tempNull'), tr('Testando se temp é NULL', 'Testing whether temp is NULL'), isId(temp)
          ? tr(`temp é ${val(temp)}, não é NULL: ${val(cur)} tem um filho.`, `temp is ${val(temp)}, not NULL: ${val(cur)} has one child.`)
          : tr('temp é NULL: o nó não tem filhos, é uma folha.', 'temp is NULL: the node has no children, it is a leaf.'), 'comparison', { variables: { 'temp é NULL': isId(temp) ? tr('FALSO', 'FALSE') : tr('VERDADEIRO', 'TRUE') } });
        if (!isId(temp)) {
          t.set('temp', cur);
          frame.temp = cur;
          snap(K('tempSelf'), tr('temp ← nó', 'temp ← node'), tr(`temp guarda o nó ${val(cur)}, o que vai sair da árvore.`, `temp holds node ${val(cur)}, the one that will leave the tree.`), 'update');
          t.set('nó', null);
          kind = kind ?? tr('uma folha', 'a leaf');
          frame.removed = cur;
          snap(K('nodeNull'), tr('nó ← NULL', 'node ← NULL'), tr(`nó passa a ser NULL. A folha ${val(cur)} ainda está ligada ao pai: ela só sai da árvore quando o pai receber o NULL de volta.`, `node becomes NULL. The leaf ${val(cur)} is still linked to the parent: it only leaves the tree when the parent receives the NULL back.`), 'update', { dimIndices: [cur], activeIndices: [] });
          cur = null;
        } else {
          t.set('nó', temp);
          frame.removed = cur;
          kind = kind ?? tr('um nó com um filho', 'a node with one child');
          snap(K('nodeTemp'), tr('nó ← temp', 'node ← temp'), tr(`nó passa a apontar para o filho ${val(temp)}. O nó ${val(cur)} será substituído por ele quando o pai receber o retorno.`, `node now points to the child ${val(temp)}. Node ${val(cur)} will be replaced by it when the parent receives the return value.`), 'update', { dimIndices: [cur], activeIndices: [temp] });
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
        kind = tr('um nó com dois filhos', 'a node with two children');
        snap(K('minCall'), tr('temp ← menorValorNo(nó.direito)', 'temp ← minValueNode(node.right)'), tr(`menorValorNo desce sempre pela esquerda a partir de ${val(right)}${path.length > 1 ? ` (${list(path.map(val))})` : ''} e devolve o menor valor da subárvore direita: ${val(suc)}. temp aponta para esse nó, o sucessor em ordem de ${val(cur)}.`, `minValueNode always goes down to the left starting at ${val(right)}${path.length > 1 ? ` (${list(path.map(val))})` : ''} and returns the smallest value of the right subtree: ${val(suc)}. temp points to that node, the in-order successor of ${val(cur)}.`), 'update', { foundIndices: [suc], hotEdges: path });
        const old = val(cur);
        t.setValue(cur, t.node(suc).value);
        snap(K('copy'), tr('nó.valor ← temp.valor', 'node.value ← temp.value'), tr(`O valor de ${val(suc)} é copiado para o nó que guardava ${old}. Por enquanto o valor ${val(cur)} existe em dois nós; a estrutura ainda não mudou.`, `The value of ${val(suc)} is copied into the node that held ${old}. For now the value ${val(cur)} exists in two nodes; the structure has not changed yet.`), 'update', { changedIndices: [cur], foundIndices: [suc] });
        snap(K('callSuc'), tr('Chamando remover(nó.direito, temp.valor)', 'Calling remove(node.right, temp.value)'), tr(`remover é chamada para a subárvore direita de ${val(cur)}, agora para remover o valor ${val(cur)} do nó sucessor (que tem no máximo um filho, o direito).`, `remove is called for the right subtree of ${val(cur)}, now to remove the value ${val(cur)} from the successor node (which has at most one child, the right one).`), 'neutral', { changedIndices: [right] });
        descend(frame, cur, 'right', K('callSuc'), val(cur), t.node(cur).value);
      }
    }

    // Depois da busca/remoção: se o nó sumiu, retorna NULL; senão atualiza a altura e rebalanceia.
    const gone = !isId(cur);
    const dim = isId(frame.removed) ? [frame.removed] : [];
    snap(K('nullTest2'), tr('Testando se nó foi removido', 'Testing whether node was removed'), gone
      ? tr('nó é NULL: a folha foi removida, não há mais nada a atualizar neste nível.', 'node is NULL: the leaf was removed, there is nothing more to update at this level.')
      : tr(`nó (${val(cur)}) não é NULL: ainda há altura e balanceamento a conferir.`, `node (${val(cur)}) is not NULL: there is still height and balance to check.`), 'comparison', { variables: { 'nó é NULL': gone ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') }, dimIndices: dim });
    if (gone) {
      snap(K('retNull2'), tr('Retornando NULL', 'Returning NULL'), tr(`Retornar nó: devolve NULL. Quem chamou vai guardar NULL no lugar do ponteiro para ${val(frame.removed)}.`, `Return node: returns NULL. The caller will store NULL in place of the pointer to ${val(frame.removed)}.`), 'update', { dimIndices: dim, activeIndices: [] });
      return { id: null, removed: frame.removed };
    }

    const node = t.node(cur);
    const before = node.h;
    const next = heightFrom(t, cur);
    t.setHeight(cur, next);
    snap(K('height'), tr('Atualizando a altura do nó', 'Updating the height of the node'), tr(`altura(nó.esquerdo) = ${alt(t, node.left)} e altura(nó.direito) = ${alt(t, node.right)}: nó.altura ← máximo(${alt(t, node.left)}, ${alt(t, node.right)}) + 1 = ${next}${next === before ? ' (não mudou)' : ` (era ${before})`}.`, `height(node.left) = ${alt(t, node.left)} and height(node.right) = ${alt(t, node.right)}: node.height ← max(${alt(t, node.left)}, ${alt(t, node.right)}) + 1 = ${next}${next === before ? ' (did not change)' : ` (was ${before})`}.`), 'update', { changedIndices: next === before ? [] : [cur], dimIndices: dim, variables: { 'nova altura': next } });

    return { id: rebalance(ctx, cur, 'remove').id, removed: frame.removed };
  };

  const L = (key) => ctx.at(`remw.${key}`);
  snap(L('head'), tr('Chamando remover(valor)', 'Calling remove(value)'), tr(`remover(${v}) é executada pelo programa principal. Ela só chama a versão recursiva, a partir da raiz.`, `remove(${v}) is executed by the main program. It only calls the recursive version, starting at the root.`), 'neutral');
  frames.push({ text: tr(`remover(${v})`, `remove(${v})`), id: undefined });
  const root = t.st.refs.raiz;
  snap(L('body'), tr('Chamando remover(raiz, valor)', 'Calling remove(root, value)'), isId(root)
    ? tr(`raiz ← remover(raiz, valor) chama a função recursiva para a raiz, o nó ${val(root)}.`, `root ← remove(root, value) calls the recursive function for the root, node ${val(root)}.`)
    : tr('raiz ← remover(raiz, valor) chama a função recursiva com a árvore vazia: o parâmetro nó recebe NULO.', 'root ← remove(root, value) calls the recursive function with the empty tree: the parameter node receives NULL.'), 'neutral');
  const top = { text: tr(`remover(${val(root)}, ${v})`, `remove(${val(root)}, ${v})`), id: root };
  frames.push(top);
  t.set('nó', root);
  const result = rem(top, valor);
  frames.pop();
  t.set('raiz', result.id);
  t.setAlias();
  t.clear([tr('nó', 'node'), 'temp', 'y', 'x', 'T2']);
  t.clearFb();
  snap(L('body'), tr('Atribuindo à raiz', 'Assigning to the root'), tr(`raiz ← ${val(result.id)}: a raiz recebe o retorno da chamada${!isId(result.id) ? ': a árvore ficou vazia' : result.id === root ? ' (o mesmo nó que já era a raiz)' : `, que agora é o nó ${val(result.id)}`}.`, `root ← ${val(result.id)}: the root receives the return value of the call${!isId(result.id) ? ': the tree became empty' : result.id === root ? ' (the same node that was already the root)' : `, which is now node ${val(result.id)}`}.`), 'update', { foundIndices: isId(result.id) ? [result.id] : [] });
  if (isId(result.removed)) t.drop(result.removed);
  frames.pop();

  const rootNow = t.st.refs.raiz;
  const done = summarize(ctx.rotations);
  snap(L('end'), tr('remover() concluído', 'remove() finished'), kind
    ? tr(`${v} foi removido (${kind}; ${done}). ${isId(rootNow) ? `A raiz é ${val(rootNow)} e a altura da árvore é ${t.node(rootNow).h}.` : 'A árvore ficou vazia.'}`, `${v} was removed (${kind}; ${done}). ${isId(rootNow) ? `The root is ${val(rootNow)} and the height of the tree is ${t.node(rootNow).h}.` : 'The tree became empty.'}`)
    : tr(`${v} não está na árvore: nada foi removido, e nenhum nó mudou de altura.`, `${v} is not in the tree: nothing was removed, and no node changed height.`), kind ? 'done' : 'warning', {
    foundIndices: isId(rootNow) && kind ? [rootNow] : [],
    output: [kind ? tr(`remover(${v}) removeu ${kind}; ${done}.`, `remove(${v}) removed ${kind}; ${done}.`) : tr(`remover(${v}): valor não encontrado; a árvore não mudou.`, `remove(${v}): value not found; the tree did not change.`)],
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
