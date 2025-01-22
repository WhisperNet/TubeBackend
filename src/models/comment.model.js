import mongoose, { Schema } from "mongoose"

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    creatorname: {
      type: String,
      required: true,
    },
    tweet: {
      type: mongoose.Types.ObjectId,
      ref: "Tweet",
    },
    video: {
      type: mongoose.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
)

export const Comment = new mongoose.model("Comment", commentSchema)
