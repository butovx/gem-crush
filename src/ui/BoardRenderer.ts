// ─────────────────────────────────────────────
// Board Renderer — High-performance persistent DOM grid
// ─────────────────────────────────────────────

import { ROWS, COLS, GEM_CONFIGS } from '../core/constants';
import type { Board } from '../core/Board';

interface CellRecord {
  cell: HTMLElement;
  gem: HTMLElement;
  sym: HTMLElement;
  type: number;
}

type PointerDownFn = (row: number, col: number, e: PointerEvent) => void;
type PointerEnterFn = (row: number, col: number, e: PointerEvent) => void;

/**
 * Renders the game board as a persistent grid of DOM elements.
 * Cell elements are created once and updated in-place to eliminate
 * layout thrashing and garbage collection pauses.
 */
export class BoardRenderer {
  private boardEl: HTMLElement;
  private cells: CellRecord[] = [];
  private onPointerDown?: PointerDownFn;
  private onPointerEnter?: PointerEnterFn;

  constructor(boardEl: HTMLElement) {
    this.boardEl = boardEl;
  }

  /**
   * Initializes the persistent DOM grid once.
   */
  initGrid(onPointerDown?: PointerDownFn, onPointerEnter?: PointerEnterFn): void {
    if (onPointerDown) this.onPointerDown = onPointerDown;
    if (onPointerEnter) this.onPointerEnter = onPointerEnter;

    // If already initialized, do not rebuild DOM
    if (this.cells.length === ROWS * COLS) {
      return;
    }

    this.boardEl.innerHTML = '';
    this.cells = [];

    const fragment = document.createDocumentFragment();

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell empty';
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);

        const gem = document.createElement('div');
        gem.className = 'gem';

        const sym = document.createElement('span');
        sym.className = 'sym';
        gem.appendChild(sym);
        cell.appendChild(gem);

        cell.addEventListener('pointerdown', (e) => {
          this.onPointerDown?.(r, c, e);
        });
        cell.addEventListener('pointerenter', (e) => {
          this.onPointerEnter?.(r, c, e);
        });

        fragment.appendChild(cell);
        this.cells.push({ cell, gem, sym, type: -1 });
      }
    }

    this.boardEl.appendChild(fragment);
  }

  /**
   * Updates existing DOM elements in-place from board state.
   */
  render(
    board: Board,
    onPointerDown?: PointerDownFn,
    onPointerEnter?: PointerEnterFn,
  ): void {
    if (this.cells.length !== ROWS * COLS) {
      this.initGrid(onPointerDown, onPointerEnter);
    } else {
      if (onPointerDown) this.onPointerDown = onPointerDown;
      if (onPointerEnter) this.onPointerEnter = onPointerEnter;
    }

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        const record = this.cells[idx];
        const newType = board.getType(r, c);

        if (record.type === newType) continue;

        record.type = newType;

        if (newType < 0) {
          record.cell.classList.add('empty');
          record.gem.className = 'gem';
          record.sym.textContent = '';
        } else {
          record.cell.classList.remove('empty');
          record.gem.className = `gem gem-${newType}`;
          const config = GEM_CONFIGS[newType];
          record.sym.textContent = config ? config.symbol : '';
        }
      }
    }
  }

  /** Get a cell element by (row, col) */
  getCell(row: number, col: number): HTMLElement | null {
    const idx = row * COLS + col;
    return this.cells[idx]?.cell ?? (this.boardEl.children[idx] as HTMLElement | null);
  }
}
