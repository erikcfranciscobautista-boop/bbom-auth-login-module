import type { LoginInput } from "../models/dto/input/login.dto.js";
import type { LoginOutput } from "../models/dto/output/login.dto.js";
import type { LoginAdapters } from "../contracts.js";

export type LoginUseCase = (
  input: LoginInput,
  adapters: LoginAdapters
) => Promise<LoginOutput>;

