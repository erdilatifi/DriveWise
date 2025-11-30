import { z } from 'zod';

export const questionSchema = z.object({
  category: z.string().min(1, "Category is required"),
  test_number: z.number().min(1).max(10),
  question_text: z.string().min(1, "Question text is required"),
  option_a: z.string().min(1, "Option A is required"),
  option_b: z.string().min(1, "Option B is required"),
  option_c: z.string().optional(),
  correct_answer: z.enum(['A', 'B', 'C']),
  correct_answers: z.array(z.enum(['A', 'B', 'C'])).optional(),
  image_url: z.string().optional(),
  is_published: z.boolean().default(true),
});

export type QuestionSchema = z.infer<typeof questionSchema>;
