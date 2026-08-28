import { AuthLoginInSchema, type AuthLoginOutDto } from './dto/index.dto.js';
import type { AuthLoginContract } from './contract/index.contract.js';
import { AuthLoginService } from './services/index.service.js';
import { AuthLoginErrorRequest } from './errors/index.errors.js';

export async function authLogin(contract : AuthLoginContract) 
: Promise<AuthLoginOutDto> {
    const parseResult = AuthLoginInSchema.safeParse(contract.req);
    if (!parseResult.success) {
        throw AuthLoginErrorRequest;
    }

    const service = new AuthLoginService(contract);
    return await service.executeAuthLoginService(parseResult.data);
}

