import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/AdminPanel.css";

// Interface dos dados de Configuração
interface AppConfig {
  app_name: string;
  theme_color: string;
  logo_url: string;
  whatsapp_number: string;
}

// Interface dos dados de Vendas (Novo)
interface Stats {
  total: number;
  quantidade: number;
}

export default function AdminPanel() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("store_id");
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado da Configuração
  const [config, setConfig] = useState<AppConfig>({
    app_name: "Minha Loja",
    theme_color: "#000000",
    logo_url: "",
    whatsapp_number: ""
  });

  // Novos Estados: Estatísticas e URL
  const [stats, setStats] = useState<Stats>({ total: 0, quantidade: 0 });
  const [storeUrl, setStoreUrl] = useState("");

  // URL do Backend (pega do .env ou usa localhost)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Carregar dados ao abrir
  useEffect(() => {
    if (!storeId) return;
    setLoading(true);

    // 1. Busca Configurações Visuais
    fetch(`${API_URL}/admin/config/${storeId}`)
      .then((res) => res.json())
      .then((data) => {
        setConfig({
          app_name: data.app_name || "Minha Loja",
          theme_color: data.theme_color || "#000000",
          logo_url: data.logo_url || "",
          whatsapp_number: data.whatsapp_number || ""
        });
      })
      .catch((err) => console.error("Erro ao carregar config:", err));

    // 2. Busca Estatísticas de Venda (Receita)
    fetch(`${API_URL}/stats/total-vendas/${storeId}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Erro ao carregar stats:", err));

    // 3. Busca URL da Loja para o Link
    fetch(`${API_URL}/admin/store-info/${storeId}`)
      .then((res) => res.json())
      .then((data) => setStoreUrl(data.url))
      .catch((err) => console.error("Erro ao carregar url:", err))
      .finally(() => setLoading(false));

  }, [storeId, API_URL]);

  // Salvar dados
  const handleSave = async () => {
    if (!storeId) return alert("Loja não identificada!");
    setSaving(true);
    try {
      await fetch(`${API_URL}/admin/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: storeId, ...config }),
      });
      alert("✨ Configurações salvas com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  // Função para copiar o link
  const copyLink = () => {
    const link = `${storeUrl}/pages/app`;
    navigator.clipboard.writeText(link);
    alert("Link copiado! Coloque na bio do Instagram.");
  };

  if (!storeId) return <div className="error-screen">🚫 ID da loja não fornecido na URL.</div>;

  return (
    <div className="dashboard-container">
      {/* --- HEADER --- */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>App Builder <span className="badge">PRO</span></h1>
          <div className="user-info">
            <span className="store-id">Loja: {storeId}</span>
            <div className="avatar">L</div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        
        {/* --- MÉTRICAS (STATS - ATUALIZADO COM VENDAS REAIS) --- */}
        <section className="stats-grid">
          
          {/* Card de Receita (O mais importante) */}
          <div className="stat-card" style={{ borderLeft: '4px solid #10B981' }}>
            <div className="stat-icon green">💰</div>
            <div className="stat-info">
              <h3>Receita Pelo App</h3>
              <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.total)}</p>
              <span className="stat-growth">
                {stats.quantidade === 0 ? "Nenhuma venda ainda" : `🔥 ${stats.quantidade} vendas realizadas`}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">👀</div>
            <div className="stat-info">
              <h3>Visualizações</h3>
              <p>--</p>
              <span className="stat-growth">Dados em tempo real</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">📱</div>
            <div className="stat-info">
              <h3>Instalações</h3>
              <p>--</p>
              <span className="stat-growth">Disponível em breve</span>
            </div>
          </div>
        </section>

        <div className="editor-grid">
          {/* --- COLUNA ESQUERDA: CONFIGURAÇÃO --- */}
          <div className="config-section">
            
            {/* NOVO CARD: Link de Download Oficial */}
            <div className="card config-card" style={{ borderColor: '#8B5CF6' }}>
                <div className="card-header">
                    <h2 style={{ color: '#7C3AED' }}>🔗 Link de Download</h2>
                    <p>Página oficial criada automaticamente na sua loja.</p>
                </div>
                <div className="form-group">
                    <label>Link para divulgar (Instagram/WhatsApp)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            readOnly 
                            value={storeUrl ? `${storeUrl}/pages/app` : "Carregando..."} 
                            style={{ backgroundColor: '#f9f9f9', color: '#555' }}
                        />
                        <button 
                            onClick={copyLink}
                            style={{ 
                                background: '#8B5CF6', color: 'white', border: 'none', 
                                borderRadius: '8px', cursor: 'pointer', padding: '0 20px', fontWeight: 'bold' 
                            }}
                        >
                            Copiar
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="card config-card">
              <div className="card-header">
                <h2>🎨 Identidade Visual</h2>
                <p>Personalize como seu App aparece para o cliente.</p>
              </div>
              
              <div className="form-group">
                <label>Nome do Aplicativo</label>
                <input 
                  type="text" 
                  value={config.app_name}
                  onChange={(e) => setConfig({...config, app_name: e.target.value})}
                  placeholder="Ex: Minha Loja Oficial"
                />
              </div>

              <div className="form-group">
                <label>Cor Principal (Tema)</label>
                <div className="color-picker-wrapper">
                  <input 
                    type="color" 
                    value={config.theme_color}
                    onChange={(e) => setConfig({...config, theme_color: e.target.value})}
                  />
                  <input 
                    type="text" 
                    value={config.theme_color}
                    onChange={(e) => setConfig({...config, theme_color: e.target.value})}
                    className="color-text"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Logo URL (Link da Imagem)</label>
                <input 
                  type="text" 
                  value={config.logo_url}
                  onChange={(e) => setConfig({...config, logo_url: e.target.value})}
                  placeholder="https://..."
                />
                <small>Recomendado: Imagem quadrada (PNG) 512x512px</small>
              </div>
            </div>

            <div className="card config-card">
              <div className="card-header">
                <h2>🚀 Conversão</h2>
                <p>Ferramentas para vender mais.</p>
              </div>
              <div className="form-group">
                <label>WhatsApp para Suporte</label>
                <input 
                  type="text" 
                  value={config.whatsapp_number}
                  onChange={(e) => setConfig({...config, whatsapp_number: e.target.value})}
                  placeholder="5511999999999"
                />
              </div>
            </div>

            <button 
              className="save-button" 
              onClick={handleSave} 
              disabled={saving || loading}
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>

          {/* --- COLUNA DIREITA: PREVIEW --- */}
          <div className="preview-section">
            <div className="sticky-wrapper">
              <h3>Preview ao Vivo</h3>
              <p>Como seu cliente vê o App</p>
              
              <div className="phone-mockup">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  {/* Simulação da Barra de Status */}
                  <div className="status-bar" style={{ backgroundColor: config.theme_color }}>
                    <span>9:41</span>
                    <div className="status-icons">📶 🔋</div>
                  </div>

                  {/* Simulação do App */}
                  <div className="app-content">
                    {/* Header do App */}
                    <div className="app-header" style={{ borderBottom: `2px solid ${config.theme_color}` }}>
                      {config.logo_url && <img src={config.logo_url} alt="Logo" className="app-logo-mini" />}
                      <span style={{ color: config.theme_color, fontWeight: 'bold' }}>
                        {config.app_name}
                      </span>
                    </div>

                    {/* Banner Simulado */}
                    <div className="skeleton-banner"></div>
                    
                    {/* Produtos Simulados */}
                    <div className="skeleton-grid">
                      <div className="skeleton-product"></div>
                      <div className="skeleton-product"></div>
                      <div className="skeleton-product"></div>
                      <div className="skeleton-product"></div>
                    </div>
                  </div>

                  {/* Bottom Navigation (A nossa mágica) */}
                  <div className="bottom-nav">
                    <div className="nav-item" style={{ color: config.theme_color }}>
                      <span>🏠</span>
                      <small>Início</small>
                    </div>
                    <div className="nav-item">
                      <span>🔍</span>
                      <small>Buscar</small>
                    </div>
                    <div className="nav-item">
                      <span>🛒</span>
                      <small>Carrinho</small>
                    </div>
                  </div>

                  {/* Home Bar do iPhone */}
                  <div className="home-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
