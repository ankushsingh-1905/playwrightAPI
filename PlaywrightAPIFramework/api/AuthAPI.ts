import { BaseAPI } from "./BaseAPI";
import { CommonHeader } from "../headers/commonHeader";
import { loginPayload } from "../payloads/loginPayload";

/**
 * AuthAPI contains all authentication-related API methods.
 * It extends BaseAPI so that we can directly use common HTTP methods.
 */

export class AuthAPI extends BaseAPI {

    /**
     * Login API (Positive Test Case)
     *
     * Purpose:
     * - Performs a successful login.
     * - Uses the default login payload if no payload is passed.
     *
     * Flow:
     * Test Case
     *      ↓
     * AuthAPI.login()
     *      ↓
     * BaseAPI.post()
     *      ↓
     * /auth/login
     */

    login(payload: any = loginPayload) {

        // Calls the POST method from BaseAPI.
        // Endpoint     -> /auth/login
        // Payload      -> Username & Password
        // Headers      -> Content-Type, Accept etc.

        return this.post("/auth/login", payload, CommonHeader.build());
    }

    /**
     * Login API using GET Method (Negative Test Case)
     
     * Purpose:
     * - Intentionally calls Login API using GET instead of POST.
     * - Used to verify application error handling.
     * - Expected Response:
     *      404 / 405 (depending on API behaviour)
     */

    loginUsingGet() {

        // Calls GET request instead of POST.
        // This helps validate incorrect HTTP Method handling.

        return this.get("/auth/login", CommonHeader.build());
    }

     /**
     * OAuth Token API
     *
     * Purpose:
     * - Used when OAuth authentication is required.
     * - Allows custom headers to be passed.
     * - Payload can be changed dynamically.
     *
     * Example:
     * Client ID
     * Client Secret
     * Grant Type
     */

    createAuthWithHeaders(
    payload: any,
    headers: Record<string, string>
) {

    // Sends POST request to OAuth Token endpoint.
    // Custom headers are passed from the test case.

    return this.post(
        "/oauth2/auscmq67k6wLWCndN1d7/v1/token",
        headers
    );
}
}
