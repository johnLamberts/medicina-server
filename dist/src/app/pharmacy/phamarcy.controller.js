"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyController = void 0;
const config_1 = require("@/config");
const constants_1 = require("@/constants");
const utils_1 = require("@/utils");
const base64_arraybuffer_1 = require("base64-arraybuffer");
const phamarcy_service_1 = __importDefault(require("./phamarcy.service"));
class PharmacyController {
    phamarcyService;
    constructor() {
        this.phamarcyService = new phamarcy_service_1.default();
    }
    addPhamarcyHandler = async (req, res, next) => {
        try {
            console.log(req.body.pharmacyImg);
            let storageRefUrl = '';
            if (req.body.pharmacyImg && req.body.pharmacyImg.startsWith('data:image/')) {
                const base64Image = req.body.pharmacyImg;
                const base64Data = base64Image.includes('base64,')
                    ? base64Image.split('base64,')[1]
                    : base64Image;
                const { data: imageData, error: uploadError } = await config_1.supabase.storage
                    .from('booklet-senior')
                    .upload(`phamarcy/${Date.now()}-cover.png`, (0, base64_arraybuffer_1.decode)(base64Data), {
                    contentType: 'image/png'
                });
                if (uploadError) {
                    throw new Error(`Error uploading image: ${uploadError.message}`);
                }
                const { data: urlData } = await config_1.supabase.storage
                    .from('booklet-senior')
                    .getPublicUrl(imageData.path);
                storageRefUrl = urlData.publicUrl;
            }
            console.log(storageRefUrl);
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
                            url: `http://localhost:8080/api/v1/phamarcy/${user.pharmacy_id}`
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
    updatePhamarcyHandler = async (req, res, next) => {
        try {
            console.log(req.body);
            let pharmacyImg = req.body.pharmacyImg;
            if (req.body.pharmacyImg && req.body.pharmacyImg.startsWith('data:image/')) {
                const base64Image = req.body.pharmacyImg;
                const base64Data = base64Image.includes('base64,')
                    ? base64Image.split('base64,')[1]
                    : base64Image;
                const { data: imageData, error: uploadError } = await config_1.supabase.storage
                    .from('booklet-senior')
                    .upload(`pharmacy/${Date.now()}-cover.png`, (0, base64_arraybuffer_1.decode)(base64Data), {
                    contentType: 'image/png'
                });
                if (uploadError) {
                    throw new Error(`Error uploading image: ${uploadError.message}`);
                }
                const { data: urlData } = await config_1.supabase.storage
                    .from('booklet-senior')
                    .getPublicUrl(imageData.path);
                pharmacyImg = urlData.publicUrl;
            }
            const medicine = {
                ...req.body,
                pharmacyImg,
            };
            const updatedMedicine = await this.phamarcyService.updatePharmacy(medicine);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, updatedMedicine.data, 'Pharmacy has been updated successfully.');
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.error(`[UpdatePhamarcyControllerError]: ${err}`);
            next(err);
        }
    };
}
exports.PharmacyController = PharmacyController;
//# sourceMappingURL=phamarcy.controller.js.map