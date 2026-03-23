import React from 'react';
import { SizeOption } from '../phonePreview.types';
import { requestPushPermission, getSizeFactor } from '../phonePreview.utils';

interface FABProps {
  enabled?: boolean;
  text?: string;
  position?: string;
  icon?: string;
  size?: SizeOption;
  color?: string;
  themeColor: string;
}

export const FAB: React.FC<FABProps> = ({
  enabled,
  text,
  position,
  icon,
  size = 'medium',
  color,
  themeColor,
}) => {
  if (!enabled) return null;

  const f = getSizeFactor(size);
  const bg = color || themeColor;

  return (
    <div
      onClick={requestPushPermission}
      style={{
        position: 'absolute',
        bottom: '80px',
        [position === 'left' ? 'left' : 'right']: '20px',
        background: bg,
        color: 'white',
        padding: `${8 * f}px ${16 * f}px`,
        borderRadius: '30px',
        fontSize: `${12 * f}px`,
        fontWeight: 'bold',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        zIndex: 100,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: `${14 * f}px` }}>{icon || '📲'}</span>
      {text || 'Baixar App'}
    </div>
  );
};
