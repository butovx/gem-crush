// ─────────────────────────────────────────────
// HUD — Score, moves, combo display
// ─────────────────────────────────────────────

import { MAX_MOVES, TIMING } from '../core/constants';
import { getElementCenter } from '../utils/helpers';

/**
 * Updates the heads-up display: score counter, moves remaining,
 * combo multiplier, progress bar, and floating score text.
 */
export class HUD {
  private scoreEl: HTMLElement;
  private movesEl: HTMLElement;
  private comboEl: HTMLElement;
  private movesFillEl: HTMLElement;
  private highScoreEl?: HTMLElement | null;

  constructor(
    scoreEl: HTMLElement,
    movesEl: HTMLElement,
    comboEl: HTMLElement,
    movesFillEl: HTMLElement,
    highScoreEl?: HTMLElement | null,
  ) {
    this.highScoreEl = highScoreEl;
    this.scoreEl = scoreEl;
    this.movesEl = movesEl;
    this.comboEl = comboEl;
    this.movesFillEl = movesFillEl;
  }

  private displayedScore = 0;
  private scoreAnimFrame = 0;

  /** Update the score display with smooth interpolation */
  updateScore(score: number): void {
    cancelAnimationFrame(this.scoreAnimFrame);
    const start = this.displayedScore;
    const diff = score - start;
    if (diff === 0) {
      this.scoreEl.textContent = score.toLocaleString();
      return;
    }

    const duration = 250;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      this.displayedScore = Math.floor(start + diff * progress);
      this.scoreEl.textContent = this.displayedScore.toLocaleString();

      if (progress < 1) {
        this.scoreAnimFrame = requestAnimationFrame(animate);
      } else {
        this.displayedScore = score;
        this.scoreEl.textContent = score.toLocaleString();
      }
    };

    this.scoreAnimFrame = requestAnimationFrame(animate);
  }

  /** Update the high score display */
  updateHighScore(highScore: number): void {
    if (this.highScoreEl) {
      this.highScoreEl.textContent = highScore.toLocaleString();
    }
  }

  /** Update the moves display and progress bar */
  updateMoves(moves: number): void {
    this.movesEl.textContent = String(moves);
    const percent = (moves / MAX_MOVES) * 100;
    this.movesFillEl.style.width = `${percent}%`;

    // Change bar color when low on moves
    this.movesFillEl.style.background =
      moves <= 5
        ? 'linear-gradient(90deg, #ff4d6d, #ff8fa3)'
        : 'linear-gradient(90deg, #ff6fd8, #ffd86f)';
  }

  /** Update the combo multiplier display */
  updateCombo(combo: number): void {
    this.comboEl.textContent = `×${Math.max(1, combo)}`;
  }

  /** Show a floating "+N" score text at a cell position */
  showFloatingScore(cellEl: Element, points: number): void {
    const pos = getElementCenter(cellEl);
    const el = document.createElement('div');
    el.className = 'float-score';
    el.textContent = `+${points}`;
    el.style.left = `${pos.x}px`;
    el.style.top = `${pos.y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), TIMING.FLOAT_SCORE);
  }
}
