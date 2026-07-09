import {z} from "zod";

const BcpmPermissionSchema = z.object({
  resource: z.string().min(1),
  action: z.string().min(1),
  scope: z.string().min(1)
});

type BcpmPermissionDto = z.infer<typeof BcpmPermissionSchema>;

export type GetBcpmPermissionsRoleIdPort = (
  roleId : string
) => Promise<BcpmPermissionDto[]>;