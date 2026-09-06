export const algorithms = [
  {
    id: 'creation', title: 'Criação da pilha dinâmica', menuLabel: 'Criação da pilha', group: 'Fundamentos', number: '01',
    description: 'Veja como o atributo topo é iniciado apontando para nulo, sem alocar um vetor.',
    interaction: 'Observe que não existe capacidade máxima: a pilha começa vazia e cresce sob demanda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Nenhuma estrutura é alocada antecipadamente; apenas a referência topo é criada.' },
    pseudocode: ['CONSTRUTOR PilhaDinamica()', '  topo ← nulo', 'FIM'],
  },
  {
    id: 'isEmpty', title: 'Verificar se está vazia', menuLabel: 'isEmpty()', group: 'Fundamentos', number: '02',
    description: 'Compare o atributo topo com nulo.',
    interaction: 'Esvazie a pilha para ver o retorno mudar para verdadeiro.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas uma comparação é realizada.' },
    pseudocode: ['FUNÇÃO isEmpty()', '  RETORNE (topo == nulo)', 'FIM'],
  },
  {
    id: 'push', title: 'Empilhar um elemento', menuLabel: 'push()', group: 'Operações', number: '03',
    description: 'Crie um novo nó, aponte-o para o antigo topo e atualize o topo para esse novo nó.',
    interaction: 'Escolha o valor a empilhar. Não existe verificação de pilha cheia: a pilha sempre cresce.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Um novo nó é criado e ligado diretamente, sem percorrer a pilha.' },
    pseudocode: ['FUNÇÃO push(dado)', '  novoNo ← novo No(dado)', '  novoNo.setProximoNo(topo)', '  topo ← novoNo', 'FIM'],
  },
  {
    id: 'pop', title: 'Desempilhar um elemento', menuLabel: 'pop()', group: 'Operações', number: '04',
    description: 'Guarde o nó do topo, avance o topo para o próximo nó e retorne o valor guardado.',
    interaction: 'Desempilhe algumas vezes e observe o topo avançar nó a nó até chegar a nulo.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas a referência topo é atualizada; nenhum outro nó é percorrido.' },
    pseudocode: ['FUNÇÃO pop()', '  SE isEmpty() ENTÃO', '    RETORNE -1', '  FIM SE', '  temp ← topo', '  topo ← topo.getProximoNo()', '  RETORNE temp.getValor()', 'FIM'],
  },
  {
    id: 'peek', title: 'Consultar o topo', menuLabel: 'peek()', group: 'Operações', number: '05',
    description: 'Leia o valor do nó do topo sem removê-lo.',
    interaction: 'Compare o resultado de peek() com o de pop(): o valor é igual, mas a pilha não muda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O valor é lido diretamente do nó apontado por topo.' },
    pseudocode: ['FUNÇÃO peek()', '  SE isEmpty() ENTÃO', '    RETORNE -1', '  FIM SE', '  RETORNE topo.getValor()', 'FIM'],
  },
  {
    id: 'size', title: 'Tamanho da pilha', menuLabel: 'size()', group: 'Consultas', number: '06',
    description: 'Percorra a pilha nó por nó, contando quantos elementos existem.',
    interaction: 'Acompanhe o auxiliar avançando de nó em nó até chegar a nulo.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Como não existe um atributo de tamanho, é preciso percorrer todos os nós.' },
    pseudocode: ['FUNÇÃO size()', '  auxiliar ← topo', '  contador ← 0', '  ENQUANTO auxiliar != nulo FAÇA', '    contador ← contador + 1', '    auxiliar ← auxiliar.getProximoNo()', '  FIM ENQUANTO', '  RETORNE contador', 'FIM'],
  },
  {
    id: 'display', title: 'Mostrar elementos', menuLabel: 'display()', group: 'Consultas', number: '07',
    description: 'Percorra a pilha do topo até o final, concatenando os valores encontrados.',
    interaction: 'Acompanhe o atual avançando nó a nó enquanto o texto é montado.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'Cada nó é visitado uma vez para montar o texto de saída.' },
    pseudocode: ['FUNÇÃO display()', '  SE isEmpty() ENTÃO', '    RETORNE "Pilha vazia."', '  FIM SE', '  atual ← topo', '  retorno ← ""', '  ENQUANTO atual != nulo FAÇA', '    retorno ← retorno + atual.getValor() + " "', '    atual ← atual.getProximoNo()', '  FIM ENQUANTO', '  RETORNE retorno', 'FIM'],
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
    frame([], 0, 'Chamando o construtor', 'PilhaDinamica pd = new PilhaDinamica() é executado.'),
    frame([], 1, 'Iniciando o topo', 'topo recebe nulo, pois nenhum nó foi criado ainda.', 'update', { variables: { topo: 'nulo' } }),
    frame([], 2, 'Pilha criada', 'A pilha dinâmica foi criada vazia, sem um tamanho máximo definido.', 'done', { variables: { topo: 'nulo' }, output: ['Pilha dinâmica criada.'] }),
  ];
}

function isEmptySteps(valores) {
  const vazia = valores.length === 0;
  return [
    frame(valores, 0, 'Chamando isEmpty()', 'O algoritmo verifica se topo aponta para nulo.'),
    frame(valores, 1, 'Comparando topo com nulo', `topo == nulo é ${vazia ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
    frame(valores, 2, 'isEmpty() concluído', `O método retorna ${vazia}.`, 'done', { variables: { vazia }, output: [`isEmpty() retornou ${vazia}.`] }),
  ];
}

function pushSteps(valores, dado) {
  const steps = [
    frame(valores, 0, 'Chamando push(dado)', `push(${fmt(dado)}) é executado.`),
    frame(valores, 1, 'Criando o novo nó', `novoNo armazena o valor ${fmt(dado)}.`, 'reading', { variables: { dado } }),
    frame(valores, 2, 'Apontando para o topo antigo', `novoNo passa a apontar para ${valores.length ? `o nó ${fmt(valores[0])}` : 'nulo'}.`, 'reading', { variables: { dado, proximo: valores.length ? fmt(valores[0]) : 'nulo' } }),
  ];
  const novosValores = [dado, ...valores];
  steps.push(frame(novosValores, 3, 'Atualizando o topo', 'topo passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
  steps.push(frame(novosValores, 4, 'push() concluído', `${fmt(dado)} agora é o topo da pilha.`, 'done', { foundIndices: [0], variables: { dado }, output: [`push(${fmt(dado)}) inseriu o valor no topo.`] }));
  return steps;
}

function popSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando pop()', 'pop() é executado.'),
    frame(valores, 1, 'Verificando se a pilha está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Pilha vazia', 'Não há nó para remover; o método retorna -1.', 'warning', { variables: { retorno: -1 }, output: ['pop() retornou -1 (pilha vazia).'] }));
    steps.push(frame(valores, 7, 'pop() concluído', 'O algoritmo termina sem alterar a pilha.', 'done', { variables: { retorno: -1 }, output: ['pop() retornou -1 (pilha vazia).'] }));
    return steps;
  }

  const valor = valores[0];
  steps.push(frame(valores, 4, 'Guardando o nó do topo', `temp recebe o nó que contém ${fmt(valor)}.`, 'reading', { activeIndices: [0], foundIndices: [0], variables: { temp: valor } }));
  const novosValores = valores.slice(1);
  steps.push(frame(novosValores, 5, 'Atualizando o topo', `topo passa a apontar para ${novosValores.length ? `o nó ${fmt(novosValores[0])}` : 'nulo'}.`, 'update', { variables: { temp: valor } }));
  steps.push(frame(novosValores, 6, 'Retornando o valor removido', `pop() retorna ${fmt(valor)}.`, 'success', { variables: { temp: valor, retorno: valor }, output: [`pop() retornou ${fmt(valor)}.`] }));
  steps.push(frame(novosValores, 7, 'pop() concluído', `O nó removido continha o valor ${fmt(valor)}.`, 'done', { variables: { temp: valor, retorno: valor }, output: [`pop() retornou ${fmt(valor)}.`] }));
  return steps;
}

function peekSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando peek()', 'peek() é executado.'),
    frame(valores, 1, 'Verificando se a pilha está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Pilha vazia', 'Não há nó para consultar; o método retorna -1.', 'warning', { variables: { retorno: -1 }, output: ['peek() retornou -1 (pilha vazia).'] }));
    steps.push(frame(valores, 5, 'peek() concluído', 'A pilha continua exatamente igual.', 'done', { variables: { retorno: -1 }, output: ['peek() retornou -1 (pilha vazia).'] }));
    return steps;
  }
  const valor = valores[0];
  steps.push(frame(valores, 4, 'Retornando o valor do topo', `topo.getValor() retorna ${fmt(valor)}.`, 'success', { activeIndices: [0], foundIndices: [0], variables: { retorno: valor }, output: [`peek() retornou ${fmt(valor)}.`] }));
  steps.push(frame(valores, 5, 'peek() concluído', 'A pilha continua exatamente igual.', 'done', { foundIndices: [0], variables: { retorno: valor }, output: [`peek() retornou ${fmt(valor)}.`] }));
  return steps;
}

function sizeSteps(valores) {
  const tamanho = valores.length;
  const steps = [
    frame(valores, 0, 'Chamando size()', 'size() é executado.'),
    frame(valores, 1, 'Iniciando o auxiliar', `auxiliar recebe topo (${tamanho ? fmt(valores[0]) : 'nulo'}).`, 'update', { activeIndices: tamanho ? [0] : [], variables: { auxiliar: tamanho ? fmt(valores[0]) : 'nulo' } }),
    frame(valores, 2, 'Iniciando o contador', 'contador recebe 0.', 'update', { activeIndices: tamanho ? [0] : [], variables: { auxiliar: tamanho ? fmt(valores[0]) : 'nulo', contador: 0 } }),
  ];
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 3, 'Verificando auxiliar != nulo', `auxiliar aponta para o nó ${fmt(valores[i])}; a condição é verdadeira.`, 'comparison', { activeIndices: [i], variables: { contador: i, auxiliar: fmt(valores[i]) } }));
    steps.push(frame(valores, 4, 'Incrementando o contador', `contador passa de ${i} para ${i + 1}.`, 'update', { activeIndices: [i], variables: { contador: i + 1, auxiliar: fmt(valores[i]) } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 5, 'Avançando o auxiliar', `auxiliar passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], variables: { contador: i + 1, auxiliar: proximo } }));
  }
  steps.push(frame(valores, 3, 'Verificando auxiliar != nulo', 'auxiliar chegou a nulo; a condição é falsa.', 'comparison', { variables: { contador: tamanho, auxiliar: 'nulo' } }));
  steps.push(frame(valores, 7, 'Retornando o contador', `size() retorna ${tamanho}.`, 'success', { variables: { contador: tamanho }, output: [`size() retornou ${tamanho}.`] }));
  steps.push(frame(valores, 8, 'size() concluído', 'A pilha continua exatamente igual.', 'done', { variables: { contador: tamanho }, output: [`size() retornou ${tamanho}.`] }));
  return steps;
}

function displaySteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando display()', 'display() é executado.'),
    frame(valores, 1, 'Verificando se a pilha está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Pilha vazia', 'O método retorna a mensagem "Pilha vazia.".', 'warning', { output: ['display() retornou "Pilha vazia.".'] }));
    steps.push(frame(valores, 11, 'display() concluído', 'A execução termina sem percorrer a pilha.', 'done', { output: ['display() retornou "Pilha vazia.".'] }));
    return steps;
  }

  const tamanho = valores.length;
  steps.push(frame(valores, 4, 'Iniciando o atual', `atual recebe topo (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { atual: fmt(valores[0]) } }));
  steps.push(frame(valores, 5, 'Iniciando o retorno', 'retorno recebe uma string vazia.', 'update', { activeIndices: [0], variables: { atual: fmt(valores[0]), retorno: '' } }));

  let texto = '';
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 6, 'Verificando atual != nulo', `atual aponta para o nó ${fmt(valores[i])}; a condição é verdadeira.`, 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { atual: fmt(valores[i]), retorno: texto } }));
    texto += `${fmt(valores[i])} `;
    steps.push(frame(valores, 7, 'Concatenando o valor', `retorno recebe retorno + ${fmt(valores[i])} + " ".`, 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { atual: fmt(valores[i]), retorno: texto } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 8, 'Avançando o atual', `atual passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], processedIndices: range(i + 1), variables: { atual: proximo, retorno: texto } }));
  }
  steps.push(frame(valores, 6, 'Verificando atual != nulo', 'atual chegou a nulo; a condição é falsa.', 'comparison', { processedIndices: range(tamanho), variables: { atual: 'nulo', retorno: texto } }));
  steps.push(frame(valores, 10, 'Retornando o texto', `display() retorna "${texto.trim()}".`, 'success', { processedIndices: range(tamanho), variables: { retorno: texto }, output: [`display() retornou "${texto.trim()}".`] }));
  steps.push(frame(valores, 11, 'display() concluído', 'A pilha continua exatamente igual; nada foi removido.', 'done', { processedIndices: range(tamanho), variables: { retorno: texto }, output: [`display() retornou "${texto.trim()}".`] }));
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
