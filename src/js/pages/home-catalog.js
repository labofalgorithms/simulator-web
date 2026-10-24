import { storage } from '../core/storage.js';
import { tr } from '../core/i18n.js';

// Catálogo da home: abas (Estruturas de Dados / Algoritmos) e busca entre os módulos.
// O HTML já traz o estado inicial (aba Estruturas de Dados aberta); este arquivo só o altera.

const TAB_KEY = 'loa-home-tab';
const TABS = ['estruturas', 'algoritmos'];

const normalize = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** Liga as abas e a busca do catálogo. Os ids `#estruturas` e `#algoritmos` abrem a aba correspondente. */
export function initCatalog() {
  const root = document.querySelector('#catalogo');
  if (!root) return;

  const tablist = root.querySelector('[role="tablist"]');
  const tabButtons = Object.fromEntries(TABS.map((name) => [name, root.querySelector(`#tab-${name}`)]));
  const panels = Object.fromEntries(TABS.map((name) => [name, root.querySelector(`#${name}`)]));
  const search = root.querySelector('#catalog-search');
  const status = root.querySelector('#catalog-status');
  const empty = root.querySelector('.catalog-empty');
  const groups = [...root.querySelectorAll('.module-group')];
  const cards = [...root.querySelectorAll('.module-card')].map((card) => ({
    card,
    group: card.closest('.module-group'),
    text: normalize([
      card.querySelector('h4').textContent,
      card.querySelector('p').textContent,
      card.dataset.keywords ?? '',
    ].join(' ')),
  }));

  TABS.forEach((name) => {
    tabButtons[name].querySelector('.tab-count').textContent = panels[name].querySelectorAll('.module-card.available').length;
  });
  groups.forEach((group) => {
    group.dataset.total = count(group.querySelectorAll('.module-card.available').length, tr('módulo', 'module'), tr('módulos', 'modules'));
  });

  const savedTab = storage.get(TAB_KEY, '');
  const hashTab = tabFromHash();
  let activeTab = hashTab ?? (TABS.includes(savedTab) ? savedTab : TABS[0]);
  let query = '';

  function tabFromHash() {
    const id = location.hash.slice(1);
    return TABS.includes(id) ? id : null;
  }

  function render() {
    const searching = query !== '';
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    root.classList.toggle('is-searching', searching);

    TABS.forEach((name) => {
      const selected = !searching && name === activeTab;
      tabButtons[name].setAttribute('aria-selected', String(selected));
      tabButtons[name].tabIndex = name === activeTab ? 0 : -1;
    });

    cards.forEach((entry) => {
      entry.card.hidden = searching && !terms.every((term) => entry.text.includes(term));
    });

    let found = 0;
    groups.forEach((group) => {
      const visible = group.querySelectorAll('.module-card:not([hidden])').length;
      group.hidden = visible === 0;
      group.querySelector('.group-count').textContent = searching ? '' : group.dataset.total;
      found += visible;
    });

    TABS.forEach((name) => {
      const visible = panels[name].querySelectorAll('.module-card:not([hidden])').length;
      panels[name].hidden = searching ? visible === 0 : name !== activeTab;
      panels[name].querySelector('.panel-count').textContent = searching ? count(visible, tr('resultado', 'result'), tr('resultados', 'results')) : '';
    });

    empty.hidden = !searching || found > 0;
    empty.querySelector('p').textContent = tr(`Nada para “${query}”. Tente “pilha”, “ordenação” ou “remover”.`, `Nothing for “${query}”. Try “stack”, “sorting” or “remove”.`);
    status.textContent = !searching ? '' : found > 0 ? `${count(found, tr('módulo encontrado', 'module found'), tr('módulos encontrados', 'modules found'))}.` : tr('Nenhum módulo encontrado.', 'No modules found.');
  }

  function setQuery(value) {
    search.value = value;
    query = value.trim();
    render();
  }

  function selectTab(name, { focus = false, scroll = false } = {}) {
    activeTab = name;
    storage.set(TAB_KEY, name);
    setQuery('');
    if (focus) tabButtons[name].focus();
    if (scroll) scrollToPanel(name, 'smooth');
  }

  // O hash acompanha a aba aberta, para o link da nav (`#algoritmos`) sempre disparar o `hashchange`.
  function chooseTab(name, options) {
    selectTab(name, options);
    history.replaceState(null, '', `#${name}`);
  }

  function scrollToPanel(name, behavior) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panels[name].scrollIntoView({ behavior: reduceMotion ? 'auto' : behavior, block: 'start' });
  }

  TABS.forEach((name) => tabButtons[name].addEventListener('click', () => chooseTab(name)));

  tablist.addEventListener('keydown', (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    let next;
    if (step) next = TABS[(TABS.indexOf(activeTab) + step + TABS.length) % TABS.length];
    else if (event.key === 'Home') next = TABS[0];
    else if (event.key === 'End') next = TABS[TABS.length - 1];
    else return;
    event.preventDefault();
    chooseTab(next, { focus: true });
  });

  window.addEventListener('hashchange', () => {
    const name = tabFromHash();
    if (name) selectTab(name, { scroll: true });
  });

  search.addEventListener('input', () => setQuery(search.value));
  search.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (search.value) setQuery('');
    else search.blur();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest?.('input, textarea, select, [contenteditable]')) return;
    event.preventDefault();
    search.focus();
  });

  render();

  // Chegou por um link de aba (por exemplo, o breadcrumb de um simulador): leva até o catálogo.
  const reloaded = performance.getEntriesByType?.('navigation')[0]?.type === 'reload';
  if (hashTab && !reloaded) requestAnimationFrame(() => scrollToPanel(hashTab, 'auto'));
}
