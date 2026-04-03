import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
    refresh_token_hash: {
      type: String,
      required: [true, "Refresh token hash is required"],
    },
    is_revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const sessionModel = mongoose.model("sessions", sessionSchema)
