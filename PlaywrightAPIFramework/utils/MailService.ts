import nodemailer from "nodemailer";
import path from "path";
import { ENV } from "../config/env";
import { ReportManager } from "./ReportManager";

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
 * Get execution summary.
 *
 * ReportManager calculates:
 * - Total Tests
 * - Passed
 * - Failed
 * - Pass %
 * - Fail %
 *
 * MailService only reads these values
 * and shows them in the email.
 */
const summary = ReportManager.getExecutionSummary();

        /**
         * Step 4
         * Get Current Date & Time (IST)
         */
        const now = new Date();

        const executionDate = now.toLocaleDateString("en-IN", {

            day: "2-digit",

            month: "short",

            year: "numeric",

            timeZone: "Asia/Kolkata"

        });

        const executionTime = now.toLocaleTimeString("en-IN", {

            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit",

            hour12: true,

            timeZone: "Asia/Kolkata"

        });

        /**
 * Step 5
 * Create the email body.
 *
 * This summary is shown inside
 * the email before the report attachment.
 */
const htmlBody = `

<h2>🚀 Playwright API Automation Execution Report</h2>

<p>Hello Team,</p>

<p>
The Playwright API Automation execution has completed successfully.
</p>

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-family:Segoe UI;">

<tr>
<th align="left">Framework</th>
<td>Playwright API Automation Framework</td>
</tr>

<tr>
<th align="left">Execution Date</th>
<td>${executionDate}</td>
</tr>

<tr>
<th align="left">Execution Time (IST)</th>
<td>${executionTime}</td>
</tr>

<tr>
<th align="left">Total Test Cases</th>
<td><b>${summary.total}</b></td>
</tr>

<tr>
<th align="left">Passed</th>
<td style="color:green;">
<b>${summary.passed} (${summary.passPercentage}%)</b>
</td>
</tr>

<tr>
<th align="left">Failed</th>
<td style="color:red;">
<b>${summary.failed} (${summary.failPercentage}%)</b>
</td>
</tr>

<tr>
<th align="left">Execution Status</th>
<td style="color:green;">
<b>Completed Successfully</b>
</td>
</tr>

</table>

<br>

<p>
Please find the attached <b>HTML Automation Report</b> for detailed execution results.
</p>

<p>
Thank you.
</p>

<br>

Regards,<br>
<b>Playwright API Automation Framework</b>

`;

        /**
         * Step 6
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
         * Step 7
         * Print success message.
         */
        console.log("Email Sent Successfully.");

    }

}