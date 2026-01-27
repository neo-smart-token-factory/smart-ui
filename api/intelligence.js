import {
    searchTavily,
    extractTrends,
    identifyMarketGaps,
    generateSuggestions,
    validateTokenNameInput,
    extractTokenomics
} from '../lib/tavily.js';

/**
 * NΞØ Intelligence API (Consolidated)
 * Action-based routing to stay within Vercel limits.
 */
export default async function handler(req, res) {
    const { action } = req.query || req.body;

    // Se for GET para alchemy-pulse (Mover logic de alchemy aqui para economizar 1 função)
    if (req.method === 'GET' && (!action || action === 'alchemy-pulse')) {
        try {
            const ALCHEMY_ID = process.env.VITE_ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID;

            if (!ALCHEMY_ID) {
                return res.status(200).json({
                    gasPriceGwei: '0.01',
                    blockNumber: '41343573',
                    status: 'simulated'
                });
            }

            const response = await fetch(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_gasPrice',
                    params: []
                })
            });

            const data = await response.json();
            const gasPriceGwei = (parseInt(data.result, 16) / 1e9).toFixed(4);

            const blockResponse = await fetch(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 2,
                    method: 'eth_blockNumber',
                    params: []
                })
            });

            const blockData = await blockResponse.json();
            const blockNumber = parseInt(blockData.result, 16);

            return res.status(200).json({
                gasPriceGwei,
                blockNumber,
                status: 'live'
            });
        } catch {
            return res.status(200).json({
                gasPriceGwei: '0.01',
                blockNumber: '41343573',
                status: 'fallback'
            });
        }
    }

    // Apenas POST permitido para as demais ações de inteligência
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        switch (action) {
            case 'market-research':
                return await handleMarketResearch(req, res);
            case 'marketing-suggestions':
                return await handleMarketingSuggestions(req, res);
            case 'validate-token-name':
                return await handleValidateTokenName(req, res);
            case 'generate-whitepaper-base':
                return await handleGenerateWhitepaper(req, res);
            default:
                return res.status(400).json({ error: 'Invalid or missing action' });
        }
    } catch (err) {
        console.error('Intelligence API Error:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
}

async function handleMarketResearch(req, res) {
    const { category, keywords } = req.body;
    const query = `${category || ''} ${keywords || ''} token launch trends 2026 cryptocurrency`.trim();
    const data = await searchTavily(query, { search_depth: 'advanced', include_answer: true, max_results: 15 });

    return res.status(200).json({
        trends: extractTrends(data.answer || ''),
        competitors: (data.results || []).slice(0, 5).map(result => ({
            name: result.title,
            url: result.url,
            relevance: result.score || 0,
            snippet: result.content?.substring(0, 150) || '',
        })),
        marketGaps: identifyMarketGaps(data.answer || ''),
        summary: data.answer || '',
        totalResults: data.results?.length || 0,
    });
}

async function handleMarketingSuggestions(req, res) {
    const { tokenName, category } = req.body;
    const query = `${category || ''} token launch marketing strategy social media campaigns 2026 ${tokenName}`.trim();
    const data = await searchTavily(query, {
        search_depth: 'advanced',
        include_answer: true,
        max_results: 20,
        include_domains: ['twitter.com', 'reddit.com', 'medium.com', 'coindesk.com', 'cointelegraph.com'],
    });

    return res.status(200).json({
        summary: data.answer?.substring(0, 500) || '',
        totalResults: data.results?.length || 0,
        // Nota: Lógica detalhada de extração (extrairSocialMediaStrategies, etc) 
        // pode ser movida para utils.js se ficar muito grande aqui.
        // Simplificando para o merge:
        message: "Data processed from Tavily",
        rawAnswer: data.answer
    });
}

async function handleValidateTokenName(req, res) {
    const { tokenName, symbol } = req.body;
    validateTokenNameInput(tokenName, symbol);
    const query = `token ${tokenName} ${symbol} cryptocurrency blockchain coin`;
    const data = await searchTavily(query, { search_depth: 'basic', include_answer: true, max_results: 10 });

    const conflicts = (data.results || []).filter(result => {
        const titleLower = (result.title || '').toLowerCase();
        return titleLower.includes(tokenName.toLowerCase()) || titleLower.includes(symbol.toLowerCase());
    }).map(c => ({ title: c.title, url: c.url, score: c.score }));

    return res.status(200).json({
        valid: conflicts.length === 0,
        conflicts,
        suggestions: conflicts.length > 0 ? generateSuggestions(tokenName, symbol) : [],
        totalResults: data.results?.length || 0,
    });
}

async function handleGenerateWhitepaper(req, res) {
    const { tokenName, category } = req.body;
    const query = `${tokenName} ${category || ''} tokenomics useCase targetAudience`.trim();
    const data = await searchTavily(query, { search_depth: 'advanced', include_answer: true, max_results: 10 });

    return res.status(200).json({
        introduction: data.answer || '',
        tokenomics: extractTokenomics(data.answer || ''),
        generatedAt: new Date().toISOString(),
    });
}
