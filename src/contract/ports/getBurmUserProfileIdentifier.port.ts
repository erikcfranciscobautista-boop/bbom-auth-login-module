export interface GetBurmUserProfileIdentifierRequest {
  username : string;
}

// only the fields this module actually consumes from BURM's response
export interface GetBurmUserProfileIdentifierResponse {
  burmUser: {
    burmUserId: string;
  };
  burmProfile: {
    bcpmStatusId: string;
    bcpmDepartmentId: string;
    bcpmRoleId: string;
  };
}

export type GetBurmUserProfileIdentifierPort = (
  input: GetBurmUserProfileIdentifierRequest,
) => Promise<GetBurmUserProfileIdentifierResponse>;
