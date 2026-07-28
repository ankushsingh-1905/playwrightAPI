/**
 * Schema Interface
 *
 * Purpose:
 * Defines the structure of a JSON Schema.
 *
 * Why?
 * Every API response can have a different schema.
 * This interface tells the validator:
 * - Which fields are mandatory.
 * - What data type each field should have.
 */
export interface Schema {

    /**
     * List of mandatory fields.
     *
     * Example:
     * ["id", "title", "price"]
     */
    required: string[];

    /**
     * Expected data type for each field.
     *
     * Example:
     * {
     *    id: "number",
     *    title: "string"
     * }
     */
    types?: Record<
        string,
        "string" | "number" | "boolean" | "object"
    >;
}

/**
 * JsonValidator
 *
 * Purpose:
 * Validates an API response against a schema.
 *
 * Why?
 * Sometimes an API returns HTTP 200 or 201,
 * but the response body is incorrect.
 *
 * This utility checks:
 * ✔ Required fields exist
 * ✔ Data types are correct
 *
 * If validation fails,
 * it throws an exception and the test fails.
 */
export const JsonValidator = {

    /**
     * validate()
     *
     * Purpose:
     * Compare the API response with the expected schema.
     *
     * Input:
     * - Expected Schema
     * - Actual API Response
     */
    validate(schema: Schema, data: any): void {

        /**
         * Step 1
         * Verify the response is an object.
         *
         * Example:
         * ✔ { id:1 }
         * ✘ null
         * ✘ "Success"
         */
        if (data === null || typeof data !== "object") {

            throw new Error(
                `JsonValidator: expected an object, got ${typeof data}`
            );

        }

        /**
         * Step 2
         * Check whether all required fields exist.
         *
         * Example:
         * Required:
         * id, title, price
         *
         * If "price" is missing,
         * validation will fail.
         */
        const missing = schema.required.filter(

            (key) => !(key in data)

        );

        if (missing.length > 0) {

            throw new Error(

                `JsonValidator: missing required field(s): ${missing.join(", ")}`

            );

        }

        /**
         * Step 3
         * Verify data types.
         *
         * Example:
         * id should be number
         * title should be string
         *
         * If types do not match,
         * validation fails.
         */
        if (schema.types) {

            const mismatches: string[] = [];

            for (const [key, expectedType] of Object.entries(schema.types)) {

                if (

                    key in data &&
                    typeof data[key] !== expectedType

                ) {

                    mismatches.push(

                        `${key} (expected ${expectedType}, got ${typeof data[key]})`

                    );

                }

            }

            /**
             * If one or more fields
             * have incorrect data types,
             * throw an error.
             */
            if (mismatches.length > 0) {

                throw new Error(

                    `JsonValidator: type mismatch on: ${mismatches.join(", ")}`

                );

            }

        }

    },

};