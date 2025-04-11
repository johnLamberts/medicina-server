"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const constants_1 = require("@/constants");
const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res?.status(statusCode).send({
        data: null,
        statusCode: constants_1.HttpStatusCodes.INTERNAL_SERVER_ERROR,
        status: "[ServerError]: Internal Server Error.",
        message: error.message || "An unexpected error occured",
        stack: process.env.NODE_ENV === "production" ? "" : error.stack,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.errors.js.map