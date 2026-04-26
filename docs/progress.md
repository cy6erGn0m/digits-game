# progress.js

ProgressStorage — localStorage wrapper for game progress persistence.

## Module

### ProgressStorage

Storage object for saving/loading game progress.

## Properties

### ProgressStorage.STORAGE_KEY

```javascript
ProgressStorage.STORAGE_KEY: string
```

Key used for localStorage ('digits_progress').

## Methods

### ProgressStorage.defaults

```
ProgressStorage.defaults(): Object
```

Get default progress object.

**Returns:** Default progress data:
```javascript
{
  completedDigits: { 'easy-fixed': [], 'easy-random': [], 'medium-random': [], 'hard-random': [] },
  stars: 0,
  starsByDigit: {},
  currentDifficulty: 'easy-fixed',
  distractionLevel: 'none'
}
```

### ProgressStorage.load

```
ProgressStorage.load(): Object
```

Load progress from localStorage, merge with defaults.

**Returns:** Progress data

### ProgressStorage.save

```
ProgressStorage.save(data: Object): void
```

Save progress to localStorage.

**Parameters:**
- `data` — Progress data to save

### ProgressStorage.reset

```
ProgressStorage.reset(data: Object): void
```

Reset progress to defaults.

**Parameters:**
- `data` — Progress data to reset