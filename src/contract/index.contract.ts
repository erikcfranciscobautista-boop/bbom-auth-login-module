import type {
    CreateBurmCredentialTokenPort,
    GetBcpmRolePermissionsByRolePort,
    GetBcpmStatusValidateActivePort,
    GetBurmCredentialValidationPort,
    GetBurmUserProfileIdentifierPort
} from './ports/index.ports.js';

export interface AuthLoginLogger {
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
    debug?: (...args: unknown[]) => void;
}

export interface AuthLoginContract {
    req: unknown;
    ports: {
        getBurmUserProfileIdentifierPort: GetBurmUserProfileIdentifierPort;
        getBurmCredentialValidationPort: GetBurmCredentialValidationPort;
        getBcpmStatusValidateActivePort: GetBcpmStatusValidateActivePort;
        getBcpmRolePermissionsByRolePort: GetBcpmRolePermissionsByRolePort;
        createBurmCredentialTokenPort: CreateBurmCredentialTokenPort;
    };
    logger?: AuthLoginLogger;
}

export type {
    CreateBurmCredentialTokenPort,
    CreateBurmCredentialTokenRequest,
    CreateBurmCredentialTokenResponse,
    
    GetBcpmRolePermissionsByRolePort,
    GetBcpmRolePermissionsByRoleRequest,
    GetBcpmRolePermissionsByRoleResponse,
    
    GetBcpmStatusValidateActivePort,
    GetBcpmStatusValidateActiveRequest,
    GetBcpmStatusValidateActiveResponse,
    
    GetBurmCredentialValidationPort,
    GetBurmCredentialValidationRequest,
    GetBurmCredentialValidationResponse,
    
    GetBurmUserProfileIdentifierPort,
    GetBurmUserProfileIdentifierRequest,
    GetBurmUserProfileIdentifierResponse
} from './ports/index.ports.js';
