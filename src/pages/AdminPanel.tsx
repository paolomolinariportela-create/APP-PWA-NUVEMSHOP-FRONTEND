import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/AdminPanel.css";

// Interface dos dados
interface AppConfig {
  app_name: string;
  theme_color: string;
  logo_url: string;
  whatsapp_number: string;
}

// Interface das Estatísticas Reais
interface Stats {
  total: number;
  quantidade: number;
}

export default function AdminPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 1. SEGURANÇA: Pegamos o Token da URL (não mais o store_id direto)
  const tokenFromUrl = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado do Token (O Crachá de Acesso)
  const [token, setToken] = useState<string | null>(localStorage.getItem("app_token"));
  
  // Dados da Loja
  const [config, setConfig] = useState<AppConfig>({
    app_name: "Minha Loja",
    theme_color: "#000000",
    logo_url: "",
    whatsapp_number: ""
  });

  // Dados Reais (Vendas e Link)
  const [stats, setStats] = useState<Stats>({ total: 0, quantidade: 0 });
  const [storeUrl, setStoreUrl] = useState("");

  // URL do Backend
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // --- EFEITO 1: GERENCIAR LOGIN (JWT) ---
  useEffect(() => {
    if (tokenFromUrl) {
      // Se chegou um token novo na URL, salvamos e limpamos a URL para ficar seguro
      localStorage.setItem("app_token", tokenFromUrl);
      setToken(tokenFromUrl);
      setSearchParams({}); // Limpa a URL visualmente
    }
  }, [tokenFromUrl, setSearchParams]);

  // --- EFEITO 2: CARREGAR DADOS DA API ---
  useEffect(() => {
    // Só carrega se tivermos o crachá (Token)
    if (!token) return;

    setLoading(true);

    // Função para fazer chamadas seguras (Enviando o Crachá)
    const authFetch = (endpoint: string) => 
        fetch(`${API_URL}${endpoint}`, { 
            headers: { "Authorization": `Bearer ${token}` } 
        });

    // Carregamos tudo em paralelo
    Promise.all([
        authFetch("/admin/config").then(r => r.json()),
        authFetch("/stats/total-vendas").then(r => r.json()),
        authFetch("/admin/store-info").then(r => r.json())
    ]).then(([dataConfig, dataStats, dataUrl]) => {
        // Atualiza os estados com dados reais
        setConfig({
             app_name: dataConfig.app_name || "Minha Loja",
             theme_color: dataConfig.theme_color || "#000000",
             logo_url: dataConfig.logo_url || "",
             whatsapp_number: dataConfig.whatsapp_number || ""
        });
        setStats(dataStats);
        setStoreUrl(dataUrl.url);
    })
    .catch(err => {
        console.error("Erro de Autenticação:", err);
        // Se o token for inválido (Erro 401), avisamos o usuário
        alert("Sessão expirada ou inválida. Por favor, reinstale o aplicativo.");
        localStorage.removeItem("app_token");
        setToken(null);
    })
    .finally(() => setLoading(false));

  }, [token, API_URL]);

  // --- FUNÇÃO DE SALVAR (BLINDADA) ---
  const handleSave = async () => {
    if (!token) return alert("Erro de segurança: Token não encontrado.");
    setSaving(true);
    try {
      await fetch(`${API_URL}/admin/config`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // <--- Aqui vai a chave de segurança
        },
        body: JSON.stringify(config), // Não precisamos mandar store_id, o token já diz quem é!
      });
      alert("✨ Configurações salvas com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  // Funções Auxiliares de Marketing
  const copyLink = () => {
    const link = `${storeUrl}/pages/app`;
    navigator.clipboard.writeText(link);
    alert("Link copiado! Coloque na Bio do Instagram.");
  };

  // URL para gerar o QR Code (Google API)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(storeUrl + "/pages/app")}&color=${config.theme_color.replace("#", "")}`;

  // Se não tiver token, bloqueia a tela
  if (!token) return <div className="error-screen">🔒 Acesso Negado. Abra este app pelo painel da Nuvemshop.</div>;

  return (
    <div className="dashboard-container">
      {/* --- HEADER --- */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>App Builder <span className="badge">SECURE</span></h1>
          <div className="user-info">
            <span className="store-id">Painel Seguro</span>
            <div className="avatar">🔒</div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        
        {/* --- MÉTRICAS (AGORA COM DADOS REAIS) --- */}
        <section className="stats-grid">
          {/* Card 1: Receita Real */}
          <div className="stat-card" style={{ borderLeft: '4px solid #10B981' }}>
            <div className="stat-icon green">💰</div>
            <div className="stat-info">
              <h3>Receita Pelo App</h3>
              <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.total)}</p>
              <span className="stat-growth">
                 {stats.quantidade > 0 ? `🔥 ${stats.quantidade} vendas` : "Nenhuma venda ainda"}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">📱</div>
            <div className="stat-info">
              <h3>Instalações</h3>
              <p>--</p>
              <span className="stat-growth">Dados em tempo real</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">🚀</div>
            <div className="stat-info">
              <h3>Status</h3>
              <p>Ativo</p>
              <span className="stat-growth">App Seguro</span>
            </div>
          </div>
        </section>

        <div className="editor-grid">
          {/* --- COLUNA ESQUERDA: CONFIGURAÇÃO --- */}
          <div className="config-section">
            
            {/* NOVO CARD: Link Oficial (Vital para o lojista) */}
            <div className="card config-card" style={{ borderColor: '#8B5CF6' }}>
                <div className="card-header">
                    <h2 style={{ color: '#7C3AED' }}>🔗 Link de Download</h2>
                    <p>Divulgue este link no Instagram e WhatsApp.</p>
                </div>
                <div className="form-group">
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            readOnly 
                            value={storeUrl ? `${storeUrl}/pages/app` : "Carregando..."} 
                            style={{ backgroundColor: '#f9f9f9', color: '#555', flex: 1 }}
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

            {/* CARD: QR Code */}
            <div className="card config-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                <img src={qrCodeUrl} alt="QR Code" style={{width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #eee'}} />
                <div>
                    <h3 style={{fontSize: '16px', margin: '0 0 5px 0'}}>QR Code de Balcão</h3>
                    <a href={qrCodeUrl} download="qrcode.png" target="_blank" rel="noreferrer" style={{color: config.theme_color, textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>
                        ⬇️ Baixar Imagem
                    </a>
                </div>
            </div>

            {/* CARD: Identidade Visual (Seu código original) */}
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
                <h2>📞 Suporte</h2>
                <p>Botão de WhatsApp no App.</p>
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
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

          {/* --- COLUNA DIREITA: PREVIEW (Intacto) --- */}
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

                  {/* Bottom Navigation */}
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
