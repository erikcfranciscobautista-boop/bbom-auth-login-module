export type LogFolder = "CONTROLLER" | "ROUTE" | "SERVICE" | "MIDDLEWARE";
export type LogContext = {
    folder: LogFolder;
    class: string;
    method: string;
    context: string;
};
export declare const moduleLogger: {
    info: (context: LogContext) => void;
    warn: (context: LogContext) => void;
    error: (context: LogContext) => void;
};
