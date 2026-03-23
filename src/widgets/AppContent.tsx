import React from 'react';
import { styles } from '../phonePreview.styles';
import { FAB } from './FAB';
import { SizeOption } from '../phonePreview.types';

interface AppContentProps {
  appName: string;
  themeColor: string;
  logoUrl: string;

  fabEnabled?: boolean;
  fabText?: string;
  fabPosition?: string;
  fabIcon?: string;
  fabSize?: SizeOption;
  fabColor?: string;
}

const CATEGORIES = ['Promoções', 'Novidades', 'Mais vendidos'];

export const AppContent: React.FC<AppContentProps> = ({
  appName,
  themeColor,
  logoUrl,
  fabEnabled,
  fabText,
  fabPosition,
  fabIcon,
  fabSize,
  fabColor,
}) => {
  const appInitial = (appName || 'App').trim().charAt(0).toUpperCase();

  return (
    <div style={styles.appContent}>
      {/* Cabeçalho */}
      <div style={{ ...styles.appHeader, borderBottom: `2px solid ${themeColor}` }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={styles.logo} />
        ) : (
          <div style={{ ...styles.logoPlaceholder, background: themeColor }}>
            {appInitial}
          </div>
        )}
        <span style={{ color: themeColor, fontWeight: 'bold', fontSize: '14px' }}>
          {appName || 'Minha Loja'}
        </span>
      </div>

      {/* Banner fake */}
      <div style={styles.banner}>
        <div style={{ width: '60%', height: '16px', background: '#e5e7eb', borderRadius: '8px', marginBottom: '8px' }} />
        <div style={{ width: '40%', height: '12px', background: '#e5e7eb', borderRadius: '6px' }} />
      </div>

      {/* Categorias */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 15px', marginBottom: '10px' }}>
        {CATEGORIES.map((cat) => (
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

      {/* Grid de produtos */}
      <div style={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={styles.product}>
            <div style={{ height: '70px', background: '#e5e7eb', borderRadius: '8px', marginBottom: '6px' }} />
            <div style={{ height: '8px', width: '80%', background: '#e5e7eb', borderRadius: '4px', marginBottom: '4px' }} />
            <div style={{ height: '8px', width: '40%', background: themeColor, borderRadius: '4px', opacity: 0.6 }} />
          </div>
        ))}
      </div>

      {/* FAB */}
      <FAB
        enabled={fabEnabled}
        text={fabText}
        position={fabPosition}
        icon={fabIcon}
        size={fabSize}
        color={fabColor}
        themeColor={themeColor}
      />
    </div>
  );
};
