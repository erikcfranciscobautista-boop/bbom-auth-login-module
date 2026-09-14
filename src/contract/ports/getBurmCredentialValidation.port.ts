
export interface GetBurmCredentialValidationRequest {
  burmUserId: string;
  burmCredentialPassword: string;
}

export interface GetBurmCredentialValidationResponse {
  validated: boolean;
}

export type GetBurmCredentialValidationPort = (
  input: GetBurmCredentialValidationRequest,
) => Promise<GetBurmCredentialValidationResponse>;