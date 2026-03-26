function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
import { isAbortError } from "abort-controller-x";
import { ServerError, Status } from "nice-grpc";
import pino from "pino";
import Config from "./index.js";
export function createLogger(name) {
    var logger = pino.default({
        name: name
    });
    logger.level = Config.LOG_LEVEL;
    return logger;
}
export default createLogger();
/* eslint-disable  @typescript-eslint/no-explicit-any */ export function logGrpcError(logger, path, error) {
    if (_instanceof(error, ServerError)) {
        logger.error("\n      GRPC: ".concat(path, "\n      STATUS: ").concat(Status[error.code], "\n      ERROR: ").concat(error.details, "\n      "));
    } else if (isAbortError(error)) {
        logger.info("GRPC: ".concat(path, " cancelled."));
    } else {
        logger.error("\n      GRPC: ".concat(path, "\n      ERROR: ").concat(error === null || error === void 0 ? void 0 : error.stack));
    }
}
export function debugLogGrpcRequest(logger, request, context) {
    // Skip for production builds (until sensitive data is stripped).
    if (!Config.IS_DEV) {
        return;
    }
    var metadata = "";
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = context.metadata[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var key = _step.value;
            metadata += "[key: ".concat(key[0], ", value: ").concat(key[1], "] ");
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    logger.debug("REQUEST: ".concat(request, ", METADATA: ").concat(metadata));
}
export function logExpressError(logger, req, error) {
    if (isAbortError(error)) {
        logger.info("".concat(req.method, ": ").concat(req.path, " cancelled."));
    } else {
        logger.error("\n      ".concat(req.method, ": ").concat(req.path, "\n      ERROR: ").concat(error === null || error === void 0 ? void 0 : error.stack));
    }
}
export function debugLogExpressRequest(logger, req) {
    // Skip for production builds (until sensitive data is stripped).
    if (!Config.IS_DEV) {
        return;
    }
    logger.debug("HTTP: ".concat(req.method, " ").concat(req.url));
}
export function debugLogConfig(logger) {
    // Skip for production builds (until sensitive data is stripped).
    if (!Config.IS_DEV) {
        return;
    }
    logger.debug("CONFIG:\n    ".concat(JSON.stringify(Config, null, 2)));
}
