import React, { useEffect, useState } from 'react';

interface PushCampaign {
    title: string;
    message: string;
    url: string;
    image_url?: string;
    btn1_text?: string;
    btn1_url?: string;
    btn2_text?: string;
    btn2_url?: string;
    filter_behavior?: string;
    intelligent_delivery?: boolean;
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
    image_url?: string;
    sent: number;
    opened: number;
    failed: number;
    confirmed_deliveries: number; // ✅ NOVO
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
    passo1_ativo: boolean; passo1_horas: number; passo1_titulo: string; passo1_mensagem: string;
    passo2_ativo: boolean; passo2_horas: number; passo2_titulo: string; passo2_mensagem: string;
    passo3_ativo: boolean; passo3_horas: number; passo3_titulo: string; passo3_mensagem: string;
    passo3_cupom?: string;
}

const AUTOMACAO_DEFAULT: AutomacaoConfig = {
    passo1_ativo: true, passo1_horas: 1, passo1_titulo: 'Seus itens estão te esperando!', passo1_mensagem: 'Você deixou alguns itens no carrinho. Que tal finalizar sua compra?',
    passo2_ativo: true, passo2_horas: 24, passo2_titulo: 'Seus itens estão acabando!', passo2_mensagem: 'O estoque é limitado! Garanta os seus itens antes que esgotem.',
    passo3_ativo: false, passo3_horas: 48, passo3_titulo: 'Último aviso! Oferta especial para você.', passo3_mensagem: 'Seu carrinho ainda está salvo. Use o cupom abaixo para ganhar desconto!', passo3_cupom: '',
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

const FLAG: Record<string, string> = { BR: '🇧🇷', US: '🇺🇸', PT: '🇵🇹', AR: '🇦🇷', MX: '🇲🇽', CO: '🇨🇴', CL: '🇨🇱', PE: '🇵🇪', UY: '🇺🇾', GB: '🇬🇧' };
const PAIS_NOME: Record<string, string> = { BR: 'Brasil', US: 'EUA', PT: 'Portugal', AR: 'Argentina', MX: 'México', CO: 'Colômbia', CL: 'Chile', PE: 'Peru', UY: 'Uruguai', GB: 'Reino Unido' };
const HORAS_OPCOES = [
    { label: '30 minutos', value: 0.5 }, { label: '1 hora', value: 1 }, { label: '2 horas', value: 2 },
    { label: '3 horas', value: 3 }, { label: '6 horas', value: 6 }, { label: '12 horas', value: 12 },
    { label: '24 horas', value: 24 }, { label: '48 horas', value: 48 }, { label: '72 horas', value: 72 },
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
    const [automacao, setAutomacao] = useState<AutomacaoConfig>(AUTOMACAO_DEFAULT);
    const [loadingAutomacao, setLoadingAutomacao] = useState(false);
    const [savingAutomacao, setSavingAutomacao] = useState(false);
    const [activeTab, setActiveTab] = useState<'campanhas' | 'automacoes'>('campanhas');

    const fetchHistory = () => {
        if (!token) return;
        setLoadingHistory(true);
        fetch(`${API_URL}/push/history`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).then(data => { if (Array.isArray(data)) setHistory(data); else setHistory([]); })
            .catch(() => setHistory([])).finally(() => setLoadingHistory(false));
    };
    const fetchOsStats = () => {
        if (!token) return;
        setLoadingStats(true);
        fetch(`${API_URL}/push/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).then(data => setOsStats(data))
            .catch(() => setOsStats(null)).finally(() => setLoadingStats(false));
    };
    const fetchAutomacao = () => {
        if (!token) return;
        setLoadingAutomacao(true);
        fetch(`${API_URL}/automacao/config`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).then(data => setAutomacao({ ...AUTOMACAO_DEFAULT, ...data }))
            .catch(() => {}).finally(() => setLoadingAutomacao(false));
    };
    const saveAutomacao = async () => {
        if (!token) return;
        setSavingAutomacao(true);
        try {
            await fetch(`${API_URL}/automacao/config`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(automacao) });
            alert('Automações salvas!');
        } catch { alert('Erro ao salvar.'); } finally { setSavingAutomacao(false); }
    };

    useEffect(() => { if (!sendingPush) { fetchHistory(); fetchOsStats(); fetchAutomacao(); } }, [token, sendingPush]);

    const formatDate = (s: string) => { try { const d = new Date(s); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch { return s; } };
    const formatUnix = (ts: number) => { try { const d = new Date(ts * 1000); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch { return '—'; } };

    // ── COMPUTED VALUES ──
    const activeSubscribers = osStats?.active_subscribers ?? stats.instalacoes ?? 0;
    const totalSubscribers = osStats?.subscribers ?? 0;
    const taxaOptin = osStats?.taxa_optin ?? 0;
    const notifs = osStats?.notifications ?? [];
    const mediaAbertura = notifs.length > 0 ? Math.round(notifs.reduce((acc, n) => acc + n.taxa_abertura, 0) / notifs.length) : 0;
    const porPais = osStats?.por_pais ?? [];
    const porDisp = osStats?.por_dispositivo ?? [];
    const dispColors: Record<string, string> = { Android: '#22c55e', iOS: '#3b82f6', Web: '#8b5cf6' };
    const dispIcons: Record<string, string> = { Android: '🤖', iOS: '🍎', Web: '🌐' };

    // Saúde da base
    const inativos = Math.max(0, totalSubscribers - activeSubscribers);
    const pctAtivos = totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0;
    const pctInativos = 100 - pctAtivos;
    const churnRate = totalSubscribers > 0 ? Math.round((inativos / totalSubscribers) * 100) : 0;

    // Melhor horário estimado
    const melhorHorario = (() => {
        if (notifs.length === 0) return null;
        const horarios: Record<number, number> = {};
        notifs.forEach(n => {
            if (!n.created_at) return;
            const h = new Date(n.created_at * 1000).getHours();
            horarios[h] = (horarios[h] || 0) + n.opened;
        });
        const melhor = Object.entries(horarios).sort((a, b) => b[1] - a[1])[0];
        return melhor ? `${melhor[0]}:00` : null;
    })();

    // Ticket médio do dashboard
    const ticketMedio = stats?.ticket_medio?.app ?? 0;

    // ✅ Funil agregado de notificações
    const totalEnviados = notifs.reduce((a, n) => a + n.sent, 0);
    const totalConfirmados = notifs.reduce((a, n) => a + (n.confirmed_deliveries || 0), 0);
    const totalClicados = notifs.reduce((a, n) => a + n.opened, 0);
    const taxaConvGlobal = stats?.taxa_conversao?.app ?? 0;
    const totalConvertidos = Math.round(totalClicados * (taxaConvGlobal / 100));
    const pctEntrega = totalEnviados > 0 ? Math.round((totalConfirmados / totalEnviados) * 100) : 0;
    const pctClique = totalEnviados > 0 ? Math.round((totalClicados / totalEnviados) * 100) : 0;
    const pctConversao = totalClicados > 0 ? Math.round((totalConvertidos / totalClicados) * 100) : 0;

    // ✅ Benchmarking badge
    const getBenchmarkBadge = (taxa: number) => {
        if (taxa >= 10) return { label: '🔥 Acima da Média', bg: '#dcfce7', color: '#166534' };
        if (taxa >= 5) return { label: '✅ Na Média', bg: '#dbeafe', color: '#1d4ed8' };
        return { label: '⚠️ Precisa Melhorar', bg: '#fef3c7', color: '#92400e' };
    };

    const alcanceEstimado = () => {
        if (!osStats) return activeSubscribers;
        let base = osStats.active_subscribers;
        if (pushForm.filter_device) { const d = porDisp.find(x => x.dispositivo === pushForm.filter_device); if (d) base = Math.round(base * d.pct / 100); }
        if (pushForm.filter_country) { const p = porPais.find(x => x.pais === pushForm.filter_country); if (p) base = Math.round(base * p.pct / 100); }
        return base;
    };

    const renderPassoCard = (passo: 1 | 2 | 3, ativo: boolean, horas: number, titulo: string, mensagem: string, cupom?: string) => {
        const key = `passo${passo}` as 'passo1' | 'passo2' | 'passo3';
        const cor = passo === 1 ? '#3b82f6' : passo === 2 ? '#f59e0b' : '#10b981';
        const emoji = passo === 1 ? '⏰' : passo === 2 ? '🔥' : '🎁';
        const label = passo === 1 ? '1ª Mensagem' : passo === 2 ? '2ª Mensagem' : '3ª Mensagem (com cupom)';
        return (
            <div key={passo} style={{ border: `2px solid ${ativo ? cor : '#E5E7EB'}`, borderRadius: '12px', padding: '20px', marginBottom: '16px', background: ativo ? '#fafafa' : '#f9fafb', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: ativo ? '16px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{emoji}</div>
                        <div><div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{label}</div><div style={{ fontSize: '12px', color: '#6B7280' }}>{ativo ? `Envia após ${horas >= 1 ? `${horas}h` : '30 min'}` : 'Desativado'}</div></div>
                    </div>
                    <Toggle checked={ativo} onChange={v => setAutomacao({ ...automacao, [`${key}_ativo`]: v })} />
                </div>
                {ativo && (
                    <div className="animate-fade-in">
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Enviar após</label>
                            <select value={horas} onChange={e => setAutomacao({ ...automacao, [`${key}_horas`]: parseFloat(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                {HORAS_OPCOES.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Título</label>
                            <input type="text" value={titulo} maxLength={50} onChange={e => setAutomacao({ ...automacao, [`${key}_titulo`]: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} />
                            <small style={{ fontSize: '10px', color: '#6B7280' }}>{titulo.length}/50</small>
                        </div>
                        <div className="form-group" style={{ marginBottom: passo === 3 ? '12px' : '0' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Mensagem</label>
                            <textarea value={mensagem} maxLength={120} rows={2} onChange={e => setAutomacao({ ...automacao, [`${key}_mensagem`]: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }} />
                            <small style={{ fontSize: '10px', color: '#6B7280' }}>{mensagem.length}/120</small>
                        </div>
                        {passo === 3 && (
                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Cupom (opcional)</label>
                                <input type="text" value={cupom ?? ''} placeholder="Ex: VOLTA10" onChange={e => setAutomacao({ ...automacao, passo3_cupom: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', textTransform: 'uppercase' }} />
                            </div>
                        )}
                        <div style={{ marginTop: '12px', background: '#111827', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: cor, flexShrink: 0 }} />
                            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{titulo || 'Título'}</div><div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{mensagem || 'Mensagem'}{passo === 3 && cupom ? ` Cupom: ${cupom}` : ''}</div></div>
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

            {/* ── BLOCO 1: SAÚDE DA BASE ── */}
            {!loadingStats && totalSubscribers > 0 && (
                <div className="config-card" style={{ marginBottom: '1.5rem' }}>
                    <div className="card-header" style={{ paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>❤️ Saúde da Base de Push</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6B7280' }}>Ativos vs Inativos (bloquearam ou desinstalaram)</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
                        <div>
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                                        Ativos (podem receber push)
                                    </span>
                                    <span style={{ fontWeight: 700, color: '#111827' }}>{activeSubscribers.toLocaleString('pt-BR')} <span style={{ color: '#10B981' }}>({pctAtivos}%)</span></span>
                                </div>
                                <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: `${pctAtivos}%`, background: '#10B981', height: '100%', borderRadius: '999px', transition: 'width 0.6s ease' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                                        Inativos (bloquearam/desinstalaram)
                                    </span>
                                    <span style={{ fontWeight: 700, color: '#111827' }}>{inativos.toLocaleString('pt-BR')} <span style={{ color: '#EF4444' }}>({pctInativos}%)</span></span>
                                </div>
                                <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: `${pctInativos}%`, background: '#EF4444', height: '100%', borderRadius: '999px', transition: 'width 0.6s ease' }} />
                                </div>
                            </div>
                            {/* ✅ Churn Rate explícito */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                <span style={{ background: churnRate > 30 ? '#fee2e2' : '#f0fdf4', color: churnRate > 30 ? '#991b1b' : '#166534', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                                    📉 Churn: {churnRate}%
                                </span>
                                <span style={{ background: '#F3F4F6', color: '#374151', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                                    📈 Retenção: {pctAtivos}%
                                </span>
                            </div>
                            <div style={{ padding: '10px 14px', background: pctAtivos >= 70 ? '#f0fdf4' : '#fef3c7', border: `1px solid ${pctAtivos >= 70 ? '#86efac' : '#fde68a'}`, borderRadius: '8px', fontSize: '12px', color: pctAtivos >= 70 ? '#166534' : '#92400e' }}>
                                {pctAtivos >= 70 ? '✅ Base saudável — mais de 70% ativos' : pctAtivos >= 40 ? '⚠️ Base razoável — considere reativar inativos' : '🚨 Base comprometida — muitos usuários bloquearam'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="stat-card" style={{ margin: 0, padding: '14px 16px' }}>
                                <div className="stat-info">
                                    <h3 style={{ fontSize: '0.8rem' }}>Total Cadastrado</h3>
                                    <p style={{ fontSize: '1.5rem', margin: '4px 0' }}>{totalSubscribers.toLocaleString('pt-BR')}</p>
                                    <span style={{ fontSize: '11px', color: '#6B7280' }}>Todos que já deram permissão</span>
                                </div>
                            </div>
                            {melhorHorario && (
                                <div className="stat-card" style={{ margin: 0, padding: '14px 16px' }}>
                                    <div className="stat-info">
                                        <h3 style={{ fontSize: '0.8rem' }}>⏰ Melhor Horário</h3>
                                        <p style={{ fontSize: '1.5rem', margin: '4px 0' }}>{melhorHorario}</p>
                                        <span style={{ fontSize: '11px', color: '#6B7280' }}>Baseado nas aberturas anteriores</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── BLOCO 2: FUNIL DE NOTIFICAÇÕES ── */}
            {!loadingStats && notifs.length > 0 && totalEnviados > 0 && (
                <div className="config-card" style={{ marginBottom: '1.5rem' }}>
                    <div className="card-header" style={{ paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>🔔 Funil de Notificações</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6B7280' }}>Performance agregada de todas as {notifs.length} campanhas</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {[
                            { label: 'Enviados', value: totalEnviados, pct: 100, color: '#4F46E5', icon: '📤', desc: 'Total disparado' },
                            { label: 'Entregues', value: totalConfirmados, pct: pctEntrega, color: '#3b82f6', icon: '📬', desc: `${pctEntrega}% do total` },
                            { label: 'Clicados', value: totalClicados, pct: pctClique, color: '#10B981', icon: '👆', desc: `CTR: ${pctClique}%` },
                            { label: 'Convertidos', value: totalConvertidos, pct: pctConversao, color: '#f59e0b', icon: '💰', desc: `${pctConversao}% dos cliques` },
                        ].map((step, i) => (
                            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                                {i > 0 && (
                                    <div style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '18px', zIndex: 1 }}>›</div>
                                )}
                                <div style={{ background: '#F9FAFB', border: `2px solid ${step.color}20`, borderRadius: '12px', padding: '16px 12px' }}>
                                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>{step.icon}</div>
                                    <div style={{ fontSize: '22px', fontWeight: 700, color: step.color, marginBottom: '2px' }}>{step.value.toLocaleString('pt-BR')}</div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>{step.label}</div>
                                    <div style={{ fontSize: '11px', color: '#6B7280' }}>{step.desc}</div>
                                    <div style={{ marginTop: '8px', background: '#E5E7EB', borderRadius: '999px', height: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${step.pct}%`, background: step.color, height: '100%', borderRadius: '999px', transition: 'width 0.6s ease' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {totalConfirmados === 0 && (
                        <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '10px', textAlign: 'center' }}>
                            * Entregas confirmadas disponíveis para campanhas futuras (OneSignal confirmed deliveries)
                        </p>
                    )}
                </div>
            )}

            {/* ── BLOCO 3: SUGESTÕES INTELIGENTES ── */}
            {!loadingStats && (melhorHorario || churnRate > 20 || activeSubscribers > 0) && (
                <div className="config-card" style={{ marginBottom: '1.5rem' }}>
                    <div className="card-header" style={{ paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>💡 Sugestões para sua Loja</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6B7280' }}>Insights automáticos baseados nos seus dados</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {melhorHorario && (
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px' }}>
                                <span style={{ fontSize: '22px', flexShrink: 0 }}>⏰</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#3730A3', marginBottom: '2px' }}>
                                        Melhor horário para enviar: <strong>{melhorHorario}</strong>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#4338CA' }}>
                                        Seu público costuma abrir mais as notificações nesse horário. Agende sua próxima campanha para maximizar o CTR.
                                    </div>
                                </div>
                            </div>
                        )}
                        {churnRate > 30 && (
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px' }}>
                                <span style={{ fontSize: '22px', flexShrink: 0 }}>🚨</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#991B1B', marginBottom: '2px' }}>
                                        Alerta: {inativos.toLocaleString('pt-BR')} usuários inativos ({churnRate}% de churn)
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#B91C1C' }}>
                                        Muitos usuários bloquearam o push. Tente enviar menos campanhas por semana ou usar mensagens mais personalizadas com <code style={{ background: '#FEE2E2', padding: '1px 4px', borderRadius: '3px' }}>{'{{first_name}}'}</code>.
                                    </div>
                                </div>
                            </div>
                        )}
                        {churnRate <= 30 && churnRate > 0 && (
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px' }}>
                                <span style={{ fontSize: '22px', flexShrink: 0 }}>✅</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#166534', marginBottom: '2px' }}>
                                        Base com baixo churn ({churnRate}%) — continue assim!
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#15803D' }}>
                                        Sua frequência de envio está adequada. Os usuários não estão bloqueando as notificações.
                                    </div>
                                </div>
                            </div>
                        )}
                        {mediaAbertura > 0 && (() => { const badge = getBenchmarkBadge(mediaAbertura); return (
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: badge.bg + '40', border: `1px solid ${badge.bg}`, borderRadius: '10px' }}>
                                <span style={{ fontSize: '22px', flexShrink: 0 }}>📊</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: badge.color, marginBottom: '2px' }}>
                                        CTR Médio: {mediaAbertura}% — <span style={{ background: badge.bg, padding: '2px 8px', borderRadius: '999px', fontSize: '12px' }}>{badge.label}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: badge.color }}>
                                        {mediaAbertura >= 10
                                            ? 'Seu CTR está acima da média do setor (5–10%). Continue com mensagens relevantes e segmentadas.'
                                            : mediaAbertura >= 5
                                                ? 'Na média do setor. Tente usar Rich Push com imagens e botões de ação para aumentar o CTR.'
                                                : 'Abaixo da média. Revise os títulos das campanhas — use urgência, personalização e emojis com moderação.'}
                                    </div>
                                </div>
                            </div>
                        ); })()}
                        {ticketMedio > 0 && totalClicados > 0 && (
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px' }}>
                                <span style={{ fontSize: '22px', flexShrink: 0 }}>💰</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#92400E', marginBottom: '2px' }}>
                                        Receita estimada via push: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.round(totalClicados * (taxaConvGlobal / 100) * ticketMedio))}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#B45309' }}>
                                        Calculado como: {totalClicados} cliques × {taxaConvGlobal}% conversão × {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticketMedio)} ticket médio
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── BLOCO 4: DISPOSITIVOS + PAÍSES ── */}
            {!loadingStats && (porDisp.length > 0 || porPais.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="config-card" style={{ marginBottom: 0 }}>
                        <div className="card-header" style={{ paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>📱 Plataformas — Cliques Reais</h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6B7280' }}>Distribuição de cliques por dispositivo</p>
                        </div>
                        {porDisp.map(d => {
                            const totalCliquesGeral = notifs.reduce((acc, n) => acc + n.opened, 0);
                            const cliquesEstimados = Math.round(totalCliquesGeral * (d.pct / 100));
                            return (
                                <div key={d.dispositivo} style={{ marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>
                                        <span>{dispIcons[d.dispositivo] ?? '📟'} {d.dispositivo}</span>
                                        <span style={{ color: '#6B7280' }}>
                                            {d.count} subs ({d.pct}%)
                                            {cliquesEstimados > 0 && <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 600 }}>· {cliquesEstimados} cliques</span>}
                                        </span>
                                    </div>
                                    <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                        <div style={{ width: `${d.pct}%`, background: dispColors[d.dispositivo] ?? '#4F46E5', height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                            );
                        })}
                        {notifs.length === 0 && <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>Cliques disponíveis após enviar campanhas</p>}
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
                            ))}
                    </div>
                </div>
            )}

            {/* ── TABS ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {(['campanhas', 'automacoes'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: activeTab === tab ? '#111827' : '#F3F4F6', color: activeTab === tab ? '#fff' : '#6B7280', transition: 'all 0.2s' }}>
                        {tab === 'campanhas' ? '📢 Campanhas' : '🤖 Automações'}
                    </button>
                ))}
            </div>

            {/* ── ABA CAMPANHAS ── */}
            {activeTab === 'campanhas' && (
                <>
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
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>💰 Comportamento</label>
                                        <select value={pushForm.filter_behavior ?? ''} onChange={e => setPushForm({ ...pushForm, filter_behavior: e.target.value || undefined })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                            <option value="">🟢 Todos os inscritos</option>
                                            <option value="buyers">💰 Só quem JÁ comprou (VIPs)</option>
                                            <option value="non_buyers">👻 Só quem NUNCA comprou</option>
                                        </select>
                                        <small style={{ fontSize: '10px', color: '#6B7280' }}>Baseado nas tags do app</small>
                                    </div>
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
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>⏰ Agendar envio</label>
                                        <input type="datetime-local" value={pushForm.send_after ? pushForm.send_after.slice(0, 16) : ''} onChange={e => setPushForm({ ...pushForm, send_after: e.target.value ? new Date(e.target.value).toISOString() : undefined })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }} />
                                        <small style={{ fontSize: '10px', color: '#6B7280' }}>Vazio = envio imediato</small>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>🧠 Intelligent Delivery</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', border: `1px solid ${pushForm.intelligent_delivery ? '#818CF8' : '#d1d5db'}`, borderRadius: '6px', background: pushForm.intelligent_delivery ? '#EEF2FF' : 'white', cursor: 'pointer' }} onClick={() => setPushForm({ ...pushForm, intelligent_delivery: !pushForm.intelligent_delivery })}>
                                            <Toggle checked={pushForm.intelligent_delivery ?? false} onChange={v => setPushForm({ ...pushForm, intelligent_delivery: v })} />
                                            <span style={{ fontSize: '12px', color: pushForm.intelligent_delivery ? '#4F46E5' : '#6B7280' }}>{pushForm.intelligent_delivery ? 'Ativo — entrega no horário ideal' : 'Desativado'}</span>
                                        </div>
                                        <small style={{ fontSize: '10px', color: '#6B7280' }}>IA entrega quando cada usuário costuma abrir o celular</small>
                                    </div>
                                </div>
                                {(pushForm.filter_device || pushForm.filter_country || pushForm.send_after || pushForm.filter_behavior) && (
                                    <button onClick={() => setPushForm({ ...pushForm, filter_device: undefined, filter_country: undefined, send_after: undefined, filter_behavior: undefined })} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#DC2626', fontSize: '12px', cursor: 'pointer', padding: 0 }}>✕ Limpar filtros</button>
                                )}
                            </div>
                        )}
                        <div className="form-group">
                            <label>Título</label>
                            <input type="text" value={pushForm.title} onChange={e => setPushForm({ ...pushForm, title: e.target.value })} maxLength={50} placeholder="Ex: Oferta Relâmpago!" />
                            <small>{pushForm.title.length}/50 — use <code style={{ background: '#F3F4F6', padding: '1px 4px', borderRadius: '3px' }}>{'{{first_name}}'}</code> para personalizar com o nome do cliente</small>
                        </div>
                        <div className="form-group">
                            <label>Mensagem</label>
                            <input type="text" value={pushForm.message} onChange={e => setPushForm({ ...pushForm, message: e.target.value })} maxLength={120} placeholder="Ex: 10% OFF hoje por tempo limitado!" />
                            <small>{pushForm.message.length}/120 — ex: "Olá {'{{first_name}}'}, seu cupom exclusivo chegou!"</small>
                        </div>
                        <div className="form-group">
                            <label>Link (Opcional)</label>
                            <input type="text" value={pushForm.url} onChange={e => setPushForm({ ...pushForm, url: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="form-group">
                            <label>🖼️ Imagem do Push (Rich Push — opcional)</label>
                            <input type="text" value={pushForm.image_url ?? ''} onChange={e => setPushForm({ ...pushForm, image_url: e.target.value || undefined })} placeholder="https://... (banner de promoção, foto do produto)" />
                            <small>Aparece como imagem grande na notificação (Android + Chrome). Aumenta o CTR em até 50%.</small>
                        </div>
                        <div style={{ background: '#F9FAFB', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>🔘 Botões de Ação (opcional) <span style={{ fontWeight: 400, color: '#6B7280' }}>— aparecem embaixo da notificação</span></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Botão 1 — Texto</label><input type="text" value={pushForm.btn1_text ?? ''} onChange={e => setPushForm({ ...pushForm, btn1_text: e.target.value || undefined })} placeholder="Ex: 🛒 Comprar Agora" maxLength={30} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} /></div>
                                <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Botão 1 — Link</label><input type="text" value={pushForm.btn1_url ?? ''} onChange={e => setPushForm({ ...pushForm, btn1_url: e.target.value || undefined })} placeholder="https://..." style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Botão 2 — Texto</label><input type="text" value={pushForm.btn2_text ?? ''} onChange={e => setPushForm({ ...pushForm, btn2_text: e.target.value || undefined })} placeholder="Ex: 🎁 Pegar Cupom" maxLength={30} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} /></div>
                                <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Botão 2 — Link</label><input type="text" value={pushForm.btn2_url ?? ''} onChange={e => setPushForm({ ...pushForm, btn2_url: e.target.value || undefined })} placeholder="https://..." style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} /></div>
                            </div>
                        </div>
                        {(pushForm.title || pushForm.message) && (
                            <div style={{ background: '#111827', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px' }}>
                                <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview da notificação</div>
                                {pushForm.image_url && <div style={{ width: '100%', height: '120px', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden', background: '#1f2937' }}><img src={pushForm.image_url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /></div>}
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#4F46E5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔔</div>
                                    <div><div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{pushForm.title || 'Título da notificação'}</div><div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{pushForm.message || 'Mensagem da notificação'}</div></div>
                                </div>
                                {(pushForm.btn1_text || pushForm.btn2_text) && (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                        {pushForm.btn1_text && <span style={{ background: '#4F46E5', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>{pushForm.btn1_text}</span>}
                                        {pushForm.btn2_text && <span style={{ background: '#374151', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>{pushForm.btn2_text}</span>}
                                    </div>
                                )}
                            </div>
                        )}
                        <button className="save-button" onClick={handleSendPush} disabled={sendingPush || !pushForm.title || !pushForm.message} style={{ background: sendingPush ? '#ccc' : '#4F46E5', width: '100%', marginTop: '10px' }}>
                            {sendingPush ? 'Enviando...' : pushForm.send_after ? `⏰ Agendar para ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos` : `🚀 Enviar para ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos`}
                        </button>
                    </div>

                    {/* ── HISTÓRICO COM ROI + BENCHMARKING BADGE ── */}
                    <div className="config-card" style={{ marginTop: '24px' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>📜 Histórico de Campanhas</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#6B7280' }}>Métricas reais do OneSignal{ticketMedio > 0 ? ' + ROI estimado' : ''}</p>
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
                                                <th style={{ padding: '12px' }}>Data</th>
                                                <th style={{ padding: '12px' }}>Mensagem</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Enviados</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Abertos</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Falhos</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Taxa</th>
                                                {ticketMedio > 0 && <th style={{ padding: '12px', textAlign: 'right' }}>ROI Est.</th>}
                                            </tr></thead>
                                            <tbody>{notifs.map(n => {
                                                const taxaConv = stats?.taxa_conversao?.app ?? 0;
                                                const roiEstimado = ticketMedio > 0 ? Math.round(n.opened * (taxaConv / 100)
