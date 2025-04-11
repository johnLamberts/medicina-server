"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeniorCitizenService = void 0;
const supabase_config_1 = require("@/config/supabase.config");
const http_errors_1 = __importDefault(require("http-errors"));
const addSeniorCitizen = async (payload) => {
    try {
        const { error: seniorError } = await supabase_config_1.supabase
            .from("senior_citizen")
            .insert({
            ...payload,
        })
            .single();
        if (seniorError) {
            throw (0, http_errors_1.default)(401, seniorError.message);
        }
        const { data, error } = await supabase_config_1.supabase
            .from("sb_users")
            .insert({
            ...payload,
            userRole: "senior_citizen",
        })
            .single();
        if (error) {
            throw (0, http_errors_1.default)(401, error.message);
        }
        const { data: seniorUserData, error: seniorUserError } = await supabase_config_1.supabase.auth.admin.createUser({
            email_confirm: true,
            email: payload.email,
            password: payload.password,
            user_metadata: {
                ...payload
            }
        });
        if (seniorUserError) {
            throw (0, http_errors_1.default)(401, seniorUserError.message);
        }
        return { id: data, seniorUserData };
    }
    catch (err) {
        console.error(err);
        throw (0, http_errors_1.default)(401, err instanceof Error ? err.message : "Unknown error occurred");
    }
};
class SeniorCitizenService {
    constructor() { }
    async addSeniorCitizen(payload) {
        try {
            const { data: seniorData, error: seniorError } = await supabase_config_1.supabase
                .from("senior_citizens")
                .insert({
                ...payload,
            })
                .single();
            if (seniorError)
                throw `[SeniorErrorService]: ${JSON.stringify(seniorError, null, 2)}`;
            const { data: seniorUserData, error: seniorUserError } = await supabase_config_1.supabase.auth.admin.createUser({
                email_confirm: true,
                email: payload.email,
                password: payload.password,
                user_metadata: {
                    ...payload
                }
            });
            if (seniorUserError)
                throw `[SeniorAuthAddingErrorService]: ${JSON.stringify(seniorUserError, null, 2)}`;
            return { id: seniorData, seniorUserData };
        }
        catch (err) {
            console.error(err);
            throw (0, http_errors_1.default)(401, err instanceof Error ? err.message : "Unknown error occurred");
        }
    }
}
exports.SeniorCitizenService = SeniorCitizenService;
exports.default = SeniorCitizenService;
//# sourceMappingURL=seniior-citizen.service.js.map