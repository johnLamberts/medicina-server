"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SbUserRoute = void 0;
const sb_users_features_1 = require("@/common/middlewares/sort-filter-pagination/sb-users.features");
const validation_1 = require("@/common/middlewares/validation");
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const router = express_1.default.Router();
const userController = new user_controller_1.default;
router.post("/create_user", validation_1.addUserValidation, userController.addUserHandler);
router.put("/update_user", userController.updateUserHandler);
router.put("/archive_user", userController.updateUserArchiveHandler);
router.put("/unarchive_user", userController.updateUserUnarchiveHandler);
router.get("/", (0, sb_users_features_1.usersFeature)(), userController.getStudentsHandler);
exports.SbUserRoute = router;
//# sourceMappingURL=user.route.js.map