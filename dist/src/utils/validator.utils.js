"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = validator;
const http_errors_1 = __importDefault(require("http-errors"));
async function validator(schemaName, body, next) {
    try {
        const { error } = schemaName.safeParse(body);
        console.log(body);
        error ? next((0, http_errors_1.default)(422, error.errors[0].message)) : next();
    }
    catch (error) {
        console.log(`[ValidationMiddlewareError]: ${error}`);
    }
}
//# sourceMappingURL=validator.utils.js.map