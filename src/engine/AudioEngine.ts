// ─────────────────────────────────────────────
// Audio Engine — Web Audio API synthesizer
// ─────────────────────────────────────────────

/**
 * Generates game sound effects using the Web Audio API.
 * No audio files needed — all sounds are synthesized in real-time.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private _muted = false;

  get muted(): boolean {
    return this._muted;
  }

  /** Toggle mute state */
  toggleMute(): boolean {
    this._muted = !this._muted;
    return this._muted;
  }

  /** Lazy-init AudioContext (must be called after user interaction) */
  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.ctx;
  }

  /** Resume audio context (call on first user interaction) */
  unlock(): void {
    try {
      this.getContext().resume();
    } catch {
      // AudioContext not supported
    }
  }

  /** Play a single tone */
  private playTone(freq: number, type: OscillatorType, duration: number, volume = 0.15): void {
    if (this._muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio playback failed — silently ignore
    }
  }

  /** Gem swap sound */
  playSwap(): void {
    this.playTone(520, 'sine', 0.12, 0.1);
    this.playTone(660, 'sine', 0.12, 0.08);
  }

  /** Match found sound (pitch increases with combo) */
  playMatch(combo: number): void {
    const base = 440 + combo * 80;
    this.playTone(base, 'sine', 0.25, 0.12);
    setTimeout(() => this.playTone(base * 1.25, 'sine', 0.2, 0.1), 60);
    setTimeout(() => this.playTone(base * 1.5, 'triangle', 0.3, 0.08), 120);
  }

  /** Gem drop sound */
  playDrop(): void {
    this.playTone(280, 'sine', 0.08, 0.05);
  }

  /** Invalid swap sound */
  playNoMatch(): void {
    this.playTone(200, 'square', 0.15, 0.06);
  }

  /** Combo celebration sound */
  playCombo(level: number): void {
    const base = 600 + level * 100;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.playTone(base + i * 120, 'sine', 0.15, 0.1), i * 50);
    }
  }

  /** Game over sound (descending notes) */
  playGameOver(): void {
    const notes = [440, 392, 349, 330];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.4, 0.12), i * 200);
    });
  }
}
