// En tu módulo de definición
export const SwaggerAuthLoginInSchema = {
    tags: ["login"], // Debe ser un arreglo
    body: {
        type: "object",
        properties: {
            username: { type: "string" },
            password: { type: "string" }
        },
        required: ["username", "password"],
    },
};