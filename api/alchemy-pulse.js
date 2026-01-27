
// API Route: /api/alchemy-pulse
// Proxy for Alchemy blockchain data

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
    if (!alchemyId) {
        return res.status(500).json({ error: 'Alchemy ID not configured' });
    }

    try {
        // Fetch from Base Mainnet
        const url = `https://base-mainnet.g.alchemy.com/v2/${alchemyId}`;

        // 1. Get Block Number
        // 2. Get Gas Price
        const [blockRes, gasRes] = await Promise.all([
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
            }),
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'eth_gasPrice', params: [] })
            })
        ]);

        const blockData = await blockRes.json();
        const gasData = await gasRes.json();

        return res.status(200).json({
            blockNumber: parseInt(blockData.result, 16),
            gasPriceGwei: Math.round(parseInt(gasData.result, 16) / 1e9 * 100) / 100,
            network: 'Base Mainnet',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Alchemy Proxy Error:', error);
        return res.status(500).json({ error: 'Failed to fetch pulse from Alchemy' });
    }
}
