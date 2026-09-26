const router = require("express").Router();
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

router.get(
  "/time",
  asyncHandler((req, res) => {
    const now = new Date();

    const timeDate = {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      iso: now.toISOString(),
      timestamp: now.getTime(),
    };

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          timeDate,
          "Current server time fetched successfully",
        ),
      );
  }),
);

module.exports = router;
