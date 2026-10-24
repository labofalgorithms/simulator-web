import { locale, tr } from '../../core/i18n.js';
export const algorithms = [
  {
    id: 'creation', title: tr('Criação da pilha dinâmica', 'Dynamic stack creation'), menuLabel: tr('Criação da pilha', 'Stack creation'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Veja como o atributo topo é iniciado apontando para nulo, sem alocar um vetor.', 'See how the top attribute starts pointing to null, without allocating an array.'),
    interaction: tr('Observe que não existe capacidade máxima: a pilha começa vazia e cresce sob demanda.', 'Notice that there is no maximum capacity: the stack starts empty and grows on demand.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Nenhuma estrutura é alocada antecipadamente; apenas a referência topo é criada.', 'No structure is allocated in advance; only the top reference is created.') },
    pseudocode: [tr('CONSTRUTOR PilhaDinamica()', 'CONSTRUCTOR DynamicStack()'), tr('  topo ← nulo', '  top ← null'), tr('FIM', 'END')],
  },
  {
    id: 'isEmpty', title: tr('Verificar se está vazia', 'Check if it is empty'), menuLabel: 'isEmpty()', group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Compare o atributo topo com nulo.', 'Compare the top attribute with null.'),
    interaction: tr('Esvazie a pilha para ver o retorno mudar para verdadeiro.', 'Empty the stack to see the result turn true.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas uma comparação é realizada.', 'Only one comparison is made.') },
    pseudocode: [tr('FUNÇÃO isEmpty()', 'FUNCTION isEmpty()'), tr('  RETORNE (topo == nulo)', '  RETURN (top == null)'), tr('FIM', 'END')],
  },
  {
    id: 'push', title: tr('Empilhar um elemento', 'Push an element'), menuLabel: 'push()', group: tr('Operações', 'Operations'), number: '03',
    description: tr('Crie um novo nó, aponte-o para o antigo topo e atualize o topo para esse novo nó.', 'Create a new node, point it to the old top and update the top to that new node.'),
    interaction: tr('Escolha o valor a empilhar. Não existe verificação de pilha cheia: a pilha sempre cresce.', 'Choose the value to push. There is no full-stack check: the stack always grows.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Um novo nó é criado e ligado diretamente, sem percorrer a pilha.', 'A new node is created and linked directly, without traversing the stack.') },
    pseudocode: [tr('FUNÇÃO push(dado)', 'FUNCTION push(data)'), tr('  novoNo ← novo No(dado)', '  newNode ← new Node(data)'), tr('  novoNo.setProximoNo(topo)', '  newNode.setNextNode(top)'), tr('  topo ← novoNo', '  top ← newNode'), tr('FIM', 'END')],
  },
  {
    id: 'pop', title: tr('Desempilhar um elemento', 'Pop an element'), menuLabel: 'pop()', group: tr('Operações', 'Operations'), number: '04',
    description: tr('Guarde o nó do topo, avance o topo para o próximo nó e retorne o valor guardado.', 'Save the top node, move the top to the next node and return the saved value.'),
    interaction: tr('Desempilhe algumas vezes e observe o topo avançar nó a nó até chegar a nulo.', 'Pop a few times and watch the top advance node by node until it reaches null.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas a referência topo é atualizada; nenhum outro nó é percorrido.', 'Only the top reference is updated; no other node is traversed.') },
    pseudocode: [tr('FUNÇÃO pop()', 'FUNCTION pop()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('  temp ← topo', '  temp ← top'), tr('  topo ← topo.getProximoNo()', '  top ← top.getNextNode()'), tr('  RETORNE temp.getValor()', '  RETURN temp.getValue()'), tr('FIM', 'END')],
  },
  {
    id: 'peek', title: tr('Consultar o topo', 'Peek at the top'), menuLabel: 'peek()', group: tr('Operações', 'Operations'), number: '05',
    description: tr('Leia o valor do nó do topo sem removê-lo.', 'Read the value of the top node without removing it.'),
    interaction: tr('Compare o resultado de peek() com o de pop(): o valor é igual, mas a pilha não muda.', 'Compare the result of peek() with that of pop(): the value is the same, but the stack does not change.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O valor é lido diretamente do nó apontado por topo.', 'The value is read directly from the node pointed to by top.') },
    pseudocode: [tr('FUNÇÃO peek()', 'FUNCTION peek()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('  RETORNE topo.getValor()', '  RETURN top.getValue()'), tr('FIM', 'END')],
  },
  {
    id: 'size', title: tr('Tamanho da pilha', 'Stack size'), menuLabel: 'size()', group: tr('Consultas', 'Queries'), number: '06',
    description: tr('Percorra a pilha nó por nó, contando quantos elementos existem.', 'Walk the stack node by node, counting how many elements there are.'),
    interaction: tr('Acompanhe o auxiliar avançando de nó em nó até chegar a nulo.', 'Follow the helper moving from node to node until it reaches null.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Como não existe um atributo de tamanho, é preciso percorrer todos os nós.', 'Since there is no size attribute, every node has to be traversed.') },
    pseudocode: [tr('FUNÇÃO size()', 'FUNCTION size()'), tr('  auxiliar ← topo', '  helper ← top'), tr('  contador ← 0', '  counter ← 0'), tr('  ENQUANTO auxiliar != nulo FAÇA', '  WHILE helper != null DO'), tr('    contador ← contador + 1', '    counter ← counter + 1'), tr('    auxiliar ← auxiliar.getProximoNo()', '    helper ← helper.getNextNode()'), tr('  FIM ENQUANTO', '  END WHILE'), tr('  RETORNE contador', '  RETURN counter'), tr('FIM', 'END')],
  },
  {
    id: 'display', title: tr('Mostrar elementos', 'Show elements'), menuLabel: 'display()', group: tr('Consultas', 'Queries'), number: '07',
    description: tr('Percorra a pilha do topo até o final, concatenando os valores encontrados.', 'Walk the stack from the top to the end, concatenating the values found.'),
    interaction: tr('Acompanhe o atual avançando nó a nó enquanto o texto é montado.', 'Follow current moving node by node while the text is built.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('Cada nó é visitado uma vez para montar o texto de saída.', 'Each node is visited once to build the output text.') },
    pseudocode: [tr('FUNÇÃO display()', 'FUNCTION display()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE "Pilha vazia."', '    RETURN "Empty stack."'), tr('  FIM SE', '  END IF'), tr('  atual ← topo', '  current ← top'), tr('  retorno ← ""', '  result ← ""'), tr('  ENQUANTO atual != nulo FAÇA', '  WHILE current != null DO'), tr('    retorno ← retorno + atual.getValor() + " "', '    result ← result + current.getValue() + " "'), tr('    atual ← atual.getProximoNo()', '    current ← current.getNextNode()'), tr('  FIM ENQUANTO', '  END WHILE'), tr('  RETORNE retorno', '  RETURN result'), tr('FIM', 'END')],
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
    frame([], 0, tr('Chamando o construtor', 'Calling the constructor'), tr('PilhaDinamica pd = new PilhaDinamica() é executado.', 'DynamicStack ds = new DynamicStack() is executed.')),
    frame([], 1, tr('Iniciando o topo', 'Initializing the top'), tr('topo recebe nulo, pois nenhum nó foi criado ainda.', 'top receives null, since no node has been created yet.'), 'update', { variables: { topo: 'nulo' } }),
    frame([], 2, tr('Pilha criada', 'Stack created'), tr('A pilha dinâmica foi criada vazia, sem um tamanho máximo definido.', 'The dynamic stack was created empty, with no maximum size defined.'), 'done', { variables: { topo: 'nulo' }, output: [tr('Pilha dinâmica criada.', 'Dynamic stack created.')] }),
  ];
}

function isEmptySteps(valores) {
  const vazia = valores.length === 0;
  return [
    frame(valores, 0, tr('Chamando isEmpty()', 'Calling isEmpty()'), tr('O algoritmo verifica se topo aponta para nulo.', 'The algorithm checks whether top points to null.')),
    frame(valores, 1, tr('Comparando topo com nulo', 'Comparing top with null'), tr(`topo == nulo é ${vazia ? 'verdadeiro' : 'falso'}.`, `top == null is ${vazia ? 'true' : 'false'}.`), 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
    frame(valores, 2, tr('isEmpty() concluído', 'isEmpty() finished'), tr(`O método retorna ${vazia}.`, `The method returns ${vazia}.`), 'done', { variables: { vazia }, output: [tr(`isEmpty() retornou ${vazia}.`, `isEmpty() returned ${vazia}.`)] }),
  ];
}

function pushSteps(valores, dado) {
  const steps = [
    frame(valores, 0, tr('Chamando push(dado)', 'Calling push(data)'), tr(`push(${fmt(dado)}) é executado.`, `push(${fmt(dado)}) is executed.`)),
    frame(valores, 1, tr('Criando o novo nó', 'Creating the new node'), tr(`novoNo armazena o valor ${fmt(dado)}.`, `newNode stores the value ${fmt(dado)}.`), 'reading', { variables: { dado } }),
    frame(valores, 2, tr('Apontando para o topo antigo', 'Pointing to the old top'), tr(`novoNo passa a apontar para ${valores.length ? `o nó ${fmt(valores[0])}` : 'nulo'}.`, `newNode now points to ${valores.length ? `node ${fmt(valores[0])}` : 'null'}.`), 'reading', { variables: { dado, proximo: valores.length ? fmt(valores[0]) : 'nulo' } }),
  ];
  const novosValores = [dado, ...valores];
  steps.push(frame(novosValores, 3, tr('Atualizando o topo', 'Updating the top'), tr('topo passa a apontar para o novo nó.', 'top now points to the new node.'), 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
  steps.push(frame(novosValores, 4, tr('push() concluído', 'push() finished'), tr(`${fmt(dado)} agora é o topo da pilha.`, `${fmt(dado)} is now the top of the stack.`), 'done', { foundIndices: [0], variables: { dado }, output: [tr(`push(${fmt(dado)}) inseriu o valor no topo.`, `push(${fmt(dado)}) inserted the value at the top.`)] }));
  return steps;
}

function popSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando pop()', 'Calling pop()'), tr('pop() é executado.', 'pop() is executed.')),
    frame(valores, 1, tr('Verificando se a pilha está vazia', 'Checking whether the stack is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Pilha vazia', 'Empty stack'), tr('Não há nó para remover; o método retorna -1.', 'There is no node to remove; the method returns -1.'), 'warning', { variables: { retorno: -1 }, output: [tr('pop() retornou -1 (pilha vazia).', 'pop() returned -1 (empty stack).')] }));
    steps.push(frame(valores, 7, tr('pop() concluído', 'pop() finished'), tr('O algoritmo termina sem alterar a pilha.', 'The algorithm ends without changing the stack.'), 'done', { variables: { retorno: -1 }, output: [tr('pop() retornou -1 (pilha vazia).', 'pop() returned -1 (empty stack).')] }));
    return steps;
  }

  const valor = valores[0];
  steps.push(frame(valores, 4, tr('Guardando o nó do topo', 'Saving the top node'), tr(`temp recebe o nó que contém ${fmt(valor)}.`, `temp receives the node that holds ${fmt(valor)}.`), 'reading', { activeIndices: [0], foundIndices: [0], variables: { temp: valor } }));
  const novosValores = valores.slice(1);
  steps.push(frame(novosValores, 5, tr('Atualizando o topo', 'Updating the top'), tr(`topo passa a apontar para ${novosValores.length ? `o nó ${fmt(novosValores[0])}` : 'nulo'}.`, `top now points to ${novosValores.length ? `node ${fmt(novosValores[0])}` : 'null'}.`), 'update', { variables: { temp: valor } }));
  steps.push(frame(novosValores, 6, tr('Retornando o valor removido', 'Returning the removed value'), tr(`pop() retorna ${fmt(valor)}.`, `pop() returns ${fmt(valor)}.`), 'success', { variables: { temp: valor, retorno: valor }, output: [tr(`pop() retornou ${fmt(valor)}.`, `pop() returned ${fmt(valor)}.`)] }));
  steps.push(frame(novosValores, 7, tr('pop() concluído', 'pop() finished'), tr(`O nó removido continha o valor ${fmt(valor)}.`, `The removed node held the value ${fmt(valor)}.`), 'done', { variables: { temp: valor, retorno: valor }, output: [tr(`pop() retornou ${fmt(valor)}.`, `pop() returned ${fmt(valor)}.`)] }));
  return steps;
}

function peekSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando peek()', 'Calling peek()'), tr('peek() é executado.', 'peek() is executed.')),
    frame(valores, 1, tr('Verificando se a pilha está vazia', 'Checking whether the stack is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Pilha vazia', 'Empty stack'), tr('Não há nó para consultar; o método retorna -1.', 'There is no node to peek at; the method returns -1.'), 'warning', { variables: { retorno: -1 }, output: [tr('peek() retornou -1 (pilha vazia).', 'peek() returned -1 (empty stack).')] }));
    steps.push(frame(valores, 5, tr('peek() concluído', 'peek() finished'), tr('A pilha continua exatamente igual.', 'The stack stays exactly the same.'), 'done', { variables: { retorno: -1 }, output: [tr('peek() retornou -1 (pilha vazia).', 'peek() returned -1 (empty stack).')] }));
    return steps;
  }
  const valor = valores[0];
  steps.push(frame(valores, 4, tr('Retornando o valor do topo', 'Returning the top value'), tr(`topo.getValor() retorna ${fmt(valor)}.`, `top.getValue() returns ${fmt(valor)}.`), 'success', { activeIndices: [0], foundIndices: [0], variables: { retorno: valor }, output: [tr(`peek() retornou ${fmt(valor)}.`, `peek() returned ${fmt(valor)}.`)] }));
  steps.push(frame(valores, 5, tr('peek() concluído', 'peek() finished'), tr('A pilha continua exatamente igual.', 'The stack stays exactly the same.'), 'done', { foundIndices: [0], variables: { retorno: valor }, output: [tr(`peek() retornou ${fmt(valor)}.`, `peek() returned ${fmt(valor)}.`)] }));
  return steps;
}

function sizeSteps(valores) {
  const tamanho = valores.length;
  const steps = [
    frame(valores, 0, tr('Chamando size()', 'Calling size()'), tr('size() é executado.', 'size() is executed.')),
    frame(valores, 1, tr('Iniciando o auxiliar', 'Initializing the helper'), tr(`auxiliar recebe topo (${tamanho ? fmt(valores[0]) : 'nulo'}).`, `helper receives top (${tamanho ? fmt(valores[0]) : 'null'}).`), 'update', { activeIndices: tamanho ? [0] : [], variables: { auxiliar: tamanho ? fmt(valores[0]) : 'nulo' } }),
    frame(valores, 2, tr('Iniciando o contador', 'Initializing the counter'), tr('contador recebe 0.', 'counter receives 0.'), 'update', { activeIndices: tamanho ? [0] : [], variables: { auxiliar: tamanho ? fmt(valores[0]) : 'nulo', contador: 0 } }),
  ];
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 3, tr('Verificando auxiliar != nulo', 'Checking helper != null'), tr(`auxiliar aponta para o nó ${fmt(valores[i])}; a condição é verdadeira.`, `helper points to node ${fmt(valores[i])}; the condition is true.`), 'comparison', { activeIndices: [i], variables: { contador: i, auxiliar: fmt(valores[i]) } }));
    steps.push(frame(valores, 4, tr('Incrementando o contador', 'Incrementing the counter'), tr(`contador passa de ${i} para ${i + 1}.`, `counter goes from ${i} to ${i + 1}.`), 'update', { activeIndices: [i], variables: { contador: i + 1, auxiliar: fmt(valores[i]) } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 5, tr('Avançando o auxiliar', 'Advancing the helper'), tr(`auxiliar passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, `helper now points to ${proximo === 'nulo' ? 'null' : `node ${proximo}`}.`), 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], variables: { contador: i + 1, auxiliar: proximo } }));
  }
  steps.push(frame(valores, 3, tr('Verificando auxiliar != nulo', 'Checking helper != null'), tr('auxiliar chegou a nulo; a condição é falsa.', 'helper reached null; the condition is false.'), 'comparison', { variables: { contador: tamanho, auxiliar: 'nulo' } }));
  steps.push(frame(valores, 7, tr('Retornando o contador', 'Returning the counter'), tr(`size() retorna ${tamanho}.`, `size() returns ${tamanho}.`), 'success', { variables: { contador: tamanho }, output: [tr(`size() retornou ${tamanho}.`, `size() returned ${tamanho}.`)] }));
  steps.push(frame(valores, 8, tr('size() concluído', 'size() finished'), tr('A pilha continua exatamente igual.', 'The stack stays exactly the same.'), 'done', { variables: { contador: tamanho }, output: [tr(`size() retornou ${tamanho}.`, `size() returned ${tamanho}.`)] }));
  return steps;
}

function displaySteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, tr('Chamando display()', 'Calling display()'), tr('display() é executado.', 'display() is executed.')),
    frame(valores, 1, tr('Verificando se a pilha está vazia', 'Checking whether the stack is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, tr('Pilha vazia', 'Empty stack'), tr('O método retorna a mensagem "Pilha vazia.".', 'The method returns the message "Empty stack.".'), 'warning', { output: [tr('display() retornou "Pilha vazia.".', 'display() returned "Empty stack.".')] }));
    steps.push(frame(valores, 11, tr('display() concluído', 'display() finished'), tr('A execução termina sem percorrer a pilha.', 'The execution ends without traversing the stack.'), 'done', { output: [tr('display() retornou "Pilha vazia.".', 'display() returned "Empty stack.".')] }));
    return steps;
  }

  const tamanho = valores.length;
  steps.push(frame(valores, 4, tr('Iniciando o atual', 'Initializing current'), tr(`atual recebe topo (${fmt(valores[0])}).`, `current receives top (${fmt(valores[0])}).`), 'update', { activeIndices: [0], variables: { atual: fmt(valores[0]) } }));
  steps.push(frame(valores, 5, tr('Iniciando o retorno', 'Initializing the result'), tr('retorno recebe uma string vazia.', 'result receives an empty string.'), 'update', { activeIndices: [0], variables: { atual: fmt(valores[0]), retorno: '' } }));

  let texto = '';
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 6, tr('Verificando atual != nulo', 'Checking current != null'), tr(`atual aponta para o nó ${fmt(valores[i])}; a condição é verdadeira.`, `current points to node ${fmt(valores[i])}; the condition is true.`), 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { atual: fmt(valores[i]), retorno: texto } }));
    texto += `${fmt(valores[i])} `;
    steps.push(frame(valores, 7, tr('Concatenando o valor', 'Concatenating the value'), tr(`retorno recebe retorno + ${fmt(valores[i])} + " ".`, `result receives result + ${fmt(valores[i])} + " ".`), 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { atual: fmt(valores[i]), retorno: texto } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 8, tr('Avançando o atual', 'Advancing current'), tr(`atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, `current now points to ${proximo === 'nulo' ? 'null' : `node ${proximo}`}.`), 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], processedIndices: range(i + 1), variables: { atual: proximo, retorno: texto } }));
  }
  steps.push(frame(valores, 6, tr('Verificando atual != nulo', 'Checking current != null'), tr('atual chegou a nulo; a condição é falsa.', 'current reached null; the condition is false.'), 'comparison', { processedIndices: range(tamanho), variables: { atual: 'nulo', retorno: texto } }));
  steps.push(frame(valores, 10, tr('Retornando o texto', 'Returning the text'), tr(`display() retorna "${texto.trim()}".`, `display() returns "${texto.trim()}".`), 'success', { processedIndices: range(tamanho), variables: { retorno: texto }, output: [tr(`display() retornou "${texto.trim()}".`, `display() returned "${texto.trim()}".`)] }));
  steps.push(frame(valores, 11, tr('display() concluído', 'display() finished'), tr('A pilha continua exatamente igual; nada foi removido.', 'The stack stays exactly the same; nothing was removed.'), 'done', { processedIndices: range(tamanho), variables: { retorno: texto }, output: [tr(`display() retornou "${texto.trim()}".`, `display() returned "${texto.trim()}".`)] }));
  return steps;
}

export function buildSteps(id, data, config) {
  const { values } = data;
  switch (id) {
    case 'creation': return creationSteps();
    case 'isEmpty': return isEmptySteps(values);
    case 'push': return pushSteps(values, config.pushValue);
    case 'pop': return popSteps(values);
    case 'peek': return peekSteps(values);
    case 'size': return sizeSteps(values);
    case 'display': return displaySteps(values);
    default: return creationSteps();
  }
}
