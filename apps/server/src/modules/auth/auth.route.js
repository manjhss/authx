import { Router } from "express"
import {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  logoutUser,
  logoutUserAllSessions,
} from "./auth.controller.js"

const authRouter = Router()

authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.get("/me", getMe)
authRouter.get("/refresh", refreshToken)
authRouter.get("/logout", logoutUser)
authRouter.get("/logout-all", logoutUserAllSessions)

export default authRouter
