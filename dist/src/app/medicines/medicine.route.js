"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineRoute = void 0;
const file_upload_1 = require("@/common/middlewares/file-upload");
const sort_filter_pagination_1 = require("@/common/middlewares/sort-filter-pagination");
const express_1 = __importDefault(require("express"));
const medicine_controllers_1 = __importDefault(require("./medicine.controllers"));
const router = express_1.default.Router();
const medicineController = new medicine_controllers_1.default;
router.post("/add_medicine", file_upload_1.uploadImage.single('medicineImageFile'), medicineController.addMedicineHandler);
router.put("/update_medicine", file_upload_1.uploadImage.single('medicineImageFile'), medicineController.updateMedicineHandler);
router.get("/", (0, sort_filter_pagination_1.medicineFeature)(), medicineController.getMedicinesHandler);
exports.MedicineRoute = router;
//# sourceMappingURL=medicine.route.js.map