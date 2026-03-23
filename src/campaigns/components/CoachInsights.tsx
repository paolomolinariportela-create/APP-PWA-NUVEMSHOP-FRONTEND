import { OneSignalNotif } from '../types';
import { C } from '../design';

interface Props {
    notifs: OneSignalNotif[];
    totalSubscribers: number;
    activeSubscribers: number;
    churnRate: number;
    mediaAbertura: number;
    ticketMedio: number;
    taxaConvGlobal: number;
    melhorHorario: string | null;
    brl: (v: number) => string;
    onAcao: (acao: string) => void;
}

const CORES = {
    critico: { cor: '#991b1b', bg: '#fef2f2', border: '#fecaca' },
    aviso:   { cor: '#92400e', bg: '#fffbeb', border: '#fde68a' },
    ok:      { cor: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
    dica:    { cor: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
};

type Nivel = keyof typeof CORES;

interface Insight {
    nivel: Nivel;
    icon: string;
    titulo: string;
    detalhe: string;
    acao?: { label: string; key: string };
    cor: string; bg: string; border: string;
}

function buildInsights(props: Props): Insight[] {
    const { notifs, totalSubscribers, activeSubscribers, churnRate, mediaAbertura, ticketMedio, taxaConvGlobal, melhorHorario, brl } = props;
    const list: Insight[] = [];

    if (totalSubscribers > 10 && churnRate > 40) {
        list.push({ nivel: 'critico', icon: '🚨', titulo: `Churn crítico: ${churnRate}% inativos`, detalhe: 'Mais de 40% da sua base bloqueou as notificações. Reduza a frequência de envio imediatamente.', acao: { label: 'Criar campanha de reativação', key: 'reativar' }, ...CORES.critico });
    } else if (totalSubscribers > 10 && churnRate > 25) {
        list.push({ nivel: 'aviso', icon: '⚠️', titulo: `Churn elevado: ${churnRate}% inativos`, detalhe: 'Considere enviar menos campanhas por semana e personalizar mais as mensagens.', ...CORES.aviso });
    }

    if (notifs.length >= 3 && mediaAbertura < 3) {
        const pior = [...notifs].sort((a, b) => a.taxa_abertura - b.taxa_abertura)[0];
        list.push({ nivel: 'critico', icon: '📉', titulo: `CTR médio muito baixo: ${mediaAbertura}%`, detalhe: `A pior campanha foi "${pior.title}" com ${pior.taxa_abertura}%. Teste títulos com urgência.`, acao: { label: 'Criar teste A/B de título', key: 'ab' }, ...CORES.critico });
    } else if (notifs.length >= 3 && mediaAbertura < 5) {
        list.push({ nivel: 'aviso', icon: '📊', titulo: `CTR abaixo da média do setor: ${mediaAbertura}%`, detalhe: 'Experimente Rich Push com imagens e botões de ação para aumentar engajamento.', acao: { label: 'Criar campanha com imagem', key: 'richpush' }, ...CORES.aviso });
    } else if (notifs.length >= 3 && mediaAbertura >= 10) {
        list.push({ nivel: 'ok', icon: '🔥', titulo: `CTR excelente: ${mediaAbertura}% — acima da média!`, detalhe: 'Sua audiência está muito engajada. Continue com este estilo e considere aumentar a frequência.', ...CORES.ok });
    }

    if (melhorHorario && Math.abs(new Date().getHours() - parseInt(melhorHorario)) > 3) {
        list.push({ nivel: 'dica', icon: '⏰', titulo: `Melhor horário: ${melhorHorario} — você ainda não está aproveitando`, detalhe: `Seu público abre mais notificações às ${melhorHorario}. Agende para esse horário e espere CTR até 2x maior.`, acao: { label: 'Agendar campanha para este horário', key: 'agendar' }, ...CORES.dica });
    }

    if (notifs.length > 0) {
        const ctrRecente = notifs.slice(0, 3).reduce((a, n) => a + n.taxa_abertura, 0) / Math.min(3, notifs.length);
        if (mediaAbertura > 0 && ctrRecente < mediaAbertura * 0.7) {
            list.push({ nivel: 'aviso', icon: '📌', titulo: 'Últimas campanhas abaixo da sua média histórica', detalhe: `CTR recente: ${ctrRecente.toFixed(1)}% vs média: ${mediaAbertura}%. Hora de testar novos copies.`, acao: { label: 'Criar teste A/B', key: 'ab' }, ...CORES.aviso });
        }
    }

    if (activeSubscribers > 0 && activeSubscribers < 50) {
        list.push({ nivel: 'dica', icon: '🌱', titulo: `Base pequena: ${activeSubscribers} subscribers ativos`, detalhe: 'Foque em capturar mais opt-ins antes de escalar. Ative o FAB e o banner de notificação.', ...CORES.dica });
    }

    if (ticketMedio > 0 && notifs.length > 0) {
        const totalCliques = notifs.reduce((a, n) => a + n.opened, 0);
        const receitaEst = Math.round(totalCliques * (taxaConvGlobal / 100) * ticketMedio);
        if (receitaEst > 0) {
            list.push({ nivel: 'ok', icon: '💰', titulo: `Receita estimada via push: ${brl(receitaEst)}`, detalhe: `${totalCliques} cliques × ${taxaConvGlobal}% conversão × ${brl(ticketMedio)} ticket médio. Média de ${brl(Math.round(receitaEst / notifs.length))} por campanha.`, ...CORES.ok });
        }
    }

    if (notifs.length === 0 && activeSubscribers > 0) {
        list.push({ nivel: 'dica', icon: '🚀', titulo: `Você tem ${activeSubscribers} subscribers mas nenhuma campanha enviada`, detalhe: 'Sua base está esperando! Comece com um template pronto.', acao: { label: 'Criar primeira campanha', key: 'campanha' }, ...CORES.dica });
    }

    return list;
}

export function CoachInsights(props: Props) {
    const insights = buildInsights(props);
    if (insights.length === 0) return (
        <div style={{ padding: '16px', textAlign: 'center', color: C.textSoft, fontSize: '13px' }}>
            Dados insuficientes para gerar insights. Envie campanhas para começar.
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {insights.map((ins, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 14px', background: ins.bg, border: `1px solid ${ins.border}`, borderRadius: '8px' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{ins.icon}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: ins.cor, marginBottom: '2px' }}>{ins.titulo}</div>
                        <div style={{ fontSize: '12px', color: C.textMid, lineHeight: 1.5 }}>{ins.detalhe}</div>
                        {ins.acao && (
                            <button onClick={() => props.onAcao(ins.acao!.key)} style={{ marginTop: '8px', padding: '4px 12px', borderRadius: '6px', border: `1px solid ${ins.cor}`, background: C.white, color: ins.cor, fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                                → {ins.acao.label}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
