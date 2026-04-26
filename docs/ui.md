# ui.js

UIController — manages DOM, subscribes to VM events, updates UI.

## Module

### UI

```javascript
UI.init(vm: AppViewModel): void
```

Initialize UI with view model. Sets up event subscriptions and navigation bindings.

## Methods

### init

```
init(vm: AppViewModel): void
```

Initialize UI with view model. Binds navigation and subscribes to VM events.

### Navigation Methods

#### _bindNavigation

```
_bindNavigation(): void
```

Bind all navigation button click handlers (splash, level-select, digit-select, game, reward, completion).

### Event Subscription

#### _subscribe

```
_subscribe(): void
```

Subscribe to all VM events (screenChanged, taskChanged, feedbackChanged, etc.).

### Screen Rendering

#### _renderScreen

```
_renderScreen(): void
```

Show the current screen, hide others. Calls specific renderers.

#### _renderLevelSelect

```
_renderLevelSelect(): void
```

Render level-select screen (total stars display).

#### _renderDigitSelect

```
_renderDigitSelect(): void
```

Render digit-select grid with star indicators.

#### _getRangeInfo

```
_getRangeInfo(): Object
```

Get range info for current difficulty.

**Returns:** `{range: '1-5'|'1-10'|'1-20', dist: difficulty}`

### Task Rendering

#### _renderTask

```
_renderTask(): void
```

Render current task (question, instruction, content, options).

#### _renderInstruction

```
_renderInstruction(task: Object): void
```

Render task instruction text based on task type.

**Parameters:**
- `task` — Task object

#### _renderQuestion

```
_renderQuestion(task: Object): void
```

Render question area with emoji/number.

**Parameters:**
- `task` — Task object

#### _renderContent

```
_renderContent(task: Object): void
```

Render task content (emoji row or emoji group).

**Parameters:**
- `task` — Task object

#### _renderOptions

```
_renderOptions(task: Object): void
```

Render answer option buttons (not for ordinalPosition).

**Parameters:**
- `task` — Task object

#### _isEmojiString

```
_isEmojiString(label: string): boolean
```

Check if label string contains emojis.

#### _updateTaskProgress

```
_updateTaskProgress(): void
```

Update task progress counter (e.g., "2 / 4").

### Feedback

#### _updateFeedback

```
_updateFeedback(): void
```

Update visual feedback (flash screen green/red).

#### _onCorrect

```
_onCorrect(): void
```

Handle correct answer — pulse animation, confetti, voice.

#### _onWrong

```
_onWrong(): void
```

Handle wrong answer — voice feedback.

#### _getCorrectElement

```
_getCorrectElement(): Element|null
```

Get the correct element for pulse animation.

For `ordinalPosition` tasks, finds the emoji by matching `dataset.index` against `task.correctIndex` (works even after snake layout reordering). For other tasks, returns the correct option button.

**Returns:** Correct option button or emoji item

### Stars

#### _updateStars

```
_updateStars(): void
```

Update stars display for current digit.

### Hints

#### _showHint

```
_showHint(): void
```

Show hint by highlighting correct answer.

For `ordinalPosition` tasks, highlights emojis by matching `dataset.index` against `task.hintData.highlightItems` (survives snake layout reordering). For other tasks, highlights the correct option button.

#### _hideHint

```
_hideHint(): void
```

Hide hint by removing highlight classes.

### Layout

#### _applySnakeLayout

```
_applySnakeLayout(container: HTMLElement): void
```

Restructures an ordinal-position emoji row into a snake layout with visible turn indicators.

- Detects natural row breaks via `offsetTop` while the container still uses flex-wrap.
- First natural row is left-aligned (LTR).
- Each subsequent natural row is split: the first element becomes a standalone turn marker (right-aligned for LTR→RTL, left-aligned for RTL→LTR), and the remaining elements form the continuation row flowing in the new direction.
- The container is rebuilt as a vertical flex column of per-row divs.

**Parameters:**
- `container` — The `.emoji-row` flex-wrap element to restructure

### Reward

#### _showReward

```
_showReward(detail: Object): void
```

Show reward screen with confetti and message.

**Parameters:**
- `detail` — `{digit, stars}`