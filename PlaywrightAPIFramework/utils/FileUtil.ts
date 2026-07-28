import fs from "fs";
import path from "path";

/**
 * FileUtil
 *
 * Purpose:
 * This utility class handles all file-related operations.
 *
 * Why?
 * - Avoid writing file handling code multiple times.
 * - Keep file operations reusable and centralized.
 * - Used by ReportManager and other utilities.
 */
export const FileUtil = {

    /**
     * ensureDir()
     *
     * Purpose:
     * Creates a folder if it does not already exist.
     *
     * Why?
     * Before writing a report or any file,
     * we must ensure the folder is available.
     *
     * Example:
     * reports/
     * logs/
     */
    ensureDir(dirPath: string) {

        // Create the directory.
        // "recursive: true" also creates parent folders if needed.
        fs.mkdirSync(dirPath, { recursive: true });

    },

    /**
     * writeFile()
     *
     * Purpose:
     * Writes content into a file.
     *
     * Why?
     * Used when generating HTML reports,
     * logs, or any output files.
     */
    writeFile(filePath: string, content: string) {

        // Make sure the parent folder exists.
        this.ensureDir(path.dirname(filePath));

        // Write the content into the file.
        fs.writeFileSync(filePath, content, "utf-8");

    },

    /**
     * readJson()
     *
     * Purpose:
     * Reads a JSON file and converts it into a JavaScript object.
     *
     * Why?
     * Useful for reading test data,
     * configuration files, or payloads.
     */
    readJson<T = unknown>(filePath: string): T {

        // Check whether the file exists.
        if (!fs.existsSync(filePath)) {

            throw new Error(`FileUtil: file not found - ${filePath}`);

        }

        // Read the file and convert JSON into an object.
        return JSON.parse(
            fs.readFileSync(filePath, "utf-8")
        ) as T;

    },

};