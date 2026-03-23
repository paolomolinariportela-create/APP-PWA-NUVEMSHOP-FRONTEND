import { AutomacaoConfig, ObjetivoConfig } from './types';

export const OBJETIVOS: ObjetivoConfig[] = [
    {
        id: 'venda',
        icon: '💰',
        label: 'Gerar Venda',
        desc: 'Ofertas e promoções para converter agora',
        cor: '#059669', corBg: '#f0fdf4', corBorder: '#86efac',
        funil: 'fundo', funilLabel: 'Fundo de funil', segmento: '',
        templates: [
            { label: 'Black Friday', title: 'Black Friday chegou!', msg: 'Ate 70% OFF so hoje. Aproveite antes que acabe!' },
            { label: 'Frete Gratis', title: 'Frete GRATIS hoje!', msg: 'Aproveite frete gratis em todos os pedidos. So hoje!' },
            { label: 'Desconto VIP', title: 'Oferta exclusiva para voce!', msg: 'Como cliente especial, preparamos 15% OFF. Use o cupom VIP15.' },
            { label: 'Flash Sale', title: 'Oferta relampago! ⚡', msg: 'So nas proximas 2 horas: 20% OFF em tudo. Corre!' },
        ],
    },
    {
        id: 'carrinho',
        icon: '🛒',
        label: 'Recuperar Carrinho',
        desc: 'Resgatar clientes que abandonaram',
        cor: '#d97706', corBg: '#fffbeb', corBorder: '#fde68a',
        funil: 'meio', funilLabel: 'Meio de funil', segmento: 'non_buyers',
        templates: [
            { label: 'Carrinho', title: 'Seu carrinho te espera!', msg: 'Voce deixou itens no carrinho. Finalize agora com frete gratis.' },
            { label: 'Estoque', title: 'Ultimas unidades!', msg: 'O produto no seu carrinho esta acabando. Garanta o seu agora.' },
            { label: 'Cupom', title: 'Presente especial para voce 🎁', msg: 'Seu carrinho ainda esta salvo! Use VOLTA10 e ganhe 10% OFF.' },
        ],
    },
    {
        id: 'reativar',
        icon: '🔄',
        label: 'Reativar Cliente',
        desc: 'Trazer de volta quem sumiu',
        cor: '#7c3aed', corBg: '#f5f3ff', corBorder: '#c4b5fd',
        funil: 'topo', funilLabel: 'Topo de funil', segmento: 'buyers',
        templates: [
            { label: 'Saudades', title: 'Saudades de voce!', msg: 'Faz um tempo que nao te vemos. Temos novidades esperando por voce.' },
            { label: 'Novidades', title: 'Novidades chegaram! 🆕', msg: 'Produtos novos que voce vai amar acabaram de chegar. Confira!' },
            { label: 'VIP', title: 'Voce e especial para nos 💜', msg: 'Como cliente VIP, preparamos algo exclusivo. Clique para ver.' },
        ],
    },
    {
        id: 'engajamento',
        icon: '📣',
        label: 'Engajamento',
        desc: 'Visitas, conteúdo e lembretes',
        cor: '#2563eb', corBg: '#eff6ff', corBorder: '#bfdbfe',
        funil: 'topo', funilLabel: 'Topo de funil', segmento: '',
        templates: [
            { label: 'Novidade', title: 'Novidade no App! 🎉', msg: 'Temos uma novidade especial esperando por voce. Clique e descubra.' },
            { label: 'Lembrete', title: 'Ja visitou nossa loja hoje?', msg: 'Confira os destaques do dia e aproveite as melhores ofertas.' },
            { label: 'Evento', title: 'Evento especial amanha! ⏰', msg: 'Nao perca nossa liquidacao relampago amanha as 10h. Marque na agenda!' },
        ],
    },
];

export const FUNIL_COLORS: Record<string, string> = {
    fundo: '#059669',
    meio:  '#d97706',
    topo:  '#2563eb',
};

export const AUTOMACAO_DEFAULT: AutomacaoConfig = {
    passo1_ativo: true,  passo1_horas: 1,
    passo1_titulo: 'Seus itens estao te esperando!',
    passo1_mensagem: 'Voce deixou alguns itens no carrinho. Que tal finalizar sua compra?',
    passo2_ativo: true,  passo2_horas: 24,
    passo2_titulo: 'Seus itens estao acabando!',
    passo2_mensagem: 'O estoque e limitado! Garanta os seus itens antes que esgotem.',
    passo3_ativo: false, passo3_horas: 48,
    passo3_titulo: 'Ultimo aviso! Oferta especial para voce.',
    passo3_mensagem: 'Seu carrinho ainda esta salvo. Use o cupom abaixo para ganhar desconto!',
    passo3_cupom: '',
    produto_visitado_ativo: false, produto_visitado_horas: 2,
    produto_visitado_titulo: 'Voce ainda esta interessado?',
    produto_visitado_mensagem: 'O produto que voce viu ainda esta disponivel. Garanta o seu antes que acabe!',
    inativo_ativo: false, inativo_dias: 7,
    inativo_titulo: 'Saudades de voce!',
    inativo_mensagem: 'Faz um tempo que nao te vemos. Temos novidades e ofertas esperando por voce.',
};

export const AB_FORM_DEFAULT = {
    title_a: '', message_a: '',
    title_b: '', message_b: '',
    url: '/',
    auto_escalar: true,
    horas_avaliacao: 4,
};

export const FLAG: Record<string, string> = {
    BR: '🇧🇷', US: '🇺🇸', PT: '🇵🇹', AR: '🇦🇷', MX: '🇲🇽',
    CO: '🇨🇴', CL: '🇨🇱', PE: '🇵🇪', UY: '🇺🇾', GB: '🇬🇧',
};

export const PAIS_NOME: Record<string, string> = {
    BR: 'Brasil', US: 'EUA', PT: 'Portugal', AR: 'Argentina', MX: 'Mexico',
    CO: 'Colombia', CL: 'Chile', PE: 'Peru', UY: 'Uruguai', GB: 'Reino Unido',
};

export const HORAS_OPCOES = [
    { label: '30 minutos', value: 0.5 }, { label: '1 hora', value: 1 },
    { label: '2 horas', value: 2 },     { label: '3 horas', value: 3 },
    { label: '6 horas', value: 6 },     { label: '12 horas', value: 12 },
    { label: '24 horas', value: 24 },   { label: '48 horas', value: 48 },
    { label: '72 horas', value: 72 },
];

export const DISP_COLORS: Record<string, string> = {
    Android: '#22c55e', iOS: '#3b82f6', Web: '#8b5cf6',
};

export const TEMPLATES_DEFAULT = [
    { label: 'Black Friday', title: 'Black Friday chegou!', msg: 'Ate 70% OFF so hoje. Aproveite antes que acabe!' },
    { label: 'Carrinho',     title: 'Seu carrinho te espera!', msg: 'Voce deixou itens no carrinho. Finalize agora com frete gratis.' },
    { label: 'Frete Gratis', title: 'Frete GRATIS hoje!', msg: 'Aproveite frete gratis em todos os pedidos. So hoje!' },
    { label: 'Desconto VIP', title: 'Oferta exclusiva para voce!', msg: 'Como cliente especial, preparamos 15% OFF. Use o cupom VIP15.' },
    { label: 'Estoque',      title: 'Ultimas unidades!', msg: 'O produto que voce viu esta acabando. Garanta o seu agora.' },
    { label: 'Saudades',     title: 'Saudades de voce!', msg: 'Faz um tempo que nao te vemos. Temos novidades esperando por voce.' },
];
