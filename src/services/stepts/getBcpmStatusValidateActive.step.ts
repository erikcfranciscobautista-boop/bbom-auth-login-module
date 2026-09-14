import type {
  AuthLoginLogger,
  GetBcpmStatusValidateActiveRequest,
  GetBcpmStatusValidateActiveResponse,
  GetBcpmStatusValidateActivePort,
} from "../../contract/index.contract.js";
import { AuthLoginError, AuthLoginErrorService, AuthLoginErrorUnauthorized } from "../../errors/index.errors.js";
import { getStatusCode } from '../utils/index.utils.js';

export const stepGetBcpmStatusValidateActive = async (
  username: string,
  request: GetBcpmStatusValidateActiveRequest,
  getBcpmStatusValidateActive: GetBcpmStatusValidateActivePort,
  logger: AuthLoginLogger
): Promise<GetBcpmStatusValidateActiveResponse> => {
  logger.info("step : getBcpmStatusValidateActive ", {username,request});
  try {
    const response = await getBcpmStatusValidateActive(request);
    if(!response.validated){
      throw AuthLoginErrorUnauthorized;
    }
    logger.info("step : getBcpmStatusValidateActive succeeded");
    return response
  } 
  catch (error) {
    logger.error?.('step : getBcpmStatusValidateActive failed', error);
    const statusCode = getStatusCode(error);
    if (statusCode === 401 || statusCode === 404) {
      logger.info("step : getBcpmStatusValidateActive is error due to status code", {
        username: username,
        statusCode,
      });
      throw AuthLoginErrorUnauthorized;
    }
    logger.error("step : getBcpmStatusValidateActive is unexpected error", request);
    throw AuthLoginErrorService;
  }
};
