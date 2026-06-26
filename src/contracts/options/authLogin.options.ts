import { PostBurmProfileIdentifierPort } from "./ports/burm.ports.js";

export interface ExecuteAuthLoginOptions {
    req : unknown;
    ports : {
        postBurmProfileIdentifierPort : PostBurmProfileIdentifierPort;
    }
}