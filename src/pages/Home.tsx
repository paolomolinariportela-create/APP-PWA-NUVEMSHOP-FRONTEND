import React from 'react';

export default function Home() {
  // --- CORREÇÃO DE SEGURANÇA E URL ---
  // 1. Pega a URL do .env ou usa localhost como padrão
  let API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // 2. O Railway as vezes entrega a URL sem o "https://". 
  // Se não tiver, nós colocamos na força. Isso resolve o erro de tela branca/405.
  if (API_URL && !API_URL.startsWith("http")) {
      API_URL = `https://${API_URL}`;
  }
  // ------------------------------------

  const handleLogin = () => {
    // Redireciona para o Backend (agora com a URL correta)
    window.location.href = `${API_URL}/install`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoCircle}>📱</div>
        <h1 style={styles.title}>App PWA Builder</h1>
        <p style={styles.subtitle}>Transforme sua Nuvemshop em um Aplicativo nativo em segundos.</p>
        
        <button onClick={handleLogin} style={styles.button}>
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

// Estilos CSS simples direto no arquivo (Mantidos iguais ao seu original)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'sans-serif',
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
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '24px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.5',
  },
  button: {
    background: '#2D3275', // Cor oficial da Nuvemshop (azul escuro)
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
  },
  features: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '12px',
    color: '#888',
    fontWeight: 'bold',
  }
};
