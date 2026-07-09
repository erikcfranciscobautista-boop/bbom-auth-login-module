import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockPostBurmProfileIdentifierOKPort = async (username: string, password: string) => {
    fastify.log.info(`[Mock BURM IdP] Buscando identificador para: ${username}`);
    fastify.log.debug(`[Mock BURM IdP] Password received length: ${password.length}`);
    return {
        burmUserId: `usr_mock_bcm_2026_${Math.random().toString(36).slice(2, 7)}`,
        bcpmStatusId: 'ACTIVE',
        bcpmDepartmentId: 'dept_mock_001',
        bcpmRoleId: 'role_mock_001'
    };
};
const mockPostBurmProfileIdentifierKoPort = async (username: string, password: string) => {
    fastify.log.info(`[Mock BURM IdP] Buscando identificador para: ${username}`);
    fastify.log.debug(`[Mock BURM IdP] Password received length: ${password.length}`);
    return {};
};
const mockPostBurmProfileIdentifierKo2Port = async (username: string, password: string) => {
    fastify.log.info(`[Mock BURM IdP] Buscando identificador para: ${username}`);
    fastify.log.debug(`[Mock BURM IdP] Password received length: ${password.length}`);
    return null;
};

export { mockPostBurmProfileIdentifierOKPort, mockPostBurmProfileIdentifierKoPort, mockPostBurmProfileIdentifierKo2Port };