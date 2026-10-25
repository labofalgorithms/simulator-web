import { NONE, fmt, range } from '../shared/sort-steps.js';
import { tr } from '../../core/i18n.js';

// Aula de Recursão (ALG1 aula 03): a soma de 1 até n e o fatorial vêm dos slides 19 a 39 (a pilha de
// chamadas é a dos slides 26 a 37, com n = 5). O maior elemento de um vetor, o inverter de uma string,
// a comparação com o laço (slides 3 a 8 e 42 a 45) e o caso base inalcançável (slides 15 e 40) completam o módulo.

export const LIMITS = {
  n: { min: 1, max: 8 },
  fat: { min: 0, max: 8 },
  vetor: { min: 2, max: 8 },
  texto: { min: 1, max: 8 },
  inicio: { min: -10, max: 10 },
};

/** Quantas chamadas cabem na pilha do simulador "Caso base inalcançável" (no Java real são milhares). */
export const STACK_LIMIT = 8;

export const DEFAULT_DATA = {
  n: 5, fat: 5, vetor: [4, 9, 2, 7, 5], texto: tr('pilha', 'stack'), inicio: 3,
};

export const WORDS = tr(
  ['pilha', 'fila', 'lista', 'arvore', 'vetor', 'grafo', 'busca', 'chave', 'folha', 'recursao'],
  ['stack', 'queue', 'list', 'tree', 'array', 'graph', 'search', 'key', 'leaf', 'recursion'],
);

const NAME = {
  soma: tr('soma', 'sum'),
  fatorial: tr('fatorial', 'factorial'),
  maior: tr('maior', 'largest'),
  inverter: tr('inverter', 'reverse'),
  somaIterativo: tr('somaIterativo', 'iterativeSum'),
};

const q = (text) => `"${text}"`;
const truth = (value) => (value ? tr('verdadeiro', 'true') : tr('falso', 'false'));

const SOMA_CODE = [
  tr('FUNÇÃO soma(n)', 'FUNCTION sum(n)'),
  tr('  SE n == 1 ENTÃO', '  IF n == 1 THEN'),
  tr('    RETORNE 1    // caso base', '    RETURN 1    // base case'),
  tr('  SENÃO', '  ELSE'),
  tr('    RETORNE n + soma(n - 1)    // passo recursivo', '    RETURN n + sum(n - 1)    // recursive step'),
  tr('  FIM SE', '  END IF'),
  tr('FIM', 'END'),
];

const FATORIAL_CODE = [
  tr('FUNÇÃO fatorial(n)', 'FUNCTION factorial(n)'),
  tr('  SE n < 1 ENTÃO', '  IF n < 1 THEN'),
  tr('    RETORNE 1    // caso base', '    RETURN 1    // base case'),
  tr('  FIM SE', '  END IF'),
  tr('  RETORNE n * fatorial(n - 1)    // passo recursivo', '  RETURN n * factorial(n - 1)    // recursive step'),
  tr('FIM', 'END'),
];

const MAIOR_CODE = [
  tr('FUNÇÃO maior(v, i)', 'FUNCTION largest(v, i)'),
  tr('  SE i == 0 ENTÃO', '  IF i == 0 THEN'),
  tr('    RETORNE v[0]    // caso base', '    RETURN v[0]    // base case'),
  tr('  FIM SE', '  END IF'),
  tr('  maiorResto ← maior(v, i - 1)', '  largestRest ← largest(v, i - 1)'),
  tr('  SE v[i] > maiorResto ENTÃO', '  IF v[i] > largestRest THEN'),
  tr('    RETORNE v[i]', '    RETURN v[i]'),
  tr('  FIM SE', '  END IF'),
  tr('  RETORNE maiorResto', '  RETURN largestRest'),
  tr('FIM', 'END'),
];

const INVERTER_CODE = [
  tr('FUNÇÃO inverter(texto)', 'FUNCTION reverse(text)'),
  tr('  SE tamanho(texto) ≤ 1 ENTÃO', '  IF length(text) ≤ 1 THEN'),
  tr('    RETORNE texto    // caso base', '    RETURN text    // base case'),
  tr('  FIM SE', '  END IF'),
  tr('  invertido ← inverter(subtexto(texto, 1))', '  reversed ← reverse(substring(text, 1))'),
  tr('  RETORNE invertido + texto[0]', '  RETURN reversed + text[0]'),
  tr('FIM', 'END'),
];

const ITERATIVO_CODE = [
  tr('FUNÇÃO somaIterativo(n)', 'FUNCTION iterativeSum(n)'),
  tr('  soma ← 0', '  sum ← 0'),
  tr('  PARA i DE 1 ATÉ n FAÇA', '  FOR i FROM 1 TO n DO'),
  tr('    soma ← soma + i', '    sum ← sum + i'),
  tr('  FIM PARA', '  END FOR'),
  tr('  RETORNE soma', '  RETURN sum'),
  tr('FIM', 'END'),
];

const OVERFLOW_CODE = [
  tr('FUNÇÃO f(n)', 'FUNCTION f(n)'),
  tr('  SE n == 0 ENTÃO', '  IF n == 0 THEN'),
  tr('    RETORNE 0    // caso base', '    RETURN 0    // base case'),
  tr('  FIM SE', '  END IF'),
  tr('  RETORNE f(n + 1)', '  RETURN f(n + 1)'),
  tr('FIM', 'END'),
];

export const algorithms = [
  {
    id: 'soma', title: tr('Soma de 1 até n', 'Sum from 1 to n'), menuLabel: tr('Soma de 1 até n', 'Sum from 1 to n'), group: tr('A pilha de chamadas', 'The call stack'), number: '01',
    description: tr('soma(n) = n + soma(n − 1), com soma(1) = 1 como caso base. Cada chamada entra na pilha, espera a de baixo voltar e só então calcula a sua parte.', 'sum(n) = n + sum(n − 1), with sum(1) = 1 as the base case. Each call goes onto the stack, waits for the one above it to return and only then computes its part.'),
    interaction: tr('Avance passo a passo com n = 5 (o exemplo dos slides): primeiro a pilha cresce até o caso base, depois cada chamada volta e faz a sua conta. Troque o valor de n e compare a altura da pilha.', 'Step through with n = 5 (the example from the slides): first the stack grows up to the base case, then each call returns and does its calculation. Change the value of n and compare the height of the stack.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('São n chamadas, com uma soma em cada uma, e a pilha chega a n frames ao mesmo tempo (um por chamada pendente). Um laço faz a mesma conta com espaço O(1).', 'There are n calls, with one addition in each, and the stack reaches n frames at the same time (one per pending call). A loop does the same calculation with O(1) space.') },
    pseudocode: SOMA_CODE,
  },
  {
    id: 'fatorial', title: tr('Fatorial', 'Factorial'), menuLabel: tr('Fatorial', 'Factorial'), group: tr('A pilha de chamadas', 'The call stack'), number: '02',
    description: tr('fatorial(n) = n × fatorial(n − 1), com fatorial(0) = 1 como caso base. Pré-condição: n ≥ 0. O teste é n < 1, como no slide 39.', 'factorial(n) = n × factorial(n − 1), with factorial(0) = 1 as the base case. Precondition: n ≥ 0. The test is n < 1, as in slide 39.'),
    interaction: tr('Compare com a soma: a pilha tem o mesmo formato, mas a volta multiplica em vez de somar. Teste n = 0, em que o caso base acontece na primeira chamada.', 'Compare with the sum: the stack has the same shape, but the way back multiplies instead of adding. Try n = 0, where the base case happens on the first call.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('São n + 1 chamadas (de n até 0), uma multiplicação em cada, e a pilha chega a n + 1 frames. O resultado cresce depressa: 8! já é 40320.', 'There are n + 1 calls (from n down to 0), one multiplication in each, and the stack reaches n + 1 frames. The result grows fast: 8! is already 40320.') },
    pseudocode: FATORIAL_CODE,
  },
  {
    id: 'maior', title: tr('Maior elemento de um vetor', 'Largest element of an array'), menuLabel: tr('Maior de um vetor', 'Largest of an array'), group: tr('Mais exemplos', 'More examples'), number: '03',
    description: tr('O maior de v[0..i] é o maior entre v[i] e o maior de v[0..i − 1]. O trecho encolhe um elemento a cada chamada, até sobrar só v[0], que é o caso base.', 'The largest of v[0..i] is the larger of v[i] and the largest of v[0..i − 1]. The range shrinks by one element at each call, until only v[0] is left, which is the base case.'),
    interaction: tr('Digite o seu vetor ou gere um aleatório. Veja o trecho v[0..i] encolher na ida e, na volta, cada chamada comparar v[i] com o maior que recebeu (maiorResto).', 'Type your own array or generate a random one. Watch the range v[0..i] shrink on the way down and, on the way back, each call compare v[i] with the largest it received (largestRest).'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('São n chamadas, com uma comparação em cada, e a pilha chega a n frames. A versão com laço também faz n − 1 comparações, mas guarda só uma variável.', 'There are n calls, with one comparison in each, and the stack reaches n frames. The loop version also makes n − 1 comparisons, but keeps just one variable.') },
    pseudocode: MAIOR_CODE,
  },
  {
    id: 'inverter', title: tr('Inverter uma string', 'Reverse a string'), menuLabel: tr('Inverter uma string', 'Reverse a string'), group: tr('Mais exemplos', 'More examples'), number: '04',
    description: tr('Inverter um texto é inverter o texto sem o primeiro caractere e colocar esse caractere no fim. Um texto de um só caractere já está invertido: é o caso base.', 'Reversing a text means reversing the text without its first character and putting that character at the end. A one-character text is already reversed: that is the base case.'),
    interaction: tr('Escolha uma palavra de até 8 letras. Na ida, cada frame guarda um pedaço menor do texto; na volta, a letra que ficou esperando é colocada no fim do resultado.', 'Pick a word of up to 8 letters. On the way down, each frame holds a smaller piece of the text; on the way back, the letter that was waiting is put at the end of the result.'),
    complexity: { time: 'O(n²)', space: 'O(n²)', note: tr('São n chamadas, e cada uma copia o resto do texto (subtexto) e junta duas strings: o trabalho soma n + (n − 1) + … + 1 caracteres. Os n frames guardam, juntos, quase n²/2 caracteres.', 'There are n calls, and each one copies the rest of the text (substring) and joins two strings: the work adds up to n + (n − 1) + … + 1 characters. The n frames hold, together, almost n²/2 characters.') },
    pseudocode: INVERTER_CODE,
  },
  {
    id: 'iterativo', title: tr('Iterativo × recursivo', 'Iterative × recursive'), menuLabel: tr('Iterativo × recursivo', 'Iterative × recursive'), group: tr('Cuidados e alternativas', 'Pitfalls and alternatives'), number: '05',
    description: tr('A mesma soma de 1 até n com um laço (slides 3 a 8 e 45). Uma única chamada, uma única variável soma: a pilha nunca passa de um frame, ao contrário da versão recursiva.', 'The same sum from 1 to n with a loop (slides 3 to 8 and 45). A single call, a single sum variable: the stack never goes past one frame, unlike the recursive version.'),
    interaction: tr('Execute o laço e compare os quadros no fim: o resultado é o mesmo, mas a versão recursiva precisa de n frames na pilha. Aumente n para ver a diferença crescer.', 'Run the loop and compare the boxes at the end: the result is the same, but the recursive version needs n frames on the stack. Increase n to see the difference grow.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('O laço repete n vezes e usa só n, soma e i. Remover a recursão evita o estouro da pilha em entradas grandes; em problemas mais complexos (árvores, backtracking) pode exigir uma pilha explícita.', 'The loop repeats n times and uses only n, sum and i. Removing the recursion avoids a stack overflow on large inputs; in more complex problems (trees, backtracking) it may require an explicit stack.') },
    pseudocode: ITERATIVO_CODE,
  },
  {
    id: 'overflow', title: tr('Caso base inalcançável', 'Unreachable base case'), menuLabel: tr('Caso base inalcançável', 'Unreachable base case'), group: tr('Cuidados e alternativas', 'Pitfalls and alternatives'), number: '06',
    description: tr('f(n) tem caso base (n == 0), mas chama f(n + 1): para n > 0 a execução se afasta dele (slide 15). A pilha enche até o estouro, o StackOverflowError do slide 40.', 'f(n) has a base case (n == 0), but calls f(n + 1): for n > 0 the execution moves away from it (slide 15). The stack fills up until it overflows, the StackOverflowError of slide 40.'),
    interaction: tr(`Com n positivo o caso base nunca chega. Com n negativo ele chega, e a pilha volta sem problemas... até n = −8: a recursão está certa, mas funda demais para a pilha de ${STACK_LIMIT} frames deste simulador.`, `With a positive n the base case never arrives. With a negative n it does, and the stack unwinds without problems... until n = −8: the recursion is correct, but too deep for the ${STACK_LIMIT}-frame stack of this simulator.`),
    complexity: { time: '∞', space: '∞', note: tr('Sem um caso base alcançável, as chamadas não param: o tempo e a pilha só crescem, até o programa falhar. Um caso base nunca basta sozinho: cada chamada precisa se aproximar dele, e a profundidade tem de caber na pilha.', 'Without a reachable base case the calls never stop: time and the stack only grow, until the program fails. A base case is never enough on its own: each call must get closer to it, and the depth has to fit in the stack.') },
    pseudocode: OVERFLOW_CODE,
  },
];

// ---------------------------------------------------------------------------
// Execução como num depurador: cada passo é uma linha do pseudocódigo, com a pilha de chamadas
// inteira (quadros com o nome da chamada, as variáveis locais, a conta pendente e o retorno).
// ---------------------------------------------------------------------------

function createTracer() {
  const steps = [];
  const frames = [];
  const log = [];
  let calls = 0;
  let peak = 0;

  const show = (value) => (value === undefined ? NONE : typeof value === 'number' ? fmt(value) : value);

  const view = (frame, index) => ({
    name: frame.name,
    note: frame.note || '',
    locals: Object.entries(frame.vars).map(([name, value]) => [name, show(value)]),
    result: frame.result === undefined ? null : show(frame.result),
    state: index < frames.length - 1 ? 'wait' : frame.result !== undefined ? 'ret' : 'run',
    fresh: Boolean(frame.fresh),
  });

  function add(line, title, description, tone, extra = {}) {
    const top = frames.at(-1);
    const variables = {};
    if (top) {
      Object.entries(top.vars).forEach(([name, value]) => { variables[name] = show(value); });
      if (top.result !== undefined) variables.retorno = show(top.result);
    }
    steps.push({
      line,
      title,
      description,
      tone,
      variables,
      output: [...log],
      frames: frames.map(view),
      stats: { chamadas: calls, profundidade: frames.length, pico: peak },
      ...extra,
    });
    frames.forEach((frame) => { frame.fresh = false; });
  }

  function push(frame) {
    frame.fresh = true;
    frames.push(frame);
    calls += 1;
    peak = Math.max(peak, frames.length);
  }

  const pop = () => frames.pop();

  /** A conta inteira naquele instante: os termos dos quadros de baixo e o que o quadro do topo vale. */
  const chain = (head, op, tail) => `${head} = ${[...frames.slice(0, -1).map((frame) => frame.term), tail].join(` ${op} `)}`;

  const finish = (extraSlots = 0) => steps.map((item) => ({ ...item, slots: peak + extraSlots }));

  return {
    add, push, pop, chain, log, finish, depth: () => frames.length,
  };
}

const actionPush = (text) => ({ kind: 'push', label: tr('Insere na pilha', 'Push onto the stack'), text });
const actionReturn = (value, label = tr('Retorna', 'Returns')) => ({ kind: 'return', label, text: String(value) });

// ---------------------------------------------------------------------------
// Soma e fatorial: a mesma recursão linear, com a conta pendente n + soma(n - 1) ou n × fatorial(n - 1).
// ---------------------------------------------------------------------------

const LINEAR = {
  soma: {
    fn: NAME.soma,
    op: '+',
    isBase: (k) => k === 1,
    test: (k) => `n == 1 → ${k} == 1`,
    testLabel: 'n == 1',
    baseValue: () => 1,
    combine: (k, r) => k + r,
    baseText: (k) => tr(`${k} == 1 é verdadeiro: é o caso base. soma(1) = 1, sem nenhuma nova chamada, e a recursão termina aqui.`, `${k} == 1 is true: it is the base case. sum(1) = 1, with no new call, and the recursion ends here.`),
    stepText: (k) => tr(`${k} == 1 é falso: não é o caso base. Para calcular soma(${k}) é preciso saber soma(${k - 1}), então o método chama a si mesmo.`, `${k} == 1 is false: it is not the base case. To compute sum(${k}) we need sum(${k - 1}), so the method calls itself.`),
    callText: (k, child) => tr(`Para calcular ${k} + ${child}, antes é preciso saber quanto vale ${child}. A chamada ${child} entra na pilha e a de ${NAME.soma}(${k}) fica esperando, com a conta ${k} + ${child} pendente.`, `To compute ${k} + ${child}, we first need to know what ${child} is worth. The call ${child} goes onto the stack and the one for ${NAME.soma}(${k}) waits, with the calculation ${k} + ${child} pending.`),
    baseReturn: (name) => tr(`${name} devolve 1, sem nenhuma nova chamada. Ela sai da pilha e o valor volta para a chamada de baixo.`, `${name} returns 1, with no new call. It leaves the stack and the value goes back to the call below.`),
    backText: (k, r, total, child) => tr(`${child} voltou com ${r}. A conta pendente ${k} + ${child} vira ${k} + ${r} = ${total}. ${NAME.soma}(${k}) devolve ${total} e sai da pilha.`, `${child} came back with ${r}. The pending calculation ${k} + ${child} becomes ${k} + ${r} = ${total}. ${NAME.soma}(${k}) returns ${total} and leaves the stack.`),
    code: { test: 1, base: 2, step: 4 },
    entry: (n) => tr(`O programa chama soma(${n}). A chamada entra na pilha com n = ${n} e começa a executar.`, `The program calls sum(${n}). The call goes onto the stack with n = ${n} and starts running.`),
    end: (n, total, calls) => tr(`Todas as chamadas voltaram e a pilha ficou vazia: soma(${n}) devolveu ${total} ao programa. Foram ${calls} chamadas, com até ${calls} frames na pilha ao mesmo tempo.`, `All the calls came back and the stack is empty: sum(${n}) returned ${total} to the program. There were ${calls} calls, with up to ${calls} frames on the stack at the same time.`),
    out: (n, total) => `${NAME.soma}(${n}) = ${total}`,
    noteOf: (k, child) => `${k} + ${child}`,
  },
  fatorial: {
    fn: NAME.fatorial,
    op: '×',
    isBase: (k) => k < 1,
    testLabel: 'n < 1',
    baseValue: () => 1,
    combine: (k, r) => k * r,
    baseText: (k) => tr(`${k} < 1 é verdadeiro: é o caso base. fatorial(0) = 1, sem nenhuma nova chamada, e a recursão termina aqui.`, `${k} < 1 is true: it is the base case. factorial(0) = 1, with no new call, and the recursion ends here.`),
    stepText: (k) => tr(`${k} < 1 é falso: não é o caso base. ${k}! = ${k} × ${k - 1}!, então o método chama fatorial(${k - 1}).`, `${k} < 1 is false: it is not the base case. ${k}! = ${k} × ${k - 1}!, so the method calls factorial(${k - 1}).`),
    callText: (k, child) => tr(`Para calcular ${k} × ${child}, antes é preciso saber quanto vale ${child}. A chamada ${child} entra na pilha e a de ${NAME.fatorial}(${k}) fica esperando, com a conta ${k} × ${child} pendente.`, `To compute ${k} × ${child}, we first need to know what ${child} is worth. The call ${child} goes onto the stack and the one for ${NAME.fatorial}(${k}) waits, with the calculation ${k} × ${child} pending.`),
    baseReturn: (name) => tr(`${name} devolve 1 (0! = 1), sem nenhuma nova chamada. Ela sai da pilha e o valor volta para a chamada de baixo.`, `${name} returns 1 (0! = 1), with no new call. It leaves the stack and the value goes back to the call below.`),
    backText: (k, r, total, child) => tr(`${child} voltou com ${r}. A conta pendente ${k} × ${child} vira ${k} × ${r} = ${total}. ${NAME.fatorial}(${k}) devolve ${total} e sai da pilha.`, `${child} came back with ${r}. The pending calculation ${k} × ${child} becomes ${k} × ${r} = ${total}. ${NAME.fatorial}(${k}) returns ${total} and leaves the stack.`),
    code: { test: 1, base: 2, step: 4 },
    entry: (n) => tr(`O programa chama fatorial(${n}). A chamada entra na pilha com n = ${n} e começa a executar.`, `The program calls factorial(${n}). The call goes onto the stack with n = ${n} and starts running.`),
    end: (n, total, calls) => tr(`Todas as chamadas voltaram e a pilha ficou vazia: fatorial(${n}) devolveu ${total} ao programa. Foram ${calls} chamadas, com até ${calls} frames na pilha ao mesmo tempo.`, `All the calls came back and the stack is empty: factorial(${n}) returned ${total} to the program. There were ${calls} calls, with up to ${calls} frames on the stack at the same time.`),
    out: (n, total) => `${NAME.fatorial}(${n}) = ${total}`,
    noteOf: (k, child) => `${k} × ${child}`,
  },
};

function linearSteps(kind, n) {
  const spec = LINEAR[kind];
  const t = createTracer();
  const name = (k) => `${spec.fn}(${k})`;
  const head = name(n);
  const expression = (tail) => t.chain(head, spec.op, tail);

  const enter = (k, line, title, description) => {
    const frame = {
      name: name(k), term: String(k), vars: { n: k }, note: '', result: undefined,
    };
    t.push(frame);
    t.add(line, title, description, 'neutral', { action: actionPush(frame.name), expression: expression(frame.name) });
    return frame;
  };

  const body = (k, frame) => {
    const base = spec.isBase(k);
    t.add(spec.code.test, tr(`SE ${spec.testLabel}`, `IF ${spec.testLabel}`), base ? spec.baseText(k) : spec.stepText(k), 'comparison', { expression: expression(frame.name) });
    if (base) {
      const value = spec.baseValue(k);
      frame.result = value;
      frame.note = String(value);
      t.add(spec.code.base, tr(`Retorna ${value}`, `Returns ${value}`), spec.baseReturn(frame.name), 'success', { action: actionReturn(value), expression: expression(String(value)) });
      return value;
    }
    const childName = name(k - 1);
    frame.note = spec.noteOf(k, childName);
    const child = enter(k - 1, spec.code.step, tr(`Chama ${childName}`, `Calls ${childName}`), spec.callText(k, childName));
    const r = body(k - 1, child);
    t.pop();
    const total = spec.combine(k, r);
    frame.note = spec.noteOf(k, r);
    frame.result = total;
    t.add(spec.code.step, tr(`Retorna ${total}`, `Returns ${total}`), spec.backText(k, r, total, childName), 'success', {
      action: actionReturn(total, tr(`Faz o ${spec.noteOf(k, r)} = ${total}`, `Computes ${spec.noteOf(k, r)} = ${total}`)),
      expression: expression(String(total)),
    });
    return total;
  };

  const root = enter(n, 0, tr(`Chamada ${head}`, `Call ${head}`), spec.entry(n));
  const total = body(n, root);
  t.pop();
  const calls = kind === 'soma' ? n : n + 1;
  t.log.push(spec.out(n, total));
  t.add(-1, tr('Pilha vazia', 'Empty stack'), spec.end(n, total, calls), 'done', {
    variables: { retorno: fmt(total) }, expression: `${head} = ${total}`, action: actionReturn(total, tr('Devolve ao programa', 'Returns to the program')),
  });
  return t.finish();
}

// ---------------------------------------------------------------------------
// Maior elemento de um vetor: maior(v, i) olha o trecho v[0..i].
// ---------------------------------------------------------------------------

function maiorSteps(vetor) {
  const v = [...vetor];
  const t = createTracer();
  const name = (i) => `${NAME.maior}(v, ${i})`;
  const best = [];
  v.forEach((value, i) => { best[i] = i === 0 || value > v[best[i - 1]] ? i : best[i - 1]; });
  const last = v.length - 1;

  const put = (line, title, description, tone, frame, extra = {}) => t.add(line, title, description, tone, {
    values: [...v],
    pointers: frame ? { i: frame.vars.i } : {},
    outsideIndices: frame ? range(v.length).filter((index) => index > frame.vars.i) : [],
    ...extra,
  });

  const run = (i, frame) => {
    const base = i === 0;
    put(1, 'SE i == 0', base
      ? tr(`i == 0 é verdadeiro: o trecho v[0..0] tem um só elemento, v[0] = ${fmt(v[0])}. É o caso base: o maior dele é ele mesmo.`, `i == 0 is true: the range v[0..0] has a single element, v[0] = ${fmt(v[0])}. It is the base case: the largest of it is itself.`)
      : tr(`i == 0 é falso: o trecho v[0..${i}] tem mais de um elemento. O maior dele é o maior entre v[${i}] e o maior de v[0..${i - 1}].`, `i == 0 is false: the range v[0..${i}] has more than one element. The largest of it is the larger of v[${i}] and the largest of v[0..${i - 1}].`), 'comparison', frame);
    if (base) {
      frame.result = v[0];
      put(2, tr(`Retorna ${fmt(v[0])}`, `Returns ${fmt(v[0])}`), tr(`${name(0)} devolve v[0] = ${fmt(v[0])}, sem nenhuma nova chamada. Ela sai da pilha e o valor volta para a chamada de baixo.`, `${name(0)} returns v[0] = ${fmt(v[0])}, with no new call. It leaves the stack and the value goes back to the call below.`), 'success', frame, { foundIndices: [0], action: actionReturn(fmt(v[0])) });
      return v[0];
    }
    const childName = name(i - 1);
    const child = { name: childName, vars: { i: i - 1, maiorResto: NONE }, note: '' };
    frame.note = tr(`espera ${childName}`, `waiting for ${childName}`);
    t.push(child);
    put(4, tr(`Chama ${childName}`, `Calls ${childName}`), tr(`Para achar o maior de v[0..${i}], antes é preciso o maior de v[0..${i - 1}]. A chamada ${childName} entra na pilha e ${name(i)} fica esperando, com v[${i}] = ${fmt(v[i])} guardado para comparar na volta.`, `To find the largest of v[0..${i}], we first need the largest of v[0..${i - 1}]. The call ${childName} goes onto the stack and ${name(i)} waits, with v[${i}] = ${fmt(v[i])} kept to compare on the way back.`), 'neutral', child, { action: actionPush(childName) });
    const m = run(i - 1, child);
    t.pop();
    frame.vars.maiorResto = m;
    frame.note = '';
    put(4, tr(`maiorResto ← ${fmt(m)}`, `largestRest ← ${fmt(m)}`), tr(`${childName} voltou com ${fmt(m)}: maiorResto recebe ${fmt(m)}, o maior de v[0..${i - 1}]. Falta saber se v[${i}] = ${fmt(v[i])} supera esse valor.`, `${childName} came back with ${fmt(m)}: largestRest receives ${fmt(m)}, the largest of v[0..${i - 1}]. We still need to know whether v[${i}] = ${fmt(v[i])} beats that value.`), 'update', frame, { foundIndices: [best[i - 1]] });
    const wins = v[i] > m;
    put(5, tr('SE v[i] > maiorResto', 'IF v[i] > largestRest'), wins
      ? tr(`v[${i}] > maiorResto → ${fmt(v[i])} > ${fmt(m)} é verdadeiro. v[${i}] passa a ser o maior de v[0..${i}].`, `v[${i}] > largestRest → ${fmt(v[i])} > ${fmt(m)} is true. v[${i}] becomes the largest of v[0..${i}].`)
      : tr(`v[${i}] > maiorResto → ${fmt(v[i])} > ${fmt(m)} é falso. O maior de v[0..${i}] continua sendo ${fmt(m)}.`, `v[${i}] > largestRest → ${fmt(v[i])} > ${fmt(m)} is false. The largest of v[0..${i}] is still ${fmt(m)}.`), 'comparison', frame, {
      compare: {
        left: { label: `v[${i}]`, value: fmt(v[i]) }, op: '>', right: { label: tr('maiorResto', 'largestRest'), value: fmt(m) }, result: wins,
      },
      comparedIndices: [i],
      foundIndices: [best[i - 1]],
    });
    const out = wins ? v[i] : m;
    frame.result = out;
    put(wins ? 6 : 8, tr(`Retorna ${fmt(out)}`, `Returns ${fmt(out)}`), wins
      ? tr(`${name(i)} devolve v[${i}] = ${fmt(out)} e sai da pilha.`, `${name(i)} returns v[${i}] = ${fmt(out)} and leaves the stack.`)
      : tr(`${name(i)} devolve maiorResto = ${fmt(out)} e sai da pilha.`, `${name(i)} returns largestRest = ${fmt(out)} and leaves the stack.`), 'success', frame, { foundIndices: [best[i]], action: actionReturn(fmt(out)) });
    return out;
  };

  const root = { name: name(last), vars: { i: last, maiorResto: NONE }, note: '' };
  t.push(root);
  put(0, tr(`Chamada ${root.name}`, `Call ${root.name}`), tr(`O programa chama ${root.name}: o vetor tem ${v.length} posições e a chamada olha o trecho inteiro, v[0..${last}].`, `The program calls ${root.name}: the array has ${v.length} positions and the call looks at the whole range, v[0..${last}].`), 'neutral', root, { action: actionPush(root.name) });
  const result = run(last, root);
  t.pop();
  t.log.push(`${name(last)} = ${fmt(result)}`);
  put(-1, tr('Pilha vazia', 'Empty stack'), tr(`Todas as chamadas voltaram e a pilha ficou vazia: ${name(last)} devolveu ${fmt(result)}, o maior elemento do vetor (posição ${best[last]}).`, `All the calls came back and the stack is empty: ${name(last)} returned ${fmt(result)}, the largest element of the array (position ${best[last]}).`), 'done', null, {
    variables: { retorno: fmt(result) }, foundIndices: [best[last]], action: actionReturn(fmt(result), tr('Devolve ao programa', 'Returns to the program')),
  });
  return t.finish();
}

// ---------------------------------------------------------------------------
// Inverter uma string: inverter(texto) = inverter(texto sem o 1º caractere) + o 1º caractere.
// ---------------------------------------------------------------------------

function inverterSteps(text) {
  const chars = [...text];
  const n = chars.length;
  const t = createTracer();
  const sub = (d) => chars.slice(d).join('');
  const name = (d) => `${NAME.inverter}(${q(sub(d))})`;

  const put = (line, title, description, tone, depth, extra = {}) => t.add(line, title, description, tone, {
    values: [...chars],
    outsideIndices: depth === null ? [] : range(depth),
    activeIndices: depth === null ? [] : [depth],
    ...extra,
  });

  const run = (d, frame) => {
    const base = d === n - 1;
    put(1, tr('SE tamanho(texto) ≤ 1', 'IF length(text) ≤ 1'), base
      ? tr(`tamanho(${q(sub(d))}) = ${n - d} ≤ 1 é verdadeiro. Um texto de um só caractere já está invertido: é o caso base.`, `length(${q(sub(d))}) = ${n - d} ≤ 1 is true. A one-character text is already reversed: it is the base case.`)
      : tr(`tamanho(${q(sub(d))}) = ${n - d} ≤ 1 é falso. Para inverter ${q(sub(d))}, inverta ${q(sub(d + 1))} e coloque "${chars[d]}" no fim.`, `length(${q(sub(d))}) = ${n - d} ≤ 1 is false. To reverse ${q(sub(d))}, reverse ${q(sub(d + 1))} and put "${chars[d]}" at the end.`), 'comparison', d);
    if (base) {
      frame.result = q(chars[d]);
      put(2, tr(`Retorna ${q(chars[d])}`, `Returns ${q(chars[d])}`), tr(`${name(d)} devolve o próprio texto, ${q(chars[d])}, sem nenhuma nova chamada. Ela sai da pilha e o valor volta para a chamada de baixo.`, `${name(d)} returns the text itself, ${q(chars[d])}, with no new call. It leaves the stack and the value goes back to the call below.`), 'success', d, { strip: { label: tr('retorna', 'returns'), text: chars[d] }, action: actionReturn(q(chars[d])) });
      return chars[d];
    }
    const childName = name(d + 1);
    const child = { name: childName, vars: { texto: q(sub(d + 1)), invertido: NONE }, note: '' };
    frame.note = `${childName} + ${q(chars[d])}`;
    t.push(child);
    put(4, tr(`Chama ${childName}`, `Calls ${childName}`), tr(`${name(d)} tira o primeiro caractere, "${chars[d]}", e chama ${childName}. O "${chars[d]}" fica guardado nesta chamada, que espera a volta para colocá-lo no fim.`, `${name(d)} takes off the first character, "${chars[d]}", and calls ${childName}. The "${chars[d]}" stays kept in this call, which waits for the return to put it at the end.`), 'neutral', d + 1, { action: actionPush(childName) });
    const rest = run(d + 1, child);
    t.pop();
    frame.vars.invertido = q(rest);
    frame.note = `${q(rest)} + ${q(chars[d])}`;
    put(4, tr(`invertido ← ${q(rest)}`, `reversed ← ${q(rest)}`), tr(`${childName} voltou com ${q(rest)}: invertido recebe ${q(rest)}, o resto do texto já invertido.`, `${childName} came back with ${q(rest)}: reversed receives ${q(rest)}, the rest of the text already reversed.`), 'update', d, { strip: { label: tr('invertido', 'reversed'), text: rest } });
    const out = rest + chars[d];
    frame.result = q(out);
    put(5, tr(`Retorna ${q(out)}`, `Returns ${q(out)}`), tr(`invertido + texto[0] → ${q(rest)} + ${q(chars[d])} = ${q(out)}. ${name(d)} devolve ${q(out)} e sai da pilha.`, `reversed + text[0] → ${q(rest)} + ${q(chars[d])} = ${q(out)}. ${name(d)} returns ${q(out)} and leaves the stack.`), 'success', d, { strip: { label: tr('retorna', 'returns'), text: out, appended: true }, action: actionReturn(q(out), tr(`Faz ${q(rest)} + ${q(chars[d])}`, `Computes ${q(rest)} + ${q(chars[d])}`)) });
    return out;
  };

  const root = {
    name: name(0), vars: { texto: q(text), invertido: NONE }, note: '',
  };
  t.push(root);
  put(0, tr(`Chamada ${root.name}`, `Call ${root.name}`), tr(`O programa chama ${root.name}: o texto tem ${n} ${n === 1 ? 'caractere' : 'caracteres'}.`, `The program calls ${root.name}: the text has ${n} ${n === 1 ? 'character' : 'characters'}.`), 'neutral', 0, { action: actionPush(root.name) });
  const result = run(0, root);
  t.pop();
  t.log.push(`${name(0)} = ${q(result)}`);
  put(-1, tr('Pilha vazia', 'Empty stack'), tr(`Todas as chamadas voltaram e a pilha ficou vazia: ${name(0)} devolveu ${q(result)}. Cada letra esperou na sua chamada até a volta para ir ao fim do resultado.`, `All the calls came back and the stack is empty: ${name(0)} returned ${q(result)}. Each letter waited in its call until the way back to go to the end of the result.`), 'done', null, {
    variables: { retorno: q(result) }, strip: { label: tr('resultado', 'result'), text: result }, action: actionReturn(q(result), tr('Devolve ao programa', 'Returns to the program')),
  });
  return t.finish();
}

// ---------------------------------------------------------------------------
// Iterativo × recursivo: a mesma soma com um laço, e o que cada versão usa da pilha.
// ---------------------------------------------------------------------------

function iterativoSteps(n) {
  const t = createTracer();
  const name = `${NAME.somaIterativo}(${n})`;
  const frame = { name, vars: { n, soma: NONE, i: NONE }, note: '', result: undefined };
  const total = (n * (n + 1)) / 2;

  const boxes = (final) => ({
    final,
    totals: [
      {
        label: tr('Recursivo', 'Recursive'), value: tr(`${n} frames`, `${n} frames`), note: tr(`${n} chamadas: a pilha chega a ${n} frames, um para cada soma pendente`, `${n} calls: the stack reaches ${n} frames, one for each pending sum`),
      },
      {
        label: tr('Iterativo', 'Iterative'), value: tr('1 frame', '1 frame'), note: tr('uma só chamada: o laço repete a soma e a pilha nunca passa de 1 frame', 'a single call: the loop repeats the sum and the stack never goes past 1 frame'),
      },
    ],
  });

  t.push(frame);
  t.add(0, tr(`Chamada ${name}`, `Call ${name}`), tr(`O programa chama ${name}. A chamada entra na pilha com n = ${n}. É a única que vai existir: o laço não faz outras chamadas.`, `The program calls ${name}. The call goes onto the stack with n = ${n}. It is the only one there will be: the loop makes no other calls.`), 'neutral', { action: actionPush(name) });
  frame.vars.soma = 0;
  t.add(1, 'soma ← 0', tr('soma recebe 0: é o acumulador da conta, uma variável local do mesmo frame.', 'sum receives 0: it is the accumulator of the calculation, a local variable of the same frame.'), 'update');
  let soma = 0;
  for (let i = 1; i <= n; i += 1) {
    frame.vars.i = i;
    t.add(2, tr(`PARA i (i = ${i})`, `FOR i (i = ${i})`), tr(`i recebe ${i} e a condição i ≤ ${n} é verdadeira: o laço entra. Nenhuma chamada nova: o mesmo frame continua.`, `i receives ${i} and the condition i ≤ ${n} is true: the loop is entered. No new call: the same frame goes on.`), 'reading');
    soma += i;
    frame.vars.soma = soma;
    t.add(3, 'soma ← soma + i', tr(`soma recebe ${soma - i} + ${i} = ${soma}. O valor fica na variável soma, e não numa conta pendente na pilha.`, `sum receives ${soma - i} + ${i} = ${soma}. The value stays in the sum variable, and not in a pending calculation on the stack.`), 'update');
  }
  frame.vars.i = n + 1;
  t.add(4, tr('FIM PARA', 'END FOR'), tr(`i recebe ${n + 1} e a condição i ≤ ${n} é falsa: o laço termina.`, `i receives ${n + 1} and the condition i ≤ ${n} is false: the loop ends.`), 'success');
  frame.result = soma;
  t.add(5, tr(`Retorna ${soma}`, `Returns ${soma}`), tr(`${name} devolve ${soma} e sai da pilha.`, `${name} returns ${soma} and leaves the stack.`), 'success', { action: actionReturn(soma) });
  t.pop();
  t.log.push(`${name} = ${total}`);
  t.add(-1, tr('Pilha vazia', 'Empty stack'), tr(`A pilha ficou vazia: ${name} devolveu ${total}, o mesmo valor de soma(${n}) recursiva. A diferença está no custo de memória: 1 frame aqui contra ${n} na recursão.`, `The stack is empty: ${name} returned ${total}, the same value as the recursive sum(${n}). The difference is in the memory cost: 1 frame here against ${n} in the recursion.`), 'done', { variables: { retorno: fmt(total) }, action: actionReturn(total, tr('Devolve ao programa', 'Returns to the program')) });
  const steps = t.finish();
  return steps.map((item, index) => ({ ...item, summary: boxes(index === steps.length - 1) }));
}

// ---------------------------------------------------------------------------
// Caso base inalcançável: f(n) chama f(n + 1) e o caso base é n == 0.
// ---------------------------------------------------------------------------

function overflowSteps(start) {
  const t = createTracer();
  const name = (k) => `f(${k})`;
  const OVERFLOW = Symbol('overflow');
  const reachable = start <= 0;

  const run = (k, frame) => {
    const base = k === 0;
    t.add(1, 'SE n == 0', base
      ? tr('0 == 0 é verdadeiro: é o caso base, e a recursão termina aqui.', '0 == 0 is true: it is the base case, and the recursion ends here.')
      : k > 0
        ? tr(`${k} == 0 é falso. A próxima chamada é f(${k + 1}): n está crescendo e se afastando de 0, o caso base nunca será alcançado.`, `${k} == 0 is false. The next call is f(${k + 1}): n is growing and moving away from 0, so the base case will never be reached.`)
        : tr(`${k} == 0 é falso. A próxima chamada é f(${k + 1}), mais perto de 0: o caso base ainda é alcançável.`, `${k} == 0 is false. The next call is f(${k + 1}), closer to 0: the base case can still be reached.`), 'comparison');
    if (base) {
      frame.result = 0;
      t.add(2, tr('Retorna 0', 'Returns 0'), tr('f(0) devolve 0, sem nenhuma nova chamada. Ela sai da pilha e o valor volta para a chamada de baixo.', 'f(0) returns 0, with no new call. It leaves the stack and the value goes back to the call below.'), 'success', { action: actionReturn(0) });
      return 0;
    }
    frame.note = name(k + 1);
    if (t.depth() >= STACK_LIMIT) {
      t.log.push('StackOverflowError');
      t.add(4, 'StackOverflowError', reachable
        ? tr(`A pilha já tem ${STACK_LIMIT} frames, o limite deste simulador: não cabe a chamada f(${k + 1}). O caso base seria alcançável (n chega a 0), mas a recursão é funda demais para a pilha: recursão correta, porém profunda demais.`, `The stack already has ${STACK_LIMIT} frames, the limit of this simulator: the call f(${k + 1}) does not fit. The base case would be reachable (n gets to 0), but the recursion is too deep for the stack: correct recursion, but too deep.`)
        : tr(`A pilha já tem ${STACK_LIMIT} frames, o limite deste simulador: não cabe a chamada f(${k + 1}). Como n só cresce, o caso base nunca chegaria, e nenhuma pilha seria grande o bastante. No Java real o limite é de milhares de frames, mas o fim é o mesmo.`, `The stack already has ${STACK_LIMIT} frames, the limit of this simulator: the call f(${k + 1}) does not fit. Since n only grows, the base case would never arrive, and no stack would be big enough. In real Java the limit is thousands of frames, but the ending is the same.`), 'error', { overflow: true, ghost: name(k + 1), action: { kind: 'error', label: tr('Estouro da pilha', 'Stack overflow'), text: 'StackOverflowError' } });
      return OVERFLOW;
    }
    const child = { name: name(k + 1), vars: { n: k + 1 }, note: '' };
    t.push(child);
    t.add(4, tr(`Chama ${child.name}`, `Calls ${child.name}`), tr(`${name(k)} chama ${child.name}: a chamada entra na pilha (${t.depth()} de ${STACK_LIMIT} frames) e a de baixo fica esperando.`, `${name(k)} calls ${child.name}: the call goes onto the stack (${t.depth()} of ${STACK_LIMIT} frames) and the one below waits.`), 'neutral', { action: actionPush(child.name) });
    const r = run(k + 1, child);
    if (r === OVERFLOW) return OVERFLOW;
    t.pop();
    frame.result = r;
    t.add(4, tr(`Retorna ${r}`, `Returns ${r}`), tr(`${child.name} voltou com ${r}. ${name(k)} devolve o mesmo valor e sai da pilha.`, `${child.name} came back with ${r}. ${name(k)} returns the same value and leaves the stack.`), 'success', { action: actionReturn(r) });
    return r;
  };

  const root = { name: name(start), vars: { n: start }, note: '' };
  t.push(root);
  t.add(0, tr(`Chamada ${root.name}`, `Call ${root.name}`), tr(`O programa chama ${root.name}. A pilha comporta ${STACK_LIMIT} frames neste simulador.`, `The program calls ${root.name}. The stack holds ${STACK_LIMIT} frames in this simulator.`), 'neutral', { action: actionPush(root.name) });
  const result = run(start, root);
  if (result !== OVERFLOW) {
    t.pop();
    t.log.push(`${name(start)} = ${result}`);
    t.add(-1, tr('Pilha vazia', 'Empty stack'), tr(`Todas as chamadas voltaram e a pilha ficou vazia: ${name(start)} devolveu ${result}. Com n ≤ 0, cada chamada se aproxima do caso base e a pilha dá conta.`, `All the calls came back and the stack is empty: ${name(start)} returned ${result}. With n ≤ 0, each call gets closer to the base case and the stack copes.`), 'done', { variables: { retorno: result }, action: actionReturn(result, tr('Devolve ao programa', 'Returns to the program')) });
  }
  return t.finish(1).map((item) => ({ ...item, limit: STACK_LIMIT }));
}

// ---------------------------------------------------------------------------

export function buildSteps(algorithmId, data) {
  switch (algorithmId) {
    case 'soma': return linearSteps('soma', data.n);
    case 'fatorial': return linearSteps('fatorial', data.fat);
    case 'maior': return maiorSteps(data.vetor);
    case 'inverter': return inverterSteps(data.texto);
    case 'iterativo': return iterativoSteps(data.n);
    case 'overflow': return overflowSteps(data.inicio);
    default: return linearSteps('soma', data.n);
  }
}
