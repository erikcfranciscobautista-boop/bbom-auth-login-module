import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockPostBurmCredentialTokensOKPort = async (
    payload: {
        burmUser: { burmUserId: string };
        burmProfile: { bcpmStatusId: string; bcpmDepartmentId: string; bcpmRoleId: string };
        bcpmPermissions: Array<{ bcpmPermissionResource: string; bcpmPermissionAction: string; bcpmPermissionScope: string }>;
    }
): Promise<{ token: string }> => {
    fastify.log.info(`[Mock BURM Token] Generando token para user: ${payload.burmUser.burmUserId}`);
    fastify.log.debug(`[Mock BURM Token] role: ${payload.burmProfile.bcpmRoleId}, department: ${payload.burmProfile.bcpmDepartmentId}, permissions: ${payload.bcpmPermissions.length}`);
    return {
        token: `token_mock_${payload.burmUser.burmUserId}_${payload.burmProfile.bcpmRoleId}_${payload.burmProfile.bcpmDepartmentId}`
    };
};

const mockPostBurmCredentialTokensKoPort = async (
    payload: {
        burmUser: { burmUserId: string };
        burmProfile: { bcpmStatusId: string; bcpmDepartmentId: string; bcpmRoleId: string };
        bcpmPermissions: Array<{ bcpmPermissionResource: string; bcpmPermissionAction: string; bcpmPermissionScope: string }>;
    }
): Promise<{ token: string }> => {
    fastify.log.info(`[Mock BURM Token] Fallo simulado generando token para user: ${payload.burmUser.burmUserId}`);
    throw { statusCode: 500 };
};

export { mockPostBurmCredentialTokensOKPort, mockPostBurmCredentialTokensKoPort };