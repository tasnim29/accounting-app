import { Pool } from "pg";

/**
 * Create a connection pool to PostgreSQL
 * Pool = efficient + reusable connections
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
