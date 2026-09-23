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
}
