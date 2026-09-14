// dtos
import { type AuthLoginInDto, type AuthLoginOutDto } from '../dto/index.dto.js';
// contracts
import {
    AuthLoginContract,
    AuthLoginLogger,
    CreateBurmCredentialTokenPort,
    GetBcpmRolePermissionsByRolePort,
    GetBcpmStatusValidateActivePort,
    GetBcpmStatusValidateActiveResponse,
    GetBurmCredentialValidationPort,
    GetBurmUserProfileIdentifierPort
} from '../contract/index.contract.js';
import {
    stepBcpmRolePermissionsByRole,
    stepGetBcpmStatusValidateActive,
    stepBurmCredentialValidation,
    stepBurmCredentialsGenerateToken,
    stepGetBurmUserProfileIdentifier
} from './stepts/index.steps.js';
import { AuthLoginErrorUnauthorized } from '../errors/authLogin.errors.js';
import { AuthLoginError } from '../errors/index.errors.js';

export class AuthLoginService {
    private burmUserProfileIdentifier : GetBurmUserProfileIdentifierPort;
    private burmCredentialValidation : GetBurmCredentialValidationPort;
    private bcpmStatusValidateActive : GetBcpmStatusValidateActivePort;
    private bcpmRolePermissionsByRole : GetBcpmRolePermissionsByRolePort;
    private burmCredentialToken : CreateBurmCredentialTokenPort;
    private logger : AuthLoginLogger;

    constructor(options : AuthLoginContract) {
        this.burmUserProfileIdentifier = options.ports.getBurmUserProfileIdentifierPort;
        this.burmCredentialValidation = options.ports.getBurmCredentialValidationPort;
        this.bcpmStatusValidateActive = options.ports.getBcpmStatusValidateActivePort;
        this.bcpmRolePermissionsByRole = options.ports.getBcpmRolePermissionsByRolePort;
        this.burmCredentialToken = options.ports.createBurmCredentialTokenPort;
        this.logger = options.logger ?? console;
    }

    async executeAuthLoginService(request : AuthLoginInDto) : Promise<AuthLoginOutDto> {
        try{
            this.logger.info('-----------------------------------------------------');
            this.logger.info(`start - executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');

            const username = {username: request.username};

            const profileIdentifier = await stepGetBurmUserProfileIdentifier(
                username,
                this.burmUserProfileIdentifier,
                this.logger
            );

            await stepBurmCredentialValidation(
                request.username,
                {
                    burmUserId: profileIdentifier.burmUser.burmUserId,
                    burmCredentialPassword: request.password,
                },
                this.burmCredentialValidation,
                this.logger
            );

            const resultStatusValidated = await stepGetBcpmStatusValidateActive(
                request.username,
                {
                    bcpmStatusId: profileIdentifier.burmProfile.bcpmStatusId
                },
                this.bcpmStatusValidateActive,
                this.logger
            );

            const permissions = await stepBcpmRolePermissionsByRole(
                request.username,
                {
                    bcpmRoleId: profileIdentifier.burmProfile.bcpmRoleId
                },
                this.bcpmRolePermissionsByRole,
                this.logger
            );


            const token = await stepBurmCredentialsGenerateToken(
                request.username,
                {
                    burmUser : profileIdentifier.burmUser,
                    burmProfile : profileIdentifier.burmProfile,
                    bcpmPermissions: permissions,
                },
                this.burmCredentialToken,
                this.logger
            );

            this.logger.info('-----------------------------------------------------');
            this.logger.info(`end - OK - executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');
            return token;
        } catch (error) {
            this.logger.error(error);
            this.logger.info('-----------------------------------------------------');
            this.logger.info(`end - ERROR- executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');
            throw error;
        }
    }
}