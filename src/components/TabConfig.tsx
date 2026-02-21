import React from 'react';
import PhonePreview from '../pages/PhonePreview';

interface AppConfig {
  app_name: string;
  theme_color: string;
  logo_url: string;
  whatsapp_number: string;
  fab_enabled?: boolean;
  fab_text?: string;
  fab_position?: string;
  fab_icon?: string;
  fab_delay?: number;

  bottom_bar_bg?: string;
  bottom_bar_icon_color?: string;
}

interface Props {
  config: AppConfig;
  setConfig: (c: AppConfig) => void;
  handleSave: () => void;
  saving: boolean;
  loading: boolean;
  storeUrl: string;
}

export default function TabConfig({
  config,
  setConfig,
  handleSave,
  saving,
  loading,
  storeUrl,
}: Props) {
  const copyLink = () => {
    navigator.clipboard.writeText(`${storeUrl}/pages/app`);
    alert('Link copiado!');
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    storeUrl + '/pages/app'
  )}&color=${config.theme_color.replace('#', '')}`;

  // inicial do app para usar no placeholder
  const appInitial = (config.app_name || 'App').trim().charAt(0).toUpperCase();

  return (
    <div className="editor-grid animate-fade-in" style={{ marginTop: '20px' }}>
      <div className="config-section">
        <h2 style={{ marginBottom: '20px' }}>Personalizar Aplicativo</h2>

        {/* Link e QR Code */}
        <div
          className="config-card"
          style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
        >
          <div className="card-header">
            <h3 style={{ color: '#7C3AED', margin: 0 }}>🔗 Link de Download</h3>
            <p style={{ margin: '5px 0' }}>Divulgue este link no Instagram.</p>
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                readOnly
                value={storeUrl ? `${storeUrl}/pages/app` : 'Carregando...'}
                style={{
                  backgroundColor: 'white',
                  color: '#555',
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={copyLink}
                style={{
                  background: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  padding: '0 20px',
                  fontWeight: 'bold',
                }}
              >
                Copiar
              </button>
            </div>
          </div>
        </div>

        <div
          className="config-card"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: '20px',
            display: 'flex',
          }}
        >
          <img
            src={qrCodeUrl}
            alt="QR Code"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '8px',
              border: '1px solid #eee',
            }}
          />
          <div>
            <h3 style={{ fontSize: '16px', margin: '0 0 5px 0' }}>
              QR Code de Balcão
            </h3>
            <a
              href={qrCodeUrl}
              download="qrcode.png"
              target="_blank"
              rel="noreferrer"
              style={{
                color: config.theme_color,
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              ⬇️ Baixar Imagem
            </a>
          </div>
        </div>

        {/* Identidade Visual */}
        <div className="config-card">
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>🎨 Identidade Visual</h3>
          </div>

          {/* Linha com campos + mini preview do ícone */}
          <div
            style={{
              display: 'flex',
              gap: '18px',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div className="form-group">
                <label>Nome do Aplicativo</label>
                <input
                  type="text"
                  value={config.app_name}
                  onChange={(e) =>
                    setConfig({ ...config, app_name: e.target.value })
                  }
                  placeholder="Ex: Minha Loja Oficial"
                />
              </div>

              <div className="form-group">
                <label>Cor Principal (Tema)</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={config.theme_color}
                    onChange={(e) =>
                      setConfig({ ...config, theme_color: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={config.theme_color}
                    onChange={(e) =>
                      setConfig({ ...config, theme_color: e.target.value })
                    }
                    className="color-text"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Logo URL (Link da Imagem)</label>
                <input
                  type="text"
                  value={config.logo_url}
                  onChange={(e) =>
                    setConfig({ ...config, logo_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* MINI PREVIEW DE ÍCONE */}
            <div
              style={{
                width: '120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  background: config.theme_color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                }}
              >
                {config.logo_url ? (
                  <img
                    src={config.logo_url}
                    alt="Logo preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        'none';
                    }}
                  />
                ) : (
                  <span
                    style={{
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '28px',
                    }}
                  >
                    {appInitial}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  color: '#6B7280',
                  textAlign: 'center',
                }}
              >
                Prévia do ícone
              </span>
            </div>
          </div>
        </div>

        {/* Widgets de Conversão */}
        <div className="config-card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>🚀 Widgets de Conversão</h3>
          </div>

          {/* Toggle FAB */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #eee',
            }}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: '14px' }}>
                📲 Botão Flutuante (FAB)
              </h4>
              <small style={{ color: '#666', fontSize: '11px' }}>
                Ícone de download fixo no canto da tela.
              </small>
            </div>
            <label
              style={{
                position: 'relative',
                display: 'inline-block',
                width: '46px',
                height: '24px',
              }}
            >
              <input
                type="checkbox"
                checked={config.fab_enabled ?? false}
                onChange={(e) =>
                  setConfig({ ...config, fab_enabled: e.target.checked })
                }
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: (config.fab_enabled ?? false)
                    ? '#10B981'
                    : '#E5E7EB',
                  transition: '.3s',
                  borderRadius: '34px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  height: '18px',
                  width: '18px',
                  left: '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '.3s',
                  borderRadius: '50%',
                  transform: (config.fab_enabled ?? false)
                    ? 'translateX(22px)'
                    : 'translateX(0px)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </label>
          </div>

          {/* Opções Expandidas do FAB */}
          {config.fab_enabled && (
            <div
              className="animate-fade-in"
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '15px',
                  marginBottom: '15px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#374151',
                      display: 'block',
                      marginBottom: '5px',
                    }}
                  >
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={config.fab_text ?? 'Baixar App'}
                    onChange={(e) =>
                      setConfig({ ...config, fab_text: e.target.value })
                    }
                    placeholder="Ex: Instalar Agora"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                    }}
                  />
                </div>
                <div style={{ width: '80px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#374151',
                      display: 'block',
                      marginBottom: '5px',
                    }}
                  >
                    Ícone
                  </label>
                  <input
                    type="text"
                    value={config.fab_icon ?? '📲'}
                    onChange={(e) =>
                      setConfig({ ...config, fab_icon: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid '#d1d5db',
                      borderRadius: '6px',
                      textAlign: 'center',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#374151',
                      display: 'block',
                      marginBottom: '5px',
                    }}
                  >
                    Posição na Tela
                  </label>
                  <select
                    value={config.fab_position ?? 'right'}
                    onChange={(e) =>
                      setConfig({ ...config, fab_position: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: 'white',
                    }}
                  >
                    <option value="right">Direita (Padrão)</option>
                    <option value="left">Esquerda</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#374151',
                      display: 'block',
                      marginBottom: '5px',
                    }}
                  >
                    Atraso: {config.fab_delay ?? 0} segundos
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={config.fab_delay ?? 0}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        fab_delay: parseInt(e.target.value, 10),
                      })
                    }
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      accentColor: config.theme_color,
                    }}
                  />
                  <small style={{ fontSize: '10px', color: '#666' }}>
                    Tempo para aparecer após abrir o site.
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Bottom bar do app */}
          <div
            className="animate-fade-in"
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '15px',
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
              📱 Barra inferior do App
            </h4>
            <small
              style={{
                color: '#666',
                fontSize: '11px',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Personalize a barra de navegação que aparece quando o cliente usa
              o app instalado.
            </small>

            <div className="form-group">
              <label>Cor de fundo da barra</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={config.bottom_bar_bg || '#FFFFFF'}
                  onChange={(e) =>
                    setConfig({ ...config, bottom_bar_bg: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="color-text"
                  value={config.bottom_bar_bg || '#FFFFFF'}
                  onChange={(e) =>
                    setConfig({ ...config, bottom_bar_bg: e.target.value })
                  }
                />
              </div>
              <small>Exemplo: #FFFFFF para branco.</small>
            </div>

            <div className="form-group">
              <label>Cor dos ícones e textos</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={config.bottom_bar_icon_color || '#6B7280'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      bottom_bar_icon_color: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  className="color-text"
                  value={config.bottom_bar_icon_color || '#6B7280'}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      bottom_bar_icon_color: e.target.value,
                    })
                  }
                />
              </div>
              <small>Exemplo: #4F46E5 para roxo do App.</small>
            </div>
          </div>
        </div>

        <button
          className="save-button"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* PREVIEW DO CELULAR */}
      <div className="preview-section">
        <div className="sticky-wrapper">
          <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>
            Preview ao Vivo
          </h3>
          <PhonePreview
            appName={config.app_name}
            themeColor={config.theme_color}
            logoUrl={config.logo_url}
            fabEnabled={config.fab_enabled}
            fabText={config.fab_text}
            fabPosition={config.fab_position}
            fabIcon={config.fab_icon}
            storeUrl={storeUrl}
            bottomBarBg={config.bottom_bar_bg}
            bottomBarIconColor={config.bottom_bar_icon_color}
          />
        </div>
      </div>
    </div>
  );
}
