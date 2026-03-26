import { env } from "process";
export var BUILD_TYPE = env.BUILD_TYPE || "production";
// Applies this user ID if none is set in the request headers and IS_DEV is true.
export var DEV_USER_ID = env.DEV_USER_ID || "us_0";
export var IS_DEV = BUILD_TYPE != "production";
export var GRPC_PORT = parseInt(env.GRPC_PORT || "8080");
export var HTTP_PORT = parseInt(env.HTTP_PORT || "8081");
export var USE_TLS = Boolean(env.USE_TLS || false);
export var LOG_LEVEL = env.LOG_LEVEL || "error";
export var SENTRY_DSN = env.SENTRY_DSN || "";
export var USING_SENTRY = SENTRY_DSN != "";
export var TRACE_EXPORT_ENDPOINT = env.TRACE_EXPORT_ENDPOINT || "";
export var USING_TRACING = Boolean(env.TRACE_EXPORT_ENDPOINT);
export var GRPC_SERVER_REFLECTION_PATH = env.GRPC_SERVER_REFLECTION_PATH || "";
export var USING_GRPC_SERVER_REFLECTION = GRPC_SERVER_REFLECTION_PATH != "";
export var SUPERSET_URL = env.SUPERSET_URL || "https://dashboards.universe.com/";
export var SUPERSET_USERNAME = env.SUPERSET_USERNAME || "Universe";
export var SUPERSET_PASSWORD = env.SUPERSET_PASSWORD;
export var CLICKHOUSE_URL = env.CLICKHOUSE_URL || "clickhouse-data-platform.data-platform:9000/highlander";
export var CLICKHOUSE_PASSWORD = env.CLICKHOUSE_PASSWORD || null;
export default {
    BUILD_TYPE: BUILD_TYPE,
    IS_DEV: IS_DEV,
    GRPC_PORT: GRPC_PORT,
    HTTP_PORT: HTTP_PORT,
    USE_TLS: USE_TLS,
    LOG_LEVEL: LOG_LEVEL,
    SENTRY_DSN: SENTRY_DSN,
    USING_SENTRY: USING_SENTRY,
    CLICKHOUSE_URL: CLICKHOUSE_URL,
    CLICKHOUSE_PASSWORD: CLICKHOUSE_PASSWORD,
    DEV_USER_ID: DEV_USER_ID,
    TRACE_EXPORT_ENDPOINT: TRACE_EXPORT_ENDPOINT,
    USING_TRACING: USING_TRACING,
    GRPC_SERVER_REFLECTION_PATH: GRPC_SERVER_REFLECTION_PATH,
    USING_GRPC_SERVER_REFLECTION: USING_GRPC_SERVER_REFLECTION,
    SUPERSET_PASSWORD: SUPERSET_PASSWORD,
    SUPERSET_URL: SUPERSET_URL,
    SUPERSET_USERNAME: SUPERSET_USERNAME
};
