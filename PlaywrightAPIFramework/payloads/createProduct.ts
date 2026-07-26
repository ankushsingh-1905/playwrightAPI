export const createProductPayload = {
    title: "iPhone 17",
    description: "Apple Mobile",
    price: 1500,
    brand: "Apple",
    category: "smartphones",
};

export function createProductPayloadWith(overrides: Partial<typeof createProductPayload>) {
    return { ...createProductPayload, ...overrides };
}
