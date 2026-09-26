const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const env = require("../config/env.js");
const RefreshToken = require("../models/refreshToken.model.js");

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const createJti = () => {
  return crypto.randomBytes(16).toString("hex");
};

const signAccessToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const signRefreshToken = (userId, jti) => {
  const token = jwt.sign({ id: userId, jti }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });
  return token;
};

const persistRefreshToken = async ({
  userId,
  refreshToken,
  jti,
  ip,
  userAgent,
}) => {
  const token = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN * 1000);
  await RefreshToken.create({ userId, token, jti, expiresAt, ip, userAgent });
};

const setRefreshCookie = (res, refreshToken) => {
  const isProd = env.NODE_ENV === "production";
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: env.REFRESH_TOKEN_EXPIRES_IN * 1000,
  });
};

const rotateRefreshToken = async (oldDoc, userId, req, res) => {
  // Revoke old refreshToken and save changes
  const newJti = createJti();
  oldDoc.revokedAt = new Date();
  oldDoc.replacedBy = newJti;
  await oldDoc.save();

  // Issue new refreshToken
  const newAccess = signAccessToken(userId);
  const newRefresh = signRefreshToken(userId, newJti);

  await persistRefreshToken({
    userId,
    refreshToken: newRefresh,
    jti: newJti,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });

  setRefreshCookie(res, newRefresh);
  return { accessToken: newAccess };
};

const revokeAllUserTokens = async (userId) => {
  await RefreshToken.updateMany(
    { userId, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
};

module.exports = {
  hashToken,
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  setRefreshCookie,
  rotateRefreshToken,
  revokeAllUserTokens,
};
