import { BaseAPI } from "./BaseAPI";
import { CommonHeader } from "../headers/commonHeader";
import { AuthHeader } from "../headers/authHeader";

export class ProductAPI extends BaseAPI {
    private authedHeaders(): Record<string, string> {
        return { ...CommonHeader.build(), ...AuthHeader.build() };
    }

    getAllProducts() {
        return this.get("/products", CommonHeader.build());
    }

    getProductById(id: number | string) {
        return this.get(`/products/${id}`, CommonHeader.build());
    }

    createProduct(payload: any) {
        return this.post("/products/add", payload, this.authedHeaders());
    }

    updateProduct(id: number | string, payload: any) {
        return this.put(`/products/${id}`, payload, this.authedHeaders());
    }

    deleteProduct(id: number | string) {
        return this.delete(`/products/${id}`, this.authedHeaders());
    }

    invalidEndpoint() {
        return this.delete(`/products/invalid`, this.authedHeaders());
    }
}
