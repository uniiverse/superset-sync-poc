import { env } from "process";

export const BUILD_TYPE = env.BUILD_TYPE || "production";
// Applies this user ID if none is set in the request headers and IS_DEV is true.
export const DEV_USER_ID = env.DEV_USER_ID || "us_0";
export const IS_DEV = BUILD_TYPE != "production";

export const GRPC_PORT = parseInt(env.GRPC_PORT || "8080");
export const HTTP_PORT = parseInt(env.HTTP_PORT || "8081");

export const USE_TLS = Boolean(env.USE_TLS || false);

export const LOG_LEVEL = env.LOG_LEVEL || "error";

export const SENTRY_DSN = env.SENTRY_DSN || "";
export const USING_SENTRY = SENTRY_DSN != "";

export const TRACE_EXPORT_ENDPOINT = env.TRACE_EXPORT_ENDPOINT || "";
export const USING_TRACING = Boolean(env.TRACE_EXPORT_ENDPOINT);

export const GRPC_SERVER_REFLECTION_PATH =
  env.GRPC_SERVER_REFLECTION_PATH || "";
export const USING_GRPC_SERVER_REFLECTION = GRPC_SERVER_REFLECTION_PATH != "";

export const SUPERSET_URL =
  env.SUPERSET_URL || "https://dashboards.universe.com/";
export const SUPERSET_USERNAME = env.SUPERSET_USERNAME || "Universe";
export const SUPERSET_PASSWORD = env.SUPERSET_PASSWORD;

export const CLICKHOUSE_URL =
  env.CLICKHOUSE_URL ||
  "clickhouse-data-platform.data-platform:9000/highlander";
export const CLICKHOUSE_PASSWORD = env.CLICKHOUSE_PASSWORD || null;

export default {
  BUILD_TYPE,
  IS_DEV,
  GRPC_PORT,
  HTTP_PORT,
  USE_TLS,
  LOG_LEVEL,
  SENTRY_DSN,
  USING_SENTRY,
  CLICKHOUSE_URL,
  CLICKHOUSE_PASSWORD,
  DEV_USER_ID,
  TRACE_EXPORT_ENDPOINT,
  USING_TRACING,
  GRPC_SERVER_REFLECTION_PATH,
  USING_GRPC_SERVER_REFLECTION,
  SUPERSET_PASSWORD,
  SUPERSET_URL,
  SUPERSET_USERNAME,
};
