import { Server, createServer } from "nice-grpc";
import { openTelemetryServerMiddleware } from "nice-grpc-opentelemetry";
import { prometheusServerMiddleware } from "nice-grpc-prometheus";
import { HealthDefinition, HealthServiceImpl } from "nice-grpc-server-health";

import exceptionMiddleware from "../middleware/exception.js";
import loggingMiddleware from "../middleware/logging.js";

function createGrpcServer(): Server {
  const server = createServer()
    .use(prometheusServerMiddleware())
    .use(openTelemetryServerMiddleware())
    .use(exceptionMiddleware)
    .use(loggingMiddleware);

  server.add(HealthDefinition, HealthServiceImpl());

  return server;
}

export default createGrpcServer;
