// Execução "como num depurador" compartilhada pelos módulos de Ordenação Parcial e de Ordenação Mista:
// o vetor de itens `{ v, tag }`, os quadros da pilha de chamadas (cada um com as suas variáveis), os
// contadores e o registro dos passos. Com `record` falso o mesmo código roda sem montar nenhum passo
// (análises, conferência por script e exemplos de estabilidade).

import {
  clone, step, tagsOf, valuesOf,
} from './sort-steps.js';

export { NONE } from './sort-steps.js';

export const cmp = (left, leftValue, op, right, rightValue, result) => ({
  left: { label: left, value: leftValue }, op, right: { label: right, value: rightValue }, result,
});

/**
 * `decorate({ frame, a, counters })` devolve o que depende do algoritmo em cada passo (marcadores,
 * posições ordenadas, intervalo fora do trecho...). `moveLabel` é o nome da segunda estatística
 * ("trocas", "deslocamentos", "movimentações").
 */
export function createDebugger(items, { record = true, moveLabel = 'trocas', decorate = null } = {}) {
  const a = items.map((item) => ({ ...item }));
  const steps = [];
  const frames = [];
  const log = [];
  const counters = { comparisons: 0, moves: 0 };

  function add(line, title, description, tone = 'neutral', extra = {}) {
    if (!record) return;
    const top = frames.at(-1);
    const { pointers: own = {}, stats: ownStats = {}, ...rest } = extra;
    const { pointers: basePointers = {}, stats: baseStats = {}, ...baseRest } = decorate ? decorate({ frame: top, a, counters }) : {};
    steps.push(step(valuesOf(a), line, title, description, tone, {
      tags: tagsOf(a),
      stats: {
        'comparações': counters.comparisons, [moveLabel]: counters.moves, ...baseStats, ...ownStats,
      },
      stack: frames.map((entry) => entry.label),
      variables: { ...(top?.vars ?? {}) },
      phase: top?.phase ? { label: top.label, text: typeof top.phase === 'function' ? top.phase() : top.phase, code: true } : undefined,
      output: clone(log),
      ...baseRest,
      ...rest,
      pointers: { ...basePointers, ...own },
    }));
  }

  const push = (frame) => { frames.push(frame); return frame; };
  const pop = () => frames.pop();

  return {
    a, steps, frames, log, counters, add, push, pop,
  };
}

/** Os índices de `a` que não estão em `keep` (para pintar de "fora do trecho"). */
export const outside = (count, low, high) => Array.from({ length: count }, (_, index) => index).filter((index) => index < low || index > high);
