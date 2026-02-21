import React, { useState } from 'react';

type PhonePreviewMode = 'splash' | 'app';

interface PhonePreviewProps {
  appName: string;
  themeColor: string;
  logoUrl: string;

  fabEnabled?: boolean;
  fabText?: string;
  fabPosition?: string;
  fabIcon?: string;
  fab_size?: number;
  fab_color?: string;

  topbar_enabled?: boolean;
  topbar_text?: string;
  topbar_button_text?: string;
  topbar_icon?: string;
  topbar_position?: 'top' | 'bottom';
  topbar_color?: string;
  topbar_text_color?: string;
  topbar_size?: number;

  storeUrl?: string;
  bottomBarBg?: string;
  bottomBarIconColor?: string;
  mode?: PhonePreviewMode;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({
  appName,
  themeColor,
  logoUrl,

  fabEnabled,
  fabText,
  fabPosition,
  fabIcon,
  fab_size = 1,
  fab_color,

  topbar_enabled,
  topbar_text,
  topbar_button_text,
  topbar_icon,
  topbar_position = 'top',
  topbar_color,
  topbar_text_color,
  topbar_size = 1,

  storeUrl,
  bottomBarBg,
  bottomBarIconColor,
  mode = 'app',
}) => {
  const [iframeError, setIframeError] = useState(false);

  const safeUrl = storeUrl?.startsWith('http')
    ? storeUrl
    : storeUrl
    ? `https://${storeUrl}`
    : undefined;

  const barBg = bottomBarBg || '#FFFFFF';
  const iconColor = bottomBarIconColor || '#6B7280';
  const appInitial = (appName || 'App').trim().charAt(0).toUpperCase();

  const isSplash = mode === 'splash';

  const fabBgColor = fab_color || themeColor;

  const bannerBg = topbar_color || '#111827'; // quase preto
  const bannerTextColor = topbar_text_color || '#FFFFFF';
  const bannerMessage = topbar_text || 'Instale o app e ganhe 10% OFF na primeira compra';
  const bannerButtonText = topbar_button_text || 'Instalar agora';

  const showTopbar = !isSplash && topbar_enabled;

  return (
    <div className="phone-mockup" style={styles.phoneMockup}>
      <div className="phone-notch" style={styles.notch}></div>

      <div className="phone-screen" style={styles.screen}>
        {/* BARRA DE STATUS */}
        <div
          className="status-bar"
          style={{ ...styles.statusBar, backgroundColor: themeColor }}
        >
          <span
            style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}
          >
            9:41
          </span>
          <div style={{ color: 'white', fontSize: '10px' }}>📶 🔋</div>
        </div>

        {/* BANNER FIXO NO TOPO (se posição = top) */}
        {!isSplash && showTopbar && topbar_position === 'top' && (
          <div
            style={{
              ...styles.topbar,
              background: bannerBg,
              color: bannerTextColor,
              padding: `${6 * topbar_size}px ${10 * topbar_size}px`,
              fontSize: `${10 * topbar_size}px`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {topbar_icon && (
                <span style={{ fontSize: `${12 * topbar_size}px` }}>
                  {topbar_icon}
                </span>
              )}
              <span style={{ flex: 1 }}>{bannerMessage}</span>
              <button
                style={{
                  background: '#FBBF24',
                  border: 'none',
                  borderRadius: 999,
                  padding: `${4 * topbar_size}px ${10 * topbar_size}px`,
                  fontSize: `${10 * topbar_size}px`,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {bannerButtonText}
              </button>
            </div>
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL (mode="app") */}
        {!isSplash && (
          <>
            <div className="app-content" style={styles.appContent}>
              {safeUrl && !iframeError ? (
                <iframe
                  src={safeUrl}
                  style={styles.iframe}
                  title="Preview Loja"
                  onError={() => setIframeError(true)}
                />
              ) : (
                <>
                  {/* Cabeçalho do App */}
                  <div
                    className="app-header"
                    style={{
                      ...styles.appHeader,
                      borderBottom: `2px solid ${themeColor}`,
                    }}
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" style={styles.logo} />
                    ) : (
                      <div
                        style={{
                          ...styles.logoPlaceholder,
                          background: themeColor,
                        }}
                      >
                        {appInitial}
                      </div>
                    )}
                    <span
                      style={{
                        color: themeColor,
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      {appName || 'Minha Loja'}
                    </span>
                  </div>

                  {/* Banner Fake */}
                  <div className="skeleton-banner" style={styles.banner}>
                    <span style={{ color: '#aaa', fontSize: '10px' }}>
                      Banner da loja (exemplo)
                    </span>
                  </div>

                  {/* Grid Fake */}
                  <div className="skeleton-grid" style={styles.grid}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="skeleton-product"
                        style={styles.product}
                      >
                        <div
                          style={{
                            height: '60px',
                            background: '#eee',
                            marginBottom: '5px',
                          }}
                        ></div>
                        <div
                          style={{
                            height: '8px',
                            width: '80%',
                            background: '#eee',
                            marginBottom: '3px',
                          }}
                        ></div>
                        <div
                          style={{
                            height: '8px',
                            width: '40%',
                            background: themeColor,
                            opacity: 0.5,
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* BOTÃO FLUTUANTE */}
              {fabEnabled && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '80px',
                    [fabPosition === 'left' ? 'left' : 'right']: '20px',
                    background: fabBgColor,
                    color: 'white',
                    padding: `${8 * fab_size}px ${16 * fab_size}px`,
                    borderRadius: '30px',
                    fontSize: `${12 * fab_size}px`,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    zIndex: 100,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: `${14 * fab_size}px` }}>
                    {fabIcon || '📲'}
                  </span>
                  {fabText || 'Baixar App'}
                </div>
              )}
            </div>

            {/* BANNER FIXO EMBAIXO (se posição = bottom) */}
            {!isSplash && showTopbar && topbar_position === 'bottom' && (
              <div
                style={{
                  ...styles.topbar,
                  background: bannerBg,
                  color: bannerTextColor,
                  padding: `${6 * topbar_size}px ${10 * topbar_size}px`,
                  fontSize: `${10 * topbar_size}px`,
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {topbar_icon && (
                    <span style={{ fontSize: `${12 * topbar_size}px` }}>
                      {topbar_icon}
                    </span>
                  )}
                  <span style={{ flex: 1 }}>{bannerMessage}</span>
                  <button
                    style={{
                      background: '#FBBF24',
                      border: 'none',
                      borderRadius: 999,
                      padding: `${4 * topbar_size}px ${10 * topbar_size}px`,
                      fontSize: `${10 * topbar_size}px`,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {bannerButtonText}
                  </button>
                </div>
              </div>
            )}

            {/* BARRA INFERIOR */}
            <div
              className="bottom-nav"
              style={{
                ...styles.bottomNav,
                background: barBg,
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <div
                className="nav-item"
                style={{ ...styles.navItem, color: iconColor }}
              >
                <span>🏠</span>
                <small style={styles.navLabel}>Início</small>
              </div>
              <div
                className="nav-item"
                style={{ ...styles.navItem, color: iconColor }}
              >
                <span>🛒</span>
                <small style={styles.navLabel}>Catálogo</small>
              </div>
              <div
                className="nav-item"
                style={{ ...styles.navItem, color: iconColor }}
              >
                <span>🔔</span>
                <small style={styles.navLabel}>Alertas</small>
              </div>
              <div
                className="nav-item"
                style={{ ...styles.navItem, color: iconColor }}
              >
                <span>👤</span>
                <small style={styles.navLabel}>Conta</small>
              </div>
            </div>
          </>
        )}

        {/* INDICADOR HOME */}
        <div className="home-bar" style={styles.homeBar}></div>

        {/* SPLASH */}
        {isSplash && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: themeColor || '#000000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 24,
                background: 'rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: 16,
              }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="App icon"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {appInitial}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {appName || 'Minha Loja'}
            </div>
            <div
              style={{
                fontSize: 12,
                opacity: 0.9,
              }}
            >
              Abrindo aplicativo…
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  phoneMockup: {
    width: '300px',
    height: '600px',
    border: '12px solid #333',
    borderRadius: '40px',
    position: 'relative',
    background: 'white',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    height: '25px',
    background: '#333',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    zIndex: 20,
  },
  screen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  statusBar: {
    height: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    paddingTop: '5px',
  },
  topbar: {
    width: '100%',
  },
  appContent: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    background: '#f9f9f9',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  appHeader: {
    padding: '15px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  logo: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  logoPlaceholder: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  banner: {
    height: '120px',
    background: '#e0e0e0',
    margin: '15px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    padding: '0 15px',
  },
  product: {
    background: 'white',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  bottomNav: {
    height: '60px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: '18px',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '11px',
  },
  navLabel: {
    fontSize: '9px',
    fontWeight: '600',
    marginTop: '2px',
  },
  homeBar: {
    width: '100px',
    height: '5px',
    background: '#ccc',
    borderRadius: '10px',
    margin: '10px auto',
    position: 'absolute',
    bottom: '5px',
    left: '0',
    right: '0',
  },
};

export default PhonePreview;
