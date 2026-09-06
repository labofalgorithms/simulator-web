export const algorithms = [
  {
    id: 'creation', title: 'Criação da lista estática', menuLabel: 'Criação da lista', group: 'Fundamentos', number: '01',
    description: 'Veja como o vetor interno é alocado e o atributo tamanho é iniciado com 0.',
    interaction: 'Ajuste a capacidade da lista e observe a estrutura sendo criada vazia.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'A criação aloca um vetor de tamanho fixo igual à capacidade.' },
    pseudocode: ['CONSTRUTOR ListaEstatica(maxTamanho)', '  tamanho ← 0', '  vetorLista ← novo vetor[maxTamanho]', 'FIM'],
  },
  {
    id: 'isFull', title: 'Verificar se está cheia', menuLabel: 'isFull()', group: 'Fundamentos', number: '02',
    description: 'Compare a quantidade atual de elementos com a capacidade do vetor.',
    interaction: 'Altere a quantidade de elementos e observe quando o resultado muda para verdadeiro.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas uma comparação é realizada, sem percorrer o vetor.' },
    pseudocode: ['FUNÇÃO isFull()', '  RETORNE tamanho == vetorLista.length', 'FIM'],
  },
  {
    id: 'isEmpty', title: 'Verificar se está vazia', menuLabel: 'isEmpty()', group: 'Fundamentos', number: '03',
    description: 'Compare o atributo tamanho com 0.',
    interaction: 'Esvazie a lista para ver o retorno mudar para verdadeiro.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas uma comparação é realizada.' },
    pseudocode: ['FUNÇÃO isEmpty()', '  RETORNE tamanho == 0', 'FIM'],
  },
  {
    id: 'add', title: 'Inserir em uma posição', menuLabel: 'add()', group: 'Operações', number: '04',
    description: 'Insira um novo elemento em uma posição específica, deslocando os demais para a direita.',
    interaction: 'Escolha a posição e o valor. Compare inserir no início, no meio e no final.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, todos os elementos à direita da posição são deslocados.' },
    pseudocode: ['FUNÇÃO add(posição, valor)', '  SE isFull() ENTÃO', '    ESCREVA "A lista está cheia"', '    RETORNE falso', '  FIM SE', '  SE posição < 0 OU posição > tamanho ENTÃO', '    ESCREVA "Posição inválida"', '    RETORNE falso', '  FIM SE', '  PARA i DE tamanho ATÉ posição + 1, DECREMENTANDO FAÇA', '    vetorLista[i] ← vetorLista[i - 1]', '  FIM PARA', '  vetorLista[posição] ← valor', '  tamanho ← tamanho + 1', '  RETORNE verdadeiro', 'FIM'],
  },
  {
    id: 'remove', title: 'Remover de uma posição', menuLabel: 'remove()', group: 'Operações', number: '05',
    description: 'Remova o elemento de uma posição específica, deslocando os demais para a esquerda.',
    interaction: 'Remova elementos do início, do meio e do final e compare o deslocamento.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, todos os elementos à direita da posição são deslocados.' },
    pseudocode: ['FUNÇÃO remove(posição)', '  SE isEmpty() ENTÃO', '    ESCREVA "A lista está vazia"', '    RETORNE falso', '  FIM SE', '  SE posição < 0 OU posição >= tamanho ENTÃO', '    ESCREVA "Posição inválida"', '    RETORNE falso', '  FIM SE', '  PARA i DE posição ATÉ tamanho - 2 FAÇA', '    vetorLista[i] ← vetorLista[i + 1]', '  FIM PARA', '  tamanho ← tamanho - 1', '  RETORNE verdadeiro', 'FIM'],
  },
  {
    id: 'set', title: 'Substituir um elemento', menuLabel: 'set()', group: 'Operações', number: '06',
    description: 'Substitua o valor armazenado em uma posição específica, sem deslocar elementos.',
    interaction: 'Escolha uma posição válida e um novo valor.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O valor é escrito diretamente na posição informada.' },
    pseudocode: ['FUNÇÃO set(posição, valor)', '  SE isEmpty() ENTÃO', '    ESCREVA "A lista está vazia"', '    RETORNE falso', '  FIM SE', '  SE posição < 0 OU posição >= tamanho ENTÃO', '    ESCREVA "Posição inválida"', '    RETORNE falso', '  FIM SE', '  vetorLista[posição] ← valor', '  RETORNE verdadeiro', 'FIM'],
  },
  {
    id: 'get', title: 'Consultar uma posição', menuLabel: 'get()', group: 'Consultas', number: '07',
    description: 'Retorne o elemento armazenado em uma posição específica.',
    interaction: 'Escolha uma posição válida e uma inválida para comparar o retorno.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Como a lista usa vetor, o acesso é direto pelo índice.' },
    pseudocode: ['FUNÇÃO get(posição)', '  SE isEmpty() ENTÃO', '    ESCREVA "A lista está vazia"', '    RETORNE -1', '  FIM SE', '  SE posição < 0 OU posição >= tamanho ENTÃO', '    ESCREVA "Posição inválida"', '    RETORNE -1', '  FIM SE', '  RETORNE vetorLista[posição]', 'FIM'],
  },
  {
    id: 'show', title: 'Mostrar elementos', menuLabel: 'show()', group: 'Consultas', number: '08',
    description: 'Percorra a parte lógica da lista, da posição 0 até tamanho - 1, montando o texto.',
    interaction: 'Acompanhe a variável i crescendo e o texto sendo montado aos poucos.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'Somente a parte lógica da lista é percorrida, não o vetor inteiro.' },
    pseudocode: ['FUNÇÃO show()', '  SE isEmpty() ENTÃO', '    RETORNE "A lista está vazia."', '  FIM SE', '  texto ← "["', '  PARA i DE 0 ATÉ tamanho - 1 FAÇA', '    texto ← texto + vetorLista[i]', '    SE i < tamanho - 1 ENTÃO', '      texto ← texto + ", "', '    FIM SE', '  FIM PARA', '  texto ← texto + "]"', '  RETORNE texto', 'FIM'],
  },
  {
    id: 'size', title: 'Tamanho da lista', menuLabel: 'size()', group: 'Consultas', number: '09',
    description: 'Retorne a quantidade atual de elementos válidos da lista.',
    interaction: 'Compare com a capacidade total do vetor mostrada ao lado.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Não há laço, deslocamento ou alteração da estrutura.' },
    pseudocode: ['FUNÇÃO size()', '  RETORNE tamanho', 'FIM'],
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

const frame = (values, capacidade, line, title, description, tone = 'neutral', extra = {}) => ({
  values: clone(values), capacidade, tamanho: values.length, line, title, description, tone, variables: {}, output: [], ...extra,
});

function creationSteps(capacidade) {
  const empty = [];
  return [
    frame(empty, capacidade, 0, 'Chamando o construtor', `ListaEstatica lista = new ListaEstatica(${capacidade}) é executado.`),
    frame(empty, capacidade, 1, 'Iniciando o tamanho', 'tamanho recebe 0, pois nenhum elemento foi inserido ainda.', 'update', { variables: { tamanho: 0 } }),
    frame(empty, capacidade, 2, 'Alocando o vetor', `Um vetor de ${capacidade} posições é reservado na memória.`, 'reading', { variables: { tamanho: 0, capacidade } }),
    frame(empty, capacidade, 3, 'Lista criada', `A lista foi criada com capacidade ${capacidade} e 0 elementos.`, 'done', { variables: { tamanho: 0, capacidade }, output: [`Lista criada com capacidade ${capacidade}.`] }),
  ];
}

function isFullSteps(valores, capacidade) {
  const tamanho = valores.length;
  const full = tamanho === capacidade;
  return [
    frame(valores, capacidade, 0, 'Chamando isFull()', 'O algoritmo verifica se a lista já atingiu a capacidade máxima.'),
    frame(valores, capacidade, 1, 'Comparando tamanho com a capacidade', `tamanho (${tamanho}) == vetorLista.length (${capacidade}) é ${full ? 'verdadeiro' : 'falso'}.`, 'comparison', { variables: { tamanho, capacidadeVetor: capacidade } }),
    frame(valores, capacidade, 2, 'isFull() concluído', `O método retorna ${full}.`, 'done', { variables: { tamanho, cheia: full }, output: [`isFull() retornou ${full}.`] }),
  ];
}

function isEmptySteps(valores, capacidade) {
  const tamanho = valores.length;
  const empty = tamanho === 0;
  return [
    frame(valores, capacidade, 0, 'Chamando isEmpty()', 'O algoritmo verifica se a lista possui elementos válidos.'),
    frame(valores, capacidade, 1, 'Comparando tamanho com 0', `tamanho == 0 é ${empty ? 'verdadeiro' : 'falso'}.`, 'comparison', { variables: { tamanho } }),
    frame(valores, capacidade, 2, 'isEmpty() concluído', `O método retorna ${empty}.`, 'done', { variables: { tamanho, vazia: empty }, output: [`isEmpty() retornou ${empty}.`] }),
  ];
}

function addSteps(valores, capacidade, posicao, valor) {
  const tamanho = valores.length;
  const cheia = tamanho >= capacidade;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando add(posição, valor)', `add(${posicao}, ${fmt(valor)}) é executado.`),
    frame(valores, capacidade, 1, 'Verificando se a lista está cheia', `isFull() retorna ${cheia}.`, 'comparison', { variables: { tamanho, cheia } }),
  ];
  if (cheia) {
    steps.push(frame(valores, capacidade, 2, 'Lista cheia', 'A lista atingiu a capacidade máxima; a inserção não pode ocorrer.', 'warning', { output: ['A lista está cheia.'] }));
    steps.push(frame(valores, capacidade, 15, 'add() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: ['A lista está cheia.', 'add() retornou false.'] }));
    return steps;
  }

  const invalido = !Number.isInteger(posicao) || posicao < 0 || posicao > tamanho;
  steps.push(frame(valores, capacidade, 5, 'Validando a posição', `posição < 0 OU posição > tamanho (${tamanho}) é ${invalido}.`, 'comparison', { activeIndices: !invalido && posicao < tamanho ? [posicao] : [], variables: { posicao, tamanho, valido: !invalido } }));
  if (invalido) {
    steps.push(frame(valores, capacidade, 6, 'Posição inválida', 'A posição informada está fora do intervalo permitido (0 até tamanho).', 'warning', { output: ['Posição inválida.'] }));
    steps.push(frame(valores, capacidade, 15, 'add() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: ['Posição inválida.', 'add() retornou false.'] }));
    return steps;
  }

  let working = [...valores, null];
  for (let i = tamanho; i > posicao; i -= 1) {
    steps.push(frame(working, capacidade, 9, `Iniciando a iteração i = ${i}`, `O laço PARA seleciona o índice ${i} para receber o valor anterior.`, 'reading', { tamanho, activeIndices: [i, i - 1], variables: { i } }));
    working = clone(working);
    working[i] = working[i - 1];
    steps.push(frame(working, capacidade, 10, `Deslocando vetorLista[${i - 1}] para a posição ${i}`, `vetorLista[${i}] recebe ${fmt(working[i])}.`, 'update', { tamanho, activeIndices: [i, i - 1], changedIndices: [i], variables: { i } }));
  }
  steps.push(frame(working, capacidade, 11, 'Fim do laço PARA', 'Foi aberto espaço na posição desejada.', 'reading', { tamanho, variables: { posicao } }));

  working = clone(working);
  working[posicao] = valor;
  steps.push(frame(working, capacidade, 12, 'Escrevendo o novo valor', `vetorLista[${posicao}] recebe ${fmt(valor)}.`, 'update', { tamanho, activeIndices: [posicao], changedIndices: [posicao], variables: { posicao, valor } }));

  const novoTamanho = tamanho + 1;
  steps.push(frame(working, capacidade, 13, 'Incrementando tamanho', `tamanho passa de ${tamanho} para ${novoTamanho}.`, 'update', { variables: { tamanho: novoTamanho } }));
  steps.push(frame(working, capacidade, 14, 'Retornando verdadeiro', `O valor ${fmt(valor)} foi inserido na posição ${posicao}.`, 'success', { foundIndices: [posicao], variables: { tamanho: novoTamanho }, output: [`add(${posicao}, ${fmt(valor)}) inseriu o valor na posição ${posicao}.`] }));
  steps.push(frame(working, capacidade, 15, 'add() concluído', 'Os elementos à direita da posição foram deslocados uma casa.', 'done', { foundIndices: [posicao], variables: { tamanho: novoTamanho }, output: [`add(${posicao}, ${fmt(valor)}) inseriu o valor na posição ${posicao}.`] }));
  return steps;
}

function removeSteps(valores, capacidade, posicao) {
  const tamanho = valores.length;
  const vazia = tamanho === 0;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando remove(posição)', `remove(${posicao}) é executado.`),
    frame(valores, capacidade, 1, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { tamanho, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 2, 'Lista vazia', 'Não há elemento para remover.', 'warning', { output: ['A lista está vazia.'] }));
    steps.push(frame(valores, capacidade, 14, 'remove() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: ['A lista está vazia.', 'remove() retornou false.'] }));
    return steps;
  }

  const invalido = !Number.isInteger(posicao) || posicao < 0 || posicao >= tamanho;
  steps.push(frame(valores, capacidade, 5, 'Validando a posição', `posição < 0 OU posição >= tamanho (${tamanho}) é ${invalido}.`, 'comparison', { activeIndices: !invalido ? [posicao] : [], variables: { posicao, tamanho, valido: !invalido } }));
  if (invalido) {
    steps.push(frame(valores, capacidade, 6, 'Posição inválida', 'A posição informada está fora do intervalo permitido (0 até tamanho - 1).', 'warning', { output: ['Posição inválida.'] }));
    steps.push(frame(valores, capacidade, 14, 'remove() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: ['Posição inválida.', 'remove() retornou false.'] }));
    return steps;
  }

  const removido = valores[posicao];
  let working = clone(valores);
  for (let i = posicao; i <= tamanho - 2; i += 1) {
    steps.push(frame(working, capacidade, 9, `Iniciando a iteração i = ${i}`, `O laço PARA seleciona o índice ${i} para receber o valor seguinte.`, 'reading', { tamanho, activeIndices: [i, i + 1], variables: { i } }));
    working = clone(working);
    working[i] = working[i + 1];
    steps.push(frame(working, capacidade, 10, `Deslocando vetorLista[${i + 1}] para a posição ${i}`, `vetorLista[${i}] recebe ${fmt(working[i])}.`, 'update', { tamanho, activeIndices: [i, i + 1], changedIndices: [i], variables: { i } }));
  }
  steps.push(frame(working, capacidade, 11, 'Fim do laço PARA', 'Os elementos à direita da posição já foram deslocados uma casa para a esquerda.', 'reading', { tamanho, variables: { posicao } }));

  const novosValores = working.slice(0, tamanho - 1);
  const novoTamanho = tamanho - 1;
  steps.push(frame(novosValores, capacidade, 12, 'Decrementando tamanho', `tamanho passa de ${tamanho} para ${novoTamanho}.`, 'update', { variables: { tamanho: novoTamanho } }));
  steps.push(frame(novosValores, capacidade, 13, 'Retornando verdadeiro', `O elemento ${fmt(removido)} foi removido da posição ${posicao}.`, 'success', { variables: { tamanho: novoTamanho }, output: [`remove(${posicao}) removeu o valor ${fmt(removido)}.`] }));
  steps.push(frame(novosValores, capacidade, 14, 'remove() concluído', 'A última posição física deixou de pertencer à lista lógica.', 'done', { variables: { tamanho: novoTamanho }, output: [`remove(${posicao}) removeu o valor ${fmt(removido)}.`] }));
  return steps;
}

function setSteps(valores, capacidade, posicao, valor) {
  const tamanho = valores.length;
  const vazia = tamanho === 0;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando set(posição, valor)', `set(${posicao}, ${fmt(valor)}) é executado.`),
    frame(valores, capacidade, 1, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { tamanho, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 2, 'Lista vazia', 'Não há posição válida para alterar.', 'warning', { output: ['A lista está vazia.'] }));
    steps.push(frame(valores, capacidade, 11, 'set() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: ['A lista está vazia.', 'set() retornou false.'] }));
    return steps;
  }

  const invalido = !Number.isInteger(posicao) || posicao < 0 || posicao >= tamanho;
  steps.push(frame(valores, capacidade, 5, 'Validando a posição', `posição < 0 OU posição >= tamanho (${tamanho}) é ${invalido}.`, 'comparison', { activeIndices: !invalido ? [posicao] : [], variables: { posicao, tamanho, valido: !invalido } }));
  if (invalido) {
    steps.push(frame(valores, capacidade, 6, 'Posição inválida', 'A posição informada está fora do intervalo permitido (0 até tamanho - 1).', 'warning', { output: ['Posição inválida.'] }));
    steps.push(frame(valores, capacidade, 11, 'set() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: ['Posição inválida.', 'set() retornou false.'] }));
    return steps;
  }

  const valorAnterior = valores[posicao];
  const novosValores = clone(valores);
  novosValores[posicao] = valor;
  steps.push(frame(novosValores, capacidade, 9, 'Escrevendo o novo valor', `vetorLista[${posicao}] recebe ${fmt(valor)}.`, 'update', { activeIndices: [posicao], changedIndices: [posicao], variables: { posicao, valorAnterior, valor } }));
  steps.push(frame(novosValores, capacidade, 10, 'Retornando verdadeiro', `${fmt(valorAnterior)} foi substituído por ${fmt(valor)}.`, 'success', { foundIndices: [posicao], variables: { posicao, valorAnterior, valor }, output: [`set(${posicao}, ${fmt(valor)}) substituiu ${fmt(valorAnterior)} por ${fmt(valor)}.`] }));
  steps.push(frame(novosValores, capacidade, 11, 'set() concluído', 'O tamanho da lista não se altera.', 'done', { foundIndices: [posicao], variables: { posicao, valorAnterior, valor }, output: [`set(${posicao}, ${fmt(valor)}) substituiu ${fmt(valorAnterior)} por ${fmt(valor)}.`] }));
  return steps;
}

function getSteps(valores, capacidade, posicao) {
  const tamanho = valores.length;
  const vazia = tamanho === 0;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando get(posição)', `get(${posicao}) é executado.`),
    frame(valores, capacidade, 1, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { tamanho, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 3, 'Lista vazia', 'Não há elemento para consultar.', 'warning', { variables: { retorno: -1 }, output: ['get() retornou -1 (lista vazia).'] }));
    steps.push(frame(valores, capacidade, 9, 'get() concluído', 'A lista continua exatamente igual.', 'done', { variables: { retorno: -1 }, output: ['get() retornou -1 (lista vazia).'] }));
    return steps;
  }

  const invalido = !Number.isInteger(posicao) || posicao < 0 || posicao >= tamanho;
  steps.push(frame(valores, capacidade, 5, 'Validando a posição', `posição < 0 OU posição >= tamanho (${tamanho}) é ${invalido}.`, 'comparison', { activeIndices: !invalido ? [posicao] : [], variables: { posicao, tamanho, valido: !invalido } }));
  if (invalido) {
    steps.push(frame(valores, capacidade, 7, 'Posição inválida', 'A posição informada está fora do intervalo permitido (0 até tamanho - 1).', 'warning', { variables: { retorno: -1 }, output: ['get() retornou -1 (posição inválida).'] }));
    steps.push(frame(valores, capacidade, 9, 'get() concluído', 'A lista continua exatamente igual.', 'done', { variables: { retorno: -1 }, output: ['get() retornou -1 (posição inválida).'] }));
    return steps;
  }

  const valor = valores[posicao];
  steps.push(frame(valores, capacidade, 9, 'Retornando o valor', `vetorLista[${posicao}] contém ${fmt(valor)}.`, 'success', { activeIndices: [posicao], foundIndices: [posicao], variables: { posicao, retorno: valor }, output: [`get(${posicao}) retornou ${fmt(valor)}.`] }));
  steps.push(frame(valores, capacidade, 10, 'get() concluído', 'A lista continua exatamente igual.', 'done', { foundIndices: [posicao], variables: { posicao, retorno: valor }, output: [`get(${posicao}) retornou ${fmt(valor)}.`] }));
  return steps;
}

function showSteps(valores, capacidade) {
  const tamanho = valores.length;
  const vazia = tamanho === 0;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando show()', 'show() é executado.'),
    frame(valores, capacidade, 1, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 2, 'Lista vazia', 'O método retorna a mensagem "A lista está vazia.".', 'warning', { output: ['show() retornou "A lista está vazia.".'] }));
    steps.push(frame(valores, capacidade, 13, 'show() concluído', 'A execução termina sem percorrer o vetor.', 'done', { output: ['show() retornou "A lista está vazia.".'] }));
    return steps;
  }

  let texto = '[';
  steps.push(frame(valores, capacidade, 4, 'Inicializando o texto', 'texto recebe o caractere de abertura "[".', 'update', { variables: { texto } }));
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, capacidade, 5, `Iniciando a iteração i = ${i}`, `O laço PARA seleciona o índice ${i}.`, 'reading', { activeIndices: [i], processedIndices: range(i), variables: { i, texto } }));
    texto += fmt(valores[i]);
    steps.push(frame(valores, capacidade, 6, `Concatenando vetorLista[${i}]`, `texto recebe texto + ${fmt(valores[i])}.`, 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { i, texto } }));
    if (i < tamanho - 1) {
      texto += ', ';
      steps.push(frame(valores, capacidade, 8, 'Adicionando separador', 'texto recebe texto + ", ".', 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { i, texto } }));
    }
  }
  texto += ']';
  steps.push(frame(valores, capacidade, 11, 'Fechando o texto', 'texto recebe texto + "]".', 'update', { processedIndices: range(tamanho), variables: { texto } }));
  steps.push(frame(valores, capacidade, 12, 'Retornando o texto', `show() retorna ${texto}.`, 'success', { processedIndices: range(tamanho), variables: { texto }, output: [`show() retornou ${texto}.`] }));
  return steps;
}

function sizeSteps(valores, capacidade) {
  const tamanho = valores.length;
  return [
    frame(valores, capacidade, 0, 'Chamando size()', 'size() é executado.'),
    frame(valores, capacidade, 1, 'Retornando tamanho', `O atributo tamanho vale ${tamanho}.`, 'reading', { variables: { tamanho } }),
    frame(valores, capacidade, 2, 'size() concluído', `size() retornou ${tamanho}.`, 'done', { variables: { tamanho }, output: [`size() retornou ${tamanho}.`] }),
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
