import { z } from "zod";

export const LoginOutputSchema = z.object({
  token: z.string(),
});

export type LoginOutput = z.infer<typeof LoginOutputSchema>;
