import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables on module load
// Only validate in runtime, not during build
let env: Env

// Skip validation during build time
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  try {
    env = envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      console.error(JSON.stringify(error.errors, null, 2))
      throw new Error('Invalid environment variables')
    }
    throw error
  }
} else {
  // During build, use placeholder values
  env = {
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://placeholder',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'placeholder-secret-min-32-characters',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  }
}

export { env }
