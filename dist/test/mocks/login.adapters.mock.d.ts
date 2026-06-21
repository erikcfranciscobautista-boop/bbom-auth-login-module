import type { LoginAdapters } from "../../src/contracts.js";
type LoginMockOptions = {
    forceBurmConnectionError?: boolean;
    forceBcpmConnectionError?: boolean;
};
export declare const createLoginAdaptersMock: (options?: LoginMockOptions) => LoginAdapters;
export {};
