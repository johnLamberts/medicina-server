"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customReponse = void 0;
const customReponse = () => {
    return {
        error: (statusCode, error, message, type) => ({
            statusCode, error: JSON.stringify(error), message, type
        }),
        success: (statusCode, data, message = "success") => ({
            statusCode, data, message
        })
    };
};
exports.customReponse = customReponse;
//# sourceMappingURL=response.utils.js.map