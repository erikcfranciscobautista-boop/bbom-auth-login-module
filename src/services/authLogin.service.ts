// dtos
import { type AuthLoginInDto, type AuthLoginOutDto } from '../dto/index.dto.js';
// contracts
import {
    AuthLoginContract,
    AuthLoginLogger,
    GetBcpmRolePermissionsListPort,
    GetBcpmStatusesOnePort,
    GetBurmUserProfileIdentifiersUniquePort,
    PostBurmCredentialTokensPort,
    PostBurmCredentialValidationsPort
} from '../contract/index.contract.js';
// errors
import {
    jstepBcpmPermissionsRoleId,
    jstepBcpmStatusesStatusId,
    jstepBurmCredentialValidations,
    jstepBurmCredentialsGenerateToken,
    jstepBurmUserProfileIdentifiersUnique
} from './stepts/index.steps.js';

export class AuthLoginService {
    private burmUserProfileIdentifiersUnique : GetBurmUserProfileIdentifiersUniquePort;
    private burmCredentialValidations : PostBurmCredentialValidationsPort;
    private bcpmStatusesOne : GetBcpmStatusesOnePort;
    private bcpmRolePermissionsList : GetBcpmRolePermissionsListPort;
    private burmCredentialTokens : PostBurmCredentialTokensPort;
    private getSystemToken: () => Promise<string>;
    private logger : AuthLoginLogger;

    constructor(options : AuthLoginContract) {
        this.burmUserProfileIdentifiersUnique = options.ports.getBurmUserProfileIdentifiersUniquePort;
        this.burmCredentialValidations = options.ports.postBurmCredentialValidationsPort;
        this.bcpmStatusesOne = options.ports.getBcpmStatusesOnePort;
        this.bcpmRolePermissionsList = options.ports.getBcpmRolePermissionsListPort;
        this.burmCredentialTokens = options.ports.postBurmCredentialTokensPort;
        this.getSystemToken = options.ports.getSystemTokenPort;
        this.logger = options.logger ?? console;
    }

    async executeAuthLoginService(request : AuthLoginInDto) : Promise<AuthLoginOutDto> {
        try{
            this.logger.info('-----------------------------------------------------');
            this.logger.info(`start - executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');
            const systemToken = await this.getSystemToken();

            const profileIdentifier = await jstepBurmUserProfileIdentifiersUnique({
                request,
                getBurmUserProfileIdentifiersUnique: this.burmUserProfileIdentifiersUnique,
                systemToken,
                logger: this.logger
            });

            await jstepBurmCredentialValidations({
                burmUserId: profileIdentifier.burmUserId,
                burmCredentialPassword: request.password,
                postBurmCredentialValidations: this.burmCredentialValidations,
                systemToken,
                logger: this.logger
            });

            await jstepBcpmStatusesStatusId({
                bcpmStatusId: profileIdentifier.bcpmStatusId,
                getBcpmStatusesOne: this.bcpmStatusesOne,
                systemToken,
                logger: this.logger
            });

            const permissions = await jstepBcpmPermissionsRoleId({
                bcpmRoleId: profileIdentifier.bcpmRoleId,
                getBcpmRolePermissionsList: this.bcpmRolePermissionsList,
                systemToken,
                logger: this.logger
            });

            const token = await jstepBurmCredentialsGenerateToken({
                burmUserId: profileIdentifier.burmUserId,
                bcpmStatusId: profileIdentifier.bcpmStatusId,
                bcpmRoleId: profileIdentifier.bcpmRoleId,
                bcpmDepartmentId: profileIdentifier.bcpmDepartmentId,
                permissions,
                postBurmCredentialTokens: this.burmCredentialTokens,
                systemToken,
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