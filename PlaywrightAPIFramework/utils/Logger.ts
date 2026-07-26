/* eslint-disable no-console */
type LogLevel = "debug" | "info" | "warn" | "error";

const ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

class LoggerImpl {
    private level: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

    private should(level: LogLevel) {
        return ORDER[level] >= ORDER[this.level];
    }

    debug(msg: string, meta?: unknown) {
        if (this.should("debug")) console.log(`[DEBUG] ${msg}`, meta ?? "");
    }
    info(msg: string, meta?: unknown) {
        if (this.should("info")) console.log(`[INFO]  ${msg}`, meta ?? "");
    }
    warn(msg: string, meta?: unknown) {
        if (this.should("warn")) console.warn(`[WARN]  ${msg}`, meta ?? "");
    }
    error(msg: string, meta?: unknown) {
        if (this.should("error")) console.error(`[ERROR] ${msg}`, meta ?? "");
    }
}

export const Logger = new LoggerImpl();
