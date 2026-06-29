import {AuthLoginInSchema} from './contracts/models/authLogin/authLogin.in.dto.js';
import {AuthLoginOutDto,} from './contracts/models/authLogin/authLogin.out.dto.js';
import {ExecuteAuthLoginOptions} from './contracts/options/authLogin.options.js';
import { AuthLoginService } from "./services/authLogin.service.js";
import { authLoginMiddleware } from './middleware/authLogin.middleware.js';

export async function executeAuthLoginModule(opt : ExecuteAuthLoginOptions) 
: Promise<AuthLoginOutDto> {
    
    const req = AuthLoginInSchema.parse(opt.req);

    const service = new AuthLoginService(opt);

    return await service.executeAuthLoginService(req);
}

