import "dotenv/config"

const config = {
  port: process.env.PORT || 4000,
  mongoDbUri: process.env.MONGO_DB_URI,
  systemInstanceId: process.env.SYSTEM_INSTANCE_ID,
  environment: process.env.ENVIRONMENT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || "15m",
}

export default config
