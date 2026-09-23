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

  // ── Match Detection ─────────────────────────────────────────────

  it('detects a horizontal match of 3', () => {
    board.setType(0, 0, 0);
    board.setType(0, 1, 0);
    board.setType(0, 2, 0);
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
    board.setType(0, 1, 1);
    board.setType(1, 1, 1);
    board.setType(2, 1, 1);

    const matches = board.findMatches();
    expect(matches).toContain(0 * COLS + 0);
    expect(matches).toContain(1 * COLS + 0);
    expect(matches).toContain(2 * COLS + 0);
  });

  // ── Adjacency ───────────────────────────────────────────────────

  it('correctly identifies adjacent cells', () => {
    expect(board.isAdjacent(0, 0, 0, 1)).toBe(true);
    expect(board.isAdjacent(0, 0, 1, 0)).toBe(true);
    expect(board.isAdjacent(0, 0, 1, 1)).toBe(false);
    expect(board.isAdjacent(0, 0, 2, 0)).toBe(false);
    expect(board.isAdjacent(3, 3, 3, 3)).toBe(false);
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
});
