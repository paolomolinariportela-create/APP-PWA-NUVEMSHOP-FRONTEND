import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [config, setConfig] = useState({
    app_name: "Minha Loja",
    theme_color: "#000000",
    logo_url: "",
    whatsapp: ""
  });
  const [loading, setLoading] = useState(false);
  
  // Pega o store_id da URL (ex: ?store_id=1234)
  const params = new URLSearchParams(window.location.search);
  const storeId = params.get('store_id');

  const handleSave = async () => {
    setLoading(true);
    // Envia para o seu Backend Python
    await fetch(`${import.meta.env.VITE_API_URL}/admin/config`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ ...config, store_id: storeId })
    });
    alert("App Configurado com Sucesso! 🚀");
    setLoading(false);
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>📲 Configurar meu App</h1>
      <p>Personalize como seu aplicativo vai aparecer no celular dos clientes.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        
        <label>
          <strong>Nome do App (que fica embaixo do ícone)</strong>
          <input 
            type="text" 
            value={config.app_name}
            onChange={e => setConfig({...config, app_name: e.target.value})}
            style={{ width: '100%', padding: 10, marginTop: 5 }}
          />
        </label>

        <label>
          <strong>Cor Principal (Tema)</strong>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input 
              type="color" 
              value={config.theme_color}
              onChange={e => setConfig({...config, theme_color: e.target.value})}
              style={{ height: 40, width: 60 }}
            />
            <span>{config.theme_color}</span>
          </div>
        </label>

        <label>
          <strong>URL da Logo (Link da Imagem)</strong>
          <input 
            type="text" 
            placeholder="https://..."
            value={config.logo_url}
            onChange={e => setConfig({...config, logo_url: e.target.value})}
            style={{ width: '100%', padding: 10, marginTop: 5 }}
          />
        </label>

        <button 
          onClick={handleSave}
          disabled={loading}
          style={{ 
            padding: 15, 
            background: '#2D3279', 
            color: 'white', 
            border: 'none', 
            borderRadius: 8, 
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: 20
          }}
        >
          {loading ? "Salvando..." : "SALVAR CONFIGURAÇÃO"}
        </button>

        <hr />
        
        <h3>👀 Visualizar meu App</h3>
        <p>Acesse este link no seu celular para testar:</p>
        <a href={`/?store_id=${storeId}`} target="_blank" style={{ color: 'blue' }}>
          Abrir App Agora
        </a>

      </div>
    </div>
  );
}
