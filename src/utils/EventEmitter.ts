// ─────────────────────────────────────────────
// Typed Event Emitter
// ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventMap = Record<string, any[]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler<T extends any[]> = (...args: T) => void;

/**
 * Lightweight typed publish/subscribe event system.
 * Provides decoupled communication between game components.
 *
 * @example
 * ```ts
 * interface GameEvents {
 *   scoreChanged: [score: number];
 *   gameOver: [finalScore: number];
 * }
 *
 * const emitter = new EventEmitter<GameEvents>();
 * emitter.on('scoreChanged', (score) => console.log(score));
 * emitter.emit('scoreChanged', 100);
 * ```
 */
export class EventEmitter<T extends EventMap> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners = new Map<keyof T, Set<Handler<any[]>>>();

  /** Subscribe to an event */
  on<K extends keyof T>(event: K, handler: Handler<T[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  /** Unsubscribe from an event */
  off<K extends keyof T>(event: K, handler: Handler<T[K]>): void {
    this.listeners.get(event)?.delete(handler);
  }

  /** Emit an event to all subscribers */
  emit<K extends keyof T>(event: K, ...args: T[K]): void {
    this.listeners.get(event)?.forEach((handler) => {
      handler(...args);
    });
  }

  /** Remove all listeners for an event, or all events if no event specified */
  removeAll(event?: keyof T): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}
