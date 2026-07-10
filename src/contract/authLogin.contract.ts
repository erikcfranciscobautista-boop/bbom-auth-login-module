import { PostBurmProfileIdentifierPort } from "./ports/burmProfileIdentifier.port.js";
import { GetBcpmStatusesStatusIdPort } from "./ports/bcpmStatusesStatusId.port.js";
import { GetBcpmPermissionsRoleIdPort } from "./ports/bcpmPermissionsRoleId.port.js";
import { PostBurmCredentialsGenerateTokenPort } from "./ports/burmCredentialsGenerateToken.port.js";
import { PatchBurmCredentialsIncrementAttemptsPort } from "./ports/burmCredentialsIncrementAttempts.port.js";
import { PatchBurmProfilesBlockedPort } from "./ports/burmProfilesBlocked.port.js";

export interface AuthLoginLogger {
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
    debug?: (...args: unknown[]) => void;
}

export interface AuthLoginContract {
    req : unknown;
    ports : {
        postBurmProfileIdentifierPort : PostBurmProfileIdentifierPort;
        getBcpmStatusesStatusIdPort : GetBcpmStatusesStatusIdPort;
        getBcpmPermissionsRoleIdPort : GetBcpmPermissionsRoleIdPort;
        postBurmCredentialsGenerateTokenPort : PostBurmCredentialsGenerateTokenPort;
        patchBurmCredentialsIncrementAttemptsPort : PatchBurmCredentialsIncrementAttemptsPort;
        patchBurmProfilesBlockedPort : PatchBurmProfilesBlockedPort;
    };
    logger?: AuthLoginLogger;
}

export {PostBurmProfileIdentifierPort} from "./ports/burmProfileIdentifier.port.js";
export {GetBcpmStatusesStatusIdPort} from "./ports/bcpmStatusesStatusId.port.js";
export {GetBcpmPermissionsRoleIdPort} from "./ports/bcpmPermissionsRoleId.port.js";
export {PostBurmCredentialsGenerateTokenPort} from "./ports/burmCredentialsGenerateToken.port.js";
export {PatchBurmCredentialsIncrementAttemptsPort} from "./ports/burmCredentialsIncrementAttempts.port.js";
export {PatchBurmProfilesBlockedPort} from "./ports/burmProfilesBlocked.port.js";