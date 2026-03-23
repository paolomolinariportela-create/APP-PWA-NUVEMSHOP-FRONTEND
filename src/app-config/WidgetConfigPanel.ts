// src/app-config/WidgetConfigPanel.tsx
import React, { useState, useEffect, useCallback } from 'react';
import PhonePreview from './PhonePreview';
import {
  TriggerRule,
  TriggerConfig as TriggerConfigType,
  TriggerType,
} from './widgets/triggers/trigger.types';
import { TriggerConfig as TriggerConfigPanel } from './widgets/triggers/TriggerConfig';
import { triggerEngine } from './widgets/triggers/triggerEngine';

const WidgetConfigPanel: React.FC = () => {
  // === CONFIG MANUAIS (toggle tradicional) ===
  const [fabConfig, setFabConfig] = useState({
    enabled: false,
    text: 'Baixar App',
    position: 'right' as 'left' | 'right',
    icon: '📱',
    size: 'medium' as 'xs' | 'small' | 'medium' | 'large' | 'xl',
    color: '#10b981',
  });

  const [popupConfig, setPopupConfig] = useState({
    enabled: false,
    imageUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Promo+App',
  });

  const [topbarConfig, setTopbarConfig] = useState({
    enabled: false,
    text: 'Notificações',
    buttonText: 'Ativar',
    icon: '🔔',
    position: 'top' as 'top' | 'bottom',
    color: '#3b82f6',
    textColor: '#ffffff',
    size: 'medium' as 'xs' | 'small' | 'medium' | 'large' | 'xl',
  });

  // === TRIGGERS (gatilhos inteligentes) ===
  const [fabTrigger, setFabTrigger] = useState<TriggerRule>({
    id: 'fab_rule_1',
    label: 'FAB Inteligente',
    operator: 'OR',
    enabled: false,
    triggers: [{ type: 'time_on_page', seconds: 5 } as TriggerConfigType],
    maxFiresPerSession: 1,
  });

  const [popupTrigger, setPopupTrigger] = useState<TriggerRule>({
    id: 'popup_rule_1',
    label: 'Popup Inteligente',
    operator: 'OR',
    enabled: false,
    triggers: [{ type: 'scroll_depth', percent: 50 } as TriggerConfigType],
    maxFiresPerSession: 1,
  });

  const [topbarTrigger, setTopbarTrigger] = useState<TriggerRule>({
    id: 'topbar_rule_1',
    label: 'TopBar Inteligente',
    operator: 'OR',
    enabled: false,
    triggers: [{ type: 'exit_intent', sensitivity: 'medium' } as TriggerConfigType],
    maxFiresPerSession: 1,
  });

  // === ESTADOS DO PREVIEW (reativos) ===
  const [showFab, setShowFab] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);

  // === MOTOR DE TRIGGERS ===
  useEffect(() => {
    triggerEngine.destroy();

    const activeRules: TriggerRule[] = [];
    if (fabTrigger.enabled) activeRules.push(fabTrigger);
    if (popupTrigger.enabled) activeRules.push(popupTrigger);
    if (topbarTrigger.enabled) activeRules.push(topbarTrigger);

    if (activeRules.length > 0) {
      triggerEngine.init(activeRules);
      
      // Listeners para disparos
      const fabCb = () => setShowFab(true);
      const popupCb = () => setShowPopup(true);
      const topbarCb = () => setShowTopbar(true);

      triggerEngine.on(fabTrigger.id, fabCb);
      triggerEngine.on(popupTrigger.id, popupCb);
      triggerEngine.on(topbarTrigger.id, topbarCb);

      return () => {
        triggerEngine.on(fabTrigger.id, fabCb);  // Cleanup
        triggerEngine.on(popupTrigger.id, popupCb);
        triggerEngine.on(topbarTrigger.id, topbarCb);
      };
    }
  }, [fabTrigger, popupTrigger, topbarTrigger]);

  // === LÓGICA FINAL: trigger sobrescreve manual ===
  const finalFabEnabled = fabTrigger.enabled ? showFab : fabConfig.enabled;
  const finalPopupEnabled = popupTrigger.enabled ? showPopup : popupConfig.enabled;
  const finalTopbarEnabled = topbarTrigger.enabled ? showTopbar : topbarConfig.enabled;

  return (
    <div style={styles.root}>
      {/* PAINEL CONFIG (ESQUERDA) */}
      <div style={styles.configPanel}>
        <div style={styles.header}>
          <h1 style={styles.title}>Configurar Widgets</h1>
          <div style={styles.subtitle}>Configure e veja o resultado em tempo real</div>
        </div>

        {/* === FAB === */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📱 FAB</h2>
          
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={fabConfig.enabled}
              onChange={(e) => setFabConfig({ ...fabConfig, enabled: e.target.checked })}
            />
            <span>Ativar manualmente</span>
          </label>

          <TriggerConfigPanel
            rule={fabTrigger}
            onChange={setFabTrigger}
          />

          {/* Configs específicas do FAB */}
          <div style={styles.fieldGroup}>
            <label>Texto</label>
            <input
              value={fabConfig.text}
              onChange={(e) => setFabConfig({ ...fabConfig, text: e.target.value })}
              style={styles.input}
              placeholder="Baixar App"
            />
          </div>
        </div>

        {/* === POPUP === */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🔔 Popup</h2>
          
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={popupConfig.enabled}
              onChange={(e) => setPopupConfig({ ...popupConfig, enabled: e.target.checked })}
            />
            <span>Ativar manualmente</span>
          </label>

          <TriggerConfigPanel
            rule={popupTrigger}
            onChange={setPopupTrigger}
          />

          <div style={styles.fieldGroup}>
            <label>URL da imagem</label>
            <input
              value={popupConfig.imageUrl}
              onChange={(e) => setPopupConfig({ ...popupConfig, imageUrl: e.target.value })}
              style={styles.input}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* === TOPBAR === */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📢 TopBar</h2>
          
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={topbarConfig.enabled}
              onChange={(e) => setTopbarConfig({ ...topbarConfig, enabled: e.target.checked })}
            />
            <span>Ativar manualmente</span>
          </label>

          <TriggerConfigPanel
            rule={topbarTrigger}
            onChange={setTopbarTrigger}
          />

          <div style={styles.fieldGroup}>
            <label>Texto principal</label>
            <input
              value={topbarConfig.text}
              onChange={(e) => setTopbarConfig({ ...topbarConfig, text: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      {/* PREVIEW (DIREITA) */}
      <div style={styles.previewPanel}>
        <div style={styles.previewCard}>
          <PhonePreview
            appName="Minha Loja"
            themeColor="#10b981"
            logoUrl=""
            
            // FAB
            fabEnabled={finalFabEnabled}
            fabText={fabConfig.text}
            fabPosition={fabConfig.position}
            fabIcon={fabConfig.icon}
            fab_size={fabConfig.size}
            fab_color={fabConfig.color}
            
            // TopBar
            topbar_enabled={finalTopbarEnabled}
            topbar_text={topbarConfig.text}
            topbar_button_text={topbarConfig.buttonText}
            topbar_icon={topbarConfig.icon}
            topbar_position={topbarConfig.position}
            topbar_color={topbarConfig.color}
            topbar_text_color={topbarConfig.textColor}
            topbar_size={topbarConfig.size}
            
            // Popup
            popup_enabled={finalPopupEnabled}
            popup_image_url={popupConfig.imageUrl}
            
            showBottomBar={true}
            bottomBarBg="#ffffff"
            bottomBarIconColor="#6b7280"
          />
        </div>
      </div>
    </div>
  );
};

// === ESTILOS ===
const styles = {
  root: {
    display: 'flex' as const,
    height: '100vh',
    background: '#0f0f23',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  configPanel: {
    flex: 1,
    padding: '32px',
    overflow: 'auto',
    background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)',
  },
  previewPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  previewCard: {
    width: 375,
    height: 812,
    borderRadius: '32px',
    boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    background: '#000',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800 as const,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '15px',
    marginTop: '8px',
  },
  section: {
    background: '#1a1a2e',
    borderRadius: '20px',
    padding: '28px',
    marginBottom: '24px',
    border: '1px solid #26263a',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 700 as const,
    color: '#ffffff',
    margin: '0 0 20px 0',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    color: '#e2e8f0',
    fontSize: '15px',
    fontWeight: 500,
  },
  fieldGroup: {
    marginTop: '20px',
  } as any,
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #334155',
    background: '#1e1e2e',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as any,
};

export default WidgetConfigPanel;
