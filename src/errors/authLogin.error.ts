export class AuthLoginError {
    statusCode: number;
    statusType: string;
    details: {
        message: string;
        missingFields?: string[];
    };

  constructor(statusCode: number, statusType: string, message: string, missingFields?: string[]) {
    this.statusCode = statusCode;
    this.statusType = statusType;
    this.details = {
      message,
      missingFields
    };
  }
}