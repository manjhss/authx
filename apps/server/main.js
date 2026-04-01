import app from "./src/app.js"
import config from "./src/common/config/config.js"
import { connectDB } from "./src/common/config/db-connect.js"

const PORT = config.port

const server = async () => {
	try {
		await connectDB()
		
	  app.listen(PORT, () => {
	    console.log(`Server is running on port ${PORT}`)
	  })
	} catch (error) {
		console.error("Error starting the server:", error)
		process.exit(1)
	}
}

server()
