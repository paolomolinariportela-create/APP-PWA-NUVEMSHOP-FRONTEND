import React from "react";

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
      <div className="stat-card" style={{ borderLeft: "4px solid #10B981" }}>
        <div className="stat-icon green">
          {/* ícone dinheiro */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v8h16V8H4zm8 7a3 3 0 0 1-3-3h2a1 1 0 1 0 1-1 3 3 0 1 1 3-3h-2a1 1 0 1 0-1 1 3 3 0 0 1 0 6z"
            />
          </svg>
        </div>
        <div className="stat-info">
          <h3>Receita App</h3>
          <p>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(stats.receita)}
          </p>
          <span className="stat-growth">
            🔥 {stats.vendas} pedidos realizados
          </span>

          <div className="card-meta-text">
            🎯 Próxima meta:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(metaReceita)}
          </div>
        </div>
      </div>

      {/* TICKET MÉDIO – apenas APP */}
      <div className="stat-card">
        <div className="stat-icon">
          {/* cartão / ticket */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 5h16a2 2 0 0 1 2 2v3h-2a2 2 0 1 0 0 4h2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3h2a2 2 0 1 0 0-4H2V7a2 2 0 0 1 2-2zm0 2v2h2a4 4 0 0 1 0 8H4v2h16v-2h-2a4 4 0 0 1 0-8h2V7H4z"
            />
          </svg>
        </div>
        <div className="stat-info">
          <h3>Ticket Médio</h3>

          <div className="ticket-main-row">
            <span
              className="ticket-main-label"
              style={{ color: "#10B981", fontWeight: "bold" }}
            >
              APP
            </span>
            <span className="ticket-main-value">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats.ticket_medio.app)}
            </span>
          </div>
        </div>
      </div>

      {/* Instalações + Meta (sem detalhar visitas app/site) */}
      <div className="stat-card">
        <div className="stat-icon purple">
          {/* smartphone */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v14h10V4H7zm5 15a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 12 19z"
            />
          </svg>
        </div>
        <div className="stat-info">
          <h3>Instalações Ativas</h3>
          <p>{stats.instalacoes}</p>
          <span className="stat-growth">Base de clientes fiéis</span>

          <div className="card-meta-text">
            🎯 Meta de Instalações: {stats.instalacoes} / {metaInstalacoes}
          </div>
        </div>
      </div>

      {/* Crescimento do App */}
      <div className="stat-card">
        <div className="stat-icon">
          {/* gráfico de linha */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 17v2h18v-2H3zm0-4 4-4 4 4 6-6 4 4v-3.5L17 4l-6 6-4-4-4 4V13z"
            />
          </svg>
        </div>
        <div className="stat-info">
          <h3>Crescimento do App</h3>
          <p>+{stats.crescimento_instalacoes_7d}%</p>
          <span className="stat-growth">vs últimos 7 dias</span>
        </div>
      </div>

      {/* Clientes recorrentes + meta */}
      <div className="stat-card">
        <div className="stat-icon blue">
          {/* loop / recorrência */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M7 7h11V4l4 4-4 4V9H8a3 3 0 0 0 0 6h3v2H8a5 5 0 0 1 0-10zm10 10H6v3l-4-4 4-4v3h11a3 3 0 0 0 0-6h-3V7h3a5 5 0 0 1 0 10z"
            />
          </svg>
        </div>
        <div className="stat-info">
          <h3>Clientes Recorrentes</h3>
          <p>{stats.recorrencia.clientes_2x}</p>
          <div
            style={{
              fontSize: "0.95rem",
              color: "#111827",
              marginTop: "6px",
              fontWeight: 500,
            }}
          >
            Taxa de Recompra:{" "}
            <strong>{stats.recorrencia.taxa_recompra}%</strong>
          </div>
          <div className="card-meta-text">
            🎯 Próxima meta: {metaRecorrentes} clientes
          </div>
        </div>
      </div>

      {/* Páginas visualizadas */}
      <div className="stat-card">
        <div className="stat-icon">
          {/* olho/visualizações */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 5C7 5 3.73 8.11 2 12c1.73 3.89 5 7 10 7s8.27-3.11 10-7c-1.73-3.89-5-7-10-7zm0 2c3.04 0 5.64 1.96 7.19 5-1.55 3.04-4.15 5-7.19 5S6.36 15.04 4.81 12C6.36 8.96 8.96 7 12 7zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
            />
          </svg>
        </div>
        <div className="stat-info">
          <h3>Páginas Visualizadas</h3>
          <p>{stats.visualizacoes.pageviews.toLocaleString()}</p>
          <div
            style={{
              marginTop: "10px",
              fontSize: "0.95rem",
              color: "#111827",
              fontWeight: 500,
            }}
          >
            ⏱️ Tempo médio:{" "}
            <strong>{stats.visualizacoes.tempo_medio}</strong>
          </div>
        </div>
      </div>

      {/* Top páginas do App (PWA) */}
      {stats.visualizacoes.top_paginas_pwa &&
        stats.visualizacoes.top_paginas_pwa.length > 0 && (
          <div className="stat-card">
            <div className="stat-icon">
              {/* pin / destaque */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M16 3 8 11l3 3-5 5 1.5 1.5 5-5 3 3 8-8z"
                />
              </svg>
            </div>
            <div className="stat-info">
              <h3>Top páginas do App</h3>
              <ul
                style={{
                  marginTop: "8px",
                  paddingLeft: 0,
                  listStyle: "none",
                  fontSize: "11px",
                  color: "#374151",
                }}
              >
                {stats.visualizacoes.top_paginas_pwa
                  .filter((pagina) => pagina !== "install")
                  .slice(0, 5)
                  .map((pagina, idx) => {
                    let label = pagina || "/";
                    let badge: string | null = null;

                    if (label === "/") {
                      label = "Página inicial";
                      badge = "HOME";
                    }

                    const display =
                      label.length > 50 ? label.slice(0, 47) + "..." : label;

                    return (
                      <li
                        key={pagina + idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 16,
                              height: 16,
                              borderRadius: "999px",
                              background: "#E5E7EB",
                              fontSize: "10px",
                              color: "#374151",
                              flexShrink: 0,
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span
                            title={label}
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {display}
                          </span>
                        </div>
                        {badge && (
                          <span
                            style={{
                              marginLeft: "6px",
                              fontSize: "9px",
                              padding: "2px 6px",
                              borderRadius: "999px",
                              background: "#E0F2FE",
                              color: "#0369A1",
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
      <div className="stat-card" style={{ gridRow: "span 2" }}>
        <div className="stat-info" style={{ width: "100%" }}>
          <h3>Funil de Vendas 📉</h3>
          <div style={{ marginTop: "15px" }}>
            <div className="conversion-bar">
              <div className="bar-label">
                <span>1. Visitas Únicas</span>{" "}
                <strong>{stats.funil.visitas}</strong>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: "100%", background: "#9CA3AF" }}
                ></div>
              </div>
            </div>

            <div className="conversion-bar">
              <div className="bar-label">
                <span>2. Carrinho</span>{" "}
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
                    background: "#60A5FA",
                  }}
                ></div>
              </div>
            </div>

            <div className="conversion-bar">
              <div className="bar-label">
                <span>3. Checkout</span>{" "}
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
                    background: "#10B981",
                  }}
                ></div>
              </div>
            </div>

            <small
              style={{
                display: "block",
                marginTop: "10px",
                color: "#666",
                fontSize: "10px",
              }}
            >
              {stats.taxa_conversao.app}% de conversão global do APP
            </small>
          </div>
        </div>
      </div>

      {/* Carrinhos abandonados */}
      <div className="stat-card" style={{ borderLeft: "4px solid #ef4444" }}>
        <div className="stat-icon red">
          {/* carrinho com X */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 2a2 2 0 1 0-4.001.001A2 2 0 0 0 17 20zM6.2 4l-.4-2H2v2h2l3.6 7.59-1.35 2.44A1 1 0 0 0 7.1 15H19v-2H8.42l.93-1.68L18.55 11a1 1 0 0 0 .92-.63L22 3h-2.09l-2.13 5H8.53L6.2 4z"
            />
          </svg>
        </div>
        <div className="stat-info">
          <h3>Carrinhos Abandonados</h3>
          <p>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(stats.carrinhos_abandonados.valor)}
          </p>

          <div
            style={{
              marginTop: "4px",
              fontSize: "11px",
              color: "#555",
            }}
          >
            {stats.carrinhos_abandonados.qtd} carrinho
            {stats.carrinhos_abandonados.qtd === 1 ? "" : "s"} abandonado
            {stats.carrinhos_abandonados.qtd === 1 ? "" : "s"}
          </div>

          <button
            style={{
              marginTop: "8px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              fontSize: "11px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔔 RECUPERAR AGORA
          </button>
        </div>
      </div>

      {/* Taxa de conversão – apenas APP */}
      <div className="stat-card">
        <div className="stat-info" style={{ width: "100%" }}>
          <h3>Taxa de Conversão 🏆</h3>

          <div className="conversion-bar" style={{ marginBottom: "6px" }}>
            <div className="bar-label">
              <span>APP</span>{" "}
              <strong>{stats.taxa_conversao.app}%</strong>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${Math.min(stats.taxa_conversao.app, 100)}%`,
                  background: "#10B981",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
