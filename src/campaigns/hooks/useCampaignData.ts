import { useState, useEffect } from 'react';
import { PushHistoryItem, OneSignalStats, AutomacaoConfig, ABTestItem, ABTestForm, DeepLinkData } from '../types';
import { AUTOMACAO_DEFAULT, AB_FORM_DEFAULT } from '../constants';

interface Options {
    token: string | null;
    API_URL: string;
    sendingPush: boolean;
}

export function useCampaignData({ token, API_URL, sendingPush }: Options) {
    const [history, setHistory] = useState<PushHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [osStats, setOsStats] = useState<OneSignalStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    const [automacao, setAutomacao] = useState<AutomacaoConfig>(AUTOMACAO_DEFAULT);
    const [loadingAutomacao, setLoadingAutomacao] = useState(false);
    const [savingAutomacao, setSavingAutomacao] = useState(false);

    const [abTests, setAbTests] = useState<ABTestItem[]>([]);
    const [loadingAB, setLoadingAB] = useState(false);
    const [abForm, setAbForm] = useState<ABTestForm>(AB_FORM_DEFAULT);
    const [sendingAB, setSendingAB] = useState(false);

    const [deepLinkData, setDeepLinkData] = useState<DeepLinkData | null>(null);
    const [loadingDeepLink, setLoadingDeepLink] = useState(false);

    const auth = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchHistory = () => {
        if (!token) return;
        setLoadingHistory(true);
        fetch(`${API_URL}/push/history`, { headers: auth })
            .then(r => r.json()).then(d => setHistory(Array.isArray(d) ? d : [])).catch(() => setHistory([])).finally(() => setLoadingHistory(false));
    };

    const fetchOsStats = () => {
        if (!token) return;
        setLoadingStats(true);
        fetch(`${API_URL}/push/stats`, { headers: auth })
            .then(r => r.json()).then(d => setOsStats(d)).catch(() => setOsStats(null)).finally(() => setLoadingStats(false));
    };

    const fetchAutomacao = () => {
        if (!token) return;
        setLoadingAutomacao(true);
        fetch(`${API_URL}/automacao/config`, { headers: auth })
            .then(r => r.json()).then(d => setAutomacao({ ...AUTOMACAO_DEFAULT, ...d })).catch(() => {}).finally(() => setLoadingAutomacao(false));
    };

    const fetchABTests = () => {
        if (!token) return;
        setLoadingAB(true);
        fetch(`${API_URL}/push/ab-list`, { headers: auth })
            .then(r => r.json()).then(d => setAbTests(Array.isArray(d) ? d : [])).catch(() => setAbTests([])).finally(() => setLoadingAB(false));
    };

    const fetchDeepLinks = () => {
        if (!token || deepLinkData) return;
        setLoadingDeepLink(true);
        fetch(`${API_URL}/analytics/deep-links`, { headers: auth })
            .then(r => r.json()).then(d => setDeepLinkData(d)).catch(() => {}).finally(() => setLoadingDeepLink(false));
    };

    const fetchAll = () => { fetchHistory(); fetchOsStats(); fetchABTests(); };

    const saveAutomacao = async (): Promise<boolean> => {
        if (!token) return false;
        setSavingAutomacao(true);
        try {
            await fetch(`${API_URL}/automacao/config`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...auth }, body: JSON.stringify(automacao) });
            return true;
        } catch { return false; } finally { setSavingAutomacao(false); }
    };

    const sendABTest = async (): Promise<{ ok: boolean; activeSubTab?: string }> => {
        if (!token) return { ok: false };
        setSendingAB(true);
        try {
            const res = await fetch(`${API_URL}/push/send-ab`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...auth }, body: JSON.stringify(abForm) });
            const data = await res.json();
            if (data.status === 'success' || data.status === 'partial_error') {
                setAbForm(AB_FORM_DEFAULT);
                fetchABTests();
                return { ok: true, activeSubTab: 'ab' };
            }
            return { ok: false };
        } catch { return { ok: false }; } finally { setSendingAB(false); }
    };

    const refreshABTest = async (id: number) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/push/ab-results/${id}`, { headers: auth });
            const data = await res.json();
            setAbTests(prev => prev.map(t => t.id === id ? { ...t, sent_a: data.variante_a?.sent ?? t.sent_a, sent_b: data.variante_b?.sent ?? t.sent_b, opened_a: data.variante_a?.opened ?? t.opened_a, opened_b: data.variante_b?.opened ?? t.opened_b, ctr_a: data.variante_a?.ctr ?? t.ctr_a, ctr_b: data.variante_b?.ctr ?? t.ctr_b, vencedor: data.vencedor ?? t.vencedor, status: data.status ?? t.status } : t));
        } catch { /* silencioso */ }
    };

    useEffect(() => {
        if (!sendingPush) { fetchHistory(); fetchOsStats(); fetchAutomacao(); fetchABTests(); }
    }, [token, sendingPush]);

    return {
        // dados
        history, loadingHistory,
        osStats, loadingStats,
        automacao, setAutomacao, loadingAutomacao, savingAutomacao,
        abTests, loadingAB, abForm, setAbForm, sendingAB,
        deepLinkData, loadingDeepLink,
        // ações
        fetchHistory, fetchOsStats, fetchABTests, fetchAll,
        fetchDeepLinks, saveAutomacao, sendABTest, refreshABTest,
    };
}
