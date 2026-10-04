// Pseudocódigo da aula (slide 15), em base 0: o laço de isOrdenado vai até
// vetor.length - 2, porque o último par é (n-2, n-1).
const SHOTGUN_CODE = [
  'FUNÇÃO isOrdenado(vetor)',
  '  PARA i de 0 até vetor.length - 2 FAÇA',
  '    SE vetor[i] > vetor[i + 1] ENTÃO',
  '      RETORNE falso',
  '    FIM SE',
  '  FIM PARA',
  '  RETORNE verdadeiro',
  'FIM',
  '',
  'PROCEDIMENTO shotgunSort(vetor)',
  '  ENQUANTO isOrdenado(vetor) = falso FAÇA',
  '    embaralha(vetor)',
  '  FIM ENQUANTO',
  'FIM',
];

// Linhas do SHOTGUN_CODE (base 0). Cada passo da simulação destaca uma única linha.
const LINE = { loop: 1, test: 2, returnFalse: 3, returnTrue: 6, procedure: 9, whileLoop: 10, shuffle: 11, end: 13 };

/** Valor mostrado para uma variável que ainda não foi atribuída. */
const NONE = '—';

/** O simulador desiste depois de tantas tentativas: o algoritmo, em si, não tem limite. */
export const MAX_ATTEMPTS = 100;

export const algorithms = [
  {
    id: 'is-sorted', title: 'Verificando se está ordenado', menuLabel: 'isOrdenado()', group: 'Como funciona', number: '01',
    description: 'Compare cada elemento com o vizinho da direita. Ao achar um par fora de ordem, a função já sabe responder que o vetor não está ordenado.',
    interaction: 'Aplique vetores ordenados e desordenados e veja em qual par a verificação para.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso (vetor já ordenado) os n−1 pares são comparados; num vetor desordenado ela costuma parar bem antes.' },
    pseudocode: SHOTGUN_CODE.slice(0, 8),
  },
  {
    id: 'shotgun-sort', title: 'Shotgun Sort', menuLabel: 'Shotgun Sort', group: 'Como funciona', number: '02',
    description: 'Enquanto o vetor não estiver ordenado, embaralhe tudo e tente de novo. Não há estratégia nenhuma: só sorte. Também é conhecido como Bogosort.',
    interaction: 'Rode a mesma entrada algumas vezes com "Sortear outra execução" e compare quantas tentativas cada uma levou.',
    complexity: { time: 'O(n · n!)', space: 'O(1)', note: 'Caso médio: cerca de n! tentativas, cada uma com uma verificação O(n). O melhor caso (vetor já ordenado) é O(n); o pior caso não tem limite.' },
    pseudocode: SHOTGUN_CODE,
  },
  {
    id: 'why-worst', title: 'Por que é o pior algoritmo?', menuLabel: 'Por que é o pior?', group: 'Análise do algoritmo', number: '03',
    description: 'Conte quantas ordens possíveis existem, a chance de acertar a certa e como o custo explode quando n cresce.',
    interaction: 'Gere vetores de tamanhos diferentes e compare com o Selection Sort, que sempre faz n(n−1)/2 comparações.',
    complexity: { time: 'O(n · n!)', space: 'O(1)', note: 'n! cresce mais depressa que qualquer polinômio ou exponencial: 10! já passa de 3 milhões e 20! de 2 quintilhões.' },
    pseudocode: SHOTGUN_CODE,
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
const pad = (number) => String(number).padStart(2, '0');
const list = (values) => `[${values.map(fmt).join(', ')}]`;
const step = (values, line, title, description, tone = 'neutral', extra = {}) => ({ values: clone(values), line, title, description, tone, variables: {}, output: [], ...extra });

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

/** Quantas ordens diferentes o vetor pode assumir (n! dividido pelas repetições). */
export function arrangements(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  let total = factorial(values.length);
  counts.forEach((count) => { total /= factorial(count); });
  return total;
}

function shuffled(values, rng) {
  const copy = clone(values);
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rng() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

/** Primeiro par (i, i+1) fora de ordem, ou -1 se o vetor estiver ordenado. */
const firstUnordered = (values) => values.findIndex((value, index) => index < values.length - 1 && value > values[index + 1]);

const verified = (bad) => (bad <= 0 ? 0 : bad + 1);
const compareOf = (values, i, result) => ({
  left: { label: 'vetor[i]', value: fmt(values[i]) },
  op: '>',
  right: { label: 'vetor[i+1]', value: fmt(values[i + 1]) },
  result,
  alarm: true,
});

// ---------------------------------------------------------------------------
// 01 · isOrdenado
// Execução como num depurador: cada passo é a linha que acabou de executar e as
// variáveis valem o que valeriam naquele ponto (— = ainda sem valor).
// Linhas: 1 PARA i · 2 SE · 3 RETORNE falso · 6 RETORNE verdadeiro
// ---------------------------------------------------------------------------

/** Variáveis locais de uma chamada de isOrdenado: nascem sem valor. */
const newFrame = () => ({ i: NONE, 'vetor[i]': NONE, 'vetor[i+1]': NONE, retorno: NONE });

/** Aponta o quadro para o par (i, i+1); fora do vetor, o vizinho não existe. */
function pointFrame(frame, values, i) {
  frame.i = i;
  frame['vetor[i]'] = i < values.length ? values[i] : NONE;
  frame['vetor[i+1]'] = i + 1 < values.length ? values[i + 1] : NONE;
}

function isSortedSteps(values) {
  const n = values.length;
  const phase = { label: 'isOrdenado()', text: 'Procura um par fora de ordem', code: true };
  const frame = newFrame();
  const at = (extra) => ({ phase, variables: { ...frame }, ...extra });
  const steps = [
    step(values, 0, 'Chamando isOrdenado', 'A função compara cada elemento com o vizinho da direita. Se algum par estiver fora de ordem, o vetor não está ordenado. As variáveis locais ainda não têm valor.', 'neutral', at({})),
  ];

  for (let i = 0; i < n - 1; i += 1) {
    const bad = values[i] > values[i + 1];
    const pointers = { i, next: i + 1 };
    pointFrame(frame, values, i);
    steps.push(step(values, LINE.loop, `PARA i (i = ${i})`, `i recebe ${i} e a condição i ≤ ${n - 2} é verdadeira: o laço entra, e ainda há um vizinho à direita (posição ${i + 1}) para comparar.`, 'reading', at({
      sortedCount: verified(i), pointers,
    })));
    steps.push(step(values, LINE.test, 'SE vetor[i] > vetor[i + 1]', `${fmt(values[i])} > ${fmt(values[i + 1])} é ${bad ? 'verdadeiro: o par está fora de ordem.' : 'falso: o par está em ordem.'}`, 'comparison', at({
      sortedCount: verified(i), pointers, activeIndices: [i, i + 1], compare: compareOf(values, i, bad),
    })));
    if (bad) {
      frame.retorno = 'falso';
      steps.push(step(values, LINE.returnFalse, 'RETORNE falso', `O par das posições ${i} e ${i + 1} está fora de ordem (${fmt(values[i])} > ${fmt(values[i + 1])}). A função retorna falso na hora, sem olhar o restante do vetor.`, 'warning', at({
        sortedCount: verified(i), pointers, warnIndices: [i, i + 1], compare: compareOf(values, i, true), output: ['isOrdenado → falso'],
      })));
      return steps;
    }
  }

  pointFrame(frame, values, n - 1);
  steps.push(step(values, LINE.loop, `PARA i (i = ${n - 1}): fim`, `i recebe ${n - 1} e a condição i ≤ ${n - 2} é falsa: o laço termina. Os ${n - 1} pares foram verificados e todos estão em ordem.`, 'success', at({ sortedCount: n })));
  frame.retorno = 'verdadeiro';
  steps.push(step(values, LINE.returnTrue, 'RETORNE verdadeiro', `O vetor está ordenado. Para dizer isso foi preciso comparar todos os ${n - 1} pares.`, 'done', at({
    sortedCount: n, output: ['isOrdenado → verdadeiro', `Comparações: ${n - 1}`],
  })));
  return steps;
}

// ---------------------------------------------------------------------------
// 02 · Shotgun Sort
// Cada tentativa percorre as linhas na ordem em que são executadas, com as
// variáveis locais de isOrdenado nascendo sem valor a cada chamada.
// ---------------------------------------------------------------------------

function shotgunSteps(values, rng) {
  const n = values.length;
  const total = arrangements(values);
  const log = [];
  let current = clone(values);
  let shuffles = 0;
  const stats = (attempt) => ({ 'verificações': attempt, embaralhamentos: shuffles });

  const steps = [
    step(current, LINE.procedure, 'Iniciando o Shotgun Sort', 'O algoritmo não tem estratégia: verifica se o vetor está ordenado e, se não estiver, embaralha tudo e tenta de novo.', 'neutral', { stats: stats(0), variables: newFrame() }),
  ];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const bad = firstUnordered(current);
    const name = `Tentativa ${pad(attempt)}`;
    const checking = { label: name, text: 'Verificando se está ordenado' };
    const frame = newFrame();
    const at = (extra) => ({ phase: checking, stats: stats(attempt), output: clone(log), variables: { ...frame }, ...extra });

    steps.push(step(current, LINE.whileLoop, 'ENQUANTO isOrdenado(vetor) = falso', 'A condição do ENQUANTO chama isOrdenado(vetor). A cada chamada, as variáveis locais da função começam sem valor.', 'reading', at({})));

    // Percorre os pares como isOrdenado: PARA e SE para cada um, até o primeiro fora de ordem.
    const pairs = bad === -1 ? n - 1 : bad + 1;
    for (let i = 0; i < pairs; i += 1) {
      const outOfOrder = i === bad;
      const pointers = { i, next: i + 1 };
      pointFrame(frame, current, i);
      steps.push(step(current, LINE.loop, `PARA i (i = ${i})`, `i recebe ${i} e a condição i ≤ ${n - 2} é verdadeira: o laço entra, e ainda há um vizinho à direita (posição ${i + 1}) para comparar.`, 'reading', at({
        sortedCount: verified(i), pointers,
      })));
      steps.push(step(current, LINE.test, 'SE vetor[i] > vetor[i + 1]', `${fmt(current[i])} > ${fmt(current[i + 1])} é ${outOfOrder ? 'verdadeiro: o par está fora de ordem.' : 'falso: o par está em ordem.'}`, 'comparison', at({
        sortedCount: verified(i), pointers, activeIndices: [i, i + 1], compare: compareOf(current, i, outOfOrder),
      })));
    }

    if (bad === -1) {
      pointFrame(frame, current, n - 1);
      steps.push(step(current, LINE.loop, `PARA i (i = ${n - 1}): fim`, `i recebe ${n - 1} e a condição i ≤ ${n - 2} é falsa: o laço termina. Os ${n - 1} pares foram verificados e nenhum estava fora de ordem.`, 'success', at({ sortedCount: n })));
      frame.retorno = 'verdadeiro';
      steps.push(step(current, LINE.returnTrue, 'RETORNE verdadeiro', 'A função retorna verdadeiro, então a condição do ENQUANTO deixa de valer e o laço termina.', 'success', at({
        sortedCount: n, output: [...log, `${name}: ${list(current)} → verdadeiro`],
      })));
      steps.push(step(current, LINE.end, 'Vetor ordenado', attempt === 1
        ? 'O vetor já estava ordenado: a primeira verificação respondeu verdadeiro, sem nenhum embaralhamento. Esse é o melhor caso, de custo O(n) — mais barato que qualquer outro método de ordenação.'
        : `A sorte finalmente acertou, depois de ${attempt} verificações e ${shuffles} embaralhamentos. Para ${n} elementos eram esperadas, em média, ${total} tentativas.`, 'done', {
        sortedCount: n, stats: stats(attempt), variables: newFrame(), output: [...log, `${name}: ${list(current)} → verdadeiro`, `Embaralhamentos: ${shuffles}`],
      }));
      return steps;
    }

    frame.retorno = 'falso';
    log.push(`${name}: ${list(current)} → falso`);
    steps.push(step(current, LINE.returnFalse, 'RETORNE falso', 'Basta um par fora de ordem para a função devolver falso, sem olhar o resto do vetor.', 'warning', at({
      sortedCount: verified(bad), pointers: { i: bad, next: bad + 1 }, compare: compareOf(current, bad, true), warnIndices: [bad, bad + 1],
    })));

    if (attempt === MAX_ATTEMPTS) {
      steps.push(step(current, LINE.whileLoop, 'Limite de tentativas do simulador', `Foram ${MAX_ATTEMPTS} tentativas sem acertar, e o simulador para aqui. O algoritmo, porém, continuaria: com ${n} elementos a média esperada é ${total} tentativas, e como o sorteio não tem memória nada garante que ele termine algum dia.`, 'warning', {
        stats: stats(attempt), variables: newFrame(), output: [...log, `Parei após ${MAX_ATTEMPTS} tentativas`, `Média esperada para n = ${n}: ${total}`],
      }));
      return steps;
    }

    const next = shuffled(current, rng);
    const changedIndices = next.map((value, index) => (value !== current[index] ? index : -1)).filter((index) => index >= 0);
    shuffles += 1;
    steps.push(step(next, LINE.shuffle, 'embaralha(vetor)', changedIndices.length
      ? 'A função retornou falso, então o corpo do ENQUANTO executa: os elementos são reordenados ao acaso. Nada do que já estava certo é aproveitado.'
      : 'A função retornou falso, então o corpo do ENQUANTO executa. O sorteio devolveu a mesma ordem de antes, o que também é possível.', 'update', {
      changedIndices, phase: { label: name, text: 'Embaralha o vetor' }, stats: stats(attempt), variables: newFrame(), output: clone(log),
    }));
    current = next;
  }
  return steps;
}

// ---------------------------------------------------------------------------
// 03 · Por que é o pior?
// ---------------------------------------------------------------------------

const bigFactorial = (n) => {
  let result = 1n;
  for (let factor = 2n; factor <= BigInt(n); factor += 1n) result *= factor;
  return result;
};

const SUPERSCRIPT = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

function bigNumber(value) {
  const number = Number(value);
  if (number < 1e9) return value.toLocaleString('pt-BR');
  const exponent = Math.floor(Math.log10(number));
  const mantissa = (number / 10 ** exponent).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  return `${mantissa} × 10${String(exponent).split('').map((digit) => SUPERSCRIPT[digit]).join('')}`;
}

function humanTime(seconds) {
  const f = (value) => value.toLocaleString('pt-BR', { maximumFractionDigits: value < 10 ? 1 : 0 });
  if (seconds < 1) return 'menos de 1 segundo';
  if (seconds < 60) return `${f(seconds)} s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${f(minutes)} min`;
  const hours = minutes / 60;
  if (hours < 24) return `${f(hours)} h`;
  const days = hours / 24;
  if (days < 365) return `${f(days)} dias`;
  const years = days / 365.25;
  if (years < 1000) return `${f(years)} anos`;
  if (years < 1e6) return `${f(years / 1e3)} mil anos`;
  if (years < 1e9) return `${f(years / 1e6)} milhões de anos`;
  return `${f(years / 1e9)} bilhões de anos`;
}

const ATTEMPTS_PER_SECOND = 1e6;

function oddsSteps(values) {
  const n = values.length;
  const total = arrangements(values);
  const repeated = total !== factorial(n);
  const chance = (100 / total).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  const row = (size, attempts, mine = false) => ({
    n: size,
    selection: (size * (size - 1)) / 2,
    attempts: bigNumber(attempts),
    time: humanTime(Number(attempts) / ATTEMPTS_PER_SECOND),
    mine,
  });
  const rows = [row(n, total, true)];
  const growth = (size) => rows.push(row(size, bigFactorial(size)));
  const withTable = (extra) => ({ table: rows.map((item) => ({ ...item })), ...extra });
  const odds = (hit) => ({ total, hit, chance });
  const base = { sortedCount: 0 };

  const steps = [
    step(values, LINE.shuffle, 'Cada tentativa é um sorteio', `Com ${n} elementos existem ${total} ordens possíveis${repeated ? ' (menos que n!, porque há valores repetidos)' : ` (${n}! = ${total})`}, e só uma delas está ordenada. Embaralhar é sortear uma dessas ordens.`, 'neutral', {
      ...base, odds: odds(false), variables: { n, 'ordens possíveis': total },
    }),
    step(values, LINE.shuffle, 'A chance de acertar', `Cada embaralhamento acerta a ordem certa com probabilidade 1/${total} (cerca de ${chance}%). Errar é o resultado comum.`, 'comparison', {
      ...base, odds: odds(true), variables: { n, 'ordens possíveis': total, 'chance por tentativa': `${chance}%` },
    }),
    step(values, LINE.whileLoop, 'Quantas tentativas, em média?', `Como o sorteio não tem memória, em média são necessárias cerca de ${total} tentativas${total === 1 ? '' : ` para n = ${n}`}. Cada tentativa ainda custa uma verificação O(n) para o isOrdenado e um embaralhamento O(n).`, 'update', {
      ...base, odds: odds(true), variables: { n, 'tentativas esperadas': total },
    }),
    step(values, LINE.whileLoop, 'Comparando com o Selection Sort', `Para n = ${n} o Selection Sort faz ${(n * (n - 1)) / 2} comparações, sempre. O Shotgun Sort espera ${total} tentativas, e cada uma ainda inclui uma verificação e um embaralhamento. Com poucos elementos a diferença parece pequena...`, 'reading', withTable({
      ...base, variables: { n },
    })),
  ];

  growth(10);
  steps.push(step(values, LINE.whileLoop, 'Com n = 10', `10! = ${bigFactorial(10).toLocaleString('pt-BR')}. O Selection Sort faz 45 comparações; o Shotgun Sort, em média, mais de 3,6 milhões de tentativas.`, 'update', withTable({ ...base, variables: { n: 10 } })));
  growth(15);
  steps.push(step(values, LINE.whileLoop, 'Com n = 15', `15! passa de 1,3 trilhão. Mesmo testando um milhão de ordens por segundo, a média seria de uns ${humanTime(Number(bigFactorial(15)) / ATTEMPTS_PER_SECOND)}.`, 'update', withTable({ ...base, variables: { n: 15 } })));
  growth(20);
  steps.push(step(values, LINE.whileLoop, 'Com n = 20', `20! é cerca de 2,4 quintilhões: em média ${humanTime(Number(bigFactorial(20)) / ATTEMPTS_PER_SECOND)}, para ordenar só 20 números. O Selection Sort faz 190 comparações.`, 'warning', withTable({ ...base, variables: { n: 20 } })));

  steps.push(step(values, LINE.returnTrue, 'Ou será que não?', `Se o vetor já vier ordenado, isOrdenado responde verdadeiro na primeira tentativa: só ${n - 1} comparações, O(n) — menos que as ${(n * (n - 1)) / 2} do Selection Sort. O problema é o caso médio (n! tentativas) e o pior caso, que não tem limite.`, 'success', withTable({
    ...base, variables: { 'melhor caso': `${n - 1} comparações` },
  })));

  steps.push(step(values, LINE.end, 'Classificação do algoritmo', 'O Shotgun Sort é aceitável no melhor caso e inviável no resto: o custo médio cresce com n!, e nenhum tamanho de entrada realista termina em tempo útil.', 'done', withTable({
    ...base,
    output: [
      'Tempo: melhor O(n) · médio O(n·n!) · pior sem limite',
      'Espaço: O(1) — só uma variável auxiliar para embaralhar',
      'Adaptabilidade: só no melhor caso; ordem parcial não ajuda',
      'Estabilidade: não — a ordem dos iguais é sorteada',
    ],
  })));
  return steps;
}

export function buildSteps(id, values, config, rng = Math.random) {
  switch (id) {
    case 'is-sorted': return isSortedSteps(values);
    case 'shotgun-sort': return shotgunSteps(values, rng);
    case 'why-worst': return oddsSteps(values);
    default: return isSortedSteps(values);
  }
}
