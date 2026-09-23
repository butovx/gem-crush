// ─────────────────────────────────────────────
// Particle System — Canvas-based effects
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
  rotation?: number;
  rotSpeed?: number;
}

/**
 * Canvas-based particle emitter for match explosions and sparkle effects.
 * Manages its own render loop via requestAnimationFrame.
 */
export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animFrameId = 0;
  private width = 0;
  private height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.startLoop();
  }

  private resize(): void {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  /**
   * Emit a burst of particles at (x, y) with gem-type colors.
   * Used when gems are matched and destroyed.
   */
  emit(x: number, y: number, gemType: number, count = 16): void {
    const colors = GEM_CONFIGS[gemType]?.particleColors ?? GEM_CONFIGS[0].particleColors;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        radius: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.015 + Math.random() * 0.02,
        gravity: 0.08,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  /**
   * Emit subtle sparkle particles (for hints).
   */
  sparkle(x: number, y: number, count = 6): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 2,
        color: `hsl(${Math.random() * 60 + 30}, 100%, 80%)`,
        life: 1,
        decay: 0.03 + Math.random() * 0.02,
        gravity: 0.02,
      });
    }
  }

  /** Main render loop */
  private startLoop(): void {
    const draw = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= p.decay;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        // Main particle
        this.ctx.globalAlpha = p.life;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();

        // Glow effect
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * p.life * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.life * 0.2;
        this.ctx.fill();
      }

      this.ctx.globalAlpha = 1;
      this.animFrameId = requestAnimationFrame(draw);
    };

    this.animFrameId = requestAnimationFrame(draw);
  }

  /** Stop the render loop */
  destroy(): void {
    cancelAnimationFrame(this.animFrameId);
  }
}
