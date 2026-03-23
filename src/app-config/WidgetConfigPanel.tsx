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
  const [fabEnabled, setFabEnabled] = useState(false);
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [topbarEnabled, setTopbarEnabled] = useState(false);

  const [fabTrigger, setFabTrigger] = useState<TriggerRule>({
    id: 'fab_1',
    label: 'FAB',
    operator: 'OR' as const,
    enabled: false,
    triggers: [{ type: 'time_on_page', seconds: 5 } as TriggerConfigType],
    maxFiresPerSession: 1,
  });

  const [popupTrigger, setPopupTrigger] = useState<TriggerRule>({
    id: 'popup_1',
    label: 'Popup',
    operator: 'OR' as const,
    enabled: false,
    triggers: [{ type: 'scroll_depth', percent: 50 } as TriggerConfigType],
    maxFiresPerSession: 1,
  });

  const [topbarTrigger, setTopbarTrigger] = useState<TriggerRule>({
    id: 'topbar_1',
    label: 'TopBar',
    operator: 'OR' as const,
    enabled: false,
    triggers: [{ type: 'exit_intent', sensitivity: 'medium' } as TriggerConfigType],
    maxFiresPerSession: 1,
  });

  const [showFab, setShowFab] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);

  useEffect(() => {
    triggerEngine.destroy();

    const rules: TriggerRule[] = [];
    if (fabTrigger.enabled) rules.push(fabTrigger);
    if (popupTrigger.enabled) rules.push(popupTrigger);
    if (topbarTrigger.enabled) rules.push(topbarTrigger);

    if (rules.length) {
      triggerEngine.init(rules);
      triggerEngine.on(fabTrigger.id, () => setShowFab(true));
      triggerEngine.on(popupTrigger.id, () => setShowPopup(true));
      triggerEngine.on(topbarTrigger.id, () => setShowTopbar(true));
    }

    return () => triggerEngine.destroy();
  }, [fabTrigger, popupTrigger, topbarTrigger]);

  const finalFabEnabled    = fabTrigger.enabled    ? showFab    : fabEnabled;
  const finalPopupEnabled  = popupTrigger.enabled  ? showPopup  : popupEnabled;
  const finalTopbarEnabled = topbarTrigger.enabled ? showTopbar : topbarEnabled;

  return (
    <div className="config-root">
      <div className="config-panel">
        <header className="config-header">
          <h1>Configurar Widgets</h1>
        </header>

        <section className="config-section">
          <h2>📱 FAB</h2>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={fabEnabled}
              onChange={e => setFabEnabled(e.target.checked)}
            />
            Ativar manualmente
          </label>
          <TriggerConfigPanel
            value={fabTrigger}
            onChange={setFabTrigger}
          />
        </section>

        <section className="config-section">
          <h2>🔔 Popup</h2>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={popupEnabled}
              onChange={e => setPopupEnabled(e.target.checked)}
            />
            Ativar manualmente
          </label>
          <TriggerConfigPanel
            value={popupTrigger}
            onChange={setPopupTrigger}
          />
        </section>

        <section className="config-section">
          <h2>📢 TopBar</h2>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={topbarEnabled}
              onChange={e => setTopbarEnabled(e.target.checked)}
            />
            Ativar manualmente
          </label>
          <TriggerConfigPanel
            value={topbarTrigger}
            onChange={setTopbarTrigger}
          />
        </section>
      </div>

      <div className="preview-panel">
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
