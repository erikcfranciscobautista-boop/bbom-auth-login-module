import { PostBurmProfileIdentifierPort } from "./ports/burmProfileIdentifier.port.js";

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
    };
    logger?: AuthLoginLogger;
}

export {PostBurmProfileIdentifierPort} from "./ports/burmProfileIdentifier.port.js";