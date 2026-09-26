const ApiError = require("../utils/ApiError.js");

const notFound = (req, res, next) => {
  next(new ApiError(404, "Page not found"));
};

module.exports = notFound;
