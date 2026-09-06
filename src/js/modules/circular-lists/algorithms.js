export const algorithms = [
  {
    id: 'creation', title: 'Criação da lista circular', menuLabel: 'Criação da lista', group: 'Fundamentos', number: '01',
    description: 'Veja como início é iniciado apontando para nulo, sem alocar um vetor.',
    interaction: 'Observe que não existe capacidade máxima: a lista começa vazia e cresce sob demanda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Nenhuma estrutura é alocada antecipadamente; apenas a referência início é criada.' },
    pseudocode: ['CONSTRUTOR ListaCircular()', '  inicio ← nulo', 'FIM'],
  },
  {
    id: 'inserirNoInicio', title: 'Inserir no início', menuLabel: 'inserirNoInicio()', group: 'Inserções', number: '02',
    description: 'Percorra até o último nó (aquele cujo próximo é início) e ligue-o ao novo nó, que passa a ser o início.',
    interaction: 'Escolha o valor a inserir e observe o ciclo sendo refeito.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Como não há referência para o último nó, é preciso percorrer a lista inteira para encontrá-lo.' },
    pseudocode: ['FUNÇÃO inserirNoInicio(dado)', '  novoNo ← novo No(dado)', '  SE inicio == nulo ENTÃO', '    inicio ← novoNo', '    inicio.proximo ← inicio', '  SENÃO', '    temp ← inicio', '    ENQUANTO temp.proximo != inicio FAÇA', '      temp ← temp.proximo', '    FIM ENQUANTO', '    novoNo.proximo ← inicio', '    temp.proximo ← novoNo', '    inicio ← novoNo', '  FIM SE', 'FIM'],
  },
  {
    id: 'inserirNoFim', title: 'Inserir no final', menuLabel: 'inserirNoFim()', group: 'Inserções', number: '03',
    description: 'Percorra até o último nó e ligue-o ao novo nó, que passa a fechar o ciclo apontando para início.',
    interaction: 'Escolha o valor a inserir. Início não muda, apenas o último nó da lista.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Sem uma referência para o último nó, é preciso percorrer a lista inteira para encontrá-lo.' },
    pseudocode: ['FUNÇÃO inserirNoFim(dado)', '  novoNo ← novo No(dado)', '  SE inicio == nulo ENTÃO', '    inicio ← novoNo', '    inicio.proximo ← inicio', '  SENÃO', '    temp ← inicio', '    ENQUANTO temp.proximo != inicio FAÇA', '      temp ← temp.proximo', '    FIM ENQUANTO', '    temp.proximo ← novoNo', '    novoNo.proximo ← inicio', '  FIM SE', 'FIM'],
  },
  {
    id: 'deletarNo', title: 'Excluir um nó', menuLabel: 'deletarNo()', group: 'Remoções', number: '04',
    description: 'Procure o nó com o valor informado e ajuste as referências para retirá-lo do ciclo.',
    interaction: 'Teste excluir o início, o único nó, um valor no meio/fim e um valor que não existe.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, é preciso percorrer a lista inteira procurando o valor.' },
    pseudocode: ['FUNÇÃO deletarNo(chave)', '  SE inicio == nulo ENTÃO', '    RETORNE', '  FIM SE', '  SE inicio.dado == chave E inicio.proximo == inicio ENTÃO', '    inicio ← nulo', '    RETORNE', '  FIM SE', '  auxiliar ← inicio', '  SE inicio.dado == chave ENTÃO', '    ENQUANTO auxiliar.proximo != inicio FAÇA', '      auxiliar ← auxiliar.proximo', '    FIM ENQUANTO', '    auxiliar.proximo ← inicio.proximo', '    inicio ← auxiliar.proximo', '  SENÃO', '    d ← nulo', '    ENQUANTO auxiliar.proximo != inicio E auxiliar.proximo.dado != chave FAÇA', '      auxiliar ← auxiliar.proximo', '    FIM ENQUANTO', '    SE auxiliar.proximo.dado == chave ENTÃO', '      d ← auxiliar.proximo', '      auxiliar.proximo ← d.proximo', '    FIM SE', '  FIM SE', 'FIM'],
  },
  {
    id: 'mostrar', title: 'Mostrar elementos', menuLabel: 'mostrar()', group: 'Consultas', number: '05',
    description: 'Percorra o ciclo a partir do início, exibindo cada nó, até voltar para início.',
    interaction: 'Acompanhe o temp avançando nó a nó em um laço "faça...enquanto", necessário porque a lista não tem um fim natural.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada nó é visitado exatamente uma vez, mesmo sem um ponteiro nulo para parar.' },
    pseudocode: ['FUNÇÃO mostrar()', '  SE inicio == nulo ENTÃO', '    RETORNE', '  FIM SE', '  temp ← inicio', '  FAÇA', '    ESCREVA temp.dado', '    temp ← temp.proximo', '  ENQUANTO temp != inicio', 'FIM'],
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
    frame([], 0, 'Chamando o construtor', 'ListaCircular lc = new ListaCircular() é executado.'),
    frame([], 1, 'Iniciando o início', 'início recebe nulo, pois nenhum nó foi criado ainda.', 'update', { variables: { inicio: 'nulo' } }),
    frame([], 2, 'Lista criada', 'A lista circular foi criada vazia.', 'done', { variables: { inicio: 'nulo' }, output: ['Lista circular criada.'] }),
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
    steps.push(frame(novosValores, 4, 'Fechando o ciclo', 'O novo nó aponta para si mesmo, formando um ciclo de um elemento.', 'update', { activeIndices: [0], variables: { dado } }));
    steps.push(frame(novosValores, 14, 'inserirNoInicio() concluído', `${fmt(dado)} agora é o único nó da lista.`, 'done', { foundIndices: [0], variables: { dado }, output: [`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`] }));
    return steps;
  }

  const lastIndex = valores.length - 1;
  steps.push(frame(valores, 6, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { dado, temp: fmt(valores[0]) } }));
  for (let i = 0; i < lastIndex; i += 1) {
    steps.push(frame(valores, 7, 'Verificando temp.proximo != inicio', `o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de início; a condição é verdadeira.`, 'comparison', { activeIndices: [i], variables: { dado, temp: fmt(valores[i]) } }));
    steps.push(frame(valores, 8, 'Avançando o temp', `temp passa a apontar para ${fmt(valores[i + 1])}.`, 'update', { activeIndices: [i + 1], variables: { dado, temp: fmt(valores[i + 1]) } }));
  }
  steps.push(frame(valores, 7, 'Verificando temp.proximo != inicio', `o próximo de ${fmt(valores[lastIndex])} é o próprio início; a condição é falsa.`, 'comparison', { activeIndices: [lastIndex], variables: { dado, temp: fmt(valores[lastIndex]) } }));

  const novosValores = [dado, ...valores];
  steps.push(frame(novosValores, 10, 'Ligando o novo nó ao início', 'novoNo.proximo aponta para o antigo início.', 'update', { activeIndices: [0], variables: { dado, temp: fmt(valores[lastIndex]) } }));
  steps.push(frame(novosValores, 11, 'Fechando o ciclo pelo final', `temp.proximo passa a apontar para ${fmt(dado)}.`, 'update', { activeIndices: [lastIndex + 1, 0], changedIndices: [lastIndex + 1], variables: { dado, temp: fmt(valores[lastIndex]) } }));
  steps.push(frame(novosValores, 12, 'Atualizando o início', 'início passa a apontar para o novo nó.', 'update', { activeIndices: [0], changedIndices: [0], variables: { dado } }));
  steps.push(frame(novosValores, 14, 'inserirNoInicio() concluído', `${fmt(dado)} agora é o primeiro nó da lista.`, 'done', { foundIndices: [0], variables: { dado }, output: [`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`] }));
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
    steps.push(frame(novosValores, 4, 'Fechando o ciclo', 'O novo nó aponta para si mesmo, formando um ciclo de um elemento.', 'update', { activeIndices: [0], variables: { dado } }));
    steps.push(frame(novosValores, 12, 'inserirNoFim() concluído', `${fmt(dado)} agora é o único nó da lista.`, 'done', { foundIndices: [0], variables: { dado }, output: [`inserirNoFim(${fmt(dado)}) inseriu o valor na lista.`] }));
    return steps;
  }

  const lastIndex = valores.length - 1;
  steps.push(frame(valores, 6, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { dado, temp: fmt(valores[0]) } }));
  for (let i = 0; i < lastIndex; i += 1) {
    steps.push(frame(valores, 7, 'Verificando temp.proximo != inicio', `o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de início; a condição é verdadeira.`, 'comparison', { activeIndices: [i], variables: { dado, temp: fmt(valores[i]) } }));
    steps.push(frame(valores, 8, 'Avançando o temp', `temp passa a apontar para ${fmt(valores[i + 1])}.`, 'update', { activeIndices: [i + 1], variables: { dado, temp: fmt(valores[i + 1]) } }));
  }
  steps.push(frame(valores, 7, 'Verificando temp.proximo != inicio', `o próximo de ${fmt(valores[lastIndex])} é o próprio início; a condição é falsa.`, 'comparison', { activeIndices: [lastIndex], variables: { dado, temp: fmt(valores[lastIndex]) } }));

  const novosValores = [...valores, dado];
  const novoIndice = novosValores.length - 1;
  steps.push(frame(novosValores, 10, 'Ligando o último nó ao novo nó', `temp.proximo passa a apontar para ${fmt(dado)}.`, 'update', { activeIndices: [lastIndex, novoIndice], changedIndices: [lastIndex], variables: { dado, temp: fmt(valores[lastIndex]) } }));
  steps.push(frame(novosValores, 11, 'Fechando o ciclo', `novoNo.proximo aponta de volta para início (${fmt(valores[0])}).`, 'update', { activeIndices: [novoIndice], variables: { dado } }));
  steps.push(frame(novosValores, 13, 'inserirNoFim() concluído', `${fmt(dado)} agora é o último nó da lista.`, 'done', { foundIndices: [novoIndice], variables: { dado }, output: [`inserirNoFim(${fmt(dado)}) inseriu o valor no final.`] }));
  return steps;
}

function deletarNoSteps(valores, chave) {
  const steps = [frame(valores, 0, 'Chamando deletarNo(chave)', `deletarNo(${fmt(chave)}) é executado.`)];
  const vazia = valores.length === 0;
  steps.push(frame(valores, 1, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison', { variables: { chave, vazia } }));
  if (vazia) {
    steps.push(frame(valores, 2, 'Lista vazia', 'Não há nó para excluir; o método retorna imediatamente.', 'warning', { output: [`deletarNo(${fmt(chave)}) não encontrou a lista (vazia).`] }));
    steps.push(frame(valores, 25, 'deletarNo() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: [`deletarNo(${fmt(chave)}) não encontrou a lista (vazia).`] }));
    return steps;
  }

  const unico = valores.length === 1;
  const inicioEhChave = valores[0] === chave;
  steps.push(frame(valores, 4, 'Verificando único nó igual à chave', `inicio.dado == chave E inicio.proximo == inicio é ${unico && inicioEhChave}.`, 'comparison', { activeIndices: [0], variables: { chave } }));
  if (unico && inicioEhChave) {
    steps.push(frame([], 5, 'Esvaziando a lista', 'início volta a ser nulo.', 'update', { variables: { chave } }));
    steps.push(frame([], 25, 'deletarNo() concluído', `O nó com valor ${fmt(chave)} foi removido; a lista ficou vazia.`, 'done', { output: [`deletarNo(${fmt(chave)}) removeu o único nó.`] }));
    return steps;
  }

  steps.push(frame(valores, 8, 'Iniciando o auxiliar', `auxiliar recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { chave, auxiliar: fmt(valores[0]) } }));
  steps.push(frame(valores, 9, 'Verificando se o início é a chave', `inicio.dado == chave é ${inicioEhChave}.`, 'comparison', { activeIndices: [0], variables: { chave, auxiliar: fmt(valores[0]) } }));

  const lastIndex = valores.length - 1;

  if (inicioEhChave) {
    for (let i = 0; i < lastIndex; i += 1) {
      steps.push(frame(valores, 10, 'Verificando auxiliar.proximo != inicio', `o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de início; a condição é verdadeira.`, 'comparison', { activeIndices: [i], variables: { chave, auxiliar: fmt(valores[i]) } }));
      steps.push(frame(valores, 11, 'Avançando o auxiliar', `auxiliar passa a apontar para ${fmt(valores[i + 1])}.`, 'update', { activeIndices: [i + 1], variables: { chave, auxiliar: fmt(valores[i + 1]) } }));
    }
    steps.push(frame(valores, 10, 'Verificando auxiliar.proximo != inicio', `o próximo de ${fmt(valores[lastIndex])} é o próprio início; a condição é falsa.`, 'comparison', { activeIndices: [lastIndex], variables: { chave, auxiliar: fmt(valores[lastIndex]) } }));

    const novosValores = valores.slice(1);
    steps.push(frame(novosValores, 13, 'Religando o último nó', `auxiliar.proximo passa a apontar para ${novosValores.length ? fmt(novosValores[0]) : 'nulo'}.`, 'update', { activeIndices: [lastIndex], variables: { chave, auxiliar: fmt(valores[lastIndex]) } }));
    steps.push(frame(novosValores, 14, 'Atualizando o início', `início passa a apontar para ${novosValores.length ? fmt(novosValores[0]) : 'nulo'}.`, 'update', { activeIndices: [0], changedIndices: [0], variables: { chave } }));
    steps.push(frame(novosValores, 25, 'deletarNo() concluído', `O nó com valor ${fmt(chave)} foi removido do início.`, 'done', { output: [`deletarNo(${fmt(chave)}) removeu o valor.`] }));
    return steps;
  }

  steps.push(frame(valores, 16, 'Iniciando d', 'd recebe nulo.', 'update', { variables: { chave, auxiliar: fmt(valores[0]), d: 'nulo' } }));

  let auxIndex = 0;
  while (auxIndex < lastIndex && valores[auxIndex + 1] !== chave) {
    steps.push(frame(valores, 17, 'Verificando a condição do laço', `auxiliar.proximo (${fmt(valores[auxIndex + 1])}) é diferente de início e de chave; a condição é verdadeira.`, 'comparison', { activeIndices: [auxIndex, auxIndex + 1], variables: { chave, auxiliar: fmt(valores[auxIndex]), d: 'nulo' } }));
    auxIndex += 1;
    steps.push(frame(valores, 18, 'Avançando o auxiliar', `auxiliar passa a apontar para ${fmt(valores[auxIndex])}.`, 'update', { activeIndices: [auxIndex], variables: { chave, auxiliar: fmt(valores[auxIndex]), d: 'nulo' } }));
  }
  const encontrado = auxIndex < lastIndex && valores[auxIndex + 1] === chave;
  steps.push(frame(valores, 17, 'Verificando a condição do laço', encontrado ? `auxiliar.proximo (${fmt(valores[auxIndex + 1])}) é igual à chave; a condição é falsa (encontrado).` : 'auxiliar.proximo voltou a início; a condição é falsa (não encontrado).', 'comparison', { activeIndices: [auxIndex], variables: { chave, auxiliar: fmt(valores[auxIndex]) } }));

  if (!encontrado) {
    steps.push(frame(valores, 20, 'Verificando auxiliar.proximo.dado == chave', `auxiliar.proximo aponta para início (${fmt(valores[0])}); o valor não é igual à chave.`, 'comparison', { activeIndices: [0], variables: { chave, auxiliar: fmt(valores[auxIndex]) } }));
    steps.push(frame(valores, 25, 'deletarNo() concluído', `O valor ${fmt(chave)} não foi encontrado na lista.`, 'done', { output: [`deletarNo(${fmt(chave)}) não encontrou o valor.`] }));
    return steps;
  }

  const alvoIndex = auxIndex + 1;
  const removido = valores[alvoIndex];
  steps.push(frame(valores, 20, 'Verificando auxiliar.proximo.dado == chave', `${fmt(removido)} == chave é verdadeiro.`, 'comparison', { activeIndices: [alvoIndex], variables: { chave, auxiliar: fmt(valores[auxIndex]) } }));
  steps.push(frame(valores, 21, 'Guardando o nó a remover', `d recebe o nó ${fmt(removido)}.`, 'reading', { activeIndices: [alvoIndex], foundIndices: [alvoIndex], variables: { chave, d: fmt(removido) } }));

  const novosValores = [...valores.slice(0, alvoIndex), ...valores.slice(alvoIndex + 1)];
  const proximoDesc = alvoIndex < lastIndex ? fmt(valores[alvoIndex + 1]) : 'início';
  steps.push(frame(novosValores, 22, 'Religando o auxiliar', `auxiliar.proximo passa a apontar para ${proximoDesc}, removendo ${fmt(removido)} do ciclo.`, 'update', { activeIndices: [auxIndex], changedIndices: [auxIndex], variables: { chave, d: fmt(removido) } }));
  steps.push(frame(novosValores, 25, 'deletarNo() concluído', `O nó com valor ${fmt(removido)} foi removido.`, 'done', { output: [`deletarNo(${fmt(chave)}) removeu o valor.`] }));
  return steps;
}

function mostrarSteps(valores) {
  const vazia = valores.length === 0;
  const steps = [
    frame(valores, 0, 'Chamando mostrar()', 'mostrar() é executado.'),
    frame(valores, 1, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, 2, 'Lista vazia', 'O método retorna imediatamente, sem exibir nada.', 'warning', { output: ['mostrar() não exibiu nada (lista vazia).'] }));
    steps.push(frame(valores, 9, 'mostrar() concluído', 'A execução termina sem percorrer a lista.', 'done', { output: ['mostrar() não exibiu nada (lista vazia).'] }));
    return steps;
  }

  const tamanho = valores.length;
  steps.push(frame(valores, 4, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0], variables: { temp: fmt(valores[0]) } }));
  let texto = '';
  for (let i = 0; i < tamanho; i += 1) {
    texto += `${fmt(valores[i])} `;
    steps.push(frame(valores, 6, 'Exibindo o valor', `ESCREVA temp.dado exibe ${fmt(valores[i])}.`, 'update', { activeIndices: [i], processedIndices: range(i), variables: { temp: fmt(valores[i]), saida: texto } }));
    const proximoIndex = (i + 1) % tamanho;
    steps.push(frame(valores, 7, 'Avançando o temp', `temp passa a apontar para ${fmt(valores[proximoIndex])}.`, 'update', { activeIndices: [proximoIndex], processedIndices: range(i + 1), variables: { temp: fmt(valores[proximoIndex]), saida: texto } }));
    const continuar = proximoIndex !== 0;
    steps.push(frame(valores, 8, 'Verificando temp != inicio', continuar ? `temp aponta para ${fmt(valores[proximoIndex])}, diferente de início; a condição é verdadeira.` : 'temp voltou ao início; a condição é falsa.', 'comparison', { activeIndices: [proximoIndex], processedIndices: range(i + 1), variables: { temp: fmt(valores[proximoIndex]), saida: texto } }));
  }
  steps.push(frame(valores, 9, 'mostrar() concluído', `mostrar() exibiu: ${texto.trim()}`, 'done', { processedIndices: range(tamanho), output: [`mostrar() exibiu: ${texto.trim()}`] }));
  return steps;
}

export function buildSteps(id, data, config) {
  const { values } = data;
  switch (id) {
    case 'creation': return creationSteps();
    case 'inserirNoInicio': return inserirNoInicioSteps(values, config.item);
    case 'inserirNoFim': return inserirNoFimSteps(values, config.item);
    case 'deletarNo': return deletarNoSteps(values, config.item);
    case 'mostrar': return mostrarSteps(values);
    default: return creationSteps();
  }
}
