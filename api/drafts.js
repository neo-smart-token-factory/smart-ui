import sql from '../lib/db.js';

export default async function handler(req, res) {
    if (!sql) {
        return res.status(503).json({ error: "Database connection not authenticated" });
    }

    // GET: Load draft
    if (req.method === 'GET') {
        const { address } = req.query;
        if (!address) return res.status(400).json({ error: "Address required" });

        try {
            const drafts = await sql`
        SELECT token_config FROM drafts 
        WHERE user_address = ${address} 
        LIMIT 1
      `;

            if (drafts.length > 0) {
                return res.status(200).json(drafts[0].token_config);
            }
            return res.status(404).json({ error: "No draft found" });
        } catch {
            return res.status(500).json({ error: "Fetch error" });
        }
    }

    // POST: Save draft
    if (req.method === 'POST') {
        const { user_address, token_config, lead_id, session_id } = req.body;

        try {
            // Upsert logic for PostgreSQL (com suporte a lead_id e session_id)
            await sql`
        INSERT INTO drafts (user_address, token_config, lead_id, session_id, updated_at)
        VALUES (${user_address}, ${token_config ? JSON.stringify(token_config) : null}::jsonb, ${lead_id ? parseInt(lead_id) : null}, ${session_id || null}, NOW())
        ON CONFLICT (user_address) 
        DO UPDATE SET 
          token_config = ${token_config ? JSON.stringify(token_config) : null}::jsonb, 
          lead_id = COALESCE(${lead_id ? parseInt(lead_id) : null}, drafts.lead_id),
          session_id = COALESCE(${session_id || null}, drafts.session_id),
          updated_at = NOW()
      `;

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Draft Save Error:", error);
            return res.status(500).json({ error: "Failed to save draft" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
