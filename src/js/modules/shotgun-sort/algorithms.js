import { locale, tr } from '../../core/i18n.js';
// Pseudocódigo da aula (slide 15), em base 0: o laço de isOrdenado vai até
// vetor.length - 2, porque o último par é (n-2, n-1).
const SHOTGUN_CODE = [
  tr('FUNÇÃO isOrdenado(vetor)', 'FUNCTION isSorted(array)'),
  tr('  PARA i de 0 até vetor.length - 2 FAÇA', '  FOR i from 0 to array.length - 2 DO'),
  tr('    SE vetor[i] > vetor[i + 1] ENTÃO', '    IF array[i] > array[i + 1] THEN'),
  tr('      RETORNE falso', '      RETURN false'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM PARA', '  END FOR'),
  tr('  RETORNE verdadeiro', '  RETURN true'),
  tr('FIM', 'END'),
  '',
  tr('PROCEDIMENTO shotgunSort(vetor)', 'PROCEDURE shotgunSort(array)'),
  tr('  ENQUANTO isOrdenado(vetor) = falso FAÇA', '  WHILE isSorted(array) = false DO'),
  tr('    embaralha(vetor)', '    shuffle(array)'),
  tr('  FIM ENQUANTO', '  END WHILE'),
  tr('FIM', 'END'),
];

// Linhas do SHOTGUN_CODE (base 0). Cada passo da simulação destaca uma única linha.
const LINE = { loop: 1, test: 2, returnFalse: 3, returnTrue: 6, procedure: 9, whileLoop: 10, shuffle: 11, end: 13 };

/** Valor mostrado para uma variável que ainda não foi atribuída. */
const NONE = '—';

/** O simulador desiste depois de tantas tentativas: o algoritmo, em si, não tem limite. */
export const MAX_ATTEMPTS = 100;

export const algorithms = [
  {
    id: 'is-sorted', title: tr('Verificando se está ordenado', 'Checking whether it is sorted'), menuLabel: tr('isOrdenado()', 'isSorted()'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Compare cada elemento com o vizinho da direita. Ao achar um par fora de ordem, a função já sabe responder que o vetor não está ordenado.', 'Compare each element with its right neighbor. On finding a pair out of order, the function already knows how to answer that the array is not sorted.'),
    interaction: tr('Aplique vetores ordenados e desordenados e veja em qual par a verificação para.', 'Apply sorted and unsorted arrays and see at which pair the check stops.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso (vetor já ordenado) os n−1 pares são comparados; num vetor desordenado ela costuma parar bem antes.', 'In the worst case (array already sorted) the n−1 pairs are compared; in an unsorted array it usually stops much earlier.') },
    pseudocode: SHOTGUN_CODE.slice(0, 8),
  },
  {
    id: 'shotgun-sort', title: tr('Shotgun Sort', 'Shotgun Sort'), menuLabel: tr('Shotgun Sort', 'Shotgun Sort'), group: tr('Como funciona', 'How it works'), number: '02',
    description: tr('Enquanto o vetor não estiver ordenado, embaralhe tudo e tente de novo. Não há estratégia nenhuma: só sorte. Também é conhecido como Bogosort.', 'While the array is not sorted, shuffle everything and try again. There is no strategy at all: just luck. It is also known as Bogosort.'),
    interaction: tr('Rode a mesma entrada algumas vezes com "Sortear outra execução" e compare quantas tentativas cada uma levou.', 'Run the same input a few times with "Draw another run" and compare how many attempts each one took.'),
    complexity: { time: tr('O(n · n!)', 'O(n · n!)'), space: 'O(1)', note: tr('Caso médio: cerca de n! tentativas, cada uma com uma verificação O(n). O melhor caso (vetor já ordenado) é O(n); o pior caso não tem limite.', 'Average case: about n! attempts, each with an O(n) check. The best case (array already sorted) is O(n); the worst case has no limit.') },
    pseudocode: SHOTGUN_CODE,
  },
  {
    id: 'why-worst', title: tr('Por que é o pior algoritmo?', 'Why is it the worst algorithm?'), menuLabel: tr('Por que é o pior?', 'Why is it the worst?'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '03',
    description: tr('Conte quantas ordens possíveis existem, a chance de acertar a certa e como o custo explode quando n cresce.', 'Count how many possible orders there are, the chance of getting the right one and how the cost explodes as n grows.'),
    interaction: tr('Gere vetores de tamanhos diferentes e compare com o Selection Sort, que sempre faz n(n−1)/2 comparações.', 'Generate arrays of different sizes and compare with Selection Sort, which always makes n(n−1)/2 comparisons.'),
    complexity: { time: tr('O(n · n!)', 'O(n · n!)'), space: 'O(1)', note: tr('n! cresce mais depressa que qualquer polinômio ou exponencial: 10! já passa de 3 milhões e 20! de 2 quintilhões.', 'n! grows faster than any polynomial or exponential: 10! already exceeds 3 million and 20! exceeds 2 quintillion.') },
    pseudocode: SHOTGUN_CODE,
  },
];

const clone = (values) => [...values];
const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString(locale, { maximumFractionDigits: 2 }));
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
  left: { label: tr('vetor[i]', 'array[i]'), value: fmt(values[i]) },
  op: '>',
  right: { label: tr('vetor[i+1]', 'array[i+1]'), value: fmt(values[i + 1]) },
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
  const phase = { label: tr('isOrdenado()', 'isSorted()'), text: tr('Procura um par fora de ordem', 'Looking for a pair out of order'), code: true };
  const frame = newFrame();
  const at = (extra) => ({ phase, variables: { ...frame }, ...extra });
  const steps = [
    step(values, 0, tr('Chamando isOrdenado', 'Calling isSorted'), tr('A função compara cada elemento com o vizinho da direita. Se algum par estiver fora de ordem, o vetor não está ordenado. As variáveis locais ainda não têm valor.', 'The function compares each element with its right neighbor. If any pair is out of order, the array is not sorted. The local variables have no value yet.'), 'neutral', at({})),
  ];

  for (let i = 0; i < n - 1; i += 1) {
    const bad = values[i] > values[i + 1];
    const pointers = { i, next: i + 1 };
    pointFrame(frame, values, i);
    steps.push(step(values, LINE.loop, tr(`PARA i (i = ${i})`, `FOR i (i = ${i})`), tr(`i recebe ${i} e a condição i ≤ ${n - 2} é verdadeira: o laço entra, e ainda há um vizinho à direita (posição ${i + 1}) para comparar.`, `i receives ${i} and the condition i ≤ ${n - 2} is true: the loop is entered, and there is still a neighbor on the right (position ${i + 1}) to compare.`), 'reading', at({
      sortedCount: verified(i), pointers,
    })));
    steps.push(step(values, LINE.test, tr('SE vetor[i] > vetor[i + 1]', 'IF array[i] > array[i + 1]'), tr(`${fmt(values[i])} > ${fmt(values[i + 1])} é ${bad ? 'verdadeiro: o par está fora de ordem.' : 'falso: o par está em ordem.'}`, `${fmt(values[i])} > ${fmt(values[i + 1])} is ${bad ? 'true: the pair is out of order.' : 'false: the pair is in order.'}`), 'comparison', at({
      sortedCount: verified(i), pointers, activeIndices: [i, i + 1], compare: compareOf(values, i, bad),
    })));
    if (bad) {
      frame.retorno = 'falso';
      steps.push(step(values, LINE.returnFalse, tr('RETORNE falso', 'RETURN false'), tr(`O par das posições ${i} e ${i + 1} está fora de ordem (${fmt(values[i])} > ${fmt(values[i + 1])}). A função retorna falso na hora, sem olhar o restante do vetor.`, `The pair at positions ${i} and ${i + 1} is out of order (${fmt(values[i])} > ${fmt(values[i + 1])}). The function returns false right away, without looking at the rest of the array.`), 'warning', at({
        sortedCount: verified(i), pointers, warnIndices: [i, i + 1], compare: compareOf(values, i, true), output: [tr('isOrdenado → falso', 'isSorted → false')],
      })));
      return steps;
    }
  }

  pointFrame(frame, values, n - 1);
  steps.push(step(values, LINE.loop, tr(`PARA i (i = ${n - 1}): fim`, `FOR i (i = ${n - 1}): end`), tr(`i recebe ${n - 1} e a condição i ≤ ${n - 2} é falsa: o laço termina. Os ${n - 1} pares foram verificados e todos estão em ordem.`, `i receives ${n - 1} and the condition i ≤ ${n - 2} is false: the loop ends. The ${n - 1} pairs were checked and all are in order.`), 'success', at({ sortedCount: n })));
  frame.retorno = 'verdadeiro';
  steps.push(step(values, LINE.returnTrue, tr('RETORNE verdadeiro', 'RETURN true'), tr(`O vetor está ordenado. Para dizer isso foi preciso comparar todos os ${n - 1} pares.`, `The array is sorted. To say that, all ${n - 1} pairs had to be compared.`), 'done', at({
    sortedCount: n, output: [tr('isOrdenado → verdadeiro', 'isSorted → true'), tr(`Comparações: ${n - 1}`, `Comparisons: ${n - 1}`)],
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
    step(current, LINE.procedure, tr('Iniciando o Shotgun Sort', 'Starting Shotgun Sort'), tr('O algoritmo não tem estratégia: verifica se o vetor está ordenado e, se não estiver, embaralha tudo e tenta de novo.', 'The algorithm has no strategy: it checks whether the array is sorted and, if not, shuffles everything and tries again.'), 'neutral', { stats: stats(0), variables: newFrame() }),
  ];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const bad = firstUnordered(current);
    const name = tr(`Tentativa ${pad(attempt)}`, `Attempt ${pad(attempt)}`);
    const checking = { label: name, text: tr('Verificando se está ordenado', 'Checking whether it is sorted') };
    const frame = newFrame();
    const at = (extra) => ({ phase: checking, stats: stats(attempt), output: clone(log), variables: { ...frame }, ...extra });

    steps.push(step(current, LINE.whileLoop, tr('ENQUANTO isOrdenado(vetor) = falso', 'WHILE isSorted(array) = false'), tr('A condição do ENQUANTO chama isOrdenado(vetor). A cada chamada, as variáveis locais da função começam sem valor.', 'The WHILE condition calls isSorted(array). On each call, the local variables of the function start with no value.'), 'reading', at({})));

    // Percorre os pares como isOrdenado: PARA e SE para cada um, até o primeiro fora de ordem.
    const pairs = bad === -1 ? n - 1 : bad + 1;
    for (let i = 0; i < pairs; i += 1) {
      const outOfOrder = i === bad;
      const pointers = { i, next: i + 1 };
      pointFrame(frame, current, i);
      steps.push(step(current, LINE.loop, tr(`PARA i (i = ${i})`, `FOR i (i = ${i})`), tr(`i recebe ${i} e a condição i ≤ ${n - 2} é verdadeira: o laço entra, e ainda há um vizinho à direita (posição ${i + 1}) para comparar.`, `i receives ${i} and the condition i ≤ ${n - 2} is true: the loop is entered, and there is still a neighbor on the right (position ${i + 1}) to compare.`), 'reading', at({
        sortedCount: verified(i), pointers,
      })));
      steps.push(step(current, LINE.test, tr('SE vetor[i] > vetor[i + 1]', 'IF array[i] > array[i + 1]'), tr(`${fmt(current[i])} > ${fmt(current[i + 1])} é ${outOfOrder ? 'verdadeiro: o par está fora de ordem.' : 'falso: o par está em ordem.'}`, `${fmt(current[i])} > ${fmt(current[i + 1])} is ${outOfOrder ? 'true: the pair is out of order.' : 'false: the pair is in order.'}`), 'comparison', at({
        sortedCount: verified(i), pointers, activeIndices: [i, i + 1], compare: compareOf(current, i, outOfOrder),
      })));
    }

    if (bad === -1) {
      pointFrame(frame, current, n - 1);
      steps.push(step(current, LINE.loop, tr(`PARA i (i = ${n - 1}): fim`, `FOR i (i = ${n - 1}): end`), tr(`i recebe ${n - 1} e a condição i ≤ ${n - 2} é falsa: o laço termina. Os ${n - 1} pares foram verificados e nenhum estava fora de ordem.`, `i receives ${n - 1} and the condition i ≤ ${n - 2} is false: the loop ends. The ${n - 1} pairs were checked and none was out of order.`), 'success', at({ sortedCount: n })));
      frame.retorno = 'verdadeiro';
      steps.push(step(current, LINE.returnTrue, tr('RETORNE verdadeiro', 'RETURN true'), tr('A função retorna verdadeiro, então a condição do ENQUANTO deixa de valer e o laço termina.', 'The function returns true, so the WHILE condition no longer holds and the loop ends.'), 'success', at({
        sortedCount: n, output: [...log, tr(`${name}: ${list(current)} → verdadeiro`, `${name}: ${list(current)} → true`)],
      })));
      steps.push(step(current, LINE.end, tr('Vetor ordenado', 'Array sorted'), attempt === 1
        ? tr('O vetor já estava ordenado: a primeira verificação respondeu verdadeiro, sem nenhum embaralhamento. Esse é o melhor caso, de custo O(n) — mais barato que qualquer outro método de ordenação.', 'The array was already sorted: the first check answered true, with no shuffling at all. This is the best case, with cost O(n) — cheaper than any other sorting method.')
        : tr(`A sorte finalmente acertou, depois de ${attempt} verificações e ${shuffles} embaralhamentos. Para ${n} elementos eram esperadas, em média, ${total} tentativas.`, `Luck finally hit, after ${attempt} checks and ${shuffles} shuffles. For ${n} elements, ${total} attempts were expected on average.`), 'done', {
        sortedCount: n, stats: stats(attempt), variables: newFrame(), output: [...log, tr(`${name}: ${list(current)} → verdadeiro`, `${name}: ${list(current)} → true`), tr(`Embaralhamentos: ${shuffles}`, `Shuffles: ${shuffles}`)],
      }));
      return steps;
    }

    frame.retorno = 'falso';
    log.push(tr(`${name}: ${list(current)} → falso`, `${name}: ${list(current)} → false`));
    steps.push(step(current, LINE.returnFalse, tr('RETORNE falso', 'RETURN false'), tr('Basta um par fora de ordem para a função devolver falso, sem olhar o resto do vetor.', 'A single pair out of order is enough for the function to return false, without looking at the rest of the array.'), 'warning', at({
      sortedCount: verified(bad), pointers: { i: bad, next: bad + 1 }, compare: compareOf(current, bad, true), warnIndices: [bad, bad + 1],
    })));

    if (attempt === MAX_ATTEMPTS) {
      steps.push(step(current, LINE.whileLoop, tr('Limite de tentativas do simulador', 'Simulator attempt limit'), tr(`Foram ${MAX_ATTEMPTS} tentativas sem acertar, e o simulador para aqui. O algoritmo, porém, continuaria: com ${n} elementos a média esperada é ${total} tentativas, e como o sorteio não tem memória nada garante que ele termine algum dia.`, `There were ${MAX_ATTEMPTS} attempts without success, and the simulator stops here. The algorithm, however, would go on: with ${n} elements the expected average is ${total} attempts, and since the draw has no memory nothing guarantees that it will ever finish.`), 'warning', {
        stats: stats(attempt), variables: newFrame(), output: [...log, tr(`Parei após ${MAX_ATTEMPTS} tentativas`, `I stopped after ${MAX_ATTEMPTS} attempts`), tr(`Média esperada para n = ${n}: ${total}`, `Expected average for n = ${n}: ${total}`)],
      }));
      return steps;
    }

    const next = shuffled(current, rng);
    const changedIndices = next.map((value, index) => (value !== current[index] ? index : -1)).filter((index) => index >= 0);
    shuffles += 1;
    steps.push(step(next, LINE.shuffle, tr('embaralha(vetor)', 'shuffle(array)'), changedIndices.length
      ? tr('A função retornou falso, então o corpo do ENQUANTO executa: os elementos são reordenados ao acaso. Nada do que já estava certo é aproveitado.', 'The function returned false, so the body of the WHILE runs: the elements are rearranged at random. Nothing that was already right is reused.')
      : tr('A função retornou falso, então o corpo do ENQUANTO executa. O sorteio devolveu a mesma ordem de antes, o que também é possível.', 'The function returned false, so the body of the WHILE runs. The draw returned the same order as before, which is also possible.'), 'update', {
      changedIndices, phase: { label: name, text: tr('Embaralha o vetor', 'Shuffles the array') }, stats: stats(attempt), variables: newFrame(), output: clone(log),
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
  if (number < 1e9) return value.toLocaleString(locale);
  const exponent = Math.floor(Math.log10(number));
  const mantissa = (number / 10 ** exponent).toLocaleString(locale, { maximumFractionDigits: 1 });
  return tr(`${mantissa} × 10${String(exponent).split('').map((digit) => SUPERSCRIPT[digit]).join('')}`, `${mantissa} × 10${String(exponent).split('').map((digit) => SUPERSCRIPT[digit]).join('')}`);
}

function humanTime(seconds) {
  const f = (value) => value.toLocaleString(locale, { maximumFractionDigits: value < 10 ? 1 : 0 });
  if (seconds < 1) return tr('menos de 1 segundo', 'less than 1 second');
  if (seconds < 60) return `${f(seconds)} s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${f(minutes)} min`;
  const hours = minutes / 60;
  if (hours < 24) return `${f(hours)} h`;
  const days = hours / 24;
  if (days < 365) return tr(`${f(days)} dias`, `${f(days)} days`);
  const years = days / 365.25;
  if (years < 1000) return tr(`${f(years)} anos`, `${f(years)} years`);
  if (years < 1e6) return tr(`${f(years / 1e3)} mil anos`, `${f(years / 1e3)} thousand years`);
  if (years < 1e9) return tr(`${f(years / 1e6)} milhões de anos`, `${f(years / 1e6)} million years`);
  return tr(`${f(years / 1e9)} bilhões de anos`, `${f(years / 1e9)} billion years`);
}

const ATTEMPTS_PER_SECOND = 1e6;

function oddsSteps(values) {
  const n = values.length;
  const total = arrangements(values);
  const repeated = total !== factorial(n);
  const chance = (100 / total).toLocaleString(locale, { maximumFractionDigits: 2 });
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
    step(values, LINE.shuffle, tr('Cada tentativa é um sorteio', 'Each attempt is a draw'), tr(`Com ${n} elementos existem ${total} ordens possíveis${repeated ? ' (menos que n!, porque há valores repetidos)' : ` (${n}! = ${total})`}, e só uma delas está ordenada. Embaralhar é sortear uma dessas ordens.`, `With ${n} elements there are ${total} possible orders${repeated ? ' (fewer than n!, because there are repeated values)' : ` (${n}! = ${total})`}, and only one of them is sorted. Shuffling is drawing one of those orders.`), 'neutral', {
      ...base, odds: odds(false), variables: { n, 'ordens possíveis': total },
    }),
    step(values, LINE.shuffle, tr('A chance de acertar', 'The chance of getting it right'), tr(`Cada embaralhamento acerta a ordem certa com probabilidade 1/${total} (cerca de ${chance}%). Errar é o resultado comum.`, `Each shuffle gets the right order with probability 1/${total} (about ${chance}%). Missing is the common result.`), 'comparison', {
      ...base, odds: odds(true), variables: { n, 'ordens possíveis': total, 'chance por tentativa': `${chance}%` },
    }),
    step(values, LINE.whileLoop, tr('Quantas tentativas, em média?', 'How many attempts, on average?'), tr(`Como o sorteio não tem memória, em média são necessárias cerca de ${total} tentativas${total === 1 ? '' : ` para n = ${n}`}. Cada tentativa ainda custa uma verificação O(n) para o isOrdenado e um embaralhamento O(n).`, `Since the draw has no memory, on average about ${total} attempts are needed${total === 1 ? '' : ` for n = ${n}`}. Each attempt still costs an O(n) check for isSorted and an O(n) shuffle.`), 'update', {
      ...base, odds: odds(true), variables: { n, 'tentativas esperadas': total },
    }),
    step(values, LINE.whileLoop, tr('Comparando com o Selection Sort', 'Comparing with Selection Sort'), tr(`Para n = ${n} o Selection Sort faz ${(n * (n - 1)) / 2} comparações, sempre. O Shotgun Sort espera ${total} tentativas, e cada uma ainda inclui uma verificação e um embaralhamento. Com poucos elementos a diferença parece pequena...`, `For n = ${n} Selection Sort makes ${(n * (n - 1)) / 2} comparisons, always. Shotgun Sort expects ${total} attempts, and each one still includes a check and a shuffle. With few elements the difference looks small...`), 'reading', withTable({
      ...base, variables: { n },
    })),
  ];

  growth(10);
  steps.push(step(values, LINE.whileLoop, tr('Com n = 10', 'With n = 10'), tr(`10! = ${bigFactorial(10).toLocaleString(locale)}. O Selection Sort faz 45 comparações; o Shotgun Sort, em média, mais de 3,6 milhões de tentativas.`, `10! = ${bigFactorial(10).toLocaleString(locale)}. Selection Sort makes 45 comparisons; Shotgun Sort, on average, more than 3.6 million attempts.`), 'update', withTable({ ...base, variables: { n: 10 } })));
  growth(15);
  steps.push(step(values, LINE.whileLoop, tr('Com n = 15', 'With n = 15'), tr(`15! passa de 1,3 trilhão. Mesmo testando um milhão de ordens por segundo, a média seria de uns ${humanTime(Number(bigFactorial(15)) / ATTEMPTS_PER_SECOND)}.`, `15! exceeds 1.3 trillion. Even testing a million orders per second, the average would be about ${humanTime(Number(bigFactorial(15)) / ATTEMPTS_PER_SECOND)}.`), 'update', withTable({ ...base, variables: { n: 15 } })));
  growth(20);
  steps.push(step(values, LINE.whileLoop, tr('Com n = 20', 'With n = 20'), tr(`20! é cerca de 2,4 quintilhões: em média ${humanTime(Number(bigFactorial(20)) / ATTEMPTS_PER_SECOND)}, para ordenar só 20 números. O Selection Sort faz 190 comparações.`, `20! is about 2.4 quintillion: on average ${humanTime(Number(bigFactorial(20)) / ATTEMPTS_PER_SECOND)}, to sort just 20 numbers. Selection Sort makes 190 comparisons.`), 'warning', withTable({ ...base, variables: { n: 20 } })));

  steps.push(step(values, LINE.returnTrue, tr('Ou será que não?', 'Or maybe not?'), tr(`Se o vetor já vier ordenado, isOrdenado responde verdadeiro na primeira tentativa: só ${n - 1} comparações, O(n) — menos que as ${(n * (n - 1)) / 2} do Selection Sort. O problema é o caso médio (n! tentativas) e o pior caso, que não tem limite.`, `If the array comes already sorted, isSorted answers true on the first attempt: only ${n - 1} comparisons, O(n) — fewer than the ${(n * (n - 1)) / 2} of Selection Sort. The problem is the average case (n! attempts) and the worst case, which has no limit.`), 'success', withTable({
    ...base, variables: { 'melhor caso': tr(`${n - 1} comparações`, `${n - 1} comparisons`) },
  })));

  steps.push(step(values, LINE.end, tr('Classificação do algoritmo', 'Classification of the algorithm'), tr('O Shotgun Sort é aceitável no melhor caso e inviável no resto: o custo médio cresce com n!, e nenhum tamanho de entrada realista termina em tempo útil.', 'Shotgun Sort is acceptable in the best case and unworkable in the rest: the average cost grows with n!, and no realistic input size finishes in useful time.'), 'done', withTable({
    ...base,
    output: [
      tr('Tempo: melhor O(n) · médio O(n·n!) · pior sem limite', 'Time: best O(n) · average O(n·n!) · worst unbounded'),
      tr('Espaço: O(1) — só uma variável auxiliar para embaralhar', 'Space: O(1) — only one auxiliary variable to shuffle'),
      tr('Adaptabilidade: só no melhor caso; ordem parcial não ajuda', 'Adaptivity: only in the best case; partial order does not help'),
      tr('Estabilidade: não — a ordem dos iguais é sorteada', 'Stability: no — the order of equal values is drawn'),
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
