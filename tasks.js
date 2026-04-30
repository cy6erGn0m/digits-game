/**
 * @file tasks.js
 * Task generators — creates task objects for each of the 4 task types.
 * Each generator returns a task object with question, options, items, and hint data.
 *
 * @example
 * const task = TaskGenerators.countToDigit(3, 10, 'none');
 * // Returns: { id, type, targetNumber, questionAudio, questionEmoji, items, options, hintData }
 */

const TaskType = {
  COUNT_TO_DIGIT:    'countToDigit',
  DIGIT_TO_COUNT:    'digitToCount',
  ADD_TO_REACH:      'addToReach',
  ORDINAL_POSITION:  'ordinalPosition',
};

const EMOJI_POOLS = {
  animals: { emojis: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼'], color: 'brown', type: 'animal' },
  fruits:  { emojis: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑'], color: 'red',   type: 'apple' },
  shapes:  { emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐'], color: 'orange', type: 'ball' },
  nature:  { emojis: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼'], color: 'pink',  type: 'flower' },
  objects: { emojis: ['🚗', '✈️', '🚀', '🚂', '🚲', '🎁'], color: 'blue',  type: 'car' },
};

const DISTINCTION_LEVELS = {
  NONE:           'none',
  DIFFERENT_COLORS: 'colors',
  TYPE_FILTER:     'filter',
  OVERLAP:         'overlap',
};

// ============================================================
// УТИЛИТЫ ГЕНЕРАТОРОВ
// ============================================================

/**
 * Shuffle array in place using Fisher-Yates algorithm.
 * @param {any[]} arr - Array to shuffle
 * @returns {any[]} Shuffled copy
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate random integer between min and max (inclusive).
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random element from array.
 * @param {any[]} arr - Source array
 * @returns {any} Random element
 */
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Clamp value between min and max (reserved for future use).
 * @param {number} v - Value to clamp
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {number} Clamped value
 */
// eslint-disable-next-line no-unused-vars
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ============================================================
// TASK GENERATORS
// ============================================================

const TaskGenerators = {
  _idCounter: 0,

  /**
 * Generate unique task ID.
 * @returns {string} Unique task ID
 */
  newId() {
    return `task_${++this._idCounter}`;
  },

/**
 * @namespace TaskGenerators
 * Factory for creating task objects. Each method generates a different task type.
 */

/**
 * Count → Digit. Show N emojis, user picks the correct number.
 * @param {number} target - Correct count (1..20)
 * @param {number} max - Range maximum for option generation
 * @param {string} distractionLevel - 'none'|'colors'|'filter'
 * @returns {Object} Task object
 */
  countToDigit(target, max, distractionLevel) {
    const id = this.newId();
    const pool = randomFrom(Object.values(EMOJI_POOLS));
    const emoji = randomFrom(pool.emojis);
    const allSame = distractionLevel === DISTINCTION_LEVELS.NONE;

    let items;
    if (allSame) {
      items = Array(target).fill({ emoji, color: pool.color, type: pool.type });
    } else {
      const pool2 = randomFrom(Object.values(EMOJI_POOLS));
      const emoji2 = randomFrom(pool2.emojis);
      const sameCount = Math.floor(target * 0.6);
      const otherCount = target - sameCount;
      items = [
        ...Array(sameCount).fill({ emoji, color: pool.color, type: pool.type }),
        ...Array(otherCount).fill({ emoji: emoji2, color: pool2.color, type: pool2.type }),
      ];
      shuffle(items);
    }

    const opts = [target];
    const plusOne = (target + 1 <= max) ? target + 1 : target - 1;
    if (!opts.includes(plusOne)) opts.push(plusOne);
    while (opts.length < 3) {
      const r = randomInt(1, max);
      if (!opts.includes(r)) opts.push(r);
    }
    const options = shuffle(opts).map(n => ({
      label: String(n),
      isCorrect: n === target,
    }));

    const question = `Сколько ${EMOJI_FORMS[emoji].gen_pl}?`;
    const questionEmoji = '';

    return {
      id, type: TaskType.COUNT_TO_DIGIT,
      targetNumber: target,
      questionAudio: question,
      questionEmoji,
      instruction: 'Сколько?',
      items,
      options,
      correctIndex: undefined,
      distractionFlags: this._distractionFlags(distractionLevel),
      hintData: { highlightOptionIndex: options.findIndex(o => o.isCorrect) },
    };
  },

/**
 * Digit → Count. Show a digit, user picks the correct emoji group.
 * @param {number} target - Correct digit
 * @param {number} max - Range maximum
 * @param {string} distractionLevel - 'none'|'colors'|'filter'
 * @returns {Object} Task object
 */
  digitToCount(target, max, distractionLevel) {
    const id = this.newId();
    const pool = randomFrom(Object.values(EMOJI_POOLS));
    const emoji = randomFrom(pool.emojis);

    const quantities = [target];
    const q1 = target > 1 ? target - 1 : target + 1;
    const q2 = target < max ? target + 1 : (target > 2 ? target - 2 : target + 2);
    if (!quantities.includes(q1)) quantities.push(q1);
    if (!quantities.includes(q2)) quantities.push(q2);
    while (quantities.length < 3) {
      const r = randomInt(1, max);
      if (!quantities.includes(r)) quantities.push(r);
    }

    const shuffled = shuffle(quantities);
    const forms = EMOJI_FORMS[emoji];
    const options = shuffled.map(q => ({
      label: `<span class="emoji-grid">${emoji.repeat(q)}</span>`,
      isCorrect: q === target,
    }));

    const question = `Найди ${numWord(target, forms.gender)} ${nounForm(target, forms)}`;

    return {
      id, type: TaskType.DIGIT_TO_COUNT,
      targetNumber: target,
      questionAudio: question,
      questionEmoji: `<span style="font-size:5rem;font-weight:800;color:#2d3a8c">${target}</span>`,
      instruction: 'Найди',
      items: [],
      options,
      correctIndex: undefined,
      distractionFlags: this._distractionFlags(distractionLevel),
      hintData: { highlightOptionIndex: options.findIndex(o => o.isCorrect) },
    };
  },

/**
 * Add to Reach. Show items + "?", user picks +0/+1/+2.
 * @param {number} target - Target final number
 * @param {number} max - Range maximum
 * @param {string} distractionLevel - 'none'|'colors'|'filter'
 * @returns {Object} Task object
 */
  addToReach(target, max, distractionLevel) {
    const id = this.newId();
    const pool = randomFrom(Object.values(EMOJI_POOLS));
    const emoji = randomFrom(pool.emojis);

    // Ensure the correct answer is 0, 1, or 2
    // So start must be target, target-1, or target-2
    const possibleStarts = [target, target-1, target-2].filter(n => n > 0);
    const start = randomFrom(possibleStarts);
    const correctAdd = target - start;

    const items = Array(start).fill({ emoji, color: pool.color, type: pool.type });

    const options = shuffle([
      { label: '+0', isCorrect: correctAdd === 0, delta: 0 },
      { label: '+1', isCorrect: correctAdd === 1, delta: 1 },
      { label: '+2', isCorrect: correctAdd === 2, delta: 2 },
    ]);

    const question = `Добавь, чтобы стало ${target === 1 ? 'одно' : RUSSIAN_NUMBERS[target]}`;

    return {
      id, type: TaskType.ADD_TO_REACH,
      targetNumber: target,
      startCount: start,
      questionAudio: question,
      questionEmoji: '',
      instruction: 'Добавь',
      items,
      options,
      correctIndex: undefined,
      distractionFlags: this._distractionFlags(distractionLevel),
      hintData: { highlightOptionIndex: options.findIndex(o => o.isCorrect) },
    };
  },

/**
 * Ordinal Position. Show a row of emojis, user taps the Nth one.
 * @param {number} target - Ordinal number (1-based)
 * @param {number} max - Range maximum
 * @param {string} distractionLevel - 'none'|'colors'|'filter'
 * @returns {Object} Task object
 */
  ordinalPosition(target, max, distractionLevel) {
    const id = this.newId();
    const pool = randomFrom(Object.values(EMOJI_POOLS));
    const emoji = randomFrom(pool.emojis);
    const rowSize = randomInt(Math.max(10, target), Math.min(20, max + 3));
    const items = Array(rowSize).fill({ emoji, color: pool.color, type: pool.type });
    const correctIndex = target - 1;
    const correctIndexBackward = rowSize - target;
    const question = `Нажми на ${ordinalWord(target, EMOJI_FORMS[emoji].gender)}`;

// Show which position: just the number (e.g., "1-й", "2-й")
    const questionEmoji = `
      <span style="font-size:3rem;font-weight:bold;color:#2d3a8c;">
        ${target}-й
      </span>
    `;

    const ordinalLabel = RUSSIAN_ORDINALS[target];

    return {
      id, type: TaskType.ORDINAL_POSITION,
      targetNumber: target,
      questionAudio: question,
      questionEmoji,
      questionLabel: `${target}-й`,
      instruction: `Нажми на ${ordinalLabel}`,
      items,
      options: [],
      correctIndex,
      correctIndexBackward,
      distractionFlags: this._distractionFlags(distractionLevel),
      hintData: {
        highlightItems: correctIndex === correctIndexBackward
          ? [correctIndex]
          : [correctIndex, correctIndexBackward],
      },
    };
  },

  /**
   * Generate distraction flags for a task based on distraction level.
 * @param {string} level - Distraction level ('none'|'colors'|'filter'|'overlap')
 * @returns {Object} Flags object with allSameEmoji, allSameColor, filterByType, itemsOverlap
 */
  _distractionFlags(level) {
    return {
      allSameEmoji:   level === DISTINCTION_LEVELS.NONE,
      allSameColor:   level === DISTINCTION_LEVELS.NONE,
      filterByType:  level === DISTINCTION_LEVELS.TYPE_FILTER ? 'targetType' : null,
      itemsOverlap:   level === DISTINCTION_LEVELS.OVERLAP,
    };
  },
};

window.TaskGenerators = TaskGenerators;
window.TaskType = TaskType;
window.DistractionLevel = DISTINCTION_LEVELS;