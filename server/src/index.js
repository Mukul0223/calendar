const app = require("./app.js");
const connectDB = require("./config/db.js");
const env = require("./config/env.js");

const PORT = env.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};

startServer();
