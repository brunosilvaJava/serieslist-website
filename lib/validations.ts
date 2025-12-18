import { z } from 'zod'
import { MIN_PASSWORD_LENGTH, MIN_LIST_NAME_LENGTH, MIN_SERIE_TITLE_LENGTH } from './constants'

// Transform function to sanitize strings
const sanitizeTransform = (val: string) => val.trim().slice(0, 1000)

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').transform(sanitizeTransform),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').transform(sanitizeTransform),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
  name: z.string().optional().transform((val) => val ? sanitizeTransform(val) : val),
})

export const listSchema = z.object({
  name: z.string().min(MIN_LIST_NAME_LENGTH, 'List name is required').transform(sanitizeTransform),
  isPublic: z.boolean().default(false),
})

export const serieSchema = z.object({
  title: z.string().min(MIN_SERIE_TITLE_LENGTH, 'Serie title is required').transform(sanitizeTransform),
  description: z.string().optional().transform((val) => val ? sanitizeTransform(val) : val),
  listId: z.string().cuid('Invalid list ID'),
})

export const serieUpdateSchema = z.object({
  title: z.string().min(MIN_SERIE_TITLE_LENGTH, 'Serie title is required').transform(sanitizeTransform),
  description: z.string().optional().nullable().transform((val) => val ? sanitizeTransform(val) : val),
})

// ID validation
export const idSchema = z.string().cuid('Invalid ID format')
