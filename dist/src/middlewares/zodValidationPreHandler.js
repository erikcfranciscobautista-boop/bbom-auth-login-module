import { moduleLogger } from "../lib/module-logger.js";
export const zodValidationPreHandler = (schema, options) => {
    const target = options?.target ?? "body";
    return async (request, reply) => {
        const payload = request[target];
        moduleLogger.info({
            folder: "MIDDLEWARE",
            class: "ZodValidationPreHandler",
            method: "zodValidationPreHandler",
            context: `Executing Zod validation | target: ${target}`,
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
            moduleLogger.warn({
                folder: "MIDDLEWARE",
                class: "ZodValidationPreHandler",
                method: "zodValidationPreHandler",
                context: `Zod validation → failed | target: ${target} | issueCount: ${parsed.error.issues.length}`,
            });
            if (options?.onError) {
                const mapped = options.onError(payload);
                return reply.status(mapped.statusCode).send(mapped.body);
            }
            return reply.status(400).send({
                message: "Validation error",
                errors: parsed.error.issues,
            });
        }
        moduleLogger.info({
            folder: "MIDDLEWARE",
            class: "ZodValidationPreHandler",
            method: "zodValidationPreHandler",
            context: `Zod validation → passed | target: ${target}`,
        });
        if (target === "body") {
            request.body = parsed.data;
        }
    };
};
