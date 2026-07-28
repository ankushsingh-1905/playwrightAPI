import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { ENV } from "../config/env";

/**
 * MailService
 *
 * Purpose:
 * Sends the automation execution report by email.
 *
 * Why?
 * Instead of manually opening the report and emailing it,
 * the framework automatically sends the HTML report
 * after test execution is completed.
 *
 * Used By:
 * globalTeardown.ts
 */
export class MailService {

    /**
     * sendReport()
     *
     * Purpose:
     * Sends the generated HTML report as an email attachment.
     */
    static async sendReport() {

        /**
         * Step 1
         * Create an SMTP connection.
         *
         * SMTP details are read from the .env file.
         */
        const transporter = nodemailer.createTransport({

            host: ENV.smtpHost,

            port: ENV.smtpPort,

            secure: false,

            auth: {

                user: ENV.smtpUser,

                pass: ENV.smtpPassword

            }

        });

        /**
         * Step 2
         * Locate the generated HTML report.
         */
        const reportPath = path.join(

            process.cwd(),

            "reports",

            "CustomReport.html"

        );

        /**
         * Step 3
         * Create the email body.
         *
         * This is the message that appears
         * inside the email.
         */
        const htmlBody = `

            <h2>Playwright API Automation Execution</h2>

            <p>
            Execution completed successfully.
            </p>

            <p>
            Please find the attached automation report.
            </p>

        `;

        /**
         * Step 4
         * Send the email.
         *
         * Includes:
         * - Sender
         * - Receiver
         * - CC
         * - Subject
         * - HTML Message
         * - Report Attachment
         */
        await transporter.sendMail({

            from: ENV.mailFrom,

            to: ENV.mailTo,

            cc: ENV.mailCc,

            subject: ENV.mailSubject,

            html: htmlBody,

            attachments: [

                {
                    filename: "CustomReport.html",

                    path: reportPath
                }

            ]

        });

        /**
         * Step 5
         * Print success message.
         */
        console.log("Email Sent Successfully.");

    }

}