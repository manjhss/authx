import config from "../../common/config/config.js"
import { userModel } from "./user.modal.js"
import { sessionModel } from "./session.modal.js"
import { asyncHandler } from "../../common/utils/async-handler.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  // check if user already exists
  const existingUser = await userModel.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" })
  }

  // hash the password using crypto
  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex")

  // create a new user in the database
  const newUser = await userModel.create({
    first_name: firstName,
    last_name: lastName,
    email,
    password_hash: passwordHash,
    instance_id: config.systemInstanceId,
  })

  res.status(201).json({
    message: "User registered successfully",
    user: {
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
    },
  })
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  //  check if user exists
  const existingUser = await userModel.findOne({ email })
  if (!existingUser) {
    return res.status(400).json({ message: "Invalid email or password" })
  }

  // match the password
  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex")

  if (passwordHash !== existingUser.password_hash) {
    return res.status(400).json({ message: "Invalid email or password" })
  }

  // generate a JWT refresh token
  const refreshToken = jwt.sign(
    {
      userId: existingUser._id,
    },
    config.jwtSecret,
    { expiresIn: config.jwtRefreshTokenExpiration }
  )

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex")

  // create session in db
  await sessionModel.create({
    user_id: existingUser._id,
    refresh_token_hash: refreshTokenHash,
  })

  // generate a JWT access token
  const accessToken = jwt.sign(
    {
      userId: existingUser._id,
    },
    config.jwtSecret,
    { expiresIn: config.jwtAccessTokenExpiration }
  )

  // set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  // return success response with user data or error message
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      email: existingUser.email,
    },
    token: accessToken,
  })
})

const getMe = asyncHandler(async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1]
  if (!accessToken) {
    return res.status(401).json({ message: "Access token missing" })
  }

  // decode the access token
  const decoded = jwt.verify(accessToken, config.jwtSecret)

  // find the user by id
  const user = await userModel.findById(decoded.userId)
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  res.status(200).json({
    message: "Current user fetched successfully",
    user: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
  })
})

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" })
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex")

  // find the session with valid refresh token hash and not revoked
  const session = await sessionModel.findOne({
    refresh_token_hash: refreshTokenHash,
    is_revoked: false,
  })

  if (!session) {
    return res.status(401).json({ message: "Invalid refresh token" })
  }

  // generate new access token and refresh token
  const decoded = jwt.verify(refreshToken, config.jwtSecret)

  const newAccessToken = jwt.sign(
    {
      userId: decoded._id,
    },
    config.jwtSecret,
    { expiresIn: config.jwtAccessTokenExpiration }
  )

  const newRefreshToken = jwt.sign(
    {
      userId: decoded._id,
    },
    config.jwtSecret,
    { expiresIn: config.jwtRefreshTokenExpiration }
  )

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex")

  // update session with new refresh token hash
  session.refresh_token_hash = newRefreshTokenHash
  await session.save()

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  res.status(200).json({
    message: "Token refreshed successfully",
    token: newAccessToken,
  })
})

const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" })
  }

  // hash the refresh token
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex")

  // find the session with valid refresh token hash and not revoked
  const session = await sessionModel.findOne({
    refresh_token_hash: refreshTokenHash,
    is_revoked: false,
  })

  if (!session) {
    return res.status(401).json({ message: "Invalid refresh token" })
  }

  // revoke the session
  session.is_revoked = true
  await session.save()

  // clear the refresh token cookie
  res.clearCookie("refreshToken")

  res.status(200).json({ message: "User logged out successfully" })
})

const logoutUserAllSessions = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" })
  }

  // decode the refresh token
  const decoded = jwt.verify(refreshToken, config.jwtSecret)

  // revoke all sessions for the user
  await sessionModel.updateMany(
    { user_id: decoded.userId },
    { $set: { is_revoked: true } }
  )

  // clear the refresh token cookie
  res.clearCookie("refreshToken")

  res
    .status(200)
    .json({ message: "User logged out from all sessions successfully" })
})

export {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  logoutUser,
  logoutUserAllSessions,
}
