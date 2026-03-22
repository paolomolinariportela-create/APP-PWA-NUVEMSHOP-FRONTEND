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
    confirmed_deliveries: number;
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
    produto_visitado_ativo: boolean;
    produto_visitado_horas: number;
    produto_visitado_titulo: string;
    produto_visitado_mensagem: string;
    inativo_ativo: boolean;
    inativo_dias: number;
    inativo_titulo: string;
    inativo_mensagem: string;
}

// ── NOVO: Tipos de objetivo ──────────────────────────────────────────────────
type ObjetivoCampanha = 'venda' | 'carrinho' | 'reativar' | 'engajamento' | null;

interface ObjetivoConfig {
    id: ObjetivoCampanha;
    icon: string;
    label: string;
    desc: string;
    cor: string;
    corBg: string;
    corBorder: string;
    funil: 'fundo' | 'meio' | 'topo';
    funilLabel: string;
    segmento: string;
    templates: Array<{ label: string; title: string; msg: string }>;
}

const OBJETIVOS: ObjetivoConfig[] = [
    {
        id: 'venda',
        icon: '💰',
        label: 'Gerar Venda',
        desc: 'Ofertas e promoções para converter agora',
        cor: '#059669',
        corBg: '#f0fdf4',
        corBorder: '#86efac',
        funil: 'fundo',
        funilLabel: 'Fundo de funil',
        segmento: '',
        templates: [
            { label: 'Black Friday', title: 'Black Friday chegou!', msg: 'Ate 70% OFF so hoje. Aproveite antes que acabe!' },
            { label: 'Frete Gratis', title: 'Frete GRATIS hoje!', msg: 'Aproveite frete gratis em todos os pedidos. So hoje!' },
            { label: 'Desconto VIP', title: 'Oferta exclusiva para voce!', msg: 'Como cliente especial, preparamos 15% OFF. Use o cupom VIP15.' },
            { label: 'Flash Sale', title: 'Oferta relampago! ⚡', msg: 'So nas proximas 2 horas: 20% OFF em tudo. Corre!' },
        ],
    },
    {
        id: 'carrinho',
        icon: '🛒',
        label: 'Recuperar Carrinho',
        desc: 'Resgatar clientes que abandonaram',
        cor: '#d97706',
        corBg: '#fffbeb',
        corBorder: '#fde68a',
        funil: 'meio',
        funilLabel: 'Meio de funil',
        segmento: 'non_buyers',
        templates: [
            { label: 'Carrinho', title: 'Seu carrinho te espera!', msg: 'Voce deixou itens no carrinho. Finalize agora com frete gratis.' },
            { label: 'Estoque', title: 'Ultimas unidades!', msg: 'O produto no seu carrinho esta acabando. Garanta o seu agora.' },
            { label: 'Cupom', title: 'Presente especial para voce 🎁', msg: 'Seu carrinho ainda esta salvo! Use VOLTA10 e ganhe 10% OFF.' },
        ],
    },
    {
        id: 'reativar',
        icon: '🔄',
        label: 'Reativar Cliente',
        desc: 'Trazer de volta quem sumiu',
        cor: '#7c3aed',
        corBg: '#f5f3ff',
        corBorder: '#c4b5fd',
        funil: 'topo',
        funilLabel: 'Topo de funil',
        segmento: 'buyers',
        templates: [
            { label: 'Saudades', title: 'Saudades de voce!', msg: 'Faz um tempo que nao te vemos. Temos novidades esperando por voce.' },
            { label: 'Novidades', title: 'Novidades chegaram! 🆕', msg: 'Produtos novos que voce vai amar acabaram de chegar. Confira!' },
            { label: 'VIP', title: 'Voce e especial para nos 💜', msg: 'Como cliente VIP, preparamos algo exclusivo. Clique para ver.' },
        ],
    },
    {
        id: 'engajamento',
        icon: '📣',
        label: 'Engajamento',
        desc: 'Visitas, conteúdo e lembretes',
        cor: '#2563eb',
        corBg: '#eff6ff',
        corBorder: '#bfdbfe',
        funil: 'topo',
        funilLabel: 'Topo de funil',
        segmento: '',
        templates: [
            { label: 'Novidade', title: 'Novidade no App! 🎉', msg: 'Temos uma novidade especial esperando por voce. Clique e descubra.' },
            { label: 'Lembrete', title: 'Ja visitou nossa loja hoje?', msg: 'Confira os destaques do dia e aproveite as melhores ofertas.' },
            { label: 'Evento', title: 'Evento especial amanha! ⏰', msg: 'Nao perca nossa liquidacao relampago amanha as 10h. Marque na agenda!' },
        ],
    },
];

const FUNIL_COLORS: Record<string, string> = {
    fundo: '#059669',
    meio: '#d97706',
    topo: '#2563eb',
};

// ────────────────────────────────────────────────────────────────────────────

const AUTOMACAO_DEFAULT: AutomacaoConfig = {
    passo1_ativo: true, passo1_horas: 1,
    passo1_titulo: 'Seus itens estao te esperando!',
    passo1_mensagem: 'Voce deixou alguns itens no carrinho. Que tal finalizar sua compra?',
    passo2_ativo: true, passo2_horas: 24,
    passo2_titulo: 'Seus itens estao acabando!',
    passo2_mensagem: 'O estoque e limitado! Garanta os seus itens antes que esgotem.',
    passo3_ativo: false, passo3_horas: 48,
    passo3_titulo: 'Ultimo aviso! Oferta especial para voce.',
    passo3_mensagem: 'Seu carrinho ainda esta salvo. Use o cupom abaixo para ganhar desconto!',
    passo3_cupom: '',
    produto_visitado_ativo: false,
    produto_visitado_horas: 2,
    produto_visitado_titulo: 'Voce ainda esta interessado?',
    produto_visitado_mensagem: 'O produto que voce viu ainda esta disponivel. Garanta o seu antes que acabe!',
    inativo_ativo: false,
    inativo_dias: 7,
    inativo_titulo: 'Saudades de voce!',
    inativo_mensagem: 'Faz um tempo que nao te vemos. Temos novidades e ofertas esperando por voce.',
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
const PAIS_NOME: Record<string, string> = { BR: 'Brasil', US: 'EUA', PT: 'Portugal', AR: 'Argentina', MX: 'Mexico', CO: 'Colombia', CL: 'Chile', PE: 'Peru', UY: 'Uruguai', GB: 'Reino Unido' };
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

function CardSection({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="card-header" style={{ paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{title}</h3>
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6B7280' }}>{subtitle}</p>}
        </div>
    );
}

// ── NOVO: Componente do seletor de objetivo ──────────────────────────────────
function SeletorObjetivo({
    objetivo,
    onSelect,
}: {
    objetivo: ObjetivoCampanha;
    onSelect: (obj: ObjetivoConfig) => void;
}) {
    return (
        <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                🎯 Qual o objetivo desta campanha?
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '14px' }}>
                Selecione para receber templates e segmentação automáticos
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {OBJETIVOS.map(obj => {
                    const ativo = objetivo === obj.id;
                    return (
                        <button
                            key={obj.id}
                            onClick={() => onSelect(obj)}
                            style={{
                                padding: '14px 10px',
                                borderRadius: '12px',
                                border: `2px solid ${ativo ? obj.cor : '#E5E7EB'}`,
                                background: ativo ? obj.corBg : '#fff',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                                position: 'relative',
                                boxShadow: ativo ? `0 0 0 3px ${obj.cor}20` : 'none',
                            }}
                        >
                            {ativo && (
                                <span style={{
                                    position: 'absolute', top: '8px', right: '8px',
                                    width: '16px', height: '16px', borderRadius: '50%',
                                    background: obj.cor, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 700,
                                }}>✓</span>
                            )}
                            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{obj.icon}</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: ativo ? obj.cor : '#111827', marginBottom: '2px' }}>{obj.label}</div>
                            <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.4 }}>{obj.desc}</div>
                            <div style={{
                                marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '2px 8px', borderRadius: '999px',
                                background: ativo ? obj.cor : '#F3F4F6',
                                color: ativo ? '#fff' : '#6B7280',
                                fontSize: '10px', fontWeight: 600, transition: 'all 0.2s',
                            }}>
                                <span style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: ativo ? '#fff' : FUNIL_COLORS[obj.funil],
                                    display: 'inline-block',
                                }} />
                                {obj.funilLabel}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Banner contextual quando objetivo selecionado */}
            {objetivo && (() => {
                const obj = OBJETIVOS.find(o => o.id === objetivo)!;
                const dicas: Record<string, string> = {
                    venda: 'Foco em urgência e escassez. Use emojis de tempo (⚡⏰) e deixe o CTA claro: "Comprar agora", "Pegar desconto".',
                    carrinho: 'Lembre sem pressionar. Mencione os itens deixados e ofereça uma facilidade (frete grátis, cupom) como incentivo final.',
                    reativar: 'Tom acolhedor. Mostre novidades relevantes ou benefício exclusivo. Evite parecer spam — 1 mensagem por ciclo.',
                    engajamento: 'Conteúdo genuíno. Eventos, lançamentos e novidades têm melhor abertura quando enviados no melhor horário do público.',
                };
                return (
                    <div style={{
                        marginTop: '12px', padding: '12px 16px',
                        background: obj.corBg, border: `1px solid ${obj.corBorder}`,
                        borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                    }}>
                        <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: obj.cor, marginBottom: '2px' }}>
                                Dica para campanha de {obj.label}
                            </div>
                            <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>
                                {dicas[objetivo]}
                                {obj.segmento && (
                                    <span style={{ marginLeft: '4px' }}>
                                        <strong>Segmentação automática aplicada:</strong>{' '}
                                        {obj.segmento === 'buyers' ? 'só quem já comprou' : 'só quem nunca comprou'}.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
// ────────────────────────────────────────────────────────────────────────────

// ── Componente: Painel de Detalhes de uma Campanha ──────────────────────────
function CampanhaDetalhe({
    notif,
    mediaAbertura,
    ticketMedio,
    taxaConvGlobal,
    onClose,
    brl,
}: {
    notif: OneSignalNotif;
    mediaAbertura: number;
    ticketMedio: number;
    taxaConvGlobal: number;
    onClose: () => void;
    brl: (v: number) => string;
}) {
    const roi = ticketMedio > 0 ? Math.round(notif.opened * (taxaConvGlobal / 100) * ticketMedio) : 0;
    const ctr = notif.sent > 0 ? ((notif.opened / notif.sent) * 100).toFixed(1) : '0';
    const taxaEntrega = notif.sent > 0 ? Math.round((notif.confirmed_deliveries / notif.sent) * 100) : 0;
    const convertidos = Math.round(notif.opened * (taxaConvGlobal / 100));
    const vsMedia = notif.taxa_abertura - mediaAbertura;

    const getBenchmarkBadge = (taxa: number) => {
        if (taxa >= 10) return { label: 'Acima da Media', bg: '#dcfce7', color: '#166534', icon: '🔥' };
        if (taxa >= 5) return { label: 'Na Media', bg: '#dbeafe', color: '#1d4ed8', icon: '✅' };
        return { label: 'Precisa Melhorar', bg: '#fef3c7', color: '#92400e', icon: '⚠️' };
    };
    const badge = getBenchmarkBadge(notif.taxa_abertura);

    const metricas = [
        { icon: '📤', label: 'Enviados', value: notif.sent.toLocaleString('pt-BR'), sub: '100% da base', color: '#4F46E5' },
        { icon: '📬', label: 'Entregues', value: notif.confirmed_deliveries.toLocaleString('pt-BR'), sub: `${taxaEntrega}% de entrega`, color: '#3b82f6' },
        { icon: '👆', label: 'Abertos', value: notif.opened.toLocaleString('pt-BR'), sub: `CTR: ${ctr}%`, color: '#10B981' },
        { icon: '❌', label: 'Falhos', value: notif.failed.toLocaleString('pt-BR'), sub: 'nao entregues', color: '#EF4444' },
    ];

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
        }} onClick={onClose}>
            <div style={{
                background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px',
                maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detalhes da Campanha</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{notif.title}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{notif.message}</div>
                    </div>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', flexShrink: 0, marginLeft: '12px' }}>×</button>
                </div>

                <div style={{ padding: '20px 24px' }}>
                    {/* 4 métricas principais */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                        {metricas.map((m, i) => (
                            <div key={i} style={{ background: '#F9FAFB', border: `1px solid ${m.color}20`, borderRadius: '10px', padding: '12px 10px', textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{m.icon}</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: m.color }}>{m.value}</div>
                                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>{m.label}</div>
                                <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{m.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTR vs média */}
                    <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>📊 Taxa de Abertura vs Media Geral</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                                    <span style={{ color: '#6B7280' }}>Esta campanha</span>
                                    <span style={{ fontWeight: 700, color: badge.color }}>{notif.taxa_abertura}%</span>
                                </div>
                                <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(notif.taxa_abertura * 5, 100)}%`, background: badge.color, height: '100%', borderRadius: '999px' }} />
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                                    <span style={{ color: '#6B7280' }}>Media geral</span>
                                    <span style={{ fontWeight: 700, color: '#6B7280' }}>{mediaAbertura}%</span>
                                </div>
                                <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(mediaAbertura * 5, 100)}%`, background: '#9CA3AF', height: '100%', borderRadius: '999px' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: badge.bg, color: badge.color, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                                {badge.icon} {badge.label}
                            </span>
                            {mediaAbertura > 0 && (
                                <span style={{ fontSize: '12px', color: vsMedia >= 0 ? '#059669' : '#DC2626', fontWeight: 600 }}>
                                    {vsMedia >= 0 ? `+${vsMedia.toFixed(1)}` : vsMedia.toFixed(1)}% vs sua media
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ROI */}
                    {ticketMedio > 0 && (
                        <div style={{ background: roi > 0 ? '#f0fdf4' : '#F9FAFB', border: `1px solid ${roi > 0 ? '#86efac' : '#E5E7EB'}`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>💰 ROI Estimado</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Cliques</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#10B981' }}>{notif.opened}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Convertidos est.</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b' }}>{convertidos}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Receita est.</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: roi > 0 ? '#059669' : '#9CA3AF' }}>{roi > 0 ? brl(roi) : '—'}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '10px', fontSize: '11px', color: '#9CA3AF', textAlign: 'center' }}>
                                {notif.opened} cliques × {taxaConvGlobal}% conv. × {brl(ticketMedio)} ticket médio
                            </div>
                        </div>
                    )}

                    {/* Barra de progresso do funil */}
                    <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>🔔 Funil desta Campanha</div>
                        {[
                            { label: 'Enviados', value: notif.sent, pct: 100, color: '#4F46E5' },
                            { label: 'Entregues', value: notif.confirmed_deliveries, pct: taxaEntrega, color: '#3b82f6' },
                            { label: 'Abertos', value: notif.opened, pct: notif.sent > 0 ? Math.round((notif.opened / notif.sent) * 100) : 0, color: '#10B981' },
                            ...(ticketMedio > 0 ? [{ label: 'Convertidos', value: convertidos, pct: notif.opened > 0 ? Math.round((convertidos / notif.opened) * 100) : 0, color: '#f59e0b' }] : []),
                        ].map((step, i) => (
                            <div key={i} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                                    <span style={{ color: '#374151', fontWeight: 500 }}>{step.label}</span>
                                    <span style={{ color: step.color, fontWeight: 700 }}>{step.value.toLocaleString('pt-BR')} <span style={{ color: '#9CA3AF', fontWeight: 400 }}>({step.pct}%)</span></span>
                                </div>
                                <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
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
// ────────────────────────────────────────────────────────────────────────────

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

    // ── NOVO: estado do objetivo ─────────────────────────────────────────────
    const [objetivo, setObjetivo] = useState<ObjetivoCampanha>(null);
    // ── NOVO: campanha selecionada para detalhe ──────────────────────────────
    const [campanhaDetalhe, setCampanhaDetalhe] = useState<OneSignalNotif | null>(null);

    const handleSelecionarObjetivo = (obj: ObjetivoConfig) => {
        // Se já estava selecionado, deseleciona (toggle)
        if (objetivo === obj.id) {
            setObjetivo(null);
            return;
        }
        setObjetivo(obj.id);
        // Aplica segmentação automática se definida no objetivo
        if (obj.segmento) {
            setPushForm({ ...pushForm, filter_behavior: obj.segmento });
            setShowSegmentation(true);
        } else {
            setPushForm({ ...pushForm, filter_behavior: undefined });
        }
    };

    const templatesAtivos = objetivo
        ? OBJETIVOS.find(o => o.id === objetivo)?.templates ?? []
        : [
            { label: 'Black Friday', title: 'Black Friday chegou!', msg: 'Ate 70% OFF so hoje. Aproveite antes que acabe!' },
            { label: 'Carrinho', title: 'Seu carrinho te espera!', msg: 'Voce deixou itens no carrinho. Finalize agora com frete gratis.' },
            { label: 'Frete Gratis', title: 'Frete GRATIS hoje!', msg: 'Aproveite frete gratis em todos os pedidos. So hoje!' },
            { label: 'Desconto VIP', title: 'Oferta exclusiva para voce!', msg: 'Como cliente especial, preparamos 15% OFF. Use o cupom VIP15.' },
            { label: 'Estoque', title: 'Ultimas unidades!', msg: 'O produto que voce viu esta acabando. Garanta o seu agora.' },
            { label: 'Saudades', title: 'Saudades de voce!', msg: 'Faz um tempo que nao te vemos. Temos novidades esperando por voce.' },
        ];
    // ────────────────────────────────────────────────────────────────────────

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
            alert('Automacoes salvas!');
        } catch { alert('Erro ao salvar.'); } finally { setSavingAutomacao(false); }
    };

    useEffect(() => { if (!sendingPush) { fetchHistory(); fetchOsStats(); fetchAutomacao(); } }, [token, sendingPush]);

    const formatDate = (s: string) => { try { const d = new Date(s); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' as ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch { return s; } };
    const formatUnix = (ts: number) => { try { const d = new Date(ts * 1000); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' as ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch { return '—'; } };
    const brl = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    const activeSubscribers = osStats?.active_subscribers ?? stats.instalacoes ?? 0;
    const totalSubscribers = osStats?.subscribers ?? 0;
    const taxaOptin = osStats?.taxa_optin ?? 0;
    const notifs = osStats?.notifications ?? [];
    const mediaAbertura = notifs.length > 0 ? Math.round(notifs.reduce((acc, n) => acc + n.taxa_abertura, 0) / notifs.length) : 0;
    const porPais = osStats?.por_pais ?? [];
    const porDisp = osStats?.por_dispositivo ?? [];
    const dispColors: Record<string, string> = { Android: '#22c55e', iOS: '#3b82f6', Web: '#8b5cf6' };
    const dispIcons: Record<string, string> = { Android: '🤖', iOS: '🍎', Web: '🌐' };

    const inativos = Math.max(0, totalSubscribers - activeSubscribers);
    const pctAtivos = totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0;
    const pctInativos = 100 - pctAtivos;
    const churnRate = totalSubscribers > 0 ? Math.round((inativos / totalSubscribers) * 100) : 0;

    const melhorHorario = (() => {
        if (notifs.length === 0) return null;
        const h: Record<number, number> = {};
        notifs.forEach(n => { if (!n.created_at) return; const hr = new Date(n.created_at * 1000).getHours(); h[hr] = (h[hr] || 0) + n.opened; });
        const m = Object.entries(h).sort((a, b) => b[1] - a[1])[0];
        return m ? `${m[0]}:00` : null;
    })();

    const ticketMedio = stats?.ticket_medio?.app ?? 0;
    const taxaConvGlobal = stats?.taxa_conversao?.app ?? 0;

    const totalEnviados = notifs.reduce((a, n) => a + n.sent, 0);
    const totalConfirmados = notifs.reduce((a, n) => a + (n.confirmed_deliveries || 0), 0);
    const totalClicados = notifs.reduce((a, n) => a + n.opened, 0);
    const totalConvertidos = Math.round(totalClicados * (taxaConvGlobal / 100));
    const pctEntrega = totalEnviados > 0 ? Math.round((totalConfirmados / totalEnviados) * 100) : 0;
    const pctClique = totalEnviados > 0 ? Math.round((totalClicados / totalEnviados) * 100) : 0;
    const pctConversao = totalClicados > 0 ? Math.round((totalConvertidos / totalClicados) * 100) : 0;

    const getBenchmarkBadge = (taxa: number) => {
        if (taxa >= 10) return { label: 'Acima da Media', bg: '#dcfce7', color: '#166534', icon: '🔥' };
        if (taxa >= 5) return { label: 'Na Media', bg: '#dbeafe', color: '#1d4ed8', icon: '✅' };
        return { label: 'Precisa Melhorar', bg: '#fef3c7', color: '#92400e', icon: '⚠️' };
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
        const label = passo === 1 ? '1a Mensagem' : passo === 2 ? '2a Mensagem' : '3a Mensagem (com cupom)';
        return (
            <div key={passo} style={{ border: `2px solid ${ativo ? cor : '#E5E7EB'}`, borderRadius: '12px', padding: '20px', marginBottom: '16px', background: ativo ? '#fafafa' : '#f9fafb', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: ativo ? '16px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{emoji}</div>
                        <div><div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{label}</div><div style={{ fontSize: '12px', color: '#6B7280' }}>{ativo ? `Envia apos ${horas >= 1 ? `${horas}h` : '30 min'}` : 'Desativado'}</div></div>
                    </div>
                    <Toggle checked={ativo} onChange={v => setAutomacao({ ...automacao, [`${key}_ativo`]: v })} />
                </div>
                {ativo && (
                    <div className="animate-fade-in">
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Enviar apos</label>
                            <select value={horas} onChange={e => setAutomacao({ ...automacao, [`${key}_horas`]: parseFloat(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                {HORAS_OPCOES.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Titulo</label>
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
                            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{titulo || 'Titulo'}</div><div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{mensagem || 'Mensagem'}{passo === 3 && cupom ? ` Cupom: ${cupom}` : ''}</div></div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in" style={{ marginTop: '20px' }}>

            {/* ── 3 CARDS DE METRICAS ── */}
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
                        <span style={{ marginTop: '4px', display: 'block', fontSize: '0.85rem', color: '#6B7280' }}>{osStats?.instalacoes ?? 0} instalacoes → {activeSubscribers} inscritos</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                    <div className="stat-info">
                        <h3>Taxa de Abertura Media</h3>
                        <p>{loadingStats ? '...' : `${mediaAbertura}%`}</p>
                        {mediaAbertura > 0 && (() => { const b = getBenchmarkBadge(mediaAbertura); return <span style={{ display: 'inline-block', marginTop: '4px', background: b.bg, color: b.color, padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{b.icon} {b.label}</span>; })()}
                        <span style={{ marginTop: '4px', display: 'block', fontSize: '0.85rem', color: '#6B7280' }}>Media do setor: ~5-10%</span>
                    </div>
                </div>
            </div>

            {/* ── SAUDE DA BASE ── */}
            {loadingStats ? (
                <div className="config-card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '30px', color: '#888' }}>Carregando dados do OneSignal...</div>
            ) : (
                <div className="config-card" style={{ marginBottom: '1.5rem' }}>
                    <CardSection title="❤️ Saude da Base de Push" subtitle="Ativos vs Inativos (bloquearam ou desinstalaram)" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
                        <div>
                            {totalSubscribers > 0 ? (
                                <>
                                    <div style={{ marginBottom: '14px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />Ativos</span>
                                            <span style={{ fontWeight: 700 }}>{activeSubscribers.toLocaleString('pt-BR')} <span style={{ color: '#10B981' }}>({pctAtivos}%)</span></span>
                                        </div>
                                        <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: `${pctAtivos}%`, background: '#10B981', height: '100%', borderRadius: '999px', transition: 'width 0.6s' }} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '14px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />Inativos</span>
                                            <span style={{ fontWeight: 700 }}>{inativos.toLocaleString('pt-BR')} <span style={{ color: '#EF4444' }}>({pctInativos}%)</span></span>
                                        </div>
                                        <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: `${pctInativos}%`, background: '#EF4444', height: '100%', borderRadius: '999px', transition: 'width 0.6s' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                        <span style={{ background: churnRate > 30 ? '#fee2e2' : '#f0fdf4', color: churnRate > 30 ? '#991b1b' : '#166534', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>📉 Churn: {churnRate}%</span>
                                        <span style={{ background: '#F3F4F6', color: '#374151', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>📈 Retencao: {pctAtivos}%</span>
                                    </div>
                                    <div style={{ padding: '10px 14px', background: pctAtivos >= 70 ? '#f0fdf4' : '#fef3c7', border: `1px solid ${pctAtivos >= 70 ? '#86efac' : '#fde68a'}`, borderRadius: '8px', fontSize: '12px', color: pctAtivos >= 70 ? '#166534' : '#92400e' }}>
                                        {pctAtivos >= 70 ? '✅ Base saudavel — mais de 70% ativos' : pctAtivos >= 40 ? '⚠️ Base razoavel — considere reativar inativos' : 'Base comprometida — muitos usuarios bloquearam'}
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: '20px', background: '#F9FAFB', borderRadius: '8px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                                    Aguardando dados do OneSignal...
                                    <div style={{ fontSize: '11px', marginTop: '6px' }}>Configure o OneSignal na aba Configuracoes</div>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="stat-card" style={{ margin: 0, padding: '14px 16px' }}>
                                <div className="stat-info">
                                    <h3 style={{ fontSize: '0.8rem' }}>Total Cadastrado</h3>
                                    <p style={{ fontSize: '1.5rem', margin: '4px 0' }}>{totalSubscribers > 0 ? totalSubscribers.toLocaleString('pt-BR') : '—'}</p>
                                    <span style={{ fontSize: '11px', color: '#6B7280' }}>Todos que ja deram permissao</span>
                                </div>
                            </div>
                            <div className="stat-card" style={{ margin: 0, padding: '14px 16px' }}>
                                <div className="stat-info">
                                    <h3 style={{ fontSize: '0.8rem' }}>⏰ Melhor Horario</h3>
                                    <p style={{ fontSize: '1.5rem', margin: '4px 0' }}>{melhorHorario ?? '—'}</p>
                                    <span style={{ fontSize: '11px', color: '#6B7280' }}>{melhorHorario ? 'Baseado nas aberturas' : 'Disponivel apos campanhas'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── FUNIL DE NOTIFICACOES ── */}
            <div className="config-card" style={{ marginBottom: '1.5rem' }}>
                <CardSection title="🔔 Funil de Notificacoes" subtitle={notifs.length > 0 ? `Performance agregada de todas as ${notifs.length} campanhas` : 'Disponivel apos enviar campanhas'} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                        { label: 'Enviados', value: totalEnviados, pct: 100, color: '#4F46E5', icon: '📤', desc: 'Total disparado' },
                        { label: 'Entregues', value: totalConfirmados, pct: pctEntrega, color: '#3b82f6', icon: '📬', desc: totalEnviados > 0 ? `${pctEntrega}% do total` : 'Aguardando dados' },
                        { label: 'Clicados', value: totalClicados, pct: pctClique, color: '#10B981', icon: '👆', desc: totalEnviados > 0 ? `CTR: ${pctClique}%` : 'Aguardando dados' },
                        { label: 'Convertidos', value: totalConvertidos, pct: pctConversao, color: '#f59e0b', icon: '💰', desc: totalClicados > 0 ? `${pctConversao}% dos cliques` : 'Aguardando dados' },
                    ].map((step, i) => (
                        <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                            {i > 0 && <div style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '18px' }}>›</div>}
                            <div style={{ background: '#F9FAFB', border: `2px solid ${step.color}30`, borderRadius: '12px', padding: '16px 12px' }}>
                                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{step.icon}</div>
                                <div style={{ fontSize: '22px', fontWeight: 700, color: step.value > 0 ? step.color : '#9CA3AF', marginBottom: '2px' }}>{step.value > 0 ? step.value.toLocaleString('pt-BR') : '—'}</div>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>{step.label}</div>
                                <div style={{ fontSize: '11px', color: '#6B7280' }}>{step.desc}</div>
                                <div style={{ marginTop: '8px', background: '#E5E7EB', borderRadius: '999px', height: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${step.pct}%`, background: step.color, height: '100%', borderRadius: '999px', transition: 'width 0.6s' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── SUGESTOES INTELIGENTES ── */}
            <div className="config-card" style={{ marginBottom: '1.5rem' }}>
                <CardSection title="💡 Sugestoes para sua Loja" subtitle="Insights automaticos baseados nos seus dados" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {melhorHorario ? (
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px' }}>
                            <span style={{ fontSize: '22px', flexShrink: 0 }}>⏰</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#3730A3', marginBottom: '2px' }}>Melhor horario para enviar: <strong>{melhorHorario}</strong></div>
                                <div style={{ fontSize: '12px', color: '#4338CA' }}>Seu publico abre mais as notificacoes nesse horario. Agende sua proxima campanha para maximizar o CTR.</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '10px' }}>
                            <span style={{ fontSize: '22px', flexShrink: 0 }}>⏰</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#374151', marginBottom: '2px' }}>Melhor horario ainda nao disponivel</div>
                                <div style={{ fontSize: '12px', color: '#6B7280' }}>Envie suas primeiras campanhas para o sistema aprender quando seu publico e mais ativo.</div>
                            </div>
                        </div>
                    )}
                    {totalSubscribers > 0 && churnRate > 30 ? (
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px' }}>
                            <span style={{ fontSize: '22px', flexShrink: 0 }}>🚨</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#991B1B', marginBottom: '2px' }}>Alerta: {inativos.toLocaleString('pt-BR')} usuarios inativos ({churnRate}% de churn)</div>
                                <div style={{ fontSize: '12px', color: '#B91C1C' }}>Tente enviar menos campanhas por semana ou use mensagens mais personalizadas com <code style={{ background: '#FEE2E2', padding: '1px 4px', borderRadius: '3px' }}>{'{{first_name}}'}</code>.</div>
                            </div>
                        </div>
                    ) : totalSubscribers > 0 ? (
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px' }}>
                            <span style={{ fontSize: '22px', flexShrink: 0 }}>✅</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#166534', marginBottom: '2px' }}>Base com baixo churn ({churnRate}%) — continue assim!</div>
                                <div style={{ fontSize: '12px', color: '#15803D' }}>Sua frequencia de envio esta adequada. Os usuarios nao estao bloqueando as notificacoes.</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '10px' }}>
                            <span style={{ fontSize: '22px', flexShrink: 0 }}>📊</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#374151', marginBottom: '2px' }}>Aguardando primeiros subscribers</div>
                                <div style={{ fontSize: '12px', color: '#6B7280' }}>Configure o OneSignal e instale o app na loja para comecar a capturar subscribers.</div>
                            </div>
                        </div>
                    )}
                    {mediaAbertura > 0 && (() => { const b = getBenchmarkBadge(mediaAbertura); return (
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: b.bg + '60', border: `1px solid ${b.bg}`, borderRadius: '10px' }}>
                            <span style={{ fontSize: '22px', flexShrink: 0 }}>📊</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: b.color, marginBottom: '2px' }}>
                                    CTR Medio: {mediaAbertura}% — <span style={{ background: b.bg, padding: '2px 8px', borderRadius: '999px', fontSize: '12px' }}>{b.icon} {b.label}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: b.color }}>
                                    {mediaAbertura >= 10 ? 'CTR acima da media do setor (5-10%). Continue com mensagens relevantes e segmentadas.' : mediaAbertura >= 5 ? 'Na media do setor. Tente usar Rich Push com imagens e botoes de acao para aumentar o CTR.' : 'Abaixo da media. Revise os titulos — use urgencia, personalizacao e emojis com moderacao.'}
                                </div>
                            </div>
                        </div>
                    ); })()}
                    {ticketMedio > 0 && totalClicados > 0 && (
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px' }}>
                            <span style={{ fontSize: '22px', flexShrink: 0 }}>💰</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#92400E', marginBottom: '2px' }}>Receita estimada via push: <strong>{brl(Math.round(totalClicados * (taxaConvGlobal / 100) * ticketMedio))}</strong></div>
                                <div style={{ fontSize: '12px', color: '#B45309' }}>{totalClicados} cliques x {taxaConvGlobal}% conversao x {brl(ticketMedio)} ticket medio</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── DISPOSITIVOS + PAISES ── */}
            {(porDisp.length > 0 || porPais.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="config-card" style={{ marginBottom: 0 }}>
                        <CardSection title="📱 Plataformas — Cliques Reais" subtitle="Distribuicao de cliques por dispositivo" />
                        {porDisp.map(d => {
                            const cliques = Math.round(totalClicados * (d.pct / 100));
                            return (
                                <div key={d.dispositivo} style={{ marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>
                                        <span>{dispIcons[d.dispositivo] ?? '📟'} {d.dispositivo}</span>
                                        <span style={{ color: '#6B7280' }}>{d.count} ({d.pct}%){cliques > 0 && <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 600 }}>· {cliques} cliques</span>}</span>
                                    </div>
                                    <div style={{ background: '#E5E7EB', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                        <div style={{ width: `${d.pct}%`, background: dispColors[d.dispositivo] ?? '#4F46E5', height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                            );
                        })}
                        {porDisp.length === 0 && <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Aguardando dados...</p>}
                    </div>
                    <div className="config-card" style={{ marginBottom: 0 }}>
                        <CardSection title="🌍 Por Pais" />
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
                        {tab === 'campanhas' ? '📢 Campanhas' : '🤖 Automacoes'}
                    </button>
                ))}
            </div>

            {/* ── ABA CAMPANHAS ── */}
            {activeTab === 'campanhas' && (
                <>
                    <div className="config-card">
                        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <h2 style={{ margin: 0 }}>📢 Criar Nova Campanha</h2>
                            <p style={{ color: '#666' }}>Envie notificacoes push para seus clientes.</p>
                        </div>

                        {/* ── NOVO: SELETOR DE OBJETIVO ── */}
                        <div style={{ marginTop: '20px' }}>
                            <SeletorObjetivo objetivo={objetivo} onSelect={handleSelecionarObjetivo} />
                        </div>

                        {/* Divisor visual */}
                        <div style={{ borderTop: '1px solid #E5E7EB', margin: '4px 0 20px' }} />

                        <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>👥</span>
                                <div>
                                    <strong>Alcance estimado:</strong>{' '}
                                    <span style={{ color: '#4F46E5', fontWeight: 'bold' }}>{alcanceEstimado().toLocaleString('pt-BR')} dispositivos</span>
                                    {(pushForm.filter_device || pushForm.filter_country || pushForm.filter_behavior) && <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '8px' }}>(filtro ativo)</span>}
                                </div>
                            </div>
                            <button onClick={() => setShowSegmentation(!showSegmentation)} style={{ background: showSegmentation ? '#EEF2FF' : '#fff', border: '1px solid #d1d5db', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: showSegmentation ? '#4F46E5' : '#374151' }}>
                                🎯 {showSegmentation ? 'Ocultar' : 'Segmentar'}
                            </button>
                        </div>
                        {showSegmentation && (
                            <div className="animate-fade-in" style={{ background: '#F9FAFB', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 14px', fontSize: '14px', color: '#374151' }}>🎯 Filtros de Segmentacao</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>💰 Comportamento</label>
                                        <select value={pushForm.filter_behavior ?? ''} onChange={e => setPushForm({ ...pushForm, filter_behavior: e.target.value || undefined })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                            <option value="">🟢 Todos os inscritos</option>
                                            <option value="buyers">💰 So quem JA comprou (VIPs)</option>
                                            <option value="non_buyers">👻 So quem NUNCA comprou</option>
                                        </select>
                                        <small style={{ fontSize: '10px', color: '#6B7280' }}>
                                            {objetivo && OBJETIVOS.find(o => o.id === objetivo)?.segmento
                                                ? '✅ Aplicado automaticamente pelo objetivo'
                                                : 'Baseado nas tags do app'}
                                        </small>
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
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>🌍 Pais</label>
                                        <select value={pushForm.filter_country ?? ''} onChange={e => setPushForm({ ...pushForm, filter_country: e.target.value || undefined })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                            <option value="">Todos</option>
                                            <option value="BR">🇧🇷 Brasil</option>
                                            <option value="PT">🇵🇹 Portugal</option>
                                            <option value="US">🇺🇸 EUA</option>
                                            <option value="AR">🇦🇷 Argentina</option>
                                            <option value="MX">🇲🇽 Mexico</option>
                                            <option value="CO">🇨🇴 Colombia</option>
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
                                            <span style={{ fontSize: '12px', color: pushForm.intelligent_delivery ? '#4F46E5' : '#6B7280' }}>{pushForm.intelligent_delivery ? 'Ativo — horario ideal' : 'Desativado'}</span>
                                        </div>
                                        <small style={{ fontSize: '10px', color: '#6B7280' }}>IA entrega quando cada usuario costuma abrir</small>
                                    </div>
                                </div>
                                {(pushForm.filter_device || pushForm.filter_country || pushForm.send_after || pushForm.filter_behavior) && (
                                    <button onClick={() => setPushForm({ ...pushForm, filter_device: undefined, filter_country: undefined, send_after: undefined, filter_behavior: undefined })} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#DC2626', fontSize: '12px', cursor: 'pointer', padding: 0 }}>x Limpar filtros</button>
                                )}
                            </div>
                        )}
                        <div className="form-group">
                            <label>Titulo</label>
                            <input type="text" value={pushForm.title} onChange={e => setPushForm({ ...pushForm, title: e.target.value })} maxLength={50} placeholder="Ex: Oferta Relampago!" />
                            <small>{pushForm.title.length}/50 — use <code style={{ background: '#F3F4F6', padding: '1px 4px', borderRadius: '3px' }}>{'{{first_name}}'}</code> para personalizar</small>
                        </div>

                        {/* ── TEMPLATES (dinâmicos pelo objetivo) ── */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                📝 {objetivo ? `Templates para ${OBJETIVOS.find(o => o.id === objetivo)?.label}` : 'Templates prontos'} — clique para usar
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {templatesAtivos.map(t => {
                                    const objConfig = objetivo ? OBJETIVOS.find(o => o.id === objetivo) : null;
                                    return (
                                        <button
                                            key={t.label}
                                            onClick={() => setPushForm({ ...pushForm, title: t.title, message: t.msg })}
                                            style={{
                                                padding: '5px 12px', borderRadius: '999px',
                                                border: `1px solid ${objConfig ? objConfig.corBorder : '#d1d5db'}`,
                                                background: objConfig ? objConfig.corBg : '#F9FAFB',
                                                fontSize: '12px', cursor: 'pointer',
                                                color: objConfig ? objConfig.cor : '#374151',
                                                fontWeight: 500, transition: 'all 0.15s',
                                            }}
                                        >
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Mensagem</label>
                            <input type="text" value={pushForm.message} onChange={e => setPushForm({ ...pushForm, message: e.target.value })} maxLength={120} placeholder="Ex: 10% OFF hoje por tempo limitado!" />
                            <small>{pushForm.message.length}/120 — ex: "Ola {'{{first_name}}'}, seu cupom chegou!"</small>
                        </div>
                        <div className="form-group">
                            <label>Link (Opcional)</label>
                            <input type="text" value={pushForm.url} onChange={e => setPushForm({ ...pushForm, url: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="form-group">
                            <label>🖼️ Imagem do Push (Rich Push — opcional)</label>
                            <input type="text" value={pushForm.image_url ?? ''} onChange={e => setPushForm({ ...pushForm, image_url: e.target.value || undefined })} placeholder="https://... (banner de promocao, foto do produto)" />
                            <small>Aparece como imagem grande na notificacao (Android + Chrome). Aumenta o CTR em ate 50%.</small>
                        </div>
                        <div style={{ background: '#F9FAFB', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>🔘 Botoes de Acao (opcional) <span style={{ fontWeight: 400, color: '#6B7280' }}>— aparecem embaixo da notificacao</span></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Botao 1 — Texto</label><input type="text" value={pushForm.btn1_text ?? ''} onChange={e => setPushForm({ ...pushForm, btn1_text: e.target.value || undefined })} placeholder="Ex: 🛒 Comprar Agora" maxLength={30} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} /></div>
                                <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Botao 1 — Link</label><input type="text" value={pushForm.btn1_url ?? ''} onChange={e => setPushForm({ ...pushForm, btn1_url: e.target.value || undefined })} placeholder="https://..." style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Botao 2 — Texto</label><input type="text" value={pushForm.btn2_text ?? ''} onChange={e => setPushForm({ ...pushForm, btn2_text: e.target.value || undefined })} placeholder="Ex: 🎁 Pegar Cupom" maxLength={30} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} /></div>
                                <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Botao 2 — Link</label><input type="text" value={pushForm.btn2_url ?? ''} onChange={e => setPushForm({ ...pushForm, btn2_url: e.target.value || undefined })} placeholder="https://..." style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} /></div>
                            </div>
                        </div>

                        {/* ── PREVIEW ANDROID + DESKTOP ── */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>👁️ Preview nas plataformas</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>🤖 Android</div>
                                    <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '10px', border: '3px solid #333' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
                                            <span style={{ fontSize: '9px', color: '#aaa' }}>12:30</span>
                                            <span style={{ fontSize: '9px', color: '#aaa' }}>🔋 📶</span>
                                        </div>
                                        <div style={{ background: '#2d2d2d', borderRadius: '10px', padding: '10px', overflow: 'hidden' }}>
                                            {pushForm.image_url && (
                                                <div style={{ width: '100%', height: '70px', borderRadius: '6px', marginBottom: '8px', overflow: 'hidden', background: '#3d3d3d' }}>
                                                    <img src={pushForm.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: objetivo ? OBJETIVOS.find(o => o.id === objetivo)?.cor ?? '#4F46E5' : '#4F46E5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                                    {objetivo ? OBJETIVOS.find(o => o.id === objetivo)?.icon : '🔔'}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {pushForm.title || 'Titulo da notificacao'}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#9CA3AF', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                        {pushForm.message || 'Mensagem da notificacao'}
                                                    </div>
                                                </div>
                                            </div>
                                            {(pushForm.btn1_text || pushForm.btn2_text) && (
                                                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: '1px solid #444', paddingTop: '8px' }}>
                                                    {pushForm.btn1_text && <span style={{ background: '#374151', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{pushForm.btn1_text}</span>}
                                                    {pushForm.btn2_text && <span style={{ background: '#374151', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{pushForm.btn2_text}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>🖥️ Desktop (Chrome / Windows)</div>
                                    <div style={{ background: '#f1f1f1', borderRadius: '12px', padding: '10px', border: '1px solid #ddd', position: 'relative' }}>
                                        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
                                        </div>
                                        <div style={{ background: '#fff', borderRadius: '8px', padding: '10px 12px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', display: 'flex', gap: '10px', alignItems: 'flex-start', position: 'relative' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: objetivo ? OBJETIVOS.find(o => o.id === objetivo)?.cor ?? '#4F46E5' : '#4F46E5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                                                {objetivo ? OBJETIVOS.find(o => o.id === objetivo)?.icon : '🔔'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {pushForm.title || 'Titulo da notificacao'}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#6B7280', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                    {pushForm.message || 'Mensagem da notificacao'}
                                                </div>
                                                {pushForm.image_url && (
                                                    <div style={{ marginTop: '6px', width: '100%', height: '50px', borderRadius: '4px', overflow: 'hidden', background: '#f3f4f6' }}>
                                                        <img src={pushForm.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                    </div>
                                                )}
                                            </div>
                                            <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '10px', color: '#9CA3AF' }}>agora</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── CONTROLE DE FREQUENCIA ── */}
                        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <span style={{ fontSize: '18px' }}>🔔</span>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>Controle de Frequencia</div>
                                    <div style={{ fontSize: '11px', color: '#B45309' }}>Limita quantos pushs cada usuario recebe por dia (evita bloqueio)</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                <select
                                    value={(pushForm as any).frequency_limit ?? ''}
                                    onChange={e => setPushForm({ ...pushForm, ...(e.target.value ? { frequency_limit: parseInt(e.target.value) } : { frequency_limit: undefined }) } as any)}
                                    style={{ padding: '6px 10px', border: '1px solid #FED7AA', borderRadius: '6px', background: 'white', fontSize: '13px', color: '#374151' }}
                                >
                                    <option value="">Sem limite</option>
                                    <option value="1">Max 1 por dia</option>
                                    <option value="2">Max 2 por dia</option>
                                    <option value="3">Max 3 por dia</option>
                                    <option value="5">Max 5 por semana</option>
                                </select>
                            </div>
                        </div>

                        {/* ── BOTÃO DE ENVIO com cor do objetivo ── */}
                        <button
                            className="save-button"
                            onClick={handleSendPush}
                            disabled={sendingPush || !pushForm.title || !pushForm.message}
                            style={{
                                background: sendingPush ? '#ccc' : objetivo
                                    ? OBJETIVOS.find(o => o.id === objetivo)?.cor ?? '#4F46E5'
                                    : '#4F46E5',
                                width: '100%',
                                marginTop: '10px',
                                transition: 'background 0.3s',
                            }}
                        >
                            {sendingPush
                                ? 'Enviando...'
                                : pushForm.send_after
                                    ? `⏰ Agendar para ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos`
                                    : objetivo
                                        ? `${OBJETIVOS.find(o => o.id === objetivo)?.icon} Enviar campanha de ${OBJETIVOS.find(o => o.id === objetivo)?.label} para ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos`
                                        : `🚀 Enviar para ${alcanceEstimado().toLocaleString('pt-BR')} dispositivos`}
                        </button>
                    </div>

                    {/* ── HISTORICO COM ROI ── */}
                    <div className="config-card" style={{ marginTop: '24px' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>📜 Historico de Campanhas</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#6B7280' }}>Metricas reais do OneSignal{ticketMedio > 0 ? ' + ROI estimado' : ''}</p>
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
                                                <th style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: '#9CA3AF', fontWeight: 400 }}>👆 detalhe</th>
                                            </tr></thead>
                                            <tbody>{notifs.map(n => {
                                                const roi = ticketMedio > 0 ? Math.round(n.opened * (taxaConvGlobal / 100) * ticketMedio) : 0;
                                                const badge = getBenchmarkBadge(n.taxa_abertura);
                                                return (
                                                    <tr key={n.id} onClick={() => setCampanhaDetalhe(n)} style={{ borderBottom: '1px solid #eee', cursor: 'pointer', transition: 'background 0.15s' }} onMouseOver={e => (e.currentTarget.style.background = '#F9FAFB')} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                                                        <td style={{ padding: '12px', whiteSpace: 'nowrap', color: '#555', fontSize: '12px' }}>{formatUnix(n.created_at)}</td>
                                                        <td style={{ padding: '12px' }}>
                                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                                {n.image_url && <img src={n.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                                                                <div><div style={{ fontWeight: 'bold', fontSize: '13px' }}>{n.title}</div><div style={{ fontSize: '12px', color: '#666' }}>{n.message}</div></div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4F46E5' }}>{n.sent.toLocaleString('pt-BR')}</td>
                                                        <td style={{ padding: '12px', textAlign: 'right', color: '#059669' }}>{n.opened.toLocaleString('pt-BR')}</td>
                                                        <td style={{ padding: '12px', textAlign: 'right', color: '#DC2626' }}>{n.failed.toLocaleString('pt-BR')}</td>
                                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                                            <span style={{ background: badge.bg, color: badge.color, padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{badge.icon} {n.taxa_abertura}%</span>
                                                        </td>
                                                        {ticketMedio > 0 && (
                                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                                {roi > 0 ? <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>~{brl(roi)}</span> : <span style={{ color: '#9CA3AF', fontSize: '12px' }}>—</span>}
                                                            </td>
                                                        )}
                                                        <td style={{ padding: '12px', textAlign: 'center', color: '#9CA3AF' }}>›</td>
                                                    </tr>
                                                );
                                            })}</tbody>
                                        </table>
                                        {ticketMedio > 0 && <p style={{ fontSize: '11px', color: '#9CA3AF', padding: '8px 12px', margin: 0 }}>* ROI estimado: abertos x {taxaConvGlobal}% conversao x {brl(ticketMedio)} ticket medio</p>}
                                    </div>
                        )}
                        {activeHistoryTab === 'local' && (
                            loadingHistory ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Carregando...</p>
                                : history.length === 0 ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Nenhuma campanha local.</p>
                                    : <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                            <thead><tr style={{ background: '#f9fafb', color: '#666', textAlign: 'left' }}><th style={{ padding: '12px' }}>Data</th><th style={{ padding: '12px' }}>Mensagem</th><th style={{ padding: '12px', textAlign: 'right' }}>Enviados</th></tr></thead>
                                            <tbody>{history.map(item => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '12px', whiteSpace: 'nowrap', color: '#555' }}>{formatDate(item.created_at)}</td>
                                                    <td style={{ padding: '12px' }}><div style={{ fontWeight: 'bold' }}>{item.title}</div><div style={{ fontSize: '12px', color: '#666' }}>{item.message}</div></td>
                                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4F46E5' }}>{item.sent_count}</td>
                                                </tr>
                                            ))}</tbody>
                                        </table>
                                    </div>
                        )}
                    </div>
                </>
            )}

            {/* ── ABA AUTOMACOES ── */}
            {activeTab === 'automacoes' && (
                <div className="config-card">
                    <div className="card-header">
                        <h2 style={{ margin: 0 }}>🤖 Recuperacao de Carrinho Abandonado</h2>
                        <p style={{ color: '#6B7280', margin: '6px 0 0' }}>Configure as mensagens automaticas enviadas quando um cliente abandona o carrinho.</p>
                    </div>
                    <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '20px' }}>💡</span>
                        <div style={{ fontSize: '13px', color: '#3730A3', lineHeight: '1.5' }}><strong>Como funciona:</strong> Quando um cliente adiciona itens ao carrinho e sai sem comprar, o sistema aguarda o tempo configurado e envia a notificacao automaticamente.</div>
                    </div>
                    {loadingAutomacao ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Carregando...</p> : (
                        <>
                            {renderPassoCard(1, automacao.passo1_ativo, automacao.passo1_horas, automacao.passo1_titulo, automacao.passo1_mensagem)}
                            {renderPassoCard(2, automacao.passo2_ativo, automacao.passo2_horas, automacao.passo2_titulo, automacao.passo2_mensagem)}
                            {renderPassoCard(3, automacao.passo3_ativo, automacao.passo3_horas, automacao.passo3_titulo, automacao.passo3_mensagem, automacao.passo3_cupom)}

                            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginTop: '4px', marginBottom: '16px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>🛍️</span> Produto Visitado
                                    <span style={{ fontSize: '11px', fontWeight: 400, color: '#6B7280' }}>— lembrete automático após visitar produto</span>
                                </div>
                            </div>
                            <div style={{ border: `2px solid ${automacao.produto_visitado_ativo ? '#8b5cf6' : '#E5E7EB'}`, borderRadius: '12px', padding: '20px', marginBottom: '16px', background: automacao.produto_visitado_ativo ? '#fafafa' : '#f9fafb', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: automacao.produto_visitado_ativo ? '16px' : '0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🛍️</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Visitou produto sem comprar</div>
                                            <div style={{ fontSize: '12px', color: '#6B7280' }}>{automacao.produto_visitado_ativo ? `Lembrete apos ${automacao.produto_visitado_horas}h` : 'Desativado'}</div>
                                        </div>
                                    </div>
                                    <Toggle checked={automacao.produto_visitado_ativo} onChange={v => setAutomacao({ ...automacao, produto_visitado_ativo: v })} />
                                </div>
                                {automacao.produto_visitado_ativo && (
                                    <div className="animate-fade-in">
                                        <div className="form-group" style={{ marginBottom: '12px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Enviar apos</label>
                                            <select value={automacao.produto_visitado_horas} onChange={e => setAutomacao({ ...automacao, produto_visitado_horas: parseFloat(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                                {HORAS_OPCOES.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '12px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Titulo</label>
                                            <input type="text" value={automacao.produto_visitado_titulo} maxLength={50} onChange={e => setAutomacao({ ...automacao, produto_visitado_titulo: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '0' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Mensagem</label>
                                            <textarea value={automacao.produto_visitado_mensagem} maxLength={120} rows={2} onChange={e => setAutomacao({ ...automacao, produto_visitado_mensagem: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }} />
                                        </div>
                                        <div style={{ marginTop: '12px', background: '#111827', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#8b5cf6', flexShrink: 0 }} />
                                            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{automacao.produto_visitado_titulo || 'Titulo'}</div><div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{automacao.produto_visitado_mensagem || 'Mensagem'}</div></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginTop: '4px', marginBottom: '16px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>😴</span> Cliente Inativo
                                    <span style={{ fontSize: '11px', fontWeight: 400, color: '#6B7280' }}>— reativacao automatica de clientes sumidos</span>
                                </div>
                            </div>
                            <div style={{ border: `2px solid ${automacao.inativo_ativo ? '#f59e0b' : '#E5E7EB'}`, borderRadius: '12px', padding: '20px', marginBottom: '16px', background: automacao.inativo_ativo ? '#fafafa' : '#f9fafb', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: automacao.inativo_ativo ? '16px' : '0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>😴</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Nao visita ha X dias</div>
                                            <div style={{ fontSize: '12px', color: '#6B7280' }}>{automacao.inativo_ativo ? `Dispara apos ${automacao.inativo_dias} dias sem visita` : 'Desativado'}</div>
                                        </div>
                                    </div>
                                    <Toggle checked={automacao.inativo_ativo} onChange={v => setAutomacao({ ...automacao, inativo_ativo: v })} />
                                </div>
                                {automacao.inativo_ativo && (
                                    <div className="animate-fade-in">
                                        <div className="form-group" style={{ marginBottom: '12px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Dias de inatividade</label>
                                            <select value={automacao.inativo_dias} onChange={e => setAutomacao({ ...automacao, inativo_dias: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', fontSize: '13px' }}>
                                                <option value={3}>3 dias</option>
                                                <option value={7}>7 dias</option>
                                                <option value={14}>14 dias</option>
                                                <option value={30}>30 dias</option>
                                                <option value={60}>60 dias</option>
                                            </select>
                                            <small style={{ fontSize: '10px', color: '#6B7280' }}>Baseado na tag ultima_visita — roda 1x por dia automaticamente</small>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '12px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Titulo</label>
                                            <input type="text" value={automacao.inativo_titulo} maxLength={50} onChange={e => setAutomacao({ ...automacao, inativo_titulo: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '0' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Mensagem</label>
                                            <textarea value={automacao.inativo_mensagem} maxLength={120} rows={2} onChange={e => setAutomacao({ ...automacao, inativo_mensagem: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }} />
                                        </div>
                                        <div style={{ marginTop: '12px', background: '#111827', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f59e0b', flexShrink: 0 }} />
                                            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{automacao.inativo_titulo || 'Titulo'}</div><div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{automacao.inativo_mensagem || 'Mensagem'}</div></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button className="save-button" onClick={saveAutomacao} disabled={savingAutomacao} style={{ width: '100%', marginTop: '8px', background: savingAutomacao ? '#ccc' : '#111827' }}>
                                {savingAutomacao ? 'Salvando...' : '💾 Salvar Automacoes'}
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* ── MODAL DETALHE DA CAMPANHA ── */}
            {campanhaDetalhe && (
                <CampanhaDetalhe
                    notif={campanhaDetalhe}
                    mediaAbertura={mediaAbertura}
                    ticketMedio={ticketMedio}
                    taxaConvGlobal={taxaConvGlobal}
                    onClose={() => setCampanhaDetalhe(null)}
                    brl={brl}
                />
            )}
        </div>
    );
}
