import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel'; // Importando o único componente que importa

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Qualquer link vai para o AdminPanel */}
        <Route path="/" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
