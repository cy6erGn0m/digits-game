# Изучаем цифры — AGENTS.md

## 1. Project Overview

**Name:** Изучаем цифры (Learning Digits)
**Type:** Single-page HTML/JavaScript game for children (ages 2–4)
**Stack:** Vanilla HTML + CSS + JS, no build tools, simple HTTP server
**Purpose:** Teach children to recognize numbers 1–20, count objects, and use ordinal numbers through a Duolingo-style mobile-first game

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
└── docs/          # API documentation (auto-generated from JSDoc)
    ├── README.md   # API reference index
    ├── app.md      # Entry point
    ├── model.md    # AppViewModel
    ├── ui.md       # UI controller
    ├── tasks.md    # Task generators
    ├── progress.md # Progress storage
    ├── speech.md   # Voice synthesis
    └── animations.md # Visual animations

> **Note:** After modifying any JS file, update the corresponding doc file in `docs/`.
> Run the documentation generator to regenerate API docs from JSDoc comments.

## 3. Screens

| Screen | ID | Purpose |
|---|---|---|
| Splash | `splash` | Entry point with mascot and play button |
| Difficulty | `level-select` | Choose range (1-5 / 1-10 / 1-20) + distraction level |
| Digit select | `digit-select` | Pick which digit to practice, shows stars per digit |
| Game | `game` | Active task with content + 3 answer options |
| Reward | `reward` | Celebration after mastering a digit (+ confetti) |
| Completion | `completion` | Shown when all digits in a range are learned |

Screen transitions driven by `vm.navigate(screen)` → `screenChanged` event → UI shows correct section.

## 4. Game Mechanics

### Task Types
1. **countToDigit** — show N emojis, pick the correct number
2. **digitToCount** — show a large digit, pick the correct emoji group
3. **addToReach** — show items + "?", pick +0 / +1 / +2
4. **ordinalPosition** — show a row of emojis, tap the Nth one

Each digit lesson = 4 tasks (one of each type, shuffled).

### Feedback
- Correct → green flash, "Молодец!" voice, confetti, auto-advance 1.5s
- Wrong → red flash, "Попробуй ещё" voice, options stay unlocked
- 2 consecutive errors → visual hint (correct option highlighted for 2s)

### Star System
- 3 correct answers on a digit = star earned
- 3 stars on a digit = digit is "mastered"
- Stars persist in `localStorage`

## 5. Difficulty

Two independent axes:

**Axis A — Number range:**
- Easy: 1–5
- Medium: 1–10
- Hard: 1–20

**Axis B — Distractions:**
- `none` (easy) — all emojis identical
- `differentColors` (medium) — mixed emoji types
- `typeFilter` (hard) — mixed types, filter-by-type required

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
    "completedDigits": { "easy": [], "medium": [], "hard": [] },
    "stars": 0,
    "starsByDigit": { "3": 2 },
    "currentDifficulty": "easy",
    "distractionLevel": "none"
  }
  ```

### Emoji Pools
5 categories: `animals`, `fruits`, `shapes`, `nature`, `objects` — randomly selected per task. No external assets.

### To Run
```bash
cd digits
python3 -m http.server 8080
# or: python3 server.py
```
Open `http://localhost:8080` on any device (optimized for mobile).

## 7. Key Decisions

- **No canvas-confetti CDN** — pure CSS `animation` with JS-spawned `<div>` pieces (fewer dependencies)
- **Hints in task model** — each generated task includes `hintData` with exact highlight targets, keeping UI logic minimal
- **Hint auto-dismiss timer inside VM** — 2s `_hintDismissTimer` ensures UI doesn't need to manage it
- **Hard level uses type filter in hint voice only** — actual filtering logic is a placeholder for future (not blocking MVP)
- **Digit select screen added** — not in original spec, added for better UX (manual digit picking reflects manual difficulty selection)