import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";

/**
 * Load environment variables from .env file.
 *
 * Why?
 * So values like BASE_URL can be used
 * throughout the framework.
 */
dotenv.config();

/**
 * Playwright Configuration
 *
 * Purpose:
 * This is the main configuration file of the framework.
 *
 * Every test execution starts by reading this file.
 */
export default defineConfig({

    /**
     * Folder where all test files are stored.
     *
     * Playwright will execute every test
     * inside this folder.
     */
    testDir: "./tests",

    /**
     * Maximum execution time for one test.
     *
     * Here:
     * 30 seconds.
     */
    timeout: 30000,

    /**
     * Allows Playwright to execute tests in parallel.
     *
     * This improves execution speed.
     */
    fullyParallel: true,

    /**
     * Retry failed tests.
     *
     * 0 means:
     * Do not retry.
     * Fail immediately.
     */
    retries: 0,

    /**
     * Number of worker processes.
     *
     * workers = 1
     * Tests run one after another.
     *
     * Can be increased later
     * for parallel execution.
     */
    workers: 1,

    /**
     * Test Reporter.
     *
     * "list" shows execution details
     * in the terminal.
     *
     * Our custom HTML report
     * is generated separately
     * by ReportManager.
     */
    reporter: [["list"]],

    /**
     * Runs before any test starts.
     *
     * Used to prepare the framework.
     *
     * In this project,
     * it clears old report files.
     */
    globalSetup: "./utils/globalSetup.ts",

    /**
     * Runs after all tests finish.
     *
     * Used to:
     * - Generate HTML Report
     * - Send Email Report
     */
    globalTeardown: "./utils/globalTeardown.ts",

    /**
     * Default settings
     * used by every API request.
     */
    use: {

        /**
         * Base URL
         *
         * Every API request
         * automatically uses this URL.
         *
         * Example:
         * /products
         *
         * becomes
         *
         * https://dummyjson.com/products
         */
        baseURL:

            process.env.BASE_URL ||

            "https://dummyjson.com",

        /**
         * Common HTTP Headers
         *
         * Automatically added
         * to every request.
         */
        extraHTTPHeaders: {

            Accept: "application/json",

        },

    },

});