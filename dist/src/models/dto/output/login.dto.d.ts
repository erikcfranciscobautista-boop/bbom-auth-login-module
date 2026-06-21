import { z } from "zod";
export declare const LoginOutputSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export type LoginOutput = z.infer<typeof LoginOutputSchema>;
