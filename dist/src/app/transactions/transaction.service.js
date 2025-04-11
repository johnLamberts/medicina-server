"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const supabase_config_1 = require("@/config/supabase.config");
class TransactionService {
    constructor() { }
    async createTransaction(payload) {
        const { data, error: transactionError } = await supabase_config_1.supabase
            .from("transactions")
            .insert({
            senior_citizen_id: payload.senior_citizen_id,
            pharmacy_id: payload.pharmacy_id,
            transaction_date: payload.transaction_date,
            total_amount: payload.total_amount,
            discounted_amount: payload.discounted_amount,
            payment_method: payload.payment_method,
        })
            .select()
            .single();
        if (transactionError)
            throw `[TransactionErrorService]: ${JSON.stringify(transactionError, null, 0)}`;
        return data;
    }
    async getTransactions() {
        const { data, error: transactionError } = await supabase_config_1.supabase.from("transactions").select();
        if (transactionError)
            throw `[TransactionErrorService]: ${JSON.stringify(transactionError, null, 0)}`;
        return data;
    }
    async getTransactionById(transaction_id) {
        const { data, error: transactionError } = await supabase_config_1.supabase
            .from("transactions")
            .select()
            .eq("id", transaction_id)
            .single();
        if (transactionError)
            throw `[TransactionErrorService]: ${JSON.stringify(transactionError, null, 0)}`;
        return data;
    }
    async updateTransaction(transaction_id, payload) {
        const { data, error: transactionError } = await supabase_config_1.supabase
            .from("transactions")
            .update(payload)
            .eq("id", transaction_id)
            .select()
            .single();
        if (transactionError)
            throw `[TransactionErrorService]: ${JSON.stringify(transactionError, null, 0)}`;
        return data;
    }
    async deleteTransaction(transaction_id) {
        const { error: transactionError } = await supabase_config_1.supabase.from("transactions").delete().eq("id", transaction_id);
        if (transactionError)
            throw `[TransactionErrorService]: ${JSON.stringify(transactionError, null, 0)}`;
    }
}
exports.TransactionService = TransactionService;
exports.default = TransactionService;
//# sourceMappingURL=transaction.service.js.map