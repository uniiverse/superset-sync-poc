import { ChannelImplementation } from "@grpc/grpc-js/build/src/channel";
import {
  GetDashboardRequest,
  ReportsServiceDefinition,
} from "@universe/api/reports/v1/reports_service";
import { createChannel, createClient, Client, Server } from "nice-grpc";

import initializeServer from "../../src";

describe("ReportsService", () => {
  let serviceClient: Client<ReportsServiceDefinition>;
  let channel: ChannelImplementation;
  let server: Server;

  beforeAll(async () => {
    server = initializeServer();
    const servicePort = await server.listen("0.0.0.0:0");
    channel = createChannel(`0.0.0.0:${servicePort}`);

    serviceClient = createClient(ReportsServiceDefinition, channel);
  });

  afterAll(async () => {
    channel.close();
    await server.shutdown();
  });

  test("When requesting a dashboard ID", async () => {
    const req = GetDashboardRequest.create();
    req.dashboardId = "account_dashboard";
    req.locale = "en";

    const res = await serviceClient.getDashboard(req);

    // Production en embeddable UUID.
    expect(res.dashboardEmbeddableId).toBe(
      "61297d39-2ff7-45b6-b82e-a483dedcc323",
    );
  });

  // TODO:
  // 1. Move superset API objects onto a singleton container object.
  // 2. Mock superset req functions.
  // 3. Create guest token tests.
});
