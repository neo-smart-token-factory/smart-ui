import { searchTavily, generateSuggestions, validateTokenNameInput } from './utils.js';

/**
 * API Route: Validar nome e símbolo de token
 * POST /api/tavily/validate-token-name
 * 
 * Body: { tokenName: string, symbol: string }
 * 
 * Retorna: { valid: boolean, conflicts: array, suggestions: array }
 */
export default async function handler(req, res) {
  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tokenName, symbol } = req.body;

    // Validar inputs
    try {
      validateTokenNameInput(tokenName, symbol);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Verificar se API key está configurada
    if (!process.env.TAVILY_API_KEY) {
      return res.status(500).json({ 
        error: 'TAVILY_API_KEY não configurada',
        fallback: true 
      });
    }

    // Construir query de pesquisa
    const query = `token ${tokenName} ${symbol} cryptocurrency blockchain coin`;

    // Buscar na Tavily
    let data;
    try {
      data = await searchTavily(query, {
        search_depth: 'basic',
        include_answer: true,
        max_results: 10,
      });
    } catch (error) {
      console.error('Tavily API error:', error);
      // Retornar fallback para não quebrar UX
      return res.status(200).json({
        valid: true,
        conflicts: [],
        suggestions: [],
        fallback: true,
        message: 'Serviço de validação temporariamente indisponível',
      });
    }

    // Analisar resultados para detectar conflitos
    const conflicts = (data.results || []).filter(result => {
      const titleLower = (result.title || '').toLowerCase();
      const contentLower = (result.content || '').toLowerCase();
      const tokenNameLower = tokenName.toLowerCase();
      const symbolLower = symbol.toLowerCase();

      return (
        titleLower.includes(tokenNameLower) ||
        titleLower.includes(symbolLower) ||
        contentLower.includes(tokenNameLower) ||
        contentLower.includes(symbolLower)
      );
    }).map(conflict => ({
      title: conflict.title,
      url: conflict.url,
      score: conflict.score || 0,
    }));

    // Gerar sugestões se houver conflitos
    const suggestions = conflicts.length > 0 
      ? generateSuggestions(tokenName, symbol)
      : [];

    return res.status(200).json({
      valid: conflicts.length === 0,
      conflicts,
      suggestions,
      totalResults: data.results?.length || 0,
    });

  } catch (error) {
    console.error('Error in validate-token-name:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao validar nome do token',
      message: error.message 
    });
  }
}
