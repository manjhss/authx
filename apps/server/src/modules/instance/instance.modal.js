import mongoose from "mongoose"

const instanceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["system", "dev", "prod"],
      required: [true, "Instance type is required"],
    },
    app_id: {
      type: mongoose.Schema.Types.ObjectId || null,
      ref: "apps",
      required: [true, "App ID is required"],
    },
  },
  {
    timestamps: true,
  }
)

export const instanceModel = mongoose.model("instances", instanceSchema)
