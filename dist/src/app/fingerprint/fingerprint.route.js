"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintRoute = void 0;
const express_1 = __importDefault(require("express"));
const fingerprint_controller_1 = require("./fingerprint.controller");
const router = express_1.default.Router();
const fingerprintController = new fingerprint_controller_1.FingerprintController();
router.post('/register', fingerprintController.registerFingerprintHandler);
router.post('/verify', fingerprintController.handleFingerprintVerification);
router.get('/has-registered/:seniorId', fingerprintController.hasRegisteredFingerprintHandler);
router.get('/templates/:seniorId', fingerprintController.getActiveTemplatesHandler);
exports.FingerprintRoute = router;
//# sourceMappingURL=fingerprint.route.js.map