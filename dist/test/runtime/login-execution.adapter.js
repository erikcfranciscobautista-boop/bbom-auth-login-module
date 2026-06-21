import { buildLoginUseCase } from "../../src/services/login.implementation.js";
export const buildLoginExecutionAdapter = (adapters) => {
    const useCase = buildLoginUseCase();
    return (input) => useCase(input, adapters);
};
