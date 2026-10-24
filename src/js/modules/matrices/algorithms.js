import { locale, tr } from '../../core/i18n.js';
export const algorithms = [
  {
    id: 'dimensions', title: tr('Dimensões e índices', 'Dimensions and indices'), menuLabel: tr('Dimensões e índices', 'Dimensions and indices'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Identifique linhas, colunas e os limites de índices de uma matriz bidimensional.', 'Identify the rows, the columns and the index limits of a two-dimensional matrix.'),
    interaction: tr('Clique em qualquer célula para observar sua coordenada [linha][coluna].', 'Click any cell to see its [row][column] coordinate.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('As dimensões são obtidas diretamente por A.length e A[0].length.', 'The dimensions come directly from A.length and A[0].length.') },
    pseudocode: [tr('FUNÇÃO analisarMatriz(A)', 'FUNCTION analyzeMatrix(A)'), tr('  m ← A.length', '  m ← A.length'), tr('  n ← A[0].length', '  n ← A[0].length'), tr('  primeiro ← A[0][0]', '  first ← A[0][0]'), tr('  ultimo ← A[m-1][n-1]', '  last ← A[m-1][n-1]'), tr('  RETORNE m, n, primeiro, ultimo', '  RETURN m, n, first, last'), tr('FIM', 'END')],
  },
  {
    id: 'access', title: tr('Acesso aos elementos', 'Accessing elements'), menuLabel: tr('Acessar elemento', 'Access element'), group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Acesse diretamente um elemento usando os índices da linha e da coluna.', 'Access an element directly using the row and column indices.'),
    interaction: tr('Informe linha e coluna ou clique em uma célula para mudar a posição acessada.', 'Enter the row and column, or click a cell to change the accessed position.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Acesso A[i][j] não exige percorrer a matriz.', 'Accessing A[i][j] does not require traversing the matrix.') },
    pseudocode: [tr('FUNÇÃO acessar(A, linha, coluna)', 'FUNCTION access(A, row, column)'), tr('  SE linha/coluna forem inválidos ENTÃO', '  IF row/column are invalid THEN'), tr('    ESCREVA "Índice inválido"', '    PRINT "Invalid index"'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  valor ← A[linha][coluna]', '  value ← A[row][column]'), tr('  RETORNE valor', '  RETURN value'), tr('FIM', 'END')],
  },
  {
    id: 'update', title: tr('Alterando valores', 'Changing values'), menuLabel: tr('Alterar elemento', 'Update element'), group: tr('Fundamentos', 'Fundamentals'), number: '03',
    description: tr('Substitua o valor armazenado em uma posição específica da matriz.', 'Replace the value stored at a specific position of the matrix.'),
    interaction: tr('Escolha linha, coluna e novo valor. Clique em uma célula para selecionar sua posição.', 'Choose row, column and new value. Click a cell to select its position.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('A atribuição A[i][j] ← valor modifica diretamente uma célula.', 'The assignment A[i][j] ← value changes a cell directly.') },
    pseudocode: [tr('FUNÇÃO alterar(A, linha, coluna, novoValor)', 'FUNCTION update(A, row, column, newValue)'), tr('  SE linha/coluna forem inválidos ENTÃO', '  IF row/column are invalid THEN'), tr('    ESCREVA "Índice inválido"', '    PRINT "Invalid index"'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  anterior ← A[linha][coluna]', '  previous ← A[row][column]'), tr('  A[linha][coluna] ← novoValor', '  A[row][column] ← newValue'), tr('  RETORNE anterior, A[linha][coluna]', '  RETURN previous, A[row][column]'), tr('FIM', 'END')],
  },
  {
    id: 'traversal', title: tr('Percurso com for tradicional', 'Traversal with the classic for'), menuLabel: tr('Percurso com for', 'Traversal with for'), group: tr('Percursos', 'Traversals'), number: '04',
    description: tr('Percorra linhas e colunas usando dois laços de repetição aninhados.', 'Walk through rows and columns using two nested loops.'),
    interaction: tr('Avance passo a passo e acompanhe as variáveis i e j mudando de posição.', 'Step through and follow the variables i and j changing position.'),
    complexity: { time: 'O(m·n)', space: 'O(1)', note: tr('Cada uma das m·n células é visitada uma vez.', 'Each of the m·n cells is visited once.') },
    pseudocode: [tr('FUNÇÃO exibir(A)', 'FUNCTION display(A)'), tr('  PARA i DE 0 ATÉ A.length - 1 FAÇA', '  FOR i FROM 0 TO A.length - 1 DO'), tr('    PARA j DE 0 ATÉ A[i].length - 1 FAÇA', '    FOR j FROM 0 TO A[i].length - 1 DO'), tr('      ESCREVA A[i][j]', '      PRINT A[i][j]'), tr('    FIM PARA', '    END FOR'), tr('    ESCREVA novaLinha', '    PRINT newLine'), tr('  FIM PARA', '  END FOR'), tr('FIM', 'END')],
  },
  {
    id: 'foreach', title: tr('Percurso com for-each', 'Traversal with for-each'), menuLabel: tr('Percurso com for-each', 'Traversal with for-each'), group: tr('Percursos', 'Traversals'), number: '05',
    description: tr('Percorra a matriz sem manipular explicitamente os índices, usando linha e elemento.', 'Walk through the matrix without handling the indices explicitly, using row and element.'),
    interaction: tr('Compare este percurso com o for tradicional e observe que os valores são visitados na mesma ordem.', 'Compare this traversal with the classic for and notice that the values are visited in the same order.'),
    complexity: { time: 'O(m·n)', space: 'O(1)', note: tr('O for-each simplifica a sintaxe, mas ainda visita todos os elementos.', 'The for-each simplifies the syntax, but still visits every element.') },
    pseudocode: [tr('FUNÇÃO exibirForEach(A)', 'FUNCTION displayForEach(A)'), tr('  PARA CADA linha EM A FAÇA', '  FOR EACH row IN A DO'), tr('    PARA CADA elemento EM linha FAÇA', '    FOR EACH element IN row DO'), tr('      ESCREVA elemento', '      PRINT element'), tr('    FIM PARA', '    END FOR'), tr('    ESCREVA novaLinha', '    PRINT newLine'), tr('  FIM PARA', '  END FOR'), tr('FIM', 'END')],
  },
  {
    id: 'sum', title: tr('Soma de elementos', 'Sum of elements'), menuLabel: tr('Soma total', 'Total sum'), group: tr('Operações comuns', 'Common operations'), number: '06',
    description: tr('Some todos os elementos da matriz usando um acumulador.', 'Add up all the elements of the matrix using an accumulator.'),
    interaction: tr('Observe a soma parcial após cada célula visitada.', 'Watch the partial sum after each visited cell.'),
    complexity: { time: 'O(m·n)', space: 'O(1)', note: tr('Todos os elementos precisam participar do somatório.', 'Every element has to take part in the sum.') },
    pseudocode: [tr('ALGORITMO SomaTotal(A, m, n)', 'ALGORITHM TotalSum(A, m, n)'), tr('  S ← 0', '  S ← 0'), tr('  PARA i DE 0 ATÉ m-1 FAÇA', '  FOR i FROM 0 TO m-1 DO'), tr('    PARA j DE 0 ATÉ n-1 FAÇA', '    FOR j FROM 0 TO n-1 DO'), tr('      S ← S + A[i][j]', '      S ← S + A[i][j]'), tr('    FIM-PARA', '    END-FOR'), tr('  FIM-PARA', '  END-FOR'), tr('  RETORNE S', '  RETURN S'), tr('FIM', 'END')],
  },
  {
    id: 'maximum', title: tr('Encontrar maior valor', 'Find the largest value'), menuLabel: tr('Maior valor', 'Largest value'), group: tr('Operações comuns', 'Common operations'), number: '07',
    description: tr('Compare cada célula com o maior valor encontrado até o momento.', 'Compare each cell with the largest value found so far.'),
    interaction: tr('Veja cada comparação e quando maxVal é atualizado.', 'See each comparison and when maxVal is updated.'),
    complexity: { time: 'O(m·n)', space: 'O(1)', note: tr('Para garantir o maior valor, todas as células devem ser examinadas.', 'To guarantee the largest value, every cell must be examined.') },
    pseudocode: [tr('ALGORITMO MaiorValor(A, m, n)', 'ALGORITHM MaxValue(A, m, n)'), tr('  maxVal ← A[0][0]', '  maxVal ← A[0][0]'), tr('  PARA i DE 0 ATÉ m-1 FAÇA', '  FOR i FROM 0 TO m-1 DO'), tr('    PARA j DE 0 ATÉ n-1 FAÇA', '    FOR j FROM 0 TO n-1 DO'), tr('      SE A[i][j] > maxVal ENTÃO', '      IF A[i][j] > maxVal THEN'), tr('        maxVal ← A[i][j]', '        maxVal ← A[i][j]'), tr('      FIM-SE', '      END-IF'), tr('    FIM-PARA', '    END-FOR'), tr('  FIM-PARA', '  END-FOR'), tr('  RETORNE maxVal', '  RETURN maxVal'), tr('FIM', 'END')],
  },
  {
    id: 'average', title: tr('Calcular média', 'Calculate the mean'), menuLabel: tr('Média', 'Mean'), group: tr('Operações comuns', 'Common operations'), number: '08',
    description: tr('Calcule a média aritmética usando a soma total e a quantidade m·n de elementos.', 'Calculate the arithmetic mean using the total sum and the number m·n of elements.'),
    interaction: tr('Acompanhe primeiro o somatório e, ao final, a divisão pelo número de células.', 'First follow the sum and, at the end, the division by the number of cells.'),
    complexity: { time: 'O(m·n)', space: 'O(1)', note: tr('A matriz é percorrida uma vez; a divisão ocorre somente no final.', 'The matrix is traversed once; the division happens only at the end.') },
    pseudocode: [tr('ALGORITMO Media(A, m, n)', 'ALGORITHM Mean(A, m, n)'), tr('  totalElementos ← m * n', '  totalElements ← m * n'), tr('  SE totalElementos = 0 ENTÃO', '  IF totalElements = 0 THEN'), tr('    RETORNE 0', '    RETURN 0'), tr('  FIM-SE', '  END-IF'), tr('  S ← 0', '  S ← 0'), tr('  PARA i DE 0 ATÉ m-1 FAÇA', '  FOR i FROM 0 TO m-1 DO'), tr('    PARA j DE 0 ATÉ n-1 FAÇA', '    FOR j FROM 0 TO n-1 DO'), tr('      S ← S + A[i][j]', '      S ← S + A[i][j]'), tr('    FIM-PARA', '    END-FOR'), tr('  FIM-PARA', '  END-FOR'), tr('  media ← S / totalElementos', '  average ← S / totalElements'), tr('  RETORNE media', '  RETURN average'), tr('FIM', 'END')],
  },
  {
    id: 'row-sum', title: tr('Somar elementos por linha', 'Sum elements by row'), menuLabel: tr('Soma por linha', 'Sum by row'), group: tr('Operações comuns', 'Common operations'), number: '09',
    description: tr('Crie um vetor rowSum em que cada posição contém a soma de uma linha.', 'Create an array rowSum in which each position holds the sum of one row.'),
    interaction: tr('Observe o acumulador s reiniciar em zero quando o algoritmo muda de linha.', 'Watch the accumulator s reset to zero when the algorithm moves to another row.'),
    complexity: { time: 'O(m·n)', space: 'O(m)', note: tr('Além da matriz, é criado um vetor com uma soma para cada linha.', 'Besides the matrix, an array with one sum for each row is created.') },
    pseudocode: [tr('ALGORITMO SomaPorLinha(A, m, n)', 'ALGORITHM RowSums(A, m, n)'), tr('  CRIE vetor rowSum[0..m-1]', '  CREATE array rowSum[0..m-1]'), tr('  PARA i DE 0 ATÉ m-1 FAÇA', '  FOR i FROM 0 TO m-1 DO'), tr('    s ← 0', '    s ← 0'), tr('    PARA j DE 0 ATÉ n-1 FAÇA', '    FOR j FROM 0 TO n-1 DO'), tr('      s ← s + A[i][j]', '      s ← s + A[i][j]'), tr('    FIM-PARA', '    END-FOR'), tr('    rowSum[i] ← s', '    rowSum[i] ← s'), tr('  FIM-PARA', '  END-FOR'), tr('  RETORNE rowSum', '  RETURN rowSum'), tr('FIM', 'END')],
  },
  {
    id: 'col-sum', title: tr('Somar elementos por coluna', 'Sum elements by column'), menuLabel: tr('Soma por coluna', 'Sum by column'), group: tr('Operações comuns', 'Common operations'), number: '10',
    description: tr('Crie um vetor colSum em que cada posição acumula os valores de uma coluna.', 'Create an array colSum in which each position accumulates the values of one column.'),
    interaction: tr('Veja cada célula contribuir para a posição correspondente em colSum.', 'See each cell contribute to the matching position in colSum.'),
    complexity: { time: 'O(m·n)', space: 'O(n)', note: tr('O vetor auxiliar possui uma posição para cada coluna.', 'The auxiliary array has one position for each column.') },
    pseudocode: [tr('ALGORITMO SomaPorColuna(A, m, n)', 'ALGORITHM ColumnSums(A, m, n)'), tr('  CRIE vetor colSum[0..n-1]', '  CREATE array colSum[0..n-1]'), tr('  PARA j DE 0 ATÉ n-1 FAÇA', '  FOR j FROM 0 TO n-1 DO'), tr('    colSum[j] ← 0', '    colSum[j] ← 0'), tr('  FIM-PARA', '  END-FOR'), tr('  PARA i DE 0 ATÉ m-1 FAÇA', '  FOR i FROM 0 TO m-1 DO'), tr('    PARA j DE 0 ATÉ n-1 FAÇA', '    FOR j FROM 0 TO n-1 DO'), tr('      colSum[j] ← colSum[j] + A[i][j]', '      colSum[j] ← colSum[j] + A[i][j]'), tr('    FIM-PARA', '    END-FOR'), tr('  FIM-PARA', '  END-FOR'), tr('  RETORNE colSum', '  RETURN colSum'), tr('FIM', 'END')],
  },
  {
    id: 'identity', title: tr('Criar matriz identidade', 'Create identity matrix'), menuLabel: tr('Matriz identidade', 'Identity matrix'), group: tr('Transformações', 'Transformations'), number: '11',
    description: tr('Construa uma matriz quadrada com 1 na diagonal principal e 0 nas demais posições.', 'Build a square matrix with 1 on the main diagonal and 0 in all other positions.'),
    interaction: tr('Altere a ordem n e acompanhe a condição i = j em cada célula.', 'Change the order n and follow the condition i = j in each cell.'),
    complexity: { time: 'O(n²)', space: 'O(n²)', note: tr('O algoritmo cria e preenche todas as n² posições da nova matriz.', 'The algorithm creates and fills all n² positions of the new matrix.') },
    pseudocode: [tr('ALGORITMO MatrizIdentidade(n)', 'ALGORITHM IdentityMatrix(n)'), tr('  CRIE matriz I[0..n-1][0..n-1]', '  CREATE matrix I[0..n-1][0..n-1]'), tr('  PARA i DE 0 ATÉ n-1 FAÇA', '  FOR i FROM 0 TO n-1 DO'), tr('    PARA j DE 0 ATÉ n-1 FAÇA', '    FOR j FROM 0 TO n-1 DO'), tr('      SE i = j ENTÃO', '      IF i = j THEN'), tr('        I[i][j] ← 1', '        I[i][j] ← 1'), tr('      SENÃO', '      ELSE'), tr('        I[i][j] ← 0', '        I[i][j] ← 0'), tr('      FIM-SE', '      END-IF'), tr('    FIM-PARA', '    END-FOR'), tr('  FIM-PARA', '  END-FOR'), tr('  RETORNE I', '  RETURN I'), tr('FIM', 'END')],
  },
  {
    id: 'transpose', title: tr('Transposição de matriz', 'Matrix transposition'), menuLabel: tr('Transposição', 'Transpose'), group: tr('Transformações', 'Transformations'), number: '12',
    description: tr('Produza T (n × m) movendo cada A[i][j] para T[j][i].', 'Produce T (n × m) by moving each A[i][j] to T[j][i].'),
    interaction: tr('Observe simultaneamente a célula de origem em A e sua posição de destino em T.', 'Watch both the source cell in A and its destination position in T.'),
    complexity: { time: 'O(m·n)', space: 'O(m·n)', note: tr('Cada elemento é copiado uma vez para uma nova matriz de mesmo número de células.', 'Each element is copied once into a new matrix with the same number of cells.') },
    pseudocode: [tr('ALGORITMO Transposta(A, m, n)', 'ALGORITHM Transpose(A, m, n)'), tr('  CRIE matriz T[0..n-1][0..m-1]', '  CREATE matrix T[0..n-1][0..m-1]'), tr('  PARA i DE 0 ATÉ m-1 FAÇA', '  FOR i FROM 0 TO m-1 DO'), tr('    PARA j DE 0 ATÉ n-1 FAÇA', '    FOR j FROM 0 TO n-1 DO'), tr('      T[j][i] ← A[i][j]', '      T[j][i] ← A[i][j]'), tr('    FIM-PARA', '    END-FOR'), tr('  FIM-PARA', '  END-FOR'), tr('  RETORNE T', '  RETURN T'), tr('FIM', 'END')],
  },
  {
    id: 'symmetric', title: tr('Verificar matriz simétrica', 'Check symmetric matrix'), menuLabel: tr('Matriz simétrica', 'Symmetric matrix'), group: tr('Transformações', 'Transformations'), number: '13',
    description: tr('Verifique o exercício da aula comparando A[i][j] com A[j][i] em uma matriz quadrada.', 'Check the class exercise by comparing A[i][j] with A[j][i] in a square matrix.'),
    interaction: tr('Teste uma matriz simétrica e depois altere apenas uma célula fora da diagonal.', 'Try a symmetric matrix and then change just one cell off the diagonal.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('É suficiente comparar os pares espelhados em relação à diagonal principal.', 'It is enough to compare the pairs mirrored across the main diagonal.') },
    pseudocode: [tr('ALGORITMO EhSimetrica(A, m, n)', 'ALGORITHM IsSymmetric(A, m, n)'), tr('  SE m ≠ n ENTÃO', '  IF m ≠ n THEN'), tr('    RETORNE FALSO', '    RETURN FALSE'), tr('  FIM-SE', '  END-IF'), tr('  PARA i DE 0 ATÉ n-1 FAÇA', '  FOR i FROM 0 TO n-1 DO'), tr('    PARA j DE i+1 ATÉ n-1 FAÇA', '    FOR j FROM i+1 TO n-1 DO'), tr('      SE A[i][j] ≠ A[j][i] ENTÃO', '      IF A[i][j] ≠ A[j][i] THEN'), tr('        RETORNE FALSO', '        RETURN FALSE'), tr('      FIM-SE', '      END-IF'), tr('    FIM-PARA', '    END-FOR'), tr('  FIM-PARA', '  END-FOR'), tr('  RETORNE VERDADEIRO', '  RETURN TRUE'), tr('FIM', 'END')],
  },
  {
    id: 'jagged', title: tr('Matrizes irregulares (Jagged Arrays)', 'Jagged arrays (irregular matrices)'), menuLabel: tr('Jagged arrays', 'Jagged arrays'), group: tr('Estruturas especiais', 'Special structures'), number: '14',
    description: tr('Visualize uma matriz em que cada linha possui uma quantidade diferente de colunas.', 'See a matrix in which each row has a different number of columns.'),
    interaction: tr('Altere os tamanhos das linhas, por exemplo 2, 4, 3, e observe cada vetor interno ser alocado.', 'Change the row sizes, for example 2, 4, 3, and watch each inner array being allocated.'),
    complexity: { time: 'O(total)', space: 'O(total)', note: tr('O custo depende da soma das quantidades de posições alocadas em todas as linhas.', 'The cost depends on the sum of the numbers of positions allocated in all the rows.') },
    pseudocode: [tr('ALGORITMO CriarJagged(tamanhos)', 'ALGORITHM CreateJagged(sizes)'), tr('  r ← tamanhos.length', '  r ← sizes.length'), tr('  CRIE matriz jagged com r linhas', '  CREATE matrix jagged with r rows'), tr('  PARA i DE 0 ATÉ r-1 FAÇA', '  FOR i FROM 0 TO r-1 DO'), tr('    jagged[i] ← novo vetor[tamanhos[i]]', '    jagged[i] ← new array[sizes[i]]'), tr('  FIM-PARA', '  END-FOR'), tr('  RETORNE jagged', '  RETURN jagged'), tr('FIM', 'END')],
  },
];

const cloneMatrix = (matrix) => matrix.map((row) => [...row]);
const zeroMatrix = (rows, cols) => Array.from({ length: rows }, () => Array(cols).fill(0));
const fmt = (value) => Number.isInteger(Number(value)) ? String(Number(value)) : Number(value).toLocaleString(locale, { maximumFractionDigits: 2 });
const coord = (row, col) => `${row},${col}`;
const allCells = (matrix) => matrix.flatMap((row, i) => row.map((_, j) => coord(i, j)));
const step = (matrix, line, title, description, tone = 'neutral', extra = {}) => ({ values: cloneMatrix(matrix), line, title, description, tone, variables: {}, output: [], ...extra });

function dimensionsSteps(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  return [
    step(matrix, 0, tr('Matriz recebida', 'Matrix received'), tr(`A matriz possui ${m} linhas e ${n} colunas.`, `The matrix has ${m} rows and ${n} columns.`)),
    step(matrix, 1, tr('Obtendo o número de linhas', 'Getting the number of rows'), tr(`A.length retorna ${m}.`, `A.length returns ${m}.`), 'reading', { variables: { m } }),
    step(matrix, 2, tr('Obtendo o número de colunas', 'Getting the number of columns'), tr(`A[0].length retorna ${n}.`, `A[0].length returns ${n}.`), 'reading', { activeRows: [0], variables: { m, n } }),
    step(matrix, 3, tr('Primeira posição', 'First position'), tr(`A[0][0] = ${fmt(matrix[0][0])}.`, `A[0][0] = ${fmt(matrix[0][0])}.`), 'reading', { activeCells: [coord(0, 0)], variables: { m, n, primeiroIndice: '[0][0]', primeiroValor: matrix[0][0] } }),
    step(matrix, 4, tr('Última posição', 'Last position'), tr(`O último índice é [${m - 1}][${n - 1}] e contém ${fmt(matrix[m - 1][n - 1])}.`, `The last index is [${m - 1}][${n - 1}] and holds ${fmt(matrix[m - 1][n - 1])}.`), 'reading', { activeCells: [coord(m - 1, n - 1)], variables: { m, n, ultimoIndice: `[${m - 1}][${n - 1}]`, ultimoValor: matrix[m - 1][n - 1] } }),
    step(matrix, 5, tr('Dimensões identificadas', 'Dimensions identified'), tr(`${m} × ${n} = ${m * n} células.`, `${m} × ${n} = ${m * n} cells.`), 'success', { processedCells: allCells(matrix), variables: { m, n, total: m * n }, output: [tr(`Linhas: ${m}`, `Rows: ${m}`), tr(`Colunas: ${n}`, `Columns: ${n}`), tr(`Total de elementos: ${m * n}`, `Total elements: ${m * n}`)] }),
    step(matrix, 6, tr('Análise concluída', 'Analysis finished'), tr('Os índices de linhas e colunas começam em zero.', 'Row and column indices start at zero.'), 'done', { processedCells: allCells(matrix), variables: { m, n }, output: [tr(`Índices de linha: 0..${m - 1}`, `Row indices: 0..${m - 1}`), tr(`Índices de coluna: 0..${n - 1}`, `Column indices: 0..${n - 1}`)] }),
  ];
}

function validateCell(matrix, row, col) {
  return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length;
}

function accessSteps(matrix, config) {
  const row = config.row;
  const col = config.col;
  const valid = validateCell(matrix, row, col);
  const steps = [step(matrix, 0, tr('Preparando o acesso', 'Preparing the access'), tr(`Tentaremos acessar A[${row}][${col}].`, `We will try to access A[${row}][${col}].`))];
  steps.push(step(matrix, 1, tr('Validando os índices', 'Validating the indices'), valid ? tr(`A posição [${row}][${col}] existe.`, `Position [${row}][${col}] exists.`) : tr(`A posição [${row}][${col}] está fora da matriz.`, `Position [${row}][${col}] is outside the matrix.`), valid ? 'comparison' : 'warning', { activeCells: valid ? [coord(row, col)] : [], variables: { linha: row, coluna: col, valido: valid } }));
  if (!valid) {
    steps.push(step(matrix, 2, tr('Índice inválido', 'Invalid index'), tr('O acesso é bloqueado para evitar ArrayIndexOutOfBoundsException.', 'The access is blocked to avoid ArrayIndexOutOfBoundsException.'), 'warning', { variables: { linha: row, coluna: col, valido: false }, output: [tr('Índice inválido.', 'Invalid index.')] }));
    steps.push(step(matrix, 3, tr('Operação encerrada', 'Operation ended'), tr('Nenhuma célula foi acessada.', 'No cell was accessed.'), 'done', { output: [tr('Operação cancelada.', 'Operation cancelled.')] }));
    return steps;
  }
  const value = matrix[row][col];
  steps.push(step(matrix, 5, tr('Lendo a célula', 'Reading the cell'), tr(`A[${row}][${col}] contém ${fmt(value)}.`, `A[${row}][${col}] holds ${fmt(value)}.`), 'reading', { activeCells: [coord(row, col)], resultCells: [coord(row, col)], variables: { linha: row, coluna: col, valor: value } }));
  steps.push(step(matrix, 6, tr('Retornando o valor', 'Returning the value'), tr(`O valor ${fmt(value)} é retornado.`, `The value ${fmt(value)} is returned.`), 'success', { resultCells: [coord(row, col)], variables: { linha: row, coluna: col, valor: value }, output: [tr(`A[${row}][${col}] = ${fmt(value)}`, `A[${row}][${col}] = ${fmt(value)}`)] }));
  steps.push(step(matrix, 7, tr('Acesso concluído', 'Access finished'), tr('A matriz não foi modificada.', 'The matrix was not modified.'), 'done', { resultCells: [coord(row, col)], output: [tr(`A[${row}][${col}] = ${fmt(value)}`, `A[${row}][${col}] = ${fmt(value)}`)] }));
  return steps;
}

function updateSteps(matrix, config) {
  const row = config.row;
  const col = config.col;
  const newValue = config.newValue;
  const valid = validateCell(matrix, row, col);
  const steps = [step(matrix, 0, tr('Preparando a alteração', 'Preparing the update'), tr(`Tentaremos escrever ${fmt(newValue)} em A[${row}][${col}].`, `We will try to write ${fmt(newValue)} to A[${row}][${col}].`))];
  steps.push(step(matrix, 1, tr('Validando os índices', 'Validating the indices'), valid ? tr(`A posição [${row}][${col}] existe.`, `Position [${row}][${col}] exists.`) : tr(`A posição [${row}][${col}] está fora da matriz.`, `Position [${row}][${col}] is outside the matrix.`), valid ? 'comparison' : 'warning', { activeCells: valid ? [coord(row, col)] : [], variables: { linha: row, coluna: col, valido: valid } }));
  if (!valid) {
    steps.push(step(matrix, 2, tr('Índice inválido', 'Invalid index'), tr('Nenhuma atribuição será realizada.', 'No assignment will be made.'), 'warning', { output: [tr('Índice inválido.', 'Invalid index.')] }));
    steps.push(step(matrix, 3, tr('Operação encerrada', 'Operation ended'), tr('A matriz permanece inalterada.', 'The matrix stays unchanged.'), 'done', { output: [tr('Matriz inalterada.', 'Matrix unchanged.')] }));
    return steps;
  }
  const previous = matrix[row][col];
  steps.push(step(matrix, 5, tr('Guardando o valor anterior', 'Saving the previous value'), tr(`anterior recebe ${fmt(previous)}.`, `previous receives ${fmt(previous)}.`), 'reading', { activeCells: [coord(row, col)], variables: { linha: row, coluna: col, anterior: previous, novoValor: newValue } }));
  const changed = cloneMatrix(matrix);
  changed[row][col] = newValue;
  steps.push(step(changed, 6, tr('Escrevendo o novo valor', 'Writing the new value'), tr(`A[${row}][${col}] recebe ${fmt(newValue)}.`, `A[${row}][${col}] receives ${fmt(newValue)}.`), 'update', { activeCells: [coord(row, col)], changedCells: [coord(row, col)], variables: { linha: row, coluna: col, anterior: previous, novoValor: newValue } }));
  steps.push(step(changed, 7, tr('Retornando a alteração', 'Returning the change'), tr(`${fmt(previous)} foi substituído por ${fmt(newValue)}.`, `${fmt(previous)} was replaced by ${fmt(newValue)}.`), 'success', { resultCells: [coord(row, col)], variables: { anterior: previous, atual: newValue }, output: [tr(`A[${row}][${col}]: ${fmt(previous)} → ${fmt(newValue)}`, `A[${row}][${col}]: ${fmt(previous)} → ${fmt(newValue)}`)] }));
  steps.push(step(changed, 8, tr('Alteração concluída', 'Update finished'), tr('A nova matriz aparece na visualização.', 'The new matrix appears in the visualization.'), 'done', { resultCells: [coord(row, col)], output: [tr(`A[${row}][${col}] = ${fmt(newValue)}`, `A[${row}][${col}] = ${fmt(newValue)}`)] }));
  return steps;
}

function traversalSteps(matrix, useForEach = false) {
  const steps = [step(matrix, 0, useForEach ? tr('Iniciando o for-each', 'Starting the for-each') : tr('Iniciando o percurso', 'Starting the traversal'), tr('A matriz será visitada linha por linha.', 'The matrix will be visited row by row.'))];
  const output = [];
  const processed = [];
  for (let i = 0; i < matrix.length; i += 1) {
    const outerLine = 1;
    steps.push(step(matrix, outerLine, useForEach ? tr(`Selecionando a linha ${i}`, `Selecting row ${i}`) : tr(`Iniciando i = ${i}`, `Starting i = ${i}`), useForEach ? tr(`linha referencia A[${i}].`, `row references A[${i}].`) : tr(`O laço externo seleciona a linha ${i}.`, `The outer loop selects row ${i}.`), 'reading', { activeRows: [i], processedCells: [...processed], variables: useForEach ? { linha: `A[${i}]` } : { i } , output: [...output] }));
    const rowOutput = [];
    for (let j = 0; j < matrix[i].length; j += 1) {
      steps.push(step(matrix, 2, useForEach ? tr(`Selecionando elemento ${fmt(matrix[i][j])}`, `Selecting element ${fmt(matrix[i][j])}`) : tr(`Iniciando j = ${j}`, `Starting j = ${j}`), useForEach ? tr(`elemento recebe o próximo valor da linha: ${fmt(matrix[i][j])}.`, `element receives the next value of the row: ${fmt(matrix[i][j])}.`) : tr(`O laço interno seleciona A[${i}][${j}].`, `The inner loop selects A[${i}][${j}].`), 'reading', { activeRows: [i], activeCols: [j], activeCells: [coord(i, j)], processedCells: [...processed], variables: useForEach ? { linha: i, elemento: matrix[i][j] } : { i, j }, output: [...output] }));
      rowOutput.push(fmt(matrix[i][j]));
      processed.push(coord(i, j));
      steps.push(step(matrix, 3, tr(`Exibindo ${fmt(matrix[i][j])}`, `Displaying ${fmt(matrix[i][j])}`), tr(`O valor da posição [${i}][${j}] é enviado para a saída.`, `The value at position [${i}][${j}] is sent to the output.`), 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], variables: useForEach ? { elemento: matrix[i][j] } : { i, j, valor: matrix[i][j] }, output: [...output, rowOutput.join(' ')] }));
      steps.push(step(matrix, j < matrix[i].length - 1 ? 2 : 4, tr('Fim da iteração interna', 'End of the inner iteration'), j < matrix[i].length - 1 ? tr('O laço interno avança para o próximo elemento da linha.', 'The inner loop moves on to the next element of the row.') : tr('A última coluna desta linha foi processada.', 'The last column of this row was processed.'), 'neutral', { activeRows: [i], processedCells: [...processed], variables: useForEach ? { linha: i } : { i, j }, output: [...output, rowOutput.join(' ')] }));
    }
    output.push(rowOutput.join(' '));
    steps.push(step(matrix, 5, tr('Quebra de linha na saída', 'Line break in the output'), tr(`A linha ${i} terminou; a próxima saída começa em uma nova linha.`, `Row ${i} is done; the next output starts on a new line.`), 'reading', { processedCells: [...processed], variables: { linhaConcluida: i }, output: [...output] }));
    steps.push(step(matrix, i < matrix.length - 1 ? 1 : 6, tr('Fim da iteração externa', 'End of the outer iteration'), i < matrix.length - 1 ? tr(`O percurso continua na linha ${i + 1}.`, `The traversal continues at row ${i + 1}.`) : tr('Todas as linhas foram processadas.', 'All rows were processed.'), 'neutral', { processedCells: [...processed], output: [...output] }));
  }
  steps.push(step(matrix, 7, tr('Percurso concluído', 'Traversal finished'), tr('Todos os elementos foram visitados.', 'All elements were visited.'), 'done', { processedCells: allCells(matrix), output }));
  return steps;
}

function sumSteps(matrix) {
  const steps = [step(matrix, 0, tr('Iniciando SomaTotal', 'Starting TotalSum'), tr('O algoritmo prepara um acumulador para receber todos os valores.', 'The algorithm prepares an accumulator to receive all the values.'))];
  let sum = 0;
  const processed = [];
  steps.push(step(matrix, 1, tr('Inicializando S', 'Initializing S'), tr('S recebe 0.', 'S receives 0.'), 'update', { variables: { S: 0 } }));
  for (let i = 0; i < matrix.length; i += 1) {
    steps.push(step(matrix, 2, tr(`Laço externo: i = ${i}`, `Outer loop: i = ${i}`), tr(`A linha ${i} será percorrida.`, `Row ${i} will be traversed.`), 'reading', { activeRows: [i], processedCells: [...processed], variables: { i, S: sum } }));
    for (let j = 0; j < matrix[i].length; j += 1) {
      steps.push(step(matrix, 3, tr(`Laço interno: j = ${j}`, `Inner loop: j = ${j}`), tr(`A célula A[${i}][${j}] entra no cálculo.`, `Cell A[${i}][${j}] enters the calculation.`), 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, S: sum, valor: matrix[i][j] } }));
      const before = sum;
      sum += matrix[i][j];
      processed.push(coord(i, j));
      steps.push(step(matrix, 4, tr('Atualizando S', 'Updating S'), `${fmt(before)} + ${fmt(matrix[i][j])} = ${fmt(sum)}.`, 'update', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, anterior: before, valor: matrix[i][j], S: sum }, output: [tr(`Soma parcial: ${fmt(sum)}`, `Partial sum: ${fmt(sum)}`)] }));
      steps.push(step(matrix, j < matrix[i].length - 1 ? 3 : 5, tr('Fim do laço interno', 'End of the inner loop'), j < matrix[i].length - 1 ? tr(`j será incrementado para ${j + 1}.`, `j will be incremented to ${j + 1}.`) : tr('A linha atual terminou.', 'The current row is done.'), 'neutral', { processedCells: [...processed], variables: { i, j, S: sum } }));
    }
    steps.push(step(matrix, i < matrix.length - 1 ? 2 : 6, tr('Fim do laço externo', 'End of the outer loop'), i < matrix.length - 1 ? tr(`i será incrementado para ${i + 1}.`, `i will be incremented to ${i + 1}.`) : tr('Todas as linhas foram somadas.', 'All rows were added up.'), 'neutral', { processedCells: [...processed], variables: { i, S: sum } }));
  }
  steps.push(step(matrix, 7, tr('Retornando S', 'Returning S'), tr(`A soma total é ${fmt(sum)}.`, `The total sum is ${fmt(sum)}.`), 'success', { processedCells: allCells(matrix), variables: { S: sum }, output: [tr(`Soma total: ${fmt(sum)}`, `Total sum: ${fmt(sum)}`)] }));
  steps.push(step(matrix, 8, tr('Algoritmo concluído', 'Algorithm finished'), tr('SomaTotal terminou.', 'TotalSum finished.'), 'done', { processedCells: allCells(matrix), output: [tr(`Soma total: ${fmt(sum)}`, `Total sum: ${fmt(sum)}`)] }));
  return steps;
}

function maximumSteps(matrix) {
  let maxVal = matrix[0][0];
  let maxCell = coord(0, 0);
  const processed = [];
  const steps = [
    step(matrix, 0, tr('Iniciando MaiorValor', 'Starting MaxValue'), tr('A matriz não vazia será examinada completamente.', 'The non-empty matrix will be fully examined.')),
    step(matrix, 1, tr('Inicializando maxVal', 'Initializing maxVal'), tr(`maxVal recebe A[0][0] = ${fmt(maxVal)}.`, `maxVal receives A[0][0] = ${fmt(maxVal)}.`), 'update', { activeCells: [maxCell], resultCells: [maxCell], variables: { maxVal } }),
  ];
  for (let i = 0; i < matrix.length; i += 1) {
    steps.push(step(matrix, 2, tr(`Laço externo: i = ${i}`, `Outer loop: i = ${i}`), tr(`A linha ${i} será examinada.`, `Row ${i} will be examined.`), 'reading', { activeRows: [i], resultCells: [maxCell], processedCells: [...processed], variables: { i, maxVal } }));
    for (let j = 0; j < matrix[i].length; j += 1) {
      steps.push(step(matrix, 3, tr(`Laço interno: j = ${j}`, `Inner loop: j = ${j}`), tr(`A[${i}][${j}] = ${fmt(matrix[i][j])} será comparado com maxVal.`, `A[${i}][${j}] = ${fmt(matrix[i][j])} will be compared with maxVal.`), 'reading', { activeCells: [coord(i, j)], resultCells: [maxCell], processedCells: [...processed], variables: { i, j, maxVal, valor: matrix[i][j] } }));
      const previousCell = maxCell;
      const previousMax = maxVal;
      const greater = matrix[i][j] > maxVal;
      steps.push(step(matrix, 4, tr('Testando a condição', 'Testing the condition'), tr(`${fmt(matrix[i][j])} > ${fmt(maxVal)} é ${greater ? 'verdadeiro' : 'falso'}.`, `${fmt(matrix[i][j])} > ${fmt(maxVal)} is ${greater ? 'true' : 'false'}.`), 'comparison', { activeCells: [coord(i, j)], comparedCells: [...new Set([coord(i, j), previousCell])], resultCells: [previousCell], processedCells: [...processed], variables: { i, j, valor: matrix[i][j], maxVal, condicao: greater } }));
      if (greater) {
        maxVal = matrix[i][j];
        maxCell = coord(i, j);
        steps.push(step(matrix, 5, tr('Atualizando maxVal', 'Updating maxVal'), tr(`maxVal recebe ${fmt(maxVal)}.`, `maxVal receives ${fmt(maxVal)}.`), 'update', { activeCells: [maxCell], changedCells: [maxCell], resultCells: [maxCell], processedCells: [...processed], variables: { i, j, anterior: previousMax, maxVal } }));
      }
      processed.push(coord(i, j));
      steps.push(step(matrix, 6, greater ? tr('Fim da condição', 'End of the condition') : tr('Mantendo maxVal', 'Keeping maxVal'), greater ? tr('O novo maior valor foi registrado.', 'The new largest value was recorded.') : tr(`${fmt(matrix[i][j])} não supera ${fmt(maxVal)}.`, `${fmt(matrix[i][j])} does not exceed ${fmt(maxVal)}.`), 'neutral', { activeCells: [coord(i, j)], resultCells: [maxCell], processedCells: [...processed], variables: { i, j, maxVal, condicao: greater } }));
      steps.push(step(matrix, j < matrix[i].length - 1 ? 3 : 7, tr('Fim do laço interno', 'End of the inner loop'), j < matrix[i].length - 1 ? tr(`j avança para ${j + 1}.`, `j moves to ${j + 1}.`) : tr('A última coluna desta linha foi examinada.', 'The last column of this row was examined.'), 'neutral', { resultCells: [maxCell], processedCells: [...processed], variables: { i, j, maxVal } }));
    }
    steps.push(step(matrix, i < matrix.length - 1 ? 2 : 8, tr('Fim do laço externo', 'End of the outer loop'), i < matrix.length - 1 ? tr(`i avança para ${i + 1}.`, `i moves to ${i + 1}.`) : tr('A matriz inteira foi examinada.', 'The whole matrix was examined.'), 'neutral', { resultCells: [maxCell], processedCells: [...processed], variables: { i, maxVal } }));
  }
  steps.push(step(matrix, 9, tr('Retornando maxVal', 'Returning maxVal'), tr(`O maior valor é ${fmt(maxVal)}.`, `The largest value is ${fmt(maxVal)}.`), 'success', { resultCells: [maxCell], processedCells: allCells(matrix), variables: { maxVal }, output: [tr(`Maior valor: ${fmt(maxVal)}`, `Largest value: ${fmt(maxVal)}`), tr(`Posição: [${maxCell.split(',').join('][')}]`, `Position: [${maxCell.split(',').join('][')}]`)] }));
  steps.push(step(matrix, 10, tr('Algoritmo concluído', 'Algorithm finished'), tr('MaiorValor terminou.', 'MaxValue finished.'), 'done', { resultCells: [maxCell], output: [tr(`Maior valor: ${fmt(maxVal)}`, `Largest value: ${fmt(maxVal)}`)] }));
  return steps;
}

function averageSteps(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const total = m * n;
  const steps = [step(matrix, 0, tr('Iniciando Media', 'Starting Mean'), tr('Primeiro calculamos a quantidade de elementos.', 'First we calculate the number of elements.'))];
  steps.push(step(matrix, 1, tr('Calculando totalElementos', 'Calculating totalElements'), tr(`${m} × ${n} = ${total}.`, `${m} × ${n} = ${total}.`), 'update', { variables: { m, n, totalElementos: total } }));
  steps.push(step(matrix, 2, tr('Verificando matriz vazia', 'Checking for an empty matrix'), tr(`${total} = 0 é falso; o cálculo continua.`, `${total} = 0 is false; the calculation continues.`), 'comparison', { variables: { totalElementos: total, vazio: false } }));
  let sum = 0;
  const processed = [];
  steps.push(step(matrix, 5, tr('Inicializando S', 'Initializing S'), tr('S recebe 0.', 'S receives 0.'), 'update', { variables: { S: 0, totalElementos: total } }));
  for (let i = 0; i < m; i += 1) {
    steps.push(step(matrix, 6, tr(`Laço externo: i = ${i}`, `Outer loop: i = ${i}`), tr(`A linha ${i} será somada.`, `Row ${i} will be added.`), 'reading', { activeRows: [i], processedCells: [...processed], variables: { i, S: sum } }));
    for (let j = 0; j < n; j += 1) {
      steps.push(step(matrix, 7, tr(`Laço interno: j = ${j}`, `Inner loop: j = ${j}`), tr(`Visitando A[${i}][${j}].`, `Visiting A[${i}][${j}].`), 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, S: sum, valor: matrix[i][j] } }));
      const before = sum;
      sum += matrix[i][j];
      processed.push(coord(i, j));
      steps.push(step(matrix, 8, tr('Atualizando S', 'Updating S'), `${fmt(before)} + ${fmt(matrix[i][j])} = ${fmt(sum)}.`, 'update', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, S: sum }, output: [tr(`Soma parcial: ${fmt(sum)}`, `Partial sum: ${fmt(sum)}`)] }));
      steps.push(step(matrix, j < n - 1 ? 7 : 9, tr('Fim do laço interno', 'End of the inner loop'), j < n - 1 ? tr(`j avança para ${j + 1}.`, `j moves to ${j + 1}.`) : tr('Fim da linha.', 'End of the row.'), 'neutral', { processedCells: [...processed], variables: { i, j, S: sum } }));
    }
    steps.push(step(matrix, i < m - 1 ? 6 : 10, tr('Fim do laço externo', 'End of the outer loop'), i < m - 1 ? tr(`i avança para ${i + 1}.`, `i moves to ${i + 1}.`) : tr('Todas as linhas foram somadas.', 'All rows were added up.'), 'neutral', { processedCells: [...processed], variables: { i, S: sum } }));
  }
  const average = sum / total;
  steps.push(step(matrix, 11, tr('Calculando media', 'Calculating average'), tr(`${fmt(sum)} ÷ ${total} = ${fmt(average)}.`, `${fmt(sum)} ÷ ${total} = ${fmt(average)}.`), 'success', { processedCells: allCells(matrix), variables: { S: sum, totalElementos: total, media: fmt(average) }, output: [tr(`Média: ${fmt(average)}`, `Mean: ${fmt(average)}`)] }));
  steps.push(step(matrix, 12, tr('Retornando media', 'Returning average'), tr(`O resultado é ${fmt(average)}.`, `The result is ${fmt(average)}.`), 'success', { processedCells: allCells(matrix), variables: { media: fmt(average) }, output: [tr(`Média: ${fmt(average)}`, `Mean: ${fmt(average)}`)] }));
  steps.push(step(matrix, 13, tr('Algoritmo concluído', 'Algorithm finished'), tr('Media terminou.', 'Mean finished.'), 'done', { output: [tr(`Média: ${fmt(average)}`, `Mean: ${fmt(average)}`)] }));
  return steps;
}

function rowSumSteps(matrix) {
  const rowSum = Array(matrix.length).fill(0);
  const processed = [];
  const steps = [step(matrix, 0, tr('Iniciando SomaPorLinha', 'Starting RowSums'), tr('Será criado um resultado para cada linha.', 'One result will be created for each row.'))];
  steps.push(step(matrix, 1, tr('Criando rowSum', 'Creating rowSum'), tr(`rowSum possui ${matrix.length} posições.`, `rowSum has ${matrix.length} positions.`), 'update', { resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { tamanhoRowSum: matrix.length } }));
  for (let i = 0; i < matrix.length; i += 1) {
    steps.push(step(matrix, 2, tr(`Laço externo: i = ${i}`, `Outer loop: i = ${i}`), tr(`Começando a soma da linha ${i}.`, `Starting the sum of row ${i}.`), 'reading', { activeRows: [i], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i } }));
    let s = 0;
    steps.push(step(matrix, 3, tr('Reiniciando s', 'Resetting s'), tr('s recebe 0 para esta linha.', 's receives 0 for this row.'), 'update', { activeRows: [i], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i, s } }));
    for (let j = 0; j < matrix[i].length; j += 1) {
      steps.push(step(matrix, 4, tr(`Laço interno: j = ${j}`, `Inner loop: j = ${j}`), tr(`Visitando A[${i}][${j}].`, `Visiting A[${i}][${j}].`), 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i, j, s } }));
      const before = s;
      s += matrix[i][j];
      processed.push(coord(i, j));
      steps.push(step(matrix, 5, tr('Atualizando s', 'Updating s'), `${fmt(before)} + ${fmt(matrix[i][j])} = ${fmt(s)}.`, 'update', { activeCells: [coord(i, j)], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i, j, s } }));
      steps.push(step(matrix, j < matrix[i].length - 1 ? 4 : 6, tr('Fim do laço interno', 'End of the inner loop'), j < matrix[i].length - 1 ? tr(`j avança para ${j + 1}.`, `j moves to ${j + 1}.`) : tr('A soma da linha terminou.', 'The row sum is done.'), 'neutral', { activeRows: [i], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', variables: { i, j, s } }));
    }
    rowSum[i] = s;
    steps.push(step(matrix, 7, tr(`Gravando rowSum[${i}]`, `Storing rowSum[${i}]`), tr(`rowSum[${i}] recebe ${fmt(s)}.`, `rowSum[${i}] receives ${fmt(s)}.`), 'success', { activeRows: [i], processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum', resultVectorActive: i, variables: { i, s, [`rowSum[${i}]`]: s } }));
    steps.push(step(matrix, i < matrix.length - 1 ? 2 : 8, tr('Fim do laço externo', 'End of the outer loop'), i < matrix.length - 1 ? tr(`A próxima linha será ${i + 1}.`, `The next row will be ${i + 1}.`) : tr('Todas as linhas foram processadas.', 'All rows were processed.'), 'neutral', { processedCells: [...processed], resultVector: [...rowSum], resultVectorLabel: 'rowSum' }));
  }
  steps.push(step(matrix, 9, tr('Retornando rowSum', 'Returning rowSum'), `[${rowSum.map(fmt).join(', ')}]`, 'success', { processedCells: allCells(matrix), resultVector: [...rowSum], resultVectorLabel: 'rowSum', output: [`rowSum = [${rowSum.map(fmt).join(', ')}]`] }));
  steps.push(step(matrix, 10, tr('Algoritmo concluído', 'Algorithm finished'), tr('SomaPorLinha terminou.', 'RowSums finished.'), 'done', { processedCells: allCells(matrix), resultVector: [...rowSum], resultVectorLabel: 'rowSum', output: [`rowSum = [${rowSum.map(fmt).join(', ')}]`] }));
  return steps;
}

function colSumSteps(matrix) {
  const cols = matrix[0].length;
  const colSum = Array(cols).fill(0);
  const processed = [];
  const steps = [step(matrix, 0, tr('Iniciando SomaPorColuna', 'Starting ColumnSums'), tr('Será criado um resultado para cada coluna.', 'One result will be created for each column.'))];
  steps.push(step(matrix, 1, tr('Criando colSum', 'Creating colSum'), tr(`colSum possui ${cols} posições.`, `colSum has ${cols} positions.`), 'update', { resultVector: [...colSum], resultVectorLabel: 'colSum', variables: { tamanhoColSum: cols } }));
  for (let j = 0; j < cols; j += 1) {
    steps.push(step(matrix, 2, tr(`Inicialização: j = ${j}`, `Initialization: j = ${j}`), tr(`Preparando colSum[${j}].`, `Preparing colSum[${j}].`), 'reading', { activeCols: [j], resultVector: [...colSum], resultVectorLabel: 'colSum', resultVectorActive: j, variables: { j } }));
    colSum[j] = 0;
    steps.push(step(matrix, 3, `colSum[${j}] ← 0`, tr('A posição começa zerada.', 'The position starts at zero.'), 'update', { activeCols: [j], resultVector: [...colSum], resultVectorLabel: 'colSum', resultVectorActive: j, variables: { j, [`colSum[${j}]`]: 0 } }));
    steps.push(step(matrix, j < cols - 1 ? 2 : 4, tr('Fim da inicialização', 'End of the initialization'), j < cols - 1 ? tr(`j avança para ${j + 1}.`, `j moves to ${j + 1}.`) : tr('Todas as colunas foram inicializadas.', 'All the columns were initialized.'), 'neutral', { resultVector: [...colSum], resultVectorLabel: 'colSum' }));
  }
  for (let i = 0; i < matrix.length; i += 1) {
    steps.push(step(matrix, 5, tr(`Laço externo: i = ${i}`, `Outer loop: i = ${i}`), tr(`A linha ${i} contribuirá para as somas de coluna.`, `Row ${i} will contribute to the column sums.`), 'reading', { activeRows: [i], processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum', variables: { i } }));
    for (let j = 0; j < cols; j += 1) {
      steps.push(step(matrix, 6, tr(`Laço interno: j = ${j}`, `Inner loop: j = ${j}`), tr(`Visitando A[${i}][${j}].`, `Visiting A[${i}][${j}].`), 'reading', { activeCells: [coord(i, j)], activeCols: [j], processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum', resultVectorActive: j, variables: { i, j, valor: matrix[i][j], atual: colSum[j] } }));
      const before = colSum[j];
      colSum[j] += matrix[i][j];
      processed.push(coord(i, j));
      steps.push(step(matrix, 7, tr(`Atualizando colSum[${j}]`, `Updating colSum[${j}]`), `${fmt(before)} + ${fmt(matrix[i][j])} = ${fmt(colSum[j])}.`, 'update', { activeCells: [coord(i, j)], activeCols: [j], processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum', resultVectorActive: j, variables: { i, j, [`colSum[${j}]`]: colSum[j] } }));
      steps.push(step(matrix, j < cols - 1 ? 6 : 8, tr('Fim do laço interno', 'End of the inner loop'), j < cols - 1 ? tr(`j avança para ${j + 1}.`, `j moves to ${j + 1}.`) : tr('Fim da linha atual.', 'End of the current row.'), 'neutral', { processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum' }));
    }
    steps.push(step(matrix, i < matrix.length - 1 ? 5 : 9, tr('Fim do laço externo', 'End of the outer loop'), i < matrix.length - 1 ? tr(`i avança para ${i + 1}.`, `i moves to ${i + 1}.`) : tr('Todas as linhas contribuíram.', 'All the rows contributed.'), 'neutral', { processedCells: [...processed], resultVector: [...colSum], resultVectorLabel: 'colSum' }));
  }
  steps.push(step(matrix, 10, tr('Retornando colSum', 'Returning colSum'), `[${colSum.map(fmt).join(', ')}]`, 'success', { processedCells: allCells(matrix), resultVector: [...colSum], resultVectorLabel: 'colSum', output: [`colSum = [${colSum.map(fmt).join(', ')}]`] }));
  steps.push(step(matrix, 11, tr('Algoritmo concluído', 'Algorithm finished'), tr('SomaPorColuna terminou.', 'ColumnSums finished.'), 'done', { processedCells: allCells(matrix), resultVector: [...colSum], resultVectorLabel: 'colSum', output: [`colSum = [${colSum.map(fmt).join(', ')}]`] }));
  return steps;
}

function identitySteps(order) {
  const identity = zeroMatrix(order, order);
  const processed = [];
  const steps = [step(identity, 0, tr('Iniciando MatrizIdentidade', 'Starting IdentityMatrix'), tr(`Será criada uma matriz ${order} × ${order}.`, `A ${order} × ${order} matrix will be created.`))];
  steps.push(step(identity, 1, tr('Alocando I', 'Allocating I'), tr('Todas as posições começam com 0.', 'All positions start with 0.'), 'update', { variables: { n: order } }));
  for (let i = 0; i < order; i += 1) {
    steps.push(step(identity, 2, tr(`Laço externo: i = ${i}`, `Outer loop: i = ${i}`), tr(`Percorrendo a linha ${i}.`, `Traversing row ${i}.`), 'reading', { activeRows: [i], processedCells: [...processed], variables: { i, n: order } }));
    for (let j = 0; j < order; j += 1) {
      steps.push(step(identity, 3, tr(`Laço interno: j = ${j}`, `Inner loop: j = ${j}`), tr(`Selecionando I[${i}][${j}].`, `Selecting I[${i}][${j}].`), 'reading', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j } }));
      const diagonal = i === j;
      steps.push(step(identity, 4, tr('Testando i = j', 'Testing i = j'), tr(`${i} = ${j} é ${diagonal ? 'verdadeiro' : 'falso'}.`, `${i} = ${j} is ${diagonal ? 'true' : 'false'}.`), 'comparison', { activeCells: [coord(i, j)], comparedCells: [coord(i, j)], processedCells: [...processed], variables: { i, j, diagonal } }));
      identity[i][j] = diagonal ? 1 : 0;
      steps.push(step(identity, diagonal ? 5 : 7, diagonal ? tr('Escrevendo 1', 'Writing 1') : tr('Escrevendo 0', 'Writing 0'), diagonal ? tr('A célula pertence à diagonal principal.', 'The cell belongs to the main diagonal.') : tr('A célula está fora da diagonal principal.', 'The cell is off the main diagonal.'), 'update', { activeCells: [coord(i, j)], changedCells: [coord(i, j)], resultCells: diagonal ? [coord(i, j)] : [], processedCells: [...processed], variables: { i, j, valor: identity[i][j] } }));
      processed.push(coord(i, j));
      steps.push(step(identity, 8, tr('Fim da condição', 'End of the condition'), tr('A posição atual foi definida.', 'The current position was set.'), 'neutral', { activeCells: [coord(i, j)], processedCells: [...processed], variables: { i, j } }));
      steps.push(step(identity, j < order - 1 ? 3 : 9, tr('Fim do laço interno', 'End of the inner loop'), j < order - 1 ? tr(`j avança para ${j + 1}.`, `j moves to ${j + 1}.`) : tr('Fim da linha.', 'End of the row.'), 'neutral', { processedCells: [...processed], variables: { i, j } }));
    }
    steps.push(step(identity, i < order - 1 ? 2 : 10, tr('Fim do laço externo', 'End of the outer loop'), i < order - 1 ? tr(`i avança para ${i + 1}.`, `i moves to ${i + 1}.`) : tr('Todas as linhas foram preenchidas.', 'All rows were filled in.'), 'neutral', { processedCells: [...processed], variables: { i } }));
  }
  const diagonalCells = Array.from({ length: order }, (_, i) => coord(i, i));
  steps.push(step(identity, 11, tr('Retornando I', 'Returning I'), tr('A matriz identidade está pronta.', 'The identity matrix is ready.'), 'success', { processedCells: allCells(identity), resultCells: diagonalCells, output: [tr(`Identidade ${order} × ${order} criada.`, `${order} × ${order} identity created.`)] }));
  steps.push(step(identity, 12, tr('Algoritmo concluído', 'Algorithm finished'), tr('MatrizIdentidade terminou.', 'IdentityMatrix finished.'), 'done', { resultCells: diagonalCells, output: [tr(`I${order} criada com sucesso.`, `I${order} created successfully.`)] }));
  return steps;
}

function transposeSteps(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const transposed = zeroMatrix(n, m);
  const processedSource = [];
  const processedTarget = [];
  const steps = [step(matrix, 0, tr('Iniciando Transposta', 'Starting Transpose'), tr(`A (${m} × ${n}) produzirá T (${n} × ${m}).`, `A (${m} × ${n}) will produce T (${n} × ${m}).`), 'neutral', { secondaryMatrix: cloneMatrix(transposed), primaryLabel: tr('A — original', 'A — original'), secondaryLabel: tr('T — transposta', 'T — transpose') })];
  steps.push(step(matrix, 1, tr('Alocando T', 'Allocating T'), tr(`T recebe ${n} linhas e ${m} colunas.`, `T receives ${n} rows and ${m} columns.`), 'update', { secondaryMatrix: cloneMatrix(transposed), primaryLabel: tr('A — original', 'A — original'), secondaryLabel: tr('T — transposta', 'T — transpose'), variables: { m, n } }));
  for (let i = 0; i < m; i += 1) {
    steps.push(step(matrix, 2, tr(`Laço externo: i = ${i}`, `Outer loop: i = ${i}`), tr(`Percorrendo a linha ${i} de A.`, `Traversing row ${i} of A.`), 'reading', { activeRows: [i], processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryProcessedCells: [...processedTarget], primaryLabel: tr('A — original', 'A — original'), secondaryLabel: tr('T — transposta', 'T — transpose'), variables: { i } }));
    for (let j = 0; j < n; j += 1) {
      steps.push(step(matrix, 3, tr(`Laço interno: j = ${j}`, `Inner loop: j = ${j}`), tr(`Preparando a cópia de A[${i}][${j}] para T[${j}][${i}].`, `Preparing the copy of A[${i}][${j}] to T[${j}][${i}].`), 'reading', { activeCells: [coord(i, j)], processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryActiveCells: [coord(j, i)], secondaryProcessedCells: [...processedTarget], primaryLabel: tr('A — original', 'A — original'), secondaryLabel: tr('T — transposta', 'T — transpose'), variables: { i, j, origem: `A[${i}][${j}]`, destino: `T[${j}][${i}]` } }));
      transposed[j][i] = matrix[i][j];
      processedSource.push(coord(i, j));
      processedTarget.push(coord(j, i));
      steps.push(step(matrix, 4, tr('Copiando a célula', 'Copying the cell'), tr(`T[${j}][${i}] recebe ${fmt(matrix[i][j])}.`, `T[${j}][${i}] receives ${fmt(matrix[i][j])}.`), 'update', { activeCells: [coord(i, j)], processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryActiveCells: [coord(j, i)], secondaryChangedCells: [coord(j, i)], secondaryProcessedCells: [...processedTarget], primaryLabel: tr('A — original', 'A — original'), secondaryLabel: tr('T — transposta', 'T — transpose'), variables: { i, j, valor: matrix[i][j] } }));
      steps.push(step(matrix, j < n - 1 ? 3 : 5, tr('Fim do laço interno', 'End of the inner loop'), j < n - 1 ? tr(`j avança para ${j + 1}.`, `j moves to ${j + 1}.`) : tr('Fim da linha de A.', 'End of the row of A.'), 'neutral', { processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryProcessedCells: [...processedTarget], primaryLabel: tr('A — original', 'A — original'), secondaryLabel: tr('T — transposta', 'T — transpose') }));
    }
    steps.push(step(matrix, i < m - 1 ? 2 : 6, tr('Fim do laço externo', 'End of the outer loop'), i < m - 1 ? tr(`i avança para ${i + 1}.`, `i moves to ${i + 1}.`) : tr('Todos os elementos foram copiados.', 'All the elements were copied.'), 'neutral', { processedCells: [...processedSource], secondaryMatrix: cloneMatrix(transposed), secondaryProcessedCells: [...processedTarget], primaryLabel: tr('A — original', 'A — original'), secondaryLabel: tr('T — transposta', 'T — transpose') }));
  }
  steps.push(step(matrix, 7, tr('Retornando T', 'Returning T'), tr('A transposição está completa.', 'The transposition is complete.'), 'success', { processedCells: allCells(matrix), secondaryMatrix: cloneMatrix(transposed), secondaryResultCells: allCells(transposed), primaryLabel: tr('A — original', 'A — original'), secondaryLabel: tr('T — transposta', 'T — transpose'), output: [tr(`T possui dimensão ${n} × ${m}.`, `T has dimension ${n} × ${m}.`)] }));
  steps.push(step(matrix, 8, tr('Algoritmo concluído', 'Algorithm finished'), tr('Cada linha de A tornou-se uma coluna de T.', 'Each row of A became a column of T.'), 'done', { secondaryMatrix: cloneMatrix(transposed), secondaryResultCells: allCells(transposed), primaryLabel: tr('A — original', 'A — original'), secondaryLabel: tr('T — transposta', 'T — transpose') }));
  return steps;
}

function symmetricSteps(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const steps = [step(matrix, 0, tr('Iniciando EhSimetrica', 'Starting IsSymmetric'), tr('Uma matriz simétrica precisa ser quadrada.', 'A symmetric matrix must be square.'))];
  const square = m === n;
  steps.push(step(matrix, 1, tr('Verificando as dimensões', 'Checking the dimensions'), tr(`${m} ≠ ${n} é ${square ? 'falso' : 'verdadeiro'}.`, `${m} ≠ ${n} is ${square ? 'false' : 'true'}.`), 'comparison', { variables: { m, n, quadrada: square } }));
  if (!square) {
    steps.push(step(matrix, 2, tr('Retornando FALSO', 'Returning FALSE'), tr('Uma matriz não quadrada não pode ser simétrica.', 'A non-square matrix cannot be symmetric.'), 'warning', { output: [tr('Simétrica: FALSO', 'Symmetric: FALSE')] }));
    steps.push(step(matrix, 12, tr('Algoritmo concluído', 'Algorithm finished'), tr('A verificação terminou pelas dimensões.', 'The check ended at the dimensions.'), 'done', { output: [tr('Simétrica: FALSO', 'Symmetric: FALSE')] }));
    return steps;
  }
  const processed = [];
  steps.push(step(matrix, 3, tr('Fim da validação', 'End of the validation'), tr('A matriz é quadrada; podemos comparar pares espelhados.', 'The matrix is square; we can compare mirrored pairs.'), 'reading', { variables: { n } }));
  for (let i = 0; i < n; i += 1) {
    steps.push(step(matrix, 4, tr(`Laço externo: i = ${i}`, `Outer loop: i = ${i}`), tr(`Compararemos elementos acima da diagonal na linha ${i}.`, `We will compare elements above the diagonal in row ${i}.`), 'reading', { activeRows: [i], processedCells: [...processed], variables: { i, n } }));
    for (let j = i + 1; j < n; j += 1) {
      const first = coord(i, j);
      const mirror = coord(j, i);
      steps.push(step(matrix, 5, tr(`Laço interno: j = ${j}`, `Inner loop: j = ${j}`), tr(`Comparando A[${i}][${j}] com A[${j}][${i}].`, `Comparing A[${i}][${j}] with A[${j}][${i}].`), 'reading', { activeCells: [first, mirror], comparedCells: [first, mirror], processedCells: [...processed], variables: { i, j } }));
      const different = matrix[i][j] !== matrix[j][i];
      steps.push(step(matrix, 6, tr('Testando o par espelhado', 'Testing the mirrored pair'), tr(`${fmt(matrix[i][j])} ≠ ${fmt(matrix[j][i])} é ${different ? 'verdadeiro' : 'falso'}.`, `${fmt(matrix[i][j])} ≠ ${fmt(matrix[j][i])} is ${different ? 'true' : 'false'}.`), 'comparison', { comparedCells: [first, mirror], processedCells: [...processed], variables: { i, j, valorA: matrix[i][j], valorEspelhado: matrix[j][i], diferentes: different } }));
      if (different) {
        steps.push(step(matrix, 7, tr('Retornando FALSO', 'Returning FALSE'), tr('Foi encontrado um par diferente; a matriz não é simétrica.', 'A different pair was found; the matrix is not symmetric.'), 'warning', { comparedCells: [first, mirror], resultCells: [first, mirror], processedCells: [...processed], output: [tr('Simétrica: FALSO', 'Symmetric: FALSE')] }));
        steps.push(step(matrix, 12, tr('Algoritmo concluído', 'Algorithm finished'), tr('A verificação parou na primeira diferença.', 'The check stopped at the first difference.'), 'done', { resultCells: [first, mirror], output: [tr('Simétrica: FALSO', 'Symmetric: FALSE')] }));
        return steps;
      }
      processed.push(first, mirror);
      steps.push(step(matrix, 8, tr('Fim da condição', 'End of the condition'), tr('Os dois valores são iguais; a verificação continua.', 'The two values are equal; the check continues.'), 'success', { comparedCells: [first, mirror], processedCells: [...processed], variables: { i, j } }));
      steps.push(step(matrix, j < n - 1 ? 5 : 9, tr('Fim do laço interno', 'End of the inner loop'), j < n - 1 ? tr(`j avança para ${j + 1}.`, `j moves to ${j + 1}.`) : tr('Todos os pares desta linha foram verificados.', 'All the pairs in this row were checked.'), 'neutral', { processedCells: [...processed] }));
    }
    steps.push(step(matrix, i < n - 1 ? 4 : 10, tr('Fim do laço externo', 'End of the outer loop'), i < n - 1 ? tr(`i avança para ${i + 1}.`, `i moves to ${i + 1}.`) : tr('Todos os pares necessários foram comparados.', 'All the necessary pairs were compared.'), 'neutral', { processedCells: [...processed] }));
  }
  steps.push(step(matrix, 11, tr('Retornando VERDADEIRO', 'Returning TRUE'), tr('Todos os pares espelhados são iguais.', 'All the mirrored pairs are equal.'), 'success', { resultCells: allCells(matrix), output: [tr('Simétrica: VERDADEIRO', 'Symmetric: TRUE')] }));
  steps.push(step(matrix, 12, tr('Algoritmo concluído', 'Algorithm finished'), tr('A matriz é simétrica em relação à diagonal principal.', 'The matrix is symmetric with respect to the main diagonal.'), 'done', { resultCells: allCells(matrix), output: [tr('Simétrica: VERDADEIRO', 'Symmetric: TRUE')] }));
  return steps;
}

function jaggedSteps(config) {
  const lengths = config.jaggedLengths;
  const rows = lengths.length;
  const jagged = Array.from({ length: rows }, () => []);
  const allocated = [];
  const steps = [step(jagged, 0, tr('Iniciando CriarJagged', 'Starting CreateJagged'), tr(`Serão criadas ${rows} linhas com tamanhos independentes.`, `${rows} rows with independent sizes will be created.`), 'neutral', { jagged: true, allocatedRows: [...allocated] })];
  steps.push(step(jagged, 1, tr('Obtendo r', 'Getting r'), tr(`r recebe ${rows}.`, `r receives ${rows}.`), 'reading', { jagged: true, allocatedRows: [...allocated], variables: { r: rows, tamanhos: lengths.join(', ') } }));
  steps.push(step(jagged, 2, tr('Criando referências das linhas', 'Creating the row references'), tr('As linhas existem, mas seus vetores internos ainda não foram alocados.', 'The rows exist, but their inner arrays have not been allocated yet.'), 'update', { jagged: true, allocatedRows: [...allocated], variables: { r: rows } }));
  for (let i = 0; i < rows; i += 1) {
    steps.push(step(jagged, 3, tr(`Laço: i = ${i}`, `Loop: i = ${i}`), tr(`A linha ${i} receberá ${lengths[i]} posições.`, `Row ${i} will receive ${lengths[i]} positions.`), 'reading', { jagged: true, allocatedRows: [...allocated], activeRows: [i], variables: { i, tamanho: lengths[i] } }));
    jagged[i] = Array(lengths[i]).fill(0);
    allocated.push(i);
    steps.push(step(jagged, 4, tr(`Alocando jagged[${i}]`, `Allocating jagged[${i}]`), tr(`Foi criado um vetor interno de tamanho ${lengths[i]}.`, `An inner array of size ${lengths[i]} was created.`), 'update', { jagged: true, allocatedRows: [...allocated], activeRows: [i], changedCells: jagged[i].map((_, j) => coord(i, j)), variables: { i, [`jagged[${i}].length`]: lengths[i] } }));
    steps.push(step(jagged, i < rows - 1 ? 3 : 5, tr('Fim da iteração', 'End of the iteration'), i < rows - 1 ? tr(`i avança para ${i + 1}.`, `i moves to ${i + 1}.`) : tr('Todas as linhas foram alocadas.', 'All the rows were allocated.'), 'neutral', { jagged: true, allocatedRows: [...allocated] }));
  }
  steps.push(step(jagged, 6, tr('Retornando jagged', 'Returning jagged'), tr(`Tamanhos das linhas: [${lengths.join(', ')}].`, `Row sizes: [${lengths.join(', ')}].`), 'success', { jagged: true, allocatedRows: [...allocated], processedCells: allCells(jagged), output: [tr(`Comprimentos: [${lengths.join(', ')}]`, `Lengths: [${lengths.join(', ')}]`)] }));
  steps.push(step(jagged, 7, tr('Algoritmo concluído', 'Algorithm finished'), tr('Cada linha possui seu próprio tamanho.', 'Each row has its own size.'), 'done', { jagged: true, allocatedRows: [...allocated], output: [tr(`Total de posições: ${lengths.reduce((a, b) => a + b, 0)}`, `Total positions: ${lengths.reduce((a, b) => a + b, 0)}`)] }));
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
