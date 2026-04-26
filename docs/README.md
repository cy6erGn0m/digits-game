#  API Reference

> 🎮 **Play the game online (in Russian): [cy6ergn0m.github.io/digits-game](https://cy6ergn0m.github.io/digits-game/)**

This section contains API documentation for each module.

## Modules

- [app.js](./app.md) — Entry point
- [model.js](./model.md) — Game state and logic (AppViewModel)
- [ui.js](./ui.md) — UI controller
- [tasks.js](./tasks.md) — Task generators
- [progress.js](./progress.md) — Progress storage
- [speech.js](./speech.md) — Voice synthesis
- [animations.js](./animations.md) — Visual animations
- [snake-layout.md](./snake-layout.md) — Ordinal task snake layout algorithm

## Game Levels

| Level | Range | Mode | Tasks |
|-------|-------|------|-------|
| easy-fixed | 1-5 | Same digit all tasks | 7 (no addToReach) |
| easy-random | 1-5 | Random each task | 7 (no addToReach) |
| medium-random | 1-10 | Random each task | 7 |
| hard-random | 1-20 | Random each task | 7 |

## Emoji Categories

- Animals (🐶🐱🐰🦊🐻🐼)
- Fruits (🍎🍊🍋🍇🍓🍑)
- Balls (⚽🏀🏈⚾🎾🏐)
- Flowers (🌸🌺🌻🌷🌹🌼)
- Objects (🚗✈️🚀🚂🚲🎁)