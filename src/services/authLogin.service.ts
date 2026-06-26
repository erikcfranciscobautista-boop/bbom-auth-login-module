import {AuthLoginInDto} from '../contracts/models/authLogin/authLogin.in.dto.js';
import {AuthLoginOutDto,AuthLoginOutSchema} from '../contracts/models/authLogin/authLogin.out.dto.js';
import {ExecuteAuthLoginOptions} from '../contracts/options/authLogin.options.js';
import {PostBurmProfileIdentifierPort} from '../contracts/options/ports/burm.ports.js';

export class AuthLoginService {
    private profIdentifier : PostBurmProfileIdentifierPort;

    constructor(options : ExecuteAuthLoginOptions) {
        this.profIdentifier = options.ports.postBurmProfileIdentifierPort;
    }

    async executeAuthLoginService(request : AuthLoginInDto) : Promise<AuthLoginOutDto> {
        /*const profileIdentifier = await this.profIdentifier(request.username);
        return {
            token: profileIdentifier.burmUserId
        }*/
       return AuthLoginOutSchema.parse({token : "holaaa"});
    }
}