import { Reports } from "@universe/api";
import { CallContext, ServerError, Status } from "nice-grpc";

import { CurrentUser } from "./common/current-user.js";
import { validateAndBuildClause } from "./common/filter-helpers.js";
import { SupersetClient } from "./common/superset-client.js";
import { DashboardsConfigMap } from "./config/dashboards-config-map.js";
import log, { debugLogGrpcRequest } from "./config/logging.js";

const supersetClient = new SupersetClient();
const dashboardsConfigMap = new DashboardsConfigMap();

export class ReportsService implements Reports.ReportsServiceImplementation {
  async getDashboard(
    request: Reports.GetDashboardRequest,
    context: CallContext,
  ): Promise<{ dashboardEmbeddableId?: string | undefined }> {
    debugLogGrpcRequest(log, "GetDashboard", context);

    const dashboardConfig = dashboardsConfigMap.getDashboardLocaleConfig(
      request.dashboardId,
      request.locale,
      true,
    );

    if (!dashboardConfig) {
      throw new ServerError(Status.INVALID_ARGUMENT, "Invalid dashboardId.");
    }

    const resp = Reports.GetDashboardResponse.create();
    resp.dashboardEmbeddableId = dashboardConfig.embeddableUUID;
    return Promise.resolve(resp);
  }

  async createGuestToken(
    request: Reports.CreateGuestTokenRequest,
    context: CallContext,
  ): Promise<Reports.CreateGuestTokenResponse> {
    debugLogGrpcRequest(log, "CreateGuestToken", context);

    const currentUser = new CurrentUser(context);
    if (!currentUser.id) {
      log.error("User is not logged in.");
    }

    // TODO: Perform server-side validation of the user's dashboard permission.

    const dashboardEmbeddableId = dashboardsConfigMap.getDashboardLocaleConfig(
      request.dashboardId,
      request.locale,
      true,
    )?.embeddableUUID;

    if (!dashboardEmbeddableId) {
      throw new ServerError(
        Status.INVALID_ARGUMENT,
        `Invalid dashboardId '${request.dashboardId}'.`,
      );
    }

    const clause = validateAndBuildClause(request);

    const guestToken = await supersetClient.guestToken(
      dashboardEmbeddableId,
      currentUser.firstName || "unknown",
      currentUser.lastName || "unknown",
      currentUser.email || "unknown",
      clause,
    );

    if (!guestToken) {
      throw new ServerError(Status.INTERNAL, "Failed to get guest token.");
    }

    const resp = Reports.CreateGuestTokenResponse.create();
    resp.token = guestToken;

    return Promise.resolve(resp);
  }
}

export default ReportsService;
