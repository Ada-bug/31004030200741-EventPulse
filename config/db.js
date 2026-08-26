const mongoose = require("mongoose");
const appConfig = require("./appConfig");

let connectionPromise = null;

const connectDB = async () => {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // A connection attempt is already in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  if (!appConfig.mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  connectionPromise = mongoose.connect(appConfig.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await connectionPromise;
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

module.exports = connectDB;