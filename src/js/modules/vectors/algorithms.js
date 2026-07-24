export const algorithms = [
  {
    id: 'indices', title: 'Tamanho e índices', menuLabel: 'Tamanho e índices', group: 'Fundamentos', number: '01',
    description: 'Observe como o tamanho, o primeiro índice e o último índice são obtidos.',
    interaction: 'Clique em qualquer posição do vetor para inspecionar seu índice e valor.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'A propriedade length é acessada diretamente.' },
    pseudocode: ['FUNÇÃO analisarIndices(vetor)', '  tamanho ← vetor.length', '  primeiroIndice ← 0', '  ultimoIndice ← tamanho - 1', '  ESCREVA tamanho, primeiroIndice, ultimoIndice', 'FIM'],
  },
  {
    id: 'access', title: 'Acesso e alteração', menuLabel: 'Acesso e alteração', group: 'Fundamentos', number: '02',
    description: 'Acesse uma posição diretamente e substitua o valor armazenado nela.',
    interaction: 'Informe um índice e um novo valor. Você também pode clicar em uma célula.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O endereço da posição é calculado diretamente.' },
    pseudocode: ['FUNÇÃO alterar(vetor, indice, novoValor)', '  SE indice < 0 OU indice ≥ vetor.length ENTÃO', '    ESCREVA "Índice inválido"', '    RETORNE', '  FIM SE', '  valorAnterior ← vetor[indice]', '  vetor[indice] ← novoValor', '  ESCREVA valorAnterior, vetor[indice]', 'FIM'],
  },
  {
    id: 'traversal', title: 'Percorrendo e exibindo', menuLabel: 'Percorrer vetor', group: 'Fundamentos', number: '03',
    description: 'Percorra o vetor do índice zero até o último índice e exiba cada elemento.',
    interaction: 'Pause e avance manualmente para acompanhar o movimento da variável i.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Todos os n elementos são visitados uma vez.' },
    pseudocode: ['FUNÇÃO exibir(vetor)', '  PARA i de 0 até vetor.length - 1 FAÇA', '    ESCREVA "vetor[", i, "] = ", vetor[i]', '  FIM PARA', 'FIM'],
  },
  {
    id: 'sum', title: 'Somatório', menuLabel: 'Somatório', group: 'Cálculos', number: '04',
    description: 'Use um acumulador para somar todos os elementos do vetor.',
    interaction: 'Observe a soma antes e depois de cada elemento ser processado.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'O vetor inteiro é percorrido uma vez.' },
    pseudocode: ['FUNÇÃO somatorio(vetor)', '  soma ← 0', '  PARA i de 0 até vetor.length - 1 FAÇA', '    soma ← soma + vetor[i]', '  FIM PARA', '  RETORNE soma', 'FIM'],
  },
  {
    id: 'average', title: 'Média aritmética', menuLabel: 'Média', group: 'Cálculos', number: '05',
    description: 'Some os elementos e divida o resultado pela quantidade de posições.',
    interaction: 'Acompanhe o acumulador e a divisão realizada somente ao final.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'A soma percorre todos os elementos.' },
    pseudocode: ['FUNÇÃO calcularMedia(vetor)', '  soma ← 0', '  PARA i de 0 até vetor.length - 1 FAÇA', '    soma ← soma + vetor[i]', '  FIM PARA', '  media ← soma / vetor.length', '  RETORNE media', 'FIM'],
  },
  {
    id: 'maximum', title: 'Encontrar o maior', menuLabel: 'Maior elemento', group: 'Cálculos', number: '06',
    description: 'Compare cada posição com o maior valor conhecido até o momento.',
    interaction: 'Veja quando o candidato atual é mantido ou substituído.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'É necessário verificar todos os elementos.' },
    pseudocode: ['FUNÇÃO encontrarMaior(vetor)', '  maior ← vetor[0]', '  indiceMaior ← 0', '  PARA i de 1 até vetor.length - 1 FAÇA', '    SE vetor[i] > maior ENTÃO', '      maior ← vetor[i]', '      indiceMaior ← i', '    FIM SE', '  FIM PARA', '  RETORNE maior, indiceMaior', 'FIM'],
  },
  {
    id: 'minimum', title: 'Encontrar o menor', menuLabel: 'Menor elemento', group: 'Cálculos', number: '07',
    description: 'Compare cada posição com o menor valor conhecido até o momento.',
    interaction: 'Veja quando o candidato atual é mantido ou substituído.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'É necessário verificar todos os elementos.' },
    pseudocode: ['FUNÇÃO encontrarMenor(vetor)', '  menor ← vetor[0]', '  indiceMenor ← 0', '  PARA i de 1 até vetor.length - 1 FAÇA', '    SE vetor[i] < menor ENTÃO', '      menor ← vetor[i]', '      indiceMenor ← i', '    FIM SE', '  FIM PARA', '  RETORNE menor, indiceMenor', 'FIM'],
  },
  {
    id: 'search', title: 'Busca sequencial', menuLabel: 'Busca sequencial', group: 'Busca e ordenação', number: '08',
    description: 'Compare o valor buscado com cada elemento, da esquerda para a direita.',
    interaction: 'Escolha o valor a buscar e teste casos existentes e inexistentes.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, todas as posições são comparadas.' },
    pseudocode: ['FUNÇÃO buscaSequencial(vetor, valorBuscado)', '  PARA i de 0 até vetor.length - 1 FAÇA', '    SE vetor[i] = valorBuscado ENTÃO', '      RETORNE i', '    FIM SE', '  FIM PARA', '  RETORNE -1', 'FIM'],
  },
  {
    id: 'sort', title: 'Ordenação simples', menuLabel: 'Ordenação simples', group: 'Busca e ordenação', number: '09',
    description: 'Compare pares vizinhos e troque-os quando estiverem fora de ordem.',
    interaction: 'Acompanhe comparações, trocas e a região já ordenada do vetor.',
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'As comparações são feitas em dois laços aninhados.' },
    pseudocode: ['FUNÇÃO ordenacaoSimples(vetor)', '  n ← vetor.length', '  PARA i de 0 até n - 2 FAÇA', '    PARA j de 1 até n - i - 1 FAÇA', '      SE vetor[j - 1] > vetor[j] ENTÃO', '        aux ← vetor[j - 1]', '        vetor[j - 1] ← vetor[j]', '        vetor[j] ← aux', '      FIM SE', '    FIM PARA', '  FIM PARA', 'FIM'],
  },
];

const clone = (values) => [...values];
const fmt = (value) => Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);
const step = (values, line, title, description, tone = 'neutral', extra = {}) => ({ values: clone(values), line, title, description, tone, variables: {}, output: [], ...extra });

function indicesSteps(values) {
  const last = values.length - 1;
  return [
    step(values, 0, 'Vetor recebido', 'O algoritmo recebe o vetor e pode consultar suas propriedades.'),
    step(values, 1, 'Obtendo o tamanho', `vetor.length retorna ${values.length}.`, 'reading', { variables: { tamanho: values.length } }),
    step(values, 2, 'Primeiro índice', 'Vetores começam no índice zero.', 'reading', { activeIndices: [0], variables: { tamanho: values.length, primeiroIndice: 0 } }),
    step(values, 3, 'Último índice', `O último índice é tamanho - 1: ${values.length} - 1 = ${last}.`, 'reading', { activeIndices: [last], variables: { tamanho: values.length, primeiroIndice: 0, ultimoIndice: last } }),
    step(values, 4, 'Análise concluída', `O vetor possui ${values.length} posições, numeradas de 0 a ${last}.`, 'done', { processedIndices: range(values.length), variables: { tamanho: values.length, primeiroIndice: 0, ultimoIndice: last }, output: [`Tamanho: ${values.length}`, 'Primeiro índice: 0', `Último índice: ${last}`] }),
  ];
}

function accessSteps(values, config) {
  const { index, newValue } = config;
  const steps = [step(values, 0, 'Preparando o acesso', `Tentaremos acessar o índice ${index}.`)];
  const invalid = index < 0 || index >= values.length || !Number.isInteger(index);
  steps.push(step(values, 1, 'Validando o índice', invalid ? `O índice ${index} está fora do intervalo válido.` : `O índice ${index} está entre 0 e ${values.length - 1}.`, invalid ? 'warning' : 'comparison', { activeIndices: invalid ? [] : [index], variables: { indice: index, tamanho: values.length, valido: !invalid } }));
  if (invalid) {
    steps.push(step(values, 2, 'Índice inválido', 'Nenhuma posição foi alterada.', 'warning', { variables: { indice: index, valido: false }, output: ['Índice inválido.'] }));
    steps.push(step(values, 3, 'Operação encerrada', 'O algoritmo retorna sem modificar o vetor.', 'done', { variables: { indice: index, valido: false }, output: ['Índice inválido.'] }));
    return steps;
  }
  const oldValue = values[index];
  steps.push(step(values, 5, 'Lendo o valor atual', `vetor[${index}] contém ${fmt(oldValue)}.`, 'reading', { activeIndices: [index], variables: { indice: index, valorAnterior: oldValue, novoValor: newValue } }));
  const changed = clone(values); changed[index] = newValue;
  steps.push(step(changed, 6, 'Alterando a posição', `O valor ${fmt(oldValue)} foi substituído por ${fmt(newValue)}.`, 'update', { activeIndices: [index], changedIndices: [index], variables: { indice: index, valorAnterior: oldValue, novoValor: newValue } }));
  steps.push(step(changed, 7, 'Alteração concluída', `Agora vetor[${index}] = ${fmt(newValue)}.`, 'done', { changedIndices: [index], variables: { indice: index, valorAnterior: oldValue, valorAtual: newValue }, output: [`Índice ${index}: ${fmt(oldValue)} → ${fmt(newValue)}`] }));
  return steps;
}

function traversalSteps(values) {
  const steps = [step(values, 0, 'Início do percurso', 'A variável i começará no índice zero.')];
  const output = [];
  values.forEach((value, i) => {
    steps.push(step(values, 1, `Verificando i = ${i}`, `${i} ainda está no intervalo de 0 a ${values.length - 1}.`, 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { i, tamanho: values.length }, output: clone(output) }));
    output.push(`vetor[${i}] = ${fmt(value)}`);
    steps.push(step(values, 2, `Exibindo vetor[${i}]`, `O valor armazenado no índice ${i} é ${fmt(value)}.`, 'reading', { activeIndices: [i], processedIndices: range(i + 1), variables: { i, valor: value }, output: clone(output) }));
  });
  steps.push(step(values, 3, 'Fim do laço', `i chegou a ${values.length}; não existem mais posições.`, 'done', { processedIndices: range(values.length), variables: { i: values.length, tamanho: values.length }, output }));
  return steps;
}

function sumSteps(values, includeAverage = false) {
  const steps = [step(values, 0, includeAverage ? 'Iniciando a média' : 'Iniciando o somatório', 'Primeiro, criamos o acumulador soma.')];
  let sum = 0;
  steps.push(step(values, 1, 'Inicializando o acumulador', 'soma recebe zero antes do percurso.', 'update', { variables: { soma: 0 } }));
  values.forEach((value, i) => {
    steps.push(step(values, 2, `Visitando o índice ${i}`, `O próximo valor a acumular é ${fmt(value)}.`, 'reading', { activeIndices: [i], processedIndices: range(i), variables: { i, soma: sum, valorAtual: value } }));
    const before = sum; sum += value;
    steps.push(step(values, 3, 'Atualizando a soma', `${fmt(before)} + ${fmt(value)} = ${fmt(sum)}.`, 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { i, somaAnterior: before, valorAtual: value, soma: sum }, output: [`Soma parcial: ${fmt(sum)}`] }));
  });
  if (includeAverage) {
    const average = sum / values.length;
    steps.push(step(values, 5, 'Calculando a média', `${fmt(sum)} ÷ ${values.length} = ${fmt(average)}.`, 'success', { processedIndices: range(values.length), variables: { soma: fmt(sum), tamanho: values.length, media: fmt(average) }, output: [`Média: ${fmt(average)}`] }));
    steps.push(step(values, 6, 'Média concluída', 'A média foi calculada usando todos os elementos.', 'done', { processedIndices: range(values.length), variables: { soma: fmt(sum), tamanho: values.length, media: fmt(average) }, output: [`Média: ${fmt(average)}`] }));
  } else {
    steps.push(step(values, 5, 'Somatório concluído', `A soma total é ${fmt(sum)}.`, 'done', { processedIndices: range(values.length), variables: { soma: fmt(sum) }, output: [`Somatório: ${fmt(sum)}`] }));
  }
  return steps;
}

function extremeSteps(values, mode) {
  const isMax = mode === 'max';
  const label = isMax ? 'maior' : 'menor';
  const indexLabel = isMax ? 'indiceMaior' : 'indiceMenor';
  const comparisonSymbol = isMax ? '>' : '<';
  let candidate = values[0];
  let candidateIndex = 0;

  const steps = [
    step(values, 0, `Procurando o ${label}`, 'O algoritmo recebe o vetor e prepara o candidato inicial.'),
    step(values, 1, `Inicializando ${label}`, `O primeiro valor, ${fmt(candidate)}, torna-se o ${label} candidato.`, 'update', {
      activeIndices: [0],
      foundIndices: [0],
      variables: { [label]: candidate },
    }),
    step(values, 2, `Inicializando ${indexLabel}`, `A posição do candidato inicial é o índice 0.`, 'update', {
      activeIndices: [0],
      foundIndices: [0],
      variables: { [label]: candidate, [indexLabel]: candidateIndex },
    }),
  ];

  for (let i = 1; i < values.length; i += 1) {
    steps.push(step(values, 3, `Iniciando a iteração i = ${i}`, `O laço PARA seleciona o índice ${i} para a próxima comparação.`, 'reading', {
      activeIndices: [i],
      processedIndices: range(i),
      foundIndices: [candidateIndex],
      variables: { i, [label]: candidate, [indexLabel]: candidateIndex },
    }));

    const previousCandidate = candidate;
    const previousCandidateIndex = candidateIndex;
    const compare = isMax ? values[i] > candidate : values[i] < candidate;

    steps.push(step(values, 4, `Testando a condição no índice ${i}`, `${fmt(values[i])} ${comparisonSymbol} ${fmt(candidate)} é ${compare ? 'verdadeiro' : 'falso'}.`, 'comparison', {
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
      steps.push(step(values, 5, `Atualizando ${label}`, `${label} recebe o valor ${fmt(candidate)} encontrado no índice ${i}.`, 'update', {
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
      steps.push(step(values, 6, `Atualizando ${indexLabel}`, `${indexLabel} recebe ${candidateIndex}.`, 'update', {
        activeIndices: [candidateIndex],
        changedIndices: [candidateIndex],
        processedIndices: range(i),
        foundIndices: [candidateIndex],
        variables: { i, [label]: candidate, [indexLabel]: candidateIndex },
      }));
    }

    steps.push(step(values, 7, compare ? 'Encerrando a condição' : 'Mantendo o candidato atual', compare
      ? `As atualizações do novo ${label} foram concluídas.`
      : `${fmt(values[i])} não substitui ${fmt(candidate)}; nenhuma atribuição é executada.`, compare ? 'reading' : 'neutral', {
      activeIndices: [i],
      processedIndices: range(i + 1),
      foundIndices: [candidateIndex],
      variables: { i, [label]: candidate, [indexLabel]: candidateIndex, condicao: compare },
    }));

    steps.push(step(values, 8, `Fim da iteração i = ${i}`, i < values.length - 1
      ? `O laço retorna ao PARA e incrementa i para ${i + 1}.`
      : 'O último elemento foi processado; o laço será encerrado.', 'reading', {
      processedIndices: range(i + 1),
      foundIndices: [candidateIndex],
      variables: { i, [label]: candidate, [indexLabel]: candidateIndex },
    }));
  }

  steps.push(step(values, 3, 'Condição do PARA encerrada', `i chegou a ${values.length}; não existem mais elementos para comparar.`, 'reading', {
    processedIndices: range(values.length),
    foundIndices: [candidateIndex],
    variables: { i: values.length, [label]: candidate, [indexLabel]: candidateIndex },
  }));

  steps.push(step(values, 9, `Retornando o ${label}`, `O ${label} valor é ${fmt(candidate)}, localizado no índice ${candidateIndex}.`, 'success', {
    foundIndices: [candidateIndex],
    processedIndices: range(values.length),
    variables: { [label]: candidate, [indexLabel]: candidateIndex },
    output: [`${isMax ? 'Maior' : 'Menor'}: ${fmt(candidate)}`, `Índice: ${candidateIndex}`],
  }));

  steps.push(step(values, 10, 'Algoritmo concluído', `A busca pelo ${label} elemento terminou.`, 'done', {
    foundIndices: [candidateIndex],
    processedIndices: range(values.length),
    variables: { [label]: candidate, [indexLabel]: candidateIndex },
    output: [`${isMax ? 'Maior' : 'Menor'}: ${fmt(candidate)}`, `Índice: ${candidateIndex}`],
  }));

  return steps;
}

function searchSteps(values, target) {
  const steps = [step(values, 0, 'Iniciando a busca', `Procuraremos o valor ${fmt(target)} da esquerda para a direita.`)];
  for (let i = 0; i < values.length; i += 1) {
    steps.push(step(values, 1, `Verificando o índice ${i}`, `A busca ainda não terminou e i = ${i}.`, 'reading', { activeIndices: [i], processedIndices: range(i), variables: { i, valorBuscado: target } }));
    const found = values[i] === target;
    steps.push(step(values, 2, 'Comparando os valores', `${fmt(values[i])} = ${fmt(target)} é ${found ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeIndices: [i], comparedIndices: [i], processedIndices: range(i), foundIndices: found ? [i] : [], variables: { i, valorAtual: values[i], valorBuscado: target, iguais: found } }));
    if (found) {
      steps.push(step(values, 3, 'Valor encontrado', `A primeira ocorrência de ${fmt(target)} está no índice ${i}.`, 'success', { activeIndices: [i], foundIndices: [i], processedIndices: range(i + 1), variables: { i, valorBuscado: target, retorno: i }, output: [`Encontrado no índice ${i}.`] }));
      return steps;
    }
  }
  steps.push(step(values, 6, 'Valor não encontrado', `O valor ${fmt(target)} não aparece no vetor.`, 'warning', { processedIndices: range(values.length), variables: { valorBuscado: target, retorno: -1 }, output: ['Resultado: -1 (não encontrado)'] }));
  return steps;
}

function sortSteps(values) {
  const current = clone(values);
  const steps = [step(current, 0, 'Iniciando a ordenação', 'O algoritmo fará passadas comparando pares vizinhos.')];
  steps.push(step(current, 1, 'Obtendo o tamanho', `n recebe ${current.length}.`, 'reading', { variables: { n: current.length } }));
  let swappedAtLeastOnce = false;
  for (let i = 0; i < current.length - 1; i += 1) {
    let swappedThisPass = false;
    steps.push(step(current, 2, `Iniciando a passada ${i + 1}`, `Nesta passada, compararemos até o índice ${current.length - i - 1}.`, 'reading', { sortedIndices: range(current.length, current.length - i), variables: { i, passada: i + 1 } }));
    for (let j = 1; j < current.length - i; j += 1) {
      const left = j - 1;
      const shouldSwap = current[left] > current[j];
      steps.push(step(current, 4, `Comparando índices ${left} e ${j}`, `${fmt(current[left])} > ${fmt(current[j])} é ${shouldSwap ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeIndices: [left, j], comparedIndices: [left, j], sortedIndices: range(current.length, current.length - i), variables: { i, j, esquerda: current[left], direita: current[j], trocar: shouldSwap } }));
      if (shouldSwap) {
        const beforeLeft = current[left]; const beforeRight = current[j];
        steps.push(step(current, 5, 'Guardando o valor auxiliar', `aux recebe ${fmt(beforeLeft)}.`, 'update', { activeIndices: [left, j], comparedIndices: [left, j], variables: { i, j, aux: beforeLeft } }));
        current[left] = beforeRight;
        steps.push(step(current, 6, 'Movendo o valor menor', `${fmt(beforeRight)} vai para o índice ${left}.`, 'update', { activeIndices: [left, j], changedIndices: [left], variables: { i, j, aux: beforeLeft } }));
        current[j] = beforeLeft;
        steps.push(step(current, 7, 'Finalizando a troca', `${fmt(beforeLeft)} vai para o índice ${j}.`, 'update', { activeIndices: [left, j], changedIndices: [left, j], variables: { i, j, aux: beforeLeft } }));
        swappedThisPass = true; swappedAtLeastOnce = true;
      }
    }
    const sortedStart = current.length - i - 1;
    steps.push(step(current, 9, `Passada ${i + 1} concluída`, `O índice ${sortedStart} já contém seu valor definitivo.`, 'success', { sortedIndices: range(current.length, sortedStart), variables: { i, houveTroca: swappedThisPass } }));
    if (!swappedThisPass) {
      steps.push(step(current, 10, 'Vetor já ordenado', 'Nenhuma troca ocorreu nesta passada; podemos encerrar antecipadamente.', 'success', { sortedIndices: range(current.length), variables: { i, houveTroca: false } }));
      break;
    }
  }
  steps.push(step(current, 11, 'Ordenação concluída', swappedAtLeastOnce ? 'Todos os valores estão em ordem crescente.' : 'O vetor já estava em ordem crescente.', 'done', { sortedIndices: range(current.length), output: [`Vetor ordenado: [${current.map(fmt).join(', ')}]`] }));
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
