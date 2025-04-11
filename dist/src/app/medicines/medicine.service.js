"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineService = void 0;
const config_1 = require("@/config");
const utils_1 = require("@/utils");
class MedicineService {
    constructor() { }
    async addMedicine(payload) {
        try {
            const { data: medicineData, error: medicineErr } = await config_1.supabase
                .from("medicine")
                .insert(payload)
                .select()
                .single();
            if (medicineErr)
                return (0, utils_1.customReponse)().error(400, this.convertToError(medicineErr), 'Medicine error', 'MedicineError');
            if (!medicineData)
                return (0, utils_1.customReponse)().error(500, new Error('Medicine data insertion failed'), 'Database error', 'DatabaseError');
            return (0, utils_1.customReponse)().success(201, medicineData, 'Medicine created successfully');
        }
        catch (error) {
            console.error('Unexpected error in createUser:', error);
            return (0, utils_1.customReponse)().error(500, error instanceof Error ? error :
                new Error('Unknown error'), 'An unexpected error occurred', 'UnexpectedError');
        }
    }
    ;
    async updateMedicine(payload) {
        try {
            console.log(payload);
            const { data: medicineData, error: medicineErr } = await config_1.supabase
                .from("medicine")
                .update(payload)
                .eq("medicineId", payload.medicineId)
                .select()
                .single();
            if (medicineErr)
                return (0, utils_1.customReponse)().error(400, this.convertToError(medicineErr), 'Medicine error', 'MedicineError');
            if (!medicineData)
                return (0, utils_1.customReponse)().error(500, new Error('Medicine data insertion failed'), 'Database error', 'DatabaseError');
            return (0, utils_1.customReponse)().success(201, medicineData, 'Medicine created successfully');
        }
        catch (error) {
            console.error('Unexpected error in createUser:', error);
            return (0, utils_1.customReponse)().error(500, error instanceof Error ? error :
                new Error('Unknown error'), 'An unexpected error occurred', 'UnexpectedError');
        }
    }
    ;
    convertToError(error) {
        if (error instanceof Error) {
            return error;
        }
        if (typeof error === 'object' && error !== null && 'message' in error) {
            return new Error(String(error.message));
        }
        console.log(error);
        return new Error(String(error));
    }
}
exports.MedicineService = MedicineService;
exports.default = MedicineService;
//# sourceMappingURL=medicine.service.js.map