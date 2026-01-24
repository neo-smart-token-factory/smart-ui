import { searchTavily, extractTrends, identifyMarketGaps } from './utils.js';

/**
 * API Route: Pesquisa de mercado e tendências
 * POST /api/tavily/market-research
 * 
 * Body: { category: string, keywords: string }
 * 
 * Retorna: { trends: array, competitors: array, marketGaps: array }
 */
export default async function handler(req, res) {
  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, keywords } = req.body;

    // Validar inputs
    if (!category && !keywords) {
      return res.status(400).json({ 
        error: 'category ou keywords são obrigatórios' 
      });
    }

    // Verificar se API key está configurada
    if (!process.env.TAVILY_API_KEY) {
      return res.status(500).json({ 
        error: 'TAVILY_API_KEY não configurada',
        fallback: true 
      });
    }

    // Construir query de pesquisa
    const query = `${category || ''} ${keywords || ''} token launch trends 2026 cryptocurrency`.trim();

    // Buscar na Tavily
    let data;
    try {
      data = await searchTavily(query, {
        search_depth: 'advanced',
        include_answer: true,
        max_results: 15,
      });
    } catch (error) {
      console.error('Tavily API error:', error);
      return res.status(200).json({
        trends: [],
        competitors: [],
        marketGaps: [],
        fallback: true,
        message: 'Serviço de pesquisa temporariamente indisponível',
      });
    }

    // Extrair insights
    const insights = {
      trends: extractTrends(data.answer || ''),
      competitors: (data.results || []).slice(0, 5).map(result => ({
        name: result.title,
        url: result.url,
        relevance: result.score || 0,
        snippet: result.content?.substring(0, 150) || '',
      })),
      marketGaps: identifyMarketGaps(data.answer || ''),
      summary: data.answer || '',
      totalResults: data.results?.length || 0,
    };

    return res.status(200).json(insights);

  } catch (error) {
    console.error('Error in market-research:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao realizar pesquisa de mercado',
      message: error.message 
    });
  }
}
