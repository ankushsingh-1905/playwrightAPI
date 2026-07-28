import { CONFIG } from "../config/config";

/**
 * CurlGenerator
 *
 * Purpose:
 * Converts every API request into a cURL command.
 *
 * Why?
 * - Helps developers reproduce the same API request in Postman or Terminal.
 * - Makes debugging easier.
 * - Stores the cURL command in the HTML report.
 */
export const CurlGenerator = {

    /**
     * build()
     *
     * Purpose:
     * Creates a complete cURL command from the request details.
     *
     * Inputs:
     * - HTTP Method (GET, POST, PUT...)
     * - API Endpoint
     * - Headers
     * - Request Body
     *
     * Output:
     * Returns a ready-to-run cURL command.
     */
    build(
        method: string,
        endpoint: string,
        headers: Record<string, string>,
        body?: any,
        baseURL: string = CONFIG.baseURL
    ): string {

        /**
         * Convert a relative endpoint into a complete URL.
         *
         * Example:
         * "/products/add"
         *
         * becomes
         *
         * "https://dummyjson.com/products/add"
         */
        const fullUrl = endpoint.startsWith("http")
            ? endpoint
            : `${baseURL}${endpoint}`;

        /**
         * Start creating the cURL command.
         */
        let curl = `curl --location --request ${method} '${fullUrl}'`;

        /**
         * Add every request header.
         *
         * Example:
         * Content-Type
         * Authorization
         */
        Object.entries(headers).forEach(([key, value]) => {
            curl += ` \\\n--header '${key}: ${value}'`;
        });

        /**
         * Add the request body only if one exists.
         *
         * Mostly used for POST, PUT and PATCH requests.
         */
        if (body !== undefined && body !== null) {
            curl += ` \\\n--data '${JSON.stringify(body, null, 2)}'`;
        }

        /**
         * Return the complete cURL command.
         */
        return curl;
    },

    /**
     * toAbsoluteUrl()
     *
     * Purpose:
     * Converts a relative endpoint into a complete URL.
     *
     * Why?
     * The HTML report should display the full API URL,
     * not just "/products/add".
     */
    toAbsoluteUrl(
        endpoint: string,
        baseURL: string = CONFIG.baseURL
    ): string {

        return endpoint.startsWith("http")
            ? endpoint
            : `${baseURL}${endpoint}`;

    },
};