/**
 * AuthHeader is responsible for storing and providing
 * the Bearer Token for authenticated APIs.
 *
 * Flow:
 * Login API
 *      ↓
 * setToken()
 *      ↓
 * ProductAPI / UserAPI
 *      ↓
 * build()
 *      ↓
 * Authorization: Bearer <token>
 */

// Stores the token for the current test execution.
let currentToken: string | null = null;

// Optional:
// Paste a token here if you want to skip login
// and use a fixed token manually.
const PASTED_TOKEN = "";

export const AuthHeader = {

    /**
     * Save the token after successful login.
     *
     * Called from Login Test.
     */
    setToken(token: string) {
        currentToken = token;
    },

    /**
     * Returns the currently stored token.
     *
     * Useful when another class needs the token.
     */
    getToken(): string | null {
        return currentToken;
    },

    /**
     * Removes the stored token.
     *
     * Useful after execution or before starting
     * another test run.
     */
    clear() {
        currentToken = null;
    },

    //==================================================
    // Normal Flow
    //==================================================

    /**
     * Builds Authorization Header
     * using the token received from Login API.
     *
     * Example:
     * Authorization: Bearer eyJhbGc...
     */
    build(): Record<string, string> {

        // Prevent authenticated API execution
        // if Login was not performed.
        if (!currentToken) {

            throw new Error(
                "AuthHeader: No token available. Please login first."
            );

        }

        return {

            Authorization: `Bearer ${currentToken}`

        };

    },

    //==================================================
    // Manual Flow
    //==================================================

    /**
     * Uses a manually pasted token.
     *
     * Useful for:
     * - Testing without Login
     * - Expired Token Testing
     * - Invalid Token Testing
     */
    buildPasted(): Record<string, string> {

        const token = PASTED_TOKEN.trim();

        if (!token) {

            throw new Error(
                "AuthHeader: PASTED_TOKEN is empty."
            );

        }

        return {

            Authorization: `Bearer ${token}`

        };

    },

};