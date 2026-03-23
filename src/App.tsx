import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando as páginas
import AdminPanel from './pages/AdminPanel'; 
import Home from './pages/Home';
import ConfigWidgets from './pages/ConfigWidgets';  // ← NOVA IMPORTAÇÃO

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública: Página de Login/Instalação */}
        {/* Quem acessa 'seusite.com' cai aqui */}
        <Route path="/" element={<Home />} />

        {/* Rota Privada: Painel do Lojista */}
        {/* Quem acessa 'seusite.com/admin' cai aqui (exige token) */}
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* NOVA ROTA: Configuração de Widgets */}
        {/* Quem acessa 'seusite.com/config-widgets' cai aqui */}
        <Route path="/config-widgets" element={<ConfigWidgets />} />
      </Routes>
    </BrowserRouter>
  );
}
