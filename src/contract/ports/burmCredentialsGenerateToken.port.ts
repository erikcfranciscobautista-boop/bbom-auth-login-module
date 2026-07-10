import {z} from "zod";

const BurmPermissionSchema = z.object({
  resource: z.string().min(1),
  action: z.string().min(1),
  scope: z.string().min(1)
});

const BurmCredentialsGenerateTokenSchema = z.object({
  token: z.string().min(1)
});

type BurmPermissionDto = z.infer<typeof BurmPermissionSchema>;
type BurmCredentialsGenerateTokenDto = z.infer<typeof BurmCredentialsGenerateTokenSchema>;

export type PostBurmCredentialsGenerateTokenPort = (
  burmUserId : string,
  bcpmRoleId : string,
  bcpmDepartmentId : string,
  permissions : BurmPermissionDto[]
) => Promise<BurmCredentialsGenerateTokenDto>;