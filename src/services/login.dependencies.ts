// This file contains default adapter stubs. Implementation (use case) lives in the orchestrator
// or in a dedicated service implementation. Keep this module free of business logic.

import type { LoginAdapters } from "../contracts.js";

export const defaultLoginAdapters: LoginAdapters = {
  postBurmProfilesIdentifier: async () => {
    throw new Error("Adapter 'postBurmProfilesIdentifier' not provided by orchestrator");
  },
  getBcpmStatusesStatusId: async () => {
    throw new Error("Adapter 'getBcpmStatusesStatusId' not provided by orchestrator");
  },
  getBcpmPermissionsRoleId: async () => {
    throw new Error("Adapter 'getBcpmPermissionsRoleId' not provided by orchestrator");
  },
  postBurmCredentialsGenerateToken: async () => {
    throw new Error("Adapter 'postBurmCredentialsGenerateToken' not provided by orchestrator");
  },
  patchBurmCredentialsIncrementAttempts: async () => {
    throw new Error("Adapter 'patchBurmCredentialsIncrementAttempts' not provided by orchestrator");
  },
  patchBurmProfilesBlocked: async () => {
    throw new Error("Adapter 'patchBurmProfilesBlocked' not provided by orchestrator");
  },
};

export type DefaultLoginAdapters = typeof defaultLoginAdapters;
