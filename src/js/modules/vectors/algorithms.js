import { locale, tr } from '../../core/i18n.js';
export const algorithms = [
  {
    id: 'indices', title: tr('Tamanho e índices', 'Size and indices'), menuLabel: tr('Tamanho e índices', 'Size and indices'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Observe como o tamanho, o primeiro índice e o último índice são obtidos.', 'See how the size, the first index and the last index are obtained.'),
    interaction: tr('Clique em qualquer posição do vetor para inspecionar seu índice e valor.', 'Click any position of the array to inspect its index and value.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('A propriedade length é acessada diretamente.', 'The length property is accessed directly.') },
    pseudocode: [tr('FUNÇÃO analisarIndices(vetor)', 'FUNCTION analyzeIndices(array)'), tr('  tamanho ← vetor.length', '  size ← array.length'), tr('  primeiroIndice ← 0', '  firstIndex ← 0'), tr('  ultimoIndice ← tamanho - 1', '  lastIndex ← size - 1'), tr('  ESCREVA tamanho, primeiroIndice, ultimoIndice', '  PRINT size, firstIndex, lastIndex'), tr('FIM', 'END')],
  },
  {
    id: 'access', title: tr('Acesso e alteração', 'Access and update'), menuLabel: tr('Acesso e alteração', 'Access and update'), group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Acesse uma posição diretamente e substitua o valor armazenado nela.', 'Access a position directly and replace the value stored in it.'),
    interaction: tr('Informe um índice e um novo valor. Você também pode clicar em uma célula.', 'Enter an index and a new value. You can also click a cell.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O endereço da posição é calculado diretamente.', 'The address of the position is computed directly.') },
    pseudocode: [tr('FUNÇÃO alterar(vetor, indice, novoValor)', 'FUNCTION update(array, index, newValue)'), tr('  SE indice < 0 OU indice ≥ vetor.length ENTÃO', '  IF index < 0 OR index ≥ array.length THEN'), tr('    ESCREVA "Índice inválido"', '    PRINT "Invalid index"'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  valorAnterior ← vetor[indice]', '  previousValue ← array[index]'), tr('  vetor[indice] ← novoValor', '  array[index] ← newValue'), tr('  ESCREVA valorAnterior, vetor[indice]', '  PRINT previousValue, array[index]'), tr('FIM', 'END')],
  },
  {
    id: 'traversal', title: tr('Percorrendo e exibindo', 'Traversing and displaying'), menuLabel: tr('Percorrer vetor', 'Traverse array'), group: tr('Fundamentos', 'Fundamentals'), number: '03',
    description: tr('Percorra o vetor do índice zero até o último índice e exiba cada elemento.', 'Walk the array from index zero to the last index and display each element.'),
    interaction: tr('Pause e avance manualmente para acompanhar o movimento da variável i.', 'Pause and step manually to follow the movement of the variable i.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Todos os n elementos são visitados uma vez.', 'All n elements are visited once.') },
    pseudocode: [tr('FUNÇÃO exibir(vetor)', 'FUNCTION display(array)'), tr('  PARA i de 0 até vetor.length - 1 FAÇA', '  FOR i from 0 to array.length - 1 DO'), tr('    ESCREVA "vetor[", i, "] = ", vetor[i]', '    PRINT "array[", i, "] = ", array[i]'), tr('  FIM PARA', '  END FOR'), tr('FIM', 'END')],
  },
  {
    id: 'sum', title: tr('Somatório', 'Sum'), menuLabel: tr('Somatório', 'Sum'), group: tr('Cálculos', 'Calculations'), number: '04',
    description: tr('Use um acumulador para somar todos os elementos do vetor.', 'Use an accumulator to add up all the elements of the array.'),
    interaction: tr('Observe a soma antes e depois de cada elemento ser processado.', 'Watch the sum before and after each element is processed.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('O vetor inteiro é percorrido uma vez.', 'The whole array is traversed once.') },
    pseudocode: [tr('FUNÇÃO somatorio(vetor)', 'FUNCTION sum(array)'), tr('  soma ← 0', '  sum ← 0'), tr('  PARA i de 0 até vetor.length - 1 FAÇA', '  FOR i from 0 to array.length - 1 DO'), tr('    soma ← soma + vetor[i]', '    sum ← sum + array[i]'), tr('  FIM PARA', '  END FOR'), tr('  RETORNE soma', '  RETURN sum'), tr('FIM', 'END')],
  },
  {
    id: 'average', title: tr('Média aritmética', 'Arithmetic mean'), menuLabel: tr('Média', 'Mean'), group: tr('Cálculos', 'Calculations'), number: '05',
    description: tr('Some os elementos e divida o resultado pela quantidade de posições.', 'Add the elements and divide the result by the number of positions.'),
    interaction: tr('Acompanhe o acumulador e a divisão realizada somente ao final.', 'Follow the accumulator and the division done only at the end.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('A soma percorre todos os elementos.', 'The sum traverses all the elements.') },
    pseudocode: [tr('FUNÇÃO calcularMedia(vetor)', 'FUNCTION calculateMean(array)'), tr('  soma ← 0', '  sum ← 0'), tr('  PARA i de 0 até vetor.length - 1 FAÇA', '  FOR i from 0 to array.length - 1 DO'), tr('    soma ← soma + vetor[i]', '    sum ← sum + array[i]'), tr('  FIM PARA', '  END FOR'), tr('  media ← soma / vetor.length', '  average ← sum / array.length'), tr('  RETORNE media', '  RETURN average'), tr('FIM', 'END')],
  },
  {
    id: 'maximum', title: tr('Encontrar o maior', 'Find the largest'), menuLabel: tr('Maior elemento', 'Largest element'), group: tr('Cálculos', 'Calculations'), number: '06',
    description: tr('Compare cada posição com o maior valor conhecido até o momento.', 'Compare each position with the largest value known so far.'),
    interaction: tr('Veja quando o candidato atual é mantido ou substituído.', 'See when the current candidate is kept or replaced.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('É necessário verificar todos os elementos.', 'Every element must be checked.') },
    pseudocode: [tr('FUNÇÃO encontrarMaior(vetor)', 'FUNCTION findLargest(array)'), tr('  maior ← vetor[0]', '  largest ← array[0]'), tr('  indiceMaior ← 0', '  largestIndex ← 0'), tr('  PARA i de 1 até vetor.length - 1 FAÇA', '  FOR i from 1 to array.length - 1 DO'), tr('    SE vetor[i] > maior ENTÃO', '    IF array[i] > largest THEN'), tr('      maior ← vetor[i]', '      largest ← array[i]'), tr('      indiceMaior ← i', '      largestIndex ← i'), tr('    FIM SE', '    END IF'), tr('  FIM PARA', '  END FOR'), tr('  RETORNE maior, indiceMaior', '  RETURN largest, largestIndex'), tr('FIM', 'END')],
  },
  {
    id: 'minimum', title: tr('Encontrar o menor', 'Find the smallest'), menuLabel: tr('Menor elemento', 'Smallest element'), group: tr('Cálculos', 'Calculations'), number: '07',
    description: tr('Compare cada posição com o menor valor conhecido até o momento.', 'Compare each position with the smallest value known so far.'),
    interaction: tr('Veja quando o candidato atual é mantido ou substituído.', 'See when the current candidate is kept or replaced.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('É necessário verificar todos os elementos.', 'Every element must be checked.') },
    pseudocode: [tr('FUNÇÃO encontrarMenor(vetor)', 'FUNCTION findSmallest(array)'), tr('  menor ← vetor[0]', '  smallest ← array[0]'), tr('  indiceMenor ← 0', '  smallestIndex ← 0'), tr('  PARA i de 1 até vetor.length - 1 FAÇA', '  FOR i from 1 to array.length - 1 DO'), tr('    SE vetor[i] < menor ENTÃO', '    IF array[i] < smallest THEN'), tr('      menor ← vetor[i]', '      smallest ← array[i]'), tr('      indiceMenor ← i', '      smallestIndex ← i'), tr('    FIM SE', '    END IF'), tr('  FIM PARA', '  END FOR'), tr('  RETORNE menor, indiceMenor', '  RETURN smallest, smallestIndex'), tr('FIM', 'END')],
  },
  {
    id: 'search', title: tr('Busca sequencial', 'Sequential search'), menuLabel: tr('Busca sequencial', 'Sequential search'), group: tr('Busca e ordenação', 'Search and sorting'), number: '08',
    description: tr('Compare o valor buscado com cada elemento, da esquerda para a direita.', 'Compare the searched value with each element, from left to right.'),
    interaction: tr('Escolha o valor a buscar e teste casos existentes e inexistentes.', 'Choose the value to search for and try existing and missing values.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso, todas as posições são comparadas.', 'In the worst case, every position is compared.') },
    pseudocode: [tr('FUNÇÃO buscaSequencial(vetor, valorBuscado)', 'FUNCTION sequentialSearch(array, searchValue)'), tr('  PARA i de 0 até vetor.length - 1 FAÇA', '  FOR i from 0 to array.length - 1 DO'), tr('    SE vetor[i] = valorBuscado ENTÃO', '    IF array[i] = searchValue THEN'), tr('      RETORNE i', '      RETURN i'), tr('    FIM SE', '    END IF'), tr('  FIM PARA', '  END FOR'), tr('  RETORNE -1', '  RETURN -1'), tr('FIM', 'END')],
  },
  {
    id: 'sort', title: tr('Ordenação simples', 'Simple sorting'), menuLabel: tr('Ordenação simples', 'Simple sorting'), group: tr('Busca e ordenação', 'Search and sorting'), number: '09',
    description: tr('Compare pares vizinhos e troque-os quando estiverem fora de ordem.', 'Compare neighboring pairs and swap them when they are out of order.'),
    interaction: tr('Acompanhe comparações, trocas e a região já ordenada do vetor.', 'Follow the comparisons, the swaps and the already sorted region of the array.'),
    complexity: { time: 'O(n²)', space: 'O(1)', note: tr('As comparações são feitas em dois laços aninhados.', 'The comparisons are made in two nested loops.') },
    pseudocode: [tr('FUNÇÃO ordenacaoSimples(vetor)', 'FUNCTION simpleSort(array)'), tr('  n ← vetor.length', '  n ← array.length'), tr('  PARA i de 0 até n - 2 FAÇA', '  FOR i from 0 to n - 2 DO'), tr('    PARA j de 1 até n - i - 1 FAÇA', '    FOR j from 1 to n - i - 1 DO'), tr('      SE vetor[j - 1] > vetor[j] ENTÃO', '      IF array[j - 1] > array[j] THEN'), tr('        aux ← vetor[j - 1]', '        temp ← array[j - 1]'), tr('        vetor[j - 1] ← vetor[j]', '        array[j - 1] ← array[j]'), tr('        vetor[j] ← aux', '        array[j] ← temp'), tr('      FIM SE', '      END IF'), tr('    FIM PARA', '    END FOR'), tr('  FIM PARA', '  END FOR'), tr('FIM', 'END')],
  },
];

const clone = (values) => [...values];
const fmt = (value) => Number.isInteger(value) ? String(value) : value.toLocaleString(locale, { maximumFractionDigits: 2 });
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);
const step = (values, line, title, description, tone = 'neutral', extra = {}) => ({ values: clone(values), line, title, description, tone, variables: {}, output: [], ...extra });

function indicesSteps(values) {
  const last = values.length - 1;
  return [
    step(values, 0, tr('Vetor recebido', 'Array received'), tr('O algoritmo recebe o vetor e pode consultar suas propriedades.', 'The algorithm receives the array and can query its properties.')),
    step(values, 1, tr('Obtendo o tamanho', 'Getting the size'), tr(`vetor.length retorna ${values.length}.`, `array.length returns ${values.length}.`), 'reading', { variables: { tamanho: values.length } }),
    step(values, 2, tr('Primeiro índice', 'First index'), tr('Vetores começam no índice zero.', 'Arrays start at index zero.'), 'reading', { activeIndices: [0], variables: { tamanho: values.length, primeiroIndice: 0 } }),
    step(values, 3, tr('Último índice', 'Last index'), tr(`O último índice é tamanho - 1: ${values.length} - 1 = ${last}.`, `The last index is size - 1: ${values.length} - 1 = ${last}.`), 'reading', { activeIndices: [last], variables: { tamanho: values.length, primeiroIndice: 0, ultimoIndice: last } }),
    step(values, 4, tr('Análise concluída', 'Analysis finished'), tr(`O vetor possui ${values.length} posições, numeradas de 0 a ${last}.`, `The array has ${values.length} positions, numbered from 0 to ${last}.`), 'done', { processedIndices: range(values.length), variables: { tamanho: values.length, primeiroIndice: 0, ultimoIndice: last }, output: [tr(`Tamanho: ${values.length}`, `Size: ${values.length}`), tr('Primeiro índice: 0', 'First index: 0'), tr(`Último índice: ${last}`, `Last index: ${last}`)] }),
  ];
}

function accessSteps(values, config) {
  const { index, newValue } = config;
  const steps = [step(values, 0, tr('Preparando o acesso', 'Preparing the access'), tr(`Tentaremos acessar o índice ${index}.`, `We will try to access index ${index}.`))];
  const invalid = index < 0 || index >= values.length || !Number.isInteger(index);
  steps.push(step(values, 1, tr('Validando o índice', 'Validating the index'), invalid ? tr(`O índice ${index} está fora do intervalo válido.`, `Index ${index} is outside the valid range.`) : tr(`O índice ${index} está entre 0 e ${values.length - 1}.`, `Index ${index} is between 0 and ${values.length - 1}.`), invalid ? 'warning' : 'comparison', { activeIndices: invalid ? [] : [index], variables: { indice: index, tamanho: values.length, valido: !invalid } }));
  if (invalid) {
    steps.push(step(values, 2, tr('Índice inválido', 'Invalid index'), tr('Nenhuma posição foi alterada.', 'No position was changed.'), 'warning', { variables: { indice: index, valido: false }, output: [tr('Índice inválido.', 'Invalid index.')] }));
    steps.push(step(values, 3, tr('Operação encerrada', 'Operation ended'), tr('O algoritmo retorna sem modificar o vetor.', 'The algorithm returns without modifying the array.'), 'done', { variables: { indice: index, valido: false }, output: [tr('Índice inválido.', 'Invalid index.')] }));
    return steps;
  }
  const oldValue = values[index];
  steps.push(step(values, 5, tr('Lendo o valor atual', 'Reading the current value'), tr(`vetor[${index}] contém ${fmt(oldValue)}.`, `array[${index}] holds ${fmt(oldValue)}.`), 'reading', { activeIndices: [index], variables: { indice: index, valorAnterior: oldValue, novoValor: newValue } }));
  const changed = clone(values); changed[index] = newValue;
  steps.push(step(changed, 6, tr('Alterando a posição', 'Updating the position'), tr(`O valor ${fmt(oldValue)} foi substituído por ${fmt(newValue)}.`, `The value ${fmt(oldValue)} was replaced by ${fmt(newValue)}.`), 'update', { activeIndices: [index], changedIndices: [index], variables: { indice: index, valorAnterior: oldValue, novoValor: newValue } }));
  steps.push(step(changed, 7, tr('Alteração concluída', 'Update finished'), tr(`Agora vetor[${index}] = ${fmt(newValue)}.`, `Now array[${index}] = ${fmt(newValue)}.`), 'done', { changedIndices: [index], variables: { indice: index, valorAnterior: oldValue, valorAtual: newValue }, output: [tr(`Índice ${index}: ${fmt(oldValue)} → ${fmt(newValue)}`, `Index ${index}: ${fmt(oldValue)} → ${fmt(newValue)}`)] }));
  return steps;
}

function traversalSteps(values) {
  const steps = [step(values, 0, tr('Início do percurso', 'Start of the traversal'), tr('A variável i começará no índice zero.', 'The variable i will start at index zero.'))];
  const output = [];
  values.forEach((value, i) => {
    steps.push(step(values, 1, tr(`Verificando i = ${i}`, `Checking i = ${i}`), tr(`${i} ainda está no intervalo de 0 a ${values.length - 1}.`, `${i} is still within the range 0 to ${values.length - 1}.`), 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { i, tamanho: values.length }, output: clone(output) }));
    output.push(tr(`vetor[${i}] = ${fmt(value)}`, `array[${i}] = ${fmt(value)}`));
    steps.push(step(values, 2, tr(`Exibindo vetor[${i}]`, `Displaying array[${i}]`), tr(`O valor armazenado no índice ${i} é ${fmt(value)}.`, `The value stored at index ${i} is ${fmt(value)}.`), 'reading', { activeIndices: [i], processedIndices: range(i + 1), variables: { i, valor: value }, output: clone(output) }));
  });
  steps.push(step(values, 3, tr('Fim do laço', 'End of the loop'), tr(`i chegou a ${values.length}; não existem mais posições.`, `i reached ${values.length}; there are no more positions.`), 'done', { processedIndices: range(values.length), variables: { i: values.length, tamanho: values.length }, output }));
  return steps;
}

function sumSteps(values, includeAverage = false) {
  const steps = [step(values, 0, includeAverage ? tr('Iniciando a média', 'Starting the mean') : tr('Iniciando o somatório', 'Starting the sum'), tr('Primeiro, criamos o acumulador soma.', 'First, we create the accumulator sum.'))];
  let sum = 0;
  steps.push(step(values, 1, tr('Inicializando o acumulador', 'Initializing the accumulator'), tr('soma recebe zero antes do percurso.', 'sum receives zero before the traversal.'), 'update', { variables: { soma: 0 } }));
  values.forEach((value, i) => {
    steps.push(step(values, 2, tr(`Visitando o índice ${i}`, `Visiting index ${i}`), tr(`O próximo valor a acumular é ${fmt(value)}.`, `The next value to accumulate is ${fmt(value)}.`), 'reading', { activeIndices: [i], processedIndices: range(i), variables: { i, soma: sum, valorAtual: value } }));
    const before = sum; sum += value;
    steps.push(step(values, 3, tr('Atualizando a soma', 'Updating the sum'), `${fmt(before)} + ${fmt(value)} = ${fmt(sum)}.`, 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { i, somaAnterior: before, valorAtual: value, soma: sum }, output: [tr(`Soma parcial: ${fmt(sum)}`, `Partial sum: ${fmt(sum)}`)] }));
  });
  if (includeAverage) {
    const average = sum / values.length;
    steps.push(step(values, 5, tr('Calculando a média', 'Calculating the mean'), tr(`${fmt(sum)} ÷ ${values.length} = ${fmt(average)}.`, `${fmt(sum)} ÷ ${values.length} = ${fmt(average)}.`), 'success', { processedIndices: range(values.length), variables: { soma: fmt(sum), tamanho: values.length, media: fmt(average) }, output: [tr(`Média: ${fmt(average)}`, `Mean: ${fmt(average)}`)] }));
    steps.push(step(values, 6, tr('Média concluída', 'Mean finished'), tr('A média foi calculada usando todos os elementos.', 'The mean was calculated using all the elements.'), 'done', { processedIndices: range(values.length), variables: { soma: fmt(sum), tamanho: values.length, media: fmt(average) }, output: [tr(`Média: ${fmt(average)}`, `Mean: ${fmt(average)}`)] }));
  } else {
    steps.push(step(values, 5, tr('Somatório concluído', 'Sum finished'), tr(`A soma total é ${fmt(sum)}.`, `The total sum is ${fmt(sum)}.`), 'done', { processedIndices: range(values.length), variables: { soma: fmt(sum) }, output: [tr(`Somatório: ${fmt(sum)}`, `Sum: ${fmt(sum)}`)] }));
  }
  return steps;
}

function extremeSteps(values, mode) {
  const isMax = mode === 'max';
  const label = isMax ? tr('maior', 'largest') : tr('menor', 'smallest');
  const indexLabel = isMax ? tr('indiceMaior', 'largestIndex') : tr('indiceMenor', 'smallestIndex');
  const comparisonSymbol = isMax ? '>' : '<';
  let candidate = values[0];
  let candidateIndex = 0;

  const steps = [
    step(values, 0, tr(`Procurando o ${label}`, `Looking for the ${label}`), tr('O algoritmo recebe o vetor e prepara o candidato inicial.', 'The algorithm receives the array and prepares the initial candidate.')),
    step(values, 1, tr(`Inicializando ${label}`, `Initializing ${label}`), tr(`O primeiro valor, ${fmt(candidate)}, torna-se o ${label} candidato.`, `The first value, ${fmt(candidate)}, becomes the candidate ${label}.`), 'update', {
      activeIndices: [0],
      foundIndices: [0],
      variables: { [label]: candidate },
    }),
    step(values, 2, tr(`Inicializando ${indexLabel}`, `Initializing ${indexLabel}`), tr(`A posição do candidato inicial é o índice 0.`, `The position of the initial candidate is index 0.`), 'update', {
      activeIndices: [0],
      foundIndices: [0],
      variables: { [label]: candidate, [indexLabel]: candidateIndex },
    }),
  ];

  for (let i = 1; i < values.length; i += 1) {
    steps.push(step(values, 3, tr(`Iniciando a iteração i = ${i}`, `Starting the iteration i = ${i}`), tr(`O laço PARA seleciona o índice ${i} para a próxima comparação.`, `The FOR loop selects index ${i} for the next comparison.`), 'reading', {
      activeIndices: [i],
      processedIndices: range(i),
      foundIndices: [candidateIndex],
      variables: { i, [label]: candidate, [indexLabel]: candidateIndex },
    }));

    const previousCandidate = candidate;
    const previousCandidateIndex = candidateIndex;
    const compare = isMax ? values[i] > candidate : values[i] < candidate;

    steps.push(step(values, 4, tr(`Testando a condição no índice ${i}`, `Testing the condition at index ${i}`), tr(`${fmt(values[i])} ${comparisonSymbol} ${fmt(candidate)} é ${compare ? 'verdadeiro' : 'falso'}.`, `${fmt(values[i])} ${comparisonSymbol} ${fmt(candidate)} is ${compare ? 'true' : 'false'}.`), 'comparison', {
      activeIndices: [i],
      comparedIndices: previousCandidateIndex === i ? [i] : [previousCandidateIndex, i],
      processedIndices: range(i),
      foundIndices: [previousCandidateIndex],
      variables: {
        i,
        valorAtual: values[i],
        [label]: previousCandidate,
        [indexLabel]: previousCandidateIndex,
        condicao: compare,
      },
    }));

    if (compare) {
      candidate = values[i];
      steps.push(step(values, 5, tr(`Atualizando ${label}`, `Updating ${label}`), tr(`${label} recebe o valor ${fmt(candidate)} encontrado no índice ${i}.`, `${label} receives the value ${fmt(candidate)} found at index ${i}.`), 'update', {
        activeIndices: [i],
        changedIndices: [i],
        processedIndices: range(i),
        foundIndices: [i],
        variables: {
          i,
          valorAnterior: previousCandidate,
          [label]: candidate,
          [indexLabel]: previousCandidateIndex,
        },
      }));

      candidateIndex = i;
      steps.push(step(values, 6, tr(`Atualizando ${indexLabel}`, `Updating ${indexLabel}`), tr(`${indexLabel} recebe ${candidateIndex}.`, `${indexLabel} receives ${candidateIndex}.`), 'update', {
        activeIndices: [candidateIndex],
        changedIndices: [candidateIndex],
        processedIndices: range(i),
        foundIndices: [candidateIndex],
        variables: { i, [label]: candidate, [indexLabel]: candidateIndex },
      }));
    }

    steps.push(step(values, 7, compare ? tr('Encerrando a condição', 'Ending the condition') : tr('Mantendo o candidato atual', 'Keeping the current candidate'), compare
      ? tr(`As atualizações do novo ${label} foram concluídas.`, `The updates of the new ${label} are done.`)
      : tr(`${fmt(values[i])} não substitui ${fmt(candidate)}; nenhuma atribuição é executada.`, `${fmt(values[i])} does not replace ${fmt(candidate)}; no assignment is executed.`), compare ? 'reading' : 'neutral', {
      activeIndices: [i],
      processedIndices: range(i + 1),
      foundIndices: [candidateIndex],
      variables: { i, [label]: candidate, [indexLabel]: candidateIndex, condicao: compare },
    }));

    steps.push(step(values, i < values.length - 1 ? 3 : 8, tr(`Fim da iteração i = ${i}`, `End of iteration i = ${i}`), i < values.length - 1
      ? tr(`O laço retorna ao PARA e incrementa i para ${i + 1}.`, `The loop goes back to the FOR and increments i to ${i + 1}.`)
      : tr('O último elemento foi processado; o laço será encerrado.', 'The last element was processed; the loop will end.'), 'reading', {
      processedIndices: range(i + 1),
      foundIndices: [candidateIndex],
      variables: { i, [label]: candidate, [indexLabel]: candidateIndex },
    }));
  }

  steps.push(step(values, 3, tr('Condição do PARA encerrada', 'FOR condition finished'), tr(`i chegou a ${values.length}; não existem mais elementos para comparar.`, `i reached ${values.length}; there are no more elements to compare.`), 'reading', {
    processedIndices: range(values.length),
    foundIndices: [candidateIndex],
    variables: { i: values.length, [label]: candidate, [indexLabel]: candidateIndex },
  }));

  steps.push(step(values, 9, tr(`Retornando o ${label}`, `Returning the ${label}`), tr(`O ${label} valor é ${fmt(candidate)}, localizado no índice ${candidateIndex}.`, `The ${label} value is ${fmt(candidate)}, located at index ${candidateIndex}.`), 'success', {
    foundIndices: [candidateIndex],
    processedIndices: range(values.length),
    variables: { [label]: candidate, [indexLabel]: candidateIndex },
    output: [`${isMax ? tr('Maior', 'Largest') : tr('Menor', 'Smallest')}: ${fmt(candidate)}`, tr(`Índice: ${candidateIndex}`, `Index: ${candidateIndex}`)],
  }));

  steps.push(step(values, 10, tr('Algoritmo concluído', 'Algorithm finished'), tr(`A busca pelo ${label} elemento terminou.`, `The search for the ${label} element is over.`), 'done', {
    foundIndices: [candidateIndex],
    processedIndices: range(values.length),
    variables: { [label]: candidate, [indexLabel]: candidateIndex },
    output: [`${isMax ? tr('Maior', 'Largest') : tr('Menor', 'Smallest')}: ${fmt(candidate)}`, tr(`Índice: ${candidateIndex}`, `Index: ${candidateIndex}`)],
  }));

  return steps;
}

function searchSteps(values, target) {
  const steps = [step(values, 0, tr('Iniciando a busca', 'Starting the search'), tr(`Procuraremos o valor ${fmt(target)} da esquerda para a direita.`, `We will look for the value ${fmt(target)} from left to right.`))];
  for (let i = 0; i < values.length; i += 1) {
    steps.push(step(values, 1, tr(`Verificando o índice ${i}`, `Checking index ${i}`), tr(`A busca ainda não terminou e i = ${i}.`, `The search is not over yet and i = ${i}.`), 'reading', { activeIndices: [i], processedIndices: range(i), variables: { i, valorBuscado: target } }));
    const found = values[i] === target;
    steps.push(step(values, 2, tr('Comparando os valores', 'Comparing the values'), tr(`${fmt(values[i])} = ${fmt(target)} é ${found ? 'verdadeiro' : 'falso'}.`, `${fmt(values[i])} = ${fmt(target)} is ${found ? 'true' : 'false'}.`), 'comparison', { activeIndices: [i], comparedIndices: [i], processedIndices: range(i), foundIndices: found ? [i] : [], variables: { i, valorAtual: values[i], valorBuscado: target, iguais: found } }));
    if (found) {
      steps.push(step(values, 3, tr('Valor encontrado', 'Value found'), tr(`A primeira ocorrência de ${fmt(target)} está no índice ${i}.`, `The first occurrence of ${fmt(target)} is at index ${i}.`), 'success', { activeIndices: [i], foundIndices: [i], processedIndices: range(i + 1), variables: { i, valorBuscado: target, retorno: i }, output: [tr(`Encontrado no índice ${i}.`, `Found at index ${i}.`)] }));
      return steps;
    }
  }
  steps.push(step(values, 6, tr('Valor não encontrado', 'Value not found'), tr(`O valor ${fmt(target)} não aparece no vetor.`, `The value ${fmt(target)} does not appear in the array.`), 'warning', { processedIndices: range(values.length), variables: { valorBuscado: target, retorno: -1 }, output: [tr('Resultado: -1 (não encontrado)', 'Result: -1 (not found)')] }));
  return steps;
}

function sortSteps(values) {
  const current = clone(values);
  const steps = [step(current, 0, tr('Iniciando a ordenação', 'Starting the sort'), tr('O algoritmo fará passadas comparando pares vizinhos.', 'The algorithm will make passes comparing neighboring pairs.'))];
  steps.push(step(current, 1, tr('Obtendo o tamanho', 'Getting the size'), tr(`n recebe ${current.length}.`, `n receives ${current.length}.`), 'reading', { variables: { n: current.length } }));
  let swappedAtLeastOnce = false;
  for (let i = 0; i < current.length - 1; i += 1) {
    let swappedThisPass = false;
    steps.push(step(current, 2, tr(`Iniciando a passada ${i + 1}`, `Starting pass ${i + 1}`), tr(`Nesta passada, compararemos até o índice ${current.length - i - 1}.`, `In this pass, we will compare up to index ${current.length - i - 1}.`), 'reading', { sortedIndices: range(current.length, current.length - i), variables: { i, passada: i + 1 } }));
    for (let j = 1; j < current.length - i; j += 1) {
      const left = j - 1;
      const shouldSwap = current[left] > current[j];
      steps.push(step(current, 4, tr(`Comparando índices ${left} e ${j}`, `Comparing indices ${left} and ${j}`), tr(`${fmt(current[left])} > ${fmt(current[j])} é ${shouldSwap ? 'verdadeiro' : 'falso'}.`, `${fmt(current[left])} > ${fmt(current[j])} is ${shouldSwap ? 'true' : 'false'}.`), 'comparison', { activeIndices: [left, j], comparedIndices: [left, j], sortedIndices: range(current.length, current.length - i), variables: { i, j, esquerda: current[left], direita: current[j], trocar: shouldSwap } }));
      if (shouldSwap) {
        const beforeLeft = current[left]; const beforeRight = current[j];
        steps.push(step(current, 5, tr('Guardando o valor auxiliar', 'Saving the temporary value'), tr(`aux recebe ${fmt(beforeLeft)}.`, `temp receives ${fmt(beforeLeft)}.`), 'update', { activeIndices: [left, j], comparedIndices: [left, j], variables: { i, j, aux: beforeLeft } }));
        current[left] = beforeRight;
        steps.push(step(current, 6, tr('Movendo o valor menor', 'Moving the smaller value'), tr(`${fmt(beforeRight)} vai para o índice ${left}.`, `${fmt(beforeRight)} goes to index ${left}.`), 'update', { activeIndices: [left, j], changedIndices: [left], variables: { i, j, aux: beforeLeft } }));
        current[j] = beforeLeft;
        steps.push(step(current, 7, tr('Finalizando a troca', 'Finishing the swap'), tr(`${fmt(beforeLeft)} vai para o índice ${j}.`, `${fmt(beforeLeft)} goes to index ${j}.`), 'update', { activeIndices: [left, j], changedIndices: [left, j], variables: { i, j, aux: beforeLeft } }));
        swappedThisPass = true; swappedAtLeastOnce = true;
      }
    }
    const sortedStart = current.length - i - 1;
    steps.push(step(current, 9, tr(`Passada ${i + 1} concluída`, `Pass ${i + 1} finished`), tr(`O índice ${sortedStart} já contém seu valor definitivo.`, `Index ${sortedStart} already holds its final value.`), 'success', { sortedIndices: range(current.length, sortedStart), variables: { i, houveTroca: swappedThisPass } }));
    if (!swappedThisPass) {
      steps.push(step(current, 10, tr('Vetor já ordenado', 'Array already sorted'), tr('Nenhuma troca ocorreu nesta passada; podemos encerrar antecipadamente.', 'No swap happened in this pass; we can stop early.'), 'success', { sortedIndices: range(current.length), variables: { i, houveTroca: false } }));
      break;
    }
  }
  steps.push(step(current, 11, tr('Ordenação concluída', 'Sort finished'), swappedAtLeastOnce ? tr('Todos os valores estão em ordem crescente.', 'All the values are in ascending order.') : tr('O vetor já estava em ordem crescente.', 'The array was already in ascending order.'), 'done', { sortedIndices: range(current.length), output: [tr(`Vetor ordenado: [${current.map(fmt).join(', ')}]`, `Sorted array: [${current.map(fmt).join(', ')}]`)] }));
  return steps;
}

export function buildSteps(id, values, config) {
  switch (id) {
    case 'indices': return indicesSteps(values);
    case 'access': return accessSteps(values, config);
    case 'traversal': return traversalSteps(values);
    case 'sum': return sumSteps(values);
    case 'average': return sumSteps(values, true);
    case 'maximum': return extremeSteps(values, 'max');
    case 'minimum': return extremeSteps(values, 'min');
    case 'search': return searchSteps(values, config.target);
    case 'sort': return sortSteps(values);
    default: return indicesSteps(values);
  }
}
