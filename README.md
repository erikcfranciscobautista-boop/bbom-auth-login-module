# bbom-auth-login-module

Modulo de orquestacion de login BBOM.

Esta guia esta alineada con la implementacion actual en [test/run-local.ts](test/run-local.ts) y con el flujo vigente del modulo.

## Flujo Actual

Entrada del front:

```json
{
  "username": "string",
  "password": "string"
}
```

Orquestacion interna:

1. `getSystemTokenPort`
2. `getBurmUserProfileIdentifiersUniquePort`
3. `postBurmCredentialValidationsPort`
4. `getBcpmStatusesOnePort`
5. `getBcpmRolePermissionsListPort`
6. `postBurmCredentialTokensPort`

Respuesta OK:

```json
{
  "token": "string"
}
```

## Contrato De Implementacion

Referencia de contrato: [src/contract/authLogin.contract.ts](src/contract/authLogin.contract.ts)

Debes implementar estos puertos:

1. `getBurmUserProfileIdentifiersUniquePort(params, systemToken)`
2. `postBurmCredentialValidationsPort(burmUserId, burmCredentialPassword, systemToken)`
3. `getBcpmStatusesOnePort(bcpmStatusId, systemToken)`
4. `getBcpmRolePermissionsListPort(bcpmRoleId, systemToken)`
5. `postBurmCredentialTokensPort(payload, systemToken)`
6. `getSystemTokenPort()`

El modulo recibe `username` y decide internamente si buscar por `email`, `phone` o `nickname` para `unique`.

## Ejemplo De Integracion

```ts
import { authLogin, type AuthLoginContract } from "@uuaas-bbom/bbom-auth-login-module";

const contract: AuthLoginContract = {
  req: {
    username: "demo@mail.com",
    password: "secret"
  },
  ports: {
    getBurmUserProfileIdentifiersUniquePort: async (params, systemToken) => {
      return burmClient.getUserProfileIdentifiersUnique(params, systemToken);
    },
    postBurmCredentialValidationsPort: async (burmUserId, burmCredentialPassword, systemToken) => {
      return burmClient.postCredentialValidations({ burmUserId, burmCredentialPassword }, systemToken);
    },
    getBcpmStatusesOnePort: async (bcpmStatusId, systemToken) => {
      return bcpmClient.getStatusesOne(bcpmStatusId, systemToken);
    },
    getBcpmRolePermissionsListPort: async (bcpmRoleId, systemToken) => {
      return bcpmClient.getRolePermissionsList(bcpmRoleId, systemToken);
    },
    postBurmCredentialTokensPort: async (payload, systemToken) => {
      return burmClient.postCredentialTokens(payload, systemToken);
    },
    getSystemTokenPort: async () => {
      return tokenService.getSystemToken();
    }
  }
};

const result = await authLogin(contract);
console.log(result.token);
```

## Matriz De Errores (Vigente)

Todos los errores deben salir en este formato:

```json
{
  "statusCode": 0,
  "statusType": "STRING",
  "details": {
    "message": "STRING"
  }
}
```

### BBOM 400

```json
{
  "statusCode": 400,
  "statusType": "BBOM-LOGIN-VALIDATIONS-FORMAT",
  "details": {
    "message": "Required fields",
    "misssingFields": ["username", "password"]
  }
}
```

### BBOM 500

```json
{
  "statusCode": 500,
  "statusType": "BBOM-LOGIN-INTERNAL-SERVER-ERROR",
  "details": {
    "message": "An error has occurred, try again."
  }
}
```

### Unauthorized (BURM y BCPM)

Casos que mapean a 401:

1. BURM `getBurmUserProfileIdentifiersUnique` -> 404
2. BURM `postBurmCredentialValidations` -> 400 o 403
3. BCPM `getBcpmStatusesOne` -> 404
4. BCPM `getBcpmRolePermissionsList` -> 404

Respuesta:

```json
{
  "statusCode": 401,
  "statusType": "BBOM-LOGIN-UNAUTHORIZED",
  "details": {
    "message": "Invalid credentials."
  }
}
```

## Ejecucion Local (Playground)

Instalar dependencias:

```bash
npm install
```

Levantar servidor local:

```bash
npm run localhost
```

Endpoint local:

`POST /auth/login`

Ejemplo:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"localuser","password":"localpass"}'
```

## Docker

Levantar playground con docker compose:

```bash
docker compose up --build bbom-auth-login-module-localhost
```