import {z} from "zod";

const BurmProfileIdentifierSchema = z.object({
  burmUserId: z.string().min(1),
  bcpmStatusId: z.string().min(1),
  bcpmDepartmentId: z.string().min(1),
  bcpmRoleId: z.string().min(1)
});

type BurmProfileIdentifierDto = z.infer<typeof BurmProfileIdentifierSchema>;


export type PostBurmProfileIdentifierPort = (
  username : string,
  password : string
) => Promise<BurmProfileIdentifierDto>;