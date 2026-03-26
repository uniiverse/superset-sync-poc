import axios, { AxiosRequestHeaders, ResponseType, AxiosResponse } from "axios";
import FormData from "form-data";
import { ServerError, Status } from "nice-grpc";
import * as Superset from "superset-openapi";

import fs from "fs";

import { logAxiosError } from "./log-helpers.js";

import Config from "../config/index.js";
import log from "../config/logging.js";

const configuration = new Superset.Configuration();
configuration.basePath = Config.SUPERSET_URL;

const embeddedApi = new Superset.EmbeddedDashboardApi(configuration);
const securityApi = new Superset.SecurityApi(configuration);

const CSRF_SESSION_COOKIE_NAME = "session";

export class SupersetClient {
  private csrfSessionCookie: string | undefined;
  private csrfToken: string | undefined;
  private accessToken: string | undefined;

  public async login(): Promise<void> {
    const loginRequest = {
      password: Config.SUPERSET_PASSWORD,
      username: Config.SUPERSET_USERNAME,
      provider: Superset.SecurityLoginBodyProviderEnum.Db,
      refresh: true,
    };

    try {
      const res = await securityApi.apiV1SecurityLoginPost(loginRequest);
      const data = res.data as any;
      this.accessToken = data["access_token"];

      log.info("Superset login successful.");
    } catch (error) {
      logAxiosError(
        log,
        "SupersetClient.apiV1SecurityLoginPost failed to get an access token.",
        error,
      );

      throw new ServerError(Status.UNAUTHENTICATED, "Authentication failed.");
    }
  }

  public async refreshCsrfToken(): Promise<void> {
    // Only attempt to update the CSRF token if authenticated.
    if (!this.accessToken) {
      return;
    }

    let retries = 0;
    const MAX_RETRIES = 3;

    while (retries < MAX_RETRIES) {
      retries++;

      try {
        const res = await securityApi.apiV1SecurityCsrfTokenGet(
          this.getRequestOptions(false),
        );

        // Store the CSRF token.
        const data = res.data as any;
        this.csrfToken = data["result"];

        // Superset requires a CSRF session cookie be sent with every request. Requests via axios don't handle
        // cookies in a jar by default, so extract the cookie to add it manually on future requests.
        const headers = res.headers as any;
        this.csrfSessionCookie = (headers["set-cookie"] as string[])
          .find((cookie) => cookie.includes(CSRF_SESSION_COOKIE_NAME))
          ?.match(new RegExp(`^${CSRF_SESSION_COOKIE_NAME}=(.+?);`))?.[1];

        log.info(
          `Got Superset CSRF token successfully: ${this.csrfSessionCookie}`,
        );

        return;
      } catch (error) {
        logAxiosError(
          log,
          "SupersetClient.apiV1SecurityCsrfTokenGet failed to get a CSRF token.",
          error,
        );

        if (retries >= MAX_RETRIES) {
          this.accessToken = undefined;
          this.csrfToken = undefined;

          throw new ServerError(
            Status.UNAUTHENTICATED,
            "Failed to get CSRF token.",
          );
        }
      }
    }
  }

  public async guestToken(
    dashboardId: string,
    firstName: string | undefined,
    lastName: string | undefined,
    username: string | undefined,
    clause: string,
  ) {
    let retries = 0;
    const MAX_RETRIES = 3;

    const resource: Superset.Resource = {
      id: dashboardId,
      type: "dashboard",
    };
    const resources: Superset.Resource[] = [resource];

    const rls: Superset.RlsRule[] = clause ? [{ clause: clause }] : [];

    const user = {
      firstName: firstName,
      lastName: lastName,
      username: username,
    };

    const body = {
      resources: resources,
      rls: rls,
      user: user,
    };

    while (retries < MAX_RETRIES) {
      retries++;

      if (!(await this.loginIfNeeded())) {
        continue;
      }

      try {
        const res = await securityApi.apiV1SecurityGuestTokenPost(
          body,
          this.getRequestOptions(),
        );
        const token = res.data.token;

        // TODO: is there a nicer way of doing this where it recognizes that token is not undefined
        if (!token) {
          throw new Error();
        }

        return token;
      } catch (error: any) {
        this.handleError("guestToken", "Failed to get guest token.", error);
      }
    }
  }

  public async exportAssets(filePath: string) {
    if (!(await this.loginIfNeeded())) {
      return;
    }

    const options = {
      ...this.getRequestOptions(),
      responseType: "arraybuffer" as ResponseType,
    };

    await axios.default
      .get(`${configuration.basePath}/api/v1/assets/export/`, options)
      .then((res: AxiosResponse) => {
        const buffer = res.data as DataView;

        try {
          fs.writeFileSync(filePath, buffer);
          log.info(`Export assets successful: ${filePath}.`);
        } catch (err) {
          log.error(`Failed to write assets ZIP file.\n\tError: ${err}`);
        }
      })
      .catch((err: any) => {
        this.handleError("exportAssets", "Failed to export assets.", err);
      });
  }

  public async importAssets(filePath: string, passwords: string | null) {
    if (!(await this.loginIfNeeded())) {
      return;
    }

    const form = new FormData();

    // Must be "bundle".
    form.append("bundle", fs.createReadStream(filePath), {
      filename: "dashboards.zip",
      contentType: "application/zip",
    });

    // Append "passwords", if provided.
    if (passwords) {
      form.append("passwords", passwords);
    }

    const options = this.getRequestOptions();
    options.headers = {
      ...options.headers,
      ...form.getHeaders(),
      Accept: "application/json",
    };

    await axios.default
      .post(`${configuration.basePath}/api/v1/assets/import/`, form, options)
      .then(() => {
        log.info("Import assets successful.");
      })
      .catch((err: any) => {
        this.handleError("importAssets", "Failed to import assets.", err);
      });
  }

  public async createEmbedConfig(dashboardId: string) {
    if (!(await this.loginIfNeeded())) {
      return;
    }

    const options = this.getRequestOptions();

    // Create a new embedded config.
    const res = await axios.default
      .post(
        `${configuration.basePath}/api/v1/dashboard/${dashboardId}/`,
        null,
        options,
      )
      .then(() => {
        log.info("Create embed config successful.");
      })
      .catch((err: any) => {
        this.handleError(
          "createEmbedConfig",
          "Failed to create embed config.",
          err,
        );
      });

    // TODO: Do the thing.
    return res;
  }

  public async getOrCreateEmbedConfig(dashboardId: string) {
    if (!(await this.loginIfNeeded())) {
      return;
    }

    try {
      // Make the get request. If it fails, make the post request.
      const res = await embeddedApi.apiV1EmbeddedDashboardUuidGet(dashboardId);
      return res.data.result?.uuid;
    } catch (error: any) {
      if (error.status == 404) {
        return await this.createEmbedConfig(dashboardId);
      }

      this.handleError(
        "getOrCreateEmbedConfig",
        "Failed to get or create the embed config.",
        error,
      );
    }
  }

  private handleError(call: string, message: string, error: any) {
    logAxiosError(log, `SupersetClient.${call}: ${message}.`, error);

    if (error?.response?.status == 401) {
      // Clear all tokens and force a re-login.
      this.accessToken = undefined;
      this.csrfToken = undefined;
    } else {
      // Otherwise, throw the error.
      throw new ServerError(Status.INTERNAL, message);
    }
  }

  // Includes authorization headers.
  private getRequestOptions(includeCSRF = true) {
    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    if (includeCSRF) {
      headers["X-CSRFToken"] = `${this.csrfToken}`;
      headers["Cookie"] = `session=${this.csrfSessionCookie}`;
    }

    return {
      withCredentials: true,
      headers: headers,
    };
  }

  // Both an access token and CSRF token are required to make requests against superset.
  private async loginIfNeeded() {
    if (!this.accessToken) {
      await this.login();
    }
    if (!this.csrfToken) {
      await this.refreshCsrfToken();
    }
    return this.accessToken && this.csrfToken;
  }
}
