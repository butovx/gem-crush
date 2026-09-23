// ─────────────────────────────────────────────
// Game Over Screen
// ─────────────────────────────────────────────

/**
 * Manages the game-over overlay display.
 */
export class GameOverScreen {
  private overlayEl: HTMLElement;
  private finalScoreEl: HTMLElement;
  private restartBtn: HTMLElement;

  constructor(
    overlayEl: HTMLElement,
    finalScoreEl: HTMLElement,
    restartBtn: HTMLElement,
  ) {
    this.overlayEl = overlayEl;
    this.finalScoreEl = finalScoreEl;
    this.restartBtn = restartBtn;
  }

  /** Show the game-over overlay with the final score */
  show(finalScore: number): void {
    this.finalScoreEl.textContent = finalScore.toLocaleString();
    this.overlayEl.classList.add('show');
  }

  /** Hide the game-over overlay */
  hide(): void {
    this.overlayEl.classList.remove('show');
  }

  /** Register a callback for the restart button */
  onRestart(callback: () => void): void {
    this.restartBtn.addEventListener('click', callback);
  }
}
