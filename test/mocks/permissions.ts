import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockGetBcpmRolePermissionsListOKPort = async (
    input: { bcpmRoleId: string }
): Promise<Array<{ bcpmPermissionResource: string; bcpmPermissionAction: string; bcpmPermissionScope: string }>> => {
    fastify.log.info(`[Mock BCPM Permissions] Buscando permisos para: ${input.bcpmRoleId}`);
    return [
        { bcpmPermissionResource: 'users', bcpmPermissionAction: 'read', bcpmPermissionScope: 'self' },
        { bcpmPermissionResource: 'sessions', bcpmPermissionAction: 'create', bcpmPermissionScope: 'all' }
    ];
};

const mockGetBcpmRolePermissionsListKoPort = async (
    input: { bcpmRoleId: string }
): Promise<Array<{ bcpmPermissionResource: string; bcpmPermissionAction: string; bcpmPermissionScope: string }>> => {
    fastify.log.info(`[Mock BCPM Permissions] Buscando permisos para: ${input.bcpmRoleId}`);
    throw { statusCode: 404 };
};

export { mockGetBcpmRolePermissionsListOKPort, mockGetBcpmRolePermissionsListKoPort };