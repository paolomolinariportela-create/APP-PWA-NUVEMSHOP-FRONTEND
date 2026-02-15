import React, { useEffect, useState } from 'react';

interface PushCampaign {
    title: string;
    message: string;
    url: string;
}

interface PushHistoryItem {
    id: number;
    title: string;
    message: string;
    url: string;
    sent_count: number;
    created_at: string;
}

interface Props {
    stats: any;
    pushForm: PushCampaign;
    setPushForm: (f: PushCampaign) => void;
    handleSendPush: () => void;
    sendingPush: boolean;
    token: string | null; // Precisamos do token para buscar o histórico
    API_URL: string;
}

export default function TabCampaigns({ stats, pushForm, setPushForm, handleSendPush, sendingPush, token, API_URL }: Props) {
    const [history, setHistory] = useState<PushHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Busca o histórico assim que a aba carrega
    useEffect(() => {
        if (!token) return;
        setLoadingHistory(true);
        fetch(`${API_URL}/stats/admin/push-history`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => {
            if (Array.isArray(data)) setHistory(data);
        })
        .catch(err => console.error("Erro histórico:", err))
        .finally(() => setLoadingHistory(false));
    }, [token, sendingPush]); // Recarrega quando envia uma nova (sendingPush muda)

    // Formata data bonita (DD/MM às HH:mm)
    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="animate-fade-in" style={{marginTop:'20px', maxWidth:'800px', margin:'0 auto'}}>
            
            {/* CARD DE ENVIO (Já existia) */}
            <div className="config-card">
                <div className="card-header" style={{borderBottom:'none', paddingBottom:'0'}}>
                    <h2 style={{margin:0}}>📢 Criar Nova Campanha</h2>
                    <p style={{color:'#666'}}>Envie notificações push para todos os clientes.</p>
                </div>
                
                <div style={{background:'#F3F4F6', padding:'15px', borderRadius:'8px', margin:'20px 0', display:'flex', alignItems:'center', gap:'10px'}}>
                    <span style={{fontSize:'20px'}}>👥</span>
                    <div>
                        <strong>Alcance Potencial:</strong> <span style={{color:'#4F46E5', fontWeight:'bold'}}>{stats.instalacoes} dispositivos</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Título</label>
                    <input type="text" value={pushForm.title} onChange={(e) => setPushForm({...pushForm, title: e.target.value})} maxLength={50} placeholder="Ex: Promoção Relâmpago!" />
                </div>
                <div className="form-group">
                    <label>Mensagem</label>
                    <input type="text" value={pushForm.message} onChange={(e) => setPushForm({...pushForm, message: e.target.value})} maxLength={120} placeholder="Ex: Aproveite 10% OFF hoje." />
                </div>
                <div className="form-group">
                    <label>Link de Destino</label>
                    <input type="text" value={pushForm.url} onChange={(e) => setPushForm({...pushForm, url: e.target.value})} placeholder="Ex: /produtos/promocao" />
                </div>

                <button 
                    className="save-button" 
                    onClick={handleSendPush} 
                    disabled={sendingPush || stats.instalacoes === 0}
                    style={{background: sendingPush ? '#ccc' : '#4F46E5'}}
                >
                    {sendingPush ? "Enviando..." : "🚀 Enviar Notificação"}
                </button>
            </div>

            {/* TABELA DE HISTÓRICO (NOVO!) */}
            <div className="config-card" style={{marginTop: '30px'}}>
                <div className="card-header">
                    <h3 style={{margin:0}}>📜 Histórico de Envios</h3>
                </div>
                
                {loadingHistory ? (
                    <p style={{padding:'20px', textAlign:'center', color:'#888'}}>Carregando histórico...</p>
                ) : history.length === 0 ? (
                    <p style={{padding:'20px', textAlign:'center', color:'#888'}}>Nenhuma campanha enviada ainda.</p>
                ) : (
                    <div style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
                            <thead>
                                <tr style={{background: '#f9fafb', color: '#666', textAlign: 'left'}}>
                                    <th style={{padding: '12px', borderBottom: '1px solid #eee'}}>Data</th>
                                    <th style={{padding: '12px', borderBottom: '1px solid #eee'}}>Mensagem</th>
                                    <th style={{padding: '12px', borderBottom: '1px solid #eee'}}>Alcance</th>
                                    <th style={{padding: '12px', borderBottom: '1px solid #eee'}}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} style={{borderBottom: '1px solid #eee'}}>
                                        <td style={{padding: '12px', color: '#555'}}>{formatDate(item.created_at)}</td>
                                        <td style={{padding: '12px'}}>
                                            <div style={{fontWeight: 'bold', color: '#333'}}>{item.title}</div>
                                            <div style={{color: '#666', fontSize: '12px'}}>{item.message}</div>
                                            <a href={item.url} target="_blank" rel="noreferrer" style={{fontSize: '11px', color: '#4F46E5'}}>Ver Link</a>
                                        </td>
                                        <td style={{padding: '12px', fontWeight: 'bold'}}>{item.sent_count}</td>
                                        <td style={{padding: '12px'}}>
                                            <span style={{background: '#DCFCE7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold'}}>Enviado</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
