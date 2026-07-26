import { test, expect } from "../../fixtures/apiFixture";
import { AuthHeader } from "../../headers/authHeader";
import { ReportManager } from "../../utils/ReportManager";

test.beforeAll(async ({ request }) => {
    if (!AuthHeader.getToken()) {
        const { AuthAPI } = await import("../../api/AuthAPI");
        const login = await new AuthAPI(request).login();
        AuthHeader.setToken(login.responseBody.accessToken);
    }
});

test("TC_PRODUCT_004 - Delete Product (Happy Path)", async ({ productApi }, testInfo) => {
    const productId = 1;
    const result = await productApi.deleteProduct(productId);
    let verdict: "PASS" | "FAIL" = "PASS";

    try {
        expect(result.actualStatus).toBe(200);
        expect(result.responseBody).toHaveProperty("isDeleted", true);
    } catch (e) {
        verdict = "FAIL";
        throw e;
    } finally {
        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_004",
            description: "Verify an existing product can be deleted",
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
