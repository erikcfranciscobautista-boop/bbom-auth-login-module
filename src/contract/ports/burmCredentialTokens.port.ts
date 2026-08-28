import {z} from "zod";

const BurmCredentialTokenPermissionSchema = z.object({
  bcpmPermissionResource: z.string().min(1),
  bcpmPermissionAction: z.string().min(1),
  bcpmPermissionScope: z.string().min(1)
});

const BurmCredentialTokensSchema = z.object({
  token: z.string().min(1)
});

type BurmCredentialTokenPermissionDto = z.infer<typeof BurmCredentialTokenPermissionSchema>;
type BurmCredentialTokensDto = z.infer<typeof BurmCredentialTokensSchema>;

export type PostBurmCredentialTokensPort = (
  payload: {
    burmUser: {
      burmUserId: string;
    };
    burmProfile: {
      bcpmStatusId: string;
      bcpmDepartmentId: string;
      bcpmRoleId: string;
    };
    bcpmPermissions: BurmCredentialTokenPermissionDto[];
  },
  systemToken: string
) => Promise<BurmCredentialTokensDto>;