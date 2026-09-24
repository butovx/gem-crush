// ─────────────────────────────────────────────
// Gem Crystals — Authentic Faceted Gemstone SVGs
// ─────────────────────────────────────────────

/**
 * Shared SVG definitions containing high-fidelity gradients for each crystal type.
 * Injected once into document.body to ensure zero ID duplication and optimal GPU caching.
 */
export const GEM_DEFS_SVG = `
<svg id="gem-crystal-defs" style="position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;" aria-hidden="true">
  <defs>
    <!-- 0: Ruby Gradients -->
    <radialGradient id="ruby-body" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ff758f"/>
      <stop offset="45%" stop-color="#d00036"/>
      <stop offset="85%" stop-color="#7a001c"/>
      <stop offset="100%" stop-color="#3d000e"/>
    </radialGradient>
    <linearGradient id="ruby-table" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="#ff4d6d"/>
      <stop offset="100%" stop-color="#9e0023"/>
    </linearGradient>

    <!-- 1: Emerald Gradients -->
    <radialGradient id="emerald-body" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#69f0ae"/>
      <stop offset="45%" stop-color="#00c853"/>
      <stop offset="85%" stop-color="#005722"/>
      <stop offset="100%" stop-color="#002b11"/>
    </radialGradient>
    <linearGradient id="emerald-table" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00e676"/>
      <stop offset="100%" stop-color="#00702c"/>
    </linearGradient>

    <!-- 2: Sapphire Gradients -->
    <radialGradient id="sapphire-body" cx="45%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#82b1ff"/>
      <stop offset="40%" stop-color="#1e69ff"/>
      <stop offset="80%" stop-color="#0d3ca8"/>
      <stop offset="100%" stop-color="#021442"/>
    </radialGradient>
    <linearGradient id="sapphire-table" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="#448aff"/>
      <stop offset="100%" stop-color="#092f8a"/>
    </linearGradient>

    <!-- 3: Topaz Gradients -->
    <radialGradient id="topaz-body" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fff59d"/>
      <stop offset="40%" stop-color="#ffb300"/>
      <stop offset="80%" stop-color="#d84315"/>
      <stop offset="100%" stop-color="#5d1a00"/>
    </radialGradient>
    <linearGradient id="topaz-table" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="#ffd54f"/>
      <stop offset="100%" stop-color="#f57f17"/>
    </linearGradient>

    <!-- 4: Amethyst Gradients -->
    <radialGradient id="amethyst-body" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#f3b5ff"/>
      <stop offset="40%" stop-color="#ab47bc"/>
      <stop offset="80%" stop-color="#5e1487"/>
      <stop offset="100%" stop-color="#2a0342"/>
    </radialGradient>
    <linearGradient id="amethyst-table" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="#ce93d8"/>
      <stop offset="100%" stop-color="#7b1fa2"/>
    </linearGradient>

    <!-- 5: Diamond Gradients -->
    <radialGradient id="diamond-body" cx="45%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#b3e5fc"/>
      <stop offset="75%" stop-color="#0288d1"/>
      <stop offset="100%" stop-color="#01366b"/>
    </radialGradient>
    <linearGradient id="diamond-table" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#81d4fa"/>
    </linearGradient>

    <!-- 6: Citrine Gradients -->
    <radialGradient id="citrine-body" cx="45%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#ffe082"/>
      <stop offset="35%" stop-color="#ff9100"/>
      <stop offset="75%" stop-color="#e64a19"/>
      <stop offset="100%" stop-color="#550d00"/>
    </radialGradient>
    <linearGradient id="citrine-table" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#ffb74d"/>
      <stop offset="100%" stop-color="#f57c00"/>
    </linearGradient>
  </defs>
</svg>
`.trim();

/**
 * 7 distinct handcrafted vector crystal SVGs.
 * Each type has a unique geometric silhouette, cut facets, edge reflections, and sparkle glint.
 */
export const GEM_CRYSTAL_SVGS: readonly string[] = [
  // 0: Ruby — Faceted Octagonal Cushion
  `<svg viewBox="0 0 100 100" class="gem-svg gem-svg-0" xmlns="http://www.w3.org/2000/svg">
    <polygon points="30,6 70,6 94,30 94,70 70,94 30,94 6,70 6,30" fill="url(#ruby-body)"/>
    <polygon points="30,6 70,6 63,23 37,23" fill="#ff4d6d" opacity="0.95"/>
    <polygon points="70,6 94,30 77,37 63,23" fill="#d00036" opacity="0.9"/>
    <polygon points="94,30 94,70 77,63 77,37" fill="#9e0023" opacity="0.9"/>
    <polygon points="94,70 70,94 63,77 77,63" fill="#6a0018" opacity="0.95"/>
    <polygon points="70,94 30,94 37,77 63,77" fill="#4d0011" opacity="0.98"/>
    <polygon points="30,94 6,70 23,63 37,77" fill="#78001c" opacity="0.95"/>
    <polygon points="6,70 6,30 23,37 23,63" fill="#c4002f" opacity="0.9"/>
    <polygon points="6,30 30,6 37,23 23,37" fill="#ff758f" opacity="0.98"/>
    <polygon points="37,23 63,23 77,37 77,63 63,77 37,77 23,63 23,37" fill="url(#ruby-table)" stroke="rgba(255,255,255,0.6)" stroke-width="1.4" stroke-linejoin="round"/>
    <line x1="37" y1="23" x2="30" y2="6" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>
    <line x1="63" y1="23" x2="70" y2="6" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
    <line x1="77" y1="37" x2="94" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
    <line x1="77" y1="63" x2="94" y2="70" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/>
    <line x1="63" y1="77" x2="70" y2="94" stroke="rgba(0,0,0,0.4)" stroke-width="1.2"/>
    <line x1="37" y1="77" x2="30" y2="94" stroke="rgba(0,0,0,0.4)" stroke-width="1.2"/>
    <line x1="23" y1="63" x2="6" y2="70" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/>
    <line x1="23" y1="37" x2="6" y2="30" stroke="rgba(255,255,255,0.7)" stroke-width="1.2"/>
    <polygon points="30,12 32,19 39,21 32,23 30,30 28,23 21,21 28,19" fill="#ffffff" opacity="0.95"/>
    <circle cx="30" cy="21" r="2.8" fill="#ffffff" opacity="1"/>
  </svg>`,

  // 1: Emerald — Stepped Emerald Cut (Cut-Corner Rectangle)
  `<svg viewBox="0 0 100 100" class="gem-svg gem-svg-1" xmlns="http://www.w3.org/2000/svg">
    <polygon points="26,8 74,8 92,26 92,74 74,92 26,92 8,74 8,26" fill="url(#emerald-body)"/>
    <polygon points="26,8 74,8 68,20 32,20" fill="#3df58b" opacity="0.95"/>
    <polygon points="74,8 92,26 80,32 68,20" fill="#00d659" opacity="0.9"/>
    <polygon points="92,26 92,74 80,68 80,32" fill="#008a38" opacity="0.9"/>
    <polygon points="92,74 74,92 68,80 80,68" fill="#00471c" opacity="0.95"/>
    <polygon points="74,92 26,92 32,80 68,80" fill="#003314" opacity="0.98"/>
    <polygon points="26,92 8,74 20,68 32,80" fill="#005c24" opacity="0.95"/>
    <polygon points="8,74 8,26 20,32 20,68" fill="#00b047" opacity="0.85"/>
    <polygon points="8,26 26,8 32,20 20,32" fill="#66ffa6" opacity="0.98"/>
    <polygon points="32,20 68,20 62,30 38,30" fill="#20e671" opacity="0.8"/>
    <polygon points="68,20 80,32 70,38 62,30" fill="#00b848" opacity="0.7"/>
    <polygon points="80,32 80,68 70,62 70,38" fill="#00702c" opacity="0.8"/>
    <polygon points="80,68 68,80 62,70 70,62" fill="#003816" opacity="0.85"/>
    <polygon points="68,80 32,80 38,70 62,70" fill="#002b11" opacity="0.9"/>
    <polygon points="32,80 20,68 30,62 38,70" fill="#00471c" opacity="0.85"/>
    <polygon points="20,68 20,32 30,38 30,62" fill="#00943a" opacity="0.75"/>
    <polygon points="20,32 32,20 38,30 30,38" fill="#4aff94" opacity="0.9"/>
    <polygon points="38,30 62,30 70,38 70,62 62,70 38,70 30,62 30,38" fill="url(#emerald-table)" stroke="rgba(255,255,255,0.6)" stroke-width="1.4" stroke-linejoin="round"/>
    <line x1="26" y1="8" x2="38" y2="30" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>
    <line x1="74" y1="8" x2="62" y2="30" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
    <line x1="92" y1="26" x2="70" y2="38" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
    <line x1="8" y1="26" x2="30" y2="38" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>
    <rect x="36" y="12" width="28" height="4" rx="2" fill="#ffffff" opacity="0.85"/>
    <circle cx="26" cy="22" r="3" fill="#ffffff" opacity="0.95"/>
  </svg>`,

  // 2: Sapphire — Pear / Teardrop Brilliant
  `<svg viewBox="0 0 100 100" class="gem-svg gem-svg-2" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50,6 C 66,22 92,48 92,68 C 92,84 73,94 50,94 C 27,94 8,84 8,68 C 8,48 34,22 50,6 Z" fill="url(#sapphire-body)"/>
    <polygon points="50,6 64,28 50,34 36,28" fill="#8ec4ff" opacity="0.95"/>
    <polygon points="50,6 36,28 14,48 24,34" fill="#68abff" opacity="0.9"/>
    <polygon points="50,6 64,28 86,48 76,34" fill="#1e66e6" opacity="0.8"/>
    <polygon points="14,48 8,68 24,70 30,50" fill="#1353cc" opacity="0.85"/>
    <polygon points="86,48 92,68 76,70 70,50" fill="#092f8a" opacity="0.9"/>
    <polygon points="8,68 28,90 40,80 24,70" fill="#0c3ba3" opacity="0.9"/>
    <polygon points="92,68 72,90 60,80 76,70" fill="#051c57" opacity="0.95"/>
    <polygon points="28,90 50,94 72,90 60,80 50,84 40,80" fill="#031442" opacity="0.98"/>
    <polygon points="50,34 68,48 64,74 50,84 36,74 32,48" fill="url(#sapphire-table)" stroke="rgba(255,255,255,0.6)" stroke-width="1.4" stroke-linejoin="round"/>
    <line x1="50" y1="34" x2="50" y2="84" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
    <line x1="32" y1="48" x2="68" y2="48" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
    <polygon points="40,16 43,24 51,26 43,28 40,36 37,28 29,26 37,24" fill="#ffffff" opacity="0.98"/>
    <circle cx="40" cy="26" r="2.8" fill="#ffffff" opacity="1"/>
  </svg>`,

  // 3: Topaz — Radiant Cushion Star Cut
  `<svg viewBox="0 0 100 100" class="gem-svg gem-svg-3" xmlns="http://www.w3.org/2000/svg">
    <polygon points="24,8 76,8 92,24 92,76 76,92 24,92 8,76 8,24" fill="url(#topaz-body)"/>
    <polygon points="24,8 50,20 76,8 50,8" fill="#fff59d" opacity="0.95"/>
    <polygon points="76,8 92,24 80,50 76,26" fill="#ffca28" opacity="0.85"/>
    <polygon points="92,24 92,76 80,50" fill="#ff8f00" opacity="0.9"/>
    <polygon points="92,76 76,92 50,80 76,74" fill="#c43e00" opacity="0.95"/>
    <polygon points="76,92 24,92 50,80 50,92" fill="#7a2200" opacity="0.98"/>
    <polygon points="24,92 8,76 20,50 24,74" fill="#b23500" opacity="0.95"/>
    <polygon points="8,76 8,24 20,50" fill="#ffa000" opacity="0.85"/>
    <polygon points="8,24 24,8 50,20 24,26" fill="#ffe082" opacity="0.98"/>
    <polygon points="50,20 80,50 50,80 20,50" fill="url(#topaz-table)" stroke="rgba(255,255,255,0.7)" stroke-width="1.4" stroke-linejoin="round"/>
    <line x1="50" y1="20" x2="50" y2="80" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
    <line x1="20" y1="50" x2="80" y2="50" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
    <polygon points="50,34 66,50 50,66 34,50" fill="#fff9c4" opacity="0.5"/>
    <polygon points="32,18 35,25 42,27 35,29 32,36 29,29 22,27 29,25" fill="#ffffff" opacity="0.98"/>
    <circle cx="32" cy="27" r="2.8" fill="#ffffff" opacity="1"/>
  </svg>`,

  // 4: Amethyst — Hexagonal Crystal Shard
  `<svg viewBox="0 0 100 100" class="gem-svg gem-svg-4" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="url(#amethyst-body)"/>
    <polygon points="50,6 88,28 66,38 50,24" fill="#ba68c8" opacity="0.85"/>
    <polygon points="50,6 50,24 34,38 12,28" fill="#f3b5ff" opacity="0.98"/>
    <polygon points="12,28 34,38 34,66 12,72" fill="#d070e6" opacity="0.9"/>
    <polygon points="88,28 88,72 66,66 66,38" fill="#5e1487" opacity="0.92"/>
    <polygon points="12,72 34,66 50,76 50,94" fill="#4a0d6d" opacity="0.95"/>
    <polygon points="88,72 66,66 50,76 50,94" fill="#2a0342" opacity="0.98"/>
    <polygon points="50,24 66,38 66,66 50,76 34,66 34,38" fill="url(#amethyst-table)" stroke="rgba(255,255,255,0.6)" stroke-width="1.4" stroke-linejoin="round"/>
    <line x1="50" y1="6" x2="50" y2="94" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
    <polygon points="32,20 34,26 40,28 34,30 32,36 30,30 24,28 30,26" fill="#ffffff" opacity="0.98"/>
    <circle cx="32" cy="28" r="2.8" fill="#ffffff" opacity="1"/>
  </svg>`,

  // 5: Diamond — Brilliant Diamond Cut
  `<svg viewBox="0 0 100 100" class="gem-svg gem-svg-5" xmlns="http://www.w3.org/2000/svg">
    <polygon points="24,14 76,14 92,36 50,94 8,36" fill="url(#diamond-body)"/>
    <polygon points="24,14 76,14 66,24 34,24" fill="#ffffff" opacity="0.98"/>
    <polygon points="24,14 34,24 20,36 8,36" fill="#e1f5fe" opacity="0.95"/>
    <polygon points="76,14 92,36 80,36 66,24" fill="#81d4fa" opacity="0.85"/>
    <polygon points="34,24 66,24 50,36" fill="url(#diamond-table)" stroke="rgba(255,255,255,0.8)" stroke-width="1.3"/>
    <polygon points="34,24 50,36 20,36" fill="#b3e5fc" opacity="0.92"/>
    <polygon points="66,24 80,36 50,36" fill="#4fc3f7" opacity="0.85"/>
    <line x1="8" y1="36" x2="92" y2="36" stroke="rgba(255,255,255,0.85)" stroke-width="1.6"/>
    <polygon points="8,36 20,36 50,94" fill="#29b6f6" opacity="0.9"/>
    <polygon points="20,36 38,36 50,94" fill="#e1f5fe" opacity="0.98"/>
    <polygon points="38,36 62,36 50,94" fill="#4fc3f7" opacity="0.9"/>
    <polygon points="62,36 80,36 50,94" fill="#0288d1" opacity="0.9"/>
    <polygon points="80,36 92,36 50,94" fill="#01579b" opacity="0.96"/>
    <line x1="20" y1="36" x2="50" y2="94" stroke="rgba(255,255,255,0.7)" stroke-width="1.2"/>
    <line x1="38" y1="36" x2="50" y2="94" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>
    <line x1="62" y1="36" x2="50" y2="94" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
    <line x1="80" y1="36" x2="50" y2="94" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
    <polygon points="26,6 29,18 41,21 29,24 26,36 23,24 11,21 23,18" fill="#ffffff" opacity="1"/>
    <circle cx="26" cy="21" r="3.2" fill="#ffffff" opacity="1"/>
  </svg>`,

  // 6: Citrine — Trilliant Triangle Cut
  `<svg viewBox="0 0 100 100" class="gem-svg gem-svg-6" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,8 92,82 86,90 14,90 8,82" fill="url(#citrine-body)"/>
    <polygon points="50,8 92,82 68,68 50,34" fill="#ff9e40" opacity="0.85"/>
    <polygon points="92,82 86,90 14,90 8,82 32,68 68,68" fill="#bf360c" opacity="0.96"/>
    <polygon points="8,82 50,8 50,34 32,68" fill="#ffc046" opacity="0.98"/>
    <polygon points="50,34 68,68 32,68" fill="url(#citrine-table)" stroke="rgba(255,255,255,0.65)" stroke-width="1.4" stroke-linejoin="round"/>
    <polygon points="50,34 50,56 32,68" fill="#ffe082" opacity="0.6"/>
    <polygon points="50,34 68,68 50,56" fill="#ff8f00" opacity="0.45"/>
    <line x1="50" y1="8" x2="50" y2="34" stroke="rgba(255,255,255,0.7)" stroke-width="1.2"/>
    <line x1="8" y1="82" x2="32" y2="68" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
    <line x1="92" y1="82" x2="68" y2="68" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/>
    <polygon points="42,16 45,23 52,25 45,27 42,34 39,27 32,25 39,23" fill="#ffffff" opacity="0.98"/>
    <circle cx="42" cy="25" r="2.8" fill="#ffffff" opacity="1"/>
  </svg>`,
] as const;

/**
 * Ensures the shared SVG gradient definitions are inserted into document.body.
 */
export function ensureGemDefs(): void {
  if (typeof document === 'undefined') return;
  if (!document.getElementById('gem-crystal-defs')) {
    const container = document.createElement('div');
    container.innerHTML = GEM_DEFS_SVG;
    const defsEl = container.firstElementChild;
    if (defsEl) {
      document.body.insertBefore(defsEl, document.body.firstChild);
    }
  }
}
