import React, { useEffect, useState } from 'react';

interface PushCampaign {
    title: string;
    message: string;
    url: string;
}

interface PushHistoryItem {
    id: number;
    title: string;
    message: string;
    url: string;
    sent_count: number;
    created_at: string;
}

interface OneSignalNotif {
    id: string;
    title: string;
    message: string;
    url: string;
    sent: number;
    opened: number;
    clicked: number;
    taxa_abertura: number;
    created_at: number;
}

interface OneSignalStats {
    subscribers: number;
    active_subscribers: number;
    instalacoes: number;
    taxa_optin: number;
    notifications: OneSignalNotif[];
}

interface Props {
    stats: any;
    pushForm: PushCampaign;
    setPushForm: (f: PushCampaign) => void;
    handleSendPush: () => void;
    sendingPush: boolean;
    token: string | null;
    API_URL: string;
}

export default function TabCampaigns({ stats, pushForm, setPushForm, handleSendPush, sendingPush, token, API_URL }: Props) {
    const [history, setHistory] = useState<PushHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [osStats, setOsStats] = useState<OneSignalStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [activeHistoryTab, setActiveHistoryTab] = useState<'local' | 'onesignal'>('onesignal');

    const fetchHistory = () => {
        if (!token) return;
        setLoadingHistory(true);
        fetch(`${API_URL}/push/history`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setHistory(data); else setHistory([]); })
        .catch(() => setHistory([]))
        .finally(() => setLoadingHistory(false));
    };

    const fetchOsStats = () => {
        if (!token) return;
        setLoadingStats(true);
        fetch(`${API_URL}/push/stats`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => setOsStats(data))
        .catch(() => setOsStats(null))
        .finally(() => setLoadingStats(false));
    };

    useEffect(() => {
        if (!sendingPush) {
            fetchHistory();
            fetchOsStats();
        }
    }, [token, sendingPush]);

    const formatDate = (dateString: string) => {
        try {
            const d = new Date(dateString);
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return dateString; }
    };

    const formatUnixDate = (timestamp: number) => {
        try {
            const d = new Date(timestamp * 1000);
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return '—'; }
    };

    const activeSubscribers = osStats?.active_subscribers ?? stats.instalacoes ?? 0;
    const taxaOptin = osStats?.taxa_optin ?? 0;

    // Taxa de abertura média das campanhas do OneSignal
    const notifs = osStats?.notifications ?? [];
    const mediaAbertura = notifs.length > 0
        ? Math.round(notifs.reduce((acc, n) => acc + n.taxa_abertura, 0) / notifs.length)
        : 0;

    return (
        <div className="animate-fade-in" style={{ marginTop: '20px' }}>

            {/* CARDS DE MÉTRICAS — mesmo layout do dashboard */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>

                {/* Subscribers Ativos */}
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M15 17h5l-1.5-1.5M9 17H4l1.5-1.5M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM6 21v-1a6 6 0 0 1 12 0v1"/>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Subscribers Ativos</h3>
                        <p>{loadingStats ? '...' : activeSubscribers.toLocaleString('pt-BR')}</p>
                        <span className="stat-growth">🔔 Usuários com push ativo</span>
                        <div className="card-meta-text" style={{ marginTop: '8px' }}>
                            <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(activeSubscribers / 100 * 100, 100)}%`, background: '#4F46E5', height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px', display: 'block' }}>Meta: {activeSubscribers} / 100</span>
                        </div>
                    </div>
                </div>

                {/* Taxa de Opt-in */}
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Taxa de Opt-in</h3>
                        <p>{loadingStats ? '...' : `${taxaOptin}%`}</p>
                        <span className="stat-growth" style={{ color: taxaOptin >= 50 ? '#16a34a' : '#f59e0b' }}>
                            {taxaOptin >= 50 ? '✅ Excelente adesão' : '⚠️ Pode melhorar'}
                        </span>
                        <span className="card-meta-text" style={{ marginTop: '4px', display: 'block', fontSize: '0.85rem', color: '#6B7280' }}>
                            {osStats?.instalacoes ?? 0} instalações → {activeSubscribers} inscritos
                        </span>
                    </div>
                </div>

                {/* Taxa de Abertura Média */}
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Taxa de Abertura Média</h3>
                        <p>{loadingStats ? '...' : `${mediaAbertura}%`}</p>
                        <span className="stat-growth" style={{ color: mediaAbertura >= 10 ? '#16a34a' : '#6B7280' }}>
                            {notifs.length > 0 ? `📊 Baseado em ${notifs.length} campanhas` : '📊 Nenhuma campanha ainda'}
                        </span>
                        <span className="card-meta-text" style={{ marginTop: '4px', display: 'block', fontSize: '0.85rem', color: '#6B7280' }}>
                            Média do setor: ~5-10%
                        </span>
                    </div>
                </div>

            </div>

            {/* CRIAR CAMPANHA */}
            <div className="config-card">
                <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                    <h2 style={{ margin: 0 }}>📢 Criar Nova Campanha</h2>
                    <p style={{ color: '#666' }}>Envie notificações push para todos os clientes.</p>
                </div>

                <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>👥</span>
                    <div>
                        <strong>Alcance:</strong>{' '}
                        <span style={{ color: '#4F46E5', fontWeight: 'bold' }}>
                            {activeSubscribers} dispositivos
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Título</label>
                    <input type="text" value={pushForm.title} onChange={(e) => setPushForm({ ...pushForm, title: e.target.value })} maxLength={50} placeholder="Ex: Oferta Relâmpago!" />
                    <small>{pushForm.title.length}/50 caracteres</small>
                </div>
                <div className="form-group">
                    <label>Mensagem</label>
                    <input type="text" value={pushForm.message} onChange={(e) => setPushForm({ ...pushForm, message: e.target.value })} maxLength={120} placeholder="Ex: 10% OFF hoje por tempo limitado!" />
                    <small>{pushForm.message.length}/120 caracteres</small>
                </div>
                <div className="form-group">
                    <label>Link (Opcional)</label>
                    <input type="text" value={pushForm.url} onChange={(e) => setPushForm({ ...pushForm, url: e.target.value })} placeholder="https://..." />
                </div>

                <button
                    className="save-button"
                    onClick={handleSendPush}
                    disabled={sendingPush || !pushForm.title || !pushForm.message}
                    style={{ background: sendingPush ? '#ccc' : '#4F46E5', width: '100%', marginTop: '10px' }}
                >
                    {sendingPush ? "Enviando..." : `🚀 Enviar para ${activeSubscribers} dispositivos`}
                </button>
            </div>

            {/* HISTÓRICO */}
            <div className="config-card" style={{ marginTop: '24px' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>📜 Histórico de Campanhas</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#6B7280' }}>Métricas reais do OneSignal</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {/* Toggle local/onesignal */}
                        <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '8px', padding: '3px', gap: '2px' }}>
                            <button
                                onClick={() => setActiveHistoryTab('onesignal')}
                                style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: activeHistoryTab === 'onesignal' ? '#fff' : 'transparent', color: activeHistoryTab === 'onesignal' ? '#111827' : '#6B7280', boxShadow: activeHistoryTab === 'onesignal' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                            >
                                OneSignal
                            </button>
                            <button
                                onClick={() => setActiveHistoryTab('local')}
                                style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: activeHistoryTab === 'local' ? '#fff' : 'transparent', color: activeHistoryTab === 'local' ? '#111827' : '#6B7280', boxShadow: activeHistoryTab === 'local' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                            >
                                Local
                            </button>
                        </div>
                        <button onClick={() => { fetchHistory(); fetchOsStats(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🔄</button>
                    </div>
                </div>

                {/* Histórico OneSignal */}
                {activeHistoryTab === 'onesignal' && (
                    loadingStats
                        ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Carregando dados do OneSignal...</p>
                        : notifs.length === 0
                            ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Nenhuma campanha enviada ainda.</p>
                            : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb', color: '#666', textAlign: 'left' }}>
                                                <th style={{ padding: '12px' }}>Data</th>
                                                <th style={{ padding: '12px' }}>Mensagem</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Enviados</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Abertos</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Taxa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notifs.map((n) => (
                                                <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '12px', whiteSpace: 'nowrap', color: '#555', fontSize: '12px' }}>{formatUnixDate(n.created_at)}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{n.title}</div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>{n.message}</div>
                                                    </td>
                                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4F46E5' }}>{n.sent.toLocaleString('pt-BR')}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right', color: '#059669' }}>{n.opened.toLocaleString('pt-BR')}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                                        <span style={{
                                                            background: n.taxa_abertura >= 10 ? '#dcfce7' : '#f3f4f6',
                                                            color: n.taxa_abertura >= 10 ? '#166534' : '#6B7280',
                                                            padding: '3px 8px',
                                                            borderRadius: '999px',
                                                            fontSize: '12px',
                                                            fontWeight: 600
                                                        }}>
                                                            {n.taxa_abertura}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                )}

                {/* Histórico Local */}
                {activeHistoryTab === 'local' && (
                    loadingHistory
                        ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Carregando...</p>
                        : history.length === 0
                            ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Nenhuma campanha local.</p>
                            : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb', color: '#666', textAlign: 'left' }}>
                                                <th style={{ padding: '12px' }}>Data</th>
                                                <th style={{ padding: '12px' }}>Mensagem</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Enviados</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((item) => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '12px', whiteSpace: 'nowrap', color: '#555' }}>{formatDate(item.created_at)}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>{item.message}</div>
                                                    </td>
                                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4F46E5' }}>{item.sent_count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                )}
            </div>
        </div>
    );
}
