import { neon } from '@neondatabase/serverless';

// Conexão com fallback para desenvolvimento sem banco
let sql = null;

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
}

export default sql;
