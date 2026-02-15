// ... (imports e interfaces iniciais mantidos) ...

// Interface Atualizada
interface AppConfig {
  app_name: string;
  theme_color: string;
  logo_url: string;
  whatsapp_number: string;
  fab_enabled?: boolean; // Novo
  fab_text?: string;     // Novo
}

// ... (dentro do componente AdminPanel) ...

// Estado inicial atualizado
const [config, setConfig] = useState<AppConfig>({
    app_name: "Minha Loja",
    theme_color: "#000000",
    logo_url: "",
    whatsapp_number: "",
    fab_enabled: false,
    fab_text: "Baixar App"
});

// ... (fetch useEffect atualizado automaticamente pelo setConfig acima) ...

// NO RETURN DO JSX (dentro da aba 'config'):

{/* ... Card de Identidade Visual ... */}

{/* CARD: Widgets de Conversão (NOVO) */}
<div className="config-card">
    <div className="card-header">
        <h3 style={{margin:0}}>🚀 Widgets de Conversão</h3>
        <p style={{marginTop:'5px'}}>Aumente os downloads com botões inteligentes.</p>
    </div>

    {/* Botão Flutuante */}
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', padding:'10px', background:'#f9f9f9', borderRadius:'8px'}}>
        <div>
            <h4 style={{margin:0, fontSize:'14px', display:'flex', alignItems:'center', gap:'6px'}}>
                <span>📲</span> Botão Flutuante (FAB)
            </h4>
            <small style={{color:'#666'}}>Ícone fixo no canto da tela.</small>
        </div>
        
        {/* Toggle Switch Simples em CSS Inline */}
        <label style={{position:'relative', display:'inline-block', width:'50px', height:'26px'}}>
            <input 
                type="checkbox" 
                checked={config.fab_enabled || false}
                onChange={(e) => setConfig({...config, fab_enabled: e.target.checked})}
                style={{opacity:0, width:0, height:0}}
            />
            <span style={{
                position:'absolute', cursor:'pointer', top:0, left:0, right:0, bottom:0, 
                backgroundColor: config.fab_enabled ? '#10B981' : '#ccc', 
                transition:'.4s', borderRadius:'34px'
            }}></span>
            <span style={{
                position:'absolute', content:"", height:'20px', width:'20px', left:'3px', bottom:'3px', 
                backgroundColor:'white', transition:'.4s', borderRadius:'50%',
                transform: config.fab_enabled ? 'translateX(24px)' : 'translateX(0px)'
            }}></span>
        </label>
    </div>

    {config.fab_enabled && (
        <div className="form-group animate-fade-in" style={{marginTop:'15px'}}>
            <label>Texto do Botão</label>
            <input 
                type="text" 
                value={config.fab_text || "Baixar App"}
                onChange={(e) => setConfig({...config, fab_text: e.target.value})}
                placeholder="Ex: Baixar App Agora"
            />
        </div>
    )}
</div>

{/* ... Card de Suporte ... */}
