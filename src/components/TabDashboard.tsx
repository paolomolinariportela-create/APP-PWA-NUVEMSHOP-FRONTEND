import React from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  brand:       '#4F46E5',
  brandHover:  '#4338CA',
  brandLight:  '#EEF2FF',
  brandMuted:  '#818CF8',

  success:     '#059669',
  successBg:   '#F0FDF4',
  successBorder:'#A7F3D0',

  warning:     '#B45309',
  warningBg:   '#FFFBEB',
  warningBorder:'#FDE68A',

  danger:      '#B91C1C',
  dangerBg:    '#FFF5F5',
  dangerBorder:'#FECACA',

  neutral:     '#374151',
  neutralMid:  '#6B7280',
  neutralLight:'#9CA3AF',
  neutralBorder:'#E5E7EB',
  neutralBg:   '#F9FAFB',

  text:        '#111827',
  textMid:     '#374151',
  textSoft:    '#6B7280',

  white:       '#FFFFFF',
  dark:        '#111827',
  darkMid:     '#1F2937',
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = {
  revenue: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  ticket: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
    </svg>
  ),
  mobile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  trending: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  eye: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  pages: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  cart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  conversion: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  lightning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  target: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  dollar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  bulb: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
};

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
const Badge = ({ color, bg, border, children }: { color: string; bg: string; border: string; children: React.ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: bg, color, border: `1px solid ${border}`, fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.02em' }}>
    {children}
  </span>
);

const ActionBtn = ({ primary, onClick, children, contextColor }: { primary?: boolean; onClick?: () => void; children: React.ReactNode; contextColor?: string }) => {
  const bg = primary ? (contextColor ?? C.dark) : C.white;
  const color = primary ? C.white : (contextColor ?? C.textMid);
  const border = primary ? 'none' : `1px solid ${C.neutralBorder}`;
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border, background: bg, color, transition: 'all 0.15s' }}>
      {children}
    </button>
  );
};

// ─── INTERFACES ───────────────────────────────────────────────────────────────
interface DashboardStats {
  receita: number;
  vendas: number;
  instalacoes: number;
  instalacoes_banco?: number;
  crescimento_instalacoes_7d: number;
  carrinhos_abandonados: { valor: number; qtd: number; ativos_automacao?: number; ativos_onesignal?: number; };
  taxa_conversao: { app: number; site: number };
  visualizacoes: { pageviews: number; tempo_medio: string; top_paginas: string[]; top_paginas_pwa?: string[]; };
  funil: { visitas: number; carrinho: number; checkout: number };
  recorrencia: { clientes_2x: number; taxa_recompra: number; compradores_onesignal?: number; };
  ticket_medio: { app: number; site: number };
  extra_pwa?: { visitas_pwa: number; visitas_site: number; vendas_pwa: number; vendas_site: number; };
  onesignal?: { active_subscribers: number; carrinho_ativo_count: number; compradores_count: number; };
}

interface Props {
  stats: DashboardStats;
  onNavigateCampanhas?: () => void;
}

type Severidade = 'critico' | 'alerta' | 'ok';
interface AcaoCampanha { label: string; icon: React.ReactNode; }
interface Diagnostico {
  severidade: Severidade;
  badge: string;
  titulo: string;
  urgencia: string;
  descricao: string;
  causas: string[];
  acoes: AcaoCampanha[];
  projecao_inline?: string;
  proximo_passo: string;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TabDashboard({ stats, onNavigateCampanhas }: Props) {
  const receita        = stats?.receita ?? 0;
  const vendas         = stats?.vendas ?? 0;
  const crescimento7d  = stats?.crescimento_instalacoes_7d ?? 0;
  const carrinhosValor = stats?.carrinhos_abandonados?.valor ?? 0;
  const carrinhosQtd   = stats?.carrinhos_abandonados?.qtd ?? 0;
  const ticketApp      = stats?.ticket_medio?.app ?? 0;
  const taxaConvApp    = stats?.taxa_conversao?.app ?? 0;
  const clientesRec    = stats?.recorrencia?.clientes_2x ?? 0;
  const taxaRecompra   = stats?.recorrencia?.taxa_recompra ?? 0;
  const pageviews      = stats?.visualizacoes?.pageviews ?? 0;
  const tempoMedio     = stats?.visualizacoes?.tempo_medio ?? '--';
  const topPaginasPwa  = stats?.visualizacoes?.top_paginas_pwa ?? [];
  const funilVisitas   = stats?.funil?.visitas ?? 0;
  const funilCarrinho  = stats?.funil?.carrinho ?? 0;
  const funilCheckout  = stats?.funil?.checkout ?? 0;

  const osData       = stats?.onesignal;
  const instalacoes  = osData?.active_subscribers || stats?.instalacoes || 0;
  const carrinhoOS   = osData?.carrinho_ativo_count ?? 0;
  const compradoresOS = osData?.compradores_count ?? 0;
  const temOsData    = !!osData && osData.active_subscribers > 0;

  const brl = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const metaInstalacoes = instalacoes < 100 ? 100 : instalacoes < 500 ? 500 : instalacoes < 1000 ? 1000 : Math.ceil(instalacoes / 1000) * 1000;
  const metaReceita     = receita < 500 ? 500 : receita < 1000 ? 1000 : receita < 5000 ? 5000 : Math.ceil(receita / 5000) * 5000;
  const metaRec         = clientesRec < 10 ? 10 : clientesRec < 50 ? 50 : clientesRec < 100 ? 100 : Math.ceil(clientesRec / 100) * 100;

  const mediaConv       = 1.5;
  const taxaV2C         = funilVisitas > 0 ? (funilCarrinho / funilVisitas) * 100 : 0;
  const taxaC2O         = funilCarrinho > 0 ? (funilCheckout / funilCarrinho) * 100 : 0;
  const produtoDestaque = topPaginasPwa.find(p => p && p !== '/' && p !== 'install' && p.length > 1) ?? null;

  // ── DIAGNÓSTICO ──
  const getDiagnostico = (): Diagnostico => {
    if (funilVisitas === 0) return {
      severidade: 'alerta', badge: 'Sem tráfego',
      titulo: 'Nenhuma visita registrada ainda',
      urgencia: 'O app ainda não tem dados de tráfego para analisar.',
      descricao: 'Compartilhe o link de instalação com seus clientes para começar a capturar dados e visitantes.',
      causas: ['App não divulgado para a base de clientes', 'Link de instalação não compartilhado', 'Nenhuma campanha de lançamento ativa'],
      acoes: [
        { label: 'Campanha de lançamento', icon: Icon.lightning },
        { label: 'Cupom de boas-vindas', icon: Icon.target },
      ],
      proximo_passo: 'Próximo passo: registrar as primeiras 10 visitas',
    };

    if (funilVisitas > 0 && funilCarrinho === 0) {
      const proj = ticketApp > 0 ? `Converter 2% dessas ${funilVisitas} visitas geraria ${brl(Math.round(funilVisitas * 0.02 * ticketApp))} em receita` : '';
      return {
        severidade: 'critico', badge: 'Gargalo identificado',
        titulo: `${funilVisitas} visitas — nenhuma adição ao carrinho`,
        urgencia: 'Visitantes chegam mas não iniciam o processo de compra.',
        descricao: 'O problema está na etapa de decisão. O cliente visualiza mas não age. Uma oferta com incentivo claro costuma resolver.',
        causas: ['Preço acima da percepção de valor', 'Frete alto ou revelado tarde', 'Ausência de prova social ou avaliações', 'Falta de urgência ou escassez na oferta'],
        acoes: [
          { label: 'Criar campanha com cupom', icon: Icon.lightning },
          { label: 'Oferta de urgência', icon: Icon.target },
          { label: 'Frete grátis por tempo limitado', icon: Icon.arrow },
        ],
        projecao_inline: proj,
        proximo_passo: 'Próximo passo: gerar o primeiro carrinho',
      };
    }

    if (funilCarrinho > 0 && funilCheckout === 0) {
      const proj = ticketApp > 0 ? `Recuperar ${funilCarrinho} carrinho${funilCarrinho > 1 ? 's' : ''} representa até ${brl(funilCarrinho * ticketApp)} em receita potencial` : '';
      return {
        severidade: 'critico', badge: 'Abandono no checkout',
        titulo: `${funilCarrinho} carrinho${funilCarrinho > 1 ? 's' : ''} abandonado${funilCarrinho > 1 ? 's' : ''} sem nenhuma venda`,
        urgencia: 'Clientes adicionam produtos mas não finalizam a compra.',
        descricao: 'O gargalo está na etapa de checkout. O cliente quer comprar mas algo o impede de concluir.',
        causas: ['Frete revelado apenas no checkout', 'Método de pagamento não disponível', 'Processo de compra longo ou confuso', 'Insegurança na finalização'],
        acoes: [
          { label: 'Recuperar carrinhos + frete grátis', icon: Icon.lightning },
          { label: 'Cupom de finalização', icon: Icon.target },
          { label: 'Push de urgência — tempo limitado', icon: Icon.arrow },
        ],
        projecao_inline: proj,
        proximo_passo: 'Próximo passo: converter o primeiro carrinho em venda',
      };
    }

    if (taxaConvApp < mediaConv && funilVisitas > 10) {
      const gap = brl(Math.round(funilVisitas * (mediaConv / 100) * ticketApp) - receita);
      return {
        severidade: 'alerta', badge: 'Abaixo da média',
        titulo: `Taxa de conversão ${taxaConvApp}% — média do mercado é ${mediaConv}%`,
        urgencia: `Diferença de ${(mediaConv - taxaConvApp).toFixed(1)}pp em relação à média do setor.`,
        descricao: 'Sua taxa está abaixo da média. Ajustes de oferta e segmentação costumam resolver isso rapidamente.',
        causas: ['Campanhas sem segmentação de comportamento', 'Copy das mensagens pouco persuasivo', 'Frequência de push insuficiente', 'Falta de urgência ou escassez'],
        acoes: [
          { label: 'Campanha segmentada — compradores', icon: Icon.target },
          { label: 'Push de urgência', icon: Icon.lightning },
          ...(ticketApp > 0 ? [{ label: `Potencial: +${gap} em receita`, icon: Icon.dollar }] : []),
        ],
        projecao_inline: ticketApp > 0 ? `Na média do mercado (${mediaConv}%) você faturaria mais ${gap} com o tráfego atual` : '',
        proximo_passo: `Próximo passo: atingir ${mediaConv}% de taxa de conversão`,
      };
    }

    if (carrinhosValor > 0 && receita === 0) return {
      severidade: 'alerta', badge: 'Receita represada',
      titulo: `${brl(carrinhosValor)} em carrinhos sem nenhuma venda concluída`,
      urgencia: 'Há valor potencial parado em carrinhos abandonados.',
      descricao: 'Ativar as automações de recuperação pode converter parte desse valor hoje mesmo.',
      causas: ['Automação de carrinho desativada', 'Clientes sem identificação vinculada', 'Intervalo de recuperação muito longo'],
      acoes: [
        { label: 'Ativar recuperação de carrinhos', icon: Icon.lightning },
        { label: 'Enviar cupom de retorno', icon: Icon.target },
      ],
      proximo_passo: 'Próximo passo: fechar a primeira venda',
    };

    return {
      severidade: 'ok', badge: 'Performance saudável',
      titulo: `Conversão em ${taxaConvApp}% — acima da média do mercado`,
      urgencia: 'A loja está performando bem. Mantenha o ritmo de campanhas.',
      descricao: 'Continue enviando campanhas segmentadas e acompanhe o funil semanalmente para manter a consistência.',
      causas: [],
      acoes: [
        { label: 'Nova campanha para clientes VIP', icon: Icon.target },
        { label: 'Campanha de novidades', icon: Icon.arrow },
      ],
      proximo_passo: `Próximo passo: manter conversão acima de ${(taxaConvApp + 0.5).toFixed(1)}%`,
    };
  };

  const diag = getDiagnostico();

  const paleta = {
    critico: { bg: C.dangerBg,  border: C.dangerBorder,  text: C.danger,  badgeBg: '#FEE2E2', accentIcon: C.danger },
    alerta:  { bg: C.warningBg, border: C.warningBorder, text: C.warning, badgeBg: '#FEF3C7', accentIcon: C.warning },
    ok:      { bg: C.successBg, border: C.successBorder, text: C.success, badgeBg: '#D1FAE5', accentIcon: C.success },
  }[diag.severidade];

  const severidadeIcon = {
    critico: Icon.alert,
    alerta:  Icon.info,
    ok:      Icon.check,
  }[diag.severidade];

  // Projeções de ganho
  const projecoes = ticketApp > 0 && funilVisitas > 0 ? [
    { pct: 1, valor: Math.round(funilVisitas * 0.01 * ticketApp), label: 'Conservador' },
    { pct: 3, valor: Math.round(funilVisitas * 0.03 * ticketApp), label: 'Realista', destaque: true },
    { pct: 5, valor: Math.round(funilVisitas * 0.05 * ticketApp), label: 'Otimista' },
  ] : [];

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <section className="animate-fade-in">

      {/* ── BLOCO DE DIAGNÓSTICO ───────────────────────────────────────── */}
      <div style={{ background: paleta.bg, border: `1px solid ${paleta.border}`, borderRadius: '10px', padding: '18px 20px', marginBottom: '20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ color: paleta.text, display: 'flex' }}>{severidadeIcon}</span>
          <Badge color={paleta.text} bg={paleta.badgeBg} border={paleta.border}>{diag.badge}</Badge>
          <span style={{ fontSize: '13px', color: paleta.text, fontWeight: 500, marginLeft: '2px' }}>{diag.urgencia}</span>
        </div>

        {/* Título */}
        <div style={{ fontSize: '15px', fontWeight: 700, color: C.text, marginBottom: '4px' }}>{diag.titulo}</div>
        <div style={{ fontSize: '13px', color: C.textSoft, lineHeight: 1.55, marginBottom: diag.causas.length > 0 ? '12px' : '0' }}>{diag.descricao}</div>

        {/* Causas */}
        {diag.causas.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: C.textMid, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '6px' }}>Possíveis causas</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {diag.causas.map((c, i) => (
                <span key={i} style={{ fontSize: '12px', color: C.textMid, background: C.white, padding: '3px 10px', borderRadius: '4px', border: `1px solid ${C.neutralBorder}` }}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* Projeção inline */}
        {diag.projecao_inline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.dark, color: '#FCD34D', borderRadius: '6px', padding: '9px 14px', marginBottom: '12px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ color: '#FCD34D', display: 'flex' }}>{Icon.dollar}</span>
            {diag.projecao_inline}
          </div>
        )}

        {/* Ações */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {diag.acoes.map((acao, i) => (
            <ActionBtn key={i} primary={i === 0} onClick={onNavigateCampanhas} contextColor={paleta.text}>
              {acao.icon} {acao.label}
            </ActionBtn>
          ))}
        </div>

        {/* Próximo passo + Insight */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '6px', background: C.white, borderRadius: '6px', padding: '7px 10px', border: `1px solid ${C.neutralBorder}`, fontSize: '12px', color: C.textMid, fontWeight: 500 }}>
            <span style={{ color: C.brand, display: 'flex' }}>{Icon.target}</span>
            {diag.proximo_passo}
          </div>
          {produtoDestaque && (
            <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '6px', background: C.white, borderRadius: '6px', padding: '7px 10px', border: `1px solid ${C.neutralBorder}`, fontSize: '12px', color: C.textSoft }}>
              <span style={{ color: C.brand, display: 'flex' }}>{Icon.bulb}</span>
              Página mais visitada: <strong style={{ color: C.textMid }}>"{produtoDestaque.replace(/\//g, '').slice(0, 25)}"</strong> — use-a na campanha
            </div>
          )}
        </div>

        {/* Mini funil */}
        {funilVisitas > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
            {[
              { label: 'Visitas', val: funilVisitas, pct: null, ok: true },
              { label: 'Carrinho', val: funilCarrinho, pct: taxaV2C, ok: funilCarrinho > 0 },
              { label: 'Checkout', val: funilCheckout, pct: taxaC2O, ok: funilCheckout > 0 },
            ].map((e, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: C.neutralLight, fontSize: '14px' }}>›</span>}
                <div style={{ background: C.white, borderRadius: '6px', padding: '6px 12px', textAlign: 'center' as const, border: `1px solid ${e.ok ? C.neutralBorder : C.dangerBorder}`, minWidth: '70px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: e.ok ? C.text : C.danger }}>{e.val}</div>
                  <div style={{ fontSize: '10px', color: C.textSoft, marginTop: '1px' }}>{e.label}</div>
                  {e.pct !== null && <div style={{ fontSize: '10px', fontWeight: 600, color: e.ok ? C.success : C.danger, marginTop: '1px' }}>{e.pct.toFixed(1)}%</div>}
                </div>
              </React.Fragment>
            ))}
            <span style={{ color: C.neutralLight, fontSize: '14px' }}>›</span>
            <div style={{ background: C.neutralBg, borderRadius: '6px', padding: '6px 12px', textAlign: 'center' as const, border: `1px solid ${C.neutralBorder}`, minWidth: '70px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: C.neutralMid }}>1–3%</div>
              <div style={{ fontSize: '10px', color: C.neutralLight, marginTop: '1px' }}>Mercado</div>
              <div style={{ fontSize: '10px', color: C.neutralLight, marginTop: '1px' }}>benchmark</div>
            </div>
          </div>
        )}
      </div>

      {/* ── PROJEÇÃO DE GANHO ─────────────────────────────────────────── */}
      {projecoes.length > 0 && (
        <div style={{ background: C.dark, borderRadius: '10px', padding: '18px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ color: '#FCD34D', display: 'flex' }}>{Icon.dollar}</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: C.white }}>Projeção de receita</span>
            <span style={{ fontSize: '11px', color: C.neutralLight }}>— {funilVisitas} visitas × {brl(ticketApp)} ticket médio</span>
          </div>
          <div style={{ fontSize: '12px', color: C.neutralLight, marginBottom: '14px' }}>Se você converter esse tráfego:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {projecoes.map((p, i) => (
              <div key={i} style={{ background: p.destaque ? C.brand : 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px 12px', textAlign: 'center' as const, border: p.destaque ? `1px solid ${C.brandMuted}` : '1px solid rgba(255,255,255,0.08)', position: 'relative' as const }}>
                {p.destaque && (
                  <div style={{ position: 'absolute' as const, top: '-9px', left: '50%', transform: 'translateX(-50%)', background: '#F59E0B', color: C.dark, fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '4px', whiteSpace: 'nowrap' as const }}>
                    META REALISTA
                  </div>
                )}
                <div style={{ fontSize: '10px', color: p.destaque ? '#C7D2FE' : C.neutralLight, marginBottom: '4px', fontWeight: 500 }}>{p.label} — {p.pct}%</div>
                <div style={{ fontSize: '19px', fontWeight: 800, color: p.destaque ? C.white : '#D1D5DB' }}>{brl(p.valor)}</div>
                <div style={{ fontSize: '10px', color: p.destaque ? '#A5B4FC' : C.neutralLight, marginTop: '3px' }}>{Math.round(funilVisitas * p.pct / 100)} vendas</div>
              </div>
            ))}
          </div>
          <button onClick={onNavigateCampanhas} style={{ marginTop: '14px', width: '100%', background: C.brand, color: C.white, border: 'none', borderRadius: '6px', padding: '9px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {Icon.target} Criar campanha para atingir essa meta
          </button>
        </div>
      )}

      {/* ── METRIC CARDS ──────────────────────────────────────────────── */}
      <div className="stats-grid">

        {/* Receita */}
        <div className="stat-card" style={{ borderLeft: `3px solid ${C.success}` }}>
          <div className="stat-icon green" style={{ color: C.success }}>{Icon.revenue}</div>
          <div className="stat-info">
            <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px' }}>Receita app</h3>
            <p>{brl(receita)}</p>
            <span className="stat-growth" style={{ color: C.success, fontWeight: 500 }}>{vendas} pedidos realizados</span>
            <div className="card-meta-text">Meta: {brl(metaReceita)}</div>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: C.brand }}>{Icon.ticket}</div>
          <div className="stat-info">
            <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px' }}>Ticket médio</h3>
            <div className="ticket-main-row" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span className="ticket-main-value">{brl(ticketApp)}</span>
              <Badge color={C.brand} bg={C.brandLight} border={C.brandLight}>App</Badge>
            </div>
          </div>
        </div>

        {/* Instalações */}
        <div className="stat-card">
          <div className="stat-icon purple" style={{ color: C.brand }}>{Icon.mobile}</div>
          <div className="stat-info">
            <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px' }}>Instalações ativas</h3>
            <p>{instalacoes}</p>
            <span className="stat-growth" style={{ color: temOsData ? C.brand : C.textSoft, fontWeight: 500 }}>
              {temOsData ? 'Push habilitado — dados em tempo real' : 'Base de clientes fiéis'}
            </span>
            <div className="card-meta-text">Meta: {instalacoes} / {metaInstalacoes}</div>
          </div>
        </div>

        {/* Crescimento */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: crescimento7d > 0 ? C.success : C.neutralMid }}>{Icon.trending}</div>
          <div className="stat-info">
            <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px' }}>Crescimento do app</h3>
            <p style={{ color: crescimento7d > 0 ? C.success : C.text }}>+{crescimento7d}%</p>
            <span className="stat-growth" style={{ color: C.textSoft }}>vs. últimos 7 dias</span>
          </div>
        </div>

        {/* Clientes Convertidos */}
        <div className="stat-card">
          <div className="stat-icon blue" style={{ color: C.brand }}>{Icon.users}</div>
          <div className="stat-info">
            <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px' }}>Clientes convertidos</h3>
            <p>{temOsData && compradoresOS > 0 ? compradoresOS : clientesRec}</p>
            {temOsData && compradoresOS > 0 ? (
              <>
                <div style={{ fontSize: '12px', color: C.textMid, marginTop: '4px', fontWeight: 500 }}>
                  {instalacoes > 0 ? Math.round((compradoresOS / instalacoes) * 100) : 0}% dos usuários com app já compraram
                </div>
                <div style={{ fontSize: '11px', color: C.textSoft, marginTop: '2px' }}>via OneSignal</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '12px', color: C.textMid, marginTop: '4px', fontWeight: 500 }}>
                  Taxa de recompra: {taxaRecompra}%
                </div>
                <div className="card-meta-text">Meta: {metaRec} clientes</div>
              </>
            )}
          </div>
        </div>

        {/* Pageviews */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: C.brand }}>{Icon.eye}</div>
          <div className="stat-info">
            <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px' }}>Páginas visualizadas</h3>
            <p>{pageviews.toLocaleString()}</p>
            <div style={{ fontSize: '12px', color: C.textMid, marginTop: '6px', fontWeight: 500 }}>
              Tempo médio: <strong>{tempoMedio}</strong>
            </div>
          </div>
        </div>

        {/* Top Páginas */}
        {topPaginasPwa.length > 0 && (
          <div className="stat-card">
            <div className="stat-icon" style={{ color: C.brand }}>{Icon.pages}</div>
            <div className="stat-info">
              <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px' }}>Top páginas do app</h3>
              <ul style={{ marginTop: '8px', paddingLeft: 0, listStyle: 'none', fontSize: '11px', color: C.textMid }}>
                {topPaginasPwa.filter(p => p !== 'install').slice(0, 5).map((pagina, idx) => {
                  let label = pagina || '/';
                  const isHome = label === '/';
                  if (isHome) label = 'Página inicial';
                  const display = label.length > 40 ? label.slice(0, 37) + '...' : label;
                  return (
                    <li key={pagina + idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '3px', background: C.neutralBg, fontSize: '10px', color: C.textSoft, border: `1px solid ${C.neutralBorder}`, flexShrink: 0, fontWeight: 600 }}>{idx + 1}</span>
                      <span title={label} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{display}</span>
                      {isHome && <Badge color={C.brand} bg={C.brandLight} border={C.brandLight}>Home</Badge>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Funil */}
        <div className="stat-card" style={{ gridRow: 'span 2' }}>
          <div className="stat-info" style={{ width: '100%' }}>
            <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px', marginBottom: '14px', margin: '0 0 14px' }}>Funil de vendas</h3>
            <div>
              {[
                { label: '1. Visitas únicas', val: funilVisitas, pct: 100, cor: C.neutralLight, bench: null as number | null, botao: null as string | null },
                { label: '2. Carrinho', val: funilCarrinho, pct: taxaV2C, cor: funilCarrinho === 0 ? C.danger : '#60A5FA', bench: 10, botao: funilCarrinho === 0 ? 'Criar campanha' : null },
                { label: '3. Checkout', val: funilCheckout, pct: taxaC2O, cor: funilCheckout === 0 ? C.danger : C.success, bench: mediaConv, botao: funilCarrinho > 0 && funilCheckout === 0 ? 'Recuperar carrinhos' : null },
              ].map((etapa, i) => (
                <div key={i} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: C.textMid }}>{etapa.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {etapa.botao && (
                        <button onClick={onNavigateCampanhas} style={{ background: 'none', border: 'none', color: C.brand, fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          {Icon.lightning} {etapa.botao}
                        </button>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <strong style={{ color: C.text, fontSize: '13px' }}>{etapa.val}</strong>
                        {etapa.bench !== null && (
                          <span style={{ fontSize: '10px', color: etapa.pct >= etapa.bench ? C.success : C.danger, fontWeight: 600 }}>
                            {etapa.pct.toFixed(1)}%{etapa.pct >= etapa.bench ? ' ↑' : ' ↓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(etapa.pct, 100)}%`, background: etapa.cor, height: '100%', borderRadius: '999px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 12px', background: C.neutralBg, borderRadius: '6px', border: `1px solid ${C.neutralBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                  <span style={{ color: C.textSoft }}>Sua conversão</span>
                  <strong style={{ color: taxaConvApp >= mediaConv ? C.success : C.danger }}>{taxaConvApp}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: C.textSoft }}>Média do mercado</span>
                  <strong style={{ color: C.textSoft }}>{mediaConv}%</strong>
                </div>
                <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: 600, color: taxaConvApp >= mediaConv ? C.success : C.danger }}>
                  {taxaConvApp >= mediaConv
                    ? `${(taxaConvApp - mediaConv).toFixed(1)}pp acima da média`
                    : `${(mediaConv - taxaConvApp).toFixed(1)}pp abaixo da média`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carrinhos Abandonados */}
        <div className="stat-card" style={{ borderLeft: `3px solid ${C.danger}` }}>
          <div className="stat-icon red" style={{ color: C.danger }}>{Icon.cart}</div>
          <div className="stat-info">
            <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px' }}>Carrinhos abandonados</h3>
            <p>{brl(carrinhosValor)}</p>
            <div style={{ fontSize: '12px', color: C.textSoft, marginTop: '4px' }}>
              {temOsData && carrinhoOS > 0 ? (
                <><strong style={{ color: C.danger }}>{carrinhoOS}</strong> com carrinho ativo agora <span style={{ color: C.neutralLight }}>(OneSignal)</span></>
              ) : (
                <>{carrinhosQtd} abandono{carrinhosQtd !== 1 ? 's' : ''} registrado{carrinhosQtd !== 1 ? 's' : ''}</>
              )}
            </div>
            <button onClick={onNavigateCampanhas} style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: C.dark, color: C.white, border: 'none', borderRadius: '5px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
              {Icon.lightning} Recuperar agora
            </button>
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="stat-card">
          <div className="stat-info" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ textTransform: 'none', letterSpacing: 'normal', color: C.textSoft, fontWeight: 500, fontSize: '12px', margin: 0 }}>Taxa de conversão</h3>
              <span style={{ color: C.brand, display: 'flex' }}>{Icon.conversion}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px' }}>
                <span style={{ color: C.textMid }}>App</span>
                <strong style={{ color: taxaConvApp >= mediaConv ? C.success : C.danger }}>{taxaConvApp}%</strong>
              </div>
              <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(taxaConvApp, 100)}%`, background: taxaConvApp >= mediaConv ? C.success : C.danger, height: '100%', borderRadius: '999px' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px' }}>
                <span style={{ color: C.textSoft }}>Mercado</span>
                <strong style={{ color: C.neutralMid }}>{mediaConv}%</strong>
              </div>
              <div style={{ background: C.neutralBorder, borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${mediaConv}%`, background: '#D1D5DB', height: '100%', borderRadius: '999px' }} />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Badge
                color={taxaConvApp >= mediaConv ? C.success : C.danger}
                bg={taxaConvApp >= mediaConv ? C.successBg : C.dangerBg}
                border={taxaConvApp >= mediaConv ? C.successBorder : C.dangerBorder}
              >
                {taxaConvApp >= mediaConv ? Icon.check : Icon.alert}
                {taxaConvApp >= mediaConv ? `${(taxaConvApp - mediaConv).toFixed(1)}pp acima` : `${(mediaConv - taxaConvApp).toFixed(1)}pp abaixo`}
              </Badge>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
