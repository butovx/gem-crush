import { describe, it, expect, beforeEach } from 'vitest';
import { Board } from '../src/core/Board';
import { ROWS, COLS } from '../src/core/constants';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
    board.init();
  });

  // ── Initialization ──────────────────────────────────────────────

  it('initializes a full 8×8 grid', () => {
    let count = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const type = board.getType(r, c);
        expect(type).toBeGreaterThanOrEqual(0);
        expect(type).toBeLessThan(7);
        count++;
      }
    }
    expect(count).toBe(64);
  });

  it('starts with no initial matches', () => {
    const matches = board.findMatches();
    expect(matches).toHaveLength(0);
  });

  it('always has at least one valid move after init', () => {
    const moves = board.findAllMoves();
    expect(moves.length).toBeGreaterThan(0);
  });

  // ── Match Detection ─────────────────────────────────────────────

  it('detects a horizontal match of 3', () => {
    // Force a horizontal match in row 0
    board.setType(0, 0, 0);
    board.setType(0, 1, 0);
    board.setType(0, 2, 0);
    // Make sure no vertical conflicts
    board.setType(1, 0, 1);
    board.setType(1, 1, 1);
    board.setType(1, 2, 1);

    const matches = board.findMatches();
    expect(matches).toContain(0 * COLS + 0);
    expect(matches).toContain(0 * COLS + 1);
    expect(matches).toContain(0 * COLS + 2);
  });

  it('detects a vertical match of 3', () => {
    board.setType(0, 0, 2);
    board.setType(1, 0, 2);
    board.setType(2, 0, 2);
    // Prevent horizontal matches
    board.setType(0, 1, 1);
    board.setType(1, 1, 1);
    board.setType(2, 1, 1);

    const matches = board.findMatches();
    expect(matches).toContain(0 * COLS + 0);
    expect(matches).toContain(1 * COLS + 0);
    expect(matches).toContain(2 * COLS + 0);
  });

  it('detects a match of 4 gems', () => {
    board.setType(3, 0, 3);
    board.setType(3, 1, 3);
    board.setType(3, 2, 3);
    board.setType(3, 3, 3);
    // Isolate
    board.setType(4, 0, 1);
    board.setType(4, 1, 1);
    board.setType(4, 2, 1);
    board.setType(4, 3, 1);

    const matches = board.findMatches();
    expect(matches).toContain(3 * COLS + 0);
    expect(matches).toContain(3 * COLS + 3);
    expect(matches.length).toBeGreaterThanOrEqual(4);
  });

  it('returns no matches when none exist', () => {
    // Checkerboard pattern — guaranteed no matches
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        board.setType(r, c, (r + c) % 2);
      }
    }
    const matches = board.findMatches();
    expect(matches).toHaveLength(0);
  });

  // ── Adjacency ───────────────────────────────────────────────────

  it('correctly identifies adjacent cells', () => {
    expect(board.isAdjacent(0, 0, 0, 1)).toBe(true); // horizontal
    expect(board.isAdjacent(0, 0, 1, 0)).toBe(true); // vertical
    expect(board.isAdjacent(0, 0, 1, 1)).toBe(false); // diagonal
    expect(board.isAdjacent(0, 0, 2, 0)).toBe(false); // too far
    expect(board.isAdjacent(3, 3, 3, 3)).toBe(false); // same cell
  });

  // ── Swap ────────────────────────────────────────────────────────

  it('swaps two gems correctly', () => {
    board.setType(0, 0, 1);
    board.setType(0, 1, 2);
    board.swap(0, 0, 0, 1);
    expect(board.getType(0, 0)).toBe(2);
    expect(board.getType(0, 1)).toBe(1);
  });

  it('is reversible by swapping again', () => {
    const original00 = board.getType(2, 2);
    const original01 = board.getType(2, 3);
    board.swap(2, 2, 2, 3);
    board.swap(2, 2, 2, 3);
    expect(board.getType(2, 2)).toBe(original00);
    expect(board.getType(2, 3)).toBe(original01);
  });

  // ── Gravity ─────────────────────────────────────────────────────

  it('fills empty cells with gravity', () => {
    // Empty an entire column
    for (let r = 0; r < ROWS; r++) {
      board.setType(r, 0, -1);
    }
    const drops = board.applyGravity();

    // All cells in column 0 should now be filled
    for (let r = 0; r < ROWS; r++) {
      expect(board.getType(r, 0)).toBeGreaterThanOrEqual(0);
    }

    // Should have produced drop records for column 0
    const col0Drops = drops.filter((d) => d.col === 0);
    expect(col0Drops.length).toBeGreaterThan(0);
  });

  it('drops gems down to fill gaps', () => {
    board.setType(0, 0, 5);
    board.setType(1, 0, -1);
    board.setType(2, 0, -1);
    // Fill rest so only rows 0-2 matter
    for (let r = 3; r < ROWS; r++) board.setType(r, 0, 1);
    for (let c = 1; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) board.setType(r, c, 1);
    }

    board.applyGravity();

    // Gem from row 0 should have fallen to row 2
    expect(board.getType(2, 0)).toBe(5);
  });

  // ── Move Finding ────────────────────────────────────────────────

  it('findAllMoves returns only moves that create matches', () => {
    const moves = board.findAllMoves();

    // Verify each move actually produces a match
    for (const [r1, c1, r2, c2] of moves) {
      board.swap(r1, c1, r2, c2);
      const matches = board.findMatches();
      expect(matches.length).toBeGreaterThan(0);
      board.swap(r1, c1, r2, c2); // undo
    }
  });

  // ── Static helpers ──────────────────────────────────────────────

  it('converts flat index to position correctly', () => {
    expect(Board.indexToPos(0)).toEqual({ row: 0, col: 0 });
    expect(Board.indexToPos(7)).toEqual({ row: 0, col: 7 });
    expect(Board.indexToPos(8)).toEqual({ row: 1, col: 0 });
    expect(Board.indexToPos(63)).toEqual({ row: 7, col: 7 });
  });

  it('converts position to flat index correctly', () => {
    expect(Board.posToIndex(0, 0)).toBe(0);
    expect(Board.posToIndex(0, 7)).toBe(7);
    expect(Board.posToIndex(1, 0)).toBe(8);
    expect(Board.posToIndex(7, 7)).toBe(63);
  });
});
