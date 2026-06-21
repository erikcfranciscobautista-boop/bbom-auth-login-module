import type { BcpmPermission, LoginAdapters } from "../../src/contracts.js";

type LoginMockOptions = {
  forceBurmConnectionError?: boolean;
  forceBcpmConnectionError?: boolean;
};

type AdapterError = Error & {
  statusCode: number;
  errorCode: string;
  burmUserId?: string;
};

const buildAdapterError = (
  message: string,
  statusCode: number,
  errorCode: string,
  burmUserId?: string
): AdapterError => {
  return Object.assign(new Error(message), {
    statusCode,
    errorCode,
    burmUserId,
  });
};

export const createLoginAdaptersMock = (
  options?: LoginMockOptions
): LoginAdapters => {
  const users = [
    {
      burmUserId: "burm-user-1",
      burmProfileId: "burm-profile-1",
      username: "demo",
      password: "secret123",
      burmStatusId: "bcpm-status-active",
      burmDepartmentId: "burm-dept-1",
      burmRoleId: "bcpm-role-admin",
    },
  ];

  const statuses = {
    "bcpm-status-active": {
      bcpmStatusId: "bcpm-status-active",
      bcpmStatusKey: "ACTIVE",
      bcpmStatusName: "Active",
    },
    "bcpm-status-inactive": {
      bcpmStatusId: "bcpm-status-inactive",
      bcpmStatusKey: "INACTIVE",
      bcpmStatusName: "Inactive",
    },
  };

  const permissions: Record<string, BcpmPermission[]> = {
    "bcpm-role-admin": [
      { resource: "users", action: "read", scope: "*" },
      { resource: "users", action: "write", scope: "*" },
      { resource: "settings", action: "read", scope: "*" },
    ],
    "bcpm-role-user": [{ resource: "profile", action: "read", scope: "self" }],
  };

  return {
    postBurmProfilesIdentifier: async (username: string, password: string) => {
      if (options?.forceBurmConnectionError) {
        throw buildAdapterError("BURM unavailable", 503, "BURM-CONNECTION-001");
      }

      const user = users.find((candidate) => candidate.username === username);
      if (!user || user.password !== password) {
        throw buildAdapterError(
          "Invalid credentials",
          401,
          "BURM-AUTH-001",
          user?.burmUserId
        );
      }

      return {
        burmProfileId: user.burmProfileId,
        burmUserId: user.burmUserId,
        burmStatusId: user.burmStatusId,
        burmDepartmentId: user.burmDepartmentId,
        burmRoleId: user.burmRoleId,
      };
    },

    getBcpmStatusesStatusId: async (statusId: string) => {
      if (options?.forceBcpmConnectionError) {
        throw buildAdapterError("BCPM unavailable", 503, "BCPM-CONNECTION-001");
      }

      const status = statuses[statusId as keyof typeof statuses];
      if (!status) {
        throw buildAdapterError("Status not found", 404, "BCPM-STATUS-001");
      }

      return status;
    },

    getBcpmPermissionsRoleId: async (roleId: string) => {
      if (options?.forceBcpmConnectionError) {
        throw buildAdapterError("BCPM permissions unavailable", 503, "BCPM-CONNECTION-002");
      }

      return permissions[roleId] || [];
    },

    postBurmCredentialsGenerateToken: async (
      userId: string,
      roleId: string,
      departmentId: string,
      rolePermissions: BcpmPermission[]
    ) => {
      if (options?.forceBurmConnectionError) {
        throw buildAdapterError("BURM token unavailable", 503, "BURM-CONNECTION-002");
      }

      const encodedPermissions = rolePermissions.map((item) => `${item.resource}:${item.action}`).join(",");
      return {
        burmToken: `mock-token:${userId}:${roleId}:${departmentId}:${encodedPermissions}`,
      };
    },

    patchBurmCredentialsIncrementAttempts: async () => {
      return { statusId: "bcpm-status-active", attempts: 1 };
    },

    patchBurmProfilesBlocked: async () => {
      return;
    },
  };
};
