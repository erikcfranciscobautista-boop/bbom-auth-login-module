import {
    AuthLoginLogger,
    PostBurmCredentialsGenerateTokenPort
} from '../../contract/authLogin.contract.js';
import { AuthLoginErrorService } from '../../errors/authLogin.errors.js';
import { PermissionItem } from './bcpmPermissionsRoleId.step.js';

interface JStepBurmCredentialsGenerateTokenOptions {
    burmUserId: string;
    bcpmRoleId: string;
    bcpmDepartmentId: string;
    permissions: PermissionItem[];
    postBurmCredentialsGenerateToken: PostBurmCredentialsGenerateTokenPort;
    logger: AuthLoginLogger;
}

export async function jstepBurmCredentialsGenerateToken(options: JStepBurmCredentialsGenerateTokenOptions) {
    const {
        burmUserId,
        bcpmRoleId,
        bcpmDepartmentId,
        permissions,
        postBurmCredentialsGenerateToken,
        logger
    } = options;

    logger.info?.('step : burmCredentialsGenerateToken');
    const tokenResponse = await postBurmCredentialsGenerateToken(
        burmUserId,
        bcpmRoleId,
        bcpmDepartmentId,
        permissions
    );

    if (!tokenResponse || !tokenResponse.token) {
        logger.error?.('error - [burmCredentialsGenerateToken] : incomplete response');
        throw AuthLoginErrorService;
    }

    return tokenResponse.token;
}