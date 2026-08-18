// logically, i need to add the db file, so i put it in the config folder

const mongoose = require("mongoose");
const appConfig = require("./appConfig");

const connectDB = async () => {
  try {
    await mongoose.connect(appConfig.mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

module.exports = connectDB;