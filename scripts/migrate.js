/**
 * Database migrations — Neon / Postgres
 * Run: DATABASE_URL=... node scripts/migrate.js
 * Or: make migratedb (with .env loaded)
 */
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL ou DIRECT_URL não definida.');
  console.error('   Use: DATABASE_URL="postgresql://..." node scripts/migrate.js');
  console.error('   Ou: cp .env.example .env && preencha DATABASE_URL');
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

async function runMigrations() {
  console.log('🚀 Iniciando migração do banco de dados (Neon)...');

  try {
    const migrationPath = path.join(__dirname, '../migrations/01_init.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    const queries = migrationSql
      .split(';')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    for (const query of queries) {
      await sql.unsafe(query + ';');
    }

    console.log('✅ Tabelas "deploys" e "drafts" criadas ou já existem.');

    const result = await sql`SELECT count(*)::int as count FROM deploys`;
    console.log(`📊 Status: ${result[0].count} deploy(s) registrado(s).`);
  } catch (err) {
    console.error('❌ Falha na migração:', err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();
