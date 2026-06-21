import type { LoginInput } from "../models/dto/input/login.dto.js";
import type { LoginOutput } from "../models/dto/output/login.dto.js";
import type { LoginAdapters } from "../contracts.js";
import {
  BcpmConnectionError,
  BurmConnectionError,
  InvalidCredentialsError,
} from "../errors/login.errors.js";
import { moduleLogger } from "../lib/module-logger.js";

export type LoginUseCase = (
  input: LoginInput,
  adapters: LoginAdapters
) => Promise<LoginOutput>;

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
export const buildLoginUseCase = (): LoginUseCase => {
  return async (input: LoginInput, adapters: LoginAdapters) => {
    moduleLogger.info({
      folder: "SERVICE",
      class: "LoginUseCase",
      method: "buildLoginUseCase",
      context: `Starting login orchestration | hasUsername: ${Boolean(input?.username)}`,
    });

    let profileResponse;

    try {
      // Step 2: Validate credentials with BURM
      moduleLogger.info({
        folder: "SERVICE",
        class: "LoginUseCase",
        method: "buildLoginUseCase",
        context: "Adapter call → postBurmProfilesIdentifier",
      });

      profileResponse = await adapters.postBurmProfilesIdentifier(
        input.username,
        input.password
      );

      moduleLogger.info({
        folder: "SERVICE",
        class: "LoginUseCase",
        method: "buildLoginUseCase",
        context: "postBurmProfilesIdentifier → response success",
      });
    } catch (error: any) {
      // If credential validation fails (401/404), increment attempts and possibly block.
      let userId: string | undefined;
      const isInvalidCredentials = error?.statusCode === 401 || error?.statusCode === 404;

      moduleLogger.warn({
        folder: "SERVICE",
        class: "LoginUseCase",
        method: "buildLoginUseCase",
        context: `postBurmProfilesIdentifier → catch | statusCode: ${error?.statusCode} | upstream: BURM | category: ${isInvalidCredentials ? "AUTH" : "CONNECTION_OR_INTERNAL"}`,
      });

      // Try to extract burmUserId from error context if available
      if (error.burmUserId) {
        userId = error.burmUserId;
      }

      if (isInvalidCredentials && userId) {
        try {
          moduleLogger.info({
            folder: "SERVICE",
            class: "LoginUseCase",
            method: "buildLoginUseCase",
            context: `if isInvalidCredentials → Adapter call patchBurmCredentialsIncrementAttempts | userId: ${userId}`,
          });

          const attemptsResponse = await adapters.patchBurmCredentialsIncrementAttempts(userId);

          // If attempts reach 5, block the account
          if (attemptsResponse.attempts >= 5) {
            try {
              moduleLogger.warn({
                folder: "SERVICE",
                class: "LoginUseCase",
                method: "buildLoginUseCase",
                context: `if attempts >= 5 → Adapter call patchBurmProfilesBlocked | userId: ${userId} | attempts: ${attemptsResponse.attempts}`,
              });

              await adapters.patchBurmProfilesBlocked(userId);
            } catch (_blockError) {
              moduleLogger.error({
                folder: "SERVICE",
                class: "LoginUseCase",
                method: "buildLoginUseCase",
                context: `patchBurmProfilesBlocked → catch | userId: ${userId}`,
              });

              // Ignore block error; still return generic error
            }
          }
        } catch (_incrementError) {
          moduleLogger.error({
            folder: "SERVICE",
            class: "LoginUseCase",
            method: "buildLoginUseCase",
            context: `patchBurmCredentialsIncrementAttempts → catch | userId: ${userId}`,
          });

          // Ignore increment attempt error; still return generic error
        }
      }

      if (isInvalidCredentials) {
        moduleLogger.warn({
          folder: "SERVICE",
          class: "LoginUseCase",
          method: "buildLoginUseCase",
          context: "throw InvalidCredentialsError",
        });

        throw new InvalidCredentialsError(error.errorCode || error.traceId);
      }

      moduleLogger.error({
        folder: "SERVICE",
        class: "LoginUseCase",
        method: "buildLoginUseCase",
        context: `throw BurmConnectionError | upstream: BURM | statusCode: ${error?.statusCode} | errorCode: ${error?.errorCode}`,
      });

      throw new BurmConnectionError();
    }

    try {
      // Step 3: Check administrative status with BCPM
      moduleLogger.info({
        folder: "SERVICE",
        class: "LoginUseCase",
        method: "buildLoginUseCase",
        context: "Adapter call → getBcpmStatusesStatusId",
      });

      const statusResponse = await adapters.getBcpmStatusesStatusId(profileResponse.burmStatusId);

      // Verify status is ACTIVE
      moduleLogger.info({
        folder: "SERVICE",
        class: "LoginUseCase",
        method: "buildLoginUseCase",
        context: `if bcpmStatusKey === ACTIVE | current: ${statusResponse.bcpmStatusKey} | success: ${statusResponse.bcpmStatusKey === "ACTIVE"}`,
      });

      if (statusResponse.bcpmStatusKey !== "ACTIVE") {
        throw new InvalidCredentialsError(statusResponse.bcpmStatusId);
      }

      // Step 4: Get permissions for the role
      moduleLogger.info({
        folder: "SERVICE",
        class: "LoginUseCase",
        method: "buildLoginUseCase",
        context: "Adapter call → getBcpmPermissionsRoleId",
      });

      const permissions = await adapters.getBcpmPermissionsRoleId(profileResponse.burmRoleId);

      let tokenResponse;
      try {
        // Step 5: Generate JWT token in BURM
        moduleLogger.info({
          folder: "SERVICE",
          class: "LoginUseCase",
          method: "buildLoginUseCase",
          context: "Adapter call → postBurmCredentialsGenerateToken",
        });

        tokenResponse = await adapters.postBurmCredentialsGenerateToken(
          profileResponse.burmUserId,
          profileResponse.burmRoleId,
          profileResponse.burmDepartmentId,
          permissions
        );
      } catch (_burmGenerateTokenError: any) {
        moduleLogger.error({
          folder: "SERVICE",
          class: "LoginUseCase",
          method: "buildLoginUseCase",
          context: "postBurmCredentialsGenerateToken → catch | throw BurmConnectionError",
        });

        throw new BurmConnectionError();
      }

      moduleLogger.info({
        folder: "SERVICE",
        class: "LoginUseCase",
        method: "buildLoginUseCase",
        context: "Login orchestration completed → response success",
      });

      return {
        token: tokenResponse.burmToken,
      };
    } catch (error: any) {
      if (error instanceof InvalidCredentialsError || error instanceof BurmConnectionError) {
        moduleLogger.warn({
          folder: "SERVICE",
          class: "LoginUseCase",
          method: "buildLoginUseCase",
          context: `throw propagated | errorName: ${error.name}`,
        });

        throw error;
      }

      // BCPM connectivity/internal errors are wrapped as connection errors.
      moduleLogger.error({
        folder: "SERVICE",
        class: "LoginUseCase",
        method: "buildLoginUseCase",
        context: `throw BcpmConnectionError | upstream: BCPM | statusCode: ${error?.statusCode} | errorCode: ${error?.errorCode}`,
      });

      throw new BcpmConnectionError();
    }
  };
};
