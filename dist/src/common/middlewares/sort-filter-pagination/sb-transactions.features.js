"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@/config");
const transactionsFeature = () => {
    return async (req, res, next) => {
        try {
            const page = Number.parseInt(req.query.page) || 1;
            const limit = Number.parseInt(req.query.limit) || 10;
            const sortBy = req.query.sort || "transaction_date";
            const order = req.query.orderBy || "desc";
            const searchTerm = req.query.search;
            let query = config_1.supabase.from("transaction").select("*", { count: "exact" });
            if (searchTerm) {
                query = query.or(`senior_citizen_id.ilike.%${searchTerm}%,pharmacy_id.ilike.%${searchTerm}%`);
            }
            query = query.order(sortBy, { ascending: order === "asc" });
            const { count } = await query;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            query = query.range(startIndex, endIndex - 1);
            const { data: transactions, error } = await query;
            if (error)
                throw error;
            const totalPages = Math.ceil(count / limit);
            const paginatedResults = {
                results: transactions,
                totalDocs: count?.toString() || "0",
                limit,
                totalPages,
                page,
                pagingCounter: startIndex + 1,
                hasPrevPage: page > 1,
                hasNextPage: endIndex < count,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: endIndex < count ? page + 1 : null,
                next: endIndex < count ? (page + 1).toString() : "",
                previous: page > 1 ? (page - 1).toString() : "",
                currentPage: page.toString(),
                lastPage: totalPages.toString(),
            };
            res.paginatedResults = paginatedResults;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = transactionsFeature;
//# sourceMappingURL=sb-transactions.features.js.map