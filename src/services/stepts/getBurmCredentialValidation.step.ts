import { profile } from 'console';
import {
    AuthLoginLogger,
    GetBurmCredentialValidationRequest,
    GetBurmCredentialValidationResponse,
    GetBurmCredentialValidationPort
} from '../../contract/index.contract.js';
import { getStatusCode } from '../utils/index.utils.js';
import { AuthLoginErrorService, AuthLoginErrorUnauthorized } from '../../index.js';

export const stepBurmCredentialValidation = async (
    username : string,
    request: GetBurmCredentialValidationRequest,
    getBurmCredentialValidation: GetBurmCredentialValidationPort,
  logger: AuthLoginLogger
): Promise<GetBurmCredentialValidationResponse> => {
  logger.info("step : getBurmCredentialValidation ", {username,request,});
  try {
    const response = await getBurmCredentialValidation(request);
    logger.info("step : getBurmCredentialValidation succeeded", {username});
    if(!response.validated){
      throw AuthLoginErrorUnauthorized;
    }
    return response
  } 
  catch (error) {
    logger.error?.('step : getBurmCredentialValidation failed', error);
    const statusCode = getStatusCode(error);
    if (statusCode === 401 || statusCode === 404) {
      logger.info("step : getBurmCredentialValidation is error due to status code", {
        username: username,
        statusCode,
      });
      throw AuthLoginErrorUnauthorized;
    }
    logger.error("step : getBurmCredentialValidation is unexpected error", request);
    throw AuthLoginErrorService;
  }
};