import { BaseAPI } from "./BaseAPI";
import { CommonHeader } from "../headers/commonHeader";
import { loginPayload } from "../payloads/loginPayload";

export class AuthAPI extends BaseAPI {
    /** POST /auth/login — the happy path. */
    login(payload: any = loginPayload) {
        return this.post("/auth/login", payload, CommonHeader.build());
    }

    /** GET /auth/login — wrong HTTP method, used as a negative test case. */
    loginUsingGet() {
        return this.get("/auth/login", CommonHeader.build());
    }

    createAuthWithHeaders(
    payload: any,
    headers: Record<string, string>
) {
    return this.post(
        "/oauth2/auscmq67k6wLWCndN1d7/v1/token",
        headers
    );
}
}
