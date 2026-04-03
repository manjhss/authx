import "dotenv/config"

const config = {
  port: process.env.PORT || 4000,
  mongoDbUri: process.env.MONGO_DB_URI,
  systemInstanceId: process.env.SYSTEM_INSTANCE_ID,
  environment: process.env.ENVIRONMENT,
}

export default config
