import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_POSTGRES_HOST,
  ssl: {
    rejectUnauthorized: false,
  },
})
