// src/app-config/WidgetConfigPanel.tsx
import React, { useState, useEffect } from 'react';
import PhonePreview from './PhonePreview';
import {
  TriggerRule,
  TriggerConfig as TriggerConfigType,
} from './widgets/triggers/trigger.types';
import { TriggerConfig as TriggerConfigPanel } from './widgets/triggers/TriggerConfig';
import { triggerEngine } from './widgets/triggers/triggerEngine';

const WidgetConfigPanel: React.FC = () => {
  // Config manual (toggle tradicional)
  const [fabEnabled, setFabEnabled] = useState(false);
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [topbarEnabled, setTopbarEnabled] = useState(false);

  // Config dos triggers (por widget)
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

  // Estados reativos para o preview (manual OU trigger)
  const [showFab, setShowFab] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);

  // Inicializa todos os triggers
  useEffect(() => {
    // Cleanup anterior
    triggerEngine.destroy();

    // Inicia triggers ativos
    const activeRules: TriggerRule[] = [];
    if (fabTrigger.enabled) activeRules.push(fabTrigger);
    if (popupTrigger.enabled) activeRules.push(popupTrigger);
    if (topbarTrigger.enabled) activeRules.push(topbarTrigger);

    if (activeRules.length > 0) {
      triggerEngine.init(activeRules);

      // Listeners para cada regra
      triggerEngine.on(fabTrigger.id, () => setShowFab(true));
      triggerEngine.on(popupTrigger.id, () => setShowPopup(true));
      triggerEngine.on(topbarTrigger.id, () => setShowTopbar(true));
    }

    return () => triggerEngine.destroy();
  }, [fabTrigger, popupTrigger, topbarTrigger]);

  // Config final para o PhonePreview (manual SOBRE trigger)
  const finalFabEnabled = fabTrigger.enabled ? showFab : fabEnabled;
  const finalPopupEnabled = popupTrigger.enabled ? showPopup : popupEnabled;
  const finalTopbarEnabled = topbarTrigger.enabled ? showTopbar : topbarEnabled;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f23' }}>
      {/* PAINEL DE CONFIG (esquerda) */}
      <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
        <h1 style={{ fontSize: '24px', color: 'white', marginBottom: '32px' }}>
          Configurar Widgets
        </h1>

        {/* ABA FAB */}
        <div style={{ marginBottom: '32px', padding: '20px', background: '#1a1a2e', borderRadius: '16px' }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>FAB</h3>
          
          {/* Toggle manual */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              checked={fabEnabled}
              onChange={(e) => setFabEnabled(e.target.checked)}
            />
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Ativar manualmente</span>
          </label>

          {/* Gatilhos inteligentes */}
          <TriggerConfigPanel
            value={fabTrigger}
            onChange={setFabTrigger}
          />
        </div>

        {/* ABA POPUP */}
        <div style={{ marginBottom: '32px', padding: '20px', background: '#1a1a2e', borderRadius: '16px' }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>Popup</h3>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              checked={popupEnabled}
              onChange={(e) => setPopupEnabled(e.target.checked)}
            />
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Ativar manualmente</span>
          </label>

          <TriggerConfigPanel
            value={popupTrigger}
            onChange={setPopupTrigger}
          />
        </div>

        {/* ABA TOPBAR */}
        <div style={{ padding: '20px', background: '#1a1a2e', borderRadius: '16px' }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>TopBar</h3>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              checked={topbarEnabled}
              onChange={(e) => setTopbarEnabled(e.target.checked)}
            />
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Ativar manualmente</span>
          </label>

          <TriggerConfigPanel
            value={topbarTrigger}
            onChange={setTopbarTrigger}
          />
        </div>
      </div>

      {/* PREVIEW (direita) */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <PhonePreview
          appName="Minha Loja"
          themeColor="#10b981"
          logoUrl=""
          
          // Config final (manual OU trigger)
          fabEnabled={finalFabEnabled}
          fabText="Baixar App"
          fabPosition="right"
          fabIcon="📱"
          fab_size="medium"
          fab_color="#ef4444"

          topbar_enabled={finalTopbarEnabled}
          topbar_text="Notificações"
          topbar_button_text="Ativar"
          topbar_icon="🔔"
          topbar_position="top"

          popup_enabled={finalPopupEnabled}
          popup_image_url="https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Promo+App"

          showBottomBar={true}
          bottomBarBg="#ffffff"
          bottomBarIconColor="#6b7280"
        />
      </div>
    </div>
  );
};

export default WidgetConfigPanel;
