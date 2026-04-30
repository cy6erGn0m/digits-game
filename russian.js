/**
 * @file russian.js
 * Russian linguistic data for speech synthesis.
 * Maps every emoji to its grammatical forms needed for constructing
 * grammatically correct Russian sentences in task questions.
 *
 * Three noun forms are stored per emoji:
 *   acc_sg  — accusative singular (used after 1: "Найди одну машинку")
 *   gen_sg  — genitive singular   (used after 2-4: "Найди три машинки")
 *   gen_pl  — genitive plural     (used after 5+: "Найди пять машинок")
 *   gender  — 'masc' | 'fem' | 'neut'
 */

const EMOJI_FORMS = {
  // Animals
  '🐶': { acc_sg: 'собачку', gen_sg: 'собачки', gen_pl: 'собачек', gender: 'fem' },
  '🐱': { acc_sg: 'кошечку', gen_sg: 'кошечки', gen_pl: 'кошечек', gender: 'fem' },
  '🐰': { acc_sg: 'зайку',   gen_sg: 'зайки',   gen_pl: 'заек',    gender: 'masc' },
  '🦊': { acc_sg: 'лисичку', gen_sg: 'лисички', gen_pl: 'лисичек', gender: 'fem' },
  '🐻': { acc_sg: 'мишку',   gen_sg: 'мишки',   gen_pl: 'мишек',   gender: 'masc' },
  '🐼': { acc_sg: 'панду',   gen_sg: 'панды',   gen_pl: 'панд',    gender: 'fem' },

  // Fruits
  '🍎': { acc_sg: 'яблоко',  gen_sg: 'яблока',  gen_pl: 'яблок',   gender: 'neut' },
  '🍊': { acc_sg: 'апельсин', gen_sg: 'апельсина', gen_pl: 'апельсинов', gender: 'masc' },
  '🍋': { acc_sg: 'лимон',   gen_sg: 'лимона',  gen_pl: 'лимонов', gender: 'masc' },
  '🍇': { acc_sg: 'виноградинку', gen_sg: 'виноградинки', gen_pl: 'виноградинок', gender: 'fem' },
  '🍓': { acc_sg: 'клубничку', gen_sg: 'клубнички', gen_pl: 'клубничек', gender: 'fem' },
  '🍑': { acc_sg: 'персик',  gen_sg: 'персика', gen_pl: 'персиков', gender: 'masc' },

  // Balls (all use the same forms)
  '⚽': { acc_sg: 'мячик',   gen_sg: 'мячика',  gen_pl: 'мячиков', gender: 'masc' },
  '🏀': { acc_sg: 'мячик',   gen_sg: 'мячика',  gen_pl: 'мячиков', gender: 'masc' },
  '🏈': { acc_sg: 'мячик',   gen_sg: 'мячика',  gen_pl: 'мячиков', gender: 'masc' },
  '⚾': { acc_sg: 'мячик',   gen_sg: 'мячика',  gen_pl: 'мячиков', gender: 'masc' },
  '🎾': { acc_sg: 'мячик',   gen_sg: 'мячика',  gen_pl: 'мячиков', gender: 'masc' },
  '🏐': { acc_sg: 'мячик',   gen_sg: 'мячика',  gen_pl: 'мячиков', gender: 'masc' },

  // Flowers (all use the same forms)
  '🌸': { acc_sg: 'цветочек', gen_sg: 'цветочка', gen_pl: 'цветочков', gender: 'masc' },
  '🌺': { acc_sg: 'цветочек', gen_sg: 'цветочка', gen_pl: 'цветочков', gender: 'masc' },
  '🌻': { acc_sg: 'цветочек', gen_sg: 'цветочка', gen_pl: 'цветочков', gender: 'masc' },
  '🌷': { acc_sg: 'цветочек', gen_sg: 'цветочка', gen_pl: 'цветочков', gender: 'masc' },
  '🌹': { acc_sg: 'цветочек', gen_sg: 'цветочка', gen_pl: 'цветочков', gender: 'masc' },
  '🌼': { acc_sg: 'цветочек', gen_sg: 'цветочка', gen_pl: 'цветочков', gender: 'masc' },

  // Objects
  '🚗': { acc_sg: 'машинку', gen_sg: 'машинки', gen_pl: 'машинок',  gender: 'fem' },
  '✈️': { acc_sg: 'самолёт',  gen_sg: 'самолёта', gen_pl: 'самолётов', gender: 'masc' },
  '🚀': { acc_sg: 'ракету',  gen_sg: 'ракеты',  gen_pl: 'ракет',   gender: 'fem' },
  '🚂': { acc_sg: 'поезд',   gen_sg: 'поезда',  gen_pl: 'поездов', gender: 'masc' },
  '🚲': { acc_sg: 'велосипед', gen_sg: 'велосипеда', gen_pl: 'велосипедов', gender: 'masc' },
  '🎁': { acc_sg: 'подарок', gen_sg: 'подарка', gen_pl: 'подарков', gender: 'masc' },
};

const RUSSIAN_NUMBERS = {
  1: 'один', 2: 'два', 3: 'три', 4: 'четыре', 5: 'пять',
  6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять', 10: 'десять',
  11: 'одиннадцать', 12: 'двенадцать', 13: 'тринадцать',
  14: 'четырнадцать', 15: 'пятнадцать', 16: 'шестнадцать',
  17: 'семнадцать', 18: 'восемнадцать', 19: 'девятнадцать',
  20: 'двадцать',
};

const RUSSIAN_NUMBERS_GENDER = {
  masc: { 1: 'один',  2: 'два' },
  fem:  { 1: 'одну',  2: 'две' },
  neut: { 1: 'одно',  2: 'два' },
};

const RUSSIAN_ORDINALS = {
  1: 'первый', 2: 'второй', 3: 'третий', 4: 'четвёртый', 5: 'пятый',
  6: 'шестой', 7: 'седьмой', 8: 'восьмой', 9: 'девятый', 10: 'десятый',
  11: 'одиннадцатый', 12: 'двенадцатый', 13: 'тринадцатый',
  14: 'четырнадцатый', 15: 'пятнадцатый', 16: 'шестнадцатый',
  17: 'семнадцатый', 18: 'восемнадцатый', 19: 'девятнадцатый',
  20: 'двадцатый',
};

const RUSSIAN_ORDINALS_FEM_ACC = {
  1: 'первую', 2: 'вторую', 3: 'третью', 4: 'четвёртую', 5: 'пятую',
  6: 'шестую', 7: 'седьмую', 8: 'восьмую', 9: 'девятую', 10: 'десятую',
  11: 'одиннадцатую', 12: 'двенадцатую', 13: 'тринадцатую',
  14: 'четырнадцатую', 15: 'пятнадцатую', 16: 'шестнадцатую',
  17: 'семнадцатую', 18: 'восемнадцатую', 19: 'девятнадцатую',
  20: 'двадцатую',
};

const RUSSIAN_ORDINALS_NEUT_ACC = {
  1: 'первое', 2: 'второе', 3: 'третье', 4: 'четвёртое', 5: 'пятое',
  6: 'шестое', 7: 'седьмое', 8: 'восьмое', 9: 'девятое', 10: 'десятое',
  11: 'одиннадцатое', 12: 'двенадцатое', 13: 'тринадцатое',
  14: 'четырнадцатое', 15: 'пятнадцатое', 16: 'шестнадцатое',
  17: 'семнадцатое', 18: 'восемнадцатое', 19: 'девятнадцатое',
  20: 'двадцатое',
};

/**
 * Pick the correct noun form based on the number.
 * @param {number} n - Number (1-20)
 * @param {{acc_sg:string, gen_sg:string, gen_pl:string}} forms - EMOJI_FORMS entry
 * @returns {string} Correct noun form
 */
function nounForm(n, forms) {
  if (n === 1) return forms.acc_sg;
  if (n >= 2 && n <= 4) return forms.gen_sg;
  return forms.gen_pl;
}

/**
 * Pick the correct cardinal number word based on gender.
 * @param {number} n - Number (1-20)
 * @param {string} gender - 'masc' | 'fem' | 'neut'
 * @returns {string} Number word in correct gender form
 */
function numWord(n, gender) {
  if (n <= 2) return RUSSIAN_NUMBERS_GENDER[gender][n];
  return RUSSIAN_NUMBERS[n];
}

/**
 * Pick the correct ordinal word based on gender.
 * @param {number} n - Ordinal number (1-20)
 * @param {string} gender - 'masc' | 'fem' | 'neut'
 * @returns {string} Ordinal word in correct gender form
 */
function ordinalWord(n, gender) {
  if (gender === 'fem') return RUSSIAN_ORDINALS_FEM_ACC[n];
  if (gender === 'neut') return RUSSIAN_ORDINALS_NEUT_ACC[n];
  return RUSSIAN_ORDINALS[n];
}

window.EMOJI_FORMS = EMOJI_FORMS;
window.RUSSIAN_NUMBERS = RUSSIAN_NUMBERS;
window.nounForm = nounForm;
window.numWord = numWord;
window.ordinalWord = ordinalWord;
