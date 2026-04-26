/**
 * @file progress.js
 * ProgressStorage — localStorage wrapper for game progress persistence.
 */

const ProgressStorage = {
  STORAGE_KEY: 'digits_progress',

  /**
   * Get default progress object.
   * @returns {Object} Default progress data
   */
  defaults() {
    return {
      completedDigits: { easy: [], medium: [], hard: [] },
      stars: 0,
      starsByDigit: {},
      currentDifficulty: 'easy',
      distractionLevel: 'none',
    };
  },

  /**
   * Load progress from localStorage, merge with defaults.
   * @returns {Object} Progress data
   */
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

  /**
   * Save progress to localStorage.
   * @param {Object} data - Progress data to save
   */
  save(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {}
  },

  /**
   * Reset progress to defaults.
   * @param {Object} data - Progress data to reset
   */
  reset(data) {
    data.completedDigits = { easy: [], medium: [], hard: [] };
    data.stars = 0;
    data.starsByDigit = {};
    this.save(data);
  },
};

window.ProgressStorage = ProgressStorage;