import { test, expect } from "../../fixtures/apiFixture";
import { AuthHeader } from "../../headers/authHeader";
import { JsonValidator } from "../../utils/JsonValidator";
import { loginSchema } from "../../schemas/loginSchema";
import { ReportManager } from "../../utils/ReportManager";
import { loginPayload } from "../../payloads/loginPayload";

test("TC_AUTH_001 - Valid Login API", async ({ authApi }, testInfo) => {
    const result = await authApi.login(loginPayload);
    let verdict: "PASS" | "FAIL" = "PASS";

    try {
        expect(result.actualStatus).toBe(200);
        JsonValidator.validate(loginSchema, result.responseBody);

        // Store the token so ProductAPI tests can use it via AuthHeader.build()
        AuthHeader.setToken(result.responseBody.accessToken);
    } catch (e) {
        verdict = "FAIL";
        throw e;
    } finally {
        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_AUTH_001",
            description: "Verify valid login returns 200 with a usable access token",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 200,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime,
            },
        });
    }
});