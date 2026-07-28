import { BaseAPI } from "./BaseAPI";              // Base class containing common GET, POST, PUT, DELETE methods.
import { CommonHeader } from "../headers/commonHeader"; // Common headers like Content-Type and Accept.
import { AuthHeader } from "../headers/authHeader";     // Authorization header containing Bearer Token.

/**
 * ProductAPI contains all Product related API methods.
 *
 * It extends BaseAPI so it can directly use
 * GET
 * POST
 * PUT
 * DELETE
 * methods without writing request logic again.
 */
export class ProductAPI extends BaseAPI {

    /**
     * Creates headers required for authenticated Product APIs.
     *
     * Combines:
     * - Common Headers
     * - Authorization Header
     *
     * Final Headers:
     * Content-Type
     * Accept
     * Authorization : Bearer <token>
     */
    private authedHeaders(): Record<string, string> {

        return {
            ...CommonHeader.build(),
            ...AuthHeader.build()
        };

    }

    /**
     * Get All Products
     *
     * Endpoint:
     * GET /products
     *
     * No Authentication Required.
     */
    getAllProducts() {

        return this.get(
            "/products",
            CommonHeader.build()
        );

    }

    /**
     * Get Product by ID
     *
     * Example:
     * GET /products/1
     *
     * Dynamic Product ID is passed.
     */
    getProductById(id: number | string) {

        return this.get(
            `/products/${id}`,
            CommonHeader.build()
        );

    }

    /**
     * Create New Product
     *
     * Endpoint:
     * POST /products/add
     *
     * Uses authenticated headers.
     */
    createProduct(payload: any) {

        return this.post(
            "/products/add",
            payload,
            this.authedHeaders()
        );

    }

    /**
     * Update Existing Product
     *
     * Endpoint:
     * PUT /products/{id}
     *
     * Product ID is dynamic.
     */
    updateProduct(
        id: number | string,
        payload: any
    ) {

        return this.put(
            `/products/${id}`,
            payload,
            this.authedHeaders()
        );

    }

    /**
     * Delete Product
     *
     * Endpoint:
     * DELETE /products/{id}
     */
    deleteProduct(id: number | string) {

        return this.delete(
            `/products/${id}`,
            this.authedHeaders()
        );

    }

    /**
     * Invalid Endpoint
     *
     * Used for Negative Testing.
     *
     * Expected:
     * 404 Not Found
     */
    invalidEndpoint() {

        return this.delete(
            "/products/invalid",
            this.authedHeaders()
        );

    }

}