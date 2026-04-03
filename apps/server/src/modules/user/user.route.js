import { Router } from "express"
import { registerUser } from "./user.controller.js"

const userRouter = Router()

userRouter.post("/register", registerUser)

export default userRouter
