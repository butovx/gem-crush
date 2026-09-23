// ─────────────────────────────────────────────
// Board — Pure game grid logic
// ─────────────────────────────────────────────

import { ROWS, COLS, TYPES } from './constants';

export class Board {
  private _grid: number[][] = [];

  get grid(): readonly (readonly number[])[] {
    return this._grid;
  }

  getType(row: number, col: number): number {
    return this._grid[row][col];
  }

  setType(row: number, col: number, type: number): void {
    this._grid[row][col] = type;
  }

  private randomType(): number {
    return Math.floor(Math.random() * TYPES);
  }

  init(): void {
    this._grid = [];
    for (let r = 0; r < ROWS; r++) {
      this._grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        let type: number;
        do {
          type = this.randomType();
        } while (
          (c >= 2 && this._grid[r][c - 1] === type && this._grid[r][c - 2] === type) ||
          (r >= 2 && this._grid[r - 1][c] === type && this._grid[r - 2][c] === type)
        );
        this._grid[r][c] = type;
      }
    }
  }

  findMatches(): number[] {
    const matched = new Set<number>();

    // Horizontal matches
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 2; c++) {
        const type = this._grid[r][c];
        if (type === -1) continue;

        let len = 1;
        while (c + len < COLS && this._grid[r][c + len] === type) len++;

        if (len >= 3) {
          for (let i = 0; i < len; i++) {
            matched.add(r * COLS + c + i);
          }
        }
        c += len - 1;
      }
    }

    // Vertical matches
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 2; r++) {
        const type = this._grid[r][c];
        if (type === -1) continue;

        let len = 1;
        while (r + len < ROWS && this._grid[r + len][c] === type) len++;

        if (len >= 3) {
          for (let i = 0; i < len; i++) {
            matched.add((r + i) * COLS + c);
          }
        }
        r += len - 1;
      }
    }

    return [...matched];
  }
}
