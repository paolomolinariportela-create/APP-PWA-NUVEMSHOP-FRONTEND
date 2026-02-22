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
  fab_size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  fab_color?: string;
  fab_background_image_url?: string;

  topbar_enabled?: boolean;
  topbar_text?: string;
  topbar_button_text?: string;
  topbar_icon?: string;
  topbar_position?: 'top' | 'bottom';
  topbar_color?: string;
  topbar_text_color?: string;
  topbar_size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  topbar_button_bg_color?: string;
  topbar_button_text_color?: string;
  topbar_background_image_url?: string;

  popup_enabled?: boolean;
  popup_image_url?: string;

  bottom_bar_enabled?: boolean;
  bottom_bar_bg?: string;
  bottom_bar_icon_color?: string;

  default_logo_url?: string;
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
  const appInitial = (config.app_name || 'App').trim().charAt(0).toUpperCase();
  const logoToUse = config.logo_url || config.default_logo_url || '';

  const fabColor = config.fab_color || config.theme_color;
  const topbarColor = config.topbar_color || '#111827';
  const topbarTextColor = config.topbar_text_color || '#FFFFFF';
  const topbarButtonBgColor = config.topbar_button_bg_color || '#FBBF24';
  const topbarButtonTextColor = config.topbar_button_text_color || '#111827';

  return (
    <div className="editor-grid animate-fade-in" style={{ marginTop: '20px' }}>
      <div className="config-section" style={{ gridColumn: '1 / -1' }}>
        <h2 style={{ marginBottom: '20px' }}>Personalizar Aplicativo</h2>

        {/* IDENTIDADE VISUAL + PREVIEW (splash) */}
        <div className="config-card">
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>🎨 Identidade Visual</h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.4fr)',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
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
                    placeholder={
                      config.default_logo_url
                        ? `Padrão: ${config.default_logo_url}`
                        : 'https://...'
                    }
                  />
                </div>
              </div>

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
                  {logoToUse ? (
                    <img
                      src={logoToUse}
                      alt="Logo preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
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

            <div>
              <h4
                style={{
                  margin: '0 0 10px 0',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                Como fica a tela de abertura
              </h4>
              <PhonePreview
                appName={config.app_name}
                themeColor={config.theme_color}
                logoUrl={logoToUse}
                fabEnabled={false}
                storeUrl={storeUrl}
                mode="splash"
              />
            </div>
          </div>
        </div>

        {/* WIDGETS DE CONVERSÃO (FAB + Barra fixa + Popup) + PREVIEW */}
        <div className="config-card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>🚀 Widgets de Conversão</h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.4fr)',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            {/* Coluna esquerda */}
            <div>
              {/* FAB */}
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
                          border: '1px solid '#d1d5db',
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
                        placeholder="Ex: 📲, 🛒, ⭐"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Cor do botão "Baixar App"</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={fabColor}
                        onChange={(e) =>
                          setConfig({ ...config, fab_color: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="color-text"
                        value={fabColor}
                        onChange={(e) =>
                          setConfig({ ...config, fab_color: e.target.value })
                        }
                      />
                    </div>
                    <small>
                      Use uma cor chamativa diferente do tema, se quiser.
                    </small>
                  </div>

                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>Imagem do botão (URL opcional)</label>
                    <input
                      type="text"
                      value={config.fab_background_image_url || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          fab_background_image_url: e.target.value,
                        })
                      }
                      placeholder="https://... (banner do botão flutuante)"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid '#d1d5db',
                        borderRadius: '6px',
                      }}
                    />
                    <small style={{ fontSize: '10px', color: '#666' }}>
                      Se preencher, o botão flutuante pode usar essa imagem
                      como fundo.
                    </small>
                  </div>

                  <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <label
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        display: 'block',
                        marginBottom: '5px',
                      }}
                    >
                      Tamanho do botão
                    </label>
                    <select
                      value={config.fab_size ?? 'medium'}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          fab_size: e.target.value as
                            | 'xs'
                            | 'small'
                            | 'medium'
                            | 'large'
                            | 'xl',
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid '#d1d5db',
                        borderRadius: '6px',
                        background: 'white',
                      }}
                    >
                      <option value="xs">Muito pequeno</option>
                      <option value="small">Pequeno</option>
                      <option value="medium">Médio</option>
                      <option value="large">Grande</option>
                      <option value="xl">Muito grande</option>
                    </select>
                    <small style={{ fontSize: '10px', color: '#666' }}>
                      Escolha entre 5 tamanhos pré-definidos.
                    </small>
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
                          border: '1px solid '#d1d5db',
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

              {/* BARRA FIXA DE DOWNLOAD */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid '#eee',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px' }}>
                    📢 Barra Fixa de Download
                  </h4>
                  <small style={{ color: '#666', fontSize: '11px' }}>
                    Banner “Baixe o app” no topo ou embaixo do site.
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
                    checked={config.topbar_enabled ?? false}
                    onChange={(e) =>
                      setConfig({ ...config, topbar_enabled: e.target.checked })
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
                      backgroundColor: (config.topbar_enabled ?? false)
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
                      transform: (config.topbar_enabled ?? false)
                        ? 'translateX(22px)'
                        : 'translateX(0px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </label>
              </div>

              {config.topbar_enabled && (
                <div
                  className="animate-fade-in"
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '15px',
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
                        Texto da barra
                      </label>
                      <input
                        type="text"
                        value={
                          config.topbar_text ??
                          'Instale o app e ganhe 10% OFF na primeira compra'
                        }
                        onChange={(e) =>
                          setConfig({ ...config, topbar_text: e.target.value })
                        }
                        placeholder="Mensagem principal do banner"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid '#d1d5db',
                          borderRadius: '6px',
                        }}
                      />
                    </div>
                  </div>

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
                        Texto do botão
                      </label>
                      <input
                        type="text"
                        value={config.topbar_button_text ?? 'Instalar agora'}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            topbar_button_text: e.target.value,
                          })
                        }
                        placeholder="Ex: Instalar agora"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid '#d1d5db',
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
                        value={config.topbar_icon ?? '📲'}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            topbar_icon: e.target.value,
                          })
                        }
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid '#d1d5db',
                          borderRadius: '6px',
                          textAlign: 'center',
                        }}
                        placeholder="Ex: 📲, 🎁"
                      />
                    </div>
                  </div>

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
                        Posição
                      </label>
                      <select
                        value={config.topbar_position ?? 'top'}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            topbar_position: e.target.value as 'top' | 'bottom',
                          })
                        }
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid '#d1d5db',
                          borderRadius: '6px',
                          background: 'white',
                        }}
                      >
                        <option value="top">Topo</option>
                        <option value="bottom">Embaixo</option>
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
                        Tamanho da barra
                      </label>
                      <select
                        value={config.topbar_size ?? 'medium'}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            topbar_size: e.target.value as
                              | 'xs'
                              | 'small'
                              | 'medium'
                              | 'large'
                              | 'xl',
                          })
                        }
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid '#d1d5db',
                          borderRadius: '6px',
                          background: 'white',
                        }}
                      >
                        <option value="xs">Pequeno</option>
                        <option value="small">Médio</option>
                        <option value="medium">Grande</option>
                        <option value="large">Extra grande</option>
                        <option value="xl">Maior</option>
                      </select>
                      <small style={{ fontSize: '10px', color: '#666' }}>
                        Escolha entre 5 tamanhos pré-definidos.
                      </small>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '15px',
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
                        Cor de fundo
                      </label>
                      <div className="color-picker-wrapper">
                        <input
                          type="color"
                          value={topbarColor}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              topbar_color: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="color-text"
                          value={topbarColor}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              topbar_color: e.target.value,
                            })
                          }
                        />
                      </div>
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
                        Cor do texto
                      </label>
                      <div className="color-picker-wrapper">
                        <input
                          type="color"
                          value={topbarTextColor}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              topbar_text_color: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="color-text"
                          value={topbarTextColor}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              topbar_text_color: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '15px',
                      marginTop: '15px',
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
                        Cor do botão
                      </label>
                      <div className="color-picker-wrapper">
                        <input
                          type="color"
                          value={topbarButtonBgColor}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              topbar_button_bg_color: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="color-text"
                          value={topbarButtonBgColor}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              topbar_button_bg_color: e.target.value,
                            })
                          }
                        />
                      </div>
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
                        Cor do texto do botão
                      </label>
                      <div className="color-picker-wrapper">
                        <input
                          type="color"
                          value={topbarButtonTextColor}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              topbar_button_text_color: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="color-text"
                          value={topbarButtonTextColor}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              topbar_button_text_color: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>Imagem da barra (URL opcional)</label>
                    <input
                      type="text"
                      value={config.topbar_background_image_url || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          topbar_background_image_url: e.target.value,
                        })
                      }
                      placeholder="https://... (banner da barra fixa)"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid '#d1d5db',
                        borderRadius: '6px',
                      }}
                    />
                    <small style={{ fontSize: '10px', color: '#666' }}>
                      Se preencher, a barra fixa pode usar essa imagem como
                      fundo.
                    </small>
                  </div>
                </div>
              )}

              {/* POPUP DE INSTALAÇÃO */}
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid '#eee',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px' }}>
                    🖼 Popup de Instalação
                  </h4>
                  <small style={{ color: '#666', fontSize: '11px' }}>
                    Mostra um popup com sua própria imagem para instalar o app.
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
                    checked={config.popup_enabled ?? false}
                    onChange={(e) =>
                      setConfig({ ...config, popup_enabled: e.target.checked })
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
                      backgroundColor: (config.popup_enabled ?? false)
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
                      transform: (config.popup_enabled ?? false)
                        ? 'translateX(22px)'
                        : 'translateX(0px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </label>
              </div>

              {config.popup_enabled && (
                <div
                  className="animate-fade-in"
                  style={{
                    marginTop: '10px',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '15px',
                  }}
                >
                  <div className="form-group">
                    <label>Imagem do popup (URL)</label>
                    <input
                      type="text"
                      value={config.popup_image_url || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          popup_image_url: e.target.value,
                        })
                      }
                      placeholder="https://... (imagem em tela cheia)"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid '#d1d5db',
                        borderRadius: '6px',
                      }}
                    />
                    <small style={{ fontSize: '10px', color: '#666' }}>
                      Essa imagem será usada como fundo do popup no celular.
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* Coluna direita - preview */}
            <div>
              <h4
                style={{
                  margin: '0 0 10px 0',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                Widgets dentro do app
              </h4>
              <PhonePreview
                appName={config.app_name}
                themeColor={config.theme_color}
                logoUrl={logoToUse}
                fabEnabled={config.fab_enabled}
                fabText={config.fab_text}
                fabPosition={config.fab_position}
                fabIcon={config.fab_icon}
                fabSize={config.fab_size}
                fabColor={fabColor}
                fabBackgroundImageUrl={config.fab_background_image_url}
                topbarEnabled={config.topbar_enabled}
                topbarText={config.topbar_text}
                topbarButtonText={config.topbar_button_text}
                topbarIcon={config.topbar_icon}
                topbarPosition={config.topbar_position}
                topbarColor={topbarColor}
                topbarTextColor={topbarTextColor}
                topbarSize={config.topbar_size}
                topbarButtonBgColor={topbarButtonBgColor}
                topbarButtonTextColor={topbarButtonTextColor}
                topbarBackgroundImageUrl={config.topbar_background_image_url}
                popupEnabled={config.popup_enabled}
                popupImageUrl={config.popup_image_url}
                storeUrl={storeUrl}
                mode="app"
              />
            </div>
          </div>
        </div>

        {/* CONFIGURAÇÕES APÓS INSTALAÇÃO (barra inferior) */}
        <div className="config-card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>⚙️ Configurações após instalação</h3>
            <p
              style={{
                margin: '5px 0',
                fontSize: '0.9rem',
                color: '#6B7280',
              }}
            >
              Personalize a barra inferior do app instalado.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.4fr)',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid '#eee',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px' }}>
                    📱 Barra inferior do App
                  </h4>
                  <small style={{ color: '#666', fontSize: '11px' }}>
                    Ative ou desligue a barra fixa de navegação.
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
                    checked={config.bottom_bar_enabled ?? true}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        bottom_bar_enabled: e.target.checked,
                      })
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
                      backgroundColor: (config.bottom_bar_enabled ?? true)
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
                      transform: (config.bottom_bar_enabled ?? true)
                        ? 'translateX(22px)'
                        : 'translateX(0px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </label>
              </div>

              {config.bottom_bar_enabled !== false && (
                <>
                  <div className="form-group">
                    <label>Cor de fundo da barra</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={config.bottom_bar_bg || '#FFFFFF'}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            bottom_bar_bg: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        className="color-text"
                        value={config.bottom_bar_bg || '#FFFFFF'}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            bottom_bar_bg: e.target.value,
                          })
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
                </>
              )}
            </div>

            <div>
              <h4
                style={{
                  margin: '0 0 10px 0',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                Barra inferior dentro do app
              </h4>
              {config.bottom_bar_enabled !== false && (
                <PhonePreview
                  appName={config.app_name}
                  themeColor={config.theme_color}
                  logoUrl={logoToUse}
                  fabEnabled={false}
                  storeUrl={storeUrl}
                  bottomBarBg={config.bottom_bar_bg}
                  bottomBarIconColor={config.bottom_bar_icon_color}
                  mode="app"
                />
              )}
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
    </div>
  );
}
