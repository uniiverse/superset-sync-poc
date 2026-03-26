import { ChannelImplementation } from "@grpc/grpc-js/build/src/channel";
import { createClient, createChannel, Client, Server } from "nice-grpc";
import { HealthDefinition } from "nice-grpc-server-health";
import { HealthCheckResponse_ServingStatus } from "nice-grpc-server-health/lib/proto/grpc/health/v1/health";

import createGrpcServer from "../../src/config/grpc-server.js";
import Config from "../../src/config/index.js";
import initializeGrpcService from "../../src/grpc-service.js";

describe("HealthChecks", () => {
  let serviceClient: Client<HealthDefinition>;
  let channel: ChannelImplementation;
  let server: Server;

  beforeAll(async () => {
    server = createGrpcServer();
    initializeGrpcService(server);

    const servicePort = await server.listen(`0.0.0.0:${Config.GRPC_PORT}`);
    channel = createChannel(`0.0.0.0:${servicePort}`);

    serviceClient = createClient(HealthDefinition, channel);
  });

  afterAll(async () => {
    channel.close();
    await server.shutdown();
  });

  test("health check!", async () => {
    const req = { service: "" };
    const res = await serviceClient.check(req);

    expect(res.status).toBe(HealthCheckResponse_ServingStatus.SERVING);
  });
});
