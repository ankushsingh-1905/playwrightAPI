import { ReportManager } from "./ReportManager";

/**
 * Runs once before any test starts (see playwright.config.ts).
 * Wipes reports/.results/ so a fresh run doesn't mix its results with
 * leftover JSON files from a previous run.
 */
export default async function globalSetup() {
    ReportManager.clearResultsDir();
}
