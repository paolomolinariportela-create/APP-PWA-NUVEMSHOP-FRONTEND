
import React from 'react';

interface WhatsAppProps {
  number: string;
  color: string;
}

export default function WhatsAppButton({ number, color }: WhatsAppProps) {
  if (!number) return null; // Se não tiver número, não mostra nada

  const message = encodeURIComponent("Olá! Vi seu app e gostaria de tirar uma dúvida.");
  const url = `https://wa.me/${number}?text=${message}`;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '85px', // Acima da barra de navegação
        right: '20px',
        backgroundColor: color,
        width: '60px',
        height: '60px',
        borderRadius: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 999,
        transition: 'transform 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="35" height="35" viewBox="0 0 24 24" fill="#fff">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.438-9.89 9.886-.001 2.124.593 3.717 1.595 5.392l-.999 3.647 3.894-.939z"/>
      </svg>
    </a>
  );
}
