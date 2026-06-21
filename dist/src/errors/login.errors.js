export class LoginError extends Error {
    errorCode;
    statusCode;
    details;
    constructor(errorCode, statusCode, message, details) {
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.details = details;
        this.name = "LoginError";
    }
}
const REQUIRED_LOGIN_FIELDS = ["username", "password"];
const isMissingCredentialValue = (value) => {
    if (value === undefined || value === null) {
        return true;
    }
    if (typeof value === "string") {
        return value.trim().length === 0;
    }
    return false;
};
const buildMissingCredentials = (payload) => {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return [...REQUIRED_LOGIN_FIELDS];
    }
    const input = payload;
    const missing = [];
    for (const field of REQUIRED_LOGIN_FIELDS) {
        if (isMissingCredentialValue(input[field])) {
            missing.push(field);
        }
    }
    return missing;
};
export class InvalidCredentialsError extends LoginError {
    constructor(traceId) {
        super("BBOM-CLIENT", 401, "Invalid credentials", {
            traceId,
            message: "Credenciales inválidas",
        });
        this.name = "InvalidCredentialsError";
    }
}
export class LoginBadRequestError extends LoginError {
    constructor(payload) {
        super("BBOM-CLIENT", 400, "Bad request", {
            traceId: "BBOM-AUTH-LOGIN-REQUEST",
            message: "Credenciales inválidas",
            missing: buildMissingCredentials(payload),
        });
        this.name = "LoginBadRequestError";
    }
}
export class BurmConnectionError extends LoginError {
    constructor() {
        super("BBOM-CONNECTION", 503, "Burm connection error", {
            traceId: "BBOM-AUTH-LOGIN-BURM",
            message: "Ocurrió un error, vuelve a intentarlo más tarde.",
        });
        this.name = "BurmConnectionError";
    }
}
export class BcpmConnectionError extends LoginError {
    constructor() {
        super("BBOM-CONNECTION", 503, "Bcpm connection error", {
            traceId: "BBOM-AUTH-LOGIN-BCPM",
            message: "Ocurrió un error, vuelve a intentarlo más tarde.",
        });
        this.name = "BcpmConnectionError";
    }
}
