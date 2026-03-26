import { CallContext, ServerMiddlewareCall } from "nice-grpc";

import { createLogger, logGrpcError } from "../config/logging.js";

const log = createLogger("grpc-server");

const NS_PER_SEC = 1e9;
const NS_TO_MS = 1e6;

const HEALTH_CHECK_PATH = "/grpc.health.v1.Health/Check";

export default async function* loggingMiddleware<Request, Response>(
  call: ServerMiddlewareCall<Request, Response>,
  context: CallContext,
) {
  const { path } = call.method;

  if (path == HEALTH_CHECK_PATH) {
    return yield* call.next(call.request, context);
  }

  const startAt = process.hrtime();

  try {
    const result = yield* call.next(call.request, context);
    const diff = process.hrtime(startAt);
    const time = (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;

    log.info({ duration: time.toFixed(3), path });

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logGrpcError(log, path, error);
    throw error;
  }
}
