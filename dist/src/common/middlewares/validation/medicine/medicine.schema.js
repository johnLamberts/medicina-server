"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMedicineSchema = void 0;
const z = __importStar(require("zod"));
exports.addMedicineSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    unitPrice: z.preprocess((val) => {
        if (typeof val === 'string') {
            return parseFloat(val);
        }
        return val;
    }, z.number().min(0, 'Unit price must be non-negative')),
    stockQuantity: z.preprocess((val) => {
        if (typeof val === 'string') {
            return parseInt(val, 10);
        }
        return val;
    }, z.number().int().min(0, 'Stock quantity must be non-negative')),
    brandName: z.string().optional(),
    genericName: z.string().optional(),
    prescriptionRequired: z.preprocess((val) => {
        if (typeof val === 'string') {
            return val.toLowerCase() === 'true';
        }
        return val;
    }, z.boolean().optional()),
    dosageForm: z.string().optional(),
    strength: z.string().optional(),
    isActive: z.preprocess((val) => {
        if (typeof val === 'string') {
            return val.toLowerCase() === 'true';
        }
        return val;
    }, z.boolean().optional()),
    medicineImageFile: z.any().optional(),
});
exports.default = exports.addMedicineSchema;
//# sourceMappingURL=medicine.schema.js.map