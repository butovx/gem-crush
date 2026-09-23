// ─────────────────────────────────────────────
// GameState — Score, moves, combo, lifecycle
// ─────────────────────────────────────────────

import { MAX_MOVES } from './constants';
import { EventEmitter } from '../utils/EventEmitter';

export type GamePhase = 'idle' | 'animating' | 'gameOver';

export interface GameEvents {
  [key: string]: unknown[];
  scoreChanged: [score: number];
  movesChanged: [moves: number];
  comboChanged: [combo: number];
  phaseChanged: [phase: GamePhase];
  gameOver: [finalScore: number];
}

/**
 * Manages game state: score, remaining moves, combo counter,
 * and game lifecycle phases. Emits typed events for UI updates.
 */
export class GameState extends EventEmitter<GameEvents> {
  private _score = 0;
  private _moves = MAX_MOVES;
  private _combo = 0;
  private _phase: GamePhase = 'idle';

  get score(): number {
    return this._score;
  }

  get moves(): number {
    return this._moves;
  }

  get combo(): number {
    return this._combo;
  }

  get phase(): GamePhase {
    return this._phase;
  }

  get isIdle(): boolean {
    return this._phase === 'idle';
  }

  get isGameOver(): boolean {
    return this._phase === 'gameOver';
  }

  /** Set the game phase */
  setPhase(phase: GamePhase): void {
    this._phase = phase;
    this.emit('phaseChanged', phase);
  }

  /** Add score based on matched gems count and current combo */
  addScore(matchedCount: number): number {
    const points = matchedCount * 10 * Math.max(1, this._combo);
    this._score += points;
    this.emit('scoreChanged', this._score);
    return points;
  }

  /** Consume one move. Returns true if moves remain */
  useMove(): boolean {
    this._moves = Math.max(0, this._moves - 1);
    this.emit('movesChanged', this._moves);
    return this._moves > 0;
  }

  /** Increment combo counter */
  incrementCombo(): void {
    this._combo++;
    this.emit('comboChanged', this._combo);
  }

  /** Reset combo counter */
  resetCombo(): void {
    this._combo = 0;
    this.emit('comboChanged', this._combo);
  }

  /** Trigger game over */
  triggerGameOver(): void {
    this.setPhase('gameOver');
    this.emit('gameOver', this._score);
  }

  /** Reset all state for a new game */
  reset(): void {
    this._score = 0;
    this._moves = MAX_MOVES;
    this._combo = 0;
    this._phase = 'idle';
    this.emit('scoreChanged', this._score);
    this.emit('movesChanged', this._moves);
    this.emit('comboChanged', this._combo);
    this.emit('phaseChanged', this._phase);
  }
}
