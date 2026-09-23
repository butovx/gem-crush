// ─────────────────────────────────────────────
// GameState — Score, moves, combo, lifecycle
// ─────────────────────────────────────────────

import { MAX_MOVES } from './constants';
import { EventEmitter } from '../utils/EventEmitter';

export type GamePhase = 'idle' | 'animating' | 'gameOver';

export interface GameEvents {
  [key: string]: unknown[];
  scoreChanged: [score: number];
  highScoreChanged: [highScore: number];
  movesChanged: [moves: number];
  comboChanged: [combo: number];
  phaseChanged: [phase: GamePhase];
  gameOver: [finalScore: number];
}

/**
 * Manages game state: score, remaining moves, combo counter,
 * and game lifecycle phases. Emits typed events for UI updates.
 */
const HIGH_SCORE_KEY = 'gem_crush_high_score';

export class GameState extends EventEmitter<GameEvents> {
  private _score = 0;
  private _highScore = 0;
  private _moves = MAX_MOVES;
  private _combo = 0;
  private _maxCombo = 0;
  private _totalGemsCrushed = 0;
  private _phase: GamePhase = 'idle';

  constructor() {
    super();
    this._highScore = this.loadHighScore();
  }

  get score(): number {
    return this._score;
  }

  get highScore(): number {
    return this._highScore;
  }

  private loadHighScore(): number {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(HIGH_SCORE_KEY);
        return saved ? parseInt(saved, 10) || 0 : 0;
      }
    } catch {
      // Ignore
    }
    return 0;
  }

  private saveHighScore(score: number): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(HIGH_SCORE_KEY, String(score));
      }
    } catch {
      // Ignore
    }
  }

  get moves(): number {
    return this._moves;
  }

  get combo(): number {
    return this._combo;
  }

  get maxCombo(): number {
    return this._maxCombo;
  }

  get totalGemsCrushed(): number {
    return this._totalGemsCrushed;
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
    this._totalGemsCrushed += matchedCount;
    const points = matchedCount * 10 * Math.max(1, this._combo);
    this._score += points;
    this.emit('scoreChanged', this._score);
    if (this._score > this._highScore) {
      this._highScore = this._score;
      this.saveHighScore(this._highScore);
      this.emit('highScoreChanged', this._highScore);
    }
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
    if (this._combo > this._maxCombo) this._maxCombo = this._combo;
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
