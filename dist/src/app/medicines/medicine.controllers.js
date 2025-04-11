"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_upload_1 = require("@/common/middlewares/file-upload");
const constants_1 = require("@/constants");
const utils_1 = require("@/utils");
const medicine_service_1 = __importDefault(require("./medicine.service"));
class MedicineController {
    medicineService;
    constructor() {
        this.medicineService = new medicine_service_1.default();
    }
    addMedicineHandler = async (req, res, next) => {
        try {
            const medicineData = req.body;
            console.log(medicineData);
            let medicineImageUrl = '';
            if (req.file?.filename) {
                const localFilePath = `${process.env.PWD}/public/uploads/others/${req.file.filename}`;
                const destination = `medicines/${req.file.filename}`;
                medicineImageUrl = await (0, file_upload_1.uploadFile)(localFilePath, destination);
                (0, utils_1.deleteFile)(localFilePath);
            }
            const medicine = {
                ...medicineData,
                medicineImageUrl,
                isActive: medicineData.isActive ?? true,
            };
            const createdMedicine = await this.medicineService.addMedicine(medicine);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.CREATED, createdMedicine, 'Medicine has been added successfully.');
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.error(`[AddMedicineControllerError]: ${err}`);
            next(err);
        }
    };
    getMedicinesHandler = async (_req, res) => {
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
                responseObject.medicines = results?.map((user) => {
                    return {
                        ...user,
                        request: {
                            type: 'GET',
                            description: 'Get one phamarcy with the ID',
                            url: `http://localhost:8080/api/v1/phamarcy/${user.medicineId}`
                        }
                    };
                });
                const success = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, responseObject, "Successfully found medicines");
                return res.status(success.statusCode).json(success);
            }
            else {
                const error = (0, utils_1.customReponse)().error(404, new Error('No medicine found.'), "No medicine found");
                return res.status(error.statusCode).json(error);
            }
        }
        catch (error) {
            return res.status(500).send((0, utils_1.customReponse)().error(404, error, 'An error occurred while retrieving medicine'));
        }
    };
    updateMedicineHandler = async (req, res, next) => {
        try {
            const medicineData = req.body;
            let medicineImageUrl = medicineData.medicineImageUrl;
            if (req.file?.filename) {
                const localFilePath = `${process.env.PWD}/public/uploads/others/${req.file.filename}`;
                const destination = `medicines/${req.file.filename}`;
                medicineImageUrl = await (0, file_upload_1.uploadFile)(localFilePath, destination);
                (0, utils_1.deleteFile)(localFilePath);
            }
            const medicine = {
                ...medicineData,
                medicineImageUrl,
            };
            const updatedMedicine = await this.medicineService.updateMedicine(medicine);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, updatedMedicine.data, 'Medicine has been updated successfully.');
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.error(`[UpdateMedicineControllerError]: ${err}`);
            next(err);
        }
    };
}
exports.default = MedicineController;
//# sourceMappingURL=medicine.controllers.js.map