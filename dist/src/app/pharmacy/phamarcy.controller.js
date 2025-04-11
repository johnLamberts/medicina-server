"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyController = void 0;
const file_upload_1 = require("@/common/middlewares/file-upload");
const constants_1 = require("@/constants");
const utils_1 = require("@/utils");
const random_avatar_utils_1 = __importDefault(require("@/utils/random-avatar.utils"));
const phamarcy_service_1 = __importDefault(require("./phamarcy.service"));
class PharmacyController {
    phamarcyService;
    constructor() {
        this.phamarcyService = new phamarcy_service_1.default();
    }
    addPhamarcyHandler = async (req, res, next) => {
        try {
            let storageRefUrl = '';
            if (req.file?.filename) {
                const localFilePath = `${process.env.PWD}/public/uploads/pharmacy/${req.file?.filename}`;
                const destination = `phamarcy/${req.file.filename}`;
                storageRefUrl = await (0, file_upload_1.uploadFile)(localFilePath, destination);
                (0, utils_1.deleteFile)(localFilePath);
            }
            else {
                storageRefUrl = (0, random_avatar_utils_1.default)();
            }
            const userData = {
                ...req.body,
                pharmacyImg: storageRefUrl
            };
            const data = await this.phamarcyService.createPharmacy(userData);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `Phamarcy has been added.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[AddPhamarcyControllerError]: ${err}`);
            next(err);
        }
    };
    getPharmaciesHandler = async (_req, res) => {
        try {
            if (res.paginatedResults) {
                const { results, next, previous, currentPage, totalDocs, totalPages, lastPage } = res.paginatedResults;
                const responseObject = {
                    totalDocs: totalDocs || 0,
                    totalPages: totalPages || 0,
                    lastPage: lastPage || 0,
                    count: results?.length || 0,
                    currentPage: currentPage || 0,
                };
                if (next) {
                    responseObject.nextPage = next;
                }
                if (previous) {
                    responseObject.prevPage = previous;
                }
                responseObject.pharmacies = results?.map((user) => {
                    return {
                        ...user,
                        request: {
                            type: 'GET',
                            description: 'Get one phamarcy with the ID',
                            url: `http://localhost:8080/api/v1/phamarcy/${user.pharmacyId}`
                        }
                    };
                });
                const success = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, responseObject, "Successfully found pharmacies");
                return res.status(success.statusCode).json(success);
            }
            else {
                const error = (0, utils_1.customReponse)().error(404, new Error('No students found.'), "No students found");
                return res.status(error.statusCode).json(error);
            }
        }
        catch (error) {
            return res.status(500).send((0, utils_1.customReponse)().error(404, error, 'An error occurred while retrieving products'));
        }
    };
}
exports.PharmacyController = PharmacyController;
//# sourceMappingURL=phamarcy.controller.js.map