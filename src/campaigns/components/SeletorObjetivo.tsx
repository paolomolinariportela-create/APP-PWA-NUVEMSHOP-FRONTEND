import { ObjetivoCampanha, ObjetivoConfig } from '../types';
import { C } from '../design';
import { OBJETIVOS, FUNIL_COLORS } from '../constants';

// Exportada para uso no histórico (badge de funil por campanha)
export function inferirFunil(title: string, message: string) {
    const texto = `${title} ${message}`.toLowerCase();
    const fundo = ['off','desconto','cupom','promo','oferta','comprar','compre','black','sale','frete','gratis','grátis','relampago','relâmpago','liquidacao','liquidação','flash','vip','%'];
    const meio  = ['carrinho','itens','deixou','esperando','estoque','acabando','garanta','finalize','voltou','salvo'];
    const topo  = ['saudades','novidade','novidades','sumiu','tempo','vemos','reativação','reativacao','lembrete','visitou','viu','inativo','sumidos','evento','lançamento','lancamento'];
    const sf = fundo.filter(p => texto.includes(p)).length;
    const sm = meio.filter(p => texto.includes(p)).length;
    const st = topo.filter(p => texto.includes(p)).length;
    if (sm >= sf && sm >= st && sm > 0) return { label: 'Meio · Carrinho', color: '#d97706', bg: '#fffbeb', etapa: 'meio' as const };
    if (st > sf)  return { label: 'Topo · Reativar', color: '#7c3aed', bg: '#f5f3ff', etapa: 'topo' as const };
    if (sf > 0)   return { label: 'Fundo · Venda',   color: '#059669', bg: '#f0fdf4', etapa: 'fundo' as const };
    return { label: 'Engajamento', color: '#2563eb', bg: '#eff6ff', etapa: 'topo' as const };
}

const DICAS: Record<string, string> = {
    venda:      'Foco em urgência e escassez. Use emojis de tempo (⚡⏰) e CTA claro: "Comprar agora", "Pegar desconto".',
    carrinho:   'Lembre sem pressionar. Ofereça facilidade (frete grátis, cupom) como incentivo final.',
    reativar:   'Tom acolhedor. Mostre novidades ou benefício exclusivo. Evite spam — 1 mensagem por ciclo.',
    engajamento:'Conteúdo genuíno. Eventos e novidades têm melhor abertura no melhor horário do público.',
};

interface Props {
    objetivo: ObjetivoCampanha;
    onSelect: (obj: ObjetivoConfig) => void;
}

export function SeletorObjetivo({ objetivo, onSelect }: Props) {
    return (
        <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '3px' }}>Qual o objetivo desta campanha?</div>
            <div style={{ fontSize: '12px', color: C.textSoft, marginBottom: '12px' }}>Selecione para receber templates e segmentação automáticos</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {OBJETIVOS.map(obj => {
                    const ativo = objetivo === obj.id;
                    return (
                        <button key={obj.id} onClick={() => onSelect(obj)} style={{ padding: '12px 10px', borderRadius: '10px', border: `2px solid ${ativo ? obj.cor : C.neutralBorder}`, background: ativo ? obj.corBg : C.white, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', position: 'relative', boxShadow: ativo ? `0 0 0 3px ${obj.cor}20` : 'none' }}>
                            {ativo && <span style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderRadius: '50%', background: obj.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 700 }}>✓</span>}
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>{obj.icon}</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: ativo ? obj.cor : C.text, marginBottom: '2px' }}>{obj.label}</div>
                            <div style={{ fontSize: '11px', color: C.textSoft, lineHeight: 1.4 }}>{obj.desc}</div>
                            <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', background: ativo ? obj.cor : C.neutralBg, color: ativo ? '#fff' : C.textSoft, fontSize: '10px', fontWeight: 600, transition: 'all 0.2s' }}>
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: ativo ? '#fff' : FUNIL_COLORS[obj.funil], display: 'inline-block' }} />
                                {obj.funilLabel}
                            </div>
                        </button>
                    );
                })}
            </div>

            {objetivo && (() => {
                const obj = OBJETIVOS.find(o => o.id === objetivo)!;
                return (
                    <div style={{ marginTop: '10px', padding: '10px 14px', background: obj.corBg, border: `1px solid ${obj.corBorder}`, borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ flexShrink: 0, marginTop: '1px', color: obj.cor, fontSize: '14px' }}>💡</span>
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: obj.cor, marginBottom: '2px' }}>Dica para {obj.label}</div>
                            <div style={{ fontSize: '12px', color: C.textMid, lineHeight: 1.5 }}>
                                {DICAS[objetivo]}
                                {obj.segmento && <span> <strong>Segmentação automática:</strong> {obj.segmento === 'buyers' ? 'só quem já comprou' : 'só quem nunca comprou'}.</span>}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
