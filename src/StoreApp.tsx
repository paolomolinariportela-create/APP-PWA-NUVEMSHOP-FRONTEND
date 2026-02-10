import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function StoreApp() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('store_id');
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState({ app_name: 'Carregando...', theme_color: '#000000' });

  useEffect(() => {
    if (storeId) {
      // 1. Atualiza o Manifesto para permitir instalação
      const manifestLink = document.getElementById('app-manifest') as HTMLLinkElement;
      if (manifestLink) {
        manifestLink.href = `${import.meta.env.VITE_API_URL}/manifest/${storeId}.json`;
      }

      // 2. Busca configurações de cor e nome da loja
      fetch(`${import.meta.env.VITE_API_URL}/admin/config/${storeId}`)
        .then(res => res.json())
        .then(data => setConfig(data));

      // 3. Busca os produtos reais da loja
      fetch(`${import.meta.env.VITE_API_URL}/products/${storeId}`)
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  }, [storeId]);

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' 
    }}>
      
      {/* Header Fixo */}
      <header style={{ 
        backgroundColor: config.theme_color, 
        color: '#fff', 
        padding: '15px', 
        textAlign: 'center', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{config.app_name}</h2>
      </header>

      {/* Banner de Boas-vindas */}
      <div style={{ padding: '20px', background: '#fff', marginBottom: '10px' }}>
        <h3 style={{ margin: '0 0 5px 0' }}>👋 Olá!</h3>
        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Confira nossas novidades de hoje.</p>
      </div>

      {/* Grid de Produtos Style App */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '10px', 
        padding: '10px' 
      }}>
        {products.map(product => (
          <div key={product.id} style={{ 
            backgroundColor: '#fff', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
          }}>
            <img 
              src={product.image_url || 'https://via.placeholder.com/200'} 
              alt={product.name}
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
            />
            <div style={{ padding: '10px' }}>
              <p style={{ 
                margin: '0 0 5px 0', 
                fontSize: '0.85rem', 
                fontWeight: 500,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>{product.name}</p>
              <p style={{ 
                margin: 0, 
                color: config.theme_color, 
                fontWeight: 'bold',
                fontSize: '1rem' 
              }}>R$ {product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Espaçamento para não cobrir o último produto com o menu */}
      <div style={{ height: '80px' }}></div>

      {/* Tab Bar Inferior (Estilo Mobile Nativo) */}
      <nav style={{ 
        position: 'fixed', 
        bottom: 0, 
        width: '100%', 
        backgroundColor: '#fff', 
        borderTop: '1px solid #eee', 
        display: 'flex', 
        justifyContent: 'space-around', 
        padding: '10px 0',
        zIndex: 100
      }}>
        <div style={{ textAlign: 'center', color: config.theme_color }}>
          <div style={{ fontSize: '20px' }}>🏠</div>
          <span style={{ fontSize: '10px' }}>Início</span>
        </div>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '20px' }}>🔍</div>
          <span style={{ fontSize: '10px' }}>Buscar</span>
        </div>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '20px' }}>🛒</div>
          <span style={{ fontSize: '10px' }}>Carrinho</span>
        </div>
      </nav>
    </div>
  );
}
