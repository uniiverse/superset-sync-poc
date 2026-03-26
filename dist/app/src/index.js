function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import createGrpcServer from "./config/grpc-server.js";
import createHttpServer from "./config/http-server.js";
import Config from "./config/index.js";
import log, { debugLogConfig } from "./config/logging.js";
import { serverCredentials } from "./config/tls.js";
import { registerTracing } from "./config/tracing.js";
import initializeGrpcService from "./grpc-service.js";
import initializeHttpService from "./http-service.js";
_async_to_generator(function() {
    var httpServer, grpcServer, port, error;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _state.trys.push([
                    0,
                    2,
                    ,
                    3
                ]);
                debugLogConfig(log);
                registerTracing();
                httpServer = createHttpServer();
                initializeHttpService(httpServer);
                httpServer.listen(Config.HTTP_PORT);
                log.info("HTTP server running at ".concat(Config.HTTP_PORT));
                grpcServer = createGrpcServer();
                initializeGrpcService(grpcServer);
                return [
                    4,
                    grpcServer.listen("0.0.0.0:".concat(Config.GRPC_PORT), serverCredentials)
                ];
            case 1:
                port = _state.sent();
                log.info("gRPC server running at 0.0.0.0:".concat(port));
                return [
                    3,
                    3
                ];
            case 2:
                error = _state.sent();
                log.error("Failed to start the server: %o", error);
                process.exit(1);
                return [
                    3,
                    3
                ];
            case 3:
                return [
                    2
                ];
        }
    });
})();
