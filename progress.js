/**
 * Progress storage — localStorage wrapper
 */

const ProgressStorage = {
  STORAGE_KEY: 'digits_progress',

  defaults() {
    return {
      completedDigits: { easy: [], medium: [], hard: [] },
      stars: 0,
      starsByDigit: {},
      currentDifficulty: 'easy',
      distractionLevel: 'none',
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return { ...this.defaults(), ...p };
      }
    } catch {}
    return this.defaults();
  },

  save(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {}
  },

  reset(data) {
    data.completedDigits = { easy: [], medium: [], hard: [] };
    data.stars = 0;
    data.starsByDigit = {};
    this.save(data);
  },
};

window.ProgressStorage = ProgressStorage;