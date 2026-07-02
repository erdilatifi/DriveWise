import { z } from 'zod';

export const uuidSchema = z.string().uuid();

// Paddle resource IDs look like "sub_01hxxxxxxxxxxxxxxxxxxxxxxx" —
// alphanumeric plus underscores, never path separators or query chars.
export const paddleIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9_]+$/, 'Invalid Paddle resource id');

export const licenseCategorySchema = z.enum(['A', 'B', 'C', 'D']);

export const paidPlanTierSchema = z.enum(['PLAN_A', 'PLAN_B', 'PLAN_C']);

/**
 * Escapes characters that have special meaning inside a PostgREST
 * `.or()` / `.ilike()` filter string (`,` `.` `(` `)` `%` `*`) so user
 * search input can't break out of the intended filter clause.
 */
export function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,.()%*]/g, ' ').trim().slice(0, 200);
}
