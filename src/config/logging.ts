import { isAbortError } from "abort-controller-x";
import { Request } from "express";
import { ServerError, CallContext, Status } from "nice-grpc";
import pino from "pino";

import Config from "./index.js";

export function createLogger(name?: string) {
  const logger = pino.default({ name });
  logger.level = Config.LOG_LEVEL;
  return logger;
}

export default createLogger();

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function logGrpcError(logger: pino.Logger, path: string, error: any) {
  if (error instanceof ServerError) {
    logger.error(`
      GRPC: ${path}
      STATUS: ${Status[error.code]}
      ERROR: ${error.details}
      `);
  } else if (isAbortError(error)) {
    logger.info(`GRPC: ${path} cancelled.`);
  } else {
    logger.error(`
      GRPC: ${path}
      ERROR: ${error?.stack}`);
  }
}

export function debugLogGrpcRequest(
  logger: pino.Logger,
  request: string,
  context: CallContext,
) {
  // Skip for production builds (until sensitive data is stripped).
  if (!Config.IS_DEV) {
    return;
  }

  let metadata = "";
  for (const key of context.metadata) {
    metadata += `[key: ${key[0]}, value: ${key[1]}] `;
  }

  logger.debug(`REQUEST: ${request}, METADATA: ${metadata}`);
}

export function logExpressError(logger: pino.Logger, req: Request, error: any) {
  if (isAbortError(error)) {
    logger.info(`${req.method}: ${req.path} cancelled.`);
  } else {
    logger.error(`
      ${req.method}: ${req.path}
      ERROR: ${error?.stack}`);
  }
}

export function debugLogExpressRequest(logger: pino.Logger, req: Request) {
  // Skip for production builds (until sensitive data is stripped).
  if (!Config.IS_DEV) {
    return;
  }

  logger.debug(`HTTP: ${req.method} ${req.url}`);
}

export function debugLogConfig(logger: pino.Logger) {
  // Skip for production builds (until sensitive data is stripped).
  if (!Config.IS_DEV) {
    return;
  }

  logger.debug(`CONFIG:
    ${JSON.stringify(Config, null, 2)}`);
}
