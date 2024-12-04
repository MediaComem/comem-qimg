#!/usr/bin/env node

import createDebugger from "debug";
import http from "http";
import app from "../app.js";
import { port } from "../lib/config.js";

const debug = createDebugger("qimg:server");

app.set("port", port);

const httpServer = http.createServer(app);
httpServer.on("error", onHttpServerError);
httpServer.on("listening", onHttpServerListening);
httpServer.listen(port);

function onHttpServerError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
};

function onHttpServerListening() {
  debug(`Listening on port ${port}`);
};
