import {
    AuthLoginLogger,
    GetBcpmStatusesStatusIdPort
} from '../../contract/authLogin.contract.js';
import { AuthLoginErrorService } from '../../errors/authLogin.errors.js';

interface JStepBcpmStatusesStatusIdOptions {
    bcpmStatusId: string;
    getBcpmStatusesStatusId: GetBcpmStatusesStatusIdPort;
    logger: AuthLoginLogger;
}

export async function jstepBcpmStatusesStatusId(options: JStepBcpmStatusesStatusIdOptions) {
    const { bcpmStatusId, getBcpmStatusesStatusId, logger } = options;

    logger.info?.('step : bcpmStatusesStatusId');
    const status = await getBcpmStatusesStatusId(bcpmStatusId);

    if (!status || !status.bcpmStatusId || !status.bcpmStatusKey || !status.bcpmStatusName) {
        logger.error?.('error - [bcpmStatusesStatusId] : incomplete response');
        throw AuthLoginErrorService;
    }

    if (status.bcpmStatusKey !== 'ACTIVE') {
        logger.error?.(`error - [bcpmStatusesStatusId] : invalid status key ${status.bcpmStatusKey}`);
        throw AuthLoginErrorService;
    }

    return status;
}