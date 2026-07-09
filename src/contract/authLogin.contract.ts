import { PostBurmProfileIdentifierPort } from "./ports/burmProfileIdentifier.port.js";
import { GetBcpmStatusesStatusIdPort } from "./ports/bcpmStatusesStatusId.port.js";
import { GetBcpmPermissionsRoleIdPort } from "./ports/bcpmPermissionsRoleId.port.js";

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
    };
    logger?: AuthLoginLogger;
}

export {PostBurmProfileIdentifierPort} from "./ports/burmProfileIdentifier.port.js";
export {GetBcpmStatusesStatusIdPort} from "./ports/bcpmStatusesStatusId.port.js";
export {GetBcpmPermissionsRoleIdPort} from "./ports/bcpmPermissionsRoleId.port.js";