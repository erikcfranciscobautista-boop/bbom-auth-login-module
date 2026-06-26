import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";
import type { ZodTypeAny } from "zod";
import { AuthLoginErrorRequest } from "../errors/authLogin.errors.js";

type ValidationTargets = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  querystring?: ZodTypeAny;
  headers?: ZodTypeAny;
  bodyRequiredFields?: string[];
};

const resolveMissingFields = (
  payload: unknown,
  segment: keyof ValidationTargets,
  fallbackRequiredFields: string[]
): string[] => {
  if (segment !== "body") {
    return [];
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return fallbackRequiredFields;
  }

  const bodyPayload = payload as Record<string, unknown>;
  return fallbackRequiredFields.filter((field) => bodyPayload[field] === undefined || bodyPayload[field] === null);
};

const authLoginMiddlewareValidate = (
  schema: ZodTypeAny,
  payload: unknown,
  segment: keyof ValidationTargets,
  bodyRequiredFields: string[],
  request: FastifyRequest,
  reply: FastifyReply
): boolean => {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    const missing = resolveMissingFields(payload, segment, bodyRequiredFields);

    void reply.status(400).send(AuthLoginErrorRequest);

    return false;
  }

  const mutableRequest = request as unknown as Record<string, unknown>;
  mutableRequest[segment] = parsed.data;

  return true;
};

export const authLoginMiddleware = (
  targets: ValidationTargets
): preHandlerHookHandler => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const bodyRequiredFields = targets.bodyRequiredFields ?? [];

    if (targets.body && !authLoginMiddlewareValidate(targets.body, request.body, "body", bodyRequiredFields, request, reply)) {
      return reply;
    }

    if (targets.params && !authLoginMiddlewareValidate(targets.params, request.params, "params", [], request, reply)) {
      return reply;
    }

    if (
      targets.querystring
      && !authLoginMiddlewareValidate(targets.querystring, request.query, "querystring", [], request, reply)
    ) {
      return reply;
    }

    if (targets.headers && !authLoginMiddlewareValidate(targets.headers, request.headers, "headers", [], request, reply)) {
      return reply;
    }
  };
};