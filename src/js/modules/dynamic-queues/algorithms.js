export const algorithms = [
  {
    id: 'creation', title: 'Criação da fila dinâmica', menuLabel: 'Criação da fila', group: 'Fundamentos', number: '01',
    description: 'Veja como início e fim são iniciados apontando para nulo, sem alocar um vetor.',
    interaction: 'Observe que não existe capacidade máxima: a fila começa vazia e cresce sob demanda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Nenhuma estrutura é alocada antecipadamente; apenas as referências início e fim são criadas.' },
    pseudocode: ['CONSTRUTOR FilaDinamica()', '  inicio ← nulo', '  fim ← nulo', 'FIM'],
  },
  {
    id: 'isEmpty', title: 'Verificar se está vazia', menuLabel: 'isEmpty()', group: 'Fundamentos', number: '02',
    description: 'Compare o atributo início com nulo.',
    interaction: 'Esvazie a fila para ver o retorno mudar para verdadeiro.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas uma comparação é realizada.' },
    pseudocode: ['FUNÇÃO isEmpty()', '  SE inicio == nulo ENTÃO', '    RETORNE verdadeiro', '  SENÃO', '    RETORNE falso', '  FIM SE', 'FIM'],
  },
  {
    id: 'enqueue', title: 'Inserir um elemento', menuLabel: 'enqueue()', group: 'Operações', number: '03',
    description: 'Crie um novo nó e ligue-o ao final da fila, atualizando fim (e início, se a fila estava vazia).',
    interaction: 'Escolha o valor a inserir. Não existe verificação de fila cheia: a fila sempre cresce.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O novo nó é ligado diretamente ao fim, sem percorrer a fila.' },
    pseudocode: ['FUNÇÃO enqueue(dd)', '  novoNo ← novo No(dd)', '  SE isEmpty() ENTÃO', '    inicio ← novoNo', '    fim ← novoNo', '  SENÃO', '    fim.setProximoNo(novoNo)', '    fim ← novoNo', '  FIM SE', 'FIM'],
  },
  {
    id: 'dequeue', title: 'Remover um elemento', menuLabel: 'dequeue()', group: 'Operações', number: '04',
    description: 'Guarde o nó do início, avance início para o próximo nó e retorne o valor guardado.',
    interaction: 'Desenfileire até o último elemento e observe início e fim voltarem a nulo.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas a referência início é atualizada; nenhum outro nó é percorrido.' },
    pseudocode: ['FUNÇÃO dequeue()', '  SE isEmpty() ENTÃO', '    RETORNE -1', '  FIM SE', '  temp ← inicio', '  inicio ← inicio.getProximoNo()', '  SE inicio == nulo ENTÃO', '    fim ← nulo', '  FIM SE', '  RETORNE temp.getValor()', 'FIM'],
  },
  {
    id: 'peek', title: 'Consultar o início', menuLabel: 'peek()', group: 'Operações', number: '05',
    description: 'Leia o valor do nó do início sem removê-lo.',
    interaction: 'Compare o resultado de peek() com o de dequeue(): o valor é igual, mas a fila não muda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O valor é lido diretamente do nó apontado por início.' },
    pseudocode: ['FUNÇÃO peek()', '  SE isEmpty() ENTÃO', '    RETORNE -1', '  FIM SE', '  RETORNE inicio.getValor()', 'FIM'],
  },
  {
    id: 'size', title: 'Tamanho da fila', menuLabel: 'size()', group: 'Consultas', number: '06',
    description: 'Percorra a fila nó por nó, a partir do início, contando quantos elementos existem.',
    interaction: 'Acompanhe o atual avançando de nó em nó até chegar a nulo.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Como não existe um atributo de tamanho, é preciso percorrer todos os nós.' },
    pseudocode: ['FUNÇÃO size()', '  contador ← 0', '  atual ← inicio', '  ENQUANTO atual != nulo FAÇA', '    contador ← contador + 1', '    atual ← atual.getProximoNo()', '  FIM ENQUANTO', '  RETORNE contador', 'FIM'],
  },
  {
    id: 'show', title: 'Mostrar elementos', menuLabel: 'show()', group: 'Consultas', number: '07',
    description: 'Percorra a fila do início até o fim, concatenando os valores encontrados.',
    interaction: 'Acompanhe o atual avançando nó a nó enquanto a saída é montada.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'Cada nó é visitado uma vez para montar o texto de saída.' },
    pseudocode: ['FUNÇÃO show()', '  saida ← ""', '  atual ← inicio', '  ENQUANTO atual != nulo FAÇA', '    saida ← saida + atual.getValor() + " "', '    atual ← atual.getProximoNo()', '  FIM ENQUANTO', '  RETORNE saida', 'FIM'],
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
    frame([], 0, 'Chamando o construtor', 'FilaDinamica fd = new FilaDinamica() é executado.'),
    frame([], 1, 'Iniciando início e fim', 'início e fim recebem nulo, pois nenhum nó foi criado ainda.', 'update', { variables: { inicio: 'nulo', fim: 'nulo' } }),
    frame([], 3, 'Fila criada', 'A fila dinâmica foi criada vazia, sem um tamanho máximo definido.', 'done', { variables: { inicio: 'nulo', fim: 'nulo' }, output: ['Fila dinâmica criada.'] }),
  ];
}

function isEmptySteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando isEmpty()', 'O algoritmo verifica se início aponta para nulo.'),
    frame(valores, 1, 'Comparando início com nulo', `inicio == nulo é ${vazia ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Retornando verdadeiro', 'A fila não possui elementos.', 'success', { variables: { vazia: true } }));
  } else {
    steps.push(frame(valores, 4, 'Retornando falso', 'Existe pelo menos um elemento na fila.', 'neutral', { variables: { vazia: false } }));
  }
  steps.push(frame(valores, 6, 'isEmpty() concluído', `O método retorna ${vazia}.`, 'done', { variables: { vazia }, output: [`isEmpty() retornou ${vazia}.`] }));
  return steps;
}

function enqueueSteps(valores, dado) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando enqueue(dd)', `enqueue(${fmt(dado)}) é executado.`),
    frame(valores, 1, 'Criando o novo nó', `novoNo armazena o valor ${fmt(dado)}.`, 'reading', { variables: { dado } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Verificando se a fila está vazia', 'isEmpty() retorna verdadeiro.', 'comparison', { variables: { dado, vazia: true } }));
    const novosValores = [dado];
    steps.push(frame(novosValores, 3, 'Definindo início', 'início passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
    steps.push(frame(novosValores, 4, 'Definindo fim', 'fim também passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
    steps.push(frame(novosValores, 9, 'enqueue() concluído', `${fmt(dado)} agora ocupa a fila inteira (início e fim).`, 'done', { foundIndices: [0], variables: { dado }, output: [`enqueue(${fmt(dado)}) inseriu o valor no final da fila.`] }));
    return steps;
  }

  const ultimoIndiceAntigo = valores.length - 1;
  steps.push(frame(valores, 2, 'Verificando se a fila está vazia', 'isEmpty() retorna falso.', 'comparison', { activeIndices: [ultimoIndiceAntigo], variables: { dado, vazia: false } }));
  const novosValores = [...valores, dado];
  const novoIndice = novosValores.length - 1;
  steps.push(frame(novosValores, 6, 'Ligando o antigo fim ao novo nó', `fim.setProximoNo(novoNo) liga o nó ${fmt(valores[ultimoIndiceAntigo])} ao novo nó.`, 'update', { activeIndices: [ultimoIndiceAntigo, novoIndice], changedIndices: [ultimoIndiceAntigo], variables: { dado } }));
  steps.push(frame(novosValores, 7, 'Atualizando o fim', 'fim passa a apontar para o novo nó.', 'update', { activeIndices: [novoIndice], changedIndices: [novoIndice], variables: { dado } }));
  steps.push(frame(novosValores, 9, 'enqueue() concluído', `${fmt(dado)} agora ocupa o final da fila.`, 'done', { foundIndices: [novoIndice], variables: { dado }, output: [`enqueue(${fmt(dado)}) inseriu o valor no final da fila.`] }));
  return steps;
}

function dequeueSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando dequeue()', 'dequeue() é executado.'),
    frame(valores, 1, 'Verificando se a fila está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Fila vazia', 'Não há nó para remover; o método retorna -1.', 'warning', { variables: { retorno: -1 }, output: ['dequeue() retornou -1 (fila vazia).'] }));
    steps.push(frame(valores, 10, 'dequeue() concluído', 'O algoritmo termina sem alterar a fila.', 'done', { variables: { retorno: -1 }, output: ['dequeue() retornou -1 (fila vazia).'] }));
    return steps;
  }

  const valorRemovido = valores[0];
  steps.push(frame(valores, 4, 'Guardando o nó do início', `temp recebe o nó que contém ${fmt(valorRemovido)}.`, 'reading', { activeIndices: [0], foundIndices: [0], variables: { temp: valorRemovido } }));
  const novosValores = valores.slice(1);
  steps.push(frame(novosValores, 5, 'Atualizando o início', `início passa a apontar para ${novosValores.length ? `o nó ${fmt(novosValores[0])}` : 'nulo'}.`, 'update', { variables: { temp: valorRemovido } }));

  const ficouVazia = novosValores.length === 0;
  steps.push(frame(novosValores, 6, 'Verificando se a fila ficou vazia', `inicio == nulo é ${ficouVazia}.`, 'comparison', { variables: { temp: valorRemovido, vazia: ficouVazia } }));
  if (ficouVazia) {
    steps.push(frame(novosValores, 7, 'Atualizando o fim', 'Como início ficou nulo, fim também volta a ser nulo.', 'update', { variables: { temp: valorRemovido } }));
  }

  steps.push(frame(novosValores, 9, 'Retornando o valor removido', `dequeue() retorna ${fmt(valorRemovido)}.`, 'success', { variables: { temp: valorRemovido, retorno: valorRemovido }, output: [`dequeue() retornou ${fmt(valorRemovido)}.`] }));
  steps.push(frame(novosValores, 10, 'dequeue() concluído', `O nó removido continha o valor ${fmt(valorRemovido)}.`, 'done', { variables: { temp: valorRemovido, retorno: valorRemovido }, output: [`dequeue() retornou ${fmt(valorRemovido)}.`] }));
  return steps;
}

function peekSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando peek()', 'peek() é executado.'),
    frame(valores, 1, 'Verificando se a fila está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Fila vazia', 'Não há nó para consultar; o método retorna -1.', 'warning', { variables: { retorno: -1 }, output: ['peek() retornou -1 (fila vazia).'] }));
    steps.push(frame(valores, 5, 'peek() concluído', 'A fila continua exatamente igual.', 'done', { variables: { retorno: -1 }, output: ['peek() retornou -1 (fila vazia).'] }));
    return steps;
  }
  const valor = valores[0];
  steps.push(frame(valores, 4, 'Retornando o valor do início', `inicio.getValor() retorna ${fmt(valor)}.`, 'success', { activeIndices: [0], foundIndices: [0], variables: { retorno: valor }, output: [`peek() retornou ${fmt(valor)}.`] }));
  steps.push(frame(valores, 5, 'peek() concluído', 'A fila continua exatamente igual.', 'done', { foundIndices: [0], variables: { retorno: valor }, output: [`peek() retornou ${fmt(valor)}.`] }));
  return steps;
}

function sizeSteps(valores) {
  const tamanho = valores.length;
  const steps = [
    frame(valores, 0, 'Chamando size()', 'size() é executado.'),
    frame(valores, 1, 'Iniciando o contador', 'contador recebe 0.', 'update', { variables: { contador: 0 } }),
    frame(valores, 2, 'Iniciando o atual', `atual recebe início (${tamanho ? fmt(valores[0]) : 'nulo'}).`, 'update', { activeIndices: tamanho ? [0] : [], variables: { contador: 0, atual: tamanho ? fmt(valores[0]) : 'nulo' } }),
  ];
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 3, 'Verificando atual != nulo', `atual aponta para o nó ${fmt(valores[i])}; a condição é verdadeira.`, 'comparison', { activeIndices: [i], variables: { contador: i, atual: fmt(valores[i]) } }));
    steps.push(frame(valores, 4, 'Incrementando o contador', `contador passa de ${i} para ${i + 1}.`, 'update', { activeIndices: [i], variables: { contador: i + 1, atual: fmt(valores[i]) } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 5, 'Avançando o atual', `atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], variables: { contador: i + 1, atual: proximo } }));
  }
  steps.push(frame(valores, 3, 'Verificando atual != nulo', 'atual chegou a nulo; a condição é falsa.', 'comparison', { variables: { contador: tamanho, atual: 'nulo' } }));
  steps.push(frame(valores, 7, 'Retornando o contador', `size() retorna ${tamanho}.`, 'success', { variables: { contador: tamanho }, output: [`size() retornou ${tamanho}.`] }));
  steps.push(frame(valores, 8, 'size() concluído', 'A fila continua exatamente igual.', 'done', { variables: { contador: tamanho }, output: [`size() retornou ${tamanho}.`] }));
  return steps;
}

function showSteps(valores) {
  const tamanho = valores.length;
  const steps = [
    frame(valores, 0, 'Chamando show()', 'show() é executado.'),
    frame(valores, 1, 'Iniciando a saída', 'saida recebe uma string vazia.', 'update', { variables: { saida: '' } }),
    frame(valores, 2, 'Iniciando o atual', `atual recebe início (${tamanho ? fmt(valores[0]) : 'nulo'}).`, 'update', { activeIndices: tamanho ? [0] : [], variables: { saida: '', atual: tamanho ? fmt(valores[0]) : 'nulo' } }),
  ];

  let texto = '';
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 3, 'Verificando atual != nulo', `atual aponta para o nó ${fmt(valores[i])}; a condição é verdadeira.`, 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { atual: fmt(valores[i]), saida: texto } }));
    texto += `${fmt(valores[i])} `;
    steps.push(frame(valores, 4, 'Concatenando o valor', `saida recebe saida + ${fmt(valores[i])} + " ".`, 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { atual: fmt(valores[i]), saida: texto } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 5, 'Avançando o atual', `atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], processedIndices: range(i + 1), variables: { atual: proximo, saida: texto } }));
  }
  steps.push(frame(valores, 3, 'Verificando atual != nulo', 'atual chegou a nulo; a condição é falsa.', 'comparison', { processedIndices: range(tamanho), variables: { atual: 'nulo', saida: texto } }));
  steps.push(frame(valores, 7, 'Retornando a saída', `show() retorna "${texto.trim()}".`, 'success', { processedIndices: range(tamanho), variables: { saida: texto }, output: [`show() retornou "${texto.trim()}".`] }));
  steps.push(frame(valores, 8, 'show() concluído', 'A fila continua exatamente igual; nada foi removido.', 'done', { processedIndices: range(tamanho), variables: { saida: texto }, output: [`show() retornou "${texto.trim()}".`] }));
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
