import { type AuthLoginInDto } from '../../dto/index.dto.js';
import {
    AuthLoginLogger,
    GetBurmUserProfileIdentifiersUniquePort
} from '../../contract/index.contract.js';
import { AuthLoginErrorService, AuthLoginErrorValidationBurm } from '../../errors/index.errors.js';
import { getStatusCode } from '../utils/index.utils.js';

interface JstepBurmUserProfileIdentifiersUniqueOptions {
    request: AuthLoginInDto;
    getBurmUserProfileIdentifiersUnique: GetBurmUserProfileIdentifiersUniquePort;
    systemToken: string;
    logger: AuthLoginLogger;
}

function buildUniqueIdentifierParams(username: string): {
    nickname?: string;
    burmUserPhone?: string;
    burmUserEmail?: string;
} {
    const input = username.trim();

    // If username matches a basic email pattern, search by email.
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
        return { burmUserEmail: input };
    }

    // If username is numeric (optional + prefix), search by phone.
    if (/^\+?\d{7,15}$/.test(input)) {
        return { burmUserPhone: input };
    }

    // Otherwise fallback to nickname.
    return { nickname: input };
}

export async function jstepBurmUserProfileIdentifiersUnique(options: JstepBurmUserProfileIdentifiersUniqueOptions) {
    const {
        request,
        getBurmUserProfileIdentifiersUnique,
        systemToken,
        logger
    } = options;

    logger.info?.('step : burmUserProfileIdentifiersUnique');

    let profileIdentifier;
    try {
        const identifierParams = buildUniqueIdentifierParams(request.username);
        profileIdentifier = await getBurmUserProfileIdentifiersUnique(identifierParams, systemToken);
    } catch (error) {
        const statusCode = getStatusCode(error);
        if (statusCode === 404) {
            logger.warn?.('warn - [burmUserProfileIdentifiersUnique] : resource not found');
            throw AuthLoginErrorValidationBurm;
        }

        logger.error?.('error - [burmUserProfileIdentifiersUnique] : unexpected error', error);
        throw AuthLoginErrorService;
    }

    if (
        !profileIdentifier ||
        !profileIdentifier.burmUser ||
        !profileIdentifier.burmUser.burmUserId ||
        !profileIdentifier.burmProfile ||
        !profileIdentifier.burmProfile.bcpmStatusId ||
        !profileIdentifier.burmProfile.bcpmDepartmentId ||
        !profileIdentifier.burmProfile.bcpmRoleId
    ) {
        logger.error?.('error - [burmUserProfileIdentifiersUnique] : incomplete response');
        throw AuthLoginErrorService;
    }

    return {
        burmUserId: profileIdentifier.burmUser.burmUserId,
        bcpmStatusId: profileIdentifier.burmProfile.bcpmStatusId,
        bcpmDepartmentId: profileIdentifier.burmProfile.bcpmDepartmentId,
        bcpmRoleId: profileIdentifier.burmProfile.bcpmRoleId
    };
}