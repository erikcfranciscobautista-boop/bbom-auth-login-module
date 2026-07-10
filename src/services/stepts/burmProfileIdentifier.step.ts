import { AuthLoginInDto } from '../../dto/authLogin.in.dto.js';
import {
    AuthLoginLogger,
    PatchBurmCredentialsIncrementAttemptsPort,
    PatchBurmProfilesBlockedPort,
    PostBurmProfileIdentifierPort
} from '../../contract/authLogin.contract.js';
import { AuthLoginErrorService, AuthLoginErrorValidationBurm } from '../../errors/authLogin.errors.js';
import { jstepBurmCredentialsIncrementAttempts } from './burmCredentialsIncrementAttempts.step.js';
import { jstepBurmProfilesBlocked } from './burmProfilesBlocked.step.js';
import { getStatusCode } from '../utils/getStatusCode.util.js';

interface JStepBurmPforileIdenfierOptions {
    request: AuthLoginInDto;
    profIdentifier: PostBurmProfileIdentifierPort;
    patchBurmCredentialsIncrementAttempts: PatchBurmCredentialsIncrementAttemptsPort;
    patchBurmProfilesBlocked: PatchBurmProfilesBlockedPort;
    logger: AuthLoginLogger;
}

export async function jstepBurmPforileIdenfier(options: JStepBurmPforileIdenfierOptions) {
    const {
        request,
        profIdentifier,
        patchBurmCredentialsIncrementAttempts,
        patchBurmProfilesBlocked,
        logger
    } = options;

    logger.info?.('step : burmProfileIdentifier');

    let profileIdentifier;
    try {
        profileIdentifier = await profIdentifier(request.username, request.password);
    } catch (error: any) {
        logger.error('error - [burmProfileIdentifier] : error during profile identification');

        const statusCode = getStatusCode(error);
        if (!statusCode || statusCode === 401 || statusCode === 404) {
            const attempts = await jstepBurmCredentialsIncrementAttempts({
                burmUserId: request.username,
                patchBurmCredentialsIncrementAttempts,
                logger
            });
            if (attempts.attempts >= 5) {
                logger.warn?.('warn - [burmProfileIdentifier] : user blocked due to too many failed attempts');
                await jstepBurmProfilesBlocked({
                    burmUserId: request.username,
                    patchBurmProfilesBlocked,
                    logger
                });
            }
            logger.warn?.('warn - [burmProfileIdentifier] : invalid credentials');
            throw AuthLoginErrorValidationBurm;
        }

        logger.error?.('error - [burmProfileIdentifier] : unexpected error', error);
        throw AuthLoginErrorService;
    }

    if (
        !profileIdentifier ||
        !profileIdentifier.burmUserId ||
        !profileIdentifier.bcpmStatusId ||
        !profileIdentifier.bcpmDepartmentId ||
        !profileIdentifier.bcpmRoleId
    ) {
        logger.warn?.('warn - [burmProfileIdentifier] : incomplete response');
        throw AuthLoginErrorService;
    }

    return profileIdentifier;
}