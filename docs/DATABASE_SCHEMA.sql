-- NΞØ SMART FACTORY - Database Initialization
-- Execute este script no console SQL do NEON (https://console.neon.tech)

-- Tabela para rascunhos de tokens (Persistência Cross-device)
CREATE TABLE IF NOT EXISTS drafts (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) UNIQUE NOT NULL,
    token_config JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para histórico de deploys (Transparência Global)
CREATE TABLE IF NOT EXISTS deploys (
    id SERIAL PRIMARY KEY,
    contract_address VARCHAR(42) UNIQUE NOT NULL,
    owner_address VARCHAR(42) NOT NULL,
    network VARCHAR(50) NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    status VARCHAR(20) DEFAULT 'SUCCESSFUL',
    token_name VARCHAR(255),
    token_symbol VARCHAR(20),
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_drafts_user ON drafts(user_address);
CREATE INDEX IF NOT EXISTS idx_deploys_owner ON deploys(owner_address);
CREATE INDEX IF NOT EXISTS idx_deploys_date ON deploys(deployed_at DESC);
