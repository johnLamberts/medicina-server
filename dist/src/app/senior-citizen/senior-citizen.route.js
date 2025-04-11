"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeniorCitizenRoute = void 0;
const express_1 = __importDefault(require("express"));
const senior_citizen_controllers_1 = __importDefault(require("../senior-citizen/senior-citizen.controllers"));
const file_upload_1 = require("@/common/middlewares/file-upload");
const senior_citizen_features_1 = __importDefault(require("@/common/middlewares/sort-filter-pagination/senior-citizen.features"));
const router = express_1.default.Router();
const seniorCitizenController = new senior_citizen_controllers_1.default();
router.get("/", (0, senior_citizen_features_1.default)(), seniorCitizenController.getSeniorCitizensHandler);
router.post("/add_senior", file_upload_1.uploadImage.single('profileImg'), seniorCitizenController.addSeniorCitizenHandler);
exports.SeniorCitizenRoute = router;
//# sourceMappingURL=senior-citizen.route.js.map