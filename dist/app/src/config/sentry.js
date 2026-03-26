import * as Sentry from "@sentry/node";
import { createLogger } from "./logging.js";
import Config from "./index.js";
var log = createLogger("sentry");
if (!Config.USING_SENTRY) {
    log.error("Sentry has not been configured for this project.");
} else {
    Sentry.init({
        dsn: Config.SENTRY_DSN,
        environment: Config.BUILD_TYPE
    });
}
export function raiseTestError() {
    Sentry.startSpan({
        name: "Test Sentry Span",
        op: "test"
    }, function() {
        Sentry.captureException(new Error("Manually Captured Test Error"));
        throw new Error("Uncaught Test Error");
    });
}
export default Sentry;
