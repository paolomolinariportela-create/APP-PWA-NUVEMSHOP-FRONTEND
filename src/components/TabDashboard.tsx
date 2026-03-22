import React from "react";

interface DashboardStats {
  receita: number;
  vendas: number;
  instalacoes: number;
  instalacoes_banco?: number;
  crescimento_instalacoes_7d: number;
  carrinhos_abandonados: {
    valor: number;
    qtd: number;
    ativos_automacao?: number;
    ativos_onesignal?: number;
  };
  taxa_conversao: { app: number; site: number };
  visualizacoes: {
    pageviews: number;
    tempo_medio: string;
    top_paginas: string[];
    top_paginas_pwa?: string[];
  };
  funil: { visitas: number; carrinho: number; checkout: number };
  recorrencia: {
    clientes_2x: number;
    taxa_recompra: number;
    compradores_onesignal?: number;
  };
  ticket_medio: { app: number; site: number };
  visitas?: { app: number; site: number; total: number };
  extra_pwa?: {
    visitas_pwa: number;
    visitas_site: number;
    vendas_pwa: number;
    vendas_site: number;
  };
  onesignal?: {
    active_subscribers: number;
    carrinho_ativo_count: number;
    compradores_count: number;
  };
}

interface Props {
  stats: DashboardStats;
  onNavigateCampanhas?: () => void;
}

export default function TabDashboard({ stats, onNavigateCampanhas }: Props) {
  const receita = stats?.receita ?? 0;
  const vendas = stats?.vendas ?? 0;
  const crescimento7d = stats?.crescimento_instalacoes_7d ?? 0;
  const carrinhosValor = stats?.carrinhos_abandonados?.valor ?? 0;
  const carrinhosQtd = stats?.carrinhos_abandonados?.qtd ?? 0;
  const ticketApp = stats?.ticket_medio?.app ?? 0;
  const taxaConvApp = stats?.taxa_conversao?.app ?? 0;
  const clientesRec = stats?.recorrencia?.clientes_2x ?? 0;
  const taxaRecompra = stats?.recorrencia?.taxa_recompra ?? 0;
  const pageviews = stats?.visualizacoes?.pageviews ?? 0;
  const tempoMedio = stats?.visualizacoes?.tempo_medio ?? "--";
  const topPaginasPwa = stats?.visualizacoes?.top_paginas_pwa ?? [];
  const funilVisitas = stats?.funil?.visitas ?? 0;
  const funilCarrinho = stats?.funil?.carrinho ?? 0;
  const funilCheckout = stats?.funil?.checkout ?? 0;

  const osData = stats?.onesignal;
  const instalacoes = osData?.active_subscribers || stats?.instalacoes || 0;
  const carrinhoAtivoOS = osData?.carrinho_ativo_count ?? 0;
  const compradoresOS = osData?.compradores_count ?? 0;
  const temOsData = !!osData && osData.active_subscribers > 0;

  const brl = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  // Metas dinâmicas
  const metaInstalacoes = instalacoes < 100 ? 100 : instalacoes < 500 ? 500 : instalacoes < 1000 ? 1000 : Math.ceil(instalacoes / 1000) * 1000;
  const metaReceita = receita < 500 ? 500 : receita < 1000 ? 1000 : receita < 5000 ? 5000 : Math.ceil(receita / 5000) * 5000;
  const metaRecorrentes = clientesRec < 10 ? 10 : clientesRec < 50 ? 50 : clientesRec < 100 ? 100 : Math.ceil(clientesRec / 100) * 100;

  // ── DIAGNÓSTICO AUTOMÁTICO ──────────────────────────────────────────
  // Detecta o maior gargalo do funil e gera ação direta
  const taxaVisitaCarrinho = funilVisitas > 0 ? (funilCarrinho / funilVisitas) * 100 : 0;
  const taxaCarrinhoCheckout = funilCarrinho > 0 ? (funilCheckout / funilCarrinho) * 100 : 0;
  const mediaConversaoMercado = 1.5; // % médio e-commerce Brasil

  type Severidade = 'critico' | 'alerta' | 'ok';
  interface Diagnostico {
    severidade: Severidade;
    titulo: string;
    descricao: string;
    acao: string;
    campanha_titulo?: string;
    campanha_msg?: string;
  }

  const getDiagnostico = (): Diagnostico => {
    // Sem dados ainda
    if (funilVisitas === 0) {
      return {
        severidade: 'alerta',
        titulo: 'Aguardando primeiras visitas',
        descricao: 'O app ainda não registrou visitantes. Compartilhe o link de instalação com seus clientes.',
        acao: 'Criar campanha de boas-vindas',
        campanha_titulo: 'Instale nosso app e ganhe 10% OFF!',
        campanha_msg: 'Baixe o app e use o cupom BEMVINDO10 na sua primeira compra.',
      };
    }
    // Tem visitas mas ninguém vai ao carrinho
    if (funilVisitas > 0 && funilCarrinho === 0) {
      return {
        severidade: 'critico',
        titulo: 'Usuários visitam mas não adicionam ao carrinho',
        descricao: 'Você tem visitas mas nenhuma conversão para carrinho. O problema pode ser preço, confiança ou oferta pouco atraente.',
        acao: 'Criar campanha com cupom de produto',
        campanha_titulo: 'Oferta especial só para você!',
        campanha_msg: 'Escolha seu produto favorito e use o cupom PROMO10 para 10% de desconto.',
      };
    }
    // Tem carrinho mas não finaliza
    if (funilCarrinho > 0 && funilCheckout === 0) {
      return {
        severidade: 'critico',
        titulo: 'Clientes chegam ao carrinho mas não finalizam',
        descricao: 'Seu maior gargalo é no checkout. Pode ser frete, forma de pagamento ou insegurança na compra.',
        acao: 'Criar campanha de recuperação de carrinho',
        campanha_titulo: 'Seus itens estão te esperando!',
        campanha_msg: 'Finalize sua compra agora com frete grátis. Oferta por tempo limitado!',
      };
    }
    // Conversão abaixo da média do mercado
    if (taxaConvApp < mediaConversaoMercado && funilVisitas > 10) {
      return {
        severidade: 'alerta',
        titulo: `Conversão ${taxaConvApp}% — abaixo da média do mercado (${mediaConversaoMercado}%)`,
        descricao: 'Sua taxa está abaixo da média. Uma campanha com urgência ou cupom pode acelerar as vendas.',
        acao: 'Criar campanha de urgência',
        campanha_titulo: 'Só hoje: frete grátis + 5% OFF!',
        campanha_msg: 'Aproveite essa oferta relâmpago. Válida apenas hoje!',
      };
    }
    // Carrinhos abandonados com valor alto
    if (carrinhosValor > 0 && receita === 0) {
      return {
        severidade: 'alerta',
        titulo: `${brl(carrinhosValor)} em carrinhos abandonados sem nenhuma venda`,
        descricao: 'Você tem dinheiro parado em carrinhos. Ative a automação de recuperação para recuperar essas vendas.',
        acao: 'Recuperar carrinhos agora',
        campanha_titulo: 'Seus itens ainda estão no carrinho!',
        campanha_msg: 'Complete sua compra e ganhe frete grátis. Estoque limitado!',
      };
    }
    // Tudo ok
    return {
      severidade: 'ok',
      titulo: 'Loja performando bem!',
      descricao: `Conversão em ${taxaConvApp}% — acima da média do mercado. Continue enviando campanhas para manter o ritmo.`,
      acao: 'Criar nova campanha',
      campanha_titulo: 'Novidades chegando!',
      campanha_msg: 'Confira as novidades da loja. Aproveite as ofertas exclusivas do app!',
    };
  };

  const diagnostico = getDiagnostico();

  // ── PROJEÇÃO DE GANHO ───────────────────────────────────────────────
  // "Se converter X% → R$ estimado"
  const projecoes = ticketApp > 0 && funilVisitas > 0 ? [
    { pct: 1, valor: Math.round(funilVisitas * 0.01 * ticketApp) },
    { pct: 3, valor: Math.round(funilVisitas * 0.03 * ticketApp) },
    { pct: 5, valor: Math.round(funilVisitas * 0.05 * ticketApp) },
  ] : [];

  const corSeveridade = {
    critico: { bg: '#FEF2F2', border: '#FECACA', titulo: '#991B1B', badge: '#DC2626', badgeBg: '#FEE2E2' },
    alerta:  { bg: '#FFFBEB', border: '#FDE68A', titulo: '#92400E', badge: '#D97706', badgeBg: '#FEF3C7' },
    ok:      { bg: '#F0FDF4', border: '#BBF7D0', titulo: '#166534', badge: '#16A34A', badgeBg: '#DCFCE7' },
  }[diagnostico.severidade];

  const iconesDiagnostico = { critico: '🚨', alerta: '⚠️', ok: '✅' };

  return (
    <section className="animate-fade-in">

      {/* ══════════════════════════════════════════════════════════════
          BLOCO DE DIAGNÓSTICO + AÇÃO — SEMPRE NO TOPO
      ══════════════════════════════════════════════════════════════ */}
      <div style={{
        background: corSeveridade.bg,
        border: `2px solid ${corSeveridade.border}`,
        borderRadius: '14px',
        padding: '20px 24px',
        marginBottom: '24px',
      }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '22px' }}>{iconesDiagnostico[diagnostico.severidade]}</span>
              <span style={{
                background: corSeveridade.badgeBg,
                color: corSeveridade.badge,
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {diagnostico.severidade === 'critico' ? 'Ação urgente' : diagnostico.severidade === 'alerta' ? 'Atenção' : 'Tudo certo'}
              </span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: corSeveridade.titulo, marginBottom: '6px' }}>
              {diagnostico.titulo}
            </div>
            <div style={{ fontSize: '13px', color: corSeveridade.titulo, opacity: 0.85, lineHeight: 1.5 }}>
              {diagnostico.descricao}
            </div>
          </div>
          <button
            onClick={onNavigateCampanhas}
            style={{
              background: corSeveridade.badge,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            🚀 {diagnostico.acao}
          </button>
        </div>

        {/* Funil rápido de diagnóstico */}
        {funilVisitas > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'Visitas', val: funilVisitas, pct: 100, cor: '#6B7280' },
              { label: 'Carrinho', val: funilCarrinho, pct: taxaVisitaCarrinho, cor: funilCarrinho === 0 ? '#DC2626' : '#3B82F6' },
              { label: 'Checkout', val: funilCheckout, pct: taxaCarrinhoCheckout, cor: funilCheckout === 0 ? '#DC2626' : '#10B981' },
            ].map((etapa, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {i > 0 && <span style={{ color: '#9CA3AF', fontSize: '16px' }}>→</span>}
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  border: `1px solid ${etapa.cor}40`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontWeight: 700, color: etapa.cor }}>{etapa.val}</div>
                  <div style={{ color: '#6B7280', fontSize: '10px' }}>{etapa.label}</div>
                  {i > 0 && <div style={{ color: etapa.cor, fontSize: '10px', fontWeight: 600 }}>{etapa.pct.toFixed(1)}%</div>}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#9CA3AF', fontSize: '16px' }}>→</span>
              <div style={{ background: 'white', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: '#6B7280' }}>Mercado</div>
                <div style={{ color: '#6B7280', fontSize: '10px' }}>Benchmark</div>
                <div style={{ color: '#6B7280', fontSize: '10px', fontWeight: 600 }}>1–3%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          PROJEÇÃO DE GANHO — só aparece quando tem dados suficientes
      ══════════════════════════════════════════════════════════════ */}
      {projecoes.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          borderRadius: '14px',
          padding: '20px 24px',
          marginBottom: '24px',
          color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>💸</span>
            <span style={{ fontSize: '15px', fontWeight: 700 }}>Projeção de Ganho</span>
            <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '4px' }}>
              baseado em {funilVisitas} visitas × {brl(ticketApp)} ticket médio
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '16px' }}>
            Se você converter esse tráfego, quanto pode faturar:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {projecoes.map((p, i) => (
              <div key={i} style={{
                background: i === 1 ? '#4F46E5' : 'rgba(255,255,255,0.07)',
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'center',
                border: i === 1 ? '2px solid #818CF8' : '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
              }}>
                {i === 1 && (
                  <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#F59E0B', color: '#111', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                    META REALISTA
                  </div>
                )}
                <div style={{ fontSize: '11px', color: i === 1 ? '#C7D2FE' : '#9CA3AF', marginBottom: '4px' }}>
                  Convertendo {p.pct}%
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: i === 1 ? '#fff' : '#E5E7EB' }}>
                  {brl(p.valor)}
                </div>
                <div style={{ fontSize: '10px', color: i === 1 ? '#A5B4FC' : '#6B7280', marginTop: '4px' }}>
                  {Math.round(funilVisitas * p.pct / 100)} vendas estimadas
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onNavigateCampanhas}
            style={{ marginTop: '16px', width: '100%', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
          >
            🎯 Criar campanha para atingir essa meta
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CARDS DE MÉTRICAS — igual ao original
      ══════════════════════════════════════════════════════════════ */}
      <div className="stats-grid" style={{ marginBottom: '0' }}>

        {/* RECEITA APP */}
        <div className="stat-card" style={{ borderLeft: "4px solid #10B981" }}>
          <div className="stat-icon green">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v8h16V8H4zm8 7a3 3 0 0 1-3-3h2a1 1 0 1 0 1-1 3 3 0 1 1 3-3h-2a1 1 0 1 0-1 1 3 3 0 0 1 0 6z" /></svg>
          </div>
          <div className="stat-info">
            <h3>Receita App</h3>
            <p>{brl(receita)}</p>
            <span className="stat-growth">🔥 {vendas} pedidos realizados</span>
            <div className="card-meta-text">🎯 Próxima meta: {brl(metaReceita)}</div>
          </div>
        </div>

        {/* TICKET MÉDIO */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16a2 2 0 0 1 2 2v3h-2a2 2 0 1 0 0 4h2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3h2a2 2 0 1 0 0-4H2V7a2 2 0 0 1 2-2zm0 2v2h2a4 4 0 0 1 0 8H4v2h16v-2h-2a4 4 0 0 1 0-8h2V7H4z" /></svg>
          </div>
          <div className="stat-info">
            <h3>Ticket Médio</h3>
            <div className="ticket-main-row">
              <span className="ticket-main-label" style={{ color: "#10B981", fontWeight: "bold" }}>APP</span>
              <span className="ticket-main-value">{brl(ticketApp)}</span>
            </div>
          </div>
        </div>

        {/* INSTALAÇÕES ATIVAS */}
        <div className="stat-card">
          <div className="stat-icon purple">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v14h10V4H7zm5 15a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 12 19z" /></svg>
          </div>
          <div className="stat-info">
            <h3>Instalações Ativas</h3>
            <p>{instalacoes}</p>
            <span className="stat-growth">{temOsData ? '🔔 Com notificações ativas' : 'Base de clientes fiéis'}</span>
            {temOsData && <div style={{ marginTop: '4px', fontSize: '11px', color: '#6B7280' }}>via OneSignal — tempo real</div>}
            <div className="card-meta-text">🎯 Meta: {instalacoes} / {metaInstalacoes}</div>
          </div>
        </div>

        {/* CRESCIMENTO */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 17v2h18v-2H3zm0-4 4-4 4 4 6-6 4 4v-3.5L17 4l-6 6-4-4-4 4V13z" /></svg>
          </div>
          <div className="stat-info">
            <h3>Crescimento do App</h3>
            <p>+{crescimento7d}%</p>
            <span className="stat-growth">vs últimos 7 dias</span>
          </div>
        </div>

        {/* CLIENTES CONVERTIDOS */}
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 7h11V4l4 4-4 4V9H8a3 3 0 0 0 0 6h3v2H8a5 5 0 0 1 0-10zm10 10H6v3l-4-4 4-4v3h11a3 3 0 0 0 0-6h-3V7h3a5 5 0 0 1 0 10z" /></svg>
          </div>
          <div className="stat-info">
            <h3>Clientes Convertidos</h3>
            <p>{temOsData && compradoresOS > 0 ? compradoresOS : clientesRec}</p>
            {temOsData && compradoresOS > 0 ? (
              <>
                <div style={{ fontSize: '0.95rem', color: '#111827', marginTop: '6px', fontWeight: 500 }}>
                  Dos <strong>{instalacoes}</strong> usuários,{' '}
                  <strong style={{ color: '#10B981' }}>
                    {instalacoes > 0 ? Math.round((compradoresOS / instalacoes) * 100) : 0}%
                  </strong> já compraram
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>via OneSignal (tag fez_compra)</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '0.95rem', color: '#111827', marginTop: '6px', fontWeight: 500 }}>
                  Taxa de Recompra: <strong>{taxaRecompra}%</strong>
                </div>
                <div className="card-meta-text">🎯 Próxima meta: {metaRecorrentes} clientes</div>
              </>
            )}
          </div>
        </div>

        {/* PÁGINAS VISUALIZADAS */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 5C7 5 3.73 8.11 2 12c1.73 3.89 5 7 10 7s8.27-3.11 10-7c-1.73-3.89-5-7-10-7zm0 2c3.04 0 5.64 1.96 7.19 5-1.55 3.04-4.15 5-7.19 5S6.36 15.04 4.81 12C6.36 8.96 8.96 7 12 7zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></svg>
          </div>
          <div className="stat-info">
            <h3>Páginas Visualizadas</h3>
            <p>{pageviews.toLocaleString()}</p>
            <div style={{ marginTop: '10px', fontSize: '0.95rem', color: '#111827', fontWeight: 500 }}>
              ⏱️ Tempo médio: <strong>{tempoMedio}</strong>
            </div>
          </div>
        </div>

        {/* TOP PÁGINAS */}
        {topPaginasPwa.length > 0 && (
          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 3 8 11l3 3-5 5 1.5 1.5 5-5 3 3 8-8z" /></svg>
            </div>
            <div className="stat-info">
              <h3>Top páginas do App</h3>
              <ul style={{ marginTop: '8px', paddingLeft: 0, listStyle: 'none', fontSize: '11px', color: '#374151' }}>
                {topPaginasPwa.filter(p => p !== 'install').slice(0, 5).map((pagina, idx) => {
                  let label = pagina || '/';
                  let badge: string | null = null;
                  if (label === '/') { label = 'Página inicial'; badge = 'HOME'; }
                  const display = label.length > 50 ? label.slice(0, 47) + '...' : label;
                  return (
                    <li key={pagina + idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '999px', background: '#E5E7EB', fontSize: '10px', color: '#374151', flexShrink: 0 }}>{idx + 1}</span>
                        <span title={label} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{display}</span>
                      </div>
                      {badge && <span style={{ marginLeft: '6px', fontSize: '9px', padding: '2px 6px', borderRadius: '999px', background: '#E0F2FE', color: '#0369A1', flexShrink: 0 }}>{badge}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* FUNIL DE VENDAS — com botões de ação e comparativo */}
        <div className="stat-card" style={{ gridRow: 'span 2' }}>
          <div className="stat-info" style={{ width: '100%' }}>
            <h3>Funil de Vendas 📉</h3>
            <div style={{ marginTop: '15px' }}>
              {[
                { label: '1. Visitas Únicas', val: funilVisitas, pct: 100, cor: '#9CA3AF', benchPct: null, botao: null },
                {
                  label: '2. Carrinho', val: funilCarrinho,
                  pct: funilVisitas > 0 ? (funilCarrinho / funilVisitas) * 100 : 0,
                  cor: funilCarrinho === 0 ? '#EF4444' : '#60A5FA',
                  benchPct: 10, // benchmark visita→carrinho ~10%
                  botao: funilCarrinho === 0 ? 'Criar campanha de produto' : null,
                },
                {
                  label: '3. Checkout', val: funilCheckout,
                  pct: funilVisitas > 0 ? (funilCheckout / funilVisitas) * 100 : 0,
                  cor: funilCheckout === 0 ? '#EF4444' : '#10B981',
                  benchPct: 3, // benchmark geral ~1–3%
                  botao: funilCarrinho > 0 && funilCheckout === 0 ? 'Recuperar carrinhos' : null,
                },
              ].map((etapa, i) => (
                <div key={i} className="conversion-bar" style={{ marginBottom: etapa.botao ? '4px' : '12px' }}>
                  <div className="bar-label">
                    <span>{etapa.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong>{etapa.val}</strong>
                      {etapa.benchPct !== null && (
                        <span style={{ fontSize: '10px', color: etapa.pct >= etapa.benchPct ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                          {etapa.pct.toFixed(1)}% {etapa.pct >= etapa.benchPct ? '✓' : '↓'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Math.min(etapa.pct, 100)}%`, background: etapa.cor }} />
                  </div>
                  {etapa.botao && (
                    <button
                      onClick={onNavigateCampanhas}
                      style={{ marginTop: '4px', marginBottom: '8px', background: 'none', border: `1px solid ${etapa.cor}`, color: etapa.cor, borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      🚀 {etapa.botao}
                    </button>
                  )}
                </div>
              ))}
              <div style={{ marginTop: '8px', padding: '8px 10px', background: '#F9FAFB', borderRadius: '8px', fontSize: '11px', color: '#6B7280' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>Sua conversão:</span>
                  <strong style={{ color: taxaConvApp >= mediaConversaoMercado ? '#10B981' : '#EF4444' }}>{taxaConvApp}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Média do mercado:</span>
                  <strong style={{ color: '#6B7280' }}>{mediaConversaoMercado}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARRINHOS ABANDONADOS */}
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-icon red">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 2a2 2 0 1 0-4.001.001A2 2 0 0 0 17 20zM6.2 4l-.4-2H2v2h2l3.6 7.59-1.35 2.44A1 1 0 0 0 7.1 15H19v-2H8.42l.93-1.68L18.55 11a1 1 0 0 0 .92-.63L22 3h-2.09l-2.13 5H8.53L6.2 4z" /></svg>
          </div>
          <div className="stat-info">
            <h3>Carrinhos Abandonados</h3>
            <p>{brl(carrinhosValor)}</p>
            <div style={{ marginTop: '4px', fontSize: '11px', color: '#555' }}>
              {temOsData && carrinhoAtivoOS > 0 ? (
                <>
                  <span style={{ fontWeight: 700, color: '#dc2626', fontSize: '13px' }}>{carrinhoAtivoOS}</span>
                  {' '}com carrinho ativo agora
                  <span style={{ marginLeft: '6px', fontSize: '10px', color: '#9CA3AF' }}>(OneSignal)</span>
                </>
              ) : (
                <>{carrinhosQtd} carrinho{carrinhosQtd === 1 ? '' : 's'} abandonado{carrinhosQtd === 1 ? '' : 's'}</>
              )}
            </div>
            <button
              onClick={onNavigateCampanhas}
              style={{ marginTop: '8px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🔔 RECUPERAR AGORA
            </button>
          </div>
        </div>

        {/* TAXA DE CONVERSÃO com comparativo */}
        <div className="stat-card">
          <div className="stat-info" style={{ width: '100%' }}>
            <h3>Taxa de Conversão 🏆</h3>
            <div className="conversion-bar" style={{ marginBottom: '6px' }}>
              <div className="bar-label">
                <span>APP</span>
                <strong style={{ color: taxaConvApp >= mediaConversaoMercado ? '#10B981' : '#EF4444' }}>{taxaConvApp}%</strong>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${Math.min(taxaConvApp, 100)}%`, background: taxaConvApp >= mediaConversaoMercado ? '#10B981' : '#EF4444' }} />
              </div>
            </div>
            <div className="conversion-bar" style={{ marginBottom: '0' }}>
              <div className="bar-label">
                <span style={{ color: '#9CA3AF' }}>Mercado</span>
                <strong style={{ color: '#9CA3AF' }}>{mediaConversaoMercado}%</strong>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${mediaConversaoMercado}%`, background: '#D1D5DB' }} />
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: taxaConvApp >= mediaConversaoMercado ? '#10B981' : '#EF4444', fontWeight: 600 }}>
              {taxaConvApp >= mediaConversaoMercado
                ? `✅ ${(taxaConvApp - mediaConversaoMercado).toFixed(1)}pp acima da média`
                : `⚠️ ${(mediaConversaoMercado - taxaConvApp).toFixed(1)}pp abaixo da média`}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
