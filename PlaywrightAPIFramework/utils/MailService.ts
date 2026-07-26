import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { ENV } from "../config/env";

export class MailService {

    static async sendReport() {

        const transporter = nodemailer.createTransport({

            host: ENV.smtpHost,

            port: ENV.smtpPort,

            secure: false,

            auth: {
                user: ENV.smtpUser,
                pass: ENV.smtpPassword
            }

        });

        const reportPath = path.join(process.cwd(), "reports", "CustomReport.html");

        const htmlBody = `
            <h2>Playwright API Automation Execution</h2>

            <p>
            Execution completed successfully.
            </p>

            <p>
            Please find the attached automation report.
            </p>
        `;

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

        console.log("Email Sent Successfully.");
    }

}