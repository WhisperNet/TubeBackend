import mongoose, { Schema } from "mongoose"

const tweetSchema = new Schema(
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
  },
  { timestamps: true }
)
export const Tweet = new mongoose.model("Tweet", tweetSchema)
