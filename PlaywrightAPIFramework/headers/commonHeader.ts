/**
 * Headers every request needs, regardless of auth state.
 * Kept as a function (not a plain object) so callers always get a fresh copy —
 * mutating a shared object across requests is a classic source of flaky tests.
 */
export const CommonHeader = {
    build(): Record<string, string> {
        return {
            "Content-Type": "application/json",
        };
    },
};
