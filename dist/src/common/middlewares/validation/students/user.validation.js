"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserValidation = void 0;
const utils_1 = require("@/utils");
const user_schema_1 = require("./user.schema");
const addUserValidation = async (req, res, next) => await (0, utils_1.validator)(user_schema_1.addUserSchema, req.body, next);
exports.addUserValidation = addUserValidation;
//# sourceMappingURL=user.validation.js.map