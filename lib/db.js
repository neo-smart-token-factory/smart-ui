import { neon } from '@neondatabase/serverless';

// Conexão server-side (Node.js/Vercel)
let sql = null;

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
}

export default sql;
