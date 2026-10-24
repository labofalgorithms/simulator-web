import { locale, tr } from '../../core/i18n.js';
export const algorithms = [
  {
    id: 'creation', title: tr('Criação da lista estática', 'Static list creation'), menuLabel: tr('Criação da lista', 'List creation'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Veja como o vetor interno é alocado e o atributo tamanho é iniciado com 0.', 'See how the internal array is allocated and the size attribute starts at 0.'),
    interaction: tr('Ajuste a capacidade da lista e observe a estrutura sendo criada vazia.', 'Adjust the list capacity and watch the structure being created empty.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('A criação aloca um vetor de tamanho fixo igual à capacidade.', 'Creation allocates a fixed-size array equal to the capacity.') },
    pseudocode: [tr('CONSTRUTOR ListaEstatica(maxTamanho)', 'CONSTRUCTOR StaticList(maxSize)'), tr('  tamanho ← 0', '  size ← 0'), tr('  vetorLista ← novo vetor[maxTamanho]', '  listArray ← new array[maxSize]'), tr('FIM', 'END')],
  },
  {
    id: 'isFull', title: tr('Verificar se está cheia', 'Check if it is full'), menuLabel: 'isFull()', group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Compare a quantidade atual de elementos com a capacidade do vetor.', 'Compare the current number of elements with the capacity of the array.'),
    interaction: tr('Altere a quantidade de elementos e observe quando o resultado muda para verdadeiro.', 'Change the number of elements and watch when the result turns true.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas uma comparação é realizada, sem percorrer o vetor.', 'Only one comparison is made, without traversing the array.') },
    pseudocode: [tr('FUNÇÃO isFull()', 'FUNCTION isFull()'), tr('  RETORNE tamanho == vetorLista.length', '  RETURN size == listArray.length'), tr('FIM', 'END')],
  },
  {
    id: 'isEmpty', title: tr('Verificar se está vazia', 'Check if it is empty'), menuLabel: 'isEmpty()', group: tr('Fundamentos', 'Fundamentals'), number: '03',
    description: tr('Compare o atributo tamanho com 0.', 'Compare the size attribute with 0.'),
    interaction: tr('Esvazie a lista para ver o retorno mudar para verdadeiro.', 'Empty the list to see the result turn true.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Apenas uma comparação é realizada.', 'Only one comparison is made.') },
    pseudocode: [tr('FUNÇÃO isEmpty()', 'FUNCTION isEmpty()'), tr('  RETORNE tamanho == 0', '  RETURN size == 0'), tr('FIM', 'END')],
  },
  {
    id: 'add', title: tr('Inserir em uma posição', 'Insert at a position'), menuLabel: 'add()', group: tr('Operações', 'Operations'), number: '04',
    description: tr('Insira um novo elemento em uma posição específica, deslocando os demais para a direita.', 'Insert a new element at a specific position, shifting the others to the right.'),
    interaction: tr('Escolha a posição e o valor. Compare inserir no início, no meio e no final.', 'Choose the position and the value. Compare inserting at the start, the middle and the end.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso, todos os elementos à direita da posição são deslocados.', 'In the worst case, every element to the right of the position is shifted.') },
    pseudocode: [tr('FUNÇÃO add(posição, valor)', 'FUNCTION add(position, value)'), tr('  SE isFull() ENTÃO', '  IF isFull() THEN'), tr('    ESCREVA "A lista está cheia"', '    PRINT "The list is full"'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  SE posição < 0 OU posição > tamanho ENTÃO', '  IF position < 0 OR position > size THEN'), tr('    ESCREVA "Posição inválida"', '    PRINT "Invalid position"'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  PARA i DE tamanho ATÉ posição + 1, DECREMENTANDO FAÇA', '  FOR i FROM size TO position + 1, DECREMENTING DO'), tr('    vetorLista[i] ← vetorLista[i - 1]', '    listArray[i] ← listArray[i - 1]'), tr('  FIM PARA', '  END FOR'), tr('  vetorLista[posição] ← valor', '  listArray[position] ← value'), tr('  tamanho ← tamanho + 1', '  size ← size + 1'), tr('  RETORNE verdadeiro', '  RETURN true'), tr('FIM', 'END')],
  },
  {
    id: 'remove', title: tr('Remover de uma posição', 'Remove from a position'), menuLabel: 'remove()', group: tr('Operações', 'Operations'), number: '05',
    description: tr('Remova o elemento de uma posição específica, deslocando os demais para a esquerda.', 'Remove the element at a specific position, shifting the others to the left.'),
    interaction: tr('Remova elementos do início, do meio e do final e compare o deslocamento.', 'Remove elements from the start, the middle and the end and compare the shifting.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso, todos os elementos à direita da posição são deslocados.', 'In the worst case, every element to the right of the position is shifted.') },
    pseudocode: [tr('FUNÇÃO remove(posição)', 'FUNCTION remove(position)'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    ESCREVA "A lista está vazia"', '    PRINT "The list is empty"'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  SE posição < 0 OU posição >= tamanho ENTÃO', '  IF position < 0 OR position >= size THEN'), tr('    ESCREVA "Posição inválida"', '    PRINT "Invalid position"'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  PARA i DE posição ATÉ tamanho - 2 FAÇA', '  FOR i FROM position TO size - 2 DO'), tr('    vetorLista[i] ← vetorLista[i + 1]', '    listArray[i] ← listArray[i + 1]'), tr('  FIM PARA', '  END FOR'), tr('  tamanho ← tamanho - 1', '  size ← size - 1'), tr('  RETORNE verdadeiro', '  RETURN true'), tr('FIM', 'END')],
  },
  {
    id: 'set', title: tr('Substituir um elemento', 'Replace an element'), menuLabel: 'set()', group: tr('Operações', 'Operations'), number: '06',
    description: tr('Substitua o valor armazenado em uma posição específica, sem deslocar elementos.', 'Replace the value stored at a specific position, without shifting elements.'),
    interaction: tr('Escolha uma posição válida e um novo valor.', 'Choose a valid position and a new value.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O valor é escrito diretamente na posição informada.', 'The value is written directly at the given position.') },
    pseudocode: [tr('FUNÇÃO set(posição, valor)', 'FUNCTION set(position, value)'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    ESCREVA "A lista está vazia"', '    PRINT "The list is empty"'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  SE posição < 0 OU posição >= tamanho ENTÃO', '  IF position < 0 OR position >= size THEN'), tr('    ESCREVA "Posição inválida"', '    PRINT "Invalid position"'), tr('    RETORNE falso', '    RETURN false'), tr('  FIM SE', '  END IF'), tr('  vetorLista[posição] ← valor', '  listArray[position] ← value'), tr('  RETORNE verdadeiro', '  RETURN true'), tr('FIM', 'END')],
  },
  {
    id: 'get', title: tr('Consultar uma posição', 'Query a position'), menuLabel: 'get()', group: tr('Consultas', 'Queries'), number: '07',
    description: tr('Retorne o elemento armazenado em uma posição específica.', 'Return the element stored at a specific position.'),
    interaction: tr('Escolha uma posição válida e uma inválida para comparar o retorno.', 'Choose a valid position and an invalid one to compare the return.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Como a lista usa vetor, o acesso é direto pelo índice.', 'Since the list uses an array, access is direct by index.') },
    pseudocode: [tr('FUNÇÃO get(posição)', 'FUNCTION get(position)'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    ESCREVA "A lista está vazia"', '    PRINT "The list is empty"'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('  SE posição < 0 OU posição >= tamanho ENTÃO', '  IF position < 0 OR position >= size THEN'), tr('    ESCREVA "Posição inválida"', '    PRINT "Invalid position"'), tr('    RETORNE -1', '    RETURN -1'), tr('  FIM SE', '  END IF'), tr('  RETORNE vetorLista[posição]', '  RETURN listArray[position]'), tr('FIM', 'END')],
  },
  {
    id: 'show', title: tr('Mostrar elementos', 'Show elements'), menuLabel: 'show()', group: tr('Consultas', 'Queries'), number: '08',
    description: tr('Percorra a parte lógica da lista, da posição 0 até tamanho - 1, montando o texto.', 'Walk the logical part of the list, from position 0 to size - 1, building the text.'),
    interaction: tr('Acompanhe a variável i crescendo e o texto sendo montado aos poucos.', 'Follow the variable i growing and the text being built little by little.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('Somente a parte lógica da lista é percorrida, não o vetor inteiro.', 'Only the logical part of the list is traversed, not the whole array.') },
    pseudocode: [tr('FUNÇÃO show()', 'FUNCTION show()'), tr('  SE isEmpty() ENTÃO', '  IF isEmpty() THEN'), tr('    RETORNE "A lista está vazia."', '    RETURN "The list is empty."'), tr('  FIM SE', '  END IF'), tr('  texto ← "["', '  text ← "["'), tr('  PARA i DE 0 ATÉ tamanho - 1 FAÇA', '  FOR i FROM 0 TO size - 1 DO'), tr('    texto ← texto + vetorLista[i]', '    text ← text + listArray[i]'), tr('    SE i < tamanho - 1 ENTÃO', '    IF i < size - 1 THEN'), tr('      texto ← texto + ", "', '      text ← text + ", "'), tr('    FIM SE', '    END IF'), tr('  FIM PARA', '  END FOR'), tr('  texto ← texto + "]"', '  text ← text + "]"'), tr('  RETORNE texto', '  RETURN text'), tr('FIM', 'END')],
  },
  {
    id: 'size', title: tr('Tamanho da lista', 'List size'), menuLabel: 'size()', group: tr('Consultas', 'Queries'), number: '09',
    description: tr('Retorne a quantidade atual de elementos válidos da lista.', 'Return the current number of valid elements in the list.'),
    interaction: tr('Compare com a capacidade total do vetor mostrada ao lado.', 'Compare it with the total capacity of the array shown beside.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Não há laço, deslocamento ou alteração da estrutura.', 'There is no loop, shifting or change to the structure.') },
    pseudocode: [tr('FUNÇÃO size()', 'FUNCTION size()'), tr('  RETORNE tamanho', '  RETURN size'), tr('FIM', 'END')],
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString(locale, { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

const frame = (values, capacidade, line, title, description, tone = 'neutral', extra = {}) => ({
  values: clone(values), capacidade, tamanho: values.length, line, title, description, tone, variables: {}, output: [], ...extra,
});

function creationSteps(capacidade) {
  const empty = [];
  return [
    frame(empty, capacidade, 0, tr('Chamando o construtor', 'Calling the constructor'), tr(`ListaEstatica lista = new ListaEstatica(${capacidade}) é executado.`, `StaticList list = new StaticList(${capacidade}) is executed.`)),
    frame(empty, capacidade, 1, tr('Iniciando o tamanho', 'Initializing the size'), tr('tamanho recebe 0, pois nenhum elemento foi inserido ainda.', 'size receives 0, since no element has been inserted yet.'), 'update', { variables: { tamanho: 0 } }),
    frame(empty, capacidade, 2, tr('Alocando o vetor', 'Allocating the array'), tr(`Um vetor de ${capacidade} posições é reservado na memória.`, `An array of ${capacidade} positions is reserved in memory.`), 'reading', { variables: { tamanho: 0, capacidade } }),
    frame(empty, capacidade, 3, tr('Lista criada', 'List created'), tr(`A lista foi criada com capacidade ${capacidade} e 0 elementos.`, `The list was created with capacity ${capacidade} and 0 elements.`), 'done', { variables: { tamanho: 0, capacidade }, output: [tr(`Lista criada com capacidade ${capacidade}.`, `List created with capacity ${capacidade}.`)] }),
  ];
}

function isFullSteps(valores, capacidade) {
  const tamanho = valores.length;
  const full = tamanho === capacidade;
  return [
    frame(valores, capacidade, 0, tr('Chamando isFull()', 'Calling isFull()'), tr('O algoritmo verifica se a lista já atingiu a capacidade máxima.', 'The algorithm checks whether the list has already reached its maximum capacity.')),
    frame(valores, capacidade, 1, tr('Comparando tamanho com a capacidade', 'Comparing size with the capacity'), tr(`tamanho (${tamanho}) == vetorLista.length (${capacidade}) é ${full ? 'verdadeiro' : 'falso'}.`, `size (${tamanho}) == listArray.length (${capacidade}) is ${full ? 'true' : 'false'}.`), 'comparison', { variables: { tamanho, capacidadeVetor: capacidade } }),
    frame(valores, capacidade, 2, tr('isFull() concluído', 'isFull() finished'), tr(`O método retorna ${full}.`, `The method returns ${full}.`), 'done', { variables: { tamanho, cheia: full }, output: [tr(`isFull() retornou ${full}.`, `isFull() returned ${full}.`)] }),
  ];
}

function isEmptySteps(valores, capacidade) {
  const tamanho = valores.length;
  const empty = tamanho === 0;
  return [
    frame(valores, capacidade, 0, tr('Chamando isEmpty()', 'Calling isEmpty()'), tr('O algoritmo verifica se a lista possui elementos válidos.', 'The algorithm checks whether the list has valid elements.')),
    frame(valores, capacidade, 1, tr('Comparando tamanho com 0', 'Comparing size with 0'), tr(`tamanho == 0 é ${empty ? 'verdadeiro' : 'falso'}.`, `size == 0 is ${empty ? 'true' : 'false'}.`), 'comparison', { variables: { tamanho } }),
    frame(valores, capacidade, 2, tr('isEmpty() concluído', 'isEmpty() finished'), tr(`O método retorna ${empty}.`, `The method returns ${empty}.`), 'done', { variables: { tamanho, vazia: empty }, output: [tr(`isEmpty() retornou ${empty}.`, `isEmpty() returned ${empty}.`)] }),
  ];
}

function addSteps(valores, capacidade, posicao, valor) {
  const tamanho = valores.length;
  const cheia = tamanho >= capacidade;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando add(posição, valor)', 'Calling add(position, value)'), tr(`add(${posicao}, ${fmt(valor)}) é executado.`, `add(${posicao}, ${fmt(valor)}) is executed.`)),
    frame(valores, capacidade, 1, tr('Verificando se a lista está cheia', 'Checking whether the list is full'), tr(`isFull() retorna ${cheia}.`, `isFull() returns ${cheia}.`), 'comparison', { variables: { tamanho, cheia } }),
  ];
  if (cheia) {
    steps.push(frame(valores, capacidade, 2, tr('Lista cheia', 'List full'), tr('A lista atingiu a capacidade máxima; a inserção não pode ocorrer.', 'The list reached its maximum capacity; the insertion cannot happen.'), 'warning', { output: [tr('A lista está cheia.', 'The list is full.')] }));
    steps.push(frame(valores, capacidade, 15, tr('add() concluído', 'add() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr('A lista está cheia.', 'The list is full.'), tr('add() retornou false.', 'add() returned false.')] }));
    return steps;
  }

  const invalido = !Number.isInteger(posicao) || posicao < 0 || posicao > tamanho;
  steps.push(frame(valores, capacidade, 5, tr('Validando a posição', 'Validating the position'), tr(`posição < 0 OU posição > tamanho (${tamanho}) é ${invalido}.`, `position < 0 OR position > size (${tamanho}) is ${invalido}.`), 'comparison', { activeIndices: !invalido && posicao < tamanho ? [posicao] : [], variables: { posicao, tamanho, valido: !invalido } }));
  if (invalido) {
    steps.push(frame(valores, capacidade, 6, tr('Posição inválida', 'Invalid position'), tr('A posição informada está fora do intervalo permitido (0 até tamanho).', 'The given position is outside the allowed range (0 to size).'), 'warning', { output: [tr('Posição inválida.', 'Invalid position.')] }));
    steps.push(frame(valores, capacidade, 15, tr('add() concluído', 'add() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr('Posição inválida.', 'Invalid position.'), tr('add() retornou false.', 'add() returned false.')] }));
    return steps;
  }

  let working = [...valores, null];
  for (let i = tamanho; i > posicao; i -= 1) {
    steps.push(frame(working, capacidade, 9, tr(`Iniciando a iteração i = ${i}`, `Starting the iteration i = ${i}`), tr(`O laço PARA seleciona o índice ${i} para receber o valor anterior.`, `The FOR loop selects index ${i} to receive the previous value.`), 'reading', { tamanho, activeIndices: [i, i - 1], variables: { i } }));
    working = clone(working);
    working[i] = working[i - 1];
    steps.push(frame(working, capacidade, 10, tr(`Deslocando vetorLista[${i - 1}] para a posição ${i}`, `Shifting listArray[${i - 1}] to position ${i}`), tr(`vetorLista[${i}] recebe ${fmt(working[i])}.`, `listArray[${i}] receives ${fmt(working[i])}.`), 'update', { tamanho, activeIndices: [i, i - 1], changedIndices: [i], variables: { i } }));
  }
  steps.push(frame(working, capacidade, 11, tr('Fim do laço PARA', 'End of the FOR loop'), tr('Foi aberto espaço na posição desejada.', 'Room was made at the desired position.'), 'reading', { tamanho, variables: { posicao } }));

  working = clone(working);
  working[posicao] = valor;
  steps.push(frame(working, capacidade, 12, tr('Escrevendo o novo valor', 'Writing the new value'), tr(`vetorLista[${posicao}] recebe ${fmt(valor)}.`, `listArray[${posicao}] receives ${fmt(valor)}.`), 'update', { tamanho, activeIndices: [posicao], changedIndices: [posicao], variables: { posicao, valor } }));

  const novoTamanho = tamanho + 1;
  steps.push(frame(working, capacidade, 13, tr('Incrementando tamanho', 'Incrementing size'), tr(`tamanho passa de ${tamanho} para ${novoTamanho}.`, `size goes from ${tamanho} to ${novoTamanho}.`), 'update', { variables: { tamanho: novoTamanho } }));
  steps.push(frame(working, capacidade, 14, tr('Retornando verdadeiro', 'Returning true'), tr(`O valor ${fmt(valor)} foi inserido na posição ${posicao}.`, `The value ${fmt(valor)} was inserted at position ${posicao}.`), 'success', { foundIndices: [posicao], variables: { tamanho: novoTamanho }, output: [tr(`add(${posicao}, ${fmt(valor)}) inseriu o valor na posição ${posicao}.`, `add(${posicao}, ${fmt(valor)}) inserted the value at position ${posicao}.`)] }));
  steps.push(frame(working, capacidade, 15, tr('add() concluído', 'add() finished'), tr('Os elementos à direita da posição foram deslocados uma casa.', 'The elements to the right of the position were shifted one slot.'), 'done', { foundIndices: [posicao], variables: { tamanho: novoTamanho }, output: [tr(`add(${posicao}, ${fmt(valor)}) inseriu o valor na posição ${posicao}.`, `add(${posicao}, ${fmt(valor)}) inserted the value at position ${posicao}.`)] }));
  return steps;
}

function removeSteps(valores, capacidade, posicao) {
  const tamanho = valores.length;
  const vazia = tamanho === 0;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando remove(posição)', 'Calling remove(position)'), tr(`remove(${posicao}) é executado.`, `remove(${posicao}) is executed.`)),
    frame(valores, capacidade, 1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { tamanho, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 2, tr('Lista vazia', 'List empty'), tr('Não há elemento para remover.', 'There is no element to remove.'), 'warning', { output: [tr('A lista está vazia.', 'The list is empty.')] }));
    steps.push(frame(valores, capacidade, 14, tr('remove() concluído', 'remove() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr('A lista está vazia.', 'The list is empty.'), tr('remove() retornou false.', 'remove() returned false.')] }));
    return steps;
  }

  const invalido = !Number.isInteger(posicao) || posicao < 0 || posicao >= tamanho;
  steps.push(frame(valores, capacidade, 5, tr('Validando a posição', 'Validating the position'), tr(`posição < 0 OU posição >= tamanho (${tamanho}) é ${invalido}.`, `position < 0 OR position >= size (${tamanho}) is ${invalido}.`), 'comparison', { activeIndices: !invalido ? [posicao] : [], variables: { posicao, tamanho, valido: !invalido } }));
  if (invalido) {
    steps.push(frame(valores, capacidade, 6, tr('Posição inválida', 'Invalid position'), tr('A posição informada está fora do intervalo permitido (0 até tamanho - 1).', 'The given position is outside the allowed range (0 to size - 1).'), 'warning', { output: [tr('Posição inválida.', 'Invalid position.')] }));
    steps.push(frame(valores, capacidade, 14, tr('remove() concluído', 'remove() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr('Posição inválida.', 'Invalid position.'), tr('remove() retornou false.', 'remove() returned false.')] }));
    return steps;
  }

  const removido = valores[posicao];
  let working = clone(valores);
  for (let i = posicao; i <= tamanho - 2; i += 1) {
    steps.push(frame(working, capacidade, 9, tr(`Iniciando a iteração i = ${i}`, `Starting the iteration i = ${i}`), tr(`O laço PARA seleciona o índice ${i} para receber o valor seguinte.`, `The FOR loop selects index ${i} to receive the next value.`), 'reading', { tamanho, activeIndices: [i, i + 1], variables: { i } }));
    working = clone(working);
    working[i] = working[i + 1];
    steps.push(frame(working, capacidade, 10, tr(`Deslocando vetorLista[${i + 1}] para a posição ${i}`, `Shifting listArray[${i + 1}] to position ${i}`), tr(`vetorLista[${i}] recebe ${fmt(working[i])}.`, `listArray[${i}] receives ${fmt(working[i])}.`), 'update', { tamanho, activeIndices: [i, i + 1], changedIndices: [i], variables: { i } }));
  }
  steps.push(frame(working, capacidade, 11, tr('Fim do laço PARA', 'End of the FOR loop'), tr('Os elementos à direita da posição já foram deslocados uma casa para a esquerda.', 'The elements to the right of the position have already been shifted one slot to the left.'), 'reading', { tamanho, variables: { posicao } }));

  const novosValores = working.slice(0, tamanho - 1);
  const novoTamanho = tamanho - 1;
  steps.push(frame(novosValores, capacidade, 12, tr('Decrementando tamanho', 'Decrementing size'), tr(`tamanho passa de ${tamanho} para ${novoTamanho}.`, `size goes from ${tamanho} to ${novoTamanho}.`), 'update', { variables: { tamanho: novoTamanho } }));
  steps.push(frame(novosValores, capacidade, 13, tr('Retornando verdadeiro', 'Returning true'), tr(`O elemento ${fmt(removido)} foi removido da posição ${posicao}.`, `The element ${fmt(removido)} was removed from position ${posicao}.`), 'success', { variables: { tamanho: novoTamanho }, output: [tr(`remove(${posicao}) removeu o valor ${fmt(removido)}.`, `remove(${posicao}) removed the value ${fmt(removido)}.`)] }));
  steps.push(frame(novosValores, capacidade, 14, tr('remove() concluído', 'remove() finished'), tr('A última posição física deixou de pertencer à lista lógica.', 'The last physical position no longer belongs to the logical list.'), 'done', { variables: { tamanho: novoTamanho }, output: [tr(`remove(${posicao}) removeu o valor ${fmt(removido)}.`, `remove(${posicao}) removed the value ${fmt(removido)}.`)] }));
  return steps;
}

function setSteps(valores, capacidade, posicao, valor) {
  const tamanho = valores.length;
  const vazia = tamanho === 0;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando set(posição, valor)', 'Calling set(position, value)'), tr(`set(${posicao}, ${fmt(valor)}) é executado.`, `set(${posicao}, ${fmt(valor)}) is executed.`)),
    frame(valores, capacidade, 1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { tamanho, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 2, tr('Lista vazia', 'List empty'), tr('Não há posição válida para alterar.', 'There is no valid position to change.'), 'warning', { output: [tr('A lista está vazia.', 'The list is empty.')] }));
    steps.push(frame(valores, capacidade, 11, tr('set() concluído', 'set() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr('A lista está vazia.', 'The list is empty.'), tr('set() retornou false.', 'set() returned false.')] }));
    return steps;
  }

  const invalido = !Number.isInteger(posicao) || posicao < 0 || posicao >= tamanho;
  steps.push(frame(valores, capacidade, 5, tr('Validando a posição', 'Validating the position'), tr(`posição < 0 OU posição >= tamanho (${tamanho}) é ${invalido}.`, `position < 0 OR position >= size (${tamanho}) is ${invalido}.`), 'comparison', { activeIndices: !invalido ? [posicao] : [], variables: { posicao, tamanho, valido: !invalido } }));
  if (invalido) {
    steps.push(frame(valores, capacidade, 6, tr('Posição inválida', 'Invalid position'), tr('A posição informada está fora do intervalo permitido (0 até tamanho - 1).', 'The given position is outside the allowed range (0 to size - 1).'), 'warning', { output: [tr('Posição inválida.', 'Invalid position.')] }));
    steps.push(frame(valores, capacidade, 11, tr('set() concluído', 'set() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr('Posição inválida.', 'Invalid position.'), tr('set() retornou false.', 'set() returned false.')] }));
    return steps;
  }

  const valorAnterior = valores[posicao];
  const novosValores = clone(valores);
  novosValores[posicao] = valor;
  steps.push(frame(novosValores, capacidade, 9, tr('Escrevendo o novo valor', 'Writing the new value'), tr(`vetorLista[${posicao}] recebe ${fmt(valor)}.`, `listArray[${posicao}] receives ${fmt(valor)}.`), 'update', { activeIndices: [posicao], changedIndices: [posicao], variables: { posicao, valorAnterior, valor } }));
  steps.push(frame(novosValores, capacidade, 10, tr('Retornando verdadeiro', 'Returning true'), tr(`${fmt(valorAnterior)} foi substituído por ${fmt(valor)}.`, `${fmt(valorAnterior)} was replaced by ${fmt(valor)}.`), 'success', { foundIndices: [posicao], variables: { posicao, valorAnterior, valor }, output: [tr(`set(${posicao}, ${fmt(valor)}) substituiu ${fmt(valorAnterior)} por ${fmt(valor)}.`, `set(${posicao}, ${fmt(valor)}) replaced ${fmt(valorAnterior)} with ${fmt(valor)}.`)] }));
  steps.push(frame(novosValores, capacidade, 11, tr('set() concluído', 'set() finished'), tr('O tamanho da lista não se altera.', 'The size of the list does not change.'), 'done', { foundIndices: [posicao], variables: { posicao, valorAnterior, valor }, output: [tr(`set(${posicao}, ${fmt(valor)}) substituiu ${fmt(valorAnterior)} por ${fmt(valor)}.`, `set(${posicao}, ${fmt(valor)}) replaced ${fmt(valorAnterior)} with ${fmt(valor)}.`)] }));
  return steps;
}

function getSteps(valores, capacidade, posicao) {
  const tamanho = valores.length;
  const vazia = tamanho === 0;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando get(posição)', 'Calling get(position)'), tr(`get(${posicao}) é executado.`, `get(${posicao}) is executed.`)),
    frame(valores, capacidade, 1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { tamanho, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 3, tr('Lista vazia', 'List empty'), tr('Não há elemento para consultar.', 'There is no element to query.'), 'warning', { variables: { retorno: -1 }, output: [tr('get() retornou -1 (lista vazia).', 'get() returned -1 (empty list).')] }));
    steps.push(frame(valores, capacidade, 9, tr('get() concluído', 'get() finished'), tr('A lista continua exatamente igual.', 'The list stays exactly the same.'), 'done', { variables: { retorno: -1 }, output: [tr('get() retornou -1 (lista vazia).', 'get() returned -1 (empty list).')] }));
    return steps;
  }

  const invalido = !Number.isInteger(posicao) || posicao < 0 || posicao >= tamanho;
  steps.push(frame(valores, capacidade, 5, tr('Validando a posição', 'Validating the position'), tr(`posição < 0 OU posição >= tamanho (${tamanho}) é ${invalido}.`, `position < 0 OR position >= size (${tamanho}) is ${invalido}.`), 'comparison', { activeIndices: !invalido ? [posicao] : [], variables: { posicao, tamanho, valido: !invalido } }));
  if (invalido) {
    steps.push(frame(valores, capacidade, 7, tr('Posição inválida', 'Invalid position'), tr('A posição informada está fora do intervalo permitido (0 até tamanho - 1).', 'The given position is outside the allowed range (0 to size - 1).'), 'warning', { variables: { retorno: -1 }, output: [tr('get() retornou -1 (posição inválida).', 'get() returned -1 (invalid position).')] }));
    steps.push(frame(valores, capacidade, 9, tr('get() concluído', 'get() finished'), tr('A lista continua exatamente igual.', 'The list stays exactly the same.'), 'done', { variables: { retorno: -1 }, output: [tr('get() retornou -1 (posição inválida).', 'get() returned -1 (invalid position).')] }));
    return steps;
  }

  const valor = valores[posicao];
  steps.push(frame(valores, capacidade, 9, tr('Retornando o valor', 'Returning the value'), tr(`vetorLista[${posicao}] contém ${fmt(valor)}.`, `listArray[${posicao}] holds ${fmt(valor)}.`), 'success', { activeIndices: [posicao], foundIndices: [posicao], variables: { posicao, retorno: valor }, output: [tr(`get(${posicao}) retornou ${fmt(valor)}.`, `get(${posicao}) returned ${fmt(valor)}.`)] }));
  steps.push(frame(valores, capacidade, 10, tr('get() concluído', 'get() finished'), tr('A lista continua exatamente igual.', 'The list stays exactly the same.'), 'done', { foundIndices: [posicao], variables: { posicao, retorno: valor }, output: [tr(`get(${posicao}) retornou ${fmt(valor)}.`, `get(${posicao}) returned ${fmt(valor)}.`)] }));
  return steps;
}

function showSteps(valores, capacidade) {
  const tamanho = valores.length;
  const vazia = tamanho === 0;
  const steps = [
    frame(valores, capacidade, 0, tr('Chamando show()', 'Calling show()'), tr('show() é executado.', 'show() is executed.')),
    frame(valores, capacidade, 1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`isEmpty() retorna ${vazia}.`, `isEmpty() returns ${vazia}.`), 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 2, tr('Lista vazia', 'List empty'), tr('O método retorna a mensagem "A lista está vazia.".', 'The method returns the message "The list is empty.".'), 'warning', { output: [tr('show() retornou "A lista está vazia.".', 'show() returned "The list is empty.".')] }));
    steps.push(frame(valores, capacidade, 13, tr('show() concluído', 'show() finished'), tr('A execução termina sem percorrer o vetor.', 'The execution ends without traversing the array.'), 'done', { output: [tr('show() retornou "A lista está vazia.".', 'show() returned "The list is empty.".')] }));
    return steps;
  }

  let texto = '[';
  steps.push(frame(valores, capacidade, 4, tr('Inicializando o texto', 'Initializing the text'), tr('texto recebe o caractere de abertura "[".', 'text receives the opening character "[".'), 'update', { variables: { texto } }));
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, capacidade, 5, tr(`Iniciando a iteração i = ${i}`, `Starting the iteration i = ${i}`), tr(`O laço PARA seleciona o índice ${i}.`, `The FOR loop selects index ${i}.`), 'reading', { activeIndices: [i], processedIndices: range(i), variables: { i, texto } }));
    texto += fmt(valores[i]);
    steps.push(frame(valores, capacidade, 6, tr(`Concatenando vetorLista[${i}]`, `Concatenating listArray[${i}]`), tr(`texto recebe texto + ${fmt(valores[i])}.`, `text receives text + ${fmt(valores[i])}.`), 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { i, texto } }));
    if (i < tamanho - 1) {
      texto += ', ';
      steps.push(frame(valores, capacidade, 8, tr('Adicionando separador', 'Adding a separator'), tr('texto recebe texto + ", ".', 'text receives text + ", ".'), 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { i, texto } }));
    }
  }
  texto += ']';
  steps.push(frame(valores, capacidade, 11, tr('Fechando o texto', 'Closing the text'), tr('texto recebe texto + "]".', 'text receives text + "]".'), 'update', { processedIndices: range(tamanho), variables: { texto } }));
  steps.push(frame(valores, capacidade, 12, tr('Retornando o texto', 'Returning the text'), tr(`show() retorna ${texto}.`, `show() returns ${texto}.`), 'success', { processedIndices: range(tamanho), variables: { texto }, output: [tr(`show() retornou ${texto}.`, `show() returned ${texto}.`)] }));
  return steps;
}

function sizeSteps(valores, capacidade) {
  const tamanho = valores.length;
  return [
    frame(valores, capacidade, 0, tr('Chamando size()', 'Calling size()'), tr('size() é executado.', 'size() is executed.')),
    frame(valores, capacidade, 1, tr('Retornando tamanho', 'Returning size'), tr(`O atributo tamanho vale ${tamanho}.`, `The size attribute is ${tamanho}.`), 'reading', { variables: { tamanho } }),
    frame(valores, capacidade, 2, tr('size() concluído', 'size() finished'), tr(`size() retornou ${tamanho}.`, `size() returned ${tamanho}.`), 'done', { variables: { tamanho }, output: [tr(`size() retornou ${tamanho}.`, `size() returned ${tamanho}.`)] }),
  ];
}

export function buildSteps(id, data, config) {
  const { capacity, values } = data;
  switch (id) {
    case 'creation': return creationSteps(capacity);
    case 'isFull': return isFullSteps(values, capacity);
    case 'isEmpty': return isEmptySteps(values, capacity);
    case 'add': return addSteps(values, capacity, config.position, config.value);
    case 'remove': return removeSteps(values, capacity, config.position);
    case 'set': return setSteps(values, capacity, config.position, config.value);
    case 'get': return getSteps(values, capacity, config.position);
    case 'show': return showSteps(values, capacity);
    case 'size': return sizeSteps(values, capacity);
    default: return creationSteps(capacity);
  }
}
