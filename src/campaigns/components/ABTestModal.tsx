import { ABTestForm } from '../types';
import { Toggle } from './Toggle';

interface Props {
    form: ABTestForm;
    setForm: (f: ABTestForm) => void;
    onSend: () => void;
    sending: boolean;
    onClose: () => void;
    alcance: number;
}

export function ABTestModal({ form, setForm, onSend, sending, onClose, alcance }: Props) {
    const metade = Math.round(alcance / 2);
    const podeEnviar = form.title_a && form.message_a && form.title_b && form.message_b;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
            <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>Criar Teste A/B</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                            Base dividida ~50/50 — cada variante recebe ≈ <strong>{metade.toLocaleString('pt-BR')}</strong> dispositivos
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>×</button>
                </div>

                <div style={{ padding: '20px 24px' }}>
                    <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#3730A3', lineHeight: 1.6 }}>
                        <strong>Como funciona:</strong> Variante A para metade da base, B para a outra metade. Após as horas configuradas o sistema compara CTRs e escala o vencedor automaticamente.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        {(['A', 'B'] as const).map(v => {
                            const isA = v === 'A';
                            const cor = isA ? '#3b82f6' : '#10b981';
                            const corBg = isA ? '#eff6ff' : '#f0fdf4';
                            const corBorder = isA ? '#bfdbfe' : '#bbf7d0';
                            const titleKey = isA ? 'title_a' : 'title_b';
                            const msgKey = isA ? 'message_a' : 'message_b';
                            return (
                                <div key={v} style={{ border: `2px solid ${cor}`, borderRadius: '12px', padding: '16px', background: corBg }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                        <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: cor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>{v}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: isA ? '#1d4ed8' : '#059669' }}>Variante {v}</span>
                                        <span style={{ marginLeft: 'auto', fontSize: '13px', color: cor, background: isA ? '#dbeafe' : '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>≈{metade.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Título</label>
                                        <input type="text" value={form[titleKey]} maxLength={50} onChange={e => setForm({ ...form, [titleKey]: e.target.value })} placeholder={isA ? 'Ex: Oferta imperdível hoje!' : 'Ex: Não perca essa chance!'} style={{ width: '100%', padding: '8px', border: `1px solid ${corBorder}`, borderRadius: '6px', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }} />
                                        <small style={{ fontSize: '13px', color: '#6B7280' }}>{form[titleKey].length}/50</small>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Mensagem</label>
                                        <textarea value={form[msgKey]} maxLength={120} rows={3} onChange={e => setForm({ ...form, [msgKey]: e.target.value })} placeholder={isA ? 'Ex: Até 50% OFF só hoje!' : 'Ex: Sua oferta expira em breve!'} style={{ width: '100%', padding: '8px', border: `1px solid ${corBorder}`, borderRadius: '6px', fontSize: '13px', background: '#fff', resize: 'vertical', boxSizing: 'border-box' }} />
                                        <small style={{ fontSize: '13px', color: '#6B7280' }}>{form[msgKey].length}/120</small>
                                    </div>
                                    {(form[titleKey] || form[msgKey]) && (
                                        <div style={{ marginTop: '10px', background: '#111827', borderRadius: '8px', padding: '8px 12px', display: 'flex', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: cor, flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{form[titleKey] || `Título ${v}`}</div>
                                                <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '1px' }}>{form[msgKey] || `Mensagem ${v}`}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Link (comum para A e B)</label>
                        <input type="text" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ background: '#F0FDF4', border: '1px solid #86efac', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: form.auto_escalar ? '12px' : '0' }}>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>Escalonamento automático</div>
                                <div style={{ fontSize: '13px', color: '#15803D' }}>O sistema avalia o vencedor e escala automaticamente</div>
                            </div>
                            <Toggle checked={form.auto_escalar ?? true} onChange={v => setForm({ ...form, auto_escalar: v })} />
                        </div>
                        {form.auto_escalar && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ fontSize: '13px', color: '#166534', fontWeight: 600, whiteSpace: 'nowrap' }}>Avaliar após</label>
                                <select value={form.horas_avaliacao ?? 4} onChange={e => setForm({ ...form, horas_avaliacao: parseInt(e.target.value) })} style={{ padding: '6px 10px', border: '1px solid #86efac', borderRadius: '6px', background: 'white', fontSize: '13px', color: '#166534' }}>
                                    <option value={2}>2 horas</option>
                                    <option value={4}>4 horas</option>
                                    <option value={6}>6 horas</option>
                                    <option value={12}>12 horas</option>
                                    <option value={24}>24 horas</option>
                                </select>
                                <span style={{ fontSize: '13px', color: '#15803D' }}>— vencedor enviado para toda a base</span>
                            </div>
                        )}
                    </div>

                    <button onClick={onSend} disabled={sending || !podeEnviar} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', cursor: podeEnviar && !sending ? 'pointer' : 'not-allowed', fontSize: '14px', fontWeight: 700, background: podeEnviar && !sending ? 'linear-gradient(135deg, #3b82f6, #10b981)' : '#E5E7EB', color: podeEnviar && !sending ? '#fff' : '#9CA3AF', transition: 'all 0.2s' }}>
                        {sending ? 'Enviando as duas variantes...' : `Disparar Teste A/B para ${alcance.toLocaleString('pt-BR')} dispositivos`}
                    </button>
                </div>
            </div>
        </div>
    );
}
