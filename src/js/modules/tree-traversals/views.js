import { tr } from '../../core/i18n.js';
// Peças visuais do módulo de percursos que não são a árvore: a fila do percurso em largura e a pilha
// de chamadas do fatorial. A pilha de chamadas dos percursos em profundidade é a de recursion-view.js.

/**
 * Fila do percurso em largura, da frente (o próximo a sair) até o fim. `step.queue` é a lista de
 * textos, ou `null` enquanto a linha "CRIE uma fila" ainda não executou.
 */
export function renderQueue(step, escapeText) {
  const items = step.queue;
  let body;
  if (items === null) body = `<span class="sort-stack-empty">${tr('ainda não criada', 'not created yet')}</span>`;
  else if (!items.length) body = `<span class="sort-stack-empty">${tr('vazia', 'empty')}</span>`;
  else {
    body = items
      .map((value, index) => `<span class="sort-frame${index === 0 ? ' top' : ''}"${index === 0 ? tr(' title="frente da fila: o próximo a sair"', ' title="front of the queue: the next to leave"') : ''}>${escapeText(value)}</span>`)
      .join('<i class="sort-frame-sep">›</i>');
  }
  return `
    <div class="sort-stack tree-queue" role="group" aria-label="${tr('Fila de nós', 'Queue of nodes')}">
      <span class="sort-stack-title">${tr('Fila (frente → fim)', 'Queue (front → rear)')}</span>
      <div class="sort-stack-frames">${body}</div>
    </div>`;
}

const LEGEND = [['current', tr('chamada em execução (topo)', 'call running (top)')], ['processed', tr('esperando o retorno', 'waiting for the return')]];

/**
 * Pilha de chamadas do fatorial, com o topo em cima (como nos slides). `step.frames` vai da primeira
 * chamada até a do topo, com `{ n, expr, top }`, e `step.returned` é o valor que acabou de voltar.
 */
export function renderFactorial(step, escapeText) {
  const frames = [...step.frames].reverse();
  const items = frames.map((frame) => `
    <div class="rec-frame${frame.top ? ' top' : ''}">
      <b>${tr('fatorial(', 'factorial(')}${escapeText(frame.n)})</b>
      <span>n = ${escapeText(frame.n)}</span>
      <em>${frame.expr ? escapeText(frame.expr) : ''}</em>
    </div>`).join('');
  const legend = LEGEND.map(([cls, label]) => `<span><i class="legend-dot ${cls}"></i> ${label}</span>`).join('');
  return `
    <div class="node-stage">
      <div class="rec-stack" role="group" aria-label="${tr('Pilha de chamadas, com o topo em cima', 'Call stack, with the top on top')}">
        <span class="rec-stack-title">${tr('Pilha de chamadas', 'Call stack')} <small>${tr('topo em cima', 'top on top')}</small></span>
        <div class="rec-frames" style="min-height:${step.capacity * 40}px">${items || `<span class="rec-empty">${tr('vazia', 'empty')}</span>`}</div>
      </div>
      <div class="rec-returned${step.returned ? ' show' : ''}">${step.returned ? escapeText(step.returned) : '&nbsp;'}</div>
      <div class="node-legend" aria-label="${tr('Legenda', 'Legend')}">${legend}</div>
    </div>`;
}
