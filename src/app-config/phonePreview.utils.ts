// Hook centralizado para interações com OneSignal
// Usado por FAB, TopBar e Popup

declare global {
  interface Window {
    OneSignal?: any;
  }
}

export async function requestPushPermission() {
  try {
    const OneSignal = window.OneSignal;
    if (!OneSignal) {
      console.warn('OneSignal não carregado ainda');
      return;
    }
    if (OneSignal.Slidedown?.promptPush) {
      await OneSignal.Slidedown.promptPush();
    } else if (OneSignal.Notifications?.requestPermission) {
      await OneSignal.Notifications.requestPermission();
    } else {
      console.warn('Nenhum método de prompt disponível no OneSignal');
    }
  } catch (err) {
    console.error('Erro ao pedir permissão de push', err);
  }
}

export function getSizeFactor(size?: string): number {
  switch (size) {
    case 'xs':     return 0.7;
    case 'small':  return 0.85;
    case 'large':  return 1.2;
    case 'xl':     return 1.35;
    default:       return 1.0;
  }
}
