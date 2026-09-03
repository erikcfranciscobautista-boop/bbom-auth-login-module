# @bauhez/bbom-auth-login-module

Modulo de orquestacion para el inicio de sesion de BBOM. Valida las credenciales de un usuario, consulta su estado y permisos, y solicita la emision del token de acceso.

## Instalacion

```bash
npm install @bauhez/bbom-auth-login-module
```

## Uso

La funcion publica es `authLogin`. Recibe una solicitud y las implementaciones de los puertos que conectan el modulo con los servicios BURM y BCPM.

```ts
import { authLogin, type AuthLoginContract } from "@bauhez/bbom-auth-login-module";

const contract: AuthLoginContract = {
  req: {
    username: "demo@mail.com",
    password: "secret"
  },
  ports: {
    getSystemTokenPort: () => tokenService.getSystemToken(),
    getBurmUserProfileIdentifiersUniquePort: (params, systemToken) =>
      burmClient.getUserProfileIdentifiersUnique(params, systemToken),
    postBurmCredentialValidationsPort: (burmUserId, password, systemToken) =>
      burmClient.postCredentialValidations(burmUserId, password, systemToken),
    getBcpmStatusesOnePort: (bcpmStatusId, systemToken) =>
      bcpmClient.getStatusesOne(bcpmStatusId, systemToken),
    getBcpmRolePermissionsListPort: (bcpmRoleId, systemToken) =>
      bcpmClient.getRolePermissionsList(bcpmRoleId, systemToken),
    postBurmCredentialTokensPort: (payload, systemToken) =>
      burmClient.postCredentialTokens(payload, systemToken)
  }
};

const result = await authLogin(contract);
console.log(result.token);
```

La respuesta satisfactoria tiene la forma:

```ts
{
  token: string;
}
```

## Solicitud

`req` debe contener ambos campos como cadenas no vacias:

```ts
{
  username: string;
  password: string;
}
```

El modulo deduce el tipo de identificador de `username` y realiza la busqueda unica por `email`, `phone` o `nickname`.

## Flujo de autenticacion

1. Obtiene un token de sistema mediante `getSystemTokenPort`.
2. Busca el perfil de usuario mediante `getBurmUserProfileIdentifiersUniquePort`.
3. Valida la contrasena mediante `postBurmCredentialValidationsPort`.
4. Consulta el estado del perfil mediante `getBcpmStatusesOnePort`.
5. Obtiene los permisos del rol mediante `getBcpmRolePermissionsListPort`.
6. Solicita el token del usuario mediante `postBurmCredentialTokensPort`.

Para generar el token, el modulo envia el identificador de usuario, los identificadores de estado, departamento y rol, y la lista de permisos devuelta por BCPM.

## Puertos requeridos

Todos los puertos reciben el token de sistema cuando corresponde y devuelven una promesa.

| Puerto | Responsabilidad |
| --- | --- |
| `getSystemTokenPort()` | Obtiene el token de sistema. |
| `getBurmUserProfileIdentifiersUniquePort(params, systemToken)` | Obtiene el usuario y su perfil a partir de un identificador unico. |
| `postBurmCredentialValidationsPort(burmUserId, password, systemToken)` | Valida las credenciales del usuario. |
| `getBcpmStatusesOnePort(bcpmStatusId, systemToken)` | Consulta el estado asociado al perfil. |
| `getBcpmRolePermissionsListPort(bcpmRoleId, systemToken)` | Obtiene los permisos asociados al rol. |
| `postBurmCredentialTokensPort(payload, systemToken)` | Emite el token de acceso. |

Los tipos del contrato se exportan desde el paquete. La referencia de implementacion es [src/contract/index.contract.ts](src/contract/index.contract.ts).

## Registro

Puedes proporcionar un `logger` opcional en el contrato. Sus metodos opcionales son `info`, `warn`, `error` y `debug`; si no se proporciona, el modulo usa `console`.

```ts
const contract: AuthLoginContract = {
  req: { username: "demo@mail.com", password: "secret" },
  ports,
  logger: console
};
```

## Errores

Si `req` no cumple el formato requerido, `authLogin` rechaza la solicitud. Los errores producidos por los puertos o durante la orquestacion se registran y se propagan al consumidor, que debe adaptarlos a la convencion de errores de su aplicacion.

## Desarrollo local

Instala las dependencias y compila el paquete:

```bash
npm install
npm run build
```

El playground local expone `POST /auth/login`:

```bash
npm run localhost
```

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"localuser","password":"localpass"}'
```

Tambien puede iniciarse con Docker Compose:

```bash
docker compose up --build bbom-auth-login-module-localhost
```