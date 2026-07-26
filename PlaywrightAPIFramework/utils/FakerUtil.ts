import { faker } from "@faker-js/faker";

export class FakerUtil {

    static productTitle() {
        return faker.commerce.productName();
    }

    static customerId() {
        return `C${faker.string.numeric(6)}`;
    }

    static orderId() {
        return faker.string.alphanumeric(10).toUpperCase();
    }

    static quantity() {
        return faker.number.int({
            min: 1,
            max: 500
        });
    }

    static price() {
        return faker.number.int({
            min: 100,
            max: 5000
        });
    }

    static pricingDate() {
        return faker.date.future().toISOString().split("T")[0];
    }

    static currency() {
        return faker.helpers.arrayElement([
            "USD",
            "CAD",
            "EUR",
            "INR"
        ]);
    }

    static uuid() {
        return faker.string.uuid();
    }

    static email() {
        return faker.internet.email();
    }
}