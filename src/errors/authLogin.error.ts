export class AuthLoginError {
    errorType: string;
    errorCode: number;
    detail: {
        traceError: string;
        message: string;
        missing?: string[];
    };

  constructor(errorType: string, errorCode: number, traceError: string, message: string, missing?: string[]) {
    this.errorType = errorType;
    this.errorCode = errorCode;
    this.detail = {
      traceError,
      message,
      missing
    };
  }
}