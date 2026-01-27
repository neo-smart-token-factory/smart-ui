import sql from '../lib/db.js';

/**
 * NΞØ Protocol Ops Hub (Consolidated)
 * Action-based routing for deploys, drafts, and system status.
 */
export default async function handler(req, res) {
    const action = req.query.action || req.body?.action;

    try {
        switch (action) {
            // --- SYSTEM STATUS ---
            case 'status':
                return await handleStatus(req, res);

            // --- DEPLOYS ---
            case 'deploys':
                return await handleDeploys(req, res);

            // --- DRAFTS ---
            case 'drafts':
                return await handleDrafts(req, res);

            default:
                // Backward compatibility fallback
                if (req.method === 'GET' && req.url.includes('ops-status')) return await handleStatus(req, res);

                return res.status(400).json({ error: "Action parameter is required (e.g., ?action=status)" });
        }
    } catch (error) {
        console.error(`[Ops Hub] Error in ${action || 'unknown'}:`, error);
        return res.status(500).json({ error: "Internal server error", message: error.message });
    }
}

// --- Handlers ---

async function handleStatus(req, res) {
    const opsState = {
        version: process.env.VITE_APP_VERSION || "0.5.5",
        codename: process.env.VITE_APP_CODENAME || "MULTICHAIN FOUNDATION",
        status: "operational",
        components: {
            "Core Engine": { status: "completed", notes: "Core deployed and verified." },
            "Web3 Integration": { status: "completed", notes: "Dynamic v4 modular SDK live." },
            "AI Intelligence": { status: "completed", notes: "Tavily & Modal.com active." },
            "Database Sync": { status: "completed", notes: "Neon Postgres operational." }
        }
    };
    return res.status(200).json(opsState);
}

async function handleDeploys(req, res) {
    if (!sql) return res.status(503).json({ error: "DB not available" });

    if (req.method === 'GET') {
        const deploys = await sql`SELECT * FROM deploys ORDER BY created_at DESC LIMIT 50`;
        return res.status(200).json(deploys);
    }

    if (req.method === 'POST') {
        const { contract_address, owner_address, network, tx_hash, token_name, token_symbol, lead_id, session_id } = req.body;
        if (!contract_address || !owner_address) return res.status(400).json({ error: "Missing fields" });

        await sql`
      INSERT INTO deploys (contract_address, owner_address, network, tx_hash, token_name, token_symbol, lead_id, session_id)
      VALUES (${contract_address}, ${owner_address}, ${network}, ${tx_hash}, ${token_name}, ${token_symbol}, ${lead_id ? parseInt(lead_id) : null}, ${session_id || null})
    `;
        return res.status(201).json({ success: true });
    }
}

async function handleDrafts(req, res) {
    if (!sql) return res.status(503).json({ error: "DB not available" });

    if (req.method === 'GET') {
        const { address } = req.query;
        if (!address) return res.status(400).json({ error: "Address required" });
        const drafts = await sql`SELECT token_config FROM drafts WHERE user_address = ${address} LIMIT 1`;
        return drafts.length > 0 ? res.status(200).json(drafts[0].token_config) : res.status(404).json({ error: "No draft" });
    }

    if (req.method === 'POST') {
        const { user_address, token_config, lead_id, session_id } = req.body;
        await sql`
      INSERT INTO drafts (user_address, token_config, lead_id, session_id, updated_at)
      VALUES (${user_address}, ${token_config ? JSON.stringify(token_config) : null}::jsonb, ${lead_id ? parseInt(lead_id) : null}, ${session_id || null}, NOW())
      ON CONFLICT (user_address) DO UPDATE SET 
        token_config = EXCLUDED.token_config, 
        lead_id = COALESCE(EXCLUDED.lead_id, drafts.lead_id),
        session_id = COALESCE(EXCLUDED.session_id, drafts.session_id),
        updated_at = NOW()
    `;
        return res.status(200).json({ success: true });
    }
}
