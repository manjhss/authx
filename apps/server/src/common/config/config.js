import "dotenv/config"

const config = {
  port: process.env.PORT || 4000,
  mongoDbUri: process.env.MONGO_DB_URI,
  systemInstanceId: process.env.SYSTEM_INSTANCE_ID,
  environment: process.env.ENVIRONMENT,
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION || "15m",
  jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d",
}

export default config
