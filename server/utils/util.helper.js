const path = require("node:path");
const { createHash, randomBytes } = require("crypto");
const { EventEmitter } = require("events");

const emitter = new EventEmitter();
const hash = (data) => createHash("sha256").update(data).digest("hex");
const genId = (bits = 32) => randomBytes(bits).toString("hex");
const getDpPath = (filename) =>
  path.join(require.main.path, "public", "images", "user", filename);

module.exports = { emitter, hash, genId, getDpPath };
