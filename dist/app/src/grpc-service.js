import { Reports } from "@universe/api";
import log from "./config/logging.js";
import addReflectionService from "./config/server-reflection.js";
import ReportsService from "./reports-service.js";
function initializeGrpcService(server) {
    var serviceNames = [
        Reports.ReportsServiceDefinition.fullName
    ];
    addReflectionService(server, serviceNames);
    server.add(Reports.ReportsServiceDefinition, new ReportsService());
    log.info("gRPC service initialized. SUP.");
    return server;
}
export default initializeGrpcService;
