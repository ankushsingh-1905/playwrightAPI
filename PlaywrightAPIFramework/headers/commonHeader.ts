/**
 * CommonHeader is used to build headers
 * that are required for most API requests.
 *
 * Instead of writing the same headers
 * in every API, we keep them here.
 */
export const CommonHeader = {

    /**
     * Returns common request headers.
     *
     * Currently it returns:
     * Content-Type: application/json
     */
    build(): Record<string, string> {

        return {

            // Tells the server that
            // the request body is in JSON format.
            "Content-Type": "application/json",

        };

    },

};