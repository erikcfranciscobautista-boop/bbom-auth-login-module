// dtos
import {AuthLoginInDto} from '../dto/authLogin.in.dto.js';
import {AuthLoginOutDto} from '../dto/authLogin.out.dto.js';
// contracts
import {
    AuthLoginContract,
    AuthLoginLogger,
    GetBcpmStatusesStatusIdPort,
    PostBurmProfileIdentifierPort
} from '../contract/authLogin.contract.js';
// errors
import { AuthLoginErrorService } from '../errors/authLogin.errors.js';
import { jstepBurmPforileIdenfier } from './stepts/burmProfileIdentifier.step.js';
import { jstepBcpmStatusesStatusId } from './stepts/bcpmStatusesStatusId.step.js';

export class AuthLoginService {
    private profIdentifier : PostBurmProfileIdentifierPort;
    private bcpmStatusesStatusId : GetBcpmStatusesStatusIdPort;
    private logger : AuthLoginLogger;

    constructor(options : AuthLoginContract) {
        this.profIdentifier = options.ports.postBurmProfileIdentifierPort;
        this.bcpmStatusesStatusId = options.ports.getBcpmStatusesStatusIdPort;
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
                logger: this.logger
            });

            await jstepBcpmStatusesStatusId({
                bcpmStatusId: profileIdentifier.bcpmStatusId,
                getBcpmStatusesStatusId: this.bcpmStatusesStatusId,
                logger: this.logger
            });

            const response = profileIdentifier.burmUserId

            this.logger.info('-----------------------------------------------------');
            this.logger.info(`end - OK - executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');
            return {
                token: response
            }
        } catch (error) {
            this.logger.error(error);
            this.logger.info('-----------------------------------------------------');
            this.logger.info(`end - ERROR- executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');
            throw AuthLoginErrorService;
        }
    }
}