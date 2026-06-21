import type { LoginAdapters } from "../../src/contracts.js";
import type { LoginInput } from "../../src/models/dto/input/login.dto.js";
import type { LoginOutput } from "../../src/models/dto/output/login.dto.js";
export type ExecuteLogin = (input: LoginInput) => Promise<LoginOutput>;
export declare const buildLoginExecutionAdapter: (adapters: LoginAdapters) => ExecuteLogin;
