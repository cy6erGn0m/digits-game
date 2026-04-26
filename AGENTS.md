# Изучаем цифры — AGENTS.md

## 1. Project Overview

**Name:** Изучаем цифры (Learning Digits)
**Type:** Single-page HTML/JavaScript game for children (ages 2–4)
**Stack:** Vanilla HTML + CSS + JS, no build tools, simple HTTP server
**Purpose:** Teach children to recognize numbers 1-20, count objects, and use ordinal numbers through a Duolingo-style mobile-first game

## 2. Architecture

### Patterns
- **Event-driven ViewModel** (`AppViewModel extends EventTarget`) — all game state lives in the VM; UI subscribes to events and calls VM methods
- **No frameworks, no bundlers** — everything runs from static files served by a simple Python server

### File Structure
```
digits/
├── index.html      # 6 screen sections (splash, level-select, digit-select, game, reward, completion)
├── styles.css      # Mobile-first responsive CSS, animations, confetti
├── app.js         # Main entry, wires VM + UI together
├── model.js       # AppViewModel (game state, navigation, answer handling)
├── ui.js          # UIController (DOM rendering, event handling)
├── tasks.js       # TaskGenerators (4 task types)
├── progress.js    # localStorage persistence
├── speech.js      # Web Speech API wrapper
├── animations.js  # Confetti, flash effects
├── server.py      # Simple HTTP server
└── docs/          # API documentation
    ├── README.md   # API reference index
    ├── app.md      # Entry point
    ├── model.md    # AppViewModel
    ├── ui.md       # UI controller
    ├── tasks.md    # Task generators
    ├── progress.md # Progress storage
    ├── speech.md   # Voice synthesis
    └── animations.md # Visual animations
```

> **Note:** After modifying any JS file, update the corresponding doc file in `docs/`.

## 3. Screens

| Screen | ID | Purpose |
|---|---|---|
| Splash | `splash` | Entry point with mascot and play button |
| Level select | `level-select` | Choose difficulty level (4 options) |
| Digit select | `digit-select` | Pick which digit to practice (easy-fixed mode only), shows stars per digit |
| Game | `game` | Active task with content + answer options |
| Reward | `reward` | Celebration after mastering a digit (+ confetti) |
| Completion | `completion` | Shown when all digits in a range are learned |

Screen transitions driven by `vm.navigate(screen)` → `screenChanged` event → UI shows correct section.

## 4. Game Mechanics

### Task Types
1. **countToDigit** — show N emojis, pick the correct number
2. **digitToCount** — show a large digit, pick the correct emoji group
3. **addToReach** — show items + "?", pick +1 / +2 / +3 (medium/hard only)
4. **ordinalPosition** — show a row of emojis, tap the Nth one

Each lesson = 7 tasks shuffled.

### Feedback
- Correct → green flash + pulse, "Молодец!" voice, confetti, auto-advance 1.5s
- Wrong → red/pink flash + shake, "Попробуй ещё" voice
- 2 consecutive errors → visual hint (correct option highlighted for 2s)

### Star System
- 3 correct answers on a digit = star earned
- 3 stars on a digit = digit is "mastered"
- Stars persist in `localStorage`

## 5. Difficulty Levels

| Level | Range | Mode | Tasks |
|-------|-------|------|-------|
| easy-fixed | 1-5 | Same digit all tasks | 7 (no addToReach) |
| easy-random | 1-5 | Random each task | 7 (no addToReach) |
| medium-random | 1-10 | Random each task | 7 (no addToReach) |
| hard-random | 1-20 | Random each task | 7 |

- **Random modes** skip digit-select screen, go directly to game
- **Easy levels** exclude addToReach task type

## 6. Technical Notes

### Voice
- Web Speech API (`SpeechSynthesis`, lang `ru-RU`)
- Gracefully falls back silently if unavailable
- Used for: task questions, "Молодец!", "Попробуй ещё"

### Progress Storage
- Key: `digits_progress` in `localStorage`
- Schema:
  ```json
  {
    "completedDigits": { "easy-fixed": [], "easy-random": [], "medium-random": [], "hard-random": [] },
    "stars": 0,
    "starsByDigit": { "3": 2 },
    "currentDifficulty": "easy-fixed",
    "distractionLevel": "none"
  }
  ```

### Emoji Pools
5 categories × 6 emojis each:
- Animals (🐶🐱🐰🦊🐻🐼)
- Fruits (🍎🍊🍋🍇🍓🍑)
- Balls (⚽🏀🏈⚾🎾🏐)
- Flowers (🌸🌺🌻🌷🌹🌼)
- Objects (🚗✈️🚀🚂🚲🎁)

All from Unicode 6.0 (supported on iOS 5+, Android 4.3+).

### To Run
```bash
cd digits
python3 -m http.server 8080
```
Open `http://localhost:8080` on any device (optimized for mobile).

## 7. Key Decisions

- **No canvas-confetti CDN** — pure CSS animations with JS-spawned `<div>` pieces
- **Hints in task model** — each generated task includes `hintData` with exact highlight targets
- **Hint auto-dismiss timer inside VM** — 2s timer ensures UI doesn't need to manage it
- **Fixed vs Random modes** — only easy level has choice; medium/hard always random
- **No sample emoji in questions** — avoid confusion (sample looked like item to count)