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

### 1) Instalar como dependencia

Desde registry (si está publicado):

```bash
npm install @uuaa/bbom-auth-login-module
```

Desde GitHub:

```bash
npm install github:BAUHEZ_COMPANY/UUAAS/BBOM-MODULES/bbom-auth-login-module
```

Con tag/branch específico:

```bash
npm install github:BAUHEZ_COMPANY/UUAAS/BBOM-MODULES/bbom-auth-login-module#v0.1.2
```

### 2) Integración recomendada (simple)

Solo implementa los 6 adaptadores y pásalos en el registro del plugin. El módulo construye internamente el use case.

```typescript
import { loginRoutes, type LoginAdapters } from "@uuaa/bbom-auth-login-module";

const adapters: LoginAdapters = {
  postBurmProfilesIdentifier: (username, password) =>
    burmClient.validateCredentials(username, password),
  getBcpmStatusesStatusId: (statusId) => bcpmClient.getStatus(statusId),
  getBcpmPermissionsRoleId: (roleId) => bcpmClient.getPermissions(roleId),
  postBurmCredentialsGenerateToken: (userId, roleId, departmentId, permissions) =>
    burmClient.generateToken(userId, roleId, departmentId, permissions),
  patchBurmCredentialsIncrementAttempts: (userId) =>
    burmClient.incrementAttempts(userId),
  patchBurmProfilesBlocked: (userId) => burmClient.blockProfile(userId),
};

await app.register(loginRoutes, {
  adapters,
  routePath: "/login", // opcional (default)
});
```

### 3) Integración legacy (compatible)

También funciona por decorador si tu orquestador ya usa ese patrón:

```typescript
app.decorate("loginAdapters", {
  ...adapters,
  loginUseCase: (input) => buildLoginUseCase()(input, adapters),
});

await app.register(loginRoutes);
```

### 4) Logger opcional

Si no pasas logger, el módulo usa `app.log` de Fastify automáticamente.

```typescript
await app.register(loginRoutes, {
  adapters,
  logger: {
    info: (entry) => app.log.info({ context: entry.context }, entry.message),
    warn: (entry) => app.log.warn({ context: entry.context }, entry.message),
    error: (entry) => app.log.error({ context: entry.context }, entry.message),
  },
});
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