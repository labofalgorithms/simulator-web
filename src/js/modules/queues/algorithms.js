export const algorithms = [
  {
    id: 'creation', title: 'Criação da fila estática', menuLabel: 'Criação da fila', group: 'Fundamentos', number: '01',
    description: 'Veja como o vetor interno é alocado e o índice fim é iniciado com -1.',
    interaction: 'Ajuste a capacidade da fila e observe a estrutura sendo criada vazia.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'A criação aloca um vetor de tamanho fixo igual à capacidade.' },
    pseudocode: ['CONSTRUTOR FilaEstatica(tamanho)', '  vetorFila ← novo vetor[tamanho]', '  fim ← -1', 'FIM'],
  },
  {
    id: 'isFull', title: 'Verificar se está cheia', menuLabel: 'isFull()', group: 'Fundamentos', number: '02',
    description: 'Compare o índice fim com a última posição válida do vetor.',
    interaction: 'Altere a quantidade de elementos e observe quando o resultado muda para verdadeiro.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas uma comparação é realizada, sem percorrer o vetor.' },
    pseudocode: ['FUNÇÃO isFull()', '  SE fim == tamanhoVetor - 1 ENTÃO', '    RETORNE verdadeiro', '  SENÃO', '    RETORNE falso', '  FIM SE', 'FIM'],
  },
  {
    id: 'isEmpty', title: 'Verificar se está vazia', menuLabel: 'isEmpty()', group: 'Fundamentos', number: '03',
    description: 'Compare o índice fim com -1.',
    interaction: 'Esvazie a fila para ver o retorno mudar para verdadeiro.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Apenas uma comparação é realizada.' },
    pseudocode: ['FUNÇÃO isEmpty()', '  SE fim == -1 ENTÃO', '    RETORNE verdadeiro', '  SENÃO', '    RETORNE falso', '  FIM SE', 'FIM'],
  },
  {
    id: 'enqueue', title: 'Inserir um elemento', menuLabel: 'enqueue()', group: 'Operações', number: '04',
    description: 'Insira um novo elemento no final da fila, se houver espaço.',
    interaction: 'Escolha o valor a inserir e veja o índice fim avançar uma posição.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O elemento é escrito diretamente na próxima posição livre.' },
    pseudocode: ['FUNÇÃO enqueue(elemento)', '  SE isFull() == falso ENTÃO', '    fim ← fim + 1', '    vetorFila[fim] ← elemento', '  FIM SE', 'FIM'],
  },
  {
    id: 'dequeue', title: 'Remover um elemento', menuLabel: 'dequeue()', group: 'Operações', number: '05',
    description: 'Remova o elemento do início da fila e desloque os demais uma posição.',
    interaction: 'Remova alguns elementos e observe o deslocamento de todo o vetor.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Todos os elementos restantes são deslocados uma posição para a esquerda.' },
    pseudocode: ['FUNÇÃO dequeue()', '  SE isEmpty() == falso ENTÃO', '    n ← vetorFila[0]', '    PARA i DE 0 ATÉ fim - 1 FAÇA', '      vetorFila[i] ← vetorFila[i + 1]', '    FIM PARA', '    fim ← fim - 1', '    RETORNE n', '  SENÃO', '    RETORNE -1', '  FIM SE', 'FIM'],
  },
  {
    id: 'peek', title: 'Consultar o início', menuLabel: 'peek()', group: 'Operações', number: '06',
    description: 'Leia o elemento do início da fila sem removê-lo.',
    interaction: 'Compare o resultado de peek() com o de dequeue(): o valor é igual, mas a fila não muda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O elemento é lido diretamente na posição 0.' },
    pseudocode: ['FUNÇÃO peek()', '  SE isEmpty() == falso ENTÃO', '    RETORNE vetorFila[0]', '  SENÃO', '    RETORNE -1', '  FIM SE', 'FIM'],
  },
  {
    id: 'show', title: 'Mostrar elementos', menuLabel: 'show()', group: 'Consultas', number: '07',
    description: 'Percorra do início até o fim exibindo cada elemento armazenado.',
    interaction: 'Acompanhe a variável i crescendo de 0 até fim.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'Cada elemento armazenado é visitado uma vez para montar a saída.' },
    pseudocode: ['FUNÇÃO show()', '  SE isEmpty() ENTÃO', '    ESCREVA "Fila vazia"', '  SENÃO', '    PARA i DE 0 ATÉ fim FAÇA', '      ESCREVA vetorFila[i]', '    FIM PARA', '  FIM SE', 'FIM'],
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));

const frame = (values, capacidade, line, title, description, tone = 'neutral', extra = {}) => ({
  values: clone(values), capacidade, fim: values.length - 1, line, title, description, tone, variables: {}, output: [], ...extra,
});

function creationSteps(capacidade) {
  const empty = [];
  return [
    frame(empty, capacidade, 0, 'Chamando o construtor', `FilaEstatica fEstat = new FilaEstatica(${capacidade}) é executado.`, 'neutral', { fim: -1 }),
    frame(empty, capacidade, 1, 'Alocando o vetor', `Um vetor de ${capacidade} posições é reservado na memória.`, 'reading', { fim: -1, variables: { capacidade } }),
    frame(empty, capacidade, 2, 'Iniciando o fim', 'fim recebe -1 para indicar que nenhuma posição está ocupada.', 'update', { fim: -1, variables: { capacidade, fim: -1 } }),
    frame(empty, capacidade, 3, 'Fila criada', `A fila foi criada com capacidade ${capacidade} e 0 elementos.`, 'done', { fim: -1, variables: { capacidade, fim: -1 }, output: [`Fila criada com capacidade ${capacidade}.`] }),
  ];
}

function isFullSteps(valores, capacidade) {
  const fim = valores.length - 1;
  const full = fim === capacidade - 1;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando isFull()', 'O algoritmo verifica se ainda existe espaço livre na fila.'),
    frame(valores, capacidade, 1, 'Comparando fim com o limite', `fim (${fim}) == tamanhoVetor - 1 (${capacidade - 1}) é ${full ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeIndices: fim >= 0 ? [fim] : [], variables: { fim, tamanhoVetor: capacidade } }),
  ];
  if (full) {
    steps.push(frame(valores, capacidade, 2, 'Retornando verdadeiro', 'A fila ocupa todas as posições disponíveis.', 'success', { foundIndices: fim >= 0 ? [fim] : [], variables: { fim, cheia: true } }));
  } else {
    steps.push(frame(valores, capacidade, 4, 'Retornando falso', 'Ainda existe espaço livre para inserção.', 'neutral', { variables: { fim, cheia: false } }));
  }
  steps.push(frame(valores, capacidade, 6, 'isFull() concluído', `O método retorna ${full}.`, 'done', { variables: { fim, cheia: full }, output: [`isFull() retornou ${full}.`] }));
  return steps;
}

function isEmptySteps(valores, capacidade) {
  const fim = valores.length - 1;
  const empty = fim === -1;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando isEmpty()', 'O algoritmo verifica se existe algum elemento armazenado.'),
    frame(valores, capacidade, 1, 'Comparando fim com -1', `fim == -1 é ${empty ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeIndices: fim >= 0 ? [0] : [], variables: { fim } }),
  ];
  if (empty) {
    steps.push(frame(valores, capacidade, 2, 'Retornando verdadeiro', 'A fila não possui elementos armazenados.', 'success', { variables: { fim, vazia: true } }));
  } else {
    steps.push(frame(valores, capacidade, 4, 'Retornando falso', 'Existe pelo menos um elemento armazenado.', 'neutral', { variables: { fim, vazia: false } }));
  }
  steps.push(frame(valores, capacidade, 6, 'isEmpty() concluído', `O método retorna ${empty}.`, 'done', { variables: { fim, vazia: empty }, output: [`isEmpty() retornou ${empty}.`] }));
  return steps;
}

function enqueueSteps(valores, capacidade, elemento) {
  const fimAtual = valores.length - 1;
  const cheia = valores.length >= capacidade;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando enqueue(elemento)', `enqueue(${fmt(elemento)}) é executado.`),
    frame(valores, capacidade, 1, 'Verificando se a fila está cheia', `isFull() retorna ${cheia}.`, 'comparison', { activeIndices: fimAtual >= 0 ? [fimAtual] : [], variables: { fim: fimAtual, cheia } }),
  ];
  if (cheia) {
    steps.push(frame(valores, capacidade, 4, 'Fila cheia', 'Não há espaço livre; o elemento não será inserido.', 'warning', { variables: { fim: fimAtual, cheia: true }, output: ['Fila cheia: enqueue não realizado.'] }));
    steps.push(frame(valores, capacidade, 5, 'enqueue() concluído', 'O algoritmo termina sem alterar a fila.', 'done', { variables: { fim: fimAtual, cheia: true }, output: ['Fila cheia: enqueue não realizado.'] }));
    return steps;
  }
  const novoFim = fimAtual + 1;
  const novosValores = [...valores, elemento];
  steps.push(frame(valores, capacidade, 2, 'Incrementando o fim', `fim passa de ${fimAtual} para ${novoFim}.`, 'update', { fim: novoFim, activeIndices: [novoFim], variables: { fim: novoFim } }));
  steps.push(frame(novosValores, capacidade, 3, 'Escrevendo o elemento', `vetorFila[${novoFim}] recebe ${fmt(elemento)}.`, 'update', { activeIndices: [novoFim], changedIndices: [novoFim], variables: { fim: novoFim, elemento } }));
  steps.push(frame(novosValores, capacidade, 4, 'Elemento inserido', `${fmt(elemento)} agora ocupa o final da fila.`, 'success', { foundIndices: [novoFim], variables: { fim: novoFim, elemento } }));
  steps.push(frame(novosValores, capacidade, 5, 'enqueue() concluído', `enqueue(${fmt(elemento)}) inseriu o valor no índice ${novoFim}.`, 'done', { foundIndices: [novoFim], variables: { fim: novoFim, elemento }, output: [`enqueue(${fmt(elemento)}) inseriu o valor no final (índice ${novoFim}).`] }));
  return steps;
}

function dequeueSteps(valores, capacidade) {
  const fim = valores.length - 1;
  const vazia = fim === -1;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando dequeue()', 'dequeue() é executado.'),
    frame(valores, capacidade, 1, 'Verificando se a fila está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: fim >= 0 ? [0] : [], variables: { fim } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 9, 'Fila vazia', 'Não há elemento para remover; o método retorna -1.', 'warning', { variables: { fim, retorno: -1 }, output: ['dequeue() retornou -1 (fila vazia).'] }));
    steps.push(frame(valores, capacidade, 11, 'dequeue() concluído', 'O algoritmo termina sem alterar a fila.', 'done', { variables: { fim, retorno: -1 }, output: ['dequeue() retornou -1 (fila vazia).'] }));
    return steps;
  }

  const n = valores[0];
  steps.push(frame(valores, capacidade, 2, 'Guardando o valor removido', `n recebe vetorFila[0] = ${fmt(n)}.`, 'reading', { activeIndices: [0], foundIndices: [0], variables: { fim, n } }));

  let working = clone(valores);
  for (let i = 0; i < fim; i += 1) {
    steps.push(frame(working, capacidade, 3, `Iniciando a iteração i = ${i}`, `O laço PARA seleciona o índice ${i} para receber o valor seguinte.`, 'reading', { activeIndices: [i, i + 1], variables: { i, n } }));
    working = clone(working);
    working[i] = working[i + 1];
    steps.push(frame(working, capacidade, 4, `Deslocando vetorFila[${i + 1}] para a posição ${i}`, `vetorFila[${i}] recebe ${fmt(working[i])}.`, 'update', { activeIndices: [i, i + 1], changedIndices: [i], variables: { i, n } }));
  }

  const novosValores = working.slice(0, fim);
  const novoFim = fim - 1;
  steps.push(frame(working, capacidade, 6, 'Fim do laço PARA', fim > 0 ? 'Todos os demais elementos já foram deslocados uma posição para a esquerda.' : 'Era o único elemento; não havia nada para deslocar.', 'reading', { variables: { fim, n } }));
  steps.push(frame(novosValores, capacidade, 7, 'Decrementando fim', `fim passa de ${fim} para ${novoFim}.`, 'update', { variables: { fim: novoFim, n } }));
  steps.push(frame(novosValores, capacidade, 8, 'Retornando o valor removido', `dequeue() retorna ${fmt(n)}.`, 'success', { variables: { fim: novoFim, n }, output: [`dequeue() retornou ${fmt(n)}.`] }));
  steps.push(frame(novosValores, capacidade, 11, 'dequeue() concluído', `O elemento removido foi ${fmt(n)}; os demais avançaram uma posição.`, 'done', { variables: { fim: novoFim, n }, output: [`dequeue() retornou ${fmt(n)}.`] }));
  return steps;
}

function peekSteps(valores, capacidade) {
  const fim = valores.length - 1;
  const vazia = fim === -1;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando peek()', 'peek() é executado.'),
    frame(valores, capacidade, 1, 'Verificando se a fila está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { activeIndices: fim >= 0 ? [0] : [], variables: { fim } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 4, 'Fila vazia', 'Não há elemento para consultar; o método retorna -1.', 'warning', { variables: { fim, retorno: -1 }, output: ['peek() retornou -1 (fila vazia).'] }));
    steps.push(frame(valores, capacidade, 6, 'peek() concluído', 'A fila continua exatamente igual.', 'done', { variables: { fim, retorno: -1 }, output: ['peek() retornou -1 (fila vazia).'] }));
    return steps;
  }
  const valor = valores[0];
  steps.push(frame(valores, capacidade, 2, 'Lendo vetorFila[0]', `vetorFila[0] contém ${fmt(valor)}.`, 'reading', { activeIndices: [0], foundIndices: [0], variables: { fim, retorno: valor } }));
  steps.push(frame(valores, capacidade, 6, 'peek() concluído', `peek() retornou ${fmt(valor)} sem alterar a fila.`, 'done', { foundIndices: [0], variables: { fim, retorno: valor }, output: [`peek() retornou ${fmt(valor)}.`] }));
  return steps;
}

function showSteps(valores, capacidade) {
  const fim = valores.length - 1;
  const vazia = fim === -1;
  const steps = [
    frame(valores, capacidade, 0, 'Chamando show()', 'show() é executado.'),
    frame(valores, capacidade, 1, 'Verificando se a fila está vazia', `isEmpty() retorna ${vazia}.`, 'comparison', { variables: { vazia } }),
  ];
  if (vazia) {
    steps.push(frame(valores, capacidade, 2, 'Fila vazia', 'O método exibe a mensagem "Fila vazia".', 'warning', { output: ['show() exibiu "Fila vazia".'] }));
    steps.push(frame(valores, capacidade, 8, 'show() concluído', 'A execução termina sem percorrer o vetor.', 'done', { output: ['show() exibiu "Fila vazia".'] }));
    return steps;
  }
  const outputLines = [];
  for (let i = 0; i <= fim; i += 1) {
    steps.push(frame(valores, capacidade, 4, `Iniciando a iteração i = ${i}`, `O laço PARA seleciona o índice ${i}, do início em direção ao fim.`, 'reading', { activeIndices: [i], processedIndices: Array.from({ length: i }, (_, index) => index), variables: { i } }));
    outputLines.push(`vetorFila[${i}] = ${fmt(valores[i])}`);
    steps.push(frame(valores, capacidade, 5, `Exibindo vetorFila[${i}]`, `O valor armazenado no índice ${i} é ${fmt(valores[i])}.`, 'reading', { activeIndices: [i], processedIndices: Array.from({ length: i + 1 }, (_, index) => index), variables: { i, valor: valores[i] }, output: [...outputLines] }));
  }
  steps.push(frame(valores, capacidade, 7, 'show() concluído', 'A fila continua exatamente igual; nada foi removido.', 'done', { processedIndices: Array.from({ length: fim + 1 }, (_, index) => index), output: outputLines }));
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
