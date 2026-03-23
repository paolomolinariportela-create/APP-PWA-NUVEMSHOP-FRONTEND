import React from 'react';
import { styles } from '../phonePreview.styles';

interface BottomNavProps {
  show?: boolean;
  barBg?: string;
  iconColor?: string;
}

const NAV_ITEMS = [
  { icon: '🏠', label: 'Início' },
  { icon: '🛒', label: 'Catálogo' },
  { icon: '🔔', label: 'Alertas' },
  { icon: '👤', label: 'Conta' },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  show = true,
  barBg,
  iconColor,
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        ...styles.bottomNav,
        background: barBg || '#FFFFFF',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          style={{ ...styles.navItem, color: iconColor || '#6B7280' }}
        >
          <span>{item.icon}</span>
          <small style={styles.navLabel}>{item.label}</small>
        </div>
      ))}
    </div>
  );
};
