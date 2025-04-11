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
exports.addUserPharmacy = void 0;
const z = __importStar(require("zod"));
const fileSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine(mime => ['image/jpeg', 'image/png', 'image/webp'].includes(mime), {
        message: 'File must be a valid image (jpeg, png, or webp)'
    }),
    size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
    buffer: z.instanceof(Buffer)
}).optional();
exports.addUserPharmacy = z.object({
    name: z.string().min(1).max(100).trim(),
    address: z.string().min(5).max(200).trim(),
    pharmacyImg: z.any().optional(),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').max(15, 'Phone number must be 15 characters or less'),
    email: z.string().email(),
    operatingHours: z.string().min(1).max(100).optional(),
    is24Hours: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional()),
});
exports.default = exports.addUserPharmacy;
//# sourceMappingURL=phamarcy.schema.js.map