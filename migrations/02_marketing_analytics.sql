-- NΞØ SMART FACTORY - Marketing & User Recovery Schema
-- Extends initial schema to support lead generation and user recovery

-- ============================================
-- 1. LEADS TABLE (Prospecção)
-- ============================================
-- Captura TODOS os visitantes, mesmo sem wallet conectada
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,                    -- Email para follow-up (opcional inicialmente)
    wallet_address VARCHAR(42),                   -- Wallet se conectou depois
    session_id VARCHAR(255) NOT NULL,            -- Session ID do navegador (cookie/localStorage)
    ip_address VARCHAR(45),                       -- IP para analytics (opcional, GDPR compliant)
    user_agent TEXT,                              -- Browser/device info
    referrer TEXT,                                -- De onde veio (UTM, social, etc.)
    utm_source VARCHAR(100),                      -- UTM tracking
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    conversion_status VARCHAR(50) DEFAULT 'visitor', -- visitor, engaged, wallet_connected, draft_started, token_created
    metadata JSONB,                              -- Dados adicionais flexíveis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. USER SESSIONS (Tracking de Jornada)
-- ============================================
-- Rastreia cada sessão do usuário no funil
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    session_id VARCHAR(255) NOT NULL,
    step_reached INTEGER DEFAULT 1,              -- Qual step do formulário alcançou (1-4)
    form_data_snapshot JSONB,                    -- Snapshot do que preencheu até abandonar
    time_on_page INTEGER,                        -- Tempo em segundos na página
    abandoned_at TIMESTAMP WITH TIME ZONE,       -- Quando abandonou (NULL se completou)
    completed_at TIMESTAMP WITH TIME ZONE,       -- Quando completou o processo
    conversion_funnel JSONB,                     -- Tracking detalhado: {step1_at: timestamp, step2_at: ...}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. EMAIL SUBSCRIPTIONS (Newsletter/Follow-up)
-- ============================================
-- Para campanhas de email marketing
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    source VARCHAR(100),                         -- landing_page, newsletter_form, post_deploy, etc.
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',         -- active, unsubscribed, bounced
    preferences JSONB                            -- Preferências de comunicação
);

-- ============================================
-- 4. CONVERSION EVENTS (Analytics)
-- ============================================
-- Eventos importantes para análise de conversão
CREATE TABLE IF NOT EXISTS conversion_events (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,            -- page_view, wallet_connect, form_start, form_abandon, token_created
    event_data JSONB,                            -- Dados específicos do evento
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. UPDATE DRAFTS TABLE (Adicionar campos de marketing)
-- ============================================
-- Adicionar campos úteis para recuperação
ALTER TABLE drafts 
ADD COLUMN IF NOT EXISTS lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS abandoned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_step_reached INTEGER DEFAULT 0;

-- ============================================
-- 6. UPDATE DEPLOYS TABLE (Adicionar lead tracking)
-- ============================================
-- Linkar deploy ao lead para análise de conversão
ALTER TABLE deploys
ADD COLUMN IF NOT EXISTS lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);

-- ============================================
-- 7. ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_session ON leads(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_wallet ON leads(wallet_address) WHERE wallet_address IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_conversion ON leads(conversion_status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_lead ON user_sessions(lead_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_abandoned ON user_sessions(abandoned_at) WHERE abandoned_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_emails_status ON email_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_emails_lead ON email_subscriptions(lead_id);

CREATE INDEX IF NOT EXISTS idx_events_lead ON conversion_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_date ON conversion_events(occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_drafts_lead ON drafts(lead_id);
CREATE INDEX IF NOT EXISTS idx_drafts_abandoned ON drafts(abandoned) WHERE abandoned = true;

CREATE INDEX IF NOT EXISTS idx_deploys_lead ON deploys(lead_id);

-- ============================================
-- 8. VIEWS ÚTEIS PARA MARKETING (criadas após tabelas)
-- ============================================

-- View: Leads que abandonaram (para recuperação)
-- Nota: Esta view será criada após todas as tabelas estarem prontas
CREATE OR REPLACE VIEW abandoned_leads AS
SELECT 
    l.id,
    l.email,
    l.wallet_address,
    l.session_id,
    l.conversion_status,
    l.first_visit_at,
    l.last_activity_at,
    d.token_config,
    d.last_step_reached,
    d.updated_at as draft_updated_at,
    EXTRACT(EPOCH FROM (NOW() - l.last_activity_at)) / 3600 as hours_since_activity
FROM leads l
LEFT JOIN drafts d ON d.lead_id = l.id
WHERE l.conversion_status != 'token_created'
    AND l.last_activity_at < NOW() - INTERVAL '1 hour'
    AND (d.abandoned = true OR d.user_address IS NULL)
ORDER BY l.last_activity_at DESC;

-- View: Funnel de conversão (análise)
CREATE OR REPLACE VIEW conversion_funnel AS
SELECT 
    COUNT(DISTINCT CASE WHEN conversion_status = 'visitor' THEN id END) as visitors,
    COUNT(DISTINCT CASE WHEN conversion_status = 'engaged' THEN id END) as engaged,
    COUNT(DISTINCT CASE WHEN conversion_status = 'wallet_connected' THEN id END) as wallet_connected,
    COUNT(DISTINCT CASE WHEN conversion_status = 'draft_started' THEN id END) as draft_started,
    COUNT(DISTINCT CASE WHEN conversion_status = 'token_created' THEN id END) as token_created,
    COUNT(DISTINCT CASE WHEN conversion_status = 'token_created' THEN id END)::FLOAT / 
        NULLIF(COUNT(DISTINCT CASE WHEN conversion_status = 'visitor' THEN id END), 0) * 100 as conversion_rate
FROM leads
WHERE created_at >= NOW() - INTERVAL '30 days';

-- View: Leads com email (para campanhas)
CREATE OR REPLACE VIEW marketable_leads AS
SELECT DISTINCT ON (l.id)
    l.*,
    es.status as email_status,
    es.subscribed_at,
    COALESCE(d.abandoned, false) as has_abandoned_draft,
    (SELECT COUNT(*) FROM conversion_events ce WHERE ce.lead_id = l.id) as total_events
FROM leads l
LEFT JOIN email_subscriptions es ON es.lead_id = l.id
LEFT JOIN drafts d ON d.lead_id = l.id
WHERE l.email IS NOT NULL
    AND (es.status = 'active' OR es.status IS NULL)
ORDER BY l.id, es.subscribed_at DESC NULLS LAST;
