// ─────────────────────────────────────────────
// Gem Crush — Main Entry Point
// ─────────────────────────────────────────────

// Styles
import './styles/main.css';
import './styles/board.css';
import './styles/gems.css';
import './styles/animations.css';
import './styles/hud.css';
import './styles/overlays.css';

// Core
import { COLS, TIMING } from './core/constants';
import { Board } from './core/Board';
import { GameState } from './core/GameState';

// Engine
import { AudioEngine } from './engine/AudioEngine';
import { ParticleSystem } from './engine/ParticleSystem';
import { BackgroundRenderer } from './engine/BackgroundRenderer';
import { AnimationManager } from './engine/AnimationManager';

// UI
import { BoardRenderer } from './ui/BoardRenderer';
import { InputHandler } from './ui/InputHandler';
import { HUD } from './ui/HUD';
import { ComboOverlay } from './ui/ComboOverlay';
import { GameOverScreen } from './ui/GameOverScreen';

// Utils
import { getElementCenter, querySelector } from './utils/helpers';

// ─────────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────────

// Core instances
const board = new Board();
const state = new GameState();

// Engine instances
const audio = new AudioEngine();
const particles = new ParticleSystem(
  querySelector<HTMLCanvasElement>('#particle-canvas'),
);
new BackgroundRenderer(
  querySelector<HTMLCanvasElement>('#bg-canvas'),
);

// UI instances
const boardEl = querySelector('#board');
const animManager = new AnimationManager(boardEl);
const input = new InputHandler();
const boardRenderer = new BoardRenderer(boardEl);
boardRenderer.initGrid(
  (row, col, e) => input.handlePointerDown(row, col, e),
  (row, col) => input.handlePointerEnter(row, col),
);
const hud = new HUD(
  querySelector('#score'),
  querySelector('#moves'),
  querySelector('#combo'),
  querySelector('#moves-fill'),
  document.getElementById('high-score'),
);
const comboOverlay = new ComboOverlay(querySelector('#combo-banner'));
const gameOverScreen = new GameOverScreen(
  querySelector('#overlay'),
  querySelector('#final-score'),
  querySelector('#btn-restart'),
);

// ─────────────────────────────────────────────
// Hint System
// ─────────────────────────────────────────────

let hintCells: [number, number][] = [];
let hintTimer: ReturnType<typeof setTimeout> | null = null;
let autoHintTimer: ReturnType<typeof setTimeout> | null = null;

function clearHints(): void {
  if (hintTimer) {
    clearTimeout(hintTimer);
    hintTimer = null;
  }
  animManager.clearHint(hintCells);
  hintCells = [];
}

function showHint(): void {
  if (!state.isIdle || state.moves <= 0) return;
  clearHints();

  const allMoves = board.findAllMoves();
  if (allMoves.length === 0) return;

  const move = allMoves[Math.floor(Math.random() * allMoves.length)];
  hintCells = [[move[0], move[1]], [move[2], move[3]]];

  animManager.showHint(hintCells);

  // Sparkle particles on hint cells
  for (const [r, c] of hintCells) {
    const cell = boardRenderer.getCell(r, c);
    if (cell) {
      const center = getElementCenter(cell);
      particles.sparkle(center.x, center.y, 4);
    }
  }

  // Auto-clear hint after duration
  hintTimer = setTimeout(clearHints, TIMING.HINT_DURATION);
}

function resetAutoHint(): void {
  if (autoHintTimer) clearTimeout(autoHintTimer);
  autoHintTimer = setTimeout(() => {
    if (state.isIdle && state.moves > 0) showHint();
  }, TIMING.AUTO_HINT_DELAY);
}

// ─────────────────────────────────────────────
// Board Rendering
// ─────────────────────────────────────────────

function renderBoard(): void {
  boardRenderer.render(board);
}

// ─────────────────────────────────────────────
// Cascade Logic
// ─────────────────────────────────────────────

async function cascade(): Promise<void> {
  let matched = board.findMatches();

  while (matched.length > 0) {
    state.incrementCombo();
    const points = state.addScore(matched.length);

    if (state.combo >= 2) {
      comboOverlay.show(state.combo);
      audio.playCombo(state.combo);
    }

    audio.playMatch(state.combo);

    // Show floating score at first matched cell
    const firstIdx = matched[0];
    const firstCell = boardRenderer.getCell(
      Math.floor(firstIdx / COLS),
      firstIdx % COLS,
    );
    if (firstCell) {
      hud.showFloatingScore(firstCell, points);
    }

    // Emit particles for each matched gem
    for (const idx of matched) {
      const row = Math.floor(idx / COLS);
      const col = idx % COLS;
      const cell = boardRenderer.getCell(row, col);
      if (cell) {
        const center = getElementCenter(cell);
        particles.emit(center.x, center.y, board.getType(row, col), 12);
      }
    }

    // Animate match pop
    await animManager.animateMatchPop(matched);

    // Remove matched gems from grid
    for (const idx of matched) {
      board.setType(Math.floor(idx / COLS), idx % COLS, -1);
    }
    renderBoard();

    // Apply gravity & animate drops
    const drops = board.applyGravity();
    renderBoard();
    await animManager.animateDrops(drops);

    audio.playDrop();
    hud.updateScore(state.score);
    hud.updateCombo(state.combo);

    matched = board.findMatches();
  }
}

// ─────────────────────────────────────────────
// Swap Logic
// ─────────────────────────────────────────────

async function trySwap(r1: number, c1: number, r2: number, c2: number): Promise<void> {
  state.setPhase('animating');
  input.enabled = false;
  clearHints();
  audio.playSwap();

  // Animate swap
  await animManager.animateSwap(r1, c1, r2, c2);
  board.swap(r1, c1, r2, c2);
  renderBoard();

  // Check for matches
  const matched = board.findMatches();
  if (matched.length === 0) {
    audio.playNoMatch();
    // Swap back
    await animManager.animateSwap(r1, c1, r2, c2);
    board.swap(r1, c1, r2, c2);
    renderBoard();
    state.setPhase('idle');
    input.enabled = true;
    resetAutoHint();
    return;
  }

  // Valid move — consume a move
  state.useMove();
  state.resetCombo();
  hud.updateMoves(state.moves);

  await cascade();

  // Check game over
  if (state.moves <= 0) {
    setTimeout(() => {
      audio.playGameOver();
      state.triggerGameOver();
      gameOverScreen.show(state.score, {
        best: state.highScore,
        maxCombo: state.maxCombo,
        totalGems: state.totalGemsCrushed,
      });
    }, TIMING.GAME_OVER_DELAY);
  } else if (board.findAllMoves().length === 0) {
    // No valid moves left — reshuffle
    board.init();
    renderBoard();
  }

  state.setPhase('idle');
  input.enabled = true;
  resetAutoHint();
}

// ─────────────────────────────────────────────
// Input Wiring
// ─────────────────────────────────────────────

input.on('cellSelected', (row, col) => {
  animManager.deselectAll();
  clearHints();
  resetAutoHint();
  if (row >= 0 && col >= 0) {
    animManager.selectCell(row, col);
  }
});

input.on('swapRequested', (r1, c1, r2, c2) => {
  animManager.deselectAll();
  trySwap(r1, c1, r2, c2);
});

// ─────────────────────────────────────────────
// New Game
// ─────────────────────────────────────────────

function newGame(): void {
  gameOverScreen.hide();
  comboOverlay.hide();
  clearHints();

  state.reset();
  board.init();
  renderBoard();

  hud.updateScore(0);
  hud.updateHighScore(state.highScore);
  hud.updateMoves(state.moves);
  hud.updateCombo(0);

  input.enabled = true;
  input.clearSelection();
  resetAutoHint();
}

// ─────────────────────────────────────────────
// Button Bindings
// ─────────────────────────────────────────────

querySelector('#btn-hint').addEventListener('click', showHint);
querySelector('#btn-new').addEventListener('click', newGame);

const soundBtn = document.getElementById('btn-sound');
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    audio.unlock();
    const isMuted = audio.toggleMute();
    soundBtn.textContent = isMuted ? '🔇' : '🔊';
    if (!isMuted) {
      audio.playSwap();
    }
  });
}

state.on('highScoreChanged', (highScore) => {
  hud.updateHighScore(highScore);
  particles.starShower();
});

gameOverScreen.onRestart(newGame);

// Unlock audio on user interaction (Safari/WebKit requires click/touchend)
const unlockAudio = (): void => {
  audio.unlock();
  resetAutoHint();
};
window.addEventListener('click', unlockAudio, { passive: true });
window.addEventListener('pointerdown', unlockAudio, { passive: true });
window.addEventListener('touchend', unlockAudio, { passive: true });
window.addEventListener('keydown', unlockAudio, { passive: true });

// ─────────────────────────────────────────────
// Start!
// ─────────────────────────────────────────────
newGame();
