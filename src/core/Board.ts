// ─────────────────────────────────────────────
// Board — Pure game grid logic
// ─────────────────────────────────────────────

import { ROWS, COLS, TYPES } from './constants';

export interface DropInfo {
  readonly row: number;
  readonly col: number;
  readonly fromRow: number;
}

/**
 * Manages the match-3 game grid.
 * Contains pure logic only — no DOM, no rendering, fully testable.
 */
export class Board {
  private _grid: number[][] = [];

  /** Read-only access to the grid */
  get grid(): readonly (readonly number[])[] {
    return this._grid;
  }

  /** Get the gem type at (row, col) */
  getType(row: number, col: number): number {
    return this._grid[row][col];
  }

  /** Set the gem type at (row, col) */
  setType(row: number, col: number, type: number): void {
    this._grid[row][col] = type;
  }

  /** Generate a random gem type [0, TYPES) */
  private randomType(): number {
    return Math.floor(Math.random() * TYPES);
  }

  /**
   * Initialize the grid with random gems,
   * ensuring no initial matches of 3+ exist.
   */
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

    // Guarantee at least one valid move exists
    if (this.findAllMoves().length === 0) {
      this.init();
    }
  }

  /**
   * Find all matched gem positions (3+ in a row/column).
   * @returns Array of flat indices (row * COLS + col)
   */
  findMatches(): number[] {
    const grid = this._grid;
    const matched = new Set<number>();

    // Horizontal matches
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 2; c++) {
        const type = grid[r][c];
        if (type === -1) continue;

        let len = 1;
        while (c + len < COLS && grid[r][c + len] === type) len++;

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

  /** Check if two cells are orthogonally adjacent */
  isAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  }

  /** Swap two gems on the grid */
  swap(r1: number, c1: number, r2: number, c2: number): void {
    [this._grid[r1][c1], this._grid[r2][c2]] = [this._grid[r2][c2], this._grid[r1][c1]];
  }

  /**
   * Apply gravity: gems fall down to fill empty (-1) cells,
   * new random gems fill the top.
   * @returns Array of drop info for animation
   */
  applyGravity(): DropInfo[] {
    const drops: DropInfo[] = [];

    for (let c = 0; c < COLS; c++) {
      let emptyRow = ROWS - 1;

      // Move existing gems down
      for (let r = ROWS - 1; r >= 0; r--) {
        if (this._grid[r][c] !== -1) {
          if (r !== emptyRow) {
            this._grid[emptyRow][c] = this._grid[r][c];
            this._grid[r][c] = -1;
            drops.push({ row: emptyRow, col: c, fromRow: r });
          }
          emptyRow--;
        }
      }

      // Fill empty top cells with new gems
      for (let r = emptyRow; r >= 0; r--) {
        this._grid[r][c] = this.randomType();
        drops.push({ row: r, col: c, fromRow: r - (emptyRow - r + 1) });
      }
    }

    return drops;
  }

  /**
   * Find all possible valid moves.
   * @returns Array of [r1, c1, r2, c2] swap pairs that would create a match
   */
  findAllMoves(): [number, number, number, number][] {
    const moves: [number, number, number, number][] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Try swap right
        if (c < COLS - 1) {
          this.swap(r, c, r, c + 1);
          if (this.findMatches().length > 0) {
            moves.push([r, c, r, c + 1]);
          }
          this.swap(r, c, r, c + 1);
        }
        // Try swap down
        if (r < ROWS - 1) {
          this.swap(r, c, r + 1, c);
          if (this.findMatches().length > 0) {
            moves.push([r, c, r + 1, c]);
          }
          this.swap(r, c, r + 1, c);
        }
      }
    }

    return moves;
  }

  /** Convert a flat index to (row, col) */
  static indexToPos(index: number): { row: number; col: number } {
    return {
      row: Math.floor(index / COLS),
      col: index % COLS,
    };
  }

  /** Convert (row, col) to flat index */
  static posToIndex(row: number, col: number): number {
    return row * COLS + col;
  }
}
