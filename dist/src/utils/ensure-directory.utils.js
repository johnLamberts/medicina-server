"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDirectoryExists = void 0;
const fs_1 = __importDefault(require("fs"));
const ensureDirectoryExists = (filePath) => {
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.mkdirSync(filePath, { recursive: true });
    }
};
exports.ensureDirectoryExists = ensureDirectoryExists;
exports.default = exports.ensureDirectoryExists;
//# sourceMappingURL=ensure-directory.utils.js.map