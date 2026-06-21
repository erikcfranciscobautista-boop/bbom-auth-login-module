import type { FastifyRequest, FastifyReply } from "fastify";
import type { LoginControllerAdapters } from "../contracts.js";
export declare function buildLoginController(adapters: LoginControllerAdapters): (request: FastifyRequest, reply: FastifyReply) => Promise<never>;
