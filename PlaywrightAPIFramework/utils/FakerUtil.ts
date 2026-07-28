import { faker } from "@faker-js/faker";

/**
 * FakerUtil
 *
 * Purpose:
 * This utility class generates random test data.
 *
 * Why?
 * - Avoid hardcoded values.
 * - Every test can run with fresh data.
 * - Reduces duplicate data issues.
 * - Makes Data Driven Testing easier.
 */
export class FakerUtil {

    /**
     * Generates a random product name.
     *
     * Example:
     * "Practical Wooden Chair"
     *
     * Used for:
     * Product creation APIs.
     */
    static productTitle() {
        return faker.commerce.productName();
    }

    /**
     * Generates a random Customer ID.
     *
     * Example:
     * C458921
     *
     * Used whenever a unique customer id is required.
     */
    static customerId() {
        return `C${faker.string.numeric(6)}`;
    }

    /**
     * Generates a random Order ID.
     *
     * Example:
     * AB12CD34EF
     *
     * Used for order related APIs.
     */
    static orderId() {
        return faker.string.alphanumeric(10).toUpperCase();
    }

    /**
     * Generates a random quantity.
     *
     * Range:
     * 1 to 500
     *
     * Used in product or inventory APIs.
     */
    static quantity() {
        return faker.number.int({
            min: 1,
            max: 500
        });
    }

    /**
     * Generates a random price.
     *
     * Range:
     * 100 to 5000
     *
     * Used whenever product pricing is required.
     */
    static price() {
        return faker.number.int({
            min: 100,
            max: 5000
        });
    }

    /**
     * Generates a future pricing date.
     *
     * Example:
     * 2026-12-20
     *
     * Useful for pricing or scheduling APIs.
     */
    static pricingDate() {
        return faker.date.future().toISOString().split("T")[0];
    }

    /**
     * Returns a random currency.
     *
     * Possible Values:
     * USD
     * CAD
     * EUR
     * INR
     */
    static currency() {
        return faker.helpers.arrayElement([
            "USD",
            "CAD",
            "EUR",
            "INR"
        ]);
    }

    /**
     * Generates a random UUID.
     *
     * Example:
     * 123e4567-e89b-12d3-a456-426614174000
     *
     * Useful for unique identifiers.
     */
    static uuid() {
        return faker.string.uuid();
    }

    /**
     * Generates a random email address.
     *
     * Example:
     * john123@gmail.com
     *
     * Used for user registration APIs.
     */
    static email() {
        return faker.internet.email();
    }

    /**
     * Generates a random product price.
     *
     * Range:
     * 100 to 1000
     *
     * Used in Product Create API
     * for dynamic pricing during testing.
     */
    static getRandomPrice(): number {
        return Number(
            faker.commerce.price({
                min: 100,
                max: 1000
            })
        );
    }

    /**
     * Generates a product name using
     * three random words.
     *
     * Example:
     * "Beautiful Smart Laptop"
     *
     * Used for Data Driven Testing
     * to make every execution unique.
     */
    static getThreeWordProductName(): string {

        return `${faker.word.adjective()} ${faker.word.adjective()} ${faker.word.noun()}`;

    }

}