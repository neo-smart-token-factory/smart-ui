import sql from '../lib/db.js';

export default async function handler(req, res) {
  if (!sql) {
    return res.status(503).json({ error: "Database connection not authenticated" });
  }

  // GET: Buscar eventos (com filtros opcionais)
  if (req.method === 'GET') {
    const { lead_id, session_id, event_type, limit = 100 } = req.query;

    try {
      let events;

      if (lead_id) {
        events = await sql`
          SELECT * FROM conversion_events 
          WHERE lead_id = ${lead_id}::integer
          ORDER BY occurred_at DESC 
          LIMIT ${parseInt(limit)}
        `;
      } else if (session_id) {
        events = await sql`
          SELECT * FROM conversion_events 
          WHERE session_id = ${session_id}
          ORDER BY occurred_at DESC 
          LIMIT ${parseInt(limit)}
        `;
      } else if (event_type) {
        events = await sql`
          SELECT * FROM conversion_events 
          WHERE event_type = ${event_type}
          ORDER BY occurred_at DESC 
          LIMIT ${parseInt(limit)}
        `;
      } else {
        events = await sql`
          SELECT * FROM conversion_events 
          ORDER BY occurred_at DESC 
          LIMIT ${parseInt(limit)}
        `;
      }

      return res.status(200).json(events);
    } catch (error) {
      console.error("Events Fetch Error:", error);
      return res.status(500).json({ error: "Failed to fetch events" });
    }
  }

  // POST: Registrar novo evento
  if (req.method === 'POST') {
    const { lead_id, session_id, event_type, event_data } = req.body;

    if (!event_type) {
      return res.status(400).json({ error: "event_type is required" });
    }

    if (!session_id && !lead_id) {
      return res.status(400).json({ error: "session_id or lead_id is required" });
    }

    try {
      const newEvent = await sql`
        INSERT INTO conversion_events (lead_id, session_id, event_type, event_data)
        VALUES (
          ${lead_id ? parseInt(lead_id) : null},
          ${session_id || null},
          ${event_type},
          ${event_data ? JSON.stringify(event_data) : null}::jsonb
        )
        RETURNING *
      `;

      // Se lead_id existe, atualizar conversion_status do lead baseado no evento
      if (lead_id && event_type) {
        let newStatus = null;
        
        // Mapear eventos para status de conversão
        if (event_type === 'wallet_connect') {
          newStatus = 'wallet_connected';
        } else if (event_type === 'form_start') {
          newStatus = 'engaged';
        } else if (event_type === 'form_step_1' || event_type === 'form_step_2') {
          newStatus = 'draft_started';
        } else if (event_type === 'token_created') {
          newStatus = 'token_created';
        }

        if (newStatus) {
          await sql`
            UPDATE leads 
            SET conversion_status = ${newStatus}, last_activity_at = NOW()
            WHERE id = ${parseInt(lead_id)}
          `;
        }
      }

      return res.status(201).json(newEvent[0]);
    } catch (error) {
      console.error("Event Save Error:", error);
      return res.status(500).json({ error: "Failed to save event" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
