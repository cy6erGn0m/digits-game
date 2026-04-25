/**
 * Speech — Web Speech API wrapper (ru-RU)
 * Gracefully falls back silently if unavailable.
 */

const Speech = {
  enabled: false,

  init() {
    if ('speechSynthesis' in window) {
      this.enabled = true;
    }
  },

  speak(text) {
    if (!this.enabled) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU';
    u.rate = 0.85;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  },

  speakTask(audioText) {
    this.speak(audioText);
  },

  speakCorrect() {
    this.speak('Молодец!');
  },

  speakWrong() {
    this.speak('Попробуй ещё');
  },
};

window.Speech = Speech;