import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockPostBurmCredentialsGenerateTokenOKPort = async (
    burmUserId: string,
    bcpmRoleId: string,
    bcpmDepartmentId: string,
    permissions: Array<{ resource: string; action: string; scope: string }>
) => {
    fastify.log.info(`[Mock BURM Token] Generando token para user: ${burmUserId}`);
    fastify.log.debug(`[Mock BURM Token] role: ${bcpmRoleId}, department: ${bcpmDepartmentId}, permissions: ${permissions.length}`);
    return {
        token: `token_mock_${burmUserId}_${bcpmRoleId}_${bcpmDepartmentId}`
    };
};

const mockPostBurmCredentialsGenerateTokenKoPort = async (
    burmUserId: string,
    bcpmRoleId: string,
    bcpmDepartmentId: string,
    permissions: Array<{ resource: string; action: string; scope: string }>
) => {
    fastify.log.info(`[Mock BURM Token] Generando token para user: ${burmUserId}`);
    fastify.log.debug(`[Mock BURM Token] role: ${bcpmRoleId}, department: ${bcpmDepartmentId}, permissions: ${permissions.length}`);
    return {};
};

export { mockPostBurmCredentialsGenerateTokenOKPort, mockPostBurmCredentialsGenerateTokenKoPort };