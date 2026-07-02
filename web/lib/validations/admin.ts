import { z } from 'zod';
import { uuidSchema, licenseCategorySchema, paidPlanTierSchema } from './common';

export const grantPlanSchema = z.object({
  userId: uuidSchema,
  category: licenseCategorySchema,
  planTier: paidPlanTierSchema,
});
