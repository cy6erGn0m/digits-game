# animations.js

Animations — pure CSS animations, no dependencies. Handles flash, pulse, confetti, and hints.

## Module

### Animations

Visual animation utilities.

## Methods

### Animations.flash

```
Animations.flash(color: string): void
```

Flash overlay green or red.

**Parameters:**
- `color` — 'green' or 'red'

### Animations.flashCorrect

```
Animations.flashCorrect(): void
```

Shortcut for `flash('green')`.

### Animations.flashWrong

```
Animations.flashWrong(): void
```

Shortcut for `flash('red')`.

### Animations.pulseCorrect

```
Animations.pulseCorrect(el: Element): void
```

Pulse animation on correct element.

**Parameters:**
- `el` — Element to animate

### Animations.showHint

```
Animations.showHint(task: Object): void
```

Show hint on element. For `ordinalPosition` tasks, highlights all emojis whose `dataset.index` matches any index in `task.hintData.highlightItems` (forward and backward correct positions). For other tasks, highlights the correct option button.

**Parameters:**
- `task` — Task object

### Animations.hideHint

```
Animations.hideHint(): void
```

Remove all hint highlight classes.

### Animations.confetti

```
Animations.confetti(): void
```

Spawn confetti particles (60 pieces, 5s duration).

## CSS Animations

The following CSS animations are defined in styles.css:

- `flash-green` — Green screen flash (300ms)
- `flash-red` — Red screen flash (500ms)
- `pulse-green` — Green pulse on correct element (500ms)
- `confetti-fall` — Confetti piece falling animation (2-4s)