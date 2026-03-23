import { useState } from 'react';
import { ObjetivoCampanha } from '../types';
import { C } from '../design';
import { OBJETIVOS } from '../constants';

interface Props {
    objetivo: ObjetivoCampanha;
    mediaAbertura: number;
    onAplicar: (title: string, message: string) => void;
    onClose: () => void;
}

export function IAGerarModal({ objetivo, mediaAbertura, onAplicar, onClose }: Props) {
    const [produto, setProduto] = useState('');
    const [contexto, setContexto] = useState('');
    const [tom, setTom] = useState<'urgente' | 'amigavel' | 'exclusivo'>('urgente');
    const [gerando, setGerando] = useState(false);
    const [resultado, setResultado] = useState<{ titulo: string; mensagem: string } | null>(null);
    const [erro, setErro] = useState('');

    const objConfig = objetivo ? OBJETIVOS.find(o => o.id === objetivo) : null;

    const gerarMensagem = async () => {
        setGerando(true);
        setErro('');
        setResultado(null);

        const toms: Record<string, string> = {
            urgente:  'urgente e com senso de escassez (tempo limitado, estoque acabando)',
            amigavel: 'amigável, acolhedor e próximo, como um amigo que está avisando',
            exclusivo:'exclusivo e VIP, como se fosse uma oferta só para aquele cliente',
        };

        const prompt = `Você é um especialista em marketing de push notifications para e-commerce brasileiro.

Gere uma notificação push de alta conversão com:
- Objetivo: ${objConfig ? objConfig.label : 'Engajamento geral'}
- Etapa do funil: ${objConfig ? objConfig.funilLabel : 'Topo'}
- Tom: ${toms[tom]}
${produto ? `- Produto/contexto: ${produto}` : ''}
${contexto ? `- Informação extra: ${contexto}` : ''}
- CTR médio atual da loja: ${mediaAbertura}% (média do setor: 5-10%)

Regras obrigatórias:
- Título: máximo 50 caracteres, impactante, pode usar 1 emoji
- Mensagem: máximo 120 caracteres, clara e com CTA direto
- Linguagem: português brasileiro informal
- NÃO use aspas no início/fim
- NÃO use palavras genéricas como "incrível" ou "fantástico"

Responda APENAS em JSON válido, sem markdown, sem explicações:
{"titulo": "...", "mensagem": "..."}`;

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 200, messages: [{ role: 'user', content: prompt }] }),
            });
            const data = await response.json();
            const text = data.content?.[0]?.text ?? '';
            const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
            if (parsed.titulo && parsed.mensagem) {
                setResultado({ titulo: parsed.titulo, mensagem: parsed.mensagem });
            } else {
                setErro('Resposta inesperada. Tente novamente.');
            }
        } catch {
            setErro('Erro ao conectar com a IA. Verifique sua conexão.');
        } finally {
            setGerando(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
            <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '20px 24px 16px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Gerar mensagem com IA</div>
                        <div style={{ fontSize: '12px', color: '#C4B5FD', marginTop: '2px' }}>
                            {objConfig ? `Otimizado para: ${objConfig.label} · ${objConfig.funilLabel}` : 'Informe o contexto para gerar'}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: '#fff' }}>×</button>
                </div>

                <div style={{ padding: '20px 24px' }}>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '5px' }}>Produto ou promoção (opcional)</label>
                        <input type="text" value={produto} onChange={e => setProduto(e.target.value)} placeholder="Ex: Tênis Nike Air Max, Desconto 20%..." style={{ width: '100%', padding: '9px', border: `1px solid ${C.neutralBorder}`, borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '5px' }}>Contexto extra (opcional)</label>
                        <input type="text" value={contexto} onChange={e => setContexto(e.target.value)} placeholder="Ex: Só até meia-noite, Cupom SAVE10..." style={{ width: '100%', padding: '9px', border: `1px solid ${C.neutralBorder}`, borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '8px' }}>Tom da mensagem</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {([
                                { id: 'urgente' as const,   label: 'Urgente',   desc: 'Escassez e tempo' },
                                { id: 'amigavel' as const,  label: 'Amigável',  desc: 'Próximo e acolhedor' },
                                { id: 'exclusivo' as const, label: 'Exclusivo', desc: 'VIP e especial' },
                            ]).map(t => (
                                <button key={t.id} onClick={() => setTom(t.id)} style={{ flex: 1, padding: '10px 8px', borderRadius: '8px', cursor: 'pointer', border: `2px solid ${tom === t.id ? C.brand : C.neutralBorder}`, background: tom === t.id ? C.brandLight : '#fff', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: tom === t.id ? C.brand : C.textMid }}>{t.label}</div>
                                    <div style={{ fontSize: '10px', color: C.textSoft, marginTop: '2px' }}>{t.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={gerarMensagem} disabled={gerando} style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: gerando ? C.neutralBorder : 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: gerando ? C.neutralLight : '#fff', fontSize: '14px', fontWeight: 700, cursor: gerando ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
                        {gerando ? 'Gerando...' : 'Gerar mensagem agora'}
                    </button>

                    {erro && <div style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: C.danger, marginBottom: '12px' }}>{erro}</div>}

                    {resultado && (
                        <div style={{ border: `2px solid ${C.brand}`, borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{ background: C.dark, padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: objConfig?.cor ?? C.brand, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                                    {objConfig?.icon ?? '🔔'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>{resultado.titulo}</div>
                                    <div style={{ fontSize: '12px', color: C.neutralLight }}>{resultado.mensagem}</div>
                                </div>
                            </div>
                            <div style={{ background: C.brandLight, padding: '10px 16px', display: 'flex', gap: '16px', fontSize: '11px', color: C.brand }}>
                                <span>Título: {resultado.titulo.length}/50</span>
                                <span>Mensagem: {resultado.mensagem.length}/120</span>
                            </div>
                            <div style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                                <button onClick={() => { onAplicar(resultado.titulo, resultado.mensagem); onClose(); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: C.brand, color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                                    Usar esta mensagem
                                </button>
                                <button onClick={gerarMensagem} disabled={gerando} style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.neutralBorder}`, background: '#fff', color: C.textMid, fontSize: '13px', cursor: 'pointer' }}>
                                    Gerar outra
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
