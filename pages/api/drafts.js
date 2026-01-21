import sql from '../../lib/db';

export default async function handler(req, res) {
  // Se o banco não estiver configurado, retorna dados mockados
  if (!sql) {
    if (req.method === 'GET') {
      return res.status(200).json([]);
    }
    return res.status(200).json({ success: true, message: 'Database not configured - running in offline mode' });
  }

  if (req.method === 'POST') {
    const { user_address, token_config } = req.body;

    if (!user_address || !token_config) {
      return res.status(400).json({ error: 'Missing address or config' });
    }

    try {
      await sql`
        INSERT INTO drafts (user_address, token_config, updated_at)
        VALUES (${user_address}, ${JSON.stringify(token_config)}, NOW())
        ON CONFLICT (user_address)
        DO UPDATE SET token_config = EXCLUDED.token_config, updated_at = NOW()
      `;
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to save draft' });
    }
  }

  if (req.method === 'GET') {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }

    try {
      const result = await sql`
        SELECT token_config FROM drafts WHERE user_address = ${address}
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'No draft found' });
      }

      return res.status(200).json(result[0].token_config);
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch draft' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
