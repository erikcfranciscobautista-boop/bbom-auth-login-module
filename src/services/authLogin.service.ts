import {AuthLoginInDto} from '../contracts/models/authLogin/authLogin.in.dto.js';
import {AuthLoginOutDto,AuthLoginOutSchema} from '../contracts/models/authLogin/authLogin.out.dto.js';
import {ExecuteAuthLoginOptions} from '../contracts/options/authLogin.options.js';
import {PostBurmProfileIdentifierPort} from '../contracts/options/ports/burm.ports.js';
import { AuthLoginError } from '../errors/authLogin.error.js';
import { AuthLoginErrorService } from '../errors/authLogin.errors.js';

export class AuthLoginService {
    private profIdentifier : PostBurmProfileIdentifierPort;

    constructor(options : ExecuteAuthLoginOptions) {
        this.profIdentifier = options.ports.postBurmProfileIdentifierPort;
    }

    async executeAuthLoginService(request : AuthLoginInDto) : Promise<AuthLoginOutDto> {
        try{
            const profileIdentifier = await this.profIdentifier(request.username);
            return {
                token: profileIdentifier.burmUserId
            }
        } catch (error) {
            throw AuthLoginErrorService;
        }
    }
}