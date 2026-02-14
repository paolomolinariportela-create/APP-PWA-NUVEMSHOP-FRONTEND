import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/AdminPanel.css";

// Interface dos Dados Completos (Dashboard) - ATUALIZADA COM NOVOS CAMPOS
interface DashboardStats {
  receita: number;
  vendas: number;
  instalacoes: number;
  carrinhos_abandonados: { valor: number; qtd: number };
  taxa_conversao: { app: number; site: number };
  economia_ads: number;
  top_produtos: Array<{ nome: string; vendas: number }>;
  // Novos Campos
  visualizacoes: { pageviews: number; tempo_medio: string; top_paginas: string[] };
  funil: { visitas: number; carrinho: number; checkout: number };
  recorrencia: { clientes_2x: number; taxa_recompra: number };
  ticket_medio: { app: number; site: number };
}

// Interface da Configuração
interface AppConfig {
  app_name: string;
  theme_color: string;
  logo_url: string;
  whatsapp_number: string;
}

export default function AdminPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 1. SEGURANÇA: Pegamos o Token da URL
  const tokenFromUrl = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado do Token (O Crachá de Acesso)
  const [token, setToken] = useState<string | null>(localStorage.getItem("app_token"));
  
  // URL do Backend
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // --- ESTADOS DE DADOS ---
  const [storeUrl, setStoreUrl] = useState("");
  
  const [config, setConfig] = useState<AppConfig>({
    app_name: "Minha Loja",
    theme_color: "#000000",
    logo_url: "",
    whatsapp_number: ""
  });

  // Novos dados do Dashboard (Inicializados com zeros)
  const [stats, setStats] = useState<DashboardStats>({
    receita: 0, 
    vendas: 0, 
    instalacoes: 0,
    carrinhos_abandonados: { valor: 0, qtd: 0 },
    taxa_conversao: { app: 0, site: 0 },
    economia_ads: 0,
    top_produtos: [],
    // Inicialização dos Novos Cards
    visualizacoes: { pageviews: 0, tempo_medio: "--", top_paginas: [] },
    funil: { visitas: 0, carrinho: 0, checkout: 0 },
    recorrencia: { clientes_2x: 0, taxa_recompra: 0 },
    ticket_medio: { app: 0, site: 0 }
  });

  // --- EFEITO 1: GERENCIAR LOGIN (JWT) ---
  useEffect(() => {
    if (tokenFromUrl) {
      localStorage.setItem("app_token", tokenFromUrl);
      setToken(tokenFromUrl);
      setSearchParams({}); // Limpa a URL visualmente
    }
  }, [tokenFromUrl, setSearchParams]);

  // --- EFEITO 2: CARREGAR DADOS DA API ---
  useEffect(() => {
    if (!token) return;
    setLoading(true);

    const authFetch = (endpoint: string) => 
        fetch(`${API_URL}${endpoint}`, { headers: { "Authorization": `Bearer ${token}` } });

    Promise.all([
        authFetch("/admin/config").then(r => r.json()),
        authFetch("/stats/dashboard").then(r => r.json()), // <--- ROTA NOVA DOS CARDS
        authFetch("/admin/store-info").then(r => r.json())
    ]).then(([dataConfig, dataStats, dataUrl]) => {
        
        setConfig({
             app_name: dataConfig.app_name || "Minha Loja",
             theme_color: dataConfig.theme_color || "#000000",
             logo_url: dataConfig.logo_url || "",
             whatsapp_number: dataConfig.whatsapp_number || ""
        });
        
        setStats(dataStats); // Carrega os cards novos
        setStoreUrl(dataUrl.url);
    })
    .catch(err => {
        console.error("Erro de Autenticação:", err);
        if(err.status === 401) {
             alert("Sessão expirada. Reinstale o aplicativo.");
             localStorage.removeItem("app_token");
             setToken(null);
        }
    })
    .finally(() => setLoading(false));

  }, [token, API_URL]);

  // --- FUNÇÃO DE SALVAR ---
  const handleSave = async () => {
    if (!token) return alert("Erro de segurança: Token não encontrado.");
    setSaving(true);
    try {
      await fetch(`${API_URL}/admin/config`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(config),
      });
      alert("✨ Configurações salvas com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  // Funções Auxiliares
  const copyLink = () => {
    const link = `${storeUrl}/pages/app`;
    navigator.clipboard.writeText(link);
    alert("Link copiado! Divulgue no Instagram.");
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(storeUrl + "/pages/app")}&color=${config.theme_color.replace("#", "")}`;

  // Se não tiver token, bloqueia a tela
  if (!token) return <div className="error-screen">🔒 Acesso Negado. Abra este app pelo painel da Nuvemshop.</div>;

  return (
    <div className="dashboard-container">
      {/* --- HEADER --- */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>App Builder <span className="badge">PRO</span></h1>
          <div className="user-info">
            <span className="store-id">Painel Seguro</span>
            <div className="avatar">🔒</div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        
        {/* --- NOVA GRID DE CARDS ESTRATÉGICOS --- */}
        <section className="stats-grid">
            
            {/* 1. RECEITA (O mais importante) */}
            <div className="stat-card" style={{borderLeft: '4px solid #10B981'}}>
                <div className="stat-icon green">💰</div>
                <div className="stat-info">
                    <h3>Receita App</h3>
                    <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.receita)}</p>
                    <span className="stat-growth">🔥 {stats.vendas} pedidos realizados</span>
                </div>
            </div>

            {/* 2. TICKET MÉDIO (NOVO 🆕) */}
            <div className="stat-card">
                <div className="stat-icon" style={{background: '#F0F9FF', color: '#0369A1'}}>💳</div>
                <div className="stat-info">
                    <h3>Ticket Médio</h3>
                    <div style={{marginTop: '10px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                            <span style={{color:'#10B981', fontWeight:'bold'}}>App: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.ticket_medio.app)}</span>
                            <span style={{fontSize:'10px', background:'#DCFCE7', color:'#15803D', padding:'2px 6px', borderRadius:'4px'}}>+30%</span>
                        </div>
                        <div style={{fontSize:'12px', color:'#666'}}>
                            Site: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.ticket_medio.site)}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. INSTALAÇÕES */}
            <div className="stat-card">
                <div className="stat-icon purple">📱</div>
                <div className="stat-info">
                    <h3>Instalações Ativas</h3>
                    <p>{stats.instalacoes}</p>
                    <span className="stat-growth">Base de clientes fiéis</span>
                </div>
            </div>

            {/* 4. RECORRÊNCIA (NOVO 🆕) */}
            <div className="stat-card">
                <div className="stat-icon blue">🔁</div>
                <div className="stat-info">
                    <h3>Clientes Recorrentes</h3>
                    <p>{stats.recorrencia.clientes_2x}</p>
                    <span className="stat-growth">Compraram 2x ou mais</span>
                    <div style={{fontSize: '11px', color: '#666', marginTop: '4px'}}>Taxa de Recompra: <strong>{stats.recorrencia.taxa_recompra}%</strong></div>
                </div>
            </div>

            {/* 5. VISUALIZAÇÕES (NOVO 🆕) */}
            <div className="stat-card">
                <div className="stat-icon" style={{background:'#FFF7ED', color:'#C2410C'}}>👀</div>
                <div className="stat-info">
                    <h3>Engajamento</h3>
                    <p>{stats.visualizacoes.pageviews.toLocaleString()}</p>
                    <span className="stat-growth">Pageviews este mês</span>
                    <div style={{marginTop: '8px', fontSize: '11px', color: '#555'}}>
                        ⏱️ Tempo médio: <strong>{stats.visualizacoes.tempo_medio}</strong>
                    </div>
                </div>
            </div>

            {/* 6. FUNIL BÁSICO (NOVO 🆕) */}
            <div className="stat-card" style={{gridRow: 'span 2'}}>
                <div className="stat-info" style={{width: '100%'}}>
                    <h3>Funil de Vendas 📉</h3>
                    <div style={{marginTop: '15px'}}>
                        {/* Etapa 1 */}
                        <div className="conversion-bar">
                            <div className="bar-label"><span>1. Visitas</span> <strong>{stats.funil.visitas}</strong></div>
                            <div className="bar-track"><div className="bar-fill" style={{width: '100%', background: '#9CA3AF'}}></div></div>
                        </div>
                        {/* Etapa 2 */}
                        <div className="conversion-bar">
                            <div className="bar-label"><span>2. Carrinho</span> <strong>{stats.funil.carrinho}</strong></div>
                            <div className="bar-track"><div className="bar-fill" style={{width: '32%', background: '#60A5FA'}}></div></div>
                        </div>
                        {/* Etapa 3 */}
                        <div className="conversion-bar">
                            <div className="bar-label"><span>3. Checkout</span> <strong>{stats.funil.checkout}</strong></div>
                            <div className="bar-track"><div className="bar-fill" style={{width: '11%', background: '#10B981'}}></div></div>
                        </div>
                        <small style={{display:'block', marginTop:'10px', color:'#666', fontSize:'10px'}}>
                            32% de conversão para carrinho
                        </small>
                    </div>
                </div>
            </div>

            {/* 7. CARRINHOS ABANDONADOS */}
            <div className="stat-card" style={{borderLeft: '4px solid #ef4444'}}>
                <div className="stat-icon red">💸</div>
                <div className="stat-info">
                    <h3>Carrinhos Abandonados</h3>
                    <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.carrinhos_abandonados.valor)}</p>
                    <button style={{marginTop: '5px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold'}}>
                        🔔 RECUPERAR AGORA
                    </button>
                </div>
            </div>

            {/* 8. TAXA DE CONVERSÃO */}
            <div className="stat-card">
                <div className="stat-info" style={{width: '100%'}}>
                    <h3>Taxa de Conversão 🏆</h3>
                    <div className="conversion-bar">
                        <div className="bar-label"><span>App PWA</span> <strong>{stats.taxa_conversao.app}%</strong></div>
                        <div className="bar-track"><div className="bar-fill" style={{width: `${stats.taxa_conversao.app * 20}%`, background: '#10B981'}}></div></div>
                    </div>
                    <div className="conversion-bar">
                        <div className="bar-label"><span>Site Mobile</span> <strong>{stats.taxa_conversao.site}%</strong></div>
                        <div className="bar-track"><div className="bar-fill" style={{width: `${stats.taxa_conversao.site * 20}%`, background: '#9ca3af'}}></div></div>
                    </div>
                </div>
            </div>

             {/* 9. ECONOMIA DE ADS */}
             <div className="stat-card">
                <div className="stat-icon blue">📉</div>
                <div className="stat-info">
                    <h3>Economia em Ads</h3>
                    <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.economia_ads)}</p>
                    <span className="stat-growth">Tráfego grátis via Push</span>
                </div>
            </div>
        </section>

        <div className="editor-grid" style={{marginTop: '30px'}}>
          {/* --- COLUNA ESQUERDA: CONFIGURAÇÃO --- */}
          <div className="config-section">
            
            {/* CARD: Link Oficial */}
            <div className="config-card" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
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
                            style={{ backgroundColor: 'white', color: '#555', flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
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
            <div className="config-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px', display: 'flex' }}>
                <img src={qrCodeUrl} alt="QR Code" style={{width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #eee'}} />
                <div>
                    <h3 style={{fontSize: '16px', margin: '0 0 5px 0'}}>QR Code de Balcão</h3>
                    <a href={qrCodeUrl} download="qrcode.png" target="_blank" rel="noreferrer" style={{color: config.theme_color, textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>
                        ⬇️ Baixar Imagem
                    </a>
                </div>
            </div>

            {/* CARD: Identidade Visual */}
            <div className="config-card">
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

            {/* CARD: Suporte */}
            <div className="config-card">
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

          {/* --- COLUNA DIREITA: PREVIEW --- */}
          <div className="preview-section">
            <div className="sticky-wrapper">
              <h3 style={{textAlign: 'center', marginBottom: '10px'}}>Preview ao Vivo</h3>
              <p style={{textAlign: 'center', marginBottom: '20px', fontSize: '12px', color: '#666'}}>Como seu cliente vê o App</p>
              
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
