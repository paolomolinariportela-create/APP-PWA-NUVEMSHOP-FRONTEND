import React, { useState } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
import { TabCampaignsProps, ObjetivoCampanha, OneSignalNotif, ABTestForm } from './types';

// ─── Design ───────────────────────────────────────────────────────────────────
import { C, Icon } from './design';
import { Badge, SectionHeader } from './components/UIComponents';

// ─── Constantes ───────────────────────────────────────────────────────────────
import { OBJETIVOS, FLAG, PAIS_NOME, DISP_COLORS, TEMPLATES_DEFAULT, AB_FORM_DEFAULT } from './constants';

// ─── Hook de dados ────────────────────────────────────────────────────────────
import { useCampaignData } from './hooks/useCampaignData';

// ─── Componentes ──────────────────────────────────────────────────────────────
import { ABTestModal }      from './components/ABTestModal';
import { ABResultCard }     from './components/ABResultCard';
import { IAGerarModal }     from './components/IAGerarModal';
import { JornadaTab }       from './components/JornadaTab';
import { ScoreTab }         from './components/ScoreTab';
import { CoachInsights }    from './components/CoachInsights';
import { SeletorObjetivo, inferirFunil } from './components/SeletorObjetivo';
import { CampanhaDetalhe }  from './components/CampanhaDetalhe';
import { AutomacaoTab }     from './components/AutomacaoTab';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const brl = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const formatUnix = (ts: number) => { try { const d = new Date(ts * 1000); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch { return '—'; } };
const getBenchmarkBadge = (taxa: number) => taxa >= 10 ? { label: 'Acima da média', bg: '#dcfce7', color: '#166534', icon: '🔥' } : taxa >= 5 ? { label: 'Na média', bg: '#dbeafe', color: '#1d4ed8', icon: '✅' } : { label: 'Precisa melhorar', bg: '#fef3c7', color: '#92400e', icon: '⚠️' };

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function TabCampaigns({ stats, pushForm, setPushForm, handleSendPush, sendingPush, token, API_URL }: TabCampaignsProps) {

    // ── UI state ──────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<'campanhas' | 'automacoes'>('campanhas');
    const [activeHistorySubTab, setActiveHistorySubTab] = useState<'onesignal' | 'ab' | 'jornada' | 'score' | 'local'>('onesignal');
    const [showSegmentation, setShowSegmentation] = useState(false);
    const [objetivo, setObjetivo] = useState<ObjetivoCampanha>(null);
    const [campanhaDetalhe, setCampanhaDetalhe] = useState<OneSignalNotif | null>(null);
    const [showABModal, setShowABModal] = useState(false);
    const [showIAModal, setShowIAModal] = useState(false);
    const [showDeepLink, setShowDeepLink] = useState(false);

    // ── Dados ─────────────────────────────────────────────────────────────────
    const data = useCampaignData({ token, API_URL, sendingPush });
    const { osStats, loadingStats, history, loadingHistory, abTests, loadingAB, abForm, setAbForm, sendingAB, deepLinkData, loadingDeepLink, automacao, setAutomacao, loadingAutomacao, savingAutomacao } = data;

    // ── Métricas derivadas ────────────────────────────────────────────────────
    const activeSubscribers = osStats?.active_subscribers ?? stats.instalacoes ?? 0;
    const totalSubscribers  = osStats?.subscribers ?? 0;
    const taxaOptin         = osStats?.taxa_optin ?? 0;
    const notifs            = osStats?.notifications ?? [];
    const porPais           = osStats?.por_pais ?? [];
    const porDisp           = osStats?.por_dispositivo ?? [];
    const mediaAbertura     = notifs.length > 0 ? Math.round(notifs.reduce((a, n) => a + n.taxa_abertura, 0) / notifs.length) : 0;
    const inativos          = Math.max(0, totalSubscribers - activeSubscribers);
    const pctAtivos         = totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0;
    const pctInativos       = 100 - pctAtivos;
    const churnRate         = totalSubscribers > 0 ? Math.round((inativos / totalSubscribers) * 100) : 0;
    const ticketMedio       = stats?.ticket_medio?.app ?? 0;
    const taxaConvGlobal    = stats?.taxa_conversao?.app ?? 0;
    const totalEnviados     = notifs.reduce((a, n) => a + n.sent, 0);
    const totalConfirmados  = notifs.reduce((a, n) => a + (n.confirmed_deliveries || 0), 0);
    const totalClicados     = notifs.reduce((a, n) => a + n.opened, 0);
    const totalConvertidos  = Math.round(totalClicados * (taxaConvGlobal / 100));
    const pctEntrega        = totalEnviados > 0 ? Math.round((totalConfirmados / totalEnviados) * 100) : 0;
    const pctClique         = totalEnviados > 0 ? Math.round((totalClicados / totalEnviados) * 100) : 0;
    const pctConversao      = totalClicados > 0 ? Math.round((totalConvertidos / totalClicados) * 100) : 0;
    const melhorHorario     = (() => {
        if (!notifs.length) return null;
        const h: Record<number, number> = {};
        notifs.forEach(n => { if (n.created_at) { const hr = new Date(n.created_at * 1000).getHours(); h[hr] = (h[hr] || 0) + n.opened; } });
        const m = Object.entries(h).sort((a, b) => +b[1] - +a[1])[0];
        return m ? `${m[0]}:00` : null;
    })();

    // ── Handlers ─────────────────────────────────────────────────────────────
    const alcanceEstimado = () => {
        if (!osStats) return activeSubscribers;
        let base = osStats.active_subscribers;
        if (pushForm.filter_device)  { const d = porDisp.find(x => x.dispositivo === pushForm.filter_device);  if (d) base = Math.round(base * d.pct / 100); }
        if (pushForm.filter_country) { const p = porPais.find(x => x.pais === pushForm.filter_country);         if (p) base = Math.round(base * p.pct / 100); }
        return base;
    };

    const handleSelecionarObjetivo = (obj: typeof OBJETIVOS[0]) => {
        if (objetivo === obj.id) { setObjetivo(null); return; }
        setObjetivo(obj.id);
        if (obj.segmento) { setPushForm({ ...pushForm, filter_behavior: obj.segmento }); setShowSegmentation(true); }
        else setPushForm({ ...pushForm, filter_behavior: undefined });
    };

    const handleSegmentarScore = (segmento: string) => {
        setPushForm({ ...pushForm, filter_behavior: segmento || undefined });
        setShowSegmentation(true);
        setActiveTab('campanhas');
        setActiveHistorySubTab('onesignal');
        setTimeout(() => document.querySelector('.config-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const handleSendAB = async () => {
        const result = await data.sendABTest();
        if (result.ok) { setShowABModal(false); setActiveHistorySubTab('ab'); }
        else alert('Erro ao enviar A/B. Tente novamente.');
    };

    const handleSaveAutomacao = async () => {
        const ok = await data.saveAutomacao();
        if (ok) alert('Automações salvas!');
        else alert('Erro ao salvar.');
    };

    const templatesAtivos = objetivo ? OBJETIVOS.find(o => o.id === objetivo)?.templates ?? [] : TEMPLATES_DEFAULT.map(t => ({ label: t.label, title: t.title, msg: t.msg }));
    const objAtivo = objetivo ? OBJETIVOS.find(o => o.id === objetivo) : null;

    return (
        <div className="animate-fade-in" style={{ marginTop: '20px' }}>

            {/* ── 3 CARDS DE MÉTRICAS ── */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: C.brand }}>{Icon.users}</div>
                    <div className="stat-info">
                        <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textMid, fontWeight: 600, fontSize: '14px' }}>Subscribers ativos</h3>
                        <p style={{ letterSpacing: '-0.02em' }}>{loadingStats ? '—' : activeSubscribers.toLocaleString('pt-BR')}</p>
                        <span className="stat-growth" style={{ color: C.brand, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>{Icon.bell} Push habilitado</span>
                        <div style={{ marginTop: '8px' }}>
                            <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(activeSubscribers, 100)}%`, background: C.brand, height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                            </div>
                            <span style={{ fontSize: '13px', color: C.neutralLight, marginTop: '4px', display: 'block' }}>Meta: {activeSubscribers} / 100</span>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: C.brand }}>{Icon.check}</div>
                    <div className="stat-info">
                        <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textMid, fontWeight: 600, fontSize: '14px' }}>Taxa de opt-in</h3>
                        <p style={{ letterSpacing: '-0.02em' }}>{loadingStats ? '—' : `${taxaOptin}%`}</p>
                        <Badge color={taxaOptin >= 50 ? C.success : C.warning} bg={taxaOptin >= 50 ? C.successBg : C.warningBg} border={taxaOptin >= 50 ? C.successBorder : C.warningBorder}>
                            {taxaOptin >= 50 ? Icon.check : Icon.alert} {taxaOptin >= 50 ? 'Excelente' : 'Pode melhorar'}
                        </Badge>
                        <span style={{ marginTop: '6px', display: 'block', fontSize: '13px', color: C.neutralLight }}>{osStats?.instalacoes ?? 0} instalações → {activeSubscribers} inscritos</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: C.brand }}>{Icon.chart}</div>
                    <div className="stat-info">
                        <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textMid, fontWeight: 600, fontSize: '14px' }}>Taxa de abertura média</h3>
                        <p style={{ letterSpacing: '-0.02em' }}>{loadingStats ? '—' : `${mediaAbertura}%`}</p>
                        {mediaAbertura > 0 && (() => { const b = getBenchmarkBadge(mediaAbertura); return <Badge color={b.color} bg={b.bg} border={b.bg}>{b.icon} {b.label}</Badge>; })()}
                        <span style={{ marginTop: '6px', display: 'block', fontSize: '13px', color: C.neutralLight }}>Média do setor: 5–10%</span>
                    </div>
                </div>
            </div>

            {/* ── SAÚDE DA BASE ── */}
            {loadingStats ? (
                <div className="config-card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '30px', color: C.neutralMid }}>Carregando dados do OneSignal...</div>
            ) : (
                <div className="config-card" style={{ marginBottom: '1.5rem' }}>
                    <SectionHeader icon={Icon.users} title="Saúde da base de push" subtitle="Ativos vs. inativos (bloquearam ou desinstalaram)" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
                        <div>
                            {totalSubscribers > 0 ? (
                                <>
                                    {[
                                        { label: 'Ativos',   val: activeSubscribers, pct: pctAtivos,   cor: C.success },
                                        { label: 'Inativos', val: inativos,           pct: pctInativos, cor: C.danger },
                                    ].map(b => (
                                        <div key={b.label} style={{ marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: C.textMid, fontWeight: 500 }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: b.cor, display: 'inline-block' }} />{b.label}</span>
                                                <span>{b.val.toLocaleString('pt-BR')} <span style={{ color: b.cor, fontWeight: 600 }}>({b.pct}%)</span></span>
                                            </div>
                                            <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                                                <div style={{ width: `${b.pct}%`, background: b.cor, height: '100%', borderRadius: '999px', transition: 'width 0.6s' }} />
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                        <Badge color={churnRate > 30 ? C.danger : C.success} bg={churnRate > 30 ? C.dangerBg : C.successBg} border={churnRate > 30 ? C.dangerBorder : C.successBorder}>{churnRate > 30 ? Icon.alert : Icon.check} Churn {churnRate}%</Badge>
                                        <Badge color={C.neutralMid} bg={C.neutralBg} border={C.neutralBorder}>{Icon.trending} Retenção {pctAtivos}%</Badge>
                                    </div>
                                    <div style={{ padding: '9px 12px', background: pctAtivos >= 70 ? C.successBg : C.warningBg, border: `1px solid ${pctAtivos >= 70 ? C.successBorder : C.warningBorder}`, borderRadius: '6px', fontSize: '13px', color: pctAtivos >= 70 ? C.success : C.warning, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {pctAtivos >= 70 ? Icon.check : Icon.alert}
                                        {pctAtivos >= 70 ? 'Base saudável — mais de 70% ativos' : pctAtivos >= 40 ? 'Base razoável — considere reativar inativos' : 'Base comprometida — muitos usuários bloquearam'}
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: '20px', background: C.neutralBg, borderRadius: '8px', textAlign: 'center', color: C.neutralMid, fontSize: '13px' }}>
                                    Aguardando dados do OneSignal...
                                    <div style={{ fontSize: '13px', marginTop: '6px', color: C.neutralLight }}>Configure o OneSignal na aba Configurações</div>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="stat-card" style={{ margin: 0, padding: '14px 16px' }}>
                                <div className="stat-info">
                                    <h3 style={{ fontSize: '13px', textTransform: 'none', letterSpacing: 'normal', color: C.textMid, fontWeight: 600 }}>Total cadastrado</h3>
                                    <p style={{ fontSize: '1.75rem', margin: '4px 0', letterSpacing: '-0.02em' }}>{totalSubscribers > 0 ? totalSubscribers.toLocaleString('pt-BR') : '—'}</p>
                                    <span style={{ fontSize: '13px', color: C.neutralLight }}>Todos que já deram permissão</span>
                                </div>
                            </div>
                            <div className="stat-card" style={{ margin: 0, padding: '14px 16px' }}>
                                <div className="stat-info">
                                    <h3 style={{ fontSize: '13px', textTransform: 'none', letterSpacing: 'normal', color: C.textMid, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>{Icon.clock} Melhor horário</h3>
                                    <p style={{ fontSize: '1.75rem', margin: '4px 0', letterSpacing: '-0.02em' }}>{melhorHorario ?? '—'}</p>
                                    <span style={{ fontSize: '13px', color: C.neutralLight }}>{melhorHorario ? 'Baseado nas aberturas' : 'Disponível após campanhas'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── FUNIL ── */}
            <div className="config-card" style={{ marginBottom: '1.5rem' }}>
                <SectionHeader icon={Icon.bell} title="Funil de notificações" subtitle={notifs.length > 0 ? `Performance agregada de ${notifs.length} campanhas` : 'Disponível após enviar campanhas'} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {[
                        { label: 'Enviados',    value: totalEnviados,    pct: 100,        color: C.brand,    icon: Icon.send,      desc: 'Total disparado' },
                        { label: 'Entregues',   value: totalConfirmados, pct: pctEntrega, color: '#3b82f6',  icon: Icon.check,     desc: `${pctEntrega}% do total` },
                        { label: 'Clicados',    value: totalClicados,    pct: pctClique,  color: C.success,  icon: Icon.eye,       desc: `CTR: ${pctClique}%` },
                        { label: 'Convertidos', value: totalConvertidos, pct: pctConversao, color: C.warning, icon: Icon.dollar,   desc: `${pctConversao}% dos cliques` },
                    ].map((step, i) => (
                        <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                            {i > 0 && <div style={{ position: 'absolute', left: '-6px', top: '50%', transform: 'translateY(-50%)', color: C.neutralLight, fontSize: '16px' }}>›</div>}
                            <div style={{ background: C.neutralBg, border: `1px solid ${step.color}25`, borderRadius: '10px', padding: '14px 10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px', color: step.value > 0 ? step.color : C.neutralLight }}>{step.icon}</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: step.value > 0 ? step.color : C.neutralLight, letterSpacing: '-0.02em', marginBottom: '2px' }}>{step.value > 0 ? step.value.toLocaleString('pt-BR') : '—'}</div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, marginBottom: '3px' }}>{step.label}</div>
                                <div style={{ fontSize: '13px', color: C.neutralLight }}>{step.desc}</div>
                                <div style={{ marginTop: '7px', background: C.neutralBorder, borderRadius: '999px', height: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${step.pct}%`, background: step.color, height: '100%', borderRadius: '999px', transition: 'width 0.6s' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── COACH ── */}
            <div className="config-card" style={{ marginBottom: '1.5rem' }}>
                <SectionHeader icon={Icon.brain} title="Coach automático" subtitle="Diagnóstico em tempo real baseado nos seus dados" />
                <CoachInsights notifs={notifs} totalSubscribers={totalSubscribers} activeSubscribers={activeSubscribers} churnRate={churnRate} mediaAbertura={mediaAbertura} ticketMedio={ticketMedio} taxaConvGlobal={taxaConvGlobal} melhorHorario={melhorHorario} brl={brl}
                    onAcao={acao => {
                        if (acao === 'ab') setShowABModal(true);
                        else if (acao === 'reativar') { setObjetivo('reativar'); setActiveTab('campanhas'); }
                        else if (acao === 'campanha') setActiveTab('campanhas');
                        else if (acao === 'agendar') { setShowSegmentation(true); setActiveTab('campanhas'); }
                    }}
                />
            </div>

            {/* ── DISPOSITIVOS + PAÍSES ── */}
            {(porDisp.length > 0 || porPais.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="config-card" style={{ marginBottom: 0 }}>
                        <SectionHeader icon={Icon.smartphone} title="Plataformas" subtitle="Distribuição por dispositivo" />
                        {porDisp.map(d => (
                            <div key={d.dispositivo} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: C.textMid, fontWeight: 500 }}>
                                    <span>{d.dispositivo}</span>
                                    <span style={{ color: C.textSoft }}>{d.count} ({d.pct}%)
                                        {totalClicados > 0 && <span style={{ marginLeft: '6px', color: C.success, fontWeight: 600 }}>· {Math.round(totalClicados * d.pct / 100)} cliques</span>}
                                    </span>
                                </div>
                                <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                                    <div style={{ width: `${d.pct}%`, background: DISP_COLORS[d.dispositivo] ?? C.brand, height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="config-card" style={{ marginBottom: 0 }}>
                        <SectionHeader icon={Icon.globe} title="Por país" />
                        {porPais.length === 0 ? <p style={{ color: C.neutralMid, fontSize: '13px' }}>Dados insuficientes</p> : porPais.map(p => (
                            <div key={p.pais} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: C.textMid, fontWeight: 500 }}>
                                    <span>{FLAG[p.pais] ?? '🏳️'} {PAIS_NOME[p.pais] ?? p.pais}</span>
                                    <span style={{ color: C.textSoft }}>{p.count} ({p.pct}%)</span>
                                </div>
                                <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                                    <div style={{ width: `${p.pct}%`, background: C.brand, height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TABS ── */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: C.neutralBg, borderRadius: '8px', padding: '3px', border: `1px solid ${C.neutralBorder}` }}>
                {(['campanhas', 'automacoes'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '7px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: activeTab === tab ? C.white : 'transparent', color: activeTab === tab ? C.text : C.neutralMid, boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {tab === 'campanhas' ? <>{Icon.send} Campanhas</> : <>{Icon.robot} Automações</>}
                    </button>
                ))}
            </div>

            {/* ── ABA CAMPANHAS ── */}
            {activeTab === 'campanhas' && (
                <>
                    <div className="config-card">
                        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>{Icon.send} Criar nova campanha</h2>
                            <p style={{ color: C.textSoft, fontSize: '13px', marginTop: '3px' }}>Envie notificações push para seus clientes.</p>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <SeletorObjetivo objetivo={objetivo} onSelect={handleSelecionarObjetivo} />
                        </div>
                        <div style={{ borderTop: `1px solid ${C.neutralBorder}`, margin: '4px 0 20px' }} />

                        {/* Alcance */}
                        <div style={{ background: C.neutralBg, padding: '12px 14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${C.neutralBorder}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: C.neutralMid, display: 'flex' }}>{Icon.users}</span>
                                <div style={{ fontSize: '13px', color: C.textMid }}>Alcance estimado: <span style={{ color: C.brand, fontWeight: 700 }}>{alcanceEstimado().toLocaleString('pt-BR')} dispositivos</span></div>
                            </div>
                            <button onClick={() => setShowSegmentation(!showSegmentation)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: showSegmentation ? C.brandLight : C.white, border: `1px solid ${showSegmentation ? C.brand : C.neutralBorder}`, borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: showSegmentation ? C.brand : C.textMid }}>
                                {Icon.filter} {showSegmentation ? 'Ocultar' : 'Segmentar'}
                            </button>
                        </div>

                        {/* Segmentação */}
                        {showSegmentation && (
                            <div className="animate-fade-in" style={{ background: C.neutralBg, border: `1px solid ${C.neutralBorder}`, borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, marginBottom: '12px' }}>Filtros de segmentação</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Comportamento</label>
                                        <select value={pushForm.filter_behavior ?? ''} onChange={e => setPushForm({ ...pushForm, filter_behavior: e.target.value || undefined })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                            <option value="">Todos os inscritos</option>
                                            <option value="buyers">Só quem já comprou</option>
                                            <option value="non_buyers">Só quem nunca comprou</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Dispositivo</label>
                                        <select value={pushForm.filter_device ?? ''} onChange={e => setPushForm({ ...pushForm, filter_device: e.target.value || undefined })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                            <option value="">Todos</option>
                                            <option value="Android">Android</option>
                                            <option value="iOS">iOS</option>
                                            <option value="Chrome">Chrome Web</option>
                                            <option value="Firefox">Firefox</option>
                                            <option value="Safari">Safari</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>País</label>
                                        <select value={pushForm.filter_country ?? ''} onChange={e => setPushForm({ ...pushForm, filter_country: e.target.value || undefined })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                            <option value="">Todos</option>
                                            <option value="BR">🇧🇷 Brasil</option>
                                            <option value="PT">🇵🇹 Portugal</option>
                                            <option value="US">🇺🇸 EUA</option>
                                            <option value="AR">🇦🇷 Argentina</option>
                                            <option value="MX">🇲🇽 Mexico</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Agendar envio</label>
                                        <input type="datetime-local" value={pushForm.send_after ? pushForm.send_after.slice(0, 16) : ''} onChange={e => setPushForm({ ...pushForm, send_after: e.target.value ? new Date(e.target.value).toISOString() : undefined })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', background: 'white', fontSize: '13px' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Freq. máxima</label>
                                        <select value={(pushForm as any).frequency_limit ?? ''} onChange={e => setPushForm({ ...pushForm, ...(e.target.value ? { frequency_limit: parseInt(e.target.value) } : { frequency_limit: undefined }) } as any)} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                            <option value="">Sem limite</option>
                                            <option value="1">Máx 1/dia</option>
                                            <option value="2">Máx 2/dia</option>
                                            <option value="3">Máx 3/dia</option>
                                        </select>
                                    </div>
                                </div>
                                {(pushForm.filter_device || pushForm.filter_country || pushForm.send_after || pushForm.filter_behavior) && (
                                    <button onClick={() => setPushForm({ ...pushForm, filter_device: undefined, filter_country: undefined, send_after: undefined, filter_behavior: undefined })} style={{ background: 'none', border: 'none', color: C.danger, fontSize: '13px', cursor: 'pointer', padding: 0 }}>× Limpar filtros</button>
                                )}
                            </div>
                        )}

                        {/* Título com IA */}
                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <label style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: C.textMid }}>Título</label>
                                <button onClick={() => setShowIAModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '6px', border: 'none', background: C.brand, color: C.white, fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                                    {Icon.brain} Gerar com IA
                                </button>
                            </div>
                            <input type="text" value={pushForm.title} onChange={e => setPushForm({ ...pushForm, title: e.target.value })} maxLength={50} placeholder="Ex: Oferta Relâmpago!" />
                            <small style={{ color: C.neutralLight }}>{pushForm.title.length}/50</small>
                        </div>

                        {/* Templates */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, marginBottom: '8px' }}>
                                {objetivo ? `Templates para ${objAtivo?.label}` : 'Templates prontos'} — clique para usar
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {templatesAtivos.map(t => (
                                    <button key={t.label} onClick={() => setPushForm({ ...pushForm, title: t.title, message: t.msg })} style={{ padding: '4px 12px', borderRadius: '999px', border: `1px solid ${objAtivo ? objAtivo.corBorder : C.neutralBorder}`, background: objAtivo ? objAtivo.corBg : C.neutralBg, fontSize: '13px', cursor: 'pointer', color: objAtivo ? objAtivo.cor : C.textMid, fontWeight: 500, transition: 'all 0.15s' }}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid }}>Mensagem</label>
                            <input type="text" value={pushForm.message} onChange={e => setPushForm({ ...pushForm, message: e.target.value })} maxLength={120} placeholder="Ex: 10% OFF hoje por tempo limitado!" />
                            <small style={{ color: C.neutralLight }}>{pushForm.message.length}/120</small>
                        </div>

                        {/* Link + Deep link */}
                        <div className="form-group">
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid }}>Link (opcional)</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" value={pushForm.url} onChange={e => setPushForm({ ...pushForm, url: e.target.value })} placeholder="https://..." style={{ flex: 1 }} />
                                <button onClick={() => { setShowDeepLink(true); data.fetchDeepLinks(); }} style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${C.neutralBorder}`, background: C.neutralBg, cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0, transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = C.brandLight; e.currentTarget.style.color = C.brand; e.currentTarget.style.borderColor = C.brand; }} onMouseOut={e => { e.currentTarget.style.background = C.neutralBg; e.currentTarget.style.color = C.textMid; e.currentTarget.style.borderColor = C.neutralBorder; }}>
                                    {Icon.link} Auto
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid }}>Imagem Rich Push (opcional)</label>
                            <input type="text" value={pushForm.image_url ?? ''} onChange={e => setPushForm({ ...pushForm, image_url: e.target.value || undefined })} placeholder="https://... (banner, foto do produto)" />
                            <small style={{ color: C.neutralLight }}>Aparece como imagem grande (Android + Chrome). Aumenta o CTR em até 50%.</small>
                        </div>

                        {/* Preview */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, marginBottom: '10px' }}>Preview</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {/* Android */}
                                <div>
                                    <div style={{ fontSize: '13px', color: C.textSoft, marginBottom: '6px' }}>Android</div>
                                    <div style={{ background: '#1a1a2e', borderRadius: '14px', padding: '10px', border: '3px solid #333' }}>
                                        <div style={{ background: '#2d2d2d', borderRadius: '8px', padding: '10px' }}>
                                            {pushForm.image_url && <div style={{ width: '100%', height: '60px', borderRadius: '5px', marginBottom: '7px', overflow: 'hidden', background: '#3d3d3d' }}><img src={pushForm.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /></div>}
                                            <div style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                                                <div style={{ width: '26px', height: '26px', borderRadius: '5px', background: objAtivo?.cor ?? C.brand, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>{objAtivo?.icon ?? '🔔'}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pushForm.title || 'Título'}</div>
                                                    <div style={{ fontSize: '13px', color: C.neutralLight, marginTop: '1px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{pushForm.message || 'Mensagem'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Desktop */}
                                <div>
                                    <div style={{ fontSize: '13px', color: C.textSoft, marginBottom: '6px' }}>Desktop</div>
                                    <div style={{ background: '#f1f1f1', borderRadius: '10px', padding: '8px', border: '1px solid #ddd' }}>
                                        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                                            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', background: c }} />)}
                                        </div>
                                        <div style={{ background: '#fff', borderRadius: '6px', padding: '9px 11px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', gap: '9px', alignItems: 'flex-start', position: 'relative' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '5px', background: objAtivo?.cor ?? C.brand, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{objAtivo?.icon ?? '🔔'}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pushForm.title || 'Título'}</div>
                                                <div style={{ fontSize: '13px', color: C.textSoft, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{pushForm.message || 'Mensagem'}</div>
                                            </div>
                                            <span style={{ position: 'absolute', top: '6px', right: '7px', fontSize: '9px', color: C.neutralLight }}>agora</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botões */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <button className="save-button" onClick={handleSendPush} disabled={sendingPush || !pushForm.title || !pushForm.message} style={{ background: sendingPush ? C.neutralBorder : objAtivo?.cor ?? C.dark, flex: 1, transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                                {Icon.send}
                                {sendingPush ? 'Enviando...' : pushForm.send_after ? `Agendar — ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos` : `Enviar${objAtivo ? ` · ${objAtivo.label}` : ''} — ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos`}
                            </button>
                            <button onClick={() => setShowABModal(true)} style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.neutralBorder}`, background: C.white, cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: C.textMid, display: 'inline-flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.borderColor = C.brand; e.currentTarget.style.color = C.brand; }} onMouseOut={e => { e.currentTarget.style.borderColor = C.neutralBorder; e.currentTarget.style.color = C.textMid; }}>
                                {Icon.flask} A/B
                            </button>
                        </div>
                    </div>

                    {/* ── HISTÓRICO ── */}
                    <div className="config-card" style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: '7px' }}>{Icon.history} Histórico de campanhas</div>
                                <div style={{ fontSize: '13px', color: C.textSoft, marginTop: '2px' }}>Métricas reais do OneSignal{ticketMedio > 0 ? ' + ROI estimado' : ''}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', background: C.neutralBg, borderRadius: '7px', padding: '3px', gap: '2px', border: `1px solid ${C.neutralBorder}` }}>
                                    {(['onesignal', 'ab', 'jornada', 'score', 'local'] as const).map(tab => (
                                        <button key={tab} onClick={() => setActiveHistorySubTab(tab)} style={{ padding: '4px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: activeHistorySubTab === tab ? C.white : 'transparent', color: activeHistorySubTab === tab ? C.text : C.neutralMid, boxShadow: activeHistorySubTab === tab ? '0 1px 2px rgba(0,0,0,0.08)' : 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            {tab === 'onesignal' ? <>{Icon.bell} OneSignal</> : tab === 'ab' ? <>{Icon.flask} A/B</> : tab === 'jornada' ? <>{Icon.map} Jornada</> : tab === 'score' ? <>{Icon.score} Score</> : <>{Icon.history} Local</>}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={data.fetchAll} style={{ background: 'none', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: C.neutralMid, display: 'flex' }}>{Icon.refresh}</button>
                            </div>
                        </div>

                        {activeHistorySubTab === 'onesignal' && (
                            loadingStats ? <p style={{ textAlign: 'center', padding: '20px', color: C.neutralMid }}>Carregando...</p>
                            : notifs.length === 0 ? <p style={{ textAlign: 'center', padding: '20px', color: C.neutralMid }}>Nenhuma campanha ainda.</p>
                            : <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead><tr style={{ background: C.neutralBg, color: C.textSoft, textAlign: 'left' }}>
                                        <th style={{ padding: '10px 12px' }}>Data</th>
                                        <th style={{ padding: '10px 12px' }}>Mensagem</th>
                                        <th style={{ padding: '10px 12px' }}>Funil</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Enviados</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Abertos</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Taxa</th>
                                        {ticketMedio > 0 && <th style={{ padding: '10px 12px', textAlign: 'right' }}>ROI est.</th>}
                                        <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '13px', color: C.neutralLight, fontWeight: 400 }}>detalhe</th>
                                    </tr></thead>
                                    <tbody>{notifs.map(n => {
                                        const roi = ticketMedio > 0 ? Math.round(n.opened * (taxaConvGlobal / 100) * ticketMedio) : 0;
                                        const b = getBenchmarkBadge(n.taxa_abertura);
                                        const funil = inferirFunil(n.title, n.message);
                                        return (
                                            <tr key={n.id} onClick={() => setCampanhaDetalhe(n)} style={{ borderBottom: `1px solid ${C.neutralBorder}`, cursor: 'pointer', transition: 'background 0.15s' }} onMouseOver={e => (e.currentTarget.style.background = C.neutralBg)} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                                                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: C.textSoft, fontSize: '13px' }}>{formatUnix(n.created_at)}</td>
                                                <td style={{ padding: '10px 12px' }}>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        {n.image_url && <img src={n.image_url} alt="" style={{ width: '36px', height: '36px', borderRadius: '5px', objectFit: 'cover', flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                                                        <div><div style={{ fontWeight: 600, fontSize: '13px', color: C.text }}>{n.title}</div><div style={{ fontSize: '13px', color: C.textSoft }}>{n.message}</div></div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '10px 12px' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, background: funil.bg, color: funil.color, whiteSpace: 'nowrap' }}>
                                                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: funil.color, display: 'inline-block' }} /> {funil.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: C.brand }}>{n.sent.toLocaleString('pt-BR')}</td>
                                                <td style={{ padding: '10px 12px', textAlign: 'right', color: C.success }}>{n.opened.toLocaleString('pt-BR')}</td>
                                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                                    <span style={{ background: b.bg, color: b.color, padding: '2px 8px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>{b.icon} {n.taxa_abertura}%</span>
                                                </td>
                                                {ticketMedio > 0 && <td style={{ padding: '10px 12px', textAlign: 'right' }}>{roi > 0 ? <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>~{brl(roi)}</span> : <span style={{ color: C.neutralLight }}>—</span>}</td>}
                                                <td style={{ padding: '10px 12px', textAlign: 'center', color: C.neutralLight }}>›</td>
                                            </tr>
                                        );
                                    })}</tbody>
                                </table>
                            </div>
                        )}

                        {activeHistorySubTab === 'ab' && (
                            <div style={{ padding: '8px 0' }}>
                                {loadingAB ? <p style={{ textAlign: 'center', padding: '20px', color: C.neutralMid }}>Carregando...</p>
                                : abTests.length === 0 ? <div style={{ textAlign: 'center', padding: '30px', color: C.textSoft }}><div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: C.neutralLight }}>{Icon.flask}</div><div style={{ fontWeight: 600, marginBottom: '6px', color: C.textMid }}>Nenhum teste A/B ainda</div><div style={{ fontSize: '13px' }}>Clique no botão A/B ao lado do envio para criar seu primeiro teste.</div></div>
                                : abTests.map(t => <ABResultCard key={t.id} test={t} onRefresh={data.refreshABTest} />)}
                            </div>
                        )}

                        {activeHistorySubTab === 'jornada' && <div style={{ padding: '8px 0' }}><JornadaTab token={token} API_URL={API_URL} brl={brl} /></div>}
                        {activeHistorySubTab === 'score'   && <div style={{ padding: '8px 0' }}><ScoreTab token={token} API_URL={API_URL} onSegmentar={handleSegmentarScore} /></div>}

                        {activeHistorySubTab === 'local' && (
                            loadingHistory ? <p style={{ textAlign: 'center', padding: '20px', color: C.neutralMid }}>Carregando...</p>
                            : history.length === 0 ? <p style={{ textAlign: 'center', padding: '20px', color: C.neutralMid }}>Nenhuma campanha local.</p>
                            : <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead><tr style={{ background: C.neutralBg, color: C.textSoft, textAlign: 'left' }}><th style={{ padding: '10px 12px' }}>Data</th><th style={{ padding: '10px 12px' }}>Mensagem</th><th style={{ padding: '10px 12px', textAlign: 'right' }}>Enviados</th></tr></thead>
                                    <tbody>{history.map(item => (
                                        <tr key={item.id} style={{ borderBottom: `1px solid ${C.neutralBorder}` }}>
                                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: C.textSoft, fontSize: '13px' }}>{item.created_at}</td>
                                            <td style={{ padding: '10px 12px' }}><div style={{ fontWeight: 600, color: C.text }}>{item.title}</div><div style={{ fontSize: '13px', color: C.textSoft }}>{item.message}</div></td>
                                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: C.brand }}>{item.sent_count}</td>
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
                <AutomacaoTab automacao={automacao} setAutomacao={setAutomacao} loadingAutomacao={loadingAutomacao} savingAutomacao={savingAutomacao} onSave={handleSaveAutomacao} />
            )}

            {/* ── MODAL DEEP LINK ── */}
            {showDeepLink && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowDeepLink(false)}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${C.neutralBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: '7px' }}>{Icon.link} Deep Link Automático</div>
                                <div style={{ fontSize: '13px', color: C.textSoft, marginTop: '2px' }}>Selecione o destino da notificação</div>
                            </div>
                            <button onClick={() => setShowDeepLink(false)} style={{ background: C.neutralBg, border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>×</button>
                        </div>
                        <div style={{ padding: '18px 22px' }}>
                            {loadingDeepLink ? <div style={{ textAlign: 'center', padding: '30px', color: C.textSoft }}>Carregando produtos...</div>
                            : !deepLinkData ? <div style={{ textAlign: 'center', padding: '30px', color: C.textSoft }}>Nenhum dado disponível</div>
                            : (
                                <>
                                    <div style={{ marginBottom: '18px' }}>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: C.neutralLight, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Atalhos</div>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {[{ label: 'Página Inicial', url: '/' }, { label: 'Carrinho', url: '/checkout' }, { label: 'Produtos', url: '/produtos' }, { label: 'Minha Conta', url: '/minha-conta' }].map(a => (
                                                <button key={a.url} onClick={() => { setPushForm({ ...pushForm, url: a.url }); setShowDeepLink(false); }} style={{ padding: '5px 12px', borderRadius: '6px', border: `1px solid ${C.neutralBorder}`, background: C.neutralBg, cursor: 'pointer', fontSize: '13px', color: C.textMid }}>
                                                    {a.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {deepLinkData.produtos_visitados.length > 0 && (
                                        <div style={{ marginBottom: '18px' }}>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: C.neutralLight, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Produtos mais visitados (7 dias)</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                {deepLinkData.produtos_visitados.map((p, i) => (
                                                    <button key={i} onClick={() => { setPushForm({ ...pushForm, url: p.url }); setShowDeepLink(false); }} style={{ padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.neutralBorder}`, background: C.neutralBg, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s' }} onMouseOver={e => { e.currentTarget.style.background = C.brandLight; e.currentTarget.style.borderColor = C.brand; }} onMouseOut={e => { e.currentTarget.style.background = C.neutralBg; e.currentTarget.style.borderColor = C.neutralBorder; }}>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome}</div>
                                                            <div style={{ fontSize: '13px', color: C.textSoft }}>{p.visitas} visitas{p.preco ? ` · R$ ${p.preco}` : ''}</div>
                                                        </div>
                                                        <span style={{ fontSize: '13px', color: C.brand, fontWeight: 600, flexShrink: 0 }}>Usar →</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {deepLinkData.carrinhos_ativos.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: C.neutralLight, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Carrinhos ativos</div>
                                            <button onClick={() => { setPushForm({ ...pushForm, url: '/checkout' }); setShowDeepLink(false); }} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `2px solid ${C.warningBorder}`, background: C.warningBg, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 600, color: C.warning }}>Direcionar para o Checkout</div>
                                                    <div style={{ fontSize: '13px', color: C.warning }}>{deepLinkData.carrinhos_ativos.length} carrinhos ativos aguardando</div>
                                                </div>
                                                <span style={{ fontSize: '13px', color: C.warning, fontWeight: 600 }}>Usar →</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAIS ── */}
            {showABModal && <ABTestModal form={abForm} setForm={setAbForm} onSend={handleSendAB} sending={sendingAB} onClose={() => setShowABModal(false)} alcance={alcanceEstimado()} />}
            {showIAModal && <IAGerarModal objetivo={objetivo} mediaAbertura={mediaAbertura} onAplicar={(title, message) => setPushForm({ ...pushForm, title, message })} onClose={() => setShowIAModal(false)} />}
            {campanhaDetalhe && <CampanhaDetalhe notif={campanhaDetalhe} mediaAbertura={mediaAbertura} ticketMedio={ticketMedio} taxaConvGlobal={taxaConvGlobal} onClose={() => setCampanhaDetalhe(null)} brl={brl} />}
        </div>
    );
}
