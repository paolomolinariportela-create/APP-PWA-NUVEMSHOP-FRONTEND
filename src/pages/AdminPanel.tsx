import React, { useState, useEffect } from 'react';

// Tenta pegar a URL da API automaticamente ou usa localhost
const API_URL = import.meta.env.VITE_API_URL || "https://web-production-0b509.up.railway.app"; 

function AdminPanel() {
  const [storeId, setStoreId] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Dados do App
  const [config, setConfig] = useState({
    app_name: "Minha Loja",
    theme_color: "#000000",
    logo_url: "",
    whatsapp: ""
  });

  // Dados Novos (Vendas e Link)
  const [stats, setStats] = useState({ total: 0, quantidade: 0 });
  const [storeUrl, setStoreUrl] = useState("");

  // 1. Carrega tudo ao abrir
  useEffect(() => {
    // Pega o ID da loja da URL (ex: ?store_id=123)
    const params = new URLSearchParams(window.location.search);
    const id = params.get("store_id");
    
    if (id) {
      setStoreId(id);
      loadData(id);
    } else {
      setLoading(false); 
    }
  }, []);

  async function loadData(id) {
    try {
      // 1. Pega Configurações Visuais
      const resConfig = await fetch(`${API_URL}/admin/config/${id}`);
      const dataConfig = await resConfig.json();
      setConfig(dataConfig);

      // 2. Pega Estatísticas de Venda (NOVO)
      const resStats = await fetch(`${API_URL}/stats/total-vendas/${id}`);
      const dataStats = await resStats.json();
      setStats(dataStats);

      // 3. Pega URL da Loja para gerar o Link (NOVO)
      const resUrl = await fetch(`${API_URL}/admin/store-info/${id}`);
      const dataUrl = await resUrl.json();
      setStoreUrl(dataUrl.url);

    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!storeId) return;
    try {
      await fetch(`${API_URL}/admin/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: storeId, ...config }),
      });
      alert("✨ Configurações salvas com sucesso!");
    } catch (error) {
      alert("Erro ao salvar.");
    }
  }

  // Função para criar página manualmente (caso o lojista queira recriar)
  async function handleCreatePage() {
    if(!confirm("Criar página de download na loja?")) return;
    try {
      await fetch(`${API_URL}/admin/create-page`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ store_id: storeId, ...config }),
      });
      alert("Página criada! Verifique em Minha Nuvemshop > Páginas");
    } catch (e) { alert("Erro ao criar página"); }
  }

  if (loading) return <div className="p-10 text-center">Carregando painel...</div>;
  if (!storeId) return <div className="p-10 text-center text-red-500">Erro: Abra este app pelo painel da Nuvemshop.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">App Builder <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">PRO</span></h1>
            <p className="text-gray-500 mt-1">Loja ID: {storeId}</p>
          </div>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition">
            Salvar Alterações
          </button>
        </div>

        {/* --- NOVOS CARDS DE MÉTRICAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Receita (O mais importante) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Receita Pelo App</h3>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.total)}
            </div>
            <p className="text-green-600 text-sm mt-1">💰 {stats.quantidade} vendas realizadas</p>
          </div>

          {/* Card 2: Link de Instalação */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 md:col-span-2">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Link de Download Oficial</h3>
            <div className="mt-3 flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={storeUrl ? `${storeUrl}/pages/app` : "Carregando link..."} 
                className="w-full bg-gray-100 border border-gray-300 text-gray-600 text-sm rounded-lg p-2.5"
              />
              <button 
                onClick={() => {navigator.clipboard.writeText(`${storeUrl}/pages/app`); alert("Copiado!");}}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-2 px-4 rounded-lg transition"
              >
                Copiar
              </button>
              <button 
                onClick={handleCreatePage}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-lg transition"
                title="Recriar página na loja"
              >
                🔄
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-2">Coloque este link na Bio do Instagram e envie no WhatsApp.</p>
          </div>
        </div>

        {/* ÁREA DE EDIÇÃO VISUAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🎨 Identidade Visual
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Aplicativo</label>
                  <input 
                    type="text" 
                    value={config.app_name}
                    onChange={(e) => setConfig({...config, app_name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: Minha Loja Oficial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cor Principal (Tema)</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="color" 
                      value={config.theme_color}
                      onChange={(e) => setConfig({...config, theme_color: e.target.value})}
                      className="h-10 w-10 border-none rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={config.theme_color}
                      onChange={(e) => setConfig({...config, theme_color: e.target.value})}
                      className="flex-1 border border-gray-300 rounded-lg p-3 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link da Logo (URL)</label>
                  <input 
                    type="text" 
                    value={config.logo_url}
                    onChange={(e) => setConfig({...config, logo_url: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-400 mt-1">Recomendado: Imagem quadrada (PNG) 512x512px.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Celular */}
          <div className="lg:col-span-1">
             <div className="sticky top-6">
                <h3 className="text-center font-bold text-gray-500 mb-4">Preview ao Vivo</h3>
                <div className="border-8 border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl bg-white max-w-[300px] mx-auto relative h-[600px]">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
                  
                  {/* Status Bar Fake */}
                  <div className="bg-gray-800 text-white text-[10px] px-6 py-2 flex justify-between items-center">
                    <span>9:41</span>
                    <div className="flex gap-1">📶 🔋</div>
                  </div>

                  {/* App Content */}
                  <div className="h-full flex flex-col relative bg-gray-50">
                    
                    {/* Header */}
                    <div style={{background: 'white', padding: '15px', borderBottom: '1px solid #eee', textAlign: 'center'}}>
                       <span style={{fontWeight: 'bold', color: '#333'}}>{config.app_name}</span>
                    </div>

                    {/* Banner Promocional Fake */}
                    <div className="m-4 h-32 bg-gray-200 rounded-lg animate-pulse"></div>

                    {/* Produtos Fake */}
                    <div className="grid grid-cols-2 gap-2 p-4 pt-0">
                       <div className="h-24 bg-gray-200 rounded-lg"></div>
                       <div className="h-24 bg-gray-200 rounded-lg"></div>
                       <div className="h-24 bg-gray-200 rounded-lg"></div>
                       <div className="h-24 bg-gray-200 rounded-lg"></div>
                    </div>

                    {/* Barra de Navegação (Preview Real) */}
                    <div style={{
                      position: 'absolute', bottom: 0, width: '100%', height: '65px', 
                      background: 'white', borderTop: '1px solid #eee', 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-around'
                    }}>
                       <div className="text-center">
                         <div style={{color: config.theme_color}}>🏠</div>
                         <div className="text-[9px]">Início</div>
                       </div>
                       <div className="text-center opacity-50">
                         <div>🔍</div>
                         <div className="text-[9px]">Buscar</div>
                       </div>
                       <div className="text-center opacity-50">
                         <div>🛒</div>
                         <div className="text-[9px]">Carrinho</div>
                       </div>
                    </div>

                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
