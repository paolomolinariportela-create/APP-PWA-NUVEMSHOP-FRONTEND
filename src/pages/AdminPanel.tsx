import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/AdminPanel.css";

// Interface dos Dados Completos
interface DashboardStats {
  receita: number;
  vendas: number;
  instalacoes: number;
  carrinhos_abandonados: { valor: number; qtd: number };
  taxa_conversao: { app: number; site: number };
  economia_ads: number;
  top_produtos: Array<{ nome: string; vendas: number }>;
  visualizacoes: { pageviews: number; tempo_medio: string; top_paginas: string[] };
  funil: { visitas: number; carrinho: number; checkout: number };
  recorrencia: { clientes_2x: number; taxa_recompra: number };
  ticket_medio: { app: number; site: number };
}

// Interface da Configuração (ATUALIZADA COM FAB)
interface AppConfig {
  app_name: string;
  theme_color: string;
  logo_url: string;
  whatsapp_number: string;
  fab_enabled?: boolean; // Novo campo opcional
  fab_text?: string;     // Novo campo opcional
}

// --- COMPONENTE PRINCIPAL (EXPORT DEFAULT CORRIGIDO) ---
export default function AdminPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem("app_token"));
  const [activeTab, setActiveTab] = useState("dashboard");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [storeUrl, setStoreUrl] = useState("");
  
  // Estado Inicial da Configuração
  const [config, setConfig] = useState<AppConfig>({
    app_name: "Minha Loja",
    theme_color: "#000000",
    logo_url: "",
    whatsapp_number: "",
    fab_enabled: false,
    fab_text: "Baixar App"
  });

  const [stats, setStats] = useState<DashboardStats>({
    receita: 0, vendas: 0, instalacoes: 0,
    carrinhos_abandonados: { valor: 0, qtd: 0 },
    taxa_conversao: { app: 0, site: 0 },
    economia_ads: 0, top_produtos: [],
    visualizacoes: { pageviews: 0, tempo_medio: "--", top_paginas: [] },
    funil: { visitas: 0, carrinho: 0, checkout: 0 },
    recorrencia: { clientes_2x: 0, taxa_recompra: 0 },
    ticket_medio: { app: 0, site: 0 }
  });

  useEffect(() => {
    if (tokenFromUrl) {
      localStorage.setItem("app_token", tokenFromUrl);
      setToken(tokenFromUrl);
      setSearchParams({});
    }
  }, [tokenFromUrl, setSearchParams]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    const authFetch = (endpoint: string) => 
        fetch(`${API_URL}${endpoint}`, { headers: { "Authorization": `Bearer ${token}` } });

    Promise.all([
        authFetch("/admin/config").then(r => r.json()),
        authFetch("/stats/dashboard").then(r => r.json()),
        authFetch("/admin/store-info").then(r => r.json())
    ]).then(([dataConfig, dataStats, dataUrl]) => {
        // Atualiza config com fallback seguro
        setConfig({
             app_name: dataConfig.app_name || "Minha Loja",
             theme_color: dataConfig.theme_color || "#000000",
             logo_url: dataConfig.logo_url || "",
             whatsapp_number: dataConfig.whatsapp_number || "",
             fab_enabled: dataConfig.fab_enabled || false,
             fab_text: dataConfig.fab_text || "Baixar App"
        });
        setStats(dataStats);
        setStoreUrl(dataUrl.url);
    })
    .catch(err => {
        console.error(err);
        if(err.status === 401) { localStorage.removeItem("app_token"); setToken(null); }
    })
    .finally(() => setLoading(false));

  }, [token, API_URL]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await fetch(`${API_URL}/admin/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(config),
      });
      alert("✨ Configurações salvas!");
    } catch (error) { alert("Erro ao salvar."); } finally { setSaving(false); }
  };

  const copyLink = () => { navigator.clipboard.writeText(`${storeUrl}/pages/app`); alert("Link copiado!"); };
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(storeUrl + "/pages/app")}&color=${config.theme_color.replace("#", "")}`;

  if (!token) return <div className="error-screen">🔒 Acesso Negado.</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-area">
            <h1>App Builder</h1>
            <span className="badge-pro">PRO</span>
          </div>
          <nav className="header-nav">
            <button className={activeTab === 'dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
            <button className={activeTab === 'config' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('config')}>⚙️ Configurações</button>
            <button className={activeTab === 'planos' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('planos')}>💎 Planos</button>
            <button className="nav-link" onClick={() => window.open(storeUrl, '_blank')}>🛍️ Ver Loja</button>
          </nav>
        </div>
        <div className="header-right">
            <div className="status-indicator"><span className="dot"></span><span>Online</span></div>
            <div className="user-avatar">🔒</div>
        </div>
      </header>

      <main className="dashboard-content">
        
        {/* ABA DASHBOARD */}
        {activeTab === 'dashboard' && (
            <section className="stats-grid animate-fade-in">
                <div className="stat-card" style={{borderLeft: '4px solid #10B981'}}>
                    <div className="stat-icon green">💰</div>
                    <div className="stat-info">
                        <h3>Receita App</h3>
                        <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.receita)}</p>
                        <span className="stat-growth">🔥 {stats.vendas} pedidos</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{background: '#F0F9FF', color: '#0369A1'}}>💳</div>
                    <div className="stat-info">
                        <h3>Ticket Médio</h3>
                        <div style={{marginTop: '10px', display:'flex', justifyContent:'space-between'}}>
                             <span style={{color:'#10B981', fontWeight:'bold'}}>App: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.ticket_medio.app)}</span>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple">📱</div>
                    <div className="stat-info">
                        <h3>Instalações</h3>
                        <p>{stats.instalacoes}</p>
                        <span className="stat-growth">Base ativa</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">🔁</div>
                    <div className="stat-info">
                        <h3>Recorrência</h3>
                        <p>{stats.recorrencia.clientes_2x}</p>
                        <div style={{fontSize: '11px', color: '#666'}}>Recompra: <strong>{stats.recorrencia.taxa_recompra}%</strong></div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{background:'#FFF7ED', color:'#C2410C'}}>👀</div>
                    <div className="stat-info">
                        <h3>Engajamento</h3>
                        <p>{stats.visualizacoes.pageviews.toLocaleString()}</p>
                        <span className="stat-growth">Pageviews</span>
                    </div>
                </div>
                <div className="stat-card" style={{gridRow: 'span 2'}}>
                    <div className="stat-info" style={{width: '100%'}}>
                        <h3>Funil de Vendas 📉</h3>
                        <div style={{marginTop: '15px'}}>
                            <div className="conversion-bar"><div className="bar-label"><span>1. Visitas</span> <strong>{stats.funil.visitas}</strong></div><div className="bar-track"><div className="bar-fill" style={{width: '100%', background: '#9CA3AF'}}></div></div></div>
                            <div className="conversion-bar"><div className="bar-label"><span>2. Carrinho</span> <strong>{stats.funil.carrinho}</strong></div><div className="bar-track"><div className="bar-fill" style={{width: `${(stats.funil.carrinho/Math.max(stats.funil.visitas,1))*100}%`, background: '#60A5FA'}}></div></div></div>
                            <div className="conversion-bar"><div className="bar-label"><span>3. Checkout</span> <strong>{stats.funil.checkout}</strong></div><div className="bar-track"><div className="bar-fill" style={{width: `${(stats.funil.checkout/Math.max(stats.funil.visitas,1))*100}%`, background: '#10B981'}}></div></div></div>
                            <small style={{display:'block', marginTop:'10px', color:'#666', fontSize:'10px'}}>{stats.taxa_conversao.app}% conversão global</small>
                        </div>
                    </div>
                </div>
                <div className="stat-card" style={{borderLeft: '4px solid #ef4444'}}>
                    <div className="stat-icon red">💸</div>
                    <div className="stat-info">
                        <h3>Carrinhos Abandonados</h3>
                        <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.carrinhos_abandonados.valor)}</p>
                        <button style={{marginTop: '5px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold'}}>RECUPERAR</button>
                    </div>
                </div>
                 <div className="stat-card">
                    <div className="stat-info" style={{width: '100%'}}>
                        <h3>Taxa de Conversão 🏆</h3>
                        <div className="conversion-bar"><div className="bar-label"><span>App PWA</span> <strong>{stats.taxa_conversao.app}%</strong></div><div className="bar-track"><div className="bar-fill" style={{width: `${Math.min(stats.taxa_conversao.app * 20, 100)}%`, background: '#10B981'}}></div></div></div>
                    </div>
                </div>
            </section>
        )}

        {/* ABA CONFIGURAÇÕES */}
        {activeTab === 'config' && (
            <div className="editor-grid animate-fade-in" style={{marginTop: '20px'}}>
                <div className="config-section">
                    <h2 style={{marginBottom:'20px'}}>Personalizar Aplicativo</h2>
                    
                    {/* Link Download */}
                    <div className="config-card" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
                        <div className="card-header"><h3 style={{ color: '#7C3AED', margin:0 }}>🔗 Link de Download</h3><p style={{margin:'5px 0'}}>Divulgue este link no Instagram.</p></div>
                        <div className="form-group"><div style={{ display: 'flex', gap: '10px' }}><input type="text" readOnly value={storeUrl ? `${storeUrl}/pages/app` : "Carregando..."} style={{ backgroundColor: 'white', color: '#555', flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} /><button onClick={copyLink} style={{ background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '0 20px', fontWeight: 'bold' }}>Copiar</button></div></div>
                    </div>

                    {/* QR Code */}
                    <div className="config-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px', display: 'flex' }}>
                        <img src={qrCodeUrl}
