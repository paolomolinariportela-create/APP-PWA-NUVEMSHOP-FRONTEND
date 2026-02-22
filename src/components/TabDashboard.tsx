import React from 'react';

// Interfaces que você já usa
interface DashboardStats {
  receita: number;
  vendas: number;
  instalacoes: number;
  crescimento_instalacoes_7d: number;
  carrinhos_abandonados: { valor: number; qtd: number };
  taxa_conversao: { app: number; site: number };
  visualizacoes: {
    pageviews: number;
    tempo_medio: string;
    top_paginas: string[];
    top_paginas_pwa?: string[];
  };
  funil: { visitas: number; carrinho: number; checkout: number };
  recorrencia: { clientes_2x: number; taxa_recompra: number };
  ticket_medio: { app: number; site: number };
  visitas?: { app: number; site: number; total: number };
  extra_pwa?: {
    visitas_pwa: number;
    visitas_site: number;
    vendas_pwa: number;
    vendas_site: number;
  };
}

interface Props {
  stats: DashboardStats;
}

export default function TabDashboard({ stats }: Props) {
  // meta dinâmica de instalações
  const currentInstalls = stats.instalacoes;
  let metaInstalacoes: number;

  if (currentInstalls < 100) {
    metaInstalacoes = 100;
  } else if (currentInstalls < 500) {
    metaInstalacoes = 500;
  } else if (currentInstalls < 1000) {
    metaInstalacoes = 1000;
  } else {
    metaInstalacoes = Math.ceil(currentInstalls / 1000) * 1000;
  }

  // meta dinâmica de receita
  const receita = stats.receita;
  let metaReceita: number;

  if (receita < 500) {
    metaReceita = 500;
  } else if (receita < 1000) {
    metaReceita = 1000;
  } else if (receita < 5000) {
    metaReceita = 5000;
  } else {
    metaReceita = Math.ceil(receita / 5000) * 5000;
  }

  // meta dinâmica de clientes recorrentes
  const clientesRec = stats.recorrencia.clientes_2x;
  let metaRecorrentes: number;

  if (clientesRec < 10) {
    metaRecorrentes = 10;
  } else if (clientesRec < 50) {
    metaRecorrentes = 50;
  } else if (clientesRec < 100) {
    metaRecorrentes = 100;
  } else {
    metaRecorrentes = Math.ceil(clientesRec / 100) * 100;
  }

  return (
    <section className="stats-grid animate-fade-in">
      {/* RECEITA APP */}
      <div className="stat-card" style={{ borderLeft: '4px solid #10B981' }}>
        <div className="stat-icon green">💰</div>
        <div className="stat-info">
          <h3>Receita App</h3>
          <p>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(stats.receita)}
          </p>
          <span className="stat-growth">
            🔥 {stats.vendas} pedidos realizados
          </span>

          <div
            style={{
              marginTop: '6px',
              fontSize: '11px',
              color: '#555',
            }}
          >
            🎯 Próxima meta:{' '}
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(metaReceita)}
          </div>
        </div>
      </div>

      {/* TICKET MÉDIO APP x SITE */}
      <div className="stat-card">
        <div
          className="stat-icon"
          style={{ background: '#F0F9FF', color: '#0369A1' }}
        >
          💳
        </div>
        <div className="stat-info">
          <h3>Ticket Médio</h3>

          {/* APP – informação principal, com número grande */}
          <div className="ticket-main-row">
            <span className="ticket-main-label">APP</span>
            <span className="ticket-main-value">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(stats.ticket_medio.app)}
            </span>
          </div>

          {/* Site – secundário, menor mas legível */}
          <div className="ticket-row">
            <span className="ticket-label">Site</span>
            <span className="ticket-value">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(stats.ticket_medio.site)}
            </span>
          </div>

          {/* Texto de meta / contexto, se quiser usar */}
          {/* <p className="next-goal-text">
            Próxima meta: <strong>10 clientes</strong> com ticket acima de R$ 300
          </p> */}
        </div>
      </div>

      {/* Instalações + Meta */}
      <div className="stat-card">
        <div className="stat-icon purple">📱</div>
        <div className="stat-info">
          <h3>Instalações Ativas</h3>
          <p>{stats.instalacoes}</p>
          <span className="stat-growth">Base de clientes fiéis</span>

          {stats.extra_pwa && (
            <div
              style={{
                marginTop: '4px',
                fontSize: '11px',
                color: '#555',
              }}
            >
              App: <strong>{stats.extra_pwa.visitas_pwa}</strong> visitas •{' '}
              Site: <strong>{stats.extra_pwa.visitas_site}</strong> visitas
            </div>
          )}

          <div
            style={{
              marginTop: '6px',
              fontSize: '11px',
              color: '#555',
            }}
          >
            🎯 Meta de Instalações: {stats.instalacoes} / {metaInstalacoes}
          </div>
        </div>
      </div>

      {/* Crescimento do App */}
      <div className="stat-card">
        <div
          className="stat-icon"
          style={{ background: '#ECFEFF', color: '#0891B2' }}
        >
          📈
        </div>
        <div className="stat-info">
          <h3>Crescimento do App</h3>
          <p>+{stats.crescimento_instalacoes_7d}%</p>
          <span className="stat-growth">vs últimos 7 dias</span>
        </div>
      </div>

      {/* Clientes recorrentes + meta */}
      <div className="stat-card">
        <div className="stat-icon blue">🔁</div>
        <div className="stat-info">
          <h3>Clientes Recorrentes</h3>
          <p>{stats.recorrencia.clientes_2x}</p>
          <div
            style={{
              fontSize: '11px',
              color: '#666',
              marginTop: '4px',
            }}
          >
            Taxa de Recompra:{' '}
            <strong>{stats.recorrencia.taxa_recompra}%</strong>
          </div>
          <div
            style={{
              marginTop: '6px',
              fontSize: '11px',
              color: '#555',
            }}
          >
            🎯 Próxima meta: {metaRecorrentes} clientes
          </div>
        </div>
      </div>

      {/* Páginas visualizadas */}
      <div className="stat-card">
        <div
          className="stat-icon"
          style={{ background: '#FFF7ED', color: '#C2410C' }}
        >
          👀
        </div>
        <div className="stat-info">
          <h3>Páginas Visualizadas</h3>
          <p>{stats.visualizacoes.pageviews.toLocaleString()}</p>
          <div
            style={{
              marginTop: '8px',
              fontSize: '11px',
              color: '#555',
            }}
          >
            ⏱️ Tempo médio:{' '}
            <strong>{stats.visualizacoes.tempo_medio}</strong>
          </div>
        </div>
      </div>

      {/* Top páginas do App (PWA) */}
      {stats.visualizacoes.top_paginas_pwa &&
        stats.visualizacoes.top_paginas_pwa.length > 0 && (
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ background: '#EEF2FF', color: '#4F46E5' }}
            >
              📌
            </div>
            <div className="stat-info">
              <h3>Top páginas do App</h3>
              <ul
                style={{
                  marginTop: '8px',
                  paddingLeft: 0,
                  listStyle: 'none',
                  fontSize: '11px',
                  color: '#374151',
                }}
              >
                {stats.visualizacoes.top_paginas_pwa
                  .filter((pagina) => pagina !== 'install')
                  .slice(0, 5)
                  .map((pagina, idx) => {
                    let label = pagina || '/';
                    let badge: string | null = null;

                    if (label === '/') {
                      label = 'Página inicial';
                      badge = 'HOME';
                    }

                    const display =
                      label.length > 50 ? label.slice(0, 47) + '...' : label;

                    return (
                      <li
                        key={pagina + idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 16,
                              height: 16,
                              borderRadius: '999px',
                              background: '#E5E7EB',
                              fontSize: '10px',
                              color: '#374151',
                              flexShrink: 0,
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span
                            title={label}
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {display}
                          </span>
                        </div>
                        {badge && (
                          <span
                            style={{
                              marginLeft: '6px',
                              fontSize: '9px',
                              padding: '2px 6px',
                              borderRadius: '999px',
                              background: '#E0F2FE',
                              color: '#0369A1',
                              flexShrink: 0,
                            }}
                          >
                            {badge}
                          </span>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        )}

      {/* Funil de vendas */}
      <div className="stat-card" style={{ gridRow: 'span 2' }}>
        <div className="stat-info" style={{ width: '100%' }}>
          <h3>Funil de Vendas 📉</h3>
          <div style={{ marginTop: '15px' }}>
            <div className="conversion-bar">
              <div className="bar-label">
                <span>1. Visitas Únicas</span>{' '}
                <strong>{stats.funil.visitas}</strong>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: '100%', background: '#9CA3AF' }}
                ></div>
              </div>
            </div>

            <div className="conversion-bar">
              <div className="bar-label">
                <span>2. Carrinho</span>{' '}
                <strong>{stats.funil.carrinho}</strong>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${
                      (stats.funil.carrinho /
                        Math.max(stats.funil.visitas, 1)) *
                      100
                    }%`,
                    background: '#60A5FA',
                  }}
                ></div>
              </div>
            </div>

            <div className="conversion-bar">
              <div className="bar-label">
                <span>3. Checkout</span>{' '}
                <strong>{stats.funil.checkout}</strong>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${
                      (stats.funil.checkout /
                        Math.max(stats.funil.visitas, 1)) *
                      100
                    }%`,
                    background: '#10B981',
                  }}
                ></div>
              </div>
            </div>

            <small
              style={{
                display: 'block',
                marginTop: '10px',
                color: '#666',
                fontSize: '10px',
              }}
            >
              {stats.taxa_conversao.app}% de conversão global do APP
            </small>
          </div>
        </div>
      </div>

      {/* Carrinhos abandonados */}
      <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
        <div className="stat-icon red">💸</div>
        <div className="stat-info">
          <h3>Carrinhos Abandonados</h3>
          <p>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(stats.carrinhos_abandonados.valor)}
          </p>

          <div
            style={{
              marginTop: '4px',
              fontSize: '11px',
              color: '#555',
            }}
          >
            {stats.carrinhos_abandonados.qtd} carrinho
            {stats.carrinhos_abandonados.qtd === 1 ? '' : 's'} abandonado
            {stats.carrinhos_abandonados.qtd === 1 ? '' : 's'}
          </div>

          <button
            style={{
              marginTop: '8px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🔔 RECUPERAR AGORA
          </button>
        </div>
      </div>

      {/* Taxa de conversão APP x SITE */}
      <div className="stat-card">
        <div className="stat-info" style={{ width: '100%' }}>
          <h3>Taxa de Conversão 🏆</h3>

          {/* APP */}
          <div className="conversion-bar" style={{ marginBottom: '6px' }}>
            <div className="bar-label">
              <span>APP</span>{' '}
              <strong>{stats.taxa_conversao.app}%</strong>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${Math.min(stats.taxa_conversao.app, 100)}%`,
                  background: '#10B981',
                }}
              ></div>
            </div>
          </div>

          {/* SITE */}
          <div className="conversion-bar">
            <div className="bar-label">
              <span>Site</span>{' '}
              <strong>{stats.taxa_conversao.site}%</strong>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${Math.min(stats.taxa_conversao.site, 100)}%`,
                  background: '#3B82F6',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
