import { APIRequestContext } from "@playwright/test";
import { CurlGenerator } from "../utils/CurlGenerator";
import { Logger } from "../utils/Logger";
import { CONFIG } from "../config/config";

export interface ExecuteResult {
    method: string;
    endpoint: string;
    curl: string;
    requestBody: any;
    responseBody: any;
    responseHeaders: Record<string, string>; // <-- Add this
    actualStatus: number;
    responseTime: number;
}

export class BaseAPI {
    constructor(
    protected request: APIRequestContext,
    protected baseURL: string = CONFIG.baseURL
) {}

    //==========================
    // Generic Execute Method
    //==========================
    protected async execute(
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        endpoint: string,
        headers: Record<string, string> = {},
        body?: any
    ): Promise<ExecuteResult> {
        const fullUrl = CurlGenerator.toAbsoluteUrl(
    endpoint,
    this.baseURL
);
        const curl = CurlGenerator.build(
    method,
    endpoint,
    headers,
    body,
    this.baseURL
);

        const start = Date.now();
        const response = await this.request.fetch(endpoint, {
            method,
            headers,
            data: body,
        });
        const end = Date.now();

        let responseBody: any;
        try {
            responseBody = await response.json();
        } catch {
            responseBody = await response.text();
        }

        Logger.info(`${method} ${fullUrl} -> ${response.status()} (${end - start}ms)`);

        return {
    method,
    endpoint: fullUrl,
    curl,
    requestBody: body,
    responseBody,
    responseHeaders: response.headers(), // <-- Add this
    actualStatus: response.status(),
    responseTime: end - start,
};
    }

    //==========================
    // Wrapper Methods
    //==========================
    protected get(endpoint: string, headers: Record<string, string> = {}) {
        return this.execute("GET", endpoint, headers);
    }

    protected post(endpoint: string, body?: any, headers: Record<string, string> = {}) {
        return this.execute("POST", endpoint, headers, body);
    }

    protected put(endpoint: string, body?: any, headers: Record<string, string> = {}) {
        return this.execute("PUT", endpoint, headers, body);
    }

    protected patch(endpoint: string, body?: any, headers: Record<string, string> = {}) {
        return this.execute("PATCH", endpoint, headers, body);
    }

    protected delete(endpoint: string, headers: Record<string, string> = {}) {
        return this.execute("DELETE", endpoint, headers);
    }
    
}
