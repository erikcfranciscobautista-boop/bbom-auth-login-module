import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockGetBcpmStatusesStatusIdOKPort = async (statusId: string) => {
    fastify.log.info(`[Mock BCPM Status] Buscando status para: ${statusId}`);
    return {
        bcpmStatusId: statusId,
        bcpmStatusKey: 'ACTIVE',
        bcpmStatusName: 'Active'
    };
};

const mockGetBcpmStatusesStatusIdKoPort = async (statusId: string) => {
    fastify.log.info(`[Mock BCPM Status] Buscando status para: ${statusId}`);
    return {};
};

export { mockGetBcpmStatusesStatusIdOKPort, mockGetBcpmStatusesStatusIdKoPort };