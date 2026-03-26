import { CallContext } from "nice-grpc";
import pino from "pino";

import Config from "../config/index.js";

export function logAxiosError(
  logger: pino.Logger,
  message: string,
  error: any,
) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx.
    logger.error(`
    ${message}
    RESPONSE: ${JSON.stringify(error.response.data)}
    ERROR: ${JSON.stringify(error.toJSON())}
    `);
  } else if (error.request) {
    // The request was made but no response was received `error.request`
    // is an instance of XMLHttpRequest in the browser and an instance
    // of http.ClientRequest in node.js.
    logger.error(`
    NO RESPONSE: ${message}
    ERROR: ${JSON.stringify(error.toJSON())}
    `);
  } else {
    // Something happened in setting up the request that triggered an Error.
    logger.error(`
    ${message}
    ERROR: ${error.message}
    `);
  }
}
