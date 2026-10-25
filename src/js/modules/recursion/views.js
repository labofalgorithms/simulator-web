// Peças visuais do módulo de Recursão: a pilha de chamadas na vertical (como nos slides 26 a 37), a
// legenda da ação do passo ("Insere na pilha", "Retorna"), a conta que a recursão está montando, a
// string em células e o retorno parcial.

import { hasIndex } from '../../core/utils.js';
import { tr, variableName } from '../../core/i18n.js';

/**
 * Pilha de chamadas, com o topo em cima. `step.frames` vai da primeira chamada até a que executa; cada
 * quadro tem `name`, `note` (a conta pendente), `locals` (`[nome, valor]`), `result`, `state`
 * (`run`, `wait` ou `ret`) e `fresh` (acabou de entrar). `step.slots` reserva a altura da pilha inteira,
 * para a tela não pular de um passo para o outro; `step.ghost` é a chamada que não coube (estouro).
 */
export function renderCallStack(step, escapeText) {
  const frames = [...step.frames].reverse();
  const rows = frames.map((frame, index) => {
    const classes = ['cs-frame', frame.state];
    if (frame.fresh) classes.push('new');
    if (step.overflow) classes.push('bad');
    const locals = frame.locals.map(([name, value]) => `<span class="cs-local"><i>${escapeText(variableName(name))}</i> = ${escapeText(value)}</span>`).join('');
    const note = frame.note ? `<span class="cs-note">${escapeText(frame.note)}</span>` : '';
    const result = frame.result === null ? '' : `<span class="cs-result">${tr('retorna', 'returns')} ${escapeText(frame.result)}</span>`;
    return `
      <div class="cs-row">
        <div class="${classes.join(' ')}">
          <span class="cs-name">${escapeText(frame.name)}</span>${note}${result}
          <span class="cs-locals">${locals}</span>
        </div>
        <span class="cs-topo">${index === 0 && !step.ghost ? `<i></i>${tr('TOPO', 'TOP')}` : ''}</span>
      </div>`;
  }).join('');
  const ghost = step.ghost
    ? `<div class="cs-row"><div class="cs-frame ghost"><span class="cs-name">${escapeText(step.ghost)}</span><span class="cs-note">${tr('não cabe na pilha', 'does not fit on the stack')}</span></div><span class="cs-topo"><i></i>${tr('TOPO', 'TOP')}</span></div>`
    : '';
  const limit = step.limit ? `<small>${tr('limite', 'limit')}: ${step.limit} ${tr('frames', 'frames')}</small>` : `<small>${tr('topo em cima', 'top on top')}</small>`;
  return `
    <div class="cs-stack" role="group" aria-label="${tr('Pilha de chamadas, com o topo em cima', 'Call stack, with the top on top')}">
      <span class="cs-title">${tr('Pilha de chamadas', 'Call stack')} ${limit}</span>
      <div class="cs-frames" style="--slots:${step.slots}">${ghost}${rows || `<span class="cs-empty">${tr('vazia', 'empty')}</span>`}</div>
      <span class="cs-floor">${tr('programa que fez a chamada inicial', 'program that made the first call')}</span>
    </div>`;
}

/** Legenda da ação do passo, como o texto de cima da memória nos slides ("Insere na Pilha soma(4)", "Retorna 1"). */
export function renderAction(step, escapeText) {
  const { action } = step;
  const body = action
    ? `<span class="cs-action-label">${escapeText(action.label)}</span><strong>${escapeText(action.text)}</strong>`
    : `<span class="cs-action-hint">${tr('A ação de cada passo (entrada e retorno de chamadas) aparece aqui.', 'The action of each step (calls entering and returning) appears here.')}</span>`;
  return `<div class="cs-action${action ? ` ${action.kind}` : ''}">${body}</div>`;
}

/** A conta que a recursão monta: os termos que ficaram esperando nos quadros e o que o topo já vale. */
export function renderExpression(step, escapeText) {
  return `
    <div class="cs-expression">
      <small>${tr('A conta até agora', 'The calculation so far')}</small>
      <code>${escapeText(step.expression)}</code>
    </div>`;
}

/** A string em células, com os caracteres já separados do texto (`step.values`). */
export function renderChars(step) {
  const cells = step.values.map((char, index) => {
    const classes = ['sort-cell'];
    if (hasIndex(step.outsideIndices, index)) classes.push('outside');
    if (hasIndex(step.activeIndices, index)) classes.push('active');
    return `
      <div class="sort-slot">
        <span class="${classes.join(' ')}">${char === ' ' ? '␣' : char.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)}</span>
        <span class="sort-index">${index}</span>
      </div>`;
  }).join('');
  return `<div class="sort-scroll" role="group" aria-label="${tr('Os caracteres do texto', 'The characters of the text')}"><div class="sort-row">${cells}</div></div>`;
}

/** O texto que volta de uma chamada (`step.strip`: `label`, `text` e `appended`, que destaca o último caractere). */
export function renderStrip(step) {
  const { strip } = step;
  const cells = strip
    ? [...strip.text].map((char, index, all) => {
      const classes = ['sort-cell', 'aux'];
      if (strip.appended && index === all.length - 1) classes.push('changed', 'active');
      return `<span class="${classes.join(' ')}">${char.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)}</span>`;
    }).join('')
    : '';
  return `
    <div class="cs-strip${strip ? '' : ' empty'}">
      <span class="cs-strip-label">${strip ? strip.label.replace(/[&<>]/g, '') : tr('retorno', 'return')}</span>
      <div class="cs-strip-cells">${cells || `<span class="cs-strip-hint">${tr('o texto que volta de cada chamada aparece aqui', 'the text that comes back from each call appears here')}</span>`}</div>
    </div>`;
}
