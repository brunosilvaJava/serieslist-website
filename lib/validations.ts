import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').optional(),
})

export const listSchema = z.object({
  name: z.string().min(1, 'List name is required'),
  isPublic: z.boolean().default(false),
})

export const serieSchema = z.object({
  title: z.string().min(1, 'Serie title is required'),
  description: z.string().optional(),
  listId: z.string().min(1, 'List ID is required'),
})
