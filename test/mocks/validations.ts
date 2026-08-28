import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockPostBurmCredentialValidationsOKPort = async (
    burmUserId: string,
    burmCredentialPassword: string,
    systemToken: string
): Promise<{ burmCredentialAttempts?: number } | undefined> => {
    fastify.log.info(`[Mock BURM Validation] Validando credenciales para: ${burmUserId}`);
    fastify.log.debug(`[Mock BURM Validation] password length: ${burmCredentialPassword.length}, token length: ${systemToken.length}`);

    if (burmCredentialPassword === 'localpass') {
        return undefined;
    }
    if (burmCredentialPassword === '5') {
    throw {
        statusCode: 403,
        details: {
            data: {
                burmCredentialAttempts: 5
            }
        }
    };
    }
    if (burmCredentialPassword === '500') {
        throw {
            statusCode: 500
        };
    }

    throw {
        statusCode: 403,
        details: {
            data: {
                burmCredentialAttempts: 3
            }
        }
    };
};

export { mockPostBurmCredentialValidationsOKPort };
