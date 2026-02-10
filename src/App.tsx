import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel'; // Vamos criar já já
import StoreApp from './pages/StoreApp';     // O seu App PWA (HTML bonito)

// Componente que decide quem entra onde
function Roteador() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('store_id');
  
  // Se tiver 'mode=admin' na URL, vai pro painel. Se não, vai pra loja.
  const mode = searchParams.get('mode');

  if (mode === 'admin') {
    return <AdminPanel storeId={storeId} />;
  }
  
  // Padrão: Mostra a Loja (PWA)
  return <StoreApp storeId={storeId} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<Roteador />} />
      </Routes>
    </BrowserRouter>
  );
}
