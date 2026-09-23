// ─────────────────────────────────────────────
// Board — Pure game grid logic
// ─────────────────────────────────────────────

import { ROWS, COLS } from './constants';

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
}
