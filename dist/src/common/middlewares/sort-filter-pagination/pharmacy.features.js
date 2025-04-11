"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pharmacyFeature = void 0;
const config_1 = require("@/config");
const pharmacyFeature = () => {
    return async (req, res, next) => {
        try {
            const queryObject = { ...req.query };
            const excludedFiles = ['sort', 'limit', 'page', 'field', "search"];
            excludedFiles.forEach((ele) => delete queryObject[ele]);
            let queryString = JSON.stringify(queryObject);
            const reg = /\bgte|gt|lte|lt\b/g;
            queryString = queryString.replace(reg, (matchString) => `.${matchString}`);
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const offset = (page - 1) * limit;
            console.log(page);
            let query = config_1.supabase.from("pharmacy").select("*", { count: 'exact' });
            if (Object.keys(queryObject).length > 0)
                query = query.match(JSON.parse(queryString));
            if (req.query.search) {
                const searchText = req.query.search.toLowerCase();
                query = query.or(`name.ilike.%${searchText}%,email.ilike.%${searchText}%`);
            }
            query = query.range(offset, offset + limit - 1);
            if (req.query.sort) {
                const sortBy = req.query.sort.split(',').join(',');
                query = query.order(sortBy);
            }
            else {
                query = query.order('created_at', { ascending: false });
            }
            let { data, count, error } = await query;
            if (error)
                throw error;
            if (req.query.fields) {
                const fields = req.query.fields.split(',').join(',');
                ({ data, count, error } = await config_1.supabase.from('pharmacy').select(fields, { count: 'exact' }).range(offset, offset + limit - 1));
                if (error) {
                    throw error;
                }
            }
            const results = {
                currentPage: {
                    page, limit
                },
                totalDocs: count,
                totalPages: Math.ceil(count / limit),
                lastPage: Math.ceil(count / limit),
                results: data
            };
            if (offset + limit < count) {
                results.next = {
                    page: page + 1,
                    limit,
                };
            }
            if (offset > 0) {
                results.previous = {
                    page: page - 1,
                    limit,
                };
            }
            res.paginatedResults = results;
            next();
        }
        catch (error) {
            console.log(`[PharmacyErrorFeatures]: ${error}`);
            return next(error);
        }
    };
};
exports.pharmacyFeature = pharmacyFeature;
//# sourceMappingURL=pharmacy.features.js.map