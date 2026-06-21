import type { LoginInput } from "../models/dto/input/login.dto.js";
import type { LoginOutput } from "../models/dto/output/login.dto.js";
import type { LoginAdapters } from "../contracts.js";
export type LoginUseCase = (input: LoginInput, adapters: LoginAdapters) => Promise<LoginOutput>;
/**
 * Implements the complete login orchestration flow per the technical design:
 * 1. POST => bbomAuthLogin (entry point - caller responsibility)
 * 2. POST => postBurmProfilesIdentifier (validate credentials and get profile)
 * 3. GET => getBcpmStatusesStatusId (check admin status)
 * 4. GET => getBcpmPermissionsRoleId (extract permissions)
 * 5. POST => postBurmCredentialsGenerateToken (generate JWT)
 *
 * On error in step 2:
 * - Increment failed attempts via patchBurmCredentialsIncrementAttempts
 * - If attempts >= 5, block profile via patchBurmProfilesBlocked
 * - Return generic error
 */
export declare const buildLoginUseCase: () => LoginUseCase;
