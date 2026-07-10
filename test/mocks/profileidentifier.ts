import Fastify from 'fastify';
import { AuthLoginErrorValidationBurm } from '../../src/index.js';
const fastify = Fastify({ logger: true });

const mockPostBurmProfileIdentifierOKPort = async (username: string, password: string) => {
    fastify.log.info(`[Mock BURM IdP] Buscando identificador para: ${username}`);
    fastify.log.debug(`[Mock BURM IdP] Password received length: ${password.length}`);
    if(username === 'localuser' && password === 'localpass') {
        return {
            burmUserId: 'usr_mock_bcm_2026_abcde',
            bcpmStatusId: 'ACTIVE',
            bcpmDepartmentId: 'dept_mock_001',
            bcpmRoleId: 'role_mock_001'
        };
    }
    throw {
        errorType : "",
        errorCode : 401,
        detail : {
            traceError : "AuthLoginErrorValidationBurm",
            message : "Invalid credentials.",
            missing : ["username", "password"]
        },
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