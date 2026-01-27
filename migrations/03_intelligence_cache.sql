-- NΞØ SMART FACTORY - Intelligence Cache & Log Schema
-- Caching logic to reduce API costs and provide historical context for AI insights

-- ============================================
-- 1. INTELLIGENCE_CACHE TABLE
-- ============================================
-- Armazena resultados de pesquisas pesadas (Tavily/IA) para evitar chamadas repetidas
CREATE TABLE IF NOT EXISTS intelligence_cache (
    id SERIAL PRIMARY KEY,
    query_hash VARCHAR(64) UNIQUE NOT NULL,      -- Hash SHA-256 da query + parâmetros
    action_type VARCHAR(50) NOT NULL,            -- market-research, marketing-suggestions, etc.
    raw_query TEXT NOT NULL,                     -- A query enviada para a API
    response_data JSONB NOT NULL,                -- O resultado formatado da IA
    expires_at TIMESTAMP WITH TIME ZONE,         -- TTL para cache (ex: 24h para trends)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. INTELLIGENCE_LOGS TABLE
-- ============================================
-- Rastreia quem pediu o quê (Audit trail + User Insights)
CREATE TABLE IF NOT EXISTS intelligence_logs (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    action_type VARCHAR(50) NOT NULL,
    query_params JSONB,                          -- Parâmetros (tokenName, category, etc)
    cache_hit BOOLEAN DEFAULT false,             -- Se veio do cache ou API real
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_intel_cache_hash ON intelligence_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_intel_cache_expires ON intelligence_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_intel_logs_lead ON intelligence_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_intel_logs_session ON intelligence_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_intel_logs_action ON intelligence_logs(action_type);

-- ============================================
-- 4. CLEANUP FUNCTION (Opcional - para rodar via CRON se necessário)
-- ============================================
-- Remove caches expirados
-- DELETE FROM intelligence_cache WHERE expires_at < NOW();
