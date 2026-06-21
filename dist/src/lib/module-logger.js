const COMPONENT_NAME = "bbom-auth-login-module";
const emit = (type, ctx) => {
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
    info: (context) => emit("INFO", context),
    warn: (context) => emit("WARN", context),
    error: (context) => emit("ERROR", context),
};
