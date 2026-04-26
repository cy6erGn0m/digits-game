/**
  * @file animations.js
  * Animations — pure CSS animations, no dependencies. Handles flash, pulse, confetti, and hints.
  */

const Animations = {
  /**
   * Flash overlay green or red.
   * @param {string} color - 'green' or 'red'
   */
  flash(color) {
    const el = document.getElementById('flash');
    el.className = 'flash-overlay';
    el.classList.add(color === 'green' ? 'flash-green' : 'flash-red');
    setTimeout(() => { el.className = 'flash-overlay'; }, color === 'green' ? 300 : 500);
  },

  /**
   * Shortcut for flashCorrect.
   */
  flashCorrect() {
    this.flash('green');
  },

  /**
   * Shortcut for flashWrong.
   */
  flashWrong() {
    this.flash('red');
  },

  /**
   * Pulse animation on correct element.
   * @param {Element} el - Element to animate
   */
  pulseCorrect(el) {
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'pulse-green 0.5s ease';
  },

  /**
   * Show hint on element (called from UI layer).
   * @param {Object} task - Task object
   */
  showHint(task) {
    if (task.type === TaskType.ORDINAL_POSITION) {
      const items = document.querySelectorAll('.row-emoji');
      const idx = task.correctIndex;
      const target = [...items].find(el => parseInt(el.dataset.index) === idx);
      if (target) target.classList.add('hint-highlight');
    } else {
      const btns = document.querySelectorAll('.option-btn');
      const idx = task.options.findIndex(o => o.isCorrect);
      if (btns[idx]) btns[idx].classList.add('correct-hint');
    }
  },

  /**
   * Remove all hint highlight classes.
   */
  hideHint() {
    document.querySelectorAll('.correct-hint').forEach(el => el.classList.remove('correct-hint'));
    document.querySelectorAll('.hint-highlight').forEach(el => el.classList.remove('hint-highlight'));
  },

  /**
   * Spawn confetti particles (60 pieces, 5s duration).
   */
  confetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#ff6b6b', '#ffd93d', '#6bcf6b', '#6bcfff', '#c56bff', '#ff6bc5'];
    const _randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const _randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${_randomInt(0, 100)}%`;
      piece.style.backgroundColor = _randomFrom(colors);
      piece.style.animationDuration = `${_randomInt(2000, 4000)}ms`;
      piece.style.animationDelay = `${_randomInt(0, 500)}ms`;
      piece.style.width = `${_randomInt(8, 14)}px`;
      piece.style.height = `${_randomInt(8, 14)}px`;
      piece.style.borderRadius = _randomFrom(['50%', '2px', '4px']);
      container.appendChild(piece);
    }
    setTimeout(() => { container.innerHTML = ''; }, 5000);
  },
};

window.Animations = Animations;