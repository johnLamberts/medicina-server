"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const random_avatar_utils_1 = __importDefault(require("@/utils/random-avatar.utils"));
const random_username_utils_1 = __importDefault(require("@/utils/random-username.utils"));
const admin = __importStar(require("firebase-admin"));
const http_errors_1 = __importDefault(require("http-errors"));
class UserService {
    constructor() { }
    async createUser(payload) {
        try {
            const userRecord = await admin.auth().createUser({
                email: payload.email,
                emailVerified: false,
                displayName: (0, random_username_utils_1.default)(),
                password: payload.password,
                photoURL: (0, random_avatar_utils_1.default)(),
                disabled: false
            });
            const userDocData = {
                firstName: payload?.firstName,
                middleName: payload.middleName,
                lastName: payload?.lastName,
                email: payload.email,
                userImg: (0, random_avatar_utils_1.default)(),
                userRole: payload.userRole || "admin",
                isVerified: false,
                status: 'active',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            await admin
                .firestore()
                .collection("users")
                .add({
                ...userDocData
            });
            const newUser = {
                ...userDocData,
                id: userRecord.uid,
                isVerified: userRecord.emailVerified
            };
            return newUser;
        }
        catch (err) {
            console.error(err);
            if (err instanceof Error) {
                throw (0, http_errors_1.default)(401, err.message);
            }
            else {
                throw (0, http_errors_1.default)(401, 'An unknown error occurred');
            }
        }
    }
    async getAllUsers() {
        const snapshot = await admin.firestore().collection("users").get();
        return snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            };
        });
    }
}
exports.UserService = UserService;
exports.default = UserService;
//# sourceMappingURL=user.service.js.map