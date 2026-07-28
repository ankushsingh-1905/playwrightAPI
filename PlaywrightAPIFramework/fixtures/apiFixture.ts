// Import Playwright's base test and expect.
import { test as base, expect } from "@playwright/test";

// Import all API classes.
import { AuthAPI } from "../api/AuthAPI";
import { ProductAPI } from "../api/ProductAPI";
import { UserAPI } from "../api/UserAPI";

// Define the custom fixtures available in every test.
type ApiFixtures = {

    // Authentication API fixture
    authApi: AuthAPI;

    // Product API fixture
    productApi: ProductAPI;

    // User API fixture
    userApi: UserAPI;

};

// Extend Playwright's default test object
// by adding custom API fixtures.
export const test = base.extend<ApiFixtures>({

    /**
     * Creates an AuthAPI object.
     *
     * This object becomes available as:
     * { authApi }
     * inside every test.
     */
    authApi: async ({ request }, use) => {

        await use(new AuthAPI(request));

    },

    /**
     * Creates a ProductAPI object.
     *
     * This object becomes available as:
     * { productApi }
     */
    productApi: async ({ request }, use) => {

        await use(new ProductAPI(request));

    },

    /**
     * Creates a UserAPI object.
     *
     * This object becomes available as:
     * { userApi }
     */
    userApi: async ({ request }, use) => {

        await use(new UserAPI(request));

    },

});

// Export expect so all test files
// can import both test and expect
// from the same fixture file.
export { expect };