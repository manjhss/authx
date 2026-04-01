import mongoose from "mongoose"

const appSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "App name is required"],
    },
    default_instance_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instances",
      required: [true, "Default instance ID is required"],
    },
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "workspaces",
      required: [true, "Workspace ID is required"],
    },
  },
  {
    timestamps: true,
  }
)

export const appModel = mongoose.model("apps", appSchema)
