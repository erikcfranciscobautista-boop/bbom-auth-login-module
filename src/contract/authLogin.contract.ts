import { GetBurmUserProfileIdentifiersUniquePort } from "./ports/burmUserProfileIdentifiersUnique.port.js";
import { PostBurmCredentialValidationsPort } from "./ports/burmCredentialValidations.port.js";
import { GetBcpmStatusesOnePort } from "./ports/bcpmStatusesOne.port.js";
import { GetBcpmRolePermissionsListPort } from "./ports/bcpmRolePermissionsList.port.js";
import { PostBurmCredentialTokensPort } from "./ports/burmCredentialTokens.port.js";

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

export {GetBurmUserProfileIdentifiersUniquePort} from "./ports/burmUserProfileIdentifiersUnique.port.js";
export {PostBurmCredentialValidationsPort} from "./ports/burmCredentialValidations.port.js";
export {GetBcpmStatusesOnePort} from "./ports/bcpmStatusesOne.port.js";
export {GetBcpmRolePermissionsListPort} from "./ports/bcpmRolePermissionsList.port.js";
export {PostBurmCredentialTokensPort} from "./ports/burmCredentialTokens.port.js";