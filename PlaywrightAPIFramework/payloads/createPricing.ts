export const createPricingPayload = {
    pricingDate: "2026-01-01",
    customerId: "C050424",
    currency: "CAD",
    orderId: "test1234",
    // auditQuoteId: "0Q0cY000002PLZZSA4",

    lineItems: [
        {
            lineRefNumber: 17,
            sublineRefNumber: 28,
            productId: "XD2292NGE0",
            priceAgreementId: "S8453433",
            quantity: 66,
            // auditQuoteLineId: "0QLcY0000025ICtWAM"
        },
        {
            lineRefNumber: 29,
            sublineRefNumber: 17,
            productId: "F0W50016008P00M",
            priceAgreementId: "S8453433",
            quantity: 77,
            // auditQuoteLineId: "0QLcY0000025ICsWAM"
        },
        {
            lineRefNumber: 31,
            sublineRefNumber: 19,
            productId: "F0W50016008P00M",
            priceAgreementId: "S8453433",
            quantity: 100,
            // auditQuoteLineId: "0QLcY0000025j8DWAQ"
        }
    ]
};

export function createPricingPayloadWith(
    overrides: Partial<typeof createPricingPayload>
) {
    return {
        ...createPricingPayload,
        ...overrides
    };
}