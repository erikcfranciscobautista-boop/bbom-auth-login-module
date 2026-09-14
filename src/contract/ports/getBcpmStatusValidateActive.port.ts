import {AuthLoginError} from '../../errors/index.error.js';

export interface GetBcpmStatusValidateActiveRequest {
  bcpmStatusId: string;
}

export interface GetBcpmStatusValidateActiveResponse {
  validated: boolean;
}

export type GetBcpmStatusValidateActivePort = (
  input: GetBcpmStatusValidateActiveRequest,
) => Promise<GetBcpmStatusValidateActiveResponse>;
