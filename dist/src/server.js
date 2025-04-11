"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
require('dotenv').config();
require('module-alias/register');
const app_1 = __importDefault(require("@/app"));
const config_1 = require("@/config");
const startServer = () => {
    try {
        const PORT = parseInt(`${config_1.environmentConfig.PORT}`, 10) || 8667;
        app_1.default.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`.bg_green.green);
        });
    }
    catch (err) {
        console.error(`[startUpServer]: ${err}`);
        process.exit(1);
    }
};
exports.startServer = startServer;
(0, exports.startServer)();
exports.default = app_1.default;
//# sourceMappingURL=server.js.map