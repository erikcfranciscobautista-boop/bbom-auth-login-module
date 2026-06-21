import type { FastifyPluginAsync } from "fastify";
import { buildLoginController } from "../controllers/login.controller.js";
import { LoginInputSchema } from "../models/dto/input/login.dto.js";
import { LoginBadRequestError } from "../errors/login.errors.js";
import { zodValidationPreHandler } from "../middlewares/zodValidationPreHandler.js";
import { moduleLogger } from "../lib/module-logger.js";

export const loginRoutes: FastifyPluginAsync = async (app) => {
  moduleLogger.info({
    folder: "ROUTE",
    class: "LoginRoutes",
    method: "loginRoutes",
    context: "Initializing route POST /login",
  });

  const adapters = (app as any).loginAdapters || null;

  if (!adapters) {
    moduleLogger.error({
      folder: "ROUTE",
      class: "LoginRoutes",
      method: "loginRoutes",
      context: "if loginAdapters → throw Error: loginAdapters not decorated",
    });
    throw new Error("loginAdapters not decorated by orchestrator");
  }

  const controller = buildLoginController(adapters);

  app.post(
    "/login",
    {
      preHandler: zodValidationPreHandler(LoginInputSchema, {
        target: "body",
        onError: (payload) => {
          moduleLogger.warn({
            folder: "ROUTE",
            class: "LoginRoutes",
            method: "onError",
            context: `zodValidationPreHandler → onError | payloadType: ${payload === null ? "null" : typeof payload}`,
          });

          const badRequestError = new LoginBadRequestError(payload);
          return {
            statusCode: badRequestError.statusCode,
            body: {
              errorCode: badRequestError.errorCode,
              details: badRequestError.details,
            },
          };
        },
      }),
    },
    controller
  );

  moduleLogger.info({
    folder: "ROUTE",
    class: "LoginRoutes",
    method: "loginRoutes",
    context: "Route registered POST /login",
  });
};
