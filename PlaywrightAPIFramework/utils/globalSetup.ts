import { ReportManager } from "./ReportManager";

/**
 * globalSetup()
 *
 * Purpose:
 * This method runs automatically before any Playwright test starts.
 *
 * Where is it configured?
 * It is configured inside playwright.config.ts.
 *
 * Why do we need it?
 * To prepare the framework before executing any test.
 * In this project, it cleans the old report data
 * so every execution starts with a fresh report.
 */
export default async function globalSetup() {

    /**
     * Delete all old JSON result files.
     *
     * Why?
     * If old result files remain,
     * the new HTML report may contain
     * results from previous executions.
     *
     * This ensures every test run
     * generates a clean report.
     */
    ReportManager.clearResultsDir();

}