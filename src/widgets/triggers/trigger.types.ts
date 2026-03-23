// ─────────────────────────────────────────────
//  trigger.types.ts
//  src/app-config/widgets/triggers/trigger.types.ts
// ─────────────────────────────────────────────

/** Todos os tipos de gatilho disponíveis */
export type TriggerType =
  | 'time_on_page'      // Tempo em segundos na página
  | 'scroll_depth'      // % de scroll
  | 'exit_intent'       // Mouse saindo pelo topo
  | 'page_views'        // Nº de páginas vistas na sessão
  | 'inactivity'        // Usuário inativo por X segundos
  | 'on_load';          // Dispara imediatamente ao carregar

/** Operadores lógicos para combinar múltiplos triggers */
export type TriggerOperator = 'AND' | 'OR';

// ── Configurações individuais ──────────────────

export interface TimeOnPageTrigger {
  type: 'time_on_page';
  seconds: number; // ex: 10 → dispara após 10s na página
}

export interface ScrollDepthTrigger {
  type: 'scroll_depth';
  percent: number; // 0–100
}

export interface ExitIntentTrigger {
  type: 'exit_intent';
  sensitivity?: 'low' | 'medium' | 'high'; // distância do topo para ativar
}

export interface PageViewsTrigger {
  type: 'page_views';
  count: number; // dispara quando o usuário viu N páginas
}

export interface InactivityTrigger {
  type: 'inactivity';
  seconds: number; // tempo sem interação
}

export interface OnLoadTrigger {
  type: 'on_load';
  delayMs?: number; // atraso opcional em ms
}

/** Union de todas as configurações possíveis */
export type TriggerConfig =
  | TimeOnPageTrigger
  | ScrollDepthTrigger
  | ExitIntentTrigger
  | PageViewsTrigger
  | InactivityTrigger
  | OnLoadTrigger;

// ── Regra completa (pode ter múltiplos triggers) ─

export interface TriggerRule {
  id: string;
  label?: string;          // Nome amigável, ex: "Após 10s ou 50% scroll"
  operator: TriggerOperator;
  triggers: TriggerConfig[];
  enabled: boolean;
  /** Quantas vezes pode disparar por sessão (0 = ilimitado) */
  maxFiresPerSession?: number;
}

// ── Evento emitido quando um trigger dispara ─────

export interface TriggerFiredEvent {
  ruleId: string;
  triggeredBy: TriggerType;
  timestamp: number;
}

/** Callback chamado quando a regra dispara */
export type TriggerCallback = (event: TriggerFiredEvent) => void;
