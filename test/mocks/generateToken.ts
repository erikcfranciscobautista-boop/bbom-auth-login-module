import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockPostBurmCredentialTokensOKPort = async (
    payload: {
        burmUser: { burmUserId: string };
        burmProfile: { bcpmStatusId: string; bcpmDepartmentId: string; bcpmRoleId: string };
        bcpmPermissions: Array<{ bcpmPermissionResource: string; bcpmPermissionAction: string; bcpmPermissionScope: string }>;
    },
    systemToken: string
) => {
    fastify.log.info(`[Mock BURM Token] Generando token para user: ${payload.burmUser.burmUserId}`);
    fastify.log.debug(`[Mock BURM Token] role: ${payload.burmProfile.bcpmRoleId}, department: ${payload.burmProfile.bcpmDepartmentId}, permissions: ${payload.bcpmPermissions.length}, token length: ${systemToken.length}`);
    return {
        token: `token_mock_${payload.burmUser.burmUserId}_${payload.burmProfile.bcpmRoleId}_${payload.burmProfile.bcpmDepartmentId}`
    };
};

const mockPostBurmCredentialTokensKoPort = async (
    payload: {
        burmUser: { burmUserId: string };
        burmProfile: { bcpmStatusId: string; bcpmDepartmentId: string; bcpmRoleId: string };
        bcpmPermissions: Array<{ bcpmPermissionResource: string; bcpmPermissionAction: string; bcpmPermissionScope: string }>;
    },
    systemToken: string
) => {
    fastify.log.info(`[Mock BURM Token] Generando token para user: ${payload.burmUser.burmUserId}`);
    fastify.log.debug(`[Mock BURM Token] role: ${payload.burmProfile.bcpmRoleId}, department: ${payload.burmProfile.bcpmDepartmentId}, permissions: ${payload.bcpmPermissions.length}, token length: ${systemToken.length}`);
    return {};
};

export { mockPostBurmCredentialTokensOKPort, mockPostBurmCredentialTokensKoPort };