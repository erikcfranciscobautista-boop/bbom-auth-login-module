import type { LoginInput } from "./models/dto/input/login.dto.js";
import type { LoginOutput } from "./models/dto/output/login.dto.js";
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
    postBurmProfilesIdentifier: (username: string, password: string) => Promise<BurmProfileResponse>;
    getBcpmStatusesStatusId: (statusId: string) => Promise<BcpmStatusResponse>;
    getBcpmPermissionsRoleId: (roleId: string) => Promise<BcpmPermissionsResponse>;
    postBurmCredentialsGenerateToken: (userId: string, roleId: string, departmentId: string, permissions: BcpmPermissionsResponse) => Promise<BurmTokenResponse>;
    patchBurmCredentialsIncrementAttempts: (userId: string) => Promise<{
        statusId: string;
        attempts: number;
    }>;
    patchBurmProfilesBlocked: (userId: string) => Promise<void>;
};
export type LoginExecutionAdapter = (input: LoginInput) => Promise<LoginOutput>;
export type LoginControllerAdapters = LoginAdapters & {
    loginUseCase: LoginExecutionAdapter;
};
