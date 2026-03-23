import { OneSignalNotif } from '../types';
import { C, Icon } from '../design';
import { inferirFunil } from './SeletorObjetivo';

interface Props {
    notif: OneSignalNotif;
    mediaAbertura: number;
    ticketMedio: number;
    taxaConvGlobal: number;
    onClose: () => void;
    brl: (v: number) => string;
}

function benchmarkBadge(taxa: number) {
    if (taxa >= 10) return { label: 'Acima da média', bg: '#dcfce7', color: C.success, icon: '🔥' };
    if (taxa >= 5)  return { label: 'Na média',       bg: '#dbeafe', color: '#1d4ed8', icon: '✅' };
    return               { label: 'Precisa melhorar', bg: '#fef3c7', color: C.warning,  icon: '⚠️' };
}

export function CampanhaDetalhe({ notif, mediaAbertura, ticketMedio, taxaConvGlobal, onClose, brl }: Props) {
    const roi = ticketMedio > 0 ? Math.round(notif.opened * (taxaConvGlobal / 100) * ticketMedio) : 0;
    const ctr = notif.sent > 0 ? ((notif.opened / notif.sent) * 100).toFixed(1) : '0';
    const taxaEntrega = notif.sent > 0 ? Math.round((notif.confirmed_deliveries / notif.sent) * 100) : 0;
    const convertidos = Math.round(notif.opened * (taxaConvGlobal / 100));
    const vsMedia = notif.taxa_abertura - mediaAbertura;
    const badge = benchmarkBadge(notif.taxa_abertura);
    const funil = inferirFunil(notif.title, notif.message);

    const metricas = [
        { icon: Icon.send,   label: 'Enviados',  value: notif.sent.toLocaleString('pt-BR'),                  sub: '100% da base',        color: C.brand },
        { icon: Icon.check,  label: 'Entregues', value: notif.confirmed_deliveries.toLocaleString('pt-BR'),  sub: `${taxaEntrega}% entrega`, color: '#3b82f6' },
        { icon: Icon.eye,    label: 'Abertos',   value: notif.opened.toLocaleString('pt-BR'),                sub: `CTR: ${ctr}%`,        color: C.success },
        { icon: Icon.alert,  label: 'Falhos',    value: notif.failed.toLocaleString('pt-BR'),                sub: 'não entregues',       color: C.danger },
    ];

    const funilSteps = [
        { label: 'Enviados',  value: notif.sent,                  pct: 100,        color: C.brand },
        { label: 'Entregues', value: notif.confirmed_deliveries,   pct: taxaEntrega, color: '#3b82f6' },
        { label: 'Abertos',   value: notif.opened,                 pct: notif.sent > 0 ? Math.round((notif.opened / notif.sent) * 100) : 0, color: C.success },
        ...(ticketMedio > 0 ? [{ label: 'Convertidos', value: convertidos, pct: notif.opened > 0 ? Math.round((convertidos / notif.opened) * 100) : 0, color: C.warning }] : []),
    ];

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
            <div style={{ background: C.white, borderRadius: '16px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.neutralBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ fontSize: '10px', color: C.neutralLight, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Detalhes da campanha</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: C.text }}>{notif.title}</div>
                        <div style={{ fontSize: '13px', color: C.textSoft, marginTop: '2px' }}>{notif.message}</div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: funil.bg, color: funil.color }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: funil.color, display: 'inline-block' }} />
                            {funil.label}
                        </span>
                    </div>
                    <button onClick={onClose} style={{ background: C.neutralBg, border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', flexShrink: 0, marginLeft: '12px' }}>×</button>
                </div>

                <div style={{ padding: '20px 24px' }}>
                    {/* 4 métricas */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '18px' }}>
                        {metricas.map((m, i) => (
                            <div key={i} style={{ background: C.neutralBg, border: `1px solid ${m.color}15`, borderRadius: '10px', padding: '12px 8px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px', color: m.color }}>{m.icon}</div>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
                                <div style={{ fontSize: '11px', fontWeight: 600, color: C.textMid, marginBottom: '1px' }}>{m.label}</div>
                                <div style={{ fontSize: '10px', color: C.neutralLight }}>{m.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTR vs média */}
                    <div style={{ background: C.neutralBg, borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: C.textMid, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>{Icon.chart} Taxa de abertura vs média geral</div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {[
                                { label: 'Esta campanha', value: notif.taxa_abertura, color: badge.color },
                                { label: 'Média geral',   value: mediaAbertura,       color: C.neutralLight },
                            ].map((b, i) => (
                                <div key={i} style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                                        <span style={{ color: C.textSoft }}>{b.label}</span>
                                        <span style={{ fontWeight: 700, color: b.color }}>{b.value}%</span>
                                    </div>
                                    <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                                        <div style={{ width: `${Math.min(b.value * 5, 100)}%`, background: b.color, height: '100%', borderRadius: '999px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: badge.bg, color: badge.color, padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{badge.icon} {badge.label}</span>
                            {mediaAbertura > 0 && <span style={{ fontSize: '11px', color: vsMedia >= 0 ? C.success : C.danger, fontWeight: 600 }}>{vsMedia >= 0 ? `+${vsMedia.toFixed(1)}` : vsMedia.toFixed(1)}% vs sua média</span>}
                        </div>
                    </div>

                    {/* ROI */}
                    {ticketMedio > 0 && (
                        <div style={{ background: roi > 0 ? C.successBg : C.neutralBg, border: `1px solid ${roi > 0 ? C.successBorder : C.neutralBorder}`, borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: C.textMid, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>{Icon.dollar} ROI estimado</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                                {[
                                    { label: 'Cliques',         value: notif.opened,  color: C.success },
                                    { label: 'Convertidos est.',value: convertidos,    color: C.warning },
                                    { label: 'Receita est.',    value: roi > 0 ? brl(roi) : '—', color: roi > 0 ? C.success : C.neutralLight },
                                ].map((m, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: '10px', color: C.textSoft, marginBottom: '3px' }}>{m.label}</div>
                                        <div style={{ fontSize: '17px', fontWeight: 700, color: m.color, letterSpacing: '-0.01em' }}>{typeof m.value === 'number' ? m.value : m.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '8px', fontSize: '10px', color: C.neutralLight, textAlign: 'center' }}>{notif.opened} cliques × {taxaConvGlobal}% conv. × {brl(ticketMedio)} ticket médio</div>
                        </div>
                    )}

                    {/* Funil */}
                    <div style={{ background: C.neutralBg, borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: C.textMid, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>{Icon.bell} Funil desta campanha</div>
                        {funilSteps.map((step, i) => (
                            <div key={i} style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '12px' }}>
                                    <span style={{ color: C.textMid, fontWeight: 500 }}>{step.label}</span>
                                    <span style={{ color: step.color, fontWeight: 600 }}>{step.value.toLocaleString('pt-BR')} <span style={{ color: C.neutralLight, fontWeight: 400 }}>({step.pct}%)</span></span>
                                </div>
                                <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                                    <div style={{ width: `${step.pct}%`, background: step.color, height: '100%', borderRadius: '999px', transition: 'width 0.6s' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
