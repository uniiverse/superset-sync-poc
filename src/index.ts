import createGrpcServer from "./config/grpc-server.js";
import createHttpServer from "./config/http-server.js";
import Config from "./config/index.js";
import log, { debugLogConfig } from "./config/logging.js";
import { serverCredentials } from "./config/tls.js";
import { registerTracing } from "./config/tracing.js";
import initializeGrpcService from "./grpc-service.js";
import initializeHttpService from "./http-service.js";

(async () => {
  try {
    debugLogConfig(log);
    registerTracing();

    const httpServer = createHttpServer();
    initializeHttpService(httpServer);

    httpServer.listen(Config.HTTP_PORT);
    log.info(`HTTP server running at ${Config.HTTP_PORT}`);

    const grpcServer = createGrpcServer();
    initializeGrpcService(grpcServer);

    const port = await grpcServer.listen(
      `0.0.0.0:${Config.GRPC_PORT}`,
      serverCredentials,
    );
    log.info(`gRPC server running at 0.0.0.0:${port}`);
  } catch (error) {
    log.error("Failed to start the server: %o", error);
    process.exit(1);
  }
})();
