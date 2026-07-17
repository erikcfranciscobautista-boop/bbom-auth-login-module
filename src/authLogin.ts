import {AuthLoginOutDto,} from './dto/authLogin.out.dto.js';
import { AuthLoginInSchema } from './dto/authLogin.in.dto.js';
import type {AuthLoginContract} from './contract/authLogin.contract.js';
import { AuthLoginService } from "./services/authLogin.service.js";
import { AuthLoginErrorRequest } from './errors/authLogin.errors.js';

export async function authLogin(contract : AuthLoginContract) 
: Promise<AuthLoginOutDto> {
    const parseResult = AuthLoginInSchema.safeParse(contract.req);
    if (!parseResult.success) {
        throw AuthLoginErrorRequest;
    }

    const service = new AuthLoginService(contract);
    return await service.executeAuthLoginService(parseResult.data);
}

