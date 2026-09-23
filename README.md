# ✨ Gem Crush — Match-3 Browser Game

[![CI](https://github.com/butovx/gem-crush/actions/workflows/ci.yml/badge.svg)](https://github.com/butovx/gem-crush/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite)](https://vitejs.dev/)

A modern, fully featured Match-3 puzzle game built with **vanilla TypeScript**, **Canvas API**, and **Web Audio API** — no framework, no audio files, no external game engine.

> 🎮 **[Play Live Demo »](https://butovx.github.io/gem-crush)**

---

## ✨ Features

- **7 unique gem types** — Ruby, Emerald, Sapphire, Topaz, Amethyst, Diamond, Citrine
- **Smooth animations** — CSS-based swap, match-pop, gravity-drop, and appear effects
- **Particle system** — Canvas-based gem explosion and sparkle effects
- **Procedural audio** — All sounds synthesized with Web Audio API (no audio files)
- **Combo system** — Score multiplier with cascade chain detection and banner display
- **Hint system** — Shows a valid move after 8s inactivity; manual hint button
- **Responsive design** — Scales from mobile (320px) to desktop (1440px+)
- **Animated background** — Starfield and nebula rendered on a background canvas
- **CI/CD** — Auto-deploy to GitHub Pages via GitHub Actions

---

## 🏗️ Architecture

The project follows a strict **3-layer architecture** for separation of concerns:

```
src/
├── core/           # Pure game logic — no DOM, fully testable
│   ├── Board.ts        Board grid, match detection, gravity, moves
│   ├── GameState.ts    Score, moves, combo, game lifecycle (FSM)
│   └── constants.ts    All configuration constants
│
├── engine/         # Rendering & audio engines — no game logic
│   ├── AudioEngine.ts       Web Audio API synthesizer
│   ├── ParticleSystem.ts    Canvas particle emitter
│   ├── BackgroundRenderer.ts  Starfield / nebula canvas
│   └── AnimationManager.ts  CSS animation orchestrator
│
├── ui/             # DOM components — consume core events, dispatch input
│   ├── BoardRenderer.ts   Builds and updates gem DOM elements
│   ├── InputHandler.ts    Pointer/touch → select/swap actions
│   ├── HUD.ts             Score, moves, combo, floating text
│   ├── ComboOverlay.ts    Combo celebration banner
│   └── GameOverScreen.ts  End-of-game overlay
│
├── utils/
│   ├── EventEmitter.ts    Generic typed pub/sub
│   └── helpers.ts         delay(), clamp(), getElementCenter()
│
└── main.ts         Entry point — wires everything together
```

### Event-Driven Communication

Components communicate via a typed `EventEmitter`. Core logic emits events; UI components subscribe:

```
GameState ──(scoreChanged)──► HUD.updateScore()
GameState ──(movesChanged)──► HUD.updateMoves()
GameState ──(gameOver)──────► GameOverScreen.show()
InputHandler ──(swapRequested)──► main.trySwap()
```

---

## 🎮 Gameplay

| Action | How |
|---|---|
| Select gem | Click / Tap |
| Swap gems | Click adjacent gem, or drag |
| Hint | Click 💡 or wait 8 seconds |
| New Game | Click 🔄 |
| Cascade combos | Chain matches after gravity for score multiplier |

**Scoring:** Each matched gem = 10 points × combo multiplier. Combos stack as long as the board cascades without input.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 9+

### Install & Run

```bash
# Clone the repository
git clone https://github.com/butovx/gem-crush.git
cd gem-crush

# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev
```

### Build for Production

```bash
npm run build     # Outputs to dist/
npm run preview   # Preview the production build locally
```

---

## 🧪 Testing & Quality

```bash
npm run test        # Run unit tests with Vitest
npm run test:watch  # Watch mode
npm run lint        # ESLint with TypeScript rules
npm run typecheck   # TypeScript compiler check
```

Tests cover:
- `Board` — grid init, match detection (3+ horizontal/vertical), gravity, swap, move validation
- `GameState` — score with combo multipliers, move consumption, phase transitions, game-over, reset

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| [TypeScript 5.6](https://www.typescriptlang.org/) | Strict typing throughout |
| [Vite 6](https://vitejs.dev/) | Fast build & dev server |
| [Vitest 2](https://vitest.dev/) | Unit testing (native ESM) |
| [ESLint 9](https://eslint.org/) | Linting with flat config |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Procedural sound synthesis |
| [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Particles & background |
| [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) | Design tokens & theming |
| [GitHub Actions](https://github.com/features/actions) | CI/CD + GitHub Pages deploy |

---

## 📂 Project Structure

```
gem-crush/
├── .github/workflows/ci.yml   GitHub Actions pipeline
├── public/
│   ├── index.html             HTML shell with accessibility attrs
│   └── favicon.svg            Gem-shaped SVG favicon
├── src/                       TypeScript source (see Architecture)
├── tests/                     Vitest unit tests
│   ├── Board.test.ts
│   └── GameState.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
└── LICENSE
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m "feat: add power-up system"`
4. Open a Pull Request

Please ensure `npm run lint`, `npm run test`, and `npm run build` all pass before submitting.

---

## 📄 License

[MIT](LICENSE) © 2026 Gem Crush Contributors
