import path from "path";
import fs from "fs";
import { FileUtil } from "./FileUtil";

export interface ApiResult {
    method: string;
    url: string;
    curl: string;
    requestBody?: any;
    responseBody?: any;
    expectedStatus: number;
    actualStatus: number;
    responseTime: number;
}

export interface ReportData {
    module: string;
    testCaseId: string;
    description: string;
    result: "PASS" | "FAIL";
    apiResult: ApiResult;
}

// Each test result is written here immediately, as its own small JSON file.
// WHY: globalTeardown (which renders the final HTML) runs in a completely
// separate Node.js process from the test workers. An in-memory array on
// ReportManager does NOT cross that process boundary — it would always be
// empty by the time generateReport() runs, which is exactly the "0/0 Passed"
// bug this file fixes. Writing to disk is the only thing both processes
// can actually see.
const RESULTS_DIR = path.join("reports", ".results");

export class ReportManager {
    private static rowCounter = 0;

    /** Derives the module name from a spec file's path: tests/Auth/login.spec.ts -> "Auth" */
    static getModuleName(testInfo: { file: string }): string {
        return path.basename(path.dirname(testInfo.file));
    }

    /** Call this once at the very start of the run (see utils/globalSetup.ts) to clear stale results from a previous run. */
    static clearResultsDir() {
        if (fs.existsSync(RESULTS_DIR)) {
            fs.rmSync(RESULTS_DIR, { recursive: true, force: true });
        }
        FileUtil.ensureDir(RESULTS_DIR);
    }

    /** Persists one test result to its own JSON file immediately. */
    static addResult(data: ReportData) {
        FileUtil.ensureDir(RESULTS_DIR);
        // testCaseId + timestamp keeps filenames unique even if a spec runs twice (retries).
        const safeId = data.testCaseId.replace(/[^a-zA-Z0-9_-]/g, "_");
        const fileName = `${safeId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.json`;
        FileUtil.writeFile(path.join(RESULTS_DIR, fileName), JSON.stringify(data, null, 2));
    }

    /** Reads every result file written by addResult() back into memory. */
    private static loadAllResults(): ReportData[] {
        if (!fs.existsSync(RESULTS_DIR)) {
            return [];
        }
        const files = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith(".json"));
        return files.map((f) => FileUtil.readJson<ReportData>(path.join(RESULTS_DIR, f)));
    }

    private static escapeHtml(value: string): string {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    private static pretty(value: any): string {
        if (value === undefined) return "(no body)";
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }

    /** One <details> block with a copy button and a <pre> payload. */
    private static copyableBlock(label: string, rawContent: string): string {
        this.rowCounter += 1;
        const id = `block-${this.rowCounter}`;
        const safeContent = this.escapeHtml(rawContent);

        return `
<details>
  <summary>${label}
    <button class="copy-btn" onclick="copyBlock(event, '${id}')">Copy</button>
  </summary>
  <pre id="${id}">${safeContent}</pre>
</details>`;
    }

    private static buildRow(r: ReportData, sno: number): string {
        const isFail = r.result === "FAIL";
        const rowClass = isFail ? "fail-row" : "pass-row";
        const badgeClass = isFail ? "badge-fail" : "badge-pass";

        return `
<tr class="${rowClass}">
<td>${sno}</td>
<td>${this.escapeHtml(r.testCaseId)}</td>
<td>${this.escapeHtml(r.description)}</td>
<td>${this.copyableBlock("View Curl", r.apiResult.curl)}</td>
<td>${this.copyableBlock("View Request", this.pretty(r.apiResult.requestBody))}</td>
<td>${this.copyableBlock("View Response", this.pretty(r.apiResult.responseBody))}</td>
<td>${r.apiResult.expectedStatus}</td>
<td>${r.apiResult.actualStatus}</td>
<td>${(r.apiResult.responseTime / 1000).toFixed(2)}s</td>
<td><span class="badge ${badgeClass}">${r.result}</span></td>
</tr>`;
    }

    private static headerRow(): string {
        return `
<tr>
<th>S.No</th>
<th>Test Case Name</th>
<th>Description</th>
<th>Curl</th>
<th>Request</th>
<th>Response</th>
<th>Expected Status</th>
<th>Actual Status</th>
<th>Response Time</th>
<th>Result</th>
</tr>`;
    }

    static generateReport(outputPath: string = "reports/CustomReport.html") {
        const results = this.loadAllResults();

        // Group results by module (Auth, Product, User, ...)
        const grouped: Record<string, ReportData[]> = {};
        for (const r of results) {
            const key = r.module || "Other";
            (grouped[key] ||= []).push(r);
        }

        let sections = "";
        for (const [moduleName, moduleResults] of Object.entries(grouped)) {
            moduleResults.sort((a, b) => a.testCaseId.localeCompare(b.testCaseId));

            const passed = moduleResults.filter((r) => r.result === "PASS").length;
            const total = moduleResults.length;
            const allPassed = passed === total;

            const rows = moduleResults
                .map((r, i) => this.buildRow(r, i + 1))
                .join("");

            sections += `
<div class="module-block">
  <h3 class="module-header">
    ${this.escapeHtml(moduleName)} Module
    <span class="badge ${allPassed ? "badge-pass" : "badge-fail"}">${passed}/${total} Passed</span>
  </h3>
  <table>
    ${this.headerRow()}
    ${rows}
  </table>
</div>`;
        }

        if (results.length === 0) {
            sections = `<p style="color:#c62828;">No test results found in <code>${RESULTS_DIR}</code>. Did any test call ReportManager.addResult()?</p>`;
        }

        const totalPassed = results.filter((r) => r.result === "PASS").length;
        const totalCount = results.length;
        const generatedAt = new Date().toLocaleString();

        const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Playwright API Automation Report</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: "Segoe UI", Arial, sans-serif;
    padding: 24px;
    background: #f4f6f8;
    color: #1a1a1a;
  }
  h2.title { margin-bottom: 4px; }
  p.subtitle { color: #666; margin-top: 0; margin-bottom: 20px; }
  p.overall {
    font-size: 16px;
    background: white;
    display: inline-block;
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #ddd;
    margin-bottom: 20px;
  }
  .module-block { margin-bottom: 36px; }
  .module-header {
    background: #e3f2fd;
    padding: 12px 16px;
    border-left: 5px solid #1565C0;
    border-radius: 4px;
    margin-bottom: 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }
  th, td {
    border: 1px solid #e0e0e0;
    padding: 10px;
    vertical-align: top;
    font-size: 13px;
  }
  th {
    background: #1565C0;
    color: white;
    position: sticky;
    top: 0;
  }
  tr.fail-row { background: #ffebee; }
  tr.pass-row:hover, tr.fail-row:hover { filter: brightness(0.97); }
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background: #f7f7f7;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    max-height: 260px;
    overflow-y: auto;
  }
  details { cursor: pointer; }
  summary { font-weight: 600; color: #1565C0; user-select: none; }
  .copy-btn {
    margin-left: 10px;
    font-size: 11px;
    padding: 2px 8px;
    border: 1px solid #1565C0;
    background: white;
    color: #1565C0;
    border-radius: 4px;
    cursor: pointer;
  }
  .copy-btn:hover { background: #1565C0; color: white; }
  .copy-btn.copied { background: #2e7d32; border-color: #2e7d32; color: white; }
  .badge {
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    color: white;
  }
  .badge-pass { background: #2e7d32; }
  .badge-fail { background: #c62828; }
</style>
</head>
<body>

<h2 class="title">Playwright API Automation Report</h2>
<p class="subtitle">Generated: ${generatedAt}</p>
<p class="overall">Overall: <b>${totalPassed}/${totalCount} Passed</b></p>

${sections}

<script>
function copyBlock(event, id) {
  event.preventDefault(); // don't toggle the <details> when clicking Copy
  const el = document.getElementById(id);
  const text = el.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const original = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1200);
  });
}
</script>

</body>
</html>
`;

      FileUtil.writeFile(outputPath, html);
    }

    /**
     * Returns the execution summary.
     *
     * Used by:
     * MailService.ts
     *
     * Why?
     * Instead of reading the HTML report,
     * MailService directly asks ReportManager
     * for the execution statistics.
     */
    static getExecutionSummary() {

        // Load all saved test results
        const results = this.loadAllResults();

        // Total executed test cases
        const total = results.length;

        // Count passed test cases
        const passed = results.filter(r => r.result === "PASS").length;

        // Count failed test cases
        const failed = total - passed;

        // Calculate pass percentage
        const passPercentage =
            total === 0
                ? "0.00"
                : ((passed / total) * 100).toFixed(2);

        // Calculate fail percentage
        const failPercentage =
            total === 0
                ? "0.00"
                : ((failed / total) * 100).toFixed(2);

        // Return all summary values
        return {

            total,

            passed,

            failed,

            passPercentage,

            failPercentage

        };

    }

}