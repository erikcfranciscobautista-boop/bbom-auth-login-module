import type { FastifyReply, FastifyRequest } from "fastify";
import type { ZodSchema } from "zod";
type RequestTarget = "body" | "query" | "params";
type ZodValidationPreHandlerOptions = {
    target?: RequestTarget;
    onError?: (payload: unknown) => {
        statusCode: number;
        body: unknown;
    };
};
export declare const zodValidationPreHandler: <T>(schema: ZodSchema<T>, options?: ZodValidationPreHandlerOptions) => (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export {};
