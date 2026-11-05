import path from 'node:path'
import { PrismaClient } from '@prisma/client'

// ── Ruta absoluta a la base SQLite ──────────────────────────────────────────
// El .env declara file:../db/custom.db (relativa a prisma/): la CLI de Prisma
// la resuelve bien, pero el runtime de Next.js (Turbopack) la busca desde otra
// carpeta y revienta con "Error code 14: Unable to open the database file".
// Aquí anclamos la ruta a la raíz del proyecto, sea cual sea la máquina
// (Mac del taller, sandbox, producción) — el servidor Next siempre corre con
// process.cwd() = raíz del proyecto.
const rutaDb = path.join(process.cwd(), 'db', 'custom.db')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: { db: { url: `file:${rutaDb}` } },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db