import { AutomacaoConfig } from '../types';
import { C } from '../design';
import { Icon } from '../icons';
import { HORAS_OPCOES } from '../constants';
import { Toggle } from './Toggle';

interface Props {
    automacao: AutomacaoConfig;
    setAutomacao: (a: AutomacaoConfig) => void;
    loadingAutomacao: boolean;
    savingAutomacao: boolean;
    onSave: () => void;
}

function PassoCard({ passo, automacao, setAutomacao }: {
    passo: 1 | 2 | 3;
    automacao: AutomacaoConfig;
    setAutomacao: (a: AutomacaoConfig) => void;
}) {
    const key = `passo${passo}` as 'passo1' | 'passo2' | 'passo3';
    const ativo   = automacao[`${key}_ativo`];
    const horas   = automacao[`${key}_horas`];
    const titulo  = automacao[`${key}_titulo`];
    const mensagem= automacao[`${key}_mensagem`];
    const cupom   = passo === 3 ? automacao.passo3_cupom : undefined;
    const cor     = passo === 1 ? '#3b82f6' : passo === 2 ? '#f59e0b' : '#10b981';
    const label   = passo === 1 ? '1ª Mensagem' : passo === 2 ? '2ª Mensagem' : '3ª Mensagem (com cupom)';

    const up = (field: string, value: any) => setAutomacao({ ...automacao, [field]: value });

    return (
        <div style={{ border: `2px solid ${ativo ? cor : C.neutralBorder}`, borderRadius: '10px', padding: '16px', marginBottom: '12px', background: ativo ? '#fafafa' : C.neutralBg, transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: ativo ? '14px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: cor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>{passo}</span>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: C.text }}>{label}</div>
                        <div style={{ fontSize: '13px', color: C.textSoft }}>{ativo ? `Envia após ${horas >= 1 ? `${horas}h` : '30 min'}` : 'Desativado'}</div>
                    </div>
                </div>
                <Toggle checked={ativo} onChange={v => up(`${key}_ativo`, v)} />
            </div>

            {ativo && (
                <div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Enviar após</label>
                        <select value={horas} onChange={e => up(`${key}_horas`, parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                            {HORAS_OPCOES.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Título</label>
                        <input type="text" value={titulo} maxLength={50} onChange={e => up(`${key}_titulo`, e.target.value)} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', fontSize: '13px' }} />
                        <small style={{ fontSize: '13px', color: C.neutralLight }}>{titulo.length}/50</small>
                    </div>
                    <div style={{ marginBottom: passo === 3 ? '10px' : '0' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Mensagem</label>
                        <textarea value={mensagem} maxLength={120} rows={2} onChange={e => up(`${key}_mensagem`, e.target.value)} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', fontSize: '13px', resize: 'vertical' }} />
                        <small style={{ fontSize: '13px', color: C.neutralLight }}>{mensagem.length}/120</small>
                    </div>
                    {passo === 3 && (
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Cupom (opcional)</label>
                            <input type="text" value={cupom ?? ''} placeholder="Ex: VOLTA10" onChange={e => up('passo3_cupom', e.target.value)} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', fontSize: '13px', textTransform: 'uppercase' }} />
                        </div>
                    )}
                    {/* Preview */}
                    <div style={{ marginTop: '10px', background: C.dark, borderRadius: '8px', padding: '8px 12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: cor, flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{titulo || 'Título'}</div>
                            <div style={{ fontSize: '13px', color: C.neutralLight, marginTop: '1px' }}>{mensagem || 'Mensagem'}{passo === 3 && cupom ? ` · Cupom: ${cupom}` : ''}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function AutomacaoTab({ automacao, setAutomacao, loadingAutomacao, savingAutomacao, onSave }: Props) {
    if (loadingAutomacao) return <p style={{ textAlign: 'center', padding: '20px', color: C.neutralMid }}>Carregando...</p>;

    return (
        <div className="config-card">
            <div className="card-header">
                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>{Icon.robot} Recuperação de carrinho abandonado</h2>
                <p style={{ color: C.textSoft, margin: '4px 0 0', fontSize: '13px' }}>Configure as mensagens automáticas enviadas quando um cliente abandona o carrinho.</p>
            </div>

            <div style={{ background: C.brandLight, border: `1px solid ${C.brandMuted}30`, borderRadius: '8px', padding: '11px 13px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: C.brand, display: 'flex', flexShrink: 0, marginTop: '1px' }}>{Icon.info}</span>
                <div style={{ fontSize: '13px', color: C.brand, lineHeight: 1.5 }}><strong>Como funciona:</strong> Quando um cliente abandona o carrinho, o sistema aguarda o tempo configurado e envia a notificação automaticamente.</div>
            </div>

            <PassoCard passo={1} automacao={automacao} setAutomacao={setAutomacao} />
            <PassoCard passo={2} automacao={automacao} setAutomacao={setAutomacao} />
            <PassoCard passo={3} automacao={automacao} setAutomacao={setAutomacao} />

            {/* Produto Visitado */}
            <div style={{ borderTop: `1px solid ${C.neutralBorder}`, paddingTop: '16px', marginTop: '4px', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {Icon.eye} Produto Visitado <span style={{ fontSize: '13px', fontWeight: 400, color: C.neutralLight }}>— lembrete automático após visitar produto</span>
                </div>
            </div>
            <div style={{ border: `2px solid ${automacao.produto_visitado_ativo ? '#8b5cf6' : C.neutralBorder}`, borderRadius: '10px', padding: '16px', marginBottom: '12px', background: automacao.produto_visitado_ativo ? '#fafafa' : C.neutralBg, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: automacao.produto_visitado_ativo ? '14px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🛍️</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: C.text }}>Visitou produto sem comprar</div>
                            <div style={{ fontSize: '13px', color: C.textSoft }}>{automacao.produto_visitado_ativo ? `Lembrete após ${automacao.produto_visitado_horas}h` : 'Desativado'}</div>
                        </div>
                    </div>
                    <Toggle checked={automacao.produto_visitado_ativo} onChange={v => setAutomacao({ ...automacao, produto_visitado_ativo: v })} />
                </div>
                {automacao.produto_visitado_ativo && (
                    <div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Enviar após</label>
                            <select value={automacao.produto_visitado_horas} onChange={e => setAutomacao({ ...automacao, produto_visitado_horas: parseFloat(e.target.value) })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                {HORAS_OPCOES.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Título</label>
                            <input type="text" value={automacao.produto_visitado_titulo} maxLength={50} onChange={e => setAutomacao({ ...automacao, produto_visitado_titulo: e.target.value })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', fontSize: '13px' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Mensagem</label>
                            <textarea value={automacao.produto_visitado_mensagem} maxLength={120} rows={2} onChange={e => setAutomacao({ ...automacao, produto_visitado_mensagem: e.target.value })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', fontSize: '13px', resize: 'vertical' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Cliente Inativo */}
            <div style={{ borderTop: `1px solid ${C.neutralBorder}`, paddingTop: '16px', marginTop: '4px', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {Icon.clock} Cliente Inativo <span style={{ fontSize: '13px', fontWeight: 400, color: C.neutralLight }}>— reativação automática de clientes sumidos</span>
                </div>
            </div>
            <div style={{ border: `2px solid ${automacao.inativo_ativo ? '#f59e0b' : C.neutralBorder}`, borderRadius: '10px', padding: '16px', marginBottom: '12px', background: automacao.inativo_ativo ? '#fafafa' : C.neutralBg, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: automacao.inativo_ativo ? '14px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>😴</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: C.text }}>Não visita há X dias</div>
                            <div style={{ fontSize: '13px', color: C.textSoft }}>{automacao.inativo_ativo ? `Dispara após ${automacao.inativo_dias} dias sem visita` : 'Desativado'}</div>
                        </div>
                    </div>
                    <Toggle checked={automacao.inativo_ativo} onChange={v => setAutomacao({ ...automacao, inativo_ativo: v })} />
                </div>
                {automacao.inativo_ativo && (
                    <div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Dias de inatividade</label>
                            <select value={automacao.inativo_dias} onChange={e => setAutomacao({ ...automacao, inativo_dias: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                {[3, 7, 14, 30, 60].map(d => <option key={d} value={d}>{d} dias</option>)}
                            </select>
                            <small style={{ fontSize: '13px', color: C.neutralLight }}>Baseado na tag ultima_visita — roda 1x por dia</small>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Título</label>
                            <input type="text" value={automacao.inativo_titulo} maxLength={50} onChange={e => setAutomacao({ ...automacao, inativo_titulo: e.target.value })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', fontSize: '13px' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: C.textMid, display: 'block', marginBottom: '4px' }}>Mensagem</label>
                            <textarea value={automacao.inativo_mensagem} maxLength={120} rows={2} onChange={e => setAutomacao({ ...automacao, inativo_mensagem: e.target.value })} style={{ width: '100%', padding: '8px', border: `1px solid ${C.neutralBorder}`, borderRadius: '6px', fontSize: '13px', resize: 'vertical' }} />
                        </div>
                    </div>
                )}
            </div>

            <button className="save-button" onClick={onSave} disabled={savingAutomacao} style={{ width: '100%', marginTop: '8px', background: savingAutomacao ? C.neutralBorder : C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                {Icon.check} {savingAutomacao ? 'Salvando...' : 'Salvar automações'}
            </button>
        </div>
    );
}
