import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const [params] = useSearchParams();
  const storeId = params.get('store_id') || 'demo'; // Pega ID da URL ou usa demo
  
  const [config, setConfig] = useState({
    store_id: storeId,
    app_name: '',
    theme_color: '#000000',
    whatsapp: '',
    logo_url: ''
  });

  const [loading, setLoading] = useState(false);

  // Carrega configuração salva
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/config/${storeId}`)
      .then(res => res.json())
      .then(data => {
        if(data.app_name) setConfig(prev => ({...prev, ...data}));
      });
  }, [storeId]);

  const handleSave = async () => {
    setLoading(true);
    await fetch(`${import.meta.env.VITE_API_URL}/admin/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    setLoading(false);
    alert('Configuração Salva! Agora copie o script abaixo.');
  };

  // O Script Mágico
  const scriptTag = `<script src="${import.meta.env.VITE_API_URL}/loader.js?store_id=${storeId}"></script>`;

  return (
    <div className="admin-container">
      
      {/* ESQUERDA: Formulário */}
      <div className="config-section">
        <h1>⚙️ Configurar App PWA</h1>
        <p style={{color: '#666', marginBottom: '30px'}}>Personalize como sua loja vai aparecer no celular dos clientes.</p>

        <div className="input-group">
          <label>Nome do Aplicativo</label>
          <input 
            className="input-field"
            value={config.app_name}
            onChange={e => setConfig({...config, app_name: e.target.value})}
            placeholder="Ex: Minha Loja Oficial"
          />
        </div>

        <div className="input-group">
          <label>Cor do Tema (Cabeçalho e Botões)</label>
          <div style={{display: 'flex', gap: '10px'}}>
            <input 
              type="color" 
              className="input-field color-picker"
              value={config.theme_color}
              onChange={e => setConfig({...config, theme_color: e.target.value})}
            />
            <input 
              className="input-field"
              value={config.theme_color}
              onChange={e => setConfig({...config, theme_color: e.target.value})}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Link da Logo (URL)</label>
          <input 
            className="input-field"
            value={config.logo_url}
            onChange={e => setConfig({...config, logo_url: e.target.value})}
            placeholder="https://..."
          />
        </div>

        <div className="input-group">
          <label>WhatsApp (Para botão flutuante)</label>
          <input 
            className="input-field"
            value={config.whatsapp}
            onChange={e => setConfig({...config, whatsapp: e.target.value})}
            placeholder="5511999999999"
          />
        </div>

        <button className="save-btn" onClick={handleSave}>
          {loading ? 'Salvando...' : '💾 Salvar Alterações'}
        </button>

        <hr style={{margin: '30px 0', border: '1px solid #eee'}} />

        <h3>🚀 Instalação</h3>
        <p style={{fontSize: '0.9rem'}}>Copie este código e cole em <strong>Configurações &gt; Códigos de Rastreamento</strong> na sua Nuvemshop:</p>
        
        <div className="script-box" onClick={() => navigator.clipboard.writeText(scriptTag)}>
          {scriptTag}
          <div style={{position:'absolute', top: 5, right: 10, fontSize: '0.7rem', color: 'white', cursor:'pointer'}}>CLIQUE PARA COPIAR</div>
        </div>
      </div>

      {/* DIREITA: Preview do Celular */}
      <div className="preview-section">
        <div className="phone-mockup">
          <div className="phone-notch"></div>
          
          {/* Header do App Simulado */}
          <div style={{background: config.theme_color, padding: '40px 15px 15px', color: 'white', textAlign: 'center'}}>
            <div style={{fontWeight: 'bold'}}>{config.app_name || 'Nome da Loja'}</div>
          </div>

          {/* Conteúdo Simulado */}
          <div style={{flex: 1, background: 'white', padding: '10px', overflow: 'hidden'}}>
            <div style={{background: '#f3f4f6', height: '150px', borderRadius: '8px', marginBottom: '10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#999'}}>Banner da Loja</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
              <div style={{height: '120px', background: '#f3f4f6', borderRadius: '8px'}}></div>
              <div style={{height: '120px', background: '#f3f4f6', borderRadius: '8px'}}></div>
            </div>
          </div>

          {/* Menu Inferior Simulado */}
          <div style={{borderTop: '1px solid #eee', padding: '10px', display: 'flex', justifyContent: 'space-around'}}>
            <div style={{textAlign:'center', color: config.theme_color}}>🏠<br/><span style={{fontSize:'8px'}}>Início</span></div>
            <div style={{textAlign:'center', color: '#ccc'}}>🔍<br/><span style={{fontSize:'8px'}}>Buscar</span></div>
            <div style={{textAlign:'center', color: '#ccc'}}>🛒<br/><span style={{fontSize:'8px'}}>Carrinho</span></div>
          </div>

          {/* Botão WhatsApp Simulado */}
          {config.whatsapp && (
             <div style={{
               position: 'absolute', bottom: '70px', right: '15px', 
               width: '45px', height: '45px', borderRadius: '50%', 
               background: config.theme_color, display:'flex', alignItems:'center', 
               justifyContent:'center', color:'white', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
             }}>💬</div>
          )}

        </div>
      </div>
    </div>
  );
}
