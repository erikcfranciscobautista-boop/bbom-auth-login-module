import {
    AuthLoginLogger,
    GetBcpmStatusesOnePort
} from '../../contract/index.contract.js';
import { AuthLoginErrorService, AuthLoginErrorValidationBcpm } from '../../errors/index.errors.js';
import { getStatusCode } from '../utils/index.utils.js';

interface JStepBcpmStatusesStatusIdOptions {
    bcpmStatusId: string;
    getBcpmStatusesOne: GetBcpmStatusesOnePort;
    systemToken: string;
    logger: AuthLoginLogger;
}

export async function jstepBcpmStatusesStatusId(options: JStepBcpmStatusesStatusIdOptions) {
    const { bcpmStatusId, getBcpmStatusesOne, systemToken, logger } = options;

    logger.info?.('step : bcpmStatusesStatusId');
    let status;
    try {
        status = await getBcpmStatusesOne(bcpmStatusId, systemToken);
    } catch (error) {
        const statusCode = getStatusCode(error);
        if (statusCode === 404) {
            logger.warn?.('warn - [bcpmStatusesStatusId] : resource not found');
            throw AuthLoginErrorValidationBcpm;
        }

        logger.error?.('error - [bcpmStatusesStatusId] : unexpected error', error);
        throw AuthLoginErrorService;
    }

    if (!status || !status.bcpmStatusId || !status.bcpmStatusKey || !status.bcpmStatusName || !status.bcpmStatusType) {
        logger.error?.('error - [bcpmStatusesStatusId] : incomplete response');
        throw AuthLoginErrorService;
    }

    if (status.bcpmStatusKey !== 'ACTIVE') {
        logger.warn?.(`warn - [bcpmStatusesStatusId] : invalid status key ${status.bcpmStatusKey}`);
        throw AuthLoginErrorValidationBcpm;
    }

    return status;
}