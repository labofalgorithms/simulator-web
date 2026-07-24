export const storage = {
  get(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  },

  getJSON(key, fallback, validator = () => true) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      const value = JSON.parse(raw);
      return validator(value) ? value : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // O simulador continua funcionando mesmo quando o armazenamento está bloqueado.
    }
  },

  setJSON(key, value) {
    this.set(key, JSON.stringify(value));
  },
};
