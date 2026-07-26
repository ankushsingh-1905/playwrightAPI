export const updateProductPayload = {
    title: "Samsung S25 Ultra",
    price: 1800,
    brand: "Samsung",
};

export function updateProductPayloadWith(overrides: Partial<typeof updateProductPayload>) {
    return { ...updateProductPayload, ...overrides };
}
