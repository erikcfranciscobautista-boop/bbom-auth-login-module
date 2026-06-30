import { AuthLoginError } from "./authLogin.error.js";
import { 
    BBOM_CLIENT_BAD_REQUEST, BBOM_CONNECT_BURM_FAILED 
} from "./constants/authLoginTrace.error.js";
import { BBOM_SERVER } from "./constants/authLoginType.error.js";
import { BBOM_CLIENT } from "./constants/authLoginType.error.js";

export const AuthLoginErrorRequest = new AuthLoginError(
    BBOM_CLIENT+"-001",
    400,
    BBOM_CLIENT_BAD_REQUEST,
    "The request payload did not pass validation checks.",
    ["username", "password"]
);

export const AuthLoginErrorService = new AuthLoginError(
    BBOM_SERVER+"-001",
    500,
    BBOM_CONNECT_BURM_FAILED,
    "An error occurred, try again later.",
);