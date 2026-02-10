// Esse código vai dentro do StoreApp.tsx
useEffect(() => {
  if (storeId) {
    // 1. Acha a linha do manifesto no HTML
    const manifestLink = document.getElementById('app-manifest');
    
    // 2. Troca o link para o nosso Backend Python
    // O celular vai ler: "Ah, o manifesto dessa loja está lá no Python!"
    if (manifestLink) {
      manifestLink.setAttribute('href', `${import.meta.env.VITE_API_URL}/manifest/${storeId}.json`);
    }
  }
}, [storeId]);
