import { z } from "zod";

export const LoginInputSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
