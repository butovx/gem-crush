// ─────────────────────────────────────────────
// Animation Manager — Coordinates all visual transitions
// ─────────────────────────────────────────────

import { COLS, TIMING } from '../core/constants';
import { delay } from '../utils/helpers';

/**
 * Orchestrates CSS-based animations for game interactions:
 * swap, match-pop, gravity drop, gem appear, hints.
 * All methods return Promises so game logic can await them.
 */
export class AnimationManager {
  private boardEl: HTMLElement;

  constructor(boardEl: HTMLElement) {
    this.boardEl = boardEl;
  }

  /** Get a cell DOM element by (row, col) */
  private getCell(row: number, col: number): HTMLElement | null {
    return this.boardEl.children[row * COLS + col] as HTMLElement | null;
  }

  /**
   * Animate a swap between two cells.
   * Applies CSS custom properties for translation direction.
   */
  async animateSwap(r1: number, c1: number, r2: number, c2: number): Promise<void> {
    const cell1 = this.getCell(r1, c1);
    const cell2 = this.getCell(r2, c2);
    if (!cell1 || !cell2) return;

    const dx = (c2 - c1) * 100;
    const dy = (r2 - r1) * 100;

    cell1.style.setProperty('--sx', `${dx}%`);
    cell1.style.setProperty('--sy', `${dy}%`);
    cell2.style.setProperty('--sx', `${-dx}%`);
    cell2.style.setProperty('--sy', `${-dy}%`);

    cell1.classList.add('swapping');
    cell2.classList.add('swapping');

    await delay(TIMING.SWAP);

    cell1.classList.remove('swapping');
    cell2.classList.remove('swapping');
  }

  /**
   * Animate matched gems popping and disappearing.
   * @param indices - Flat indices of matched cells
   */
  async animateMatchPop(indices: number[]): Promise<void> {
    for (const idx of indices) {
      const row = Math.floor(idx / COLS);
      const col = idx % COLS;
      const cell = this.getCell(row, col);
      cell?.classList.add('matching');
    }

    await delay(TIMING.MATCH_POP);
  }

  /**
   * Animate gems dropping after gravity.
   * @param drops - Array of { row, col, fromRow } describing each drop
   */
  async animateDrops(drops: Array<{ row: number; col: number; fromRow: number }>): Promise<void> {
    for (const drop of drops) {
      const cell = this.getCell(drop.row, drop.col);
      if (!cell) continue;

      const distance = drop.row - drop.fromRow;
      cell.style.setProperty('--drop-from', `${-distance * 100}%`);
      cell.classList.add('dropping');
    }

    await delay(TIMING.GRAVITY_DROP);

    for (const drop of drops) {
      this.getCell(drop.row, drop.col)?.classList.remove('dropping');
    }
  }

  /** Highlight cells as a hint */
  showHint(cells: [number, number][]): void {
    for (const [row, col] of cells) {
      this.getCell(row, col)?.classList.add('hint');
    }
  }

  /** Remove hint highlights */
  clearHint(cells: [number, number][]): void {
    for (const [row, col] of cells) {
      this.getCell(row, col)?.classList.remove('hint');
    }
  }

  /** Add 'selected' highlight to a cell */
  selectCell(row: number, col: number): void {
    this.getCell(row, col)?.classList.add('selected');
  }

  /** Remove all 'selected' highlights */
  deselectAll(): void {
    this.boardEl.querySelectorAll('.selected').forEach((el) => {
      el.classList.remove('selected');
    });
  }
}
