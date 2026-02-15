import React from 'react';

export default function Home() {
  
  const handleLogin = () => {
    // 1. Recupera a URL do Backend definida nas variáveis de ambiente (.env)
    // Se não houver variável definida, assume localhost para desenvolvimento local.
    let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

    // 2. Limpeza de String: Remove barra no final se houver, para evitar rotas como "url//install"
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }

    // 3. Segurança: Garante que o protocolo HTTP/HTTPS existe.
    // O Railway às vezes fornece a variável sem o protocolo.
    if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }

    // 4. Redirecionamento Final
    // Envia o usuário para a rota /install que inicia o OAuth da Nuvemshop
    window.location.href = `${baseUrl}/install`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoCircle}>📱</div>
        
        <h1 style={styles.title}>App PWA Builder</h1>
        
        <p style={styles.subtitle}>
          Transforme sua Nuvemshop em um Aplicativo nativo em segundos.
        </p>
        
        <button 
          onClick={handleLogin} 
          style={styles.button}
          type="button" // Boa prática para evitar refresh acidental se estiver dentro de form
        >
          🛍️ Entrar com Nuvemshop
        </button>

        <div style={styles.features}>
          <span>🚀 Mais Vendas</span>
          <span>⚡ Sem Programação</span>
          <span>🔒 100% Seguro</span>
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS CSS (CSS-in-JS) ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: 0,
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
  },
  logoCircle: {
    width: '60px',
    height: '60px',
    background: '#f3f4f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    margin: '0 auto 20px auto',
    cursor: 'default',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '24px',
    fontWeight: 700,
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.5',
    fontSize: '16px',
  },
  button: {
    background: '#2D3275', // Azul Oficial Nuvemshop
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.1s ease, background 0.2s ease',
    boxShadow: '0 4px 6px rgba(45, 50, 117, 0.2)',
  },
  features: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between', // Melhor distribuição
    fontSize: '12px',
    color: '#888',
    fontWeight: 'bold',
    padding: '0 10px',
  }
};
