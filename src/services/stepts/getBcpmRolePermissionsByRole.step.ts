import {
    AuthLoginLogger,
    GetBcpmRolePermissionsByRoleRequest,
    GetBcpmRolePermissionsByRoleResponse,
    GetBcpmRolePermissionsByRolePort
} from '../../contract/index.contract.js';
import { AuthLoginErrorUnauthorized } from '../../errors/index.errors.js';
import { getStatusCode } from '../utils/index.utils.js';

export const stepBcpmRolePermissionsByRole = async (
    username : string,
    request: GetBcpmRolePermissionsByRoleRequest,
    getBcpmRolePermissionsByRole: GetBcpmRolePermissionsByRolePort,
  logger: AuthLoginLogger
): Promise<GetBcpmRolePermissionsByRoleResponse[] | null> => {
  logger.info("step : getBcpmRolePermissionsByRole ", {username,request,});
  try {
    const response = await getBcpmRolePermissionsByRole(request);
    logger.info("step : getBcpmRolePermissionsByRole succeeded", {username: username});
    return response
  } 
  catch (error) {
    logger.error?.('step : getBcpmRolePermissionsByRole failed', error);
    const statusCode = getStatusCode(error);
    if (statusCode === 401 || statusCode === 404) {
      logger.info("step : getBcpmRolePermissionsByRole is error due to status code", {
        username: username,
        statusCode,
      });
      return null;
    }
    logger.error("step : getBcpmRolePermissionsByRole is unexpected error", request);
    throw AuthLoginErrorUnauthorized;
  }
};