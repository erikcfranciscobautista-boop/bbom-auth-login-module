// dtos
import {AuthLoginInDto} from '../dto/authLogin.in.dto.js';
import {AuthLoginOutDto} from '../dto/authLogin.out.dto.js';
// contracts
import {AuthLoginContract, PostBurmProfileIdentifierPort} from '../contract/authLogin.contract.js';
// errors
import { AuthLoginErrorService } from '../errors/authLogin.errors.js';

export class AuthLoginService {
    private profIdentifier : PostBurmProfileIdentifierPort;

    constructor(options : AuthLoginContract) {
        this.profIdentifier = options.ports.postBurmProfileIdentifierPort;
    }

    async executeAuthLoginService(request : AuthLoginInDto) : Promise<AuthLoginOutDto> {
        try{
            const profileIdentifier = await this.profIdentifier(request.username).then(
                res => res
            ).catch(
                error => { throw AuthLoginErrorService }
            );
            return {
                token: profileIdentifier.burmUserId
            }
        } catch (error) {
            throw AuthLoginErrorService;
        }
    }
}