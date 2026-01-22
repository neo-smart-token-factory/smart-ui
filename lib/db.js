import { neon } from '@neondatabase/serverless';

// Conexão com fallback para desenvolvimento sem banco
let sql = null;

if (import.meta.env.VITE_DATABASE_URL || import.meta.env.DATABASE_URL) {
  sql = neon(import.meta.env.VITE_DATABASE_URL || import.meta.env.DATABASE_URL);
}

export default sql;
