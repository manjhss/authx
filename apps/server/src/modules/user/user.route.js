import { Router } from "express"
import { registerUser, loginUser, getCurrentUser } from "./user.controller.js"

const userRouter = Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/me", getCurrentUser)

export default userRouter
