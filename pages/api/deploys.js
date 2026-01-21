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
    const { contract_address, owner_address, network, tx_hash, status, token_name, token_symbol } = req.body;

    if (!contract_address || !owner_address || !tx_hash) {
      return res.status(400).json({ error: 'Missing deployment data' });
    }

    try {
      await sql`
        INSERT INTO deploys (contract_address, owner_address, network, tx_hash, status, token_name, token_symbol, deployed_at)
        VALUES (${contract_address}, ${owner_address}, ${network}, ${tx_hash}, ${status}, ${token_name}, ${token_symbol}, NOW())
      `;
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to record deployment' });
    }
  }

  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT * FROM deploys 
        ORDER BY deployed_at DESC 
        LIMIT 50
      `;
      return res.status(200).json(result);
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch deployments' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
