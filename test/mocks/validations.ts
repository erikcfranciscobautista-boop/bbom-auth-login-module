import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockPostBurmCredentialValidationsOKPort = async (
    input: { burmUserId: string; burmCredentialPassword: string }
): Promise<{ validated: boolean }> => {
    fastify.log.info(`[Mock BURM Validation] Validando credenciales para: ${input.burmUserId}`);
    fastify.log.debug(`[Mock BURM Validation] password length: ${input.burmCredentialPassword.length}`);

    return { validated: input.burmCredentialPassword === 'localpass' };
};

export { mockPostBurmCredentialValidationsOKPort };
