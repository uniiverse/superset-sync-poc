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
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
import axios from "axios";
import FormData from "form-data";
import { ServerError, Status } from "nice-grpc";
import * as Superset from "superset-openapi";
import fs from "fs";
import { logAxiosError } from "./log-helpers.js";
import Config from "../config/index.js";
import log from "../config/logging.js";
var configuration = new Superset.Configuration();
configuration.basePath = Config.SUPERSET_URL;
var embeddedApi = new Superset.EmbeddedDashboardApi(configuration);
var securityApi = new Superset.SecurityApi(configuration);
var CSRF_SESSION_COOKIE_NAME = "session";
export var SupersetClient = /*#__PURE__*/ function() {
    "use strict";
    function SupersetClient() {
        _class_call_check(this, SupersetClient);
        _define_property(this, "csrfSessionCookie", void 0);
        _define_property(this, "csrfToken", void 0);
        _define_property(this, "accessToken", void 0);
    }
    _create_class(SupersetClient, [
        {
            key: "login",
            value: function login() {
                var _this = this;
                return _async_to_generator(function() {
                    var loginRequest, res, data, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                loginRequest = {
                                    password: Config.SUPERSET_PASSWORD,
                                    username: Config.SUPERSET_USERNAME,
                                    provider: Superset.SecurityLoginBodyProviderEnum.Db,
                                    refresh: true
                                };
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    securityApi.apiV1SecurityLoginPost(loginRequest)
                                ];
                            case 2:
                                res = _state.sent();
                                data = res.data;
                                _this.accessToken = data["access_token"];
                                log.info("Superset login successful.");
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                error = _state.sent();
                                logAxiosError(log, "SupersetClient.apiV1SecurityLoginPost failed to get an access token.", error);
                                throw new ServerError(Status.UNAUTHENTICATED, "Authentication failed.");
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "refreshCsrfToken",
            value: function refreshCsrfToken() {
                var _this = this;
                return _async_to_generator(function() {
                    var retries, MAX_RETRIES, _headers_setcookie_find_match, _headers_setcookie_find, res, data, headers, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                // Only attempt to update the CSRF token if authenticated.
                                if (!_this.accessToken) {
                                    return [
                                        2
                                    ];
                                }
                                retries = 0;
                                MAX_RETRIES = 3;
                                _state.label = 1;
                            case 1:
                                if (!(retries < MAX_RETRIES)) return [
                                    3,
                                    6
                                ];
                                retries++;
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    4,
                                    ,
                                    5
                                ]);
                                return [
                                    4,
                                    securityApi.apiV1SecurityCsrfTokenGet(_this.getRequestOptions(false))
                                ];
                            case 3:
                                res = _state.sent();
                                // Store the CSRF token.
                                data = res.data;
                                _this.csrfToken = data["result"];
                                // Superset requires a CSRF session cookie be sent with every request. Requests via axios don't handle
                                // cookies in a jar by default, so extract the cookie to add it manually on future requests.
                                headers = res.headers;
                                _this.csrfSessionCookie = (_headers_setcookie_find = headers["set-cookie"].find(function(cookie) {
                                    return cookie.includes(CSRF_SESSION_COOKIE_NAME);
                                })) === null || _headers_setcookie_find === void 0 ? void 0 : (_headers_setcookie_find_match = _headers_setcookie_find.match(new RegExp("^".concat(CSRF_SESSION_COOKIE_NAME, "=(.+?);")))) === null || _headers_setcookie_find_match === void 0 ? void 0 : _headers_setcookie_find_match[1];
                                log.info("Got Superset CSRF token successfully: ".concat(_this.csrfSessionCookie));
                                return [
                                    2
                                ];
                            case 4:
                                error = _state.sent();
                                logAxiosError(log, "SupersetClient.apiV1SecurityCsrfTokenGet failed to get a CSRF token.", error);
                                if (retries >= MAX_RETRIES) {
                                    _this.accessToken = undefined;
                                    _this.csrfToken = undefined;
                                    throw new ServerError(Status.UNAUTHENTICATED, "Failed to get CSRF token.");
                                }
                                return [
                                    3,
                                    5
                                ];
                            case 5:
                                return [
                                    3,
                                    1
                                ];
                            case 6:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "guestToken",
            value: function guestToken(dashboardId, firstName, lastName, username, clause) {
                var _this = this;
                return _async_to_generator(function() {
                    var retries, MAX_RETRIES, resource, resources, rls, user, body, res, token, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                retries = 0;
                                MAX_RETRIES = 3;
                                resource = {
                                    id: dashboardId,
                                    type: "dashboard"
                                };
                                resources = [
                                    resource
                                ];
                                rls = clause ? [
                                    {
                                        clause: clause
                                    }
                                ] : [];
                                user = {
                                    firstName: firstName,
                                    lastName: lastName,
                                    username: username
                                };
                                body = {
                                    resources: resources,
                                    rls: rls,
                                    user: user
                                };
                                _state.label = 1;
                            case 1:
                                if (!(retries < MAX_RETRIES)) return [
                                    3,
                                    7
                                ];
                                retries++;
                                return [
                                    4,
                                    _this.loginIfNeeded()
                                ];
                            case 2:
                                if (!_state.sent()) {
                                    return [
                                        3,
                                        1
                                    ];
                                }
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    5,
                                    ,
                                    6
                                ]);
                                return [
                                    4,
                                    securityApi.apiV1SecurityGuestTokenPost(body, _this.getRequestOptions())
                                ];
                            case 4:
                                res = _state.sent();
                                token = res.data.token;
                                // TODO: is there a nicer way of doing this where it recognizes that token is not undefined
                                if (!token) {
                                    throw new Error();
                                }
                                return [
                                    2,
                                    token
                                ];
                            case 5:
                                error = _state.sent();
                                _this.handleError("guestToken", "Failed to get guest token.", error);
                                return [
                                    3,
                                    6
                                ];
                            case 6:
                                return [
                                    3,
                                    1
                                ];
                            case 7:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "exportAssets",
            value: function exportAssets(filePath) {
                var _this = this;
                return _async_to_generator(function() {
                    var options;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.loginIfNeeded()
                                ];
                            case 1:
                                if (!_state.sent()) {
                                    return [
                                        2
                                    ];
                                }
                                options = _object_spread_props(_object_spread({}, _this.getRequestOptions()), {
                                    responseType: "arraybuffer"
                                });
                                return [
                                    4,
                                    axios.default.get("".concat(configuration.basePath, "/api/v1/assets/export/"), options).then(function(res) {
                                        var buffer = res.data;
                                        try {
                                            fs.writeFileSync(filePath, buffer);
                                            log.info("Export assets successful: ".concat(filePath, "."));
                                        } catch (err) {
                                            log.error("Failed to write assets ZIP file.\n	Error: ".concat(err));
                                        }
                                    }).catch(function(err) {
                                        _this.handleError("exportAssets", "Failed to export assets.", err);
                                    })
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "importAssets",
            value: function importAssets(filePath, passwords) {
                var _this = this;
                return _async_to_generator(function() {
                    var form, options;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.loginIfNeeded()
                                ];
                            case 1:
                                if (!_state.sent()) {
                                    return [
                                        2
                                    ];
                                }
                                form = new FormData();
                                // Must be "bundle".
                                form.append("bundle", fs.createReadStream(filePath), {
                                    filename: "dashboards.zip",
                                    contentType: "application/zip"
                                });
                                // Append "passwords", if provided.
                                if (passwords) {
                                    form.append("passwords", passwords);
                                }
                                options = _this.getRequestOptions();
                                options.headers = _object_spread_props(_object_spread({}, options.headers, form.getHeaders()), {
                                    Accept: "application/json"
                                });
                                return [
                                    4,
                                    axios.default.post("".concat(configuration.basePath, "/api/v1/assets/import/"), form, options).then(function() {
                                        log.info("Import assets successful.");
                                    }).catch(function(err) {
                                        _this.handleError("importAssets", "Failed to import assets.", err);
                                    })
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "createEmbedConfig",
            value: function createEmbedConfig(dashboardId) {
                var _this = this;
                return _async_to_generator(function() {
                    var options, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.loginIfNeeded()
                                ];
                            case 1:
                                if (!_state.sent()) {
                                    return [
                                        2
                                    ];
                                }
                                options = _this.getRequestOptions();
                                return [
                                    4,
                                    axios.default.post("".concat(configuration.basePath, "/api/v1/dashboard/").concat(dashboardId, "/"), null, options).then(function() {
                                        log.info("Create embed config successful.");
                                    }).catch(function(err) {
                                        _this.handleError("createEmbedConfig", "Failed to create embed config.", err);
                                    })
                                ];
                            case 2:
                                res = _state.sent();
                                // TODO: Do the thing.
                                return [
                                    2,
                                    res
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getOrCreateEmbedConfig",
            value: function getOrCreateEmbedConfig(dashboardId) {
                var _this = this;
                return _async_to_generator(function() {
                    var _res_data_result, res, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.loginIfNeeded()
                                ];
                            case 1:
                                if (!_state.sent()) {
                                    return [
                                        2
                                    ];
                                }
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    4,
                                    ,
                                    7
                                ]);
                                return [
                                    4,
                                    embeddedApi.apiV1EmbeddedDashboardUuidGet(dashboardId)
                                ];
                            case 3:
                                res = _state.sent();
                                return [
                                    2,
                                    (_res_data_result = res.data.result) === null || _res_data_result === void 0 ? void 0 : _res_data_result.uuid
                                ];
                            case 4:
                                error = _state.sent();
                                if (!(error.status == 404)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    _this.createEmbedConfig(dashboardId)
                                ];
                            case 5:
                                return [
                                    2,
                                    _state.sent()
                                ];
                            case 6:
                                _this.handleError("getOrCreateEmbedConfig", "Failed to get or create the embed config.", error);
                                return [
                                    3,
                                    7
                                ];
                            case 7:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "handleError",
            value: function handleError(call, message, error) {
                var _error_response;
                logAxiosError(log, "SupersetClient.".concat(call, ": ").concat(message, "."), error);
                if ((error === null || error === void 0 ? void 0 : (_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.status) == 401) {
                    // Clear all tokens and force a re-login.
                    this.accessToken = undefined;
                    this.csrfToken = undefined;
                } else {
                    // Otherwise, throw the error.
                    throw new ServerError(Status.INTERNAL, message);
                }
            }
        },
        {
            key: "getRequestOptions",
            value: // Includes authorization headers.
            function getRequestOptions() {
                var includeCSRF = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
                var headers = {
                    Authorization: "Bearer ".concat(this.accessToken)
                };
                if (includeCSRF) {
                    headers["X-CSRFToken"] = "".concat(this.csrfToken);
                    headers["Cookie"] = "session=".concat(this.csrfSessionCookie);
                }
                return {
                    withCredentials: true,
                    headers: headers
                };
            }
        },
        {
            key: "loginIfNeeded",
            value: // Both an access token and CSRF token are required to make requests against superset.
            function loginIfNeeded() {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!!_this.accessToken) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    _this.login()
                                ];
                            case 1:
                                _state.sent();
                                _state.label = 2;
                            case 2:
                                if (!!_this.csrfToken) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    _this.refreshCsrfToken()
                                ];
                            case 3:
                                _state.sent();
                                _state.label = 4;
                            case 4:
                                return [
                                    2,
                                    _this.accessToken && _this.csrfToken
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return SupersetClient;
}();
