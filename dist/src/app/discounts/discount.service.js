"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountService = void 0;
const supabase_config_1 = require("@/config/supabase.config");
class DiscountService {
    constructor() { }
    async createDiscount(payload) {
        const { data, error: discountError } = await supabase_config_1.supabase
            .from("discounts")
            .insert({
            medicine_id: payload.medicine_id,
            discount_percentage: payload.discount_percentage,
            start_date: payload.start_date,
            end_date: payload.end_date,
            is_active: payload.is_active
        })
            .select()
            .single();
        if (discountError)
            throw `[DiscountErrorService]: ${JSON.stringify(discountError, null, 0)}`;
        return data;
    }
    async getDiscounts() {
        const { data, error: discountError } = await supabase_config_1.supabase
            .from("discounts")
            .select();
        if (discountError)
            throw `[DiscountErrorService]: ${JSON.stringify(discountError, null, 0)}`;
        return data;
    }
    async getDiscount(discount_id) {
        const { data, error: discountError } = await supabase_config_1.supabase
            .from("discounts")
            .select()
            .eq("id", discount_id)
            .single();
        if (discountError)
            throw `[DiscountErrorService]: ${JSON.stringify(discountError, null, 0)}`;
        return data;
    }
    async updateDiscount(discount_id, payload) {
        const { data, error: discountError } = await supabase_config_1.supabase
            .from("discounts")
            .update({
            medicine_id: payload.medicine_id,
            discount_percentage: payload.discount_percentage,
            start_date: payload.start_date,
            end_date: payload.end_date,
            is_active: payload.is_active
        })
            .eq("id", discount_id)
            .select()
            .single();
        if (discountError)
            throw `[DiscountErrorService]: ${JSON.stringify(discountError, null, 0)}`;
        return data;
    }
    async deleteDiscount(discount_id) {
        const { error: discountError } = await supabase_config_1.supabase
            .from("discounts")
            .delete()
            .eq("id", discount_id);
        if (discountError)
            throw `[DiscountErrorService]: ${JSON.stringify(discountError, null, 0)}`;
    }
}
exports.DiscountService = DiscountService;
//# sourceMappingURL=discount.service.js.map