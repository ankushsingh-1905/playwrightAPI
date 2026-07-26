/**
 * A deliberately minimal schema validator — no external dependency (like ajv)
 * needed. Good enough for a POC: checks required fields exist and, optionally,
 * that they're the right JS typeof.
 *
 * Usage:
 *   export const loginSchema: Schema = {
 *     required: ["id", "username", "accessToken"],
 *     types: { id: "number", username: "string", accessToken: "string" },
 *   };
 *   JsonValidator.validate(loginSchema, responseBody);  // throws if invalid
 */
export interface Schema {
    required: string[];
    types?: Record<string, "string" | "number" | "boolean" | "object">;
}

export const JsonValidator = {
    validate(schema: Schema, data: any): void {
        if (data === null || typeof data !== "object") {
            throw new Error(`JsonValidator: expected an object, got ${typeof data}`);
        }

        const missing = schema.required.filter((key) => !(key in data));
        if (missing.length > 0) {
            throw new Error(`JsonValidator: missing required field(s): ${missing.join(", ")}`);
        }

        if (schema.types) {
            const mismatches: string[] = [];
            for (const [key, expectedType] of Object.entries(schema.types)) {
                if (key in data && typeof data[key] !== expectedType) {
                    mismatches.push(`${key} (expected ${expectedType}, got ${typeof data[key]})`);
                }
            }
            if (mismatches.length > 0) {
                throw new Error(`JsonValidator: type mismatch on: ${mismatches.join(", ")}`);
            }
        }
    },
};
