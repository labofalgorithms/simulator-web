import {
  buildTree, depthsOf, fmt, heightOf, layoutOf, parentsOf, preorder, treeTrace,
} from '../shared/tree-scene.js';

// A árvore com erro da aula (slide "Encontre o erro nesta ABB"): 45 foi colocado à esquerda de 40.
export const BROKEN_VALUES = [40, 20, 60, 10, 45, 50, 70];

export const algorithms = [
  {
    id: 'node', title: 'Nó da árvore: criar e ligar', menuLabel: 'Nó da árvore', group: 'Fundamentos', number: '01',
    description: 'Cada nó guarda um valor e duas referências: esquerda e direita. Criar o nó e ligá-lo à árvore são eventos diferentes.',
    interaction: 'Acompanhe o construtor montar um nó isolado, com esquerda e direita nulas. O nó só entra na árvore quando um ponteiro passa a apontar para ele. Os valores vêm dos três primeiros números dos dados.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Criar um nó e atribuir uma referência são operações de tempo constante.' },
    pseudocode: [
      'CLASSE No',
      '  valor',
      '  esquerda',
      '  direita',
      '  CONSTRUTOR No(valor)',
      '    esta.valor ← valor',
      '    esta.esquerda ← NULO',
      '    esta.direita ← NULO',
      '  FIM',
      'FIM_CLASSE',
      '',
      'raiz ← CRIAR_NÓ(valor1)',
      'novo ← CRIAR_NÓ(valor2)',
      'raiz.esquerda ← novo',
      'novo ← CRIAR_NÓ(valor3)',
      'raiz.direita ← novo',
    ],
  },
  {
    id: 'anatomy', title: 'Anatomia da árvore binária', menuLabel: 'Anatomia da árvore', group: 'Fundamentos', number: '02',
    description: 'Raiz, pai e filhos, folhas, arestas e subárvore: o vocabulário de uma árvore binária, mais a profundidade e a altura de um nó.',
    interaction: 'Clique em um nó para escolher de quem falar: pai e filhos, subárvore, profundidade e altura mudam com ele.',
    complexity: { time: 'O(n)', space: 'O(h)', note: 'Descrever a árvore percorre os nós; a altura de um nó percorre a subárvore dele.' },
    pseudocode: [
      '// Anatomia de uma árvore binária',
      'raiz ← o nó que não tem pai',
      'filhos(nó) ← nó.esquerda e nó.direita (no máximo dois)',
      'folha ← nó com esquerda = NULO E direita = NULO',
      'aresta ← a ligação entre um pai e um filho',
      'subárvore(nó) ← a árvore formada a partir de um nó',
      'profundidade(nó) ← arestas da raiz até o nó',
      'altura(nó) ← maior número de arestas até uma folha descendente',
    ],
  },
  {
    id: 'rule', title: 'A regra da Árvore Binária de Busca', menuLabel: 'Regra da ABB', group: 'Fundamentos', number: '03',
    description: 'Para cada nó de valor v, todos os valores à esquerda são menores que v e todos à direita são maiores ou iguais a v. A regra vale para toda a subárvore, não só para os filhos diretos.',
    interaction: 'Confira a árvore nó a nó. Depois troque para a árvore com erro da aula: 45 é maior que o pai (20), mas está à esquerda de 40.',
    complexity: { time: 'O(n · h)', space: 'O(1)', note: 'Cada nó é comparado com todos os valores da sua subárvore.' },
    pseudocode: [
      'PARA CADA nó v DA ÁRVORE FAÇA',
      '  SE todo valor em v.esquerda < v.valor',
      '     E todo valor em v.direita ≥ v.valor ENTÃO',
      '    // a regra vale em v',
      '  SENÃO',
      '    // a regra foi violada em v: não é uma ABB',
      '  FIM_SE',
      'FIM_PARA',
    ],
  },
  {
    id: 'insert', title: 'Inserir um valor (INSERIR)', menuLabel: 'INSERIR(valor)', group: 'Inserção', number: '04',
    description: 'Crie um nó isolado, desça comparando com atual (menor à esquerda, senão à direita) até achar um ponteiro nulo e ligue o nó ao último pai.',
    interaction: 'Escolha o valor, ou clique em um nó para repetir o valor dele e ver o duplicado ir para a direita. O nó só entra na árvore quando pai.esquerda ou pai.direita é atribuído.',
    complexity: { time: 'O(h)', space: 'O(1)', note: 'Um nó por nível é visitado: O(log n) numa árvore equilibrada e O(n) no pior caso, com valores em ordem.' },
    pseudocode: [
      'PROCEDIMENTO INSERIR(valor)',
      '  novo ← CRIAR_NÓ(valor)',
      '  SE raiz = NULO ENTÃO',
      '    raiz ← novo',
      '    RETORNE',
      '  FIM_SE',
      '  atual ← raiz',
      '  pai ← NULO',
      '  ENQUANTO atual ≠ NULO FAÇA',
      '    pai ← atual',
      '    SE valor < atual.valor ENTÃO',
      '      atual ← atual.esquerda',
      '    SENÃO',
      '      atual ← atual.direita',
      '    FIM_SE',
      '  FIM_ENQUANTO',
      '  SE valor < pai.valor ENTÃO',
      '    pai.esquerda ← novo',
      '  SENÃO',
      '    pai.direita ← novo',
      '  FIM_SE',
      'FIM_PROCEDIMENTO',
    ],
  },
  {
    id: 'build', title: 'Construir a árvore (inserções em sequência)', menuLabel: 'Construir a árvore', group: 'Inserção', number: '05',
    description: 'Insira os valores na ordem da lista e veja a árvore crescer. A ordem de inserção decide o formato: valores já ordenados formam uma cadeia.',
    interaction: 'Use o exercício 1 da aula (45, 25, 65, 15, 35, 55, 75) e depois os mesmos valores em ordem crescente. Compare a altura das duas árvores.',
    complexity: { time: 'O(n · h)', space: 'O(n)', note: 'Cada inserção custa a altura da árvore naquele momento; no pior caso, n inserções de custo O(n).' },
    pseudocode: [
      'PARA CADA valor NA SEQUÊNCIA DE ENTRADA FAÇA',
      '  INSERIR(valor)',
      'FIM_PARA',
    ],
  },
  {
    id: 'search', title: 'Buscar um valor (BUSCAR)', menuLabel: 'BUSCAR(valor)', group: 'Busca', number: '06',
    description: 'Compare o valor com atual: se for igual, encontrou; se for menor, siga à esquerda; senão, à direita. Chegar a NULO significa que o valor não existe.',
    interaction: 'Busque um valor que existe e um que não existe. A cada comparação, uma subárvore inteira é descartada.',
    complexity: { time: 'O(h)', space: 'O(1)', note: 'A busca não altera a estrutura: usa apenas atual e desce, no máximo, um nó por nível.' },
    pseudocode: [
      'FUNÇÃO BUSCAR(valor)',
      '  atual ← raiz',
      '  ENQUANTO atual ≠ NULO FAÇA',
      '    SE valor = atual.valor ENTÃO',
      '      RETORNE VERDADEIRO',
      '    SENÃO SE valor < atual.valor ENTÃO',
      '      atual ← atual.esquerda',
      '    SENÃO',
      '      atual ← atual.direita',
      '    FIM_SE',
      '  FIM_ENQUANTO',
      '  RETORNE FALSO',
      'FIM_FUNÇÃO',
    ],
  },
  {
    id: 'remove', title: 'Remover um valor (REMOVER)', menuLabel: 'REMOVER(raiz, valor)', group: 'Remoção', number: '07',
    description: 'Localize o nó e o pai dele. Folha: o pai passa a apontar para NULO. Um filho: o pai aponta direto para ele. Dois filhos: copie o sucessor em ordem e remova o nó do sucessor.',
    interaction: 'Escolha uma folha, um nó com um filho e um com dois filhos: o pseudocódigo é o mesmo, a trajetória muda. Clique em um nó da árvore para removê-lo.',
    complexity: { time: 'O(h)', space: 'O(1)', note: 'A busca desce uma vez pela altura; encontrar o sucessor desce de novo, no pior caso, pela mesma altura.' },
    pseudocode: [
      'ALGORITMO REMOVER(raiz, valor)',
      '  pai ← NULO',
      '  atual ← raiz',
      '  ENQUANTO atual ≠ NULO E atual.valor ≠ valor FAÇA',
      '    pai ← atual',
      '    SE valor < atual.valor ENTÃO',
      '      atual ← atual.esq',
      '    SENÃO',
      '      atual ← atual.dir',
      '    FIM_SE',
      '  FIM_ENQUANTO',
      '  SE atual = NULO ENTÃO',
      '    RETORNE raiz',
      '  FIM_SE',
      '  SE atual.esq ≠ NULO E atual.dir ≠ NULO ENTÃO',
      '    paiSuc ← atual',
      '    suc ← atual.dir',
      '    ENQUANTO suc.esq ≠ NULO FAÇA',
      '      paiSuc ← suc',
      '      suc ← suc.esq',
      '    FIM_ENQUANTO',
      '    atual.valor ← suc.valor',
      '    pai ← paiSuc',
      '    atual ← suc',
      '  FIM_SE',
      '  SE atual.esq ≠ NULO ENTÃO',
      '    filho ← atual.esq',
      '  SENÃO',
      '    filho ← atual.dir',
      '  FIM_SE',
      '  SE pai = NULO ENTÃO',
      '    raiz ← filho',
      '  SENÃO SE pai.esq = atual ENTÃO',
      '    pai.esq ← filho',
      '  SENÃO',
      '    pai.dir ← filho',
      '  FIM_SE',
      '  RETORNE raiz',
      'FIM_ALGORITMO',
    ],
  },
];

const side = (value) => (value === 'left' ? 'esquerda' : 'direita');
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

  step(11, 'Chamando CRIAR_NÓ(valor1)', `raiz ← CRIAR_NÓ(${fmt(v1)}) chama o construtor da classe No. Ainda não existe nenhum nó.`);
  const a = t.create(v1, null, { pending: true });
  step(5, 'Gravando o valor', `esta.valor ← valor: o nó nasce guardando ${fmt(v1)}. Os campos esquerda e direita ainda não foram atribuídos.`, 'reading', { changedIndices: [a] });
  t.setChild(a, 'left', null);
  step(6, 'Esquerda começa nula', 'esta.esquerda ← NULO: ainda não há filho esquerdo, então a referência é nula (NULO significa ausência de referência).', 'update', { changedIndices: [a] });
  t.setChild(a, 'right', null);
  step(7, 'Direita começa nula', 'esta.direita ← NULO: o mesmo vale para o filho direito. O nó está pronto, mas continua isolado.', 'update', { changedIndices: [a] });
  t.set('raiz', a);
  step(11, 'Guardando a referência em raiz', `O construtor devolve o nó e raiz passa a apontar para ele. Agora a árvore tem um nó: ${fmt(v1)}.`, 'update', { changedIndices: [a] });

  const b = t.create(v2, 'novo');
  step(12, 'Criando outro nó', `novo ← CRIAR_NÓ(${fmt(v2)}) executa o mesmo construtor. O nó ${fmt(v2)} nasce isolado, com esquerda e direita nulas: criar o nó não o coloca na árvore.`, 'reading', { changedIndices: [b] });
  t.setChild(a, 'left', b);
  step(13, 'Ligando à esquerda', `raiz.esquerda ← novo: só agora o nó ${fmt(v2)} faz parte da árvore, como filho esquerdo de ${fmt(v1)}.`, 'update', { changedIndices: [a], activeIndices: [b] });

  const c = t.create(v3, 'novo');
  step(14, 'Criando o terceiro nó', `novo ← CRIAR_NÓ(${fmt(v3)}): outro nó isolado. A variável novo deixa de apontar para ${fmt(v2)}, mas ${fmt(v2)} continua na árvore, ligado por raiz.esquerda.`, 'reading', { changedIndices: [c] });
  t.setChild(a, 'right', c);
  const isBst = v2 < v1 && v3 >= v1;
  step(15, 'Árvore montada', `raiz.direita ← novo: ${fmt(v3)} é o filho direito. Ligar nós é só atribuir referências, então qualquer valor pode ficar em qualquer lugar. ${isBst
    ? `Aqui ${fmt(v2)} < ${fmt(v1)} ≤ ${fmt(v3)}: esta árvore binária também é uma ABB.`
    : `Aqui a regra esquerda < raiz ≤ direita não vale (${fmt(v2)}, ${fmt(v1)}, ${fmt(v3)}): é uma árvore binária, mas não é uma ABB.`}`, 'done', {
    foundIndices: [a, b, c],
    output: [`Árvore com raiz ${fmt(v1)}, esquerda ${fmt(v2)} e direita ${fmt(v3)}${isBst ? ' (é uma ABB).' : ' (não é uma ABB).'}`],
  });
  return t.finish();
}

function anatomySteps(valores, focus) {
  const tree = buildTree(valores);
  const t = treeTrace({ tree, layout: layoutOf(tree), locals: ['raiz'] });
  const { step } = t;

  if (!tree.nodes.length) {
    step(0, 'Árvore vazia', 'Uma árvore sem nós não tem raiz: raiz = NULO. Insira valores nos dados para ver a anatomia.', 'warning');
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

  step(0, 'A árvore binária', `Cada nó guarda um valor e, no máximo, dois filhos: esquerdo e direito. Esta árvore tem ${plural(total, 'nó', 'nós')} e altura ${H}.`, 'neutral', { variables: { nós: total, altura: H } });
  step(1, 'Raiz', `A raiz é o nó sem pai: ${v(tree.root)}. Toda a árvore começa nela.`, 'reading', { changedIndices: [tree.root] });

  const kidsText = kids.length ? `${kids.length === 1 ? 'seu filho é' : 'seus filhos são'} ${list(kids.map(v))}` : 'não tem filhos (é uma folha)';
  step(2, 'Pai e filhos', `${typeof parent === 'number' ? `${v(f)} é filho de ${v(parent)}` : `${v(f)} é a raiz e não tem pai`}; ${kidsText}.`, 'reading', {
    activeIndices: [f], changedIndices: typeof parent === 'number' ? [parent] : [], foundIndices: kids, variables: family,
  });
  step(3, 'Folhas', `Folhas são os nós sem filhos: ${list(leaves.map(v))}.`, 'reading', { foundIndices: leaves });
  step(4, 'Arestas', `Cada aresta liga um pai a um filho. ${plural(total, 'nó', 'nós')} têm ${total - 1} ${total - 1 === 1 ? 'aresta' : 'arestas'}.`, 'reading', {
    hotEdges: nodes.filter((node) => node.id !== tree.root).map((node) => node.id),
  });

  const below = subtree(nodes, f);
  step(5, 'Subárvore', `A subárvore de ${v(f)} é formada por ele e por todos os seus descendentes: ${list(below.map(v))} (${plural(below.length, 'nó', 'nós')}). Os demais nós ficam de fora.`, 'reading', {
    activeIndices: below, dimIndices: nodes.map((node) => node.id).filter((id) => !below.includes(id)), variables: family,
  });

  const path = [];
  for (let id = f; typeof id === 'number'; id = parents.get(id)?.parent) path.unshift(id);
  step(6, 'Profundidade', `profundidade(${v(f)}) = ${depths.get(f)}: são ${plural(depths.get(f), 'aresta', 'arestas')} da raiz até o nó, pelo caminho ${list(path.map(v))}. Convenção: a raiz está no nível 0.`, 'reading', {
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
  step(7, 'Altura', `altura(${v(f)}) = ${h}: o maior número de arestas até uma folha descendente (${list(down.map(v))}). Convenção: uma folha tem altura 0. A altura da árvore é a da raiz: ${H}.`, 'done', {
    processedIndices: down.slice(0, -1), activeIndices: [f], foundIndices: [down.at(-1)], hotEdges: down.slice(1), variables: { ...family, altura: h },
    output: [`profundidade(${v(f)}) = ${depths.get(f)}`, `altura(${v(f)}) = ${h}`, `altura da árvore = ${H}`],
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
    step(0, 'Árvore vazia', 'Uma árvore vazia respeita a regra: não há nenhum nó para violá-la.', 'warning');
    return t.finish();
  }

  const v = (id) => fmt(nodes[id].value);
  step(0, 'A regra global', `Para cada nó de valor v: tudo à esquerda é menor que v e tudo à direita é maior ou igual a v. A regra vale para toda a subárvore, não só para os filhos diretos.${broken ? ' Esta é a árvore com erro da aula: 45 foi colocado à esquerda de 40.' : ''}`);

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
    if (!left.length && !right.length) text = `${v(id)} é uma folha: não há subárvores para conferir, a regra vale.`;
    else if (!ok) {
      text = [
        ...badLeft.map((other) => `${v(other)} está na subárvore esquerda de ${v(id)}, mas ${v(other)} ≥ ${v(id)}`),
        ...badRight.map((other) => `${v(other)} está na subárvore direita de ${v(id)}, mas ${v(other)} < ${v(id)}`),
      ].join('; ');
      text += '. A regra foi violada.';
    } else {
      const parts = [];
      if (left.length) parts.push(`esquerda (${list(left.map(v))}) é menor que ${v(id)}`);
      if (right.length) parts.push(`direita (${list(right.map(v))}) é maior ou igual a ${v(id)}`);
      text = `Em ${v(id)}: ${parts.join(' e ')}. A regra vale.`;
      if (carried.length) text += ` Localmente ela vale, mas ${list(carried.map(v))} já violou a regra de um ancestral: ela vale para toda a subárvore.`;
    }
    if (!ok) violations += 1;
    step(ok ? [1, 2, 3] : [1, 2, 5], `Conferindo o nó ${v(id)}`, text, ok ? 'comparison' : 'warning', {
      activeIndices: [id], leftIndices: left, rightIndices: right, errorIndices: [...flagged.keys()],
      variables: { 'nó v': v(id), regra: ok ? 'respeitada' : 'violada' },
    });
  });

  const done = violations === 0;
  step(7, done ? 'É uma ABB' : 'Não é uma ABB', done
    ? 'A regra vale em todos os nós: a árvore é uma ABB. Valores iguais ficam à direita, como no pseudocódigo de INSERIR.'
    : `A regra foi violada em ${plural(violations, 'nó', 'nós')}: ${list([...flagged].map(([other, owner]) => `${v(other)} em ${v(owner)}`))}. Uma árvore binária não é sempre uma ABB.`, done ? 'done' : 'warning', {
    errorIndices: [...flagged.keys()], output: [done ? 'A árvore é uma ABB.' : 'A árvore não é uma ABB.'],
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

  if (verbose) step(L.header, 'Chamando INSERIR(valor)', `INSERIR(${v}) é executado. Ainda NÃO executamos a criação do nó.`);
  const novo = t.create(valor);
  step(L.create, 'Criando o novo nó', `CRIAR_NÓ(${v}) aloca o nó novo. Ele surge SEPARADO da árvore, com esquerda e direita nulas.`, 'reading', { changedIndices: [novo] });

  const empty = st.refs.raiz === null;
  if (verbose) {
    step(L.test, 'Verificando se a árvore está vazia', empty ? 'raiz = NULO: a árvore está vazia.' : 'Testamos se a árvore está vazia. Não está.', 'comparison', { variables: { 'raiz = NULO': empty ? 'VERDADEIRO' : 'FALSO' } });
  }
  if (empty) {
    t.set('raiz', novo);
    step(L.assign, 'Definindo a raiz', 'raiz passa a apontar para o novo nó, que agora faz parte da árvore.', verbose || !last ? 'update' : 'done', { changedIndices: [novo], ...(verbose ? {} : out(`${v} é a raiz da árvore.`)) });
    if (verbose) step(L.ret, 'INSERIR() concluído', `${v} é a raiz da árvore. O procedimento retorna sem executar o laço.`, 'done', { foundIndices: [novo], ...out(`INSERIR(${v}): ${v} é a raiz.`) });
    return;
  }

  t.set('atual', st.refs.raiz);
  if (verbose) step(L.atual, 'Iniciando o atual', 'atual começa na raiz.', 'update', { activeIndices: [st.refs.atual] });
  t.set('pai', null);
  if (verbose) step(L.pai, 'Iniciando o pai', 'pai é inicializado com NULO.', 'update', { activeIndices: [st.refs.atual] });

  let first = true;
  for (;;) {
    const atual = st.refs.atual;
    if (verbose) {
      const cont = atual !== null;
      step(L.loop, 'Verificando atual ≠ NULO', cont ? (first ? 'Como atual ≠ NULO, entramos no laço.' : 'O laço continua.') : 'O laço termina porque atual é NULO.', 'comparison', {
        activeIndices: cont ? [atual] : [], variables: { 'condição do ENQUANTO': cont ? 'verdadeira' : 'falsa' },
      });
    }
    if (atual === null) break;
    first = false;

    t.set('pai', atual);
    if (verbose) step(L.paiAtual, 'Atualizando o pai', `pai recebe o nó ${val(atual)}.`, 'update', { activeIndices: [atual] });

    const goLeft = valor < t.node(atual).value;
    if (verbose) {
      step(L.cmp, `Comparando com ${val(atual)}`, goLeft
        ? 'A comparação indica que devemos seguir para a esquerda.'
        : `${valor === t.node(atual).value ? `${v} = ${val(atual)}: não é menor, então o fluxo cai no SENÃO e segue para a direita (iguais ficam à direita).` : 'A comparação indica que devemos seguir para a direita.'}`, 'comparison', {
        activeIndices: [atual], variables: { comparação: `${v} < ${val(atual)} → ${goLeft ? 'VERDADEIRO' : 'FALSO'}` },
      });
    }
    const child = t.follow('atual', atual, goLeft ? 'left' : 'right');
    const arrived = child === null ? ' Chegamos a uma referência nula: encontramos o ponto de inserção.' : '';
    if (verbose) {
      step(goLeft ? L.left : L.right, 'Descendo na árvore', `atual passa a apontar para o filho ${side(goLeft ? 'left' : 'right')} de ${val(atual)}.${arrived}`, 'update', { activeIndices: child === null ? [atual] : [child] });
    } else {
      step(L.cmp, `Comparando com ${val(atual)}`, `${v} ${goLeft ? '<' : valor === t.node(atual).value ? '=' : '>'} ${val(atual)}: segue à ${side(goLeft ? 'left' : 'right')}.${arrived}`, 'comparison', {
        activeIndices: [atual],
      });
    }
  }

  const pai = st.refs.pai;
  const goLeft = valor < t.node(pai).value;
  if (verbose) {
    step(L.linkTest, 'Decidindo o lado da ligação', `Decidimos ligar o novo nó à ${side(goLeft ? 'left' : 'right')} de pai.`, 'comparison', {
      activeIndices: [pai], variables: { comparação: `${v} < ${val(pai)} → ${goLeft ? 'VERDADEIRO' : 'FALSO'}` },
    });
  }
  t.setChild(pai, goLeft ? 'left' : 'right', novo);
  step(goLeft ? L.linkLeft : L.linkRight, 'Ligando o novo nó', `${verbose ? 'O novo nó é ligado' : `${v} é ligado`} à ${side(goLeft ? 'left' : 'right')} de ${val(pai)}. Inserção concluída.`, last ? 'done' : 'update', {
    changedIndices: [pai], foundIndices: [novo], ...out(`INSERIR(${v}) ligou o nó à ${side(goLeft ? 'left' : 'right')} de ${val(pai)}.`),
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
    step(0, 'Sequência vazia', 'Sem valores, não há nada a inserir: a árvore continua vazia (raiz = NULO).', 'warning');
    return t.finish();
  }
  step(0, 'Iniciando a construção', `A árvore começa vazia (raiz = NULO). Serão inseridos ${plural(valores.length, 'valor', 'valores')}, na ordem da lista.`);
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
  lastStep.description += ` Raiz: ${fmt(st.nodes[tree.root].value)}; folhas: ${list(leaves.map((id) => fmt(st.nodes[id].value)))}; altura: ${H}${H === valores.length - 1 && valores.length > 2 ? ' (uma cadeia: a árvore degenerou em lista)' : ''}.`;
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
  step(1, 'Começando pela raiz', st.refs.atual === null ? 'A busca começa na raiz, mas a árvore está vazia: atual = NULO.' : 'A busca começa na raiz.', 'update', { activeIndices: st.refs.atual === null ? [] : [st.refs.atual] });

  for (;;) {
    const atual = st.refs.atual;
    const cont = atual !== null;
    step(2, 'Verificando atual ≠ NULO', cont ? 'Como atual ≠ NULO, continuamos a busca.' : 'atual chegou a NULO: não há mais onde procurar.', 'comparison', {
      activeIndices: cont ? [atual] : [], variables: { 'condição do ENQUANTO': cont ? 'verdadeira' : 'falsa' },
    });
    if (!cont) break;

    const equal = valor === t.node(atual).value;
    step(3, `Comparando com ${val(atual)}`, equal ? `O valor procurado está no nó ${val(atual)}.` : `O valor procurado não está no nó ${val(atual)}.`, 'comparison', {
      activeIndices: [atual], variables: { comparação: `${v} = ${val(atual)} → ${equal ? 'VERDADEIRO' : 'FALSO'}` },
    });
    if (equal) {
      step(4, 'Valor encontrado', `A função retorna VERDADEIRO e a busca termina com sucesso, no nó ${val(atual)}.`, 'done', {
        foundIndices: [atual], variables: { retorno: 'VERDADEIRO' }, output: [`BUSCAR(${v}) retornou VERDADEIRO.`],
      });
      return t.finish();
    }

    const goLeft = valor < t.node(atual).value;
    step(5, `Comparando com ${val(atual)}`, goLeft
      ? 'O valor procurado é menor: a busca segue pela subárvore esquerda e a direita é descartada.'
      : 'O valor procurado é maior: a busca segue pela subárvore direita e a esquerda é descartada.', 'comparison', {
      activeIndices: [atual], variables: { comparação: `${v} < ${val(atual)} → ${goLeft ? 'VERDADEIRO' : 'FALSO'}` },
    });
    const child = t.follow('atual', atual, goLeft ? 'left' : 'right');
    step(goLeft ? 6 : 8, 'Descendo na árvore', `atual passa a apontar para o filho ${side(goLeft ? 'left' : 'right')} de ${val(atual)}${child === null ? ': NULO' : ''}.`, 'update', { activeIndices: child === null ? [atual] : [child] });
  }

  step(11, 'Valor não encontrado', `atual chegou a NULO sem encontrar ${v}: o valor não está na árvore. A função retorna FALSO.`, 'warning', {
    variables: { retorno: 'FALSO' }, output: [`BUSCAR(${v}) retornou FALSO.`],
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

  step(0, 'Chamando REMOVER(raiz, valor)', `Início da chamada REMOVER(raiz, ${v}).`);
  t.set('pai', null);
  step(1, 'Iniciando o pai', 'Variável pai inicializada com NULO.', 'update');
  t.set('atual', st.refs.raiz);
  step(2, 'Iniciando o atual', 'Variável atual recebe a referência da raiz.', 'update', { activeIndices: typeof st.refs.atual === 'number' ? [st.refs.atual] : [] });

  // 1ª etapa: localizar o alvo e o pai dele.
  for (;;) {
    const atual = st.refs.atual;
    const keep = atual !== null && t.node(atual).value !== valor;
    const why = atual === null ? 'Encerrar a busca: atual é NULO, o valor não está na árvore.' : keep ? 'Continuar descendo.' : 'Encerrar a busca do alvo: condição do ENQUANTO é falsa.';
    step(3, 'Verificando a condição do laço', why, 'comparison', {
      activeIndices: atual === null ? [] : [atual], variables: { 'condição do ENQUANTO': keep ? 'verdadeira' : 'falsa' },
    });
    if (!keep) break;

    t.set('pai', atual);
    step(4, 'Guardando o pai', 'pai guarda o último nó válido.', 'update', { activeIndices: [atual] });
    const goLeft = valor < t.node(atual).value;
    step(5, `Comparando com ${val(atual)}`, goLeft ? 'Valor procurado é menor: seguir à esquerda.' : 'Valor procurado não é menor: seguir à direita.', 'comparison', {
      activeIndices: [atual], variables: { comparação: `${v} < ${val(atual)} → ${goLeft ? 'VERDADEIRO' : 'FALSO'}` },
    });
    if (!goLeft) step(7, 'Entrando no SENÃO', 'A condição foi falsa: executamos o SENÃO.', 'neutral', { activeIndices: [atual] });
    const child = t.follow('atual', atual, goLeft ? 'left' : 'right');
    step(goLeft ? 6 : 8, 'Descendo na árvore', `atual recebe a referência do filho ${side(goLeft ? 'left' : 'right')}${child === null ? ' (NULO)' : ''}.`, 'update', { activeIndices: child === null ? [atual] : [child] });
    step(9, 'Fim da escolha', 'Fim da escolha esquerda/direita.', 'neutral', { activeIndices: child === null ? [atual] : [child] });
    step(10, 'Fim do corpo do laço', 'Fim do corpo do ENQUANTO; voltamos à condição da linha 4.', 'neutral', { activeIndices: child === null ? [atual] : [child] });
  }

  const alvo = st.refs.atual;
  const missing = alvo === null;
  step(11, 'Verificando se o valor existe', missing ? 'atual = NULO: o valor não existe na árvore.' : 'Alvo localizado; não executar retorno antecipado.', 'comparison', {
    activeIndices: missing ? [] : [alvo], variables: { 'atual = NULO': missing ? 'VERDADEIRO' : 'FALSO' },
  });
  if (missing) {
    step(12, 'REMOVER() concluído', `Valor inexistente: retornamos a raiz sem alterar a árvore. ${v} não estava na árvore.`, 'warning', {
      output: [`REMOVER(${v}): valor não encontrado; a árvore não mudou.`],
    });
    return t.finish();
  }
  step(13, 'Fim do teste', 'Fim do teste de valor inexistente.', 'neutral', { activeIndices: [alvo] });

  // 2ª etapa: dois filhos. Copiar o valor do sucessor em ordem e passar a remover o nó dele.
  const two = has(alvo, 'left') && has(alvo, 'right');
  const kind = two ? 'um nó com dois filhos' : (has(alvo, 'left') || has(alvo, 'right')) ? 'um nó com um filho' : 'uma folha';
  step(14, 'Verificando se há dois filhos', two ? 'Nó possui dois filhos: procurar sucessor em ordem.' : 'Nó possui no máximo um filho: pular tratamento do sucessor.', 'comparison', {
    activeIndices: [alvo], variables: { 'dois filhos': two ? 'VERDADEIRO' : 'FALSO' },
  });
  if (two) {
    t.set('paiSuc', alvo);
    step(15, 'Iniciando o paiSuc', 'paiSuc começa no nó a ser removido.', 'update', { activeIndices: [alvo] });
    t.set('suc', t.node(alvo).right);
    step(16, 'Iniciando o suc', 'suc começa na subárvore direita.', 'update', { activeIndices: [alvo], foundIndices: [st.refs.suc] });
    for (;;) {
      const suc = st.refs.suc;
      const more = has(suc, 'left');
      step(17, 'Procurando o sucessor', more ? 'O sucessor ainda tem filho à esquerda: continuar descendo.' : 'Chegamos ao menor nó da subárvore direita.', 'comparison', {
        activeIndices: [alvo], foundIndices: [suc], variables: { 'suc.esq ≠ NULO': more ? 'VERDADEIRO' : 'FALSO' },
      });
      if (!more) break;
      t.set('paiSuc', suc);
      step(18, 'Atualizando o paiSuc', 'Atualizamos o pai do sucessor.', 'update', { activeIndices: [alvo], foundIndices: [suc] });
      t.set('suc', t.node(suc).left);
      step(19, 'Descendo à esquerda', 'Deslocamos o sucessor para a esquerda.', 'update', { activeIndices: [alvo], foundIndices: [st.refs.suc] });
      step(20, 'Fim do corpo do laço', 'Fim do corpo do ENQUANTO; voltamos ao teste da linha 18.', 'neutral', { activeIndices: [alvo], foundIndices: [st.refs.suc] });
    }
    const suc = st.refs.suc;
    t.setValue(alvo, t.node(suc).value);
    step(21, 'Copiando o valor do sucessor', 'Copiamos apenas o valor do sucessor; a estrutura ainda não mudou. Temporariamente existem duas ocorrências do valor.', 'update', { changedIndices: [alvo], foundIndices: [suc] });
    t.set('pai', st.refs.paiSuc);
    step(22, 'Atualizando o pai', 'pai agora é o pai do sucessor original.', 'update', { activeIndices: [alvo], foundIndices: [suc] });
    t.set('atual', suc);
    step(23, 'Mirando o sucessor', 'atual passa a apontar para o nó sucessor original, que será desligado.', 'update', { activeIndices: [suc] });
    step(24, 'Fim do tratamento especial', 'Fim do tratamento especial de dois filhos.', 'neutral', { activeIndices: [suc] });
  } else {
    step(24, 'Fim do tratamento especial', 'Fim do tratamento especial de dois filhos.', 'neutral', { activeIndices: [alvo] });
  }

  // 3ª etapa: escolher o filho que fica no lugar e religar o pai (ou a raiz).
  const target = st.refs.atual;
  const hasLeft = has(target, 'left');
  step(25, 'Verificando o filho esquerdo', hasLeft ? 'Há filho esquerdo: ele ocupará o lugar do nó removido.' : 'Não há filho esquerdo; usar filho direito (que pode ser NULO).', 'comparison', {
    activeIndices: [target], variables: { 'atual.esq ≠ NULO': hasLeft ? 'VERDADEIRO' : 'FALSO' },
  });
  if (hasLeft) {
    t.set('filho', t.node(target).left);
    step(26, 'Escolhendo o filho', 'filho recebe a referência esquerda de atual.', 'update', { activeIndices: [target], foundIndices: [st.refs.filho] });
  } else {
    step(27, 'Entrando no SENÃO', 'Entramos no SENÃO, pois atual.esq é NULO.', 'neutral', { activeIndices: [target] });
    const child = t.follow('filho', target, 'right');
    step(28, 'Escolhendo o filho', `filho recebe a referência direita de atual${child === null ? ' (NULO)' : ''}.`, 'update', { activeIndices: [target], foundIndices: child === null ? [] : [child] });
  }
  const filho = st.refs.filho;
  const kept = typeof filho === 'number' ? [filho] : [];
  step(29, 'Fim da escolha', 'Fim da escolha do único filho/substituto.', 'neutral', { activeIndices: [target], foundIndices: kept });

  const pai = st.refs.pai;
  const isRoot = pai === null;
  step(30, 'Verificando se o alvo é a raiz', isRoot ? 'O alvo é a raiz: a raiz passará a ser o filho.' : 'O nó possui pai; atualizar a ligação de seu pai.', 'comparison', {
    activeIndices: [target], foundIndices: kept, variables: { 'pai = NULO': isRoot ? 'VERDADEIRO' : 'FALSO' },
  });
  const lostId = target;
  if (isRoot) {
    t.set('raiz', filho);
    step(31, 'Atualizando a raiz', 'raiz passa a apontar para filho (ou NULO).', 'update', { changedIndices: typeof filho === 'number' ? [filho] : [], activeIndices: [target] });
  } else {
    const isLeft = t.node(pai).left === target;
    step(32, 'Verificando o lado do pai', isLeft ? 'O alvo é filho esquerdo de pai.' : 'O alvo é filho direito de pai.', 'comparison', {
      activeIndices: [target], foundIndices: kept, variables: { 'pai.esq = atual': isLeft ? 'VERDADEIRO' : 'FALSO' },
    });
    if (!isLeft) step(34, 'Entrando no SENÃO', 'Entramos no SENÃO: o alvo é o filho direito de pai.', 'neutral', { activeIndices: [target] });
    t.setChild(pai, isLeft ? 'left' : 'right', filho);
    step(isLeft ? 33 : 35, 'Religando o pai', `pai.${isLeft ? 'esq' : 'dir'} passa a apontar para filho (ou NULO). O nó ${val(lostId)} deixa de ser alcançável.`, 'update', {
      changedIndices: [pai], activeIndices: [target], foundIndices: kept,
    });
  }
  step(36, 'Fim da atualização', 'Fim da atualização de referências.', 'neutral', { foundIndices: kept });
  t.drop(lostId);
  step(37, 'REMOVER() concluído', 'Retorno da raiz atualizada; a remoção terminou.', 'done', {
    foundIndices: kept, output: [`REMOVER(${v}) removeu ${kind}${two ? ' (o valor do sucessor foi copiado para o nó).' : '.'}`],
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
