export interface CreateBurmCredentialTokenRequest {
  burmUser: {
    burmUserId: string;
  },
  burmProfile: {
    bcpmStatusId: string;
    bcpmDepartmentId: string;
    bcpmRoleId: string;
  },
  bcpmPermissions: {
    bcpmPermissionResource: string;
    bcpmPermissionAction: string;
    bcpmPermissionScope: string;
  }[];
}

export interface CreateBurmCredentialTokenResponse {
  token: string;
}

export type CreateBurmCredentialTokenPort = (
  payload: CreateBurmCredentialTokenRequest,
) => Promise<CreateBurmCredentialTokenResponse>;