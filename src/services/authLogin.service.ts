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
            const profileIdentifier = await this.profIdentifier(request.username).then(

            
                res => {
                    this.logger.info(`OK [profileIdentifier] Identifier obtained successfully for user: ${request.username}`);
                    return res;
                }
            ).catch(
                error => { 
                    this.logger.info(`KO [profileIdentifier] Error while obtaining profile identifier`,error);
                    throw AuthLoginErrorService 
                }
            );
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