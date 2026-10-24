import {
  buildTree, depthsOf, fmt, heightOf, layoutOf, parentsOf, preorder, treeTrace,
} from '../shared/tree-scene.js';
import { tr } from '../../core/i18n.js';

// A árvore com erro da aula (slide "Encontre o erro nesta ABB"): 45 foi colocado à esquerda de 40.
export const BROKEN_VALUES = [40, 20, 60, 10, 45, 50, 70];

export const algorithms = [
  {
    id: 'node', title: tr('Nó da árvore: criar e ligar', 'Tree node: create and link'), menuLabel: tr('Nó da árvore', 'Tree node'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Cada nó guarda um valor e duas referências: esquerda e direita. Criar o nó e ligá-lo à árvore são eventos diferentes.', 'Each node holds a value and two references: left and right. Creating the node and linking it to the tree are different events.'),
    interaction: tr('Acompanhe o construtor montar um nó isolado, com esquerda e direita nulas. O nó só entra na árvore quando um ponteiro passa a apontar para ele. Os valores vêm dos três primeiros números dos dados.', 'Follow the constructor building an isolated node, with left and right null. The node only joins the tree when a pointer starts pointing to it. The values come from the first three numbers of the data.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Criar um nó e atribuir uma referência são operações de tempo constante.', 'Creating a node and assigning a reference are constant-time operations.') },
    pseudocode: [
      tr('CLASSE No', 'CLASS Node'),
      tr('  valor', '  value'),
      tr('  esquerda', '  left'),
      tr('  direita', '  right'),
      tr('  CONSTRUTOR No(valor)', '  CONSTRUCTOR Node(value)'),
      tr('    esta.valor ← valor', '    this.value ← value'),
      tr('    esta.esquerda ← NULO', '    this.left ← NULL'),
      tr('    esta.direita ← NULO', '    this.right ← NULL'),
      tr('  FIM', '  END'),
      tr('FIM_CLASSE', 'END_CLASS'),
      '',
      tr('raiz ← CRIAR_NÓ(valor1)', 'root ← CREATE_NODE(value1)'),
      tr('novo ← CRIAR_NÓ(valor2)', 'newNode ← CREATE_NODE(value2)'),
      tr('raiz.esquerda ← novo', 'root.left ← newNode'),
      tr('novo ← CRIAR_NÓ(valor3)', 'newNode ← CREATE_NODE(value3)'),
      tr('raiz.direita ← novo', 'root.right ← newNode'),
    ],
  },
  {
    id: 'anatomy', title: tr('Anatomia da árvore binária', 'Binary tree anatomy'), menuLabel: tr('Anatomia da árvore', 'Tree anatomy'), group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Raiz, pai e filhos, folhas, arestas e subárvore: o vocabulário de uma árvore binária, mais a profundidade e a altura de um nó.', 'Root, parent and children, leaves, edges and subtree: the vocabulary of a binary tree, plus the depth and the height of a node.'),
    interaction: tr('Clique em um nó para escolher de quem falar: pai e filhos, subárvore, profundidade e altura mudam com ele.', 'Click a node to choose which one to talk about: parent and children, subtree, depth and height change with it.'),
    complexity: { time: 'O(n)', space: 'O(h)', note: tr('Descrever a árvore percorre os nós; a altura de um nó percorre a subárvore dele.', 'Describing the tree traverses the nodes; the height of a node traverses its subtree.') },
    pseudocode: [
      tr('// Anatomia de uma árvore binária', '// Anatomy of a binary tree'),
      tr('raiz ← o nó que não tem pai', 'root ← the node that has no parent'),
      tr('filhos(nó) ← nó.esquerda e nó.direita (no máximo dois)', 'children(node) ← node.left and node.right (at most two)'),
      tr('folha ← nó com esquerda = NULO E direita = NULO', 'leaf ← node with left = NULL AND right = NULL'),
      tr('aresta ← a ligação entre um pai e um filho', 'edge ← the link between a parent and a child'),
      tr('subárvore(nó) ← a árvore formada a partir de um nó', 'subtree(node) ← the tree formed from a node'),
      tr('profundidade(nó) ← arestas da raiz até o nó', 'depth(node) ← edges from the root to the node'),
      tr('altura(nó) ← maior número de arestas até uma folha descendente', 'height(node) ← largest number of edges down to a descendant leaf'),
    ],
  },
  {
    id: 'rule', title: tr('A regra da Árvore Binária de Busca', 'The Binary Search Tree rule'), menuLabel: tr('Regra da ABB', 'BST rule'), group: tr('Fundamentos', 'Fundamentals'), number: '03',
    description: tr('Para cada nó de valor v, todos os valores à esquerda são menores que v e todos à direita são maiores ou iguais a v. A regra vale para toda a subárvore, não só para os filhos diretos.', 'For each node with value v, all the values on the left are smaller than v and all the values on the right are greater than or equal to v. The rule holds for the whole subtree, not only for the direct children.'),
    interaction: tr('Confira a árvore nó a nó. Depois troque para a árvore com erro da aula: 45 é maior que o pai (20), mas está à esquerda de 40.', 'Check the tree node by node. Then switch to the lesson\'s tree with the mistake: 45 is greater than its parent (20), but sits to the left of 40.'),
    complexity: { time: 'O(n · h)', space: 'O(1)', note: tr('Cada nó é comparado com todos os valores da sua subárvore.', 'Each node is compared with all the values of its subtree.') },
    pseudocode: [
      tr('PARA CADA nó v DA ÁRVORE FAÇA', 'FOR EACH node v OF THE TREE DO'),
      tr('  SE todo valor em v.esquerda < v.valor', '  IF every value in v.left < v.value'),
      tr('     E todo valor em v.direita ≥ v.valor ENTÃO', '     AND every value in v.right ≥ v.value THEN'),
      tr('    // a regra vale em v', '    // the rule holds at v'),
      tr('  SENÃO', '  ELSE'),
      tr('    // a regra foi violada em v: não é uma ABB', '    // the rule was violated at v: it is not a BST'),
      tr('  FIM_SE', '  END_IF'),
      tr('FIM_PARA', 'END_FOR'),
    ],
  },
  {
    id: 'insert', title: tr('Inserir um valor (INSERIR)', 'Insert a value (INSERT)'), menuLabel: tr('INSERIR(valor)', 'INSERT(value)'), group: tr('Inserção', 'Insertion'), number: '04',
    description: tr('Crie um nó isolado, desça comparando com atual (menor à esquerda, senão à direita) até achar um ponteiro nulo e ligue o nó ao último pai.', 'Create an isolated node, go down comparing with current (smaller to the left, otherwise to the right) until a null pointer is found, and link the node to the last parent.'),
    interaction: tr('Escolha o valor, ou clique em um nó para repetir o valor dele e ver o duplicado ir para a direita. O nó só entra na árvore quando pai.esquerda ou pai.direita é atribuído.', 'Choose the value, or click a node to repeat its value and see the duplicate go to the right. The node only joins the tree when parent.left or parent.right is assigned.'),
    complexity: { time: 'O(h)', space: 'O(1)', note: tr('Um nó por nível é visitado: O(log n) numa árvore equilibrada e O(n) no pior caso, com valores em ordem.', 'One node per level is visited: O(log n) in a balanced tree and O(n) in the worst case, with values in order.') },
    pseudocode: [
      tr('PROCEDIMENTO INSERIR(valor)', 'PROCEDURE INSERT(value)'),
      tr('  novo ← CRIAR_NÓ(valor)', '  newNode ← CREATE_NODE(value)'),
      tr('  SE raiz = NULO ENTÃO', '  IF root = NULL THEN'),
      tr('    raiz ← novo', '    root ← newNode'),
      tr('    RETORNE', '    RETURN'),
      tr('  FIM_SE', '  END_IF'),
      tr('  atual ← raiz', '  current ← root'),
      tr('  pai ← NULO', '  parent ← NULL'),
      tr('  ENQUANTO atual ≠ NULO FAÇA', '  WHILE current ≠ NULL DO'),
      tr('    pai ← atual', '    parent ← current'),
      tr('    SE valor < atual.valor ENTÃO', '    IF value < current.value THEN'),
      tr('      atual ← atual.esquerda', '      current ← current.left'),
      tr('    SENÃO', '    ELSE'),
      tr('      atual ← atual.direita', '      current ← current.right'),
      tr('    FIM_SE', '    END_IF'),
      tr('  FIM_ENQUANTO', '  END_WHILE'),
      tr('  SE valor < pai.valor ENTÃO', '  IF value < parent.value THEN'),
      tr('    pai.esquerda ← novo', '    parent.left ← newNode'),
      tr('  SENÃO', '  ELSE'),
      tr('    pai.direita ← novo', '    parent.right ← newNode'),
      tr('  FIM_SE', '  END_IF'),
      tr('FIM_PROCEDIMENTO', 'END_PROCEDURE'),
    ],
  },
  {
    id: 'build', title: tr('Construir a árvore (inserções em sequência)', 'Build the tree (insertions in sequence)'), menuLabel: tr('Construir a árvore', 'Build the tree'), group: tr('Inserção', 'Insertion'), number: '05',
    description: tr('Insira os valores na ordem da lista e veja a árvore crescer. A ordem de inserção decide o formato: valores já ordenados formam uma cadeia.', 'Insert the values in the order of the list and watch the tree grow. The insertion order decides the shape: already sorted values form a chain.'),
    interaction: tr('Use o exercício 1 da aula (45, 25, 65, 15, 35, 55, 75) e depois os mesmos valores em ordem crescente. Compare a altura das duas árvores.', 'Use the lesson\'s exercise 1 (45, 25, 65, 15, 35, 55, 75) and then the same values in ascending order. Compare the heights of the two trees.'),
    complexity: { time: 'O(n · h)', space: 'O(n)', note: tr('Cada inserção custa a altura da árvore naquele momento; no pior caso, n inserções de custo O(n).', 'Each insertion costs the height of the tree at that moment; in the worst case, n insertions of cost O(n).') },
    pseudocode: [
      tr('PARA CADA valor NA SEQUÊNCIA DE ENTRADA FAÇA', 'FOR EACH value IN THE INPUT SEQUENCE DO'),
      tr('  INSERIR(valor)', '  INSERT(value)'),
      tr('FIM_PARA', 'END_FOR'),
    ],
  },
  {
    id: 'search', title: tr('Buscar um valor (BUSCAR)', 'Search for a value (SEARCH)'), menuLabel: tr('BUSCAR(valor)', 'SEARCH(value)'), group: tr('Busca', 'Search'), number: '06',
    description: tr('Compare o valor com atual: se for igual, encontrou; se for menor, siga à esquerda; senão, à direita. Chegar a NULO significa que o valor não existe.', 'Compare the value with current: if it is equal, it was found; if smaller, go left; otherwise, right. Reaching NULL means the value does not exist.'),
    interaction: tr('Busque um valor que existe e um que não existe. A cada comparação, uma subárvore inteira é descartada.', 'Search for a value that exists and one that does not. With each comparison, a whole subtree is discarded.'),
    complexity: { time: 'O(h)', space: 'O(1)', note: tr('A busca não altera a estrutura: usa apenas atual e desce, no máximo, um nó por nível.', 'The search does not change the structure: it only uses current and goes down, at most, one node per level.') },
    pseudocode: [
      tr('FUNÇÃO BUSCAR(valor)', 'FUNCTION SEARCH(value)'),
      tr('  atual ← raiz', '  current ← root'),
      tr('  ENQUANTO atual ≠ NULO FAÇA', '  WHILE current ≠ NULL DO'),
      tr('    SE valor = atual.valor ENTÃO', '    IF value = current.value THEN'),
      tr('      RETORNE VERDADEIRO', '      RETURN TRUE'),
      tr('    SENÃO SE valor < atual.valor ENTÃO', '    ELSE IF value < current.value THEN'),
      tr('      atual ← atual.esquerda', '      current ← current.left'),
      tr('    SENÃO', '    ELSE'),
      tr('      atual ← atual.direita', '      current ← current.right'),
      tr('    FIM_SE', '    END_IF'),
      tr('  FIM_ENQUANTO', '  END_WHILE'),
      tr('  RETORNE FALSO', '  RETURN FALSE'),
      tr('FIM_FUNÇÃO', 'END_FUNCTION'),
    ],
  },
  {
    id: 'remove', title: tr('Remover um valor (REMOVER)', 'Remove a value (REMOVE)'), menuLabel: tr('REMOVER(raiz, valor)', 'REMOVE(root, value)'), group: tr('Remoção', 'Removal'), number: '07',
    description: tr('Localize o nó e o pai dele. Folha: o pai passa a apontar para NULO. Um filho: o pai aponta direto para ele. Dois filhos: copie o sucessor em ordem e remova o nó do sucessor.', 'Locate the node and its parent. Leaf: the parent starts pointing to NULL. One child: the parent points straight to it. Two children: copy the in-order successor and remove the successor\'s node.'),
    interaction: tr('Escolha uma folha, um nó com um filho e um com dois filhos: o pseudocódigo é o mesmo, a trajetória muda. Clique em um nó da árvore para removê-lo.', 'Choose a leaf, a node with one child and one with two children: the pseudocode is the same, the path changes. Click a tree node to remove it.'),
    complexity: { time: 'O(h)', space: 'O(1)', note: tr('A busca desce uma vez pela altura; encontrar o sucessor desce de novo, no pior caso, pela mesma altura.', 'The search goes down once through the height; finding the successor goes down again, in the worst case, through the same height.') },
    pseudocode: [
      tr('ALGORITMO REMOVER(raiz, valor)', 'ALGORITHM REMOVE(root, value)'),
      tr('  pai ← NULO', '  parent ← NULL'),
      tr('  atual ← raiz', '  current ← root'),
      tr('  ENQUANTO atual ≠ NULO E atual.valor ≠ valor FAÇA', '  WHILE current ≠ NULL AND current.value ≠ value DO'),
      tr('    pai ← atual', '    parent ← current'),
      tr('    SE valor < atual.valor ENTÃO', '    IF value < current.value THEN'),
      tr('      atual ← atual.esq', '      current ← current.left'),
      tr('    SENÃO', '    ELSE'),
      tr('      atual ← atual.dir', '      current ← current.right'),
      tr('    FIM_SE', '    END_IF'),
      tr('  FIM_ENQUANTO', '  END_WHILE'),
      tr('  SE atual = NULO ENTÃO', '  IF current = NULL THEN'),
      tr('    RETORNE raiz', '    RETURN root'),
      tr('  FIM_SE', '  END_IF'),
      tr('  SE atual.esq ≠ NULO E atual.dir ≠ NULO ENTÃO', '  IF current.left ≠ NULL AND current.right ≠ NULL THEN'),
      tr('    paiSuc ← atual', '    succParent ← current'),
      tr('    suc ← atual.dir', '    succ ← current.right'),
      tr('    ENQUANTO suc.esq ≠ NULO FAÇA', '    WHILE succ.left ≠ NULL DO'),
      tr('      paiSuc ← suc', '      succParent ← succ'),
      tr('      suc ← suc.esq', '      succ ← succ.left'),
      tr('    FIM_ENQUANTO', '    END_WHILE'),
      tr('    atual.valor ← suc.valor', '    current.value ← succ.value'),
      tr('    pai ← paiSuc', '    parent ← succParent'),
      tr('    atual ← suc', '    current ← succ'),
      tr('  FIM_SE', '  END_IF'),
      tr('  SE atual.esq ≠ NULO ENTÃO', '  IF current.left ≠ NULL THEN'),
      tr('    filho ← atual.esq', '    child ← current.left'),
      tr('  SENÃO', '  ELSE'),
      tr('    filho ← atual.dir', '    child ← current.right'),
      tr('  FIM_SE', '  END_IF'),
      tr('  SE pai = NULO ENTÃO', '  IF parent = NULL THEN'),
      tr('    raiz ← filho', '    root ← child'),
      tr('  SENÃO SE pai.esq = atual ENTÃO', '  ELSE IF parent.left = current THEN'),
      tr('    pai.esq ← filho', '    parent.left ← child'),
      tr('  SENÃO', '  ELSE'),
      tr('    pai.dir ← filho', '    parent.right ← child'),
      tr('  FIM_SE', '  END_IF'),
      tr('  RETORNE raiz', '  RETURN root'),
      tr('FIM_ALGORITMO', 'END_ALGORITHM'),
    ],
  },
];

const side = (value) => (value === 'left' ? tr('esquerda', 'left') : tr('direita', 'right'));
const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const list = (items) => items.join(', ');

/** Nós de uma subárvore (inclui a raiz dela). */
function subtree(nodes, id) {
  if (typeof id !== 'number') return [];
  return [id, ...subtree(nodes, nodes[id].left), ...subtree(nodes, nodes[id].right)];
}

/** Nó mais profundo (o primeiro em ordem de inserção), usado como nó de destaque. */
export function deepestNode(valores) {
  const tree = buildTree(valores);
  const depth = depthsOf(tree);
  let best = tree.root;
  depth.forEach((d, id) => {
    if (best === null || d > depth.get(best)) best = id;
  });
  return best ?? 0;
}

const emptyTree = () => ({ nodes: [], root: null });

function brokenTree() {
  const leaf = (id, value) => ({ id, value, left: null, right: null });
  return {
    nodes: [
      { id: 0, value: 40, left: 1, right: 2 },
      { id: 1, value: 20, left: 3, right: 4 },
      { id: 2, value: 60, left: 5, right: 6 },
      leaf(3, 10), leaf(4, 45), leaf(5, 50), leaf(6, 70),
    ],
    root: 0,
  };
}

// ---------------------------------------------------------------------------------------------
// Fundamentos
// ---------------------------------------------------------------------------------------------

function nodeSteps(valores) {
  const [v1, v2, v3] = [0, 1, 2].map((index) => valores[index] ?? [40, 20, 60][index]);
  const union = {
    nodes: [
      { id: 0, value: v1, left: 1, right: 2 },
      { id: 1, value: v2, left: null, right: null },
      { id: 2, value: v3, left: null, right: null },
    ],
    root: 0,
  };
  const t = treeTrace({
    tree: emptyTree(), layout: layoutOf(union), locals: ['raiz', 'novo'], allNulls: true,
  });
  const { st, step } = t;
  delete st.refs.raiz;

  step(11, tr('Chamando CRIAR_NÓ(valor1)', 'Calling CREATE_NODE(value1)'), tr(`raiz ← CRIAR_NÓ(${fmt(v1)}) chama o construtor da classe No. Ainda não existe nenhum nó.`, `root ← CREATE_NODE(${fmt(v1)}) calls the constructor of the Node class. There is no node yet.`));
  const a = t.create(v1, null, { pending: true });
  step(5, tr('Gravando o valor', 'Writing the value'), tr(`esta.valor ← valor: o nó nasce guardando ${fmt(v1)}. Os campos esquerda e direita ainda não foram atribuídos.`, `this.value ← value: the node is born holding ${fmt(v1)}. The left and right fields have not been assigned yet.`), 'reading', { changedIndices: [a] });
  t.setChild(a, 'left', null);
  step(6, tr('Esquerda começa nula', 'Left starts null'), tr('esta.esquerda ← NULO: ainda não há filho esquerdo, então a referência é nula (NULO significa ausência de referência).', 'this.left ← NULL: there is no left child yet, so the reference is null (NULL means the absence of a reference).'), 'update', { changedIndices: [a] });
  t.setChild(a, 'right', null);
  step(7, tr('Direita começa nula', 'Right starts null'), tr('esta.direita ← NULO: o mesmo vale para o filho direito. O nó está pronto, mas continua isolado.', 'this.right ← NULL: the same goes for the right child. The node is ready, but it is still isolated.'), 'update', { changedIndices: [a] });
  t.set('raiz', a);
  step(11, tr('Guardando a referência em raiz', 'Storing the reference in root'), tr(`O construtor devolve o nó e raiz passa a apontar para ele. Agora a árvore tem um nó: ${fmt(v1)}.`, `The constructor returns the node and root now points to it. Now the tree has one node: ${fmt(v1)}.`), 'update', { changedIndices: [a] });

  const b = t.create(v2, 'novo');
  step(12, tr('Criando outro nó', 'Creating another node'), tr(`novo ← CRIAR_NÓ(${fmt(v2)}) executa o mesmo construtor. O nó ${fmt(v2)} nasce isolado, com esquerda e direita nulas: criar o nó não o coloca na árvore.`, `newNode ← CREATE_NODE(${fmt(v2)}) runs the same constructor. Node ${fmt(v2)} is born isolated, with left and right null: creating the node does not put it in the tree.`), 'reading', { changedIndices: [b] });
  t.setChild(a, 'left', b);
  step(13, tr('Ligando à esquerda', 'Linking to the left'), tr(`raiz.esquerda ← novo: só agora o nó ${fmt(v2)} faz parte da árvore, como filho esquerdo de ${fmt(v1)}.`, `root.left ← newNode: only now does node ${fmt(v2)} become part of the tree, as the left child of ${fmt(v1)}.`), 'update', { changedIndices: [a], activeIndices: [b] });

  const c = t.create(v3, 'novo');
  step(14, tr('Criando o terceiro nó', 'Creating the third node'), tr(`novo ← CRIAR_NÓ(${fmt(v3)}): outro nó isolado. A variável novo deixa de apontar para ${fmt(v2)}, mas ${fmt(v2)} continua na árvore, ligado por raiz.esquerda.`, `newNode ← CREATE_NODE(${fmt(v3)}): another isolated node. The variable newNode stops pointing to ${fmt(v2)}, but ${fmt(v2)} stays in the tree, linked by root.left.`), 'reading', { changedIndices: [c] });
  t.setChild(a, 'right', c);
  const isBst = v2 < v1 && v3 >= v1;
  step(15, tr('Árvore montada', 'Tree built'), tr(`raiz.direita ← novo: ${fmt(v3)} é o filho direito. Ligar nós é só atribuir referências, então qualquer valor pode ficar em qualquer lugar. ${isBst
    ? `Aqui ${fmt(v2)} < ${fmt(v1)} ≤ ${fmt(v3)}: esta árvore binária também é uma ABB.`
    : `Aqui a regra esquerda < raiz ≤ direita não vale (${fmt(v2)}, ${fmt(v1)}, ${fmt(v3)}): é uma árvore binária, mas não é uma ABB.`}`, `root.right ← newNode: ${fmt(v3)} is the right child. Linking nodes is just assigning references, so any value can end up anywhere. ${isBst ? `Here ${fmt(v2)} < ${fmt(v1)} ≤ ${fmt(v3)}: this binary tree is also a BST.` : `Here the rule left < root ≤ right does not hold (${fmt(v2)}, ${fmt(v1)}, ${fmt(v3)}): it is a binary tree, but not a BST.`}`), 'done', {
    foundIndices: [a, b, c],
    output: [tr(`Árvore com raiz ${fmt(v1)}, esquerda ${fmt(v2)} e direita ${fmt(v3)}${isBst ? ' (é uma ABB).' : ' (não é uma ABB).'}`, `Tree with root ${fmt(v1)}, left ${fmt(v2)} and right ${fmt(v3)}${isBst ? ' (it is a BST).' : ' (it is not a BST).'}`)],
  });
  return t.finish();
}

function anatomySteps(valores, focus) {
  const tree = buildTree(valores);
  const t = treeTrace({ tree, layout: layoutOf(tree), locals: ['raiz'] });
  const { step } = t;

  if (!tree.nodes.length) {
    step(0, tr('Árvore vazia', 'Empty tree'), tr('Uma árvore sem nós não tem raiz: raiz = NULO. Insira valores nos dados para ver a anatomia.', 'A tree with no nodes has no root: root = NULL. Enter values in the data to see the anatomy.'), 'warning');
    return t.finish();
  }

  const nodes = tree.nodes;
  const depths = depthsOf(tree);
  const parents = parentsOf(tree);
  const total = nodes.length;
  const H = heightOf(tree);
  const f = nodes[focus] ? focus : deepestNode(valores);
  const v = (id) => fmt(nodes[id].value);
  const leaves = nodes.filter((node) => node.left === null && node.right === null).map((node) => node.id);
  const kids = [nodes[f].left, nodes[f].right].filter((id) => typeof id === 'number');
  const parent = parents.get(f)?.parent;
  const family = { 'nó escolhido': v(f) };

  step(0, tr('A árvore binária', 'The binary tree'), tr(`Cada nó guarda um valor e, no máximo, dois filhos: esquerdo e direito. Esta árvore tem ${plural(total, tr('nó', 'node'), tr('nós', 'nodes'))} e altura ${H}.`, `Each node holds a value and at most two children: left and right. This tree has ${plural(total, tr('nó', 'node'), tr('nós', 'nodes'))} and height ${H}.`), 'neutral', { variables: { nós: total, altura: H } });
  step(1, tr('Raiz', 'Root'), tr(`A raiz é o nó sem pai: ${v(tree.root)}. Toda a árvore começa nela.`, `The root is the node with no parent: ${v(tree.root)}. The whole tree starts there.`), 'reading', { changedIndices: [tree.root] });

  const kidsText = kids.length ? `${kids.length === 1 ? tr('seu filho é', 'its child is') : tr('seus filhos são', 'its children are')} ${list(kids.map(v))}` : tr('não tem filhos (é uma folha)', 'has no children (it is a leaf)');
  step(2, tr('Pai e filhos', 'Parent and children'), `${typeof parent === 'number' ? tr(`${v(f)} é filho de ${v(parent)}`, `${v(f)} is a child of ${v(parent)}`) : tr(`${v(f)} é a raiz e não tem pai`, `${v(f)} is the root and has no parent`)}; ${kidsText}.`, 'reading', {
    activeIndices: [f], changedIndices: typeof parent === 'number' ? [parent] : [], foundIndices: kids, variables: family,
  });
  step(3, tr('Folhas', 'Leaves'), tr(`Folhas são os nós sem filhos: ${list(leaves.map(v))}.`, `Leaves are the nodes with no children: ${list(leaves.map(v))}.`), 'reading', { foundIndices: leaves });
  step(4, tr('Arestas', 'Edges'), tr(`Cada aresta liga um pai a um filho. ${plural(total, tr('nó', 'node'), tr('nós', 'nodes'))} têm ${total - 1} ${total - 1 === 1 ? tr('aresta', 'edge') : tr('arestas', 'edges')}.`, `Each edge links a parent to a child. ${plural(total, tr('nó', 'node'), tr('nós', 'nodes'))} have ${total - 1} ${total - 1 === 1 ? tr('aresta', 'edge') : tr('arestas', 'edges')}.`), 'reading', {
    hotEdges: nodes.filter((node) => node.id !== tree.root).map((node) => node.id),
  });

  const below = subtree(nodes, f);
  step(5, tr('Subárvore', 'Subtree'), tr(`A subárvore de ${v(f)} é formada por ele e por todos os seus descendentes: ${list(below.map(v))} (${plural(below.length, tr('nó', 'node'), tr('nós', 'nodes'))}). Os demais nós ficam de fora.`, `The subtree of ${v(f)} is made of it and all its descendants: ${list(below.map(v))} (${plural(below.length, tr('nó', 'node'), tr('nós', 'nodes'))}). The other nodes are left out.`), 'reading', {
    activeIndices: below, dimIndices: nodes.map((node) => node.id).filter((id) => !below.includes(id)), variables: family,
  });

  const path = [];
  for (let id = f; typeof id === 'number'; id = parents.get(id)?.parent) path.unshift(id);
  step(6, tr('Profundidade', 'Depth'), tr(`profundidade(${v(f)}) = ${depths.get(f)}: são ${plural(depths.get(f), tr('aresta', 'edge'), tr('arestas', 'edges'))} da raiz até o nó, pelo caminho ${list(path.map(v))}. Convenção: a raiz está no nível 0.`, `depth(${v(f)}) = ${depths.get(f)}: that is ${plural(depths.get(f), tr('aresta', 'edge'), tr('arestas', 'edges'))} from the root to the node, along the path ${list(path.map(v))}. Convention: the root is at level 0.`), 'reading', {
    processedIndices: path.slice(0, -1), activeIndices: [f], hotEdges: path.slice(1), variables: { ...family, profundidade: depths.get(f) },
  });

  const down = [f];
  for (let id = f; ;) {
    const { left, right } = nodes[id];
    const next = heightOf(tree, left) >= heightOf(tree, right) ? left : right;
    if (typeof next !== 'number') break;
    down.push(next);
    id = next;
  }
  const h = heightOf(tree, f);
  step(7, tr('Altura', 'Height'), tr(`altura(${v(f)}) = ${h}: o maior número de arestas até uma folha descendente (${list(down.map(v))}). Convenção: uma folha tem altura 0. A altura da árvore é a da raiz: ${H}.`, `height(${v(f)}) = ${h}: the largest number of edges down to a descendant leaf (${list(down.map(v))}). Convention: a leaf has height 0. The height of the tree is that of the root: ${H}.`), 'done', {
    processedIndices: down.slice(0, -1), activeIndices: [f], foundIndices: [down.at(-1)], hotEdges: down.slice(1), variables: { ...family, altura: h },
    output: [tr(`profundidade(${v(f)}) = ${depths.get(f)}`, `depth(${v(f)}) = ${depths.get(f)}`), tr(`altura(${v(f)}) = ${h}`, `height(${v(f)}) = ${h}`), tr(`altura da árvore = ${H}`, `tree height = ${H}`)],
  });
  return t.finish();
}

function ruleSteps(valores, mode) {
  const broken = mode === 'error';
  const tree = broken ? brokenTree() : buildTree(valores);
  const t = treeTrace({ tree, layout: layoutOf(tree), locals: ['raiz'] });
  const { step } = t;
  const { nodes } = tree;

  if (!nodes.length) {
    step(0, tr('Árvore vazia', 'Empty tree'), tr('Uma árvore vazia respeita a regra: não há nenhum nó para violá-la.', 'An empty tree respects the rule: there is no node to violate it.'), 'warning');
    return t.finish();
  }

  const v = (id) => fmt(nodes[id].value);
  step(0, tr('A regra global', 'The global rule'), tr(`Para cada nó de valor v: tudo à esquerda é menor que v e tudo à direita é maior ou igual a v. A regra vale para toda a subárvore, não só para os filhos diretos.${broken ? ' Esta é a árvore com erro da aula: 45 foi colocado à esquerda de 40.' : ''}`, `For each node with value v: everything on the left is smaller than v and everything on the right is greater than or equal to v. The rule holds for the whole subtree, not only for the direct children.${broken ? ' This is the lesson tree with the mistake: 45 was placed to the left of 40.' : ''}`));

  const flagged = new Map();
  let violations = 0;
  preorder(tree).forEach((id) => {
    const left = subtree(nodes, nodes[id].left);
    const right = subtree(nodes, nodes[id].right);
    const badLeft = left.filter((other) => nodes[other].value >= nodes[id].value);
    const badRight = right.filter((other) => nodes[other].value < nodes[id].value);
    const bad = [...badLeft, ...badRight];
    const ok = bad.length === 0;
    bad.forEach((other) => flagged.set(other, id));
    const carried = ok ? [...left, ...right].filter((other) => flagged.has(other)) : [];

    let text;
    if (!left.length && !right.length) text = tr(`${v(id)} é uma folha: não há subárvores para conferir, a regra vale.`, `${v(id)} is a leaf: there are no subtrees to check, the rule holds.`);
    else if (!ok) {
      text = [
        ...badLeft.map((other) => tr(`${v(other)} está na subárvore esquerda de ${v(id)}, mas ${v(other)} ≥ ${v(id)}`, `${v(other)} is in the left subtree of ${v(id)}, but ${v(other)} ≥ ${v(id)}`)),
        ...badRight.map((other) => tr(`${v(other)} está na subárvore direita de ${v(id)}, mas ${v(other)} < ${v(id)}`, `${v(other)} is in the right subtree of ${v(id)}, but ${v(other)} < ${v(id)}`)),
      ].join('; ');
      text += '. A regra foi violada.';
    } else {
      const parts = [];
      if (left.length) parts.push(tr(`esquerda (${list(left.map(v))}) é menor que ${v(id)}`, `left (${list(left.map(v))}) is smaller than ${v(id)}`));
      if (right.length) parts.push(tr(`direita (${list(right.map(v))}) é maior ou igual a ${v(id)}`, `right (${list(right.map(v))}) is greater than or equal to ${v(id)}`));
      text = tr(`Em ${v(id)}: ${parts.join(' e ')}. A regra vale.`, `At ${v(id)}: ${parts.join(' and ')}. The rule holds.`);
      if (carried.length) text += tr(` Localmente ela vale, mas ${list(carried.map(v))} já violou a regra de um ancestral: ela vale para toda a subárvore.`, ` Locally it holds, but ${list(carried.map(v))} already violated the rule of an ancestor: it holds for the whole subtree.`);
    }
    if (!ok) violations += 1;
    step(ok ? [1, 2, 3] : [1, 2, 5], tr(`Conferindo o nó ${v(id)}`, `Checking node ${v(id)}`), text, ok ? 'comparison' : 'warning', {
      activeIndices: [id], leftIndices: left, rightIndices: right, errorIndices: [...flagged.keys()],
      variables: { 'nó v': v(id), regra: ok ? 'respeitada' : 'violada' },
    });
  });

  const done = violations === 0;
  step(7, done ? tr('É uma ABB', 'It is a BST') : tr('Não é uma ABB', 'It is not a BST'), done
    ? tr('A regra vale em todos os nós: a árvore é uma ABB. Valores iguais ficam à direita, como no pseudocódigo de INSERIR.', 'The rule holds at every node: the tree is a BST. Equal values go to the right, as in the INSERT pseudocode.')
    : tr(`A regra foi violada em ${plural(violations, tr('nó', 'node'), tr('nós', 'nodes'))}: ${list([...flagged].map(([other, owner]) => `${v(other)} em ${v(owner)}`))}. Uma árvore binária não é sempre uma ABB.`, `The rule was violated at ${plural(violations, tr('nó', 'node'), tr('nós', 'nodes'))}: ${list([...flagged].map(([other, owner]) => `${v(other)} at ${v(owner)}`))}. A binary tree is not always a BST.`), done ? 'done' : 'warning', {
    errorIndices: [...flagged.keys()], output: [done ? tr('A árvore é uma ABB.', 'The tree is a BST.') : tr('A árvore não é uma ABB.', 'The tree is not a BST.')],
  });
  return t.finish();
}

// ---------------------------------------------------------------------------------------------
// INSERIR (usado por "Inserir um valor" e por "Construir a árvore")
// ---------------------------------------------------------------------------------------------

// Linha de cada comando no pseudocódigo de INSERIR (base 0).
const INSERT_LINES = {
  header: 0, create: 1, test: 2, assign: 3, ret: 4, atual: 6, pai: 7, loop: 8, paiAtual: 9, cmp: 10, left: 11, right: 13, linkTest: 16, linkLeft: 17, linkRight: 19,
};
// Em "Construir a árvore" todos os passos ficam na linha INSERIR(valor).
const BUILD_LINES = Object.fromEntries(Object.keys(INSERT_LINES).map((key) => [key, 1]));

/**
 * Executa um INSERIR(valor). Com `verbose`, um passo por linha executada (como nos slides); sem ele,
 * apenas a criação do nó, uma comparação por nível e a ligação.
 */
function insertCore(t, valor, L, { verbose, last = true }) {
  const { st, step } = t;
  const v = fmt(valor);
  const val = (id) => fmt(t.node(id).value);
  const out = (text) => (last ? { output: [text] } : {});

  if (verbose) step(L.header, tr('Chamando INSERIR(valor)', 'Calling INSERT(value)'), tr(`INSERIR(${v}) é executado. Ainda NÃO executamos a criação do nó.`, `INSERT(${v}) is executed. We have NOT executed the node creation yet.`));
  const novo = t.create(valor);
  step(L.create, tr('Criando o novo nó', 'Creating the new node'), tr(`CRIAR_NÓ(${v}) aloca o nó novo. Ele surge SEPARADO da árvore, com esquerda e direita nulas.`, `CREATE_NODE(${v}) allocates the new node. It appears SEPARATE from the tree, with left and right null.`), 'reading', { changedIndices: [novo] });

  const empty = st.refs.raiz === null;
  if (verbose) {
    step(L.test, tr('Verificando se a árvore está vazia', 'Checking whether the tree is empty'), empty ? tr('raiz = NULO: a árvore está vazia.', 'root = NULL: the tree is empty.') : tr('Testamos se a árvore está vazia. Não está.', 'We test whether the tree is empty. It is not.'), 'comparison', { variables: { 'raiz = NULO': empty ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') } });
  }
  if (empty) {
    t.set('raiz', novo);
    step(L.assign, tr('Definindo a raiz', 'Setting the root'), tr('raiz passa a apontar para o novo nó, que agora faz parte da árvore.', 'root now points to the new node, which is now part of the tree.'), verbose || !last ? 'update' : 'done', { changedIndices: [novo], ...(verbose ? {} : out(tr(`${v} é a raiz da árvore.`, `${v} is the root of the tree.`))) });
    if (verbose) step(L.ret, tr('INSERIR() concluído', 'INSERT() finished'), tr(`${v} é a raiz da árvore. O procedimento retorna sem executar o laço.`, `${v} is the root of the tree. The procedure returns without running the loop.`), 'done', { foundIndices: [novo], ...out(tr(`INSERIR(${v}): ${v} é a raiz.`, `INSERT(${v}): ${v} is the root.`)) });
    return;
  }

  t.set('atual', st.refs.raiz);
  if (verbose) step(L.atual, tr('Iniciando o atual', 'Initializing current'), tr('atual começa na raiz.', 'current starts at the root.'), 'update', { activeIndices: [st.refs.atual] });
  t.set('pai', null);
  if (verbose) step(L.pai, tr('Iniciando o pai', 'Initializing parent'), tr('pai é inicializado com NULO.', 'parent is initialized with NULL.'), 'update', { activeIndices: [st.refs.atual] });

  let first = true;
  for (;;) {
    const atual = st.refs.atual;
    if (verbose) {
      const cont = atual !== null;
      step(L.loop, tr('Verificando atual ≠ NULO', 'Checking current ≠ NULL'), cont ? (first ? tr('Como atual ≠ NULO, entramos no laço.', 'Since current ≠ NULL, we enter the loop.') : tr('O laço continua.', 'The loop continues.')) : tr('O laço termina porque atual é NULO.', 'The loop ends because current is NULL.'), 'comparison', {
        activeIndices: cont ? [atual] : [], variables: { 'condição do ENQUANTO': cont ? 'verdadeira' : 'falsa' },
      });
    }
    if (atual === null) break;
    first = false;

    t.set('pai', atual);
    if (verbose) step(L.paiAtual, tr('Atualizando o pai', 'Updating the parent'), tr(`pai recebe o nó ${val(atual)}.`, `parent receives node ${val(atual)}.`), 'update', { activeIndices: [atual] });

    const goLeft = valor < t.node(atual).value;
    if (verbose) {
      step(L.cmp, tr(`Comparando com ${val(atual)}`, `Comparing with ${val(atual)}`), goLeft
        ? tr('A comparação indica que devemos seguir para a esquerda.', 'The comparison says we should go left.')
        : `${valor === t.node(atual).value ? tr(`${v} = ${val(atual)}: não é menor, então o fluxo cai no SENÃO e segue para a direita (iguais ficam à direita).`, `${v} = ${val(atual)}: it is not smaller, so the flow falls into the ELSE and goes right (equal values go to the right).`) : tr('A comparação indica que devemos seguir para a direita.', 'The comparison says we should go right.')}`, 'comparison', {
        activeIndices: [atual], variables: { comparação: `${v} < ${val(atual)} → ${goLeft ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE')}` },
      });
    }
    const child = t.follow('atual', atual, goLeft ? 'left' : 'right');
    const arrived = child === null ? tr(' Chegamos a uma referência nula: encontramos o ponto de inserção.', ' We reached a null reference: we found the insertion point.') : '';
    if (verbose) {
      step(goLeft ? L.left : L.right, tr('Descendo na árvore', 'Going down the tree'), tr(`atual passa a apontar para o filho ${side(goLeft ? 'left' : 'right')} de ${val(atual)}.${arrived}`, `current now points to the ${side(goLeft ? 'left' : 'right')} child of ${val(atual)}.${arrived}`), 'update', { activeIndices: child === null ? [atual] : [child] });
    } else {
      step(L.cmp, tr(`Comparando com ${val(atual)}`, `Comparing with ${val(atual)}`), tr(`${v} ${goLeft ? '<' : valor === t.node(atual).value ? '=' : '>'} ${val(atual)}: segue à ${side(goLeft ? 'left' : 'right')}.${arrived}`, `${v} ${goLeft ? '<' : valor === t.node(atual).value ? '=' : '>'} ${val(atual)}: goes ${side(goLeft ? 'left' : 'right')}.${arrived}`), 'comparison', {
        activeIndices: [atual],
      });
    }
  }

  const pai = st.refs.pai;
  const goLeft = valor < t.node(pai).value;
  if (verbose) {
    step(L.linkTest, tr('Decidindo o lado da ligação', 'Deciding the side of the link'), tr(`Decidimos ligar o novo nó à ${side(goLeft ? 'left' : 'right')} de pai.`, `We decide to link the new node on the ${side(goLeft ? 'left' : 'right')} of parent.`), 'comparison', {
      activeIndices: [pai], variables: { comparação: `${v} < ${val(pai)} → ${goLeft ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE')}` },
    });
  }
  t.setChild(pai, goLeft ? 'left' : 'right', novo);
  step(goLeft ? L.linkLeft : L.linkRight, tr('Ligando o novo nó', 'Linking the new node'), tr(`${verbose ? 'O novo nó é ligado' : `${v} é ligado`} à ${side(goLeft ? 'left' : 'right')} de ${val(pai)}. Inserção concluída.`, `${verbose ? 'The new node is linked' : `${v} is linked`} on the ${side(goLeft ? 'left' : 'right')} of ${val(pai)}. Insertion finished.`), last ? 'done' : 'update', {
    changedIndices: [pai], foundIndices: [novo], ...out(tr(`INSERIR(${v}) ligou o nó à ${side(goLeft ? 'left' : 'right')} de ${val(pai)}.`, `INSERT(${v}) linked the node on the ${side(goLeft ? 'left' : 'right')} of ${val(pai)}.`)),
  });
}

function insertSteps(valores, valor) {
  const tree = buildTree(valores);
  const layout = layoutOf(buildTree([...valores, valor]));
  const t = treeTrace({
    tree, layout, params: { valor: fmt(valor) }, locals: ['raiz', 'novo', 'atual', 'pai'],
  });
  insertCore(t, valor, INSERT_LINES, { verbose: true });
  return t.finish();
}

function buildAllSteps(valores) {
  const layout = layoutOf(buildTree(valores));
  const t = treeTrace({
    tree: emptyTree(), layout, params: { valor: '—' }, locals: ['raiz', 'novo', 'atual', 'pai'],
  });
  const { st, step } = t;

  if (!valores.length) {
    step(0, tr('Sequência vazia', 'Empty sequence'), tr('Sem valores, não há nada a inserir: a árvore continua vazia (raiz = NULO).', 'With no values, there is nothing to insert: the tree stays empty (root = NULL).'), 'warning');
    return t.finish();
  }
  step(0, tr('Iniciando a construção', 'Starting the build'), tr(`A árvore começa vazia (raiz = NULO). Serão inseridos ${plural(valores.length, tr('valor', 'value'), tr('valores', 'values'))}, na ordem da lista.`, `The tree starts empty (root = NULL). ${plural(valores.length, tr('valor', 'value'), tr('valores', 'values'))} will be inserted, in the order of the list.`));
  valores.forEach((valor, index) => {
    t.setParams({ valor: fmt(valor) });
    t.clear(['novo', 'atual', 'pai']);
    insertCore(t, valor, BUILD_LINES, { verbose: false, last: index === valores.length - 1 });
  });

  const tree = { nodes: st.nodes, root: st.refs.raiz };
  const H = heightOf(tree);
  const leaves = st.nodes.filter((node) => node.left === null && node.right === null).map((node) => node.id);
  const final = t.finish();
  const lastStep = final.at(-1);
  lastStep.description += tr(` Raiz: ${fmt(st.nodes[tree.root].value)}; folhas: ${list(leaves.map((id) => fmt(st.nodes[id].value)))}; altura: ${H}${H === valores.length - 1 && valores.length > 2 ? ' (uma cadeia: a árvore degenerou em lista)' : ''}.`, ` Root: ${fmt(st.nodes[tree.root].value)}; leaves: ${list(leaves.map((id) => fmt(st.nodes[id].value)))}; height: ${H}${H === valores.length - 1 && valores.length > 2 ? ' (a chain: the tree degenerated into a list)' : ''}.`);
  lastStep.variables = { ...lastStep.variables, altura: H };
  return final;
}

// ---------------------------------------------------------------------------------------------
// BUSCAR
// ---------------------------------------------------------------------------------------------

function searchSteps(valores, valor) {
  const tree = buildTree(valores);
  const t = treeTrace({
    tree, layout: layoutOf(tree), params: { valor: fmt(valor) }, locals: ['raiz', 'atual'],
  });
  const { st, step } = t;
  const v = fmt(valor);
  const val = (id) => fmt(t.node(id).value);

  t.set('atual', st.refs.raiz);
  step(1, tr('Começando pela raiz', 'Starting at the root'), st.refs.atual === null ? tr('A busca começa na raiz, mas a árvore está vazia: atual = NULO.', 'The search starts at the root, but the tree is empty: current = NULL.') : tr('A busca começa na raiz.', 'The search starts at the root.'), 'update', { activeIndices: st.refs.atual === null ? [] : [st.refs.atual] });

  for (;;) {
    const atual = st.refs.atual;
    const cont = atual !== null;
    step(2, tr('Verificando atual ≠ NULO', 'Checking current ≠ NULL'), cont ? tr('Como atual ≠ NULO, continuamos a busca.', 'Since current ≠ NULL, we continue the search.') : tr('atual chegou a NULO: não há mais onde procurar.', 'current reached NULL: there is nowhere else to look.'), 'comparison', {
      activeIndices: cont ? [atual] : [], variables: { 'condição do ENQUANTO': cont ? 'verdadeira' : 'falsa' },
    });
    if (!cont) break;

    const equal = valor === t.node(atual).value;
    step(3, tr(`Comparando com ${val(atual)}`, `Comparing with ${val(atual)}`), equal ? tr(`O valor procurado está no nó ${val(atual)}.`, `The searched value is in node ${val(atual)}.`) : tr(`O valor procurado não está no nó ${val(atual)}.`, `The searched value is not in node ${val(atual)}.`), 'comparison', {
      activeIndices: [atual], variables: { comparação: `${v} = ${val(atual)} → ${equal ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE')}` },
    });
    if (equal) {
      step(4, tr('Valor encontrado', 'Value found'), tr(`A função retorna VERDADEIRO e a busca termina com sucesso, no nó ${val(atual)}.`, `The function returns TRUE and the search ends successfully, at node ${val(atual)}.`), 'done', {
        foundIndices: [atual], variables: { retorno: tr('VERDADEIRO', 'TRUE') }, output: [tr(`BUSCAR(${v}) retornou VERDADEIRO.`, `SEARCH(${v}) returned TRUE.`)],
      });
      return t.finish();
    }

    const goLeft = valor < t.node(atual).value;
    step(5, tr(`Comparando com ${val(atual)}`, `Comparing with ${val(atual)}`), goLeft
      ? tr('O valor procurado é menor: a busca segue pela subárvore esquerda e a direita é descartada.', 'The searched value is smaller: the search goes down the left subtree and the right one is discarded.')
      : tr('O valor procurado é maior: a busca segue pela subárvore direita e a esquerda é descartada.', 'The searched value is larger: the search goes down the right subtree and the left one is discarded.'), 'comparison', {
      activeIndices: [atual], variables: { comparação: `${v} < ${val(atual)} → ${goLeft ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE')}` },
    });
    const child = t.follow('atual', atual, goLeft ? 'left' : 'right');
    step(goLeft ? 6 : 8, tr('Descendo na árvore', 'Going down the tree'), tr(`atual passa a apontar para o filho ${side(goLeft ? 'left' : 'right')} de ${val(atual)}${child === null ? ': NULO' : ''}.`, `current now points to the ${side(goLeft ? 'left' : 'right')} child of ${val(atual)}${child === null ? ': NULL' : ''}.`), 'update', { activeIndices: child === null ? [atual] : [child] });
  }

  step(11, tr('Valor não encontrado', 'Value not found'), tr(`atual chegou a NULO sem encontrar ${v}: o valor não está na árvore. A função retorna FALSO.`, `current reached NULL without finding ${v}: the value is not in the tree. The function returns FALSE.`), 'warning', {
    variables: { retorno: tr('FALSO', 'FALSE') }, output: [tr(`BUSCAR(${v}) retornou FALSO.`, `SEARCH(${v}) returned FALSE.`)],
  });
  return t.finish();
}

// ---------------------------------------------------------------------------------------------
// REMOVER
// ---------------------------------------------------------------------------------------------

function removeSteps(valores, valor) {
  const tree = buildTree(valores);
  const t = treeTrace({
    tree,
    layout: layoutOf(tree),
    params: { valor: fmt(valor) },
    locals: ['raiz', 'atual', 'pai', 'paiSuc', 'suc', 'filho'],
  });
  const { st, step } = t;
  const v = fmt(valor);
  const val = (id) => fmt(t.node(id).value);
  const has = (id, which) => typeof t.node(id)[which] === 'number';

  step(0, tr('Chamando REMOVER(raiz, valor)', 'Calling REMOVE(root, value)'), tr(`Início da chamada REMOVER(raiz, ${v}).`, `Start of the call REMOVE(root, ${v}).`));
  t.set('pai', null);
  step(1, tr('Iniciando o pai', 'Initializing parent'), tr('Variável pai inicializada com NULO.', 'Variable parent initialized with NULL.'), 'update');
  t.set('atual', st.refs.raiz);
  step(2, tr('Iniciando o atual', 'Initializing current'), tr('Variável atual recebe a referência da raiz.', 'Variable current receives the reference of the root.'), 'update', { activeIndices: typeof st.refs.atual === 'number' ? [st.refs.atual] : [] });

  // 1ª etapa: localizar o alvo e o pai dele.
  for (;;) {
    const atual = st.refs.atual;
    const keep = atual !== null && t.node(atual).value !== valor;
    const why = atual === null ? tr('Encerrar a busca: atual é NULO, o valor não está na árvore.', 'End the search: current is NULL, the value is not in the tree.') : keep ? tr('Continuar descendo.', 'Keep going down.') : tr('Encerrar a busca do alvo: condição do ENQUANTO é falsa.', 'End the search for the target: the WHILE condition is false.');
    step(3, tr('Verificando a condição do laço', 'Checking the loop condition'), why, 'comparison', {
      activeIndices: atual === null ? [] : [atual], variables: { 'condição do ENQUANTO': keep ? 'verdadeira' : 'falsa' },
    });
    if (!keep) break;

    t.set('pai', atual);
    step(4, tr('Guardando o pai', 'Saving the parent'), tr('pai guarda o último nó válido.', 'parent keeps the last valid node.'), 'update', { activeIndices: [atual] });
    const goLeft = valor < t.node(atual).value;
    step(5, tr(`Comparando com ${val(atual)}`, `Comparing with ${val(atual)}`), goLeft ? tr('Valor procurado é menor: seguir à esquerda.', 'Searched value is smaller: go left.') : tr('Valor procurado não é menor: seguir à direita.', 'Searched value is not smaller: go right.'), 'comparison', {
      activeIndices: [atual], variables: { comparação: `${v} < ${val(atual)} → ${goLeft ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE')}` },
    });
    if (!goLeft) step(7, tr('Entrando no SENÃO', 'Entering the ELSE'), tr('A condição foi falsa: executamos o SENÃO.', 'The condition was false: we run the ELSE.'), 'neutral', { activeIndices: [atual] });
    const child = t.follow('atual', atual, goLeft ? 'left' : 'right');
    step(goLeft ? 6 : 8, tr('Descendo na árvore', 'Going down the tree'), tr(`atual recebe a referência do filho ${side(goLeft ? 'left' : 'right')}${child === null ? ' (NULO)' : ''}.`, `current receives the reference of the ${side(goLeft ? 'left' : 'right')} child${child === null ? ' (NULL)' : ''}.`), 'update', { activeIndices: child === null ? [atual] : [child] });
    step(9, tr('Fim da escolha', 'End of the choice'), tr('Fim da escolha esquerda/direita.', 'End of the left/right choice.'), 'neutral', { activeIndices: child === null ? [atual] : [child] });
    step(10, tr('Fim do corpo do laço', 'End of the loop body'), tr('Fim do corpo do ENQUANTO; voltamos à condição da linha 4.', 'End of the WHILE body; we go back to the condition on line 4.'), 'neutral', { activeIndices: child === null ? [atual] : [child] });
  }

  const alvo = st.refs.atual;
  const missing = alvo === null;
  step(11, tr('Verificando se o valor existe', 'Checking whether the value exists'), missing ? tr('atual = NULO: o valor não existe na árvore.', 'current = NULL: the value does not exist in the tree.') : tr('Alvo localizado; não executar retorno antecipado.', 'Target located; do not run the early return.'), 'comparison', {
    activeIndices: missing ? [] : [alvo], variables: { 'atual = NULO': missing ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
  });
  if (missing) {
    step(12, tr('REMOVER() concluído', 'REMOVE() finished'), tr(`Valor inexistente: retornamos a raiz sem alterar a árvore. ${v} não estava na árvore.`, `Nonexistent value: we return the root without changing the tree. ${v} was not in the tree.`), 'warning', {
      output: [tr(`REMOVER(${v}): valor não encontrado; a árvore não mudou.`, `REMOVE(${v}): value not found; the tree did not change.`)],
    });
    return t.finish();
  }
  step(13, tr('Fim do teste', 'End of the test'), tr('Fim do teste de valor inexistente.', 'End of the test for a nonexistent value.'), 'neutral', { activeIndices: [alvo] });

  // 2ª etapa: dois filhos. Copiar o valor do sucessor em ordem e passar a remover o nó dele.
  const two = has(alvo, 'left') && has(alvo, 'right');
  const kind = two ? tr('um nó com dois filhos', 'a node with two children') : (has(alvo, 'left') || has(alvo, 'right')) ? tr('um nó com um filho', 'a node with one child') : tr('uma folha', 'a leaf');
  step(14, tr('Verificando se há dois filhos', 'Checking whether there are two children'), two ? tr('Nó possui dois filhos: procurar sucessor em ordem.', 'The node has two children: look for the in-order successor.') : tr('Nó possui no máximo um filho: pular tratamento do sucessor.', 'The node has at most one child: skip the successor handling.'), 'comparison', {
    activeIndices: [alvo], variables: { 'dois filhos': two ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
  });
  if (two) {
    t.set('paiSuc', alvo);
    step(15, tr('Iniciando o paiSuc', 'Initializing succParent'), tr('paiSuc começa no nó a ser removido.', 'succParent starts at the node to be removed.'), 'update', { activeIndices: [alvo] });
    t.set('suc', t.node(alvo).right);
    step(16, tr('Iniciando o suc', 'Initializing succ'), tr('suc começa na subárvore direita.', 'succ starts in the right subtree.'), 'update', { activeIndices: [alvo], foundIndices: [st.refs.suc] });
    for (;;) {
      const suc = st.refs.suc;
      const more = has(suc, 'left');
      step(17, tr('Procurando o sucessor', 'Looking for the successor'), more ? tr('O sucessor ainda tem filho à esquerda: continuar descendo.', 'The successor still has a left child: keep going down.') : tr('Chegamos ao menor nó da subárvore direita.', 'We reached the smallest node of the right subtree.'), 'comparison', {
        activeIndices: [alvo], foundIndices: [suc], variables: { 'suc.esq ≠ NULO': more ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
      });
      if (!more) break;
      t.set('paiSuc', suc);
      step(18, tr('Atualizando o paiSuc', 'Updating succParent'), tr('Atualizamos o pai do sucessor.', 'We update the parent of the successor.'), 'update', { activeIndices: [alvo], foundIndices: [suc] });
      t.set('suc', t.node(suc).left);
      step(19, tr('Descendo à esquerda', 'Going down to the left'), tr('Deslocamos o sucessor para a esquerda.', 'We move the successor to the left.'), 'update', { activeIndices: [alvo], foundIndices: [st.refs.suc] });
      step(20, tr('Fim do corpo do laço', 'End of the loop body'), tr('Fim do corpo do ENQUANTO; voltamos ao teste da linha 18.', 'End of the WHILE body; we go back to the test on line 18.'), 'neutral', { activeIndices: [alvo], foundIndices: [st.refs.suc] });
    }
    const suc = st.refs.suc;
    t.setValue(alvo, t.node(suc).value);
    step(21, tr('Copiando o valor do sucessor', 'Copying the successor\'s value'), tr('Copiamos apenas o valor do sucessor; a estrutura ainda não mudou. Temporariamente existem duas ocorrências do valor.', 'We copy only the successor\'s value; the structure has not changed yet. Temporarily there are two occurrences of the value.'), 'update', { changedIndices: [alvo], foundIndices: [suc] });
    t.set('pai', st.refs.paiSuc);
    step(22, tr('Atualizando o pai', 'Updating the parent'), tr('pai agora é o pai do sucessor original.', 'parent is now the parent of the original successor.'), 'update', { activeIndices: [alvo], foundIndices: [suc] });
    t.set('atual', suc);
    step(23, tr('Mirando o sucessor', 'Aiming at the successor'), tr('atual passa a apontar para o nó sucessor original, que será desligado.', 'current now points to the original successor node, which will be detached.'), 'update', { activeIndices: [suc] });
    step(24, tr('Fim do tratamento especial', 'End of the special handling'), tr('Fim do tratamento especial de dois filhos.', 'End of the special handling of two children.'), 'neutral', { activeIndices: [suc] });
  } else {
    step(24, tr('Fim do tratamento especial', 'End of the special handling'), tr('Fim do tratamento especial de dois filhos.', 'End of the special handling of two children.'), 'neutral', { activeIndices: [alvo] });
  }

  // 3ª etapa: escolher o filho que fica no lugar e religar o pai (ou a raiz).
  const target = st.refs.atual;
  const hasLeft = has(target, 'left');
  step(25, tr('Verificando o filho esquerdo', 'Checking the left child'), hasLeft ? tr('Há filho esquerdo: ele ocupará o lugar do nó removido.', 'There is a left child: it will take the place of the removed node.') : tr('Não há filho esquerdo; usar filho direito (que pode ser NULO).', 'There is no left child; use the right child (which may be NULL).'), 'comparison', {
    activeIndices: [target], variables: { 'atual.esq ≠ NULO': hasLeft ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
  });
  if (hasLeft) {
    t.set('filho', t.node(target).left);
    step(26, tr('Escolhendo o filho', 'Choosing the child'), tr('filho recebe a referência esquerda de atual.', 'child receives the left reference of current.'), 'update', { activeIndices: [target], foundIndices: [st.refs.filho] });
  } else {
    step(27, tr('Entrando no SENÃO', 'Entering the ELSE'), tr('Entramos no SENÃO, pois atual.esq é NULO.', 'We enter the ELSE, since current.left is NULL.'), 'neutral', { activeIndices: [target] });
    const child = t.follow('filho', target, 'right');
    step(28, tr('Escolhendo o filho', 'Choosing the child'), tr(`filho recebe a referência direita de atual${child === null ? ' (NULO)' : ''}.`, `child receives the right reference of current${child === null ? ' (NULL)' : ''}.`), 'update', { activeIndices: [target], foundIndices: child === null ? [] : [child] });
  }
  const filho = st.refs.filho;
  const kept = typeof filho === 'number' ? [filho] : [];
  step(29, tr('Fim da escolha', 'End of the choice'), tr('Fim da escolha do único filho/substituto.', 'End of the choice of the only child/replacement.'), 'neutral', { activeIndices: [target], foundIndices: kept });

  const pai = st.refs.pai;
  const isRoot = pai === null;
  step(30, tr('Verificando se o alvo é a raiz', 'Checking whether the target is the root'), isRoot ? tr('O alvo é a raiz: a raiz passará a ser o filho.', 'The target is the root: the root will become the child.') : tr('O nó possui pai; atualizar a ligação de seu pai.', 'The node has a parent; update the link of its parent.'), 'comparison', {
    activeIndices: [target], foundIndices: kept, variables: { 'pai = NULO': isRoot ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
  });
  const lostId = target;
  if (isRoot) {
    t.set('raiz', filho);
    step(31, tr('Atualizando a raiz', 'Updating the root'), tr('raiz passa a apontar para filho (ou NULO).', 'root now points to child (or NULL).'), 'update', { changedIndices: typeof filho === 'number' ? [filho] : [], activeIndices: [target] });
  } else {
    const isLeft = t.node(pai).left === target;
    step(32, tr('Verificando o lado do pai', 'Checking the side of the parent'), isLeft ? tr('O alvo é filho esquerdo de pai.', 'The target is the left child of parent.') : tr('O alvo é filho direito de pai.', 'The target is the right child of parent.'), 'comparison', {
      activeIndices: [target], foundIndices: kept, variables: { 'pai.esq = atual': isLeft ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
    });
    if (!isLeft) step(34, tr('Entrando no SENÃO', 'Entering the ELSE'), tr('Entramos no SENÃO: o alvo é o filho direito de pai.', 'We enter the ELSE: the target is the right child of parent.'), 'neutral', { activeIndices: [target] });
    t.setChild(pai, isLeft ? 'left' : 'right', filho);
    step(isLeft ? 33 : 35, tr('Religando o pai', 'Relinking the parent'), tr(`pai.${isLeft ? 'esq' : 'dir'} passa a apontar para filho (ou NULO). O nó ${val(lostId)} deixa de ser alcançável.`, `parent.${isLeft ? 'left' : 'right'} now points to child (or NULL). Node ${val(lostId)} is no longer reachable.`), 'update', {
      changedIndices: [pai], activeIndices: [target], foundIndices: kept,
    });
  }
  step(36, tr('Fim da atualização', 'End of the update'), tr('Fim da atualização de referências.', 'End of the reference updates.'), 'neutral', { foundIndices: kept });
  t.drop(lostId);
  step(37, tr('REMOVER() concluído', 'REMOVE() finished'), tr('Retorno da raiz atualizada; a remoção terminou.', 'Return of the updated root; the removal is finished.'), 'done', {
    foundIndices: kept, output: [tr(`REMOVER(${v}) removeu ${kind}${two ? ' (o valor do sucessor foi copiado para o nó).' : '.'}`, `REMOVE(${v}) removed ${kind}${two ? ' (the successor value was copied into the node).' : '.'}`)],
  });
  return t.finish();
}

export function buildSteps(id, data, config) {
  const { values } = data;
  switch (id) {
    case 'node': return nodeSteps(values);
    case 'anatomy': return anatomySteps(values, config.focus);
    case 'rule': return ruleSteps(values, config.rule);
    case 'insert': return insertSteps(values, config.insertValue);
    case 'build': return buildAllSteps(values);
    case 'search': return searchSteps(values, config.searchValue);
    case 'remove': return removeSteps(values, config.removeValue);
    default: return nodeSteps(values);
  }
}
