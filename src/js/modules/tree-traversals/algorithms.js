import {
  buildTree, fmt, heightOf, inorder, layoutOf, levelorder, postorder, preorder, treeTrace,
} from '../shared/tree-scene.js';
import { extendVariableNames, tr } from '../../core/i18n.js';

extendVariableNames({ No: 'Node' });

// Ordem das ações de cada percurso em profundidade dentro da função (o que muda é só a posição do
// IMPRIMIR em relação às duas chamadas recursivas).
const DFS = {
  preorder: { name: 'preorder', order: ['print', 'left', 'right'] },
  inorder: { name: 'inorder', order: ['left', 'print', 'right'] },
  postorder: { name: 'postorder', order: ['left', 'right', 'print'] },
};

const ACTION_CODE = {
  print: () => tr('IMPRIMIR No.valor', 'PRINT Node.value'),
  left: (name) => tr(`${name}(No.esquerdo)`, `${name}(Node.left)`),
  right: (name) => tr(`${name}(No.direito)`, `${name}(Node.right)`),
};

/** Pseudocódigo da aula (slides "Pseudocódigo – DFS em pré-ordem / em ordem / pós-ordem"). */
function dfsCode(kind) {
  const { name, order } = DFS[kind];
  return [
    tr(`FUNÇÃO ${name}(No)`, `FUNCTION ${name}(Node)`),
    tr('  SE No é NULO ENTÃO', '  IF Node is NULL THEN'),
    tr('    RETORNE', '    RETURN'),
    tr('  FIM_SE', '  END_IF'),
    ...order.map((action) => `  ${ACTION_CODE[action](name)}`),
    tr('FIM_FUNÇÃO', 'END_FUNCTION'),
  ];
}

export const algorithms = [
  {
    id: 'factorial', title: tr('Recursão: o fatorial de n (fatorial)', 'Recursion: the factorial of n (factorial)'), menuLabel: tr('fatorial(n)', 'factorial(n)'), group: tr('Recursão', 'Recursion'), number: '01',
    description: tr('Uma função recursiva chama a si mesma para resolver um problema menor. Ela precisa de um caso base, que interrompe as chamadas, e de um caso recursivo, que se aproxima do caso base. Cada chamada ganha um frame na pilha de chamadas.', 'A recursive function calls itself to solve a smaller problem. It needs a base case, which stops the calls, and a recursive case, which moves toward the base case. Each call gets a frame on the call stack.'),
    interaction: tr('Escolha o n e acompanhe a pilha crescer até o caso base (n = 0) e depois esvaziar, multiplicando no caminho de volta. Os percursos de árvores usam exatamente esse mecanismo.', 'Choose n and watch the stack grow until the base case (n = 0) and then empty, multiplying on the way back. Tree traversals use exactly this mechanism.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('São n + 1 chamadas, com uma multiplicação em cada uma, e todas ficam empilhadas ao mesmo tempo quando se chega ao caso base.', 'There are n + 1 calls, with one multiplication in each, and all of them are stacked at the same time when the base case is reached.') },
    pseudocode: [
      tr('FUNÇÃO fatorial(n)', 'FUNCTION factorial(n)'),
      tr('  // Caso base: 0! é 1', '  // Base case: 0! is 1'),
      tr('  SE n = 0 ENTÃO', '  IF n = 0 THEN'),
      tr('    RETORNE 1', '    RETURN 1'),
      tr('  SENÃO', '  ELSE'),
      tr('    // Caso recursivo: n × (n − 1)!', '    // Recursive case: n × (n − 1)!'),
      tr('    RETORNE n × fatorial(n − 1)', '    RETURN n × factorial(n − 1)'),
      tr('  FIM_SE', '  END_IF'),
      tr('FIM_FUNÇÃO', 'END_FUNCTION'),
    ],
  },
  {
    id: 'preorder', title: tr('Percurso em pré-ordem (preorder)', 'Pre-order traversal (preorder)'), menuLabel: tr('preorder(No)', 'preorder(Node)'), group: tr('Em profundidade (DFS)', 'Depth-first (DFS)'), number: '02',
    description: tr('Visita a raiz, depois percorre a subárvore esquerda e, por fim, a direita, sempre em pré-ordem. Visitar um nó é executar uma ação nele; aqui, imprimir o valor.', 'Visit the root, then traverse the left subtree and, finally, the right one, always in pre-order. Visiting a node means running an action on it; here, printing the value.'),
    interaction: tr('Acompanhe o ponteiro No, a pilha de chamadas e o console: cada nó é impresso antes dos seus filhos. Use a árvore dos slides ou monte a sua e clique em um nó para inspecioná-lo.', 'Follow the Node pointer, the call stack and the console: each node is printed before its children. Use the slides\' tree or build your own and click a node to inspect it.'),
    complexity: { time: 'O(n)', space: 'O(h)', note: tr('Cada nó é visitado uma vez (2n + 1 chamadas, contando as que recebem NULO). A pilha chega a h + 2 frames: O(log n) numa árvore equilibrada e O(n) numa cadeia.', 'Each node is visited once (2n + 1 calls, counting the ones that receive NULL). The stack reaches h + 2 frames: O(log n) in a balanced tree and O(n) in a chain.') },
    pseudocode: dfsCode('preorder'),
  },
  {
    id: 'inorder', title: tr('Percurso em ordem (inorder)', 'In-order traversal (inorder)'), menuLabel: tr('inorder(No)', 'inorder(Node)'), group: tr('Em profundidade (DFS)', 'Depth-first (DFS)'), number: '03',
    description: tr('Percorre a subárvore esquerda, visita a raiz e percorre a subárvore direita, sempre em ordem (também chamada de ordem simétrica). A raiz é visitada entre as duas subárvores.', 'Traverse the left subtree, visit the root and traverse the right subtree, always in-order (also called symmetric order). The root is visited between the two subtrees.'),
    interaction: tr('Repare que a saída sai em ordem crescente: numa ABB, tudo à esquerda é menor e tudo à direita é maior ou igual, então visitar nessa ordem lista os valores ordenados.', 'Notice that the output comes out in ascending order: in a BST, everything on the left is smaller and everything on the right is greater or equal, so visiting in this order lists the values sorted.'),
    complexity: { time: 'O(n)', space: 'O(h)', note: tr('Cada nó é visitado uma vez (2n + 1 chamadas, contando as que recebem NULO). A pilha chega a h + 2 frames: O(log n) numa árvore equilibrada e O(n) numa cadeia.', 'Each node is visited once (2n + 1 calls, counting the ones that receive NULL). The stack reaches h + 2 frames: O(log n) in a balanced tree and O(n) in a chain.') },
    pseudocode: dfsCode('inorder'),
  },
  {
    id: 'postorder', title: tr('Percurso em pós-ordem (postorder)', 'Post-order traversal (postorder)'), menuLabel: tr('postorder(No)', 'postorder(Node)'), group: tr('Em profundidade (DFS)', 'Depth-first (DFS)'), number: '04',
    description: tr('Percorre a subárvore esquerda, depois a direita e só então visita a raiz, sempre em pós-ordem. Os filhos são visitados antes do pai.', 'Traverse the left subtree, then the right one and only then visit the root, always in post-order. The children are visited before the parent.'),
    interaction: tr('Veja que a raiz é sempre o último nó impresso e que cada nó só é impresso depois de toda a subárvore dele. É a ordem para apagar uma árvore de baixo para cima.', 'See that the root is always the last node printed and that each node is only printed after its whole subtree. It is the order for deleting a tree from the bottom up.'),
    complexity: { time: 'O(n)', space: 'O(h)', note: tr('Cada nó é visitado uma vez (2n + 1 chamadas, contando as que recebem NULO). A pilha chega a h + 2 frames: O(log n) numa árvore equilibrada e O(n) numa cadeia.', 'Each node is visited once (2n + 1 calls, counting the ones that receive NULL). The stack reaches h + 2 frames: O(log n) in a balanced tree and O(n) in a chain.') },
    pseudocode: dfsCode('postorder'),
  },
  {
    id: 'bfs', title: tr('Percurso em largura (bfs)', 'Breadth-first traversal (bfs)'), menuLabel: tr('bfs(raiz)', 'bfs(root)'), group: tr('Em largura (BFS)', 'Breadth-first (BFS)'), number: '05',
    description: tr('Visita os nós nível por nível, da esquerda para a direita: primeiro a raiz, depois os filhos da raiz, depois os filhos dos filhos. Usa uma fila: o nó sai pela frente e os filhos dele entram por trás.', 'Visit the nodes level by level, from left to right: first the root, then the children of the root, then the children of the children. It uses a queue: the node leaves from the front and its children enter at the back.'),
    interaction: tr('Acompanhe a fila: o primeiro a entrar é o primeiro a sair, por isso os níveis saem em sequência. Compare com a árvore em ordem crescente, em que a fila nunca passa de um nó.', 'Follow the queue: the first to enter is the first to leave, so the levels come out in sequence. Compare with the ascending tree, where the queue never goes beyond one node.'),
    complexity: { time: 'O(n)', space: 'O(w)', note: tr('Cada nó entra e sai da fila uma vez. A fila guarda nós de, no máximo, dois níveis seguidos, então o espaço depende da largura w da árvore: O(n) numa árvore cheia e O(1) numa cadeia.', 'Each node enters and leaves the queue once. The queue holds nodes from at most two consecutive levels, so the space depends on the width w of the tree: O(n) in a full tree and O(1) in a chain.') },
    pseudocode: [
      tr('FUNÇÃO bfs(raiz)', 'FUNCTION bfs(root)'),
      tr('  SE raiz é NULO ENTÃO', '  IF root is NULL THEN'),
      tr('    RETORNE', '    RETURN'),
      tr('  FIM_SE', '  END_IF'),
      tr('  CRIE uma fila', '  CREATE a queue'),
      tr('  INSIRA a raiz na fila', '  INSERT the root into the queue'),
      tr('  ENQUANTO a fila não está vazia FAÇA', '  WHILE the queue is not empty DO'),
      tr('    No ← fila.remover()', '    Node ← queue.remove()'),
      tr('    IMPRIMIR No.valor', '    PRINT Node.value'),
      tr('    SE No.esquerdo não é NULO ENTÃO', '    IF Node.left is not NULL THEN'),
      tr('      fila.inserir(No.esquerdo)', '      queue.insert(Node.left)'),
      tr('    FIM_SE', '    END_IF'),
      tr('    SE No.direito não é NULO ENTÃO', '    IF Node.right is not NULL THEN'),
      tr('      fila.inserir(No.direito)', '      queue.insert(Node.right)'),
      tr('    FIM_SE', '    END_IF'),
      tr('  FIM_ENQUANTO', '  END_WHILE'),
      tr('FIM_FUNÇÃO', 'END_FUNCTION'),
    ],
  },
  {
    id: 'compare', title: tr('Comparando os quatro percursos', 'Comparing the four traversals'), menuLabel: tr('DFS × BFS', 'DFS × BFS'), group: tr('Comparação', 'Comparison'), number: '06',
    description: tr('Os três percursos em profundidade e o percurso em largura visitam os mesmos nós, só que em ordens diferentes, e usam estruturas diferentes: a pilha de chamadas (DFS) e a fila (BFS).', 'The three depth-first traversals and the breadth-first traversal visit the same nodes, only in different orders, and use different structures: the call stack (DFS) and the queue (BFS).'),
    interaction: tr('Use o exercício 1 da aula: anote a sequência de cada percurso no papel e confira aqui. Depois tente a árvore em ordem crescente e veja o que muda na pilha e na fila.', 'Use the lesson\'s exercise 1: write down the sequence of each traversal on paper and check it here. Then try the ascending tree and see what changes in the stack and the queue.'),
    complexity: { time: 'O(n)', space: 'O(h) · O(w)', note: tr('Os quatro visitam cada nó uma vez. O que muda é a memória auxiliar: a pilha de chamadas do DFS cresce com a altura h e a fila do BFS cresce com a largura w.', 'All four visit each node once. What changes is the auxiliary memory: the DFS call stack grows with the height h and the BFS queue grows with the width w.') },
    pseudocode: [
      tr('// Em profundidade (DFS): desce um ramo até o fim antes de voltar', '// Depth-first (DFS): goes down a branch to the end before coming back'),
      tr('pré-ordem: raiz, esquerda, direita', 'pre-order: root, left, right'),
      tr('em ordem: esquerda, raiz, direita', 'in-order: left, root, right'),
      tr('pós-ordem: esquerda, direita, raiz', 'post-order: left, right, root'),
      tr('// Em largura (BFS): visita os nós nível por nível, com uma fila', '// Breadth-first (BFS): visits the nodes level by level, with a queue'),
      tr('largura: nível 0, nível 1, nível 2, ... da esquerda para a direita', 'breadth-first: level 0, level 1, level 2, ... from left to right'),
      tr('// Quando usar cada um', '// When to use each one'),
      tr('DFS: espaço de busca muito profundo, nó possivelmente longe da raiz', 'DFS: very deep search space, node possibly far from the root'),
      tr('BFS: nó perto da raiz, ou solução mais curta', 'BFS: node close to the root, or shortest solution'),
    ],
  },
];

const isId = (id) => typeof id === 'number';
const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const side = (action) => (action === 'left' ? tr('esquerdo', 'left') : tr('direito', 'right'));
const sequence = (tree, ids) => ids.map((id) => fmt(tree.nodes[id].value)).join(' ');

/** A pilha de chamadas de um percurso em profundidade chega a altura + 2 frames (a chamada com NULO conta). */
const maxStack = (tree) => (tree.root === null ? 1 : heightOf(tree) + 2);

/** Tamanho máximo da fila do percurso em largura. */
function maxQueue(tree) {
  const queue = isId(tree.root) ? [tree.root] : [];
  let max = queue.length;
  while (queue.length) {
    const id = queue.shift();
    ['left', 'right'].forEach((key) => {
      if (isId(tree.nodes[id][key])) queue.push(tree.nodes[id][key]);
    });
    max = Math.max(max, queue.length);
  }
  return max;
}

// ---------------------------------------------------------------------------------------------
// Recursão: fatorial
// ---------------------------------------------------------------------------------------------

function factorialSteps(n) {
  const steps = [];
  const frames = []; // { n, expr }: a pilha de chamadas, da primeira até a que está executando
  const call = (k) => tr(`fatorial(${k})`, `factorial(${k})`);

  const emit = (line, title, description, tone, extra = {}) => {
    const { variables = {}, ...marks } = extra;
    const top = frames.at(-1);
    steps.push({
      line,
      title,
      description,
      tone,
      output: [],
      returned: null,
      frames: frames.map((frame, index) => ({ ...frame, top: index === frames.length - 1 })),
      variables: { n: top ? top.n : '—', ...variables },
      ...marks,
    });
  };

  /** Executa a chamada que está no topo da pilha e devolve o valor que ela retorna. */
  const run = (k) => {
    const me = frames.at(-1);
    const root = frames.length === 1;
    const base = k === 0;
    emit(2, tr('Testando o caso base', 'Testing the base case'), base
      ? tr('n = 0 é verdadeiro: este é o caso base, que não faz nova chamada.', 'n = 0 is true: this is the base case, which makes no new call.')
      : tr(`n vale ${k}, então n = 0 é falso: não é o caso base. A execução vai para o caso recursivo.`, `n is ${k}, so n = 0 is false: it is not the base case. The execution goes to the recursive case.`), 'comparison', {
      variables: { 'n = 0': base ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
    });

    if (base) {
      me.expr = tr('retorna 1', 'returns 1');
      const text = tr(`${call(0)} retorna 1. É o primeiro valor que volta: a partir daqui as chamadas pendentes podem ser calculadas.`, `${call(0)} returns 1. It is the first value to come back: from here on the pending calls can be calculated.`);
      if (root) {
        frames.pop();
        emit(3, tr('Retornando 1 (caso base)', 'Returning 1 (base case)'), tr(`${call(0)} retorna 1 e, como foi a primeira chamada, a pilha esvazia.`, `${call(0)} returns 1 and, since it was the first call, the stack empties.`), 'done', {
          returned: tr(`${call(0)} retorna 1`, `${call(0)} returns 1`), output: [`${call(0)} = 1`], variables: { retorno: 1 },
        });
      } else {
        emit(3, tr('Retornando 1 (caso base)', 'Returning 1 (base case)'), text, 'update', { returned: tr(`${call(0)} retorna 1`, `${call(0)} returns 1`), variables: { retorno: 1 } });
        frames.pop();
      }
      return 1;
    }

    me.expr = `${k} × ${call(k - 1)}`;
    emit(6, tr(`Chamando ${call(k - 1)}`, `Calling ${call(k - 1)}`), tr(`RETORNE ${k} × ${call(k - 1)} precisa do valor de ${call(k - 1)}: a função chama a si mesma com um problema menor. ${call(k)} fica esperando na pilha.`, `RETURN ${k} × ${call(k - 1)} needs the value of ${call(k - 1)}: the function calls itself with a smaller problem. ${call(k)} waits on the stack.`), 'neutral');
    frames.push({ n: k - 1, expr: null });
    const result = run(k - 1);

    const value = k * result;
    me.expr = tr(`${k} × ${result} = ${value}`, `${k} × ${result} = ${value}`);
    const text = tr(`${call(k - 1)} devolveu ${result}. Agora ${k} × ${result} = ${value}, e ${call(k)} retorna ${value}.`, `${call(k - 1)} returned ${result}. Now ${k} × ${result} = ${value}, and ${call(k)} returns ${value}.`);
    if (root) {
      frames.pop();
      emit(6, tr(`Calculando ${k} × ${result}`, `Calculating ${k} × ${result}`), tr(`${text} Era a primeira chamada: a pilha esvazia e o resultado final é ${value}.`, `${text} It was the first call: the stack empties and the final result is ${value}.`), 'done', {
        returned: tr(`${call(k)} retorna ${value}`, `${call(k)} returns ${value}`), output: [`${call(k)} = ${value}`], variables: { retorno: value },
      });
    } else {
      emit(6, tr(`Calculando ${k} × ${result}`, `Calculating ${k} × ${result}`), text, 'update', { returned: tr(`${call(k)} retorna ${value}`, `${call(k)} returns ${value}`), variables: { retorno: value } });
      frames.pop();
    }
    return value;
  };

  frames.push({ n, expr: null });
  emit(0, tr(`Chamando ${call(n)}`, `Calling ${call(n)}`), tr(`${call(n)} é chamada pelo programa principal. A função ganha o primeiro frame da pilha, com n = ${n}.`, `${call(n)} is called by the main program. The function gets the first frame of the stack, with n = ${n}.`), 'neutral');
  run(n);
  // Reserva a altura da pilha cheia (n + 1 frames) para o desenho não pular a cada passo.
  steps.forEach((item) => { item.capacity = n + 1; });
  return steps;
}

// ---------------------------------------------------------------------------------------------
// Percursos em profundidade (DFS)
// ---------------------------------------------------------------------------------------------

function dfsSteps(kind, valores) {
  const { name, order } = DFS[kind];
  const line = (action) => 4 + order.indexOf(action);
  const tree = buildTree(valores);
  const t = treeTrace({ tree, layout: layoutOf(tree), locals: ['raiz', tr('No', 'Node')] });
  const frames = []; // ids dos nós (ou null) das chamadas em andamento, da primeira até a do topo
  const printed = [];
  const val = (id) => fmt(t.node(id).value);
  const frameText = (id) => `${name}(${isId(id) ? val(id) : tr('nulo', 'NULL')})`;
  const consoleLines = () => (printed.length ? [printed.map(val).join(' ')] : []);
  const nextText = (next) => (next ? ACTION_CODE[next](name) : tr('FIM_FUNÇÃO', 'END_FUNCTION'));

  /** Registra um passo com a pilha, o console, o nó da chamada atual e os que aguardam na pilha. */
  const snap = (index, title, description, tone, extra = {}) => {
    const top = frames.at(-1);
    const found = extra.foundIndices ?? [];
    t.step(index, title, description, tone, {
      stack: frames.map(frameText),
      output: consoleLines(),
      activeIndices: isId(top) ? [top] : [],
      leftIndices: frames.slice(0, -1).filter(isId),
      processedIndices: printed.filter((id) => !found.includes(id)),
      hotEdges: frames.slice(1).filter(isId),
      ...extra,
    });
  };

  /**
   * Termina a chamada do topo. O passo mostra a chamada ainda na pilha (como o último slide de cada
   * percurso, com No ainda no nó); ela só sai depois, e a variável No volta a apontar para o
   * chamador. A primeira chamada não tem para quem voltar: é o último passo.
   */
  const leave = (index, title, description, back, tone = 'neutral') => {
    if (!back) {
      snap(index, title, description, tone === 'neutral' ? 'done' : tone);
      return;
    }
    snap(index, title, tr(`${description} A chamada sai da pilha e a execução volta para ${frameText(back.caller)}, que segue para a linha “${nextText(back.next)}”.`, `${description} The call leaves the stack and the execution goes back to ${frameText(back.caller)}, which continues to the line “${nextText(back.next)}”.`), tone);
    frames.pop();
    t.set('No', back.caller);
  };

  const print = (id) => {
    printed.push(id);
    t.badge(id, `${printed.length}º`);
    const hasLeft = isId(t.node(id).left);
    const leaf = !hasLeft && !isId(t.node(id).right);
    const why = {
      preorder: tr(`${val(id)} é visitado antes dos filhos: a raiz da subárvore vem primeiro.`, `${val(id)} is visited before its children: the root of the subtree comes first.`),
      inorder: tr(`A subárvore esquerda de ${val(id)} ${hasLeft ? 'já foi toda percorrida' : 'está vazia (NULO)'}: agora ${val(id)} é visitado e, depois, a direita.`, `The left subtree of ${val(id)} ${hasLeft ? 'has been fully traversed' : 'is empty (NULL)'}: now ${val(id)} is visited and, after that, the right one.`),
      postorder: tr(`${leaf ? `${val(id)} é uma folha: as duas subárvores estão vazias` : `As duas subárvores de ${val(id)} já foram percorridas`}, só agora ${val(id)} é visitado.`, `${leaf ? `${val(id)} is a leaf: both subtrees are empty` : `Both subtrees of ${val(id)} have been traversed`}, only now is ${val(id)} visited.`),
    }[kind];
    snap(line('print'), tr(`Imprimindo ${val(id)}`, `Printing ${val(id)}`), tr(`IMPRIMIR No.valor escreve ${val(id)} no console, a ${printed.length}ª visita. ${why}`, `PRINT Node.value writes ${val(id)} to the console, visit number ${printed.length}. ${why}`), 'update', { foundIndices: [id] });
  };

  const visit = (id, back) => {
    if (!isId(id)) {
      snap(1, tr('Testando se No é NULO', 'Testing whether Node is NULL'), tr('No é NULO: não há nó aqui. É o caso base da recursão.', 'Node is NULL: there is no node here. It is the base case of the recursion.'), 'comparison', { variables: { 'No é NULO': tr('VERDADEIRO', 'TRUE') } });
      leave(2, tr('Retornando (caso base)', 'Returning (base case)'), tr(`RETORNE encerra ${frameText(id)} sem fazer nada.`, `RETURN ends ${frameText(id)} without doing anything.`), back, back ? 'neutral' : 'warning');
      return;
    }
    snap(1, tr('Testando se No é NULO', 'Testing whether Node is NULL'), tr(`No aponta para o nó ${val(id)}, que não é NULO: a chamada continua.`, `Node points to node ${val(id)}, which is not NULL: the call continues.`), 'comparison', { variables: { 'No é NULO': tr('FALSO', 'FALSE') } });
    order.forEach((action, index) => {
      if (action === 'print') {
        print(id);
        return;
      }
      const child = t.node(id)[action];
      const arg = tr(`No.${side(action)}`, `Node.${side(action)}`);
      snap(line(action), tr(`Chamando ${name}(${arg})`, `Calling ${name}(${arg})`), isId(child)
        ? tr(`${name}(${arg}) chama a função para o filho ${side(action)} de ${val(id)}, o nó ${val(child)}. A chamada vai para o topo da pilha.`, `${name}(${arg}) calls the function for the ${side(action)} child of ${val(id)}, node ${val(child)}. The call goes to the top of the stack.`)
        : tr(`${arg} é NULO, mas a função é chamada mesmo assim: a chamada com NULO é o caso base e volta logo em seguida.`, `${arg} is NULL, but the function is called anyway: the call with NULL is the base case and returns right away.`), 'neutral', {
        hotEdges: [...frames.slice(1).filter(isId), ...(isId(child) ? [child] : [])],
        changedIndices: isId(child) ? [child] : [],
      });
      frames.push(child);
      t.follow(tr('No', 'Node'), id, action);
      visit(child, { caller: id, next: order[index + 1] });
    });
    const text = tr(`${frameText(id)} chegou ao fim da função.`, `${frameText(id)} reached the end of the function.`);
    leave(7, tr(`Fim de ${frameText(id)}`, `End of ${frameText(id)}`), back ? text : tr(`${text} Era a primeira chamada: ao sair, a pilha esvazia e o percurso está completo.`, `${text} It was the first call: when it leaves, the stack empties and the traversal is complete.`), back);
  };

  frames.push(tree.root);
  t.set('No', tree.root);
  snap(0, tr(`Chamando ${name}(raiz)`, `Calling ${name}(root)`), isId(tree.root)
    ? tr(`${name}(raiz) é chamada pelo programa principal: No recebe a raiz, o nó ${val(tree.root)}, e a pilha ganha o primeiro frame.`, `${name}(root) is called by the main program: Node receives the root, node ${val(tree.root)}, and the stack gets its first frame.`)
    : tr(`${name}(raiz) é chamada com a árvore vazia: raiz e No são NULO.`, `${name}(root) is called with the empty tree: root and Node are NULL.`), 'neutral');
  visit(tree.root, null);

  const final = t.finish();
  const last = final.at(-1);
  if (!printed.length) {
    last.description = tr(`${last.description} A árvore está vazia: nada foi impresso.`, `${last.description} The tree is empty: nothing was printed.`);
    return final;
  }
  const ending = {
    preorder: tr('Como a raiz vem antes dos filhos, é a ordem usada para copiar a estrutura da árvore e para a notação prefixa.', 'Since the root comes before the children, it is the order used to copy the structure of the tree and for prefix notation.'),
    inorder: tr('Numa ABB a sequência sai em ordem crescente, sem precisar de um algoritmo de ordenação.', 'In a BST the sequence comes out in ascending order, without needing a sorting algorithm.'),
    postorder: tr('Os filhos vêm antes do pai e a raiz é a última: é a ordem para liberar a árvore de baixo para cima e para a notação pós-fixa.', 'The children come before the parent and the root is last: it is the order for freeing the tree from the bottom up and for postfix notation.'),
  }[kind];
  last.description = tr(`Percurso completo: ${sequence(tree, printed)}. ${ending}`, `Complete traversal: ${sequence(tree, printed)}. ${ending}`);
  return final;
}

// ---------------------------------------------------------------------------------------------
// Percurso em largura (BFS)
// ---------------------------------------------------------------------------------------------

function bfsSteps(valores) {
  const tree = buildTree(valores);
  const t = treeTrace({ tree, layout: layoutOf(tree), locals: ['raiz', tr('No', 'Node')] });
  const queue = [];
  const printed = [];
  let created = false;
  const val = (id) => fmt(t.node(id).value);
  const queueText = () => (queue.length ? queue.map(val).join(', ') : tr('vazia', 'empty'));
  const sizeText = () => (queue.length ? tr(`A fila tem ${plural(queue.length, tr('nó', 'node'), tr('nós', 'nodes'))}: ${queueText()}.`, `The queue has ${plural(queue.length, tr('nó', 'node'), tr('nós', 'nodes'))}: ${queueText()}.`) : tr('A fila ficou vazia.', 'The queue became empty.'));

  const snap = (index, title, description, tone, extra = {}) => {
    const { variables = {}, ...marks } = extra;
    const current = t.st.refs.No;
    const found = marks.foundIndices ?? [];
    t.step(index, title, description, tone, {
      queue: created ? queue.map(val) : null,
      output: printed.length ? [printed.map(val).join(' ')] : [],
      activeIndices: isId(current) ? [current] : [],
      rightIndices: [...queue],
      processedIndices: printed.filter((id) => !found.includes(id)),
      variables: { fila: created ? queueText() : '—', ...variables },
      ...marks,
    });
  };

  const empty = !isId(tree.root);
  snap(0, tr('Chamando bfs(raiz)', 'Calling bfs(root)'), empty ? tr('bfs(raiz) é chamada com a árvore vazia: raiz é NULO.', 'bfs(root) is called with the empty tree: root is NULL.') : tr(`bfs(raiz) é chamada pelo programa principal com a raiz, o nó ${val(tree.root)}.`, `bfs(root) is called by the main program with the root, node ${val(tree.root)}.`), 'neutral');
  snap(1, tr('Testando se raiz é NULO', 'Testing whether root is NULL'), empty ? tr('raiz é NULO: não há nada a percorrer.', 'root is NULL: there is nothing to traverse.') : tr(`raiz aponta para o nó ${val(tree.root)}, que não é NULO: o percurso continua.`, `root points to node ${val(tree.root)}, which is not NULL: the traversal continues.`), 'comparison', {
    variables: { 'raiz é NULO': empty ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
  });
  if (empty) {
    snap(2, tr('Retornando', 'Returning'), tr('RETORNE encerra a função: a árvore está vazia e nada é impresso.', 'RETURN ends the function: the tree is empty and nothing is printed.'), 'warning');
    return t.finish();
  }

  created = true;
  snap(4, tr('Criando a fila', 'Creating the queue'), tr('CRIE uma fila: ela começa vazia. O percurso em largura usa uma fila (primeiro a entrar, primeiro a sair) para guardar os nós que ainda faltam visitar.', 'CREATE a queue: it starts empty. The breadth-first traversal uses a queue (first in, first out) to hold the nodes that still have to be visited.'), 'update');
  queue.push(tree.root);
  snap(5, tr('Inserindo a raiz na fila', 'Inserting the root into the queue'), tr(`A raiz, ${val(tree.root)}, entra na fila. ${sizeText()}`, `The root, ${val(tree.root)}, enters the queue. ${sizeText()}`), 'update', { changedIndices: [tree.root] });

  for (;;) {
    const more = queue.length > 0;
    snap(6, tr('Testando se a fila está vazia', 'Testing whether the queue is empty'), more
      ? tr(`A fila não está vazia (${plural(queue.length, tr('nó', 'node'), tr('nós', 'nodes'))}): o laço continua.`, `The queue is not empty (${plural(queue.length, tr('nó', 'node'), tr('nós', 'nodes'))}): the loop continues.`)
      : tr('A fila está vazia: todos os nós já foram visitados e o laço termina.', 'The queue is empty: all the nodes have been visited and the loop ends.'), 'comparison', {
      variables: { 'fila não está vazia': more ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
    });
    if (!more) break;

    const id = queue.shift();
    t.set('No', id);
    snap(7, tr(`Removendo ${val(id)} da fila`, `Removing ${val(id)} from the queue`), tr(`fila.remover() tira o primeiro nó da fila, ${val(id)}, e No passa a apontar para ele. ${sizeText()}`, `queue.remove() takes the first node out of the queue, ${val(id)}, and Node now points to it. ${sizeText()}`), 'update');

    printed.push(id);
    t.badge(id, `${printed.length}º`);
    snap(8, tr(`Imprimindo ${val(id)}`, `Printing ${val(id)}`), tr(`IMPRIMIR No.valor escreve ${val(id)} no console, a ${printed.length}ª visita. Os nós saem na ordem em que entraram, por isso os níveis são visitados em sequência.`, `PRINT Node.value writes ${val(id)} to the console, visit number ${printed.length}. The nodes leave in the order they entered, so the levels are visited in sequence.`), 'update', { foundIndices: [id] });

    ['left', 'right'].forEach((action) => {
      const child = t.node(id)[action];
      const has = isId(child);
      const field = tr(`No.${side(action)}`, `Node.${side(action)}`);
      const index = action === 'left' ? 9 : 12;
      snap(index, tr(`Testando ${field}`, `Testing ${field}`), has
        ? tr(`${field} aponta para o nó ${val(child)}, que não é NULO: ele precisa ser visitado depois.`, `${field} points to node ${val(child)}, which is not NULL: it has to be visited later.`)
        : tr(`${field} é NULO: não há filho ${side(action)}, então nada entra na fila.`, `${field} is NULL: there is no ${side(action)} child, so nothing enters the queue.`), 'comparison', {
        variables: { [tr(`${field} não é NULO`, `${field} is not NULL`)]: has ? tr('VERDADEIRO', 'TRUE') : tr('FALSO', 'FALSE') },
      });
      if (!has) return;
      queue.push(child);
      snap(index + 1, tr(`Inserindo ${val(child)} na fila`, `Inserting ${val(child)} into the queue`), tr(`fila.inserir(${field}) coloca o nó ${val(child)} no fim da fila. ${sizeText()}`, `queue.insert(${field}) puts node ${val(child)} at the end of the queue. ${sizeText()}`), 'update', {
        changedIndices: [child], hotEdges: [child],
      });
    });
  }

  t.clear([tr('No', 'Node')]);
  snap(16, tr('Fim de bfs', 'End of bfs'), tr(`A função terminou. Percurso completo: ${sequence(tree, printed)}. Cada nível foi visitado por inteiro, da esquerda para a direita, antes do próximo. Serve para achar o caminho mais curto e para mostrar uma hierarquia nível por nível.`, `The function finished. Complete traversal: ${sequence(tree, printed)}. Each level was visited entirely, from left to right, before the next. It is used to find the shortest path and to show a hierarchy level by level.`), 'done');
  return t.finish();
}

// ---------------------------------------------------------------------------------------------
// Comparação
// ---------------------------------------------------------------------------------------------

function compareSteps(valores) {
  const tree = buildTree(valores);
  const t = treeTrace({ tree, layout: layoutOf(tree), locals: ['raiz'] });
  const { step } = t;

  if (!tree.nodes.length) {
    step(0, tr('Árvore vazia', 'Empty tree'), tr('Uma árvore vazia não tem nós para visitar: os quatro percursos terminam sem imprimir nada. Insira valores nos dados para compará-los.', 'An empty tree has no nodes to visit: the four traversals end without printing anything. Enter values in the data to compare them.'), 'warning');
    return t.finish();
  }

  const orders = [
    {
      key: tr('pré-ordem', 'pre-order'), line: 1, ids: preorder(tree), tail: tr('Começa na raiz e desce sempre pela esquerda antes de olhar a direita.', 'It starts at the root and always goes down the left before looking at the right.'),
    },
    {
      key: tr('em ordem', 'in-order'), line: 2, ids: inorder(tree), tail: tr('Começa no nó mais à esquerda. Numa ABB a sequência sai em ordem crescente.', 'It starts at the leftmost node. In a BST the sequence comes out in ascending order.'),
    },
    {
      key: tr('pós-ordem', 'post-order'), line: 3, ids: postorder(tree), tail: tr('Termina na raiz: cada nó só é visitado depois de toda a subárvore dele.', 'It ends at the root: each node is only visited after its whole subtree.'),
    },
    {
      key: tr('largura', 'breadth-first'), line: 5, ids: levelorder(tree), tail: tr('Começa na raiz e visita cada nível, da esquerda para a direita, antes de descer.', 'It starts at the root and visits each level, from left to right, before going down.'),
    },
  ];
  const lines = [];

  step(0, tr('A mesma árvore', 'The same tree'), tr(`A árvore tem ${plural(tree.nodes.length, tr('nó', 'node'), tr('nós', 'nodes'))} e altura ${heightOf(tree)}. Os quatro percursos visitam todos eles, uma vez cada, mas em ordens diferentes. Veja o selo abaixo de cada nó: é a posição dele na visita.`, `The tree has ${plural(tree.nodes.length, tr('nó', 'node'), tr('nós', 'nodes'))} and height ${heightOf(tree)}. The four traversals visit all of them, once each, but in different orders. See the badge below each node: it is its position in the visit.`), 'neutral', {
    variables: { nós: tree.nodes.length, altura: heightOf(tree) },
  });

  orders.forEach(({
    key, line, ids, tail,
  }) => {
    t.clearBadges();
    ids.forEach((id, index) => t.badge(id, `${index + 1}º`));
    lines.push(`${key}: ${sequence(tree, ids)}`);
    step(line, tr(`Percurso em ${key}`, `Traversal in ${key}`), `${lines.at(-1)}. ${tail}`, 'reading', {
      activeIndices: [ids[0]],
      foundIndices: [ids.at(-1)],
      output: [...lines],
      variables: { percurso: key, 'estrutura auxiliar': line === 5 ? tr('fila', 'queue') : tr('pilha de chamadas', 'call stack') },
    });
  });

  t.clearBadges();
  const stack = maxStack(tree);
  const queue = maxQueue(tree);
  step([6, 7, 8], tr('Quando usar cada um', 'When to use each one'), tr(`Nesta árvore a pilha de chamadas do DFS chega a ${plural(stack, 'frame', 'frames')} e a fila do BFS, a ${plural(queue, tr('nó', 'node'), tr('nós', 'nodes'))}. Use DFS quando o espaço de busca é muito profundo e o nó procurado pode estar longe da raiz; use BFS quando o nó está perto da raiz ou quando se quer a solução mais curta.`, `In this tree the DFS call stack reaches ${plural(stack, 'frame', 'frames')} and the BFS queue, ${plural(queue, tr('nó', 'node'), tr('nós', 'nodes'))}. Use DFS when the search space is very deep and the node you are looking for may be far from the root; use BFS when the node is close to the root or when you want the shortest solution.`), 'done', {
    output: [...lines],
    variables: { 'pilha máxima (DFS)': stack, 'fila máxima (BFS)': queue },
  });
  return t.finish();
}

export function buildSteps(id, data, config) {
  const { values } = data;
  switch (id) {
    case 'factorial': return factorialSteps(config.n);
    case 'preorder': return dfsSteps('preorder', values);
    case 'inorder': return dfsSteps('inorder', values);
    case 'postorder': return dfsSteps('postorder', values);
    case 'bfs': return bfsSteps(values);
    case 'compare': return compareSteps(values);
    default: return factorialSteps(config.n);
  }
}
