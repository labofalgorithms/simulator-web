export const algorithms = [
  {
    id: 'creation', title: 'Criação da lista duplamente encadeada', menuLabel: 'Criação da lista', group: 'Fundamentos', number: '01',
    description: 'Veja como início é iniciado apontando para nulo, sem alocar um vetor.',
    interaction: 'Observe que não existe capacidade máxima: a lista começa vazia e cresce sob demanda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Nenhuma estrutura é alocada antecipadamente; apenas a referência início é criada.' },
    pseudocode: ['CONSTRUTOR ListaDuplamenteEncadeada()', '  inicio ← nulo', 'FIM'],
  },
  {
    id: 'inserirNoInicio', title: 'Inserir no início', menuLabel: 'inserirNoInicio()', group: 'Inserções', number: '02',
    description: 'Ligue o novo nó ao antigo início nos dois sentidos (próximo e anterior) e atualize início.',
    interaction: 'Escolha o valor a inserir e observe os ponteiros próximo e anterior sendo ajustados.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O novo nó é ligado diretamente ao início, sem percorrer a lista.' },
    pseudocode: ['FUNÇÃO inserirNoInicio(dado)', '  novoNo ← novo No(dado)', '  SE inicio == nulo ENTÃO', '    inicio ← novoNo', '  SENÃO', '    novoNo.proximo ← inicio', '    inicio.anterior ← novoNo', '    inicio ← novoNo', '  FIM SE', 'FIM'],
  },
  {
    id: 'inserirNoFim', title: 'Inserir no final', menuLabel: 'inserirNoFim()', group: 'Inserções', number: '03',
    description: 'Percorra até o último nó (aquele cujo próximo é nulo) e ligue-o ao novo nó nos dois sentidos.',
    interaction: 'Escolha o valor a inserir. Início não muda, apenas o último nó da lista.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Sem uma referência para o último nó, é preciso percorrer a lista inteira para encontrá-lo.' },
    pseudocode: ['FUNÇÃO inserirNoFim(dado)', '  novoNo ← novo No(dado)', '  SE inicio == nulo ENTÃO', '    inicio ← novoNo', '  SENÃO', '    temp ← inicio', '    ENQUANTO temp.proximo != nulo FAÇA', '      temp ← temp.proximo', '    FIM ENQUANTO', '    temp.proximo ← novoNo', '    novoNo.anterior ← temp', '  FIM SE', 'FIM'],
  },
  {
    id: 'removerNo', title: 'Remover um valor', menuLabel: 'removerNo()', group: 'Remoções', number: '04',
    description: 'Procure o nó com o valor informado e use os ponteiros próximo e anterior para religar os vizinhos, sem precisar de uma referência auxiliar.',
    interaction: 'Teste removendo o início, um valor no meio, o último e um valor que não existe.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, é preciso percorrer a lista inteira procurando o valor.' },
    pseudocode: ['FUNÇÃO removerNo(valor)', '  SE inicio == nulo ENTÃO', '    RETORNE', '  FIM SE', '  temp ← inicio', '  SE temp.dado == valor ENTÃO', '    inicio ← temp.proximo', '    SE inicio != nulo ENTÃO', '      inicio.anterior ← nulo', '    FIM SE', '    RETORNE', '  FIM SE', '  ENQUANTO temp != nulo E temp.dado != valor FAÇA', '    temp ← temp.proximo', '  FIM ENQUANTO', '  SE temp != nulo ENTÃO', '    SE temp.proximo != nulo ENTÃO', '      temp.proximo.anterior ← temp.anterior', '    FIM SE', '    SE temp.anterior != nulo ENTÃO', '      temp.anterior.proximo ← temp.proximo', '    FIM SE', '  FIM SE', 'FIM'],
  },
  {
    id: 'mostrar', title: 'Mostrar elementos', menuLabel: 'mostrar()', group: 'Consultas', number: '05',
    description: 'Percorra a lista do início até o final, exibindo o valor de cada nó visitado.',
    interaction: 'Acompanhe o temp avançando pelo ponteiro próximo enquanto os valores são exibidos.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada nó é visitado uma vez para exibir seu valor.' },
    pseudocode: ['FUNÇÃO mostrar()', '  SE inicio == nulo ENTÃO', '    ESCREVA "A lista está vazia."', '    RETORNE', '  FIM SE', '  temp ← inicio', '  ENQUANTO temp != nulo FAÇA', '    ESCREVA temp.dado', '    temp ← temp.proximo', '  FIM ENQUANTO', 'FIM'],
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
    frame([], 0, 'Chamando o construtor', 'ListaDuplamenteEncadeada lde = new ListaDuplamenteEncadeada() é executado.'),
    frame([], 1, 'Iniciando o início', 'início recebe nulo, pois nenhum nó foi criado ainda.', 'update', { variables: { inicio: 'nulo' } }),
    frame([], 2, 'Lista criada', 'A lista duplamente encadeada foi criada vazia.', 'done', { variables: { inicio: 'nulo' }, output: ['Lista duplamente encadeada criada.'] }),
  ];
}

function inserirNoInicioSteps(valores, dado) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando inserirNoInicio(dado)', `inserirNoInicio(${fmt(dado)}) é executado.`),
    frame(valores, 1, 'Criando o novo nó', `novoNo armazena o valor ${fmt(dado)}.`, 'reading', { variables: { dado } }),
    frame(valores, 2, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison', { activeIndices: valores.length ? [0] : [], variables: { dado, vazia } }),
  ];
  if (vazia) {
    const novosValores = [dado];
    steps.push(frame(novosValores, 3, 'Definindo o início', 'início passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
    steps.push(frame(novosValores, 9, 'inserirNoInicio() concluído', `${fmt(dado)} agora é o único nó da lista.`, 'done', { foundIndices: [0], variables: { dado }, output: [`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`] }));
    return steps;
  }

  const novosValores = [dado, ...valores];
  steps.push(frame(novosValores, 5, 'Ligando o novo nó ao antigo início', 'novoNo.proximo aponta para o antigo início.', 'update', { activeIndices: [0, 1], variables: { dado } }));
  steps.push(frame(novosValores, 6, 'Ligando o antigo início de volta', 'inicio.anterior passa a apontar para o novo nó.', 'update', { activeIndices: [1], changedIndices: [1], variables: { dado } }));
  steps.push(frame(novosValores, 7, 'Atualizando o início', 'início passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
  steps.push(frame(novosValores, 9, 'inserirNoInicio() concluído', `${fmt(dado)} agora é o primeiro nó da lista.`, 'done', { foundIndices: [0], variables: { dado }, output: [`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`] }));
  return steps;
}

function inserirNoFimSteps(valores, dado) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando inserirNoFim(dado)', `inserirNoFim(${fmt(dado)}) é executado.`),
    frame(valores, 1, 'Criando o novo nó', `novoNo armazena o valor ${fmt(dado)}.`, 'reading', { variables: { dado } }),
    frame(valores, 2, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison', { activeIndices: valores.length ? [valores.length - 1] : [], variables: { dado, vazia } }),
  ];
  if (vazia) {
    const novosValores = [dado];
    steps.push(frame(novosValores, 3, 'Definindo o início', 'início passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
    steps.push(frame(novosValores, 12, 'inserirNoFim() concluído', `${fmt(dado)} agora é o único nó da lista.`, 'done', { foundIndices: [0], variables: { dado }, output: [`inserirNoFim(${fmt(dado)}) inseriu o valor na lista.`] }));
    return steps;
  }

  const lastIndex = valores.length - 1;
  steps.push(frame(valores, 5, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { dado, temp: fmt(valores[0]) } }));
  for (let i = 0; i < lastIndex; i += 1) {
    steps.push(frame(valores, 6, 'Verificando temp.proximo != nulo', `o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de nulo; a condição é verdadeira.`, 'comparison', { activeIndices: [i], variables: { dado, temp: fmt(valores[i]) } }));
    steps.push(frame(valores, 7, 'Avançando o temp', `temp passa a apontar para ${fmt(valores[i + 1])}.`, 'update', { activeIndices: [i + 1], variables: { dado, temp: fmt(valores[i + 1]) } }));
  }
  steps.push(frame(valores, 6, 'Verificando temp.proximo != nulo', `o próximo de ${fmt(valores[lastIndex])} é nulo; a condição é falsa.`, 'comparison', { activeIndices: [lastIndex], variables: { dado, temp: fmt(valores[lastIndex]) } }));

  const novosValores = [...valores, dado];
  const novoIndice = novosValores.length - 1;
  steps.push(frame(novosValores, 9, 'Ligando o último nó ao novo nó', `temp.proximo passa a apontar para ${fmt(dado)}.`, 'update', { activeIndices: [lastIndex, novoIndice], changedIndices: [lastIndex], variables: { dado, temp: fmt(valores[lastIndex]) } }));
  steps.push(frame(novosValores, 10, 'Ligando o novo nó de volta', `novoNo.anterior aponta para ${fmt(valores[lastIndex])}.`, 'update', { activeIndices: [novoIndice], variables: { dado } }));
  steps.push(frame(novosValores, 12, 'inserirNoFim() concluído', `${fmt(dado)} agora é o último nó da lista.`, 'done', { foundIndices: [novoIndice], variables: { dado }, output: [`inserirNoFim(${fmt(dado)}) inseriu o valor no final.`] }));
  return steps;
}

function removerNoSteps(valores, valor) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando removerNo(valor)', `removerNo(${fmt(valor)}) é executado.`),
    frame(valores, 1, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison', { variables: { valor, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Lista vazia', 'Não há nó para remover; o método retorna imediatamente.', 'warning', { output: [`removerNo(${fmt(valor)}) não encontrou a lista (vazia).`] }));
    steps.push(frame(valores, 23, 'removerNo() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: [`removerNo(${fmt(valor)}) não encontrou a lista (vazia).`] }));
    return steps;
  }

  steps.push(frame(valores, 4, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { valor, temp: fmt(valores[0]) } }));
  const ehInicio = valores[0] === valor;
  steps.push(frame(valores, 5, 'Verificando se temp é o valor procurado', `temp.dado == valor é ${ehInicio}.`, 'comparison', { activeIndices: [0], variables: { valor, temp: fmt(valores[0]) } }));

  if (ehInicio) {
    const novosValores = valores.slice(1);
    steps.push(frame(novosValores, 6, 'Atualizando o início', `início passa a apontar para ${novosValores.length ? fmt(novosValores[0]) : 'nulo'}.`, 'update', { variables: { valor } }));
    if (novosValores.length > 0) {
      steps.push(frame(novosValores, 8, 'Removendo a referência anterior', 'início.anterior volta a ser nulo.', 'update', { activeIndices: [0], changedIndices: [0], variables: { valor } }));
    }
    steps.push(frame(novosValores, 23, 'removerNo() concluído', `O nó com valor ${fmt(valor)} foi removido do início.`, 'done', { output: [`removerNo(${fmt(valor)}) removeu o valor.`] }));
    return steps;
  }

  let tempIndex = 0;
  const tamanho = valores.length;
  while (tempIndex < tamanho && valores[tempIndex] !== valor) {
    steps.push(frame(valores, 12, 'Verificando a condição do laço', `temp != nulo e temp.dado (${fmt(valores[tempIndex])}) != valor (${fmt(valor)}) é verdadeiro.`, 'comparison', { activeIndices: [tempIndex], variables: { valor, temp: fmt(valores[tempIndex]) } }));
    tempIndex += 1;
    const tempDesc = tempIndex < tamanho ? fmt(valores[tempIndex]) : 'nulo';
    steps.push(frame(valores, 13, 'Avançando o temp', `temp passa a apontar para ${tempDesc === 'nulo' ? 'nulo' : `o nó ${tempDesc}`}.`, 'update', { activeIndices: tempIndex < tamanho ? [tempIndex] : [], variables: { valor, temp: tempDesc } }));
  }
  const encontrado = tempIndex < tamanho;
  steps.push(frame(valores, 12, 'Verificando a condição do laço', encontrado ? `temp.dado (${fmt(valores[tempIndex])}) == valor; a condição é falsa (encontrado).` : 'temp chegou a nulo; a condição é falsa.', 'comparison', { activeIndices: encontrado ? [tempIndex] : [], variables: { valor, temp: encontrado ? fmt(valores[tempIndex]) : 'nulo' } }));

  if (!encontrado) {
    steps.push(frame(valores, 15, 'Nó não encontrado', 'temp é nulo; nada é alterado.', 'warning', { output: [`removerNo(${fmt(valor)}) não encontrou o valor.`] }));
    steps.push(frame(valores, 23, 'removerNo() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: [`removerNo(${fmt(valor)}) não encontrou o valor.`] }));
    return steps;
  }

  steps.push(frame(valores, 15, 'Nó encontrado', `temp aponta para ${fmt(valores[tempIndex])}; ele será removido.`, 'reading', { activeIndices: [tempIndex], foundIndices: [tempIndex], variables: { valor, temp: fmt(valores[tempIndex]) } }));

  const temProximo = tempIndex < tamanho - 1;
  const temAnterior = tempIndex > 0;
  if (temProximo) {
    steps.push(frame(valores, 17, 'Religando o próximo nó', `temp.proximo.anterior passa a apontar para ${temAnterior ? fmt(valores[tempIndex - 1]) : 'nulo'}.`, 'update', { activeIndices: [tempIndex + 1], changedIndices: [tempIndex + 1], variables: { valor } }));
  }
  if (temAnterior) {
    steps.push(frame(valores, 20, 'Religando o nó anterior', `temp.anterior.proximo passa a apontar para ${temProximo ? fmt(valores[tempIndex + 1]) : 'nulo'}.`, 'update', { activeIndices: [tempIndex - 1], changedIndices: [tempIndex - 1], variables: { valor } }));
  }

  const novosValores = [...valores.slice(0, tempIndex), ...valores.slice(tempIndex + 1)];
  steps.push(frame(novosValores, 23, 'removerNo() concluído', `O nó com valor ${fmt(valor)} foi removido.`, 'done', { output: [`removerNo(${fmt(valor)}) removeu o valor.`] }));
  return steps;
}

function mostrarSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando mostrar()', 'mostrar() é executado.'),
    frame(valores, 1, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Lista vazia', 'O método exibe a mensagem "A lista está vazia.".', 'warning', { output: ['mostrar() exibiu "A lista está vazia.".'] }));
    steps.push(frame(valores, 10, 'mostrar() concluído', 'A execução termina sem percorrer a lista.', 'done', { output: ['mostrar() exibiu "A lista está vazia.".'] }));
    return steps;
  }

  const tamanho = valores.length;
  steps.push(frame(valores, 5, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { temp: fmt(valores[0]) } }));
  let texto = '';
  for (let i = 0; i < tamanho; i += 1) {
    steps.push(frame(valores, 6, 'Verificando temp != nulo', `temp aponta para ${fmt(valores[i])}; a condição é verdadeira.`, 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { temp: fmt(valores[i]), saida: texto } }));
    texto += `${fmt(valores[i])} `;
    steps.push(frame(valores, 7, 'Exibindo o valor', `ESCREVA temp.dado exibe ${fmt(valores[i])}.`, 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { temp: fmt(valores[i]), saida: texto } }));
    const proximo = i + 1 < tamanho ? fmt(valores[i + 1]) : 'nulo';
    steps.push(frame(valores, 8, 'Avançando o temp', `temp passa a apontar para ${proximo === 'nulo' ? 'nulo' : `o nó ${proximo}`}.`, 'update', { activeIndices: i + 1 < tamanho ? [i + 1] : [], processedIndices: range(i + 1), variables: { temp: proximo, saida: texto } }));
  }
  steps.push(frame(valores, 6, 'Verificando temp != nulo', 'temp chegou a nulo; a condição é falsa.', 'comparison', { processedIndices: range(tamanho), variables: { temp: 'nulo', saida: texto } }));
  steps.push(frame(valores, 10, 'mostrar() concluído', `mostrar() exibiu: ${texto.trim()}`, 'done', { processedIndices: range(tamanho), output: [`mostrar() exibiu: ${texto.trim()}`] }));
  return steps;
}

export function buildSteps(id, data, config) {
  const { values } = data;
  switch (id) {
    case 'creation': return creationSteps();
    case 'inserirNoInicio': return inserirNoInicioSteps(values, config.item);
    case 'inserirNoFim': return inserirNoFimSteps(values, config.item);
    case 'removerNo': return removerNoSteps(values, config.item);
    case 'mostrar': return mostrarSteps(values);
    default: return creationSteps();
  }
}
