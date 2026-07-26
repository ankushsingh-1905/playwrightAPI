import { Schema } from "../utils/JsonValidator";

export const productSchema: Schema = {
    required: ["id", "title", "price"],
    types: {
        id: "number",
        title: "string",
        price: "number",
    },
};
