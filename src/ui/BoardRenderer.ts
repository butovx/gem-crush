// ─────────────────────────────────────────────
// Board Renderer — DOM-based board rendering
// ─────────────────────────────────────────────

import { ROWS, COLS, GEM_CONFIGS } from '../core/constants';
import type { Board } from '../core/Board';

/**
 * Renders the game board as a grid of DOM elements.
 * Each cell contains a styled gem div with type-specific
 * gradients, shadows, and a symbol icon.
 */
export class BoardRenderer {
  private boardEl: HTMLElement;

  constructor(boardEl: HTMLElement) {
    this.boardEl = boardEl;
  }

  /**
   * Full re-render of the board from grid state.
   * @param board - Board instance to read gem types from
   * @param onPointerDown - Cell click/tap handler
   * @param onPointerEnter - Cell drag-enter handler
   */
  render(
    board: Board,
    onPointerDown: (row: number, col: number, e: PointerEvent) => void,
    onPointerEnter: (row: number, col: number, e: PointerEvent) => void,
  ): void {
    this.boardEl.innerHTML = '';

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);

        const type = board.getType(r, c);
        if (type >= 0) {
          const gem = this.createGemElement(type);
          cell.appendChild(gem);
        }

        cell.addEventListener('pointerdown', (e) => onPointerDown(r, c, e));
        cell.addEventListener('pointerenter', (e) => onPointerEnter(r, c, e));
        this.boardEl.appendChild(cell);
      }
    }
  }

  /** Create a gem DOM element with type-specific styling */
  private createGemElement(type: number): HTMLElement {
    const config = GEM_CONFIGS[type];
    const gem = document.createElement('div');
    gem.className = `gem gem-${type}`;

    const sym = document.createElement('span');
    sym.className = 'sym';
    sym.textContent = config.symbol;
    gem.appendChild(sym);

    return gem;
  }

  /** Get a cell element by (row, col) */
  getCell(row: number, col: number): HTMLElement | null {
    return this.boardEl.children[row * COLS + col] as HTMLElement | null;
  }
}
