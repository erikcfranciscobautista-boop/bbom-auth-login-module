// dtos
import {AuthLoginInDto} from '../dto/authLogin.in.dto.js';
import {AuthLoginOutDto} from '../dto/authLogin.out.dto.js';
// contracts
import {
    AuthLoginContract,
    AuthLoginLogger,
    GetBcpmPermissionsRoleIdPort,
    GetBcpmStatusesStatusIdPort,
    PatchBurmCredentialsIncrementAttemptsPort,
    PatchBurmProfilesBlockedPort,
    PostBurmCredentialsGenerateTokenPort,
    PostBurmProfileIdentifierPort
} from '../contract/authLogin.contract.js';
// errors
import { AuthLoginErrorService } from '../errors/authLogin.errors.js';
import { jstepBurmCredentialsGenerateToken } from './stepts/burmCredentialsGenerateToken.step.js';
import { jstepBurmPforileIdenfier } from './stepts/burmProfileIdentifier.step.js';
import { jstepBcpmPermissionsRoleId } from './stepts/bcpmPermissionsRoleId.step.js';
import { jstepBcpmStatusesStatusId } from './stepts/bcpmStatusesStatusId.step.js';

export class AuthLoginService {
    private profIdentifier : PostBurmProfileIdentifierPort;
    private bcpmStatusesStatusId : GetBcpmStatusesStatusIdPort;
    private bcpmPermissionsRoleId : GetBcpmPermissionsRoleIdPort;
    private burmCredentialsGenerateToken : PostBurmCredentialsGenerateTokenPort;
    private burmCredentialsIncrementAttempts : PatchBurmCredentialsIncrementAttemptsPort;
    private burmProfilesBlocked : PatchBurmProfilesBlockedPort;
    private logger : AuthLoginLogger;

    constructor(options : AuthLoginContract) {
        this.profIdentifier = options.ports.postBurmProfileIdentifierPort;
        this.bcpmStatusesStatusId = options.ports.getBcpmStatusesStatusIdPort;
        this.bcpmPermissionsRoleId = options.ports.getBcpmPermissionsRoleIdPort;
        this.burmCredentialsGenerateToken = options.ports.postBurmCredentialsGenerateTokenPort;
        this.burmCredentialsIncrementAttempts = options.ports.patchBurmCredentialsIncrementAttemptsPort;
        this.burmProfilesBlocked = options.ports.patchBurmProfilesBlockedPort;
        this.logger = options.logger ?? console;
    }

    async executeAuthLoginService(request : AuthLoginInDto) : Promise<AuthLoginOutDto> {
        try{
            this.logger.info('-----------------------------------------------------');
            this.logger.info(`start - executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');

            const profileIdentifier = await jstepBurmPforileIdenfier({
                request,
                profIdentifier: this.profIdentifier,
                patchBurmCredentialsIncrementAttempts: this.burmCredentialsIncrementAttempts,
                patchBurmProfilesBlocked: this.burmProfilesBlocked,
                logger: this.logger
            });

            await jstepBcpmStatusesStatusId({
                bcpmStatusId: profileIdentifier.bcpmStatusId,
                getBcpmStatusesStatusId: this.bcpmStatusesStatusId,
                logger: this.logger
            });

            const permissions = await jstepBcpmPermissionsRoleId({
                bcpmRoleId: profileIdentifier.bcpmRoleId,
                getBcpmPermissionsRoleId: this.bcpmPermissionsRoleId,
                logger: this.logger
            });

            const token = await jstepBurmCredentialsGenerateToken({
                burmUserId: profileIdentifier.burmUserId,
                bcpmRoleId: profileIdentifier.bcpmRoleId,
                bcpmDepartmentId: profileIdentifier.bcpmDepartmentId,
                permissions,
                postBurmCredentialsGenerateToken: this.burmCredentialsGenerateToken,
                logger: this.logger
            });

            this.logger.info('-----------------------------------------------------');
            this.logger.info(`end - OK - executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');
            return {
                token: token
            }
        } catch (error) {
            this.logger.error(error);
            this.logger.info('-----------------------------------------------------');
            this.logger.info(`end - ERROR- executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');
            throw error;
        }
    }
}