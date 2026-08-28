import {z} from "zod";

const BurmUserProfileIdentifiersUniqueSchema = z.object({
  burmUser: z.object({
    burmUserId: z.string().min(1)
  }),
  burmProfile: z.object({
    bcpmRoleId: z.string().min(1),
    bcpmStatusId: z.string().min(1),
    bcpmDepartmentId: z.string().min(1)
  })
});

type BurmUserProfileIdentifiersUniqueDto = z.infer<typeof BurmUserProfileIdentifiersUniqueSchema>;

export interface BurmUserProfileIdentifierUniqueParams {
  nickname?: string;
  burmUserPhone?: string;
  burmUserEmail?: string;
}

export type GetBurmUserProfileIdentifiersUniquePort = (
  params: BurmUserProfileIdentifierUniqueParams,
  systemToken: string
) => Promise<BurmUserProfileIdentifiersUniqueDto>;