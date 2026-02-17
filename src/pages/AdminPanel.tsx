import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/AdminPanel.css";

import TabDashboard from "../components/TabDashboard";
import TabConfig from "../components/TabConfig";
import TabCampaigns from "../components/TabCampaigns";

// Interfaces mantidas...
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

interface AppConfig {
  app_name: string;
  theme_color: string;
  logo_url: string;
  whatsapp_number: string;
  fab_enabled?: boolean;
  fab_text?: string;
  fab_position?: string;
  fab_icon?: string;
  fab_delay?: number;
}

interface PushCampaign {
    title: string;
    message: string;
    url: string;
}

export default function AdminPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingPush, setSendingPush] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem("app_token"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [storeUrl, setStoreUrl] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [config, setConfig] = useState<AppConfig>({
    app_name: "Minha Loja",
    theme_color: "#000000",
    logo_url: "",
    whatsapp_number: "",
    fab_enabled: false,
    fab_text: "Baixar App",
    fab_position: "right",
    fab_icon: "📲",
    fab_delay: 0
  });

  const [pushForm, setPushForm] = useState<PushCampaign>({ title: "", message: "", url: "/" });

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
        authFetch("/analytics/dashboard").then(r => r.json()), // <--- ROTA NOVA
        authFetch("/admin/store-info").then(r => r.json())
    ]).then(([dataConfig, dataStats, dataUrl]) => {
        setConfig({
             app_name: dataConfig.app_name ?? "Minha Loja",
            theme_color: dataConfig.theme_color ?? "#000000",
            logo_url: dataConfig.logo_url ?? "",
            whatsapp_number: dataConfig.whatsapp_number ?? "",
            fab_enabled: dataConfig.fab_enabled ?? false,
            fab_text: dataConfig.fab_text ?? "Baixar App",
            fab_position: dataConfig.fab_position ?? "right",
            fab_icon: dataConfig.fab_icon ?? "📲",
            fab_delay: dataConfig.fab_delay ?? 0
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
      alert("✨ Salvo!");
    } catch (error) { alert("Erro ao salvar."); } finally { setSaving(false); }
  };

  const handleSendPush = async () => {
      if (!token) return;
      if (!pushForm.title || !pushForm.message) { alert("Preencha tudo!"); return; }
      if(!confirm("Enviar notificação?")) return;
      
      setSendingPush(true);
      try {
          const res = await fetch(`${API_URL}/push/send`, { // <--- ROTA NOVA
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify(pushForm)
          });
          const data = await res.json();
          if(data.status === "success") {
              alert(`✅ Enviado para ${data.sent} pessoas.`);
              setPushForm({ title: "", message: "", url: "/" });
          } else {
              alert(`⚠️ Erro: ${data.message}`);
          }
      } catch (e) { alert("Erro de conexão."); } finally { setSendingPush(false); }
  };

  if (!token) return <div className="error-screen">🔒 Login necessário.</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-area"><h1>App Builder</h1><span className="badge-pro">PRO</span></div>
          <nav className="header-nav">
            <button className={activeTab === 'dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
            <button className={activeTab === 'campanhas' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('campanhas')}>🔔 Campanhas</button>
            <button className={activeTab === 'config' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('config')}>⚙️ Configurações</button>
            <button className={activeTab === 'planos' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('planos')}>💎 Planos</button>
            <button className="nav-link" onClick={() => window.open(storeUrl, '_blank')}>🛍️ Ver Loja</button>
          </nav>
        </div>
        <div className="header-right"><div className="status-indicator"><span className="dot online"></span><span>Online</span></div></div>
      </header>

      <main className="dashboard-content">
        {activeTab === 'dashboard' && <TabDashboard stats={stats} />}
        
        {activeTab === 'config' && (
            <TabConfig config={config} setConfig={setConfig} handleSave={handleSave} saving={saving} loading={loading} storeUrl={storeUrl} />
        )}

        {activeTab === 'campanhas' && (
             <TabCampaigns 
                stats={stats}
                pushForm={pushForm}
                setPushForm={setPushForm}
                handleSendPush={handleSendPush}
                sendingPush={sendingPush}
                token={token}
                API_URL={API_URL}
             />
        )}

        {activeTab === 'planos' && (
            <div className="plans-container" style={{textAlign:'center', padding:'40px'}}>
                <h2>Planos</h2><p>Em breve...</p>
            </div>
        )}
      </main>
    </div>
  );
}
