import React, { useEffect, useState } from 'react';
import { JornadaNotif, JornadaResumo } from '../types';
import { C, Icon } from '../design';

interface Props { token: string | null; API_URL: string; brl: (v: number) => string; }

function formatDate(s: string) {
    try {
        const d = new Date(s);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch { return s; }
}

export function JornadaTab({ token, API_URL, brl }: Props) {
    const [jornada, setJornada] = useState<JornadaNotif[]>([]);
    const [resumo, setResumo] = useState<JornadaResumo | null>(null);
    const [loading, setLoading] = useState(false);
    const [notifSelecionada, setNotifSelecionada] = useState<JornadaNotif | null>(null);

    const fetchJornada = () => {
        if (!token) return;
        setLoading(true);
        fetch(`${API_URL}/analytics/jornada`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => {
                setJornada(data.jornada ?? []);
                setResumo(data.resumo ?? null);
                if (data.jornada?.length > 0) setNotifSelecionada(data.jornada[0]);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchJornada(); }, [token]);

    if (loading) return <div style={{ textAlign: 'center', padding: '60px 20px', color: C.textSoft }}>Carregando jornada...</div>;

    if (!jornada.length) return (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: C.textSoft }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', color: C.neutralLight, display: 'flex', justifyContent: 'center' }}>{Icon.map}</div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: C.text, marginBottom: '8px' }}>Nenhuma jornada registrada ainda</div>
            <div style={{ fontSize: '13px', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto' }}>
                A jornada aparece quando um usuário clica em um push e acessa a loja.
            </div>
        </div>
    );

    const n = notifSelecionada;
    const convertidos = n?.subscribers.filter(s => s.converted) ?? [];
    const naoConvertidos = n?.subscribers.filter(s => !s.converted) ?? [];
    const etapas = n ? [
        { label: 'Enviados',  valor: n.enviados,   cor: C.brand,    bg: C.brandLight,   desc: 'notificações disparadas' },
        { label: 'Clicaram',  valor: n.cliques,    cor: '#3b82f6',  bg: '#EFF6FF',      desc: `CTR ${n.taxa_conversao}%` },
        { label: 'Compraram', valor: n.convertidos, cor: C.success, bg: C.successBg,    desc: n.receita_atribuida > 0 ? brl(n.receita_atribuida) : 'sem conversão' },
    ] : [];
    const pctClique = n && n.enviados > 0 ? Math.round((n.cliques / n.enviados) * 100) : 0;
    const pctConv = n && n.cliques > 0 ? Math.round((n.convertidos / n.cliques) * 100) : 0;

    return (
        <div>
            {resumo && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                    {[
                        { label: 'Total Cliques',     value: resumo.total_cliques.toLocaleString('pt-BR'), color: C.brand },
                        { label: 'Convertidos',        value: resumo.total_convertidos.toLocaleString('pt-BR'), color: C.success },
                        { label: 'Taxa Conv.',         value: `${resumo.taxa_conversao}%`, color: C.warning },
                        { label: 'Receita Atribuída',  value: brl(resumo.receita_atribuida), color: C.success },
                    ].map((card, i) => (
                        <div key={i} style={{ background: C.neutralBg, border: `1px solid ${card.color}20`, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '22px', fontWeight: 700, color: card.color, letterSpacing: '-0.02em' }}>{card.value}</div>
                            <div style={{ fontSize: '13px', color: C.textSoft, marginTop: '2px' }}>{card.label}</div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px' }}>
                {/* Lista lateral */}
                <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: C.neutralLight, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Campanhas com cliques</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {jornada.map(j => {
                            const ativa = notifSelecionada?.notif_id === j.notif_id;
                            return (
                                <button key={j.notif_id} onClick={() => setNotifSelecionada(j)} style={{ padding: '10px 12px', borderRadius: '8px', border: 'none', textAlign: 'left', cursor: 'pointer', background: ativa ? C.dark : C.neutralBg, boxShadow: ativa ? '0 2px 8px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.2s' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: ativa ? '#fff' : C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }}>{j.titulo || '—'}</div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: ativa ? C.neutralLight : C.textSoft }}>{j.cliques} cliques</span>
                                        {j.convertidos > 0 && <span style={{ background: ativa ? '#10B98130' : C.successBg, color: ativa ? '#6ee7b7' : C.success, padding: '1px 6px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>{j.convertidos} compras</span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {n && (
                    <div>
                        <div style={{ background: C.dark, borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{n.titulo}</div>
                            <div style={{ fontSize: '13px', color: C.neutralLight }}>{n.mensagem}</div>
                        </div>

                        {/* Fluxo horizontal */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            {etapas.map((e, i) => (
                                <React.Fragment key={i}>
                                    <div style={{ flex: 1, background: e.bg, border: `1px solid ${e.cor}30`, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '22px', fontWeight: 800, color: e.cor, letterSpacing: '-0.02em', marginBottom: '2px' }}>{e.valor > 0 ? e.valor.toLocaleString('pt-BR') : '—'}</div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: C.textMid }}>{e.label}</div>
                                        <div style={{ fontSize: '13px', color: C.textSoft }}>{e.desc}</div>
                                    </div>
                                    {i < etapas.length - 1 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 6px', flexShrink: 0 }}>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: i === 0 ? '#3b82f6' : C.success }}>{i === 0 ? `${pctClique}%` : `${pctConv}%`}</div>
                                            <div style={{ fontSize: '16px', color: C.neutralLight }}>→</div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Barras de perda */}
                        <div style={{ background: C.neutralBg, borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, marginBottom: '8px' }}>Onde os usuários saíram</div>
                            {[
                                { label: 'Enviados → Cliques', pct: pctClique, cor: '#3b82f6', ok: pctClique >= 5 },
                                { label: 'Cliques → Compras',  pct: pctConv,   cor: C.success,  ok: pctConv >= 10 },
                            ].map((b, i) => (
                                <div key={i} style={{ marginBottom: i === 0 ? '8px' : '0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: C.textSoft, marginBottom: '3px' }}>
                                        <span>{b.label}</span>
                                        <span style={{ fontWeight: 600, color: b.ok ? C.success : C.danger }}>{b.pct}%</span>
                                    </div>
                                    <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                                        <div style={{ width: `${b.pct}%`, background: b.cor, height: '100%', borderRadius: '999px', transition: 'width 0.8s' }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Convertidos vs não */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ background: C.successBg, border: `1px solid ${C.successBorder}`, borderRadius: '10px', padding: '12px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: C.success, marginBottom: '8px' }}>Compraram ({convertidos.length})</div>
                                {convertidos.length === 0 ? <div style={{ fontSize: '13px', color: C.textSoft, textAlign: 'center', padding: '8px 0' }}>Nenhuma conversão</div> : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '160px', overflowY: 'auto' }}>
                                        {convertidos.map((s, i) => (
                                            <div key={i} style={{ background: '#fff', borderRadius: '6px', padding: '7px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontSize: '13px', fontFamily: 'monospace', color: C.textMid }}>{s.visitor_id.substring(0, 14)}…</div>
                                                    <div style={{ fontSize: '13px', color: C.textSoft }}>{formatDate(s.clicked_at)}</div>
                                                </div>
                                                {s.revenue && <div style={{ fontSize: '13px', fontWeight: 700, color: C.success }}>{brl(s.revenue)}</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div style={{ background: C.warningBg, border: `1px solid ${C.warningBorder}`, borderRadius: '10px', padding: '12px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: C.warning, marginBottom: '8px' }}>Não compraram ({naoConvertidos.length})</div>
                                {naoConvertidos.length === 0 ? <div style={{ fontSize: '13px', color: C.textSoft, textAlign: 'center', padding: '8px 0' }}>Todos converteram!</div> : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '160px', overflowY: 'auto' }}>
                                        {naoConvertidos.map((s, i) => (
                                            <div key={i} style={{ background: '#fff', borderRadius: '6px', padding: '7px 10px' }}>
                                                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: C.textMid }}>{s.visitor_id.substring(0, 14)}…</div>
                                                <div style={{ fontSize: '13px', color: C.textSoft }}>{formatDate(s.clicked_at)}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button onClick={fetchJornada} style={{ marginTop: '14px', background: 'none', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', padding: '7px 14px', cursor: 'pointer', fontSize: '13px', color: C.textMid, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                {Icon.refresh} Atualizar jornada
            </button>
        </div>
    );
}
