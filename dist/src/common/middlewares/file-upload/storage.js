"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const config_1 = require("@/config");
const uploadFile = async (localFilePath, destination) => {
    await config_1.bucket.upload(localFilePath, {
        destination,
    });
    const fileRef = config_1.bucket.file(destination);
    const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-17-2025',
    });
    return url;
};
exports.uploadFile = uploadFile;
exports.default = exports.uploadFile;
//# sourceMappingURL=storage.js.map