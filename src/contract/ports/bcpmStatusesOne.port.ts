import {z} from "zod";

const BcpmStatusesOneSchema = z.object({
  bcpmStatusId: z.string().min(1),
  bcpmStatusKey: z.string().min(1),
  bcpmStatusName: z.string().min(1),
  bcpmStatusType: z.string().min(1)
});

type BcpmStatusesOneDto = z.infer<typeof BcpmStatusesOneSchema>;

export type GetBcpmStatusesOnePort = (
  bcpmStatusId: string,
  systemToken: string
) => Promise<BcpmStatusesOneDto>;