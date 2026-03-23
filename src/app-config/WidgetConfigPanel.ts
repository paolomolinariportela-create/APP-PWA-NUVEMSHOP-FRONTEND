// src/app-config/WidgetConfigPanel.tsx (VERSÃO QUE COMPILA)
import React, { useState, useEffect } from 'react';
import PhonePreview from './PhonePreview';
import {
  TriggerRule,
  TriggerConfig as TriggerConfigType,
} from './widgets/triggers/trigger.types';
import { TriggerConfig as TriggerConfigPanel } from './widgets/triggers/TriggerConfig';
import { triggerEngine } from './widgets/triggers/triggerEngine';

const WidgetConfigPanel: React.FC = () => {
  // Config manual
  const [fabEnabled, setFabEnabled] = useState(false);
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [topbarEnabled, setTopbarEnabled] = useState(false);

  // Triggers
  const [fabTrigger, setFabTrigger] = useState<TriggerRule>({
    id: 'fab_1',
    label: 'FAB Inteligente',
    operator: 'OR' as const,
    enabled: false,
    triggers: [{ type: 'time_on_page', seconds: 5 } as TriggerConfigType],
    maxFiresPerSession: 1,
  });

  const [popupTrigger, setPopupTrigger] = useState<TriggerRule>({
    id: 'popup_1',
    label: 'Popup Inteligente',
    operator: 'OR' as const,
    enabled: false,
    triggers: [{ type: 'scroll_depth', percent: 50 } as TriggerConfigType],
    maxFiresPerSession: 1,
  });

  const [topbarTrigger, setTopbarTrigger] = useState<TriggerRule>({
    id: 'topbar_1',
    label: 'TopBar Inteligente',
    operator: 'OR' as const,
    enabled: false,
    triggers: [{ type: 'exit_intent', sensitivity: 'medium' } as TriggerConfigType],
    maxFiresPerSession: 1,
  });

  // Preview states
  const [showFab, setShowFab] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);

  // Trigger engine
  useEffect(() => {
    triggerEngine.destroy();

    const rules = [];
    if (fabTrigger.enabled) rules.push(fabTrigger);
    if (popupTrigger.enabled) rules.push(popupTrigger);
    if (topbarTrigger.enabled) rules.push(topbarTrigger);

    if (rules.length > 0) {
      triggerEngine.init(rules);
      triggerEngine.on(fabTrigger.id, () => setShowFab(true));
      triggerEngine.on(popupTrigger.id, () => setShowPopup(true));
      triggerEngine.on(topbarTrigger.id, () => setShowTopbar(true));
    }

    return () => triggerEngine.destroy();
  }, [fabTrigger, popupTrigger, topbarTrigger]);

  // Final states
  const finalFabEnabled = fabTrigger.enabled ? showFab : fabEnabled;
  const finalPopupEnabled = popupTrigger.enabled ? showPopup : popupEnabled;
  const finalTopbarEnabled = topbarTrigger.enabled ? showTopbar : topbarEnabled;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f23' }}>
      {/* CONFIG PAINEL */}
      <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '32px' }}>
          Configurar Widgets
        </h1>

        {/* FAB */}
        <div style={{ marginBottom: '32px', padding: '24px', background: '#1a1a2e', borderRadius: '16px' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>📱 FAB</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#94a3b8' }}>
            <input type="checkbox" checked={fabEnabled} onChange={e => setFabEnabled(e.target.checked)} />
            Ativar manualmente
          </label>
          <TriggerConfigPanel rule={fabTrigger} onChange={setFabTrigger} />
        </div>

        {/* POPUP */}
        <div style={{ marginBottom: '32px', padding: '24px', background: '#1a1a2e', borderRadius: '16px' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>🔔 Popup</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#94a3b8' }}>
            <input type="checkbox" checked={popupEnabled} onChange={e => setPopupEnabled(e.target.checked)} />
            Ativar manualmente
          </label>
          <TriggerConfigPanel rule={popupTrigger} onChange={setPopupTrigger} />
        </div>

        {/* TOPBAR */}
        <div style={{ padding: '24px', background: '#1a1a2e', borderRadius: '16px' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>📢 TopBar</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#94a3b8' }}>
            <input type="checkbox" checked={topbarEnabled} onChange={e => setTopbarEnabled(e.target.checked)} />
            Ativar manualmente
          </label>
          <TriggerConfigPanel rule={topbarTrigger} onChange={setTopbarTrigger} />
        </div>
      </div>

      {/* PREVIEW */}
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
          topbar_color="#3b82f6"
          topbar_text_color="#ffffff"
          topbar_size="medium"
          popup_enabled={finalPopupEnabled}
          popup_image_url="https://via.placeholder.com/300x200/ff6b6b/ffffff?text=PROMO"
          showBottomBar={true}
          bottomBarBg="#ffffff"
          bottomBarIconColor="#6b7280"
        />
      </div>
    </div>
  );
};

export default WidgetConfigPanel;
