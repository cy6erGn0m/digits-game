/**
 * Task generators — creates task objects for each type
 */

const TaskType = {
  COUNT_TO_DIGIT:    'countToDigit',
  DIGIT_TO_COUNT:    'digitToCount',
  ADD_TO_REACH:      'addToReach',
  ORDINAL_POSITION:  'ordinalPosition',
};

const RUSSIAN_NUMBERS = {
  1: 'один', 2: 'два', 3: 'три', 4: 'четыре', 5: 'пять',
  6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять', 10: 'десять',
  11: 'одиннадцать', 12: 'двенадцать', 13: 'тринадцать',
  14: 'четырнадцать', 15: 'пятнадцать', 16: 'шестнадцать',
  17: 'семнадцать', 18: 'восемнадцать', 19: 'девятнадцать',
  20: 'двадцать',
};

const RUSSIAN_ORDINALS = {
  1: 'первый', 2: 'второй', 3: 'третий', 4: 'четвёртый', 5: 'пятый',
  6: 'шестой', 7: 'седьмой', 8: 'восьмой', 9: 'девятый', 10: 'десятый',
};

const RUSSIAN_PLURALS = {
  animal: 'животных',
  dog:    'собачек',
  cat:    'кошечек',
  apple:  'яблок',
  fruit:  'фруктов',
  ball:   'мячиков',
  flower: 'цветочков',
  car:    'машинок',
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ============================================================
// TASK GENERATORS
// ============================================================

const TaskGenerators = {
  _idCounter: 0,

  newId() {
    return `task_${++this._idCounter}`;
  },

  /**
   * Счёт → цифра. Показать N эмодзи, выбрать правильную цифру.
   * @param {number} target - правильное количество (1..20)
   * @param {number} max - максимум диапазона
   * @param {string} distractionLevel - 'none'|'colors'|'filter'
   */
  countToDigit(target, max, distractionLevel) {
    const id = this.newId();
    const pool = randomFrom(Object.values(EMOJI_POOLS));
    const emoji = randomFrom(pool.emojis);
    const type = pool.type;
    const allSame = distractionLevel === DISTINCTION_LEVELS.NONE;
    const pluralLabel = RUSSIAN_PLURALS[type] || RUSSIAN_PLURALS.animal;

    let items;
    if (allSame) {
      items = Array(target).fill({ emoji, color: pool.color, type });
    } else {
      const pool2 = randomFrom(Object.values(EMOJI_POOLS));
      const emoji2 = randomFrom(pool2.emojis);
      const sameCount = Math.floor(target * 0.6);
      const otherCount = target - sameCount;
      items = [
        ...Array(sameCount).fill({ emoji, color: pool.color, type }),
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

    const question = `Сколько ${pluralLabel}?`;
    const questionEmoji = `<span style="font-size:3rem">${emoji}</span>`;

    return {
      id, type: TaskType.COUNT_TO_DIGIT,
      targetNumber: target,
      questionAudio: question,
      questionEmoji,
      items,
      options,
      correctIndex: undefined,
      distractionFlags: this._distractionFlags(distractionLevel),
      hintData: { highlightOptionIndex: options.findIndex(o => o.isCorrect) },
    };
  },

  /**
   * Цифра → счёт. Показать цифру, выбрать правильную группу эмодзи.
   * @param {number} target - правильная цифра
   * @param {number} max - максимум диапазона
   * @param {string} distractionLevel
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
    const pluralLabel = (RUSSIAN_PLURALS[pool.type] || 'фруктов');
    const options = shuffled.map(q => ({
      label: `${emoji.repeat(q)} (${q})`,
      isCorrect: q === target,
    }));

    const question = `Найди ${RUSSIAN_NUMBERS[target]} ${pluralLabel}`;

    return {
      id, type: TaskType.DIGIT_TO_COUNT,
      targetNumber: target,
      questionAudio: question,
      questionEmoji: `<span style="font-size:5rem;font-weight:800;color:#2d3a8c">${target}</span>`,
      items: [],
      options,
      correctIndex: undefined,
      distractionFlags: this._distractionFlags(distractionLevel),
      hintData: { highlightOptionIndex: options.findIndex(o => o.isCorrect) },
    };
  },

  /**
   * Добавь до числа. Показать предметы + "?", выбрать +0/+1/+2.
   * @param {number} target - итоговое число
   * @param {number} max - максимум диапазона
   * @param {string} distractionLevel
   */
  addToReach(target, max, distractionLevel) {
    const id = this.newId();
    const pool = randomFrom(Object.values(EMOJI_POOLS));
    const emoji = randomFrom(pool.emojis);

    const possible = [0, 1, Math.max(0, target - 1)].filter(n => n < target);
    const start = randomFrom(possible);
    const correctAdd = target - start;

    const items = Array(start).fill({ emoji, color: pool.color, type: pool.type });

    const options = shuffle([
      { label: '+0', isCorrect: correctAdd === 0, delta: 0 },
      { label: '+1', isCorrect: correctAdd === 1, delta: 1 },
      { label: '+2', isCorrect: correctAdd === 2, delta: 2 },
    ]);

    const question = `Добавь, чтобы стало ${RUSSIAN_NUMBERS[target]}`;

    return {
      id, type: TaskType.ADD_TO_REACH,
      targetNumber: target,
      startCount: start,
      questionAudio: question,
      questionEmoji: this._buildAddToReachContent(start, target, emoji),
      items,
      options,
      correctIndex: undefined,
      distractionFlags: this._distractionFlags(distractionLevel),
      hintData: { highlightOptionIndex: options.findIndex(o => o.isCorrect) },
    };
  },

  _buildAddToReachContent(start, target, emoji) {
    const content = start === 0 ? '' : Array(start).fill(`<span style="font-size:3rem">${emoji}</span>`).join('');
    return `<span style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center;">
      ${content ? `<span>${content}</span>` : ''}
      <span style="font-size:3rem;color:#c0c8e0">?</span>
      <span style="font-size:2rem;color:#666">= ${target}</span>
    </span>`;
  },

  /**
   * Порядковый счёт. Показать ряд эмодзи, нажать нужный по счёту.
   * @param {number} target - порядковый номер (1-based)
   * @param {number} max - максимум диапазона
   * @param {string} distractionLevel
   */
  ordinalPosition(target, max, distractionLevel) {
    const id = this.newId();
    const pool = randomFrom(Object.values(EMOJI_POOLS));
    const emoji = randomFrom(pool.emojis);
    const rowSize = randomInt(Math.max(5, target + 2), Math.min(10, max + 3));
    const items = Array(rowSize).fill({ emoji, color: pool.color, type: pool.type });
    const correctIndex = target - 1;
    const ordinal = RUSSIAN_ORDINALS[target] || `№${target}`;
    const question = `Нажми на ${ordinal}`;

    // Clearly show which position: "1st" "2nd" etc with the emoji
    const questionEmoji = `
      <span style="font-size:2.5rem;font-weight:bold;color:#2d3a8c;">
        ${target}-й
      </span>
      <span style="font-size:1.5rem;">(${emoji})</span>
    `;

    return {
      id, type: TaskType.ORDINAL_POSITION,
      targetNumber: target,
      questionAudio: question,
      questionEmoji,
      questionLabel: `${target}-й`, // fallback
      items,
      options: [],
      correctIndex,
      distractionFlags: this._distractionFlags(distractionLevel),
      hintData: { highlightItems: [correctIndex] },
    };
  },

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