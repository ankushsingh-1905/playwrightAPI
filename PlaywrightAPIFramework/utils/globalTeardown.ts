import { ReportManager } from "./ReportManager";
import { MailService } from "./MailService";

/**
 * globalTeardown()
 *
 * Purpose:
 * This method runs automatically after all Playwright tests finish.
 *
 * Where is it configured?
 * It is configured inside playwright.config.ts.
 *
 * Why do we need it?
 * To perform all post-execution activities,
 * such as generating the report and sending it by email.
 */
export default async function globalTeardown() {

    /**
     * Step 1:
     * Generate the final HTML report.
     *
     * What happens?
     * - Reads all JSON result files.
     * - Combines them into one report.
     * - Creates CustomReport.html inside the reports folder.
     */
    ReportManager.generateReport();

    /**
     * Step 2:
     * Send the generated report by email.
     *
     * What happens?
     * - Reads SMTP configuration from .env.
     * - Attaches the HTML report.
     * - Sends it to the configured recipients.
     */
    await MailService.sendReport();

}