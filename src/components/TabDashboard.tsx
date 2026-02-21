import React from 'react';

// Interfaces que você já usa
interface DashboardStats {
  receita: number;
  vendas: number;
  instalacoes: number;
  crescimento_instalacoes_7d: number;
  carrinhos_abandonados: { valor: number; qtd: number };
  taxa_conversao: { app: number; site: number };
  visualizacoes: { pageviews: number; tempo_medio: string; top_paginas: string[] };
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

  return (
    <section className="stats-grid animate-fade-in">
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
          <span className="stat-growth">🔥 {stats.vendas} pedidos realizados</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#F0F9FF', color: '#0369A1' }}>
          💳
        </div>
        <div className="stat-info">
          <h3>Ticket Médio</h3>
          <div style={{ marginTop: '10px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px',
              }}
            >
              <span style={{ color: '#10B981', fontWeight: 'bold' }}>
                APP{' '}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(stats.ticket_medio.app)}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  background: '#DCFCE7',
                  color: '#15803D',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                +30%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instalações + Meta */}
      <div className="stat-card">
        <div className="stat-icon purple">📱</div>
        <div className="stat-info">
          <h3>Instalações Ativas</h3>
          <p>{stats.instalacoes}</p>
          <span className="stat-growth">Base de clientes fiéis</span>

          {/* NOVO: visitas App x Site usando extra_pwa, sem quebrar nada */}
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
        <div className="stat-icon" style={{ background: '#ECFEFF', color: '#0891B2' }}>
          📈
        </div>
        <div className="stat-info">
          <h3>Crescimento do App</h3>
          <p>+{stats.crescimento_instalacoes_7d}%</p>
          <span className="stat-growth">vs últimos 7 dias</span>
        </div>
      </div>

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
            Taxa de Recompra: <strong>{stats.recorrencia.taxa_recompra}%</strong>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#FFF7ED', color: '#C2410C' }}>
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
            ⏱️ Tempo médio: <strong>{stats.visualizacoes.tempo_medio}</strong>
          </div>
        </div>
      </div>

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
                    width: `${(stats.funil.carrinho / Math.max(stats.funil.visitas, 1)) * 100}%`,
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
                    width: `${(stats.funil.checkout / Math.max(stats.funil.visitas, 1)) * 100}%`,
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
          <button
            style={{
              marginTop: '5px',
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

      <div className="stat-card">
        <div className="stat-info" style={{ width: '100%' }}>
          <h3>Taxa de Conversão 🏆</h3>
          <div className="conversion-bar">
            <div className="bar-label">
              <span>APP</span>{' '}
              <strong>{stats.taxa_conversao.app}%</strong>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${Math.min(stats.taxa_conversao.app * 20, 100)}%`,
                  background: '#10B981',
                }}
              ></div>
            </div>
          </div>
          {/* se quiser depois, pode adicionar uma barrinha para o site usando stats.taxa_conversao.site */}
        </div>
      </div>
    </section>
  );
}
