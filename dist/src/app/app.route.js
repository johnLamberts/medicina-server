"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const medicine_route_1 = require("./medicines/medicine.route");
const phamarcy_route_1 = require("./pharmacy/phamarcy.route");
const sb_users_1 = require("./sb-users");
const senior_citizen_route_1 = require("./senior-citizen/senior-citizen.route");
const transactions_1 = require("./transactions");
const API_VERSIONING_ENDPOINTS = `/api/v1`;
const router = async (app) => {
    app.use(`${API_VERSIONING_ENDPOINTS}/user`, sb_users_1.SbUserRoute);
    app.use(`${API_VERSIONING_ENDPOINTS}/pharmacy`, phamarcy_route_1.PharmacyRoute);
    app.use(`${API_VERSIONING_ENDPOINTS}/medicine`, medicine_route_1.MedicineRoute);
    app.use(`${API_VERSIONING_ENDPOINTS}/senior`, senior_citizen_route_1.SeniorCitizenRoute);
    app.use(`${API_VERSIONING_ENDPOINTS}/transaction`, transactions_1.TransactionRoute);
};
exports.router = router;
//# sourceMappingURL=app.route.js.map