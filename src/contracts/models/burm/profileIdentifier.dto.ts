import {z} from "zod";

export const BurmProfileIdentifierSchema = z.object({
  burmUserId: z.string().min(1),
  bcpmStatusId: z.string().min(1),
  bcpmDepartmentId: z.string().min(1),
  bcpmRoleId: z.string().min(1)
});

export type BurmProfileIdentifierDto = z.infer<typeof BurmProfileIdentifierSchema>;