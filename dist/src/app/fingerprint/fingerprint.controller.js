"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintController = void 0;
const constants_1 = require("@/constants");
const utils_1 = require("@/utils");
const fingerprint_service_1 = require("./fingerprint.service");
class FingerprintController {
    fingerprintService;
    constructor() {
        this.fingerprintService = new fingerprint_service_1.FingerprintService();
    }
    registerFingerprintHandler = async (req, res, next) => {
        try {
            const { seniorId, templateData, fingerPosition, qualityScore } = req.body;
            console.log(req.body);
            if (!seniorId || !templateData) {
                const error = new Error('seniorId and templateData are required');
                const response = (0, utils_1.customReponse)().error(constants_1.HttpStatusCodes.BAD_REQUEST, error, `Error has been added.`);
                res.status(response.statusCode).json(response);
            }
            const success = await this.fingerprintService.registerFingerprint(seniorId, templateData, fingerPosition || 'right_thumb', qualityScore || 80);
            if (success) {
                const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.CREATED, { seniorId }, 'Fingerprint registered successfully');
                return res.status(response.statusCode).json(response);
            }
            else {
                const error = new Error('Failed to register fingerprint');
                return res.status(constants_1.HttpStatusCodes.BAD_REQUEST).json((0, utils_1.customReponse)().error(constants_1.HttpStatusCodes.BAD_REQUEST, error, error.message));
            }
        }
        catch (err) {
            console.error(`[RegisterFingerprintControllerError]: ${err}`);
            next(err);
        }
    };
    hasRegisteredFingerprintHandler = async (req, res, next) => {
        try {
            const { seniorId } = req.params;
            console.log(seniorId);
            if (!seniorId) {
                const error = new Error('seniorId is required');
                return res.status(constants_1.HttpStatusCodes.BAD_REQUEST).json((0, utils_1.customReponse)().error(constants_1.HttpStatusCodes.BAD_REQUEST, error, error.message));
            }
            const hasFingerprint = await this.fingerprintService.hasRegisteredFingerprint(seniorId);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, { hasFingerprint }, 'Fingerprint status retrieved successfully');
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.error(`[HasRegisteredFingerprintControllerError]: ${err}`);
            next(err);
        }
    };
    getActiveTemplatesHandler = async (req, res, next) => {
        try {
            const { seniorId } = req.params;
            if (!seniorId) {
                const error = new Error('seniorId is required');
                return res.status(constants_1.HttpStatusCodes.BAD_REQUEST).json((0, utils_1.customReponse)().error(constants_1.HttpStatusCodes.BAD_REQUEST, error, error.message));
            }
            const templates = await this.fingerprintService.getActiveTemplates(seniorId);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, { templates }, 'Active fingerprint templates retrieved successfully');
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.error(`[GetActiveTemplatesControllerError]: ${err}`);
            next(err);
        }
    };
    deleteFingerprintHandler = async (req, res, next) => {
        try {
            const { seniorId } = req.params;
            if (!seniorId) {
                const error = new Error('seniorId is required');
                return res.status(constants_1.HttpStatusCodes.BAD_REQUEST).json((0, utils_1.customReponse)().error(constants_1.HttpStatusCodes.BAD_REQUEST, error, error.message));
            }
            const success = await this.fingerprintService.deleteFingerprint(seniorId);
            if (success) {
                const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, { seniorId }, 'Fingerprint deleted successfully');
                return res.status(response.statusCode).json(response);
            }
            else {
                const error = new Error('Failed to delete fingerprint');
                return res.status(constants_1.HttpStatusCodes.BAD_REQUEST).json((0, utils_1.customReponse)().error(constants_1.HttpStatusCodes.BAD_REQUEST, error, error.message));
            }
        }
        catch (err) {
            console.error(`[DeleteFingerprintControllerError]: ${err}`);
            next(err);
        }
    };
}
exports.FingerprintController = FingerprintController;
//# sourceMappingURL=fingerprint.controller.js.map