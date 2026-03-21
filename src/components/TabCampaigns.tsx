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

interface AutomacaoConfig {
    passo1_ativo: boolean;
    passo1_horas: number;
    passo1_titulo: string;
    passo1_mensagem: string;
    passo2_ativo: boolean;
    passo2_horas: number;
    passo2_titulo: string;
    passo2_mensagem: string;
    passo3_ativo: boolean;
    passo3_horas: number;
    passo3_titulo: string;
    passo3_mensagem: string;
    passo3_cupom?: string;
}

const AUTOMACAO_DEFAULT: AutomacaoConfig = {
    passo1_ativo: true,
    passo1_horas: 1,
    passo1_titulo: 'Seus itens estão te esperando!',
    passo1_mensagem: 'Você deixou alguns itens no carrinho. Que tal finalizar sua compra?',
    passo2_ativo: true,
    passo2_horas: 24,
    passo2_titulo: 'Seus itens estão acabando!',
    passo2_mensagem: 'O estoque é limitado! Garanta os seus itens antes que esgotem.',
    passo3_ativo: false,
    passo3_horas: 48,
    passo3_titulo: 'Último aviso! Oferta especial para você.',
    passo3_mensagem: 'Seu carrinho ainda está salvo. Use o cupom abaixo para ganhar desconto!',
    passo3_cupom: '',
};

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

const HORAS_OPCOES = [
    { label: '30 minutos', value: 0.5 },
    { label: '1 hora', value: 1 },
    { label: '2 horas', value: 2 },
    { label: '3 horas', value: 3 },
    { label: '6 horas', value: 6 },
    { label: '12 horas', value: 12 },
    { label: '24 horas', value: 24 },
    { label: '48 horas', value: 48 },
    { label: '72 horas', value: 72 },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label style={{ position: 'relative', display: 'inline-block', width: '46px', height: '24px', flexShrink: 0 }}>
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: checked ? '#10B981' : '#E5E7EB', transition: '.3s', borderRadius: '34px' }} />
            <span style={{ position: 'absolute', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.3s', borderRadius: '50%', transform: checked ? 'translateX(22px)' : 'translateX(0px)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
        </label>
    );
}

export default function TabCampaigns({ stats, pushForm, setPushForm, handleSendPush, sendingPush, token, API_URL }: Props) {
    const [history, setHistory] = useState<PushHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [osStats, setOsStats] = useState<OneSignalStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [activeHistoryTab, setActiveHistoryTab] = useState<'onesignal' | 'local'>('onesignal');
    const [showSegmentation, setShowSegmentation] = useState(false);

    // ── Automações
    const [automacao, setAutomacao] = useState<AutomacaoConfig>(AUTOMACAO_DEFAULT);
    const [loadingAutomacao, setLoadingAutomacao] = useState(false);
    const [savingAutomacao, setSavingAutomacao] = useState(false);
    const [activeTab, setActiveTab] = useState<'campanhas' | 'automacoes'>('campanhas');

    const fetchHistory = () => {
        if (!token) return;
        setLoadingHistory(true);
        fetch(`${API_URL}/push/history`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setHistory(data); else setHistory([]); })
            .catch(() => setHistory([]))
            .finally(() => setLoadingHistory(false));
    };

    const fetchOsStats = () => {
        if (!token) return;
        setLoadingStats(true);
        fetch(`${API_URL}/push/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setOsStats(data))
            .catch(() => setOsStats(null))
            .finally(() => setLoadingStats(false));
    };

    const fetchAutomacao = () => {
        if (!token) return;
        setLoadingAutomacao(true);
        fetch(`${API_URL}/automacao/config`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setAutomacao({ ...AUTOMACAO_DEFAULT, ...data }))
            .catch(() => {})
            .finally(() => setLoadingAutomacao(false));
    };

    const saveAutomacao = async () => {
        if (!token) return;
        setSavingAutomacao(true);
        try {
            await fetch(`${API_URL}/automacao/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(automacao),
            });
            alert('Automações salvas!');
        } catch { alert('Erro ao salvar.'); }
        finally { setSavingAutomacao(false); }
    };

    useEffect(() => {
        if (!sendingPush) { fetchHistory(); fetchOsStats(); fetchAutomacao(); }
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
        ? Math.round(notifs.reduce((acc, n) => acc + n.taxa_abertura, 0) / notifs.length) : 0;
    const porPais = osStats?.por_pais ?? [];
    const porDisp = osStats?.por_dispositivo ?? [];
    const dispColors: Record<string, string> = { Android: '#22c55e', iOS: '#3b82f6', Web: '#8b5cf6' };
    const dispIcons: Record<string, string> = { Android: '🤖', iOS: '🍎', Web: '🌐' };

    const alcanceEstimado = () => {
        if (!osStats) return activeSubscribers;
        let base = osStats.active_subscribers;
        if (pushForm.filter_device) { const d = porDisp.find(x => x.dispositivo === pushForm.filter_device); if (d) base = Math.round(base * d.pct / 100); }
        if (pushForm.filter_country) { const p = porPais.find(x => x.pais === pushForm.filter_country); if (p) base = Math.round(base * p.pct / 100); }
        return base;
    };

    // ── Render de um card de passo de automação
    const renderPassoCard = (
        passo: 1 | 2 | 3,
        ativo: boolean,
        horas: number,
        titulo: string,
        mensagem: string,
        cupom?: string,
    ) => {
        const key = `passo${passo}` as 'passo1' | 'passo2' | 'passo3';
        const cor = passo === 1 ? '#3b82f6' : passo === 2 ? '#f59e0b' : '#10b981';
        const emoji = passo === 1 ? '⏰' : passo === 2 ? '🔥' : '🎁';
        const label = passo === 1 ? '1ª Mensagem' : passo === 2 ? '2ª Mensagem' : '3ª Mensagem (com cupom)';

        return (
            <div key={passo} style={{ border: `2px solid ${ativo ? cor : '#E5E7EB'}`, borderRadius: '12px', padding: '20px', marginBottom: '16px', background: ativo ? '#fafafa' : '#f9fafb', transition: 'all 0.2s' }}>
                {/* Header do passo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: ativo ? '16px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                            {emoji}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{label}</div>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                                {ativo ? `Envia após ${horas >= 1 ? `${horas}h` : '30 min'}` : 'Desativado'}
                            </div>
                        </div>
                    </div>
                    <Toggle checked={ativo} onChange={v => setAutomacao({ ...automacao, [`${key}_ativo`]: v })} />
                </div>

                {ativo && (
                    <div className="animate-fade-in">
                        {/* Tempo */}
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Enviar após</label>
                            <select
                                value={horas}
                                onChange={e => setAutomacao({ ...automacao, [`${key}_horas`]: parseFloat(e.target.value) })}
                                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}
                            >
                                {HORAS_OPCOES.map(op => (
                                    <option key={op.value} value={op.value}>{op.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Título */}
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Título da notificação</label>
                            <input
                                type="text"
                                value={titulo}
                                maxLength={50}
                                onChange={e => setAutomacao({ ...automacao, [`${key}_titulo`]: e.target.value })}
                                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }}
                            />
                            <small style={{ fontSize: '10px', color: '#6B7280' }}>{titulo.length}/50</small>
                        </div>

                        {/* Mensagem */}
                        <div className="form-group" style={{ marginBottom: passo === 3 ? '12px' : '0' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Mensagem</label>
                            <textarea
                                value={mensagem}
                                maxLength={120}
                                rows={2}
                                onChange={e => setAutomacao({ ...automacao, [`${key}_mensagem`]: e.target.value })}
                                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }}
                            />
                            <small style={{ fontSize: '10px', color: '#6B7280' }}>{mensagem.length}/120</small>
                        </div>

                        {/* Cupom (só passo 3) */}
                        {passo === 3 && (
                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Cupom de desconto (opcional)</label>
                                <input
                                    type="text"
                                    value={cupom ?? ''}
                                    placeholder="Ex: VOLTA10"
                                    onChange={e => setAutomacao({ ...automacao, passo3_cupom: e.target.value })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', textTransform: 'uppercase' }}
                                />
                                <small style={{ fontSize: '10px', color: '#6B7280' }}>O cupom será incluído automaticamente na mensagem.</small>
                            </div>
                        )}

                        {/* Preview da notificação */}
                        <div style={{ marginTop: '12px', background: '#111827', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: cor, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{titulo || 'Título da notificação'}</div>
                                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                                    {mensagem || 'Mensagem da notificação'}{passo === 3 && cupom ? ` Cupom: ${cupom}` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in" style={{ marginTop: '20px' }}>

            {/* ── CARDS DE MÉTRICAS ── */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div className="stat-info">
                        <h3>Subscribers Ativos</h3>
                        <p>{loadingStats ? '...' : activeSubscribers.toLocaleString('pt-BR')}</p>
                        <span className="stat-growth">🔔 Push habilitado</span>
                        <div style={{ marginTop: '8px' }}>
                            <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(activeSubscribers, 100)}%`, background: '#4F46E5', height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px', display: 'block' }}>Meta: {activeSubscribers} / 100</span>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                    </div>
                    <div className="stat-info">
                        <h3>Taxa de Opt-in</h3>
                        <p>{loadingStats ? '...' : `${taxaOptin}%`}</p>
                        <span className="stat-growth" style={{ color: taxaOptin >= 50 ? '#16a34a' : '#f59e0b' }}>{taxaOptin >= 50 ? '✅ Excelente' : '⚠️ Pode melhorar'}</span>
                        <span style={{ marginTop: '4px', display: 'block', fontSize: '0.85rem', color: '#6B7280' }}>{osStats?.instalacoes ?? 0} instalações → {activeSubscribers} inscritos</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                    <div className="stat-info">
                        <h3>Taxa de Abertura Média</h3>
                        <p>{loadingStats ? '...' : `${mediaAbertura}%`}</p>
                        <span className="stat-growth" style={{ color: mediaAbertura >= 10 ? '#16a34a' : '#6B7280' }}>{notifs.length > 0 ? `📊 ${notifs.length} campanhas` : '📊 Nenhuma ainda'}</span>
                        <span style={{ marginTop: '4px', display: 'block', fontSize: '0.85rem', color: '#6B7280' }}>Média do setor: ~5–10%</span>
                    </div>
                </div>
            </div>

            {/* ── DISTRIBUIÇÃO POR DISPOSITIVO E PAÍS ── */}
            {!loadingStats && (porDisp.length > 0 || porPais.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
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

            {/* ── TABS: CAMPANHAS / AUTOMAÇÕES ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {(['campanhas', 'automacoes'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: activeTab === tab ? '#111827' : '#F3F4F6', color: activeTab === tab ? '#fff' : '#6B7280', transition: 'all 0.2s' }}
                    >
                        {tab === 'campanhas' ? '📢 Campanhas' : '🤖 Automações'}
                    </button>
                ))}
            </div>

            {/* ── ABA CAMPANHAS ── */}
            {activeTab === 'campanhas' && (
                <>
                    {/* CRIAR CAMPANHA */}
                    <div className="config-card">
                        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <h2 style={{ margin: 0 }}>📢 Criar Nova Campanha</h2>
                            <p style={{ color: '#666' }}>Envie notificações push para seus clientes.</p>
                        </div>
                        <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>👥</span>
                                <div>
                                    <strong>Alcance estimado:</strong>{' '}
                                    <span style={{ color: '#4F46E5', fontWeight: 'bold' }}>{alcanceEstimado().toLocaleString('pt-BR')} dispositivos</span>
                                    {(pushForm.filter_device || pushForm.filter_country) && <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '8px' }}>(filtro ativo)</span>}
                                </div>
                            </div>
                            <button onClick={() => setShowSegmentation(!showSegmentation)} style={{ background: showSegmentation ? '#EEF2FF' : '#fff', border: '1px solid #d1d5db', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: showSegmentation ? '#4F46E5' : '#374151' }}>
                                🎯 {showSegmentation ? 'Ocultar' : 'Segmentar'}
                            </button>
                        </div>
                        {showSegmentation && (
                            <div className="animate-fade-in" style={{ background: '#F9FAFB', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 14px', fontSize: '14px', color: '#374151' }}>🎯 Filtros de Segmentação</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>📱 Dispositivo</label>
                                        <select value={pushForm.filter_device ?? ''} onChange={e => setPushForm({ ...pushForm, filter_device: e.target.value || undefined })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                            <option value="">Todos</option>
                                            <option value="Android">🤖 Android</option>
                                            <option value="iOS">🍎 iOS</option>
                                            <option value="Chrome">🌐 Chrome Web</option>
                                            <option value="Firefox">🦊 Firefox</option>
                                            <option value="Safari">🧭 Safari</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>🌍 País</label>
                                        <select value={pushForm.filter_country ?? ''} onChange={e => setPushForm({ ...pushForm, filter_country: e.target.value || undefined })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}>
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
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>⏰ Agendar envio</label>
                                        <input type="datetime-local" value={pushForm.send_after ? pushForm.send_after.slice(0, 16) : ''} onChange={e => setPushForm({ ...pushForm, send_after: e.target.value ? new Date(e.target.value).toISOString() : undefined })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }} />
                                        <small style={{ fontSize: '10px', color: '#6B7280' }}>Vazio = envio imediato</small>
                                    </div>
                                </div>
                                {(pushForm.filter_device || pushForm.filter_country || pushForm.send_after) && (
                                    <button onClick={() => setPushForm({ ...pushForm, filter_device: undefined, filter_country: undefined, send_after: undefined })} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#DC2626', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
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
                        <button className="save-button" onClick={handleSendPush} disabled={sendingPush || !pushForm.title || !pushForm.message} style={{ background: sendingPush ? '#ccc' : '#4F46E5', width: '100%', marginTop: '10px' }}>
                            {sendingPush ? 'Enviando...' : pushForm.send_after ? `⏰ Agendar para ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos` : `🚀 Enviar para ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos`}
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
                                <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '8px', padding: '3px', gap: '2px' }}>
                                    {(['onesignal', 'local'] as const).map(tab => (
                                        <button key={tab} onClick={() => setActiveHistoryTab(tab)} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: activeHistoryTab === tab ? '#fff' : 'transparent', color: activeHistoryTab === tab ? '#111827' : '#6B7280', boxShadow: activeHistoryTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                                            {tab === 'onesignal' ? 'OneSignal' : 'Local'}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => { fetchHistory(); fetchOsStats(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🔄</button>
                            </div>
                        </div>
                        {activeHistoryTab === 'onesignal' && (
                            loadingStats ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Carregando...</p>
                                : notifs.length === 0 ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Nenhuma campanha ainda.</p>
                                    : <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                            <thead><tr style={{ background: '#f9fafb', color: '#666', textAlign: 'left' }}>
                                                <th style={{ padding: '12px' }}>Data</th><th style={{ padding: '12px' }}>Mensagem</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Enviados</th><th style={{ padding: '12px', textAlign: 'right' }}>Abertos</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Falhos</th><th style={{ padding: '12px', textAlign: 'right' }}>Taxa</th>
                                            </tr></thead>
                                            <tbody>{notifs.map(n => (
                                                <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '12px', whiteSpace: 'nowrap', color: '#555', fontSize: '12px' }}>{formatUnix(n.created_at)}</td>
                                                    <td style={{ padding: '12px' }}><div style={{ fontWeight: 'bold', fontSize: '13px' }}>{n.title}</div><div style={{ fontSize: '12px', color: '#666' }}>{n.message}</div></td>
                                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4F46E5' }}>{n.sent.toLocaleString('pt-BR')}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right', color: '#059669' }}>{n.opened.toLocaleString('pt-BR')}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right', color: '#DC2626' }}>{n.failed.toLocaleString('pt-BR')}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right' }}><span style={{ background: n.taxa_abertura >= 10 ? '#dcfce7' : '#f3f4f6', color: n.taxa_abertura >= 10 ? '#166534' : '#6B7280', padding: '3px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>{n.taxa_abertura}%</span></td>
                                                </tr>
                                            ))}</tbody>
                                        </table>
                                    </div>
                        )}
                        {activeHistoryTab === 'local' && (
                            loadingHistory ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Carregando...</p>
                                : history.length === 0 ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Nenhuma campanha local.</p>
                                    : <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                            <thead><tr style={{ background: '#f9fafb', color: '#666', textAlign: 'left' }}><th style={{ padding: '12px' }}>Data</th><th style={{ padding: '12px' }}>Mensagem</th><th style={{ padding: '12px', textAlign: 'right' }}>Enviados</th></tr></thead>
                                            <tbody>{history.map(item => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '12px', whiteSpace: 'nowrap', color: '#555' }}>{formatDate(item.created_at)}</td>
                                                    <td style={{ padding: '12px' }}><div style={{ fontWeight: 'bold' }}>{item.title}</div><div style={{ fontSize: '12px', color: '#666' }}>{item.message}</div></td>
                                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4F46E5' }}>{item.sent_count}</td>
                                                </tr>
                                            ))}</tbody>
                                        </table>
                                    </div>
                        )}
                    </div>
                </>
            )}

            {/* ── ABA AUTOMAÇÕES ── */}
            {activeTab === 'automacoes' && (
                <div className="config-card">
                    <div className="card-header">
                        <h2 style={{ margin: 0 }}>🤖 Recuperação de Carrinho Abandonado</h2>
                        <p style={{ color: '#6B7280', margin: '6px 0 0' }}>
                            Configure as mensagens automáticas enviadas quando um cliente abandona o carrinho.
                            As mensagens padrão já estão prontas — personalize como quiser.
                        </p>
                    </div>

                    {/* Banner explicativo */}
                    <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '20px' }}>💡</span>
                        <div style={{ fontSize: '13px', color: '#3730A3', lineHeight: '1.5' }}>
                            <strong>Como funciona:</strong> Quando um cliente adiciona itens ao carrinho e sai sem comprar,
                            o sistema aguarda o tempo configurado e envia a notificação automaticamente.
                            Se o cliente comprar antes, o envio é cancelado.
                        </div>
                    </div>

                    {loadingAutomacao ? (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Carregando configurações...</p>
                    ) : (
                        <>
                            {renderPassoCard(1, automacao.passo1_ativo, automacao.passo1_horas, automacao.passo1_titulo, automacao.passo1_mensagem)}
                            {renderPassoCard(2, automacao.passo2_ativo, automacao.passo2_horas, automacao.passo2_titulo, automacao.passo2_mensagem)}
                            {renderPassoCard(3, automacao.passo3_ativo, automacao.passo3_horas, automacao.passo3_titulo, automacao.passo3_mensagem, automacao.passo3_cupom)}

                            <button className="save-button" onClick={saveAutomacao} disabled={savingAutomacao} style={{ width: '100%', marginTop: '8px', background: savingAutomacao ? '#ccc' : '#111827' }}>
                                {savingAutomacao ? 'Salvando...' : '💾 Salvar Automações'}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
