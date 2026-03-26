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
import express from "express";
import { registry as niceGrpcRegistry } from "nice-grpc-prometheus";
import { register as globalRegistry, Registry, collectDefaultMetrics } from "prom-client";
import { createLogger, logExpressError } from "./logging.js";
var log = createLogger("http-server");
function createHttpServer() {
    var mergedRegister = Registry.merge([
        globalRegistry,
        niceGrpcRegistry
    ]);
    collectDefaultMetrics({
        register: mergedRegister
    });
    var server = express();
    server.get("/healthz", function() {
        var _ref = _async_to_generator(function(req, res) {
            var healthcheck;
            return _ts_generator(this, function(_state) {
                try {
                    healthcheck = {
                        uptime: process.uptime(),
                        message: "OK",
                        timestamp: Date.now()
                    };
                    res.send(healthcheck);
                } catch (ex) {
                    logExpressError(log, req, ex);
                    res.sendStatus(503);
                }
                return [
                    2
                ];
            });
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }());
    server.get("/healthz/ready", function() {
        var _ref = _async_to_generator(function(req, res) {
            return _ts_generator(this, function(_state) {
                try {
                    // NOTE: add any relevant pings to external dependencies
                    res.send("OK");
                } catch (ex) {
                    logExpressError(log, req, ex);
                    res.sendStatus(503);
                }
                return [
                    2
                ];
            });
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }());
    server.get("/metrics", function() {
        var _ref = _async_to_generator(function(req, res) {
            var _, ex;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        res.set("Content-Type", mergedRegister.contentType);
                        _ = res.end;
                        return [
                            4,
                            mergedRegister.metrics()
                        ];
                    case 1:
                        _.apply(res, [
                            _state.sent()
                        ]);
                        return [
                            3,
                            3
                        ];
                    case 2:
                        ex = _state.sent();
                        logExpressError(log, req, ex);
                        res.sendStatus(500);
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
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }());
    return server;
}
export default createHttpServer;
