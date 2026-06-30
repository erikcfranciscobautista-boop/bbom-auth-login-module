import {z} from "zod";

export const AuthLoginOutSchema = z.object({
  token: z.string().min(1)
});

export type AuthLoginOutDto = z.infer<typeof AuthLoginOutSchema>;