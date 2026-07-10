import {z} from "zod";

const BcpmStatusesStatusIdSchema = z.object({
  bcpmStatusId: z.string().min(1),
  bcpmStatusKey: z.string().min(1),
  bcpmStatusName: z.string().min(1)
});

type BcpmStatusesStatusIdDto = z.infer<typeof BcpmStatusesStatusIdSchema>;

export type GetBcpmStatusesStatusIdPort = (
  statusId : string
) => Promise<BcpmStatusesStatusIdDto>;