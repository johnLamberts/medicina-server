"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionItemService = void 0;
const supabase_config_1 = require("@/config/supabase.config");
class TransactionItemService {
    constructor() { }
    async createTransactionItem(payload) {
        const { data, error: transactionItemError } = await supabase_config_1.supabase
            .from("transaction_items")
            .insert({
            transaction_id: payload.transaction_id,
            medicine_id: payload.medicine_id,
            quantity: payload.quantity,
            unit_price: payload.unit_price,
            discount_applied: payload.discount_applied,
            subtotal: payload.subtotal
        })
            .select()
            .single();
        if (transactionItemError)
            throw `[TransactionItemErrorService]: ${JSON.stringify(transactionItemError, null, 0)}`;
        return data;
    }
    async getTransactionItems() {
        const { data, error: transactionItemError } = await supabase_config_1.supabase
            .from("transaction_items")
            .select();
        if (transactionItemError)
            throw `[TransactionItemErrorService]: ${JSON.stringify(transactionItemError, null, 0)}`;
        return data;
    }
    async getTransactionItem(transaction_item_id) {
        const { data, error: transactionItemError } = await supabase_config_1.supabase
            .from("transaction_items")
            .select()
            .eq("id", transaction_item_id)
            .single();
        if (transactionItemError)
            throw `[TransactionItemErrorService]: ${JSON.stringify(transactionItemError, null, 0)}`;
        return data;
    }
    async updateTransactionItem(transaction_item_id, payload) {
        const { data, error: transactionItemError } = await supabase_config_1.supabase
            .from("transaction_items")
            .update({
            transaction_id: payload.transaction_id,
            medicine_id: payload.medicine_id,
            quantity: payload.quantity,
            unit_price: payload.unit_price,
            discount_applied: payload.discount_applied,
            subtotal: payload.subtotal
        })
            .eq("id", transaction_item_id)
            .select()
            .single();
        if (transactionItemError)
            throw `[TransactionItemErrorService]: ${JSON.stringify(transactionItemError, null, 0)}`;
        return data;
    }
    async deleteTransactionItem(transaction_item_id) {
        const { error: transactionItemError } = await supabase_config_1.supabase
            .from("transaction_items")
            .delete()
            .eq("id", transaction_item_id);
        if (transactionItemError)
            throw `[TransactionItemErrorService]: ${JSON.stringify(transactionItemError, null, 0)}`;
    }
}
exports.TransactionItemService = TransactionItemService;
//# sourceMappingURL=transaction-item.service.js.map