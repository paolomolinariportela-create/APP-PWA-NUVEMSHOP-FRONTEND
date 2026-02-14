// 1. Adicione um estado para guardar a URL da loja
const [storeUrl, setStoreUrl] = useState("");

// 2. No useEffect, busque essa URL
useEffect(() => {
    if (!storeId) return;
    // ... (fetch config existente) ...
    
    // Novo Fetch para pegar a URL
    fetch(`${API_URL}/admin/store-info/${storeId}`)
      .then(res => res.json())
      .then(data => setStoreUrl(data.url));
}, [storeId]);

// 3. No JSX (dentro do return), adicione este Card de Sucesso:
<div className="card config-card" style={{borderColor: '#10B981', background: '#ecfdf5'}}>
    <div className="card-header">
        <h2 style={{color: '#059669'}}>✅ Tudo Pronto!</h2>
        <p>Seu App já está instalado e sua página de download foi criada.</p>
    </div>
    
    <div className="form-group">
        <label>Link oficial para seus clientes baixarem:</label>
        <div style={{display: 'flex', gap: '10px'}}>
            <input 
                type="text" 
                readOnly 
                value={storeUrl ? `${storeUrl}/pages/app` : "Carregando..."} 
                style={{background: 'white', color: '#059669', fontWeight: 'bold'}}
            />
            <button 
                onClick={() => {navigator.clipboard.writeText(`${storeUrl}/pages/app`); alert("Copiado!");}}
                style={{background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '0 15px'}}
            >
                Copiar
            </button>
        </div>
        <small>Dica: Coloque este link na Bio do Instagram e envie no WhatsApp.</small>
    </div>
</div>
