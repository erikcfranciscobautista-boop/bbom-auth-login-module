import { AuthLoginInDto } from '../../dto/authLogin.in.dto.js';
import {
    AuthLoginLogger,
    PostBurmProfileIdentifierPort
} from '../../contract/authLogin.contract.js';
import { AuthLoginErrorService } from '../../errors/authLogin.errors.js';

interface JStepBurmPforileIdenfierOptions {
    request: AuthLoginInDto;
    profIdentifier: PostBurmProfileIdentifierPort;
    logger: AuthLoginLogger;
}

export async function jstepBurmPforileIdenfier(options: JStepBurmPforileIdenfierOptions) {
    const { request, profIdentifier, logger } = options;

    logger.info?.('step : burmProfileIdentifier');
    const profileIdentifier = await profIdentifier(request.username, request.password);

    if (
        !profileIdentifier ||
        !profileIdentifier.burmUserId ||
        !profileIdentifier.bcpmStatusId ||
        !profileIdentifier.bcpmDepartmentId ||
        !profileIdentifier.bcpmRoleId
    ) {
        logger.error?.('error - [burmProfileIdentifier] : incomplete response');
        throw AuthLoginErrorService;
    }

    return profileIdentifier;
}