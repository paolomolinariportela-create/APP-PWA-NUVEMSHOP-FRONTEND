import React from 'react';
import { PhonePreviewProps } from './phonePreview.types';
import { styles } from './phonePreview.styles';
import { TopBar }      from './widgets/TopBar';
import { AppContent }  from './widgets/AppContent';
import { BottomNav }   from './widgets/BottomNav';
import { Popup }       from './widgets/Popup';
import { SplashScreen } from './widgets/SplashScreen';

const PhonePreview: React.FC<PhonePreviewProps> = ({
  appName,
  themeColor,
  logoUrl,

  fabEnabled,
  fabText,
  fabPosition,
  fabIcon,
  fab_size,
  fab_color,

  topbar_enabled,
  topbar_text,
  topbar_button_text,
  topbar_icon,
  topbar_position = 'top',
  topbar_color,
  topbar_text_color,
  topbar_size,

  popup_enabled,
  popup_image_url,

  bottomBarBg,
  bottomBarIconColor,
  mode = 'app',
  showBottomBar = true,
}) => {
  const isSplash = mode === 'splash';

  return (
    <div style={styles.phoneMockup}>
      <div style={styles.notch} />

      <div style={styles.screen}>
        {/* Status bar */}
        <div style={{ ...styles.statusBar, backgroundColor: themeColor }}>
          <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>9:41</span>
          <div style={{ color: 'white', fontSize: '10px' }}>📶 🔋</div>
        </div>

        {/* TopBar — topo */}
        {!isSplash && topbar_position === 'top' && (
          <TopBar
            enabled={topbar_enabled}
            position="top"
            text={topbar_text}
            buttonText={topbar_button_text}
            icon={topbar_icon}
            color={topbar_color}
            textColor={topbar_text_color}
            size={topbar_size}
          />
        )}

        {/* Conteúdo da loja (app fake + FAB) */}
        {!isSplash && (
          <AppContent
            appName={appName}
            themeColor={themeColor}
            logoUrl={logoUrl}
            fabEnabled={fabEnabled}
            fabText={fabText}
            fabPosition={fabPosition}
            fabIcon={fabIcon}
            fabSize={fab_size}
            fabColor={fab_color}
          />
        )}

        {/* TopBar — bottom */}
        {!isSplash && topbar_position === 'bottom' && (
          <TopBar
            enabled={topbar_enabled}
            position="bottom"
            text={topbar_text}
            buttonText={topbar_button_text}
            icon={topbar_icon}
            color={topbar_color}
            textColor={topbar_text_color}
            size={topbar_size}
          />
        )}

        {/* Barra inferior */}
        {!isSplash && (
          <BottomNav
            show={showBottomBar}
            barBg={bottomBarBg}
            iconColor={bottomBarIconColor}
          />
        )}

        {/* Popup */}
        {!isSplash && (
          <Popup enabled={popup_enabled} imageUrl={popup_image_url} />
        )}

        {/* Indicador home */}
        <div style={styles.homeBar} />

        {/* Splash */}
        {isSplash && (
          <SplashScreen
            appName={appName}
            themeColor={themeColor}
            logoUrl={logoUrl}
          />
        )}
      </div>
    </div>
  );
};

export default PhonePreview;
