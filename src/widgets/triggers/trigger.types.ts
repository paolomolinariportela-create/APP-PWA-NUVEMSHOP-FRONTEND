// src/app-config/widgets/triggers/trigger.types.ts

export type TriggerType =
  | 'time_on_page'
  | 'scroll_depth'
  | 'exit_intent'
  | 'page_views'
  | 'inactivity'
  | 'on_load';

export type TriggerOperator = 'AND' | 'OR';

export interface TimeOnPageTrigger {
  type: 'time_on_page';
  seconds: number;
}
export interface ScrollDepthTrigger {
  type: 'scroll_depth';
  percent: number;
}
export interface ExitIntentTrigger {
  type: 'exit_intent';
  sensitivity?: 'low' | 'medium' | 'high';
}
export interface PageViewsTrigger {
  type: 'page_views';
  count: number;
}
export interface InactivityTrigger {
  type: 'inactivity';
  seconds: number;
}
export interface OnLoadTrigger {
  type: 'on_load';
  delayMs?: number;
}

export type TriggerConfig =
  | TimeOnPageTrigger
  | ScrollDepthTrigger
  | ExitIntentTrigger
  | PageViewsTrigger
  | InactivityTrigger
  | OnLoadTrigger;

export interface TriggerRule {
  id: string;
  label?: string;
  operator: TriggerOperator;
  triggers: TriggerConfig[];
  enabled: boolean;
  maxFiresPerSession?: number;
}

export interface TriggerFiredEvent {
  ruleId: string;
  triggeredBy: TriggerType;
  timestamp: number;
}

export type TriggerCallback = (event: TriggerFiredEvent) => void;
