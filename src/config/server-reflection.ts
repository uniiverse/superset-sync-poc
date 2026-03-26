import { Server } from "nice-grpc";
import {
  ServerReflectionService,
  ServerReflection,
} from "nice-grpc-server-reflection";

import * as fs from "fs";

import { createLogger } from "./logging.js";

import Config from "./index.js";

const log = createLogger("server-reflection");

export function addReflectionService(server: Server, serviceNames: string[]) {
  if (!Config.USING_GRPC_SERVER_REFLECTION) {
    log.info("Server reflection has not been configured for this project.");
    return;
  }

  server.add(
    ServerReflectionService,
    ServerReflection(
      fs.readFileSync(Config.GRPC_SERVER_REFLECTION_PATH),
      serviceNames
    )
  );
}

export default addReflectionService;
