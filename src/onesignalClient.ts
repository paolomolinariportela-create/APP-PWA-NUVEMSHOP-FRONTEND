declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
  }
}

export function initOneSignal() {
  if (typeof window === 'undefined') return;

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"]'
  );
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.defer = true;
    document.head.appendChild(script);
  }

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async function (OneSignal: any) {
    window.OneSignal = OneSignal;
    await OneSignal.init({
      appId: '91487f5b-2269-4d8a-8001-e9bb8b76bb38',
      // ✅ FIX 1: caminho correto — arquivo existe em public/service-worker.js
      serviceWorkerPath: '/service-worker.js',
      serviceWorkerParam: { scope: '/' },
      // ✅ FIX 2: VAPID removido — push é 100% gerenciado pelo OneSignal
    });
  });
}
