import type {
  AuthLoginLogger,
  GetBurmUserProfileIdentifierRequest,
  GetBurmUserProfileIdentifierResponse,
  GetBurmUserProfileIdentifierPort,
} from "../../contract/index.contract.js";
import { getStatusCode } from '../utils/index.utils.js';
import { AuthLoginError, AuthLoginErrorService, AuthLoginErrorUnauthorized } from "../../errors/index.errors.js";

export const stepGetBurmUserProfileIdentifier = async (
  request: GetBurmUserProfileIdentifierRequest,
  getBurmUserProfileIdentifier: GetBurmUserProfileIdentifierPort,
  logger: AuthLoginLogger
): Promise<GetBurmUserProfileIdentifierResponse> => {
  logger.info("step : getBurmUserProfileIdentifier ", {username: request.username, request,});
  try {
    const response = await getBurmUserProfileIdentifier(request);
    logger.info("step : getBurmUserProfileIdentifier succeeded", {username: request.username,});
    return response
  } 
  catch (error) {
      logger.error?.('step : getBurmUserProfileIdentifier failed', error);
      const statusCode = getStatusCode(error);
      if (statusCode === 401 || statusCode === 404) {
        logger.info("step : getBurmUserProfileIdentifier is error due to status code", {
          username: request.username,
          statusCode,
        });
        throw AuthLoginErrorUnauthorized;
      }
      logger.error("step : getBurmUserProfileIdentifier is unexpected error", request);
      throw AuthLoginErrorService;
  }
};
