import type { FastifyRequest, FastifyReply } from "fastify";
import type { LoginInput } from "../models/dto/input/login.dto.js";
import { LoginError } from "../errors/login.errors.js";
import { moduleLogger } from "../lib/module-logger.js";

export function buildLoginController(adapters: any) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const input = request.body as LoginInput;

    moduleLogger.info({
      folder: "CONTROLLER",
      class: "LoginController",
      method: "buildLoginController",
      context: `Request received | hasUsername: ${Boolean(input?.username)} | hasPassword: ${Boolean(input?.password)}`,
    });

    try {
      // Expect the orchestrator to provide the actual use case implementation
      if (adapters && typeof adapters.loginUseCase === "function") {
        moduleLogger.info({
          folder: "CONTROLLER",
          class: "LoginController",
          method: "buildLoginController",
          context: "if loginUseCase → Adapter call loginUseCase",
        });

        const result = await adapters.loginUseCase(input);

        moduleLogger.info({
          folder: "CONTROLLER",
          class: "LoginController",
          method: "buildLoginController",
          context: "loginUseCase → response success | status: 200",
        });

        return reply.status(200).send(result);
      }

      moduleLogger.warn({
        folder: "CONTROLLER",
        class: "LoginController",
        method: "buildLoginController",
        context: "if loginUseCase → adapter not configured | status: 501",
      });

      return reply.status(501).send({
        errorCode: "BBOM-INTERNAL",
        details: {
          message: "Login use case not implemented. Provide 'loginUseCase' via adapters.",
        },
      });
    } catch (error: any) {
      // Handle typed LoginError exceptions
      if (error instanceof LoginError) {
        moduleLogger.warn({
          folder: "CONTROLLER",
          class: "LoginController",
          method: "buildLoginController",
          context: `catch LoginError | errorCode: ${error.errorCode} | statusCode: ${error.statusCode} | traceId: ${error.details?.traceId}`,
        });

        return reply.status(error.statusCode).send({
          errorCode: error.errorCode,
          details: error.details,
        });
      }

      // Generic internal error
      moduleLogger.error({
        folder: "CONTROLLER",
        class: "LoginController",
        method: "buildLoginController",
        context: "catch unexpected | status: 500",
      });

      return reply.status(500).send({
        errorCode: "BBOM-INTERNAL",
        details: {
          message: "Internal server error",
        },
      });
    }
  };
}
