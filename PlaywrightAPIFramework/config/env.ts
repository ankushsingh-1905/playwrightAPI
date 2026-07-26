import * as dotenv from "dotenv";

dotenv.config();

export const ENV = {
    // API Configuration
    baseURL: process.env.BASE_URL || "https://dummyjson.com",

    timeout: Number(process.env.REQUEST_TIMEOUT_MS || 30000),

    // SMTP Configuration
    smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
    smtpPort: Number(process.env.SMTP_PORT || 587),
    smtpUser: process.env.SMTP_USER || "",
    smtpPassword: process.env.SMTP_PASSWORD || "",

    // Email Configuration
    mailFrom: process.env.MAIL_FROM || "",
    mailTo: process.env.MAIL_TO || "",
    mailCc: process.env.MAIL_CC || "",
    mailSubject:
        process.env.MAIL_SUBJECT || "Playwright API Automation Report",
};