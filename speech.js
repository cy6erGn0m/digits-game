/**
 * @file speech.js
 * Speech — Web Speech API wrapper (ru-RU). Gracefully falls back silently if unavailable.
 */

const Speech = {
  enabled: false,

  /**
   * Initialize speech synthesis. Check browser support.
   */
  init() {
    if ('speechSynthesis' in window) {
      this.enabled = true;
    }
  },

  /**
   * Speak text using Web Speech API.
   * @param {string} text - Text to speak
   */
  speak(text) {
    if (!this.enabled) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU';
    u.rate = 0.85;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  },

  /**
   * Speak task question.
   * @param {string} audioText - Question text
   */
  speakTask(audioText) {
    this.speak(audioText);
  },

  /**
   * Speak "Молодец!" (Great job!).
   */
  speakCorrect() {
    this.speak('Молодец!');
  },

  /**
   * Speak "Попробуй ещё" (Try again).
   */
  speakWrong() {
    this.speak('Попробуй ещё');
  },
};

window.Speech = Speech;