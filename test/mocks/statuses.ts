import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockGetBcpmStatusesOneOKPort = async (statusId: string, systemToken: string) => {
    fastify.log.info(`[Mock BCPM Status] Buscando status para: ${statusId}`);
    fastify.log.debug(`[Mock BCPM Status] token length: ${systemToken.length}`);
    return {
        bcpmStatusId: statusId,
        bcpmStatusKey: 'ACTIVE',
        bcpmStatusName: 'Active',
        bcpmStatusType: 'PROFILE'
    };
};

const mockGetBcpmStatusesOneKoPort = async (statusId: string, systemToken: string) => {
    fastify.log.info(`[Mock BCPM Status] Buscando status para: ${statusId}`);
    fastify.log.debug(`[Mock BCPM Status] token length: ${systemToken.length}`);
    return {};
};

const mockGetBcpmStatusesOneInactivePort = async (statusId: string, systemToken: string) => {
    fastify.log.info(`[Mock BCPM Status] Buscando status para: ${statusId}`);
    fastify.log.debug(`[Mock BCPM Status] token length: ${systemToken.length}`);
    return {
        bcpmStatusId: statusId,
        bcpmStatusKey: 'BLOCKED',
        bcpmStatusName: 'Blocked',
        bcpmStatusType: 'PROFILE'
    };
};

export {
    mockGetBcpmStatusesOneOKPort,
    mockGetBcpmStatusesOneKoPort,
    mockGetBcpmStatusesOneInactivePort
};