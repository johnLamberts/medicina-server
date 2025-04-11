"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMedicineValidation = void 0;
const utils_1 = require("@/utils");
const medicine_schema_1 = __importDefault(require("./medicine.schema"));
const addMedicineValidation = async (req, res, next) => await (0, utils_1.validator)(medicine_schema_1.default, req.body, next);
exports.addMedicineValidation = addMedicineValidation;
//# sourceMappingURL=medicine.validation.js.map