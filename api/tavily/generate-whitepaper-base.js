import { searchTavily, extractTokenomics } from './utils.js';

/**
 * API Route: Gerar base de whitepaper (Premium Feature)
 * POST /api/tavily/generate-whitepaper-base
 * 
 * Body: { 
 *   tokenName: string, 
 *   category: string, 
 *   useCase: string, 
 *   targetAudience: string 
 * }
 * 
 * Retorna: { introduction, tokenomics, useCase, marketAnalysis, references }
 */
export default async function handler(req, res) {
  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tokenName, category, useCase, targetAudience } = req.body;

    // Validar inputs obrigatórios
    if (!tokenName) {
      return res.status(400).json({ error: 'tokenName é obrigatório' });
    }

    // Verificar se API key está configurada
    if (!process.env.TAVILY_API_KEY) {
      return res.status(500).json({ 
        error: 'TAVILY_API_KEY não configurada',
        fallback: true 
      });
    }

    // Construir queries para diferentes seções
    const queries = [
      `${tokenName} ${category || ''} tokenomics model distribution`.trim(),
      `${useCase || ''} blockchain implementation use cases`.trim(),
      `${targetAudience || ''} cryptocurrency adoption market`.trim(),
    ].filter(q => q.length > 0);

    if (queries.length === 0) {
      return res.status(400).json({ 
        error: 'Pelo menos um de: category, useCase, targetAudience é necessário' 
      });
    }

    // Executar pesquisas em paralelo
    let researchResults;
    try {
      researchResults = await Promise.all(
        queries.map(query =>
          searchTavily(query, {
            search_depth: 'advanced',
            include_answer: true,
            include_raw_content: true,
            max_results: 10,
          })
        )
      );
    } catch (error) {
      console.error('Tavily API error:', error);
      return res.status(200).json({
        introduction: '',
        tokenomics: null,
        useCase: '',
        marketAnalysis: '',
        references: [],
        fallback: true,
        message: 'Serviço de geração temporariamente indisponível',
      });
    }

    // Estruturar base do whitepaper
    const whitepaperBase = {
      introduction: researchResults[0]?.answer || `Introdução para ${tokenName}: Um token inovador na categoria ${category || 'blockchain'}.`,
      tokenomics: extractTokenomics(researchResults[0]?.answer || ''),
      useCase: researchResults[1]?.answer || (useCase ? `Casos de uso: ${useCase}` : ''),
      marketAnalysis: researchResults[2]?.answer || (targetAudience ? `Análise de mercado para ${targetAudience}` : ''),
      references: researchResults.flatMap((result, index) =>
        (result.results || []).slice(0, 5).map(ref => ({
          title: ref.title,
          url: ref.url,
          section: index === 0 ? 'tokenomics' : index === 1 ? 'useCase' : 'market',
          relevance: ref.score || 0,
        }))
      ),
      generatedAt: new Date().toISOString(),
    };

    return res.status(200).json(whitepaperBase);

  } catch (error) {
    console.error('Error in generate-whitepaper-base:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao gerar base de whitepaper',
      message: error.message 
    });
  }
}
