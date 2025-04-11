"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development",
});
exports.environmentConfig = {
    PORT: process.env.PORT,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_API_KEYS: process.env.SUPABASE_API_KEYS,
    FIREBASE_APIKEY: process.env.FIREBASE_APIKEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSENGER_SENDER_ID: process.env.FIREBASE_MESSENGER_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY
};
//# sourceMappingURL=load-envs.config.js.map