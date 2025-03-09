import mongoose, { Schema } from "mongoose"
import { Like } from "./like.model.js"
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
commentSchema.pre("deleteMany", async function (next) {
  const comment = this.getQuery().tweet.getQuery()._id
  console.log(comment)
  if (comment) {
    const result = await Like.deleteMany({
      comment: { $in: comment },
    })
    console.log("Comments hook triggered to delete likes\nResults:\n", result)
  }

  next()
})
export const Comment = new mongoose.model("Comment", commentSchema)
