// Peças de execução compartilhadas pelos módulos de ordenação (Selection Sort, Bubble Sort e
// Insertion Sort): o formato de um passo, a formatação dos valores e os itens com letra que marcam
// a ordem original dos repetidos (estabilidade).

/** Valor mostrado para uma variável que ainda não foi atribuída. */
export const NONE = '—';

export const clone = (values) => [...values];
export const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
export const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);
export const ascending = (values) => [...values].sort((x, y) => x - y);

/** Um passo da simulação: o vetor naquele ponto, a linha do pseudocódigo e o texto da explicação. */
export const step = (values, line, title, description, tone = 'neutral', extra = {}) => ({
  values: clone(values), line, title, description, tone, variables: {}, output: [], ...extra,
});

// ---------------------------------------------------------------------------
// Itens { v: valor, tag: letra }: os valores repetidos recebem uma letra pela ordem original,
// e um algoritmo estável termina com as letras de cada valor em ordem alfabética.
// ---------------------------------------------------------------------------

const TAGS = 'abcdefghij';

export const toItems = (values) => values.map((v) => ({ v, tag: '' }));

export function tagDuplicates(values) {
  const totals = new Map();
  values.forEach((value) => totals.set(value, (totals.get(value) ?? 0) + 1));
  const seen = new Map();
  return values.map((v) => {
    if (totals.get(v) < 2) return { v, tag: '' };
    const occurrence = seen.get(v) ?? 0;
    seen.set(v, occurrence + 1);
    return { v, tag: TAGS[occurrence] };
  });
}

export const isStable = (items) => {
  const last = new Map();
  return items.every((item) => {
    if (!item.tag) return true;
    const previous = last.get(item.v);
    last.set(item.v, item.tag);
    return previous === undefined || previous < item.tag;
  });
};

export const label = (item) => (item.tag ? `${fmt(item.v)}(${item.tag})` : fmt(item.v));
export const valuesOf = (items) => items.map((item) => item.v);
export const tagsOf = (items) => items.map((item) => item.tag);

/** Vetor com valores repetidos, para os algoritmos que são estáveis (qualquer um serve). */
export function repeatedExample(count) {
  const span = Math.max(2, Math.ceil(count * 0.6));
  const pool = Array.from({ length: span }, () => 10 + Math.floor(Math.random() * 90));
  const values = Array.from({ length: count }, () => pool[Math.floor(Math.random() * span)]);
  if (new Set(values).size === values.length) values[values.length - 1] = values[0];
  return values;
}

/**
 * Vetor com valores repetidos mas sem exagero: `distinct` valores diferentes (3 ou 60% do tamanho,
 * o que for maior, e sempre ao menos um repetido), embaralhados. Base dos exemplos de estabilidade.
 */
export function withRepeats(count) {
  const distinct = Math.min(count - 1, Math.max(3, Math.ceil(count * 0.6)));
  const pool = Array.from({ length: 90 }, (_, index) => index + 10);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }
  const base = pool.slice(0, distinct);
  const values = [...base, ...Array.from({ length: count - distinct }, () => base[Math.floor(Math.random() * distinct)])];
  for (let index = values.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [values[index], values[other]] = [values[other], values[index]];
  }
  return values;
}
