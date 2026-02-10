// src/pages/StoreApp.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/StoreApp.css'; // Importando o visual separado

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
      // Atualiza manifesto dinamicamente
      const manifestLink = document.getElementById('app-manifest') as HTMLLinkElement;
      if (manifestLink) {
        manifestLink.href = `${import.meta.env.VITE_API_URL}/manifest/${storeId}.json`;
      }

      // Busca dados em paralelo
      Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/config/${storeId}`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_URL}/products/${storeId}`).then(r => r.json())
      ]).then(([configData, productsData]) => {
        setConfig(configData);
        setProducts(productsData);
      });
    }
  }, [storeId]);

  return (
    <div className="app-container">
      <header className="app-header" style={{ backgroundColor: config.theme_color }}>
        <h2 className="app-title">{config.app_name}</h2>
      </header>

      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} className="product-image" />
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p className="product-price" style={{ color: config.theme_color }}>
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <nav className="bottom-nav">
        <div className="nav-item active" style={{ color: config.theme_color }}>
          <span className="nav-icon">🏠</span>
          <span>Início</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">🔍</span>
          <span>Buscar</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">🛒</span>
          <span>Carrinho</span>
        </div>
      </nav>
    </div>
  );
}
