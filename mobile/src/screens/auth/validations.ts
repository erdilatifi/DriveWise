import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Email i pavlefshëm" }),
  password: z.string().min(6, { message: "Fjalëkalimi duhet të ketë të paktën 6 karaktere" }),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, { message: "Emri duhet të ketë të paktën 2 karaktere" }),
  email: z.string().email({ message: "Email i pavlefshëm" }),
  password: z.string().min(6, { message: "Fjalëkalimi duhet të ketë të paktën 6 karaktere" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Fjalëkalimet nuk përputhen",
  path: ["confirmPassword"],
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
