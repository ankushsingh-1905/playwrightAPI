import { test as base, expect } from "@playwright/test";
import { AuthAPI } from "../api/AuthAPI";
import { ProductAPI } from "../api/ProductAPI";
import { UserAPI } from "../api/UserAPI";
import { request } from "@playwright/test";
import { ENV } from "../config/env";

type ApiFixtures = {
    authApi: AuthAPI;
    productApi: ProductAPI;
    userApi: UserAPI;
};

export const test = base.extend<ApiFixtures>({
    authApi: async ({ request }, use) => {
        await use(new AuthAPI(request));
    },

    productApi: async ({ request }, use) => {
        await use(new ProductAPI(request));
    },

    userApi: async ({ request }, use) => {
        await use(new UserAPI(request));
    },


});

export { expect };
