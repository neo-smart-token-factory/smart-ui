import sql from '../lib/db.js';

export default async function handler(req, res) {
  if (!sql) {
    return res.status(503).json({ error: "Database connection not authenticated" });
  }

  // GET: Buscar lead por session_id ou wallet_address
  if (req.method === 'GET') {
    const { session_id, wallet_address, email } = req.query;

    try {
      let leads;

      if (session_id) {
        leads = await sql`
          SELECT * FROM leads 
          WHERE session_id = ${session_id} 
          ORDER BY created_at DESC 
          LIMIT 1
        `;
      } else if (wallet_address) {
        leads = await sql`
          SELECT * FROM leads 
          WHERE wallet_address = ${wallet_address} 
          ORDER BY created_at DESC 
          LIMIT 1
        `;
      } else if (email) {
        leads = await sql`
          SELECT * FROM leads 
          WHERE email = ${email} 
          ORDER BY created_at DESC 
          LIMIT 1
        `;
      } else {
        return res.status(400).json({ error: "session_id, wallet_address, or email required" });
      }

      if (leads.length > 0) {
        return res.status(200).json(leads[0]);
      }
      return res.status(404).json({ error: "Lead not found" });
    } catch (error) {
      console.error("Lead Fetch Error:", error);
      return res.status(500).json({ error: "Failed to fetch lead" });
    }
  }

  // POST: Criar ou atualizar lead
  if (req.method === 'POST') {
    const {
      session_id,
      email,
      wallet_address,
      ip_address,
      user_agent,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      conversion_status,
      metadata
    } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: "session_id is required" });
    }

    try {
      // Verificar se lead já existe
      const existing = await sql`
        SELECT id FROM leads 
        WHERE session_id = ${session_id} 
        LIMIT 1
      `;

      if (existing.length > 0) {
        // Atualizar lead existente
        const updated = await sql`
          UPDATE leads 
          SET 
            email = COALESCE(${email}, email),
            wallet_address = COALESCE(${wallet_address}, wallet_address),
            ip_address = COALESCE(${ip_address}, ip_address),
            user_agent = COALESCE(${user_agent}, user_agent),
            referrer = COALESCE(${referrer}, referrer),
            utm_source = COALESCE(${utm_source}, utm_source),
            utm_medium = COALESCE(${utm_medium}, utm_medium),
            utm_campaign = COALESCE(${utm_campaign}, utm_campaign),
            conversion_status = COALESCE(${conversion_status}, conversion_status),
            metadata = COALESCE(${metadata}::jsonb, metadata),
            last_activity_at = NOW(),
            updated_at = NOW()
          WHERE session_id = ${session_id}
          RETURNING *
        `;
        return res.status(200).json(updated[0]);
      } else {
        // Criar novo lead
        const newLead = await sql`
          INSERT INTO leads (
            session_id, email, wallet_address, ip_address, user_agent, 
            referrer, utm_source, utm_medium, utm_campaign, 
            conversion_status, metadata
          )
          VALUES (
            ${session_id}, ${email || null}, ${wallet_address || null}, 
            ${ip_address || null}, ${user_agent || null}, ${referrer || null},
            ${utm_source || null}, ${utm_medium || null}, ${utm_campaign || null},
            ${conversion_status || 'visitor'}, ${metadata ? JSON.stringify(metadata) : null}::jsonb
          )
          RETURNING *
        `;
        return res.status(201).json(newLead[0]);
      }
    } catch (error) {
      console.error("Lead Save Error:", error);
      // Ignorar erro de email duplicado (pode ter múltiplos leads com mesmo email)
      if (error.message.includes('unique constraint') && error.message.includes('email')) {
        // Atualizar lead existente com mesmo email
        try {
          const updated = await sql`
            UPDATE leads 
            SET session_id = ${session_id},
                last_activity_at = NOW(),
                updated_at = NOW()
            WHERE email = ${email}
            RETURNING *
          `;
          return res.status(200).json(updated[0]);
        } catch {
          return res.status(500).json({ error: "Failed to update lead" });
        }
      }
      return res.status(500).json({ error: "Failed to save lead" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
