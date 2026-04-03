import { Router } from "express"
import {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  logoutUser,
} from "./user.controller.js"

const userRouter = Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/me", getMe)
userRouter.get("/refresh", refreshToken)
userRouter.get("/logout", logoutUser)

export default userRouter
