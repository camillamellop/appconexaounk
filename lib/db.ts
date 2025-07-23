import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon(sql)

export const prisma = new PrismaClient({ adapter })

// Ensure connection on startup
prisma
  .$connect()
  .then(() => {
    console.log("✅ [PRISMA] Connected to Neon database")
  })
  .catch((error) => {
    console.error("❌ [PRISMA] Connection failed:", error)
  })

export default prisma
