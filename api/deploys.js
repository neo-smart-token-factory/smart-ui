import sql from '../lib/db.js';

export default async function handler(req, res) {
    if (!sql) {
        return res.status(503).json({ error: "Database connection not authenticated" });
    }

    // GET: Fetch recent deploys
    if (req.method === 'GET') {
        try {
            const deploys = await sql`
        SELECT * FROM deploys 
        ORDER BY created_at DESC 
        LIMIT 50
      `;
            return res.status(200).json(deploys);
        } catch (error) {
            console.error("DB Error:", error);
            // Return empty array on error to not break frontend
            return res.status(200).json([]);
        }
    }

    // POST: Record new deploy
    if (req.method === 'POST') {
        const { contract_address, owner_address, network, tx_hash, token_name, token_symbol, lead_id, session_id } = req.body;

        try {
            if (!contract_address || !owner_address) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            await sql`
        INSERT INTO deploys (contract_address, owner_address, network, tx_hash, token_name, token_symbol, lead_id, session_id)
        VALUES (${contract_address}, ${owner_address}, ${network}, ${tx_hash}, ${token_name}, ${token_symbol}, ${lead_id ? parseInt(lead_id) : null}, ${session_id || null})
      `;

            return res.status(201).json({ success: true });
        } catch (error) {
            console.error("Insert Error:", error);
            return res.status(500).json({ error: "Failed to record deploy" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
