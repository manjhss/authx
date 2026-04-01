import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
    },
    password_hash: {
      type: String,
      required: [true, "Password is required"],
    },
    instance_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instances",
			required: [true, "Instance ID is required"],
    },
  },
  {
    timestamps: true,
  }
)

export const userModel = mongoose.model("users", userSchema)
