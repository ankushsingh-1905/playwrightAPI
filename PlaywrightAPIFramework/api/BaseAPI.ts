import { APIRequestContext } from "@playwright/test";
import { CurlGenerator } from "../utils/CurlGenerator";
import { Logger } from "../utils/Logger";
import { CONFIG } from "../config/config";

/**
 * Common response object returned by every API method.
 * Every API (GET, POST, PUT, DELETE etc.) returns the same structure.
 */

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

/**
 * BaseAPI contains all common HTTP methods.
 *
 * Instead of writing GET, POST, PUT, PATCH, DELETE
 * in every API class, they are written once here.
 *
 * AuthAPI
 * ProductAPI
 * UserAPI
 * all extend this class.
 */

export class BaseAPI {  
    
    /**
     * Constructor
     *
     * request -> Playwright APIRequestContext
     * baseURL -> Base URL from config
     */

    constructor(
    protected request: APIRequestContext,
    protected baseURL: string = CONFIG.baseURL
) {}

    //===========================================================
    // Generic Execute Method
    //===========================================================

    /**
     * This is the heart of the framework.
     *
     * Every HTTP method eventually comes here.
     *
     * Example:
     * AuthAPI.login()
     *      ↓
     * post()
     *      ↓
     * execute()
     *
     * ProductAPI.createProduct()
     *      ↓
     * post()
     *      ↓
     * execute()
     */

    protected async execute(
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        endpoint: string,
        headers: Record<string, string> = {},
        body?: any
    ): Promise<ExecuteResult> {

        // Converts relative URL to full URL.
        // Example:
        // /products/add
        // becomes
        // https://dummyjson.com/products/add

        const fullUrl = CurlGenerator.toAbsoluteUrl(
        endpoint,
        this.baseURL
);
        // Generates CURL command for debugging.    
        const curl = CurlGenerator.build(
    method,
    endpoint,
    headers,
    body,
    this.baseURL
);

// Capture request start time.
        const start = Date.now();

         // Send API request using Playwright.
        const response = await this.request.fetch(endpoint, {
            method,
            headers,
            data: body,
        });
         // Capture request end time.
        const end = Date.now();

        /**
         * Try reading JSON response.
         * If API doesn't return JSON,
         * read it as plain text.
         */
        let responseBody: any;
        try {
            responseBody = await response.json();
        } catch {
            responseBody = await response.text();
        }

        // Log API execution details.
        Logger.info(`${method} ${fullUrl} -> ${response.status()} (${end - start}ms)`);

        /**
         * Return a standard response object.
         *
         * Every API in the framework receives
         * the same object structure.
         */

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

     //===========================================================
    // Wrapper Methods
    //===========================================================

    /**
     * Wrapper for GET request.
     *
     * Calls execute() internally.
     */

    protected get(endpoint: string, headers: Record<string, string> = {}) {
        return this.execute("GET", endpoint, headers);
    }

      /**
     * Wrapper for POST request.
     *
     * Used by:
     * Login
     * Create Product
     * Create User
     */

    protected post(endpoint: string, body?: any, headers: Record<string, string> = {}) {
        return this.execute("POST", endpoint, headers, body);
    }

    /**
     * Wrapper for PUT request.
     */

    protected put(endpoint: string, body?: any, headers: Record<string, string> = {}) {
        return this.execute("PUT", endpoint, headers, body);
    }

     /**
     * Wrapper for PATCH request.
     */

    protected patch(endpoint: string, body?: any, headers: Record<string, string> = {}) {
        return this.execute("PATCH", endpoint, headers, body);
    }

     /**
     * Wrapper for DELETE request.
     */
    
    protected delete(endpoint: string, headers: Record<string, string> = {}) {
        return this.execute("DELETE", endpoint, headers);
    }
    
}
