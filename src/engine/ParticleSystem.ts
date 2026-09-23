// ─────────────────────────────────────────────
// Particle System — On-demand high performance canvas effects
// ─────────────────────────────────────────────

import { GEM_CONFIGS } from '../core/constants';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  decay: number;
  gravity: number;
}

/**
 * High-performance canvas-based particle emitter.
 * Runs its render loop ONLY when active particles exist,
 * yielding 0% idle CPU and GPU usage.
 */
export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animFrameId = 0;
  private isRunning = false;
  private width = 0;
  private height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    if (!this.isRunning && this.particles.length === 0) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  private ensureLoopRunning(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animFrameId = requestAnimationFrame(this.draw);
  }

  /**
   * Emit a burst of particles at (x, y) with gem-type colors.
   */
  emit(x: number, y: number, gemType: number, count = 14): void {
    const colors = GEM_CONFIGS[gemType]?.particleColors ?? GEM_CONFIGS[0].particleColors;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2 + Math.random() * 3.5;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        radius: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        gravity: 0.09,
      });
    }

    this.ensureLoopRunning();
  }

  /**
   * Emit subtle sparkle particles (for hints).
   */
  sparkle(x: number, y: number, count = 5): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2,
        color: `hsl(${Math.floor(Math.random() * 60 + 30)}, 100%, 80%)`,
        life: 1,
        decay: 0.035 + Math.random() * 0.02,
        gravity: 0.03,
      });
    }

    this.ensureLoopRunning();
  }

  /** Trigger star shower effect */
  starShower(): void {
    this.burst(window.innerWidth / 2, window.innerHeight / 3, 40);
  }

  /** Confetti celebration burst (e.g. on new high score or big combo) */
  burst(x: number, y: number, count = 28): void {
    const rainbowColors = ['#ff4d6d', '#ffd86f', '#40e87b', '#5fa8ff', '#c77dff', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 2.5 + Math.random() * 3,
        color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        life: 1.1,
        decay: 0.018,
        gravity: 0.1,
      });
    }

    this.ensureLoopRunning();
  }

  /** Main render loop */
  private draw = (): void => {
    if (this.particles.length === 0) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.isRunning = false;
      return;
    }

    const { ctx, width: w, height: h } = this;
    ctx.clearRect(0, 0, w, h);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;

      if (p.life <= 0) {
        // Fast O(1) removal
        this.particles[i] = this.particles[this.particles.length - 1];
        this.particles.pop();
        continue;
      }

      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    this.animFrameId = requestAnimationFrame(this.draw);
  };

  /** Stop the render loop */
  destroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.isRunning = false;
  }
}
