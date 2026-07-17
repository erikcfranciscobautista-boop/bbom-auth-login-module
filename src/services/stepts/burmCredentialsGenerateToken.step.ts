import {
    AuthLoginLogger,
    PostBurmCredentialTokensPort
} from '../../contract/authLogin.contract.js';
import { AuthLoginErrorService } from '../../errors/authLogin.errors.js';
import { PermissionItem } from './bcpmPermissionsRoleId.step.js';

interface JStepBurmCredentialsGenerateTokenOptions {
    burmUserId: string;
    bcpmStatusId: string;
    bcpmRoleId: string;
    bcpmDepartmentId: string;
    permissions: PermissionItem[];
    postBurmCredentialTokens: PostBurmCredentialTokensPort;
    systemToken: string;
    logger: AuthLoginLogger;
}

export async function jstepBurmCredentialsGenerateToken(options: JStepBurmCredentialsGenerateTokenOptions) {
    const {
        burmUserId,
        bcpmStatusId,
        bcpmRoleId,
        bcpmDepartmentId,
        permissions,
        postBurmCredentialTokens,
        systemToken,
        logger
    } = options;

    logger.info?.('step : burmCredentialsGenerateToken');
    const tokenResponse = await postBurmCredentialTokens({
        burmUser: {
            burmUserId
        },
        burmProfile: {
            bcpmStatusId,
            bcpmDepartmentId,
            bcpmRoleId
        },
        bcpmPermissions: permissions
    }, systemToken);

    if (!tokenResponse || !tokenResponse.token) {
        logger.error?.('error - [burmCredentialsGenerateToken] : incomplete response');
        throw AuthLoginErrorService;
    }

    return tokenResponse.token;
}