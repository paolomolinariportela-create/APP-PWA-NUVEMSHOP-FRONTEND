// ─────────────────────────────────────────────
//  TriggerConfig.tsx
//  src/app-config/widgets/triggers/TriggerConfig.tsx
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import type {
  TriggerRule,
  TriggerConfig as TTriggerConfig,
  TriggerType,
  TriggerOperator,
} from './trigger.types';

// ── Tipos internos ────────────────────────────────

interface TriggerConfigProps {
  /** Regra inicial (para edição) ou undefined para criação */
  value?: TriggerRule;
  onChange: (rule: TriggerRule) => void;
}

// ── Metadados de cada tipo de trigger ────────────

const TRIGGER_META: Record<
  TriggerType,
  { label: string; icon: string; description: string }
> = {
  on_load:       { label: 'Ao carregar',      icon: '⚡', description: 'Dispara assim que a página abre' },
  time_on_page:  { label: 'Tempo na página',  icon: '⏱️', description: 'Depois de X segundos' },
  scroll_depth:  { label: 'Profundidade de scroll', icon: '📜', description: 'Quando rolar X% da página' },
  exit_intent:   { label: 'Intenção de saída', icon: '🚪', description: 'Quando o cursor vai sair' },
  page_views:    { label: 'Páginas vistas',   icon: '👁️', description: 'Após visitar N páginas' },
  inactivity:    { label: 'Inatividade',      icon: '💤', description: 'Sem interação por X segundos' },
};

const ALL_TYPES = Object.keys(TRIGGER_META) as TriggerType[];

// ── Helpers ───────────────────────────────────────

function defaultConfig(type: TriggerType): TTriggerConfig {
  switch (type) {
    case 'time_on_page':  return { type, seconds: 10 };
    case 'scroll_depth':  return { type, percent: 50 };
    case 'exit_intent':   return { type, sensitivity: 'medium' };
    case 'page_views':    return { type, count: 3 };
    case 'inactivity':    return { type, seconds: 30 };
    case 'on_load':       return { type, delayMs: 0 };
  }
}

function makeId() {
  return `rule_${Math.random().toString(36).slice(2, 8)}`;
}

const emptyRule = (): TriggerRule => ({
  id: makeId(),
  label: '',
  operator: 'OR',
  triggers: [],
  enabled: true,
  maxFiresPerSession: 1,
});

// ── Estilos inline ────────────────────────────────

const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: '#0F172A',
    color: '#E2E8F0',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '480px',
    boxSizing: 'border-box' as const,
  },
  heading: {
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#94A3B8',
    marginBottom: '16px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  input: {
    background: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#E2E8F0',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  select: {
    background: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '8px 10px',
    color: '#E2E8F0',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  },
  badge: (active: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 11px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${active ? '#6366F1' : '#334155'}`,
    background: active ? '#312E81' : 'transparent',
    color: active ? '#A5B4FC' : '#64748B',
    transition: 'all 0.15s',
  }),
  triggerCard: {
    background: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '10px',
    position: 'relative' as const,
  },
  removeBtn: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    color: '#475569',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1,
  },
  label: {
    fontSize: '11px',
    color: '#64748B',
    marginBottom: '4px',
    fontWeight: 600,
    letterSpacing: '0.05em',
  },
  addBtn: {
    width: '100%',
    background: 'transparent',
    border: '1.5px dashed #334155',
    borderRadius: '10px',
    padding: '10px',
    color: '#475569',
    fontSize: '12px',
    cursor: 'pointer',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  divider: {
    height: '1px',
    background: '#1E293B',
    margin: '18px 0',
  },
  toggle: (on: boolean) => ({
    width: '38px',
    height: '22px',
    borderRadius: '999px',
    background: on ? '#6366F1' : '#334155',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'background 0.2s',
    flexShrink: 0,
  }),
  toggleKnob: (on: boolean) => ({
    position: 'absolute' as const,
    top: '3px',
    left: on ? '18px' : '3px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#fff',
    transition: 'left 0.2s',
  }),
  saveBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    color: '#fff',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    letterSpacing: '0.04em',
    marginTop: '4px',
  },
};

// ── Componente de um trigger individual ──────────

const TriggerItem: React.FC<{
  config: TTriggerConfig;
  onChange: (cfg: TTriggerConfig) => void;
  onRemove: () => void;
}> = ({ config, onChange, onRemove }) => {
  const meta = TRIGGER_META[config.type];

  return (
    <div style={S.triggerCard}>
      <button style={S.removeBtn} onClick={onRemove} title="Remover">✕</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '16px' }}>{meta.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#CBD5E1' }}>{meta.label}</div>
          <div style={{ fontSize: '11px', color: '#475569' }}>{meta.description}</div>
        </div>
      </div>

      {/* Campos específicos por tipo */}
      {config.type === 'time_on_page' && (
        <div>
          <div style={S.label}>Segundos</div>
          <input
            type="number"
            min={1}
            max={300}
            value={config.seconds}
            onChange={(e) => onChange({ ...config, seconds: Number(e.target.value) })}
            style={S.input}
          />
        </div>
      )}

      {config.type === 'scroll_depth' && (
        <div>
          <div style={S.label}>Porcentagem de scroll ({config.percent}%)</div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={config.percent}
            onChange={(e) => onChange({ ...config, percent: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#6366F1' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#475569' }}>
            <span>5%</span><span>100%</span>
          </div>
        </div>
      )}

      {config.type === 'exit_intent' && (
        <div>
          <div style={S.label}>Sensibilidade</div>
          <select
            value={config.sensitivity ?? 'medium'}
            onChange={(e) =>
              onChange({ ...config, sensitivity: e.target.value as 'low' | 'medium' | 'high' })
            }
            style={{ ...S.select, width: '100%' }}
          >
            <option value="low">Baixa — cursor bem no topo</option>
            <option value="medium">Média</option>
            <option value="high">Alta — qualquer movimento para cima</option>
          </select>
        </div>
      )}

      {config.type === 'page_views' && (
        <div>
          <div style={S.label}>Número de páginas</div>
          <input
            type="number"
            min={1}
            max={50}
            value={config.count}
            onChange={(e) => onChange({ ...config, count: Number(e.target.value) })}
            style={S.input}
          />
        </div>
      )}

      {config.type === 'inactivity' && (
        <div>
          <div style={S.label}>Segundos sem interação</div>
          <input
            type="number"
            min={5}
            max={600}
            value={config.seconds}
            onChange={(e) => onChange({ ...config, seconds: Number(e.target.value) })}
            style={S.input}
          />
        </div>
      )}

      {config.type === 'on_load' && (
        <div>
          <div style={S.label}>Atraso (ms)</div>
          <input
            type="number"
            min={0}
            max={10000}
            step={100}
            value={config.delayMs ?? 0}
            onChange={(e) => onChange({ ...config, delayMs: Number(e.target.value) })}
            style={S.input}
          />
        </div>
      )}
    </div>
  );
};

// ── Componente principal ──────────────────────────

export const TriggerConfig: React.FC<TriggerConfigProps> = ({ value, onChange }) => {
  const [rule, setRule] = useState<TriggerRule>(value ?? emptyRule());
  const [addingType, setAddingType] = useState<TriggerType | null>(null);

  const update = (patch: Partial<TriggerRule>) => {
    const updated = { ...rule, ...patch };
    setRule(updated);
  };

  const addTrigger = (type: TriggerType) => {
    update({ triggers: [...rule.triggers, defaultConfig(type)] });
    setAddingType(null);
  };

  const removeTrigger = (idx: number) => {
    update({ triggers: rule.triggers.filter((_, i) => i !== idx) });
  };

  const updateTrigger = (idx: number, cfg: TTriggerConfig) => {
    const triggers = rule.triggers.map((t, i) => (i === idx ? cfg : t));
    update({ triggers });
  };

  const usedTypes = new Set(rule.triggers.map((t) => t.type));
  const availableTypes = ALL_TYPES.filter((t) => !usedTypes.has(t));

  return (
    <div style={S.root}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9' }}>⚡ Gatilhos</div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>Quando exibir este widget</div>
        </div>
        {/* Toggle habilitado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#64748B' }}>{rule.enabled ? 'Ativo' : 'Inativo'}</span>
          <div style={S.toggle(rule.enabled)} onClick={() => update({ enabled: !rule.enabled })}>
            <div style={S.toggleKnob(rule.enabled)} />
          </div>
        </div>
      </div>

      {/* Nome da regra */}
      <div style={S.label}>Nome da regra (opcional)</div>
      <div style={{ marginBottom: '16px' }}>
        <input
          placeholder="Ex: Popup após 10s ou 50% scroll"
          value={rule.label ?? ''}
          onChange={(e) => update({ label: e.target.value })}
          style={S.input}
        />
      </div>

      {/* Operador */}
      {rule.triggers.length > 1 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={S.label}>Combinar triggers com</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['OR', 'AND'] as TriggerOperator[]).map((op) => (
              <button
                key={op}
                style={{
                  ...S.badge(rule.operator === op),
                  fontSize: '12px',
                  padding: '6px 16px',
                }}
                onClick={() => update({ operator: op })}
              >
                {op === 'OR' ? '⚡ Qualquer um (OR)' : '🔒 Todos (AND)'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={S.divider} />

      {/* Triggers existentes */}
      <div style={S.heading}>Condições</div>

      {rule.triggers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#334155',
          fontSize: '12px',
          background: '#0F172A',
          borderRadius: '10px',
          border: '1px dashed #1E293B',
          marginBottom: '12px',
        }}>
          Nenhum gatilho configurado.<br />Adicione pelo menos um abaixo.
        </div>
      )}

      {rule.triggers.map((cfg, idx) => (
        <TriggerItem
          key={idx}
          config={cfg}
          onChange={(c) => updateTrigger(idx, c)}
          onRemove={() => removeTrigger(idx)}
        />
      ))}

      {/* Seletor de tipo */}
      {addingType === null ? (
        availableTypes.length > 0 && (
          <button style={S.addBtn} onClick={() => setAddingType(availableTypes[0])}>
            <span>＋</span> Adicionar gatilho
          </button>
        )
      ) : (
        <div style={{ ...S.triggerCard, marginBottom: '10px' }}>
          <div style={S.label}>Escolha o tipo</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '10px' }}>
            {availableTypes.map((t) => (
              <button
                key={t}
                style={S.badge(addingType === t)}
                onClick={() => setAddingType(t)}
              >
                {TRIGGER_META[t].icon} {TRIGGER_META[t].label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{ ...S.saveBtn, marginTop: 0, flex: 1 }}
              onClick={() => addTrigger(addingType)}
            >
              Confirmar
            </button>
            <button
              style={{
                flex: 1,
                background: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '12px',
                color: '#64748B',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
              onClick={() => setAddingType(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={S.divider} />

      {/* Configurações avançadas */}
      <div style={S.heading}>Avançado</div>
      <div style={S.row}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', color: '#CBD5E1', fontWeight: 600 }}>Disparos por sessão</div>
          <div style={{ fontSize: '11px', color: '#475569' }}>0 = ilimitado</div>
        </div>
        <input
          type="number"
          min={0}
          max={10}
          value={rule.maxFiresPerSession ?? 1}
          onChange={(e) => update({ maxFiresPerSession: Number(e.target.value) })}
          style={{ ...S.input, width: '70px', textAlign: 'center' }}
        />
      </div>

      <button
        style={S.saveBtn}
        onClick={() => onChange(rule)}
        disabled={rule.triggers.length === 0}
      >
        Salvar gatilhos
      </button>
    </div>
  );
};

export default TriggerConfig;
