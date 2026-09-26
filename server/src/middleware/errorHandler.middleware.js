const ApiError = require("../utils/ApiError.js");
const env = require("../config/env.js");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let details = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  const responsePayload = {
    success: false,
    message,
    ...(details && { details }),
  };

  if (env.NODE_ENV !== "production") {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

module.exports = errorHandler;
