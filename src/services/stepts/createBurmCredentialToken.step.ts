import {
    AuthLoginLogger,
    CreateBurmCredentialTokenPort,
    CreateBurmCredentialTokenRequest,
    CreateBurmCredentialTokenResponse
} from '../../contract/index.contract.js';
import { AuthLoginErrorService } from '../../errors/index.errors.js';
import { getStatusCode } from '../index.service.js';


export const stepBurmCredentialsGenerateToken = async (
    username : string,
    request : CreateBurmCredentialTokenRequest,
    createBurmCredentialTokenPort : CreateBurmCredentialTokenPort, 
    logger: AuthLoginLogger
) : Promise<CreateBurmCredentialTokenResponse | null> => {
  logger.info("step : burmCredentialsGenerateToken ", {username, request,});
  try {
    const response = await createBurmCredentialTokenPort(request);
    logger.info("step : burmCredentialsGenerateToken succeeded", {username: username,});
    return response
  } 
  catch (error) {
      logger.error?.('step : burmCredentialsGenerateToken failed', error);
      const statusCode = getStatusCode(error);
      if (statusCode === 401 || statusCode === 404) {
        logger.info("step : burmCredentialsGenerateToken is error due to status code", {
          username: username,
          statusCode,
        });
        return null;
      }
      logger.error("step : burmCredentialsGenerateToken is unexpected error", {username, request});
      throw AuthLoginErrorService;
  }
};