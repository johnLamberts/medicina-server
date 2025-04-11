"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
const firebase_admin_1 = require("firebase-admin");
const app_1 = require("firebase-admin/app");
const storage_1 = require("firebase-admin/storage");
const load_envs_config_1 = require("./load-envs.config");
const app = (0, app_1.getApps)().length === 0
    ? (0, app_1.initializeApp)({
        credential: firebase_admin_1.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        storageBucket: load_envs_config_1.environmentConfig.FIREBASE_STORAGE_BUCKET,
    })
    : (0, app_1.getApps)()[0];
exports.bucket = (0, storage_1.getStorage)(app).bucket();
exports.default = { bucket: exports.bucket };
//# sourceMappingURL=firebase.config.js.map