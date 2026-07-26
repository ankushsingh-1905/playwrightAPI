import { CONFIG } from "../config/config";

/**
 * Builds a copy-pasteable curl command from a request's method/url/headers/body.
 * Always produces an ABSOLUTE url (Postman/terminal need this — a relative
 * path like '/products/add' is not runnable outside this framework's
 * baseURL-aware request context).
 */
export const CurlGenerator = {
    build(
    method: string,
    endpoint: string,
    headers: Record<string, string>,
    body?: any,
    baseURL: string = CONFIG.baseURL
): string {
        const fullUrl = endpoint.startsWith("http")
    ? endpoint
    : `${baseURL}${endpoint}`;

        let curl = `curl --location --request ${method} '${fullUrl}'`;

        Object.entries(headers).forEach(([key, value]) => {
            curl += ` \\\n--header '${key}: ${value}'`;
        });

        if (body !== undefined && body !== null) {
            curl += ` \\\n--data '${JSON.stringify(body, null, 2)}'`;
        }

        return curl;
    },

    /** Resolves a relative endpoint to an absolute URL — used by BaseAPI for the report's Endpoint column. */
    toAbsoluteUrl(
    endpoint: string,
    baseURL: string = CONFIG.baseURL
): string {

    return endpoint.startsWith("http")
        ? endpoint
        : `${baseURL}${endpoint}`;

},
};
