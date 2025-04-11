"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const constants_1 = require("@/constants");
const utils_1 = require("@/utils");
const user_service_1 = require("./user.service");
const getUsersHandler = async (req, res) => {
    try {
        const userService = new user_service_1.UserService();
        const students = await userService.getAllUsers();
        res.json({
            data: students,
            status: "Success",
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                error: err.message,
            });
        }
    }
};
const addUserHandler = async (req, res, next) => {
    try {
        const userService = new user_service_1.UserService();
        const data = await userService.createUser({ ...req.body });
        const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `User has been added.`);
        res.status(constants_1.HttpStatusCodes.OK).json({
            statusCode: constants_1.HttpStatusCodes.OK, data: data, message: 'User has been added.'
        });
    }
    catch (err) {
        console.log(`[AddStudentControllerError]: ${err}`);
        next(err);
    }
};
exports.UserController = { getUsersHandler, addUserHandler };
//# sourceMappingURL=user.controller.js.map