/**
 * @file model.js
 * AppViewModel — game state and logic, no DOM dependencies.
 * UI subscribes to events and calls VM methods to interact.
 * @extends EventTarget
 */

class AppViewModel extends EventTarget {
  /**
   * @param {Object} progressStorage - ProgressStorage instance for persistence
   */
  constructor(progressStorage) {
    super();

    this._progressStorage = progressStorage;
    this.progress = progressStorage.load();

    this.screen = 'splash';
    this.currentTask = null;
    this.taskQueue = [];
    this.currentDigit = 1;
    this.difficulty = 'easy';
    this.distraction = DistractionLevel.NONE;

    this.feedback = null;
    this.showHint = false;
    this.consecutiveErrors = 0;
    this.isLessonComplete = false;
    this.autoAdvanceTimer = null;
    this.lessonTaskIndex = 0;
    this._hintDismissTimer = null;
  }

  get currentScreen()   { return this.screen; }
  /** @returns {Object|null} Current task data */
  get currentTaskData() { return this.currentTask; }
  /** @returns {string|null} Current feedback state ('correct'|'wrong'|null) */
  get feedbackState()    { return this.feedback; }
  /** @returns {boolean} Whether hint is currently active */
  get hintActive()       { return this.showHint; }
  /** @returns {number} Total stars earned */
  get totalStars()       { return this.progress.stars; }
  /** @returns {Object} Completed digits by difficulty */
  get completedDigits() { return this.progress.completedDigits; }

  /**
   * Set game difficulty (easy/medium/hard).
   * @param {string} value - Difficulty level
   */
  setDifficulty(value) { this.difficulty = value; }
  /**
   * Set distraction level.
   * @param {string} value - Distraction level
   */
  setDistraction(value) { this.distraction = value; }

  /**
   * Navigate to a screen.
   * @param {string} screen - Screen ID ('splash'|'level-select'|'digit-select'|'task'|'reward'|'completion')
   */
  navigate(screen) {
    this.screen = screen;
    this._emit('screenChanged');
  }

  /**
   * Start a new game session with given difficulty and distraction.
   * Finds next incomplete digit and begins lesson.
   * @param {string} difficulty - 'easy'|'medium'|'hard'
   * @param {string} distraction - Distraction level
   */
  startSession(difficulty, distraction) {
    this.difficulty = difficulty;
    this.distraction = distraction;
    this.progress.currentDifficulty = difficulty;
    this.progress.distractionLevel = distraction;
    this._saveProgress();

    const rangeMax = { easy: 5, medium: 10, hard: 20 }[difficulty];
    const completed = this.progress.completedDigits[difficulty] || [];
    const nextDigit = Array.from({ length: rangeMax }, (_, i) => i + 1)
      .find(d => !completed.includes(d));

    if (nextDigit) {
      this.currentDigit = nextDigit;
      this.isLessonComplete = false;
      this._generateLessonTasks();
      this.screen = 'task';
      this._emit('screenChanged');
      this._nextTaskFromQueue();
    } else {
      this.screen = 'completion';
      this._emit('screenChanged');
    }
  }

  /**
   * Restart level — clears all progress for current difficulty.
   */
  restartLevel() {
    const diff = this.difficulty;
    this.progress.completedDigits[diff] = [];
    this.progress.stars = 0;
    this._saveProgress();
    this.screen = 'level-select';
    this._emit('screenChanged');
  }

  /**
   * Start lesson for a specific digit.
   * @param {number} digit - Digit to practice (1-20)
   */
  startDigitLesson(digit) {
    this.currentDigit = digit;
    this.isLessonComplete = false;
    this._generateLessonTasks();
    this.screen = 'task';
    this._emit('screenChanged');
    this._nextTaskFromQueue();
  }

  /**
   * Reset all progress and return to splash.
   */
  resetProgress() {
    this._progressStorage.reset(this.progress);
    this.screen = 'splash';
    this._emit('screenChanged');
  }

  // ---- Lesson tasks ----
  /**
   * Generate 4 tasks for current lesson (one of each type, shuffled).
   */
  _generateLessonTasks() {
    const rangeMax = { easy: 5, medium: 10, hard: 20 }[this.difficulty];
    const types = shuffle([
      TaskType.COUNT_TO_DIGIT,
      TaskType.DIGIT_TO_COUNT,
      TaskType.ADD_TO_REACH,
      TaskType.ORDINAL_POSITION,
    ]);
    this.taskQueue = types.map(type => this._createTask(type, this.currentDigit, rangeMax));
    this.lessonTaskIndex = 0;
  }

  /**
   * Advance to next task in queue. Emits 'taskChanged' and 'audioRequested'.
   */
  _nextTaskFromQueue() {
    this._clearAutoAdvance();
    this.feedback = null;
    this.showHint = false;
    this.consecutiveErrors = 0;

    if (this.taskQueue.length > 0) {
      this.currentTask = this.taskQueue.shift();
      this.lessonTaskIndex++;
      this._emit('taskChanged');
      this._emit('audioRequested', this.currentTask.questionAudio);
    } else {
      this.isLessonComplete = true;
      this._onDigitMastered();
    }
  }

  // ---- Answers ----
  /**
   * Submit answer for multiple-choice tasks.
   * @param {number} optionIndex - Index of chosen option
   */
  submitAnswer(optionIndex) {
    if (!this.currentTask || this.feedback === 'correct' || this.isLessonComplete) return;
    if (this.currentTask.type === TaskType.ORDINAL_POSITION) return;

    const chosen = this.currentTask.options[optionIndex];
    if (!chosen) return;
    const isCorrect = chosen.isCorrect;

    if (isCorrect) {
      this.feedback = 'correct';
      this.consecutiveErrors = 0;
      this._onCorrectAnswer();
    } else {
      this.feedback = 'wrong';
      this.consecutiveErrors++;
      this._onWrongAnswer();
    }
    this._emit('feedbackChanged');
  }

  /**
   * Submit answer for ordinal position task (tap on emoji row).
   * @param {number} itemIndex - Index of tapped emoji
   */
  submitPositionTap(itemIndex) {
    if (!this.currentTask || this.feedback === 'correct' ||
        this.currentTask.type !== TaskType.ORDINAL_POSITION) return;

    const isCorrect = itemIndex === this.currentTask.correctIndex;
    if (isCorrect) {
      this.feedback = 'correct';
      this.consecutiveErrors = 0;
      this._onCorrectAnswer();
    } else {
      this.feedback = 'wrong';
      this.consecutiveErrors++;
      this._onWrongAnswer();
    }
    this._emit('feedbackChanged');
  }

  // ---- Audio ----
  /**
   * Request replay of current task audio.
   */
  repeatAudio() {
    if (this.currentTask) {
      this._emit('audioRequested', this.currentTask.questionAudio);
    }
  }

  // ---- Hints ----
  /**
   * Dismiss active hint.
   */
  dismissHint() {
    this.showHint = false;
    this._clearHintTimer();
    this._emit('hintDeactivated');
  }

  // ---- Private ----
  /**
   * Handle correct answer — add star, schedule next task.
   */
  _onCorrectAnswer() {
    this._emit('correctAnswer');
    this._addStar();
    this.autoAdvanceTimer = setTimeout(() => {
      this._nextTaskFromQueue();
    }, 1500);
  }

  /**
   * Handle wrong answer — show hint after 2 consecutive errors.
   */
  _onWrongAnswer() {
    this._emit('wrongAnswer');
    if (this.consecutiveErrors >= 2) {
      this.showHint = true;
      this._clearHintTimer();
      this._hintDismissTimer = setTimeout(() => this.dismissHint(), 2000);
      this._emit('hintActivated');
    }
    this.feedback = null;
  }

  /**
   * Add a star for current digit. Triggers auto-save and 'starsUpdated' event.
   */
  _addStar() {
    const digit = this.currentDigit;
    if (!this.progress.starsByDigit) this.progress.starsByDigit = {};
    if (!this.progress.starsByDigit[digit]) this.progress.starsByDigit[digit] = 0;
    this.progress.starsByDigit[digit]++;
    this.progress.stars++;
    this._saveProgress();
    this._emit('starsUpdated');
  }

  /**
   * Get star count for a specific digit.
   * @param {number} digit - Digit to check
   * @returns {number} Stars earned (0-3)
   */
  getStarsForDigit(digit) {
    return (this.progress.starsByDigit && this.progress.starsByDigit[digit]) || 0;
  }

  /**
   * Called when all 4 tasks complete for a digit. Marks digit as completed and shows reward.
   */
  _onDigitMastered() {
    const diff = this.difficulty;
    if (!this.progress.completedDigits[diff]) this.progress.completedDigits[diff] = [];
    if (!this.progress.completedDigits[diff].includes(this.currentDigit)) {
      this.progress.completedDigits[diff].push(this.currentDigit);
    }
    this._saveProgress();
    this.screen = 'reward';
    this._emit('screenChanged');
    this._emit('rewardEarned', { digit: this.currentDigit, stars: this.progress.stars });
  }

  /**
   * Continue to next digit after reward screen.
   */
  continueFromReward() {
    const rangeMax = { easy: 5, medium: 10, hard: 20 }[this.difficulty];
    const completed = this.progress.completedDigits[this.difficulty] || [];
    const nextDigit = Array.from({ length: rangeMax }, (_, i) => i + 1)
      .find(d => !completed.includes(d) && d > this.currentDigit);

    if (nextDigit) {
      this.currentDigit = nextDigit;
    } else {
      this.screen = 'completion';
      this._emit('screenChanged');
      return;
    }

    this.isLessonComplete = false;
    this._generateLessonTasks();
    this.screen = 'task';
    this._emit('screenChanged');
    this._nextTaskFromQueue();
  }

  /**
   * Factory method to create task by type.
   * @param {string} type - TaskType constant
   * @param {number} digit - Target digit
   * @param {number} max - Range maximum
   * @returns {Object} Task object
   */
  _createTask(type, digit, max) {
    switch (type) {
      case TaskType.COUNT_TO_DIGIT:   return TaskGenerators.countToDigit(digit, max, this.distraction);
      case TaskType.DIGIT_TO_COUNT:   return TaskGenerators.digitToCount(digit, max, this.distraction);
      case TaskType.ADD_TO_REACH:    return TaskGenerators.addToReach(digit, max, this.distraction);
      case TaskType.ORDINAL_POSITION: return TaskGenerators.ordinalPosition(digit, max, this.distraction);
      default: throw new Error('Unknown task type');
    }
  }

  /**
   * Clear auto-advance timer.
   */
  _clearAutoAdvance() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }

  /**
   * Clear hint dismiss timer.
   */
  _clearHintTimer() {
    if (this._hintDismissTimer) {
      clearTimeout(this._hintDismissTimer);
      this._hintDismissTimer = null;
    }
  }

  /**
   * Save progress to localStorage via ProgressStorage.
   */
  _saveProgress() {
    this._progressStorage.save(this.progress);
  }

  /**
   * Emit custom event via EventTarget.
   * @param {string} event - Event name
   * @param {any} detail - Event detail data
   */
  _emit(event, detail) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

window.AppViewModel = AppViewModel;