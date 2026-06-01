import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/sigma',
});

// Petit helper : query(text, params) -> rows
export const query = (text, params) => pool.query(text, params);
