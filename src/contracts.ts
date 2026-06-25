import type { LoginInput } from "./models/dto/input/login.dto.js";
import type { LoginOutput } from "./models/dto/output/login.dto.js";
import type { ModuleLoggerAdapter } from "./lib/module-logger.js";

export type BurmProfileResponse = {
  burmProfileId: string;
  burmUserId: string;
  burmStatusId: string;
  burmDepartmentId: string;
  burmRoleId: string;
};

export type BcpmStatusResponse = {
  bcpmStatusId: string;
  bcpmStatusKey: string;
  bcpmStatusName: string;
};

export type BcpmPermission = {
  resource: string;
  action: string;
  scope: string;
};

export type BcpmPermissionsResponse = BcpmPermission[];

export type BurmTokenResponse = {
  burmToken: string;
};

export type LoginAdapters = {
  // BURM: Validate credentials and get profile info
  postBurmProfilesIdentifier: (
    username: string,
    password: string
  ) => Promise<BurmProfileResponse>;

  // BCPM: Check profile status
  getBcpmStatusesStatusId: (statusId: string) => Promise<BcpmStatusResponse>;

  // BCPM: Get permissions by role
  getBcpmPermissionsRoleId: (roleId: string) => Promise<BcpmPermissionsResponse>;

  // BURM: Generate JWT token
  postBurmCredentialsGenerateToken: (
    userId: string,
    roleId: string,
    departmentId: string,
    permissions: BcpmPermissionsResponse
  ) => Promise<BurmTokenResponse>;

  // BURM: Increment failed login attempts
  patchBurmCredentialsIncrementAttempts: (
    userId: string
  ) => Promise<{ statusId: string; attempts: number }>;

  // BURM: Block user profile
  patchBurmProfilesBlocked: (userId: string) => Promise<void>;
};

export type LoginExecutionAdapter = (input: LoginInput) => Promise<LoginOutput>;

// Decorated object expected by routes/controller at runtime.
export type LoginControllerAdapters = LoginAdapters & {
  loginUseCase: LoginExecutionAdapter;
};

export type LoginRoutesPluginOptions = {
  // Preferred integration path: provide adapters directly when registering routes.
  adapters?: LoginAdapters;

  // Optional custom execution adapter. If omitted, the module builds one from adapters.
  loginUseCase?: LoginExecutionAdapter;

  // Optional route override. Defaults to /login.
  routePath?: string;

  // Optional logger adapter. Falls back to app.log if available.
  logger?: ModuleLoggerAdapter;
};
