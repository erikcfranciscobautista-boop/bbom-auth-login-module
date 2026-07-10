import Fastify from 'fastify';
import { authLogin } from '../src/index.js'; // Ajusta la ruta a tu entrypoint
import { AuthLoginContract } from '../src/index.js';
import { AuthLoginErrorService } from '../src/index.js';
import { mockPatchBurmCredentialsIncrementAttemptsPort } from './mocks/attempts.js';
import { mockPatchBurmProfilesBlockedPort } from './mocks/blocked.js';
import { mockPostBurmCredentialsGenerateTokenOKPort } from './mocks/generateToken.js';
import { mockPostBurmProfileIdentifierOKPort, mockPostBurmProfileIdentifierKoPort, mockPostBurmProfileIdentifierKo2Port } from './mocks/profileidentifier.js';
import { mockGetBcpmPermissionsRoleIdOKPort } from './mocks/permissions.js';
import { mockGetBcpmStatusesStatusIdOKPort } from './mocks/statuses.js';

const fastify = Fastify({ logger: true });

fastify.post('/auth/login', async (request, reply) => {
    try {
        const body = request.body as any;
        const requestLogger = request.log.child({ route: 'Auth', functionality: 'login', module: 'bbom-auth-login-module' });

        // Construimos el contrato dinámicamente con el .req que tú mandes en el body
        const mockContract: AuthLoginContract = {
            req: {
                username: body.username,
                password: body.password
            },
            ports: {
                postBurmProfileIdentifierPort: mockPostBurmProfileIdentifierOKPort,
                getBcpmStatusesStatusIdPort: mockGetBcpmStatusesStatusIdOKPort,
                getBcpmPermissionsRoleIdPort: mockGetBcpmPermissionsRoleIdOKPort,
                postBurmCredentialsGenerateTokenPort: mockPostBurmCredentialsGenerateTokenOKPort,
                patchBurmCredentialsIncrementAttemptsPort: mockPatchBurmCredentialsIncrementAttemptsPort,
                patchBurmProfilesBlockedPort: mockPatchBurmProfilesBlockedPort
            },
            logger: requestLogger
        };

        // Ejecutamos tu caso de uso de la arquitectura
        const result = await authLogin(mockContract);
        
        return reply.status(200).send(result);
    } catch (error) {
        fastify.log.error(error);
        throw error;
    }
});

// 3. Ponemos el script a escuchar peticiones de forma permanente
const start = async () => {
    try {
        const PORT = 3000;
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`\n🚀 Servidor de pruebas local escuchando en http://localhost:${PORT}`);
        console.log(`👉 Puedes enviar un POST a http://localhost:${PORT}/auth/login\n`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();