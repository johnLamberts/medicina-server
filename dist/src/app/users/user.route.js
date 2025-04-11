"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const validation_1 = require("@/common/middlewares/validation");
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get("/", user_controller_1.UserController.getUsersHandler);
router.post("/create_user", validation_1.addUserValidation, user_controller_1.UserController.addUserHandler);
exports.UserRoute = router;
//# sourceMappingURL=user.route.js.map