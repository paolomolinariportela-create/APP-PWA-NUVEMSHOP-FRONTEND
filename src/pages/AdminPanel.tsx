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

// Interface da Configuração
interface AppConfig {
  app_name: string;
  theme_color: string;
  logo_url: string;
  whatsapp_number: string;
  fab_enabled?: boolean;
  fab_text?: string;
}

// Interface da Campanha Push (NOVO)
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
  const [sendingPush, setSendingPush] = useState(false); // Estado de envio
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

  // Estado do Formulário de Push (NOVO)
  const [pushForm, setPushForm] = useState<PushCampaign>({
      title: "",
      message: "",
      url: "/"
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

  // Função de Envio de Push (NOVO)
  const handleSendPush = async () => {
      if (!token) return;
      if (!pushForm.title || !pushForm.message) { alert("Preencha título e mensagem!"); return; }
      
      if(!confirm("Tem certeza que deseja enviar esta notificação para todos os clientes inscritos?")) return;

      setSendingPush(true);
      try {
          const res = await fetch(`${API_URL}/stats/admin/send-push`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify(pushForm)
          });
          const data = await res.json();
          if(data.status === "success") {
              alert(`✅ Sucesso! Enviado para ${data.sent} clientes.`);
              setPushForm({ title: "", message: "", url: "/" });
          } else {
              alert(`⚠️ Atenção: ${data.message || "Erro desconhecido"}`);
          }
      } catch (e) {
          alert("Erro ao enviar push.");
      } finally {
          setSendingPush(false);
      }
  };

  const copyLink = () => { navigator.clipboard.writeText(`${storeUrl}/pages/app`); alert("Link copiado!"); };
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(storeUrl + "/pages/app")}&color=${config.theme_color.replace("#", "")}`;

  if (!token) return <div className="error-screen">🔒 Acesso Negado.</div>;

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-area">
            <h1>App Builder</h1>
            <span className="badge-pro">PRO</span>
          </div>
          <nav className="header-nav">
            <button className={activeTab === 'dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
            {/* NOVA ABA NO MENU */}
            <button className={activeTab === 'campanhas' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('campanhas')}>🔔 Campanhas</button>
            <button className={activeTab === 'config' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('config')}>⚙️ Configurações</button>
            <button className={activeTab === 'planos' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('planos')}>💎 Planos</button>
            <button className="nav-link" onClick={() => window.open(storeUrl, '_blank')}>🛍️ Ver Loja</button>
          </nav>
        </div>
        <div className="header-right">
            <div className="status-indicator"><span className="dot online"></span><span>Online</span></div>
            <div className="user-avatar">🔒</div>
        </div>
      </header>

      <main className="dashboard-content">
        
        {/* ABA DASHBOARD */}
        {activeTab === 'dashboard' && (
            <section className="stats-grid animate-fade-in">
                <div className="stat-card" style={{borderLeft: '4px solid #10B981'}}>
                    <div className="stat-icon green">💰</div>
                    <div className="stat-info"><h3>Receita App</h3><p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.receita)}</p><span className="stat-growth">🔥 {stats.vendas} pedidos realizados</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{background: '#F0F9FF', color: '#0369A1'}}>💳</div>
                    <div className="stat-info"><h3>Ticket Médio</h3><div style={{marginTop: '10px'}}><div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}><span style={{color:'#10B981', fontWeight:'bold'}}>App: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.ticket_medio.app)}</span><span style={{fontSize:'10px', background:'#DCFCE7', color:'#15803D', padding:'2px 6px', borderRadius:'4px'}}>+30%</span></div></div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple">📱</div>
                    <div className="stat-info"><h3>Instalações Ativas</h3><p>{stats.instalacoes}</p><span className="stat-growth">Base de clientes fiéis</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">🔁</div>
                    <div className="stat-info"><h3>Clientes Recorrentes</h3><p>{stats.recorrencia.clientes_2x}</p><div style={{fontSize: '11px', color: '#666', marginTop: '4px'}}>Taxa de Recompra: <strong>{stats.recorrencia.taxa_recompra}%</strong></div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{background:'#FFF7ED', color:'#C2410C'}}>👀</div>
                    <div className="stat-info"><h3>Engajamento</h3><p>{stats.visualizacoes.pageviews.toLocaleString()}</p><div style={{marginTop: '8px', fontSize: '11px', color: '#555'}}>⏱️ Tempo médio: <strong>{stats.visualizacoes.tempo_medio}</strong></div></div>
                </div>
                <div className="stat-card" style={{gridRow: 'span 2'}}>
                    <div className="stat-info" style={{width: '100%'}}>
                        <h3>Funil de Vendas 📉</h3>
                        <div style={{marginTop: '15px'}}>
                            <div className="conversion-bar"><div className="bar-label"><span>1. Visitas</span> <strong>{stats.funil.visitas}</strong></div><div className="bar-track"><div className="bar-fill" style={{width: '100%', background: '#9CA3AF'}}></div></div></div>
                            <div className="conversion-bar"><div className="bar-label"><span>2. Carrinho</span> <strong>{stats.funil.carrinho}</strong></div><div className="bar-track"><div className="bar-fill" style={{width: `${(stats.funil.carrinho/Math.max(stats.funil.visitas,1))*100}%`, background: '#60A5FA'}}></div></div></div>
                            <div className="conversion-bar"><div className="bar-label"><span>3. Checkout</span> <strong>{stats.funil.checkout}</strong></div><div className="bar-track"><div className="bar-fill" style={{width: `${(stats.funil.checkout/Math.max(stats.funil.visitas,1))*100}%`, background: '#10B981'}}></div></div></div>
                            <small style={{display:'block', marginTop:'10px', color:'#666', fontSize:'10px'}}>{stats.taxa_conversao.app}% de conversão global</small>
                        </div>
                    </div>
                </div>
                <div className="stat-card" style={{borderLeft: '4px solid #ef4444'}}>
                    <div className="stat-icon red">💸</div>
                    <div className="stat-info"><h3>Carrinhos Abandonados</h3><p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.carrinhos_abandonados.valor)}</p><button style={{marginTop: '5px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold'}}>🔔 RECUPERAR AGORA</button></div>
                </div>
                 <div className="stat-card">
                    <div className="stat-info" style={{width: '100%'}}>
                        <h3>Taxa de Conversão 🏆</h3>
                        <div className="conversion-bar"><div className="bar-label"><span>App PWA</span> <strong>{stats.taxa_conversao.app}%</strong></div><div className="bar-track"><div className="bar-fill" style={{width: `${Math.min(stats.taxa_conversao.app * 20, 100)}%`, background: '#10B981'}}></div></div></div>
                    </div>
                </div>
            </section>
        )}

        {/* ABA CAMPANHAS (NOVA SEÇÃO COMPLETA) */}
        {activeTab === 'campanhas' && (
            <div className="animate-fade-in" style={{marginTop:'20px', maxWidth:'800px', margin:'0 auto'}}>
                <div className="config-card">
                    <div className="card-header" style={{borderBottom:'none', paddingBottom:'0'}}>
                        <h2 style={{margin:0}}>📢 Criar Nova Campanha</h2>
                        <p style={{color:'#666'}}>Envie notificações push para todos os clientes que instalaram o app.</p>
                    </div>
                    
                    <div style={{background:'#F3F4F6', padding:'15px', borderRadius:'8px', margin:'20px 0', display:'flex', alignItems:'center', gap:'10px'}}>
                        <span style={{fontSize:'20px'}}>👥</span>
                        <div>
                            <strong>Alcance Potencial:</strong> <span style={{color:'#4F46E5', fontWeight:'bold'}}>{stats.instalacoes} dispositivos</span>
                            <div style={{fontSize:'12px', color:'#666'}}>Clientes que instalaram o app e aceitaram notificações.</div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Título da Notificação (Curto e chamativo)</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Oferta Relâmpago! ⚡" 
                            value={pushForm.title}
                            onChange={(e) => setPushForm({...pushForm, title: e.target.value})}
                            maxLength={50}
                        />
                        <small style={{textAlign:'right', display:'block'}}>{pushForm.title.length}/50</small>
                    </div>

                    <div className="form-group">
                        <label>Mensagem Principal</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Todo o site com 10% OFF só até hoje às 23h." 
                            value={pushForm.message}
                            onChange={(e) => setPushForm({...pushForm, message: e.target.value})}
                            maxLength={120}
                        />
                        <small style={{textAlign:'right', display:'block'}}>{pushForm.message.length}/120</small>
                    </div>

                    <div className="form-group">
                        <label>Link de Destino (Ao clicar)</label>
                        <input 
                            type="text" 
                            placeholder="Ex: /promocoes ou https://sualoja.com.br/produto-x" 
                            value={pushForm.url}
                            onChange={(e) => setPushForm({...pushForm, url: e.target.value})}
                        />
                    </div>

                    <div style={{background:'#FEF2F2', color:'#DC2626', padding:'10px', borderRadius:'6px', fontSize:'12px', marginBottom:'20px'}}>
                        <strong>⚠️ Regra de Ouro:</strong> Não faça spam. Envie no máximo 1 notificação por dia para não ser bloqueado pelos usuários.
                    </div>

                    <button 
                        className="save-button" 
                        onClick={handleSendPush} 
                        disabled={sendingPush || stats.instalacoes === 0}
                        style={{background: sendingPush ? '#ccc' : '#4F46E5'}}
                    >
                        {sendingPush ? "Enviando..." : "🚀 Enviar Notificação Agora"}
                    </button>
                    {stats.instalacoes === 0 && <p style={{textAlign:'center', fontSize:'12px', color:'#999', marginTop:'10px'}}>Você precisa ter instalações ativas para enviar.</p>}
                </div>
            </div>
        )}

        {/* ABA CONFIGURAÇÕES */}
        {activeTab === 'config' && (
            <div className="editor-grid animate-fade-in" style={{marginTop: '20px'}}>
                <div className="config-section">
                    <h2 style={{marginBottom:'20px'}}>Personalizar Aplicativo</h2>
                    
                    <div className="config-card" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
                        <div className="card-header"><h3 style={{ color: '#7C3AED', margin:0 }}>🔗 Link de Download</h3><p style={{margin:'5px 0'}}>Divulgue este link no Instagram.</p></div>
                        <div className="form-group"><div style={{ display: 'flex', gap: '10px' }}><input type="text" readOnly value={storeUrl ? `${storeUrl}/pages/app` : "Carregando..."} style={{ backgroundColor: 'white', color: '#555', flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} /><button onClick={copyLink} style={{ background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '0 20px', fontWeight: 'bold' }}>Copiar</button></div></div>
                    </div>

                    <div className="config-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px', display: 'flex' }}>
                        <img src={qrCodeUrl} alt="QR Code" style={{width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #eee'}} />
                        <div><h3 style={{fontSize: '16px', margin: '0 0 5px 0'}}>QR Code de Balcão</h3><a href={qrCodeUrl} download="qrcode.png" target="_blank" rel="noreferrer" style={{color: config.theme_color, textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>⬇️ Baixar Imagem</a></div>
                    </div>

                    <div className="config-card">
                        <div className="card-header"><h3 style={{margin:0}}>🎨 Identidade Visual</h3></div>
                        <div className="form-group"><label>Nome do Aplicativo</label><input type="text" value={config.app_name} onChange={(e) => setConfig({...config, app_name: e.target.value})} placeholder="Ex: Minha Loja Oficial" /></div>
                        <div className="form-group"><label>Cor Principal (Tema)</label><div className="color-picker-wrapper"><input type="color" value={config.theme_color} onChange={(e) => setConfig({...config, theme_color: e.target.value})} /><input type="text" value={config.theme_color} onChange={(e) => setConfig({...config, theme_color: e.target.value})} className="color-text" /></div></div>
                        <div className="form-group"><label>Logo URL (Link da Imagem)</label><input type="text" value={config.logo_url} onChange={(e) => setConfig({...config, logo_url: e.target.value})} placeholder="https://..." /></div>
                    </div>

                    <div className="config-card">
                        <div className="card-header">
                            <h3 style={{margin:0}}>🚀 Widgets de Conversão</h3>
                            <p style={{marginTop:'5px', fontSize:'12px'}}>Aumente os downloads com botões inteligentes.</p>
                        </div>

                        {/* Botão Flutuante Toggle */}
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', padding:'12px', background:'#f9fafb', borderRadius:'8px', border:'1px solid #eee'}}>
                            <div>
                                <h4 style={{margin:0, fontSize:'14px', display:'flex', alignItems:'center', gap:'6px'}}>
                                    <span>📲</span> Botão Flutuante (FAB)
                                </h4>
                                <small style={{color:'#666', fontSize:'11px'}}>Ícone fixo no canto da tela mobile.</small>
                            </div>
                            
                            <label style={{position:'relative', display:'inline-block', width:'46px', height:'24px'}}>
                                <input 
                                    type="checkbox" 
                                    checked={config.fab_enabled || false}
                                    onChange={(e) => setConfig({...config, fab_enabled: e.target.checked})}
                                    style={{opacity:0, width:0, height:0}}
                                />
                                <span style={{
                                    position:'absolute', cursor:'pointer', top:0, left:0, right:0, bottom:0, 
                                    backgroundColor: config.fab_enabled ? '#10B981' : '#E5E7EB', 
                                    transition:'.3s', borderRadius:'34px'
                                }}></span>
                                <span style={{
                                    position:'absolute', content:"", height:'18px', width:'18px', left:'3px', bottom:'3px', 
                                    backgroundColor:'white', transition:'.3s', borderRadius:'50%',
                                    transform: config.fab_enabled ? 'translateX(22px)' : 'translateX(0px)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}></span>
                            </label>
                        </div>
                        {config.fab_enabled && (
                            <div className="form-group animate-fade-in" style={{marginTop:'15px'}}>
                                <label>Texto do Botão</label>
                                <input 
                                    type="text" 
                                    value={config.fab_text || "Baixar App"}
                                    onChange={(e) => setConfig({...config, fab_text: e.target.value})}
                                    placeholder="Ex: Baixar App Agora"
                                />
                            </div>
                        )}
                    </div>

                    <div className="config-card">
                        <div className="card-header"><h3 style={{margin:0}}>📞 Suporte</h3></div>
                        <div className="form-group"><label>WhatsApp</label><input type="text" value={config.whatsapp_number} onChange={(e) => setConfig({...config, whatsapp_number: e.target.value})} placeholder="5511999999999" /></div>
                    </div>

                    <button className="save-button" onClick={handleSave} disabled={saving || loading}>{saving ? "Salvando..." : "Salvar Alterações"}</button>
                </div>

                <div className="preview-section">
                    <div className="sticky-wrapper">
                        <h3 style={{textAlign: 'center', marginBottom: '10px'}}>Preview ao Vivo</h3>
                        <div className="phone-mockup">
                            <div className="phone-notch"></div>
                            <div className="phone-screen">
                                <div className="status-bar" style={{ backgroundColor: config.theme_color }}>
                                    <span>9:41</span>
                                    <div className="status-icons">📶 🔋</div>
                                </div>
                                <div className="app-content">
                                    <div className="app-header" style={{ borderBottom: `2px solid ${config.theme_color}` }}>
                                        {config.logo_url && <img src={config.logo_url} alt="Logo" className="app-logo-mini" />}
                                        <span style={{ color: config.theme_color, fontWeight: 'bold' }}>
                                            {config.app_name}
                                        </span>
                                    </div>
                                    <div className="skeleton-banner"></div>
                                    <div className="skeleton-grid">
                                        <div className="skeleton-product"></div>
                                        <div className="skeleton-product"></div>
                                        <div className="skeleton-product"></div>
                                        <div className="skeleton-product"></div>
                                    </div>
                                    {config.fab_enabled && (
                                        <div style={{
                                            position:'absolute', bottom:'80px', right:'20px', 
                                            background: config.theme_color, color:'white', 
                                            padding:'8px 16px', borderRadius:'20px', 
                                            fontSize:'10px', fontWeight:'bold', 
                                            boxShadow:'0 4px 10px rgba(0,0,0,0.2)',
                                            display:'flex', alignItems:'center', gap:'5px', zIndex:50
                                        }}>
                                            <span>📲</span> {config.fab_text || "Baixar App"}
                                        </div>
                                    )}
                                </div>
                                <div className="bottom-nav">
                                    <div className="nav-item" style={{ color: config.theme_color }}>
                                        <span>🏠</span><small>Início</small>
                                    </div>
                                    <div className="nav-item"><span>🔍</span><small>Buscar</small></div>
                                    <div className="nav-item"><span>🛒</span><small>Carrinho</small></div>
                                </div>
                                <div className="home-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ABA PLANOS */}
        {activeTab === 'planos' && (
            <div className="plans-container animate-fade-in" style={{textAlign:'center', padding:'40px'}}>
                <h2>Escolha seu Plano 💎</h2>
                <p>Desbloqueie todo o poder do seu App.</p>
                <div style={{display:'flex', justifyContent:'center', gap:'20px', marginTop:'30px'}}>
                    <div className="plan-card" style={{border:'1px solid #ddd', padding:'30px', borderRadius:'10px', width:'300px'}}>
                        <h3>Básico</h3>
                        <div style={{fontSize:'30px', fontWeight:'bold', margin:'10px 0'}}>Grátis</div>
                        <ul style={{textAlign:'left', lineHeight:'2', listStyle:'none', padding:0}}>
                            <li>✅ App PWA</li>
                            <li>✅ Instalação Fácil</li>
                            <li>❌ Push Notifications</li>
                        </ul>
                        <button style={{width:'100%', padding:'10px', marginTop:'20px'}}>Atual</button>
                    </div>
                    <div className="plan-card" style={{border:'2px solid #10B981', padding:'30px', borderRadius:'10px', width:'300px', position:'relative'}}>
                         <div style={{position:'absolute', top:'-10px', left:'50%', transform:'translateX(-50%)', background:'#10B981', color:'white', padding:'2px 10px', borderRadius:'10px', fontSize:'12px'}}>RECOMENDADO</div>
                        <h3>PRO</h3>
                        <div style={{fontSize:'30px', fontWeight:'bold', margin:'10px 0'}}>R$ 49/mês</div>
                        <ul style={{textAlign:'left', lineHeight:'2', listStyle:'none', padding:0}}>
                            <li>✅ Tudo do Básico</li>
                            <li>✅ Push Notifications Ilimitados</li>
                            <li>✅ Recuperação de Carrinho</li>
                            <li>✅ Suporte Prioritário</li>
                        </ul>
                        <button style={{width:'100%', padding:'10px', marginTop:'20px', background:'#10B981', color:'white', border:'none', cursor:'pointer'}}>Assinar Agora</button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
