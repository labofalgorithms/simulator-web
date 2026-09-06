export const algorithms = [
  {
    id: 'creation', title: 'Criação da lista dinâmica', menuLabel: 'Criação da lista', group: 'Fundamentos', number: '01',
    description: 'Veja como início e fim são iniciados apontando para nulo, sem alocar um vetor.',
    interaction: 'Observe que não existe capacidade máxima: a lista começa vazia e cresce sob demanda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Nenhuma estrutura é alocada antecipadamente; apenas as referências início e fim são criadas.' },
    pseudocode: ['CONSTRUTOR ListaDinamica()', '  inicio ← nulo', '  fim ← nulo', 'FIM'],
  },
  {
    id: 'isEmpty', title: 'Verificar se está vazia', menuLabel: 'isEmpty()', group: 'Fundamentos', number: '02',
    description: 'Compare o atributo início com nulo.',
    interaction: 'Esvazie a lista para ver o retorno mudar para verdadeiro.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas uma comparação é realizada.' },
    pseudocode: ['FUNÇÃO isEmpty()', '  RETORNE (inicio == nulo)', 'FIM'],
  },
  {
    id: 'insertAtFront', title: 'Inserir no início', menuLabel: 'insertAtFront()', group: 'Inserções', number: '03',
    description: 'Crie um novo nó e faça-o apontar para o antigo início, atualizando início (e fim, se a lista estava vazia).',
    interaction: 'Escolha o valor a inserir. Não existe verificação de lista cheia.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O novo nó é ligado diretamente ao início, sem percorrer a lista.' },
    pseudocode: ['FUNÇÃO insertAtFront(item)', '  novoNo ← novo No(item)', '  SE isEmpty() ENTÃO', '    inicio ← novoNo', '    fim ← novoNo', '  SENÃO', '    novoNo.setProxNo(inicio)', '    inicio ← novoNo', '  FIM SE', 'FIM'],
  },
  {
    id: 'insertAtBack', title: 'Inserir no final', menuLabel: 'insertAtBack()', group: 'Inserções', number: '04',
    description: 'Crie um novo nó e ligue-o ao final da lista, atualizando fim (e início, se a lista estava vazia).',
    interaction: 'Escolha o valor a inserir. Não existe verificação de lista cheia.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O novo nó é ligado diretamente ao fim, sem percorrer a lista.' },
    pseudocode: ['FUNÇÃO insertAtBack(item)', '  novoNo ← novo No(item)', '  SE isEmpty() ENTÃO', '    inicio ← novoNo', '    fim ← novoNo', '  SENÃO', '    fim.setProxNo(novoNo)', '    fim ← novoNo', '  FIM SE', 'FIM'],
  },
  {
    id: 'insertAtPosition', title: 'Inserir em uma posição', menuLabel: 'insertAtPosition()', group: 'Inserções', number: '05',
    description: 'Percorra até o nó anterior à posição desejada e ajuste as referências para inserir o novo nó ali.',
    interaction: 'Escolha a posição e o valor. Compare inserir no início, no meio e no final.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, é preciso percorrer a lista até a posição desejada.' },
    pseudocode: ['FUNÇÃO insertAtPosition(item, posição)', '  SE posição < 0 ENTÃO', '    RETORNE falso', '  FIM SE', '  SE posição == 0 ENTÃO', '    insertAtFront(item)', '    RETORNE verdadeiro', '  FIM SE', '  novoNo ← novo No(item)', '  atual ← inicio', '  índice ← 0', '  ENQUANTO atual != nulo E índice < posição - 1 FAÇA', '    atual ← atual.getProxNo()', '    índice ← índice + 1', '  FIM ENQUANTO', '  SE atual == nulo ENTÃO', '    RETORNE falso', '  FIM SE', '  novoNo.setProxNo(atual.getProxNo())', '  atual.setProxNo(novoNo)', '  SE novoNo.getProxNo() == nulo ENTÃO', '    fim ← novoNo', '  FIM SE', '  RETORNE verdadeiro', 'FIM'],
  },
  {
    id: 'removeAtFront', title: 'Remover do início', menuLabel: 'removeAtFront()', group: 'Remoções', number: '06',
    description: 'Guarde o dado do início, avance início para o próximo nó (ou esvazie a lista, se era o único nó).',
    interaction: 'Remova até o último elemento e observe início e fim voltarem a nulo.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas a referência início é atualizada; nenhum outro nó é percorrido.' },
    pseudocode: ['FUNÇÃO removeAtFront()', '  SE isEmpty() ENTÃO', '    RETORNE -1', '  FIM SE', '  removItem ← inicio.getDado()', '  SE inicio == fim ENTÃO', '    inicio ← nulo', '    fim ← nulo', '  SENÃO', '    inicio ← inicio.getProxNo()', '  FIM SE', '  RETORNE removItem', 'FIM'],
  },
  {
    id: 'removeAtBack', title: 'Remover do final', menuLabel: 'removeAtBack()', group: 'Remoções', number: '07',
    description: 'Percorra até o penúltimo nó, pois é preciso encontrá-lo para desligar o antigo fim da lista.',
    interaction: 'Remova até o último elemento e observe início e fim voltarem a nulo.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Como a lista é simplesmente encadeada, é preciso percorrê-la para achar o penúltimo nó.' },
    pseudocode: ['FUNÇÃO removeAtBack()', '  SE isEmpty() ENTÃO', '    RETORNE -1', '  FIM SE', '  removedItem ← fim.getDado()', '  SE inicio == fim ENTÃO', '    inicio ← nulo', '    fim ← nulo', '  SENÃO', '    atual ← inicio', '    ENQUANTO atual.getProxNo() != fim FAÇA', '      atual ← atual.getProxNo()', '    FIM ENQUANTO', '    fim ← atual', '    atual.setProxNo(nulo)', '  FIM SE', '  RETORNE removedItem', 'FIM'],
  },
  {
    id: 'remove', title: 'Remover um valor', menuLabel: 'remove()', group: 'Remoções', number: '08',
    description: 'Procure o primeiro nó com o valor informado e ajuste as referências para retirá-lo da cadeia.',
    interaction: 'Teste removendo um valor no início, no fim, no meio e um valor que não existe.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, é preciso percorrer a lista inteira procurando o valor.' },
    pseudocode: ['FUNÇÃO remove(item)', '  SE isEmpty() ENTÃO', '    RETORNE falso', '  FIM SE', '  anterior ← nulo', '  atual ← inicio', '  ENQUANTO atual != nulo E atual.getDado() != item FAÇA', '    anterior ← atual', '    atual ← atual.getProxNo()', '  FIM ENQUANTO', '  SE atual == nulo ENTÃO', '    RETORNE falso', '  FIM SE', '  SE atual == inicio ENTÃO', '    inicio ← inicio.getProxNo()', '    SE inicio == nulo ENTÃO', '      fim ← nulo', '    FIM SE', '  SENÃO', '    anterior.setProxNo(atual.getProxNo())', '    SE atual == fim ENTÃO', '      fim ← anterior', '    FIM SE', '  FIM SE', '  RETORNE verdadeiro', 'FIM'],
  },
  {
    id: 'find', title: 'Procurar um valor', menuLabel: 'find()', group: 'Consultas', number: '09',
    description: 'Percorra a lista a partir do início comparando cada nó com o valor procurado.',
    interaction: 'Procure um valor que existe e outro que não existe na lista.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, é preciso comparar todos os nós da lista.' },
    pseudocode: ['FUNÇÃO find(item)', '  SE isEmpty() ENTÃO', '    RETORNE nulo', '  FIM SE', '  atual ← inicio', '  ENQUANTO atual != nulo FAÇA', '    SE atual.getDado() == item ENTÃO', '      RETORNE atual', '    FIM SE', '    atual ← atual.getProxNo()', '  FIM ENQUANTO', '  RETORNE nulo', 'FIM'],
  },
  {
    id: 'show', title: 'Mostrar elementos', menuLabel: 'show()', group: 'Consultas', number: '10',
    description: 'Percorra a lista do início até o final, exibindo o valor de cada nó visitado.',
    interaction: 'Acompanhe o atual avançando nó a nó enquanto os valores são exibidos.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada nó é visitado uma vez para exibir seu valor.' },
    pseudocode: ['FUNÇÃO show()', '  SE isEmpty() ENTÃO', '    ESCREVA "Lista vazia"', '    RETORNE', '  FIM SE', '  atual ← inicio', '  ENQUANTO atual != nulo FAÇA', '    ESCREVA atual.dado', '    atual ← atual.getProxNo()', '  FIM ENQUANTO', 'FIM'],
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

const frame = (values, line, title, description, tone = 'neutral', extra = {}) => ({
  values: clone(values), line, title, description, tone, variables: {}, output: [], ...extra,
});

function creationSteps() {
  return [
    frame([], 0, 'Chamando o construtor', 'ListaDinamica ld = new ListaDinamica() é executado.'),
    frame([], 1, 'Iniciando início e fim', 'início e fim recebem nulo, pois nenhum nó foi criado ainda.', 'update', { variables: { inicio: 'nulo', fim: 'nulo' } }),
    frame([], 3, 'Lista criada', 'A lista dinâmica foi criada vazia, sem um tamanho máximo definido.', 'done', { variables: { inicio: 'nulo', fim: 'nulo' }, output: ['Lista dinâmica criada.'] }),
  ];
}

function isEmptySteps(valores) {
  const vazia = valores.length === 0;
  return [
    frame(valores, 0, 'Chamando isEmpty()', 'O algoritmo verifica se início aponta para nulo.'),
    frame(valores, 1, 'Comparando início com nulo', `inicio == nulo é ${vazia ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
    frame(valores, 2, 'isEmpty() concluído', `O método retorna ${vazia}.`, 'done', { variables: { vazia }, output: [`isEmpty() retornou ${vazia}.`] }),
  ];
}

function insertAtFrontSteps(valores, item) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando insertAtFront(item)', `insertAtFront(${fmt(item)}) é executado.`),
    frame(valores, 1, 'Criando o novo nó', `novoNo armazena o valor ${fmt(item)}.`, 'reading', { variables: { item } }),
    frame(valores, 2, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { item, vazia } }),
  ];
  if (vazia) {
    const novosValores = [item];
    steps.push(frame(novosValores, 3, 'Definindo início', 'início passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 4, 'Definindo fim', 'fim também passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 9, 'insertAtFront() concluído', `${fmt(item)} agora ocupa a lista inteira (início e fim).`, 'done', { foundIndices: [0], variables: { item }, output: [`insertAtFront(${fmt(item)}) inseriu o valor no início.`] }));
    return steps;
  }
  steps.push(frame(valores, 6, 'Apontando para o antigo início', `novoNo passa a apontar para o nó ${fmt(valores[0])}.`, 'reading', { variables: { item, proximo: fmt(valores[0]) } }));
  const novosValores = [item, ...valores];
  steps.push(frame(novosValores, 7, 'Atualizando o início', 'início passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
  steps.push(frame(novosValores, 9, 'insertAtFront() concluído', `${fmt(item)} agora é o primeiro nó da lista.`, 'done', { foundIndices: [0], variables: { item }, output: [`insertAtFront(${fmt(item)}) inseriu o valor no início.`] }));
  return steps;
}

function insertAtBackSteps(valores, item) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando insertAtBack(item)', `insertAtBack(${fmt(item)}) é executado.`),
    frame(valores, 1, 'Criando o novo nó', `novoNo armazena o valor ${fmt(item)}.`, 'reading', { variables: { item } }),
    frame(valores, 2, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: valores.length ? [valores.length - 1] : [], variables: { item, vazia } }),
  ];
  if (vazia) {
    const novosValores = [item];
    steps.push(frame(novosValores, 3, 'Definindo início', 'início passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 4, 'Definindo fim', 'fim também passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 9, 'insertAtBack() concluído', `${fmt(item)} agora ocupa a lista inteira (início e fim).`, 'done', { foundIndices: [0], variables: { item }, output: [`insertAtBack(${fmt(item)}) inseriu o valor no final.`] }));
    return steps;
  }
  const ultimoIndiceAntigo = valores.length - 1;
  steps.push(frame(valores, 6, 'Ligando o antigo fim ao novo nó', `fim.setProxNo(novoNo) liga o nó ${fmt(valores[ultimoIndiceAntigo])} ao novo nó.`, 'reading', { activeIndices: [ultimoIndiceAntigo], variables: { item } }));
  const novosValores = [...valores, item];
  const novoIndice = novosValores.length - 1;
  steps.push(frame(novosValores, 7, 'Atualizando o fim', 'fim passa a apontar para o novo nó.', 'update', { activeIndices: [ultimoIndiceAntigo, novoIndice], changedIndices: [novoIndice], variables: { item } }));
  steps.push(frame(novosValores, 9, 'insertAtBack() concluído', `${fmt(item)} agora é o último nó da lista.`, 'done', { foundIndices: [novoIndice], variables: { item }, output: [`insertAtBack(${fmt(item)}) inseriu o valor no final.`] }));
  return steps;
}

function insertAtPositionSteps(valores, item, posicao) {
  const steps = [frame(valores, 0, 'Chamando insertAtPosition(item, posição)', `insertAtPosition(${fmt(item)}, ${posicao}) é executado.`)];

  if (!Number.isInteger(posicao) || posicao < 0) {
    steps.push(frame(valores, 1, 'Verificando a posição', 'posição < 0 é verdadeiro.', 'comparison', { variables: { posicao } }));
    steps.push(frame(valores, 2, 'Posição inválida', 'A posição informada é negativa; o método retorna falso.', 'warning', { output: ['insertAtPosition() retornou false (posição inválida).'] }));
    steps.push(frame(valores, 24, 'insertAtPosition() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: ['insertAtPosition() retornou false (posição inválida).'] }));
    return steps;
  }
  steps.push(frame(valores, 1, 'Verificando a posição', 'posição < 0 é falso.', 'comparison', { variables: { posicao } }));

  if (posicao === 0) {
    steps.push(frame(valores, 4, 'Posição igual a zero', 'insertAtPosition delega para insertAtFront(item).', 'reading', { variables: { item, posicao } }));
    const novosValores = [item, ...valores];
    steps.push(frame(novosValores, 5, 'Executando insertAtFront', `${fmt(item)} passa a ser o novo início da lista.`, 'update', { activeIndices: [0], changedIndices: [0], variables: { item } }));
    steps.push(frame(novosValores, 24, 'insertAtPosition() concluído', 'O algoritmo retorna verdadeiro.', 'done', { foundIndices: [0], variables: { item, posicao }, output: [`insertAtPosition(${fmt(item)}, 0) inseriu o valor no início.`] }));
    return steps;
  }

  steps.push(frame(valores, 8, 'Criando o novo nó', `novoNo armazena o valor ${fmt(item)}.`, 'reading', { variables: { item } }));
  steps.push(frame(valores, 9, 'Iniciando o atual', `atual recebe início (${valores.length ? fmt(valores[0]) : 'nulo'}).`, 'update', { activeIndices: valores.length ? [0] : [], variables: { item, indice: 0, atual: valores.length ? fmt(valores[0]) : 'nulo' } }));
  steps.push(frame(valores, 10, 'Iniciando o índice', 'índice recebe 0.', 'update', { activeIndices: valores.length ? [0] : [], variables: { item, indice: 0, atual: valores.length ? fmt(valores[0]) : 'nulo' } }));

  let atualIndex = 0;
  let indice = 0;
  while (atualIndex < valores.length && indice < posicao - 1) {
    steps.push(frame(valores, 11, 'Verificando a condição do laço', `atual != nulo e índice (${indice}) < posição - 1 (${posicao - 1}) é verdadeiro.`, 'comparison', { activeIndices: [atualIndex], variables: { item, indice, atual: fmt(valores[atualIndex]) } }));
    atualIndex += 1;
    indice += 1;
    const atualDesc = atualIndex < valores.length ? fmt(valores[atualIndex]) : 'nulo';
    steps.push(frame(valores, 12, 'Avançando o atual', `atual passa a apontar para ${atualDesc === 'nulo' ? 'nulo' : `o nó ${atualDesc}`}.`, 'update', { activeIndices: atualIndex < valores.length ? [atualIndex] : [], variables: { item, indice, atual: atualDesc } }));
  }
  const atualNulo = atualIndex >= valores.length;
  steps.push(frame(valores, 11, 'Verificando a condição do laço', atualNulo ? 'atual chegou a nulo; a condição é falsa.' : `atual aponta para ${fmt(valores[atualIndex])}; a condição é falsa.`, 'comparison', { activeIndices: atualNulo ? [] : [atualIndex], variables: { item, indice, atual: atualNulo ? 'nulo' : fmt(valores[atualIndex]) } }));

  if (atualNulo) {
    steps.push(frame(valores, 16, 'Posição inválida', 'atual chegou a nulo antes de alcançar a posição desejada; o método retorna falso.', 'warning', { output: ['insertAtPosition() retornou false (posição inválida).'] }));
    steps.push(frame(valores, 24, 'insertAtPosition() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: ['insertAtPosition() retornou false (posição inválida).'] }));
    return steps;
  }

  const novosValores = [...valores.slice(0, atualIndex + 1), item, ...valores.slice(atualIndex + 1)];
  const novoIndice = atualIndex + 1;
  steps.push(frame(novosValores, 18, 'Ligando o novo nó ao próximo de atual', `novoNo passa a apontar para ${atualIndex + 1 < valores.length ? fmt(valores[atualIndex + 1]) : 'nulo'}.`, 'update', { activeIndices: [novoIndice], variables: { item } }));
  steps.push(frame(novosValores, 19, 'Ligando atual ao novo nó', `atual.setProxNo(novoNo) insere o novo nó logo após ${fmt(valores[atualIndex])}.`, 'update', { activeIndices: [atualIndex, novoIndice], changedIndices: [novoIndice], variables: { item } }));
  const passouAFim = novoIndice === novosValores.length - 1;
  if (passouAFim) {
    steps.push(frame(novosValores, 21, 'Atualizando o fim', 'Como novoNo não tem próximo, fim passa a apontar para ele.', 'update', { activeIndices: [novoIndice], variables: { item } }));
  }
  steps.push(frame(novosValores, 23, 'insertAtPosition() concluído', `${fmt(item)} foi inserido na posição ${posicao}.`, 'done', { foundIndices: [novoIndice], variables: { item, posicao }, output: [`insertAtPosition(${fmt(item)}, ${posicao}) inseriu o valor na posição ${posicao}.`] }));
  return steps;
}

function removeAtFrontSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando removeAtFront()', 'removeAtFront() é executado.'),
    frame(valores, 1, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Lista vazia', 'Não há nó para remover; o método retorna -1.', 'warning', { variables: { retorno: -1 }, output: ['removeAtFront() retornou -1 (lista vazia).'] }));
    steps.push(frame(valores, 11, 'removeAtFront() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { variables: { retorno: -1 }, output: ['removeAtFront() retornou -1 (lista vazia).'] }));
    return steps;
  }

  const removido = valores[0];
  steps.push(frame(valores, 4, 'Guardando o dado do início', `removItem recebe ${fmt(removido)}.`, 'reading', { activeIndices: [0], foundIndices: [0], variables: { removItem: removido } }));
  const unico = valores.length === 1;
  steps.push(frame(valores, 5, 'Verificando se é o único nó', `inicio == fim é ${unico}.`, 'comparison', { activeIndices: [0], variables: { removItem: removido, unico } }));
  const novosValores = valores.slice(1);
  if (unico) {
    steps.push(frame(novosValores, 6, 'Esvaziando a lista', 'início e fim voltam a ser nulo.', 'update', { variables: { removItem: removido } }));
  } else {
    steps.push(frame(novosValores, 9, 'Atualizando o início', `início passa a apontar para ${fmt(novosValores[0])}.`, 'update', { variables: { removItem: removido } }));
  }
  steps.push(frame(novosValores, 11, 'removeAtFront() concluído', `O nó removido continha o valor ${fmt(removido)}.`, 'done', { variables: { removItem: removido, retorno: removido }, output: [`removeAtFront() retornou ${fmt(removido)}.`] }));
  return steps;
}

function removeAtBackSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando removeAtBack()', 'removeAtBack() é executado.'),
    frame(valores, 1, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: valores.length ? [valores.length - 1] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Lista vazia', 'Não há nó para remover; o método retorna -1.', 'warning', { variables: { retorno: -1 }, output: ['removeAtBack() retornou -1 (lista vazia).'] }));
    steps.push(frame(valores, 16, 'removeAtBack() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { variables: { retorno: -1 }, output: ['removeAtBack() retornou -1 (lista vazia).'] }));
    return steps;
  }

  const lastIndex = valores.length - 1;
  const removido = valores[lastIndex];
  steps.push(frame(valores, 4, 'Guardando o dado do fim', `removedItem recebe ${fmt(removido)}.`, 'reading', { activeIndices: [lastIndex], foundIndices: [lastIndex], variables: { removedItem: removido } }));
  const unico = valores.length === 1;
  steps.push(frame(valores, 5, 'Verificando se é o único nó', `inicio == fim é ${unico}.`, 'comparison', { activeIndices: [lastIndex], variables: { removedItem: removido, unico } }));

  if (unico) {
    steps.push(frame([], 6, 'Esvaziando a lista', 'início e fim voltam a ser nulo.', 'update', { variables: { removedItem: removido } }));
    steps.push(frame([], 16, 'removeAtBack() concluído', `O nó removido continha o valor ${fmt(removido)}.`, 'done', { variables: { removedItem: removido, retorno: removido }, output: [`removeAtBack() retornou ${fmt(removido)}.`] }));
    return steps;
  }

  steps.push(frame(valores, 9, 'Iniciando o atual', `atual recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { removedItem: removido, atual: fmt(valores[0]) } }));
  for (let i = 0; i < lastIndex - 1; i += 1) {
    steps.push(frame(valores, 10, 'Verificando atual.getProxNo() != fim', `o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de fim; a condição é verdadeira.`, 'comparison', { activeIndices: [i], variables: { removedItem: removido, atual: fmt(valores[i]) } }));
    steps.push(frame(valores, 11, 'Avançando o atual', `atual passa a apontar para ${fmt(valores[i + 1])}.`, 'update', { activeIndices: [i + 1], variables: { removedItem: removido, atual: fmt(valores[i + 1]) } }));
  }
  steps.push(frame(valores, 10, 'Verificando atual.getProxNo() != fim', `o próximo de ${fmt(valores[lastIndex - 1])} é o próprio fim; a condição é falsa.`, 'comparison', { activeIndices: [lastIndex - 1], variables: { removedItem: removido, atual: fmt(valores[lastIndex - 1]) } }));

  const novosValores = valores.slice(0, lastIndex);
  steps.push(frame(novosValores, 13, 'Atualizando o fim', `fim passa a apontar para ${fmt(valores[lastIndex - 1])}.`, 'update', { activeIndices: [lastIndex - 1], variables: { removedItem: removido } }));
  steps.push(frame(novosValores, 14, 'Removendo a referência antiga', 'O novo fim passa a apontar para nulo.', 'update', { activeIndices: [lastIndex - 1], changedIndices: [lastIndex - 1], variables: { removedItem: removido } }));
  steps.push(frame(novosValores, 16, 'removeAtBack() concluído', `O nó removido continha o valor ${fmt(removido)}.`, 'done', { variables: { removedItem: removido, retorno: removido }, output: [`removeAtBack() retornou ${fmt(removido)}.`] }));
  return steps;
}

function removeSteps(valores, item) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando remove(item)', `remove(${fmt(item)}) é executado.`),
    frame(valores, 1, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { item, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Lista vazia', 'Não há nó para remover; o método retorna falso.', 'warning', { output: [`remove(${fmt(item)}) retornou false (lista vazia).`] }));
    steps.push(frame(valores, 25, 'remove() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: [`remove(${fmt(item)}) retornou false (lista vazia).`] }));
    return steps;
  }

  steps.push(frame(valores, 4, 'Iniciando anterior e atual', 'anterior recebe nulo; atual recebe início.', 'update', { activeIndices: [0], variables: { item, anterior: 'nulo', atual: fmt(valores[0]) } }));

  let atualIndex = 0;
  let anteriorIndex = -1;
  while (atualIndex < valores.length && valores[atualIndex] !== item) {
    steps.push(frame(valores, 6, 'Verificando a condição do laço', `atual != nulo e atual.getDado() (${fmt(valores[atualIndex])}) != item (${fmt(item)}) é verdadeiro.`, 'comparison', { activeIndices: [atualIndex], variables: { item, anterior: anteriorIndex >= 0 ? fmt(valores[anteriorIndex]) : 'nulo', atual: fmt(valores[atualIndex]) } }));
    anteriorIndex = atualIndex;
    atualIndex += 1;
    const atualDesc = atualIndex < valores.length ? fmt(valores[atualIndex]) : 'nulo';
    steps.push(frame(valores, 8, 'Avançando anterior e atual', `anterior passa a ${fmt(valores[anteriorIndex])}; atual passa a ${atualDesc}.`, 'update', { activeIndices: atualIndex < valores.length ? [anteriorIndex, atualIndex] : [anteriorIndex], variables: { item, anterior: fmt(valores[anteriorIndex]), atual: atualDesc } }));
  }

  const encontrado = atualIndex < valores.length;
  steps.push(frame(valores, 6, 'Verificando a condição do laço', encontrado ? `atual.getDado() (${fmt(valores[atualIndex])}) == item; a condição é falsa (encontrado).` : 'atual chegou a nulo; a condição é falsa.', 'comparison', { activeIndices: encontrado ? [atualIndex] : [], variables: { item, anterior: anteriorIndex >= 0 ? fmt(valores[anteriorIndex]) : 'nulo', atual: encontrado ? fmt(valores[atualIndex]) : 'nulo' } }));

  if (!encontrado) {
    steps.push(frame(valores, 11, 'Item não encontrado', 'atual é nulo; o método retorna falso.', 'warning', { output: [`remove(${fmt(item)}) retornou false (item não encontrado).`] }));
    steps.push(frame(valores, 25, 'remove() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: [`remove(${fmt(item)}) retornou false (item não encontrado).`] }));
    return steps;
  }

  const ehInicio = atualIndex === 0;
  steps.push(frame(valores, 13, 'Verificando se atual é o início', `atual == inicio é ${ehInicio}.`, 'comparison', { activeIndices: [atualIndex], variables: { item, atual: fmt(valores[atualIndex]) } }));
  const novosValores = [...valores.slice(0, atualIndex), ...valores.slice(atualIndex + 1)];

  if (ehInicio) {
    steps.push(frame(novosValores, 14, 'Atualizando o início', `início passa a apontar para ${novosValores.length ? fmt(novosValores[0]) : 'nulo'}.`, 'update', { variables: { item } }));
    if (novosValores.length === 0) {
      steps.push(frame(novosValores, 16, 'Lista ficou vazia', 'Como início ficou nulo, fim também volta a ser nulo.', 'update', { variables: { item } }));
    }
  } else {
    steps.push(frame(valores, 19, 'Ligando anterior ao próximo de atual', `anterior.setProxNo(atual.getProxNo()) remove ${fmt(valores[atualIndex])} da cadeia.`, 'update', { activeIndices: [anteriorIndex, atualIndex], changedIndices: [anteriorIndex], variables: { item } }));
    const eraFim = atualIndex === valores.length - 1;
    steps.push(frame(novosValores, 20, 'Verificando se atual era o fim', `atual == fim é ${eraFim}.`, 'comparison', { variables: { item } }));
    if (eraFim) {
      steps.push(frame(novosValores, 21, 'Atualizando o fim', 'fim passa a apontar para anterior.', 'update', { variables: { item } }));
    }
  }

  steps.push(frame(novosValores, 24, 'Retornando verdadeiro', `O nó com valor ${fmt(item)} foi removido da lista.`, 'success', { variables: { item }, output: [`remove(${fmt(item)}) removeu o valor.`] }));
  steps.push(frame(novosValores, 25, 'remove() concluído', 'A lista foi ajustada corretamente.', 'done', { variables: { item }, output: [`remove(${fmt(item)}) removeu o valor.`] }));
  return steps;
}

function findSteps(valores, item) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando find(item)', `find(${fmt(item)}) é executado.`),
    frame(valores, 1, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { item, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Lista vazia', 'Não há nó para procurar; o método retorna nulo.', 'warning', { output: [`find(${fmt(item)}) retornou nulo (lista vazia).`] }));
    steps.push(frame(valores, 11, 'find() concluído', 'A lista continua exatamente igual.', 'done', { output: [`find(${fmt(item)}) retornou nulo (lista vazia).`] }));
    return steps;
  }

  steps.push(frame(valores, 4, 'Iniciando o atual', `atual recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { item, atual: fmt(valores[0]) } }));
  for (let i = 0; i < valores.length; i += 1) {
    steps.push(frame(valores, 5, 'Verificando atual != nulo', `atual aponta para ${fmt(valores[i])}; a condição é verdadeira.`, 'comparison', { activeIndices: [i], variables: { item, atual: fmt(valores[i]) } }));
    const igual = valores[i] === item;
    steps.push(frame(valores, 6, 'Comparando o dado', `atual.getDado() (${fmt(valores[i])}) == item (${fmt(item)}) é ${igual}.`, 'comparison', { activeIndices: [i], comparedIndices: [i], variables: { item, atual: fmt(valores[i]) } }));
    if (igual) {
      steps.push(frame(valores, 7, 'Item encontrado', `find(${fmt(item)}) retorna o nó ${fmt(valores[i])}.`, 'success', { foundIndices: [i], variables: { item, atual: fmt(valores[i]) }, output: [`find(${fmt(item)}) encontrou o valor na posição ${i}.`] }));
      steps.push(frame(valores, 11, 'find() concluído', 'A lista continua exatamente igual.', 'done', { foundIndices: [i], variables: { item }, output: [`find(${fmt(item)}) encontrou o valor na posição ${i}.`] }));
      return steps;
    }
    const proximo = i + 1 < valores.length ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 9, 'Avançando o atual', `atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, 'update', { activeIndices: i + 1 < valores.length ? [i + 1] : [], variables: { item, atual: proximo } }));
  }
  steps.push(frame(valores, 5, 'Verificando atual != nulo', 'atual chegou a nulo; a condição é falsa.', 'comparison', { variables: { item, atual: 'nulo' } }));
  steps.push(frame(valores, 10, 'Item não encontrado', `atual chegou a nulo; find(${fmt(item)}) retorna nulo.`, 'warning', { output: [`find(${fmt(item)}) retornou nulo (não encontrado).`] }));
  steps.push(frame(valores, 11, 'find() concluído', 'A lista continua exatamente igual.', 'done', { output: [`find(${fmt(item)}) retornou nulo (não encontrado).`] }));
  return steps;
}

function showSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando show()', 'show() é executado.'),
    frame(valores, 1, 'Verificando se a lista está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Lista vazia', 'O método exibe a mensagem "Lista vazia".', 'warning', { output: ['show() exibiu "Lista vazia".'] }));
    steps.push(frame(valores, 3, 'show() concluído', 'A execução termina sem percorrer a lista.', 'done', { output: ['show() exibiu "Lista vazia".'] }));
    return steps;
  }

  const tamanho = valores.length;
  steps.push(frame(valores, 5, 'Iniciando o atual', `atual recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { atual: fmt(valores[0]) } }));
  let texto = '';
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 6, 'Verificando atual != nulo', `atual aponta para ${fmt(valores[i])}; a condição é verdadeira.`, 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { atual: fmt(valores[i]), saida: texto } }));
    texto += `${fmt(valores[i])} `;
    steps.push(frame(valores, 7, 'Exibindo o valor', `ESCREVA atual.dado exibe ${fmt(valores[i])}.`, 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { atual: fmt(valores[i]), saida: texto } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 8, 'Avançando o atual', `atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], processedIndices: range(i + 1), variables: { atual: proximo, saida: texto } }));
  }
  steps.push(frame(valores, 6, 'Verificando atual != nulo', 'atual chegou a nulo; a condição é falsa.', 'comparison', { processedIndices: range(tamanho), variables: { atual: 'nulo', saida: texto } }));
  steps.push(frame(valores, 10, 'show() concluído', `show() exibiu: ${texto.trim()}`, 'done', { processedIndices: range(tamanho), variables: { saida: texto }, output: [`show() exibiu: ${texto.trim()}`] }));
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
