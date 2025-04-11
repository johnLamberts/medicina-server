"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customMulterConfig = exports.uploadImage = exports.fileStorage = void 0;
const utils_1 = require("@/utils");
const crypto_1 = require("crypto");
const http_errors_1 = __importDefault(require("http-errors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.fileStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        const fileName = req.originalUrl.includes("pharmacy")
            ? "pharmacy"
            : "others";
        const uploadPath = path_1.default.resolve(process?.env?.PWD, "public/uploads", fileName);
        (0, utils_1.ensureDirectoryExists)(uploadPath);
        callback(null, uploadPath);
    },
    filename: (request, file, callback) => {
        if (process?.env?.NODE_ENV && process?.env?.NODE_ENV === "development") {
            console.log(file);
        }
        const imageExtension = (0, utils_1.getImageExtension)(file.mimetype);
        if (!imageExtension) {
            callback((0, http_errors_1.default)(422, "Invalid request (File type is not supported)"), "");
            return;
        }
        callback(null, `${file.fieldname}-${(0, crypto_1.randomUUID)()}${imageExtension}`);
    },
});
exports.uploadImage = (0, multer_1.default)({
    storage: exports.fileStorage,
    limits: {
        fileSize: 1024 * 1024 * 18,
    },
});
exports.customMulterConfig = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({}),
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    fileFilter: (request, file, callback) => {
        if (!(0, utils_1.getImageExtension)(file.mimetype)) {
            callback((0, http_errors_1.default)(422, "Invalid request (File type is not supported)"), false);
            return;
        }
        callback(null, true);
    },
});
exports.default = { uploadImage: exports.uploadImage };
//# sourceMappingURL=multer.js.map