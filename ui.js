/**
 * @file ui.js
 * UIController — manages DOM, subscribes to VM events, updates UI.
 */

const UI = {
  vm: null,

  /**
   * Initialize UI with view model.
   * @param {AppViewModel} vm - AppViewModel instance
   */
  init(vm) {
    this.vm = vm;
    this._bindNavigation();
    this._subscribe();
  },

  // ============================================================
  // Navigation bindings
  // ============================================================
  /**
   * Bind all navigation button click handlers.
   */
  _bindNavigation() {
    // Splash → difficulty
    document.getElementById('btn-start').addEventListener('click', () => {
      this.vm.navigate('level-select');
    });

    // Back: difficulty → splash
    document.getElementById('btn-back-to-splash').addEventListener('click', () => {
      this.vm.navigate('splash');
    });

    // Level cards → set difficulty, then go to digit-select or task
    document.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
        const difficulty = card.dataset.difficulty;
        const distraction = card.dataset.distraction === 'easy' ? DistractionLevel.NONE : DistractionLevel.TYPE_FILTER;
        this.vm.setDifficulty(difficulty);
        this.vm.setDistraction(distraction);

        if (difficulty.includes('random')) {
          this.vm.startSession(difficulty, distraction);
        } else {
          this.vm.navigate('digit-select');
        }
      });
    });

    // Digit select: change level → difficulty
    document.getElementById('btn-change-level').addEventListener('click', () => {
      this.vm.navigate('level-select');
    });

    // Digit select: back → difficulty
    document.getElementById('btn-back-to-levels').addEventListener('click', () => {
      this.vm.navigate('level-select');
    });

    // Game: speak button
    document.getElementById('btn-speak').addEventListener('click', () => {
      this.vm.repeatAudio();
    });

    // Reward → next digit
    document.getElementById('btn-next-digit').addEventListener('click', () => {
      this.vm.continueFromReward();
    });

    // Reward → menu
    document.getElementById('btn-menu').addEventListener('click', () => {
      this.vm.navigate('level-select');
    });

    // Completion → restart level
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.vm.restartLevel();
    });

    // Completion → menu
    document.getElementById('btn-back-to-splash-2').addEventListener('click', () => {
      this.vm.navigate('level-select');
    });
  },

  // ============================================================
  // VM event subscriptions
  // ============================================================
  /**
   * Subscribe to all VM events.
   */
  _subscribe() {
    const vm = this.vm;

    vm.addEventListener('screenChanged',    () => this._renderScreen());
    vm.addEventListener('taskChanged',     () => this._renderTask());
    vm.addEventListener('feedbackChanged', () => this._updateFeedback());
    vm.addEventListener('correctAnswer',   () => this._onCorrect());
    vm.addEventListener('wrongAnswer',      () => this._onWrong());
    vm.addEventListener('hintActivated',   () => this._showHint());
    vm.addEventListener('hintDeactivated', () => this._hideHint());
    vm.addEventListener('rewardEarned',     (e) => this._showReward(e.detail));
    vm.addEventListener('starsUpdated',     () => this._updateStars());
    vm.addEventListener('audioRequested',  (e) => Speech.speakTask(e.detail));
  },

  // ============================================================
  // Screen rendering
  // ============================================================
  /**
   * Show the current screen, hide others. Calls specific renderers.
   */
  _renderScreen() {
    const screen = this.vm.currentScreen;
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    const elId = {
      splash: 'splash',
      'level-select': 'level-select',
      'digit-select': 'digit-select',
      task: 'game',
      reward: 'reward',
      completion: 'completion',
    }[screen];

    const el = document.getElementById(elId);
    if (!el) return;
    
    el.classList.add('active');

    if (screen === 'level-select') this._renderLevelSelect();
    if (screen === 'digit-select') this._renderDigitSelect();
    if (screen === 'task') this._updateStars();
  },

  /**
   * Render level-select screen (total stars display).
   */
  _renderLevelSelect() {
    const total = this.vm.totalStars;
    const el = document.getElementById('total-stars');
    if (el) el.textContent = total > 0 ? '⭐'.repeat(Math.min(total, 20)) : '';
  },

  /**
   * Render digit-select grid with star indicators.
   */
  _renderDigitSelect() {
    const rangeInfo = this._getRangeInfo();
    const [min, max] = rangeInfo.range.split('-').map(Number);

    const titleEl = document.getElementById('digit-select-title');
    if (titleEl) titleEl.textContent = `Учим ${rangeInfo.range}`;

    const grid = document.getElementById('digit-grid');
    if (!grid) {
      return;
    }
    grid.innerHTML = '';

    for (let d = min; d <= max; d++) {
      const btn = document.createElement('button');
      btn.className = 'digit-btn';
      const stars = this.vm.getStarsForDigit(d);
      if (stars >= 3) {
        btn.classList.add('starred');
        btn.innerHTML = `${d}<span class="digit-stars">⭐⭐⭐</span>`;
      } else {
        btn.innerHTML = `${d}<span class="digit-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>`;
      }
      btn.addEventListener('click', () => {
        this.vm.startDigitLesson(d);
      });
      grid.appendChild(btn);
    }

    const starsEl = document.getElementById('level-stars');
    if (starsEl) {
      starsEl.textContent = this.vm.totalStars > 0
        ? '⭐'.repeat(Math.min(this.vm.totalStars, 10))
        : '';
    }
  },

  /**
   * Get range info for current difficulty.
   * @returns {Object} {range: '1-5'|'1-10'|'1-20', dist: difficulty}
   */
  _getRangeInfo() {
    const d = this.vm.difficulty;
    let range;
    if (d.includes('easy')) range = '1-5';
    else if (d.includes('medium')) range = '1-10';
    else range = '1-20';
    return { range, dist: d };
  },

  // ============================================================
  // Task rendering
  // ============================================================
  /**
   * Render current task (question, instruction, content, options).
   */
  _renderTask() {
    const task = this.vm.currentTaskData;
    if (!task) return;

    this._renderQuestion(task);
    this._renderInstruction(task);
    this._renderContent(task);
    this._renderOptions(task);
    this._updateTaskProgress();
  },

  /**
   * Render task instruction text from task.instruction field.
   * @param {Object} task - Task object
   */
  _renderInstruction(task) {
    const el = document.getElementById('task-instruction');
    el.innerHTML = '';

    if (task.instruction) {
      el.textContent = task.instruction;
      el.style.cssText = 'font-size:0.85rem;color:#888;margin:8px 0;text-align:center;';
    }
  },

  /**
   * Render question area with emoji/number.
   * @param {Object} task - Task object
   */
  _renderQuestion(task) {
    const q = document.getElementById('question-emoji');
    q.innerHTML = '';
    
    // Always show the question label prominently
    if (task.questionEmoji) {
      const qDiv = document.createElement('div');
      qDiv.innerHTML = task.questionEmoji;
      qDiv.style.cssText = 'font-size:3rem;margin-bottom:8px;';
      q.appendChild(qDiv);
    } else if (task.items.length > 0) {
      // Default to first emoji type for countToDigit
      const typeEmoji = document.createElement('span');
      typeEmoji.style.cssText = 'font-size:3rem;margin-bottom:8px;';
      typeEmoji.textContent = task.items[0].emoji;
      q.appendChild(typeEmoji);
    }
  },

  /**
   * Render task content (emoji row or emoji group).
   * @param {Object} task - Task object
   */
  _renderContent(task) {
    const el = document.getElementById('content-area');
    el.innerHTML = '';

    if (task.type === TaskType.ORDINAL_POSITION) {
      const row = document.createElement('div');
      row.className = 'emoji-row';
      row.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:flex-start;gap:6px;';
      task.items.forEach((item, idx) => {
        const span = document.createElement('span');
        span.className = 'row-emoji';
        span.textContent = item.emoji;
        span.dataset.index = idx;
        span.addEventListener('click', () => {
          this.vm.submitPositionTap(parseInt(idx));
        });
        row.appendChild(span);
      });
      el.appendChild(row);
    } else if (task.items.length > 0) {
      const container = document.createElement('div');
      container.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:8px;';
      task.items.forEach(item => {
        const span = document.createElement('span');
        span.className = 'emoji-item';
        span.textContent = item.emoji;
        container.appendChild(span);
      });
      el.appendChild(container);
    }
  },

  /**
   * Render answer option buttons (not for ordinalPosition).
   * @param {Object} task - Task object
   */
  _renderOptions(task) {
    const el = document.getElementById('options-area');
    el.innerHTML = '';

    if (task.type === TaskType.ORDINAL_POSITION) return;

task.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = opt.label;
      btn.dataset.index = idx;

      btn.addEventListener('click', () => {
        this.vm.submitAnswer(parseInt(idx));
      });
      el.appendChild(btn);
    });
    
    if (el.children.length === 0) {
      console.log('WARNING: No options rendered! options empty:', task.options);
    }
  },

  /**
   * Check if label string contains emojis.
   * @param {string} label - String to check
   * @returns {boolean}
   */
  _isEmojiString(label) {
    return /[\u{1F300}-\u{1F9FF}]/u.test(label);
  },

  /**
   * Update task progress counter (e.g., "2 / 4").
   */
  _updateTaskProgress() {
    const el = document.getElementById('game-counter');
    if (el) el.textContent = `${this.vm.lessonTaskIndex} / 4`;
  },

  // ============================================================
  // Feedback
  // ============================================================
  /**
   * Update visual feedback (flash screen green/red).
   */
  _updateFeedback() {
    const state = this.vm.feedbackState;
    if (state === null) return;
    Animations.flash(state === 'correct' ? 'green' : 'red');
  },

  /**
   * Handle correct answer — pulse animation, confetti, voice.
   */
  _onCorrect() {
    Animations.pulseCorrect(this._getCorrectElement());
    Animations.confetti();
    Speech.speakCorrect();
  },

  /**
   * Handle wrong answer — flash red, voice feedback.
   */
  _onWrong() {
    Animations.flash('red');
    Speech.speakWrong();
  },

  /**
   * Get the correct element for pulse animation.
   * @returns {Element|null} Correct option button or emoji item
   */
  _getCorrectElement() {
    const task = this.vm.currentTaskData;
    if (!task) return null;
    if (task.type === TaskType.ORDINAL_POSITION) {
      const items = document.querySelectorAll('.emoji-item.tappable');
      return items[task.correctIndex] || null;
    } else {
      const btns = document.querySelectorAll('.option-btn');
      const idx = task.options.findIndex(o => o.isCorrect);
      return btns[idx] || null;
    }
  },

  // ============================================================
  // Stars
  // ============================================================
  /**
   * Update stars display for current digit.
   */
  _updateStars() {
    const digit = this.vm.currentDigit;
    const stars = this.vm.getStarsForDigit(digit);
    const el = document.getElementById('game-stars');
    if (el) {
      el.innerHTML = Array.from({ length: 3 }, (_, i) => i < stars ? '⭐' : '☆').join('');
    }
  },

  // ============================================================
  // Hints
  // ============================================================
  /**
   * Show hint by highlighting correct answer.
   */
  _showHint() {
    const task = this.vm.currentTaskData;
    if (!task || !task.hintData) return;

    if (task.type === TaskType.ORDINAL_POSITION) {
      const items = document.querySelectorAll('.emoji-item.tappable');
      task.hintData.highlightItems.forEach(i => {
        if (items[i]) items[i].classList.add('hint-highlight');
      });
    } else {
      const btns = document.querySelectorAll('.option-btn');
      const idx = task.hintData.highlightOptionIndex;
      if (btns[idx]) btns[idx].classList.add('correct-hint');
    }
  },

  /**
   * Hide hint by removing highlight classes.
   */
  _hideHint() {
    Animations.hideHint();
  },

  // ============================================================
  // Reward
  // ============================================================
  /**
   * Show reward screen with confetti and message.
   * @param {Object} detail - {digit, stars}
   */
  _showReward(detail) {
    Animations.confetti();

    const mascot = document.getElementById('reward-mascot');
    const title = document.getElementById('reward-title');
    const msg = document.getElementById('reward-message');
    const nextBtn = document.getElementById('btn-next-digit');

    mascot.textContent = '🎉';
    title.textContent = 'Отлично!';
    msg.textContent = `Цифра ${detail.digit} выучена!`;

    const [, max] = this._getRangeInfo().range.split('-').map(Number);
    nextBtn.style.display = detail.digit < max ? 'block' : 'none';
  },
};

window.UI = UI;