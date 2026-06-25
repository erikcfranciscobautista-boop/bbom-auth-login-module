import type { FastifyPluginAsync } from "fastify";
import type {
  LoginAdapters,
  LoginControllerAdapters,
  LoginExecutionAdapter,
  LoginRoutesPluginOptions,
} from "../contracts.js";
import { buildLoginController } from "../controllers/login.controller.js";
import { LoginInputSchema } from "../models/dto/input/login.dto.js";
import { LoginBadRequestError } from "../errors/login.errors.js";
import { zodValidationPreHandler } from "../middlewares/zodValidationPreHandler.js";
import {
  configureModuleLogger,
  moduleLogger,
  type ModuleLoggerAdapter,
} from "../lib/module-logger.js";
import { buildLoginUseCase } from "../services/login.implementation.js";

const resolveAdapters = (
  app: Parameters<FastifyPluginAsync>[0],
  options: LoginRoutesPluginOptions
): LoginAdapters | null => {
  if (options.adapters) {
    return options.adapters;
  }

  const decoratedApp = app as typeof app & {
    loginAdapters?: LoginControllerAdapters;
  };

  return decoratedApp.loginAdapters ?? null;
};

const resolveLoginUseCase = (
  adapters: LoginAdapters,
  options: LoginRoutesPluginOptions,
  decoratedUseCase?: LoginExecutionAdapter
): LoginExecutionAdapter => {
  if (options.loginUseCase) {
    return options.loginUseCase;
  }

  if (decoratedUseCase) {
    return decoratedUseCase;
  }

  const useCase = buildLoginUseCase();
  return (input) => useCase(input, adapters);
};

const buildFastifyLoggerAdapter = (
  app: Parameters<FastifyPluginAsync>[0]
): ModuleLoggerAdapter | undefined => {
  if (!app.log) {
    return undefined;
  }

  return {
    info: (entry) => app.log.info({ context: entry.context }, entry.message),
    warn: (entry) => app.log.warn({ context: entry.context }, entry.message),
    error: (entry) => app.log.error({ context: entry.context }, entry.message),
  };
};

export const loginRoutes: FastifyPluginAsync<LoginRoutesPluginOptions> = async (
  app,
  options
) => {
  configureModuleLogger(options.logger ?? buildFastifyLoggerAdapter(app));

  const routePath = options.routePath ?? "/login";

  moduleLogger.info({
    folder: "ROUTE",
    class: "LoginRoutes",
    method: "loginRoutes",
    context: `Initializing route POST ${routePath}`,
  });

  const adapters = resolveAdapters(app, options);

  const decoratedApp = app as typeof app & {
    loginAdapters?: LoginControllerAdapters;
  };

  const decoratedUseCase = decoratedApp.loginAdapters?.loginUseCase;

  if (!adapters) {
    moduleLogger.error({
      folder: "ROUTE",
      class: "LoginRoutes",
      method: "loginRoutes",
      context: "Missing adapters. Provide options.adapters or app.decorate('loginAdapters', ...) before registering routes",
    });

    throw new Error(
      "Missing adapters: provide { adapters } in app.register(loginRoutes, ...) or decorate app.loginAdapters"
    );
  }

  const loginUseCase = resolveLoginUseCase(adapters, options, decoratedUseCase);
  const controller = buildLoginController({ loginUseCase });

  app.post(
    routePath,
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
    context: `Route registered POST ${routePath}`,
  });
};
