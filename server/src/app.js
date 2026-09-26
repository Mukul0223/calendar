const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const env = require("./config/env.js");

const notFound = require("./middleware/notFound.middleware.js");
const errorHandler = require("./middleware/errorHandler.middleware.js");

const healthRouter = require("./routes/health.routes.js");
const timeRouter = require("./routes/time.routes.js");
const authRoutes = require("./routes/auth.routes.js");

const app = express();

let corsOptions = {
  origin: env.CLIENT_ORIGIN,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api", healthRouter);
app.use("/api", timeRouter);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
