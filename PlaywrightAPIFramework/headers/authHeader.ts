/**
 * Holds the access token for the current test run and builds the
 * Authorization header from it. Call AuthHeader.setToken() right after
 * a successful login (see tests/Auth/login.spec.ts), then every other
 * API class can call AuthHeader.build() to get an auth-ready header.
 *
 * AuthHeader.buildPasted() is a separate, independent path — it always
 * uses PASTED_TOKEN below, regardless of whether setToken() was ever
 * called. Use it when you want to force a specific token manually
 * (e.g. testing a single endpoint without running login first, or
 * testing with an expired/foreign token).
 */
let currentToken: string | null = null;

// 👇 Paste a token here when you want to force it via buildPasted()
const PASTED_TOKEN = "";

export const AuthHeader = {
    setToken(token: string) {
        currentToken = token;
    },

    getToken(): string | null {
        return currentToken;
    },

    clear() {
        currentToken = null;
    },

    //==========================
    // Normal flow — token from a real login()
    //==========================
    build(): Record<string, string> {
        if (!currentToken) {
            throw new Error(
                "AuthHeader: no token set. Call AuthHeader.setToken() after a successful login before calling an authenticated endpoint."
            );
        }
        return { Authorization: `Bearer ${currentToken}` };
    },

    //==========================
    // Manual flow — always uses PASTED_TOKEN above
    //==========================
    buildPasted(): Record<string, string> {
        const token = PASTED_TOKEN.trim();
        if (!token) {
            throw new Error(
                "AuthHeader: PASTED_TOKEN is empty. Paste a token into headers/authHeader.ts before calling buildPasted()."
            );
        }
        return { Authorization: `Bearer ${token}` };
    },
};