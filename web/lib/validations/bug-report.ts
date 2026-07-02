import { z } from 'zod';

const emptyToUndefined = (v: unknown) => (v === '' ? undefined : v);

export const bugReportSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().min(1, 'Description is required').max(5000),
  stepsToReproduce: z.preprocess(emptyToUndefined, z.string().trim().max(5000).optional()),
  location: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  deviceBrowser: z.preprocess(emptyToUndefined, z.string().trim().max(300).optional()),
  contactEmail: z.preprocess(emptyToUndefined, z.string().trim().email().max(320).optional()),
});
