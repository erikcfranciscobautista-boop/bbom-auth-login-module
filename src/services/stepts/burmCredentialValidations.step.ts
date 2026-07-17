import {
    AuthLoginLogger,
    PostBurmCredentialValidationsPort
} from '../../contract/index.contract.js';
import { AuthLoginErrorService, AuthLoginErrorValidationBurm } from '../../errors/index.errors.js';
import { getStatusCode } from '../utils/index.utils.js';

interface JstepBurmCredentialValidationsOptions {
    burmUserId: string;
    burmCredentialPassword: string;
    postBurmCredentialValidations: PostBurmCredentialValidationsPort;
    systemToken: string;
    logger: AuthLoginLogger;
}

export async function jstepBurmCredentialValidations(options: JstepBurmCredentialValidationsOptions) {
    const {
        burmUserId,
        burmCredentialPassword,
        postBurmCredentialValidations,
        systemToken,
        logger
    } = options;

    logger.info?.('step : burmCredentialValidations');

    try {
        await postBurmCredentialValidations(
            burmUserId,
            burmCredentialPassword,
            systemToken
        );
    } catch (error) {
        const statusCode = getStatusCode(error);
        if (statusCode === 400 || statusCode === 403) {
            logger.warn?.('warn - [burmCredentialValidations] : invalid credentials');
            throw AuthLoginErrorValidationBurm;
        }

        logger.error?.('error - [burmCredentialValidations] : unexpected error', error);
        throw AuthLoginErrorService;
    }
}