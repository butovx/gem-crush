// ─────────────────────────────────────────────
// Input Handler — Pointer/touch → game actions
// ─────────────────────────────────────────────

import { EventEmitter } from '../utils/EventEmitter';

export interface InputEvents {
  [key: string]: unknown[];
  cellSelected: [row: number, col: number];
  swapRequested: [r1: number, c1: number, r2: number, c2: number];
}

/**
 * Handles pointer/touch input and translates it into
 * game actions (cell selection, swap requests).
 * Supports both click-to-select and drag-to-swap.
 */
export class InputHandler extends EventEmitter<InputEvents> {
  private selected: { row: number; col: number } | null = null;
  private dragging = false;
  private dragStart: { row: number; col: number } | null = null;
  private _enabled = true;

  constructor() {
    super();
    document.addEventListener('pointerup', () => {
      this.dragging = false;
    });

    // Keyboard navigation (Arrow keys + Enter/Space)
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this._enabled) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
        this.handleKeyboard(e);
      }
    });
  }

  /** Enable or disable input processing */
  set enabled(value: boolean) {
    this._enabled = value;
    if (!value) {
      this.selected = null;
      this.dragging = false;
      this.dragStart = null;
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  /** Check if two cells are orthogonally adjacent */
  private isAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  }

  /** Handle cell pointer-down (click/tap) */
  handlePointerDown(row: number, col: number, e: PointerEvent): void {
    if (!this._enabled) return;
    e.preventDefault();

    this.dragging = true;
    this.dragStart = { row, col };

    if (this.selected) {
      const { row: sr, col: sc } = this.selected;

      // Clicked same cell → deselect
      if (sr === row && sc === col) {
        this.selected = null;
        this.emit('cellSelected', -1, -1); // signal deselection
        return;
      }

      // Clicked adjacent cell → swap
      if (this.isAdjacent(sr, sc, row, col)) {
        this.selected = null;
        this.emit('swapRequested', sr, sc, row, col);
        return;
      }

      // Clicked non-adjacent → reselect
      this.selected = null;
    }

    this.selected = { row, col };
    this.emit('cellSelected', row, col);
  }

  /** Handle cell pointer-enter (drag) */
  handlePointerEnter(row: number, col: number): void {
    if (!this._enabled || !this.dragging || !this.dragStart) return;

    if (this.isAdjacent(this.dragStart.row, this.dragStart.col, row, col)) {
      this.dragging = false;
      const { row: sr, col: sc } = this.dragStart;
      this.selected = null;
      this.dragStart = null;
      this.emit('swapRequested', sr, sc, row, col);
    }
  }

  /** Handle keyboard controls */
  private handleKeyboard(e: KeyboardEvent): void {
    if (!this.selected) {
      this.selected = { row: 3, col: 3 };
      this.emit('cellSelected', 3, 3);
      return;
    }

    const { row, col } = this.selected;
    let nr = row;
    let nc = col;

    if (e.key === 'ArrowUp') nr = Math.max(0, row - 1);
    else if (e.key === 'ArrowDown') nr = Math.min(7, row + 1);
    else if (e.key === 'ArrowLeft') nc = Math.max(0, col - 1);
    else if (e.key === 'ArrowRight') nc = Math.min(7, col + 1);
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      return;
    }

    if (nr !== row || nc !== col) {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift + Arrow swaps immediately
        this.selected = null;
        this.emit('swapRequested', row, col, nr, nc);
      } else {
        this.selected = { row: nr, col: nc };
        this.emit('cellSelected', nr, nc);
      }
    }
  }

  /** Clear current selection state */
  clearSelection(): void {
    this.selected = null;
    this.dragging = false;
    this.dragStart = null;
  }
}
