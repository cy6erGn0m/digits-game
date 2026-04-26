# model.js

AppViewModel — game state and logic, no DOM dependencies. UI subscribes to events and calls VM methods to interact.

## Class

### AppViewModel

```javascript
new AppViewModel(progressStorage: ProgressStorage)
```

Constructor. Initializes game state, loads progress from storage.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentScreen` | `string` | Current screen ID |
| `currentTaskData` | `Object\|null` | Current task object |
| `feedbackState` | `string\|null` | 'correct', 'wrong', or null |
| `hintActive` | `boolean` | Whether hint is currently active |
| `totalStars` | `number` | Total stars earned |
| `completedDigits` | `Object` | Completed digits by difficulty |

## Methods

### setDifficulty

```
setDifficulty(value: string): void
```

Set game difficulty ('easy-fixed'|'easy-random'|'medium-random'|'hard-random').

### setDistraction

```
setDistraction(value: string): void
```

Set distraction level.

### navigate

```
navigate(screen: string): void
```

Navigate to a screen. Emits 'screenChanged' event.

**Parameters:**
- `screen` — Screen ID ('splash'|'level-select'|'digit-select'|'task'|'reward'|'completion')

### startSession

```
startSession(difficulty: string, distraction: string): void
```

Start a new game session. Finds next incomplete digit and begins lesson.

**Parameters:**
- `difficulty` — 'easy-fixed'|'easy-random'|'medium-random'|'hard-random'
- `distraction` — Distraction level

### setFixedDigit

```
setFixedDigit(value: boolean): void
```

Set whether digit is fixed per lesson or random per task.

### isRandomMode

```
isRandomMode(): boolean
```

Check if current mode is random (different digit each task).

### isEasyLevel

```
isEasyLevel(): boolean
```

Check if current difficulty is easy level.

### getRangeMax

```
getRangeMax(): number
```

Get range maximum for current difficulty.

### restartLevel

```
restartLevel(): void
```

Restart level — clears all progress for current difficulty.

### startDigitLesson

```
startDigitLesson(digit: number): void
```

Start lesson for a specific digit.

**Parameters:**
- `digit` — Digit to practice (1-20)

### resetProgress

```
resetProgress(): void
```

Reset all progress and return to splash.

### submitAnswer

```
submitAnswer(optionIndex: number): void
```

Submit answer for multiple-choice tasks.

**Parameters:**
- `optionIndex` — Index of chosen option

### submitPositionTap

```
submitPositionTap(itemIndex: number): void
```

Submit answer for ordinal position task (tap on emoji row).

Accepts both forward-counting and backward-counting positions as correct.

**Parameters:**
- `itemIndex` — Index of tapped emoji

### repeatAudio

```
repeatAudio(): void
```

Request replay of current task audio.

### dismissHint

```
dismissHint(): void
```

Dismiss active hint.

### getStarsForDigit

```
getStarsForDigit(digit: number): number
```

Get star count for a specific digit.

**Parameters:**
- `digit` — Digit to check

**Returns:** Stars earned (0-3)

### continueFromReward

```
continueFromReward(): void
```

Continue to next digit after reward screen.

## Events

The AppViewModel emits the following events via EventTarget:

| Event | Detail | Description |
|-------|--------|-------------|
| `screenChanged` | — | Screen navigation occurred |
| `taskChanged` | — | New task loaded |
| `feedbackChanged` | — | Answer feedback updated |
| `correctAnswer` | — | Correct answer submitted |
| `wrongAnswer` | — | Wrong answer submitted |
| `hintActivated` | — | Hint shown (after 2 errors) |
| `hintDeactivated` | — | Hint dismissed |
| `rewardEarned` | `{digit, stars}` | Digit mastered, reward shown |
| `starsUpdated` | — | Star count changed |
| `audioRequested` | `string` | Task audio should play |