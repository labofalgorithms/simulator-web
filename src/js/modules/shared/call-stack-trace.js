import { NONE, fmt } from './sort-steps.js';
import { tr } from '../../core/i18n.js';

// Execução como num depurador, com a pilha de chamadas inteira: cada passo é uma linha do pseudocódigo
// e leva os quadros (nome da chamada, variáveis locais, conta pendente e retorno). Os módulos de
// Recursão e de Buscas (a busca binária recursiva) desenham essa pilha com `renderCallStack`.

export function createTracer() {
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

export const actionPush = (text) => ({ kind: 'push', label: tr('Insere na pilha', 'Push onto the stack'), text });
export const actionReturn = (value, label = tr('Retorna', 'Returns')) => ({ kind: 'return', label, text: String(value) });
