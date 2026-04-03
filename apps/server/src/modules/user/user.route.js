import { Router } from "express"
import {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
} from "./user.controller.js"

const userRouter = Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/me", getMe)
userRouter.get("/refresh", refreshToken)

export default userRouter
