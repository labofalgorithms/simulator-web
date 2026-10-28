// Peças de execução compartilhadas pelas ordenações lineares (Bucket Sort, Counting Sort e Radix Sort):
// o registro dos passos, o cálculo do bucket e do dígito, a ordenação dentro de um bucket (com os
// contadores) e os "corredores" (`step.lanes`) que mostram os buckets e os vetores auxiliares.
// Os itens são { v: valor, tag: letra }, como nos outros módulos de ordenação.

import { step as baseStep } from './sort-steps.js';
import { tr } from '../../core/i18n.js';

export const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

/** O bucket de `value` quando o maior valor do vetor é `max` (slide 7 do Bucket Sort). */
export const bucketIndexOf = (value, numBuckets, max) => Math.floor((value * numBuckets) / (max + 1));

/** O dígito de `value` na posição `digitPos` (1 = unidades, 10 = dezenas, 100 = centenas...). */
export const digitOf = (value, digitPos) => Math.floor(value / digitPos) % 10;

/** Quantos dígitos tem o maior valor: é o número de passadas do Radix Sort. */
export const digitCount = (max) => String(Math.max(0, Math.trunc(max))).length;

export const copyItems = (items) => items.map((item) => ({ ...item }));
export const itemLabel = (item) => (item.tag ? `${item.v}(${item.tag})` : String(item.v));
export const maxOf = (items) => items.reduce((max, item) => Math.max(max, item.v), items[0]?.v ?? 0);

/** Registro dos passos: com `record` falso a mesma execução roda sem montar nenhum passo (análises e testes). */
export function createTrace(record) {
  const steps = [];
  return {
    steps,
    at(values, line, title, description, tone, extra) {
      if (record) steps.push(baseStep(values, line, title, description, tone, extra));
    },
  };
}

// ---------------------------------------------------------------------------
// Ordenações dentro de um bucket: a lista inteira, devolvendo o custo.
// ---------------------------------------------------------------------------

/** Insertion Sort (estável): cada `vetor[k] > chave` é uma comparação e cada deslocamento, uma movimentação. */
export function insertionSortList(list) {
  const a = copyItems(list);
  let comparisons = 0;
  let moves = 0;
  for (let j = 1; j < a.length; j += 1) {
    const key = a[j];
    let k = j - 1;
    while (k >= 0) {
      comparisons += 1;
      if (a[k].v <= key.v) break;
      a[k + 1] = a[k];
      moves += 1;
      k -= 1;
    }
    a[k + 1] = key;
  }
  return { list: a, comparisons, moves };
}

/** Selection Sort (instável): troca o menor com a primeira posição do trecho. */
export function selectionSortList(list) {
  const a = copyItems(list);
  let comparisons = 0;
  let moves = 0;
  for (let i = 0; i < a.length - 1; i += 1) {
    let min = i;
    for (let j = i + 1; j < a.length; j += 1) {
      comparisons += 1;
      if (a[j].v < a[min].v) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      moves += 1;
    }
  }
  return { list: a, comparisons, moves };
}

/** Pares de iguais (com letra) que estavam em uma ordem em `before` e passaram à ordem inversa em `after`: [quem vinha antes, quem passou à frente]. */
export function flippedPairs(before, after) {
  const place = new Map(after.map((item, index) => [`${item.v}/${item.tag}`, index]));
  const at = (item) => place.get(`${item.v}/${item.tag}`);
  const pairs = [];
  for (let x = 0; x < before.length; x += 1) {
    for (let y = x + 1; y < before.length; y += 1) {
      if (before[x].tag && before[x].v === before[y].v && at(before[x]) > at(before[y])) pairs.push([before[x], before[y]]);
    }
  }
  return pairs;
}

export const INNER_SORTS = {
  insertion: { name: 'Insertion Sort', stable: true, run: insertionSortList },
  selection: { name: 'Selection Sort', stable: false, run: selectionSortList },
};

// ---------------------------------------------------------------------------
// Corredores: o que aparece abaixo do vetor em cada passo.
// ---------------------------------------------------------------------------

/**
 * Buckets lado a lado. Cada bucket é `null` (ainda não existe, como na aula) ou a lista de itens
 * `{ v, tag, state }`, com `state` `'fresh'` (acabou de entrar), `'active'` (está sendo lido) ou `'done'` (já copiado).
 * `active` é o bucket em foco e `sorted` lista os que já foram ordenados.
 */
export const bucketsLane = (label, buckets, { active = null, sorted = [], hint = '' } = {}) => ({
  kind: 'buckets', label, hint, active, sorted: [...sorted], buckets: buckets.map((bucket) => (bucket === null ? null : bucket.map((item) => ({ ...item })))),
});

/**
 * Um vetor auxiliar (count, saída...). `values` aceita `null` para a posição ainda vazia; `pointers` é
 * `{ nome: índice }`; `activeIndices`, `changedIndices` e `foundIndices` pintam as células; `tags` são as letras dos repetidos.
 */
export const vectorLane = (label, values, extra = {}) => ({
  kind: 'vector', label, caption: '', pointers: {}, ...extra, values: [...values],
});

/** Texto "de onde veio o passo" usado pelos três módulos para pluralizar bem no inglês e no português. */
export const turns = (count) => plural(count, tr('volta', 'turn'), tr('voltas', 'turns'));

// ---------------------------------------------------------------------------
// Vetores de exemplo
// ---------------------------------------------------------------------------

export const almostSorted = (sorted) => {
  const copy = [...sorted];
  if (copy.length > 1) [copy[copy.length - 2], copy[copy.length - 1]] = [copy[copy.length - 1], copy[copy.length - 2]];
  return copy;
};

/** Os quatro vetores da adaptabilidade: ordenado, quase ordenado, em ordem inversa e o do aluno. */
export function adaptabilityScenarios(values) {
  const inOrder = [...values].sort((x, y) => x - y);
  return [
    { label: tr('Já ordenado', 'Already sorted'), values: inOrder },
    { label: tr('Quase ordenado', 'Almost sorted'), values: almostSorted(inOrder) },
    { label: tr('Ordem inversa', 'Reverse order'), values: [...inOrder].reverse() },
    { label: tr('Seu vetor', 'Your array'), values: [...values] },
  ];
}

// ---------------------------------------------------------------------------
// encontrarMaior / getMax, passo a passo (Counting Sort e Radix Sort)
// ---------------------------------------------------------------------------

/**
 * Executa a função que acha o maior valor de `a` (itens `{ v }`), um passo por linha: a entrada, o
 * `maior ← A[0]`, e para cada posição o laço, o `SE` (com o cartão de comparação) e a atribuição.
 * `lines` tem os índices `head`, `init`, `loop`, `test`, `set` e `ret`; `emit` é o do chamador;
 * `setVar` guarda o valor atual na variável `maior` do painel. Devolve o maior valor.
 */
export function traceFindMax(a, emit, lines, { fn, setVar = () => {} }) {
  let max = a[0].v;
  const holder = () => a.findIndex((item) => item.v === max);
  emit(lines.head, tr(`Entra em ${fn}(A)`, `Enters ${fn}(A)`), tr(`${fn} percorre o vetor uma vez para descobrir o maior valor.`, `${fn} goes through the array once to find the largest value.`), 'neutral');
  setVar(max, 0);
  emit(lines.init, tr('maior ← A[0]', 'largest ← A[0]'), tr(`O primeiro valor, ${max}, é o maior visto até agora.`, `The first value, ${max}, is the largest seen so far.`), 'neutral', { pointers: { i: 0 }, foundIndices: [0] });
  for (let i = 1; i < a.length; i += 1) {
    setVar(max, i);
    emit(lines.loop, `i = ${i}`, tr(`O laço olha a posição ${i}: A[${i}] = ${a[i].v}.`, `The loop looks at position ${i}: A[${i}] = ${a[i].v}.`), 'comparison', { pointers: { i }, foundIndices: [holder()] });
    const bigger = a[i].v > max;
    emit(lines.test, tr('A[i] > maior?', 'A[i] > largest?'), tr(`${a[i].v} > ${max}? ${bigger ? 'Sim, é o novo maior valor.' : 'Não, maior continua o mesmo.'}`, `${a[i].v} > ${max}? ${bigger ? 'Yes, it is the new largest value.' : 'No, largest stays the same.'}`), 'comparison', {
      pointers: { i }, comparedIndices: [i], foundIndices: [holder()], compare: { left: { label: 'A[i]', value: a[i].v }, op: '>', right: { label: tr('maior', 'largest'), value: max }, result: bigger },
    });
    if (bigger) {
      max = a[i].v;
      setVar(max, i);
      emit(lines.set, tr('maior ← A[i]', 'largest ← A[i]'), tr(`maior passa a valer ${max}.`, `largest now holds ${max}.`), 'neutral', { pointers: { i }, foundIndices: [i] });
    }
  }
  setVar(max, null);
  emit(lines.ret, tr(`RETORNE ${max}`, `RETURN ${max}`), tr(`${fn} devolve ${max}, o maior valor do vetor.`, `${fn} returns ${max}, the largest value of the array.`), 'neutral', { foundIndices: [holder()] });
  return max;
}
