// ─────────────────────────────────────────────
// Telegram Mini App (TMA) Integration Service
// ─────────────────────────────────────────────

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebAppType {
  ready(): void;
  expand(): void;
  close(): void;
  enableClosingConfirmation(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  HapticFeedback?: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebAppType;
    };
  }
}

/**
 * Service to manage Telegram Mini App integration,
 * window expansion, theme colors, and native haptic feedback.
 */
export class TelegramService {
  private webApp: TelegramWebAppType | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      this.init();
    }
  }

  private init(): void {
    if (!this.webApp) return;

    try {
      this.webApp.ready();
      this.webApp.expand();
      this.webApp.enableClosingConfirmation();
      this.webApp.setHeaderColor('#0a0614');
      this.webApp.setBackgroundColor('#0a0614');
    } catch {
      // Safe fallback if called in non-TMA browser preview
    }
  }

  /** Whether the game is running inside Telegram Mini App */
  get isTelegram(): boolean {
    return Boolean(this.webApp?.initDataUnsafe);
  }

  /** Current Telegram user if available */
  get user(): TelegramUser | null {
    return this.webApp?.initDataUnsafe?.user ?? null;
  }

  /** Trigger impact haptic feedback */
  hapticImpact(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium'): void {
    if (this.webApp?.HapticFeedback) {
      try {
        this.webApp.HapticFeedback.impactOccurred(style);
        return;
      } catch {
        // Fallback below
      }
    }

    // Fallback to standard Vibration API
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const duration = style === 'light' ? 12 : style === 'medium' ? 22 : 35;
      navigator.vibrate(duration);
    }
  }

  /** Trigger notification haptic feedback (success, error, warning) */
  hapticNotification(type: 'error' | 'success' | 'warning'): void {
    if (this.webApp?.HapticFeedback) {
      try {
        this.webApp.HapticFeedback.notificationOccurred(type);
        return;
      } catch {
        // Fallback below
      }
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'success') {
        navigator.vibrate([18, 50, 30]);
      } else if (type === 'error') {
        navigator.vibrate([40, 40, 40]);
      } else {
        navigator.vibrate(25);
      }
    }
  }

  /** Trigger subtle selection haptic */
  hapticSelection(): void {
    if (this.webApp?.HapticFeedback) {
      try {
        this.webApp.HapticFeedback.selectionChanged();
        return;
      } catch {
        // Fallback below
      }
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }
}
