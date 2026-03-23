// ─── TODOS OS TIPOS DO MÓDULO DE CAMPANHAS ────────────────────────────────────

export interface PushCampaign {
    title: string;
    message: string;
    url: string;
    image_url?: string;
    btn1_text?: string;
    btn1_url?: string;
    btn2_text?: string;
    btn2_url?: string;
    filter_behavior?: string;
    intelligent_delivery?: boolean;
    filter_device?: string;
    filter_country?: string;
    send_after?: string;
    frequency_limit?: number;
}

export interface ABTestItem {
    id: number;
    title_a: string; message_a: string;
    title_b: string; message_b: string;
    sent_a: number; sent_b: number;
    opened_a: number; opened_b: number;
    ctr_a: number; ctr_b: number;
    vencedor: string | null;
    status: string;
    created_at: string;
}

export interface ABTestForm {
    title_a: string; message_a: string;
    title_b: string; message_b: string;
    url: string;
    image_url?: string;
    filter_behavior?: string;
    filter_device?: string;
    filter_country?: string;
    intelligent_delivery?: boolean;
    auto_escalar?: boolean;
    horas_avaliacao?: number;
}

export interface JornadaSubscriber {
    visitor_id: string;
    clicked_at: string;
    converted: boolean;
    converted_at: string | null;
    revenue: number | null;
}

export interface JornadaNotif {
    notif_id: string;
    titulo: string;
    mensagem: string;
    enviados: number;
    cliques: number;
    convertidos: number;
    taxa_conversao: number;
    receita_atribuida: number;
    subscribers: JornadaSubscriber[];
}

export interface JornadaResumo {
    total_cliques: number;
    total_convertidos: number;
    taxa_conversao: number;
    receita_atribuida: number;
}

export interface ScoreVisitor {
    visitor_id: string;
    ultima_visita: string;
    comprador: boolean;
    carrinho_ativo: boolean;
}

export interface ScoreGrupo {
    id: string;
    label: string;
    cor: string;
    corBg: string;
    desc: string;
    count: number;
    pct: number;
    segmento_os: string;
    visitors: ScoreVisitor[];
}

export interface ScoreData {
    total_visitors: number;
    grupos: ScoreGrupo[];
}

export interface DeepLinkProduto {
    product_id: string;
    variant_id: string;
    nome: string;
    preco: string | null;
    visitas: number;
    ultima_visita: string;
    url: string;
}

export interface DeepLinkPagina {
    pagina: string;
    visitas: number;
    label: string;
}

export interface DeepLinkData {
    produtos_visitados: DeepLinkProduto[];
    paginas_produto: DeepLinkPagina[];
    carrinhos_ativos: { visitor_id: string; cart_total: number | null; cart_count: number; url: string }[];
}

export interface PushHistoryItem {
    id: number;
    title: string;
    message: string;
    url: string;
    sent_count: number;
    created_at: string;
}

export interface OneSignalNotif {
    id: string;
    title: string;
    message: string;
    url: string;
    image_url?: string;
    sent: number;
    opened: number;
    failed: number;
    confirmed_deliveries: number;
    taxa_abertura: number;
    created_at: number;
}

export interface PorPais { pais: string; count: number; pct: number; }
export interface PorDispositivo { dispositivo: string; count: number; pct: number; }

export interface OneSignalStats {
    subscribers: number;
    active_subscribers: number;
    instalacoes: number;
    taxa_optin: number;
    por_pais: PorPais[];
    por_dispositivo: PorDispositivo[];
    notifications: OneSignalNotif[];
}

export interface AutomacaoConfig {
    passo1_ativo: boolean; passo1_horas: number; passo1_titulo: string; passo1_mensagem: string;
    passo2_ativo: boolean; passo2_horas: number; passo2_titulo: string; passo2_mensagem: string;
    passo3_ativo: boolean; passo3_horas: number; passo3_titulo: string; passo3_mensagem: string;
    passo3_cupom?: string;
    produto_visitado_ativo: boolean;
    produto_visitado_horas: number;
    produto_visitado_titulo: string;
    produto_visitado_mensagem: string;
    inativo_ativo: boolean;
    inativo_dias: number;
    inativo_titulo: string;
    inativo_mensagem: string;
}

export type ObjetivoCampanha = 'venda' | 'carrinho' | 'reativar' | 'engajamento' | null;

export interface ObjetivoConfig {
    id: ObjetivoCampanha;
    icon: string;
    label: string;
    desc: string;
    cor: string;
    corBg: string;
    corBorder: string;
    funil: 'fundo' | 'meio' | 'topo';
    funilLabel: string;
    segmento: string;
    templates: Array<{ label: string; title: string; msg: string }>;
}

export interface TabCampaignsProps {
    stats: any;
    pushForm: PushCampaign;
    setPushForm: (f: PushCampaign) => void;
    handleSendPush: () => void;
    sendingPush: boolean;
    token: string | null;
    API_URL: string;
}
