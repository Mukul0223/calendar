const authService = require("../services/auth.service.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token } = await authService.register(name, email, password);

  res
    .status(200)
    .json(
      new ApiResponse(200, { user, token }, "User registered successfully"),
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login(email, password, req, res);

  res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    throw new ApiError(401, "No refresh token provided");
  }

  // Pass raw token, req, and res into the service
  const result = await authService.refresh(token, req, res);

  return res
    .status(200)
    .json(new ApiResponse(200, { accessToken: result.accessToken }, "success"));
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refresh_token;
  await authService.logout(token);

  res.clearCookie("refresh_token", { path: "/api/auth/refresh" });

  return res.status(200).json(new ApiResponse(200, {}, "Logged out"));
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, "User profile not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, decodedToken: req.user },
        "User profile retrieved successfully",
      ),
    );
});

module.exports = { register, login, refresh, logout, me };
