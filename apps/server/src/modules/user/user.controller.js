import config from "../../common/config/config.js"
import { userModel } from "./user.modal.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Error registering user" })
    console.log("error", error.message)
  }
}

const loginUser = async (req, res) => {
  try {
    // parse data from request body
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

    // generate a JWT access token
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    )

    // return success response with user data or error message
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        email: existingUser.email,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" })
    console.log("error", error.message)
  }
}

export { registerUser, loginUser }
