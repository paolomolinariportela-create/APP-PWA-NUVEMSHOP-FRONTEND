import React from 'react';

export default function StoreApp({ storeId }: { storeId: string | null }) {
  if (!storeId) return <div>Loja não identificada.</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>Bem-vindo ao App da Loja {storeId}</h1>
      <p>Em breve aqui: Lista de produtos estilo Instagram.</p>
    </div>
  );
}
