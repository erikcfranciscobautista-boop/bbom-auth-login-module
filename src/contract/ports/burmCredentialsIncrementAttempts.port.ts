import {z} from "zod";

const BurmCredentialsIncrementAttemptsSchema = z.object({
  statusId: z.string().min(1),
  attempts: z.number().int().min(0)
});

type BurmCredentialsIncrementAttemptsDto = z.infer<typeof BurmCredentialsIncrementAttemptsSchema>;

export type PatchBurmCredentialsIncrementAttemptsPort = (
  burmUserId : string
) => Promise<BurmCredentialsIncrementAttemptsDto>;