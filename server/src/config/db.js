const mongoose = require("mongoose");
const env = require("./env.js");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, { family: 4 });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Database connection error", err);
    process.exit(1);
  }
};

module.exports = connectDB;
