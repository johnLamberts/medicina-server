"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyService = void 0;
const config_1 = require("@/config");
class PharmacyService {
    constructor() { }
    async createPharmacy(payload) {
        const { data, error: pharmacyError } = await config_1.supabase
            .from("pharmacy")
            .insert(payload)
            .select()
            .single();
        if (pharmacyError)
            throw `[PharmacyErrorService]: ${JSON.stringify(pharmacyError, null, 0)}`;
        return data;
    }
    async updatePharmacy(payload) {
        const { data, error: pharmacyError } = await config_1.supabase
            .from("pharmacy")
            .update(payload)
            .eq("pharmacy_id", payload.pharmacy_id)
            .select()
            .single();
        if (pharmacyError)
            throw `[PharmacyErrorService]: ${JSON.stringify(pharmacyError, null, 0)}`;
        return data;
    }
}
exports.PharmacyService = PharmacyService;
exports.default = PharmacyService;
//# sourceMappingURL=phamarcy.service.js.map