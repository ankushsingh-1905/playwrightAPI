import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
    testDir: "./tests",
    timeout: 30000,
    fullyParallel: true,
    // Safe to run parallel workers now: each test's result is written to its
    // own file in reports/.results/ (see ReportManager.addResult), so results
    // survive across worker processes. globalSetup clears that folder before
    // the run starts; globalTeardown reads every file back and renders the
    // final grouped HTML — both of those run in the main process, separate
    // from the worker processes that actually execute tests.
    retries: 0,
    workers: 1,
    reporter: [["list"]],
    globalSetup: "./utils/globalSetup.ts",
    globalTeardown: "./utils/globalTeardown.ts",
    use: {
        baseURL: process.env.BASE_URL || "https://dummyjson.com",
        extraHTTPHeaders: {
            Accept: "application/json",
        },
    },
});
