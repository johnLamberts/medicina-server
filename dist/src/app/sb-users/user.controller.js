"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const storage_1 = __importDefault(require("@/common/middlewares/file-upload/storage"));
const constants_1 = require("@/constants");
const utils_1 = require("@/utils");
const user_service_1 = __importDefault(require("./user.service"));
class UserController {
    userService;
    constructor() {
        this.userService = new user_service_1.default();
    }
    addUserHandler = async (req, res, next) => {
        try {
            let storageRefUrl = '';
            if (req.file?.filename) {
                const localFilePath = `${process.env.PWD}/public/uploads/sb_users/${req.file?.filename}`;
                const destination = `sb_users/${req.file.filename}`;
                storageRefUrl = await (0, storage_1.default)(localFilePath, destination);
            }
            const userData = {
                ...req.body,
                userImg: storageRefUrl
            };
            const data = await this.userService.createUser(userData);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `Students has been added.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[AddStudentControllerError]: ${err}`);
            next(err);
        }
    };
    updateUserHandler = async (req, res, next) => {
        try {
            console.log(req.body);
            let storageRefUrl = '';
            if (req.file?.filename) {
                const localFilePath = `${process.env.PWD}/public/uploads/sb_users/${req.file?.filename}`;
                const destination = `sb_users/${req.file.filename}`;
                storageRefUrl = await (0, storage_1.default)(localFilePath, destination);
            }
            const userData = {
                ...req.body,
                userImg: storageRefUrl
            };
            const data = await this.userService.updateUser(userData);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `Students has been added.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[UpdateStudentControllerError]: ${err}`);
            next(err);
        }
    };
    updateUserArchiveHandler = async (req, res, next) => {
        try {
            console.log(req.body);
            let storageRefUrl = '';
            if (req.file?.filename) {
                const localFilePath = `${process.env.PWD}/public/uploads/sb_users/${req.file?.filename}`;
                const destination = `sb_users/${req.file.filename}`;
                storageRefUrl = await (0, storage_1.default)(localFilePath, destination);
            }
            const userData = {
                ...req.body,
                userImg: storageRefUrl
            };
            const data = await this.userService.archiveUser(userData);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `Students has been added.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[UpdateStudentControllerError]: ${err}`);
            next(err);
        }
    };
    updateUserUnarchiveHandler = async (req, res, next) => {
        try {
            console.log(req.body);
            let storageRefUrl = '';
            if (req.file?.filename) {
                const localFilePath = `${process.env.PWD}/public/uploads/sb_users/${req.file?.filename}`;
                const destination = `sb_users/${req.file.filename}`;
                storageRefUrl = await (0, storage_1.default)(localFilePath, destination);
            }
            const userData = {
                ...req.body,
                userImg: storageRefUrl
            };
            const data = await this.userService.unarchiveUser(userData);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `Students has been added.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[UpdateStudentControllerError]: ${err}`);
            next(err);
        }
    };
    getOneUserHandler = async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = await this.userService.getUserById(id);
            if (!data) {
                const error = (0, utils_1.customReponse)().error(404, new Error('User not found.'), "User not found");
                return res.status(error.statusCode).json(error);
            }
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `User has been found.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[GetUserHandlerError]: ${err}`);
            next(err);
        }
    };
    getStudentsHandler = async (_req, res) => {
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
                responseObject.students = results?.map((user) => {
                    return {
                        ...user,
                        request: {
                            type: 'GET',
                            description: 'Get one user with the ID',
                            url: `http://localhost:5370/api/v1/user/${user.user_id}`
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
}
exports.UserController = UserController;
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map