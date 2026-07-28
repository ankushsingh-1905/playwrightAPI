import * as dotenv from "dotenv"; // Library used to read values from the .env file.

/**
 * Loads all variables from the .env file
 * and makes them available through process.env.
 */
dotenv.config();

/**
 * ENV stores all environment-specific values.
 *
 * Examples:
 * - Base URL
 * - Timeout
 * - SMTP configuration
 * - Email configuration
 *
 * This allows us to change values without modifying the source code.
 */
export const ENV = {

    // -------------------------------
    // API Configuration
    // -------------------------------

    // Base URL used for all API requests.
    // If BASE_URL is not present in .env,
    // DummyJSON will be used by default.
    baseURL: process.env.BASE_URL || "https://dummyjson.com",

    // Default timeout for API requests.
    // Default = 30000 ms (30 seconds)
    timeout: Number(process.env.REQUEST_TIMEOUT_MS || 30000),

    // -------------------------------
    // SMTP Configuration
    // -------------------------------

    // SMTP Server Host
    smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",

    // SMTP Port Number
    smtpPort: Number(process.env.SMTP_PORT || 587),

    // Email ID used to send reports
    smtpUser: process.env.SMTP_USER || "",

    // Password or App Password
    smtpPassword: process.env.SMTP_PASSWORD || "",

    // -------------------------------
    // Email Configuration
    // -------------------------------

    // Sender Email
    mailFrom: process.env.MAIL_FROM || "",

    // Receiver Email
    mailTo: process.env.MAIL_TO || "",

    // CC Email
    mailCc: process.env.MAIL_CC || "",

    // Subject of the Email Report
    mailSubject:
        process.env.MAIL_SUBJECT || "Playwright API Automation Report",
};