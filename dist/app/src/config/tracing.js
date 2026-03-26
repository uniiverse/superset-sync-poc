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
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import process from "process";
import { createLogger } from "./logging.js";
import Config from "./index.js";
var log = createLogger("tracing");
export function registerTracing() {
    if (!Config.USING_TRACING) {
        log.info("Tracing disabled.");
        return;
    }
    var traceExporter = new OTLPTraceExporter({
        url: Config.TRACE_EXPORT_ENDPOINT
    });
    var sdk = new NodeSDK({
        resource: new Resource(_define_property({}, SemanticResourceAttributes.SERVICE_NAME, "reports")),
        traceExporter: traceExporter,
        instrumentations: [
            getNodeAutoInstrumentations()
        ]
    });
    sdk.start();
    process.on("SIGTERM", function() {
        sdk.shutdown().then(function() {
            return log.info("Shutting down tracing...");
        }).catch(function(error) {
            return log.error("Error terminating tracing: %o", error);
        });
    });
}
