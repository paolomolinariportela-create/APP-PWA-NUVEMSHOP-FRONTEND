import { useEffect, useState } from 'react';
import { ScoreData } from '../types';
import { C, Icon } from '../design';

interface Props {
    token: string | null;
    API_URL: string;
    onSegmentar: (segmento: string, label: string) => void;
}

function formatRelative(s: string) {
    try {
        const diff = Math.round((Date.now() - new Date(s).getTime()) / 86400000);
        if (diff === 0) return 'hoje';
        if (diff === 1) return 'ontem';
        return `há ${diff} dias`;
    } catch { return s; }
}

export function ScoreTab({ token, API_URL, onSegmentar }: Props) {
    const [data, setData] = useState<ScoreData | null>(null);
    const [loading, setLoading] = useState(false);
    const [grupoAberto, setGrupoAberto] = useState<string | null>(null);

    const fetchScores = () => {
        if (!token) return;
        setLoading(true);
        fetch(`${API_URL}/analytics/scores`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(() => { fetchScores(); }, [token]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: C.textSoft }}>Calculando scores...</div>;

    if (!data || data.total_visitors === 0) return (
        <div style={{ textAlign: 'center', padding: '50px', color: C.textSoft }}>
            <div style={{ fontSize: '28px', marginBottom: '12px', display: 'flex', justifyContent: 'center', color: C.neutralLight }}>{Icon.score}</div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: C.text, marginBottom: '6px' }}>Nenhum visitor ainda</div>
            <div style={{ fontSize: '13px' }}>Os scores aparecem assim que os primeiros usuários acessarem a loja.</div>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>Score de usuários</div>
                    <div style={{ fontSize: '12px', color: C.textSoft, marginTop: '2px' }}>{data.total_visitors.toLocaleString('pt-BR')} visitors classificados por comportamento</div>
                </div>
                <button onClick={fetchScores} style={{ background: 'none', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', color: C.textMid, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{Icon.refresh} Atualizar</button>
            </div>

            {/* Barra de distribuição */}
            <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '10px', marginBottom: '18px' }}>
                {data.grupos.filter(g => g.count > 0).map(g => (
                    <div key={g.id} title={`${g.label}: ${g.count} (${g.pct}%)`} style={{ width: `${g.pct}%`, background: g.cor, transition: 'width 0.6s' }} />
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.grupos.map(g => {
                    const aberto = grupoAberto === g.id;
                    return (
                        <div key={g.id} style={{ border: `1px solid ${g.count > 0 ? g.cor + '40' : C.neutralBorder}`, borderRadius: '10px', overflow: 'hidden', opacity: g.count === 0 ? 0.5 : 1 }}>
                            <div onClick={() => g.count > 0 && setGrupoAberto(aberto ? null : g.id)} style={{ padding: '12px 14px', background: aberto ? g.corBg : C.white, cursor: g.count > 0 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: g.cor }}>{g.label}</span>
                                        <span style={{ background: g.corBg, color: g.cor, border: `1px solid ${g.cor}30`, padding: '1px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{g.count.toLocaleString('pt-BR')}</span>
                                        <span style={{ fontSize: '11px', color: C.neutralLight }}>{g.pct}%</span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: C.textSoft }}>{g.desc}</div>
                                </div>
                                <div style={{ width: '80px', flexShrink: 0 }}>
                                    <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${g.pct}%`, background: g.cor, height: '100%', borderRadius: '999px' }} />
                                    </div>
                                </div>
                                {g.count > 0 && (
                                    <button onClick={e => { e.stopPropagation(); onSegmentar(g.segmento_os, g.label); }} style={{ padding: '5px 10px', borderRadius: '6px', border: `1px solid ${g.cor}`, background: C.white, color: g.cor, fontSize: '11px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }} onMouseOver={e => { e.currentTarget.style.background = g.corBg; }} onMouseOut={e => { e.currentTarget.style.background = C.white; }}>
                                        Enviar push
                                    </button>
                                )}
                                {g.count > 0 && <span style={{ color: C.neutralLight, fontSize: '12px', flexShrink: 0 }}>{aberto ? '▲' : '▼'}</span>}
                            </div>

                            {aberto && g.visitors.length > 0 && (
                                <div style={{ borderTop: `1px solid ${g.cor}20`, background: g.corBg, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {g.visitors.map((v, i) => (
                                        <div key={i} style={{ background: C.white, borderRadius: '6px', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: g.cor, flexShrink: 0 }} />
                                            <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '10px', color: C.textMid }}>{v.visitor_id.substring(0, 20)}…</div>
                                            <div style={{ fontSize: '10px', color: C.textSoft }}>{formatRelative(v.ultima_visita)}</div>
                                            <div style={{ display: 'flex', gap: '3px' }}>
                                                {v.comprador && <span style={{ background: C.successBg, color: C.success, padding: '1px 5px', borderRadius: '999px', fontSize: '9px', fontWeight: 600 }}>comprador</span>}
                                                {v.carrinho_ativo && <span style={{ background: C.warningBg, color: C.warning, padding: '1px 5px', borderRadius: '999px', fontSize: '9px', fontWeight: 600 }}>carrinho</span>}
                                            </div>
                                        </div>
                                    ))}
                                    {g.count > g.visitors.length && <div style={{ textAlign: 'center', fontSize: '10px', color: C.neutralLight, paddingTop: '2px' }}>+ {g.count - g.visitors.length} não exibidos</div>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '14px', padding: '10px 14px', background: C.neutralBg, borderRadius: '8px', fontSize: '11px', color: C.textSoft, lineHeight: 1.6 }}>
                <strong style={{ color: C.textMid }}>Como funciona:</strong> Score calculado com base em visitas, compras e carrinhos do banco. Clique em "Enviar push" para criar uma campanha já segmentada.
            </div>
        </div>
    );
}
