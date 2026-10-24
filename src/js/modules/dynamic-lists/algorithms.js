import { extendVariableNames, locale, tr } from '../../core/i18n.js';

extendVariableNames({ fim: 'tail' });

export const algorithms = [
  {
    id: 'creation', title: tr('Criação da lista dinâmica', 'Dynamic list creation'), menuLabel: tr('Criação da lista', 'List creation'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Veja como início e fim são iniciados apontando para nulo, sem alocar um vetor.', 'See how head and tail start pointing to null, without allocating an array.'),
    interaction: tr('Observe que não existe capacidade máxima: a lista começa vazia e cresce sob demanda.', 'Notice that there is no maximum capacity: the list starts empty and grows on demand.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Nenhuma estrutura é alocada antecipadamente; apenas as referências início e fim são criadas.', 'No structure is allocated in advance; only the head and tail references are created.') },
    pseudocode: [tr('CONSTRUTOR ListaDinamica()', 'CONSTRUCTOR DynamicList()'), tr('  inicio ← nulo', '  head ← null'), tr('  fim ← nulo', '  tail ← null'), tr('FIM', 'END')],
  },
  {
    id: 'isEmpty', title: tr('Verificar se está vazia', 'Check if it is empty'), menuLabel: 'isEmpty()', group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Compare o atributo início com nulo.', 'Compare the head attribute with null.'),
    interaction: tr('Esvazie a lista para ver o retorno mudar para verdadeiro.', 'Empty the list to see the result turn true.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas uma comparação é realizada.', 'Only one comparison is made.') },
    pseudocode: [tr('FUNÇÃO isEmpty()', 'FUNCTION isEmpty()'), tr('  RETORNE (inicio == nulo)', '  RETURN (head == null)'), tr('FIM', 'END')],
  },
  {
    id: 'insertAtFront', title: tr('Inserir no início', 'Insert at the front'), menuLabel: 'insertAtFront()', group: tr('Inserções', 'Insertions'), number: '03',
    description: tr('Crie um novo nó e faça-o apontar para o antigo início, atualizando início (e fim, se a lista estava vazia).', 'Create a new node and make it point to the old head, updating head (and tail, if the list was empty).'),
    interaction: tr('Escolha o valor a inserir. Não existe verificação de lista cheia.', 'Choose the value to insert. There is no full-list check.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O novo nó é ligado diretamente ao início, sem percorrer a lista.', 'The new node is linked directly to the head, without traversing the list.') },
    pseudocode: [tr('FUNÇÃO insertAtFront(item)', 'FUNCTION insertAtFront(item)'), tr('  novoNo ← novo No(item)', '  newNode ← new Node(item)'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    inicio ← novoNo', '    head ← newNode'), tr('    fim ← novoNo', '    tail ← newNode'), tr('  SENÃO', '  ELSE'), tr('    novoNo.setProxNo(inicio)', '    newNode.setNextNode(head)'), tr('    inicio ← novoNo', '    head ← newNode'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'insertAtBack', title: tr('Inserir no final', 'Insert at the back'), menuLabel: 'insertAtBack()', group: tr('Inserções', 'Insertions'), number: '04',
    description: tr('Crie um novo nó e ligue-o ao final da lista, atualizando fim (e início, se a lista estava vazia).', 'Create a new node and link it to the end of the list, updating tail (and head, if the list was empty).'),
    interaction: tr('Escolha o valor a inserir. Não existe verificação de lista cheia.', 'Choose the value to insert. There is no full-list check.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O novo nó é ligado diretamente ao fim, sem percorrer a lista.', 'The new node is linked directly to the tail, without traversing the list.') },
    pseudocode: [tr('FUNÇÃO insertAtBack(item)', 'FUNCTION insertAtBack(item)'), tr('  novoNo ← novo No(item)', '  newNode ← new Node(item)'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    inicio ← novoNo', '    head ← newNode'), tr('    fim ← novoNo', '    tail ← newNode'), tr('  SENÃO', '  ELSE'), tr('    fim.setProxNo(novoNo)', '    tail.setNextNode(newNode)'), tr('    fim ← novoNo', '    tail ← newNode'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'insertAtPosition', title: tr('Inserir em uma posição', 'Insert at a position'), menuLabel: 'insertAtPosition()', group: tr('Inserções', 'Insertions'), number: '05',
    description: tr('Percorra até o nó anterior à posição desejada e ajuste as referências para inserir o novo nó ali.', 'Walk to the node before the desired position and adjust the references to insert the new node there.'),
    interaction: tr('Escolha a posição e o valor. Compare inserir no início, no meio e no final.', 'Choose the position and the value. Compare inserting at the start, the middle and the end.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso, é preciso percorrer a lista até a posição desejada.', 'In the worst case, the list has to be traversed up to the desired position.') },
    pseudocode: [tr('FUNÇÃO insertAtPosition(item, posição)', 'FUNCTION insertAtPosition(item, position)'), tr('  SE posição < 0 ENTÃO', '  IF position < 0 THEN'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  SE posição == 0 ENTÃO', '  IF position == 0 THEN'), tr('    insertAtFront(item)', '    insertAtFront(item)'), tr('    RETORNE verdadeiro', '    RETURN true'), tr('  FIM SE', '  END IF'), tr('  novoNo ← novo No(item)', '  newNode ← new Node(item)'), tr('  atual ← inicio', '  current ← head'), tr('  índice ← 0', '  index ← 0'), tr('  ENQUANTO atual != nulo E índice < posição - 1 FAÇA', '  WHILE current != null AND index < position - 1 DO'), tr('    atual ← atual.getProxNo()', '    current ← current.getNextNode()'), tr('    índice ← índice + 1', '    index ← index + 1'), tr('  FIM ENQUANTO', '  END WHILE'), tr('  SE atual == nulo ENTÃO', '  IF current == null THEN'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  novoNo.setProxNo(atual.getProxNo())', '  newNode.setNextNode(current.getNextNode())'), tr('  atual.setProxNo(novoNo)', '  current.setNextNode(newNode)'), tr('  SE novoNo.getProxNo() == nulo ENTÃO', '  IF newNode.getNextNode() == null THEN'), tr('    fim ← novoNo', '    tail ← newNode'), tr('  FIM SE', '  END IF'), tr('  RETORNE verdadeiro', '  RETURN true'), tr('FIM', 'END')],
  },
  {
    id: 'removeAtFront', title: tr('Remover do início', 'Remove from the front'), menuLabel: 'removeAtFront()', group: tr('Remoções', 'Removals'), number: '06',
    description: tr('Guarde o dado do início, avance início para o próximo nó (ou esvazie a lista, se era o único nó).', 'Save the head data, move head to the next node (or empty the list, if it was the only node).'),
    interaction: tr('Remova até o último elemento e observe início e fim voltarem a nulo.', 'Remove down to the last element and watch head and tail go back to null.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas a referência início é atualizada; nenhum outro nó é percorrido.', 'Only the head reference is updated; no other node is traversed.') },
    pseudocode: [tr('FUNÇÃO removeAtFront()', 'FUNCTION removeAtFront()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('  removItem ← inicio.getDado()', '  removedItem ← head.getData()'), tr('  SE inicio == fim ENTÃO', '  IF head == tail THEN'), tr('    inicio ← nulo', '    head ← null'), tr('    fim ← nulo', '    tail ← null'), tr('  SENÃO', '  ELSE'), tr('    inicio ← inicio.getProxNo()', '    head ← head.getNextNode()'), tr('  FIM SE', '  END IF'), tr('  RETORNE removItem', '  RETURN removedItem'), tr('FIM', 'END')],
  },
  {
    id: 'removeAtBack', title: tr('Remover do final', 'Remove from the back'), menuLabel: 'removeAtBack()', group: tr('Remoções', 'Removals'), number: '07',
    description: tr('Percorra até o penúltimo nó, pois é preciso encontrá-lo para desligar o antigo fim da lista.', 'Walk to the second-to-last node, since we need to find it to detach the old tail from the list.'),
    interaction: tr('Remova até o último elemento e observe início e fim voltarem a nulo.', 'Remove down to the last element and watch head and tail go back to null.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Como a lista é simplesmente encadeada, é preciso percorrê-la para achar o penúltimo nó.', 'Since the list is singly linked, it has to be traversed to find the second-to-last node.') },
    pseudocode: [tr('FUNÇÃO removeAtBack()', 'FUNCTION removeAtBack()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('  removedItem ← fim.getDado()', '  removedItem ← tail.getData()'), tr('  SE inicio == fim ENTÃO', '  IF head == tail THEN'), tr('    inicio ← nulo', '    head ← null'), tr('    fim ← nulo', '    tail ← null'), tr('  SENÃO', '  ELSE'), tr('    atual ← inicio', '    current ← head'), tr('    ENQUANTO atual.getProxNo() != fim FAÇA', '    WHILE current.getNextNode() != tail DO'), tr('      atual ← atual.getProxNo()', '      current ← current.getNextNode()'), tr('    FIM ENQUANTO', '    END WHILE'), tr('    fim ← atual', '    tail ← current'), tr('    atual.setProxNo(nulo)', '    current.setNextNode(null)'), tr('  FIM SE', '  END IF'), tr('  RETORNE removedItem', '  RETURN removedItem'), tr('FIM', 'END')],
  },
  {
    id: 'remove', title: tr('Remover um valor', 'Remove a value'), menuLabel: 'remove()', group: tr('Remoções', 'Removals'), number: '08',
    description: tr('Procure o primeiro nó com o valor informado e ajuste as referências para retirá-lo da cadeia.', 'Find the first node with the given value and adjust the references to take it out of the chain.'),
    interaction: tr('Teste removendo um valor no início, no fim, no meio e um valor que não existe.', 'Try removing a value at the start, at the end, in the middle and a value that does not exist.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso, é preciso percorrer a lista inteira procurando o valor.', 'In the worst case, the whole list has to be traversed looking for the value.') },
    pseudocode: [tr('FUNÇÃO remove(item)', 'FUNCTION remove(item)'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  anterior ← nulo', '  previous ← null'), tr('  atual ← inicio', '  current ← head'), tr('  ENQUANTO atual != nulo E atual.getDado() != item FAÇA', '  WHILE current != null AND current.getData() != item DO'), tr('    anterior ← atual', '    previous ← current'), tr('    atual ← atual.getProxNo()', '    current ← current.getNextNode()'), tr('  FIM ENQUANTO', '  END WHILE'), tr('  SE atual == nulo ENTÃO', '  IF current == null THEN'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  SE atual == inicio ENTÃO', '  IF current == head THEN'), tr('    inicio ← inicio.getProxNo()', '    head ← head.getNextNode()'), tr('    SE inicio == nulo ENTÃO', '    IF head == null THEN'), tr('      fim ← nulo', '      tail ← null'), tr('    FIM SE', '    END IF'), tr('  SENÃO', '  ELSE'), tr('    anterior.setProxNo(atual.getProxNo())', '    previous.setNextNode(current.getNextNode())'), tr('    SE atual == fim ENTÃO', '    IF current == tail THEN'), tr('      fim ← anterior', '      tail ← previous'), tr('    FIM SE', '    END IF'), tr('  FIM SE', '  END IF'), tr('  RETORNE verdadeiro', '  RETURN true'), tr('FIM', 'END')],
  },
  {
    id: 'find', title: tr('Procurar um valor', 'Search for a value'), menuLabel: 'find()', group: tr('Consultas', 'Queries'), number: '09',
    description: tr('Percorra a lista a partir do início comparando cada nó com o valor procurado.', 'Walk the list from the head, comparing each node with the searched value.'),
    interaction: tr('Procure um valor que existe e outro que não existe na lista.', 'Search for a value that exists and one that does not exist in the list.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso, é preciso comparar todos os nós da lista.', 'In the worst case, every node of the list has to be compared.') },
    pseudocode: [tr('FUNÇÃO find(item)', 'FUNCTION find(item)'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE nulo', '    RETURN null'), tr('  FIM SE', '  END IF'), tr('  atual ← inicio', '  current ← head'), tr('  ENQUANTO atual != nulo FAÇA', '  WHILE current != null DO'), tr('    SE atual.getDado() == item ENTÃO', '    IF current.getData() == item THEN'), tr('      RETORNE atual', '      RETURN current'), tr('    FIM SE', '    END IF'), tr('    atual ← atual.getProxNo()', '    current ← current.getNextNode()'), tr('  FIM ENQUANTO', '  END WHILE'), tr('  RETORNE nulo', '  RETURN null'), tr('FIM', 'END')],
  },
  {
    id: 'show', title: tr('Mostrar elementos', 'Show elements'), menuLabel: 'show()', group: tr('Consultas', 'Queries'), number: '10',
    description: tr('Percorra a lista do início até o final, exibindo o valor de cada nó visitado.', 'Walk the list from the head to the end, displaying the value of each visited node.'),
    interaction: tr('Acompanhe o atual avançando nó a nó enquanto os valores são exibidos.', 'Follow current moving node by node while the values are displayed.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Cada nó é visitado uma vez para exibir seu valor.', 'Each node is visited once to display its value.') },
    pseudocode: [tr('FUNÇÃO show()', 'FUNCTION show()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    ESCREVA "Lista vazia"', '    PRINT "Empty list"'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  atual ← inicio', '  current ← head'), tr('  ENQUANTO atual != nulo FAÇA', '  WHILE current != null DO'), tr('    ESCREVA atual.dado', '    PRINT current.data'), tr('    atual ← atual.getProxNo()', '    current ← current.getNextNode()'), tr('  FIM ENQUANTO', '  END WHILE'), tr('FIM', 'END')],
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString(locale, { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

const frame = (values, line, title, description, tone = 'neutral', extra = {}) => ({
  values: clone(values), line, title, description, tone, variables: {}, output: [], ...extra,
});

function creationSteps() {
  return [
    frame([], 0, tr('Chamando o construtor', 'Calling the constructor'), tr('ListaDinamica ld = new ListaDinamica() é executado.', 'DynamicList dl = new DynamicList() is executed.')),
    frame([], 1, tr('Iniciando início e fim', 'Initializing head and tail'), tr('início e fim recebem nulo, pois nenhum nó foi criado ainda.', 'head and tail receive null, since no node has been created yet.'), 'update', { variables: { inicio: 'nulo', fim: 'nulo' } }),
    frame([], 3, tr('Lista criada', 'List created'), tr('A lista dinâmica foi criada vazia, sem um tamanho máximo definido.', 'The dynamic list was created empty, with no maximum size defined.'), 'done', { variables: { inicio: 'nulo', fim: 'nulo' }, output: [tr('Lista dinâmica criada.', 'Dynamic list created.')] }),
  ];
}

function isEmptySteps(valores) {
  const vazia = valores.length === 0;
  return [
    frame(valores, 0, tr('Chamando isEmpty()', 'Calling isEmpty()'), tr('O algoritmo verifica se início aponta para nulo.', 'The algorithm checks whether head points to null.')),
    frame(valores, 1, tr('Comparando início com nulo', 'Comparing head with null'), tr(`inicio == nulo é ${vazia ? 'verdadeiro' : 'falso'}.`, `head == null is ${vazia ? 'true' : 'false'}.`), 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
    frame(valores, 2, tr('isEmpty() concluído', 'isEmpty() finished'), tr(`O método retorna ${vazia}.`, `The method returns ${vazia}.`), 'done', { variables: { vazia }, output: [tr(`isEmpty() retornou ${vazia}.`, `isEmpty() returned ${vazia}.`)] }),
  ];
}

function insertAtFrontSteps(valores, item) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando insertAtFront(item)', 'Calling insertAtFront(item)'), tr(`insertAtFront(${fmt(item)}) é executado.`, `insertAtFront(${fmt(item)}) is executed.`)),
    frame(valores, 1, tr('Criando o novo nó', 'Creating the new node'), tr(`novoNo armazena o valor ${fmt(item)}.`, `newNode stores the value ${fmt(item)}.`), 'reading', { variables: { item } }),
    frame(valores, 2, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: valores.length ? [0] : [], variables: { item, vazia } }),
  ];
  if (vazia) {
    const novosValores = [item];
    steps.push(frame(novosValores, 3, tr('Definindo início', 'Setting head'), tr('início passa a apontar para o novo nó.', 'head now points to the new node.'), 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 4, tr('Definindo fim', 'Setting tail'), tr('fim também passa a apontar para o novo nó.', 'tail also points to the new node.'), 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 9, tr('insertAtFront() concluído', 'insertAtFront() finished'), tr(`${fmt(item)} agora ocupa a lista inteira (início e fim).`, `${fmt(item)} now fills the whole list (head and tail).`), 'done', { foundIndices: [0], variables: { item }, output: [tr(`insertAtFront(${fmt(item)}) inseriu o valor no início.`, `insertAtFront(${fmt(item)}) inserted the value at the front.`)] }));
    return steps;
  }
  steps.push(frame(valores, 6, tr('Apontando para o antigo início', 'Pointing to the old head'), tr(`novoNo passa a apontar para o nó ${fmt(valores[0])}.`, `newNode now points to node ${fmt(valores[0])}.`), 'reading', { variables: { item, proximo: fmt(valores[0]) } }));
  const novosValores = [item, ...valores];
  steps.push(frame(novosValores, 7, tr('Atualizando o início', 'Updating the head'), tr('início passa a apontar para o novo nó.', 'head now points to the new node.'), 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
  steps.push(frame(novosValores, 9, tr('insertAtFront() concluído', 'insertAtFront() finished'), tr(`${fmt(item)} agora é o primeiro nó da lista.`, `${fmt(item)} is now the first node of the list.`), 'done', { foundIndices: [0], variables: { item }, output: [tr(`insertAtFront(${fmt(item)}) inseriu o valor no início.`, `insertAtFront(${fmt(item)}) inserted the value at the front.`)] }));
  return steps;
}

function insertAtBackSteps(valores, item) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando insertAtBack(item)', 'Calling insertAtBack(item)'), tr(`insertAtBack(${fmt(item)}) é executado.`, `insertAtBack(${fmt(item)}) is executed.`)),
    frame(valores, 1, tr('Criando o novo nó', 'Creating the new node'), tr(`novoNo armazena o valor ${fmt(item)}.`, `newNode stores the value ${fmt(item)}.`), 'reading', { variables: { item } }),
    frame(valores, 2, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: valores.length ? [valores.length - 1] : [], variables: { item, vazia } }),
  ];
  if (vazia) {
    const novosValores = [item];
    steps.push(frame(novosValores, 3, tr('Definindo início', 'Setting head'), tr('início passa a apontar para o novo nó.', 'head now points to the new node.'), 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 4, tr('Definindo fim', 'Setting tail'), tr('fim também passa a apontar para o novo nó.', 'tail also points to the new node.'), 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 9, tr('insertAtBack() concluído', 'insertAtBack() finished'), tr(`${fmt(item)} agora ocupa a lista inteira (início e fim).`, `${fmt(item)} now fills the whole list (head and tail).`), 'done', { foundIndices: [0], variables: { item }, output: [tr(`insertAtBack(${fmt(item)}) inseriu o valor no final.`, `insertAtBack(${fmt(item)}) inserted the value at the end.`)] }));
    return steps;
  }
  const ultimoIndiceAntigo = valores.length - 1;
  steps.push(frame(valores, 6, tr('Ligando o antigo fim ao novo nó', 'Linking the old tail to the new node'), tr(`fim.setProxNo(novoNo) liga o nó ${fmt(valores[ultimoIndiceAntigo])} ao novo nó.`, `tail.setNextNode(newNode) links node ${fmt(valores[ultimoIndiceAntigo])} to the new node.`), 'reading', { activeIndices: [ultimoIndiceAntigo], variables: { item } }));
  const novosValores = [...valores, item];
  const novoIndice = novosValores.length - 1;
  steps.push(frame(novosValores, 7, tr('Atualizando o fim', 'Updating the tail'), tr('fim passa a apontar para o novo nó.', 'tail now points to the new node.'), 'update', { activeIndices: [ultimoIndiceAntigo, novoIndice], changedIndices: [novoIndice], variables: { item } }));
  steps.push(frame(novosValores, 9, tr('insertAtBack() concluído', 'insertAtBack() finished'), tr(`${fmt(item)} agora é o último nó da lista.`, `${fmt(item)} is now the last node of the list.`), 'done', { foundIndices: [novoIndice], variables: { item }, output: [tr(`insertAtBack(${fmt(item)}) inseriu o valor no final.`, `insertAtBack(${fmt(item)}) inserted the value at the end.`)] }));
  return steps;
}

function insertAtPositionSteps(valores, item, posicao) {
  const steps = [frame(valores, 0, tr('Chamando insertAtPosition(item, posição)', 'Calling insertAtPosition(item, position)'), tr(`insertAtPosition(${fmt(item)}, ${posicao}) é executado.`, `insertAtPosition(${fmt(item)}, ${posicao}) is executed.`))];

  if (!Number.isInteger(posicao) || posicao < 0) {
    steps.push(frame(valores, 1, tr('Verificando a posição', 'Checking the position'), tr('posição < 0 é verdadeiro.', 'position < 0 is true.'), 'comparison', { variables: { posicao } }));
    steps.push(frame(valores, 2, tr('Posição inválida', 'Invalid position'), tr('A posição informada é negativa; o método retorna falso.', 'The given position is negative; the method returns false.'), 'warning', { output: [tr('insertAtPosition() retornou false (posição inválida).', 'insertAtPosition() returned false (invalid position).')] }));
    steps.push(frame(valores, 24, tr('insertAtPosition() concluído', 'insertAtPosition() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr('insertAtPosition() retornou false (posição inválida).', 'insertAtPosition() returned false (invalid position).')] }));
    return steps;
  }
  steps.push(frame(valores, 1, tr('Verificando a posição', 'Checking the position'), tr('posição < 0 é falso.', 'position < 0 is false.'), 'comparison', { variables: { posicao } }));

  if (posicao === 0) {
    steps.push(frame(valores, 4, tr('Posição igual a zero', 'Position equal to zero'), tr('insertAtPosition delega para insertAtFront(item).', 'insertAtPosition delegates to insertAtFront(item).'), 'reading', { variables: { item, posicao } }));
    const novosValores = [item, ...valores];
    steps.push(frame(novosValores, 5, tr('Executando insertAtFront', 'Executing insertAtFront'), tr(`${fmt(item)} passa a ser o novo início da lista.`, `${fmt(item)} becomes the new head of the list.`), 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 24, tr('insertAtPosition() concluído', 'insertAtPosition() finished'), tr('O algoritmo retorna verdadeiro.', 'The algorithm returns true.'), 'done', { foundIndices: [0], variables: { item, posicao }, output: [tr(`insertAtPosition(${fmt(item)}, 0) inseriu o valor no início.`, `insertAtPosition(${fmt(item)}, 0) inserted the value at the front.`)] }));
    return steps;
  }

  steps.push(frame(valores, 8, tr('Criando o novo nó', 'Creating the new node'), tr(`novoNo armazena o valor ${fmt(item)}.`, `newNode stores the value ${fmt(item)}.`), 'reading', { variables: { item } }));
  steps.push(frame(valores, 9, tr('Iniciando o atual', 'Initializing current'), tr(`atual recebe início (${valores.length ? fmt(valores[0]) : 'nulo'}).`, `current receives head (${valores.length ? fmt(valores[0]) : 'null'}).`), 'update', { activeIndices: valores.length ? [0] : [], variables: { item, indice: 0, atual: valores.length ? fmt(valores[0]) : 'nulo' } }));
  steps.push(frame(valores, 10, tr('Iniciando o índice', 'Initializing the index'), tr('índice recebe 0.', 'index receives 0.'), 'update', { activeIndices: valores.length ? [0] : [], variables: { item, indice: 0, atual: valores.length ? fmt(valores[0]) : 'nulo' } }));

  let atualIndex = 0;
  let indice = 0;
  while (atualIndex < valores.length && indice < posicao - 1) {
    steps.push(frame(valores, 11, tr('Verificando a condição do laço', 'Checking the loop condition'), tr(`atual != nulo e índice (${indice}) < posição - 1 (${posicao - 1}) é verdadeiro.`, `current != null and index (${indice}) < position - 1 (${posicao - 1}) is true.`), 'comparison', { activeIndices: [atualIndex], variables: { item, indice, atual: fmt(valores[atualIndex]) } }));
    atualIndex += 1;
    indice += 1;
    const atualDesc = atualIndex < valores.length ? fmt(valores[atualIndex]) : 'nulo';
    steps.push(frame(valores, 12, tr('Avançando o atual', 'Advancing current'), tr(`atual passa a apontar para ${atualDesc === 'nulo' ? 'nulo' : `o nó ${atualDesc}`}.`, `current now points to ${atualDesc === 'nulo' ? 'null' : `node ${atualDesc}`}.`), 'update', { activeIndices: atualIndex < valores.length ? [atualIndex] : [], variables: { item, indice, atual: atualDesc } }));
  }
  const atualNulo = atualIndex >= valores.length;
  steps.push(frame(valores, 11, tr('Verificando a condição do laço', 'Checking the loop condition'), atualNulo ? tr('atual chegou a nulo; a condição é falsa.', 'current reached null; the condition is false.') : tr(`atual aponta para ${fmt(valores[atualIndex])}; a condição é falsa.`, `current points to ${fmt(valores[atualIndex])}; the condition is false.`), 'comparison', { activeIndices: atualNulo ? [] : [atualIndex], variables: { item, indice, atual: atualNulo ? 'nulo' : fmt(valores[atualIndex]) } }));

  if (atualNulo) {
    steps.push(frame(valores, 16, tr('Posição inválida', 'Invalid position'), tr('atual chegou a nulo antes de alcançar a posição desejada; o método retorna falso.', 'current reached null before reaching the desired position; the method returns false.'), 'warning', { output: [tr('insertAtPosition() retornou false (posição inválida).', 'insertAtPosition() returned false (invalid position).')] }));
    steps.push(frame(valores, 24, tr('insertAtPosition() concluído', 'insertAtPosition() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr('insertAtPosition() retornou false (posição inválida).', 'insertAtPosition() returned false (invalid position).')] }));
    return steps;
  }

  const novosValores = [...valores.slice(0, atualIndex + 1), item, ...valores.slice(atualIndex + 1)];
  const novoIndice = atualIndex + 1;
  steps.push(frame(novosValores, 18, tr('Ligando o novo nó ao próximo de atual', 'Linking the new node to the next of current'), tr(`novoNo passa a apontar para ${atualIndex + 1 < valores.length ? fmt(valores[atualIndex + 1]) : 'nulo'}.`, `newNode now points to ${atualIndex + 1 < valores.length ? fmt(valores[atualIndex + 1]) : 'null'}.`), 'update', { activeIndices: [novoIndice], variables: { item } }));
  steps.push(frame(novosValores, 19, tr('Ligando atual ao novo nó', 'Linking current to the new node'), tr(`atual.setProxNo(novoNo) insere o novo nó logo após ${fmt(valores[atualIndex])}.`, `current.setNextNode(newNode) inserts the new node right after ${fmt(valores[atualIndex])}.`), 'update', { activeIndices: [atualIndex, novoIndice], changedIndices: [novoIndice], variables: { item } }));
  const passouAFim = novoIndice === novosValores.length - 1;
  if (passouAFim) {
    steps.push(frame(novosValores, 21, tr('Atualizando o fim', 'Updating the tail'), tr('Como novoNo não tem próximo, fim passa a apontar para ele.', 'Since newNode has no next, tail now points to it.'), 'update', { activeIndices: [novoIndice], variables: { item } }));
  }
  steps.push(frame(novosValores, 23, tr('insertAtPosition() concluído', 'insertAtPosition() finished'), tr(`${fmt(item)} foi inserido na posição ${posicao}.`, `${fmt(item)} was inserted at position ${posicao}.`), 'done', { foundIndices: [novoIndice], variables: { item, posicao }, output: [tr(`insertAtPosition(${fmt(item)}, ${posicao}) inseriu o valor na posição ${posicao}.`, `insertAtPosition(${fmt(item)}, ${posicao}) inserted the value at position ${posicao}.`)] }));
  return steps;
}

function removeAtFrontSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando removeAtFront()', 'Calling removeAtFront()'), tr('removeAtFront() é executado.', 'removeAtFront() is executed.')),
    frame(valores, 1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Lista vazia', 'Empty list'), tr('Não há nó para remover; o método retorna -1.', 'There is no node to remove; the method returns -1.'), 'warning', { variables: { retorno: -1 }, output: [tr('removeAtFront() retornou -1 (lista vazia).', 'removeAtFront() returned -1 (empty list).')] }));
    steps.push(frame(valores, 11, tr('removeAtFront() concluído', 'removeAtFront() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { variables: { retorno: -1 }, output: [tr('removeAtFront() retornou -1 (lista vazia).', 'removeAtFront() returned -1 (empty list).')] }));
    return steps;
  }

  const removido = valores[0];
  steps.push(frame(valores, 4, tr('Guardando o dado do início', 'Saving the head data'), tr(`removItem recebe ${fmt(removido)}.`, `removedItem receives ${fmt(removido)}.`), 'reading', { activeIndices: [0], foundIndices: [0], variables: { removItem: removido } }));
  const unico = valores.length === 1;
  steps.push(frame(valores, 5, tr('Verificando se é o único nó', 'Checking whether it is the only node'), tr(`inicio == fim é ${unico}.`, `head == tail is ${unico}.`), 'comparison', { activeIndices: [0], variables: { removItem: removido, unico } }));
  const novosValores = valores.slice(1);
  if (unico) {
    steps.push(frame(novosValores, 6, tr('Esvaziando a lista', 'Emptying the list'), tr('início e fim voltam a ser nulo.', 'head and tail go back to null.'), 'update', { variables: { removItem: removido } }));
  } else {
    steps.push(frame(novosValores, 9, tr('Atualizando o início', 'Updating the head'), tr(`início passa a apontar para ${fmt(novosValores[0])}.`, `head now points to ${fmt(novosValores[0])}.`), 'update', { variables: { removItem: removido } }));
  }
  steps.push(frame(novosValores, 11, tr('removeAtFront() concluído', 'removeAtFront() finished'), tr(`O nó removido continha o valor ${fmt(removido)}.`, `The removed node held the value ${fmt(removido)}.`), 'done', { variables: { removItem: removido, retorno: removido }, output: [tr(`removeAtFront() retornou ${fmt(removido)}.`, `removeAtFront() returned ${fmt(removido)}.`)] }));
  return steps;
}

function removeAtBackSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando removeAtBack()', 'Calling removeAtBack()'), tr('removeAtBack() é executado.', 'removeAtBack() is executed.')),
    frame(valores, 1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: valores.length ? [valores.length - 1] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Lista vazia', 'Empty list'), tr('Não há nó para remover; o método retorna -1.', 'There is no node to remove; the method returns -1.'), 'warning', { variables: { retorno: -1 }, output: [tr('removeAtBack() retornou -1 (lista vazia).', 'removeAtBack() returned -1 (empty list).')] }));
    steps.push(frame(valores, 16, tr('removeAtBack() concluído', 'removeAtBack() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { variables: { retorno: -1 }, output: [tr('removeAtBack() retornou -1 (lista vazia).', 'removeAtBack() returned -1 (empty list).')] }));
    return steps;
  }

  const lastIndex = valores.length - 1;
  const removido = valores[lastIndex];
  steps.push(frame(valores, 4, tr('Guardando o dado do fim', 'Saving the tail data'), tr(`removedItem recebe ${fmt(removido)}.`, `removedItem receives ${fmt(removido)}.`), 'reading', { activeIndices: [lastIndex], foundIndices: [lastIndex], variables: { removedItem: removido } }));
  const unico = valores.length === 1;
  steps.push(frame(valores, 5, tr('Verificando se é o único nó', 'Checking whether it is the only node'), tr(`inicio == fim é ${unico}.`, `head == tail is ${unico}.`), 'comparison', { activeIndices: [lastIndex], variables: { removedItem: removido, unico } }));

  if (unico) {
    steps.push(frame([], 6, tr('Esvaziando a lista', 'Emptying the list'), tr('início e fim voltam a ser nulo.', 'head and tail go back to null.'), 'update', { variables: { removedItem: removido } }));
    steps.push(frame([], 16, tr('removeAtBack() concluído', 'removeAtBack() finished'), tr(`O nó removido continha o valor ${fmt(removido)}.`, `The removed node held the value ${fmt(removido)}.`), 'done', { variables: { removedItem: removido, retorno: removido }, output: [tr(`removeAtBack() retornou ${fmt(removido)}.`, `removeAtBack() returned ${fmt(removido)}.`)] }));
    return steps;
  }

  steps.push(frame(valores, 9, tr('Iniciando o atual', 'Initializing current'), tr(`atual recebe início (${fmt(valores[0])}).`, `current receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0], variables: { removedItem: removido, atual: fmt(valores[0]) } }));
  for (let i = 0; i < lastIndex - 1; i += 1) {
    steps.push(frame(valores, 10, tr('Verificando atual.getProxNo() != fim', 'Checking current.getNextNode() != tail'), tr(`o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de fim; a condição é verdadeira.`, `the next of ${fmt(valores[i])} is ${fmt(valores[i + 1])}, different from tail; the condition is true.`), 'comparison', { activeIndices: [i], variables: { removedItem: removido, atual: fmt(valores[i]) } }));
    steps.push(frame(valores, 11, tr('Avançando o atual', 'Advancing current'), tr(`atual passa a apontar para ${fmt(valores[i + 1])}.`, `current now points to ${fmt(valores[i + 1])}.`), 'update', { activeIndices: [i + 1], variables: { removedItem: removido, atual: fmt(valores[i + 1]) } }));
  }
  steps.push(frame(valores, 10, tr('Verificando atual.getProxNo() != fim', 'Checking current.getNextNode() != tail'), tr(`o próximo de ${fmt(valores[lastIndex - 1])} é o próprio fim; a condição é falsa.`, `the next of ${fmt(valores[lastIndex - 1])} is the tail itself; the condition is false.`), 'comparison', { activeIndices: [lastIndex - 1], variables: { removedItem: removido, atual: fmt(valores[lastIndex - 1]) } }));

  const novosValores = valores.slice(0, lastIndex);
  steps.push(frame(novosValores, 13, tr('Atualizando o fim', 'Updating the tail'), tr(`fim passa a apontar para ${fmt(valores[lastIndex - 1])}.`, `tail now points to ${fmt(valores[lastIndex - 1])}.`), 'update', { activeIndices: [lastIndex - 1], variables: { removedItem: removido } }));
  steps.push(frame(novosValores, 14, tr('Removendo a referência antiga', 'Removing the old reference'), tr('O novo fim passa a apontar para nulo.', 'The new tail now points to null.'), 'update', { activeIndices: [lastIndex - 1], changedIndices: [lastIndex - 1], variables: { removedItem: removido } }));
  steps.push(frame(novosValores, 16, tr('removeAtBack() concluído', 'removeAtBack() finished'), tr(`O nó removido continha o valor ${fmt(removido)}.`, `The removed node held the value ${fmt(removido)}.`), 'done', { variables: { removedItem: removido, retorno: removido }, output: [tr(`removeAtBack() retornou ${fmt(removido)}.`, `removeAtBack() returned ${fmt(removido)}.`)] }));
  return steps;
}

function removeSteps(valores, item) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando remove(item)', 'Calling remove(item)'), tr(`remove(${fmt(item)}) é executado.`, `remove(${fmt(item)}) is executed.`)),
    frame(valores, 1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { item, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Lista vazia', 'Empty list'), tr('Não há nó para remover; o método retorna falso.', 'There is no node to remove; the method returns false.'), 'warning', { output: [tr(`remove(${fmt(item)}) retornou false (lista vazia).`, `remove(${fmt(item)}) returned false (empty list).`)] }));
    steps.push(frame(valores, 25, tr('remove() concluído', 'remove() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr(`remove(${fmt(item)}) retornou false (lista vazia).`, `remove(${fmt(item)}) returned false (empty list).`)] }));
    return steps;
  }

  steps.push(frame(valores, 4, tr('Iniciando anterior e atual', 'Initializing previous and current'), tr('anterior recebe nulo; atual recebe início.', 'previous receives null; current receives head.'), 'update', { activeIndices: [0], variables: { item, anterior: 'nulo', atual: fmt(valores[0]) } }));

  let atualIndex = 0;
  let anteriorIndex = -1;
  while (atualIndex < valores.length && valores[atualIndex] !== item) {
    steps.push(frame(valores, 6, tr('Verificando a condição do laço', 'Checking the loop condition'), tr(`atual != nulo e atual.getDado() (${fmt(valores[atualIndex])}) != item (${fmt(item)}) é verdadeiro.`, `current != null and current.getData() (${fmt(valores[atualIndex])}) != item (${fmt(item)}) is true.`), 'comparison', { activeIndices: [atualIndex], variables: { item, anterior: anteriorIndex >= 0 ? fmt(valores[anteriorIndex]) : 'nulo', atual: fmt(valores[atualIndex]) } }));
    anteriorIndex = atualIndex;
    atualIndex += 1;
    const atualDesc = atualIndex < valores.length ? fmt(valores[atualIndex]) : 'nulo';
    steps.push(frame(valores, 8, tr('Avançando anterior e atual', 'Advancing previous and current'), tr(`anterior passa a ${fmt(valores[anteriorIndex])}; atual passa a ${atualDesc}.`, `previous becomes ${fmt(valores[anteriorIndex])}; current becomes ${atualDesc === 'nulo' ? 'null' : atualDesc}.`), 'update', { activeIndices: atualIndex < valores.length ? [anteriorIndex, atualIndex] : [anteriorIndex], variables: { item, anterior: fmt(valores[anteriorIndex]), atual: atualDesc } }));
  }

  const encontrado = atualIndex < valores.length;
  steps.push(frame(valores, 6, tr('Verificando a condição do laço', 'Checking the loop condition'), encontrado ? tr(`atual.getDado() (${fmt(valores[atualIndex])}) == item; a condição é falsa (encontrado).`, `current.getData() (${fmt(valores[atualIndex])}) == item; the condition is false (found).`) : tr('atual chegou a nulo; a condição é falsa.', 'current reached null; the condition is false.'), 'comparison', { activeIndices: encontrado ? [atualIndex] : [], variables: { item, anterior: anteriorIndex >= 0 ? fmt(valores[anteriorIndex]) : 'nulo', atual: encontrado ? fmt(valores[atualIndex]) : 'nulo' } }));

  if (!encontrado) {
    steps.push(frame(valores, 11, tr('Item não encontrado', 'Item not found'), tr('atual é nulo; o método retorna falso.', 'current is null; the method returns false.'), 'warning', { output: [tr(`remove(${fmt(item)}) retornou false (item não encontrado).`, `remove(${fmt(item)}) returned false (item not found).`)] }));
    steps.push(frame(valores, 25, tr('remove() concluído', 'remove() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr(`remove(${fmt(item)}) retornou false (item não encontrado).`, `remove(${fmt(item)}) returned false (item not found).`)] }));
    return steps;
  }

  const ehInicio = atualIndex === 0;
  steps.push(frame(valores, 13, tr('Verificando se atual é o início', 'Checking whether current is the head'), tr(`atual == inicio é ${ehInicio}.`, `current == head is ${ehInicio}.`), 'comparison', { activeIndices: [atualIndex], variables: { item, atual: fmt(valores[atualIndex]) } }));
  const novosValores = [...valores.slice(0, atualIndex), ...valores.slice(atualIndex + 1)];

  if (ehInicio) {
    steps.push(frame(novosValores, 14, tr('Atualizando o início', 'Updating the head'), tr(`início passa a apontar para ${novosValores.length ? fmt(novosValores[0]) : 'nulo'}.`, `head now points to ${novosValores.length ? fmt(novosValores[0]) : 'null'}.`), 'update', { variables: { item } }));
    if (novosValores.length === 0) {
      steps.push(frame(novosValores, 16, tr('Lista ficou vazia', 'The list became empty'), tr('Como início ficou nulo, fim também volta a ser nulo.', 'Since head became null, tail also goes back to null.'), 'update', { variables: { item } }));
    }
  } else {
    steps.push(frame(valores, 19, tr('Ligando anterior ao próximo de atual', 'Linking previous to the next of current'), tr(`anterior.setProxNo(atual.getProxNo()) remove ${fmt(valores[atualIndex])} da cadeia.`, `previous.setNextNode(current.getNextNode()) removes ${fmt(valores[atualIndex])} from the chain.`), 'update', { activeIndices: [anteriorIndex, atualIndex], changedIndices: [anteriorIndex], variables: { item } }));
    const eraFim = atualIndex === valores.length - 1;
    steps.push(frame(novosValores, 20, tr('Verificando se atual era o fim', 'Checking whether current was the tail'), tr(`atual == fim é ${eraFim}.`, `current == tail is ${eraFim}.`), 'comparison', { variables: { item } }));
    if (eraFim) {
      steps.push(frame(novosValores, 21, tr('Atualizando o fim', 'Updating the tail'), tr('fim passa a apontar para anterior.', 'tail now points to previous.'), 'update', { variables: { item } }));
    }
  }

  steps.push(frame(novosValores, 24, tr('Retornando verdadeiro', 'Returning true'), tr(`O nó com valor ${fmt(item)} foi removido da lista.`, `The node with value ${fmt(item)} was removed from the list.`), 'success', { variables: { item }, output: [tr(`remove(${fmt(item)}) removeu o valor.`, `remove(${fmt(item)}) removed the value.`)] }));
  steps.push(frame(novosValores, 25, tr('remove() concluído', 'remove() finished'), tr('A lista foi ajustada corretamente.', 'The list was adjusted correctly.'), 'done', { variables: { item }, output: [tr(`remove(${fmt(item)}) removeu o valor.`, `remove(${fmt(item)}) removed the value.`)] }));
  return steps;
}

function findSteps(valores, item) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando find(item)', 'Calling find(item)'), tr(`find(${fmt(item)}) é executado.`, `find(${fmt(item)}) is executed.`)),
    frame(valores, 1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { item, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Lista vazia', 'Empty list'), tr('Não há nó para procurar; o método retorna nulo.', 'There is no node to search; the method returns null.'), 'warning', { output: [tr(`find(${fmt(item)}) retornou nulo (lista vazia).`, `find(${fmt(item)}) returned null (empty list).`)] }));
    steps.push(frame(valores, 11, tr('find() concluído', 'find() finished'), tr('A lista continua exatamente igual.', 'The list stays exactly the same.'), 'done', { output: [tr(`find(${fmt(item)}) retornou nulo (lista vazia).`, `find(${fmt(item)}) returned null (empty list).`)] }));
    return steps;
  }

  steps.push(frame(valores, 4, tr('Iniciando o atual', 'Initializing current'), tr(`atual recebe início (${fmt(valores[0])}).`, `current receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0], variables: { item, atual: fmt(valores[0]) } }));
  for (let i = 0; i < valores.length; i += 1) {
    steps.push(frame(valores, 5, tr('Verificando atual != nulo', 'Checking current != null'), tr(`atual aponta para ${fmt(valores[i])}; a condição é verdadeira.`, `current points to ${fmt(valores[i])}; the condition is true.`), 'comparison', { activeIndices: [i], variables: { item, atual: fmt(valores[i]) } }));
    const igual = valores[i] === item;
    steps.push(frame(valores, 6, tr('Comparando o dado', 'Comparing the data'), tr(`atual.getDado() (${fmt(valores[i])}) == item (${fmt(item)}) é ${igual}.`, `current.getData() (${fmt(valores[i])}) == item (${fmt(item)}) is ${igual}.`), 'comparison', { activeIndices: [i], comparedIndices: [i], variables: { item, atual: fmt(valores[i]) } }));
    if (igual) {
      steps.push(frame(valores, 7, tr('Item encontrado', 'Item found'), tr(`find(${fmt(item)}) retorna o nó ${fmt(valores[i])}.`, `find(${fmt(item)}) returns node ${fmt(valores[i])}.`), 'success', { foundIndices: [i], variables: { item, atual: fmt(valores[i]) }, output: [tr(`find(${fmt(item)}) encontrou o valor na posição ${i}.`, `find(${fmt(item)}) found the value at position ${i}.`)] }));
      steps.push(frame(valores, 11, tr('find() concluído', 'find() finished'), tr('A lista continua exatamente igual.', 'The list stays exactly the same.'), 'done', { foundIndices: [i], variables: { item }, output: [tr(`find(${fmt(item)}) encontrou o valor na posição ${i}.`, `find(${fmt(item)}) found the value at position ${i}.`)] }));
      return steps;
    }
    const proximo = i + 1 < valores.length ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 9, tr('Avançando o atual', 'Advancing current'), tr(`atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, `current now points to ${proximo === 'nulo' ? 'null' : `node ${proximo}`}.`), 'update', { activeIndices: i + 1 < valores.length ? [i + 1] : [], variables: { item, atual: proximo } }));
  }
  steps.push(frame(valores, 5, tr('Verificando atual != nulo', 'Checking current != null'), tr('atual chegou a nulo; a condição é falsa.', 'current reached null; the condition is false.'), 'comparison', { variables: { item, atual: 'nulo' } }));
  steps.push(frame(valores, 10, tr('Item não encontrado', 'Item not found'), tr(`atual chegou a nulo; find(${fmt(item)}) retorna nulo.`, `current reached null; find(${fmt(item)}) returns null.`), 'warning', { output: [tr(`find(${fmt(item)}) retornou nulo (não encontrado).`, `find(${fmt(item)}) returned null (not found).`)] }));
  steps.push(frame(valores, 11, tr('find() concluído', 'find() finished'), tr('A lista continua exatamente igual.', 'The list stays exactly the same.'), 'done', { output: [tr(`find(${fmt(item)}) retornou nulo (não encontrado).`, `find(${fmt(item)}) returned null (not found).`)] }));
  return steps;
}

function showSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando show()', 'Calling show()'), tr('show() é executado.', 'show() is executed.')),
    frame(valores, 1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Lista vazia', 'Empty list'), tr('O método exibe a mensagem "Lista vazia".', 'The method displays the message "Empty list".'), 'warning', { output: [tr('show() exibiu "Lista vazia".', 'show() displayed "Empty list".')] }));
    steps.push(frame(valores, 3, tr('show() concluído', 'show() finished'), tr('A execução termina sem percorrer a lista.', 'The execution ends without traversing the list.'), 'done', { output: [tr('show() exibiu "Lista vazia".', 'show() displayed "Empty list".')] }));
    return steps;
  }

  const tamanho = valores.length;
  steps.push(frame(valores, 5, tr('Iniciando o atual', 'Initializing current'), tr(`atual recebe início (${fmt(valores[0])}).`, `current receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0], variables: { atual: fmt(valores[0]) } }));
  let texto = '';
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 6, tr('Verificando atual != nulo', 'Checking current != null'), tr(`atual aponta para ${fmt(valores[i])}; a condição é verdadeira.`, `current points to ${fmt(valores[i])}; the condition is true.`), 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { atual: fmt(valores[i]), saida: texto } }));
    texto += `${fmt(valores[i])} `;
    steps.push(frame(valores, 7, tr('Exibindo o valor', 'Displaying the value'), tr(`ESCREVA atual.dado exibe ${fmt(valores[i])}.`, `PRINT current.data displays ${fmt(valores[i])}.`), 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { atual: fmt(valores[i]), saida: texto } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 8, tr('Avançando o atual', 'Advancing current'), tr(`atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, `current now points to ${proximo === 'nulo' ? 'null' : `node ${proximo}`}.`), 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], processedIndices: range(i + 1), variables: { atual: proximo, saida: texto } }));
  }
  steps.push(frame(valores, 6, tr('Verificando atual != nulo', 'Checking current != null'), tr('atual chegou a nulo; a condição é falsa.', 'current reached null; the condition is false.'), 'comparison', { processedIndices: range(tamanho), variables: { atual: 'nulo', saida: texto } }));
  steps.push(frame(valores, 10, tr('show() concluído', 'show() finished'), tr(`show() exibiu: ${texto.trim()}`, `show() displayed: ${texto.trim()}`), 'done', { processedIndices: range(tamanho), variables: { saida: texto }, output: [tr(`show() exibiu: ${texto.trim()}`, `show() displayed: ${texto.trim()}`)] }));
  return steps;
}

export function buildSteps(id, data, config) {
  const { values } = data;
  switch (id) {
    case 'creation': return creationSteps();
    case 'isEmpty': return isEmptySteps(values);
    case 'insertAtFront': return insertAtFrontSteps(values, config.item);
    case 'insertAtBack': return insertAtBackSteps(values, config.item);
    case 'insertAtPosition': return insertAtPositionSteps(values, config.item, config.position);
    case 'removeAtFront': return removeAtFrontSteps(values);
    case 'removeAtBack': return removeAtBackSteps(values);
    case 'remove': return removeSteps(values, config.item);
    case 'find': return findSteps(values, config.item);
    case 'show': return showSteps(values);
    default: return creationSteps();
  }
}
