import { ServerCredentials } from "@grpc/grpc-js";

import { readFileSync } from "fs";
import { env } from "process";

import { createLogger } from "./logging.js";

import Config from "./index.js";

const log = createLogger("tls");

export let serverCredentials: ServerCredentials;

if (Config.USE_TLS) {
  const CA_CERT_PATH = String(env.CA_CERT_PATH);
  const CERT_PATH = String(env.CERT_PATH);
  const KEY_PATH = String(env.KEY_PATH);

  log.info({
    msg: "Configuring to use TLS",
    config: {
      CA_CERT_PATH,
      CERT_PATH,
      KEY_PATH,
    },
  });

  const CA_CERT = readFileSync(CA_CERT_PATH);
  const CERT_KEY_PAIR = {
    cert_chain: readFileSync(CERT_PATH),
    private_key: readFileSync(KEY_PATH),
  };
  const CHECK_CLIENT_CERT = false;

  serverCredentials = ServerCredentials.createSsl(
    CA_CERT,
    [CERT_KEY_PAIR],
    CHECK_CLIENT_CERT,
  );
} else {
  log.info("TLS has not been configured for this project.");
}
