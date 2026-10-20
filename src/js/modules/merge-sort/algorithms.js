import {
  NONE, ascending, clone, fmt, isStable, label, range, step, tagDuplicates, tagsOf, toItems, valuesOf, withRepeats,
} from '../shared/sort-steps.js';

// Pseudocódigo da aula (slides 40 e 41): mergeSort divide o trecho em duas metades e intercala,
// e intercala copia a 1ª metade para B, a 2ª metade invertida, e junta as duas de fora para dentro.
const MERGE_CODE = [
  'FUNÇÃO mergeSort(vetor, inicio, fim)',
  '  SE inicio < fim ENTÃO',
  '    meio ← parte inteira de (inicio + fim) / 2',
  '    mergeSort(vetor, inicio, meio)',
  '    mergeSort(vetor, meio + 1, fim)',
  '    intercala(vetor, inicio, meio, fim)',
  '  FIM SE',
  'FIM',
];

const INTERCALA_CODE = [
  'FUNÇÃO intercala(vetor, inicio, meio, fim)',
  '  PARA i de inicio até meio FAÇA',
  '    B[i] ← vetor[i]',
  '  FIM PARA',
  '  PARA j de meio + 1 até fim FAÇA',
  '    B[fim + meio + 1 - j] ← vetor[j]',
  '  FIM PARA',
  '  i ← inicio',
  '  j ← fim',
  '  PARA k de inicio até fim FAÇA',
  '    SE B[i] ≤ B[j] ENTÃO',
  '      vetor[k] ← B[i]',
  '      i ← i + 1',
  '    SENÃO',
  '      vetor[k] ← B[j]',
  '      j ← j - 1',
  '    FIM SE',
  '  FIM PARA',
  'FIM',
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
    id: 'divide', title: 'Dividir o vetor', menuLabel: 'Dividir o vetor', group: 'Como funciona', number: '01',
    description: 'Divida o vetor ao meio e, depois, cada metade de novo, até sobrarem trechos de um só elemento. É a estratégia dividir e conquistar: um problema grande vira vários problemas triviais.',
    interaction: 'Avance nível por nível e veja o meio de cada trecho. Com 8 elementos são 4 níveis; com 16, apenas 5.',
    complexity: { time: 'O(n)', space: 'O(log n)', note: 'Dividir não compara nada: são 2n − 1 chamadas (n trechos de um elemento e n − 1 divisões), e a pilha de chamadas chega a ⌈log₂ n⌉ + 1 níveis de profundidade.' },
    pseudocode: MERGE_CODE,
  },
  {
    id: 'intercala', title: 'Intercalar duas metades', menuLabel: 'Intercalar', group: 'Como funciona', number: '02',
    description: 'Junte duas metades já ordenadas em um único trecho ordenado. A 1ª metade é copiada para B, a 2ª é copiada invertida, e os índices i e j caminham de fora para dentro, sempre levando o menor valor de volta ao vetor.',
    interaction: 'Escolha onde o vetor se divide (a posição meio) ou clique em uma célula. As duas metades já aparecem ordenadas, como depois das chamadas recursivas.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'O laço de k roda uma vez por elemento do trecho, com uma comparação cada: n comparações. B guarda uma cópia de todo o trecho, por isso o espaço extra é O(n).' },
    pseudocode: INTERCALA_CODE,
  },
  {
    id: 'merge-sort', title: 'Merge Sort', menuLabel: 'Merge Sort', group: 'Como funciona', number: '03',
    description: 'Divida o vetor ao meio, ordene cada metade com uma chamada recursiva e intercale as duas. Os trechos de um elemento já estão ordenados, e a ordenação "sobe" pelas intercalações.',
    interaction: 'Acompanhe a pilha de chamadas e os marcadores início, meio, fim e k. O que está em verde já foi intercalado.',
    complexity: { time: 'O(n log n)', space: 'O(n)', note: 'São ⌈log₂ n⌉ níveis de intercalação e cada nível compara no máximo n elementos. B ocupa até n posições e a pilha de chamadas soma O(log n).' },
    pseudocode: FULL_CODE,
  },
  {
    id: 'counting', title: 'Contando as operações', menuLabel: 'Complexidade de tempo', group: 'Análise do algoritmo', number: '04',
    description: 'Conte as comparações do intercala em cada nível da recursão e veja por que o total é da ordem de n · log₂ n.',
    interaction: 'Gere vetores de tamanhos diferentes: dobrar n acrescenta apenas um nível de intercalações.',
    complexity: { time: 'O(n log n)', space: 'O(n)', note: 'Cada nível intercala todos os elementos que não estão sozinhos (no máximo n comparações), e há ⌈log₂ n⌉ níveis de intercalação: T(n) ≤ n · ⌈log₂ n⌉.' },
    pseudocode: FULL_CODE,
  },
  {
    id: 'adaptability', title: 'Adaptabilidade', menuLabel: 'Adaptabilidade', group: 'Análise do algoritmo', number: '05',
    description: 'Execute o algoritmo em três vetores com os mesmos valores em ordens diferentes e compare os contadores.',
    interaction: 'Avance intercalação por intercalação e observe que as comparações e as cópias são idênticas nos três vetores.',
    complexity: { time: 'O(n log n)', space: 'O(n)', note: 'Melhor, médio e pior caso fazem exatamente as mesmas comparações e cópias: o algoritmo sempre divide e intercala tudo, qualquer que seja a ordem inicial. O Merge Sort não é adaptável.' },
    pseudocode: FULL_CODE,
  },
  {
    id: 'stability', title: 'Estabilidade', menuLabel: 'Estabilidade', group: 'Análise do algoritmo', number: '06',
    description: 'Valores repetidos recebem uma letra que marca a ordem original. Veja se o algoritmo preserva essa ordem.',
    interaction: 'Use "Gerar exemplo" para criar um vetor com valores repetidos e acompanhe o encontro de dois iguais: o teste ≤ leva o da esquerda primeiro. "Ver o caso que inverte" mostra a exceção da cópia invertida.',
    complexity: { time: 'O(n log n)', space: 'O(n)', note: 'No empate, B[i] ≤ B[j] leva o da esquerda, que veio antes, e a ordem dos iguais de metades diferentes é preservada. Mas a 2ª metade é copiada invertida: quando a 1ª metade acaba, i passa a apontar o último valor da 2ª metade e, se ele for igual aos que sobram ali, sai antes deles. Este intercala não é estável em todos os vetores.' },
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
    const text = `intercala(${ini}, ${meio}, ${fim})`;
    const frame = {
      kind: 'intercala', label: text, phase: 'copy', vars: { inicio: ini, meio, fim, i: NONE, j: NONE, k: NONE },
    };
    frames.push(frame);
    const { vars } = frame;
    const before = a.slice(ini, fim + 1).map((item) => ({ ...item }));
    const size = fim - ini + 1;
    B = Array(n).fill(null);
    const copying = { label: text, text: 'Copia para B', code: true };
    const merging = { label: text, text: 'Intercala de volta no vetor', code: true };

    if (announce) {
      add(base + I.head, text, `Chamada: as duas metades, ${vec(a.slice(ini, meio + 1))} e ${vec(a.slice(meio + 1, fim + 1))}, já estão ordenadas. O intercala vai juntá-las em um único trecho ordenado, usando B como cópia de trabalho.`, 'neutral', { phase: copying });
    }

    for (let i = ini; i <= meio; i += 1) {
      vars.i = i;
      add(base + I.loopI, `PARA i (i = ${i})`, `i recebe ${i} e a condição i ≤ ${meio} é verdadeira: o laço entra. Vamos copiar vetor[${i}] para B[${i}].`, 'reading', { phase: copying, pointers: { i } });
      B[i] = a[i];
      counters.copies += 1;
      add(base + I.copyI, 'B[i] ← vetor[i]', `B[${i}] recebe ${label(a[i])}. A 1ª metade vai para B na mesma ordem.`, 'update', {
        phase: copying, pointers: { i }, comparedIndices: [i], auxChanged: [i],
      });
    }
    vars.i = meio + 1;
    add(base + I.endI, 'FIM PARA i', `i recebe ${meio + 1} e a condição i ≤ ${meio} é falsa: o laço termina. A 1ª metade já está em B.`, 'success', { phase: copying, pointers: { i: meio + 1 } });

    for (let j = meio + 1; j <= fim; j += 1) {
      vars.j = j;
      add(base + I.loopJ, `PARA j (j = ${j})`, `j recebe ${j} e a condição j ≤ ${fim} é verdadeira: o laço entra. Vamos copiar vetor[${j}] para B, mas de trás para frente.`, 'reading', { phase: copying, pointers: { j } });
      const target = fim + meio + 1 - j;
      B[target] = a[j];
      counters.copies += 1;
      add(base + I.copyJ, 'B[fim + meio + 1 - j] ← vetor[j]', `O destino é B[fim + meio + 1 − j] = B[${fim} + ${meio} + 1 − ${j}] = B[${target}]. B[${target}] recebe ${label(a[j])}: a 2ª metade entra em B invertida, com o maior valor dela na primeira posição.`, 'update', {
        phase: copying, pointers: { j }, comparedIndices: [j], auxChanged: [target],
      });
    }
    vars.j = fim + 1;
    add(base + I.endJ, 'FIM PARA j', `j recebe ${fim + 1} e a condição j ≤ ${fim} é falsa: o laço termina. B tem as duas metades: a 1ª em ordem crescente e a 2ª em ordem decrescente.`, 'success', { phase: copying, pointers: { j: fim + 1 } });

    frame.phase = 'merge';
    let i = ini;
    let j = fim;
    vars.i = i;
    add(base + I.initI, 'i ← inicio', `i recebe ${ini}: aponta para o menor valor da 1ª metade de B (o primeiro dela).`, 'update', { phase: merging });
    vars.j = j;
    add(base + I.initJ, 'j ← fim', `j recebe ${fim}: aponta para o menor valor da 2ª metade de B. Como ela foi copiada invertida, o menor está no fim, e j anda para trás.`, 'update', { phase: merging });

    for (let k = ini; k <= fim; k += 1) {
      vars.k = k;
      add(base + I.loopK, `PARA k (k = ${k})`, `k recebe ${k} e a condição k ≤ ${fim} é verdadeira: o laço entra. Vamos preencher vetor[${k}] com o menor entre B[${i}] e B[${j}].`, 'reading', { phase: merging });
      counters.comparisons += 1;
      const left = B[i];
      const right = B[j];
      const takeLeft = left.v <= right.v;
      const tie = left.v === right.v;
      let verdict = takeLeft
        ? `Verdadeiro: o menor é B[${i}], que vai para vetor[${k}].`
        : `Falso: o menor é B[${j}], que vai para vetor[${k}].`;
      if (tie) verdict = `Valores iguais: o teste usa ≤, então sai B[${i}] (${label(left)}) antes de B[${j}] (${label(right)}).`;
      add(base + I.test, 'SE B[i] ≤ B[j]', `B[${i}] ≤ B[${j}] → ${fmt(left.v)} ≤ ${fmt(right.v)} é ${takeLeft ? 'verdadeiro' : 'falso'}. ${verdict}`, 'comparison', {
        phase: merging,
        compare: compareOf({ label: 'B[i]', value: fmt(left.v) }, '≤', { label: 'B[j]', value: fmt(right.v) }, takeLeft),
        auxActive: [i, j],
        meta: tie ? { tie: { k, i, j, left, right, takeLeft, ini, meio, fim } } : undefined,
      });
      if (takeLeft) {
        a[k] = left;
        counters.copies += 1;
        add(base + I.takeI, 'vetor[k] ← B[i]', `vetor[${k}] recebe ${label(left)}, o valor de B[${i}].`, 'update', { phase: merging, changedIndices: [k], auxActive: [i] });
        i += 1;
        vars.i = i;
        add(base + I.incI, 'i ← i + 1', `i avança para ${i}: o próximo candidato da 1ª metade.`, 'update', { phase: merging, changedIndices: [k] });
      } else {
        a[k] = right;
        counters.copies += 1;
        add(base + I.takeJ, 'vetor[k] ← B[j]', `vetor[${k}] recebe ${label(right)}, o valor de B[${j}].`, 'update', { phase: merging, changedIndices: [k], auxActive: [j] });
        j -= 1;
        vars.j = j;
        add(base + I.decJ, 'j ← j - 1', `j recua para ${j}: o próximo candidato da 2ª metade.`, 'update', { phase: merging, changedIndices: [k] });
      }
    }

    vars.k = fim + 1;
    for (let index = ini; index <= fim; index += 1) sorted.add(index);
    const after = a.slice(ini, fim + 1).map((item) => ({ ...item }));
    log.push(`${text}: ${vec(before)} → ${vec(after)}`);
    add(base + I.endK, 'FIM PARA k', `k recebe ${fim + 1} e a condição k ≤ ${fim} é falsa: o laço termina. O trecho de ${ini} a ${fim} está ordenado: ${vec(after)}. Foram ${plural(size, 'comparação', 'comparações')} (uma por elemento) e ${size * 2} cópias.`, 'success', {
      phase: merging,
      changedIndices: range(fim + 1, ini),
      meta: { mergeEnd: { ini, meio, fim, before, after } },
    });
    frames.pop();
  }

  function mergeSort(ini, fim, depth) {
    const text = `mergeSort(${ini}, ${fim})`;
    const frame = { kind: 'mergeSort', label: text, vars: { inicio: ini, fim, meio: NONE } };
    frames.push(frame);
    const size = fim - ini + 1;
    const dividing = { label: text, text: 'Divide em duas metades', code: true };

    add(M.call, text, depth === 0
      ? `Chamada inicial: mergeSort(vetor, 0, ${n - 1}). O trecho é o vetor inteiro, com ${plural(size, 'elemento', 'elementos')}.`
      : `Nova chamada, agora com inicio = ${ini} e fim = ${fim}: o trecho tem ${plural(size, 'elemento', 'elementos')}. Cada chamada tem as suas próprias variáveis.`, 'neutral', { phase: dividing });

    const divides = ini < fim;
    if (!divides) sorted.add(ini);
    add(M.test, 'SE inicio < fim', divides
      ? `${ini} < ${fim} é verdadeiro: o trecho tem mais de um elemento e precisa ser dividido.`
      : `${ini} < ${fim} é falso: o trecho tem um só elemento, então já está ordenado (caso base). A chamada termina sem fazer mais nada.`, divides ? 'comparison' : 'success', {
      phase: dividing,
      compare: compareOf({ label: 'inicio', value: String(ini) }, '<', { label: 'fim', value: String(fim) }, divides),
    });
    if (!divides) {
      frames.pop();
      return;
    }

    const meio = Math.floor((ini + fim) / 2);
    frame.vars.meio = meio;
    const exact = (ini + fim) / 2;
    add(M.meio, 'meio ← parte inteira de (inicio + fim) / 2', `meio = (${ini} + ${fim}) / 2 = ${fmt(exact)}${Number.isInteger(exact) ? '' : `, e a parte inteira é ${meio}`}. A 1ª metade vai das posições ${ini} a ${meio} e a 2ª, de ${meio + 1} a ${fim}.`, 'update', { phase: dividing });

    add(M.left, `mergeSort(${ini}, ${meio})`, `Chama mergeSort para a 1ª metade, das posições ${ini} a ${meio}. A 2ª metade só será examinada depois que esta voltar.`, 'neutral', { phase: dividing });
    mergeSort(ini, meio, depth + 1);

    add(M.right, `mergeSort(${meio + 1}, ${fim})`, `A 1ª metade voltou ordenada: ${vec(a.slice(ini, meio + 1))}. Agora mergeSort cuida da 2ª metade, das posições ${meio + 1} a ${fim}.`, 'neutral', { phase: dividing });
    mergeSort(meio + 1, fim, depth + 1);

    add(M.merge, `intercala(${ini}, ${meio}, ${fim})`, `As duas metades voltaram ordenadas: ${vec(a.slice(ini, meio + 1))} e ${vec(a.slice(meio + 1, fim + 1))}. Falta juntá-las: chama intercala.`, 'neutral', { phase: { label: text, text: 'Intercala as metades', code: true } });
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
  tracer.add(M.end, 'Ordenação concluída', `O vetor está em ordem crescente, depois de ${counters.comparisons} comparações e ${counters.copies} cópias. As ${n - 1} intercalações ocuparam ${levels - 1} níveis de recursão.`, 'done', {
    output: [...log, `Vetor ordenado: ${vec(a)}`, `Comparações: ${counters.comparisons} · Cópias: ${counters.copies}`],
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
    title: 'Intercalação concluída',
    description: `As duas metades viraram um único trecho ordenado: ${vec(a)}. Foram ${counters.comparisons} comparações, uma por elemento (n = ${n}), e ${counters.copies} cópias.`,
    tone: 'done',
    output: [...log, `Comparações: ${counters.comparisons} · Cópias: ${counters.copies}`],
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
      label: `nível ${d}`,
      segments: segments.map((segment) => ({ values: values.slice(segment.ini, segment.fim + 1), mark: d === current ? 'active' : '' })),
      pending: d > shown,
      current: d === current,
      note: d > shown ? '' : plural(segments.length, 'trecho', 'trechos'),
    })),
  });
  const phase = { label: 'Dividir', text: 'Trechos de cada nível', code: false };
  const steps = [
    step(values, M.call, `mergeSort(0, ${n - 1})`, `Começamos com o vetor inteiro: um único trecho de ${n} elementos (nível 0). Cada chamada divide o trecho em duas metades e chama mergeSort para elas; as chamadas reais acontecem uma de cada vez, aqui juntamos as do mesmo nível, como no desenho da aula.`, 'neutral', {
      tree: tree(0, 0), phase, variables: { nível: 0, trechos: 1 },
    }),
  ];

  for (let d = 0; d < depth - 1; d += 1) {
    const splits = shape[d].filter((segment) => sizeOf(segment) > 1);
    const parts = splits.slice(0, 4).map((segment) => `[${segment.ini}..${segment.fim}] → meio ${Math.floor((segment.ini + segment.fim) / 2)}`);
    const more = splits.length > 4 ? ` e mais ${splits.length - 4}` : '';
    const alone = shape[d].length - splits.length;
    steps.push(step(values, M.meio, `Dividir o nível ${d}`, `${plural(splits.length, 'trecho tem', 'trechos têm')} mais de um elemento e ${splits.length === 1 ? 'é dividido' : 'são divididos'} em duas metades: ${parts.join('; ')}${more}.${alone ? ` ${plural(alone, 'trecho de um elemento fica', 'trechos de um elemento ficam')} como ${alone === 1 ? 'está' : 'estão'}.` : ''} Surgem ${plural(splits.length * 2, 'trecho novo', 'trechos novos')} no nível ${d + 1}.`, 'update', {
      tree: tree(d + 1, d + 1), phase, variables: { nível: d + 1, trechos: shape[d + 1].length },
    }));
  }

  steps.push(step(values, M.test, 'SE inicio < fim é falso', `Todos os trechos do último nível têm um só elemento: inicio < fim é falso e as chamadas terminam (caso base). O vetor foi dividido em ${n} trechos triviais, em ${plural(depth, 'nível', 'níveis')} (⌈log₂ ${n}⌉ + 1 = ${depth}). Agora é só intercalar, de baixo para cima.`, 'done', {
    tree: tree(depth - 1, depth - 1),
    phase,
    variables: { nível: depth - 1, trechos: n },
    output: [`Trechos de um elemento: ${n}`, `Níveis: ${depth} = ⌈log₂ ${n}⌉ + 1`, `Chamadas de mergeSort: ${2 * n - 1} (n trechos + n − 1 divisões)`],
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
      { label: 'Comparações', value: counted, note: final ? `no máximo n · ⌈log₂ n⌉ = ${n} · ${Math.ceil(Math.log2(n))} = ${bound}` : `limite ao final: ${bound}` },
      { label: 'Níveis da recursão', value: depth, note: `⌈log₂ ${n}⌉ + 1 = ${depth}` },
    ],
  });
  const tree = (current) => ({
    levels: shape.map((segments, d) => ({
      label: `nível ${d}`,
      segments: segments.map((segment) => ({ values: values.slice(segment.ini, segment.fim + 1), mark: d === current ? 'active' : '' })),
      pending: false,
      current: d === current,
      note: notes[d],
    })),
  });
  const phase = (d) => ({ label: `nível ${d}`, text: 'Intercalações deste nível', code: true });

  const steps = [
    step(values, OFFSET + I.test, 'Contando as operações', `Cada intercala faz uma comparação por elemento do trecho (o laço de k). Vamos somar as comparações das intercalações de cada nível, de cima para baixo. Com n = ${n} há ${plural(depth, 'nível', 'níveis')} de trechos e ${depth - 1} deles têm intercalações.`, 'neutral', {
      tree: tree(-1), summary: summary(), variables: { n, níveis: depth },
    }),
  ];

  for (let d = 0; d < depth - 1; d += 1) {
    const { merges, comparisons } = costs[d];
    counted += comparisons;
    const sizes = shape[d].filter((segment) => sizeOf(segment) > 1).map(sizeOf);
    notes[d] = `${plural(merges, 'intercalação', 'intercalações')} · ${comparisons} comp.`;
    steps.push(step(values, OFFSET + I.test, `Nível ${d}: ${comparisons} comparações`, `${plural(merges, 'intercalação junta', 'intercalações juntam')} trechos de ${sizes.join(' + ')} = ${comparisons} ${comparisons === 1 ? 'elemento' : 'elementos'}, e cada um custa uma comparação. ${comparisons === n ? `É o vetor inteiro: n = ${n} comparações.` : `Só ${comparisons} dos ${n} elementos participam: os trechos de um elemento já estão ordenados e não precisam de intercalação.`} Total até aqui: ${counted}.`, 'comparison', {
      tree: tree(d), summary: summary(), phase: phase(d), variables: { nível: d, intercalações: merges, 'comparações do nível': comparisons, 'comparações acumuladas': counted },
    }));
  }

  const doubled = n * 2;
  const doubledTotal = shapeLevels(doubled).reduce((sum, segments) => sum + segments.filter((segment) => sizeOf(segment) > 1).reduce((s, segment) => s + sizeOf(segment), 0), 0);
  const quadratic = (n * (n - 1)) / 2;
  steps.push(step(values, M.end, 'Somando os níveis', `${plural(depth - 1, 'nível de intercalação', 'níveis de intercalação')}, cada um com no máximo n comparações: ${total} no total, contra o limite n · ⌈log₂ n⌉ = ${bound}. Como o número de níveis cresce com log₂ n, dobrar n não dobra o trabalho por nível: só acrescenta um nível. O custo é O(n log n).`, 'done', {
    tree: tree(-1),
    summary: summary(true),
    variables: { n, 'comparações': total, 'n · ⌈log₂ n⌉': bound },
    output: [
      `Comparações: ${total}`,
      `Cópias: ${2 * total} (2 por elemento intercalado)`,
      `Limite n · ⌈log₂ n⌉ = ${bound}`,
      `Com n = ${doubled}: ${doubledTotal} comparações (≈ ${(doubledTotal / Math.max(1, total)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}×)`,
      `Um método quadrático faria n(n−1)/2 = ${quadratic} no pior caso`,
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
    { label: 'Já ordenado', values: inOrder },
    { label: 'Ordem inversa', values: [...inOrder].reverse() },
    { label: 'Seu vetor', values: clone(values) },
  ].map((scenario) => ({
    ...scenario, merges: runMerges(toItems(scenario.values)), comparisons: 0, copies: 0, done: new Set(),
  }));
  const total = scenarios[0].merges.reduce((sum, merge) => sum + merge.comparisons, 0);
  const totalCopies = 2 * total;

  const rows = (pick) => scenarios.map((scenario) => ({
    label: scenario.label, comparisons: scenario.comparisons, swaps: scenario.copies, moveLabel: 'cópias', ...pick(scenario),
  }));
  const joined = (key) => scenarios.map((scenario) => scenario[key]).join(' · ');
  const steps = [
    step(values, 0, 'Três vetores, os mesmos valores', 'O primeiro já está ordenado, o segundo está em ordem inversa e o terceiro é o seu vetor. O algoritmo vai tratar os três do mesmo jeito?', 'neutral', {
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
    steps.push(step(values, OFFSET + I.endK, `intercala(${ini}, ${meio}, ${fim})`, `A intercalação ${index + 1} de ${scenarios[0].merges.length} junta as posições ${ini} a ${fim}: ${plural(size, 'comparação', 'comparações')} e ${size * 2} cópias em cada vetor, mesmo no que já estava em ordem. Total acumulado: ${joined('comparisons')} comparações.`, 'comparison', {
      rows: rows((scenario) => ({
        values: valuesOf(scenario.merges[index].after), sortedIndices: [...scenario.done], changedIndices: range(fim + 1, ini),
      })),
      variables: { intercalação: `${index + 1} / ${scenarios[0].merges.length}`, 'comparações': joined('comparisons'), 'cópias': joined('copies') },
    }));
  }

  steps.push(step(values, M.end, 'Mesmas comparações, mesmas cópias', `Os três vetores fizeram ${total} comparações e ${totalCopies} cópias, exatamente as mesmas. O Merge Sort sempre divide e intercala tudo, então o melhor e o pior caso custam igual: ele não é adaptável (e também não é prejudicado pela ordem, ao contrário do Quick Sort).`, 'done', {
    rows: rows((scenario) => ({ values: valuesOf(scenario.merges.at(-1).after), sortedIndices: range(n) })),
    output: scenarios.map((scenario) => `${scenario.label}: ${scenario.comparisons} comparações, ${scenario.copies} cópias`),
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
      ? step(values, 0, 'Valores repetidos em destaque', 'Os valores repetidos ganham uma letra (a, b, …) que marca a ordem em que aparecem. Um algoritmo estável termina com essas letras em ordem alfabética. Vamos acompanhar cada vez que dois iguais se encontram no teste B[i] ≤ B[j].', 'neutral', {
        tags: tagsOf(items), stack: [], aux: { label: 'B', values: Array(n).fill(null), tags: [], range: null }, output: [],
      })
      : step(values, 0, 'Não há valores repetidos', 'Sem valores repetidos não existe ordem relativa para preservar. Use "Gerar exemplo" para criar um vetor com valores repetidos.', 'warning', {
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
          ? 'A 1ª metade já acabou, então i passou a apontar o último valor da 2ª metade (que está invertida em B), igual ao que ainda resta ali.'
          : 'Os dois já tinham trocado de ordem em uma intercalação anterior.';
        why = `${label(left)} sai antes de ${label(right)}, mas ${label(right)} vinha antes no vetor original: a ordem dos iguais foi invertida. ${reason}`;
        log.push(`${label(left)} saiu antes de ${label(right)}: ordem invertida`);
      } else {
        why = `${label(left)} sai primeiro, e ele ${fromSameHalf ? 'já estava antes' : 'vem da 1ª metade, que veio antes no vetor'}: a ordem dos iguais é preservada.`;
        log.push(`${label(left)} e ${label(right)} se encontraram: ordem preservada`);
      }
      steps.push({
        ...base,
        title: swapped ? 'Iguais se encontram: ordem invertida' : 'Iguais se encontram: ordem preservada',
        description: `Em intercala(${ini}, ${meio}, ${fim}), B[${i}] = ${label(left)} e B[${j}] = ${label(right)} são iguais, e o teste ≤ é verdadeiro. ${why}`,
        tone: swapped ? 'warning' : 'comparison',
        output: clone(log),
      });
    } else if (end && base.tags?.some(Boolean)) {
      steps.push({
        ...base,
        title: `intercala(${end.ini}, ${end.meio}, ${end.fim}): resultado`,
        description: `O trecho de ${end.ini} a ${end.fim} ficou ${end.after.map(label).join(' ')}. ${isStable(end.after) ? 'Os iguais continuam em ordem alfabética.' : 'Há iguais fora da ordem alfabética: a estabilidade foi perdida neste trecho.'}`,
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
    title: !hasRepeated ? 'Resultado' : stable ? 'Resultado: estável neste vetor' : 'Resultado: ordem invertida',
    description: !hasRepeated
      ? 'O vetor não tinha valores repetidos, então não há o que comparar.'
      : stable
        ? 'A ordem relativa dos iguais foi preservada: as letras de cada valor continuam em ordem alfabética. No empate o teste ≤ leva o da esquerda primeiro, e isso basta quando os iguais vêm de metades diferentes. Use "Ver o caso que inverte" para ver quando isso falha.'
        : `Esta ordenação trocou a ordem de ${plural(inverted.length, 'par de iguais', 'pares de iguais')}: ${inverted.map(([x, y]) => `${label(x)} ficou antes de ${label(y)}`).join('; ')}. Com a 2ª metade copiada invertida, o intercala da aula não garante a estabilidade quando a 1ª metade acaba antes e restam iguais na 2ª.`,
    tone: stable || !hasRepeated ? 'done' : 'warning',
    output: [...log, `Ordem final: ${final.map(label).join(' ')}`, !hasRepeated ? 'Sem valores repetidos.' : stable ? 'Ordem dos iguais preservada.' : 'Ordem dos iguais alterada.'],
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
