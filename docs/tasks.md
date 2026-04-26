# tasks.js

Task generators — creates task objects for each of the 4 task types. Each generator returns a task object with question, options, items, and hint data.

## Constants

### TaskType

```javascript
TaskType.COUNT_TO_DIGIT    // 'countToDigit'
TaskType.DIGIT_TO_COUNT     // 'digitToCount'
TaskType.ADD_TO_REACH       // 'addToReach'
TaskType.ORDINAL_POSITION   // 'ordinalPosition'
```

### RUSSIAN_NUMBERS

Number to Russian word mapping (1-20).

### RUSSIAN_ORDINALS

Number to Russian ordinal word mapping (1-10).

### RUSSIAN_PLURALS

Emoji type to Russian plural noun mapping.

### EMOJI_POOLS

Emoji categories: animals, fruits, shapes, nature, objects.

### DISTINCTION_LEVELS

```javascript
DISTINCTION_LEVELS.NONE           // 'none'
DISTINCTION_LEVELS.DIFFERENT_COLORS // 'colors'
DISTINCTION_LEVELS.TYPE_FILTER    // 'filter'
DISTINCTION_LEVELS.OVERLAP        // 'overlap'
```

## Utility Functions

### shuffle

```
shuffle(arr: any[]): any[]
```

Shuffle array in place using Fisher-Yates algorithm.

### randomInt

```
randomInt(min: number, max: number): number
```

Generate random integer between min and max (inclusive).

### randomFrom

```
randomFrom(arr: any[]): any
```

Pick random element from array.

### clamp

```
clamp(v: number, min: number, max: number): number
```

Clamp value between min and max.

## TaskGenerators

Factory object for creating task objects.

### TaskGenerators.newId

```
TaskGenerators.newId(): string
```

Generate unique task ID.

### TaskGenerators.countToDigit

```
TaskGenerators.countToDigit(target: number, max: number, distractionLevel: string): Object
```

Count → Digit. Show N emojis, user picks the correct number.

**Parameters:**
- `target` — Correct count (1..20)
- `max` — Range maximum for option generation
- `distractionLevel` — 'none'|'colors'|'filter'

**Returns:** Task object with:
- `id` — Unique task ID
- `type` — TaskType.COUNT_TO_DIGIT
- `targetNumber` — The target digit
- `questionAudio` — Spoken question
- `questionEmoji` — HTML for question display
- `items` — Array of emoji items to count
- `options` — Array of {label, isCorrect}
- `hintData` — {highlightOptionIndex}

### TaskGenerators.digitToCount

```
TaskGenerators.digitToCount(target: number, max: number, distractionLevel: string): Object
```

Digit → Count. Show a digit, user picks the correct emoji group.

**Parameters:**
- `target` — Correct digit
- `max` — Range maximum
- `distractionLevel` — 'none'|'colors'|'filter'

**Returns:** Task object with:
- `id` — Unique task ID
- `type` — TaskType.DIGIT_TO_COUNT
- `targetNumber` — The target digit
- `questionAudio` — Spoken question
- `questionEmoji` — Large digit HTML
- `items` — Empty array (content shown in questionEmoji)
- `options` — Array of {label, isCorrect} with emoji groups
- `hintData` — {highlightOptionIndex}

### TaskGenerators.addToReach

```
TaskGenerators.addToReach(target: number, max: number, distractionLevel: string): Object
```

Add to Reach. Show items + "?", user picks +0/+1/+2.

**Parameters:**
- `target` — Target final number
- `max` — Range maximum
- `distractionLevel` — 'none'|'colors'|'filter'

**Returns:** Task object with:
- `id` — Unique task ID
- `type` — TaskType.ADD_TO_REACH
- `targetNumber` — The target digit
- `startCount` — Starting count
- `questionAudio` — Spoken question
- `questionEmoji` — HTML showing items + ? = target
- `items` — Array of emoji items (starting count)
- `options` — Array of {label, isCorrect, delta} (+0, +1, +2)
- `hintData` — {highlightOptionIndex}

### TaskGenerators.ordinalPosition

```
TaskGenerators.ordinalPosition(target: number, max: number, distractionLevel: string): Object
```

Ordinal Position. Show a row of emojis, user taps the Nth one.

**Parameters:**
- `target` — Ordinal number (1-based)
- `max` — Range maximum
- `distractionLevel` — 'none'|'colors'|'filter'

**Returns:** Task object with:
- `id` — Unique task ID
- `type` — TaskType.ORDINAL_POSITION
- `targetNumber` — The ordinal number
- `questionAudio` — Spoken question
- `questionEmoji` — HTML showing position + emoji
- `questionLabel` — Position label (e.g., "1-й")
- `items` — Array of emoji items in the row
- `options` — Empty array (tap on content area instead)
- `correctIndex` — Index of correct item (0-based)
- `hintData` — {highlightItems: [correctIndex]}

### TaskGenerators._distractionFlags

```
TaskGenerators._distractionFlags(level: string): Object
```

Generate distraction flags for a task based on distraction level.

**Parameters:**
- `level` — Distraction level ('none'|'colors'|'filter'|'overlap')

**Returns:** Flags object with allSameEmoji, allSameColor, filterByType, itemsOverlap

### TaskGenerators._buildAddToReachContent

```
TaskGenerators._buildAddToReachContent(start: number, target: number, emoji: string): string
```

Build HTML content for addToReach task (shows items + ? = target).

**Parameters:**
- `start` — Starting count
- `target` — Target count
- `emoji` — Emoji to display

**Returns:** HTML string