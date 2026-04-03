import mongoose from "mongoose"
import config from "./config.js"

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoDbUri, {
      dbName: config.environment,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}
