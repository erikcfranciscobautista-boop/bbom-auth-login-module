import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockPatchBurmCredentialsIncrementAttemptsPort = async (burmUserId: string) => {
    fastify.log.info(`[Mock BURM Attempts] Incrementando attempts para: ${burmUserId}`);
    return {
        statusId: 'ACTIVE',
        attempts: 5
    };
};

export { mockPatchBurmCredentialsIncrementAttemptsPort };