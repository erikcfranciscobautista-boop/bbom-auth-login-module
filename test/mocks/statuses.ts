import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockGetBcpmStatusesOneOKPort = async (
    input: { bcpmStatusId: string }
): Promise<{ validated: boolean }> => {
    fastify.log.info(`[Mock BCPM Status] Buscando status para: ${input.bcpmStatusId}`);
    return { validated: true };
};

const mockGetBcpmStatusesOneKoPort = async (
    input: { bcpmStatusId: string }
): Promise<{ validated: boolean }> => {
    fastify.log.info(`[Mock BCPM Status] Buscando status para: ${input.bcpmStatusId}`);
    throw { statusCode: 404 };
};

const mockGetBcpmStatusesOneInactivePort = async (
    input: { bcpmStatusId: string }
): Promise<{ validated: boolean }> => {
    fastify.log.info(`[Mock BCPM Status] Buscando status para: ${input.bcpmStatusId}`);
    return { validated: false };
};

export {
    mockGetBcpmStatusesOneOKPort,
    mockGetBcpmStatusesOneKoPort,
    mockGetBcpmStatusesOneInactivePort
};