import { searchTavily } from './utils.js';

/**
 * API Route: Sugestões de marketing (Premium Feature)
 * POST /api/tavily/marketing-suggestions
 * 
 * Body: { tokenName: string, category: string, launchDate: string }
 * 
 * Retorna: { socialMedia, contentIdeas, timing, channels, messaging }
 */
export default async function handler(req, res) {
  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tokenName, category, launchDate } = req.body;

    // Validar inputs
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

    // Construir query de pesquisa
    const query = `${category || ''} token launch marketing strategy social media campaigns 2026 ${tokenName}`.trim();

    // Buscar na Tavily com foco em domínios de marketing
    let data;
    try {
      data = await searchTavily(query, {
        search_depth: 'advanced',
        include_answer: true,
        max_results: 20,
        include_domains: ['twitter.com', 'reddit.com', 'medium.com', 'coindesk.com', 'cointelegraph.com'],
      });
    } catch (error) {
      console.error('Tavily API error:', error);
      return res.status(200).json({
        socialMedia: [],
        contentIdeas: [],
        timing: null,
        channels: [],
        messaging: [],
        fallback: true,
        message: 'Serviço de sugestões temporariamente indisponível',
      });
    }

    // Extrair estratégias de marketing
    const answer = data.answer || '';
    const results = data.results || [];

    // Extrair estratégias de redes sociais
    const socialMedia = extractSocialMediaStrategies(answer, results);

    // Gerar ideias de conteúdo
    const contentIdeas = generateContentIdeas(results, tokenName, category);

    // Sugerir timing
    const timing = suggestOptimalTiming(answer, launchDate);

    // Identificar melhores canais
    const channels = identifyBestChannels(results);

    // Extrair padrões de mensagem
    const messaging = extractMessagingPatterns(answer);

    const marketingSuggestions = {
      socialMedia,
      contentIdeas,
      timing,
      channels,
      messaging,
      summary: answer.substring(0, 500),
      totalResults: results.length,
    };

    return res.status(200).json(marketingSuggestions);

  } catch (error) {
    console.error('Error in marketing-suggestions:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao gerar sugestões de marketing',
      message: error.message 
    });
  }
}

/**
 * Extrai estratégias de redes sociais do texto
 */
function extractSocialMediaStrategies(answer) {
  const strategies = [];
  const platforms = ['twitter', 'telegram', 'discord', 'reddit', 'medium'];

  platforms.forEach(platform => {
    const mentions = answer.toLowerCase().includes(platform);
    if (mentions) {
      strategies.push({
        platform,
        strategy: extractPlatformStrategy(answer, platform),
      });
    }
  });

  return strategies.slice(0, 5);
}

/**
 * Extrai estratégia específica para uma plataforma
 */
function extractPlatformStrategy(answer, platform) {
  const sentences = answer.split('.');
  const relevant = sentences.find(s => 
    s.toLowerCase().includes(platform) && s.length > 30
  );
  return relevant ? relevant.trim() : `Estratégia recomendada para ${platform}`;
}

/**
 * Gera ideias de conteúdo baseadas nos resultados
 */
function generateContentIdeas(results, tokenName, category) {
  const ideas = [];
  
  results.slice(0, 5).forEach(result => {
    if (result.title && result.content) {
      ideas.push({
        title: `Inspirado em: ${result.title}`,
        type: 'article',
        suggestion: `Criar conteúdo sobre ${category || 'blockchain'} similar a "${result.title.substring(0, 50)}"`,
      });
    }
  });

  // Adicionar ideias genéricas
  ideas.push(
    { title: 'Whitepaper Release', type: 'announcement', suggestion: `Anunciar ${tokenName} com whitepaper completo` },
    { title: 'Community AMA', type: 'engagement', suggestion: 'Organizar AMA no Telegram/Discord' },
    { title: 'Partnership Announcements', type: 'partnership', suggestion: 'Anunciar parcerias estratégicas' }
  );

  return ideas.slice(0, 8);
}

/**
 * Sugere timing ótimo baseado na pesquisa
 */
function suggestOptimalTiming(answer, launchDate) {
  const timingKeywords = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'weekend', 'morning', 'afternoon', 'evening'];
  const found = timingKeywords.find(keyword => answer.toLowerCase().includes(keyword));

  return {
    suggestedDay: found || 'Segunda-feira',
    reasoning: found 
      ? `Pesquisa indica que ${found} é um bom momento para lançamentos`
      : 'Segunda-feira geralmente tem maior engajamento',
    launchDate: launchDate || null,
  };
}

/**
 * Identifica melhores canais baseado nos resultados
 */
function identifyBestChannels(results) {
  const channelScores = {};
  
  results.forEach(result => {
    const url = result.url || '';
    if (url.includes('twitter.com') || url.includes('x.com')) {
      channelScores.twitter = (channelScores.twitter || 0) + (result.score || 0);
    }
    if (url.includes('reddit.com')) {
      channelScores.reddit = (channelScores.reddit || 0) + (result.score || 0);
    }
    if (url.includes('medium.com')) {
      channelScores.medium = (channelScores.medium || 0) + (result.score || 0);
    }
    if (url.includes('telegram')) {
      channelScores.telegram = (channelScores.telegram || 0) + (result.score || 0);
    }
  });

  return Object.entries(channelScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([channel, score]) => ({ channel, relevance: score }));
}

/**
 * Extrai padrões de mensagem do texto
 */
function extractMessagingPatterns(answer) {
  const patterns = [];
  const keywords = ['community', 'decentralized', 'innovation', 'future', 'revolution'];

  keywords.forEach(keyword => {
    if (answer.toLowerCase().includes(keyword)) {
      patterns.push({
        theme: keyword,
        example: `Mensagens focadas em ${keyword} tendem a ter melhor engajamento`,
      });
    }
  });

  return patterns.slice(0, 5);
}
