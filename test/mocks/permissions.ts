import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockGetBcpmRolePermissionsListOKPort = async (roleId: string, systemToken: string) => {
    fastify.log.info(`[Mock BCPM Permissions] Buscando permisos para: ${roleId}`);
    fastify.log.debug(`[Mock BCPM Permissions] token length: ${systemToken.length}`);
    return [
        {
            bcpmPermissionId: 'perm_1',
            bcpmPermissionResource: 'users',
            bcpmPermissionAction: 'read',
            bcpmPermissionScope: 'self',
            bcpmPermissionIsActive: true,
            bcpmRolePermissionIsAllowed: true
        },
        {
            bcpmPermissionId: 'perm_2',
            bcpmPermissionResource: 'sessions',
            bcpmPermissionAction: 'create',
            bcpmPermissionScope: 'all',
            bcpmPermissionIsActive: true,
            bcpmRolePermissionIsAllowed: true
        }
    ];
};

const mockGetBcpmRolePermissionsListKoPort = async (roleId: string, systemToken: string) => {
    fastify.log.info(`[Mock BCPM Permissions] Buscando permisos para: ${roleId}`);
    fastify.log.debug(`[Mock BCPM Permissions] token length: ${systemToken.length}`);
    return [{}];
};

export { mockGetBcpmRolePermissionsListOKPort, mockGetBcpmRolePermissionsListKoPort };