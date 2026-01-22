import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars if running locally without existing process.env (though usually user runs this with env loaded)
// Since we are in a module, we can assume running via `node --env-file=.env` or similar if supported, 
// or relying on the user having the env vars set. 
// However, the user is running `vercel dev` which sets envs for the app, but valid CLI usage might verify envs.

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ ERRO: DATABASE_URL ou DIRECT_URL não definida.");
    process.exit(1);
}

const sql = neon(connectionString);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
    console.log("🚀 Iniciando migração do banco de dados...");

    try {
        const migrationPath = path.join(__dirname, '../migrations/01_init.sql');
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');

        // Executar os comandos SQL (Neon serverless driver supporta múltiplas queries em uma call se separado por ponto e vírgula? 
        // O driver `neon` via HTTP pode ter limitações com queries múltiplas em uma string se não for suportado.
        // Mas geralmente DDL simples funciona ou podemos dividir.)

        // Vamos tentar dividir por ';' para garantir, embora o neon serverless costume aceitar blocos.
        const queries = migrationSql.split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        for (const query of queries) {
            await sql.query(query);
        }

        console.log("✅ Tabelas 'deploys' e 'drafts' criadas com sucesso!");

        // Teste simples
        const result = await sql`SELECT count(*) FROM deploys`;
        console.log(`📊 Status atual: ${result[0].count} deploys registrados.`);

    } catch (err) {
        console.error("❌ Falha na migração:", err);
        process.exit(1);
    }
}

runMigrations();
