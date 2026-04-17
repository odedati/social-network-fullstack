const crypto = require("crypto");

const TOKEN_DURATION_MS = 24 * 60 * 60 * 1000;

function secret() {
  return process.env.COOKIE_SECRET || "template";
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function sign(payload) {
  return crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
}

function createSessionToken(userId) {
  const payload = encode({
    user_id: userId,
    exp: Date.now() + TOKEN_DURATION_MS,
  });
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature || signature !== sign(payload)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.user_id || !data.exp || data.exp < Date.now()) {
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}

function tokenFromRequest(req) {
  const header = req.get("authorization") || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return req.get("x-session-token");
}

function userIdFromRequest(req) {
  const data = verifySessionToken(tokenFromRequest(req));
  return data && data.user_id;
}

module.exports = {
  createSessionToken,
  userIdFromRequest,
  verifySessionToken,
};
