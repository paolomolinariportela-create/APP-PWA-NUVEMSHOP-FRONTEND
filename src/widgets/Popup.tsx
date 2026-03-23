import React from 'react';
import { requestPushPermission } from '../phonePreview.utils';

interface PopupProps {
  enabled?: boolean;
  imageUrl?: string;
}

export const Popup: React.FC<PopupProps> = ({ enabled, imageUrl }) => {
  if (!enabled || !imageUrl) return null;

  return (
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
            backgroundImage: `url(${imageUrl})`,
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
            onClick={requestPushPermission}
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
  );
};
