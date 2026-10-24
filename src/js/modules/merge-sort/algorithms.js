import {
  NONE, ascending, clone, fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf, withRepeats,
} from '../shared/sort-steps.js';
import { extendVariableNames, locale, tr } from '../../core/i18n.js';

extendVariableNames({ inicio: 'start', fim: 'end' });

// Pseudocódigo da aula (slides 40 e 41): mergeSort divide o trecho em duas metades e intercala,
// e intercala copia a 1ª metade para B, a 2ª metade invertida, e junta as duas de fora para dentro.
const MERGE_CODE = [
  tr('FUNÇÃO mergeSort(vetor, inicio, fim)', 'FUNCTION mergeSort(array, start, end)'),
  tr('  SE inicio < fim ENTÃO', '  IF start < end THEN'),
  tr('    meio ← parte inteira de (inicio + fim) / 2', '    mid ← integer part of (start + end) / 2'),
  tr('    mergeSort(vetor, inicio, meio)', '    mergeSort(array, start, mid)'),
  tr('    mergeSort(vetor, meio + 1, fim)', '    mergeSort(array, mid + 1, end)'),
  tr('    intercala(vetor, inicio, meio, fim)', '    merge(array, start, mid, end)'),
  tr('  FIM SE', '  END IF'),
  tr('FIM', 'END'),
];

const INTERCALA_CODE = [
  tr('FUNÇÃO intercala(vetor, inicio, meio, fim)', 'FUNCTION merge(array, start, mid, end)'),
  tr('  PARA i de inicio até meio FAÇA', '  FOR i from start to mid DO'),
  tr('    B[i] ← vetor[i]', '    B[i] ← array[i]'),
  tr('  FIM PARA', '  END FOR'),
  tr('  PARA j de meio + 1 até fim FAÇA', '  FOR j from mid + 1 to end DO'),
  tr('    B[fim + meio + 1 - j] ← vetor[j]', '    B[end + mid + 1 - j] ← array[j]'),
  tr('  FIM PARA', '  END FOR'),
  tr('  i ← inicio', '  i ← start'),
  tr('  j ← fim', '  j ← end'),
  tr('  PARA k de inicio até fim FAÇA', '  FOR k from start to end DO'),
  tr('    SE B[i] ≤ B[j] ENTÃO', '    IF B[i] ≤ B[j] THEN'),
  tr('      vetor[k] ← B[i]', '      array[k] ← B[i]'),
  tr('      i ← i + 1', '      i ← i + 1'),
  tr('    SENÃO', '    ELSE'),
  tr('      vetor[k] ← B[j]', '      array[k] ← B[j]'),
  tr('      j ← j - 1', '      j ← j - 1'),
  tr('    FIM SE', '    END IF'),
  tr('  FIM PARA', '  END FOR'),
  tr('FIM', 'END'),
];

// As duas funções juntas, com uma linha em branco entre elas.
const FULL_CODE = [...MERGE_CODE, '', ...INTERCALA_CODE];
const OFFSET = MERGE_CODE.length + 1;

// Linhas de MERGE_CODE e de INTERCALA_CODE (base 0).
const M = { call: 0, test: 1, meio: 2, left: 3, right: 4, merge: 5, end: 7 };
const I = {
  head: 0, loopI: 1, copyI: 2, endI: 3, loopJ: 4, copyJ: 5, endJ: 6, initI: 7, initJ: 8, loopK: 9, test: 10, takeI: 11, incI: 12, takeJ: 14, decJ: 15, endK: 17, end: 18,
};

export const algorithms = [
  {
    id: 'divide', title: tr('Dividir o vetor', 'Split the array'), menuLabel: tr('Dividir o vetor', 'Split the array'), group: tr('Como funciona', 'How it works'), number: '01',
    description: tr('Divida o vetor ao meio e, depois, cada metade de novo, até sobrarem trechos de um só elemento. É a estratégia dividir e conquistar: um problema grande vira vários problemas triviais.', 'Split the array in half and then each half again, until only one-element ranges are left. It is the divide-and-conquer strategy: one big problem becomes many trivial problems.'),
    interaction: tr('Avance nível por nível e veja o meio de cada trecho. Com 8 elementos são 4 níveis; com 16, apenas 5.', 'Go level by level and see the middle of each range. With 8 elements there are 4 levels; with 16, only 5.'),
    complexity: { time: 'O(n)', space: 'O(log n)', note: tr('Dividir não compara nada: são 2n − 1 chamadas (n trechos de um elemento e n − 1 divisões), e a pilha de chamadas chega a ⌈log₂ n⌉ + 1 níveis de profundidade.', 'Splitting compares nothing: there are 2n − 1 calls (n one-element ranges and n − 1 splits), and the call stack reaches ⌈log₂ n⌉ + 1 levels deep.') },
    pseudocode: MERGE_CODE,
  },
  {
    id: 'intercala', title: tr('Intercalar duas metades', 'Merge two halves'), menuLabel: tr('Intercalar', 'Merge'), group: tr('Como funciona', 'How it works'), number: '02',
    description: tr('Junte duas metades já ordenadas em um único trecho ordenado. A 1ª metade é copiada para B, a 2ª é copiada invertida, e os índices i e j caminham de fora para dentro, sempre levando o menor valor de volta ao vetor.', 'Join two already sorted halves into a single sorted range. The 1st half is copied to B, the 2nd is copied reversed, and the indices i and j walk from the outside in, always taking the smaller value back into the array.'),
    interaction: tr('Escolha onde o vetor se divide (a posição meio) ou clique em uma célula. As duas metades já aparecem ordenadas, como depois das chamadas recursivas.', 'Choose where the array splits (the mid position) or click a cell. The two halves already appear sorted, as after the recursive calls.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('O laço de k roda uma vez por elemento do trecho, com uma comparação cada: n comparações. B guarda uma cópia de todo o trecho, por isso o espaço extra é O(n).', 'The k loop runs once per element of the range, with one comparison each: n comparisons. B holds a copy of the whole range, so the extra space is O(n).') },
    pseudocode: INTERCALA_CODE,
  },
  {
    id: 'merge-sort', title: tr('Merge Sort', 'Merge Sort'), menuLabel: tr('Merge Sort', 'Merge Sort'), group: tr('Como funciona', 'How it works'), number: '03',
    description: tr('Divida o vetor ao meio, ordene cada metade com uma chamada recursiva e intercale as duas. Os trechos de um elemento já estão ordenados, e a ordenação "sobe" pelas intercalações.', 'Split the array in half, sort each half with a recursive call and merge the two. One-element ranges are already sorted, and the sorting "climbs up" through the merges.'),
    interaction: tr('Acompanhe a pilha de chamadas e os marcadores início, meio, fim e k. O que está em verde já foi intercalado.', 'Follow the call stack and the markers start, mid, end and k. What is in green has already been merged.'),
    complexity: { time: 'O(n log n)', space: 'O(n)', note: tr('São ⌈log₂ n⌉ níveis de intercalação e cada nível compara no máximo n elementos. B ocupa até n posições e a pilha de chamadas soma O(log n).', 'There are ⌈log₂ n⌉ levels of merging and each level compares at most n elements. B takes up to n positions and the call stack adds O(log n).') },
    pseudocode: FULL_CODE,
  },
  {
    id: 'counting', title: tr('Contando as operações', 'Counting the operations'), menuLabel: tr('Complexidade de tempo', 'Time complexity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '04',
    description: tr('Conte as comparações do intercala em cada nível da recursão e veja por que o total é da ordem de n · log₂ n.', 'Count the comparisons of merge at each level of the recursion and see why the total is of the order of n · log₂ n.'),
    interaction: tr('Gere vetores de tamanhos diferentes: dobrar n acrescenta apenas um nível de intercalações.', 'Generate arrays of different sizes: doubling n adds only one level of merges.'),
    complexity: { time: 'O(n log n)', space: 'O(n)', note: tr('Cada nível intercala todos os elementos que não estão sozinhos (no máximo n comparações), e há ⌈log₂ n⌉ níveis de intercalação: T(n) ≤ n · ⌈log₂ n⌉.', 'Each level merges all the elements that are not alone (at most n comparisons), and there are ⌈log₂ n⌉ levels of merging: T(n) ≤ n · ⌈log₂ n⌉.') },
    pseudocode: FULL_CODE,
  },
  {
    id: 'adaptability', title: tr('Adaptabilidade', 'Adaptivity'), menuLabel: tr('Adaptabilidade', 'Adaptivity'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '05',
    description: tr('Execute o algoritmo em três vetores com os mesmos valores em ordens diferentes e compare os contadores.', 'Run the algorithm on three arrays with the same values in different orders and compare the counters.'),
    interaction: tr('Avance intercalação por intercalação e observe que as comparações e as cópias são idênticas nos três vetores.', 'Step through merge by merge and notice that the comparisons and the copies are identical in the three arrays.'),
    complexity: { time: 'O(n log n)', space: 'O(n)', note: tr('Melhor, médio e pior caso fazem exatamente as mesmas comparações e cópias: o algoritmo sempre divide e intercala tudo, qualquer que seja a ordem inicial. O Merge Sort não é adaptável.', 'Best, average and worst case make exactly the same comparisons and copies: the algorithm always splits and merges everything, whatever the initial order. Merge Sort is not adaptive.') },
    pseudocode: FULL_CODE,
  },
  {
    id: 'stability', title: tr('Estabilidade', 'Stability'), menuLabel: tr('Estabilidade', 'Stability'), group: tr('Análise do algoritmo', 'Analysis of the algorithm'), number: '06',
    description: tr('Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.', 'Repeated values get a letter that marks the original order. See whether the algorithm preserves that order.'),
    interaction: tr('Use "Gerar exemplo" para criar um vetor com valores repetidos e acompanhe o encontro de dois iguais: o teste ≤ leva o da esquerda primeiro. "Ver o caso que inverte" mostra a exceção da cópia invertida.', 'Use "Generate example" to create an array with repeated values and follow the meeting of two equals: the ≤ test takes the left one first. "See the case that reverses" shows the exception of the reversed copy.'),
    complexity: { time: 'O(n log n)', space: 'O(n)', note: tr('No empate, B[i] ≤ B[j] leva o da esquerda, que veio antes, e a ordem dos iguais de metades diferentes é preservada. Mas a 2ª metade é copiada invertida: quando a 1ª metade acaba, i passa a apontar o último valor da 2ª metade e, se ele for igual aos que sobram ali, sai antes deles. Este intercala não é estável em todos os vetores.', 'On a tie, B[i] ≤ B[j] takes the left one, which came before, and the order of equals from different halves is preserved. But the 2nd half is copied reversed: when the 1st half runs out, i starts pointing to the last value of the 2nd half and, if it is equal to the ones left there, it comes out before them. This merge is not stable on every array.') },
    pseudocode: FULL_CODE,
  },
];

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const vec = (items) => `[${items.map(label).join(', ')}]`;
const levelsOf = (n) => Math.ceil(Math.log2(Math.max(1, n))) + 1;

// ---------------------------------------------------------------------------
// Exemplos para a estabilidade: o intercala da aula é estável quando os iguais vêm de metades
// diferentes e inverte dois iguais da metade direita quando a esquerda acaba antes.
// ---------------------------------------------------------------------------

function exampleWith(count, wantInverted, fallback) {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const values = withRepeats(count);
    if (isStable(runMerges(tagDuplicates(values)).at(-1).after) !== wantInverted) return values;
  }
  return fallback.slice(0, count);
}

/** Vetor com valores repetidos em que a ordem dos iguais é preservada. */
export const stableExample = (count) => exampleWith(count, false, [40, 20, 40, 60, 10, 20, 30, 50, 40, 70]);
/** Vetor com valores repetidos em que dois iguais trocam de ordem. */
export const invertedExample = (count) => exampleWith(count, true, [10, 20, 30, 30, 40, 50, 60, 70, 80, 90]);

// ---------------------------------------------------------------------------
// Execução sem passos: o mesmo algoritmo, para as simulações de análise e para conferir o depurador.
// Cada intercalação devolve o trecho, o vetor antes e depois e as comparações e cópias.
// ---------------------------------------------------------------------------

/** Intercala da aula sobre `a` (itens `{ v, tag }`). Devolve os empates que ocorreram no teste ≤. */
function intercalaItems(a, ini, meio, fim) {
  const B = [];
  for (let i = ini; i <= meio; i += 1) B[i] = a[i];
  for (let j = meio + 1; j <= fim; j += 1) B[fim + meio + 1 - j] = a[j];
  let i = ini;
  let j = fim;
  const ties = [];
  for (let k = ini; k <= fim; k += 1) {
    if (B[i].v === B[j].v) ties.push({ k, i, j, left: B[i], right: B[j] });
    if (B[i].v <= B[j].v) {
      a[k] = B[i];
      i += 1;
    } else {
      a[k] = B[j];
      j -= 1;
    }
  }
  return ties;
}

/** Todas as intercalações do Merge Sort, na ordem em que acontecem. */
function runMerges(items) {
  const a = items.map((item) => ({ ...item }));
  const merges = [];
  const walk = (ini, fim, depth) => {
    if (ini >= fim) return;
    const meio = Math.floor((ini + fim) / 2);
    walk(ini, meio, depth + 1);
    walk(meio + 1, fim, depth + 1);
    const before = a.map((item) => ({ ...item }));
    const ties = intercalaItems(a, ini, meio, fim);
    const size = fim - ini + 1;
    merges.push({
      ini, meio, fim, depth, size, comparisons: size, copies: 2 * size, ties, before, after: a.map((item) => ({ ...item })),
    });
  };
  walk(0, a.length - 1, 0);
  if (!merges.length) merges.push({ ini: 0, meio: 0, fim: 0, depth: 0, size: 1, comparisons: 0, copies: 0, ties: [], before: a, after: a });
  return merges;
}

/** Os trechos de cada nível da recursão (só depende do tamanho do vetor). */
function shapeLevels(n) {
  const levels = [];
  const walk = (ini, fim, depth) => {
    (levels[depth] ??= []).push({ ini, fim });
    if (ini >= fim) return;
    const meio = Math.floor((ini + fim) / 2);
    walk(ini, meio, depth + 1);
    walk(meio + 1, fim, depth + 1);
  };
  walk(0, n - 1, 0);
  return levels;
}

const sizeOf = (segment) => segment.fim - segment.ini + 1;

// ---------------------------------------------------------------------------
// Execução como num depurador: cada passo é a linha que acabou de executar, com a pilha de
// chamadas, as variáveis da chamada atual (cada chamada tem as suas) e o vetor auxiliar B.
// ---------------------------------------------------------------------------

/**
 * `base` é a linha onde o intercala começa no pseudocódigo exibido (0 sozinho, OFFSET junto do
 * mergeSort). Os passos levam `meta` (`tie`, `mergeEnd`) para a simulação de estabilidade.
 */
function createTracer(items, base) {
  const a = items.map((item) => ({ ...item }));
  const n = a.length;
  const steps = [];
  const sorted = new Set();
  const frames = [];
  const counters = { comparisons: 0, copies: 0 };
  const log = [];
  let B = Array(n).fill(null);

  const stats = () => ({ 'comparações': counters.comparisons, 'cópias': counters.copies });

  function add(line, title, description, tone, extra = {}) {
    const {
      auxChanged = [], auxActive = [], pointers: own = {}, ...rest
    } = extra;
    const frame = frames.at(-1);
    const vars = frame?.vars ?? {};
    const inMerge = frame?.kind === 'intercala';
    const pointers = {};
    if (frame) {
      pointers.inicio = vars.inicio;
      pointers.fim = vars.fim;
      if (Number.isInteger(vars.meio)) pointers.meio = vars.meio;
      if (inMerge && Number.isInteger(vars.k) && vars.k <= vars.fim) pointers.k = vars.k;
    }
    steps.push(step(valuesOf(a), line, title, description, tone, {
      tags: tagsOf(a),
      stats: stats(),
      stack: frames.map((entry) => entry.label),
      variables: { ...vars },
      pointers: { ...pointers, ...own },
      outsideIndices: frame ? range(n).filter((index) => index < vars.inicio || index > vars.fim) : [],
      sortedIndices: [...sorted],
      splitAfter: Number.isInteger(vars.meio) ? vars.meio : undefined,
      aux: {
        label: 'B',
        values: B.map((item) => (item ? item.v : null)),
        tags: B.map((item) => (item ? item.tag : '')),
        range: inMerge ? [vars.inicio, vars.fim] : null,
        pointers: inMerge && frame.phase === 'merge' ? { i: vars.i, j: vars.j } : {},
        activeIndices: auxActive,
        changedIndices: auxChanged,
      },
      output: clone(log),
      ...rest,
    }));
  }

  const compareOf = (left, op, right, result) => ({ left, op, right, result });

  function intercala(ini, meio, fim, { announce = false } = {}) {
    const text = tr(`intercala(${ini}, ${meio}, ${fim})`, `merge(${ini}, ${meio}, ${fim})`);
    const frame = {
      kind: 'intercala', label: text, phase: 'copy', vars: { inicio: ini, meio, fim, i: NONE, j: NONE, k: NONE },
    };
    frames.push(frame);
    const { vars } = frame;
    const before = a.slice(ini, fim + 1).map((item) => ({ ...item }));
    const size = fim - ini + 1;
    B = Array(n).fill(null);
    const copying = { label: text, text: tr('Copia para B', 'Copy to B'), code: true };
    const merging = { label: text, text: tr('Intercala de volta no vetor', 'Merge back into the array'), code: true };

    if (announce) {
      add(base + I.head, text, tr(`Chamada: as duas metades, ${vec(a.slice(ini, meio + 1))} e ${vec(a.slice(meio + 1, fim + 1))}, já estão ordenadas. O intercala vai juntá-las em um único trecho ordenado, usando B como cópia de trabalho.`, `Call: the two halves, ${vec(a.slice(ini, meio + 1))} and ${vec(a.slice(meio + 1, fim + 1))}, are already sorted. merge will join them into a single sorted range, using B as a working copy.`), 'neutral', { phase: copying });
    }

    for (let i = ini; i <= meio; i += 1) {
      vars.i = i;
      add(base + I.loopI, tr(`PARA i (i = ${i})`, `FOR i (i = ${i})`), tr(`i recebe ${i} e a condição i ≤ ${meio} é verdadeira: o laço entra. Vamos copiar vetor[${i}] para B[${i}].`, `i receives ${i} and the condition i ≤ ${meio} is true: the loop is entered. We will copy array[${i}] to B[${i}].`), 'reading', { phase: copying, pointers: { i } });
      B[i] = a[i];
      counters.copies += 1;
      add(base + I.copyI, tr('B[i] ← vetor[i]', 'B[i] ← array[i]'), tr(`B[${i}] recebe ${label(a[i])}. A 1ª metade vai para B na mesma ordem.`, `B[${i}] receives ${label(a[i])}. The 1st half goes to B in the same order.`), 'update', {
        phase: copying, pointers: { i }, comparedIndices: [i], auxChanged: [i],
      });
    }
    vars.i = meio + 1;
    add(base + I.endI, tr('FIM PARA i', 'END FOR i'), tr(`i recebe ${meio + 1} e a condição i ≤ ${meio} é falsa: o laço termina. A 1ª metade já está em B.`, `i receives ${meio + 1} and the condition i ≤ ${meio} is false: the loop ends. The 1st half is already in B.`), 'success', { phase: copying, pointers: { i: meio + 1 } });

    for (let j = meio + 1; j <= fim; j += 1) {
      vars.j = j;
      add(base + I.loopJ, tr(`PARA j (j = ${j})`, `FOR j (j = ${j})`), tr(`j recebe ${j} e a condição j ≤ ${fim} é verdadeira: o laço entra. Vamos copiar vetor[${j}] para B, mas de trás para frente.`, `j receives ${j} and the condition j ≤ ${fim} is true: the loop is entered. We will copy array[${j}] to B, but back to front.`), 'reading', { phase: copying, pointers: { j } });
      const target = fim + meio + 1 - j;
      B[target] = a[j];
      counters.copies += 1;
      add(base + I.copyJ, tr('B[fim + meio + 1 - j] ← vetor[j]', 'B[end + mid + 1 - j] ← array[j]'), tr(`O destino é B[fim + meio + 1 − j] = B[${fim} + ${meio} + 1 − ${j}] = B[${target}]. B[${target}] recebe ${label(a[j])}: a 2ª metade entra em B invertida, com o maior valor dela na primeira posição.`, `The destination is B[end + mid + 1 − j] = B[${fim} + ${meio} + 1 − ${j}] = B[${target}]. B[${target}] receives ${label(a[j])}: the 2nd half enters B reversed, with its largest value in the first position.`), 'update', {
        phase: copying, pointers: { j }, comparedIndices: [j], auxChanged: [target],
      });
    }
    vars.j = fim + 1;
    add(base + I.endJ, tr('FIM PARA j', 'END FOR j'), tr(`j recebe ${fim + 1} e a condição j ≤ ${fim} é falsa: o laço termina. B tem as duas metades: a 1ª em ordem crescente e a 2ª em ordem decrescente.`, `j receives ${fim + 1} and the condition j ≤ ${fim} is false: the loop ends. B has the two halves: the 1st in ascending order and the 2nd in descending order.`), 'success', { phase: copying, pointers: { j: fim + 1 } });

    frame.phase = 'merge';
    let i = ini;
    let j = fim;
    vars.i = i;
    add(base + I.initI, tr('i ← inicio', 'i ← start'), tr(`i recebe ${ini}: aponta para o menor valor da 1ª metade de B (o primeiro dela).`, `i receives ${ini}: it points to the smallest value of the 1st half of B (the first of it).`), 'update', { phase: merging });
    vars.j = j;
    add(base + I.initJ, tr('j ← fim', 'j ← end'), tr(`j recebe ${fim}: aponta para o menor valor da 2ª metade de B. Como ela foi copiada invertida, o menor está no fim, e j anda para trás.`, `j receives ${fim}: it points to the smallest value of the 2nd half of B. Since it was copied reversed, the smallest is at the end, and j moves backward.`), 'update', { phase: merging });

    for (let k = ini; k <= fim; k += 1) {
      vars.k = k;
      add(base + I.loopK, tr(`PARA k (k = ${k})`, `FOR k (k = ${k})`), tr(`k recebe ${k} e a condição k ≤ ${fim} é verdadeira: o laço entra. Vamos preencher vetor[${k}] com o menor entre B[${i}] e B[${j}].`, `k receives ${k} and the condition k ≤ ${fim} is true: the loop is entered. We will fill array[${k}] with the smaller of B[${i}] and B[${j}].`), 'reading', { phase: merging });
      counters.comparisons += 1;
      const left = B[i];
      const right = B[j];
      const takeLeft = left.v <= right.v;
      const tie = left.v === right.v;
      let verdict = takeLeft
        ? tr(`Verdadeiro: o menor é B[${i}], que vai para vetor[${k}].`, `True: the smaller is B[${i}], which goes to array[${k}].`)
        : tr(`Falso: o menor é B[${j}], que vai para vetor[${k}].`, `False: the smaller is B[${j}], which goes to array[${k}].`);
      if (tie) verdict = tr(`Valores iguais: o teste usa ≤, então sai B[${i}] (${label(left)}) antes de B[${j}] (${label(right)}).`, `Equal values: the test uses ≤, so B[${i}] (${label(left)}) comes out before B[${j}] (${label(right)}).`);
      add(base + I.test, tr('SE B[i] ≤ B[j]', 'IF B[i] ≤ B[j]'), tr(`B[${i}] ≤ B[${j}] → ${fmt(left.v)} ≤ ${fmt(right.v)} é ${takeLeft ? 'verdadeiro' : 'falso'}. ${verdict}`, `B[${i}] ≤ B[${j}] → ${fmt(left.v)} ≤ ${fmt(right.v)} is ${takeLeft ? 'true' : 'false'}. ${verdict}`), 'comparison', {
        phase: merging,
        compare: compareOf({ label: 'B[i]', value: fmt(left.v) }, '≤', { label: 'B[j]', value: fmt(right.v) }, takeLeft),
        auxActive: [i, j],
        meta: tie ? { tie: { k, i, j, left, right, takeLeft, ini, meio, fim } } : undefined,
      });
      if (takeLeft) {
        a[k] = left;
        counters.copies += 1;
        add(base + I.takeI, tr('vetor[k] ← B[i]', 'array[k] ← B[i]'), tr(`vetor[${k}] recebe ${label(left)}, o valor de B[${i}].`, `array[${k}] receives ${label(left)}, the value of B[${i}].`), 'update', { phase: merging, changedIndices: [k], auxActive: [i] });
        i += 1;
        vars.i = i;
        add(base + I.incI, tr('i ← i + 1', 'i ← i + 1'), tr(`i avança para ${i}: o próximo candidato da 1ª metade.`, `i advances to ${i}: the next candidate of the 1st half.`), 'update', { phase: merging, changedIndices: [k] });
      } else {
        a[k] = right;
        counters.copies += 1;
        add(base + I.takeJ, tr('vetor[k] ← B[j]', 'array[k] ← B[j]'), tr(`vetor[${k}] recebe ${label(right)}, o valor de B[${j}].`, `array[${k}] receives ${label(right)}, the value of B[${j}].`), 'update', { phase: merging, changedIndices: [k], auxActive: [j] });
        j -= 1;
        vars.j = j;
        add(base + I.decJ, tr('j ← j - 1', 'j ← j - 1'), tr(`j recua para ${j}: o próximo candidato da 2ª metade.`, `j steps back to ${j}: the next candidate of the 2nd half.`), 'update', { phase: merging, changedIndices: [k] });
      }
    }

    vars.k = fim + 1;
    for (let index = ini; index <= fim; index += 1) sorted.add(index);
    const after = a.slice(ini, fim + 1).map((item) => ({ ...item }));
    log.push(`${text}: ${vec(before)} → ${vec(after)}`);
    add(base + I.endK, tr('FIM PARA k', 'END FOR k'), tr(`k recebe ${fim + 1} e a condição k ≤ ${fim} é falsa: o laço termina. O trecho de ${ini} a ${fim} está ordenado: ${vec(after)}. Foram ${plural(size, tr('comparação', 'comparison'), tr('comparações', 'comparisons'))} (uma por elemento) e ${size * 2} cópias.`, `k receives ${fim + 1} and the condition k ≤ ${fim} is false: the loop ends. The range from ${ini} to ${fim} is sorted: ${vec(after)}. There were ${plural(size, 'comparison', 'comparisons')} (one per element) and ${size * 2} copies.`), 'success', {
      phase: merging,
      changedIndices: range(fim + 1, ini),
      meta: { mergeEnd: { ini, meio, fim, before, after } },
    });
    frames.pop();
  }

  function mergeSort(ini, fim, depth) {
    const text = tr(`mergeSort(${ini}, ${fim})`, `mergeSort(${ini}, ${fim})`);
    const frame = { kind: 'mergeSort', label: text, vars: { inicio: ini, fim, meio: NONE } };
    frames.push(frame);
    const size = fim - ini + 1;
    const dividing = { label: text, text: tr('Divide em duas metades', 'Splits into two halves'), code: true };

    add(M.call, text, depth === 0
      ? tr(`Chamada inicial: mergeSort(vetor, 0, ${n - 1}). O trecho é o vetor inteiro, com ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}.`, `Initial call: mergeSort(array, 0, ${n - 1}). The range is the whole array, with ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}.`)
      : tr(`Nova chamada, agora com inicio = ${ini} e fim = ${fim}: o trecho tem ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}. Cada chamada tem as suas próprias variáveis.`, `New call, now with start = ${ini} and end = ${fim}: the range has ${plural(size, tr('elemento', 'element'), tr('elementos', 'elements'))}. Each call has its own variables.`), 'neutral', { phase: dividing });

    const divides = ini < fim;
    if (!divides) sorted.add(ini);
    add(M.test, tr('SE inicio < fim', 'IF start < end'), divides
      ? tr(`${ini} < ${fim} é verdadeiro: o trecho tem mais de um elemento e precisa ser dividido.`, `${ini} < ${fim} is true: the range has more than one element and needs to be split.`)
      : tr(`${ini} < ${fim} é falso: o trecho tem um só elemento, então já está ordenado (caso base). A chamada termina sem fazer mais nada.`, `${ini} < ${fim} is false: the range has a single element, so it is already sorted (base case). The call ends without doing anything else.`), divides ? 'comparison' : 'success', {
      phase: dividing,
      compare: compareOf({ label: tr('inicio', 'start'), value: String(ini) }, '<', { label: tr('fim', 'end'), value: String(fim) }, divides),
    });
    if (!divides) {
      frames.pop();
      return;
    }

    const meio = Math.floor((ini + fim) / 2);
    frame.vars.meio = meio;
    const exact = (ini + fim) / 2;
    add(M.meio, tr('meio ← parte inteira de (inicio + fim) / 2', 'mid ← integer part of (start + end) / 2'), tr(`meio = (${ini} + ${fim}) / 2 = ${fmt(exact)}${Number.isInteger(exact) ? '' : tr(`, e a parte inteira é ${meio}`, `, and the integer part is ${meio}`)}. A 1ª metade vai das posições ${ini} a ${meio} e a 2ª, de ${meio + 1} a ${fim}.`, `mid = (${ini} + ${fim}) / 2 = ${fmt(exact)}${Number.isInteger(exact) ? '' : `, and the integer part is ${meio}`}. The 1st half goes from positions ${ini} to ${meio} and the 2nd, from ${meio + 1} to ${fim}.`), 'update', { phase: dividing });

    add(M.left, tr(`mergeSort(${ini}, ${meio})`, `mergeSort(${ini}, ${meio})`), tr(`Chama mergeSort para a 1ª metade, das posições ${ini} a ${meio}. A 2ª metade só será examinada depois que esta voltar.`, `Calls mergeSort for the 1st half, positions ${ini} to ${meio}. The 2nd half will only be examined after this one returns.`), 'neutral', { phase: dividing });
    mergeSort(ini, meio, depth + 1);

    add(M.right, tr(`mergeSort(${meio + 1}, ${fim})`, `mergeSort(${meio + 1}, ${fim})`), tr(`A 1ª metade voltou ordenada: ${vec(a.slice(ini, meio + 1))}. Agora mergeSort cuida da 2ª metade, das posições ${meio + 1} a ${fim}.`, `The 1st half came back sorted: ${vec(a.slice(ini, meio + 1))}. Now mergeSort takes care of the 2nd half, positions ${meio + 1} to ${fim}.`), 'neutral', { phase: dividing });
    mergeSort(meio + 1, fim, depth + 1);

    add(M.merge, tr(`intercala(${ini}, ${meio}, ${fim})`, `merge(${ini}, ${meio}, ${fim})`), tr(`As duas metades voltaram ordenadas: ${vec(a.slice(ini, meio + 1))} e ${vec(a.slice(meio + 1, fim + 1))}. Falta juntá-las: chama intercala.`, `The two halves came back sorted: ${vec(a.slice(ini, meio + 1))} and ${vec(a.slice(meio + 1, fim + 1))}. It remains to join them: it calls merge.`), 'neutral', { phase: { label: text, text: tr('Intercala as metades', 'Merges the halves'), code: true } });
    intercala(ini, meio, fim);
    frames.pop();
  }

  return {
    steps, a, counters, log, add, mergeSort, intercala, sorted,
  };
}

function mergeSortSteps(items) {
  const tracer = createTracer(items, OFFSET);
  const n = items.length;
  tracer.mergeSort(0, n - 1, 0);
  const { a, counters, log } = tracer;
  const levels = levelsOf(n);
  tracer.add(M.end, tr('Ordenação concluída', 'Sort finished'), tr(`O vetor está em ordem crescente, depois de ${counters.comparisons} comparações e ${counters.copies} cópias. As ${n - 1} intercalações ocuparam ${levels - 1} níveis de recursão.`, `The array is in ascending order, after ${counters.comparisons} comparisons and ${counters.copies} copies. The ${n - 1} merges took up ${levels - 1} levels of recursion.`), 'done', {
    output: [...log, tr(`Vetor ordenado: ${vec(a)}`, `Sorted array: ${vec(a)}`), tr(`Comparações: ${counters.comparisons} · Cópias: ${counters.copies}`, `Comparisons: ${counters.comparisons} · Copies: ${counters.copies}`)],
  });
  return tracer.steps;
}

/** O intercala sozinho: as duas metades do vetor já aparecem ordenadas, como depois das chamadas recursivas. */
function intercalaSteps(values, config) {
  const n = values.length;
  const meio = Math.max(0, Math.min(n - 2, Number.isInteger(Number(config.meio)) ? Number(config.meio) : Math.floor((n - 1) / 2)));
  const items = [
    ...toItems(ascending(values.slice(0, meio + 1))),
    ...toItems(ascending(values.slice(meio + 1))),
  ];
  const tracer = createTracer(items, 0);
  tracer.intercala(0, meio, n - 1, { announce: true });
  const { a, counters, log } = tracer;
  tracer.steps.push({
    ...tracer.steps.at(-1),
    line: I.end,
    title: tr('Intercalação concluída', 'Merge finished'),
    description: tr(`As duas metades viraram um único trecho ordenado: ${vec(a)}. Foram ${counters.comparisons} comparações, uma por elemento (n = ${n}), e ${counters.copies} cópias.`, `The two halves became a single sorted range: ${vec(a)}. There were ${counters.comparisons} comparisons, one per element (n = ${n}), and ${counters.copies} copies.`),
    tone: 'done',
    output: [...log, tr(`Comparações: ${counters.comparisons} · Cópias: ${counters.copies}`, `Comparisons: ${counters.comparisons} · Copies: ${counters.copies}`)],
  });
  return tracer.steps;
}

// ---------------------------------------------------------------------------
// 01 · Dividir o vetor: os trechos de cada nível, de cima para baixo
// ---------------------------------------------------------------------------

function divideSteps(values) {
  const n = values.length;
  const shape = shapeLevels(n);
  const depth = shape.length;
  const tree = (shown, current) => ({
    levels: shape.map((segments, d) => ({
      label: tr(`nível ${d}`, `level ${d}`),
      segments: segments.map((segment) => ({ values: values.slice(segment.ini, segment.fim + 1), mark: d === current ? 'active' : '' })),
      pending: d > shown,
      current: d === current,
      note: d > shown ? '' : plural(segments.length, tr('trecho', 'range'), tr('trechos', 'ranges')),
    })),
  });
  const phase = { label: tr('Dividir', 'Split'), text: tr('Trechos de cada nível', 'Ranges of each level'), code: false };
  const steps = [
    step(values, M.call, tr(`mergeSort(0, ${n - 1})`, `mergeSort(0, ${n - 1})`), tr(`Começamos com o vetor inteiro: um único trecho de ${n} elementos (nível 0). Cada chamada divide o trecho em duas metades e chama mergeSort para elas; as chamadas reais acontecem uma de cada vez, aqui juntamos as do mesmo nível, como no desenho da aula.`, `We start with the whole array: a single range of ${n} elements (level 0). Each call splits the range into two halves and calls mergeSort for them; the real calls happen one at a time, here we group the ones of the same level, as in the lesson's drawing.`), 'neutral', {
      tree: tree(0, 0), phase, variables: { nível: 0, trechos: 1 },
    }),
  ];

  for (let d = 0; d < depth - 1; d += 1) {
    const splits = shape[d].filter((segment) => sizeOf(segment) > 1);
    const parts = splits.slice(0, 4).map((segment) => `[${segment.ini}..${segment.fim}] → meio ${Math.floor((segment.ini + segment.fim) / 2)}`);
    const more = splits.length > 4 ? tr(` e mais ${splits.length - 4}`, ` and ${splits.length - 4} more`) : '';
    const alone = shape[d].length - splits.length;
    steps.push(step(values, M.meio, tr(`Dividir o nível ${d}`, `Splitting level ${d}`), tr(`${plural(splits.length, 'trecho tem', 'trechos têm')} mais de um elemento e ${splits.length === 1 ? 'é dividido' : 'são divididos'} em duas metades: ${parts.join('; ')}${more}.${alone ? ` ${plural(alone, 'trecho de um elemento fica', 'trechos de um elemento ficam')} como ${alone === 1 ? 'está' : 'estão'}.` : ''} Surgem ${plural(splits.length * 2, 'trecho novo', 'trechos novos')} no nível ${d + 1}.`, `${plural(splits.length, 'range has', 'ranges have')} more than one element and ${splits.length === 1 ? 'is split' : 'are split'} into two halves: ${parts.join('; ')}${more}.${alone ? ` ${plural(alone, 'one-element range stays', 'one-element ranges stay')} as ${alone === 1 ? 'it is' : 'they are'}.` : ''} ${plural(splits.length * 2, 'new range appears', 'new ranges appear')} at level ${d + 1}.`), 'update', {
      tree: tree(d + 1, d + 1), phase, variables: { nível: d + 1, trechos: shape[d + 1].length },
    }));
  }

  steps.push(step(values, M.test, tr('SE inicio < fim é falso', 'IF start < end is false'), tr(`Todos os trechos do último nível têm um só elemento: inicio < fim é falso e as chamadas terminam (caso base). O vetor foi dividido em ${n} trechos triviais, em ${plural(depth, tr('nível', 'level'), tr('níveis', 'levels'))} (⌈log₂ ${n}⌉ + 1 = ${depth}). Agora é só intercalar, de baixo para cima.`, `All the ranges of the last level have a single element: start < end is false and the calls end (base case). The array was split into ${n} trivial ranges, in ${plural(depth, tr('nível', 'level'), tr('níveis', 'levels'))} (⌈log₂ ${n}⌉ + 1 = ${depth}). Now it is just a matter of merging, from the bottom up.`), 'done', {
    tree: tree(depth - 1, depth - 1),
    phase,
    variables: { nível: depth - 1, trechos: n },
    output: [tr(`Trechos de um elemento: ${n}`, `One-element ranges: ${n}`), tr(`Níveis: ${depth} = ⌈log₂ ${n}⌉ + 1`, `Levels: ${depth} = ⌈log₂ ${n}⌉ + 1`), tr(`Chamadas de mergeSort: ${2 * n - 1} (n trechos + n − 1 divisões)`, `Calls of mergeSort: ${2 * n - 1} (n ranges + n − 1 splits)`)],
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 04 · Contando as operações: as comparações de cada nível da recursão
// ---------------------------------------------------------------------------

function countingSteps(values) {
  const n = values.length;
  const shape = shapeLevels(n);
  const depth = shape.length;
  const bound = n * Math.ceil(Math.log2(n));
  const costs = shape.map((segments) => {
    const merged = segments.filter((segment) => sizeOf(segment) > 1);
    return { merges: merged.length, comparisons: merged.reduce((sum, segment) => sum + sizeOf(segment), 0) };
  });
  const total = costs.reduce((sum, cost) => sum + cost.comparisons, 0);
  let counted = 0;
  const notes = shape.map(() => '');
  const summary = (final = false) => ({
    final,
    totals: [
      { label: tr('Comparações', 'Comparisons'), value: counted, note: final ? tr(`no máximo n · ⌈log₂ n⌉ = ${n} · ${Math.ceil(Math.log2(n))} = ${bound}`, `at most n · ⌈log₂ n⌉ = ${n} · ${Math.ceil(Math.log2(n))} = ${bound}`) : tr(`limite ao final: ${bound}`, `limit at the end: ${bound}`) },
      { label: tr('Níveis da recursão', 'Recursion levels'), value: depth, note: tr(`⌈log₂ ${n}⌉ + 1 = ${depth}`, `⌈log₂ ${n}⌉ + 1 = ${depth}`) },
    ],
  });
  const tree = (current) => ({
    levels: shape.map((segments, d) => ({
      label: tr(`nível ${d}`, `level ${d}`),
      segments: segments.map((segment) => ({ values: values.slice(segment.ini, segment.fim + 1), mark: d === current ? 'active' : '' })),
      pending: false,
      current: d === current,
      note: notes[d],
    })),
  });
  const phase = (d) => ({ label: tr(`nível ${d}`, `level ${d}`), text: tr('Intercalações deste nível', 'Merges at this level'), code: true });

  const steps = [
    step(values, OFFSET + I.test, tr('Contando as operações', 'Counting the operations'), tr(`Cada intercala faz uma comparação por elemento do trecho (o laço de k). Vamos somar as comparações das intercalações de cada nível, de cima para baixo. Com n = ${n} há ${plural(depth, tr('nível', 'level'), tr('níveis', 'levels'))} de trechos e ${depth - 1} deles têm intercalações.`, `Each merge makes one comparison per element of the range (the k loop). We will add up the comparisons of the merges of each level, from top to bottom. With n = ${n} there are ${plural(depth, tr('nível', 'level'), tr('níveis', 'levels'))} of ranges and ${depth - 1} of them have merges.`), 'neutral', {
      tree: tree(-1), summary: summary(), variables: { n, níveis: depth },
    }),
  ];

  for (let d = 0; d < depth - 1; d += 1) {
    const { merges, comparisons } = costs[d];
    counted += comparisons;
    const sizes = shape[d].filter((segment) => sizeOf(segment) > 1).map(sizeOf);
    notes[d] = tr(`${plural(merges, 'intercalação', 'intercalações')} · ${comparisons} comp.`, `${plural(merges, 'merge', 'merges')} · ${comparisons} comp.`);
    steps.push(step(values, OFFSET + I.test, tr(`Nível ${d}: ${comparisons} comparações`, `Level ${d}: ${comparisons} comparisons`), tr(`${plural(merges, 'intercalação junta', 'intercalações juntam')} trechos de ${sizes.join(' + ')} = ${comparisons} ${comparisons === 1 ? 'elemento' : 'elementos'}, e cada um custa uma comparação. ${comparisons === n ? `É o vetor inteiro: n = ${n} comparações.` : `Só ${comparisons} dos ${n} elementos participam: os trechos de um elemento já estão ordenados e não precisam de intercalação.`} Total até aqui: ${counted}.`, `${plural(merges, 'merge joins', 'merges join')} ranges of ${sizes.join(' + ')} = ${comparisons} ${comparisons === 1 ? 'element' : 'elements'}, and each one costs one comparison. ${comparisons === n ? `It is the whole array: n = ${n} comparisons.` : `Only ${comparisons} of the ${n} elements take part: the one-element ranges are already sorted and need no merging.`} Total so far: ${counted}.`), 'comparison', {
      tree: tree(d), summary: summary(), phase: phase(d), variables: { nível: d, intercalações: merges, 'comparações do nível': comparisons, 'comparações acumuladas': counted },
    }));
  }

  const doubled = n * 2;
  const doubledTotal = shapeLevels(doubled).reduce((sum, segments) => sum + segments.filter((segment) => sizeOf(segment) > 1).reduce((s, segment) => s + sizeOf(segment), 0), 0);
  const quadratic = (n * (n - 1)) / 2;
  steps.push(step(values, M.end, tr('Somando os níveis', 'Adding up the levels'), tr(`${plural(depth - 1, 'nível de intercalação', 'níveis de intercalação')}, cada um com no máximo n comparações: ${total} no total, contra o limite n · ⌈log₂ n⌉ = ${bound}. Como o número de níveis cresce com log₂ n, dobrar n não dobra o trabalho por nível: só acrescenta um nível. O custo é O(n log n).`, `${plural(depth - 1, 'merge level', 'merge levels')}, each with at most n comparisons: ${total} in total, against the limit n · ⌈log₂ n⌉ = ${bound}. Since the number of levels grows with log₂ n, doubling n does not double the work per level: it only adds one level. The cost is O(n log n).`), 'done', {
    tree: tree(-1),
    summary: summary(true),
    variables: { n, 'comparações': total, 'n · ⌈log₂ n⌉': bound },
    output: [
      tr(`Comparações: ${total}`, `Comparisons: ${total}`),
      tr(`Cópias: ${2 * total} (2 por elemento intercalado)`, `Copies: ${2 * total} (2 per merged element)`),
      tr(`Limite n · ⌈log₂ n⌉ = ${bound}`, `Limit n · ⌈log₂ n⌉ = ${bound}`),
      tr(`Com n = ${doubled}: ${doubledTotal} comparações (≈ ${(doubledTotal / Math.max(1, total)).toLocaleString(locale, { maximumFractionDigits: 1 })}×)`, `With n = ${doubled}: ${doubledTotal} comparisons (≈ ${(doubledTotal / Math.max(1, total)).toLocaleString(locale, { maximumFractionDigits: 1 })}×)`),
      tr(`Um método quadrático faria n(n−1)/2 = ${quadratic} no pior caso`, `A quadratic method would make n(n−1)/2 = ${quadratic} in the worst case`),
    ],
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 05 · Adaptabilidade
// ---------------------------------------------------------------------------

function adaptabilitySteps(values) {
  const n = values.length;
  const inOrder = ascending(values);
  const scenarios = [
    { label: tr('Já ordenado', 'Already sorted'), values: inOrder },
    { label: tr('Ordem inversa', 'Reverse order'), values: [...inOrder].reverse() },
    { label: tr('Seu vetor', 'Your array'), values: clone(values) },
  ].map((scenario) => ({
    ...scenario, merges: runMerges(toItems(scenario.values)), comparisons: 0, copies: 0, done: new Set(),
  }));
  const total = scenarios[0].merges.reduce((sum, merge) => sum + merge.comparisons, 0);
  const totalCopies = 2 * total;

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.copies, moveLabel: tr('cópias', 'copies'), ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, tr('Três vetores, os mesmos valores', 'Three arrays, the same values'), tr('O primeiro já está ordenado, o segundo está em ordem inversa e o terceiro é o seu vetor. O algoritmo vai tratar os três do mesmo jeito?', 'The first is already sorted, the second is in reverse order and the third is your array. Will the algorithm treat the three the same way?'), 'neutral', {
      rows: rows((scenario) => ({ values: scenario.values, sortedIndices: [] })),
    }),
  ];

  for (let index = 0; index < scenarios[0].merges.length; index += 1) {
    const { ini, meio, fim, size } = scenarios[0].merges[index];
    scenarios.forEach((scenario) => {
      const merge = scenario.merges[index];
      scenario.comparisons += merge.comparisons;
      scenario.copies += merge.copies;
      range(fim + 1, ini).forEach((position) => scenario.done.add(position));
    });
    steps.push(step(values, OFFSET + I.endK, tr(`intercala(${ini}, ${meio}, ${fim})`, `merge(${ini}, ${meio}, ${fim})`), tr(`A intercalação ${index + 1} de ${scenarios[0].merges.length} junta as posições ${ini} a ${fim}: ${plural(size, 'comparação', 'comparações')} e ${size * 2} cópias em cada vetor, mesmo no que já estava em ordem. Total acumulado: ${joined('comparisons')} comparações.`, `Merge ${index + 1} of ${scenarios[0].merges.length} joins positions ${ini} to ${fim}: ${plural(size, 'comparison', 'comparisons')} and ${size * 2} copies on each array, even on the one that was already in order. Accumulated total: ${joined('comparisons')} comparisons.`), 'comparison', {
      rows: rows((scenario) => ({
        values: valuesOf(scenario.merges[index].after), sortedIndices: [...scenario.done], changedIndices: range(fim + 1, ini),
      })),
      variables: { intercalação: `${index + 1} / ${scenarios[0].merges.length}`, 'comparações': joined('comparisons'), 'cópias': joined('copies') },
    }));
  }

  steps.push(step(values, M.end, tr('Mesmas comparações, mesmas cópias', 'Same comparisons, same copies'), tr(`Os três vetores fizeram ${total} comparações e ${totalCopies} cópias, exatamente as mesmas. O Merge Sort sempre divide e intercala tudo, então o melhor e o pior caso custam igual: ele não é adaptável (e também não é prejudicado pela ordem, ao contrário do Quick Sort).`, `The three arrays made ${total} comparisons and ${totalCopies} copies, exactly the same. Merge Sort always splits and merges everything, so the best and the worst case cost the same: it is not adaptive (and it is not hurt by the order either, unlike Quick Sort).`), 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.merges.at(-1).after), sortedIndices: range(n) })),
    output: scenarios.map((scenario) => tr(`${scenario.label}: ${scenario.comparisons} comparações, ${scenario.copies} cópias`, `${scenario.label}: ${scenario.comparisons} comparisons, ${scenario.copies} copies`)),
  }));
  return steps;
}

// ---------------------------------------------------------------------------
// 06 · Estabilidade: os empates do teste B[i] ≤ B[j] e o resultado de cada intercalação
// ---------------------------------------------------------------------------

function stabilitySteps(values) {
  const items = tagDuplicates(values);
  const hasRepeated = items.some((item) => item.tag);
  const n = values.length;
  const full = mergeSortSteps(items);
  const inverted = [];
  const log = [];

  const steps = [
    hasRepeated
      ? step(values, 0, tr('Valores repetidos em destaque', 'Repeated values highlighted'), tr('Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética. Vamos acompanhar cada vez que dois iguais se encontram no teste B[i] ≤ B[j].', 'Repeated values get a letter (a, b, …) that marks the order in which they appear. A stable algorithm ends with those letters in alphabetical order. We will follow each time two equals meet in the test B[i] ≤ B[j].'), 'neutral', {
        tags: tagsOf(items), stack: [], aux: { label: 'B', values: Array(n).fill(null), tags: [], range: null }, output: [],
      })
      : step(values, 0, tr('Não há valores repetidos', 'There are no repeated values'), tr('Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com valores repetidos.', 'Without repeated values there is no relative order to preserve. Use "Generate example" to create an array with repeated values.'), 'warning', {
        tags: tagsOf(items), stack: [], aux: { label: 'B', values: Array(n).fill(null), tags: [], range: null }, output: [],
      }),
  ];

  full.forEach((base) => {
    const tie = base.meta?.tie;
    const end = base.meta?.mergeEnd;
    if (tie) {
      const { left, right, i, j, ini, meio, fim } = tie;
      const swapped = left.tag > right.tag;
      const fromSameHalf = (i <= meio) === (j <= meio);
      const leftExhausted = i > meio;
      let why;
      if (swapped) {
        inverted.push([left, right]);
        const reason = leftExhausted
          ? tr('A 1ª metade já acabou, então i passou a apontar o último valor da 2ª metade (que está invertida em B), igual ao que ainda resta ali.', 'The 1st half has already ended, so i started pointing to the last value of the 2nd half (which is reversed in B), equal to the one still left there.')
          : tr('Os dois já tinham trocado de ordem em uma intercalação anterior.', 'The two had already swapped order in an earlier merge.');
        why = tr(`${label(left)} sai antes de ${label(right)}, mas ${label(right)} vinha antes no vetor original: a ordem dos iguais foi invertida. ${reason}`, `${label(left)} comes out before ${label(right)}, but ${label(right)} came first in the original array: the order of the equals was reversed. ${reason}`);
        log.push(tr(`${label(left)} saiu antes de ${label(right)}: ordem invertida`, `${label(left)} came out before ${label(right)}: reversed order`));
      } else {
        why = tr(`${label(left)} sai primeiro, e ele ${fromSameHalf ? 'já estava antes' : 'vem da 1ª metade, que veio antes no vetor'}: a ordem dos iguais é preservada.`, `${label(left)} comes out first, and it ${fromSameHalf ? 'was already before' : 'comes from the 1st half, which came earlier in the array'}: the order of the equals is preserved.`);
        log.push(tr(`${label(left)} e ${label(right)} se encontraram: ordem preservada`, `${label(left)} and ${label(right)} met: order preserved`));
      }
      steps.push({
        ...base,
        title: swapped ? tr('Iguais se encontram: ordem invertida', 'Equals meet: reversed order') : tr('Iguais se encontram: ordem preservada', 'Equals meet: order preserved'),
        description: tr(`Em intercala(${ini}, ${meio}, ${fim}), B[${i}] = ${label(left)} e B[${j}] = ${label(right)} são iguais, e o teste ≤ é verdadeiro. ${why}`, `In merge(${ini}, ${meio}, ${fim}), B[${i}] = ${label(left)} and B[${j}] = ${label(right)} are equal, and the ≤ test is true. ${why}`),
        tone: swapped ? 'warning' : 'comparison',
        output: clone(log),
      });
    } else if (end && base.tags?.some(Boolean)) {
      steps.push({
        ...base,
        title: tr(`intercala(${end.ini}, ${end.meio}, ${end.fim}): resultado`, `merge(${end.ini}, ${end.meio}, ${end.fim}): result`),
        description: tr(`O trecho de ${end.ini} a ${end.fim} ficou ${end.after.map(label).join(' ')}. ${isStable(end.after) ? 'Os iguais continuam em ordem alfabética.' : 'Há iguais fora da ordem alfabética: a estabilidade foi perdida neste trecho.'}`, `The range from ${end.ini} to ${end.fim} became ${end.after.map(label).join(' ')}. ${isStable(end.after) ? 'The equals are still in alphabetical order.' : 'There are equals out of alphabetical order: stability was lost in this range.'}`),
        tone: isStable(end.after) ? 'success' : 'warning',
        output: clone(log),
      });
    }
  });

  const finalStep = full.at(-1);
  const final = items.map((_, index) => ({ v: finalStep.values[index], tag: finalStep.tags[index] }));
  const stable = isStable(final);
  steps.push({
    ...finalStep,
    line: M.end,
    title: !hasRepeated ? tr('Resultado', 'Result') : stable ? tr('Resultado: estável neste vetor', 'Result: stable on this array') : tr('Resultado: ordem invertida', 'Result: reversed order'),
    description: !hasRepeated
      ? tr('O vetor não tinha valores repetidos, então não há o que comparar.', 'The array had no repeated values, so there is nothing to compare.')
      : stable
        ? tr('A ordem relativa dos iguais foi preservada: as letras de cada valor continuam em ordem alfabética. No empate o teste ≤ leva o da esquerda primeiro, e isso basta quando os iguais vêm de metades diferentes. Use "Ver o caso que inverte" para ver quando isso falha.', 'The relative order of the equals was preserved: the letters of each value stay in alphabetical order. On a tie, the ≤ test takes the left one first, and that is enough when the equals come from different halves. Use "See the case that reverses" to see when this fails.')
        : tr(`Esta ordenação trocou a ordem de ${plural(inverted.length, 'par de iguais', 'pares de iguais')}: ${inverted.map(([x, y]) => `${label(x)} ficou antes de ${label(y)}`).join('; ')}. Com a 2ª metade copiada invertida, o intercala da aula não garante a estabilidade quando a 1ª metade acaba antes e restam iguais na 2ª.`, `This sort swapped the order of ${plural(inverted.length, 'pair of equals', 'pairs of equals')}: ${inverted.map(([x, y]) => `${label(x)} ended up before ${label(y)}`).join('; ')}. With the 2nd half copied reversed, the lesson's merge does not guarantee stability when the 1st half ends first and equals remain in the 2nd.`),
    tone: stable || !hasRepeated ? 'done' : 'warning',
    output: [...log, tr(`Ordem final: ${final.map(label).join(' ')}`, `Final order: ${final.map(label).join(' ')}`), !hasRepeated ? tr('Sem valores repetidos.', 'No repeated values.') : stable ? tr('Ordem dos iguais preservada.', 'Order of the equals preserved.') : tr('Ordem dos iguais alterada.', 'Order of the equals changed.')],
  });
  return steps;
}

export function buildSteps(id, values, config = {}) {
  switch (id) {
    case 'divide': return divideSteps(values);
    case 'intercala': return intercalaSteps(values, config);
    case 'merge-sort': return mergeSortSteps(toItems(values));
    case 'counting': return countingSteps(values);
    case 'adaptability': return adaptabilitySteps(values);
    case 'stability': return stabilitySteps(values);
    default: return divideSteps(values);
  }
}
