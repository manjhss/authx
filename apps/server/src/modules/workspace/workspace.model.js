import mongoose from "mongoose"

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
    },
    slug: {
      type: String,
      required: [true, "Workspace slug is required"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
)

export const workspaceModel = mongoose.model("workspaces", workspaceSchema)
