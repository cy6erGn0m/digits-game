# russian.js

Russian linguistic data for speech synthesis. Provides per-emoji grammatical forms and helper functions to construct grammatically correct Russian sentences for task questions.

Loaded before `tasks.js` — all constants and helpers are exposed via `window` globals.

## Constants

### EMOJI_FORMS

Maps every emoji (30 total) to its grammatical forms:

```
EMOJI_FORMS[emoji] = {
  acc_sg:  string,   // accusative singular   (used after 1: "Найди одну машинку")
  gen_sg:  string,   // genitive singular     (used after 2-4: "Найди три машинки")
  gen_pl:  string,   // genitive plural       (used after 5+: "Найди пять машинок")
  gender:  'masc' | 'fem' | 'neut',
}
```

### RUSSIAN_NUMBERS

Cardinal number to Russian word (1-20). Same as `RUSSIAN_NUMBERS` in old `tasks.js`.

### RUSSIAN_NUMBERS_GENDER

Gender-aware forms for 1 and 2 (the only cardinals that change by gender):

```
RUSSIAN_NUMBERS_GENDER = {
  masc: { 1: 'один',  2: 'два' },
  fem:  { 1: 'одну',  2: 'две' },
  neut: { 1: 'одно',  2: 'два' },
}
```

### RUSSIAN_ORDINALS

Masculine ordinal words 1-20 (nominative/accusative for inanimate). Same as `RUSSIAN_ORDINALS` in old `tasks.js`.

### RUSSIAN_ORDINALS_FEM_ACC

Feminine accusative ordinal words 1-20 (e.g., `первую`, `вторую`, `третью`). Used when the emoji group has `gender: 'fem'`.

### RUSSIAN_ORDINALS_NEUT_ACC

Neuter accusative ordinal words 1-20 (e.g., `первое`, `второе`, `третье`). Used when the emoji group has `gender: 'neut'`.

## Functions

### nounForm

```
nounForm(n: number, forms: Object): string
```

Pick the correct noun form based on count:
- `n === 1` → `forms.acc_sg`
- `2 <= n <= 4` → `forms.gen_sg`
- `n >= 5` → `forms.gen_pl`

### numWord

```
numWord(n: number, gender: string): string
```

Pick the correct cardinal number word based on gender:
- `n <= 2` → uses `RUSSIAN_NUMBERS_GENDER[gender][n]`
- `n >= 3` → uses `RUSSIAN_NUMBERS[n]` (gender-neutral)

### ordinalWord

```
ordinalWord(n: number, gender: string): string
```

Pick the correct ordinal word based on gender:
- `gender === 'fem'` → `RUSSIAN_ORDINALS_FEM_ACC[n]`
- `gender === 'neut'` → `RUSSIAN_ORDINALS_NEUT_ACC[n]`
- otherwise → `RUSSIAN_ORDINALS[n]`
