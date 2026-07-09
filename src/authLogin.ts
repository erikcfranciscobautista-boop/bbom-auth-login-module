import {AuthLoginOutDto,} from './dto/authLogin.out.dto.js';
import {AuthLoginContract} from './contract/authLogin.contract.js';
import { AuthLoginService } from "./services/authLogin.service.js";

export async function authLogin(contract : AuthLoginContract) 
: Promise<AuthLoginOutDto> {
    const logger = contract.logger ?? console;
    logger.info('-----------------------------------------------------');
    logger.info('step : authLogin START');
    
    const service = new AuthLoginService(contract);

    logger.info('step : authLogin END');
    logger.info('-----------------------------------------------------');
    return await service.executeAuthLoginService(contract.req);
}

