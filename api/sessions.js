import sql from '../lib/db.js';

export default async function handler(req, res) {
  if (!sql) {
    return res.status(503).json({ error: "Database connection not authenticated" });
  }

  // GET: Buscar sessão por session_id
  if (req.method === 'GET') {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "session_id is required" });
    }

    try {
      const sessions = await sql`
        SELECT * FROM user_sessions 
        WHERE session_id = ${session_id} 
        ORDER BY created_at DESC 
        LIMIT 1
      `;

      if (sessions.length > 0) {
        return res.status(200).json(sessions[0]);
      }
      return res.status(404).json({ error: "Session not found" });
    } catch (error) {
      console.error("Session Fetch Error:", error);
      return res.status(500).json({ error: "Failed to fetch session" });
    }
  }

  // POST: Criar ou atualizar sessão
  if (req.method === 'POST') {
    const {
      lead_id,
      session_id,
      step_reached,
      form_data_snapshot,
      time_on_page,
      abandoned_at,
      completed_at,
      conversion_funnel
    } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: "session_id is required" });
    }

    try {
      // Verificar se sessão já existe
      const existing = await sql`
        SELECT id FROM user_sessions 
        WHERE session_id = ${session_id} 
        LIMIT 1
      `;

      if (existing.length > 0) {
        // Atualizar sessão existente
        const updated = await sql`
          UPDATE user_sessions 
          SET 
            lead_id = COALESCE(${lead_id ? parseInt(lead_id) : null}, lead_id),
            step_reached = COALESCE(${step_reached ? parseInt(step_reached) : null}, step_reached),
            form_data_snapshot = COALESCE(${form_data_snapshot ? JSON.stringify(form_data_snapshot) : null}::jsonb, form_data_snapshot),
            time_on_page = COALESCE(${time_on_page ? parseInt(time_on_page) : null}, time_on_page),
            abandoned_at = COALESCE(${abandoned_at ? new Date(abandoned_at) : null}, abandoned_at),
            completed_at = COALESCE(${completed_at ? new Date(completed_at) : null}, completed_at),
            conversion_funnel = COALESCE(${conversion_funnel ? JSON.stringify(conversion_funnel) : null}::jsonb, conversion_funnel)
          WHERE session_id = ${session_id}
          RETURNING *
        `;
        return res.status(200).json(updated[0]);
      } else {
        // Criar nova sessão
        const newSession = await sql`
          INSERT INTO user_sessions (
            lead_id, session_id, step_reached, form_data_snapshot,
            time_on_page, abandoned_at, completed_at, conversion_funnel
          )
          VALUES (
            ${lead_id ? parseInt(lead_id) : null},
            ${session_id},
            ${step_reached ? parseInt(step_reached) : 1},
            ${form_data_snapshot ? JSON.stringify(form_data_snapshot) : null}::jsonb,
            ${time_on_page ? parseInt(time_on_page) : null},
            ${abandoned_at ? new Date(abandoned_at) : null},
            ${completed_at ? new Date(completed_at) : null},
            ${conversion_funnel ? JSON.stringify(conversion_funnel) : null}::jsonb
          )
          RETURNING *
        `;
        return res.status(201).json(newSession[0]);
      }
    } catch (error) {
      console.error("Session Save Error:", error);
      return res.status(500).json({ error: "Failed to save session" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
