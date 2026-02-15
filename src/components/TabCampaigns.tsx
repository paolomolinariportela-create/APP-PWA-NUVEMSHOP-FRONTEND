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
    token: string | null;
    API_URL: string;
}

export default function TabCampaigns({ stats, pushForm, setPushForm, handleSendPush, sendingPush, token, API_URL }: Props) {
    const [history, setHistory] = useState<PushHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // ROTA ATUALIZADA: /push/history
    const fetchHistory = () => {
        if (!token) return;
        setLoadingHistory(true);
        fetch(`${API_URL}/push/history`, { // <--- MUDOU AQUI
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => {
            if (Array.isArray(data)) setHistory(data);
            else setHistory([]);
        })
        .catch(err => {
            console.error("Erro histórico:", err);
            setHistory([]);
        })
        .finally(() => setLoadingHistory(false));
    };

    useEffect(() => {
        if (!sendingPush) fetchHistory();
    }, [token, sendingPush]);

    const formatDate = (dateString: string) => {
        try {
            const d = new Date(dateString);
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return dateString; }
    };

    return (
        <div className="animate-fade-in" style={{marginTop:'20px', maxWidth:'800px', margin:'0 auto'}}>
            <div className="config-card">
                <div className="card-header" style={{borderBottom:'none', paddingBottom:'0'}}>
                    <h2 style={{margin:0}}>📢 Criar Nova Campanha</h2>
                    <p style={{color:'#666'}}>Envie notificações push para todos os clientes.</p>
                </div>
                
                <div style={{background:'#F3F4F6', padding:'15px', borderRadius:'8px', margin:'20px 0', display:'flex', alignItems:'center', gap:'10px'}}>
                    <span style={{fontSize:'20px'}}>👥</span>
                    <div>
                        <strong>Alcance:</strong> <span style={{color:'#4F46E5', fontWeight:'bold'}}>{stats.instalacoes || 0} dispositivos</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Título</label>
                    <input type="text" value={pushForm.title} onChange={(e) => setPushForm({...pushForm, title: e.target.value})} maxLength={50} placeholder="Ex: Oferta Relâmpago!" />
                </div>
                <div className="form-group">
                    <label>Mensagem</label>
                    <input type="text" value={pushForm.message} onChange={(e) => setPushForm({...pushForm, message: e.target.value})} maxLength={120} placeholder="Ex: 10% OFF hoje." />
                </div>
                <div className="form-group">
                    <label>Link (Opcional)</label>
                    <input type="text" value={pushForm.url} onChange={(e) => setPushForm({...pushForm, url: e.target.value})} placeholder="https://..." />
                </div>

                <button className="save-button" onClick={handleSendPush} disabled={sendingPush} style={{background: sendingPush ? '#ccc' : '#4F46E5', width:'100%', marginTop:'10px'}}>
                    {sendingPush ? "Enviando..." : "🚀 Enviar Notificação"}
                </button>
            </div>

            <div className="config-card" style={{marginTop: '30px'}}>
                <div className="card-header" style={{display:'flex', justifyContent:'space-between'}}>
                    <h3 style={{margin:0}}>📜 Histórico</h3>
                    <button onClick={fetchHistory} style={{background:'none', border:'none', cursor:'pointer'}}>🔄</button>
                </div>
                
                {loadingHistory ? <p style={{textAlign:'center', padding:'20px', color:'#888'}}>Carregando...</p> : 
                history.length === 0 ? <p style={{textAlign:'center', padding:'20px', color:'#888'}}>Nenhuma campanha.</p> : (
                    <div style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
                            <thead>
                                <tr style={{background: '#f9fafb', color: '#666', textAlign: 'left'}}>
                                    <th style={{padding: '12px'}}>Data</th>
                                    <th style={{padding: '12px'}}>Mensagem</th>
                                    <th style={{padding: '12px'}}>Enviados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} style={{borderBottom: '1px solid #eee'}}>
                                        <td style={{padding: '12px', whiteSpace:'nowrap', color:'#555'}}>{formatDate(item.created_at)}</td>
                                        <td style={{padding: '12px'}}>
                                            <div style={{fontWeight: 'bold'}}>{item.title}</div>
                                            <div style={{fontSize:'12px', color:'#666'}}>{item.message}</div>
                                        </td>
                                        <td style={{padding: '12px', fontWeight:'bold', color:'#4F46E5'}}>{item.sent_count}</td>
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
