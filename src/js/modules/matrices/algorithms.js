export const algorithms = [
  {
    id: 'dimensions', title: 'Dimensões e índices', menuLabel: 'Dimensões e índices', group: 'Fundamentos', number: '01',
    description: 'Identifique linhas, colunas e os limites de índices de uma matriz bidimensional.',
    interaction: 'Clique em qualquer célula para observar sua coordenada [linha][coluna].',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'As dimensões são obtidas diretamente por A.length e A[0].length.' },
    pseudocode: ['FUNÇÃO analisarMatriz(A)', '  m ← A.length', '  n ← A[0].length', '  primeiro ← A[0][0]', '  ultimo ← A[m-1][n-1]', '  RETORNE m, n, primeiro, ultimo', 'FIM'],
  },
  {
    id: 'access', title: 'Acesso aos elementos', menuLabel: 'Acessar elemento', group: 'Fundamentos', number: '02',
    description: 'Acesse diretamente um elemento usando os índices da linha e da coluna.',
    interaction: 'Informe linha e coluna ou clique em uma célula para mudar a posição acessada.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Acesso A[i][j] não exige percorrer a matriz.' },
    pseudocode: ['FUNÇÃO acessar(A, linha, coluna)', '  SE linha/coluna forem inválidos ENTÃO', '    ESCREVA "Índice inválido"', '    RETORNE', '  FIM SE', '  valor ← A[linha][coluna]', '  RETORNE valor', 'FIM'],
  },
  {
    id: 'update', title: 'Alterando valores', menuLabel: 'Alterar elemento', group: 'Fundamentos', number: '03',
    description: 'Substitua o valor armazenado em uma posição específica da matriz.',
    interaction: 'Escolha linha, coluna e novo valor. Clique em uma célula para selecionar sua posição.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'A atribuição A[i][j] ← valor modifica diretamente uma célula.' },
    pseudocode: ['FUNÇÃO alterar(A, linha, coluna, novoValor)', '  SE linha/coluna forem inválidos ENTÃO', '    ESCREVA "Índice inválido"', '    RETORNE', '  FIM SE', '  anterior ← A[linha][coluna]', '  A[linha][coluna] ← novoValor', '  RETORNE anterior, A[linha][coluna]', 'FIM'],
  },
  {
    id: 'traversal', title: 'Percurso com for tradicional', menuLabel: 'Percurso com for', group: 'Percursos', number: '04',
    description: 'Percorra linhas e colunas usando dois laços de repetição aninhados.',
    interaction: 'Avance passo a passo e acompanhe as variáveis i e j mudando de posição.',
    complexity: { time: 'O(m·n)', space: 'O(1)', note: 'Cada uma das m·n células é visitada uma vez.' },
    pseudocode: ['FUNÇÃO exibir(A)', '  PARA i DE 0 ATÉ A.length - 1 FAÇA', '    PARA j DE 0 ATÉ A[i].length - 1 FAÇA', '      ESCREVA A[i][j]', '    FIM PARA', '    ESCREVA novaLinha', '  FIM PARA', 'FIM'],
  },
  {
    id: 'foreach', title: 'Percurso com for-each', menuLabel: 'Percurso com for-each', group: 'Percursos', number: '05',
    description: 'Percorra a matriz sem manipular explicitamente os índices, usando linha e elemento.',
    interaction: 'Compare este percurso com o for tradicional e observe que os valores são visitados na mesma ordem.',
    complexity: { time: 'O(m·n)', space: 'O(1)', note: 'O for-each simplifica a sintaxe, mas ainda visita todos os elementos.' },
    pseudocode: ['FUNÇÃO exibirForEach(A)', '  PARA CADA linha EM A FAÇA', '    PARA CADA elemento EM linha FAÇA', '      ESCREVA elemento', '    FIM PARA', '    ESCREVA novaLinha', '  FIM PARA', 'FIM'],
  },
  {
    id: 'sum', title: 'Soma de elementos', menuLabel: 'Soma total', group: 'Operações comuns', number: '06',
    description: 'Some todos os elementos da matriz usando um acumulador.',
    interaction: 'Observe a soma parcial após cada célula visitada.',
    complexity: { time: 'O(m·n)', space: 'O(1)', note: 'Todos os elementos precisam participar do somatório.' },
    pseudocode: ['ALGORITMO SomaTotal(A, m, n)', '  S ← 0', '  PARA i DE 0 ATÉ m-1 FAÇA', '    PARA j DE 0 ATÉ n-1 FAÇA', '      S ← S + A[i][j]', '    FIM-PARA', '  FIM-PARA', '  RETORNE S', 'FIM'],
  },
  {
    id: 'maximum', title: 'Encontrar maior valor', menuLabel: 'Maior valor', group: 'Operações comuns', number: '07',
    description: 'Compare cada célula com o maior valor encontrado até o momento.',
    interaction: 'Veja cada comparação e quando maxVal é atualizado.',
    complexity: { time: 'O(m·n)', space: 'O(1)', note: 'Para garantir o maior valor, todas as células devem ser examinadas.' },
    pseudocode: ['ALGORITMO MaiorValor(A, m, n)', '  maxVal ← A[0][0]', '  PARA i DE 0 ATÉ m-1 FAÇA', '    PARA j DE 0 ATÉ n-1 FAÇA', '      SE A[i][j] > maxVal ENTÃO', '        maxVal ← A[i][j]', '      FIM-SE', '    FIM-PARA', '  FIM-PARA', '  RETORNE maxVal', 'FIM'],
  },
  {
    id: 'average', title: 'Calcular média', menuLabel: 'Média', group: 'Operações comuns', number: '08',
    description: 'Calcule a média aritmética usando a soma total e a quantidade m·n de elementos.',
    interaction: 'Acompanhe primeiro o somatório e, ao final, a divisão pelo número de células.',
    complexity: { time: 'O(m·n)', space: 'O(1)', note: 'A matriz é percorrida uma vez; a divisão ocorre somente no final.' },
    pseudocode: ['ALGORITMO Media(A, m, n)', '  totalElementos ← m * n', '  SE totalElementos = 0 ENTÃO', '    RETORNE 0', '  FIM-SE', '  S ← 0', '  PARA i DE 0 ATÉ m-1 FAÇA', '    PARA j DE 0 ATÉ n-1 FAÇA', '      S ← S + A[i][j]', '    FIM-PARA', '  FIM-PARA', '  media ← S / totalElementos', '  RETORNE media', 'FIM'],
  },
  {
    id: 'row-sum', title: 'Somar elementos por linha', menuLabel: 'Soma por linha', group: 'Operações comuns', number: '09',
    description: 'Crie um vetor rowSum em que cada posição contém a soma de uma linha.',
    interaction: 'Observe o acumulador s reiniciar em zero quando o algoritmo muda de linha.',
    complexity: { time: 'O(m·n)', space: 'O(m)', note: 'Além da matriz, é criado um vetor com uma soma para cada linha.' },
    pseudocode: ['ALGORITMO SomaPorLinha(A, m, n)', '  CRIE vetor rowSum[0..m-1]', '  PARA i DE 0 ATÉ m-1 FAÇA', '    s ← 0', '    PARA j DE 0 ATÉ n-1 FAÇA', '      s ← s + A[i][j]', '    FIM-PARA', '    rowSum[i] ← s', '  FIM-PARA', '  RETORNE rowSum', 'FIM'],
  },
  {
    id: 'col-sum', title: 'Somar elementos por coluna', menuLabel: 'Soma por coluna', group: 'Operações comuns', number: '10',
    description: 'Crie um vetor colSum em que cada posição acumula os valores de uma coluna.',
    interaction: 'Veja cada célula contribuir para a posição correspondente em colSum.',
    complexity: { time: 'O(m·n)', space: 'O(n)', note: 'O vetor auxiliar possui uma posição para cada coluna.' },
    pseudocode: ['ALGORITMO SomaPorColuna(A, m, n)', '  CRIE vetor colSum[0..n-1]', '  PARA j DE 0 ATÉ n-1 FAÇA', '    colSum[j] ← 0', '  FIM-PARA', '  PARA i DE 0 ATÉ m-1 FAÇA', '    PARA j DE 0 ATÉ n-1 FAÇA', '      colSum[j] ← colSum[j] + A[i][j]', '    FIM-PARA', '  FIM-PARA', '  RETORNE colSum', 'FIM'],
  },
  {
    id: 'identity', title: 'Criar matriz identidade', menuLabel: 'Matriz identidade', group: 'Transformações', number: '11',
    description: 'Construa uma matriz quadrada com 1 na diagonal principal e 0 nas demais posições.',
    interaction: 'Altere a ordem n e acompanhe a condição i = j em cada célula.',
    complexity: { time: 'O(n²)', space: 'O(n²)', note: 'O algoritmo cria e preenche todas as n² posições da nova matriz.' },
    pseudocode: ['ALGORITMO MatrizIdentidade(n)', '  CRIE matriz I[0..n-1][0..n-1]', '  PARA i DE 0 ATÉ n-1 FAÇA', '    PARA j DE 0 ATÉ n-1 FAÇA', '      SE i = j ENTÃO', '        I[i][j] ← 1', '      SENÃO', '        I[i][j] ← 0', '      FIM-SE', '    FIM-PARA', '  FIM-PARA', '  RETORNE I', 'FIM'],
  },
  {
    id: 'transpose', title: 'Transposição de matriz', menuLabel: 'Transposição', group: 'Transformações', number: '12',
    description: 'Produza T (n × m) movendo cada A[i][j] para T[j][i].',
    interaction: 'Observe simultaneamente a célula de origem em A e sua posição de destino em T.',
    complexity: { time: 'O(m·n)', space: 'O(m·n)', note: 'Cada elemento é copiado uma vez para uma nova matriz de mesmo número de células.' },
    pseudocode: ['ALGORITMO Transposta(A, m, n)', '  CRIE matriz T[0..n-1][0..m-1]', '  PARA i DE 0 ATÉ m-1 FAÇA', '    PARA j DE 0 ATÉ n-1 FAÇA', '      T[j][i] ← A[i][j]', '    FIM-PARA', '  FIM-PARA', '  RETORNE T', 'FIM'],
  },
  {
    id: 'symmetric', title: 'Verificar matriz simétrica', menuLabel: 'Matriz simétrica', group: 'Transformações', number: '13',
    description: 'Verifique o exercício da aula comparando A[i][j] com A[j][i] em uma matriz quadrada.',
    interaction: 'Teste uma matriz simétrica e depois altere apenas uma célula fora da diagonal.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'É suficiente comparar os pares espelhados em relação à diagonal principal.' },
    pseudocode: ['ALGORITMO EhSimetrica(A, m, n)', '  SE m ≠ n ENTÃO', '    RETORNE FALSO', '  FIM-SE', '  PARA i DE 0 ATÉ n-1 FAÇA', '    PARA j DE i+1 ATÉ n-1 FAÇA', '      SE A[i][j] ≠ A[j][i] ENTÃO', '        RETORNE FALSO', '      FIM-SE', '    FIM-PARA', '  FIM-PARA', '  RETORNE VERDADEIRO', 'FIM'],
  },
  {
    id: 'jagged', title: 'Matrizes irregulares (Jagged Arrays)', menuLabel: 'Jagged arrays', group: 'Estruturas especiais', number: '14',
    description: 'Visualize uma matriz em que cada linha possui uma quantidade diferente de colunas.',
    interaction: 'Altere os tamanhos das linhas, por exemplo 2, 4, 3, e observe cada vetor interno ser alocado.',
    complexity: { time: 'O(total)', space: 'O(total)', note: 'O custo depende da soma das quantidades de posições alocadas em todas as linhas.' },
    pseudocode: ['ALGORITMO CriarJagged(tamanhos)', '  r ← tamanhos.length', '  CRIE matriz jagged com r linhas', '  PARA i DE 0 ATÉ r-1 FAÇA', '    jagged[i] ← novo vetor[tamanhos[i]]', '  FIM-PARA', '  RETORNE jagged', 'FIM'],
  },
];

const cloneMatrix = (matrix) => matrix.map((row) => [...row]);
const zeroMatrix = (rows, cols) => Array.from({ length: rows }, () => Array(cols).fill(0));
const fmt = (value) => Number.isInteger(Number(value)) ? String(Number(value)) : Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const coord = (row, col) => `${row},${col}`;
const allCells = (matrix) => matrix.flatMap((row, i) => row.map((_, j) => coord(i, j)));
const step = (matrix, line, title, description, tone = 'neutral', extra = {}) => ({ values: cloneMatrix(matrix), line, title, description, tone, variables: {}, output: [], ...extra });

function dimensionsSteps(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  return [
    step(matrix, 0, 'Matriz recebida', `A matriz possui ${m} linhas e ${n} colunas.`),
    step(matrix, 1, 'Obtendo o número de linhas', `A.length retorna ${m}.`, 'reading', { variables: { m } }),
    step(matrix, 2, 'Obtendo o número de colunas', `A[0].length retorna ${n}.`, 'reading', { activeRows: [0], variables: { m, n } }),
    step(matrix, 3, 'Primeira posição', `A[0][0] = ${fmt(matrix[0][0])}.`, 'reading', { activeCells: [coord(0, 0)], variables: { m, n, primeiroIndice: '[0][0]', primeiroValor: matrix[0][0] } }),
    step(matrix, 4, 'Última posição', `O último índice é [${m - 1}][${n - 1}] e contém ${fmt(matrix[m - 1][n - 1])}.`, 'reading', { activeCells: [coord(m - 1, n - 1)], variables: { m, n, ultimoIndice: `[${m - 1}][${n - 1}]`, ultimoValor: matrix[m - 1][n - 1] } }),
    step(matrix, 5, 'Dimensões identificadas', `${m} × ${n} = ${m * n} células.`, 'success', { processedCells: allCells(matrix), variables: { m, n, total: m * n }, output: [`Linhas: ${m}`, `Colunas: ${n}`, `Total de elementos: ${m * n}`] }),
    step(matrix, 6, 'Análise concluída', 'Os índices de linhas e colunas começam em zero.', 'done', { processedCells: allCells(matrix), variables: { m, n }, output: [`Índices de linha: 0..${m - 1}`, `Índices de coluna: 0..${n - 1}`] }),
  ];
}

function validateCell(matrix, row, col) {
  return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length;
}

function accessSteps(matrix, config) {
  const row = config.row;
  const col = config.col;
  const valid = validateCell(matrix, row, col);
  const steps = [step(matrix, 0, 'Preparando o acesso', `Tentaremos acessar A[${row}][${col}].`)];
  steps.push(step(matrix, 1, 'Validando os índices', valid ? `A posição [${row}][${col}] existe.` : `A posição [${row}][${col}] está fora da matriz.`, valid ? 'comparison' : 'warning', { activeCells: valid ? [coord(row, col)] : [], variables: { linha: row, coluna: col, valido: valid } }));
  if (!valid) {
    steps.push(step(matrix, 2, 'Índice inválido', 'O acesso é bloqueado para evitar ArrayIndexOutOfBoundsException.', 'warning', { variables: { linha: row, coluna: col, valido: false }, output: ['Índice inválido.'] }));
    steps.push(step(matrix, 3, 'Operação encerrada', 'Nenhuma célula foi acessada.', 'done', { output: ['Operação cancelada.'] }));
    return steps;
  }
  const value = matrix[row][col];
  steps.push(step(matrix, 5, 'Lendo a célula', `A[${row}][${col}] contém ${fmt(value)}.`, 'reading', { activeCells: [coord(row, col)], resultCells: [coord(row, col)], variables: { linha: row, coluna: col, valor: value } }));
  steps.push(step(matrix, 6, 'Retornando o valor', `O valor ${fmt(value)} é retornado.`, 'success', { resultCells: [coord(row, col)], variables: { linha: row, coluna: col, valor: value }, output: [`A[${row}][${col}] = ${fmt(value)}`] }));
  steps.push(step(matrix, 7, 'Acesso concluído', 'A matriz não foi modificada.', 'done', { resultCells: [coord(row, col)], output: [`A[${row}][${col}] = ${fmt(value)}`] }));
  return steps;
}

function updateSteps(matrix, config) {
  const row = config.row;
  const col = config.col;
  const newValue = config.newValue;
  const valid = validateCell(matrix, row, col);
  const steps = [step(matrix, 0, 'Preparando a alteração', `Tentaremos escrever ${fmt(newValue)} em A[${row}][${col}].`)];
  steps.push(step(matrix, 1, 'Validando os índices', valid ? `A posição [${row}][${col}] existe.` : `A posição [${row}][${col}] está fora da matriz.`, valid ? 'comparison' : 'warning', { activeCells: valid ? [coord(row, col)] : [], variables: { linha: row, coluna: col, valido: valid } }));
  if (!valid) {
    steps.push(step(matrix, 2, 'Índice inválido', 'Nenhuma atribuição será realizada.', 'warning', { output: ['Índice inválido.'] }));
    steps.push(step(matrix, 3, 'Operação encerrada', 'A matriz permanece inalterada.', 'done', { output: ['Matriz inalterada.'] }));
    return steps;
  }
  const previous = matrix[row][col];
  steps.push(step(matrix, 5, 'Guardando o valor anterior', `anterior recebe ${fmt(previous)}.`, 'reading', { activeCells: [coord(row, col)], variables: { linha: row, coluna: col, anterior: previous, novoValor: newValue } }));
  const changed = cloneMatrix(matrix);
  changed[row][col] = newValue;
  steps.push(step(changed, 6, 'Escrevendo o novo valor', `A[${row}][${col}] recebe ${fmt(newValue)}.`, 'update', { activeCells: [coord(row, col)], changedCells: [coord(row, col)], variables: { linha: row, coluna: col, anterior: previous, novoValor: newValue } }));
  steps.push(step(changed, 7, 'Retornando a alteração', `${fmt(previous)} foi substituído por ${fmt(newValue)}.`, 'success', { resultCells: [coord(row, col)], variables: { anterior: previous, atual: newValue }, output: [`A[${row}][${col}]: ${fmt(previous)} → ${fmt(newValue)}`] }));
  steps.push(step(changed, 8, 'Alteração concluída', 'A nova matriz aparece na visualização.', 'done', { resultCells: [coord(row, col)], output: [`A[${row}][${col}] = ${fmt(newValue)}`] }));
  return steps;
}

function traversalSteps(matrix, useForEach = false) {
  const steps = [step(matrix, 0, useForEach ? 'Iniciando o for-each' : 'Iniciando o percurso', 'A matriz será visitada linha por linha.')];
  const output = [];
  const processed = [];
  for (let i = 0; i < matrix.length; i += 1) {
    const outerLine = 1;
    steps.push(step(matrix, outerLine, useForEach ? `Selecionando a linha ${i}` : `Iniciando i = ${i}`, useForEach ? `linha referencia A[${i}].` : `O laço externo seleciona a linha ${i}.`, 'reading', { activeRows: [i], processedCells: [...processed], variables: useForEach ? { linha: `A[${i}]` } : { i } , output: [...output] }));
    const rowOutput = [];
    for (let j = 0; j < matrix[i].length; j += 1) {
      steps.push(step(matrix, 2, useForEach ? `Selecionando elemento ${fmt(matrix[i][j])}` : `Iniciando j = ${j}`, useForEach ? `elemento recebe o próximo valor da linha: ${fmt(matrix[i][j])}.` : `O laço interno seleciona A[${i}][${j}].`, 'reading', { activeRows: [i], activeCols: [j], activeCells: [coord(i, j)], processedCells: [...processed], variables: useForEach ? { linha: i, elemento: matrix[i][j] } : { i, j }, output: [...output] }));
      rowOutput.push(fmt(matrix[i][j]));
      processed.push(coord(i, j));
      steps.push(step(matrix, 3, `Exibindo ${fmt(matrix[i][j])}`, `O valor da posição [${i}][${j}] é enviado para a saída.`, 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], variables: useForEach ? { elemento: matrix[i][j] } : { i, j, valor: matrix[i][j] }, output: [...output, rowOutput.join(' ')] }));
      steps.push(step(matrix, 4, 'Fim da iteração interna', j < matrix[i].length - 1 ? 'O laço interno avança para o próximo elemento da linha.' : 'A última coluna desta linha foi processada.', 'neutral', { activeRows: [i], processedCells: [...processed], variables: useForEach ? { linha: i } : { i, j }, output: [...output, rowOutput.join(' ')] }));
    }
    output.push(rowOutput.join(' '));
    steps.push(step(matrix, 5, 'Quebra de linha na saída', `A linha ${i} terminou; a próxima saída começa em uma nova linha.`, 'reading', { processedCells: [...processed], variables: { linhaConcluida: i }, output: [...output] }));
    steps.push(step(matrix, 6, 'Fim da iteração externa', i < matrix.length - 1 ? `O percurso continua na linha ${i + 1}.` : 'Todas as linhas foram processadas.', 'neutral', { processedCells: [...processed], output: [...output] }));
  }
  steps.push(step(matrix, 7, 'Percurso concluído', 'Todos os elementos foram visitados.', 'done', { processedCells: allCells(matrix), output }));
  return steps;
}

function sumSteps(matrix) {
  const steps = [step(matrix, 0, 'Iniciando SomaTotal', 'O algoritmo prepara um acumulador para receber todos os valores.')];
  let sum = 0;
  const processed = [];
  steps.push(step(matrix, 1, 'Inicializando S', 'S recebe 0.', 'update', { variables: { S: 0 } }));
  for (let i = 0; i < matrix.length; i += 1) {
    steps.push(step(matrix, 2, `Laço externo: i = ${i}`, `A linha ${i} será percorrida.`, 'reading', { activeRows: [i], processedCells: [...processed], variables: { i, S: sum } }));
    for (let j = 0; j < matrix[i].length; j += 1) {
      steps.push(step(matrix, 3, `Laço interno: j = ${j}`, `A célula A[${i}][${j}] entra no cálculo.`, 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, S: sum, valor: matrix[i][j] } }));
      const before = sum;
      sum += matrix[i][j];
      processed.push(coord(i, j));
      steps.push(step(matrix, 4, 'Atualizando S', `${fmt(before)} + ${fmt(matrix[i][j])} = ${fmt(sum)}.`, 'update', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, anterior: before, valor: matrix[i][j], S: sum }, output: [`Soma parcial: ${fmt(sum)}`] }));
      steps.push(step(matrix, 5, 'Fim do laço interno', j < matrix[i].length - 1 ? `j será incrementado para ${j + 1}.` : 'A linha atual terminou.', 'neutral', { processedCells: [...processed], variables: { i, j, S: sum } }));
    }
    steps.push(step(matrix, 6, 'Fim do laço externo', i < matrix.length - 1 ? `i será incrementado para ${i + 1}.` : 'Todas as linhas foram somadas.', 'neutral', { processedCells: [...processed], variables: { i, S: sum } }));
  }
  steps.push(step(matrix, 7, 'Retornando S', `A soma total é ${fmt(sum)}.`, 'success', { processedCells: allCells(matrix), variables: { S: sum }, output: [`Soma total: ${fmt(sum)}`] }));
  steps.push(step(matrix, 8, 'Algoritmo concluído', 'SomaTotal terminou.', 'done', { processedCells: allCells(matrix), output: [`Soma total: ${fmt(sum)}`] }));
  return steps;
}

function maximumSteps(matrix) {
  let maxVal = matrix[0][0];
  let maxCell = coord(0, 0);
  const processed = [];
  const steps = [
    step(matrix, 0, 'Iniciando MaiorValor', 'A matriz não vazia será examinada completamente.'),
    step(matrix, 1, 'Inicializando maxVal', `maxVal recebe A[0][0] = ${fmt(maxVal)}.`, 'update', { activeCells: [maxCell], resultCells: [maxCell], variables: { maxVal } }),
  ];
  for (let i = 0; i < matrix.length; i += 1) {
    steps.push(step(matrix, 2, `Laço externo: i = ${i}`, `A linha ${i} será examinada.`, 'reading', { activeRows: [i], resultCells: [maxCell], processedCells: [...processed], variables: { i, maxVal } }));
    for (let j = 0; j < matrix[i].length; j += 1) {
      steps.push(step(matrix, 3, `Laço interno: j = ${j}`, `A[${i}][${j}] = ${fmt(matrix[i][j])} será comparado com maxVal.`, 'reading', { activeCells: [coord(i, j)], resultCells: [maxCell], processedCells: [...processed], variables: { i, j, maxVal, valor: matrix[i][j] } }));
      const previousCell = maxCell;
      const previousMax = maxVal;
      const greater = matrix[i][j] > maxVal;
      steps.push(step(matrix, 4, 'Testando a condição', `${fmt(matrix[i][j])} > ${fmt(maxVal)} é ${greater ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeCells: [coord(i, j)], comparedCells: [...new Set([coord(i, j), previousCell])], resultCells: [previousCell], processedCells: [...processed], variables: { i, j, valor: matrix[i][j], maxVal, condicao: greater } }));
      if (greater) {
        maxVal = matrix[i][j];
        maxCell = coord(i, j);
        steps.push(step(matrix, 5, 'Atualizando maxVal', `maxVal recebe ${fmt(maxVal)}.`, 'update', { activeCells: [maxCell], changedCells: [maxCell], resultCells: [maxCell], processedCells: [...processed], variables: { i, j, anterior: previousMax, maxVal } }));
      }
      processed.push(coord(i, j));
      steps.push(step(matrix, 6, greater ? 'Fim da condição' : 'Mantendo maxVal', greater ? 'O novo maior valor foi registrado.' : `${fmt(matrix[i][j])} não supera ${fmt(maxVal)}.`, 'neutral', { activeCells: [coord(i, j)], resultCells: [maxCell], processedCells: [...processed], variables: { i, j, maxVal, condicao: greater } }));
      steps.push(step(matrix, 7, 'Fim do laço interno', j < matrix[i].length - 1 ? `j avança para ${j + 1}.` : 'A última coluna desta linha foi examinada.', 'neutral', { resultCells: [maxCell], processedCells: [...processed], variables: { i, j, maxVal } }));
    }
    steps.push(step(matrix, 8, 'Fim do laço externo', i < matrix.length - 1 ? `i avança para ${i + 1}.` : 'A matriz inteira foi examinada.', 'neutral', { resultCells: [maxCell], processedCells: [...processed], variables: { i, maxVal } }));
  }
  steps.push(step(matrix, 9, 'Retornando maxVal', `O maior valor é ${fmt(maxVal)}.`, 'success', { resultCells: [maxCell], processedCells: allCells(matrix), variables: { maxVal }, output: [`Maior valor: ${fmt(maxVal)}`, `Posição: [${maxCell.split(',').join('][')}]`] }));
  steps.push(step(matrix, 10, 'Algoritmo concluído', 'MaiorValor terminou.', 'done', { resultCells: [maxCell], output: [`Maior valor: ${fmt(maxVal)}`] }));
  return steps;
}

function averageSteps(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const total = m * n;
  const steps = [step(matrix, 0, 'Iniciando Media', 'Primeiro calculamos a quantidade de elementos.')];
  steps.push(step(matrix, 1, 'Calculando totalElementos', `${m} × ${n} = ${total}.`, 'update', { variables: { m, n, totalElementos: total } }));
  steps.push(step(matrix, 2, 'Verificando matriz vazia', `${total} = 0 é falso; o cálculo continua.`, 'comparison', { variables: { totalElementos: total, vazio: false } }));
  let sum = 0;
  const processed = [];
  steps.push(step(matrix, 5, 'Inicializando S', 'S recebe 0.', 'update', { variables: { S: 0, totalElementos: total } }));
  for (let i = 0; i < m; i += 1) {
    steps.push(step(matrix, 6, `Laço externo: i = ${i}`, `A linha ${i} será somada.`, 'reading', { activeRows: [i], processedCells: [...processed], variables: { i, S: sum } }));
    for (let j = 0; j < n; j += 1) {
      steps.push(step(matrix, 7, `Laço interno: j = ${j}`, `Visitando A[${i}][${j}].`, 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, S: sum, valor: matrix[i][j] } }));
      const before = sum;
      sum += matrix[i][j];
      processed.push(coord(i, j));
      steps.push(step(matrix, 8, 'Atualizando S', `${fmt(before)} + ${fmt(matrix[i][j])} = ${fmt(sum)}.`, 'update', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, S: sum }, output: [`Soma parcial: ${fmt(sum)}`] }));
      steps.push(step(matrix, 9, 'Fim do laço interno', j < n - 1 ? `j avança para ${j + 1}.` : 'Fim da linha.', 'neutral', { processedCells: [...processed], variables: { i, j, S: sum } }));
    }
    steps.push(step(matrix, 10, 'Fim do laço externo', i < m - 1 ? `i avança para ${i + 1}.` : 'Todas as linhas foram somadas.', 'neutral', { processedCells: [...processed], variables: { i, S: sum } }));
  }
  const average = sum / total;
  steps.push(step(matrix, 11, 'Calculando media', `${fmt(sum)} ÷ ${total} = ${fmt(average)}.`, 'success', { processedCells: allCells(matrix), variables: { S: sum, totalElementos: total, media: fmt(average) }, output: [`Média: ${fmt(average)}`] }));
  steps.push(step(matrix, 12, 'Retornando media', `O resultado é ${fmt(average)}.`, 'success', { processedCells: allCells(matrix), variables: { media: fmt(average) }, output: [`Média: ${fmt(average)}`] }));
  steps.push(step(matrix, 13, 'Algoritmo concluído', 'Media terminou.', 'done', { output: [`Média: ${fmt(average)}`] }));
  return steps;
}

function rowSumSteps(matrix) {
  const rowSum = Array(matrix.length).fill(0);
  const processed = [];
  const steps = [step(matrix, 0, 'Iniciando SomaPorLinha', 'Será criado um resultado para cada linha.')];
  steps.push(step(matrix, 1, 'Criando rowSum', `rowSum possui ${matrix.length} posições.`, 'update', { resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { tamanhoRowSum: matrix.length } }));
  for (let i = 0; i < matrix.length; i += 1) {
    steps.push(step(matrix, 2, `Laço externo: i = ${i}`, `Começando a soma da linha ${i}.`, 'reading', { activeRows: [i], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i } }));
    let s = 0;
    steps.push(step(matrix, 3, 'Reiniciando s', 's recebe 0 para esta linha.', 'update', { activeRows: [i], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i, s } }));
    for (let j = 0; j < matrix[i].length; j += 1) {
      steps.push(step(matrix, 4, `Laço interno: j = ${j}`, `Visitando A[${i}][${j}].`, 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i, j, s } }));
      const before = s;
      s += matrix[i][j];
      processed.push(coord(i, j));
      steps.push(step(matrix, 5, 'Atualizando s', `${fmt(before)} + ${fmt(matrix[i][j])} = ${fmt(s)}.`, 'update', { activeCells: [coord(i, j)], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i, j, s } }));
      steps.push(step(matrix, 6, 'Fim do laço interno', j < matrix[i].length - 1 ? `j avança para ${j + 1}.` : 'A soma da linha terminou.', 'neutral', { activeRows: [i], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i, j, s } }));
    }
    rowSum[i] = s;
    steps.push(step(matrix, 7, `Gravando rowSum[${i}]`, `rowSum[${i}] recebe ${fmt(s)}.`, 'success', { activeRows: [i], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', resultVectorActive: i, variables: { i, s, [`rowSum[${i}]`]: s } }));
    steps.push(step(matrix, 8, 'Fim do laço externo', i < matrix.length - 1 ? `A próxima linha será ${i + 1}.` : 'Todas as linhas foram processadas.', 'neutral', { processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum' }));
  }
  steps.push(step(matrix, 9, 'Retornando rowSum', `[${rowSum.map(fmt).join(', ')}]`, 'success', { processedCells: allCells(matrix), resultVector: [...rowSum], resultVectorLabel: 'rowSum', output: [`rowSum = [${rowSum.map(fmt).join(', ')}]`] }));
  steps.push(step(matrix, 10, 'Algoritmo concluído', 'SomaPorLinha terminou.', 'done', { processedCells: allCells(matrix), resultVector: [...rowSum], resultVectorLabel: 'rowSum', output: [`rowSum = [${rowSum.map(fmt).join(', ')}]`] }));
  return steps;
}

function colSumSteps(matrix) {
  const cols = matrix[0].length;
  const colSum = Array(cols).fill(0);
  const processed = [];
  const steps = [step(matrix, 0, 'Iniciando SomaPorColuna', 'Será criado um resultado para cada coluna.')];
  steps.push(step(matrix, 1, 'Criando colSum', `colSum possui ${cols} posições.`, 'update', { resultVector: [...colSum], resultVectorLabel: 'colSum', variables: { tamanhoColSum: cols } }));
  for (let j = 0; j < cols; j += 1) {
    steps.push(step(matrix, 2, `Inicialização: j = ${j}`, `Preparando colSum[${j}].`, 'reading', { activeCols: [j], resultVector: [...colSum], resultVectorLabel: 'colSum', resultVectorActive: j, variables: { j } }));
    colSum[j] = 0;
    steps.push(step(matrix, 3, `colSum[${j}] ← 0`, 'A posição começa zerada.', 'update', { activeCols: [j], resultVector: [...colSum], resultVectorLabel: 'colSum', resultVectorActive: j, variables: { j, [`colSum[${j}]`]: 0 } }));
    steps.push(step(matrix, 4, 'Fim da inicialização', j < cols - 1 ? `j avança para ${j + 1}.` : 'Todas as colunas foram inicializadas.', 'neutral', { resultVector: [...colSum], resultVectorLabel: 'colSum' }));
  }
  for (let i = 0; i < matrix.length; i += 1) {
    steps.push(step(matrix, 5, `Laço externo: i = ${i}`, `A linha ${i} contribuirá para as somas de coluna.`, 'reading', { activeRows: [i], processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum', variables: { i } }));
    for (let j = 0; j < cols; j += 1) {
      steps.push(step(matrix, 6, `Laço interno: j = ${j}`, `Visitando A[${i}][${j}].`, 'reading', { activeCells: [coord(i, j)], activeCols: [j], processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum', resultVectorActive: j, variables: { i, j, valor: matrix[i][j], atual: colSum[j] } }));
      const before = colSum[j];
      colSum[j] += matrix[i][j];
      processed.push(coord(i, j));
      steps.push(step(matrix, 7, `Atualizando colSum[${j}]`, `${fmt(before)} + ${fmt(matrix[i][j])} = ${fmt(colSum[j])}.`, 'update', { activeCells: [coord(i, j)], activeCols: [j], processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum', resultVectorActive: j, variables: { i, j, [`colSum[${j}]`]: colSum[j] } }));
      steps.push(step(matrix, 8, 'Fim do laço interno', j < cols - 1 ? `j avança para ${j + 1}.` : 'Fim da linha atual.', 'neutral', { processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum' }));
    }
    steps.push(step(matrix, 9, 'Fim do laço externo', i < matrix.length - 1 ? `i avança para ${i + 1}.` : 'Todas as linhas contribuíram.', 'neutral', { processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum' }));
  }
  steps.push(step(matrix, 10, 'Retornando colSum', `[${colSum.map(fmt).join(', ')}]`, 'success', { processedCells: allCells(matrix), resultVector: [...colSum], resultVectorLabel: 'colSum', output: [`colSum = [${colSum.map(fmt).join(', ')}]`] }));
  steps.push(step(matrix, 11, 'Algoritmo concluído', 'SomaPorColuna terminou.', 'done', { processedCells: allCells(matrix), resultVector: [...colSum], resultVectorLabel: 'colSum', output: [`colSum = [${colSum.map(fmt).join(', ')}]`] }));
  return steps;
}

function identitySteps(order) {
  const identity = zeroMatrix(order, order);
  const processed = [];
  const steps = [step(identity, 0, 'Iniciando MatrizIdentidade', `Será criada uma matriz ${order} × ${order}.`)];
  steps.push(step(identity, 1, 'Alocando I', 'Todas as posições começam com 0.', 'update', { variables: { n: order } }));
  for (let i = 0; i < order; i += 1) {
    steps.push(step(identity, 2, `Laço externo: i = ${i}`, `Percorrendo a linha ${i}.`, 'reading', { activeRows: [i], processedCells: [...processed], variables: { i, n: order } }));
    for (let j = 0; j < order; j += 1) {
      steps.push(step(identity, 3, `Laço interno: j = ${j}`, `Selecionando I[${i}][${j}].`, 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j } }));
      const diagonal = i === j;
      steps.push(step(identity, 4, 'Testando i = j', `${i} = ${j} é ${diagonal ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeCells: [coord(i, j)], comparedCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, diagonal } }));
      identity[i][j] = diagonal ? 1 : 0;
      steps.push(step(identity, diagonal ? 5 : 7, diagonal ? 'Escrevendo 1' : 'Escrevendo 0', diagonal ? 'A célula pertence à diagonal principal.' : 'A célula está fora da diagonal principal.', 'update', { activeCells: [coord(i, j)], changedCells: [coord(i, j)], resultCells: diagonal ? [coord(i, j)] : [], processedCells: [...processed], variables: { i, j, valor: identity[i][j] } }));
      processed.push(coord(i, j));
      steps.push(step(identity, 8, 'Fim da condição', 'A posição atual foi definida.', 'neutral', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j } }));
      steps.push(step(identity, 9, 'Fim do laço interno', j < order - 1 ? `j avança para ${j + 1}.` : 'Fim da linha.', 'neutral', { processedCells: [...processed], variables: { i, j } }));
    }
    steps.push(step(identity, 10, 'Fim do laço externo', i < order - 1 ? `i avança para ${i + 1}.` : 'Todas as linhas foram preenchidas.', 'neutral', { processedCells: [...processed], variables: { i } }));
  }
  const diagonalCells = Array.from({ length: order }, (_, i) => coord(i, i));
  steps.push(step(identity, 11, 'Retornando I', 'A matriz identidade está pronta.', 'success', { processedCells: allCells(identity), resultCells: diagonalCells, output: [`Identidade ${order} × ${order} criada.`] }));
  steps.push(step(identity, 12, 'Algoritmo concluído', 'MatrizIdentidade terminou.', 'done', { resultCells: diagonalCells, output: [`I${order} criada com sucesso.`] }));
  return steps;
}

function transposeSteps(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const transposed = zeroMatrix(n, m);
  const processedSource = [];
  const processedTarget = [];
  const steps = [step(matrix, 0, 'Iniciando Transposta', `A (${m} × ${n}) produzirá T (${n} × ${m}).`, 'neutral', { secondaryMatrix: cloneMatrix(transposed), primaryLabel: 'A — original', secondaryLabel: 'T — transposta' })];
  steps.push(step(matrix, 1, 'Alocando T', `T recebe ${n} linhas e ${m} colunas.`, 'update', { secondaryMatrix: cloneMatrix(transposed), primaryLabel: 'A — original', secondaryLabel: 'T — transposta', variables: { m, n } }));
  for (let i = 0; i < m; i += 1) {
    steps.push(step(matrix, 2, `Laço externo: i = ${i}`, `Percorrendo a linha ${i} de A.`, 'reading', { activeRows: [i], processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryProcessedCells: [...processedTarget], primaryLabel: 'A — original', secondaryLabel: 'T — transposta', variables: { i } }));
    for (let j = 0; j < n; j += 1) {
      steps.push(step(matrix, 3, `Laço interno: j = ${j}`, `Preparando a cópia de A[${i}][${j}] para T[${j}][${i}].`, 'reading', { activeCells: [coord(i, j)], processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryActiveCells: [coord(j, i)], secondaryProcessedCells: [...processedTarget], primaryLabel: 'A — original', secondaryLabel: 'T — transposta', variables: { i, j, origem: `A[${i}][${j}]`, destino: `T[${j}][${i}]` } }));
      transposed[j][i] = matrix[i][j];
      processedSource.push(coord(i, j));
      processedTarget.push(coord(j, i));
      steps.push(step(matrix, 4, 'Copiando a célula', `T[${j}][${i}] recebe ${fmt(matrix[i][j])}.`, 'update', { activeCells: [coord(i, j)], processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryActiveCells: [coord(j, i)], secondaryChangedCells: [coord(j, i)], secondaryProcessedCells: [...processedTarget], primaryLabel: 'A — original', secondaryLabel: 'T — transposta', variables: { i, j, valor: matrix[i][j] } }));
      steps.push(step(matrix, 5, 'Fim do laço interno', j < n - 1 ? `j avança para ${j + 1}.` : 'Fim da linha de A.', 'neutral', { processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryProcessedCells: [...processedTarget], primaryLabel: 'A — original', secondaryLabel: 'T — transposta' }));
    }
    steps.push(step(matrix, 6, 'Fim do laço externo', i < m - 1 ? `i avança para ${i + 1}.` : 'Todos os elementos foram copiados.', 'neutral', { processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryProcessedCells: [...processedTarget], primaryLabel: 'A — original', secondaryLabel: 'T — transposta' }));
  }
  steps.push(step(matrix, 7, 'Retornando T', 'A transposição está completa.', 'success', { processedCells: allCells(matrix), secondaryMatrix: cloneMatrix(transposed), secondaryResultCells: allCells(transposed), primaryLabel: 'A — original', secondaryLabel: 'T — transposta', output: [`T possui dimensão ${n} × ${m}.`] }));
  steps.push(step(matrix, 8, 'Algoritmo concluído', 'Cada linha de A tornou-se uma coluna de T.', 'done', { secondaryMatrix: cloneMatrix(transposed), secondaryResultCells: allCells(transposed), primaryLabel: 'A — original', secondaryLabel: 'T — transposta' }));
  return steps;
}

function symmetricSteps(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const steps = [step(matrix, 0, 'Iniciando EhSimetrica', 'Uma matriz simétrica precisa ser quadrada.')];
  const square = m === n;
  steps.push(step(matrix, 1, 'Verificando as dimensões', `${m} ≠ ${n} é ${square ? 'falso' : 'verdadeiro'}.`, 'comparison', { variables: { m, n, quadrada: square } }));
  if (!square) {
    steps.push(step(matrix, 2, 'Retornando FALSO', 'Uma matriz não quadrada não pode ser simétrica.', 'warning', { output: ['Simétrica: FALSO'] }));
    steps.push(step(matrix, 12, 'Algoritmo concluído', 'A verificação terminou pelas dimensões.', 'done', { output: ['Simétrica: FALSO'] }));
    return steps;
  }
  const processed = [];
  steps.push(step(matrix, 3, 'Fim da validação', 'A matriz é quadrada; podemos comparar pares espelhados.', 'reading', { variables: { n } }));
  for (let i = 0; i < n; i += 1) {
    steps.push(step(matrix, 4, `Laço externo: i = ${i}`, `Compararemos elementos acima da diagonal na linha ${i}.`, 'reading', { activeRows: [i], processedCells: [...processed], variables: { i, n } }));
    for (let j = i + 1; j < n; j += 1) {
      const first = coord(i, j);
      const mirror = coord(j, i);
      steps.push(step(matrix, 5, `Laço interno: j = ${j}`, `Comparando A[${i}][${j}] com A[${j}][${i}].`, 'reading', { activeCells: [first, mirror], comparedCells: [first, mirror], processedCells: [...processed], variables: { i, j } }));
      const different = matrix[i][j] !== matrix[j][i];
      steps.push(step(matrix, 6, 'Testando o par espelhado', `${fmt(matrix[i][j])} ≠ ${fmt(matrix[j][i])} é ${different ? 'verdadeiro' : 'falso'}.`, 'comparison', { comparedCells: [first, mirror], processedCells: [...processed], variables: { i, j, valorA: matrix[i][j], valorEspelhado: matrix[j][i], diferentes: different } }));
      if (different) {
        steps.push(step(matrix, 7, 'Retornando FALSO', 'Foi encontrado um par diferente; a matriz não é simétrica.', 'warning', { comparedCells: [first, mirror], resultCells: [first, mirror], processedCells: [...processed], output: ['Simétrica: FALSO'] }));
        steps.push(step(matrix, 12, 'Algoritmo concluído', 'A verificação parou na primeira diferença.', 'done', { resultCells: [first, mirror], output: ['Simétrica: FALSO'] }));
        return steps;
      }
      processed.push(first, mirror);
      steps.push(step(matrix, 8, 'Fim da condição', 'Os dois valores são iguais; a verificação continua.', 'success', { comparedCells: [first, mirror], processedCells: [...processed], variables: { i, j } }));
      steps.push(step(matrix, 9, 'Fim do laço interno', j < n - 1 ? `j avança para ${j + 1}.` : 'Todos os pares desta linha foram verificados.', 'neutral', { processedCells: [...processed] }));
    }
    steps.push(step(matrix, 10, 'Fim do laço externo', i < n - 1 ? `i avança para ${i + 1}.` : 'Todos os pares necessários foram comparados.', 'neutral', { processedCells: [...processed] }));
  }
  steps.push(step(matrix, 11, 'Retornando VERDADEIRO', 'Todos os pares espelhados são iguais.', 'success', { resultCells: allCells(matrix), output: ['Simétrica: VERDADEIRO'] }));
  steps.push(step(matrix, 12, 'Algoritmo concluído', 'A matriz é simétrica em relação à diagonal principal.', 'done', { resultCells: allCells(matrix), output: ['Simétrica: VERDADEIRO'] }));
  return steps;
}

function jaggedSteps(config) {
  const lengths = config.jaggedLengths;
  const rows = lengths.length;
  const jagged = Array.from({ length: rows }, () => []);
  const allocated = [];
  const steps = [step(jagged, 0, 'Iniciando CriarJagged', `Serão criadas ${rows} linhas com tamanhos independentes.`, 'neutral', { jagged: true, allocatedRows: [...allocated] })];
  steps.push(step(jagged, 1, 'Obtendo r', `r recebe ${rows}.`, 'reading', { jagged: true, allocatedRows: [...allocated], variables: { r: rows, tamanhos: lengths.join(', ') } }));
  steps.push(step(jagged, 2, 'Criando referências das linhas', 'As linhas existem, mas seus vetores internos ainda não foram alocados.', 'update', { jagged: true, allocatedRows: [...allocated], variables: { r: rows } }));
  for (let i = 0; i < rows; i += 1) {
    steps.push(step(jagged, 3, `Laço: i = ${i}`, `A linha ${i} receberá ${lengths[i]} posições.`, 'reading', { jagged: true, allocatedRows: [...allocated], activeRows: [i], variables: { i, tamanho: lengths[i] } }));
    jagged[i] = Array(lengths[i]).fill(0);
    allocated.push(i);
    steps.push(step(jagged, 4, `Alocando jagged[${i}]`, `Foi criado um vetor interno de tamanho ${lengths[i]}.`, 'update', { jagged: true, allocatedRows: [...allocated], activeRows: [i], changedCells: jagged[i].map((_, j) => coord(i, j)), variables: { i, [`jagged[${i}].length`]: lengths[i] } }));
    steps.push(step(jagged, 5, 'Fim da iteração', i < rows - 1 ? `i avança para ${i + 1}.` : 'Todas as linhas foram alocadas.', 'neutral', { jagged: true, allocatedRows: [...allocated] }));
  }
  steps.push(step(jagged, 6, 'Retornando jagged', `Tamanhos das linhas: [${lengths.join(', ')}].`, 'success', { jagged: true, allocatedRows: [...allocated], processedCells: allCells(jagged), output: [`Comprimentos: [${lengths.join(', ')}]`] }));
  steps.push(step(jagged, 7, 'Algoritmo concluído', 'Cada linha possui seu próprio tamanho.', 'done', { jagged: true, allocatedRows: [...allocated], output: [`Total de posições: ${lengths.reduce((a, b) => a + b, 0)}`] }));
  return steps;
}

export function buildSteps(id, matrix, config) {
  switch (id) {
    case 'dimensions': return dimensionsSteps(matrix);
    case 'access': return accessSteps(matrix, config);
    case 'update': return updateSteps(matrix, config);
    case 'traversal': return traversalSteps(matrix, false);
    case 'foreach': return traversalSteps(matrix, true);
    case 'sum': return sumSteps(matrix);
    case 'maximum': return maximumSteps(matrix);
    case 'average': return averageSteps(matrix);
    case 'row-sum': return rowSumSteps(matrix);
    case 'col-sum': return colSumSteps(matrix);
    case 'identity': return identitySteps(config.order);
    case 'transpose': return transposeSteps(matrix);
    case 'symmetric': return symmetricSteps(matrix);
    case 'jagged': return jaggedSteps(config);
    default: return dimensionsSteps(matrix);
  }
}
