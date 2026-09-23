// ─────────────────────────────────────────────
// Background Renderer — Optimized Starfield & Nebula
// ─────────────────────────────────────────────

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  pulse: number;
}

/**
 * Renders an animated cosmic background with pre-rendered nebula blobs
 * and twinkling stars with minimal GPU fillrate and CPU overhead.
 */
export class BackgroundRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nebulaCanvas: HTMLCanvasElement;
  private nebulaCtx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private width = 0;
  private height = 0;
  private animFrameId = 0;

  private static readonly STAR_COUNT = 70;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.nebulaCanvas = document.createElement('canvas');
    this.nebulaCtx = this.nebulaCanvas.getContext('2d')!;

    this.resize();
    this.initStars();

    window.addEventListener('resize', () => {
      this.resize();
    });

    this.startLoop();
  }

  private resize(): void {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;

    // Pre-render static nebula gradients to offscreen canvas
    this.nebulaCanvas.width = this.width;
    this.nebulaCanvas.height = this.height;
    this.renderNebulaOffscreen();
  }

  /** Pre-renders nebula once when window size changes */
  private renderNebulaOffscreen(): void {
    const { nebulaCtx: ctx, width: w, height: h } = this;
    ctx.fillStyle = '#0a0614';
    ctx.fillRect(0, 0, w, h);

    const drawBlob = (cx: number, cy: number, radius: number, color: string) => {
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    };

    drawBlob(w * 0.3, h * 0.4, w * 0.55, 'rgba(90, 24, 154, 0.16)');
    drawBlob(w * 0.75, h * 0.6, w * 0.45, 'rgba(199, 125, 255, 0.08)');
    drawBlob(w * 0.5, h * 0.85, w * 0.4, 'rgba(255, 111, 216, 0.07)');
  }

  private initStars(): void {
    this.stars = [];
    for (let i = 0; i < BackgroundRenderer.STAR_COUNT; i++) {
      this.stars.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        size: Math.random() * 1.6 + 0.6,
        speed: Math.random() * 0.25 + 0.05,
        alpha: Math.random() * 0.5 + 0.4,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  private startLoop(): void {
    let lastTime = 0;
    const draw = (timestamp: number) => {
      // Throttle to ~60 FPS max if display runs higher, avoiding excess draw calls
      if (timestamp - lastTime < 14) {
        this.animFrameId = requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp;

      const { ctx, width: w, height: h } = this;

      // Fast single-blit background from offscreen pre-rendered nebula
      ctx.drawImage(this.nebulaCanvas, 0, 0);

      // Render stars
      for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        star.pulse += 0.02;
        const currentAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.pulse));

        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha.toFixed(2)})`;
        ctx.fillRect(star.x % w, star.y % h, star.size, star.size);

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
