// ─────────────────────────────────────────────
// Game Constants & Configuration
// ─────────────────────────────────────────────

export const ROWS = 8;
export const COLS = 8;
export const TYPES = 7;
export const MAX_MOVES = 30;

export const SYMBOLS = ['♦', '●', '▲', '★', '◆', '✦', '♥'] as const;

export interface GemConfig {
  readonly name: string;
  readonly symbol: string;
  readonly gradient: string;
  readonly shadow: string;
  readonly particleColors: readonly string[];
  readonly innerGlow: string;
}

export const GEM_CONFIGS: readonly GemConfig[] = [
  {
    name: 'Ruby',
    symbol: '♦',
    gradient: 'radial-gradient(circle at 35% 35%, #ff4d6d, #c9184a 60%, #800020)',
    shadow: '0 0 14px rgba(255,77,109,.6), inset 0 -4px 8px rgba(0,0,0,.3)',
    particleColors: ['#ff4d6d', '#ff8fa3', '#ffccd5'],
    innerGlow: 'radial-gradient(ellipse at 40% 40%, rgba(255,200,200,.3) 0%, transparent 60%)',
  },
  {
    name: 'Emerald',
    symbol: '●',
    gradient: 'radial-gradient(circle at 35% 35%, #40e87b, #1ea651 60%, #0a5c2e)',
    shadow: '0 0 14px rgba(64,232,123,.6), inset 0 -4px 8px rgba(0,0,0,.3)',
    particleColors: ['#40e87b', '#80ffaa', '#b8ffd0'],
    innerGlow: 'radial-gradient(ellipse at 40% 40%, rgba(200,255,220,.3) 0%, transparent 60%)',
  },
  {
    name: 'Sapphire',
    symbol: '▲',
    gradient: 'radial-gradient(circle at 35% 35%, #5fa8ff, #2563eb 60%, #1333a0)',
    shadow: '0 0 14px rgba(95,168,255,.6), inset 0 -4px 8px rgba(0,0,0,.3)',
    particleColors: ['#5fa8ff', '#8ec5ff', '#c0ddff'],
    innerGlow: 'radial-gradient(ellipse at 40% 40%, rgba(200,220,255,.3) 0%, transparent 60%)',
  },
  {
    name: 'Topaz',
    symbol: '★',
    gradient: 'radial-gradient(circle at 35% 35%, #ffe066, #f5a623 60%, #b06c00)',
    shadow: '0 0 14px rgba(255,224,102,.6), inset 0 -4px 8px rgba(0,0,0,.3)',
    particleColors: ['#ffe066', '#fff0a0', '#fff8d0'],
    innerGlow: 'radial-gradient(ellipse at 40% 40%, rgba(255,250,200,.3) 0%, transparent 60%)',
  },
  {
    name: 'Amethyst',
    symbol: '◆',
    gradient: 'radial-gradient(circle at 35% 35%, #c77dff, #9d4edd 60%, #5a189a)',
    shadow: '0 0 14px rgba(199,125,255,.6), inset 0 -4px 8px rgba(0,0,0,.3)',
    particleColors: ['#c77dff', '#ddb4ff', '#eeddff'],
    innerGlow: 'radial-gradient(ellipse at 40% 40%, rgba(240,210,255,.3) 0%, transparent 60%)',
  },
  {
    name: 'Diamond',
    symbol: '✦',
    gradient: 'radial-gradient(circle at 35% 35%, #e0f7ff, #80d8ff 60%, #29b6f6)',
    shadow: '0 0 14px rgba(128,216,255,.7), inset 0 -4px 8px rgba(0,0,0,.2)',
    particleColors: ['#80d8ff', '#b0eaff', '#d6f5ff'],
    innerGlow: 'radial-gradient(ellipse at 40% 40%, rgba(230,250,255,.5) 0%, transparent 60%)',
  },
  {
    name: 'Citrine',
    symbol: '♥',
    gradient: 'radial-gradient(circle at 35% 35%, #ff9a76, #ff6b3d 60%, #c43e00)',
    shadow: '0 0 14px rgba(255,154,118,.6), inset 0 -4px 8px rgba(0,0,0,.3)',
    particleColors: ['#ff9a76', '#ffbfa0', '#ffddd0'],
    innerGlow: 'radial-gradient(ellipse at 40% 40%, rgba(255,230,210,.3) 0%, transparent 60%)',
  },
] as const;

/** Timing constants (ms) */
export const TIMING = {
  SWAP: 200,
  MATCH_POP: 260,
  GRAVITY_DROP: 300,
  GEM_APPEAR: 300,
  COMBO_BANNER: 1000,
  FLOAT_SCORE: 800,
  HINT_DURATION: 3000,
  AUTO_HINT_DELAY: 8000,
  GAME_OVER_DELAY: 500,
} as const;

/** Combo banner texts */
export const COMBO_TEXTS = [
  '',
  '',
  'Double Combo! 🔥',
  'Triple Combo! 💥',
  'MEGA Combo! ⚡',
  'UNBELIEVABLE! 🌟',
  'INSANITY! 💎',
] as const;
