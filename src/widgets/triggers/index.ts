// src/app-config/widgets/triggers/index.ts

export type {
  TriggerType,
  TriggerOperator,
  TriggerConfig,
  TriggerRule,
  TriggerFiredEvent,
  TriggerCallback,
} from './trigger.types';

export { TriggerEngine, triggerEngine } from './triggerEngine';
export { TriggerConfig as TriggerConfigPanel } from './TriggerConfig';
