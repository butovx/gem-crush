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

  /** Show the game-over overlay with the final score and stats */
  show(finalScore: number, stats?: { best: number; maxCombo: number; totalGems: number }): void {
    this.finalScoreEl.textContent = finalScore.toLocaleString();

    if (stats) {
      const bestEl = document.getElementById('stat-best');
      const comboEl = document.getElementById('stat-combo');
      const gemsEl = document.getElementById('stat-gems');
      const msgEl = document.getElementById('game-over-msg');

      if (bestEl) bestEl.textContent = stats.best.toLocaleString();
      if (comboEl) comboEl.textContent = `×${stats.maxCombo}`;
      if (gemsEl) gemsEl.textContent = String(stats.totalGems);
      if (msgEl) {
        msgEl.textContent =
          finalScore >= stats.best && finalScore > 0
            ? '🎉 New Personal Record! Outstanding game!'
            : 'Great job! Can you beat your high score?';
      }
    }

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
