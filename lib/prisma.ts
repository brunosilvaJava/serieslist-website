import { PrismaClient } from '@prisma/client'
import { env } from './env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma Client with connection pooling
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: `${env.DATABASE_URL}${env.DATABASE_URL.includes('?') ? '&' : '?'}connection_limit=10&pool_timeout=20`,
      },
    },
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
