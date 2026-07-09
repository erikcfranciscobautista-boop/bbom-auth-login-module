import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const mockGetBcpmPermissionsRoleIdOKPort = async (roleId: string) => {
    fastify.log.info(`[Mock BCPM Permissions] Buscando permisos para: ${roleId}`);
    return [
        {
            resource: 'users',
            action: 'read',
            scope: 'self'
        },
        {
            resource: 'sessions',
            action: 'create',
            scope: 'all'
        }
    ];
};

const mockGetBcpmPermissionsRoleIdKoPort = async (roleId: string) => {
    fastify.log.info(`[Mock BCPM Permissions] Buscando permisos para: ${roleId}`);
    return [{}];
};

export { mockGetBcpmPermissionsRoleIdOKPort, mockGetBcpmPermissionsRoleIdKoPort };