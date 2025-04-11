"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catcher = void 0;
const catcher = (fn, cb) => (request, response) => {
    Promise.resolve(fn(request, response)).catch((err) => {
        if (cb) {
            cb(request, response);
            return;
        }
        console.log(`[CatcherError]: ${err}`);
        response.status(400).send({
            message: err.message,
        });
    });
};
exports.catcher = catcher;
//# sourceMappingURL=catcher.utils.js.map