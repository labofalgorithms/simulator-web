import { extendVariableNames, locale, tr } from '../../core/i18n.js';

extendVariableNames({ inicio: 'front' });

export const algorithms = [
  {
    id: 'creation', title: tr('Criação da fila dinâmica', 'Dynamic queue creation'), menuLabel: tr('Criação da fila', 'Queue creation'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Veja como início e fim são iniciados apontando para nulo, sem alocar um vetor.', 'See how front and rear start pointing to null, without allocating an array.'),
    interaction: tr('Observe que não existe capacidade máxima: a fila começa vazia e cresce sob demanda.', 'Notice that there is no maximum capacity: the queue starts empty and grows on demand.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Nenhuma estrutura é alocada antecipadamente; apenas as referências início e fim são criadas.', 'No structure is allocated in advance; only the front and rear references are created.') },
    pseudocode: [tr('CONSTRUTOR FilaDinamica()', 'CONSTRUCTOR DynamicQueue()'), tr('  inicio ← nulo', '  front ← null'), tr('  fim ← nulo', '  rear ← null'), tr('FIM', 'END')],
  },
  {
    id: 'isEmpty', title: tr('Verificar se está vazia', 'Check if it is empty'), menuLabel: 'isEmpty()', group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Compare o atributo início com nulo.', 'Compare the front attribute with null.'),
    interaction: tr('Esvazie a fila para ver o retorno mudar para verdadeiro.', 'Empty the queue to see the result turn true.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas uma comparação é realizada.', 'Only one comparison is made.') },
    pseudocode: [tr('FUNÇÃO isEmpty()', 'FUNCTION isEmpty()'), tr('  SE inicio == nulo ENTÃO', '  IF front == null THEN'), tr('    RETORNE verdadeiro', '    RETURN true'), tr('  SENÃO', '  ELSE'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'enqueue', title: tr('Inserir um elemento', 'Enqueue an element'), menuLabel: 'enqueue()', group: tr('Operações', 'Operations'), number: '03',
    description: tr('Crie um novo nó e ligue-o ao final da fila, atualizando fim (e início, se a fila estava vazia).', 'Create a new node and link it to the end of the queue, updating rear (and front, if the queue was empty).'),
    interaction: tr('Escolha o valor a inserir. Não existe verificação de fila cheia: a fila sempre cresce.', 'Choose the value to insert. There is no full-queue check: the queue always grows.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O novo nó é ligado diretamente ao fim, sem percorrer a fila.', 'The new node is linked directly to the rear, without traversing the queue.') },
    pseudocode: [tr('FUNÇÃO enqueue(dd)', 'FUNCTION enqueue(data)'), tr('  novoNo ← novo No(dd)', '  newNode ← new Node(data)'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    inicio ← novoNo', '    front ← newNode'), tr('    fim ← novoNo', '    rear ← newNode'), tr('  SENÃO', '  ELSE'), tr('    fim.setProximoNo(novoNo)', '    rear.setNextNode(newNode)'), tr('    fim ← novoNo', '    rear ← newNode'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'dequeue', title: tr('Remover um elemento', 'Dequeue an element'), menuLabel: 'dequeue()', group: tr('Operações', 'Operations'), number: '04',
    description: tr('Guarde o nó do início, avance início para o próximo nó e retorne o valor guardado.', 'Save the front node, move front to the next node and return the saved value.'),
    interaction: tr('Desenfileire até o último elemento e observe início e fim voltarem a nulo.', 'Dequeue down to the last element and watch front and rear go back to null.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas a referência início é atualizada; nenhum outro nó é percorrido.', 'Only the front reference is updated; no other node is traversed.') },
    pseudocode: [tr('FUNÇÃO dequeue()', 'FUNCTION dequeue()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('  temp ← inicio', '  temp ← front'), tr('  inicio ← inicio.getProximoNo()', '  front ← front.getNextNode()'), tr('  SE inicio == nulo ENTÃO', '  IF front == null THEN'), tr('    fim ← nulo', '    rear ← null'), tr('  FIM SE', '  END IF'), tr('  RETORNE temp.getValor()', '  RETURN temp.getValue()'), tr('FIM', 'END')],
  },
  {
    id: 'peek', title: tr('Consultar o início', 'Peek at the front'), menuLabel: 'peek()', group: tr('Operações', 'Operations'), number: '05',
    description: tr('Leia o valor do nó do início sem removê-lo.', 'Read the value of the front node without removing it.'),
    interaction: tr('Compare o resultado de peek() com o de dequeue(): o valor é igual, mas a fila não muda.', 'Compare the result of peek() with that of dequeue(): the value is the same, but the queue does not change.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O valor é lido diretamente do nó apontado por início.', 'The value is read directly from the node pointed to by front.') },
    pseudocode: [tr('FUNÇÃO peek()', 'FUNCTION peek()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('  RETORNE inicio.getValor()', '  RETURN front.getValue()'), tr('FIM', 'END')],
  },
  {
    id: 'size', title: tr('Tamanho da fila', 'Queue size'), menuLabel: 'size()', group: tr('Consultas', 'Queries'), number: '06',
    description: tr('Percorra a fila nó por nó, a partir do início, contando quantos elementos existem.', 'Walk the queue node by node, starting at the front, counting how many elements there are.'),
    interaction: tr('Acompanhe o atual avançando de nó em nó até chegar a nulo.', 'Follow current moving from node to node until it reaches null.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Como não existe um atributo de tamanho, é preciso percorrer todos os nós.', 'Since there is no size attribute, every node has to be traversed.') },
    pseudocode: [tr('FUNÇÃO size()', 'FUNCTION size()'), tr('  contador ← 0', '  counter ← 0'), tr('  atual ← inicio', '  current ← front'), tr('  ENQUANTO atual != nulo FAÇA', '  WHILE current != null DO'), tr('    contador ← contador + 1', '    counter ← counter + 1'), tr('    atual ← atual.getProximoNo()', '    current ← current.getNextNode()'), tr('  FIM ENQUANTO', '  END WHILE'), tr('  RETORNE contador', '  RETURN counter'), tr('FIM', 'END')],
  },
  {
    id: 'show', title: tr('Mostrar elementos', 'Show elements'), menuLabel: 'show()', group: tr('Consultas', 'Queries'), number: '07',
    description: tr('Percorra a fila do início até o fim, concatenando os valores encontrados.', 'Walk the queue from the front to the rear, concatenating the values found.'),
    interaction: tr('Acompanhe o atual avançando nó a nó enquanto a saída é montada.', 'Follow current moving node by node while the output is built.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('Cada nó é visitado uma vez para montar o texto de saída.', 'Each node is visited once to build the output text.') },
    pseudocode: [tr('FUNÇÃO show()', 'FUNCTION show()'), tr('  saida ← ""', '  output ← ""'), tr('  atual ← inicio', '  current ← front'), tr('  ENQUANTO atual != nulo FAÇA', '  WHILE current != null DO'), tr('    saida ← saida + atual.getValor() + " "', '    output ← output + current.getValue() + " "'), tr('    atual ← atual.getProximoNo()', '    current ← current.getNextNode()'), tr('  FIM ENQUANTO', '  END WHILE'), tr('  RETORNE saida', '  RETURN output'), tr('FIM', 'END')],
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
    frame([], 0, tr('Chamando o construtor', 'Calling the constructor'), tr('FilaDinamica fd = new FilaDinamica() é executado.', 'DynamicQueue dq = new DynamicQueue() is executed.')),
    frame([], 1, tr('Iniciando início e fim', 'Initializing front and rear'), tr('início e fim recebem nulo, pois nenhum nó foi criado ainda.', 'front and rear receive null, since no node has been created yet.'), 'update', { variables: { inicio: 'nulo', fim: 'nulo' } }),
    frame([], 3, tr('Fila criada', 'Queue created'), tr('A fila dinâmica foi criada vazia, sem um tamanho máximo definido.', 'The dynamic queue was created empty, with no maximum size defined.'), 'done', { variables: { inicio: 'nulo', fim: 'nulo' }, output: [tr('Fila dinâmica criada.', 'Dynamic queue created.')] }),
  ];
}

function isEmptySteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando isEmpty()', 'Calling isEmpty()'), tr('O algoritmo verifica se início aponta para nulo.', 'The algorithm checks whether front points to null.')),
    frame(valores, 1, tr('Comparando início com nulo', 'Comparing front with null'), tr(`inicio == nulo é ${vazia ? 'verdadeiro' : 'falso'}.`, `front == null is ${vazia ? 'true' : 'false'}.`), 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Retornando verdadeiro', 'Returning true'), tr('A fila não possui elementos.', 'The queue has no elements.'), 'success', { variables: { vazia: true } }));
  } else {
    steps.push(frame(valores, 4, tr('Retornando falso', 'Returning false'), tr('Existe pelo menos um elemento na fila.', 'There is at least one element in the queue.'), 'neutral', { variables: { vazia: false } }));
  }
  steps.push(frame(valores, 6, tr('isEmpty() concluído', 'isEmpty() finished'), tr(`O método retorna ${vazia}.`, `The method returns ${vazia}.`), 'done', { variables: { vazia }, output: [tr(`isEmpty() retornou ${vazia}.`, `isEmpty() returned ${vazia}.`)] }));
  return steps;
}

function enqueueSteps(valores, dado) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando enqueue(dd)', 'Calling enqueue(data)'), tr(`enqueue(${fmt(dado)}) é executado.`, `enqueue(${fmt(dado)}) is executed.`)),
    frame(valores, 1, tr('Criando o novo nó', 'Creating the new node'), tr(`novoNo armazena o valor ${fmt(dado)}.`, `newNode stores the value ${fmt(dado)}.`), 'reading', { variables: { dado } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Verificando se a fila está vazia', 'Checking whether the queue is empty'), tr('isEmpty() retorna verdadeiro.', 'isEmpty() returns true.'), 'comparison', { variables: { dado, vazia: true } }));
    const novosValores = [dado];
    steps.push(frame(novosValores, 3, tr('Definindo início', 'Setting front'), tr('início passa a apontar para o novo nó.', 'front now points to the new node.'), 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
    steps.push(frame(novosValores, 4, tr('Definindo fim', 'Setting rear'), tr('fim também passa a apontar para o novo nó.', 'rear also points to the new node.'), 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
    steps.push(frame(novosValores, 9, tr('enqueue() concluído', 'enqueue() finished'), tr(`${fmt(dado)} agora ocupa a fila inteira (início e fim).`, `${fmt(dado)} now fills the whole queue (front and rear).`), 'done', { foundIndices: [0], variables: { dado }, output: [tr(`enqueue(${fmt(dado)}) inseriu o valor no final da fila.`, `enqueue(${fmt(dado)}) inserted the value at the end of the queue.`)] }));
    return steps;
  }

  const ultimoIndiceAntigo = valores.length - 1;
  steps.push(frame(valores, 2, tr('Verificando se a fila está vazia', 'Checking whether the queue is empty'), tr('isEmpty() retorna falso.', 'isEmpty() returns false.'), 'comparison', { activeIndices: [ultimoIndiceAntigo], variables: { dado, vazia: false } }));
  const novosValores = [...valores, dado];
  const novoIndice = novosValores.length - 1;
  steps.push(frame(novosValores, 6, tr('Ligando o antigo fim ao novo nó', 'Linking the old rear to the new node'), tr(`fim.setProximoNo(novoNo) liga o nó ${fmt(valores[ultimoIndiceAntigo])} ao novo nó.`, `rear.setNextNode(newNode) links node ${fmt(valores[ultimoIndiceAntigo])} to the new node.`), 'update', { activeIndices: [ultimoIndiceAntigo, novoIndice], changedIndices: [ultimoIndiceAntigo], variables: { dado } }));
  steps.push(frame(novosValores, 7, tr('Atualizando o fim', 'Updating the rear'), tr('fim passa a apontar para o novo nó.', 'rear now points to the new node.'), 'update', { activeIndices: [novoIndice], changedIndices: [novoIndice], variables: { dado } }));
  steps.push(frame(novosValores, 9, tr('enqueue() concluído', 'enqueue() finished'), tr(`${fmt(dado)} agora ocupa o final da fila.`, `${fmt(dado)} now occupies the end of the queue.`), 'done', { foundIndices: [novoIndice], variables: { dado }, output: [tr(`enqueue(${fmt(dado)}) inseriu o valor no final da fila.`, `enqueue(${fmt(dado)}) inserted the value at the end of the queue.`)] }));
  return steps;
}

function dequeueSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando dequeue()', 'Calling dequeue()'), tr('dequeue() é executado.', 'dequeue() is executed.')),
    frame(valores, 1, tr('Verificando se a fila está vazia', 'Checking whether the queue is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Fila vazia', 'Empty queue'), tr('Não há nó para remover; o método retorna -1.', 'There is no node to remove; the method returns -1.'), 'warning', { variables: { retorno: -1 }, output: [tr('dequeue() retornou -1 (fila vazia).', 'dequeue() returned -1 (empty queue).')] }));
    steps.push(frame(valores, 10, tr('dequeue() concluído', 'dequeue() finished'), tr('O algoritmo termina sem alterar a fila.', 'The algorithm ends without changing the queue.'), 'done', { variables: { retorno: -1 }, output: [tr('dequeue() retornou -1 (fila vazia).', 'dequeue() returned -1 (empty queue).')] }));
    return steps;
  }

  const valorRemovido = valores[0];
  steps.push(frame(valores, 4, tr('Guardando o nó do início', 'Saving the front node'), tr(`temp recebe o nó que contém ${fmt(valorRemovido)}.`, `temp receives the node that holds ${fmt(valorRemovido)}.`), 'reading', { activeIndices: [0], foundIndices: [0], variables: { temp: valorRemovido } }));
  const novosValores = valores.slice(1);
  steps.push(frame(novosValores, 5, tr('Atualizando o início', 'Updating the front'), tr(`início passa a apontar para ${novosValores.length ? `o nó ${fmt(novosValores[0])}` : 'nulo'}.`, `front now points to ${novosValores.length ? `node ${fmt(novosValores[0])}` : 'null'}.`), 'update', { variables: { temp: valorRemovido } }));

  const ficouVazia = novosValores.length === 0;
  steps.push(frame(novosValores, 6, tr('Verificando se a fila ficou vazia', 'Checking whether the queue became empty'), tr(`inicio == nulo é ${ficouVazia}.`, `front == null is ${ficouVazia}.`), 'comparison', { variables: { temp: valorRemovido, vazia: ficouVazia } }));
  if (ficouVazia) {
    steps.push(frame(novosValores, 7, tr('Atualizando o fim', 'Updating the rear'), tr('Como início ficou nulo, fim também volta a ser nulo.', 'Since front became null, rear also goes back to null.'), 'update', { variables: { temp: valorRemovido } }));
  }

  steps.push(frame(novosValores, 9, tr('Retornando o valor removido', 'Returning the removed value'), tr(`dequeue() retorna ${fmt(valorRemovido)}.`, `dequeue() returns ${fmt(valorRemovido)}.`), 'success', { variables: { temp: valorRemovido, retorno: valorRemovido }, output: [tr(`dequeue() retornou ${fmt(valorRemovido)}.`, `dequeue() returned ${fmt(valorRemovido)}.`)] }));
  steps.push(frame(novosValores, 10, tr('dequeue() concluído', 'dequeue() finished'), tr(`O nó removido continha o valor ${fmt(valorRemovido)}.`, `The removed node held the value ${fmt(valorRemovido)}.`), 'done', { variables: { temp: valorRemovido, retorno: valorRemovido }, output: [tr(`dequeue() retornou ${fmt(valorRemovido)}.`, `dequeue() returned ${fmt(valorRemovido)}.`)] }));
  return steps;
}

function peekSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando peek()', 'Calling peek()'), tr('peek() é executado.', 'peek() is executed.')),
    frame(valores, 1, tr('Verificando se a fila está vazia', 'Checking whether the queue is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Fila vazia', 'Empty queue'), tr('Não há nó para consultar; o método retorna -1.', 'There is no node to peek at; the method returns -1.'), 'warning', { variables: { retorno: -1 }, output: [tr('peek() retornou -1 (fila vazia).', 'peek() returned -1 (empty queue).')] }));
    steps.push(frame(valores, 5, tr('peek() concluído', 'peek() finished'), tr('A fila continua exatamente igual.', 'The queue stays exactly the same.'), 'done', { variables: { retorno: -1 }, output: [tr('peek() retornou -1 (fila vazia).', 'peek() returned -1 (empty queue).')] }));
    return steps;
  }
  const valor = valores[0];
  steps.push(frame(valores, 4, tr('Retornando o valor do início', 'Returning the front value'), tr(`inicio.getValor() retorna ${fmt(valor)}.`, `front.getValue() returns ${fmt(valor)}.`), 'success', { activeIndices: [0], foundIndices: [0], variables: { retorno: valor }, output: [tr(`peek() retornou ${fmt(valor)}.`, `peek() returned ${fmt(valor)}.`)] }));
  steps.push(frame(valores, 5, tr('peek() concluído', 'peek() finished'), tr('A fila continua exatamente igual.', 'The queue stays exactly the same.'), 'done', { foundIndices: [0], variables: { retorno: valor }, output: [tr(`peek() retornou ${fmt(valor)}.`, `peek() returned ${fmt(valor)}.`)] }));
  return steps;
}

function sizeSteps(valores) {
  const tamanho = valores.length;
  const steps = [
    frame(valores, 0, tr('Chamando size()', 'Calling size()'), tr('size() é executado.', 'size() is executed.')),
    frame(valores, 1, tr('Iniciando o contador', 'Initializing the counter'), tr('contador recebe 0.', 'counter receives 0.'), 'update', { variables: { contador: 0 } }),
    frame(valores, 2, tr('Iniciando o atual', 'Initializing current'), tr(`atual recebe início (${tamanho ? fmt(valores[0]) : 'nulo'}).`, `current receives front (${tamanho ? fmt(valores[0]) : 'null'}).`), 'update', { activeIndices: tamanho ? [0] : [], variables: { contador: 0, atual: tamanho ? fmt(valores[0]) : 'nulo' } }),
  ];
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 3, tr('Verificando atual != nulo', 'Checking current != null'), tr(`atual aponta para o nó ${fmt(valores[i])}; a condição é verdadeira.`, `current points to node ${fmt(valores[i])}; the condition is true.`), 'comparison', { activeIndices: [i], variables: { contador: i, atual: fmt(valores[i]) } }));
    steps.push(frame(valores, 4, tr('Incrementando o contador', 'Incrementing the counter'), tr(`contador passa de ${i} para ${i + 1}.`, `counter goes from ${i} to ${i + 1}.`), 'update', { activeIndices: [i], variables: { contador: i + 1, atual: fmt(valores[i]) } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 5, tr('Avançando o atual', 'Advancing current'), tr(`atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, `current now points to ${proximo === 'nulo' ? 'null' : `node ${proximo}`}.`), 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], variables: { contador: i + 1, atual: proximo } }));
  }
  steps.push(frame(valores, 3, tr('Verificando atual != nulo', 'Checking current != null'), tr('atual chegou a nulo; a condição é falsa.', 'current reached null; the condition is false.'), 'comparison', { variables: { contador: tamanho, atual: 'nulo' } }));
  steps.push(frame(valores, 7, tr('Retornando o contador', 'Returning the counter'), tr(`size() retorna ${tamanho}.`, `size() returns ${tamanho}.`), 'success', { variables: { contador: tamanho }, output: [tr(`size() retornou ${tamanho}.`, `size() returned ${tamanho}.`)] }));
  steps.push(frame(valores, 8, tr('size() concluído', 'size() finished'), tr('A fila continua exatamente igual.', 'The queue stays exactly the same.'), 'done', { variables: { contador: tamanho }, output: [tr(`size() retornou ${tamanho}.`, `size() returned ${tamanho}.`)] }));
  return steps;
}

function showSteps(valores) {
  const tamanho = valores.length;
  const steps = [
    frame(valores, 0, tr('Chamando show()', 'Calling show()'), tr('show() é executado.', 'show() is executed.')),
    frame(valores, 1, tr('Iniciando a saída', 'Initializing the output'), tr('saida recebe uma string vazia.', 'output receives an empty string.'), 'update', { variables: { saida: '' } }),
    frame(valores, 2, tr('Iniciando o atual', 'Initializing current'), tr(`atual recebe início (${tamanho ? fmt(valores[0]) : 'nulo'}).`, `current receives front (${tamanho ? fmt(valores[0]) : 'null'}).`), 'update', { activeIndices: tamanho ? [0] : [], variables: { saida: '', atual: tamanho ? fmt(valores[0]) : 'nulo' } }),
  ];

  let texto = '';
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 3, tr('Verificando atual != nulo', 'Checking current != null'), tr(`atual aponta para o nó ${fmt(valores[i])}; a condição é verdadeira.`, `current points to node ${fmt(valores[i])}; the condition is true.`), 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { atual: fmt(valores[i]), saida: texto } }));
    texto += `${fmt(valores[i])} `;
    steps.push(frame(valores, 4, tr('Concatenando o valor', 'Concatenating the value'), tr(`saida recebe saida + ${fmt(valores[i])} + " ".`, `output receives output + ${fmt(valores[i])} + " ".`), 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { atual: fmt(valores[i]), saida: texto } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 5, tr('Avançando o atual', 'Advancing current'), tr(`atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, `current now points to ${proximo === 'nulo' ? 'null' : `node ${proximo}`}.`), 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], processedIndices: range(i + 1), variables: { atual: proximo, saida: texto } }));
  }
  steps.push(frame(valores, 3, tr('Verificando atual != nulo', 'Checking current != null'), tr('atual chegou a nulo; a condição é falsa.', 'current reached null; the condition is false.'), 'comparison', { processedIndices: range(tamanho), variables: { atual: 'nulo', saida: texto } }));
  steps.push(frame(valores, 7, tr('Retornando a saída', 'Returning the output'), tr(`show() retorna "${texto.trim()}".`, `show() returns "${texto.trim()}".`), 'success', { processedIndices: range(tamanho), variables: { saida: texto }, output: [tr(`show() retornou "${texto.trim()}".`, `show() returned "${texto.trim()}".`)] }));
  steps.push(frame(valores, 8, tr('show() concluído', 'show() finished'), tr('A fila continua exatamente igual; nada foi removido.', 'The queue stays exactly the same; nothing was removed.'), 'done', { processedIndices: range(tamanho), variables: { saida: texto }, output: [tr(`show() retornou "${texto.trim()}".`, `show() returned "${texto.trim()}".`)] }));
  return steps;
}

export function buildSteps(id, data, config) {
  const { values } = data;
  switch (id) {
    case 'creation': return creationSteps();
    case 'isEmpty': return isEmptySteps(values);
    case 'enqueue': return enqueueSteps(values, config.enqueueValue);
    case 'dequeue': return dequeueSteps(values);
    case 'peek': return peekSteps(values);
    case 'size': return sizeSteps(values);
    case 'show': return showSteps(values);
    default: return creationSteps();
  }
}
