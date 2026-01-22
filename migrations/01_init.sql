-- Tabela de Deploys (Histórico de Tokens Criados)
CREATE TABLE IF NOT EXISTS deploys (
    id SERIAL PRIMARY KEY,
    contract_address TEXT NOT NULL,
    owner_address TEXT NOT NULL,
    network TEXT NOT NULL,
    tx_hash TEXT NOT NULL,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Drafts (Rascunhos Salvamento Automático)
CREATE TABLE IF NOT EXISTS drafts (
    user_address TEXT PRIMARY KEY,
    token_config JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
