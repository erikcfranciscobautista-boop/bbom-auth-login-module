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
            this.logger.info('step : executeAuthLoginService - START');
            this.logger.info('step : profIdentifier');
            const profileIdentifier = await this.profIdentifier(request.username)
            .then( res =>  res )
            .catch( e => { 
                this.logger.error(`Error [profileIdentifier] : ${e}`);
                throw AuthLoginErrorService; 
            });
            this.logger.info(`OK [executeAuthLoginService] END`);
            return {
                token: profileIdentifier.burmUserId
            }
        } catch (error) {
            this.logger.info(`OK [executeAuthLoginService] END`);
            throw AuthLoginErrorService;
        }
    }
}