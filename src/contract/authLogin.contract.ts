import { PostBurmProfileIdentifierPort } from "./ports/burmProfileIdentifier.port.js";

export interface AuthLoginContract {
    req : unknown;
    ports : {
        postBurmProfileIdentifierPort : PostBurmProfileIdentifierPort;
    }
}

export {PostBurmProfileIdentifierPort} from "./ports/burmProfileIdentifier.port.js";