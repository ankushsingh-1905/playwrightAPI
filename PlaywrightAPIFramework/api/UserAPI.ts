import { BaseAPI } from "./BaseAPI"; // Base class that contains all common HTTP methods like GET, POST, PUT, DELETE.
import { CommonHeader } from "../headers/commonHeader"; // Common headers used for all User APIs.

export class UserAPI extends BaseAPI {

    /**
     * Get all users.
     *
     * Endpoint:
     * GET /users
     *
     * Uses common headers and BaseAPI GET method.
     */
    getAllUsers() {
        return this.get("/users", CommonHeader.build());
    }

    /**
     * Get a user by ID.
     *
     * Endpoint:
     * GET /users/{id}
     *
     * The user ID is passed dynamically.
     *
     * Example:
     * getUserById(5)
     * Endpoint becomes:
     * GET /users/5
     */
    getUserById(id: number | string) {
        return this.get(`/users/${id}`, CommonHeader.build());
    }
}