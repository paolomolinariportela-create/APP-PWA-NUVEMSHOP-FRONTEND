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
  fab_size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  fab_color?: string;

  topbar_enabled?: boolean;
  topbar_text?: string;
  topbar_button_text?: string;
  topbar_icon?: string;
  topbar_position?: 'top' | 'bottom';
  topbar_color?: string;
  topbar_text_color?: string;
  // agora string, igual backend
  topbar_size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';

  // NOVO: popup
  popup_enabled?: boolean;
  popup_image_url?: string;

  storeUrl?: string;
  bottomBarBg?: string;
  bottomBarIconColor?: string;
  mode?: PhonePreviewMode;
  // controlar se mostra a barra inferior no preview
  showBottomBar?: boolean;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({
  appName,
  themeColor,
  logoUrl,

  fabEnabled,
  fabText,
  fabPosition,
  fabIcon,
  fab_size = 'medium',
  fab_color,

  topbar_enabled,
  topbar_text,
  topbar_button_text,
  topbar_icon,
  topbar_position = 'top',
  topbar_color,
  topbar_text_color,
  topbar_size = 'medium',

  // NOVO popup
  popup_enabled,
  popup_image_url,

  bottomBarBg,
  bottomBarIconColor,
  mode = 'app',
  showBottomBar = true,
}) => {
  const [/* iframeError */, setIframeError] = useState(false);

  const barBg = bottomBarBg || '#FFFFFF';
  const iconColor = bottomBarIconColor || '#6B7280';
  const appInitial = (appName || 'App').trim().charAt(0).toUpperCase();

  const isSplash = mode === 'splash';

  const fabBgColor = fab_color || themeColor;

  const fabSizeFactor = (() => {
    switch (fab_size) {
      case 'xs':
        return 0.7;
      case 'small':
        return 0.85;
      case 'large':
        return 1.2;
      case 'xl':
        return 1.35;
      default:
        return 1.0;
    }
  })();

  // fator visual para a topbar baseado no tamanho string
  const topbarSizeFactor = (() => {
    switch (topbar_size) {
      case 'xs':
        return 0.8;
      case 'small':
        return 0.9;
      case 'large':
        return 1.15;
      case 'xl':
        return 1.3;
      default:
        return 1.0;
    }
  })();

  const bannerBg = topbar_color || '#111827';
  const bannerTextColor = topbar_text_color || '#FFFFFF';
  const bannerMessage =
    topbar_text || 'Instale o app e ganhe 10% OFF na primeira compra';
  const bannerButtonText = topbar_button_text || 'Instalar agora';

  const showTopbar = !isSplash && topbar_enabled;

  const showPopup = !isSplash && popup_enabled && popup_image_url;

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

        {/* BANNER FIXO NO TOPO */}
        {!isSplash && showTopbar && topbar_position === 'top' && (
          <div
            style={{
              ...styles.topbar,
              background: bannerBg,
              color: bannerTextColor,
              padding: `${6 * topbarSizeFactor}px ${10 * topbarSizeFactor}px`,
              fontSize: `${10 * topbarSizeFactor}px`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {topbar_icon && (
                <span style={{ fontSize: `${12 * topbarSizeFactor}px` }}>
                  {topbar_icon}
                </span>
              )}
              <span style={{ flex: 1 }}>{bannerMessage}</span>
              <button
                style={{
                  background: '#FBBF24',
                  border: 'none',
                  borderRadius: 999,
                  padding: `${4 * topbarSizeFactor}px ${
                    10 * topbarSizeFactor
                  }px`,
                  fontSize: `${10 * topbarSizeFactor}px`,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {bannerButtonText}
              </button>
            </div>
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL */}
        {!isSplash && (
          <>
            <div className="app-content" style={styles.appContent}>
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

              {/* Banner fake de destaque */}
              <div className="skeleton-banner" style={styles.banner}>
                <div
                  style={{
                    width: '60%',
                    height: '16px',
                    background: '#e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                ></div>
                <div
                  style={{
                    width: '40%',
                    height: '12px',
                    background: '#e5e7eb',
                    borderRadius: '6px',
                  }}
                ></div>
              </div>

              {/* Seção de categorias */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 15px',
                  marginBottom: '10px',
                }}
              >
                {['Promoções', 'Novidades', 'Mais vendidos'].map((cat) => (
                  <div
                    key={cat}
                    style={{
                      fontSize: '10px',
                      background: '#EEF2FF',
                      color: '#4F46E5',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      fontWeight: 600,
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>

              {/* Grid de produtos fake */}
              <div className="skeleton-grid" style={styles.grid}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="skeleton-product"
                    style={styles.product}
                  >
                    <div
                      style={{
                        height: '70px',
                        background: '#e5e7eb',
                        borderRadius: '8px',
                        marginBottom: '6px',
                      }}
                    ></div>
                    <div
                      style={{
                        height: '8px',
                        width: '80%',
                        background: '#e5e7eb',
                        borderRadius: '4px',
                        marginBottom: '4px',
                      }}
                    ></div>
                    <div
                      style={{
                        height: '8px',
                        width: '40%',
                        background: themeColor,
                        borderRadius: '4px',
                        opacity: 0.6,
                      }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* BOTÃO FLUTUANTE */}
              {fabEnabled && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '80px',
                    [fabPosition === 'left' ? 'left' : 'right']: '20px',
                    background: fabBgColor,
                    color: 'white',
                    padding: `${8 * fabSizeFactor}px ${16 * fabSizeFactor}px`,
                    borderRadius: '30px',
                    fontSize: `${12 * fabSizeFactor}px`,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    zIndex: 100,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: `${14 * fabSizeFactor}px` }}>
                    {fabIcon || '📲'}
                  </span>
                  {fabText || 'Baixar App'}
                </div>
              )}
            </div>

            {/* BANNER FIXO EMBAIXO */}
            {!isSplash && showTopbar && topbar_position === 'bottom' && (
              <div
                style={{
                  ...styles.topbar,
                  background: bannerBg,
                  color: bannerTextColor,
                  padding: `${6 * topbarSizeFactor}px ${
                    10 * topbarSizeFactor
                  }px`,
                  fontSize: `${10 * topbarSizeFactor}px`,
                  borderTop: '1px solid rgba(0,0,0,0.1)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {topbar_icon && (
                    <span style={{ fontSize: `${12 * topbarSizeFactor}px` }}>
                      {topbar_icon}
                    </span>
                  )}
                  <span style={{ flex: 1 }}>{bannerMessage}</span>
                  <button
                    style={{
                      background: '#FBBF24',
                      border: 'none',
                      borderRadius: 999,
                      padding: `${4 * topbarSizeFactor}px ${
                        10 * topbarSizeFactor
                      }px`,
                      fontSize: `${10 * topbarSizeFactor}px`,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {bannerButtonText}
                  </button>
                </div>
              </div>
            )}

            {/* BARRA INFERIOR – só se showBottomBar = true */}
            {showBottomBar && (
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
            )}
          </>
        )}

        {/* POPUP DE INSTALAÇÃO – PREVIEW */}
        {showPopup && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
            }}
          >
            <div
              style={{
                width: '80%',
                maxWidth: 220,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                background: '#000',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '100%',
                  paddingTop: '177%',
                  backgroundImage: `url(${popup_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <button
                  style={{
                    background: '#10B981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  Instalar app
                </button>
                <button
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    padding: '6px 10px',
                    fontSize: 10,
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
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
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    padding: '0 15px',
    paddingBottom: '80px',
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
