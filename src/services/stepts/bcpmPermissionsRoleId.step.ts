import {
    AuthLoginLogger,
    GetBcpmRolePermissionsListPort
} from '../../contract/index.contract.js';
import { AuthLoginErrorService, AuthLoginErrorValidationBcpm } from '../../errors/index.errors.js';
import { getStatusCode } from '../utils/index.utils.js';

export interface PermissionItem {
    bcpmPermissionResource: string;
    bcpmPermissionAction: string;
    bcpmPermissionScope: string;
}

interface JStepBcpmPermissionsRoleIdOptions {
    bcpmRoleId: string;
    getBcpmRolePermissionsList: GetBcpmRolePermissionsListPort;
    systemToken: string;
    logger: AuthLoginLogger;
}

export async function jstepBcpmPermissionsRoleId(options: JStepBcpmPermissionsRoleIdOptions) {
    const { bcpmRoleId, getBcpmRolePermissionsList, systemToken, logger } = options;

    logger.info?.('step : bcpmPermissionsRoleId');
    let permissions;
    try {
        permissions = await getBcpmRolePermissionsList(bcpmRoleId, systemToken);
    } catch (error) {
        const statusCode = getStatusCode(error);
        if (statusCode === 404) {
            logger.warn?.('warn - [bcpmPermissionsRoleId] : resource not found');
            throw AuthLoginErrorValidationBcpm;
        }

        logger.error?.('error - [bcpmPermissionsRoleId] : unexpected error', error);
        throw AuthLoginErrorService;
    }

    if (!permissions || !Array.isArray(permissions)) {
        logger.error?.('error - [bcpmPermissionsRoleId] : invalid response');
        throw AuthLoginErrorService;
    }

    const normalizedPermissions: PermissionItem[] = [];

    for (const permission of permissions) {
        if (
            !permission.bcpmPermissionResource ||
            !permission.bcpmPermissionAction ||
            !permission.bcpmPermissionScope
        ) {
            logger.error?.('error - [bcpmPermissionsRoleId] : incomplete permission item');
            throw AuthLoginErrorService;
        }

        if (!permission.bcpmPermissionIsActive || !permission.bcpmRolePermissionIsAllowed) {
            continue;
        }

        normalizedPermissions.push({
            bcpmPermissionResource: permission.bcpmPermissionResource,
            bcpmPermissionAction: permission.bcpmPermissionAction,
            bcpmPermissionScope: permission.bcpmPermissionScope
        });
    }

    if (normalizedPermissions.length === 0) {
        logger.warn?.('warn - [bcpmPermissionsRoleId] : empty allowed permissions');
        throw AuthLoginErrorValidationBcpm;
    }

    return normalizedPermissions;
}