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
exports.addSeniorSchema = void 0;
const z = __importStar(require("zod"));
exports.addSeniorSchema = z.object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    middleName: z.string().optional(),
    email: z.string().email({
        message: "email must be valid"
    }),
    password: z.string().min(6, { message: "Password must be atleast 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be atleast 6 characters." }),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== undefined || confirmPassword !== null) {
        if (confirmPassword !== password)
            ctx.addIssue({
                code: "custom",
                message: "Passwords did not match",
                path: ["confirmPassword"]
            });
    }
});
//# sourceMappingURL=senior.schema.js.map