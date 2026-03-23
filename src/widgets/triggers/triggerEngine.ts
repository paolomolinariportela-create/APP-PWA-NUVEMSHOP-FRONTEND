// ─────────────────────────────────────────────
//  triggerEngine.ts
//  src/app-config/widgets/triggers/triggerEngine.ts
// ─────────────────────────────────────────────

import type {
  TriggerRule,
  TriggerConfig,
  TriggerCallback,
  TriggerFiredEvent,
  TriggerType,
  ExitIntentTrigger,
} from './trigger.types';

// ── Constantes ───────────────────────────────────

const SESSION_KEY = 'trigger_fires';

const EXIT_SENSITIVITY: Record<NonNullable<ExitIntentTrigger['sensitivity']>, number> = {
  low: 5,
  medium: 15,
  high: 30,
};

// ── Helpers de sessão ────────────────────────────

function getSessionFires(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
  } catch {
    return {};
  }
}

function incrementSessionFire(ruleId: string): number {
  const fires = getSessionFires();
  fires[ruleId] = (fires[ruleId] || 0) + 1;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(fires));
  return fires[ruleId];
}

// ── Engine principal ─────────────────────────────

export class TriggerEngine {
  private rules: TriggerRule[] = [];
  private callbacks: Map<string, TriggerCallback[]> = new Map();

  /** Flags internas: quais triggers já foram satisfeitos por ruleId */
  private satisfied: Map<string, Set<TriggerType>> = new Map();

  /** Limpeza: funções para remover event listeners */
  private cleanups: Array<() => void> = [];

  // ── API pública ───────────────────────────────

  /** Registra as regras e começa a observar */
  init(rules: TriggerRule[]) {
    this.destroy(); // limpa runs anteriores
    this.rules = rules.filter((r) => r.enabled);
    this.rules.forEach((rule) => {
      this.satisfied.set(rule.id, new Set());
    });
    this.attachListeners();
  }

  /** Escuta disparos de uma regra específica */
  on(ruleId: string, cb: TriggerCallback) {
    if (!this.callbacks.has(ruleId)) this.callbacks.set(ruleId, []);
    this.callbacks.get(ruleId)!.push(cb);
  }

  /** Remove todos os listeners e limpa timers */
  destroy() {
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
    this.satisfied.clear();
  }

  // ── Verificação de disparo ────────────────────

  private markSatisfied(ruleId: string, triggerType: TriggerType) {
    const set = this.satisfied.get(ruleId);
    if (!set) return;
    set.add(triggerType);
    this.evaluateRule(ruleId, triggerType);
  }

  private evaluateRule(ruleId: string, firedBy: TriggerType) {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule) return;

    const sat = this.satisfied.get(ruleId)!;
    const types = rule.triggers.map((t) => t.type);

    const shouldFire =
      rule.operator === 'OR'
        ? types.some((t) => sat.has(t))
        : types.every((t) => sat.has(t));

    if (!shouldFire) return;

    // Verificar limite por sessão
    const max = rule.maxFiresPerSession ?? 1;
    if (max > 0) {
      const fires = getSessionFires();
      if ((fires[ruleId] || 0) >= max) return;
      incrementSessionFire(ruleId);
    }

    const event: TriggerFiredEvent = {
      ruleId,
      triggeredBy: firedBy,
      timestamp: Date.now(),
    };

    const cbs = this.callbacks.get(ruleId) || [];
    cbs.forEach((cb) => cb(event));
  }

  // ── Montagem dos listeners ────────────────────

  private attachListeners() {
    this.rules.forEach((rule) => {
      rule.triggers.forEach((trigger) => {
        switch (trigger.type) {
          case 'on_load':
            this.attachOnLoad(rule.id, trigger.delayMs ?? 0);
            break;
          case 'time_on_page':
            this.attachTimeOnPage(rule.id, trigger.seconds);
            break;
          case 'scroll_depth':
            this.attachScrollDepth(rule.id, trigger.percent);
            break;
          case 'exit_intent':
            this.attachExitIntent(rule.id, trigger.sensitivity ?? 'medium');
            break;
          case 'page_views':
            this.attachPageViews(rule.id, trigger.count);
            break;
          case 'inactivity':
            this.attachInactivity(rule.id, trigger.seconds);
            break;
        }
      });
    });
  }

  // ── Implementações individuais ────────────────

  private attachOnLoad(ruleId: string, delayMs: number) {
    const timer = window.setTimeout(() => {
      this.markSatisfied(ruleId, 'on_load');
    }, delayMs);
    this.cleanups.push(() => clearTimeout(timer));
  }

  private attachTimeOnPage(ruleId: string, seconds: number) {
    const timer = window.setTimeout(() => {
      this.markSatisfied(ruleId, 'time_on_page');
    }, seconds * 1000);
    this.cleanups.push(() => clearTimeout(timer));
  }

  private attachScrollDepth(ruleId: string, percent: number) {
    let fired = false;
    const handler = () => {
      if (fired) return;
      const scrolled =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrolled >= percent) {
        fired = true;
        this.markSatisfied(ruleId, 'scroll_depth');
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    this.cleanups.push(() => window.removeEventListener('scroll', handler));
  }

  private attachExitIntent(
    ruleId: string,
    sensitivity: NonNullable<ExitIntentTrigger['sensitivity']>
  ) {
    const threshold = EXIT_SENSITIVITY[sensitivity];
    let fired = false;
    const handler = (e: MouseEvent) => {
      if (fired || e.clientY > threshold) return;
      fired = true;
      this.markSatisfied(ruleId, 'exit_intent');
    };
    document.addEventListener('mousemove', handler);
    this.cleanups.push(() => document.removeEventListener('mousemove', handler));
  }

  private attachPageViews(ruleId: string, count: number) {
    const key = 'trigger_page_views';
    const current = parseInt(sessionStorage.getItem(key) || '1', 10);
    sessionStorage.setItem(key, String(current + 1));
    if (current >= count) {
      // já atingiu — dispara imediatamente
      setTimeout(() => this.markSatisfied(ruleId, 'page_views'), 0);
    }
  }

  private attachInactivity(ruleId: string, seconds: number) {
    let timer: number;
    const reset = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        this.markSatisfied(ruleId, 'inactivity');
      }, seconds * 1000);
    };
    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset(); // inicia o timer
    this.cleanups.push(() => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    });
  }
}

/** Instância singleton — reutilizável em toda a aplicação */
export const triggerEngine = new TriggerEngine();
