export const loginPayload = {
    username: "emilys",
    password: "emilyspass",
    expiresInMins: 30,
};

/** Returns a copy of the base payload with fields overridden — for negative test cases. */
export function loginPayloadWith(overrides: Partial<typeof loginPayload>) {
    return { ...loginPayload, ...overrides };
}
