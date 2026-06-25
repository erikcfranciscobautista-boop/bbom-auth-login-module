const COMPONENT_NAME = "bbom-auth-login-module";

type LogType = "INFO" | "WARN" | "ERROR";

export type LogFolder = "CONTROLLER" | "ROUTE" | "SERVICE" | "MIDDLEWARE";

export type LogContext = {
  folder: LogFolder;
  class: string;
  method: string;
  context: string;
};

type LogEntry = {
  component: string;
  level: LogType;
  time: string;
  message: string;
  context: LogContext;
};

export type ModuleLoggerAdapter = {
  info?: (entry: LogEntry) => void;
  warn?: (entry: LogEntry) => void;
  error?: (entry: LogEntry) => void;
};

let loggerAdapter: ModuleLoggerAdapter | null = null;

export const configureModuleLogger = (adapter?: ModuleLoggerAdapter): void => {
  loggerAdapter = adapter ?? null;
};

const emit = (type: LogType, ctx: LogContext): void => {
  const baseEntry = {
    component: COMPONENT_NAME,
    level: type,
    time: new Date().toISOString(),
    message: `[${ctx.folder} - ${ctx.class} - ${ctx.method}] - ${ctx.context}`,
    context: ctx,
  };

  if (loggerAdapter) {
    if (type === "ERROR" && loggerAdapter.error) {
      loggerAdapter.error(baseEntry);
      return;
    }

    if (type === "WARN" && loggerAdapter.warn) {
      loggerAdapter.warn(baseEntry);
      return;
    }

    if (type === "INFO" && loggerAdapter.info) {
      loggerAdapter.info(baseEntry);
      return;
    }
  }

  const line = JSON.stringify(baseEntry);

  if (type === "ERROR") {
    console.error(line);
    return;
  }

  if (type === "WARN") {
    console.warn(line);
    return;
  }

  console.info(line);
};

export const moduleLogger = {
  info: (context: LogContext): void => emit("INFO", context),
  warn: (context: LogContext): void => emit("WARN", context),
  error: (context: LogContext): void => emit("ERROR", context),
};
