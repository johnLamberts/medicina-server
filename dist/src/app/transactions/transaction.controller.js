"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const constants_1 = require("@/constants");
const utils_1 = require("@/utils");
const transaction_service_1 = __importDefault(require("./transaction.service"));
class TransactionController {
    transactionService;
    constructor() {
        this.transactionService = new transaction_service_1.default();
    }
    addTransactionHandler = async (req, res, next) => {
        try {
            const transactionData = req.body;
            const data = await this.transactionService.createTransaction(transactionData);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.CREATED, data, `Transaction has been added.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[AddTransactionControllerError]: ${err}`);
            next(err);
        }
    };
    getOneTransactionHandler = async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = await this.transactionService.getTransactionById(id);
            if (!data) {
                const error = (0, utils_1.customReponse)().error(404, new Error("Transaction not found."), "Transaction not found");
                return res.status(error.statusCode).json(error);
            }
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `Transaction has been found.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[GetTransactionHandlerError]: ${err}`);
            next(err);
        }
    };
    getTransactionsHandler = async (_req, res) => {
        try {
            if (res.paginatedResults) {
                const { results, next, previous, currentPage, totalDocs, totalPages, lastPage } = res.paginatedResults;
                const responseObject = {
                    totalDocs: totalDocs || 0,
                    totalPages: totalPages || 0,
                    lastPage: lastPage || 0,
                    count: results?.length || 0,
                    currentPage: currentPage || 0,
                };
                if (next) {
                    responseObject.nextPage = next;
                }
                if (previous) {
                    responseObject.prevPage = previous;
                }
                responseObject.transactions = results?.map((transaction) => {
                    return {
                        ...transaction,
                        request: {
                            type: "GET",
                            description: "Get one transaction with the ID",
                            url: `http://localhost:5370/api/v1/transaction/${transaction.transaction_id}`,
                        },
                    };
                });
                const success = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, responseObject, "Successfully found transactions");
                return res.status(success.statusCode).json(success);
            }
            else {
                const error = (0, utils_1.customReponse)().error(404, new Error("No transactions found."), "No transactions found");
                return res.status(error.statusCode).json(error);
            }
        }
        catch (error) {
            return res
                .status(500)
                .send((0, utils_1.customReponse)().error(404, error, "An error occurred while retrieving transactions"));
        }
    };
    updateTransactionHandler = async (req, res, next) => {
        try {
            const id = req.params.id;
            const updateData = req.body;
            const data = await this.transactionService.updateTransaction(id, updateData);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, data, `Transaction has been updated.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[UpdateTransactionControllerError]: ${err}`);
            next(err);
        }
    };
    deleteTransactionHandler = async (req, res, next) => {
        try {
            const id = req.params.id;
            await this.transactionService.deleteTransaction(id);
            const response = (0, utils_1.customReponse)().success(constants_1.HttpStatusCodes.OK, null, `Transaction has been deleted.`);
            return res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log(`[DeleteTransactionControllerError]: ${err}`);
            next(err);
        }
    };
}
exports.TransactionController = TransactionController;
exports.default = TransactionController;
//# sourceMappingURL=transaction.controller.js.map