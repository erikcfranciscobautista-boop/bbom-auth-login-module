export class LoginError extends Error {
  constructor(
    public errorCode: string,
    public statusCode: number,
    message: string,
    public details?: {
      traceId?: string;
      message?: string;
      missing?: unknown;
    }
  ) {
    super(message);
    this.name = "LoginError";
  }
}

const REQUIRED_LOGIN_FIELDS = ["username", "password"] as const;

type MissingCredentialField = (typeof REQUIRED_LOGIN_FIELDS)[number];

const isMissingCredentialValue = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  return false;
};

const buildMissingCredentials = (payload: unknown): MissingCredentialField[] => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return [...REQUIRED_LOGIN_FIELDS];
  }

  const input = payload as Partial<Record<(typeof REQUIRED_LOGIN_FIELDS)[number], unknown>>;
  const missing: MissingCredentialField[] = [];

  for (const field of REQUIRED_LOGIN_FIELDS) {
    if (isMissingCredentialValue(input[field])) {
      missing.push(field);
    }
  }

  return missing;
};

export class InvalidCredentialsError extends LoginError {
  constructor(traceId?: string) {
    super(
      "BBOM-CLIENT",
      401,
      "Invalid credentials",
      {
        traceId,
        message: "Credenciales inválidas",
      }
    );
    this.name = "InvalidCredentialsError";
  }
}

export class LoginBadRequestError extends LoginError {
  constructor(payload: unknown) {
    super(
      "BBOM-CLIENT",
      400,
      "Bad request",
      {
        traceId: "BBOM-AUTH-LOGIN-REQUEST",
        message: "Credenciales inválidas",
        missing: buildMissingCredentials(payload),
      }
    );
    this.name = "LoginBadRequestError";
  }
}

export class BurmConnectionError extends LoginError {
  constructor() {
    super(
      "BBOM-CONNECTION",
      503,
      "Burm connection error",
      {
        traceId: "BBOM-AUTH-LOGIN-BURM",
        message: "Ocurrió un error, vuelve a intentarlo más tarde.",
      }
    );
    this.name = "BurmConnectionError";
  }
}

export class BcpmConnectionError extends LoginError {
  constructor() {
    super(
      "BBOM-CONNECTION",
      503,
      "Bcpm connection error",
      {
        traceId: "BBOM-AUTH-LOGIN-BCPM",
        message: "Ocurrió un error, vuelve a intentarlo más tarde.",
      }
    );
    this.name = "BcpmConnectionError";
  }
}
