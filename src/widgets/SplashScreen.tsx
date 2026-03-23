import React from 'react';

interface SplashScreenProps {
  appName: string;
  themeColor: string;
  logoUrl: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  appName,
  themeColor,
  logoUrl,
}) => {
  const appInitial = (appName || 'App').trim().charAt(0).toUpperCase();

  return (
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
          <span style={{ fontSize: 40, fontWeight: 700, color: '#ffffff' }}>
            {appInitial}
          </span>
        )}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
        {appName || 'Minha Loja'}
      </div>
      <div style={{ fontSize: 12, opacity: 0.9 }}>Abrindo aplicativo…</div>
    </div>
  );
};
