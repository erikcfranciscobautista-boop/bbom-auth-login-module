import {
    AuthLoginLogger,
    GetBcpmPermissionsRoleIdPort
} from '../../contract/authLogin.contract.js';
import { AuthLoginErrorService } from '../../errors/authLogin.errors.js';

interface JStepBcpmPermissionsRoleIdOptions {
    bcpmRoleId: string;
    getBcpmPermissionsRoleId: GetBcpmPermissionsRoleIdPort;
    logger: AuthLoginLogger;
}

export async function jstepBcpmPermissionsRoleId(options: JStepBcpmPermissionsRoleIdOptions) {
    const { bcpmRoleId, getBcpmPermissionsRoleId, logger } = options;

    logger.info?.('step : bcpmPermissionsRoleId');
    const permissions = await getBcpmPermissionsRoleId(bcpmRoleId);

    if (!permissions || !Array.isArray(permissions)) {
        logger.error?.('error - [bcpmPermissionsRoleId] : invalid response');
        throw AuthLoginErrorService;
    }

    for (const permission of permissions) {
        if (!permission.resource || !permission.action || !permission.scope) {
            logger.error?.('error - [bcpmPermissionsRoleId] : incomplete permission item');
            throw AuthLoginErrorService;
        }
    }

    return permissions;
}