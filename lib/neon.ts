/// lib/neon.ts

import { neon, neonConfig, type Sql } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import { Pool as PgPool } from "pg"

neonConfig.fetchConnectionCache = true

// export const sql = neon(process.env.DATABASE_URL!);
let sql: Sql
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not found. Creating dummy sql object.")
  sql = (() => {
    console.warn("DATABASE_URL not configured.  No-op sql function called.")
    return Promise.resolve(undefined)
  }) as any
} else {
  sql = neon(process.env.DATABASE_URL)
}

// ――― Utility --------------------------------------------------------------
/**
 * Returns the singleton Neon SQL tagged-template client.
 * Import with:  `import { getSql } from '@/lib/neon'`
 */
export function getSql() {
  return sql
}

export const neonDB = drizzle(sql)

// Node Postgres
const client = new Client({ connectionString: process.env.DATABASE_URL })
export const nodePgClient = client
export const drizzlePgClient = drizzlePg(client)

const pool = new PgPool({ connectionString: process.env.DATABASE_URL })
export const nodePgPool = pool
