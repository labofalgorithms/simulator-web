export const algorithms = [
  {
    id: 'allocation', title: 'Alocando memória', menuLabel: 'Alocar memória', group: 'Fundamentos', number: '01',
    description: 'Compare uma variável que guarda o valor diretamente com uma que guarda a referência para um objeto criado com novo.',
    interaction: 'Avance passo a passo e observe que a1 não guarda o objeto: guarda o endereço (a referência) para encontrá-lo.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Cada declaração reserva um espaço fixo na memória.' },
    pseudocode: ['idade ← 20', 'a1 ← novo Aluno()'],
  },
  {
    id: 'null', title: 'Referência nula', menuLabel: 'Referência nula', group: 'Fundamentos', number: '02',
    description: 'Uma referência que não aponta para nenhum objeto vale null. Usá-la antes de criar o objeto causa um erro de referência nula (em Java, NullPointerException).',
    interaction: 'Acompanhe o erro acontecer e depois a correção: antes de usar um objeto, precisamos criá-lo com new.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Seguir uma referência nula não encontra objeto algum, e o programa falha.' },
    pseudocode: ['// Erro comum', 'a1 ← null', 'a1.nome ← "Ana"   // ERRO: referência nula', '', '// Antes de usar, criamos o objeto', 'a1 ← novo Aluno()', 'a1.nome ← "Ana"'],
  },
  {
    id: 'createNodes', title: 'Criando nós', menuLabel: 'Criar nós', group: 'Nós encadeados', number: '03',
    description: 'Cada novo No(valor) cria um nó independente na memória, com o valor informado e proximoNo igual a null.',
    interaction: 'Altere os valores dos três nós. Os nós existem na memória, mas ainda não estão conectados entre si.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Cada nó ocupa um espaço fixo: um valor e uma referência para o próximo.' },
    pseudocode: [
      'CLASSE No',
      '  valor',
      '  proximoNo',
      '  CONSTRUTOR No(valor)',
      '    esta.valor ← valor',
      '    esta.proximoNo ← null',
      '  FIM',
      'FIM CLASSE',
      '',
      'n1 ← novo No(valor1)',
      'n2 ← novo No(valor2)',
      'n3 ← novo No(valor3)',
    ],
  },
  {
    id: 'connectNodes', title: 'Conectando os nós', menuLabel: 'Conectar nós', group: 'Nós encadeados', number: '04',
    description: 'Para conectar os nós, alteramos o campo proximoNo de cada um com setProximoNo.',
    interaction: 'Observe a seta surgir somente quando setProximoNo é executado. n1 é a referência inicial da estrutura.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Cada setProximoNo apenas grava uma referência no nó.' },
    pseudocode: [
      'n1 ← novo No(valor1)',
      'n2 ← novo No(valor2)',
      'n3 ← novo No(valor3)',
      'n1.setProximoNo(n2)',
      'n2.setProximoNo(n3)',
    ],
  },
  {
    id: 'traverse', title: 'Percorrendo a estrutura', menuLabel: 'Percorrer nós', group: 'Nós encadeados', number: '05',
    description: 'Sem índice, percorremos a estrutura seguindo as referências, nó por nó, com uma variável auxiliar chamada atual.',
    interaction: 'Acompanhe atual andando pelos nós até chegar em null, e o console recebendo cada valor.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada nó é visitado uma vez; só a variável atual é necessária.' },
    pseudocode: [
      'atual ← n1',
      'ENQUANTO atual != null FAÇA',
      '  ESCREVA atual.getValor()',
      '  atual ← atual.getProximoNo()',
      'FIM ENQUANTO',
    ],
  },
  {
    id: 'loseReference', title: 'Perdendo a referência', menuLabel: 'Perder referência', group: 'Nós encadeados', number: '06',
    description: 'Se nenhuma variável apontar para um nó, ele fica inacessível. Em Java, o Garbage Collector pode liberá-lo.',
    interaction: 'Veja n1 deixar de apontar para o primeiro nó. Sem referência, a estrutura perde o acesso a ele.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'A atribuição só troca uma referência; a liberação da memória é feita pelo Garbage Collector.' },
    pseudocode: [
      'n1 ← novo No(valor1)',
      'n2 ← novo No(valor2)',
      'n1 ← n2',
    ],
  },
];

const ADDRESS = 'a199bh';

const aluno = (nome = '—') => ({
  id: 'aluno',
  type: 'Aluno',
  address: ADDRESS,
  fields: [
    { name: 'nome', value: nome },
    { name: 'RA', value: '—' },
    { name: 'curso', value: '—' },
  ],
});

const objectsScene = ({ vars = [], objects = [], error = null }) => ({ kind: 'objects', vars, objects, error });
const nodesScene = ({ nodes = [], refs = [], nullSlot = false }) => ({ kind: 'nodes', nodes, refs, nullSlot });

const frame = (scene, line, title, description, tone = 'neutral', extra = {}) => ({
  scene, line, title, description, tone, variables: {}, output: [], ...extra,
});

function allocationSteps() {
  const idadeVazia = { name: 'idade', kind: 'value', value: null };
  const idade = { name: 'idade', kind: 'value', value: 20 };
  const a1Pendente = { name: 'a1', kind: 'ref', pending: true };
  const a1 = { name: 'a1', kind: 'ref', target: 'aluno' };
  const objeto = aluno();

  return [
    frame(objectsScene({ vars: [idadeVazia] }), 0, 'Reservando espaço para idade', 'A variável idade reserva, na memória, um espaço para guardar um número inteiro.', 'reading', { variables: { idade: '?' } }),
    frame(objectsScene({ vars: [idade] }), 0, 'Guardando o valor 20', 'O valor 20 é gravado diretamente na variável idade.', 'update', { changedVar: 'idade', variables: { idade: 20 } }),
    frame(objectsScene({ vars: [idade, a1Pendente], objects: [objeto] }), 1, 'Executando novo Aluno()', `O comando novo cria um novo objeto Aluno na memória, no endereço ${ADDRESS}.`, 'update', { bornObject: 'aluno', variables: { idade: 20, a1: '?' } }),
    frame(objectsScene({ vars: [idade, a1], objects: [objeto] }), 1, 'a1 recebe a referência', `a1 não guarda o objeto: guarda o caminho (${ADDRESS}) para encontrá-lo na memória.`, 'update', { changedVar: 'a1', variables: { idade: 20, a1: ADDRESS } }),
    frame(objectsScene({ vars: [idade, a1], objects: [objeto] }), 1, 'Alocação concluída', 'idade guarda um valor; a1 guarda uma referência para o objeto Aluno.', 'done', { variables: { idade: 20, a1: ADDRESS }, output: ['idade = 20', `a1 -> Aluno em ${ADDRESS}`] }),
  ];
}

function nullSteps() {
  const a1Nulo = { name: 'a1', kind: 'ref', target: null };
  const a1 = { name: 'a1', kind: 'ref', target: 'aluno' };
  const erro = 'ERRO: a1 é null (referência nula)';
  const comNome = aluno('"Ana"');

  return [
    frame(objectsScene({ vars: [a1Nulo] }), 1, 'Declarando a1 com null', 'a1 é criada, mas ainda não aponta para nenhum objeto: seu valor é null.', 'update', { changedVar: 'a1', variables: { a1: 'null' } }),
    frame(objectsScene({ vars: [a1Nulo] }), 2, 'Acessando a1.nome', 'O programa tenta seguir a referência de a1 para gravar "Ana" no campo nome.', 'reading', { activeVar: 'a1', variables: { a1: 'null' } }),
    frame(objectsScene({ vars: [a1Nulo], error: 'Erro de referência nula' }), 2, 'Erro: referência nula', 'a1 é null: não existe objeto para receber "Ana". O programa gera um erro.', 'warning', { activeVar: 'a1', variables: { a1: 'null' }, output: [erro] }),
    frame(objectsScene({ vars: [a1Nulo], objects: [aluno()] }), 5, 'Criando o objeto com novo', 'Antes de usar um objeto, precisamos criá-lo. O comando novo aloca o objeto na memória.', 'update', { bornObject: 'aluno', variables: { a1: 'null' }, output: [erro] }),
    frame(objectsScene({ vars: [a1], objects: [aluno()] }), 5, 'a1 recebe a referência', `Agora a1 guarda o endereço ${ADDRESS} e aponta para o objeto criado.`, 'update', { changedVar: 'a1', variables: { a1: ADDRESS }, output: [erro] }),
    frame(objectsScene({ vars: [a1], objects: [comNome] }), 6, 'Gravando "Ana" em nome', 'a1.nome segue a referência até o objeto e grava o texto no campo nome.', 'update', { changedField: 'nome', variables: { a1: ADDRESS }, output: [erro] }),
    frame(objectsScene({ vars: [a1], objects: [comNome] }), 6, 'Acesso concluído', 'Como a1 aponta para um objeto real, o acesso funciona sem erro.', 'done', { variables: { a1: ADDRESS }, output: [erro, 'a1.nome = "Ana"'] }),
  ];
}

const node = (id, value, next, extra = {}) => ({ id, value, next, ...extra });
const nodeLabel = (index) => `n${index + 1}`;

function createNodesSteps(values) {
  const [v1, v2, v3] = values;
  const steps = [];

  steps.push(frame(nodesScene({ nodes: [node(0, null, undefined)] }), 9, 'Executando novo No(valor1)', 'O comando novo reserva espaço para um novo nó e chama o construtor No(valor).', 'update', { bornNode: 0, activeIndices: [0], variables: { valor: v1 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, undefined)] }), 4, 'esta.valor ← valor', `O construtor grava ${v1} no campo valor do nó.`, 'update', { changedIndices: [0], variables: { valor: v1 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null)] }), 5, 'esta.proximoNo ← null', 'Como ainda não existe outro nó ligado a ele, proximoNo vale null.', 'update', { changedIndices: [0], variables: { valor: v1, proximoNo: 'null' } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null)], refs: [{ name: 'n1', target: 0 }] }), 9, 'n1 recebe a referência', 'n1 passa a guardar a referência para o nó recém-criado.', 'update', { activeIndices: [0], variables: { n1: v1 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null)], refs: [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }] }), 10, 'Criando o segundo nó', `novo No(${v2}) repete o processo: valor recebe ${v2} e proximoNo recebe null. n2 guarda a referência.`, 'update', { bornNode: 1, activeIndices: [1], variables: { n1: v1, n2: v2 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null), node(2, v3, null)], refs: [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }, { name: 'n3', target: 2 }] }), 11, 'Criando o terceiro nó', `O terceiro nó recebe ${v3} e também começa com proximoNo igual a null.`, 'update', { bornNode: 2, activeIndices: [2], variables: { n1: v1, n2: v2, n3: v3 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null), node(2, v3, null)], refs: [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }, { name: 'n3', target: 2 }] }), 11, 'Três nós independentes', 'Os nós existem na memória, mas ainda não estão conectados entre si.', 'done', { foundIndices: [0, 1, 2], variables: { n1: v1, n2: v2, n3: v3 }, output: ['3 nós criados, todos com proximoNo = null.'] }));
  return steps;
}

function connectNodesSteps(values) {
  const [v1, v2, v3] = values;
  const refs = (count) => Array.from({ length: count }, (_, index) => ({ name: nodeLabel(index), target: index }));
  const steps = [];

  steps.push(frame(nodesScene({ nodes: [node(0, v1, null)], refs: refs(1) }), 0, 'Criando n1', `novo No(${v1}) cria o primeiro nó; proximoNo vale null.`, 'update', { bornNode: 0, activeIndices: [0], variables: { n1: v1 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null)], refs: refs(2) }), 1, 'Criando n2', `novo No(${v2}) cria o segundo nó, também sem nenhuma ligação.`, 'update', { bornNode: 1, activeIndices: [1], variables: { n1: v1, n2: v2 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null), node(2, v3, null)], refs: refs(3) }), 2, 'Criando n3', 'Nesse momento temos três nós independentes: existem na memória, mas ainda não estão conectados.', 'reading', { bornNode: 2, activeIndices: [2], variables: { n1: v1, n2: v2, n3: v3 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, 1), node(1, v2, null), node(2, v3, null)], refs: refs(3) }), 3, 'n1.setProximoNo(n2)', `O campo proximoNo de n1 passa a guardar a referência para o nó ${v2}.`, 'update', { justLinked: [0], changedIndices: [0], activeIndices: [0, 1], variables: { n1: v1, n2: v2, n3: v3 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, 1), node(1, v2, 2), node(2, v3, null)], refs: refs(3) }), 4, 'n2.setProximoNo(n3)', `O campo proximoNo de n2 passa a guardar a referência para o nó ${v3}.`, 'update', { justLinked: [1], changedIndices: [1], activeIndices: [1, 2], variables: { n1: v1, n2: v2, n3: v3 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, 1), node(1, v2, 2), node(2, v3, null)], refs: refs(3) }), 4, 'Nós conectados', 'A estrutura está encadeada. Guardamos n1, a referência inicial: sem ela perderíamos o acesso aos demais nós.', 'done', { foundIndices: [0, 1, 2], variables: { n1: v1, n2: v2, n3: v3 }, output: [`n1 → n2 → n3 → null`, `${v1} → ${v2} → ${v3} → null`] }));
  return steps;
}

function traverseSteps(values) {
  const [v1, v2, v3] = values;
  const baseNodes = [node(0, v1, 1), node(1, v2, 2), node(2, v3, null)];
  const fixedRefs = [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }, { name: 'n3', target: 2 }];
  const scene = (atual) => nodesScene({ nodes: baseNodes, refs: [...fixedRefs, { name: 'atual', target: atual, cursor: true }], nullSlot: true });
  const label = (index) => (index === null ? 'null' : values[index]);

  const steps = [
    frame(scene(0), 0, 'Iniciando atual', 'atual começa apontando para o primeiro nó da estrutura, o mesmo de n1.', 'update', { activeIndices: [0], variables: { atual: label(0) } }),
  ];
  const output = [];

  values.forEach((value, index) => {
    const processed = Array.from({ length: index }, (_, item) => item);
    steps.push(frame(scene(index), 1, 'Verificando atual != null', `atual aponta para o nó ${value}, diferente de null; a condição é verdadeira.`, 'comparison', { activeIndices: [index], processedIndices: processed, variables: { atual: value }, output: [...output] }));
    output.push(String(value));
    steps.push(frame(scene(index), 2, 'ESCREVA atual.getValor()', `O valor ${value} do nó atual é enviado para o console.`, 'reading', { foundIndices: [index], processedIndices: processed, variables: { atual: value }, output: [...output] }));
    const next = index + 1 < values.length ? index + 1 : null;
    steps.push(frame(scene(next), 3, 'Avançando atual', next === null ? 'atual = atual.getProximoNo() devolve null: não há mais nós depois deste.' : `atual segue a referência e passa a apontar para o nó ${values[next]}.`, 'update', { activeIndices: next === null ? [] : [next], processedIndices: [...processed, index], variables: { atual: label(next) }, output: [...output] }));
  });

  steps.push(frame(scene(null), 1, 'Verificando atual != null', 'atual vale null; a condição é falsa e o laço termina.', 'comparison', { processedIndices: [0, 1, 2], variables: { atual: 'null' }, output: [...output] }));
  steps.push(frame(scene(null), 4, 'Percurso concluído', 'Todos os nós foram visitados, seguindo as referências do primeiro ao último.', 'done', { processedIndices: [0, 1, 2], variables: { atual: 'null' }, output: [...output] }));
  return steps;
}

function loseReferenceSteps(values) {
  const [v1, v2] = values;
  const twoNodes = [node(0, v1, null), node(1, v2, null)];
  const initialRefs = [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }];
  const sharedRefs = [{ name: 'n1', target: 1 }, { name: 'n2', target: 1 }];

  return [
    frame(nodesScene({ nodes: [node(0, v1, null)], refs: [{ name: 'n1', target: 0 }] }), 0, 'Criando n1', `novo No(${v1}) cria um nó; n1 guarda a referência para ele.`, 'update', { bornNode: 0, activeIndices: [0], variables: { n1: v1 } }),
    frame(nodesScene({ nodes: twoNodes, refs: initialRefs }), 1, 'Criando n2', `novo No(${v2}) cria outro nó; n2 guarda a referência para ele.`, 'update', { bornNode: 1, activeIndices: [1], variables: { n1: v1, n2: v2 } }),
    frame(nodesScene({ nodes: [node(0, v1, null, { state: 'lost' }), node(1, v2, null)], refs: sharedRefs }), 2, 'n1 ← n2', `n1 deixa de apontar para o nó ${v1} e passa a apontar para o nó ${v2}. Nenhuma outra variável aponta para o nó ${v1}: ele fica inacessível.`, 'warning', { activeIndices: [1], variables: { n1: v2, n2: v2 } }),
    frame(nodesScene({ nodes: [node(0, v1, null, { state: 'freed' }), node(1, v2, null)], refs: sharedRefs }), 2, 'Coletor de lixo', 'Em Java, um objeto que nenhuma referência alcança pode ser removido da memória pelo Garbage Collector.', 'update', { variables: { n1: v2, n2: v2 } }),
    frame(nodesScene({ nodes: [node(1, v2, null)], refs: sharedRefs }), 2, 'Cuidado com as referências', 'A memória do nó foi liberada. Como programadores, precisamos evitar perder referências importantes da estrutura.', 'done', { foundIndices: [1], variables: { n1: v2, n2: v2 }, output: [`O nó ${v1} ficou inacessível e foi liberado.`] }),
  ];
}

export function buildSteps(id, data) {
  switch (id) {
    case 'allocation': return allocationSteps();
    case 'null': return nullSteps();
    case 'createNodes': return createNodesSteps(data.values);
    case 'connectNodes': return connectNodesSteps(data.values);
    case 'traverse': return traverseSteps(data.values);
    case 'loseReference': return loseReferenceSteps(data.values);
    default: return allocationSteps();
  }
}
