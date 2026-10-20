import {
  buildTree, fmt, heightOf, inorder, layoutOf, levelorder, postorder, preorder, treeTrace,
} from '../shared/tree-scene.js';

// Ordem das ações de cada percurso em profundidade dentro da função (o que muda é só a posição do
// IMPRIMIR em relação às duas chamadas recursivas).
const DFS = {
  preorder: { name: 'preorder', order: ['print', 'left', 'right'] },
  inorder: { name: 'inorder', order: ['left', 'print', 'right'] },
  postorder: { name: 'postorder', order: ['left', 'right', 'print'] },
};

const ACTION_CODE = {
  print: () => 'IMPRIMIR No.valor',
  left: (name) => `${name}(No.esquerdo)`,
  right: (name) => `${name}(No.direito)`,
};

/** Pseudocódigo da aula (slides "Pseudocódigo – DFS em pré-ordem / em ordem / pós-ordem"). */
function dfsCode(kind) {
  const { name, order } = DFS[kind];
  return [
    `FUNÇÃO ${name}(No)`,
    '  SE No é NULO ENTÃO',
    '    RETORNE',
    '  FIM_SE',
    ...order.map((action) => `  ${ACTION_CODE[action](name)}`),
    'FIM_FUNÇÃO',
  ];
}

export const algorithms = [
  {
    id: 'factorial', title: 'Recursão: o fatorial de n (fatorial)', menuLabel: 'fatorial(n)', group: 'Recursão', number: '01',
    description: 'Uma função recursiva chama a si mesma para resolver um problema menor. Ela precisa de um caso base, que interrompe as chamadas, e de um caso recursivo, que se aproxima do caso base. Cada chamada ganha um frame na pilha de chamadas.',
    interaction: 'Escolha o n e acompanhe a pilha crescer até o caso base (n = 0) e depois esvaziar, multiplicando no caminho de volta. Os percursos de árvores usam exatamente esse mecanismo.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'São n + 1 chamadas, com uma multiplicação em cada uma, e todas ficam empilhadas ao mesmo tempo quando se chega ao caso base.' },
    pseudocode: [
      'FUNÇÃO fatorial(n)',
      '  // Caso base: 0! é 1',
      '  SE n = 0 ENTÃO',
      '    RETORNE 1',
      '  SENÃO',
      '    // Caso recursivo: n × (n − 1)!',
      '    RETORNE n × fatorial(n − 1)',
      '  FIM_SE',
      'FIM_FUNÇÃO',
    ],
  },
  {
    id: 'preorder', title: 'Percurso em pré-ordem (preorder)', menuLabel: 'preorder(No)', group: 'Em profundidade (DFS)', number: '02',
    description: 'Visita a raiz, depois percorre a subárvore esquerda e, por fim, a direita, sempre em pré-ordem. Visitar um nó é executar uma ação nele; aqui, imprimir o valor.',
    interaction: 'Acompanhe o ponteiro No, a pilha de chamadas e o console: cada nó é impresso antes dos seus filhos. Use a árvore dos slides ou monte a sua e clique em um nó para inspecioná-lo.',
    complexity: { time: 'O(n)', space: 'O(h)', note: 'Cada nó é visitado uma vez (2n + 1 chamadas, contando as que recebem NULO). A pilha chega a h + 2 frames: O(log n) numa árvore equilibrada e O(n) numa cadeia.' },
    pseudocode: dfsCode('preorder'),
  },
  {
    id: 'inorder', title: 'Percurso em ordem (inorder)', menuLabel: 'inorder(No)', group: 'Em profundidade (DFS)', number: '03',
    description: 'Percorre a subárvore esquerda, visita a raiz e percorre a subárvore direita, sempre em ordem (também chamada de ordem simétrica). A raiz é visitada entre as duas subárvores.',
    interaction: 'Repare que a saída sai em ordem crescente: numa ABB, tudo à esquerda é menor e tudo à direita é maior ou igual, então visitar nessa ordem lista os valores ordenados.',
    complexity: { time: 'O(n)', space: 'O(h)', note: 'Cada nó é visitado uma vez (2n + 1 chamadas, contando as que recebem NULO). A pilha chega a h + 2 frames: O(log n) numa árvore equilibrada e O(n) numa cadeia.' },
    pseudocode: dfsCode('inorder'),
  },
  {
    id: 'postorder', title: 'Percurso em pós-ordem (postorder)', menuLabel: 'postorder(No)', group: 'Em profundidade (DFS)', number: '04',
    description: 'Percorre a subárvore esquerda, depois a direita e só então visita a raiz, sempre em pós-ordem. Os filhos são visitados antes do pai.',
    interaction: 'Veja que a raiz é sempre o último nó impresso e que cada nó só é impresso depois de toda a subárvore dele. É a ordem para apagar uma árvore de baixo para cima.',
    complexity: { time: 'O(n)', space: 'O(h)', note: 'Cada nó é visitado uma vez (2n + 1 chamadas, contando as que recebem NULO). A pilha chega a h + 2 frames: O(log n) numa árvore equilibrada e O(n) numa cadeia.' },
    pseudocode: dfsCode('postorder'),
  },
  {
    id: 'bfs', title: 'Percurso em largura (bfs)', menuLabel: 'bfs(raiz)', group: 'Em largura (BFS)', number: '05',
    description: 'Visita os nós nível por nível, da esquerda para a direita: primeiro a raiz, depois os filhos da raiz, depois os filhos dos filhos. Usa uma fila: o nó sai pela frente e os filhos dele entram por trás.',
    interaction: 'Acompanhe a fila: o primeiro a entrar é o primeiro a sair, por isso os níveis saem em sequência. Compare com a árvore em ordem crescente, em que a fila nunca passa de um nó.',
    complexity: { time: 'O(n)', space: 'O(w)', note: 'Cada nó entra e sai da fila uma vez. A fila guarda nós de, no máximo, dois níveis seguidos, então o espaço depende da largura w da árvore: O(n) numa árvore cheia e O(1) numa cadeia.' },
    pseudocode: [
      'FUNÇÃO bfs(raiz)',
      '  SE raiz é NULO ENTÃO',
      '    RETORNE',
      '  FIM_SE',
      '  CRIE uma fila',
      '  INSIRA a raiz na fila',
      '  ENQUANTO a fila não está vazia FAÇA',
      '    No ← fila.remover()',
      '    IMPRIMIR No.valor',
      '    SE No.esquerdo não é NULO ENTÃO',
      '      fila.inserir(No.esquerdo)',
      '    FIM_SE',
      '    SE No.direito não é NULO ENTÃO',
      '      fila.inserir(No.direito)',
      '    FIM_SE',
      '  FIM_ENQUANTO',
      'FIM_FUNÇÃO',
    ],
  },
  {
    id: 'compare', title: 'Comparando os quatro percursos', menuLabel: 'DFS × BFS', group: 'Comparação', number: '06',
    description: 'Os três percursos em profundidade e o percurso em largura visitam os mesmos nós, só que em ordens diferentes, e usam estruturas diferentes: a pilha de chamadas (DFS) e a fila (BFS).',
    interaction: 'Use o exercício 1 da aula: anote a sequência de cada percurso no papel e confira aqui. Depois tente a árvore em ordem crescente e veja o que muda na pilha e na fila.',
    complexity: { time: 'O(n)', space: 'O(h) · O(w)', note: 'Os quatro visitam cada nó uma vez. O que muda é a memória auxiliar: a pilha de chamadas do DFS cresce com a altura h e a fila do BFS cresce com a largura w.' },
    pseudocode: [
      '// Em profundidade (DFS): desce um ramo até o fim antes de voltar',
      'pré-ordem: raiz, esquerda, direita',
      'em ordem: esquerda, raiz, direita',
      'pós-ordem: esquerda, direita, raiz',
      '// Em largura (BFS): visita os nós nível por nível, com uma fila',
      'largura: nível 0, nível 1, nível 2, ... da esquerda para a direita',
      '// Quando usar cada um',
      'DFS: espaço de busca muito profundo, nó possivelmente longe da raiz',
      'BFS: nó perto da raiz, ou solução mais curta',
    ],
  },
];

const isId = (id) => typeof id === 'number';
const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const side = (action) => (action === 'left' ? 'esquerdo' : 'direito');
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
  const call = (k) => `fatorial(${k})`;

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
    emit(2, 'Testando o caso base', base
      ? 'n = 0 é verdadeiro: este é o caso base, que não faz nova chamada.'
      : `n vale ${k}, então n = 0 é falso: não é o caso base. A execução vai para o caso recursivo.`, 'comparison', {
      variables: { 'n = 0': base ? 'VERDADEIRO' : 'FALSO' },
    });

    if (base) {
      me.expr = 'retorna 1';
      const text = `${call(0)} retorna 1. É o primeiro valor que volta: a partir daqui as chamadas pendentes podem ser calculadas.`;
      if (root) {
        frames.pop();
        emit(3, 'Retornando 1 (caso base)', `${call(0)} retorna 1 e, como foi a primeira chamada, a pilha esvazia.`, 'done', {
          returned: `${call(0)} retorna 1`, output: [`${call(0)} = 1`], variables: { retorno: 1 },
        });
      } else {
        emit(3, 'Retornando 1 (caso base)', text, 'update', { returned: `${call(0)} retorna 1`, variables: { retorno: 1 } });
        frames.pop();
      }
      return 1;
    }

    me.expr = `${k} × ${call(k - 1)}`;
    emit(6, `Chamando ${call(k - 1)}`, `RETORNE ${k} × ${call(k - 1)} precisa do valor de ${call(k - 1)}: a função chama a si mesma com um problema menor. ${call(k)} fica esperando na pilha.`, 'neutral');
    frames.push({ n: k - 1, expr: null });
    const result = run(k - 1);

    const value = k * result;
    me.expr = `${k} × ${result} = ${value}`;
    const text = `${call(k - 1)} devolveu ${result}. Agora ${k} × ${result} = ${value}, e ${call(k)} retorna ${value}.`;
    if (root) {
      frames.pop();
      emit(6, `Calculando ${k} × ${result}`, `${text} Era a primeira chamada: a pilha esvazia e o resultado final é ${value}.`, 'done', {
        returned: `${call(k)} retorna ${value}`, output: [`${call(k)} = ${value}`], variables: { retorno: value },
      });
    } else {
      emit(6, `Calculando ${k} × ${result}`, text, 'update', { returned: `${call(k)} retorna ${value}`, variables: { retorno: value } });
      frames.pop();
    }
    return value;
  };

  frames.push({ n, expr: null });
  emit(0, `Chamando ${call(n)}`, `${call(n)} é chamada pelo programa principal. A função ganha o primeiro frame da pilha, com n = ${n}.`, 'neutral');
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
  const t = treeTrace({ tree, layout: layoutOf(tree), locals: ['raiz', 'No'] });
  const frames = []; // ids dos nós (ou null) das chamadas em andamento, da primeira até a do topo
  const printed = [];
  const val = (id) => fmt(t.node(id).value);
  const frameText = (id) => `${name}(${isId(id) ? val(id) : 'nulo'})`;
  const consoleLines = () => (printed.length ? [printed.map(val).join(' ')] : []);
  const nextText = (next) => (next ? ACTION_CODE[next](name) : 'FIM_FUNÇÃO');

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
    snap(index, title, `${description} A chamada sai da pilha e a execução volta para ${frameText(back.caller)}, que segue para a linha “${nextText(back.next)}”.`, tone);
    frames.pop();
    t.set('No', back.caller);
  };

  const print = (id) => {
    printed.push(id);
    t.badge(id, `${printed.length}º`);
    const hasLeft = isId(t.node(id).left);
    const leaf = !hasLeft && !isId(t.node(id).right);
    const why = {
      preorder: `${val(id)} é visitado antes dos filhos: a raiz da subárvore vem primeiro.`,
      inorder: `A subárvore esquerda de ${val(id)} ${hasLeft ? 'já foi toda percorrida' : 'está vazia (NULO)'}: agora ${val(id)} é visitado e, depois, a direita.`,
      postorder: `${leaf ? `${val(id)} é uma folha: as duas subárvores estão vazias` : `As duas subárvores de ${val(id)} já foram percorridas`}, só agora ${val(id)} é visitado.`,
    }[kind];
    snap(line('print'), `Imprimindo ${val(id)}`, `IMPRIMIR No.valor escreve ${val(id)} no console, a ${printed.length}ª visita. ${why}`, 'update', { foundIndices: [id] });
  };

  const visit = (id, back) => {
    if (!isId(id)) {
      snap(1, 'Testando se No é NULO', 'No é NULO: não há nó aqui. É o caso base da recursão.', 'comparison', { variables: { 'No é NULO': 'VERDADEIRO' } });
      leave(2, 'Retornando (caso base)', `RETORNE encerra ${frameText(id)} sem fazer nada.`, back, back ? 'neutral' : 'warning');
      return;
    }
    snap(1, 'Testando se No é NULO', `No aponta para o nó ${val(id)}, que não é NULO: a chamada continua.`, 'comparison', { variables: { 'No é NULO': 'FALSO' } });
    order.forEach((action, index) => {
      if (action === 'print') {
        print(id);
        return;
      }
      const child = t.node(id)[action];
      const arg = `No.${side(action)}`;
      snap(line(action), `Chamando ${name}(${arg})`, isId(child)
        ? `${name}(${arg}) chama a função para o filho ${side(action)} de ${val(id)}, o nó ${val(child)}. A chamada vai para o topo da pilha.`
        : `${arg} é NULO, mas a função é chamada mesmo assim: a chamada com NULO é o caso base e volta logo em seguida.`, 'neutral', {
        hotEdges: [...frames.slice(1).filter(isId), ...(isId(child) ? [child] : [])],
        changedIndices: isId(child) ? [child] : [],
      });
      frames.push(child);
      t.follow('No', id, action);
      visit(child, { caller: id, next: order[index + 1] });
    });
    const text = `${frameText(id)} chegou ao fim da função.`;
    leave(7, `Fim de ${frameText(id)}`, back ? text : `${text} Era a primeira chamada: ao sair, a pilha esvazia e o percurso está completo.`, back);
  };

  frames.push(tree.root);
  t.set('No', tree.root);
  snap(0, `Chamando ${name}(raiz)`, isId(tree.root)
    ? `${name}(raiz) é chamada pelo programa principal: No recebe a raiz, o nó ${val(tree.root)}, e a pilha ganha o primeiro frame.`
    : `${name}(raiz) é chamada com a árvore vazia: raiz e No são NULO.`, 'neutral');
  visit(tree.root, null);

  const final = t.finish();
  const last = final.at(-1);
  if (!printed.length) {
    last.description = `${last.description} A árvore está vazia: nada foi impresso.`;
    return final;
  }
  const ending = {
    preorder: 'Como a raiz vem antes dos filhos, é a ordem usada para copiar a estrutura da árvore e para a notação prefixa.',
    inorder: 'Numa ABB a sequência sai em ordem crescente, sem precisar de um algoritmo de ordenação.',
    postorder: 'Os filhos vêm antes do pai e a raiz é a última: é a ordem para liberar a árvore de baixo para cima e para a notação pós-fixa.',
  }[kind];
  last.description = `Percurso completo: ${sequence(tree, printed)}. ${ending}`;
  return final;
}

// ---------------------------------------------------------------------------------------------
// Percurso em largura (BFS)
// ---------------------------------------------------------------------------------------------

function bfsSteps(valores) {
  const tree = buildTree(valores);
  const t = treeTrace({ tree, layout: layoutOf(tree), locals: ['raiz', 'No'] });
  const queue = [];
  const printed = [];
  let created = false;
  const val = (id) => fmt(t.node(id).value);
  const queueText = () => (queue.length ? queue.map(val).join(', ') : 'vazia');
  const sizeText = () => (queue.length ? `A fila tem ${plural(queue.length, 'nó', 'nós')}: ${queueText()}.` : 'A fila ficou vazia.');

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
  snap(0, 'Chamando bfs(raiz)', empty ? 'bfs(raiz) é chamada com a árvore vazia: raiz é NULO.' : `bfs(raiz) é chamada pelo programa principal com a raiz, o nó ${val(tree.root)}.`, 'neutral');
  snap(1, 'Testando se raiz é NULO', empty ? 'raiz é NULO: não há nada a percorrer.' : `raiz aponta para o nó ${val(tree.root)}, que não é NULO: o percurso continua.`, 'comparison', {
    variables: { 'raiz é NULO': empty ? 'VERDADEIRO' : 'FALSO' },
  });
  if (empty) {
    snap(2, 'Retornando', 'RETORNE encerra a função: a árvore está vazia e nada é impresso.', 'warning');
    return t.finish();
  }

  created = true;
  snap(4, 'Criando a fila', 'CRIE uma fila: ela começa vazia. O percurso em largura usa uma fila (primeiro a entrar, primeiro a sair) para guardar os nós que ainda faltam visitar.', 'update');
  queue.push(tree.root);
  snap(5, 'Inserindo a raiz na fila', `A raiz, ${val(tree.root)}, entra na fila. ${sizeText()}`, 'update', { changedIndices: [tree.root] });

  for (;;) {
    const more = queue.length > 0;
    snap(6, 'Testando se a fila está vazia', more
      ? `A fila não está vazia (${plural(queue.length, 'nó', 'nós')}): o laço continua.`
      : 'A fila está vazia: todos os nós já foram visitados e o laço termina.', 'comparison', {
      variables: { 'fila não está vazia': more ? 'VERDADEIRO' : 'FALSO' },
    });
    if (!more) break;

    const id = queue.shift();
    t.set('No', id);
    snap(7, `Removendo ${val(id)} da fila`, `fila.remover() tira o primeiro nó da fila, ${val(id)}, e No passa a apontar para ele. ${sizeText()}`, 'update');

    printed.push(id);
    t.badge(id, `${printed.length}º`);
    snap(8, `Imprimindo ${val(id)}`, `IMPRIMIR No.valor escreve ${val(id)} no console, a ${printed.length}ª visita. Os nós saem na ordem em que entraram, por isso os níveis são visitados em sequência.`, 'update', { foundIndices: [id] });

    ['left', 'right'].forEach((action) => {
      const child = t.node(id)[action];
      const has = isId(child);
      const field = `No.${side(action)}`;
      const index = action === 'left' ? 9 : 12;
      snap(index, `Testando ${field}`, has
        ? `${field} aponta para o nó ${val(child)}, que não é NULO: ele precisa ser visitado depois.`
        : `${field} é NULO: não há filho ${side(action)}, então nada entra na fila.`, 'comparison', {
        variables: { [`${field} não é NULO`]: has ? 'VERDADEIRO' : 'FALSO' },
      });
      if (!has) return;
      queue.push(child);
      snap(index + 1, `Inserindo ${val(child)} na fila`, `fila.inserir(${field}) coloca o nó ${val(child)} no fim da fila. ${sizeText()}`, 'update', {
        changedIndices: [child], hotEdges: [child],
      });
    });
  }

  t.clear(['No']);
  snap(16, 'Fim de bfs', `A função terminou. Percurso completo: ${sequence(tree, printed)}. Cada nível foi visitado por inteiro, da esquerda para a direita, antes do próximo. Serve para achar o caminho mais curto e para mostrar uma hierarquia nível por nível.`, 'done');
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
    step(0, 'Árvore vazia', 'Uma árvore vazia não tem nós para visitar: os quatro percursos terminam sem imprimir nada. Insira valores nos dados para compará-los.', 'warning');
    return t.finish();
  }

  const orders = [
    {
      key: 'pré-ordem', line: 1, ids: preorder(tree), tail: 'Começa na raiz e desce sempre pela esquerda antes de olhar a direita.',
    },
    {
      key: 'em ordem', line: 2, ids: inorder(tree), tail: 'Começa no nó mais à esquerda. Numa ABB a sequência sai em ordem crescente.',
    },
    {
      key: 'pós-ordem', line: 3, ids: postorder(tree), tail: 'Termina na raiz: cada nó só é visitado depois de toda a subárvore dele.',
    },
    {
      key: 'largura', line: 5, ids: levelorder(tree), tail: 'Começa na raiz e visita cada nível, da esquerda para a direita, antes de descer.',
    },
  ];
  const lines = [];

  step(0, 'A mesma árvore', `A árvore tem ${plural(tree.nodes.length, 'nó', 'nós')} e altura ${heightOf(tree)}. Os quatro percursos visitam todos eles, uma vez cada, mas em ordens diferentes. Veja o selo abaixo de cada nó: é a posição dele na visita.`, 'neutral', {
    variables: { nós: tree.nodes.length, altura: heightOf(tree) },
  });

  orders.forEach(({
    key, line, ids, tail,
  }) => {
    t.clearBadges();
    ids.forEach((id, index) => t.badge(id, `${index + 1}º`));
    lines.push(`${key}: ${sequence(tree, ids)}`);
    step(line, `Percurso em ${key}`, `${lines.at(-1)}. ${tail}`, 'reading', {
      activeIndices: [ids[0]],
      foundIndices: [ids.at(-1)],
      output: [...lines],
      variables: { percurso: key, 'estrutura auxiliar': key === 'largura' ? 'fila' : 'pilha de chamadas' },
    });
  });

  t.clearBadges();
  const stack = maxStack(tree);
  const queue = maxQueue(tree);
  step([6, 7, 8], 'Quando usar cada um', `Nesta árvore a pilha de chamadas do DFS chega a ${plural(stack, 'frame', 'frames')} e a fila do BFS, a ${plural(queue, 'nó', 'nós')}. Use DFS quando o espaço de busca é muito profundo e o nó procurado pode estar longe da raiz; use BFS quando o nó está perto da raiz ou quando se quer a solução mais curta.`, 'done', {
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
