import assert from "node:assert/strict";
import test from "node:test";
import { createLoginAdaptersMock } from "./mocks/login.adapters.mock.js";
import { buildLoginExecutionAdapter } from "./runtime/login-execution.adapter.js";
import {
  BcpmConnectionError,
  BurmConnectionError,
  InvalidCredentialsError,
} from "../src/errors/login.errors.js";

test("login success with valid credentials", async () => {
  const adapters = createLoginAdaptersMock();
  const executeLogin = buildLoginExecutionAdapter(adapters);

  const result = await executeLogin({ username: "demo", password: "secret123" });

  assert.ok(result.token.length > 0);
  assert.deepEqual(Object.keys(result), ["token"]);
});

test("invalid credentials maps to BBOM-CLIENT", async () => {
  const adapters = createLoginAdaptersMock();
  const executeLogin = buildLoginExecutionAdapter(adapters);

  await assert.rejects(
    async () => executeLogin({ username: "demo", password: "bad-password" }),
    (error: unknown) => {
      assert.equal(error instanceof InvalidCredentialsError, true);
      return true;
    }
  );
});

test("BURM connection issues map to BurmConnectionError", async () => {
  const adapters = createLoginAdaptersMock({ forceBurmConnectionError: true });
  const executeLogin = buildLoginExecutionAdapter(adapters);

  await assert.rejects(
    async () => executeLogin({ username: "demo", password: "secret123" }),
    (error: unknown) => {
      assert.equal(error instanceof BurmConnectionError, true);
      return true;
    }
  );
});

test("BCPM connection issues map to BcpmConnectionError", async () => {
  const adapters = createLoginAdaptersMock({ forceBcpmConnectionError: true });
  const executeLogin = buildLoginExecutionAdapter(adapters);

  await assert.rejects(
    async () => executeLogin({ username: "demo", password: "secret123" }),
    (error: unknown) => {
      assert.equal(error instanceof BcpmConnectionError, true);
      return true;
    }
  );
});
