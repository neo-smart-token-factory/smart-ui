import sql from '../../lib/db';

export default async function handler(req, res) {
  // Database fallback
  if (!sql) {
    if (req.method === 'GET') return res.status(200).json([]);
    return res.status(200).json({ success: true, message: 'Offline mode' });
  }

  if (req.method === 'POST') {
    const { user_address, token_config } = req.body;

    // Strict validation
    if (!user_address?.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    if (!token_config || typeof token_config !== 'object') {
      return res.status(400).json({ error: 'Invalid configuration payload' });
    }

    const normalizedAddress = user_address.toLowerCase();

    try {
      await sql`
        INSERT INTO drafts (user_address, token_config, updated_at)
        VALUES (
          ${normalizedAddress}, 
          ${JSON.stringify(token_config)}, 
          NOW()
        )
        ON CONFLICT (user_address)
        DO UPDATE SET 
          token_config = EXCLUDED.token_config, 
          updated_at = NOW()
      `;
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('[DATABASE_ERROR] drafts.js POST:', error);
      return res.status(500).json({ error: 'Service Unavailable - Draft Save Failed' });
    }
  }

  if (req.method === 'GET') {
    const { address } = req.query;

    if (!address?.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid address query' });
    }

    const normalizedAddress = address.toLowerCase();

    try {
      const result = await sql`
        SELECT token_config FROM drafts WHERE user_address = ${normalizedAddress}
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: 'No draft state found' });
      }

      return res.status(200).json(result[0].token_config);
    } catch (error) {
      console.error('[DATABASE_ERROR] drafts.js GET:', error);
      return res.status(500).json({ error: 'Failed to retrieve cloud state' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

