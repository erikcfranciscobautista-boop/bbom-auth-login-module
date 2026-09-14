
export interface  GetBcpmRolePermissionsByRoleRequest {
  bcpmRoleId: string;
}

export interface GetBcpmRolePermissionsByRoleResponse {
  bcpmPermissionResource: string;
  bcpmPermissionAction: string;
  bcpmPermissionScope: string;
}
export type GetBcpmRolePermissionsByRolePort = (
  input: GetBcpmRolePermissionsByRoleRequest,
) => Promise<GetBcpmRolePermissionsByRoleResponse[]>;