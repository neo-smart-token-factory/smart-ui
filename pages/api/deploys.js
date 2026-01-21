import sql from '../../lib/db';

// Basic sanitization to prevent XSS in stored data
const sanitize = (str) => typeof str === 'string' ? str.replace(/[<>]/g, '') : str;

export default async function handler(req, res) {
  // Database fallback
  if (!sql) {
    if (req.method === 'GET') return res.status(200).json([]);
    return res.status(200).json({ success: true, message: 'Offline mode' });
  }

  if (req.method === 'POST') {
    const {
      contract_address,
      owner_address,
      network,
      tx_hash,
      status,
      token_name,
      token_symbol
    } = req.body;

    // Strict validation
    if (!contract_address?.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid contract address format' });
    }
    if (!owner_address?.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid owner address format' });
    }
    if (!tx_hash?.match(/^0x[a-fA-F0-9]{64}$/)) {
      return res.status(400).json({ error: 'Invalid transaction hash format' });
    }

    try {
      await sql`
        INSERT INTO deploys (
          contract_address, 
          owner_address, 
          network, 
          tx_hash, 
          status, 
          token_name, 
          token_symbol, 
          deployed_at
        )
        VALUES (
          ${contract_address.toLowerCase()}, 
          ${owner_address.toLowerCase()}, 
          ${sanitize(network)}, 
          ${tx_hash.toLowerCase()}, 
          ${sanitize(status || 'success')}, 
          ${sanitize(token_name)}, 
          ${sanitize(token_symbol)}, 
          NOW()
        )
      `;
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error('[DATABASE_ERROR] deploys.js POST:', error);
      return res.status(500).json({ error: 'Critical database failure' });
    }
  }

  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT id, contract_address, network, token_name, token_symbol, deployed_at 
        FROM deploys 
        ORDER BY deployed_at DESC 
        LIMIT 50
      `;
      return res.status(200).json(result);
    } catch (error) {
      console.error('[DATABASE_ERROR] deploys.js GET:', error);
      return res.status(500).json({ error: 'Failed to synchronize history' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

