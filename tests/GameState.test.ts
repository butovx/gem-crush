import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../src/core/GameState';
import { MAX_MOVES } from '../src/core/constants';

describe('GameState', () => {
  let state: GameState;

  beforeEach(() => {
    state = new GameState();
  });

  // ── Initial state ───────────────────────────────────────────────

  it('starts with zero score', () => {
    expect(state.score).toBe(0);
  });

  it('starts with MAX_MOVES moves', () => {
    expect(state.moves).toBe(MAX_MOVES);
  });

  it('starts with zero combo', () => {
    expect(state.combo).toBe(0);
  });

  it('starts in idle phase', () => {
    expect(state.phase).toBe('idle');
    expect(state.isIdle).toBe(true);
  });

  // ── Score ───────────────────────────────────────────────────────

  it('adds score based on matched count and combo', () => {
    state.incrementCombo(); // combo = 1
    const pts = state.addScore(3);
    expect(pts).toBe(30); // 3 * 10 * 1
    expect(state.score).toBe(30);
  });

  it('multiplies score by combo level', () => {
    state.incrementCombo();
    state.incrementCombo(); // combo = 2
    const pts = state.addScore(3);
    expect(pts).toBe(60); // 3 * 10 * 2
  });

  it('accumulates score across multiple addScore calls', () => {
    state.incrementCombo();
    state.addScore(3);
    state.addScore(5);
    expect(state.score).toBe(80); // 30 + 50
  });

  it('emits scoreChanged event when score updates', () => {
    const received: number[] = [];
    state.on('scoreChanged', (s) => received.push(s));
    state.incrementCombo();
    state.addScore(3);
    expect(received).toContain(30);
  });

  // ── Moves ───────────────────────────────────────────────────────

  it('decrements moves by 1 on useMove()', () => {
    state.useMove();
    expect(state.moves).toBe(MAX_MOVES - 1);
  });

  it('returns true when moves remain after useMove()', () => {
    const result = state.useMove();
    expect(result).toBe(true);
  });

  it('returns false and stays at 0 after all moves used', () => {
    for (let i = 0; i < MAX_MOVES; i++) state.useMove();
    const result = state.useMove();
    expect(result).toBe(false);
    expect(state.moves).toBe(0);
  });

  it('emits movesChanged event', () => {
    const received: number[] = [];
    state.on('movesChanged', (m) => received.push(m));
    state.useMove();
    expect(received).toContain(MAX_MOVES - 1);
  });

  // ── Combo ───────────────────────────────────────────────────────

  it('increments combo counter', () => {
    state.incrementCombo();
    state.incrementCombo();
    expect(state.combo).toBe(2);
  });

  it('resets combo to 0', () => {
    state.incrementCombo();
    state.incrementCombo();
    state.resetCombo();
    expect(state.combo).toBe(0);
  });

  it('emits comboChanged event on increment', () => {
    const received: number[] = [];
    state.on('comboChanged', (c) => received.push(c));
    state.incrementCombo();
    expect(received).toContain(1);
  });

  // ── Phase / Lifecycle ───────────────────────────────────────────

  it('transitions through phases correctly', () => {
    state.setPhase('animating');
    expect(state.phase).toBe('animating');
    expect(state.isIdle).toBe(false);

    state.setPhase('idle');
    expect(state.phase).toBe('idle');
    expect(state.isIdle).toBe(true);
  });

  it('triggers game over and emits event', () => {
    const received: number[] = [];
    state.on('gameOver', (score) => received.push(score));
    state.incrementCombo();
    state.addScore(5);
    state.triggerGameOver();

    expect(state.isGameOver).toBe(true);
    expect(received).toContain(50); // 5 * 10 * 1
  });

  it('emits phaseChanged when game over is triggered', () => {
    const phases: string[] = [];
    state.on('phaseChanged', (p) => phases.push(p));
    state.triggerGameOver();
    expect(phases).toContain('gameOver');
  });

  // ── Reset ───────────────────────────────────────────────────────

  it('resets all state to initial values', () => {
    state.incrementCombo();
    state.incrementCombo();
    state.addScore(10);
    state.useMove();
    state.setPhase('animating');

    state.reset();

    expect(state.score).toBe(0);
    expect(state.moves).toBe(MAX_MOVES);
    expect(state.combo).toBe(0);
    expect(state.phase).toBe('idle');
    expect(state.isIdle).toBe(true);
  });

  it('emits all change events on reset', () => {
    const scoreEvents: number[] = [];
    const movesEvents: number[] = [];
    const comboEvents: number[] = [];

    state.on('scoreChanged', (s) => scoreEvents.push(s));
    state.on('movesChanged', (m) => movesEvents.push(m));
    state.on('comboChanged', (c) => comboEvents.push(c));

    state.reset();

    expect(scoreEvents).toContain(0);
    expect(movesEvents).toContain(MAX_MOVES);
    expect(comboEvents).toContain(0);
  });

  // ── High Score & Stats ──────────────────────────────────────────

  it('tracks and updates high score', () => {
    state.incrementCombo();
    state.addScore(10); // 100 pts
    expect(state.highScore).toBeGreaterThanOrEqual(100);
  });

  it('tracks total gems crushed across cascades', () => {
    state.addScore(3);
    state.addScore(4);
    expect(state.totalGemsCrushed).toBe(7);
  });

  it('tracks maximum combo reached in a game', () => {
    state.incrementCombo();
    state.incrementCombo();
    state.incrementCombo();
    expect(state.maxCombo).toBe(3);
    state.resetCombo();
    expect(state.combo).toBe(0);
    expect(state.maxCombo).toBe(3);
  });
});
