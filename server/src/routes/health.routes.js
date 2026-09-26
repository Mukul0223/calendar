const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");
const router = require("express").Router();

router.get(
  "/health",
  asyncHandler((req, res) => {
    res
      .status(200)
      .json(new ApiResponse(200, { status: "ok" }, "Server is healthy"));
  }),
);

module.exports = router;
