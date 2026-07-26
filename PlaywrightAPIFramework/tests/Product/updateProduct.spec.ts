import { test, expect } from "../../fixtures/apiFixture";
import { AuthHeader } from "../../headers/authHeader";
import { ReportManager } from "../../utils/ReportManager";
import { updateProductPayload } from "../../payloads/updateProduct";

test.beforeAll(async ({ request }) => {
    if (!AuthHeader.getToken()) {
        const { AuthAPI } = await import("../../api/AuthAPI");
        const login = await new AuthAPI(request).login();
        AuthHeader.setToken(login.responseBody.accessToken);
    }
});

test("TC_PRODUCT_003 - Update Product (Happy Path)", async ({ productApi }, testInfo) => {
    const productId = 1; // dummyjson always has product id=1 seeded
    const result = await productApi.updateProduct(productId, updateProductPayload);
    let verdict: "PASS" | "FAIL" = "PASS";

    try {
        expect(result.actualStatus).toBe(200);
        expect(result.responseBody.title).toBe(updateProductPayload.title);
        expect(result.responseBody.price).toBe(updateProductPayload.price);
    } catch (e) {
        verdict = "FAIL";
        throw e;
    } finally {
        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_003",
            description: "Verify an existing product can be updated",
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
