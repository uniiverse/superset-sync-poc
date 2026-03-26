import { CallContext, ServerError, ServerMiddlewareCall } from "nice-grpc";

import Config from "../config/index.js";
import Sentry from "../config/sentry.js";

export default async function* exceptionMiddleware<Request, Response>(
  call: ServerMiddlewareCall<Request, Response>,
  context: CallContext,
) {
  try {
    return yield* call.next(call.request, context);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Skip gRPC ServerErrors, which are user-facing interpretations of underlying errors.
    if (Config.USING_SENTRY && !(error instanceof ServerError)) {
      Sentry.captureException(error);
    }

    throw error;
  }
}
