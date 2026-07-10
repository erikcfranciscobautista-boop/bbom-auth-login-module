export function getStatusCode(error: unknown): number | undefined {
    const err = error as {
        statusCode?: number;
        response?: {
            status?: number;
        };
    };

    return err?.statusCode ?? err?.response?.status;
}