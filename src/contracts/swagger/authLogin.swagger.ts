import { AuthLoginInSchema } from "../models/authLogin/authLogin.in.dto.js";

export const SwaggerAuthLoginInSchema = {
    tags : "login",
    properties: {
        type: "object",
        properties : AuthLoginInSchema,
    },
    required: ["username", "password"],
};