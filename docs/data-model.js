/**
 * @typedef {'countToDigit'|'digitToCount'|'addToReach'|'ordinalPosition'} TaskType
 */

/**
 * @typedef {Object} EmojiItem
 * @property {string} emoji   - сам символ, например "🐶"
 * @property {string} [color] - цвет (опционально), "red", "green" и т.д.
 * @property {string} [type]  - категория/тип объекта, например "dog", "cat", "apple"
 */

/**
 * Вариант ответа – то, что отображается на кнопке (или в ряду для ordinalPosition).
 * @typedef {Object} AnswerOption
 * @property {string}  display   - то, что видит ребёнок: число (строка), эмодзи-строка, "+1" и т.д.
 * @property {boolean} isCorrect - является ли этот вариант правильным
 * @property {number}  [delta]   - для addToReach: 0, 1 или 2 (на сколько увеличить)
 */

/**
 * Флаги отвлекающих факторов (ось Б).
 * @typedef {Object} DistractionFlags
 * @property {boolean} sameEmoji     - все объекты одинаковые?
 * @property {boolean} sameColor     - все одного цвета?
 * @property {boolean} filterByType  - требуется считать только объекты определённого типа?
 * @property {boolean} overlapping   - объекты накладываются друг на друга?
 */

/**
 * Полное задание.
 * @typedef {Object} Task
 * @property {string}           id              - уникальный идентификатор (например, "task_1")
 * @property {TaskType}         type            - тип задания
 * @property {number}           targetNumber    - «загаданное» число (для countToDigit, digitToCount, addToReach – цель; для ordinalPosition – номер позиции, если требуется)
 * @property {string}           voiceOverText   - текст для озвучки (например, "Сколько собачек?")
 * @property {EmojiItem[]}      items           - список объектов (эмодзи) для отображения (пустой, если не требуется)
 * @property {AnswerOption[]}   options         - ровно 3 варианта ответа (для ordinalPosition может быть пустым массивом)
 * @property {number}           [targetItemIndex] - индекс правильного объекта в массиве items (только для ordinalPosition)
 * @property {DistractionFlags} distraction     - уровень отвлечений
 * @property {Object}           difficulty      - составная сложность
 * @property {string}           difficulty.numberRange      - "1-5", "1-10", "1-20"
 * @property {string}           difficulty.distractionLevel - "easy", "medium", "hard"
 */

/**
 * Модель прогресса игрока.
 * @typedef {Object} Progress
 * @property {Object.<string, number>} starsByDigit - { "3": 2 } – сколько звёзд получено за цифру
 * @property {string[]} masteredDigits - список полностью выученных цифр (3 правильных подряд)
 * @property {number} currentStreak    - текущая серия правильных ответов
 * @property {string} currentNumber    - текущая изучаемая цифра
 * @property {string} currentNumberRange - текущий диапазон
 * @property {string} distractionLevel   - текущий уровень отвлечений
 */
