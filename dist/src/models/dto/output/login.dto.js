import { z } from "zod";
export const LoginOutputSchema = z.object({
    token: z.string(),
});
