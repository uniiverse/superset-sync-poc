import express from "express";
import { registry as niceGrpcRegistry } from "nice-grpc-prometheus";
import {
  register as globalRegistry,
  Registry,
  collectDefaultMetrics,
} from "prom-client";

import { createLogger, logExpressError } from "./logging.js";

const log = createLogger("http-server");

function createHttpServer() {
  const mergedRegister = Registry.merge([globalRegistry, niceGrpcRegistry]);
  collectDefaultMetrics({ register: mergedRegister });

  const server = express();

  server.get("/healthz", async (req, res) => {
    try {
      const healthcheck = {
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
      };

      res.send(healthcheck);
    } catch (ex) {
      logExpressError(log, req, ex);
      res.sendStatus(503);
    }
  });

  server.get("/healthz/ready", async (req, res) => {
    try {
      // NOTE: add any relevant pings to external dependencies
      res.send("OK");
    } catch (ex) {
      logExpressError(log, req, ex);
      res.sendStatus(503);
    }
  });

  server.get("/metrics", async (req, res) => {
    try {
      res.set("Content-Type", mergedRegister.contentType);
      res.end(await mergedRegister.metrics());
    } catch (ex) {
      logExpressError(log, req, ex);
      res.sendStatus(500);
    }
  });

  return server;
}

export default createHttpServer;
