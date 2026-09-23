// ─────────────────────────────────────────────
// Combo Overlay — Banner display for combos
// ─────────────────────────────────────────────

import { COMBO_TEXTS, TIMING } from '../core/constants';

/**
 * Displays combo celebration banners in the center of the screen.
 */
export class ComboOverlay {
  private bannerEl: HTMLElement;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(bannerEl: HTMLElement) {
    this.bannerEl = bannerEl;
  }

  /** Show combo banner with appropriate text */
  show(comboLevel: number): void {
    // Clear previous timeout
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    const text =
      comboLevel < COMBO_TEXTS.length
        ? COMBO_TEXTS[comboLevel]
        : `×${comboLevel} КОМБО! 🎆`;

    this.bannerEl.textContent = text;
    this.bannerEl.classList.add('show');

    this.timeoutId = setTimeout(() => {
      this.bannerEl.classList.remove('show');
      this.timeoutId = null;
    }, TIMING.COMBO_BANNER);
  }

  /** Hide the banner immediately */
  hide(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.bannerEl.classList.remove('show');
  }
}
