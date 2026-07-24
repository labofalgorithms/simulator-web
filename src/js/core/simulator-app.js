import { icons } from './icons.js';
import { SimulationController } from './simulation-controller.js';
import { storage } from './storage.js';
import { $, escapeText, speedLabel } from './utils.js';

export class SimulatorApp {
  constructor(module) {
    this.module = module;
    const storedData = storage.getJSON(module.storageKey, module.defaultData, module.isValidData);
    const data = module.sanitizeData(storedData);

    this.state = {
      algorithmId: module.defaultAlgorithmId,
      data,
      draft: module.formatData(data),
      config: module.createInitialConfig(data),
      inspectedItem: null,
      randomCount: module.defaultRandomCount,
      inputError: '',
      lightTheme: storage.get('loa-theme', 'dark') === 'light',
    };

    this.controller = new SimulationController({
      speed: 700,
      onChange: () => this.renderSimulation(),
    });
  }

  start() {
    this.bindEvents();
    this.rebuildSteps(false);
    this.renderAll();
  }

  get algorithm() {
    return this.module.algorithms.find((item) => item.id === this.state.algorithmId)
      || this.module.algorithms[0];
  }

  get currentStep() {
    return this.controller.currentStep;
  }

  rebuildSteps(shouldRender = true) {
    this.state.config = this.module.normalizeConfig(this.state.data, this.state.config);
    const steps = this.module.buildSteps(this.state.algorithmId, this.state.data, this.state.config);
    this.controller.load(steps, { notify: false });
    if (shouldRender) this.renderSimulation();
  }

  renderAll() {
    this.renderSidebar();
    this.renderHeader();
    this.renderEditor();
    this.renderConfig();
    this.renderSimulation();
    this.renderTheme();
  }

  renderSidebar() {
    const groups = [...new Set(this.module.algorithms.map((item) => item.group))];
    $('#algorithm-nav').innerHTML = groups.map((group) => `
      <div class="nav-group">
        <p>${escapeText(group)}</p>
        ${this.module.algorithms.filter((item) => item.group === group).map((item) => `
          <button class="nav-item ${item.id === this.state.algorithmId ? 'active' : ''}" type="button" data-core-action="algorithm" data-algorithm="${escapeText(item.id)}" ${item.id === this.state.algorithmId ? 'aria-current="page"' : ''}>
            <span class="nav-number">${escapeText(item.number)}</span><span>${escapeText(item.menuLabel)}</span>
          </button>`).join('')}
      </div>`).join('');
  }

  renderHeader() {
    const item = this.algorithm;
    $('#module-chip-name').textContent = `Módulo: ${this.module.name}`;
    $('#breadcrumb').innerHTML = `<a href="../../index.html">Simuladores</a> <b>/</b> ${escapeText(this.module.name)} <b>/</b> ${escapeText(item.menuLabel)}`;
    $('#lesson-kicker').innerHTML = `<span>${escapeText(item.number)}</span> algoritmo interativo`;
    $('#lesson-title').textContent = item.title;
    $('#lesson-description').textContent = item.description;
    $('#time-complexity').textContent = item.complexity.time;
    $('#space-complexity').textContent = item.complexity.space;
    $('#interaction-text').textContent = item.interaction;
    $('#complexity-note').textContent = item.complexity.note;
    $('#info-icon').innerHTML = icons.info;
    $('#visualization-title').textContent = this.module.visualizationTitle;
    $('#footer-module').textContent = `${this.module.name} · versão ${this.module.version}`;
  }

  renderEditor() {
    $('#data-editor').innerHTML = this.module.renderEditor({ state: this.state, icons, escapeText });
  }

  renderConfig() {
    const panel = $('#config-panel');
    const content = this.module.renderConfig({ state: this.state, algorithm: this.algorithm, escapeText });
    panel.hidden = !content;
    panel.innerHTML = content || '';
  }

  renderVisualization() {
    $('#visualization-stage').innerHTML = this.module.renderVisualization({
      state: this.state,
      step: this.currentStep,
      icons,
      escapeText,
    });
  }

  renderPlayback() {
    const step = this.currentStep;
    const total = this.controller.steps.length;
    if (!step || !total) return;
    const progress = total <= 1 ? 100 : (this.controller.index / (total - 1)) * 100;
    $('#status-pill').className = `status-pill ${step.tone}`;
    $('#status-pill').querySelector('span').textContent = step.title;
    $('#progress-bar').style.width = `${progress}%`;
    $('#mini-progress').style.width = `${progress}%`;
    $('#step-current').textContent = this.controller.index + 1;
    $('#step-total').textContent = `/ ${total} passos`;
    $('#restart').innerHTML = icons.restart;
    $('#previous').innerHTML = icons.previous;
    $('#next').innerHTML = icons.next;
    $('#restart').disabled = this.controller.index === 0;
    $('#previous').disabled = this.controller.index === 0;
    $('#next').disabled = this.controller.index >= total - 1;
    $('#play-toggle').innerHTML = `${this.controller.playing ? icons.pause : icons.play}<span>${this.controller.playing ? 'Pausar' : 'Executar'}</span>`;
    $('#speed').value = this.controller.speed;
    $('#speed-output').textContent = speedLabel(this.controller.speed);
  }

  renderDetails() {
    const step = this.currentStep;
    if (!step) return;
    $('#step-eyebrow').textContent = `Passo ${this.controller.index + 1} de ${this.controller.steps.length}`;
    $('#step-title').textContent = step.title;
    $('#step-description').textContent = step.description;
    const entries = Object.entries(step.variables || {});
    $('#variables').innerHTML = entries.length
      ? `<dl>${entries.map(([name, value]) => `<div><dt>${escapeText(name)}</dt><dd>${escapeText(value)}</dd></div>`).join('')}</dl>`
      : '<p class="empty-state">As variáveis aparecerão durante a execução.</p>';
    const output = step.output || [];
    $('#console-output').innerHTML = output.length
      ? output.map((line) => `<p><span>›</span>${escapeText(line)}</p>`).join('')
      : '<p class="console-placeholder">Aguardando saída...</p>';
  }

  renderPseudocode() {
    const activeLine = this.currentStep?.line;
    $('#code-lines').innerHTML = this.algorithm.pseudocode.map((line, index) => `
      <li class="${index === activeLine ? 'active' : ''}"><span class="line-number">${String(index + 1).padStart(2, '0')}</span><code>${escapeText(line || ' ')}</code></li>`).join('');
  }

  renderSimulation() {
    if (!this.currentStep) return;
    this.renderVisualization();
    this.renderPlayback();
    this.renderDetails();
    this.renderPseudocode();
  }

  renderTheme() {
    document.documentElement.dataset.theme = this.state.lightTheme ? 'light' : 'dark';
    $('#theme-button').innerHTML = this.state.lightTheme ? icons.moon : icons.sun;
    storage.set('loa-theme', this.state.lightTheme ? 'light' : 'dark');
  }

  changeAlgorithm(id) {
    this.state.algorithmId = id;
    this.state.inspectedItem = null;
    this.rebuildSteps(false);
    this.renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setData(data) {
    this.state.data = this.module.sanitizeData(data);
    this.state.draft = this.module.formatData(this.state.data);
    this.state.config = this.module.normalizeConfig(this.state.data, this.state.config);
    this.state.inspectedItem = null;
    this.state.inputError = '';
    storage.setJSON(this.module.storageKey, this.state.data);
    this.rebuildSteps(false);
    this.renderAll();
  }

  bindEvents() {
    $('#app').addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      if (button.dataset.coreAction === 'algorithm') {
        this.changeAlgorithm(button.dataset.algorithm);
        return;
      }

      if (button.dataset.moduleAction) {
        this.module.handleAction(button.dataset.moduleAction, button, this);
        return;
      }

      switch (button.id) {
        case 'theme-button':
          this.state.lightTheme = !this.state.lightTheme;
          this.renderTheme();
          break;
        case 'restart': this.controller.restart(); break;
        case 'previous': this.controller.previous(); break;
        case 'next': this.controller.next(); break;
        case 'play-toggle': this.controller.toggle(); break;
        default: break;
      }
    });

    $('#app').addEventListener('input', (event) => {
      const input = event.target;
      if (input.id === 'speed') {
        this.controller.setSpeed(input.value);
        $('#speed-output').textContent = speedLabel(this.controller.speed);
        return;
      }
      if (input.dataset.moduleInput) this.module.handleInput(input.dataset.moduleInput, input, this);
    });

    $('#app').addEventListener('keydown', (event) => {
      if (event.target.matches('[data-module-enter="apply"]') && event.key === 'Enter') {
        event.preventDefault();
        this.module.handleAction('apply-data', event.target, this);
      }
    });

    window.addEventListener('keydown', (event) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (event.key === 'ArrowRight') this.controller.next();
      if (event.key === 'ArrowLeft') this.controller.previous();
      if (event.key === ' ') {
        event.preventDefault();
        this.controller.toggle();
      }
    });
  }
}
