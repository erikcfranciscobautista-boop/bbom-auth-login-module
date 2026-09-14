import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockGetBurmUserProfileIdentifiersUniqueOKPort = async (
    params: { username?: string;}
) => {
    fastify.log.info('[Mock BURM Unique] Buscando identificador unico');

    if (params.username === 'localuser') {
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
    if (params.username === '500') {
        throw {
            statusCode: 500
        };
    }
    if (params.username === '404') {
        throw {
            statusCode: 404
        };
    }

    return null;
};

export { mockGetBurmUserProfileIdentifiersUniqueOKPort };