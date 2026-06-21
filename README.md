# bbom-auth-login-module

Módulo de orquestación de login para BBOM (Business Business Orchestration Module). Coordina la validación de identidad con BURM, verifica estados administrativos con BCPM y genera JWT enriquecidos con permisos.

## Arquitectura

El módulo implementa una orquestación de 5 pasos:

1. **POST /login** (entry point) — valida payload
2. **POST BURM /profiles/identifier** — valida credenciales y recupera perfil
3. **GET BCPM /status/{statusId}** — verifica estado administrativo
4. **GET BCPM /permissions/{roleId}** — extrae facultades granulares
5. **POST BURM /credentials/generateToken** — genera JWT enriquecido

### Manejo de errores

Si falla el paso 2 (validación BURM):
- Incrementar intentos fallidos
- Si intentos >= 5, bloquear perfil
- Retornar error genérico (401 con mensaje "Credenciales inválidas")

Si falla paso 3 (status), cualquier statusKey ≠ "ACTIVE" → error 401 genérico.

Cualquier otro error → error 401 genérico.

## Tipos y Contratos

El módulo define estos tipos:

### Request/Response

```typescript
// Input
type LoginInput = { username: string; password: string };

// Output
type LoginOutput = {
  token: string;
};
```

### Adapters (Puertos)

```typescript
type LoginAdapters = {
  postBurmProfilesIdentifier(username, password): BurmProfileResponse;
  getBcpmStatusesStatusId(statusId): BcpmStatusResponse;
  getBcpmPermissionsRoleId(roleId): BcpmPermissionsResponse;
  postBurmCredentialsGenerateToken(userId, roleId, deptId, permissions): BurmTokenResponse;
  patchBurmCredentialsIncrementAttempts(userId): { statusId, attempts };
  patchBurmProfilesBlocked(userId): void;
};
```

Donde:
- `BurmProfileResponse`: `{ burmProfileId, burmUserId, burmStatusId, burmDepartmentId, burmRoleId }`
- `BcpmStatusResponse`: `{ bcpmStatusId, bcpmStatusKey, bcpmStatusName }`
- `BcpmPermissionsResponse`: `Array<{ resource, action, scope }>`
- `BurmTokenResponse`: `{ burmToken }`

## Integración en Orquestador

1. Implementa los 6 adaptadores de BURM y BCPM
2. Inyecta `loginUseCase` (usa `buildLoginUseCase()`)
3. Decora la app con `loginAdapters`
4. Registra las rutas

```typescript
import { loginRoutes } from "@uuaa/bbom/auth-login";
import { buildLoginUseCase } from "@uuaa/bbom/auth-login/services/login.implementation";

const adapters = {
  postBurmProfilesIdentifier: (u, p) => burmClient.validateCredentials(u, p),
  getBcpmStatusesStatusId: (id) => bcpmClient.getStatus(id),
  getBcpmPermissionsRoleId: (id) => bcpmClient.getPermissions(id),
  postBurmCredentialsGenerateToken: (uid, rid, did, perms) => burmClient.generateToken(...),
  patchBurmCredentialsIncrementAttempts: (uid) => burmClient.incrementAttempts(uid),
  patchBurmProfilesBlocked: (uid) => burmClient.blockProfile(uid),
};

const loginUseCase = buildLoginUseCase();
const adapterWithUseCase = {
  ...adapters,
  loginUseCase: (input) => loginUseCase(input, adapters),
};

app.decorate("loginAdapters", adapterWithUseCase);
await app.register(loginRoutes);
```

## Testing Local

Requisitos:
```bash
npm install
```

Ejecutar servidor de prueba (con adaptadores mock):
```bash
npm run start:test
```

Test del endpoint:
```bash
curl -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"demo","password":"secret123"}'
```

Respuesta esperada (200):
```json
{
  "token": "eyJ..."
}
```

Ejecutar unit tests:
```bash
npm run test:unit
```

Docker (mock local y tests):
```bash
npm run docker:local
npm run docker:test:unit
```

Test con credenciales inválidas (401):
```bash
curl -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"demo","password":"wrong"}'
```

Respuesta esperada (401):
```json
{
  "errorCode": "BBOM-CLIENT",
  "details": {
    "message": "Credenciales inválidas"
  }
}
```

## Estructura

```
src/
  index.ts                    # exports routes + types
  contracts.ts                # LoginAdapters types
  errors/
    login.errors.ts           # InvalidCredentialsError, etc.
  models/
    dto/
      input/
        login.dto.ts          # LoginInputSchema (Zod)
      output/
        login.dto.ts          # LoginOutputSchema (Zod)
  services/
    login.ports.ts            # LoginUseCase type
    login.dependencies.ts     # defaultLoginAdapters
    login.implementation.ts   # buildLoginUseCase() with orchestration logic
  controllers/
    login.controller.ts       # buildLoginController
  routes/
    login.routes.ts           # Fastify plugin
scripts/
  run-local.ts                # Local test server
```

## Errores

Todos los errores retornan 401 con formato genérico BBOM-CLIENT:

```json
{
  "errorCode": "BBOM-CLIENT",
  "details": {
    "message": "Credenciales inválidas",
    "traceId": "BURM-error-id-if-available"
  }
}
```

Excepto errores de validación (400) y errores internos (500).
# bbom-auth-login-module