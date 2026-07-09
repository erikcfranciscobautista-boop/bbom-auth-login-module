// dtos
import {AuthLoginInDto} from '../dto/authLogin.in.dto.js';
import {AuthLoginOutDto} from '../dto/authLogin.out.dto.js';
// contracts
import {AuthLoginContract, PostBurmProfileIdentifierPort} from '../contract/authLogin.contract.js';
// errors
import { AuthLoginErrorService } from '../errors/authLogin.errors.js';

export class AuthLoginService {
    private profIdentifier : PostBurmProfileIdentifierPort;
    private logger;

    constructor(options : AuthLoginContract) {
        this.profIdentifier = options.ports.postBurmProfileIdentifierPort;
        this.logger = options.logger ?? console;
    }

    async executeAuthLoginService(request : AuthLoginInDto) : Promise<AuthLoginOutDto> {
        try{
            this.logger.info('-----------------------------------------------------');
            this.logger.info(`start - executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');

            this.logger.info('step : profileIdentifier');
            const profileIdentifier = await this.profIdentifier(request.username)
            .then( res =>  res )
            .catch( e => { 
                this.logger.error(`error - [profileIdentifier] : ${e}`);
                throw AuthLoginErrorService; 
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
            this.logger.info(`end - ERROR - executeAuthLoginService `);
            this.logger.info('-----------------------------------------------------');
            throw AuthLoginErrorService;
        }
    }
}