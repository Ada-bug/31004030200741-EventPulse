require('dotenv').config();

const appConfig = {
  port:    parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV           || 'development',

  // Database
  mongoUri: process.env.MONGO_URI,

  // Auth
  jwtSecret:    process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Environment
  env: process.env.NODE_ENV || "development",
};

module.exports = appConfig;