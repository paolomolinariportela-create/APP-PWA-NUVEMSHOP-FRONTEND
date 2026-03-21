import React, { useEffect, useState } from 'react';

interface PushCampaign {
    title: string;
    message: string;
    url: string;
    filter_device?: string;
    filter_country?: string;
    send_after?: string;
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
    failed: number;
    taxa_abertura: number;
    created_at: number;
}

interface PorPais { pais: string; count: number; pct: number; }
interface PorDispositivo { dispositivo: string; count: number; pct: number; }

interface OneSignalStats {
    subscribers: number;
    active_subscribers: number;
    instalacoes: number;
    taxa_optin: number;
    por_pais: PorPais[];
    por_dispositivo: PorDispositivo[];
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

const FLAG: Record<string, string> = {
    BR: '🇧🇷', US: '🇺🇸', PT: '🇵🇹', AR: '🇦🇷', MX: '🇲🇽',
    CO: '🇨🇴', CL: '🇨🇱', PE: '🇵🇪', UY: '🇺🇾', GB: '🇬🇧',
};

const PAIS_NOME: Record<string, string> = {
    BR: 'Brasil', US: 'EUA', PT: 'Portugal', AR: 'Argentina',
    MX: 'México', CO: 'Colômbia', CL: 'Chile', PE: 'Peru',
    UY: 'Uruguai', GB: 'Reino Unido',
};

export default function TabCampaigns({ stats, pushForm, setPushForm, handleSendPush, sendingPush, token, API_URL }: Props) {
    const [history, setHistory] = useState<PushHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [osStats, setOsStats] = useState<OneSignalStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [activeHistoryTab, setActiveHistoryTab] = useState<'onesignal' | 'local'>('onesignal');
    const [showSegmentation, setShowSegmentation] = useState(false);

    const fetchHistory = () => {
        if (!token) return;
        setLoadingHistory(true);
        fetch(`${API_URL}/push/history`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setHistory(data); else setHistory([]); })
            .catch(() => setHistory([]))
            .finally(() => setLoadingHistory(false));
    };

    const fetchOsStats = () => {
        if (!token) return;
        setLoadingStats(true);
        fetch(`${API_URL}/push/stats`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setOsStats(data))
            .catch(() => setOsStats(null))
            .finally(() => setLoadingStats(false));
    };

    useEffect(() => {
        if (!sendingPush) { fetchHistory(); fetchOsStats(); }
    }, [token, sendingPush]);

    const formatDate = (s: string) => {
        try {
            const d = new Date(s);
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch { return s; }
    };

    const formatUnix = (ts: number) => {
        try {
            const d = new Date(ts * 1000);
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch { return '—'; }
    };

    const activeSubscribers = osStats?.active_subscribers ?? stats.instalacoes ?? 0;
    const taxaOptin = osStats?.taxa_optin ?? 0;
    const notifs = osStats?.notifications ?? [];
    const mediaAbertura = notifs.length > 0
        ? Math.round(notifs.reduce((acc, n) => acc + n.taxa_abertura, 0) / notifs.length)
        : 0;

    const porPais = osStats?.por_pais ?? [];
    const porDisp = osStats?.por_dispositivo ?? [];

    const dispColors: Record<string, string> = { Android: '#22c55e', iOS: '#3b82f6', Web: '#8b5cf6' };
    const dispIcons: Record<string, string> = { Android: '🤖', iOS: '🍎', Web: '🌐' };

    // Calcula alcance estimado com filtros ativos
    const alcanceEstimado = () => {
        if (!osStats) return activeSubscribers;
        let base = osStats.active_subscribers;
        if (pushForm.filter_device) {
            const d = porDisp.find(x => x.dispositivo === pushForm.filter_device);
            if (d) base = Math.round(base * d.pct / 100);
        }
        if (pushForm.filter_country) {
            const p = porPais.find(x => x.pais === pushForm.filter_country);
            if (p) base = Math.round(base * p.pct / 100);
        }
        return base;
    };

    return (
        <div className="animate-fade-in" style={{ marginTop: '20px' }}>

            {/* ── CARDS DE MÉTRICAS ── */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>

                {/* Subscribers */}
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Subscribers Ativos</h3>
                        <p>{loadingStats ? '...' : activeSubscribers.toLocaleString('pt-BR')}</p>
                        <span className="stat-growth">🔔 Push habilitado</span>
                        <div style={{ marginTop: '8px' }}>
                            <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(activeSubscribers, 100)}%`, background: '#4F46E5', height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px', display: 'block' }}>
                                Meta: {activeSubscribers} / 100
                            </span>
                        </div>
                    </div>
                </div>

                {/* Taxa Opt-in */}
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
                            {taxaOptin >= 50 ? '✅ Excelente' : '⚠️ Pode melhorar'}
                        </span>
                        <span style={{ marginTop: '4px', display: 'block', fontSize: '0.85rem', color: '#6B7280' }}>
                            {osStats?.instalacoes ?? 0} instalações → {activeSubscribers} inscritos
                        </span>
                    </div>
                </div>

                {/* Taxa Abertura */}
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
                            {notifs.length > 0 ? `📊 ${notifs.length} campanhas` : '📊 Nenhuma ainda'}
                        </span>
                        <span style={{ marginTop: '4px', display: 'block', fontSize: '0.85rem', color: '#6B7280' }}>
                            Média do setor: ~5–10%
                        </span>
                    </div>
                </div>
            </div>

            {/* ── DISTRIBUIÇÃO POR DISPOSITIVO E PAÍS ── */}
            {!loadingStats && (porDisp.length > 0 || porPais.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                    {/* Dispositivos */}
                    <div className="config-card" style={{ marginBottom: 0 }}>
                        <div className="card-header" style={{ paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>📱 Por Dispositivo</h3>
                        </div>
                        {porDisp.map(d => (
                            <div key={d.dispositivo} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                    <span>{dispIcons[d.dispositivo] ?? '📟'} {d.dispositivo}</span>
                                    <span style={{ color: '#6B7280' }}>{d.count} ({d.pct}%)</span>
                                </div>
                                <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                    <div style={{ width: `${d.pct}%`, background: dispColors[d.dispositivo] ?? '#4F46E5', height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Países */}
                    <div className="config-card" style={{ marginBottom: 0 }}>
                        <div className="card-header" style={{ paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>🌍 Por País</h3>
                        </div>
                        {porPais.length === 0
                            ? <p style={{ color: '#6B7280', fontSize: '14px' }}>Dados insuficientes</p>
                            : porPais.map(p => (
                                <div key={p.pais} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                        <span>{FLAG[p.pais] ?? '🏳️'} {PAIS_NOME[p.pais] ?? p.pais}</span>
                                        <span style={{ color: '#6B7280' }}>{p.count} ({p.pct}%)</span>
                                    </div>
                                    <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                        <div style={{ width: `${p.pct}%`, background: '#4F46E5', height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* ── CRIAR CAMPANHA ── */}
            <div className="config-card">
                <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <h2 style={{ margin: 0 }}>📢 Criar Nova Campanha</h2>
                    <p style={{ color: '#666' }}>Envie notificações push para seus clientes.</p>
                </div>

                {/* Alcance estimado */}
                <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>👥</span>
                        <div>
                            <strong>Alcance estimado:</strong>{' '}
                            <span style={{ color: '#4F46E5', fontWeight: 'bold' }}>
                                {alcanceEstimado().toLocaleString('pt-BR')} dispositivos
                            </span>
                            {(pushForm.filter_device || pushForm.filter_country) && (
                                <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '8px' }}>
                                    (filtro ativo)
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSegmentation(!showSegmentation)}
                        style={{ background: showSegmentation ? '#EEF2FF' : '#fff', border: '1px solid #d1d5db', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: showSegmentation ? '#4F46E5' : '#374151' }}
                    >
                        🎯 {showSegmentation ? 'Ocultar segmentação' : 'Segmentar'}
                    </button>
                </div>

                {/* Segmentação */}
                {showSegmentation && (
                    <div className="animate-fade-in" style={{ background: '#F9FAFB', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                        <h4 style={{ margin: '0 0 14px', fontSize: '14px', color: '#374151' }}>🎯 Filtros de Segmentação</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>

                            {/* Dispositivo */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>
                                    📱 Dispositivo
                                </label>
                                <select
                                    value={pushForm.filter_device ?? ''}
                                    onChange={e => setPushForm({ ...pushForm, filter_device: e.target.value || undefined })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}
                                >
                                    <option value="">Todos</option>
                                    <option value="Android">🤖 Android</option>
                                    <option value="iOS">🍎 iOS</option>
                                    <option value="Chrome">🌐 Chrome Web</option>
                                    <option value="Firefox">🦊 Firefox</option>
                                    <option value="Safari">🧭 Safari</option>
                                </select>
                            </div>

                            {/* País */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>
                                    🌍 País
                                </label>
                                <select
                                    value={pushForm.filter_country ?? ''}
                                    onChange={e => setPushForm({ ...pushForm, filter_country: e.target.value || undefined })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}
                                >
                                    <option value="">Todos</option>
                                    <option value="BR">🇧🇷 Brasil</option>
                                    <option value="PT">🇵🇹 Portugal</option>
                                    <option value="US">🇺🇸 EUA</option>
                                    <option value="AR">🇦🇷 Argentina</option>
                                    <option value="MX">🇲🇽 México</option>
                                    <option value="CO">🇨🇴 Colômbia</option>
                                    <option value="CL">🇨🇱 Chile</option>
                                </select>
                            </div>

                            {/* Agendamento */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>
                                    ⏰ Agendar envio
                                </label>
                                <input
                                    type="datetime-local"
                                    value={pushForm.send_after ? pushForm.send_after.slice(0, 16) : ''}
                                    onChange={e => setPushForm({ ...pushForm, send_after: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}
                                />
                                <small style={{ fontSize: '10px', color: '#6B7280' }}>Vazio = envio imediato</small>
                            </div>
                        </div>

                        {/* Limpar filtros */}
                        {(pushForm.filter_device || pushForm.filter_country || pushForm.send_after) && (
                            <button
                                onClick={() => setPushForm({ ...pushForm, filter_device: undefined, filter_country: undefined, send_after: undefined })}
                                style={{ marginTop: '10px', background: 'none', border: 'none', color: '#DC2626', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                            >
                                ✕ Limpar filtros
                            </button>
                        )}
                    </div>
                )}

                <div className="form-group">
                    <label>Título</label>
                    <input type="text" value={pushForm.title} onChange={e => setPushForm({ ...pushForm, title: e.target.value })} maxLength={50} placeholder="Ex: Oferta Relâmpago!" />
                    <small>{pushForm.title.length}/50 caracteres</small>
                </div>
                <div className="form-group">
                    <label>Mensagem</label>
                    <input type="text" value={pushForm.message} onChange={e => setPushForm({ ...pushForm, message: e.target.value })} maxLength={120} placeholder="Ex: 10% OFF hoje por tempo limitado!" />
                    <small>{pushForm.message.length}/120 caracteres</small>
                </div>
                <div className="form-group">
                    <label>Link (Opcional)</label>
                    <input type="text" value={pushForm.url} onChange={e => setPushForm({ ...pushForm, url: e.target.value })} placeholder="https://..." />
                </div>

                <button
                    className="save-button"
                    onClick={handleSendPush}
                    disabled={sendingPush || !pushForm.title || !pushForm.message}
                    style={{ background: sendingPush ? '#ccc' : '#4F46E5', width: '100%', marginTop: '10px' }}
                >
                    {sendingPush
                        ? "Enviando..."
                        : pushForm.send_after
                            ? `⏰ Agendar para ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos`
                            : `🚀 Enviar para ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos`
                    }
                </button>
            </div>

            {/* ── HISTÓRICO ── */}
            <div className="config-card" style={{ marginTop: '24px' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>📜 Histórico de Campanhas</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#6B7280' }}>Métricas reais do OneSignal</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '8px', padding: '3px', gap: '2px' }}>
                            {(['onesignal', 'local'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveHistoryTab(tab)}
                                    style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: activeHistoryTab === tab ? '#fff' : 'transparent', color: activeHistoryTab === tab ? '#111827' : '#6B7280', boxShadow: activeHistoryTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                                >
                                    {tab === 'onesignal' ? 'OneSignal' : 'Local'}
                                </button>
                            ))}
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
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Falhos</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Taxa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notifs.map(n => (
                                                <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '12px', whiteSpace: 'nowrap', color: '#555', fontSize: '12px' }}>{formatUnix(n.created_at)}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{n.title}</div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>{n.message}</div>
                                                    </td>
                                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4F46E5' }}>{n.sent.toLocaleString('pt-BR')}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right', color: '#059669' }}>{n.opened.toLocaleString('pt-BR')}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right', color: '#DC2626' }}>{n.failed.toLocaleString('pt-BR')}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                                        <span style={{ background: n.taxa_abertura >= 10 ? '#dcfce7' : '#f3f4f6', color: n.taxa_abertura >= 10 ? '#166534' : '#6B7280', padding: '3px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
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
                                            {history.map(item => (
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
