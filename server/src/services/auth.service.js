const env = require("../config/env.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const RefreshToken = require("../models/refreshToken.model.js");
const ApiError = require("../utils/ApiError.js");
const {
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  setRefreshCookie,
  hashToken,
  rotateRefreshToken,
} = require("../utils/tokens.js");

const register = async (name, email, password) => {
  const emailExists = await User.exists({ email });
  if (emailExists) {
    throw new ApiError(409, "Email is already registered");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  const token = signAccessToken(newUser.id);

  return { user: newUser, token };
};

// FIXED: Added req and res to the parameter list
const login = async (email, password, req, res) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const validatePassword = await bcrypt.compare(password, user.password);

  if (!validatePassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signAccessToken(user.id);

  const jti = createJti();
  const refreshToken = signRefreshToken(user.id, jti);

  await persistRefreshToken({
    userId: user.id,
    refreshToken,
    jti,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });

  setRefreshCookie(res, refreshToken);

  return { user, token };
};

const refresh = async (token, req, res) => {
  const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET);

  const tokenHash = hashToken(token);
  const doc = await RefreshToken.findOne({
    token: tokenHash,
    jti: decoded.jti,
  }).populate("userId");

  if (!doc) {
    throw new ApiError(401, "Refresh token not recognized");
  }
  if (doc.revokedAt) {
    throw new ApiError(401, "Refresh token revoked");
  }
  if (doc.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token expired");
  }

  return await rotateRefreshToken(doc, doc.userId, req, res);
};

const logout = async (token) => {
  const tokenHash = hashToken(token);
  const doc = await RefreshToken.findOne({ token: tokenHash });
  if (doc && !doc.revokedAt) {
    doc.revokedAt = new Date();
    await doc.save();
  }
};

module.exports = { register, login, refresh, logout };
