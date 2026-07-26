import { Schema } from "../utils/JsonValidator";

export const loginSchema: Schema = {
    required: ["id", "username", "email", "firstName", "lastName", "accessToken", "refreshToken"],
    types: {
        id: "number",
        username: "string",
        email: "string",
        accessToken: "string",
        refreshToken: "string",
    },
};
