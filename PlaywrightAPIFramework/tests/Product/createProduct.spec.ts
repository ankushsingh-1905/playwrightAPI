import { test, expect } from "../../fixtures/apiFixture";
import { AuthHeader } from "../../headers/authHeader";
import { JsonValidator } from "../../utils/JsonValidator";
import { productSchema } from "../../schemas/productSchema";
import { ReportManager } from "../../utils/ReportManager";
import { createProductPayload, createProductPayloadWith } from "../../payloads/createProduct";

// Ensures a token exists even if this file runs on its own (e.g. `npm run test:product`)
test.beforeAll(async ({ request }) => {
    if (!AuthHeader.getToken()) {
        const { AuthAPI } = await import("../../api/AuthAPI");
        const login = await new AuthAPI(request).login();
        AuthHeader.setToken(login.responseBody.accessToken);
    }
});

test("TC_PRODUCT_001 - Create Product (Happy Path) @smoke @regression", async ({ productApi }, testInfo) => {

    // Calling Create Product API with valid payload
    const result = await productApi.createProduct(createProductPayload);

    let verdict: "PASS" | "FAIL" = "PASS";

    try {

        // ================================
        // 1. HTTP Status Validation
        // ================================
        expect(result.actualStatus).toBe(201);

        // ================================
        // 2. Response Schema Validation
        // ================================
        JsonValidator.validate(productSchema, result.responseBody);

        // ================================
        // 3. Data Type Validation
        // ================================
        expect(typeof result.responseBody.id).toBe("number");
        expect(typeof result.responseBody.title).toBe("string");
        expect(typeof result.responseBody.price).toBe("number");

        // ================================
        // 4. Business Rule Validation
        // ================================
        expect(result.responseBody.title).toBe(createProductPayload.title);
        expect(result.responseBody.price).toBe(createProductPayload.price);

        // ================================
        // 5. Header Validation
        // ================================
        expect(result.responseBody).toHaveProperty("id");

        // ================================
        // 6. Response Time Validation
        // ================================
        expect(result.responseTime).toBeLessThan(1000);

    } catch (e) {
        verdict = "FAIL";
        throw e;
    }

    finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_001 - Create Product (Happy Path)",
            description: "Verify Product Creation",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 201,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });
    }
});

test("TC_PRODUCT_002 - Verify Required Fields @smoke @regression", async ({ productApi }, testInfo) => {

    // Removing mandatory field Title
    const payload = createProductPayloadWith({
        title: undefined as any
    });

    const result = await productApi.createProduct(payload);

    let verdict: "PASS" | "FAIL" = "PASS";

    try {

        // DummyJSON still returns 201
        expect(result.actualStatus).toBe(201);

        // Verify title is actually missing
        expect(result.responseBody.title).toBeUndefined();

    } catch (e) {

        verdict = "FAIL";
        throw e;

    } finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_002 - Verify Required Fields",
            description: "Verify Mandatory Field Validation",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 201,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });

    }

});

test("TC_PRODUCT_003 - Verify Response Headers @regression", async ({ productApi }, testInfo) => {

    const result = await productApi.createProduct(createProductPayload);

    expect(result.actualStatus).toBe(201);

    // Verify Content-Type Header
    expect(result.responseHeaders["content-type"]).toContain("application/json");
    
    let verdict: "PASS" | "FAIL" = "PASS";

    try {

        // DummyJSON still returns 201
        expect(result.actualStatus).toBe(201);

        // Verify title is actually missing
        expect(result.responseBody.title).toBeUndefined();

    } catch (e) {

        verdict = "FAIL";
        throw e;

    } finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_003 - Verify Response Headers",
            description: "Verify Response Headers",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 201,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });

    }

});


test("TC_PRODUCT_004 - Verify Business Rules @regression", async ({ productApi }, testInfo) => {

    const result = await productApi.createProduct(createProductPayload);

    let verdict: "PASS" | "FAIL" = "PASS";

    try {

        // DummyJSON still returns 201
        expect(result.actualStatus).toBe(201);

        // Verify title is actually missing
        expect(result.responseBody.title).toBeUndefined();

       // Verify created product matches request

       expect(result.responseBody.price)
        .toEqual(createProductPayload.price);

       expect(result.responseBody.brand)
        .toEqual(createProductPayload.brand);

    } catch (e) {

        verdict = "FAIL";
        throw e;

    } finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_004 - Verify Business Rules",
            description: "Verify Business Rules",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 201,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });

    }

});


test("TC_PRODUCT_005 - Verify Null Values @regression", async ({ productApi }, testInfo) => {

    const payload = createProductPayloadWith({

        brand: null as any

    });

    const result = await productApi.createProduct(payload);

    let verdict: "PASS" | "FAIL" = "PASS";

    try {

        // DummyJSON still returns 201
        expect(result.actualStatus).toBe(201);

        // Verify title is actually missing
        expect(result.responseBody.title).toBeUndefined();
        
        expect(result.responseBody.brand).toBeNull();

    } catch (e) {

        verdict = "FAIL";
        throw e;

    } finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_005 - Verify Null Values",
            description: "Verify Null Values",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 201,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });

    }

});


//Negative
test("TC_PRODUCT_006 - Invalid Endpoint @regression", async ({ productApi }, testInfo) => {

    const result = await productApi.invalidEndpoint();

    let verdict: "PASS" | "FAIL" = "PASS";

    try {

        // Status Code Validation
        expect(result.actualStatus).toBe(404);

        // Error Contract Validation
        expect(result.responseBody).toHaveProperty("message");
        expect(result.responseBody).toHaveProperty("status");

    } catch (e) {

        verdict = "FAIL";
        throw e;

    } finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_006 - Invalid Endpoint",
            description: "Verify Invalid Endpoint",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 404,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });

    }

});


test("TC_PRODUCT_007 - Verify Invalid Response Schema @regression", async ({ productApi }, testInfo) => {

    const result = await productApi.createProduct(createProductPayload);

    // Intentionally remove a required field
    delete result.responseBody.id;

 let verdict: "PASS" | "FAIL" = "PASS";

try {

        // DummyJSON still returns 404        
        expect(result.actualStatus).toBe(404);
        
        // Verify Body message
                expect(() => {
        JsonValidator.validate(productSchema, result.responseBody);
    }).toThrow();     
    

    } catch (e) {

        verdict = "FAIL";
        throw e;

    } finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_007 - Verify Invalid Response Schema",
            description: "Verify Invalid Response Schema",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 201,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });

    }

});

test("TC_PRODUCT_008 - Verify Invalid Data Types @regression", async ({ productApi }, testInfo) => {

    const result = await productApi.createProduct(createProductPayload);

    // Simulate incorrect datatype
    result.responseBody.price = "1500";

    expect(typeof result.responseBody.price).not.toBe("number");
let verdict: "PASS" | "FAIL" = "PASS";
 
try {

        // DummyJSON still returns 404        
        expect(result.actualStatus).toBe(404);
        
        // Verify Body message
                expect(() => {
        JsonValidator.validate(productSchema, result.responseBody);
    }).toThrow();     
    

    } catch (e) {

        verdict = "FAIL";
        throw e;

    } finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_008 - Verify Invalid Data Types",
            description: "Verify Invalid Data Types",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 201,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });

    }

});

test("TC_PRODUCT_009 - Verify Missing Required Response Field @regression", async ({ productApi}, testInfo ) => {

    const result = await productApi.createProduct(createProductPayload);

    delete result.responseBody.title;

let verdict: "PASS" | "FAIL" = "PASS";
 
try {

        // DummyJSON still returns 404        
        expect(result.actualStatus).toBe(404);   
        expect(result.responseBody.title).toBeUndefined();
        
        // Verify Body message
                expect(() => {
        JsonValidator.validate(productSchema, result.responseBody);
    }).toThrow();     
    

    } catch (e) {

        verdict = "FAIL";
        throw e;

    } finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_009 - Verify Missing Required Response Field",
            description: "Verify Missing Required Response Field",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 201,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });

    }

});


test("TC_PRODUCT_010 - Verify Incorrect Response Header @regression", async ({ productApi }, testInfo) => {

    const result = await productApi.createProduct(createProductPayload);

    let verdict: "PASS" | "FAIL" = "PASS";
 
try {

        // DummyJSON still returns 404        
        expect(result.actualStatus).toBe(404);       
        
        expect(result.responseHeaders["content-type"])
        .not.toContain("text/html");    

    } catch (e) {

        verdict = "FAIL";
        throw e;

    } finally {

        ReportManager.addResult({
            module: ReportManager.getModuleName(testInfo),
            testCaseId: "TC_PRODUCT_010 - Verify Incorrect Response Header",
            description: "Verify Incorrect Response Header",
            result: verdict,
            apiResult: {
                method: result.method,
                url: result.endpoint,
                curl: result.curl,
                requestBody: result.requestBody,
                responseBody: result.responseBody,
                expectedStatus: 201,
                actualStatus: result.actualStatus,
                responseTime: result.responseTime
            }
        });

    }

});
