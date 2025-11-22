import { z } from 'zod';

export const questionSchema = z.object({
  category: z.string().min(1, "Category is required"),
  test_number: z.number().min(1).max(10),
  question_text: z.string().optional(), // Base can be empty if specific langs are provided, handled by refinement
  question_text_en: z.string().optional(),
  question_text_sq: z.string().optional(),
  option_a: z.string().optional(),
  option_a_en: z.string().optional(),
  option_a_sq: z.string().optional(),
  option_b: z.string().optional(),
  option_b_en: z.string().optional(),
  option_b_sq: z.string().optional(),
  option_c: z.string().optional(),
  option_c_en: z.string().optional(),
  option_c_sq: z.string().optional(),
  correct_answer: z.enum(['A', 'B', 'C']),
  correct_answers: z.array(z.enum(['A', 'B', 'C'])).optional(),
  image_url: z.string().optional(),
  explanation_en: z.string().optional(),
  explanation_sq: z.string().optional(),
  is_published: z.boolean().default(true),
}).superRefine((data, ctx) => {
  // Validate at least one language for question
  if (!data.question_text_en?.trim() && !data.question_text_sq?.trim() && !data.question_text?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Question text (at least one language) is required",
      path: ["question_text_en"],
    });
  }

  // Validate Option A
  if (!data.option_a_en?.trim() && !data.option_a_sq?.trim() && !data.option_a?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Option A (at least one language) is required",
      path: ["option_a_en"],
    });
  }

  // Validate Option B
  if (!data.option_b_en?.trim() && !data.option_b_sq?.trim() && !data.option_b?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Option B (at least one language) is required",
      path: ["option_b_en"],
    });
  }

  // Validate Option C
  if (!data.option_c_en?.trim() && !data.option_c_sq?.trim() && !data.option_c?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Option C (at least one language) is required",
      path: ["option_c_en"],
    });
  }
});

export type QuestionSchema = z.infer<typeof questionSchema>;
