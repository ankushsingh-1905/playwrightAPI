/* eslint-disable no-console */

/**
 * Log Levels
 *
 * Purpose:
 * Defines the available logging levels.
 *
 * From lowest to highest:
 * debug -> info -> warn -> error
 */
type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Log Priority
 *
 * Purpose:
 * Assigns a priority number to each log level.
 *
 * Used to decide which logs should be printed.
 */
const ORDER: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

/**
 * LoggerImpl
 *
 * Purpose:
 * A reusable logger for the entire framework.
 *
 * Why?
 * Instead of writing console.log() everywhere,
 * every class uses this Logger utility.
 *
 * Benefits:
 * - Standard log format
 * - Easy debugging
 * - Log filtering using LOG_LEVEL
 */
class LoggerImpl {

    /**
     * Read log level from .env
     *
     * Example:
     * LOG_LEVEL=info
     *
     * If nothing is provided,
     * default level is "info".
     */
    private level: LogLevel =
        (process.env.LOG_LEVEL as LogLevel) || "info";

    /**
     * should()
     *
     * Purpose:
     * Decides whether a message
     * should be printed or ignored.
     *
     * Example:
     * Current Level = info
     *
     * debug -> Not Printed
     * info  -> Printed
     * warn  -> Printed
     * error -> Printed
     */
    private should(level: LogLevel) {
        return ORDER[level] >= ORDER[this.level];
    }

    /**
     * Debug Log
     *
     * Used for:
     * Detailed debugging information.
     */
    debug(msg: string, meta?: unknown) {

        if (this.should("debug"))

            console.log(`[DEBUG] ${msg}`, meta ?? "");

    }

    /**
     * Info Log
     *
     * Used for:
     * Normal execution messages.
     *
     * Example:
     * POST /products/add -> 201
     */
    info(msg: string, meta?: unknown) {

        if (this.should("info"))

            console.log(`[INFO] ${msg}`, meta ?? "");

    }

    /**
     * Warning Log
     *
     * Used for:
     * Unexpected situations
     * that are not failures.
     */
    warn(msg: string, meta?: unknown) {

        if (this.should("warn"))

            console.warn(`[WARN] ${msg}`, meta ?? "");

    }

    /**
     * Error Log
     *
     * Used for:
     * Failures and exceptions.
     */
    error(msg: string, meta?: unknown) {

        if (this.should("error"))

            console.error(`[ERROR] ${msg}`, meta ?? "");

    }

}

/**
 * Export one Logger instance.
 *
 * Every class in the framework
 * uses this same logger.
 *
 * Example:
 * Logger.info(...)
 * Logger.error(...)
 */
export const Logger = new LoggerImpl();