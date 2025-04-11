"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoute = void 0;
const sb_transactions_features_1 = __importDefault(require("@/common/middlewares/sort-filter-pagination/sb-transactions.features"));
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const router = express_1.default.Router();
const transactionController = new transaction_controller_1.TransactionController();
router.get("/", (0, sb_transactions_features_1.default)(), transactionController.getTransactionsHandler);
exports.TransactionRoute = router;
//# sourceMappingURL=transaction.route.js.map