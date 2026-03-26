import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

import process from "process";

import { createLogger } from "./logging.js";

import Config from "./index.js";

const log = createLogger("tracing");

export function registerTracing() {
  if (!Config.USING_TRACING) {
    log.info("Tracing disabled.");
    return;
  }

  const traceExporter = new OTLPTraceExporter({
    url: Config.TRACE_EXPORT_ENDPOINT,
  });
  const sdk: NodeSDK = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        "reports",
    }),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  process.on("SIGTERM", () => {
    sdk
      .shutdown()
      .then(() => log.info("Shutting down tracing..."))
      .catch((error: Error) =>
        log.error("Error terminating tracing: %o", error),
      );
  });
}
