import Fastify from 'fastify';
import { authLogin } from '../src/index.js';
import type { AuthLoginContract } from '../src/index.js';
import { AuthLoginErrorRequest, AuthLoginErrorService } from '../src/errors/authLogin.errors.js';
import { mockPostBurmCredentialTokensOKPort } from './mocks/generateToken.js';
import { mockGetBurmUserProfileIdentifiersUniqueOKPort } from './mocks/profileidentifier.js';
import { mockPostBurmCredentialValidationsOKPort } from './mocks/validations.js';
import { mockGetBcpmRolePermissionsListOKPort } from './mocks/permissions.js';
import { mockGetBcpmStatusesOneOKPort } from './mocks/statuses.js';

const fastify = Fastify({ logger: true });

function buildValidationErrorPayload() {
    return {
        statusCode: AuthLoginErrorRequest.statusCode,
        statusType: AuthLoginErrorRequest.statusType,
        details: {
            message: AuthLoginErrorRequest.details.message,
            misssingFields: AuthLoginErrorRequest.details.missingFields ?? []
        }
    };
}

fastify.setErrorHandler((error, _request, reply) => {
    const maybeAuthError = error as {
        statusCode?: number;
        statusType?: string;
        details?: {
            message?: string;
            missingFields?: string[];
        };
    };

    if (typeof maybeAuthError.statusCode === 'number' && typeof maybeAuthError.statusType === 'string') {
        const payload = {
            statusCode: maybeAuthError.statusCode,
            statusType: maybeAuthError.statusType,
            details: {
                message: maybeAuthError.details?.message ?? 'An error has occurred, try again.',
                misssingFields: maybeAuthError.details?.missingFields
            }
        };

        return reply.status(maybeAuthError.statusCode).send(payload);
    }

    if ((error as any)?.statusCode === 400) {
        return reply.status(400).send(buildValidationErrorPayload());
    }

    return reply.status(AuthLoginErrorService.statusCode).send({
        statusCode: AuthLoginErrorService.statusCode,
        statusType: AuthLoginErrorService.statusType,
        details: {
            message: AuthLoginErrorService.details.message
        }
    });
});

function buildBaseContract(requestLogger: any): Omit<AuthLoginContract, 'req'> {
    return {
        ports: {
            getBurmUserProfileIdentifiersUniquePort: mockGetBurmUserProfileIdentifiersUniqueOKPort,
            postBurmCredentialValidationsPort: mockPostBurmCredentialValidationsOKPort,
            getBcpmStatusesOnePort: mockGetBcpmStatusesOneOKPort,
            getBcpmRolePermissionsListPort: mockGetBcpmRolePermissionsListOKPort,
            postBurmCredentialTokensPort: mockPostBurmCredentialTokensOKPort,
            getSystemTokenPort: async () => 'system_token_mock'
        },
        logger: requestLogger
    };
}

fastify.post('/auth/login', async (request, reply) => {
    const body = (request.body ?? {}) as any;
    const requestLogger = request.log.child({ route: 'Auth', functionality: 'login', module: 'bbom-auth-login-module' });

    const mockContract: AuthLoginContract = {
        ...buildBaseContract(requestLogger),
        req: {
            username: body.username,
            password: body.password
        }
    };

    const result = await authLogin(mockContract);

    return reply.status(200).send(result);
});

// 3. Ponemos el script a escuchar peticiones de forma permanente
const start = async () => {
    try {
        const PORT = 3000;
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`\n🚀 Servidor de pruebas local escuchando en http://localhost:${PORT}`);
        console.log(`👉 POST http://localhost:${PORT}/auth/login\n`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();