"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPhamarcyValidation = void 0;
const utils_1 = require("@/utils");
const phamarcy_schema_1 = __importDefault(require("./phamarcy.schema"));
const addPhamarcyValidation = async (req, res, next) => await (0, utils_1.validator)(phamarcy_schema_1.default, req.body, next);
exports.addPhamarcyValidation = addPhamarcyValidation;
//# sourceMappingURL=phamarcy.validation.js.map