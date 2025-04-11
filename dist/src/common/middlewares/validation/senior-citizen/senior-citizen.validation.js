"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSeniorCitizenValidation = void 0;
const utils_1 = require("@/utils");
const senior_schema_1 = require("./senior.schema");
const addSeniorCitizenValidation = async (req, res, next) => {
    try {
        await (0, utils_1.validator)(senior_schema_1.addSeniorSchema, req.body, next);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.addSeniorCitizenValidation = addSeniorCitizenValidation;
//# sourceMappingURL=senior-citizen.validation.js.map