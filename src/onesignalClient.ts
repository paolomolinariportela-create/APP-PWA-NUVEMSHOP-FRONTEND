// src/onesignalClient.ts

declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
  }
}

export function initOneSignal() {
  // evita rodar no lado do servidor
  if (typeof window === 'undefined') return;

  // injeta o script do SDK apenas uma vez
  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"]'
  );

  if (!existingScript) {
    const script = document.createElement('script');
    script.src =
      'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.defer = true;
    document.head.appendChild(script);
  }

  // fila de inicialização v16
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async function (OneSignal: any) {
    // expõe a instância globalmente para o app inteiro
    window.OneSignal = OneSignal;

    await OneSignal.init({
      appId: '91487f5b-2269-4d8a-8001-e9bb8b76bb38', // seu appId
      serviceWorkerPath: '/sw.js',
      serviceWorkerParam: { scope: '/' },

      // se quiser já deixar pronto para prompts, pode ir ajustando depois:
      // promptOptions: {
      //   slidedown: {
      //     enabled: false, // vamos pedir manualmente via soft ask
      //   },
      // },
    });

    // aqui no futuro você pode setar tags, userId, etc.
    // ex: await OneSignal.User.addTag('origin', 'app-builder');
  });
}

