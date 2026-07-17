import {z} from "zod";

const BcpmRolePermissionsListItemSchema = z.object({
  bcpmPermissionId: z.string().min(1),
  bcpmPermissionResource: z.string().min(1),
  bcpmPermissionAction: z.string().min(1),
  bcpmPermissionScope: z.string().min(1),
  bcpmPermissionIsActive: z.boolean(),
  bcpmRolePermissionIsAllowed: z.boolean()
});

type BcpmRolePermissionsListItemDto = z.infer<typeof BcpmRolePermissionsListItemSchema>;

export type GetBcpmRolePermissionsListPort = (
  bcpmRoleId: string,
  systemToken: string
) => Promise<BcpmRolePermissionsListItemDto[]>;