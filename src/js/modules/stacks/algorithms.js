import { locale, tr } from '../../core/i18n.js';
export const algorithms = [
  {
    id: 'creation', title: tr('Criação da pilha estática', 'Static stack creation'), menuLabel: tr('Criação da pilha', 'Stack creation'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Veja como o vetor interno é alocado e o índice do topo é iniciado com -1.', 'See how the internal array is allocated and the top index starts at -1.'),
    interaction: tr('Ajuste a capacidade da pilha e observe a estrutura sendo criada vazia.', 'Adjust the stack capacity and watch the structure being created empty.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('A criação aloca um vetor de tamanho fixo igual à capacidade.', 'Creation allocates a fixed-size array equal to the capacity.') },
    pseudocode: [tr('CONSTRUTOR Pilha(maxSize)', 'CONSTRUCTOR Stack(maxSize)'), tr('  pilha ← novo vetor[maxSize]', '  stack ← new array[maxSize]'), tr('  topo ← -1', '  top ← -1'), tr('FIM', 'END')],
  },
  {
    id: 'isFull', title: tr('Verificar se está cheia', 'Check if it is full'), menuLabel: 'isFull()', group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Compare o índice do topo com a última posição válida do vetor.', 'Compare the top index with the last valid position of the array.'),
    interaction: tr('Altere a quantidade de elementos e observe quando o resultado muda para verdadeiro.', 'Change the number of elements and watch when the result turns true.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas uma comparação é realizada, sem percorrer o vetor.', 'Only one comparison is made, without traversing the array.') },
    pseudocode: [tr('FUNÇÃO isFull()', 'FUNCTION isFull()'), tr('  RETORNE (topo == tamanhoVetor - 1)', '  RETURN (top == arraySize - 1)'), tr('FIM', 'END')],
  },
  {
    id: 'isEmpty', title: tr('Verificar se está vazia', 'Check if it is empty'), menuLabel: 'isEmpty()', group: tr('Fundamentos', 'Fundamentals'), number: '03',
    description: tr('Compare o índice do topo com -1.', 'Compare the top index with -1.'),
    interaction: tr('Esvazie a pilha para ver o retorno mudar para verdadeiro.', 'Empty the stack to see the result turn true.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas uma comparação é realizada.', 'Only one comparison is made.') },
    pseudocode: [tr('FUNÇÃO isEmpty()', 'FUNCTION isEmpty()'), tr('  RETORNE topo == -1', '  RETURN top == -1'), tr('FIM', 'END')],
  },
  {
    id: 'push', title: tr('Empilhar um elemento', 'Push an element'), menuLabel: 'push()', group: tr('Operações', 'Operations'), number: '04',
    description: tr('Insira um novo elemento no topo da pilha, se houver espaço.', 'Insert a new element on top of the stack, if there is room.'),
    interaction: tr('Escolha o valor a empilhar e veja o topo avançar uma posição.', 'Choose the value to push and watch the top advance one position.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O elemento é escrito diretamente na próxima posição livre.', 'The element is written directly to the next free position.') },
    pseudocode: [tr('FUNÇÃO push(elemento)', 'FUNCTION push(element)'), tr('  SE isFull() == falso ENTÃO', '  IF isFull() == false THEN'), tr('    topo ← topo + 1', '    top ← top + 1'), tr('    pilha[topo] ← elemento', '    stack[top] ← element'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'pop', title: tr('Desempilhar um elemento', 'Pop an element'), menuLabel: 'pop()', group: tr('Operações', 'Operations'), number: '05',
    description: tr('Remova e retorne o elemento que está no topo da pilha.', 'Remove and return the element at the top of the stack.'),
    interaction: tr('Desempilhe algumas vezes e observe o topo recuar até chegar a -1.', 'Pop a few times and watch the top move back down to -1.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas o índice do topo é atualizado.', 'Only the top index is updated.') },
    pseudocode: [tr('FUNÇÃO pop()', 'FUNCTION pop()'), tr('  SE isEmpty() == falso ENTÃO', '  IF isEmpty() == false THEN'), tr('    retorno ← pilha[topo]', '    result ← stack[top]'), tr('    topo ← topo - 1', '    top ← top - 1'), tr('    RETORNE retorno', '    RETURN result'), tr('  SENÃO', '  ELSE'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'peek', title: tr('Consultar o topo', 'Peek at the top'), menuLabel: 'peek()', group: tr('Operações', 'Operations'), number: '06',
    description: tr('Leia o elemento do topo sem removê-lo da pilha.', 'Read the top element without removing it from the stack.'),
    interaction: tr('Compare o resultado de peek() com o de pop(): o valor é igual, mas a pilha não muda.', 'Compare the result of peek() with that of pop(): the value is the same, but the stack does not change.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O elemento é lido diretamente pelo índice topo.', 'The element is read directly through the top index.') },
    pseudocode: [tr('FUNÇÃO peek()', 'FUNCTION peek()'), tr('  SE isEmpty() == falso ENTÃO', '  IF isEmpty() == false THEN'), tr('    RETORNE pilha[topo]', '    RETURN stack[top]'), tr('  SENÃO', '  ELSE'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'size', title: tr('Tamanho da pilha', 'Stack size'), menuLabel: 'size()', group: tr('Consultas', 'Queries'), number: '07',
    description: tr('Calcule quantos elementos existem atualmente na pilha.', 'Calculate how many elements are currently in the stack.'),
    interaction: tr('Empilhe ou desempilhe elementos e volte para conferir o novo tamanho.', 'Push or pop elements and come back to check the new size.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O tamanho é obtido a partir do índice topo, sem percorrer o vetor.', 'The size comes from the top index, without traversing the array.') },
    pseudocode: [tr('FUNÇÃO size()', 'FUNCTION size()'), tr('  RETORNE topo + 1', '  RETURN top + 1'), tr('FIM', 'END')],
  },
  {
    id: 'show', title: tr('Mostrar elementos', 'Show elements'), menuLabel: 'show()', group: tr('Consultas', 'Queries'), number: '08',
    description: tr('Percorra do topo até a base exibindo cada elemento armazenado.', 'Walk from the top down to the base, displaying each stored element.'),
    interaction: tr('Acompanhe a variável i decrescendo do topo até 0.', 'Follow the variable i decreasing from the top to 0.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('Cada elemento armazenado é visitado uma vez para montar a saída.', 'Each stored element is visited once to build the output.') },
    pseudocode: [tr('FUNÇÃO show()', 'FUNCTION show()'), tr('  resposta ← ""', '  answer ← ""'), tr('  SE isEmpty() == verdadeiro ENTÃO', '  IF isEmpty() == true THEN'), tr('    RETORNE "Pilha vazia"', '    RETURN "Empty stack"'), tr('  SENÃO', '  ELSE'), tr('    PARA i DE topo ATÉ 0 PASSO -1 FAÇA', '    FOR i FROM top TO 0 STEP -1 DO'), tr('      resposta ← resposta + pilha[i] + "\\n"', '      answer ← answer + stack[i] + "\\n"'), tr('    FIM PARA', '    END FOR'), tr('  FIM SE', '  END IF'), tr('  RETORNE resposta', '  RETURN answer'), tr('FIM', 'END')],
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString(locale, { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

const frame = (values, capacidade, line, title, description, tone = 'neutral', extra = {}) => ({
  values: clone(values), capacidade, topo: values.length - 1, line, title, description, tone, variables: {}, output: [], ...extra,
});

function creationSteps(capacidade) {
  const empty = [];
  return [
    frame(empty, capacidade, 0, tr('Chamando o construtor', 'Calling the constructor'), tr(`Pilha pilha = new Pilha(${capacidade}) é executado.`, `Stack stack = new Stack(${capacidade}) is executed.`), 'neutral', { topo: -1 }),
    frame(empty, capacidade, 1, tr('Alocando o vetor', 'Allocating the array'), tr(`Um vetor de ${capacidade} posições é reservado na memória.`, `An array of ${capacidade} positions is reserved in memory.`), 'reading', { topo: -1, variables: { capacidade } }),
    frame(empty, capacidade, 2, tr('Iniciando o topo', 'Initializing the top'), tr('topo recebe -1 para indicar que nenhuma posição está ocupada.', 'top receives -1 to indicate that no position is occupied.'), 'update', { topo: -1, variables: { capacidade, topo: -1 } }),
    frame(empty, capacidade, 3, tr('Pilha criada', 'Stack created'), tr(`A pilha foi criada com capacidade ${capacidade} e 0 elementos.`, `The stack was created with capacity ${capacidade} and 0 elements.`), 'done', { topo: -1, variables: { capacidade, topo: -1 }, output: [tr(`Pilha criada com capacidade ${capacidade}.`, `Stack created with capacity ${capacidade}.`)] }),
  ];
}

function isFullSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const full = topo === capacidade - 1;
  return [
    frame(valores, capacidade, 0, tr('Chamando isFull()', 'Calling isFull()'), tr('O algoritmo verifica se ainda existe espaço livre na pilha.', 'The algorithm checks whether there is still free space in the stack.')),
    frame(valores, capacidade, 1, tr('Comparando topo com o limite', 'Comparing top with the limit'), tr(`topo (${topo}) == tamanhoVetor - 1 (${capacidade - 1}) é ${full ? 'verdadeiro' : 'falso'}.`, `top (${topo}) == arraySize - 1 (${capacidade - 1}) is ${full ? 'true' : 'false'}.`), 'comparison', { activeIndices: topo >= 0 ? [topo] : [], variables: { topo, tamanhoVetor: capacidade, cheia: full } }),
    frame(valores, capacidade, 2, tr('Resultado de isFull()', 'Result of isFull()'), tr(`O método retorna ${full}.`, `The method returns ${full}.`), full ? 'success' : 'neutral', { foundIndices: full && topo >= 0 ? [topo] : [], variables: { topo, tamanhoVetor: capacidade, cheia: full }, output: [tr(`isFull() retornou ${full}.`, `isFull() returned ${full}.`)] }),
  ];
}

function isEmptySteps(valores, capacidade) {
  const topo = valores.length - 1;
  const empty = topo === -1;
  return [
    frame(valores, capacidade, 0, tr('Chamando isEmpty()', 'Calling isEmpty()'), tr('O algoritmo verifica se existe algum elemento armazenado.', 'The algorithm checks whether any element is stored.')),
    frame(valores, capacidade, 1, tr('Comparando topo com -1', 'Comparing top with -1'), tr(`topo == -1 é ${empty ? 'verdadeiro' : 'falso'}.`, `top == -1 is ${empty ? 'true' : 'false'}.`), 'comparison', { activeIndices: topo >= 0 ? [topo] : [], variables: { topo, vazia: empty } }),
    frame(valores, capacidade, 2, tr('Resultado de isEmpty()', 'Result of isEmpty()'), tr(`O método retorna ${empty}.`, `The method returns ${empty}.`), empty ? 'success' : 'neutral', { variables: { topo, vazia: empty }, output: [tr(`isEmpty() retornou ${empty}.`, `isEmpty() returned ${empty}.`)] }),
  ];
}

function pushSteps(valores, capacidade, elemento) {
  const topoAtual = valores.length - 1;
  const cheia = valores.length >= capacidade;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando push(elemento)', 'Calling push(element)'), tr(`push(${fmt(elemento)}) é executado.`, `push(${fmt(elemento)}) is executed.`)),
    frame(valores, capacidade, 1, tr('Verificando se a pilha está cheia', 'Checking whether the stack is full'), tr(`isFull() retorna ${cheia}.`, `isFull() returns ${cheia}.`), 'comparison', { activeIndices: topoAtual >= 0 ? [topoAtual] : [], variables: { topo: topoAtual, tamanhoVetor: capacidade, cheia } }),
  ];
  if (cheia) {
    steps.push(frame(valores, capacidade, 4, tr('Pilha cheia', 'Stack full'), tr('Não há espaço livre; o elemento não será inserido.', 'There is no free space; the element will not be inserted.'), 'warning', { variables: { topo: topoAtual, cheia: true }, output: [tr('StackOverflow: pilha cheia, push não realizado.', 'StackOverflow: stack is full, push not performed.')] }));
    steps.push(frame(valores, capacidade, 5, tr('push() concluído', 'push() finished'), tr('O algoritmo termina sem alterar a pilha.', 'The algorithm ends without changing the stack.'), 'done', { variables: { topo: topoAtual, cheia: true }, output: [tr('StackOverflow: pilha cheia, push não realizado.', 'StackOverflow: stack is full, push not performed.')] }));
    return steps;
  }
  const novoTopo = topoAtual + 1;
  const novosValores = [...valores, elemento];
  steps.push(frame(valores, capacidade, 2, tr('Incrementando o topo', 'Incrementing the top'), tr(`topo passa de ${topoAtual} para ${novoTopo}.`, `top goes from ${topoAtual} to ${novoTopo}.`), 'update', { topo: novoTopo, activeIndices: [novoTopo], variables: { topo: novoTopo } }));
  steps.push(frame(novosValores, capacidade, 3, tr('Escrevendo o elemento', 'Writing the element'), tr(`pilha[${novoTopo}] recebe ${fmt(elemento)}.`, `stack[${novoTopo}] receives ${fmt(elemento)}.`), 'update', { activeIndices: [novoTopo], changedIndices: [novoTopo], variables: { topo: novoTopo, elemento } }));
  steps.push(frame(novosValores, capacidade, 4, tr('Elemento inserido', 'Element inserted'), tr(`${fmt(elemento)} agora é o topo da pilha.`, `${fmt(elemento)} is now the top of the stack.`), 'success', { foundIndices: [novoTopo], variables: { topo: novoTopo, elemento } }));
  steps.push(frame(novosValores, capacidade, 5, tr('push() concluído', 'push() finished'), tr(`push(${fmt(elemento)}) inseriu o valor no índice ${novoTopo}.`, `push(${fmt(elemento)}) inserted the value at index ${novoTopo}.`), 'done', { foundIndices: [novoTopo], variables: { topo: novoTopo, elemento }, output: [tr(`push(${fmt(elemento)}) inseriu o valor no topo (índice ${novoTopo}).`, `push(${fmt(elemento)}) inserted the value at the top (index ${novoTopo}).`)] }));
  return steps;
}

function popSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const vazia = topo === -1;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando pop()', 'Calling pop()'), tr('pop() é executado.', 'pop() is executed.')),
    frame(valores, capacidade, 1, tr('Verificando se a pilha está vazia', 'Checking whether the stack is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: topo >= 0 ? [topo] : [], variables: { topo, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 6, tr('Pilha vazia', 'Empty stack'), tr('Não há elemento para remover; o método retorna -1.', 'There is no element to remove; the method returns -1.'), 'warning', { variables: { topo, retorno: -1 }, output: [tr('pop() retornou -1 (pilha vazia).', 'pop() returned -1 (empty stack).')] }));
    steps.push(frame(valores, capacidade, 8, tr('pop() concluído', 'pop() finished'), tr('O algoritmo termina sem alterar a pilha.', 'The algorithm ends without changing the stack.'), 'done', { variables: { topo, retorno: -1 }, output: [tr('pop() retornou -1 (pilha vazia).', 'pop() returned -1 (empty stack).')] }));
    return steps;
  }
  const valor = valores[topo];
  const novosValores = valores.slice(0, -1);
  const novoTopo = topo - 1;
  steps.push(frame(valores, capacidade, 2, tr('Lendo o valor do topo', 'Reading the value at the top'), tr(`retorno recebe pilha[${topo}] = ${fmt(valor)}.`, `result receives stack[${topo}] = ${fmt(valor)}.`), 'reading', { activeIndices: [topo], foundIndices: [topo], variables: { topo, retorno: valor } }));
  steps.push(frame(valores, capacidade, 3, tr('Decrementando o topo', 'Decrementing the top'), tr(`topo passa de ${topo} para ${novoTopo}.`, `top goes from ${topo} to ${novoTopo}.`), 'update', { topo: novoTopo, changedIndices: [topo], variables: { topo: novoTopo, retorno: valor } }));
  steps.push(frame(novosValores, capacidade, 4, tr('Retornando o valor', 'Returning the value'), tr(`pop() retorna ${fmt(valor)}.`, `pop() returns ${fmt(valor)}.`), 'success', { variables: { topo: novoTopo, retorno: valor }, output: [tr(`pop() retornou ${fmt(valor)}.`, `pop() returned ${fmt(valor)}.`)] }));
  steps.push(frame(novosValores, capacidade, 8, tr('pop() concluído', 'pop() finished'), tr(`O elemento removido foi ${fmt(valor)}.`, `The removed element was ${fmt(valor)}.`), 'done', { variables: { topo: novoTopo, retorno: valor }, output: [tr(`pop() retornou ${fmt(valor)}.`, `pop() returned ${fmt(valor)}.`)] }));
  return steps;
}

function peekSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const vazia = topo === -1;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando peek()', 'Calling peek()'), tr('peek() é executado.', 'peek() is executed.')),
    frame(valores, capacidade, 1, tr('Verificando se a pilha está vazia', 'Checking whether the stack is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { activeIndices: topo >= 0 ? [topo] : [], variables: { topo, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 4, tr('Pilha vazia', 'Empty stack'), tr('Não há elemento para consultar; o método retorna -1.', 'There is no element to peek at; the method returns -1.'), 'warning', { variables: { topo, retorno: -1 }, output: [tr('peek() retornou -1 (pilha vazia).', 'peek() returned -1 (empty stack).')] }));
    steps.push(frame(valores, capacidade, 6, tr('peek() concluído', 'peek() finished'), tr('A pilha continua exatamente igual.', 'The stack stays exactly the same.'), 'done', { variables: { topo, retorno: -1 }, output: [tr('peek() retornou -1 (pilha vazia).', 'peek() returned -1 (empty stack).')] }));
    return steps;
  }
  const valor = valores[topo];
  steps.push(frame(valores, capacidade, 2, tr('Lendo pilha[topo]', 'Reading stack[top]'), tr(`pilha[${topo}] contém ${fmt(valor)}.`, `stack[${topo}] holds ${fmt(valor)}.`), 'reading', { activeIndices: [topo], foundIndices: [topo], variables: { topo, retorno: valor } }));
  steps.push(frame(valores, capacidade, 6, tr('peek() concluído', 'peek() finished'), tr(`peek() retornou ${fmt(valor)} sem alterar a pilha.`, `peek() returned ${fmt(valor)} without changing the stack.`), 'done', { foundIndices: [topo], variables: { topo, retorno: valor }, output: [tr(`peek() retornou ${fmt(valor)}.`, `peek() returned ${fmt(valor)}.`)] }));
  return steps;
}

function sizeSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const tamanho = topo + 1;
  return [
    frame(valores, capacidade, 0, tr('Chamando size()', 'Calling size()'), tr('size() é executado.', 'size() is executed.')),
    frame(valores, capacidade, 1, tr('Calculando o tamanho', 'Calculating the size'), tr(`topo + 1 = ${topo} + 1 = ${tamanho}.`, `top + 1 = ${topo} + 1 = ${tamanho}.`), 'reading', { variables: { topo, tamanho } }),
    frame(valores, capacidade, 2, tr('size() concluído', 'size() finished'), tr(`size() retornou ${tamanho}.`, `size() returned ${tamanho}.`), 'done', { variables: { topo, tamanho }, output: [tr(`size() retornou ${tamanho}.`, `size() returned ${tamanho}.`)] }),
  ];
}

function showSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const vazia = topo === -1;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando show()', 'Calling show()'), tr('show() é executado.', 'show() is executed.')),
    frame(valores, capacidade, 1, tr('Inicializando a resposta', 'Initializing the answer'), tr('resposta recebe uma string vazia.', 'answer receives an empty string.'), 'update', { variables: { resposta: '' } }),
    frame(valores, capacidade, 2, tr('Verificando se a pilha está vazia', 'Checking whether the stack is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 3, tr('Pilha vazia', 'Empty stack'), tr('O método retorna a mensagem "Pilha vazia".', 'The method returns the message "Empty stack".'), 'warning', { output: [tr('show() retornou "Pilha vazia".', 'show() returned "Empty stack".')] }));
    steps.push(frame(valores, capacidade, 10, tr('show() concluído', 'show() finished'), tr('A execução termina sem percorrer o vetor.', 'The execution ends without traversing the array.'), 'done', { output: [tr('show() retornou "Pilha vazia".', 'show() returned "Empty stack".')] }));
    return steps;
  }
  const collected = [];
  for (let i = topo; i >= 0; i -= 1) {
    steps.push(frame(valores, capacidade, 5, tr(`Iniciando a iteração i = ${i}`, `Starting the iteration i = ${i}`), tr(`O laço PARA seleciona o índice ${i}, do topo em direção à base.`, `The FOR loop selects index ${i}, from the top toward the base.`), 'reading', { activeIndices: [i], processedIndices: range(topo, i + 1), variables: { i, resposta: collected.map((item) => item.value).join(' | ') } }));
    collected.push({ index: i, value: valores[i] });
    steps.push(frame(valores, capacidade, 6, tr(`Concatenando pilha[${i}]`, `Concatenating stack[${i}]`), tr(`resposta recebe resposta + ${fmt(valores[i])} + quebra de linha.`, `answer receives answer + ${fmt(valores[i])} + line break.`), 'update', { activeIndices: [i], processedIndices: range(topo, i), variables: { i, resposta: collected.map((item) => item.value).join(' | ') } }));
  }
  const respostaFinal = collected.map((item) => item.value).join(' | ');
  const outputLines = collected.map((item) => tr(`pilha[${item.index}] = ${fmt(item.value)}`, `stack[${item.index}] = ${fmt(item.value)}`));
  steps.push(frame(valores, capacidade, 7, tr('Fim do laço PARA', 'End of the FOR loop'), tr('Todas as posições ocupadas já foram visitadas.', 'All occupied positions have been visited.'), 'reading', { processedIndices: range(topo + 1), variables: { resposta: respostaFinal } }));
  steps.push(frame(valores, capacidade, 9, tr('Retornando a resposta', 'Returning the answer'), tr('A string montada é devolvida ao chamador.', 'The built string is handed back to the caller.'), 'success', { processedIndices: range(topo + 1), variables: { resposta: respostaFinal }, output: outputLines }));
  steps.push(frame(valores, capacidade, 10, tr('show() concluído', 'show() finished'), tr('A pilha continua exatamente igual; nada foi removido.', 'The stack stays exactly the same; nothing was removed.'), 'done', { processedIndices: range(topo + 1), variables: { resposta: respostaFinal }, output: outputLines }));
  return steps;
}

export function buildSteps(id, data, config) {
  const { capacity, values } = data;
  switch (id) {
    case 'creation': return creationSteps(capacity);
    case 'isFull': return isFullSteps(values, capacity);
    case 'isEmpty': return isEmptySteps(values, capacity);
    case 'push': return pushSteps(values, capacity, config.pushValue);
    case 'pop': return popSteps(values, capacity);
    case 'peek': return peekSteps(values, capacity);
    case 'size': return sizeSteps(values, capacity);
    case 'show': return showSteps(values, capacity);
    default: return creationSteps(capacity);
  }
}
