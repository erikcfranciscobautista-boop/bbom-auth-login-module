// En tu módulo de definición
export const AuthLoginSwagger = {
    tags: ["login"], // Debe ser un arreglo
    body: {
        type: "object",
        properties: {
            username: { type: "string" },
            password: { type: "string" }
        },
        required: ["username", "password"],
    },
    response: {
        200: {
            description: "Successful login",
            type: "object",
            properties: {
                token: { type: "string" }
            }
        },
        400: {
            description: "Bad Request",
            type: "object",
            properties: {
                error: { type: "string" }
            }
        },
        401: {
            description: "Unauthorized",
            type: "object",
            properties: {
                error: { type: "string" }
            }
        },
        500: {
            description: "Internal Server Error",
            type: "object",
            properties: {
                error: { type: "string" }
            }
        }
    }
};