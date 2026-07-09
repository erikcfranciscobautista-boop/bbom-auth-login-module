import {z} from "zod";

export const AuthLoginInSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "password is required"),
});

export type AuthLoginInDto = z.infer<typeof AuthLoginInSchema>;