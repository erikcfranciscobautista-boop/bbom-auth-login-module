export interface BurmCredentialValidationResult {
  burmCredentialAttempts?: number;
}

export type PostBurmCredentialValidationsPort = (
  burmUserId: string,
  burmCredentialPassword: string,
  systemToken: string
) => Promise<BurmCredentialValidationResult | undefined>;