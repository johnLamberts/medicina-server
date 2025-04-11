"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __importDefault(require("@/common/middlewares/file-upload/storage"));
const constants_1 = require("@/constants");
const utils_1 = require("@/utils");
const seniior_citizen_service_1 = require("./seniior-citizen.service");
class SeniorCitizenController {
    seniorCitizenService;
    constructor() {
        this.seniorCitizenService = new seniior_citizen_service_1.SeniorCitizenService();
    }
    getSeniorCitizensHandler = async (_req, res) => {
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
                responseObject.seniorCitizens = results?.map((user) => {
                    return {
                        ...user,
                        request: {
                            type: 'GET',
                            description: 'Get one user with the ID',
                            url: `http://localhost:5370/api/v1/senior/${user.id}`
                        }
                    };
                });
                const success = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, responseObject, "Successfully found students");
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
    addSeniorCitizenHandler = async (req, res, next) => {
        try {
            let storageRefUrl = '';
            if (req.file?.filename) {
                const localFilePath = `${process.env.PWD}/public/uploads/sb_users/${req.file?.filename}`;
                const destination = `sb_users/${req.file.filename}`;
                storageRefUrl = await (0, storage_1.default)(localFilePath, destination);
            }
            const userData = {
                ...req.body,
                profileImg: storageRefUrl
            };
            console.log(userData);
            const data = await this.seniorCitizenService.addSeniorCitizen(userData);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `Student has been added.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[AddSeniorCitizenControllerError]: ${err}`);
            next(err);
        }
    };
    async updateSeniorCitizenHandler(req, res, next) {
        try {
            const updatedData = await this.seniorCitizenService.updateSeniorCitizen(req.params.id, req.body);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, updatedData, "Senior citizen updated successfully");
            return res.status(response.statusCode).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteSeniorCitizenHandler(req, res, next) {
        try {
            await this.seniorCitizenService.deleteSeniorCitizen(req.params.id);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, null, "Senior citizen deleted successfully");
            return res.status(response.statusCode).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = SeniorCitizenController;
//# sourceMappingURL=senior-citizen.controllers.js.map