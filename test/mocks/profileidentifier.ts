import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockGetBurmUserProfileIdentifiersUniqueOKPort = async (
    params: { nickname?: string; burmUserPhone?: string; burmUserEmail?: string },
    systemToken: string
) => {
    fastify.log.info('[Mock BURM Unique] Buscando identificador unico');
    fastify.log.debug(`[Mock BURM Unique] token length: ${systemToken.length}`);

    if (params.nickname === 'localuser' || params.burmUserEmail === 'localuser@mail.com' || params.burmUserPhone === '3000000000') {
        return {
            burmUser: {
                burmUserId: 'usr_mock_bcm_2026_abcde'
            },
            burmProfile: {
                bcpmStatusId: 'ACTIVE',
                bcpmDepartmentId: 'dept_mock_001',
                bcpmRoleId: 'role_mock_001'
            }
        };
    }
    if (params.nickname === '500') {
        throw {
            statusCode: 500
        };
    }
    if (params.nickname === '404') {
        throw {
            statusCode: 404
        };
    }

    throw {
        statusCode: 404
    };
};

export { mockGetBurmUserProfileIdentifiersUniqueOKPort };