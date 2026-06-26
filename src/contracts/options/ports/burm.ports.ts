import { BurmProfileIdentifierDto } from '../../models/burm/profileIdentifier.dto.js';

export type PostBurmProfileIdentifierPort = (
    username : string
) => Promise<BurmProfileIdentifierDto>;