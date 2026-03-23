import React from 'react';
import { SizeOption } from '../phonePreview.types';
import { requestPushPermission, getSizeFactor } from '../phonePreview.utils';

interface TopBarProps {
  enabled?: boolean;
  position?: 'top' | 'bottom';
  text?: string;
  buttonText?: string;
  icon?: string;
  color?: string;
  textColor?: string;
  size?: SizeOption;
}

export const TopBar: React.FC<TopBarProps> = ({
  enabled,
  position = 'top',
  text,
  buttonText,
  icon,
  color,
  textColor,
  size = 'medium',
}) => {
  if (!enabled) return null;

  const f = getSizeFactor(size);
  const bg = color || '#111827';
  const tc = textColor || '#FFFFFF';
  const msg = text || 'Instale o app e ganhe 10% OFF na primeira compra';
  const btnText = buttonText || 'Instalar agora';

  const bar = (
    <div
      style={{
        width: '100%',
        background: bg,
        color: tc,
        padding: `${6 * f}px ${10 * f}px`,
        fontSize: `${10 * f}px`,
        borderTop: position === 'bottom' ? '1px solid rgba(0,0,0,0.1)' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon && <span style={{ fontSize: `${12 * f}px` }}>{icon}</span>}
        <span style={{ flex: 1 }}>{msg}</span>
        <button
          onClick={requestPushPermission}
          style={{
            background: '#FBBF24',
            border: 'none',
            borderRadius: 999,
            padding: `${4 * f}px ${10 * f}px`,
            fontSize: `${10 * f}px`,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {btnText}
        </button>
      </div>
    </div>
  );

  return bar;
};
