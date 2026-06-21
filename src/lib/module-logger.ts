const COMPONENT_NAME = "bbom-auth-login-module";

type LogType = "INFO" | "WARN" | "ERROR";

export type LogFolder = "CONTROLLER" | "ROUTE" | "SERVICE" | "MIDDLEWARE";

export type LogContext = {
  folder: LogFolder;
  class: string;
  method: string;
  context: string;
};

const emit = (type: LogType, ctx: LogContext): void => {
  const entry = {
    type,
    time: new Date().toISOString(),
    message: `[${ctx.folder} - ${ctx.class} - ${ctx.method}] - ${ctx.context}`,
  };

  const line = JSON.stringify(entry);

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
