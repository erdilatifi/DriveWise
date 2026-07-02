import { z } from 'zod';

export const deleteAccountFeedbackSchema = z.object({
  reason: z.string().trim().min(1).max(100),
  comment: z.string().trim().max(2000).optional(),
  customReason: z.string().trim().max(2000).optional(),
  allowPublic: z.boolean().optional().default(false),
});
