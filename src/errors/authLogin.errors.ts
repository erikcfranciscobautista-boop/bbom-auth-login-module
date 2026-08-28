import { AuthLoginError } from "./index.error.js";
import { 
    BBOM_LOGIN_VALIDATIONS_FORMAT,
    BBOM_LOGIN_INTERNAL_SERVER_ERROR,
    BBOM_LOGIN_UNAUTHORIZED
} from "./constants/index.constants.js";

export const AuthLoginErrorRequest = new AuthLoginError(
    400,
    BBOM_LOGIN_VALIDATIONS_FORMAT,
    "Required fields",
    ["username", "password"]
);

export const AuthLoginErrorValidationBurm = new AuthLoginError(
    401,
    BBOM_LOGIN_UNAUTHORIZED,
    "Invalid credentials.",
);

export const AuthLoginErrorValidationBcpm = new AuthLoginError(
    401,
    BBOM_LOGIN_UNAUTHORIZED,
    "Invalid credentials.",
);

export const AuthLoginErrorService = new AuthLoginError(
    500,
    BBOM_LOGIN_INTERNAL_SERVER_ERROR,
    "An error has occurred, try again.",
);