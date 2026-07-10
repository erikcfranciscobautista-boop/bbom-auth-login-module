import {
    AuthLoginLogger,
    PatchBurmCredentialsIncrementAttemptsPort
} from '../../contract/authLogin.contract.js';
import { AuthLoginErrorService } from '../../errors/authLogin.errors.js';

interface JStepBurmCredentialsIncrementAttemptsOptions {
    burmUserId: string;
    patchBurmCredentialsIncrementAttempts: PatchBurmCredentialsIncrementAttemptsPort;
    logger: AuthLoginLogger;
}

export async function jstepBurmCredentialsIncrementAttempts(options: JStepBurmCredentialsIncrementAttemptsOptions) {
    const { burmUserId, patchBurmCredentialsIncrementAttempts, logger } = options;

    logger.info?.('step : burmCredentialsIncrementAttempts');
    const result = await patchBurmCredentialsIncrementAttempts(burmUserId);

    if (!result || typeof result.attempts !== 'number') {
        logger.error?.('error - [burmCredentialsIncrementAttempts] : incomplete response');
        throw AuthLoginErrorService;
    }

    return result;
}