import { ABTestItem } from '../types';
import { C } from '../design';

function CardVariante({ variante, title, message, sent, opened, ctr, isVencedor }: {
    variante: 'A' | 'B'; title: string; message: string;
    sent: number; opened: number; ctr: number; isVencedor: boolean;
}) {
    const cor = variante === 'A' ? '#3b82f6' : '#10b981';
    const corBg = variante === 'A' ? '#eff6ff' : '#f0fdf4';
    const corBorder = variante === 'A' ? '#bfdbfe' : '#bbf7d0';
    return (
        <div style={{ border: `2px solid ${isVencedor ? cor : corBorder}`, borderRadius: '10px', padding: '12px', background: isVencedor ? corBg : '#fff', position: 'relative', flex: 1 }}>
            {isVencedor && (
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: cor, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>🏆 VENCEDOR</div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: cor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>{variante}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                    <div style={{ fontSize: '11px', color: C.textSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{message}</div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                {[
                    { label: 'Enviados', value: sent.toLocaleString('pt-BR'), color: C.brand },
                    { label: 'Abertos',  value: opened.toLocaleString('pt-BR'), color: C.success },
                    { label: 'CTR',      value: `${ctr}%`, color: cor },
                ].map((m, i) => (
                    <div key={i} style={{ background: C.neutralBg, borderRadius: '6px', padding: '6px 4px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: m.color }}>{m.value}</div>
                        <div style={{ fontSize: '10px', color: C.neutralLight }}>{m.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ABResultCard({ test, onRefresh }: { test: ABTestItem; onRefresh: (id: number) => void }) {
    const vencedor = test.vencedor;
    const emAndamento = !vencedor && test.status === 'ativo';
    return (
        <div style={{ border: `1px solid ${C.neutralBorder}`, borderRadius: '12px', padding: '16px', marginBottom: '12px', background: C.white }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>Teste A/B #{test.id}</span>
                    <span style={{ marginLeft: '8px', fontSize: '11px', color: C.textSoft }}>{test.created_at ? new Date(test.created_at).toLocaleDateString('pt-BR') : ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {emAndamento && <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>Em andamento</span>}
                    {vencedor === 'empate' && <span style={{ background: C.neutralBg, color: C.textMid, padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>Empate</span>}
                    {(vencedor === 'A' || vencedor === 'B') && <span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>Variante {vencedor} venceu</span>}
                    <button onClick={() => onRefresh(test.id)} style={{ background: C.neutralBg, border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', color: C.textMid }}>Atualizar</button>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <CardVariante variante="A" title={test.title_a} message={test.message_a} sent={test.sent_a} opened={test.opened_a} ctr={test.ctr_a} isVencedor={vencedor === 'A'} />
                <div style={{ display: 'flex', alignItems: 'center', color: C.neutralLight, fontSize: '18px', fontWeight: 700, flexShrink: 0 }}>vs</div>
                <CardVariante variante="B" title={test.title_b} message={test.message_b} sent={test.sent_b} opened={test.opened_b} ctr={test.ctr_b} isVencedor={vencedor === 'B'} />
            </div>
        </div>
    );
}
