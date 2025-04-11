"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyRoute = void 0;
const file_upload_1 = require("@/common/middlewares/file-upload");
const sort_filter_pagination_1 = require("@/common/middlewares/sort-filter-pagination");
const phamarcy_1 = require("@/common/middlewares/validation/phamarcy");
const express_1 = __importDefault(require("express"));
const phamarcy_controller_1 = require("./phamarcy.controller");
const router = express_1.default.Router();
const phamarcyController = new phamarcy_controller_1.PharmacyController;
router.post("/add_pharmacy", file_upload_1.uploadImage.single('pharmacyImg'), phamarcy_1.addPhamarcyValidation, phamarcyController.addPhamarcyHandler);
router.get("/", (0, sort_filter_pagination_1.pharmacyFeature)(), phamarcyController.getPharmaciesHandler);
exports.PharmacyRoute = router;
//# sourceMappingURL=phamarcy.route.js.map