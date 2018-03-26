"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Starts express, caches and deletes socket references. Does not close the sockets themselves!
 * This is done by the consumer of this function in this case the watchServerChanges function.
 * Returns the httpServer object and all sockets in a Map.
 * @param serverBundlePath Path to the server bundle file where the express server was started by calling .listen().
 * @returns {{httpServer: *, sockets: Map}} when server bundle has no errors. Returns null when server bundle contains errors.
 */
var initHttpServer = function initHttpServer(serverBundlePath) {
  var httpServer;

  try {
    httpServer = require(serverBundlePath); //eslint-disable-line
  } catch (e) {
    console.log(e);
    return null;
  }

  var sockets = new Map();
  var nextSocketId = 0; // Inspired by Golo Roden's answer in:
  // http://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately

  httpServer.on('connection', function (socket) {
    var socketId = nextSocketId++;
    sockets.set(socketId, socket);
    socket.on('close', function () {
      sockets.delete(socketId);
    });
  });
  return {
    httpServer: httpServer,
    sockets: sockets
  };
};

var _default = initHttpServer;
exports.default = _default;