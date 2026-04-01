import "dotenv/config"

const config = {
  port: process.env.PORT || 4000,
  mongoDbUri: process.env.MONGO_DB_URI,
}

export default config
