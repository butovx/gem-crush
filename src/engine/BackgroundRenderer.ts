// ─────────────────────────────────────────────
// Background Renderer — Starfield & Nebula
// ─────────────────────────────────────────────

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
  pulse: number;
}

/**
 * Renders an animated cosmic background with nebula blobs
 * and twinkling stars on a full-screen canvas.
 */
export class BackgroundRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private width = 0;
  private height = 0;
  private animFrameId = 0;

  private static readonly STAR_COUNT = 120;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.initStars();

    window.addEventListener('resize', () => this.resize());
    this.startLoop();
  }

  private resize(): void {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  private initStars(): void {
    this.stars = [];
    for (let i = 0; i < BackgroundRenderer.STAR_COUNT; i++) {
      this.stars.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        radius: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        alpha: Math.random() * 0.6 + 0.3,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  /** Draw a radial nebula blob */
  private drawNebula(cx: number, cy: number, radius: number, color: string): void {
    const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private startLoop(): void {
    let lastTime = 0;
    const draw = (timestamp: number) => {
      if (timestamp - lastTime < 16) {
        this.animFrameId = requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp;
      const { ctx, width: w, height: h } = this;
      ctx.clearRect(0, 0, w, h);

      // Nebula blobs
      this.drawNebula(w * 0.3, h * 0.4, w * 0.5, 'rgba(90, 24, 154, 0.12)');
      this.drawNebula(w * 0.75, h * 0.6, w * 0.4, 'rgba(199, 125, 255, 0.06)');
      this.drawNebula(w * 0.5, h * 0.8, w * 0.35, 'rgba(255, 111, 216, 0.05)');

      // Stars
      for (const star of this.stars) {
        star.pulse += 0.02;
        const alpha = star.alpha * (0.6 + 0.4 * Math.sin(star.pulse));

        ctx.beginPath();
        ctx.arc(star.x % w, star.y % h, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();

        star.y += star.speed;
        if (star.y > h + 5) {
          star.y = -5;
          star.x = Math.random() * w;
        }
      }

      this.animFrameId = requestAnimationFrame(draw);
    };

    this.animFrameId = requestAnimationFrame(draw);
  }

  /** Stop the render loop */
  destroy(): void {
    cancelAnimationFrame(this.animFrameId);
  }
}
