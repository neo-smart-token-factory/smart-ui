import sql from '../lib/db.js';

export default async function handler(req, res) {
  if (!sql) {
    return res.status(503).json({ error: "Database connection not authenticated" });
  }

  // GET: Analytics e métricas
  if (req.method === 'GET') {
    const { type, days = 30 } = req.query;

    try {
      if (type === 'funnel') {
        // Funnel de conversão
        const funnel = await sql`
          SELECT * FROM conversion_funnel
        `;
        return res.status(200).json(funnel[0] || {});
      }

      if (type === 'abandoned') {
        // Leads abandonados
        const { limit = 50, hours = 24 } = req.query;
        const abandoned = await sql`
          SELECT * FROM abandoned_leads 
          WHERE hours_since_activity >= ${parseFloat(hours)}
          ORDER BY last_activity_at DESC 
          LIMIT ${parseInt(limit)}
        `;
        return res.status(200).json(abandoned);
      }

      if (type === 'marketable') {
        // Leads com email para campanhas
        const { limit = 100 } = req.query;
        const marketable = await sql`
          SELECT * FROM marketable_leads 
          LIMIT ${parseInt(limit)}
        `;
        return res.status(200).json(marketable);
      }

      if (type === 'events') {
        // Eventos por tipo (últimos N dias)
        const events = await sql`
          SELECT 
            event_type,
            COUNT(*) as count,
            DATE(occurred_at) as date
          FROM conversion_events
          WHERE occurred_at >= NOW() - INTERVAL '${parseInt(days)} days'
          GROUP BY event_type, DATE(occurred_at)
          ORDER BY date DESC, count DESC
        `;
        return res.status(200).json(events);
      }

      if (type === 'summary') {
        // Resumo geral
        const summary = await sql`
          SELECT 
            (SELECT COUNT(*) FROM leads) as total_leads,
            (SELECT COUNT(*) FROM leads WHERE email IS NOT NULL) as leads_with_email,
            (SELECT COUNT(*) FROM leads WHERE conversion_status = 'token_created') as converted,
            (SELECT COUNT(*) FROM user_sessions WHERE abandoned_at IS NOT NULL) as abandoned_sessions,
            (SELECT COUNT(*) FROM email_subscriptions WHERE status = 'active') as active_subscriptions,
            (SELECT COUNT(*) FROM conversion_events WHERE occurred_at >= NOW() - INTERVAL '24 hours') as events_last_24h
        `;
        return res.status(200).json(summary[0] || {});
      }

      // Default: resumo geral
      const summary = await sql`
        SELECT 
          (SELECT COUNT(*) FROM leads) as total_leads,
          (SELECT COUNT(*) FROM leads WHERE conversion_status = 'token_created') as converted,
          (SELECT COUNT(*) FROM user_sessions WHERE abandoned_at IS NOT NULL) as abandoned_sessions
      `;
      return res.status(200).json(summary[0] || {});
    } catch (error) {
      console.error("Analytics Error:", error);
      return res.status(500).json({ error: "Failed to fetch analytics" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
