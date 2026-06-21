export declare class LoginError extends Error {
    errorCode: string;
    statusCode: number;
    details?: {
        traceId?: string;
        message?: string;
        missing?: unknown;
    } | undefined;
    constructor(errorCode: string, statusCode: number, message: string, details?: {
        traceId?: string;
        message?: string;
        missing?: unknown;
    } | undefined);
}
export declare class InvalidCredentialsError extends LoginError {
    constructor(traceId?: string);
}
export declare class LoginBadRequestError extends LoginError {
    constructor(payload: unknown);
}
export declare class BurmConnectionError extends LoginError {
    constructor();
}
export declare class BcpmConnectionError extends LoginError {
    constructor();
}
