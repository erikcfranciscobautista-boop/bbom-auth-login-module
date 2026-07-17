import {
    GetBcpmRolePermissionsListPort,
    GetBcpmStatusesOnePort,
    GetBurmUserProfileIdentifiersUniquePort,
    PostBurmCredentialTokensPort,
    PostBurmCredentialValidationsPort
} from "./ports/index.ports.js";

export interface AuthLoginLogger {
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
    debug?: (...args: unknown[]) => void;
}

export interface AuthLoginContract {
    req : unknown;
    ports : {
        getBurmUserProfileIdentifiersUniquePort : GetBurmUserProfileIdentifiersUniquePort;
        postBurmCredentialValidationsPort : PostBurmCredentialValidationsPort;
        getBcpmStatusesOnePort : GetBcpmStatusesOnePort;
        getBcpmRolePermissionsListPort : GetBcpmRolePermissionsListPort;
        postBurmCredentialTokensPort : PostBurmCredentialTokensPort;
        getSystemTokenPort: () => Promise<string>;
    };
    logger?: AuthLoginLogger;
}

export type {
    GetBurmUserProfileIdentifiersUniquePort,
    PostBurmCredentialValidationsPort,
    GetBcpmStatusesOnePort,
    GetBcpmRolePermissionsListPort,
    PostBurmCredentialTokensPort
} from "./ports/index.ports.js";