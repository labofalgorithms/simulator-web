import { tr } from '../../core/i18n.js';
export const algorithms = [
  {
    id: 'allocation', title: tr('Alocando memória', 'Allocating memory'), menuLabel: tr('Alocar memória', 'Allocate memory'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Compare uma variável que guarda o valor diretamente com uma que guarda a referência para um objeto criado com novo.', 'Compare a variable that stores the value directly with one that stores the reference to an object created with new.'),
    interaction: tr('Avance passo a passo e observe que a1 não guarda o objeto: guarda o endereço (a referência) para encontrá-lo.', 'Step through and notice that a1 does not hold the object: it holds the address (the reference) to find it.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Cada declaração reserva um espaço fixo na memória.', 'Each declaration reserves a fixed amount of space in memory.') },
    pseudocode: [tr('idade ← 20', 'age ← 20'), tr('a1 ← novo Aluno()', 'a1 ← new Student()')],
  },
  {
    id: 'null', title: tr('Referência nula', 'Null reference'), menuLabel: tr('Referência nula', 'Null reference'), group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Uma referência que não aponta para nenhum objeto vale null. Usá-la antes de criar o objeto causa um erro de referência nula (em Java, NullPointerException).', 'A reference that does not point to any object is null. Using it before creating the object causes a null reference error (in Java, NullPointerException).'),
    interaction: tr('Acompanhe o erro acontecer e depois a correção: antes de usar um objeto, precisamos criá-lo com new.', 'Watch the error happen and then the fix: before using an object, we need to create it with new.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Seguir uma referência nula não encontra objeto algum, e o programa falha.', 'Following a null reference finds no object at all, and the program fails.') },
    pseudocode: [tr('// Erro comum', '// Common mistake'), 'a1 ← null', tr('a1.nome ← "Ana"   // ERRO: referência nula', 'a1.name ← "Ana"   // ERROR: null reference'), '', tr('// Antes de usar, criamos o objeto', '// Before using it, we create the object'), tr('a1 ← novo Aluno()', 'a1 ← new Student()'), tr('a1.nome ← "Ana"', 'a1.name ← "Ana"')],
  },
  {
    id: 'createNodes', title: tr('Criando nós', 'Creating nodes'), menuLabel: tr('Criar nós', 'Create nodes'), group: tr('Nós encadeados', 'Linked nodes'), number: '03',
    description: tr('Cada novo No(valor) cria um nó independente na memória, com o valor informado e proximoNo igual a null.', 'Each new Node(value) creates an independent node in memory, with the given value and nextNode equal to null.'),
    interaction: tr('Altere os valores dos três nós. Os nós existem na memória, mas ainda não estão conectados entre si.', 'Change the values of the three nodes. The nodes exist in memory, but they are not connected to each other yet.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Cada nó ocupa um espaço fixo: um valor e uma referência para o próximo.', 'Each node takes a fixed amount of space: a value and a reference to the next one.') },
    pseudocode: [
      tr('CLASSE No', 'CLASS Node'),
      tr('  valor', '  value'),
      tr('  proximoNo', '  nextNode'),
      tr('  CONSTRUTOR No(valor)', '  CONSTRUCTOR Node(value)'),
      tr('    esta.valor ← valor', '    this.value ← value'),
      tr('    esta.proximoNo ← null', '    this.nextNode ← null'),
      tr('  FIM', '  END'),
      tr('FIM CLASSE', 'END CLASS'),
      '',
      tr('n1 ← novo No(valor1)', 'n1 ← new Node(value1)'),
      tr('n2 ← novo No(valor2)', 'n2 ← new Node(value2)'),
      tr('n3 ← novo No(valor3)', 'n3 ← new Node(value3)'),
    ],
  },
  {
    id: 'connectNodes', title: tr('Conectando os nós', 'Connecting the nodes'), menuLabel: tr('Conectar nós', 'Connect nodes'), group: tr('Nós encadeados', 'Linked nodes'), number: '04',
    description: tr('Para conectar os nós, alteramos o campo proximoNo de cada um com setProximoNo.', 'To connect the nodes, we change the nextNode field of each one with setNextNode.'),
    interaction: tr('Observe a seta surgir somente quando setProximoNo é executado. n1 é a referência inicial da estrutura.', 'Watch the arrow appear only when setNextNode runs. n1 is the starting reference of the structure.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Cada setProximoNo apenas grava uma referência no nó.', 'Each setNextNode only writes a reference into the node.') },
    pseudocode: [
      tr('n1 ← novo No(valor1)', 'n1 ← new Node(value1)'),
      tr('n2 ← novo No(valor2)', 'n2 ← new Node(value2)'),
      tr('n3 ← novo No(valor3)', 'n3 ← new Node(value3)'),
      tr('n1.setProximoNo(n2)', 'n1.setNextNode(n2)'),
      tr('n2.setProximoNo(n3)', 'n2.setNextNode(n3)'),
    ],
  },
  {
    id: 'traverse', title: tr('Percorrendo a estrutura', 'Traversing the structure'), menuLabel: tr('Percorrer nós', 'Traverse nodes'), group: tr('Nós encadeados', 'Linked nodes'), number: '05',
    description: tr('Sem índice, percorremos a estrutura seguindo as referências, nó por nó, com uma variável auxiliar chamada atual.', 'Without an index, we traverse the structure by following the references, node by node, with a helper variable called current.'),
    interaction: tr('Acompanhe atual andando pelos nós até chegar em null, e o console recebendo cada valor.', 'Follow current walking through the nodes until it reaches null, and the console receiving each value.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Cada nó é visitado uma vez; só a variável atual é necessária.', 'Each node is visited once; only the variable current is needed.') },
    pseudocode: [
      tr('atual ← n1', 'current ← n1'),
      tr('ENQUANTO atual != null FAÇA', 'WHILE current != null DO'),
      tr('  ESCREVA atual.getValor()', '  PRINT current.getValue()'),
      tr('  atual ← atual.getProximoNo()', '  current ← current.getNextNode()'),
      tr('FIM ENQUANTO', 'END WHILE'),
    ],
  },
  {
    id: 'loseReference', title: tr('Perdendo a referência', 'Losing the reference'), menuLabel: tr('Perder referência', 'Lose reference'), group: tr('Nós encadeados', 'Linked nodes'), number: '06',
    description: tr('Se nenhuma variável apontar para um nó, ele fica inacessível. Em Java, o Garbage Collector pode liberá-lo.', 'If no variable points to a node, it becomes unreachable. In Java, the Garbage Collector can free it.'),
    interaction: tr('Veja n1 deixar de apontar para o primeiro nó. Sem referência, a estrutura perde o acesso a ele.', 'Watch n1 stop pointing to the first node. Without a reference, the structure loses access to it.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('A atribuição só troca uma referência; a liberação da memória é feita pelo Garbage Collector.', 'The assignment only swaps one reference; freeing the memory is done by the Garbage Collector.') },
    pseudocode: [
      tr('n1 ← novo No(valor1)', 'n1 ← new Node(value1)'),
      tr('n2 ← novo No(valor2)', 'n2 ← new Node(value2)'),
      'n1 ← n2',
    ],
  },
];

const ADDRESS = 'a199bh';

const aluno = (nome = '—') => ({
  id: 'aluno',
  type: tr('Aluno', 'Student'),
  address: ADDRESS,
  fields: [
    { name: 'nome', value: nome },
    { name: tr('RA', 'ID'), value: '—' },
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
    frame(objectsScene({ vars: [idadeVazia] }), 0, tr('Reservando espaço para idade', 'Reserving space for age'), tr('A variável idade reserva, na memória, um espaço para guardar um número inteiro.', 'The variable age reserves, in memory, a space to store an integer.'), 'reading', { variables: { idade: '?' } }),
    frame(objectsScene({ vars: [idade] }), 0, tr('Guardando o valor 20', 'Storing the value 20'), tr('O valor 20 é gravado diretamente na variável idade.', 'The value 20 is written directly into the variable age.'), 'update', { changedVar: 'idade', variables: { idade: 20 } }),
    frame(objectsScene({ vars: [idade, a1Pendente], objects: [objeto] }), 1, tr('Executando novo Aluno()', 'Executing new Student()'), tr(`O comando novo cria um novo objeto Aluno na memória, no endereço ${ADDRESS}.`, `The new command creates a new Student object in memory, at address ${ADDRESS}.`), 'update', { bornObject: 'aluno', variables: { idade: 20, a1: '?' } }),
    frame(objectsScene({ vars: [idade, a1], objects: [objeto] }), 1, tr('a1 recebe a referência', 'a1 receives the reference'), tr(`a1 não guarda o objeto: guarda o caminho (${ADDRESS}) para encontrá-lo na memória.`, `a1 does not hold the object: it holds the path (${ADDRESS}) to find it in memory.`), 'update', { changedVar: 'a1', variables: { idade: 20, a1: ADDRESS } }),
    frame(objectsScene({ vars: [idade, a1], objects: [objeto] }), 1, tr('Alocação concluída', 'Allocation finished'), tr('idade guarda um valor; a1 guarda uma referência para o objeto Aluno.', 'age holds a value; a1 holds a reference to the Student object.'), 'done', { variables: { idade: 20, a1: ADDRESS }, output: [tr('idade = 20', 'age = 20'), tr(`a1 -> Aluno em ${ADDRESS}`, `a1 -> Student at ${ADDRESS}`)] }),
  ];
}

function nullSteps() {
  const a1Nulo = { name: 'a1', kind: 'ref', target: null };
  const a1 = { name: 'a1', kind: 'ref', target: 'aluno' };
  const erro = tr('ERRO: a1 é null (referência nula)', 'ERROR: a1 is null (null reference)');
  const comNome = aluno('"Ana"');

  return [
    frame(objectsScene({ vars: [a1Nulo] }), 1, tr('Declarando a1 com null', 'Declaring a1 as null'), tr('a1 é criada, mas ainda não aponta para nenhum objeto: seu valor é null.', 'a1 is created, but does not point to any object yet: its value is null.'), 'update', { changedVar: 'a1', variables: { a1: 'null' } }),
    frame(objectsScene({ vars: [a1Nulo] }), 2, tr('Acessando a1.nome', 'Accessing a1.name'), tr('O programa tenta seguir a referência de a1 para gravar "Ana" no campo nome.', 'The program tries to follow the reference in a1 to write "Ana" into the name field.'), 'reading', { activeVar: 'a1', variables: { a1: 'null' } }),
    frame(objectsScene({ vars: [a1Nulo], error: tr('Erro de referência nula', 'Null reference error') }), 2, tr('Erro: referência nula', 'Error: null reference'), tr('a1 é null: não existe objeto para receber "Ana". O programa gera um erro.', 'a1 is null: there is no object to receive "Ana". The program raises an error.'), 'warning', { activeVar: 'a1', variables: { a1: 'null' }, output: [erro] }),
    frame(objectsScene({ vars: [a1Nulo], objects: [aluno()] }), 5, tr('Criando o objeto com novo', 'Creating the object with new'), tr('Antes de usar um objeto, precisamos criá-lo. O comando novo aloca o objeto na memória.', 'Before using an object, we need to create it. The new command allocates the object in memory.'), 'update', { bornObject: 'aluno', variables: { a1: 'null' }, output: [erro] }),
    frame(objectsScene({ vars: [a1], objects: [aluno()] }), 5, tr('a1 recebe a referência', 'a1 receives the reference'), tr(`Agora a1 guarda o endereço ${ADDRESS} e aponta para o objeto criado.`, `Now a1 holds the address ${ADDRESS} and points to the created object.`), 'update', { changedVar: 'a1', variables: { a1: ADDRESS }, output: [erro] }),
    frame(objectsScene({ vars: [a1], objects: [comNome] }), 6, tr('Gravando "Ana" em nome', 'Writing "Ana" into name'), tr('a1.nome segue a referência até o objeto e grava o texto no campo nome.', 'a1.name follows the reference to the object and writes the text into the name field.'), 'update', { changedField: 'nome', variables: { a1: ADDRESS }, output: [erro] }),
    frame(objectsScene({ vars: [a1], objects: [comNome] }), 6, tr('Acesso concluído', 'Access finished'), tr('Como a1 aponta para um objeto real, o acesso funciona sem erro.', 'Since a1 points to a real object, the access works without errors.'), 'done', { variables: { a1: ADDRESS }, output: [erro, tr('a1.nome = "Ana"', 'a1.name = "Ana"')] }),
  ];
}

const node = (id, value, next, extra = {}) => ({ id, value, next, ...extra });
const nodeLabel = (index) => `n${index + 1}`;

function createNodesSteps(values) {
  const [v1, v2, v3] = values;
  const steps = [];

  steps.push(frame(nodesScene({ nodes: [node(0, null, undefined)] }), 9, tr('Executando novo No(valor1)', 'Executing new Node(value1)'), tr('O comando novo reserva espaço para um novo nó e chama o construtor No(valor).', 'The new command reserves space for a new node and calls the Node(value) constructor.'), 'update', { bornNode: 0, activeIndices: [0], variables: { valor: v1 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, undefined)] }), 4, tr('esta.valor ← valor', 'this.value ← value'), tr(`O construtor grava ${v1} no campo valor do nó.`, `The constructor writes ${v1} into the node's value field.`), 'update', { changedIndices: [0], variables: { valor: v1 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null)] }), 5, tr('esta.proximoNo ← null', 'this.nextNode ← null'), tr('Como ainda não existe outro nó ligado a ele, proximoNo vale null.', 'Since there is no other node linked to it yet, nextNode is null.'), 'update', { changedIndices: [0], variables: { valor: v1, proximoNo: 'null' } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null)], refs: [{ name: 'n1', target: 0 }] }), 9, tr('n1 recebe a referência', 'n1 receives the reference'), tr('n1 passa a guardar a referência para o nó recém-criado.', 'n1 now holds the reference to the newly created node.'), 'update', { activeIndices: [0], variables: { n1: v1 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null)], refs: [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }] }), 10, tr('Criando o segundo nó', 'Creating the second node'), tr(`novo No(${v2}) repete o processo: valor recebe ${v2} e proximoNo recebe null. n2 guarda a referência.`, `new Node(${v2}) repeats the process: value receives ${v2} and nextNode receives null. n2 holds the reference.`), 'update', { bornNode: 1, activeIndices: [1], variables: { n1: v1, n2: v2 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null), node(2, v3, null)], refs: [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }, { name: 'n3', target: 2 }] }), 11, tr('Criando o terceiro nó', 'Creating the third node'), tr(`O terceiro nó recebe ${v3} e também começa com proximoNo igual a null.`, `The third node receives ${v3} and also starts with nextNode equal to null.`), 'update', { bornNode: 2, activeIndices: [2], variables: { n1: v1, n2: v2, n3: v3 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null), node(2, v3, null)], refs: [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }, { name: 'n3', target: 2 }] }), 11, tr('Três nós independentes', 'Three independent nodes'), tr('Os nós existem na memória, mas ainda não estão conectados entre si.', 'The nodes exist in memory, but they are not connected to each other yet.'), 'done', { foundIndices: [0, 1, 2], variables: { n1: v1, n2: v2, n3: v3 }, output: [tr('3 nós criados, todos com proximoNo = null.', '3 nodes created, all with nextNode = null.')] }));
  return steps;
}

function connectNodesSteps(values) {
  const [v1, v2, v3] = values;
  const refs = (count) => Array.from({ length: count }, (_, index) => ({ name: nodeLabel(index), target: index }));
  const steps = [];

  steps.push(frame(nodesScene({ nodes: [node(0, v1, null)], refs: refs(1) }), 0, tr('Criando n1', 'Creating n1'), tr(`novo No(${v1}) cria o primeiro nó; proximoNo vale null.`, `new Node(${v1}) creates the first node; nextNode is null.`), 'update', { bornNode: 0, activeIndices: [0], variables: { n1: v1 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null)], refs: refs(2) }), 1, tr('Criando n2', 'Creating n2'), tr(`novo No(${v2}) cria o segundo nó, também sem nenhuma ligação.`, `new Node(${v2}) creates the second node, also with no link.`), 'update', { bornNode: 1, activeIndices: [1], variables: { n1: v1, n2: v2 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, null), node(1, v2, null), node(2, v3, null)], refs: refs(3) }), 2, tr('Criando n3', 'Creating n3'), tr('Nesse momento temos três nós independentes: existem na memória, mas ainda não estão conectados.', 'At this point we have three independent nodes: they exist in memory, but are not connected yet.'), 'reading', { bornNode: 2, activeIndices: [2], variables: { n1: v1, n2: v2, n3: v3 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, 1), node(1, v2, null), node(2, v3, null)], refs: refs(3) }), 3, tr('n1.setProximoNo(n2)', 'n1.setNextNode(n2)'), tr(`O campo proximoNo de n1 passa a guardar a referência para o nó ${v2}.`, `The nextNode field of n1 now holds the reference to node ${v2}.`), 'update', { justLinked: [0], changedIndices: [0], activeIndices: [0, 1], variables: { n1: v1, n2: v2, n3: v3 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, 1), node(1, v2, 2), node(2, v3, null)], refs: refs(3) }), 4, tr('n2.setProximoNo(n3)', 'n2.setNextNode(n3)'), tr(`O campo proximoNo de n2 passa a guardar a referência para o nó ${v3}.`, `The nextNode field of n2 now holds the reference to node ${v3}.`), 'update', { justLinked: [1], changedIndices: [1], activeIndices: [1, 2], variables: { n1: v1, n2: v2, n3: v3 } }));
  steps.push(frame(nodesScene({ nodes: [node(0, v1, 1), node(1, v2, 2), node(2, v3, null)], refs: refs(3) }), 4, tr('Nós conectados', 'Nodes connected'), tr('A estrutura está encadeada. Guardamos n1, a referência inicial: sem ela perderíamos o acesso aos demais nós.', 'The structure is linked. We keep n1, the starting reference: without it we would lose access to the other nodes.'), 'done', { foundIndices: [0, 1, 2], variables: { n1: v1, n2: v2, n3: v3 }, output: [`n1 → n2 → n3 → null`, tr(`${v1} → ${v2} → ${v3} → null`, `${v1} → ${v2} → ${v3} → null`)] }));
  return steps;
}

function traverseSteps(values) {
  const [v1, v2, v3] = values;
  const baseNodes = [node(0, v1, 1), node(1, v2, 2), node(2, v3, null)];
  const fixedRefs = [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }, { name: 'n3', target: 2 }];
  const scene = (atual) => nodesScene({ nodes: baseNodes, refs: [...fixedRefs, { name: 'atual', target: atual, cursor: true }], nullSlot: true });
  const label = (index) => (index === null ? 'null' : values[index]);

  const steps = [
    frame(scene(0), 0, tr('Iniciando atual', 'Initializing current'), tr('atual começa apontando para o primeiro nó da estrutura, o mesmo de n1.', 'current starts by pointing to the first node of the structure, the same as n1.'), 'update', { activeIndices: [0], variables: { atual: label(0) } }),
  ];
  const output = [];

  values.forEach((value, index) => {
    const processed = Array.from({ length: index }, (_, item) => item);
    steps.push(frame(scene(index), 1, tr('Verificando atual != null', 'Checking current != null'), tr(`atual aponta para o nó ${value}, diferente de null; a condição é verdadeira.`, `current points to node ${value}, which is not null; the condition is true.`), 'comparison', { activeIndices: [index], processedIndices: processed, variables: { atual: value }, output: [...output] }));
    output.push(String(value));
    steps.push(frame(scene(index), 2, tr('ESCREVA atual.getValor()', 'PRINT current.getValue()'), tr(`O valor ${value} do nó atual é enviado para o console.`, `The value ${value} of the current node is sent to the console.`), 'reading', { foundIndices: [index], processedIndices: processed, variables: { atual: value }, output: [...output] }));
    const next = index + 1 < values.length ? index + 1 : null;
    steps.push(frame(scene(next), 3, tr('Avançando atual', 'Advancing current'), next === null ? tr('atual = atual.getProximoNo() devolve null: não há mais nós depois deste.', 'current = current.getNextNode() returns null: there are no more nodes after this one.') : tr(`atual segue a referência e passa a apontar para o nó ${values[next]}.`, `current follows the reference and now points to node ${values[next]}.`), 'update', { activeIndices: next === null ? [] : [next], processedIndices: [...processed, index], variables: { atual: label(next) }, output: [...output] }));
  });

  steps.push(frame(scene(null), 1, tr('Verificando atual != null', 'Checking current != null'), tr('atual vale null; a condição é falsa e o laço termina.', 'current is null; the condition is false and the loop ends.'), 'comparison', { processedIndices: [0, 1, 2], variables: { atual: 'null' }, output: [...output] }));
  steps.push(frame(scene(null), 4, tr('Percurso concluído', 'Traversal finished'), tr('Todos os nós foram visitados, seguindo as referências do primeiro ao último.', 'All the nodes were visited, following the references from the first to the last.'), 'done', { processedIndices: [0, 1, 2], variables: { atual: 'null' }, output: [...output] }));
  return steps;
}

function loseReferenceSteps(values) {
  const [v1, v2] = values;
  const twoNodes = [node(0, v1, null), node(1, v2, null)];
  const initialRefs = [{ name: 'n1', target: 0 }, { name: 'n2', target: 1 }];
  const sharedRefs = [{ name: 'n1', target: 1 }, { name: 'n2', target: 1 }];

  return [
    frame(nodesScene({ nodes: [node(0, v1, null)], refs: [{ name: 'n1', target: 0 }] }), 0, tr('Criando n1', 'Creating n1'), tr(`novo No(${v1}) cria um nó; n1 guarda a referência para ele.`, `new Node(${v1}) creates a node; n1 holds the reference to it.`), 'update', { bornNode: 0, activeIndices: [0], variables: { n1: v1 } }),
    frame(nodesScene({ nodes: twoNodes, refs: initialRefs }), 1, tr('Criando n2', 'Creating n2'), tr(`novo No(${v2}) cria outro nó; n2 guarda a referência para ele.`, `new Node(${v2}) creates another node; n2 holds the reference to it.`), 'update', { bornNode: 1, activeIndices: [1], variables: { n1: v1, n2: v2 } }),
    frame(nodesScene({ nodes: [node(0, v1, null, { state: 'lost' }), node(1, v2, null)], refs: sharedRefs }), 2, 'n1 ← n2', tr(`n1 deixa de apontar para o nó ${v1} e passa a apontar para o nó ${v2}. Nenhuma outra variável aponta para o nó ${v1}: ele fica inacessível.`, `n1 stops pointing to node ${v1} and now points to node ${v2}. No other variable points to node ${v1}: it becomes unreachable.`), 'warning', { activeIndices: [1], variables: { n1: v2, n2: v2 } }),
    frame(nodesScene({ nodes: [node(0, v1, null, { state: 'freed' }), node(1, v2, null)], refs: sharedRefs }), 2, tr('Coletor de lixo', 'Garbage collector'), tr('Em Java, um objeto que nenhuma referência alcança pode ser removido da memória pelo Garbage Collector.', 'In Java, an object that no reference can reach can be removed from memory by the Garbage Collector.'), 'update', { variables: { n1: v2, n2: v2 } }),
    frame(nodesScene({ nodes: [node(1, v2, null)], refs: sharedRefs }), 2, tr('Cuidado com as referências', 'Be careful with references'), tr('A memória do nó foi liberada. Como programadores, precisamos evitar perder referências importantes da estrutura.', 'The node\'s memory was freed. As programmers, we need to avoid losing important references of the structure.'), 'done', { foundIndices: [1], variables: { n1: v2, n2: v2 }, output: [tr(`O nó ${v1} ficou inacessível e foi liberado.`, `Node ${v1} became unreachable and was freed.`)] }),
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
