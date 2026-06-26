import { AuthLoginError } from "./authLogin.error.js";

export const AuthLoginErrorRequest = new AuthLoginError(
    "BBOM-CLIENT-001",
    400,
    "BBOM-INVALID-ARGUMENTS",
    "The request payload did not pass validation checks.",
    ["username", "password"]
);

export const AuthLoginErrorService = new AuthLoginError(
    "BBOM-SERVER-001",
    500,
    "BBOM-SERVICE-EXECUTION-FAILED",
    "An error occurred while executing the authentication service."
);