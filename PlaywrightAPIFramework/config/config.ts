import { ENV } from "./env"; // Import all environment values from env.ts

/**
 * CONFIG object stores common framework settings.
 *
 * Instead of reading ENV values everywhere,
 * we use CONFIG throughout the framework.
 */
export const CONFIG = {

    // Base URL used for all API requests.
    // Example:
    // https://dummyjson.com
    baseURL: ENV.baseURL,

    // Default timeout for API requests.
    // Example:
    // 30000 milliseconds (30 seconds)
    timeout: ENV.timeout,

};