import React, { useState } from 'react';

interface PhonePreviewProps {
  appName: string;
  themeColor: string;
  logoUrl: string;
  fabEnabled?: boolean;
  fabText?: string;
  storeUrl?: string; // URL real da loja para tentar carregar
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ 
  appName, 
  themeColor, 
  logoUrl, 
  fabEnabled, 
  fabText,
  storeUrl 
}) => {
  const [iframeError, setIframeError] = useState(false);

  // URL segura para preview (adiciona https se faltar)
  const safeUrl = storeUrl?.startsWith('http') ? storeUrl : `https://${storeUrl}`;

  return (
    <div className="phone-mockup" style={styles.phoneMockup}>
      <div className="phone-notch" style={styles.notch}></div>
      
      <div className="phone-screen" style={styles.screen}>
        
        {/* BARRA DE STATUS (Muda de cor com o tema) */}
        <div className="status-bar" style={{ ...styles.statusBar, backgroundColor: themeColor }}>
          <span style={{color: 'white', fontSize: '10px', fontWeight: 'bold'}}>9:41</span>
          <div style={{color: 'white', fontSize: '10px'}}>📶 🔋</div>
        </div>

        {/* CONTEÚDO DO CELULAR */}
        <div className="app-content" style={styles.appContent}>
          
          {/* Tenta mostrar o site real (Iframe) */}
          {safeUrl && !iframeError ? (
            <iframe 
              src={safeUrl} 
              style={styles.iframe} 
              title="Preview Loja"
              onError={() => setIframeError(true)}
            />
          ) : (
            // MODO SIMULAÇÃO (Se não tiver URL ou der erro no iframe)
            <>
              {/* Cabeçalho do App */}
              <div className="app-header" style={{ ...styles.appHeader, borderBottom: `2px solid ${themeColor}` }}>
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" style={styles.logo} />
                ) : (
                  <div style={{...styles.logoPlaceholder, background: themeColor}}>L</div>
                )}
                <span style={{ color: themeColor, fontWeight: 'bold', fontSize: '14px' }}>
                  {appName || "Minha Loja"}
                </span>
              </div>

              {/* Banner Fake */}
              <div className="skeleton-banner" style={styles.banner}>
                <span style={{color: '#aaa', fontSize: '10px'}}>Banner Promocional</span>
              </div>

              {/* Grid de Produtos Fake */}
              <div className="skeleton-grid" style={styles.grid}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-product" style={styles.product}>
                    <div style={{height: '60px', background: '#eee', marginBottom: '5px'}}></div>
                    <div style={{height: '8px', width: '80%', background: '#eee', marginBottom: '3px'}}></div>
                    <div style={{height: '8px', width: '40%', background: themeColor, opacity: 0.5}}></div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* BOTÃO FLUTUANTE (FAB) - SEMPRE VISÍVEL */}
          {fabEnabled && (
            <div style={{
              position: 'absolute', bottom: '80px', right: '20px', 
              background: themeColor, color: 'white', 
              padding: '10px 20px', borderRadius: '30px', 
              fontSize: '12px', fontWeight: 'bold', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', gap: '5px', zIndex: 100,
              cursor: 'pointer'
            }}>
               <span>📲</span> {fabText || "Baixar App"}
            </div>
          )}

        </div>

        {/* BARRA DE NAVEGAÇÃO INFERIOR */}
        <div className="bottom-nav" style={styles.bottomNav}>
          <div className="nav-item" style={{ color: themeColor, display:'flex', flexDirection:'column', alignItems:'center' }}>
            <span>🏠</span>
          </div>
          <div className="nav-item" style={{ color: '#aaa', display:'flex', flexDirection:'column', alignItems:'center' }}><span>🔍</span></div>
          <div className="nav-item" style={{ color: '#aaa', display:'flex', flexDirection:'column', alignItems:'center' }}><span>🛒</span></div>
          <div className="nav-item" style={{ color: '#aaa', display:'flex', flexDirection:'column', alignItems:'center' }}><span>👤</span></div>
        </div>

        {/* INDICADOR HOME (iPhone style) */}
        <div className="home-bar" style={styles.homeBar}></div>
      </div>
    </div>
  );
};

// Estilos inline para facilitar (pode mover pro CSS depois)
const styles: { [key: string]: React.CSSProperties } = {
  phoneMockup: {
    width: '300px', height: '600px',
    border: '12px solid #333', borderRadius: '40px',
    position: 'relative', background: 'white', overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
  },
  notch: {
    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
    width: '120px', height: '25px', background: '#333',
    borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', zIndex: 20
  },
  screen: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    position: 'relative'
  },
  statusBar: {
    height: '30px', display: 'flex', justifyContent: 'space-between', 
    alignItems: 'center', padding: '0 20px', paddingTop: '5px'
  },
  appContent: {
    flex: 1, overflowY: 'auto', position: 'relative', background: '#f9f9f9'
  },
  iframe: {
    width: '100%', height: '100%', border: 'none'
  },
  appHeader: {
    padding: '15px', background: 'white', display: 'flex', alignItems: 'center', gap: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  logo: { width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' },
  logoPlaceholder: { width: '30px', height: '30px', borderRadius: '50%', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold' },
  banner: {
    height: '120px', background: '#e0e0e0', margin: '15px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '0 15px'
  },
  product: {
    background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  bottomNav: {
    height: '60px', borderTop: '1px solid #eee', background: 'white',
    display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: '20px'
  },
  homeBar: {
    width: '100px', height: '5px', background: '#ccc', borderRadius: '10px',
    margin: '10px auto', position: 'absolute', bottom: '5px', left: '0', right: '0'
  }
};

export default PhonePreview;
