import { BaseAPI } from "./BaseAPI";
import { CommonHeader } from "../headers/commonHeader";

export class UserAPI extends BaseAPI {
    getAllUsers() {
        return this.get("/users", CommonHeader.build());
    }

    getUserById(id: number | string) {
        return this.get(`/users/${id}`, CommonHeader.build());
    }
}
