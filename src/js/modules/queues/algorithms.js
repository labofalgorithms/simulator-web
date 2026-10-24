import { locale, tr } from '../../core/i18n.js';
export const algorithms = [
  {
    id: 'creation', title: tr('Criação da fila estática', 'Static queue creation'), menuLabel: tr('Criação da fila', 'Queue creation'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Veja como o vetor interno é alocado e o índice fim é iniciado com -1.', 'See how the internal array is allocated and the rear index starts at -1.'),
    interaction: tr('Ajuste a capacidade da fila e observe a estrutura sendo criada vazia.', 'Adjust the queue capacity and watch the structure being created empty.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('A criação aloca um vetor de tamanho fixo igual à capacidade.', 'Creation allocates a fixed-size array equal to the capacity.') },
    pseudocode: [tr('CONSTRUTOR FilaEstatica(tamanho)', 'CONSTRUCTOR StaticQueue(size)'), tr('  vetorFila ← novo vetor[tamanho]', '  queueArray ← new array[size]'), tr('  fim ← -1', '  rear ← -1'), tr('FIM', 'END')],
  },
  {
    id: 'isFull', title: tr('Verificar se está cheia', 'Check if it is full'), menuLabel: 'isFull()', group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Compare o índice fim com a última posição válida do vetor.', 'Compare the rear index with the last valid position of the array.'),
    interaction: tr('Altere a quantidade de elementos e observe quando o resultado muda para verdadeiro.', 'Change the number of elements and watch when the result turns true.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas uma comparação é realizada, sem percorrer o vetor.', 'Only one comparison is made, without traversing the array.') },
    pseudocode: [tr('FUNÇÃO isFull()', 'FUNCTION isFull()'), tr('  SE fim == tamanhoVetor - 1 ENTÃO', '  IF rear == arraySize - 1 THEN'), tr('    RETORNE verdadeiro', '    RETURN true'), tr('  SENÃO', '  ELSE'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'isEmpty', title: tr('Verificar se está vazia', 'Check if it is empty'), menuLabel: 'isEmpty()', group: tr('Fundamentos', 'Fundamentals'), number: '03',
    description: tr('Compare o índice fim com -1.', 'Compare the rear index with -1.'),
    interaction: tr('Esvazie a fila para ver o retorno mudar para verdadeiro.', 'Empty the queue to see the result turn true.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas uma comparação é realizada.', 'Only one comparison is made.') },
    pseudocode: [tr('FUNÇÃO isEmpty()', 'FUNCTION isEmpty()'), tr('  SE fim == -1 ENTÃO', '  IF rear == -1 THEN'), tr('    RETORNE verdadeiro', '    RETURN true'), tr('  SENÃO', '  ELSE'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'enqueue', title: tr('Inserir um elemento', 'Enqueue an element'), menuLabel: 'enqueue()', group: tr('Operações', 'Operations'), number: '04',
    description: tr('Insira um novo elemento no final da fila, se houver espaço.', 'Insert a new element at the end of the queue, if there is room.'),
    interaction: tr('Escolha o valor a inserir e veja o índice fim avançar uma posição.', 'Choose the value to insert and watch the rear index advance one position.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O elemento é escrito diretamente na próxima posição livre.', 'The element is written directly to the next free position.') },
    pseudocode: [tr('FUNÇÃO enqueue(elemento)', 'FUNCTION enqueue(element)'), tr('  SE isFull() == falso ENTÃO', '  IF isFull() == false THEN'), tr('    fim ← fim + 1', '    rear ← rear + 1'), tr('    vetorFila[fim] ← elemento', '    queueArray[rear] ← element'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'dequeue', title: tr('Remover um elemento', 'Dequeue an element'), menuLabel: 'dequeue()', group: tr('Operações', 'Operations'), number: '05',
    description: tr('Remova o elemento do início da fila e desloque os demais uma posição.', 'Remove the element at the front of the queue and shift the others one position.'),
    interaction: tr('Remova alguns elementos e observe o deslocamento de todo o vetor.', 'Remove a few elements and watch the whole array shift.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Todos os elementos restantes são deslocados uma posição para a esquerda.', 'All remaining elements are shifted one position to the left.') },
    pseudocode: [tr('FUNÇÃO dequeue()', 'FUNCTION dequeue()'), tr('  SE isEmpty() == falso ENTÃO', '  IF isEmpty() == false THEN'), tr('    n ← vetorFila[0]', '    n ← queueArray[0]'), tr('    PARA i DE 0 ATÉ fim - 1 FAÇA', '    FOR i FROM 0 TO rear - 1 DO'), tr('      vetorFila[i] ← vetorFila[i + 1]', '      queueArray[i] ← queueArray[i + 1]'), tr('    FIM PARA', '    END FOR'), tr('    fim ← fim - 1', '    rear ← rear - 1'), tr('    RETORNE n', '    RETURN n'), tr('  SENÃO', '  ELSE'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'peek', title: tr('Consultar o início', 'Peek at the front'), menuLabel: 'peek()', group: tr('Operações', 'Operations'), number: '06',
    description: tr('Leia o elemento do início da fila sem removê-lo.', 'Read the element at the front of the queue without removing it.'),
    interaction: tr('Compare o resultado de peek() com o de dequeue(): o valor é igual, mas a fila não muda.', 'Compare the result of peek() with that of dequeue(): the value is the same, but the queue does not change.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O elemento é lido diretamente na posição 0.', 'The element is read directly at position 0.') },
    pseudocode: [tr('FUNÇÃO peek()', 'FUNCTION peek()'), tr('  SE isEmpty() == falso ENTÃO', '  IF isEmpty() == false THEN'), tr('    RETORNE vetorFila[0]', '    RETURN queueArray[0]'), tr('  SENÃO', '  ELSE'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'show', title: tr('Mostrar elementos', 'Show elements'), menuLabel: 'show()', group: tr('Consultas', 'Queries'), number: '07',
    description: tr('Percorra do início até o fim exibindo cada elemento armazenado.', 'Walk from the front to the rear, displaying each stored element.'),
    interaction: tr('Acompanhe a variável i crescendo de 0 até fim.', 'Follow the variable i growing from 0 to rear.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('Cada elemento armazenado é visitado uma vez para montar a saída.', 'Each stored element is visited once to build the output.') },
    pseudocode: [tr('FUNÇÃO show()', 'FUNCTION show()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    ESCREVA "Fila vazia"', '    PRINT "Empty queue"'), tr('  SENÃO', '  ELSE'), tr('    PARA i DE 0 ATÉ fim FAÇA', '    FOR i FROM 0 TO rear DO'), tr('      ESCREVA vetorFila[i]', '      PRINT queueArray[i]'), tr('    FIM PARA', '    END FOR'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString(locale, { maximumFractionDigits: 2 }));

const frame = (values, capacidade, line, title, description, tone = 'neutral', extra = {}) => ({
  values: clone(values), capacidade, fim: values.length - 1, line, title, description, tone, variables: {}, output: [], ...extra,
});

function creationSteps(capacidade) {
  const empty = [];
  return [
    frame(empty, capacidade, 0, tr('Chamando o construtor', 'Calling the constructor'), tr(`FilaEstatica fEstat = new FilaEstatica(${capacidade}) é executado.`, `StaticQueue sQueue = new StaticQueue(${capacidade}) is executed.`), 'neutral', { fim: -1 }),
    frame(empty, capacidade, 1, tr('Alocando o vetor', 'Allocating the array'), tr(`Um vetor de ${capacidade} posições é reservado na memória.`, `An array of ${capacidade} positions is reserved in memory.`), 'reading', { fim: -1, variables: { capacidade } }),
    frame(empty, capacidade, 2, tr('Iniciando o fim', 'Initializing the rear'), tr('fim recebe -1 para indicar que nenhuma posição está ocupada.', 'rear receives -1 to indicate that no position is occupied.'), 'update', { fim: -1, variables: { capacidade, fim: -1 } }),
    frame(empty, capacidade, 3, tr('Fila criada', 'Queue created'), tr(`A fila foi criada com capacidade ${capacidade} e 0 elementos.`, `The queue was created with capacity ${capacidade} and 0 elements.`), 'done', { fim: -1, variables: { capacidade, fim: -1 }, output: [tr(`Fila criada com capacidade ${capacidade}.`, `Queue created with capacity ${capacidade}.`)] }),
  ];
}

function isFullSteps(valores, capacidade) {
  const fim = valores.length - 1;
  const full = fim === capacidade - 1;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando isFull()', 'Calling isFull()'), tr('O algoritmo verifica se ainda existe espaço livre na fila.', 'The algorithm checks whether there is still free space in the queue.')),
    frame(valores, capacidade, 1, tr('Comparando fim com o limite', 'Comparing rear with the limit'), tr(`fim (${fim}) == tamanhoVetor - 1 (${capacidade - 1}) é ${full ? 'verdadeiro' : 'falso'}.`, `rear (${fim}) == arraySize - 1 (${capacidade - 1}) is ${full ? 'true' : 'false'}.`), 'comparison', { activeIndices: fim >= 0 ? [fim] : [], variables: { fim, tamanhoVetor: capacidade } }),
  ];
  if (full) {
    steps.push(frame(valores, capacidade, 2, tr('Retornando verdadeiro', 'Returning true'), tr('A fila ocupa todas as posições disponíveis.', 'The queue occupies all available positions.'), 'success', { foundIndices: fim >= 0 ? [fim] : [], variables: { fim, cheia: true } }));
  } else {
    steps.push(frame(valores, capacidade, 4, tr('Retornando falso', 'Returning false'), tr('Ainda existe espaço livre para inserção.', 'There is still free space for insertion.'), 'neutral', { variables: { fim, cheia: false } }));
  }
  steps.push(frame(valores, capacidade, 6, tr('isFull() concluído', 'isFull() finished'), tr(`O método retorna ${full}.`, `The method returns ${full}.`), 'done', { variables: { fim, cheia: full }, output: [tr(`isFull() retornou ${full}.`, `isFull() returned ${full}.`)] }));
  return steps;
}

function isEmptySteps(valores, capacidade) {
  const fim = valores.length - 1;
  const empty = fim === -1;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando isEmpty()', 'Calling isEmpty()'), tr('O algoritmo verifica se existe algum elemento armazenado.', 'The algorithm checks whether any element is stored.')),
    frame(valores, capacidade, 1, tr('Comparando fim com -1', 'Comparing rear with -1'), tr(`fim == -1 é ${empty ? 'verdadeiro' : 'falso'}.`, `rear == -1 is ${empty ? 'true' : 'false'}.`), 'comparison', { activeIndices: fim >= 0 ? [0] : [], variables: { fim } }),
  ];
  if (empty) {
    steps.push(frame(valores, capacidade, 2, tr('Retornando verdadeiro', 'Returning true'), tr('A fila não possui elementos armazenados.', 'The queue has no stored elements.'), 'success', { variables: { fim, vazia: true } }));
  } else {
    steps.push(frame(valores, capacidade, 4, tr('Retornando falso', 'Returning false'), tr('Existe pelo menos um elemento armazenado.', 'There is at least one stored element.'), 'neutral', { variables: { fim, vazia: false } }));
  }
  steps.push(frame(valores, capacidade, 6, tr('isEmpty() concluído', 'isEmpty() finished'), tr(`O método retorna ${empty}.`, `The method returns ${empty}.`), 'done', { variables: { fim, vazia: empty }, output: [tr(`isEmpty() retornou ${empty}.`, `isEmpty() returned ${empty}.`)] }));
  return steps;
}

function enqueueSteps(valores, capacidade, elemento) {
  const fimAtual = valores.length - 1;
  const cheia = valores.length >= capacidade;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando enqueue(elemento)', 'Calling enqueue(element)'), tr(`enqueue(${fmt(elemento)}) é executado.`, `enqueue(${fmt(elemento)}) is executed.`)),
    frame(valores, capacidade, 1, tr('Verificando se a fila está cheia', 'Checking whether the queue is full'), tr(`isFull() retorna ${cheia}.`, `isFull() returns ${cheia}.`), 'comparison', { activeIndices: fimAtual >= 0 ? [fimAtual] : [], variables: { fim: fimAtual, cheia } }),
  ];
  if (cheia) {
    steps.push(frame(valores, capacidade, 4, tr('Fila cheia', 'Queue full'), tr('Não há espaço livre; o elemento não será inserido.', 'There is no free space; the element will not be inserted.'), 'warning', { variables: { fim: fimAtual, cheia: true }, output: [tr('Fila cheia: enqueue não realizado.', 'Queue full: enqueue not performed.')] }));
    steps.push(frame(valores, capacidade, 5, tr('enqueue() concluído', 'enqueue() finished'), tr('O algoritmo termina sem alterar a fila.', 'The algorithm ends without changing the queue.'), 'done', { variables: { fim: fimAtual, cheia: true }, output: [tr('Fila cheia: enqueue não realizado.', 'Queue full: enqueue not performed.')] }));
    return steps;
  }
  const novoFim = fimAtual + 1;
  const novosValores = [...valores, elemento];
  steps.push(frame(valores, capacidade, 2, tr('Incrementando o fim', 'Incrementing the rear'), tr(`fim passa de ${fimAtual} para ${novoFim}.`, `rear goes from ${fimAtual} to ${novoFim}.`), 'update', { fim: novoFim, activeIndices: [novoFim], variables: { fim: novoFim } }));
  steps.push(frame(novosValores, capacidade, 3, tr('Escrevendo o elemento', 'Writing the element'), tr(`vetorFila[${novoFim}] recebe ${fmt(elemento)}.`, `queueArray[${novoFim}] receives ${fmt(elemento)}.`), 'update', { activeIndices: [novoFim], changedIndices: [novoFim], variables: { fim: novoFim, elemento } }));
  steps.push(frame(novosValores, capacidade, 4, tr('Elemento inserido', 'Element inserted'), tr(`${fmt(elemento)} agora ocupa o final da fila.`, `${fmt(elemento)} now occupies the end of the queue.`), 'success', { foundIndices: [novoFim], variables: { fim: novoFim, elemento } }));
  steps.push(frame(novosValores, capacidade, 5, tr('enqueue() concluído', 'enqueue() finished'), tr(`enqueue(${fmt(elemento)}) inseriu o valor no índice ${novoFim}.`, `enqueue(${fmt(elemento)}) inserted the value at index ${novoFim}.`), 'done', { foundIndices: [novoFim], variables: { fim: novoFim, elemento }, output: [tr(`enqueue(${fmt(elemento)}) inseriu o valor no final (índice ${novoFim}).`, `enqueue(${fmt(elemento)}) inserted the value at the end (index ${novoFim}).`)] }));
  return steps;
}

function dequeueSteps(valores, capacidade) {
  const fim = valores.length - 1;
  const vazia = fim === -1;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando dequeue()', 'Calling dequeue()'), tr('dequeue() é executado.', 'dequeue() is executed.')),
    frame(valores, capacidade, 1, tr('Verificando se a fila está vazia', 'Checking whether the queue is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: fim >= 0 ? [0] : [], variables: { fim } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 9, tr('Fila vazia', 'Empty queue'), tr('Não há elemento para remover; o método retorna -1.', 'There is no element to remove; the method returns -1.'), 'warning', { variables: { fim, retorno: -1 }, output: [tr('dequeue() retornou -1 (fila vazia).', 'dequeue() returned -1 (empty queue).')] }));
    steps.push(frame(valores, capacidade, 11, tr('dequeue() concluído', 'dequeue() finished'), tr('O algoritmo termina sem alterar a fila.', 'The algorithm ends without changing the queue.'), 'done', { variables: { fim, retorno: -1 }, output: [tr('dequeue() retornou -1 (fila vazia).', 'dequeue() returned -1 (empty queue).')] }));
    return steps;
  }

  const n = valores[0];
  steps.push(frame(valores, capacidade, 2, tr('Guardando o valor removido', 'Saving the removed value'), tr(`n recebe vetorFila[0] = ${fmt(n)}.`, `n receives queueArray[0] = ${fmt(n)}.`), 'reading', { activeIndices: [0], foundIndices: [0], variables: { fim, n } }));

  let working = clone(valores);
  for (let i = 0; i < fim; i += 1) {
    steps.push(frame(working, capacidade, 3, tr(`Iniciando a iteração i = ${i}`, `Starting the iteration i = ${i}`), tr(`O laço PARA seleciona o índice ${i} para receber o valor seguinte.`, `The FOR loop selects index ${i} to receive the next value.`), 'reading', { activeIndices: [i, i + 1], variables: { i, n } }));
    working = clone(working);
    working[i] = working[i + 1];
    steps.push(frame(working, capacidade, 4, tr(`Deslocando vetorFila[${i + 1}] para a posição ${i}`, `Shifting queueArray[${i + 1}] to position ${i}`), tr(`vetorFila[${i}] recebe ${fmt(working[i])}.`, `queueArray[${i}] receives ${fmt(working[i])}.`), 'update', { activeIndices: [i, i + 1], changedIndices: [i], variables: { i, n } }));
  }

  const novosValores = working.slice(0, fim);
  const novoFim = fim - 1;
  steps.push(frame(working, capacidade, 6, tr('Fim do laço PARA', 'End of the FOR loop'), fim > 0 ? tr('Todos os demais elementos já foram deslocados uma posição para a esquerda.', 'All the other elements have already been shifted one position to the left.') : tr('Era o único elemento; não havia nada para deslocar.', 'It was the only element; there was nothing to shift.'), 'reading', { variables: { fim, n } }));
  steps.push(frame(novosValores, capacidade, 7, tr('Decrementando fim', 'Decrementing rear'), tr(`fim passa de ${fim} para ${novoFim}.`, `rear goes from ${fim} to ${novoFim}.`), 'update', { variables: { fim: novoFim, n } }));
  steps.push(frame(novosValores, capacidade, 8, tr('Retornando o valor removido', 'Returning the removed value'), tr(`dequeue() retorna ${fmt(n)}.`, `dequeue() returns ${fmt(n)}.`), 'success', { variables: { fim: novoFim, n }, output: [tr(`dequeue() retornou ${fmt(n)}.`, `dequeue() returned ${fmt(n)}.`)] }));
  steps.push(frame(novosValores, capacidade, 11, tr('dequeue() concluído', 'dequeue() finished'), tr(`O elemento removido foi ${fmt(n)}; os demais avançaram uma posição.`, `The removed element was ${fmt(n)}; the others moved up one position.`), 'done', { variables: { fim: novoFim, n }, output: [tr(`dequeue() retornou ${fmt(n)}.`, `dequeue() returned ${fmt(n)}.`)] }));
  return steps;
}

function peekSteps(valores, capacidade) {
  const fim = valores.length - 1;
  const vazia = fim === -1;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando peek()', 'Calling peek()'), tr('peek() é executado.', 'peek() is executed.')),
    frame(valores, capacidade, 1, tr('Verificando se a fila está vazia', 'Checking whether the queue is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: fim >= 0 ? [0] : [], variables: { fim } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 4, tr('Fila vazia', 'Empty queue'), tr('Não há elemento para consultar; o método retorna -1.', 'There is no element to peek at; the method returns -1.'), 'warning', { variables: { fim, retorno: -1 }, output: [tr('peek() retornou -1 (fila vazia).', 'peek() returned -1 (empty queue).')] }));
    steps.push(frame(valores, capacidade, 6, tr('peek() concluído', 'peek() finished'), tr('A fila continua exatamente igual.', 'The queue stays exactly the same.'), 'done', { variables: { fim, retorno: -1 }, output: [tr('peek() retornou -1 (fila vazia).', 'peek() returned -1 (empty queue).')] }));
    return steps;
  }
  const valor = valores[0];
  steps.push(frame(valores, capacidade, 2, tr('Lendo vetorFila[0]', 'Reading queueArray[0]'), tr(`vetorFila[0] contém ${fmt(valor)}.`, `queueArray[0] holds ${fmt(valor)}.`), 'reading', { activeIndices: [0], foundIndices: [0], variables: { fim, retorno: valor } }));
  steps.push(frame(valores, capacidade, 6, tr('peek() concluído', 'peek() finished'), tr(`peek() retornou ${fmt(valor)} sem alterar a fila.`, `peek() returned ${fmt(valor)} without changing the queue.`), 'done', { foundIndices: [0], variables: { fim, retorno: valor }, output: [tr(`peek() retornou ${fmt(valor)}.`, `peek() returned ${fmt(valor)}.`)] }));
  return steps;
}

function showSteps(valores, capacidade) {
  const fim = valores.length - 1;
  const vazia = fim === -1;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando show()', 'Calling show()'), tr('show() é executado.', 'show() is executed.')),
    frame(valores, capacidade, 1, tr('Verificando se a fila está vazia', 'Checking whether the queue is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 2, tr('Fila vazia', 'Empty queue'), tr('O método exibe a mensagem "Fila vazia".', 'The method displays the message "Empty queue".'), 'warning', { output: [tr('show() exibiu "Fila vazia".', 'show() displayed "Empty queue".')] }));
    steps.push(frame(valores, capacidade, 8, tr('show() concluído', 'show() finished'), tr('A execução termina sem percorrer o vetor.', 'The execution ends without traversing the array.'), 'done', { output: [tr('show() exibiu "Fila vazia".', 'show() displayed "Empty queue".')] }));
    return steps;
  }
  const outputLines = [];
  for (let i = 0; i <= fim; i += 1) {
    steps.push(frame(valores, capacidade, 4, tr(`Iniciando a iteração i = ${i}`, `Starting the iteration i = ${i}`), tr(`O laço PARA seleciona o índice ${i}, do início em direção ao fim.`, `The FOR loop selects index ${i}, from the front toward the rear.`), 'reading', { activeIndices: [i], processedIndices: Array.from({ length: i }, (_, index) => index), variables: { i } }));
    outputLines.push(tr(`vetorFila[${i}] = ${fmt(valores[i])}`, `queueArray[${i}] = ${fmt(valores[i])}`));
    steps.push(frame(valores, capacidade, 5, tr(`Exibindo vetorFila[${i}]`, `Displaying queueArray[${i}]`), tr(`O valor armazenado no índice ${i} é ${fmt(valores[i])}.`, `The value stored at index ${i} is ${fmt(valores[i])}.`), 'reading', { activeIndices: [i], processedIndices: Array.from({ length: i + 1 }, (_, index) => index), variables: { i, valor: valores[i] }, output: [...outputLines] }));
  }
  steps.push(frame(valores, capacidade, 7, tr('show() concluído', 'show() finished'), tr('A fila continua exatamente igual; nada foi removido.', 'The queue stays exactly the same; nothing was removed.'), 'done', { processedIndices: Array.from({ length: fim + 1 }, (_, index) => index), output: outputLines }));
  return steps;
}

export function buildSteps(id, data, config) {
  const { capacity, values } = data;
  switch (id) {
    case 'creation': return creationSteps(capacity);
    case 'isFull': return isFullSteps(values, capacity);
    case 'isEmpty': return isEmptySteps(values, capacity);
    case 'enqueue': return enqueueSteps(values, capacity, config.enqueueValue);
    case 'dequeue': return dequeueSteps(values, capacity);
    case 'peek': return peekSteps(values, capacity);
    case 'show': return showSteps(values, capacity);
    default: return creationSteps(capacity);
  }
}
