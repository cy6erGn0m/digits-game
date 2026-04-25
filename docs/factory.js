/**
 * Создаёт задание типа «счёт → цифра».
 * @param {Object} params
 * @param {string} params.id
 * @param {number} params.targetNumber        - правильное количество (1..20)
 * @param {EmojiItem[]} params.items          - массив предметов для показа
 * @param {number[]} params.distractorNumbers - два неверных числа [a, b] (будут превращены в строки)
 * @param {string} params.voiceOverText
 * @param {DistractionFlags} params.distraction
 * @returns {Task}
 */
function createCountToDigitTask({ id, targetNumber, items, distractorNumbers, voiceOverText, distraction }) {
  const options = [targetNumber, ...distractorNumbers]
    .map(num => ({
      display: String(num),
      isCorrect: num === targetNumber,
    }));
  // Перемешиваем варианты (в реальном коде — алгоритм Фишера-Йетса)
  return {
    id,
    type: 'countToDigit',
    targetNumber,
    voiceOverText,
    items,
    options,
    distraction,
    difficulty: mapDistractionToDifficulty(distraction),
  };
}

/**
 * Задание «цифра → счёт».
 * @param {Object} params
 * @param {string} params.id
 * @param {number} params.targetNumber
 * @param {string[]} params.optionGroups - три строки из эмодзи (например, ["🍎🍎", "🍎🍎🍎", "🍎🍎🍎🍎"])
 * @param {number} params.correctIndex   - индекс правильной группы в optionGroups (0,1,2)
 * @param {string} params.voiceOverText
 * @param {DistractionFlags} params.distraction
 * @returns {Task}
 */
function createDigitToCountTask({ id, targetNumber, optionGroups, correctIndex, voiceOverText, distraction }) {
  const options = optionGroups.map((group, idx) => ({
    display: group,
    isCorrect: idx === correctIndex,
  }));
  return {
    id,
    type: 'digitToCount',
    targetNumber,
    voiceOverText,
    items: [], // цифра отображается крупно отдельно
    options,
    distraction,
    difficulty: mapDistractionToDifficulty(distraction),
  };
}

/**
 * Задание «добавь до числа».
 * @param {Object} params
 * @param {string} params.id
 * @param {number} params.startCount      - сколько предметов показано изначально
 * @param {number} params.targetNumber    - итоговое нужное число (startCount + delta, где delta = 0,1,2)
 * @param {EmojiItem[]} params.items      - начальные предметы
 * @param {string} params.voiceOverText
 * @param {DistractionFlags} params.distraction
 * @returns {Task}
 */
function createAddToReachTask({ id, startCount, targetNumber, items, voiceOverText, distraction }) {
  const neededDelta = targetNumber - startCount; // 0, 1 или 2
  const deltas = [0, 1, 2];
  const options = deltas.map(d => ({
    display: d === 0 ? '+0' : +${d},
    isCorrect: d === neededDelta,
    delta: d,
  }));
  return {
    id,
    type: 'addToReach',
    targetNumber,
    voiceOverText,
    items,
    options,
    distraction,
    difficulty: mapDistractionToDifficulty(distraction),
  };
}

/**
 * Задание «порядковый счёт» (нажатие на объект в ряду).
 * @param {Object} params
 * @param {string} params.id
 * @param {number} params.ordinalNumber   - словесный номер (1 – первый, 2 – второй …)
 * @param {EmojiItem[]} params.items      - ряд объектов
 * @param {number} params.targetItemIndex - индекс (0-based) правильного объекта
 * @param {string} params.voiceOverText
 * @param {DistractionFlags} params.distraction
 * @returns {Task}
 */
function createOrdinalPositionTask({ id, ordinalNumber, items, targetItemIndex, voiceOverText, distraction }) {
  return {
    id,
    type: 'ordinalPosition',
    targetNumber: ordinalNumber, // используется для подсветки подсказки
    voiceOverText,
    items,
    options: [],                 // вариантов-кнопок нет
    targetItemIndex,
    distraction,
    difficulty: mapDistractionToDifficulty(distraction),
  };
}

/**
 * Вспомогательная функция: преобразует флаги отвлечений в читаемый уровень сложности.
 * @param {DistractionFlags} d
 * @returns {{numberRange: string, distractionLevel: string}}
 */
function mapDistractionToDifficulty(d) {
  // номер диапазона определяется позже при генерации, здесь заполняется вручную
  const range = '1-5'; // заглушка
  let level = 'easy';
  if (!d.sameEmoji || !d.sameColor) level = 'medium';
  if (d.filterByType || d.overlapping) level = 'hard';
  return { numberRange: range, distractionLevel: level };
}
