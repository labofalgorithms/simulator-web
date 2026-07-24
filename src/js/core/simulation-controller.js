import { clamp } from './utils.js';

export class SimulationController {
  constructor({ speed = 700, onChange = () => {} } = {}) {
    this.steps = [];
    this.index = 0;
    this.playing = false;
    this.speed = speed;
    this.timer = null;
    this.onChange = onChange;
  }

  get currentStep() {
    return this.steps[Math.min(this.index, Math.max(0, this.steps.length - 1))];
  }

  load(steps, { notify = true } = {}) {
    this.stop(false);
    this.steps = Array.isArray(steps) ? steps : [];
    this.index = 0;
    if (notify) this.notify();
  }

  setSpeed(speed) {
    this.speed = Number(speed);
    if (this.playing) this.schedule();
  }

  next() {
    this.stop(false);
    this.index = clamp(this.index + 1, 0, Math.max(0, this.steps.length - 1));
    this.notify();
  }

  previous() {
    this.stop(false);
    this.index = clamp(this.index - 1, 0, Math.max(0, this.steps.length - 1));
    this.notify();
  }

  restart() {
    this.stop(false);
    this.index = 0;
    this.notify();
  }

  toggle() {
    if (!this.steps.length) return;
    if (this.index >= this.steps.length - 1) this.index = 0;
    this.playing = !this.playing;
    this.notify();
    if (this.playing) this.schedule();
  }

  stop(shouldNotify = true) {
    this.playing = false;
    this.clearTimer();
    if (shouldNotify) this.notify();
  }

  schedule() {
    this.clearTimer();
    if (!this.playing || this.index >= this.steps.length - 1) {
      this.playing = false;
      this.notify();
      return;
    }

    this.timer = window.setTimeout(() => {
      this.index += 1;
      if (this.index >= this.steps.length - 1) this.playing = false;
      this.notify();
      if (this.playing) this.schedule();
    }, this.speed);
  }

  clearTimer() {
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
  }

  notify() {
    this.onChange(this);
  }
}
