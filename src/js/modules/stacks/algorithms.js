export const algorithms = [
  {
    id: 'creation', title: 'Criação da pilha estática', menuLabel: 'Criação da pilha', group: 'Fundamentos', number: '01',
    description: 'Veja como o vetor interno é alocado e o índice do topo é iniciado com -1.',
    interaction: 'Ajuste a capacidade da pilha e observe a estrutura sendo criada vazia.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'A criação aloca um vetor de tamanho fixo igual à capacidade.' },
    pseudocode: ['CONSTRUTOR Pilha(maxSize)', '  pilha ← novo vetor[maxSize]', '  topo ← -1', 'FIM'],
  },
  {
    id: 'isFull', title: 'Verificar se está cheia', menuLabel: 'isFull()', group: 'Fundamentos', number: '02',
    description: 'Compare o índice do topo com a última posição válida do vetor.',
    interaction: 'Altere a quantidade de elementos e observe quando o resultado muda para verdadeiro.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas uma comparação é realizada, sem percorrer o vetor.' },
    pseudocode: ['FUNÇÃO isFull()', '  RETORNE (topo == tamanhoVetor - 1)', 'FIM'],
  },
  {
    id: 'isEmpty', title: 'Verificar se está vazia', menuLabel: 'isEmpty()', group: 'Fundamentos', number: '03',
    description: 'Compare o índice do topo com -1.',
    interaction: 'Esvazie a pilha para ver o retorno mudar para verdadeiro.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas uma comparação é realizada.' },
    pseudocode: ['FUNÇÃO isEmpty()', '  RETORNE topo == -1', 'FIM'],
  },
  {
    id: 'push', title: 'Empilhar um elemento', menuLabel: 'push()', group: 'Operações', number: '04',
    description: 'Insira um novo elemento no topo da pilha, se houver espaço.',
    interaction: 'Escolha o valor a empilhar e veja o topo avançar uma posição.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O elemento é escrito diretamente na próxima posição livre.' },
    pseudocode: ['FUNÇÃO push(elemento)', '  SE isFull() == falso ENTÃO', '    topo ← topo + 1', '    pilha[topo] ← elemento', '  FIM SE', 'FIM'],
  },
  {
    id: 'pop', title: 'Desempilhar um elemento', menuLabel: 'pop()', group: 'Operações', number: '05',
    description: 'Remova e retorne o elemento que está no topo da pilha.',
    interaction: 'Desempilhe algumas vezes e observe o topo recuar até chegar a -1.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas o índice do topo é atualizado.' },
    pseudocode: ['FUNÇÃO pop()', '  SE isEmpty() == falso ENTÃO', '    retorno ← pilha[topo]', '    topo ← topo - 1', '    RETORNE retorno', '  SENÃO', '    RETORNE -1', '  FIM SE', 'FIM'],
  },
  {
    id: 'peek', title: 'Consultar o topo', menuLabel: 'peek()', group: 'Operações', number: '06',
    description: 'Leia o elemento do topo sem removê-lo da pilha.',
    interaction: 'Compare o resultado de peek() com o de pop(): o valor é igual, mas a pilha não muda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O elemento é lido diretamente pelo índice topo.' },
    pseudocode: ['FUNÇÃO peek()', '  SE isEmpty() == falso ENTÃO', '    RETORNE pilha[topo]', '  SENÃO', '    RETORNE -1', '  FIM SE', 'FIM'],
  },
  {
    id: 'size', title: 'Tamanho da pilha', menuLabel: 'size()', group: 'Consultas', number: '07',
    description: 'Calcule quantos elementos existem atualmente na pilha.',
    interaction: 'Empilhe ou desempilhe elementos e volte para conferir o novo tamanho.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O tamanho é obtido a partir do índice topo, sem percorrer o vetor.' },
    pseudocode: ['FUNÇÃO size()', '  RETORNE topo + 1', 'FIM'],
  },
  {
    id: 'show', title: 'Mostrar elementos', menuLabel: 'show()', group: 'Consultas', number: '08',
    description: 'Percorra do topo até a base exibindo cada elemento armazenado.',
    interaction: 'Acompanhe a variável i decrescendo do topo até 0.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'Cada elemento armazenado é visitado uma vez para montar a saída.' },
    pseudocode: ['FUNÇÃO show()', '  resposta ← ""', '  SE isEmpty() == verdadeiro ENTÃO', '    RETORNE "Pilha vazia"', '  SENÃO', '    PARA i DE topo ATÉ 0 PASSO -1 FAÇA', '      resposta ← resposta + pilha[i] + "\\n"', '    FIM PARA', '  FIM SE', '  RETORNE resposta', 'FIM'],
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

const frame = (values, capacidade, line, title, description, tone = 'neutral', extra = {}) => ({
  values: clone(values), capacidade, topo: values.length - 1, line, title, description, tone, variables: {}, output: [], ...extra,
});

function creationSteps(capacidade) {
  const empty = [];
  return [
    frame(empty, capacidade, 0, 'Chamando o construtor', `Pilha pilha = new Pilha(${capacidade}) é executado.`, 'neutral', { topo: -1 }),
    frame(empty, capacidade, 1, 'Alocando o vetor', `Um vetor de ${capacidade} posições é reservado na memória.`, 'reading', { topo: -1, variables: { capacidade } }),
    frame(empty, capacidade, 2, 'Iniciando o topo', 'topo recebe -1 para indicar que nenhuma posição está ocupada.', 'update', { topo: -1, variables: { capacidade, topo: -1 } }),
    frame(empty, capacidade, 3, 'Pilha criada', `A pilha foi criada com capacidade ${capacidade} e 0 elementos.`, 'done', { topo: -1, variables: { capacidade, topo: -1 }, output: [`Pilha criada com capacidade ${capacidade}.`] }),
  ];
}

function isFullSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const full = topo === capacidade - 1;
  return [
    frame(valores, capacidade, 0, 'Chamando isFull()', 'O algoritmo verifica se ainda existe espaço livre na pilha.'),
    frame(valores, capacidade, 1, 'Comparando topo com o limite', `topo (${topo}) == tamanhoVetor - 1 (${capacidade - 1}) é ${full ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeIndices: topo >= 0 ? [topo] : [], variables: { topo, tamanhoVetor: capacidade, cheia: full } }),
    frame(valores, capacidade, 2, 'Resultado de isFull()', `O método retorna ${full}.`, full ? 'success' : 'neutral', { foundIndices: full && topo >= 0 ? [topo] : [], variables: { topo, tamanhoVetor: capacidade, cheia: full }, output: [`isFull() retornou ${full}.`] }),
  ];
}

function isEmptySteps(valores, capacidade) {
  const topo = valores.length - 1;
  const empty = topo === -1;
  return [
    frame(valores, capacidade, 0, 'Chamando isEmpty()', 'O algoritmo verifica se existe algum elemento armazenado.'),
    frame(valores, capacidade, 1, 'Comparando topo com -1', `topo == -1 é ${empty ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeIndices: topo >= 0 ? [topo] : [], variables: { topo, vazia: empty } }),
    frame(valores, capacidade, 2, 'Resultado de isEmpty()', `O método retorna ${empty}.`, empty ? 'success' : 'neutral', { variables: { topo, vazia: empty }, output: [`isEmpty() retornou ${empty}.`] }),
  ];
}

function pushSteps(valores, capacidade, elemento) {
  const topoAtual = valores.length - 1;
  const cheia = valores.length >= capacidade;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando push(elemento)', `push(${fmt(elemento)}) é executado.`),
    frame(valores, capacidade, 1, 'Verificando se a pilha está cheia', `isFull() retorna ${cheia}.`, 'comparison', { activeIndices: topoAtual >= 0 ? [topoAtual] : [], variables: { topo: topoAtual, tamanhoVetor: capacidade, cheia } }),
  ];
  if (cheia) {
    steps.push(frame(valores, capacidade, 4, 'Pilha cheia', 'Não há espaço livre; o elemento não será inserido.', 'warning', { variables: { topo: topoAtual, cheia: true }, output: ['StackOverflow: pilha cheia, push não realizado.'] }));
    steps.push(frame(valores, capacidade, 5, 'push() concluído', 'O algoritmo termina sem alterar a pilha.', 'done', { variables: { topo: topoAtual, cheia: true }, output: ['StackOverflow: pilha cheia, push não realizado.'] }));
    return steps;
  }
  const novoTopo = topoAtual + 1;
  const novosValores = [...valores, elemento];
  steps.push(frame(valores, capacidade, 2, 'Incrementando o topo', `topo passa de ${topoAtual} para ${novoTopo}.`, 'update', { topo: novoTopo, activeIndices: [novoTopo], variables: { topo: novoTopo } }));
  steps.push(frame(novosValores, capacidade, 3, 'Escrevendo o elemento', `pilha[${novoTopo}] recebe ${fmt(elemento)}.`, 'update', { activeIndices: [novoTopo], changedIndices: [novoTopo], variables: { topo: novoTopo, elemento } }));
  steps.push(frame(novosValores, capacidade, 4, 'Elemento inserido', `${fmt(elemento)} agora é o topo da pilha.`, 'success', { foundIndices: [novoTopo], variables: { topo: novoTopo, elemento } }));
  steps.push(frame(novosValores, capacidade, 5, 'push() concluído', `push(${fmt(elemento)}) inseriu o valor no índice ${novoTopo}.`, 'done', { foundIndices: [novoTopo], variables: { topo: novoTopo, elemento }, output: [`push(${fmt(elemento)}) inseriu o valor no topo (índice ${novoTopo}).`] }));
  return steps;
}

function popSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const vazia = topo === -1;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando pop()', 'pop() é executado.'),
    frame(valores, capacidade, 1, 'Verificando se a pilha está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: topo >= 0 ? [topo] : [], variables: { topo, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 6, 'Pilha vazia', 'Não há elemento para remover; o método retorna -1.', 'warning', { variables: { topo, retorno: -1 }, output: ['pop() retornou -1 (pilha vazia).'] }));
    steps.push(frame(valores, capacidade, 8, 'pop() concluído', 'O algoritmo termina sem alterar a pilha.', 'done', { variables: { topo, retorno: -1 }, output: ['pop() retornou -1 (pilha vazia).'] }));
    return steps;
  }
  const valor = valores[topo];
  const novosValores = valores.slice(0, -1);
  const novoTopo = topo - 1;
  steps.push(frame(valores, capacidade, 2, 'Lendo o valor do topo', `retorno recebe pilha[${topo}] = ${fmt(valor)}.`, 'reading', { activeIndices: [topo], foundIndices: [topo], variables: { topo, retorno: valor } }));
  steps.push(frame(valores, capacidade, 3, 'Decrementando o topo', `topo passa de ${topo} para ${novoTopo}.`, 'update', { topo: novoTopo, changedIndices: [topo], variables: { topo: novoTopo, retorno: valor } }));
  steps.push(frame(novosValores, capacidade, 4, 'Retornando o valor', `pop() retorna ${fmt(valor)}.`, 'success', { variables: { topo: novoTopo, retorno: valor }, output: [`pop() retornou ${fmt(valor)}.`] }));
  steps.push(frame(novosValores, capacidade, 8, 'pop() concluído', `O elemento removido foi ${fmt(valor)}.`, 'done', { variables: { topo: novoTopo, retorno: valor }, output: [`pop() retornou ${fmt(valor)}.`] }));
  return steps;
}

function peekSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const vazia = topo === -1;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando peek()', 'peek() é executado.'),
    frame(valores, capacidade, 1, 'Verificando se a pilha está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: topo >= 0 ? [topo] : [], variables: { topo, vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 4, 'Pilha vazia', 'Não há elemento para consultar; o método retorna -1.', 'warning', { variables: { topo, retorno: -1 }, output: ['peek() retornou -1 (pilha vazia).'] }));
    steps.push(frame(valores, capacidade, 6, 'peek() concluído', 'A pilha continua exatamente igual.', 'done', { variables: { topo, retorno: -1 }, output: ['peek() retornou -1 (pilha vazia).'] }));
    return steps;
  }
  const valor = valores[topo];
  steps.push(frame(valores, capacidade, 2, 'Lendo pilha[topo]', `pilha[${topo}] contém ${fmt(valor)}.`, 'reading', { activeIndices: [topo], foundIndices: [topo], variables: { topo, retorno: valor } }));
  steps.push(frame(valores, capacidade, 6, 'peek() concluído', `peek() retornou ${fmt(valor)} sem alterar a pilha.`, 'done', { foundIndices: [topo], variables: { topo, retorno: valor }, output: [`peek() retornou ${fmt(valor)}.`] }));
  return steps;
}

function sizeSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const tamanho = topo + 1;
  return [
    frame(valores, capacidade, 0, 'Chamando size()', 'size() é executado.'),
    frame(valores, capacidade, 1, 'Calculando o tamanho', `topo + 1 = ${topo} + 1 = ${tamanho}.`, 'reading', { variables: { topo, tamanho } }),
    frame(valores, capacidade, 2, 'size() concluído', `size() retornou ${tamanho}.`, 'done', { variables: { topo, tamanho }, output: [`size() retornou ${tamanho}.`] }),
  ];
}

function showSteps(valores, capacidade) {
  const topo = valores.length - 1;
  const vazia = topo === -1;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando show()', 'show() é executado.'),
    frame(valores, capacidade, 1, 'Inicializando a resposta', 'resposta recebe uma string vazia.', 'update', { variables: { resposta: '' } }),
    frame(valores, capacidade, 2, 'Verificando se a pilha está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 3, 'Pilha vazia', 'O método retorna a mensagem "Pilha vazia".', 'warning', { output: ['show() retornou "Pilha vazia".'] }));
    steps.push(frame(valores, capacidade, 10, 'show() concluído', 'A execução termina sem percorrer o vetor.', 'done', { output: ['show() retornou "Pilha vazia".'] }));
    return steps;
  }
  const collected = [];
  for (let i = topo; i >= 0; i -= 1) {
    steps.push(frame(valores, capacidade, 5, `Iniciando a iteração i = ${i}`, `O laço PARA seleciona o índice ${i}, do topo em direção à base.`, 'reading', { activeIndices: [i], processedIndices: range(topo, i + 1), variables: { i, resposta: collected.map((item) => item.value).join(' | ') } }));
    collected.push({ index: i, value: valores[i] });
    steps.push(frame(valores, capacidade, 6, `Concatenando pilha[${i}]`, `resposta recebe resposta + ${fmt(valores[i])} + quebra de linha.`, 'update', { activeIndices: [i], processedIndices: range(topo, i), variables: { i, resposta: collected.map((item) => item.value).join(' | ') } }));
  }
  const respostaFinal = collected.map((item) => item.value).join(' | ');
  const outputLines = collected.map((item) => `pilha[${item.index}] = ${fmt(item.value)}`);
  steps.push(frame(valores, capacidade, 7, 'Fim do laço PARA', 'Todas as posições ocupadas já foram visitadas.', 'reading', { processedIndices: range(topo + 1), variables: { resposta: respostaFinal } }));
  steps.push(frame(valores, capacidade, 9, 'Retornando a resposta', 'A string montada é devolvida ao chamador.', 'success', { processedIndices: range(topo + 1), variables: { resposta: respostaFinal }, output: outputLines }));
  steps.push(frame(valores, capacidade, 10, 'show() concluído', 'A pilha continua exatamente igual; nada foi removido.', 'done', { processedIndices: range(topo + 1), variables: { resposta: respostaFinal }, output: outputLines }));
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
