import fs from "fs";
import path from "path";

export const FileUtil = {
    /** Creates a directory (and parents) if it doesn't already exist. */
    ensureDir(dirPath: string) {
        fs.mkdirSync(dirPath, { recursive: true });
    },

    /** Writes a file, creating its parent directory first. */
    writeFile(filePath: string, content: string) {
        this.ensureDir(path.dirname(filePath));
        fs.writeFileSync(filePath, content, "utf-8");
    },

    /** Reads and JSON-parses a file, throwing a clear error if it's missing. */
    readJson<T = unknown>(filePath: string): T {
        if (!fs.existsSync(filePath)) {
            throw new Error(`FileUtil: file not found - ${filePath}`);
        }
        return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
    },
};
