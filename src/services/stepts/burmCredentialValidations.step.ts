import {
    AuthLoginLogger,
    PostBurmCredentialValidationsPort
} from '../../contract/authLogin.contract.js';
import { AuthLoginErrorService, AuthLoginErrorValidationBurm } from '../../errors/authLogin.errors.js';
import { getStatusCode } from '../utils/getStatusCode.util.js';

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