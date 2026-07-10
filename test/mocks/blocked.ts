import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockPatchBurmProfilesBlockedPort = async (burmUserId: string) => {
    fastify.log.info(`[Mock BURM Blocked] Bloqueando perfil para: ${burmUserId}`);
    return { ok: true };
};

export { mockPatchBurmProfilesBlockedPort };